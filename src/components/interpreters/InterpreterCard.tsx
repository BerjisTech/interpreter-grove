
import { StarIcon, Video, Phone, Clock, LanguagesIcon, User, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Interpreter } from '@/types/interpreter';

interface InterpreterCardProps {
  interpreter: Interpreter;
}

const InterpreterCard = ({ interpreter }: InterpreterCardProps) => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating) 
              ? 'text-amber-500 fill-amber-500' 
              : i < rating 
                ? 'text-amber-500 fill-amber-500/50' 
                : 'text-muted stroke-muted-foreground/40'
          }`}
        />
      ));
  };

  const handleCallInitiate = (type: 'voice' | 'video') => {
    if (!interpreter.online) {
      toast.error(`${interpreter.name} is currently offline. Please try again later.`);
      return;
    }

    // Navigate to call page with interpreter data
    navigate('/call', { 
      state: { 
        interpreter,
        callType: type 
      } 
    });
  };

  return (
    <div className="bg-card border border-border hover:shadow-medium transition-all duration-300 rounded-xl overflow-hidden group">
      <div className="relative">
        <img 
          src={interpreter.image} 
          alt={interpreter.name}
          className="w-full h-48 object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Online status indicator */}
        {interpreter.online && (
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-soft flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
            <span className="text-xs font-medium">Available Now</span>
          </div>
        )}
        
        {/* Native speaker tag */}
        {interpreter.isNative && (
          <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm px-2 py-1 rounded-full shadow-soft flex items-center">
            <Award className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">Native Speaker</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium">{interpreter.name}</h3>
          <div className="flex items-center">
            {renderStars(interpreter.rating)}
            <span className="text-xs text-muted-foreground ml-1">({interpreter.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <LanguagesIcon className="h-4 w-4 mr-1.5" />
          <span>{interpreter.languages.join(", ")}</span>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>{interpreter.availability}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {interpreter.specialties.map((specialty, index) => (
              <Badge key={index} variant="outline" className="bg-accent/50">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-accent/30 rounded-md p-2 flex items-center justify-center">
              <Briefcase className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span className="text-xs">{interpreter.jobsCompleted} jobs</span>
            </div>
            <div className="bg-accent/30 rounded-md p-2 flex items-center justify-center">
              <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span className="text-xs">{interpreter.type}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => handleCallInitiate('voice')}
            disabled={!interpreter.online}
          >
            <Phone className="h-4 w-4 mr-1.5" />
            <span>Call</span>
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => handleCallInitiate('video')}
            disabled={!interpreter.online}
          >
            <Video className="h-4 w-4 mr-1.5" />
            <span>Video</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterpreterCard;
