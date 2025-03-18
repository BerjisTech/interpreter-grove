
import { useState, useEffect } from 'react';
import { BellRing, PhoneCall, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMockUser } from '@/hooks/useMockUser';
import { playCallNotification } from '@/utils/soundUtils';
import { toast } from 'sonner';

interface CallData {
  roomId: string;
  callerId: string;
  callerName: string;
  timestamp: number;
  callType: 'video' | 'voice';
}

const InterpreterNotification = () => {
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const navigate = useNavigate();
  const { isMockUser, mockUserType } = useMockUser();
  
  // Check if user is Maria (interpreter)
  const isInterpreter = isMockUser && mockUserType === 'interpreter';
  
  useEffect(() => {
    // Only listen for calls if user is logged in as interpreter
    if (!isInterpreter) return;
    
    // For demo purposes, we'll listen to localStorage events to simulate real-time notifications
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'pendingCall') {
        try {
          const callData = JSON.parse(event.newValue || '');
          if (callData && callData.roomId) {
            notifyIncomingCall(callData);
          }
        } catch (error) {
          console.error('Error parsing incoming call data:', error);
        }
      }
    };
    
    // Check if there's already a pending call
    const existingCall = localStorage.getItem('pendingCall');
    if (existingCall) {
      try {
        const callData = JSON.parse(existingCall);
        if (callData && callData.roomId && Date.now() - callData.timestamp < 30000) { // within 30 seconds
          notifyIncomingCall(callData);
        } else {
          // Clear old pending calls
          localStorage.removeItem('pendingCall');
        }
      } catch (error) {
        console.error('Error parsing existing call data:', error);
      }
    }
    
    // Listen for storage events (across tabs)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isInterpreter, navigate]);
  
  // Function to handle new incoming calls
  const notifyIncomingCall = (callData: CallData) => {
    setIncomingCall(callData);
    setIsNotificationVisible(true);
    
    // Play sound notification
    playCallNotification();
    
    // Also show toast notification
    toast(`Incoming ${callData.callType} call from ${callData.callerName}`, {
      duration: 10000,
      action: {
        label: "Answer",
        onClick: () => answerCall(callData),
      },
    });
  };
  
  // Handle answering the call
  const answerCall = (call: CallData) => {
    setIsNotificationVisible(false);
    localStorage.removeItem('pendingCall');
    
    // Navigate to call page with roomId
    navigate(`/join/${call.roomId}`);
  };
  
  // Decline the call
  const declineCall = () => {
    setIsNotificationVisible(false);
    localStorage.removeItem('pendingCall');
    toast.success('Call declined');
  };
  
  // If not logged in as interpreter or no incoming call, don't render anything
  if (!isInterpreter || !isNotificationVisible || !incomingCall) {
    return null;
  }
  
  return (
    <div className="fixed top-20 right-4 z-50 w-80 bg-background/95 backdrop-blur-md rounded-lg border border-border shadow-lg p-4 animate-in fade-in slide-in-from-right-5">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center text-primary gap-2">
          <BellRing className="h-5 w-5 animate-pulse" />
          <h4 className="font-semibold">Incoming Call</h4>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={declineCall}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="py-2">
        <p className="text-sm mb-1">
          <span className="font-medium">{incomingCall.callerName}</span> is calling you
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          {incomingCall.callType === 'video' ? (
            <Video className="h-3.5 w-3.5" />
          ) : (
            <PhoneCall className="h-3.5 w-3.5" />
          )}
          <span>{incomingCall.callType === 'video' ? 'Video' : 'Voice'} call</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={declineCall}
        >
          Decline
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1" 
          onClick={() => answerCall(incomingCall)}
        >
          Answer Call
        </Button>
      </div>
    </div>
  );
};

export default InterpreterNotification;
