
import { useState, useEffect, useRef } from 'react';
import { 
  MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, 
  PhoneOffIcon, MessageSquare, Users, SettingsIcon,
  MonitorIcon, Volume2Icon, Volume1Icon, VolumeXIcon, Video,
  User, UserCheck, BellIcon, PanelLeftIcon, PenLine, Copy, CheckCircle,
  Send, Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useCall } from '@/contexts/CallContext';

interface CallInterfaceProps {
  onEndCall?: () => void;
  interpreter?: {
    id: string;
    name: string;
    languages: string[];
    image: string;
    online: boolean;
    [key: string]: any;
  };
  callType?: 'voice' | 'video';
}

const CallInterface = ({ onEndCall, interpreter, callType = 'video' }: CallInterfaceProps) => {
  // Call context for real-time communication
  const { 
    isMicOn, 
    isVideoOn, 
    toggleMic, 
    toggleVideo, 
    participants, 
    messages, 
    sendMessage,
    localStream,
    remoteStream,
    roomId,
    leaveCall
  } = useCall();
  
  const [volume, setVolume] = useState([50]);
  const [callDuration, setCallDuration] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Settings options
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [autoCaption, setAutoCaption] = useState(true);
  
  // Setup local and remote video streams
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);
  
  // Generate invite link
  useEffect(() => {
    if (roomId) {
      const baseUrl = window.location.origin;
      setInviteLink(`${baseUrl}/join/${roomId}`);
    }
  }, [roomId]);
  
  // Simulate connection with participants
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(participants.length > 1);
      if (participants.length > 1) {
        toast.success(`${participants.find(p => !p.isYou)?.name || 'Participant'} connected to your call`);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [participants]);
  
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
  
  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Format call duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // End call
  const handleEndCall = async () => {
    if (onEndCall) onEndCall();
    await leaveCall();
  };
  
  // Toggle participants panel
  const toggleParticipants = () => {
    // Close other panels first
    setIsChatOpen(false);
    setIsSettingsOpen(false);
    setIsParticipantsOpen(!isParticipantsOpen);
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    // Close other panels first
    setIsChatOpen(false);
    setIsParticipantsOpen(false);
    setIsSettingsOpen(!isSettingsOpen);
  };
  
  // Volume Icon based on volume level
  const VolumeIcon = () => {
    if (volume[0] === 0) return <VolumeXIcon className="h-4 w-4" />;
    if (volume[0] < 50) return <Volume1Icon className="h-4 w-4" />;
    return <Volume2Icon className="h-4 w-4" />;
  };

  // Copy invite link
  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
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

  // Show invite dialog
  const handleShowInviteDialog = () => {
    setShowInviteDialog(true);
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const userName = participants.find(p => p.isYou)?.name || 'You';
    sendMessage(messageText, userName);
    setMessageText('');
  };
  
  // Handle key press in message input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
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
            remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={interpreter?.image || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
                alt={interpreter?.name || "Interpreter"} 
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="text-white/80">
              <div className="w-16 h-16 border-4 border-t-transparent border-white/30 rounded-full animate-spin mb-4 mx-auto" />
              <p>Connecting to call...</p>
            </div>
          )}
        </div>
        
        {/* Interpreter/Remote user info */}
        {isConnected && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
            <div className="font-medium">
              {participants.find(p => !p.isYou)?.name || interpreter?.name || "Remote User"}
            </div>
            <div className="text-xs text-white/70">
              {interpreter?.languages?.join(', ') || participants.find(p => !p.isYou)?.role || "Participant"}
            </div>
          </div>
        )}
        
        {/* Self video (user) */}
        <div className="absolute bottom-4 right-4 w-40 h-32 bg-zinc-800 rounded-lg overflow-hidden border border-white/20 shadow-lg">
          {isVideoOn && callType === 'video' ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
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
            {/* Video toggle - only for video calls */}
            {callType === 'video' && (
              <Button 
                variant={isVideoOn ? "outline" : "secondary"}
                size="icon"
                onClick={toggleVideo}
                className="rounded-full h-10 w-10"
              >
                {isVideoOn ? <VideoIcon className="h-5 w-5" /> : <VideoOffIcon className="h-5 w-5" />}
              </Button>
            )}
            
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
              onClick={() => {
                setIsParticipantsOpen(false);
                setIsSettingsOpen(false);
                setIsChatOpen(!isChatOpen);
              }}
              className="rounded-full h-10 w-10"
              aria-label="Chat"
            >
              <MessageSquare className="h-5 w-5" />
              {messages.length > 0 && !isChatOpen && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                  {messages.length > 9 ? '9+' : messages.length}
                </span>
              )}
            </Button>
            
            {/* Participants */}
            <Button 
              variant={isParticipantsOpen ? "secondary" : "outline"}
              size="icon"
              onClick={toggleParticipants}
              className="rounded-full h-10 w-10"
            >
              <Users className="h-5 w-5" />
            </Button>
            
            {/* Settings */}
            <div className="hidden sm:block">
              <Button 
                variant={isSettingsOpen ? "secondary" : "outline"}
                size="icon"
                onClick={toggleSettings}
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
          <div 
            className="h-[calc(100%-6rem)] overflow-y-auto mb-4 px-1"
            ref={chatContainerRef}
          >
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isYou = participants.find(p => p.isYou)?.name === message.sender;
                  return (
                    <div 
                      key={message.id} 
                      className={`flex items-start gap-2 ${isYou ? 'justify-end' : ''}`}
                    >
                      {!isYou && (
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          {message.sender.charAt(0)}
                        </div>
                      )}
                      <div className={`rounded-lg p-3 max-w-[80%] ${isYou ? 'bg-primary/10' : 'bg-muted'}`}>
                        {!isYou && <p className="text-sm font-medium">{message.sender}</p>}
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {isYou && (
                        <div className="bg-background border rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          {message.sender.charAt(0)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                No messages yet
              </div>
            )}
          </div>
          <div className="border border-input rounded-md flex overflow-hidden">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-full rounded-none px-3"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Participants sidebar */}
      {isParticipantsOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-background/95 backdrop-blur-md border-l border-border shadow-xl p-4 animate-slide-in-right">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Participants ({participants.length})</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsParticipantsOpen(false)}
              className="h-8 w-8 p-0"
            >
              &times;
            </Button>
          </div>
          
          <div className="space-y-3">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {participant.isYou ? (
                        <User className="h-5 w-5 text-primary" />
                      ) : (
                        <UserCheck className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {participant.name} {participant.isYou && "(You)"}
                      </div>
                      <div className="text-xs text-muted-foreground">{participant.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {participant.role === 'interpreter' && (
                      <div className="text-xs bg-blue-500/10 text-blue-500 py-1 px-2 rounded-full">
                        Interpreter
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                Waiting for participants to join...
              </div>
            )}
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full"
              onClick={handleShowInviteDialog}
            >
              <Copy className="h-4 w-4 mr-1" />
              Get invite link
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-dashed"
              onClick={copyInviteLink}
            >
              {linkCopied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy invite link
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      {/* Settings sidebar */}
      {isSettingsOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-background/95 backdrop-blur-md border-l border-border shadow-xl p-4 animate-slide-in-right">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Settings</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSettingsOpen(false)}
              className="h-8 w-8 p-0"
            >
              &times;
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Call Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellIcon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="notifications" className="text-sm">Sound notifications</Label>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={notifications} 
                      onCheckedChange={setNotifications}
                      onClick={() => toast.success("Notification settings updated")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PanelLeftIcon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="contrast" className="text-sm">High contrast mode</Label>
                    </div>
                    <Switch 
                      id="contrast" 
                      checked={highContrast} 
                      onCheckedChange={setHighContrast}
                      onClick={() => toast.success("Display settings updated")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PenLine className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="captions" className="text-sm">Auto-captions</Label>
                    </div>
                    <Switch 
                      id="captions" 
                      checked={autoCaption} 
                      onCheckedChange={setAutoCaption}
                      onClick={() => toast.success("Caption settings updated")}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Audio</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="volume-control" className="text-sm">Speaker volume</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <VolumeIcon />
                      <Slider
                        id="volume-control"
                        value={volume}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                          setVolume(value);
                          toast.success(`Volume set to ${value[0]}%`);
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Link Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite to call</DialogTitle>
            <DialogDescription>
              Share this link with others to invite them to join your call.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="border rounded-md p-2 flex-1 bg-muted/30 truncate">
              {inviteLink}
            </div>
            <Button size="sm" onClick={copyInviteLink}>
              {linkCopied ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {linkCopied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              People who join using this link will be able to participate in your call.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add a style for mirroring your own video */}
      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default CallInterface;
