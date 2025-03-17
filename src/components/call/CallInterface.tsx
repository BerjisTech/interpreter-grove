
import { useState, useEffect } from 'react';
import { 
  MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, 
  PhoneOffIcon, MessageSquare, Users, SettingsIcon,
  MonitorIcon, Volume2Icon, Volume1Icon, VolumeXIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface CallInterfaceProps {
  onEndCall?: () => void;
}

const CallInterface = ({ onEndCall }: CallInterfaceProps) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [callDuration, setCallDuration] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Simulate connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
      toast.success('Interpreter connected to your call');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Call timer
  useEffect(() => {
    let interval: number | null = null;
    
    if (isConnected) {
      interval = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);
  
  // Format call duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle mic
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    toast(isMicOn ? 'Microphone turned off' : 'Microphone turned on');
  };
  
  // Toggle video
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast(isVideoOn ? 'Camera turned off' : 'Camera turned on');
  };
  
  // End call
  const handleEndCall = () => {
    toast.error('Call ended');
    if (onEndCall) onEndCall();
  };
  
  // Volume Icon based on volume level
  const VolumeIcon = () => {
    if (volume[0] === 0) return <VolumeXIcon className="h-4 w-4" />;
    if (volume[0] < 50) return <Volume1Icon className="h-4 w-4" />;
    return <Volume2Icon className="h-4 w-4" />;
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Call Status Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-xs text-white font-medium">
            {isConnected ? `Connected • ${formatDuration(callDuration)}` : 'Connecting...'}
          </span>
        </div>
      </div>
      
      {/* Main video container */}
      <div className="flex-1 bg-zinc-900 rounded-lg overflow-hidden relative">
        {/* Remote video (interpreter) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isConnected ? (
            <img 
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Interpreter" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white/80">
              <div className="w-16 h-16 border-4 border-t-transparent border-white/30 rounded-full animate-spin mb-4 mx-auto" />
              <p>Connecting to interpreter...</p>
            </div>
          )}
        </div>
        
        {/* Self video (user) */}
        <div className="absolute bottom-4 right-4 w-40 h-32 bg-zinc-800 rounded-lg overflow-hidden border border-white/20 shadow-lg">
          {isVideoOn ? (
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="You" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <VideoOffIcon className="h-8 w-8 text-white/50" />
            </div>
          )}
        </div>
      </div>
      
      {/* Call controls */}
      <div className="bg-background/90 backdrop-blur-md py-4 px-6 rounded-b-lg border-t border-border shadow-soft">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Video toggle */}
            <Button 
              variant={isVideoOn ? "outline" : "secondary"}
              size="icon"
              onClick={toggleVideo}
              className="rounded-full h-10 w-10"
            >
              {isVideoOn ? <VideoIcon className="h-5 w-5" /> : <VideoOffIcon className="h-5 w-5" />}
            </Button>
            
            {/* Mic toggle */}
            <Button 
              variant={isMicOn ? "outline" : "secondary"}
              size="icon"
              onClick={toggleMic}
              className="rounded-full h-10 w-10"
            >
              {isMicOn ? <MicIcon className="h-5 w-5" /> : <MicOffIcon className="h-5 w-5" />}
            </Button>
            
            {/* Volume control */}
            <div className="hidden sm:flex items-center space-x-2 bg-muted/50 rounded-full pl-2 pr-3 py-1.5">
              <VolumeIcon />
              <Slider
                value={volume}
                min={0}
                max={100}
                step={1}
                onValueChange={setVolume}
                className="w-24"
              />
            </div>
          </div>
          
          {/* Central call control */}
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={handleEndCall}
            className="rounded-full h-12 w-12 bg-red-500 hover:bg-red-600"
          >
            <PhoneOffIcon className="h-5 w-5" />
          </Button>
          
          {/* Right controls */}
          <div className="flex items-center space-x-3">
            {/* Chat toggle */}
            <Button 
              variant={isChatOpen ? "secondary" : "outline"}
              size="icon"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="rounded-full h-10 w-10"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            {/* Participants */}
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
            >
              <Users className="h-5 w-5" />
            </Button>
            
            {/* More options */}
            <div className="hidden sm:block">
              <Button 
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10"
              >
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat sidebar (conditionally rendered) */}
      {isChatOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-background/95 backdrop-blur-md border-l border-border shadow-xl p-4 animate-slide-in-right">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Chat</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsChatOpen(false)}
              className="h-8 w-8 p-0"
            >
              &times;
            </Button>
          </div>
          <div className="h-[calc(100%-6rem)] overflow-y-auto mb-4">
            {/* Chat messages would go here */}
            <div className="text-center text-sm text-muted-foreground py-8">
              No messages yet
            </div>
          </div>
          <div className="border border-input rounded-md flex overflow-hidden">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none"
            />
            <Button variant="ghost" size="sm" className="h-full rounded-none px-3">
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallInterface;
