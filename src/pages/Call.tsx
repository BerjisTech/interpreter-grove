
import { useEffect, useState } from "react";
import CallInterface from "@/components/call/CallInterface";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CallPage = () => {
  const navigate = useNavigate();
  const [callStarted, setCallStarted] = useState(false);
  
  const startCall = () => {
    toast.success("Starting call with interpreter");
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
      if (!callStarted) {
        toast("Ready to connect with interpreter?", {
          action: {
            label: "Start Call",
            onClick: startCall
          },
        });
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [callStarted]);

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
              <CallInterface onEndCall={endCall} />
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center shadow-soft border border-border">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <PhoneIcon className="h-8 w-8 text-primary" />
              </div>
              
              <h1 className="text-2xl font-bold mb-4">Ready to Connect</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You're about to start a call with Maria Rodriguez, a Spanish interpreter. 
                The call is estimated to last 30 minutes.
              </p>
              
              <Button size="lg" onClick={startCall}>
                Start Call Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallPage;
