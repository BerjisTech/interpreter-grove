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
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const signalingSenderRef = useRef<string | null>(null);
  const signalingSendingCompleteRef = useRef<boolean>(false);

  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    if (roomId && isCallActive) {
      console.log("Call is active, roomId:", roomId);
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
          
          if (participantList.length === 2 && !connectionEstablished && !isConnecting) {
            const otherParticipant = participantList.find(p => !p.isYou);
            if (otherParticipant && currentUser) {
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
      
      initializeLocalStream();
      
      return () => {
        unsubParticipants();
        unsubMessages();
        
        cleanupWebRTCConnection();
      };
    }
  }, [roomId, isCallActive, currentUser]);
  
  useEffect(() => {
    if (roomId && currentUser) {
      console.log("Setting up signaling channel for roomId:", roomId);
      const signalingRef = ref(database, `calls/${roomId}/signaling`);
      
      onValue(signalingRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        Object.entries(data).forEach(([key, value]) => {
          const signal = value as SignalingData;
          
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
      
      const signalRef = ref(database, `calls/${roomId}/signaling/${signalKey}`);
      remove(signalRef);
    } catch (error) {
      console.error("Error handling signaling message:", error);
    }
  };
  
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

  const setupWebRTCConnection = async (localParticipantId: string, remoteParticipantId: string) => {
    try {
      if (isConnecting || connectionEstablished) {
        console.log("Already connecting or connected, skipping setup");
        return;
      }
      
      setIsConnecting(true);
      console.log("Setting up WebRTC connection between", localParticipantId, "and", remoteParticipantId);
      
      if (peerConnectionRef.current) {
        cleanupWebRTCConnection();
      }
      
      if (!localStreamRef.current) {
        console.log("Waiting for local stream...");
        await initializeLocalStream();
      }
      
      peerConnectionRef.current = new RTCPeerConnection(rtcConfig);
      
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
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          if (localStreamRef.current && peerConnectionRef.current) {
            console.log("Adding local track to peer connection:", track.kind);
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          }
        });
      }
      
      const isInitiator = localParticipantId < remoteParticipantId;
      
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
      
      if (localStreamRef.current) {
        console.log("Local stream already exists");
        return localStreamRef.current;
      }
      
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

  const createCall = async (creator: Omit<Participant, 'id'>): Promise<string> => {
    try {
      console.log("Creating new call with creator:", creator);
      
      const callsRef = ref(database, 'calls');
      const newCallRef = push(callsRef);
      const callId = newCallRef.key as string;
      
      const participantsRef = ref(database, `calls/${callId}/participants`);
      const newParticipantRef = push(participantsRef);
      const participantId = newParticipantRef.key as string;
      
      await set(newParticipantRef, creator);
      
      await set(ref(database, `calls/${callId}/metadata`), {
        created: Date.now(),
        status: 'waiting',
        type: creator.role === 'interpreter' ? 'interpreter' : 'client'
      });
      
      onDisconnect(newParticipantRef).remove();
      
      setRoomId(callId);
      setIsCallActive(true);
      setCurrentUser({ ...creator, id: participantId });
      
      console.log("Call created with ID:", callId);
      
      const callEvent = new CustomEvent('callCreated', {
        detail: {
          roomId: callId,
          callerId: participantId,
          callerName: creator.name,
          callType: 'video'
        },
        bubbles: true
      });
      
      window.dispatchEvent(callEvent);
      
      return callId;
    } catch (error) {
      console.error('Error creating call:', error);
      toast.error('Failed to create call session');
      throw error;
    }
  };

  const joinCall = async (callId: string, participant: Omit<Participant, 'id'>): Promise<void> => {
    try {
      console.log("Joining call:", callId, "as", participant);
      
      const callRef = ref(database, `calls/${callId}`);
      const snapshot = await get(callRef);
      
      if (!snapshot.exists()) {
        console.error("Call not found:", callId);
        toast.error('Call not found');
        throw new Error('Call not found');
      }
      
      const participantsRef = ref(database, `calls/${callId}/participants`);
      const newParticipantRef = push(participantsRef);
      const participantId = newParticipantRef.key as string;
      
      await set(newParticipantRef, participant);
      
      await set(ref(database, `calls/${callId}/metadata/status`), 'active');
      
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

  const leaveCall = async (): Promise<void> => {
    if (!roomId || !currentUser?.id) {
      console.log("No active call to leave");
      return;
    }
    
    try {
      console.log("Leaving call:", roomId);
      
      cleanupWebRTCConnection();
      
      await remove(ref(database, `calls/${roomId}/participants/${currentUser.id}`));
      
      const participantsRef = ref(database, `calls/${roomId}/participants`);
      const snapshot = await get(participantsRef);
      
      if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
        await remove(ref(database, `calls/${roomId}`));
      }
      
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

  const toggleMic = () => {
    setIsMicOn(prev => !prev);
  };

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
