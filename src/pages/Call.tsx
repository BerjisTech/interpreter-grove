
import { useEffect, useState } from "react";
import CallInterface from "@/components/call/CallInterface";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CallPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [callStarted, setCallStarted] = useState(false);
  
  // Get interpreter data from navigation state
  const interpreterData = location.state?.interpreter;
  const callType = location.state?.callType || 'video';
  
  // Redirect to home if no interpreter data was provided
  useEffect(() => {
    if (!interpreterData) {
      toast.error("No interpreter selected. Redirecting to home.");
      navigate("/");
    }
  }, [interpreterData, navigate]);
  
  const startCall = () => {
    toast.success(`Starting ${callType} call with ${interpreterData?.name}`);
    setCallStarted(true);
  };
  
  const endCall = () => {
    setCallStarted(false);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  
  useEffect(() => {
    // Auto-prompt to start call when page loads
    const timer = setTimeout(() => {
      if (!callStarted && interpreterData) {
        toast(`Ready to connect with ${interpreterData.name}?`, {
          action: {
            label: "Start Call",
            onClick: startCall
          },
        });
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [callStarted, interpreterData]);

  if (!interpreterData) {
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
          {callStarted ? (
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
              
              <h1 className="text-2xl font-bold mb-4">Ready to Connect</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You're about to start a {callType} call with {interpreterData.name}, 
                a {interpreterData.languages[0]} interpreter. 
                The call is estimated to last 30 minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={startCall}>
                  Start Call Now
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
