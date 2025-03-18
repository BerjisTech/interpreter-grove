
import { useEffect, useState } from "react";
import CallInterface from "@/components/call/CallInterface";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneIcon, ArrowLeft, Video, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useCall } from "@/contexts/CallContext";

const CallPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { roomId: paramRoomId } = params;
  
  const [callStarted, setCallStarted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Get interpreter data from navigation state
  const interpreterData = location.state?.interpreter;
  const callType = location.state?.callType || 'video';
  
  // Call context
  const { 
    createCall, 
    joinCall, 
    leaveCall, 
    roomId, 
    setRoomId,
    isCallActive
  } = useCall();
  
  // Handle navigation to call with a room ID
  useEffect(() => {
    if (paramRoomId && !roomId) {
      setRoomId(paramRoomId);
    }
  }, [paramRoomId, roomId, setRoomId]);
  
  // Redirect to home if no interpreter data was provided and no room ID
  useEffect(() => {
    if (!interpreterData && !paramRoomId) {
      toast.error("No interpreter selected. Redirecting to home.");
      navigate("/");
    }
  }, [interpreterData, navigate, paramRoomId]);
  
  // Start or join call
  const startCall = async () => {
    try {
      if (paramRoomId) {
        // Join existing call
        await joinCall(paramRoomId, {
          name: "Client User", // In a real app, this would be from auth
          role: "client"
        });
      } else if (interpreterData) {
        // Create new call
        const newRoomId = await createCall({
          name: "Client User", // In a real app, this would be from auth
          role: "client"
        });
        
        // Update URL without navigating
        window.history.replaceState(null, '', `/join/${newRoomId}`);
      }
      
      toast.success(`${paramRoomId ? 'Joined' : 'Started'} ${callType} call ${interpreterData ? `with ${interpreterData.name}` : ''}`);
      setCallStarted(true);
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start call. Please try again.");
    }
  };
  
  const endCall = async () => {
    try {
      await leaveCall();
      setCallStarted(false);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error ending call:", error);
      toast.error("Error ending call");
    }
  };
  
  // Copy invite link
  const copyInviteLink = async () => {
    if (!roomId) return;
    
    try {
      const inviteUrl = `${window.location.origin}/join/${roomId}`;
      await navigator.clipboard.writeText(inviteUrl);
      setLinkCopied(true);
      toast.success('Invite link copied to clipboard');
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    } catch (err) {
      toast.error('Failed to copy link. Please try again.');
    }
  };
  
  useEffect(() => {
    // Auto-prompt to start call when page loads
    const timer = setTimeout(() => {
      if (!callStarted && (interpreterData || paramRoomId)) {
        toast(`Ready to ${paramRoomId ? 'join' : 'connect'} ${interpreterData ? `with ${interpreterData.name}` : 'the call'}?`, {
          action: {
            label: paramRoomId ? "Join Call" : "Start Call",
            onClick: startCall
          },
        });
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [callStarted, interpreterData, paramRoomId]);

  // When leaving the page, ensure we leave the call
  useEffect(() => {
    return () => {
      if (isCallActive) {
        leaveCall();
      }
    };
  }, [isCallActive, leaveCall]);

  // Show loading if no data yet
  if (!interpreterData && !paramRoomId) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-6 px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="max-w-5xl mx-auto">
          {callStarted || isCallActive ? (
            <div className="rounded-lg overflow-hidden shadow-xl border border-border" style={{ height: "70vh" }}>
              <CallInterface 
                onEndCall={endCall} 
                interpreter={interpreterData}
                callType={callType}
              />
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center shadow-soft border border-border">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                {callType === 'video' ? (
                  <Video className="h-8 w-8 text-primary" />
                ) : (
                  <PhoneIcon className="h-8 w-8 text-primary" />
                )}
              </div>
              
              <h1 className="text-2xl font-bold mb-4">
                {paramRoomId ? 'Join Existing Call' : 'Ready to Connect'}
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {paramRoomId 
                  ? 'You are about to join an existing call session.' 
                  : `You're about to start a ${callType} call with ${interpreterData?.name}, 
                     a ${interpreterData?.languages[0]} interpreter. 
                     The call is estimated to last 30 minutes.`
                }
              </p>
              
              {roomId && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Share this link to invite others:</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-muted/50 text-sm rounded px-3 py-2 max-w-xs truncate">
                      {`${window.location.origin}/join/${roomId}`}
                    </div>
                    <Button size="sm" variant="outline" onClick={copyInviteLink}>
                      {linkCopied ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {linkCopied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={startCall}>
                  {paramRoomId ? 'Join Call Now' : 'Start Call Now'}
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallPage;
