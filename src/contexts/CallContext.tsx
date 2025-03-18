
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, set, push, child, get, remove, onDisconnect, off } from 'firebase/database';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  isYou?: boolean;
  isInterpreter?: boolean;
}

// Interface for WebRTC signaling data
interface SignalingData {
  type: 'offer' | 'answer' | 'ice-candidate';
  sender: string;
  receiver?: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  timestamp: number;
}

interface CallContextType {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  joinCall: (roomId: string, participant: Omit<Participant, 'id'>) => Promise<void>;
  createCall: (creator: Omit<Participant, 'id'>) => Promise<string>;
  leaveCall: () => Promise<void>;
  isCallActive: boolean;
  participants: Participant[];
  messages: Message[];
  sendMessage: (text: string, sender: string) => Promise<void>;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMicOn: boolean;
  isVideoOn: boolean;
  toggleMic: () => void;
  toggleVideo: () => void;
  isConnecting: boolean;
  connectionEstablished: boolean;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionEstablished, setConnectionEstablished] = useState(false);
  
  // WebRTC peer connection
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const signalingSenderRef = useRef<string | null>(null);
  const signalingSendingCompleteRef = useRef<boolean>(false);

  // RTCPeerConnection configuration (includes free STUN servers)
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ]
  };

  // Initialize media streams when joining a call
  useEffect(() => {
    if (roomId && isCallActive) {
      console.log("Call is active, roomId:", roomId);
      // Setup listeners for participants and messages
      const participantsRef = ref(database, `calls/${roomId}/participants`);
      const messagesRef = ref(database, `calls/${roomId}/messages`);
      
      const unsubParticipants = onValue(participantsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const participantList = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<Participant, 'id'>),
            isYou: currentUser?.id === id
          }));
          setParticipants(participantList);
          console.log("Updated participants:", participantList);
          
          // If we have two participants, initiate WebRTC if not already started
          if (participantList.length === 2 && !connectionEstablished && !isConnecting) {
            const otherParticipant = participantList.find(p => !p.isYou);
            if (otherParticipant && currentUser) {
              // Initialize WebRTC connection
              setupWebRTCConnection(currentUser.id, otherParticipant.id);
            }
          }
        } else {
          setParticipants([]);
        }
      });
      
      const unsubMessages = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<Message, 'id'>)
          }));
          setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
        } else {
          setMessages([]);
        }
      });
      
      // Initialize local media stream
      initializeLocalStream();
      
      return () => {
        unsubParticipants();
        unsubMessages();
        
        // Clean up WebRTC connection
        cleanupWebRTCConnection();
      };
    }
  }, [roomId, isCallActive, currentUser]);
  
  // Setup WebRTC signaling listeners
  useEffect(() => {
    if (roomId && currentUser) {
      console.log("Setting up signaling channel for roomId:", roomId);
      const signalingRef = ref(database, `calls/${roomId}/signaling`);
      
      // Listen for signaling messages
      onValue(signalingRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        Object.entries(data).forEach(([key, value]) => {
          const signal = value as SignalingData;
          
          // Only process signals where we are the receiver or that are ICE candidates
          // for our existing peer connection after we've sent our offer/answer
          if ((signal.receiver === currentUser.id || 
              (signal.type === 'ice-candidate' && signalingSendingCompleteRef.current)) && 
              signal.sender !== currentUser.id) {
            
            console.log("Received signal:", signal.type, "from:", signal.sender);
            handleSignalingMessage(signal, key);
          }
        });
      });
      
      return () => {
        off(signalingRef);
      };
    }
  }, [roomId, currentUser]);
  
  // Function to handle incoming signaling messages
  const handleSignalingMessage = async (signal: SignalingData, signalKey: string) => {
    try {
      if (!peerConnectionRef.current) {
        console.log("Can't handle signal, no peer connection exists");
        return;
      }
      
      switch (signal.type) {
        case 'offer':
          if (!peerConnectionRef.current) return;
          console.log("Setting remote description from offer");
          
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal.sdp!));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          
          // Send the answer back
          await sendSignalingMessage({
            type: 'answer',
            sender: currentUser!.id,
            receiver: signal.sender,
            sdp: answer,
            timestamp: Date.now()
          });
          
          signalingSendingCompleteRef.current = true;
          break;
          
        case 'answer':
          if (!peerConnectionRef.current) return;
          console.log("Setting remote description from answer");
          
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal.sdp!));
          signalingSendingCompleteRef.current = true;
          break;
          
        case 'ice-candidate':
          if (!peerConnectionRef.current || !signal.candidate) return;
          console.log("Adding ICE candidate");
          
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } catch (e) {
            console.error("Error adding ICE candidate:", e);
          }
          break;
      }
      
      // Clean up the processed signal
      const signalRef = ref(database, `calls/${roomId}/signaling/${signalKey}`);
      remove(signalRef);
    } catch (error) {
      console.error("Error handling signaling message:", error);
    }
  };
  
  // Function to send signaling messages
  const sendSignalingMessage = async (signal: SignalingData) => {
    if (!roomId) return;
    
    try {
      const signalingRef = ref(database, `calls/${roomId}/signaling`);
      const newSignalRef = push(signalingRef);
      await set(newSignalRef, signal);
      
      console.log("Sent signaling message:", signal.type, "to:", signal.receiver);
    } catch (error) {
      console.error("Error sending signaling message:", error);
    }
  };

  // Function to setup WebRTC peer connection
  const setupWebRTCConnection = async (localParticipantId: string, remoteParticipantId: string) => {
    try {
      // Don't setup if already connecting or connected
      if (isConnecting || connectionEstablished) {
        console.log("Already connecting or connected, skipping setup");
        return;
      }
      
      setIsConnecting(true);
      console.log("Setting up WebRTC connection between", localParticipantId, "and", remoteParticipantId);
      
      if (peerConnectionRef.current) {
        cleanupWebRTCConnection();
      }
      
      // Wait for local stream to be ready
      if (!localStreamRef.current) {
        console.log("Waiting for local stream...");
        await initializeLocalStream();
      }
      
      // Create a new RTCPeerConnection
      peerConnectionRef.current = new RTCPeerConnection(rtcConfig);
      
      // Set up event handlers
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate");
          sendSignalingMessage({
            type: 'ice-candidate',
            sender: localParticipantId,
            receiver: remoteParticipantId,
            candidate: event.candidate.toJSON(),
            timestamp: Date.now()
          });
        }
      };
      
      peerConnectionRef.current.ontrack = (event) => {
        console.log("Received remote track", event.track.kind);
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
          setRemoteStream(remoteStreamRef.current);
        }
        remoteStreamRef.current.addTrack(event.track);
      };
      
      peerConnectionRef.current.onconnectionstatechange = () => {
        console.log("Connection state changed:", peerConnectionRef.current?.connectionState);
        if (peerConnectionRef.current?.connectionState === 'connected') {
          console.log("WebRTC connection established!");
          setConnectionEstablished(true);
          setIsConnecting(false);
          toast.success("Call connected");
        } else if (['failed', 'closed', 'disconnected'].includes(peerConnectionRef.current?.connectionState || '')) {
          console.log("WebRTC connection failed or closed");
          setConnectionEstablished(false);
          setIsConnecting(false);
        }
      };
      
      // Add local tracks to the connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          if (localStreamRef.current && peerConnectionRef.current) {
            console.log("Adding local track to peer connection:", track.kind);
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          }
        });
      }
      
      // Create and send offer (if we are the one initiating)
      const isInitiator = localParticipantId < remoteParticipantId; // Simple rule to decide who initiates
      
      if (isInitiator) {
        console.log("Creating and sending offer as initiator");
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        
        await sendSignalingMessage({
          type: 'offer',
          sender: localParticipantId,
          receiver: remoteParticipantId,
          sdp: offer,
          timestamp: Date.now()
        });
        
        signalingSenderRef.current = localParticipantId;
      } else {
        console.log("Waiting for offer as receiver");
        signalingSenderRef.current = remoteParticipantId;
      }
    } catch (error) {
      console.error("Error setting up WebRTC connection:", error);
      setIsConnecting(false);
      toast.error("Failed to establish call connection");
    }
  };

  // Cleanup WebRTC connection
  const cleanupWebRTCConnection = () => {
    if (peerConnectionRef.current) {
      console.log("Cleaning up WebRTC connection");
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setConnectionEstablished(false);
    setIsConnecting(false);
    
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
      setRemoteStream(null);
    }
    
    signalingSenderRef.current = null;
    signalingSendingCompleteRef.current = false;
  };

  // Effect to handle mic and video toggles
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMicOn;
      });
      
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
    }
  }, [isMicOn, isVideoOn, localStream]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      cleanupWebRTCConnection();
    };
  }, []);

  const initializeLocalStream = async () => {
    try {
      console.log("Initializing local media stream");
      
      // First check if we already have a stream
      if (localStreamRef.current) {
        console.log("Local stream already exists");
        return localStreamRef.current;
      }
      
      // Request user media with appropriate constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      console.log("Media stream obtained:", stream);
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera or microphone. Please check your permissions.');
      return null;
    }
  };

  // Create a new call room
  const createCall = async (creator: Omit<Participant, 'id'>): Promise<string> => {
    try {
      console.log("Creating new call with creator:", creator);
      
      const callsRef = ref(database, 'calls');
      const newCallRef = push(callsRef);
      const callId = newCallRef.key as string;
      
      const participantsRef = ref(database, `calls/${callId}/participants`);
      const newParticipantRef = push(participantsRef);
      const participantId = newParticipantRef.key as string;
      
      // Store the caller info
      await set(newParticipantRef, creator);
      
      // Set call metadata
      await set(ref(database, `calls/${callId}/metadata`), {
        created: Date.now(),
        status: 'waiting',
        type: creator.role === 'interpreter' ? 'interpreter' : 'client'
      });
      
      // Set cleanup on disconnect
      onDisconnect(newParticipantRef).remove();
      
      setRoomId(callId);
      setIsCallActive(true);
      setCurrentUser({ ...creator, id: participantId });
      
      console.log("Call created with ID:", callId);
      return callId;
    } catch (error) {
      console.error('Error creating call:', error);
      toast.error('Failed to create call session');
      throw error;
    }
  };

  // Join an existing call
  const joinCall = async (callId: string, participant: Omit<Participant, 'id'>): Promise<void> => {
    try {
      console.log("Joining call:", callId, "as", participant);
      
      // Check if call exists
      const callRef = ref(database, `calls/${callId}`);
      const snapshot = await get(callRef);
      
      if (!snapshot.exists()) {
        console.error("Call not found:", callId);
        toast.error('Call not found');
        throw new Error('Call not found');
      }
      
      // Add participant to the call
      const participantsRef = ref(database, `calls/${callId}/participants`);
      const newParticipantRef = push(participantsRef);
      const participantId = newParticipantRef.key as string;
      
      await set(newParticipantRef, participant);
      
      // Update call status
      await set(ref(database, `calls/${callId}/metadata/status`), 'active');
      
      // Set cleanup on disconnect
      onDisconnect(newParticipantRef).remove();
      
      setRoomId(callId);
      setIsCallActive(true);
      setCurrentUser({ ...participant, id: participantId });
      
      console.log("Successfully joined call:", callId);
      toast.success(`Joined call as ${participant.role}`);
    } catch (error) {
      console.error('Error joining call:', error);
      toast.error('Failed to join call');
      throw error;
    }
  };

  // Leave the current call
  const leaveCall = async (): Promise<void> => {
    if (!roomId || !currentUser?.id) {
      console.log("No active call to leave");
      return;
    }
    
    try {
      console.log("Leaving call:", roomId);
      
      // Clean up WebRTC connection first
      cleanupWebRTCConnection();
      
      // Remove participant from the call
      await remove(ref(database, `calls/${roomId}/participants/${currentUser.id}`));
      
      // Check if there are any participants left
      const participantsRef = ref(database, `calls/${roomId}/participants`);
      const snapshot = await get(participantsRef);
      
      if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
        // No participants left, clean up the call
        console.log("No participants left, removing call:", roomId);
        await remove(ref(database, `calls/${roomId}`));
      }
      
      // Clean up local state
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
        setLocalStream(null);
      }
      
      setRoomId(null);
      setIsCallActive(false);
      setCurrentUser(null);
      setParticipants([]);
      setMessages([]);
      
      console.log("Successfully left call");
      toast.success('Left the call');
    } catch (error) {
      console.error('Error leaving call:', error);
      toast.error('Error leaving call');
    }
  };

  // Send a message in the call
  const sendMessage = async (text: string, sender: string): Promise<void> => {
    if (!roomId) return;
    
    try {
      const messagesRef = ref(database, `calls/${roomId}/messages`);
      const newMessageRef = push(messagesRef);
      
      await set(newMessageRef, {
        sender,
        text,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    setIsMicOn(prev => !prev);
  };

  // Toggle video
  const toggleVideo = () => {
    setIsVideoOn(prev => !prev);
  };

  const value = {
    roomId,
    setRoomId,
    joinCall,
    createCall,
    leaveCall,
    isCallActive,
    participants,
    messages,
    sendMessage,
    localStream,
    remoteStream,
    isMicOn,
    isVideoOn,
    toggleMic,
    toggleVideo,
    isConnecting,
    connectionEstablished
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

