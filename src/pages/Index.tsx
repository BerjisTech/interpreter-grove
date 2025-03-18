
import Hero from "@/components/home/Hero";
import InterpreterCard from "@/components/interpreters/InterpreterCard";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ArrowDown, MapPin } from "lucide-react";
import { Interpreter } from "@/types/interpreter";
import InterpreterGrid from "@/components/interpreters/InterpreterGrid";

const interpreters: Interpreter[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    languages: ["Spanish", "English"],
    rating: 4.8,
    reviews: 142,
    availability: "Available Today • 9AM-5PM",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialties: ["Medical", "Legal"],
    online: true,
    isNative: true,
    jobsCompleted: 256,
    hoursCompleted: 512,
    type: "freelance"
  },
  {
    id: "2",
    name: "Wei Chen",
    languages: ["Mandarin", "English", "Cantonese"],
    rating: 4.9,
    reviews: 97,
    availability: "Available Tomorrow • 8AM-4PM",
    image: "https://images.unsplash.com/photo-1577880216142-8549e9488dad?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialties: ["Technical", "Business"],
    online: false,
    isNative: true,
    jobsCompleted: 128,
    hoursCompleted: 420,
    type: "agency"
  },
  {
    id: "3",
    name: "Ahmed Hassan",
    languages: ["Arabic", "English", "French"],
    rating: 4.7,
    reviews: 78,
    availability: "Available Today • 7AM-3PM",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialties: ["Medical", "Educational"],
    online: true,
    isNative: false,
    jobsCompleted: 93,
    hoursCompleted: 312,
    type: "freelance"
  },
];

const Index = () => {
  const interpretersRef = useRef<HTMLDivElement>(null);

  const scrollToInterpreters = () => {
    interpretersRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <Hero />
      
      {/* Scroll to interpreters button */}
      <div className="flex justify-center -mt-16 relative z-10">
        <Button 
          variant="outline" 
          size="lg" 
          className="glass-button rounded-full px-6"
          onClick={scrollToInterpreters}
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          Find an Interpreter
        </Button>
      </div>
      
      {/* Interpreters Section */}
      <div 
        className="container mx-auto py-24 px-4 md:px-6 bg-background" 
        ref={interpretersRef}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Available Interpreters</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with our professional interpreters instantly via video call, phone call, or in-person meetings.
          </p>
          
          {/* Location filter */}
          <div className="flex items-center justify-center mt-6">
            <div className="bg-accent/50 rounded-full px-4 py-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm">New York, NY</span>
              <Button variant="ghost" size="sm" className="ml-2 h-7 text-xs">
                Change
              </Button>
            </div>
          </div>
        </div>
        
        {/* Interpreter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interpreters.map((interpreter) => (
            <InterpreterCard 
              key={interpreter.id} 
              interpreter={interpreter} 
            />
          ))}
        </div>
        
        {/* View More Button */}
        <div className="text-center mt-12">
          <Button size="lg">
            View All Interpreters
          </Button>
        </div>
      </div>

      {/* Call Demo Section */}
      <div className="bg-accent/30 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experience Seamless Interpretation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides high-quality video and audio for clear, reliable interpretation services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl border border-white/20">
            <div style={{ height: "500px" }} className="bg-card">
              {/* Include the CallInterface component */}
              <div className="w-full h-full relative">
                <video 
                  src="https://player.vimeo.com/external/403295687.sd.mp4?s=3446f787cefa52e7824d6ce6501f5bd7a3f6add6&profile_id=165&oauth2_token_id=57447761" 
                  autoPlay 
                  muted 
                  loop
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="mr-4">
              Start a Free Call
            </Button>
            <Button variant="outline" size="lg">
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
