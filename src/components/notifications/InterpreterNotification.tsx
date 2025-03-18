
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
    
    console.log("InterpreterNotification: Interpreter is logged in, listening for calls");
    
    // Listen for custom incomingCall events from App.tsx
    const handleIncomingCallEvent = (event: CustomEvent<CallData>) => {
      console.log("InterpreterNotification: Received incomingCall event", event.detail);
      notifyIncomingCall(event.detail);
    };
    
    // Listen for storage events (for cross-tab functionality)
    const handleStorageChange = (event: StorageEvent) => {
      console.log("InterpreterNotification: Storage event", event.key, event.newValue);
      if (event.key === 'pendingCall' && event.newValue) {
        try {
          const callData = JSON.parse(event.newValue);
          if (callData && callData.roomId) {
            console.log("InterpreterNotification: Processing call from storage event", callData);
            notifyIncomingCall(callData);
          }
        } catch (error) {
          console.error('Error parsing incoming call data:', error);
        }
      }
    };
    
    // Check if there's already a pending call
    const checkExistingCall = () => {
      const existingCall = localStorage.getItem('pendingCall');
      console.log("InterpreterNotification: Checking for existing calls:", existingCall);
      if (existingCall) {
        try {
          const callData = JSON.parse(existingCall);
          if (callData && callData.roomId && Date.now() - callData.timestamp < 60000) { // within 60 seconds
            console.log("InterpreterNotification: Found recent pending call", callData);
            notifyIncomingCall(callData);
          } else {
            // Clear old pending calls
            console.log("InterpreterNotification: Clearing old pending call");
            localStorage.removeItem('pendingCall');
          }
        } catch (error) {
          console.error('Error parsing existing call data:', error);
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('incomingCall', handleIncomingCallEvent as EventListener);
    
    // Check for existing calls immediately and on interval
    checkExistingCall();
    const checkInterval = setInterval(checkExistingCall, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('incomingCall', handleIncomingCallEvent as EventListener);
      clearInterval(checkInterval);
    };
  }, [isInterpreter]);
  
  // Function to handle new incoming calls
  const notifyIncomingCall = (callData: CallData) => {
    console.log("InterpreterNotification: Notifying incoming call", callData);
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
    console.log("InterpreterNotification: Answering call", call);
    setIsNotificationVisible(false);
    localStorage.removeItem('pendingCall');
    
    // Navigate to call page with roomId
    navigate(`/join/${call.roomId}`);
  };
  
  // Decline the call
  const declineCall = () => {
    console.log("InterpreterNotification: Declining call");
    setIsNotificationVisible(false);
    localStorage.removeItem('pendingCall');
    toast.success('Call declined');
  };
  
  // If not logged in as interpreter or no incoming call, don't render anything
  if (!isInterpreter) {
    console.log("InterpreterNotification: Not rendering - Not an interpreter");
    return null;
  }
  
  return (
    <>
      {isNotificationVisible && incomingCall && (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-background/95 backdrop-blur-md rounded-lg border border-border shadow-lg p-4 animate-in fade-in slide-in-from-right-5">
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
              Receive Call
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default InterpreterNotification;
