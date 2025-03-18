
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, Phone, MessageSquare, User, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useCall } from "@/contexts/CallContext";

const LiveSupport = () => {
  const navigate = useNavigate();
  const [supportType, setSupportType] = useState<'client' | 'agent'>('client');
  const [waitingForAgent, setWaitingForAgent] = useState(false);

  // Call context
  const { 
    createCall,
    joinCall, 
    roomId, 
    participants
  } = useCall();

  // Start support session as client
  const startClientSupport = async (callType: 'voice' | 'video') => {
    try {
      const newRoomId = await createCall({
        name: "Support Client",
        role: "client"
      });
      
      toast.success(`Created support request. Waiting for an agent...`);
      setWaitingForAgent(true);
      
      // Navigate to call page with support session data
      setTimeout(() => {
        navigate('/call', { 
          state: { 
            callType,
            supportMode: true
          } 
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting support session:", error);
      toast.error("Failed to start support session. Please try again.");
    }
  };

  // Join support session as agent
  const joinAsSupportAgent = async (callType: 'voice' | 'video') => {
    if (!roomId) {
      toast.error("No active support requests found.");
      return;
    }
    
    try {
      await joinCall(roomId, {
        name: "Support Agent",
        role: "interpreter" // using interpreter role for the agent
      });
      
      toast.success("Joining support session...");
      
      // Navigate to call page as agent
      navigate('/call', { 
        state: { 
          callType,
          supportMode: true,
          asAgent: true
        } 
      });
    } catch (error) {
      console.error("Error joining support session:", error);
      toast.error("Failed to join the support session. Please try again.");
    }
  };

  // Monitor active support requests for agents
  useEffect(() => {
    if (supportType === 'agent') {
      // In a real app, you would query Firebase for active support requests
      // Here we're just checking if there's an active roomId
      if (roomId && participants.length === 1) {
        toast("New support request is available!", {
          action: {
            label: "Join Now",
            onClick: () => joinAsSupportAgent('video')
          },
        });
      }
    }
  }, [roomId, participants, supportType]);

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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Live Support</h1>
            <p className="text-muted-foreground">
              Get real-time assistance from our support team
            </p>
          </div>
          
          {/* Role selector for demo purposes */}
          <div className="mb-8 flex justify-center">
            <div className="bg-muted/50 p-1 rounded-full">
              <Button
                variant={supportType === 'client' ? 'default' : 'ghost'}
                className="rounded-full"
                onClick={() => setSupportType('client')}
              >
                <User className="mr-2 h-4 w-4" />
                Join as Client
              </Button>
              <Button
                variant={supportType === 'agent' ? 'default' : 'ghost'}
                className="rounded-full"
                onClick={() => setSupportType('agent')}
              >
                <Users className="mr-2 h-4 w-4" />
                Join as Agent
              </Button>
            </div>
          </div>
          
          {supportType === 'client' ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Video Support</CardTitle>
                  <CardDescription>
                    Speak directly with a support agent through video
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-4">
                    Available Monday-Friday, 9AM-5PM EST
                  </p>
                  <p className="text-sm mb-4">
                    Current wait time: ~5 minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => startClientSupport('video')}
                    disabled={waitingForAgent}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    {waitingForAgent ? 'Connecting...' : 'Start Video Call'}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Phone Support</CardTitle>
                  <CardDescription>
                    Get help from our support team over the phone
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-4">
                    Available 24/7 for urgent issues
                  </p>
                  <p className="text-sm mb-4">
                    Current wait time: ~3 minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => startClientSupport('voice')}
                    disabled={waitingForAgent}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {waitingForAgent ? 'Connecting...' : 'Call Support'}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                  <CardDescription>
                    Connect with a support agent via text chat
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-4">
                    Available 24/7
                  </p>
                  <p className="text-sm mb-4">
                    Average response time: 2 minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Chat Session
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Support Agent Dashboard</CardTitle>
                <CardDescription>
                  View and manage support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {roomId ? (
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Active Support Request</h3>
                        <p className="text-sm text-muted-foreground">
                          Client waiting for assistance ({participants.length === 1 ? 'Unassigned' : 'Assigned'})
                        </p>
                      </div>
                      {participants.length === 1 && (
                        <div className="flex gap-2">
                          <Button onClick={() => joinAsSupportAgent('video')}>
                            <Video className="mr-2 h-4 w-4" />
                            Join Video
                          </Button>
                          <Button variant="outline" onClick={() => joinAsSupportAgent('voice')}>
                            <Phone className="mr-2 h-4 w-4" />
                            Join Audio
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No active support requests at the moment.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">Refresh</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSupport;
