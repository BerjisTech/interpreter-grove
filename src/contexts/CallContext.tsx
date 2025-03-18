
import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, set, push, child, get, remove } from 'firebase/database';
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

  // Initialize media streams when joining a call
  useEffect(() => {
    if (roomId && isCallActive) {
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
      };
    }
  }, [roomId, isCallActive, currentUser]);
  
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
    };
  }, []);

  const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setLocalStream(stream);
      
      // Handle remote stream connection here in a real implementation
      // This would typically involve WebRTC connection setup
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera or microphone');
    }
  };

  // Create a new call room
  const createCall = async (creator: Omit<Participant, 'id'>): Promise<string> => {
    try {
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
      
      setRoomId(callId);
      setIsCallActive(true);
      setCurrentUser({ ...creator, id: participantId });
      
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
      // Check if call exists
      const callRef = ref(database, `calls/${callId}`);
      const snapshot = await get(callRef);
      
      if (!snapshot.exists()) {
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
      
      setRoomId(callId);
      setIsCallActive(true);
      setCurrentUser({ ...participant, id: participantId });
      
      toast.success(`Joined call as ${participant.role}`);
    } catch (error) {
      console.error('Error joining call:', error);
      toast.error('Failed to join call');
      throw error;
    }
  };

  // Leave the current call
  const leaveCall = async (): Promise<void> => {
    if (!roomId || !currentUser?.id) return;
    
    try {
      // Remove participant from the call
      await remove(ref(database, `calls/${roomId}/participants/${currentUser.id}`));
      
      // Check if there are any participants left
      const participantsRef = ref(database, `calls/${roomId}/participants`);
      const snapshot = await get(participantsRef);
      
      if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
        // No participants left, clean up the call
        await remove(ref(database, `calls/${roomId}`));
      }
      
      // Clean up local state
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      
      setRemoteStream(null);
      setRoomId(null);
      setIsCallActive(false);
      setCurrentUser(null);
      setParticipants([]);
      setMessages([]);
      
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
    toggleVideo
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
