
import { useEffect, useState } from "react";
import CallInterface from "@/components/call/CallInterface";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneIcon, ArrowLeft, Video, Copy, CheckCircle, User } from "lucide-react";
import { toast } from "sonner";
import { useCall } from "@/contexts/CallContext";
import { useMockUser, mariaMockData } from "@/hooks/useMockUser";

const CallPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { roomId: paramRoomId } = params;
  
  const [callStarted, setCallStarted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Call context
  const { 
    createCall, 
    joinCall, 
    leaveCall, 
    roomId, 
    setRoomId,
    isCallActive
  } = useCall();
  
  // Mock user
  const { isMockUser, mockUserType, mockData } = useMockUser();
  
  // Get interpreter data from navigation state or mock data
  const interpreterData = location.state?.interpreter || (mockUserType === 'interpreter' ? mockData : null);
  const callType = location.state?.callType || 'video';
  
  // Handle navigation to call with a room ID
  useEffect(() => {
    if (paramRoomId && !roomId) {
      console.log("Setting room ID from params:", paramRoomId);
      setRoomId(paramRoomId);
    }
  }, [paramRoomId, roomId, setRoomId]);
  
  // Redirect to home if no interpreter data was provided and no room ID
  useEffect(() => {
    if (!interpreterData && !paramRoomId && !mockUserType) {
      toast.error("No interpreter selected. Redirecting to home.");
      navigate("/");
    }
  }, [interpreterData, navigate, paramRoomId, mockUserType]);
  
  // Start or join call
  const startCall = async () => {
    try {
      console.log("Starting call with paramRoomId:", paramRoomId);
      console.log("Mock user type:", mockUserType);

      if (paramRoomId) {
        // Join existing call
        console.log("Joining existing call:", paramRoomId);
        await joinCall(paramRoomId, {
          name: mockUserType === 'client' ? "Client User" : (mockUserType === 'interpreter' ? "Maria Rodriguez" : "Guest User"),
          role: mockUserType === 'interpreter' ? "interpreter" : "client"
        });
      } else if (interpreterData || mockUserType === 'client') {
        // Create new call
        const targetName = interpreterData ? interpreterData.name : (mockUserType === 'client' ? "Test Client" : "Guest User");
        console.log("Creating new call with:", targetName);
        
        const newRoomId = await createCall({
          name: mockUserType === 'interpreter' ? "Maria Rodriguez" : "Client User",
          role: mockUserType === 'interpreter' ? "interpreter" : "client"
        });
        
        // Update URL without navigating
        window.history.replaceState(null, '', `/join/${newRoomId}`);

        // If creating a call as a client and Maria is the interpreter, copy link to clipboard
        if (mockUserType === 'client' && interpreterData && interpreterData.id === "maria-rodriguez") {
          const inviteUrl = `${window.location.origin}/join/${newRoomId}?mock_user=maria`;
          await navigator.clipboard.writeText(inviteUrl);
          toast.success('Copied Maria\'s invite link to clipboard. Open in a new browser window!');
        }
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
      // Include mock_user parameter if we have a mock user
      const mockParam = mockUserType === 'client' ? '?mock_user=maria' : (mockUserType === 'interpreter' ? '?mock_user=client' : '');
      const inviteUrl = `${window.location.origin}/join/${roomId}${mockParam}`;
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
    // Auto-start call when joining via link
    if (paramRoomId && !callStarted && !isCallActive) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        startCall();
      }, 800);
      return () => clearTimeout(timer);
    }
    
    // Auto-prompt to start call when page loads with interpreter data
    const timer = setTimeout(() => {
      if (!callStarted && !isCallActive && (interpreterData || mockUserType)) {
        const promptName = interpreterData?.name || (mockUserType === 'interpreter' ? "Test Client" : "Maria Rodriguez");
        toast(`Ready to connect with ${promptName}?`, {
          action: {
            label: "Start Call",
            onClick: startCall
          },
        });
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [callStarted, interpreterData, paramRoomId, isCallActive, mockUserType]);

  // When leaving the page, ensure we leave the call
  useEffect(() => {
    return () => {
      if (isCallActive) {
        leaveCall();
      }
    };
  }, [isCallActive, leaveCall]);

  // Show loading if we're still figuring out mock user status
  if (!interpreterData && !paramRoomId && !mockUserType) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  console.log("CallPage render - callStarted:", callStarted, "isCallActive:", isCallActive, "mockUserType:", mockUserType);

  // Display appropriate UI based on user type
  const renderCallInfo = () => {
    if (mockUserType === 'interpreter') {
      return "You're logged in as Maria Rodriguez (Interpreter). Wait for a client to call you or share your link.";
    } else if (interpreterData) {
      return `You're about to start a ${callType} call with ${interpreterData.name}, a ${interpreterData.languages[0]} interpreter.`;
    } else {
      return "You're about to join an existing call session.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          {isMockUser && (
            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center text-sm">
              <User className="h-4 w-4 mr-1.5" />
              {mockUserType === 'interpreter' ? 'Logged in as Maria (Interpreter)' : 'Logged in as Test Client'}
            </div>
          )}
        </div>
        
        <div className="max-w-5xl mx-auto">
          {(callStarted || isCallActive) ? (
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
                {paramRoomId ? 'Join Existing Call' : (mockUserType === 'interpreter' ? 'Ready for Calls' : 'Ready to Connect')}
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {renderCallInfo()}
              </p>
              
              {roomId && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Share this link to invite others:</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-muted/50 text-sm rounded px-3 py-2 max-w-xs truncate">
                      {`${window.location.origin}/join/${roomId}${mockUserType ? (mockUserType === 'interpreter' ? '?mock_user=client' : '?mock_user=maria') : ''}`}
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
                  {paramRoomId ? 'Join Call Now' : (mockUserType === 'interpreter' ? 'Accept Incoming Calls' : 'Start Call Now')}
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
