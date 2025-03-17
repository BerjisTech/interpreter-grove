
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Globe, Video, Phone, Headphones, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const languages = [
  "Spanish", "Mandarin", "French", "Arabic", "Russian", 
  "Japanese", "German", "Portuguese", "Hindi", "Korean"
];

const Hero = () => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const animationRef = useRef<HTMLDivElement>(null);
  
  // Cycle through languages with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentLanguageIndex((prevIndex) => (prevIndex + 1) % languages.length);
        setIsVisible(true);
      }, 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-background -z-10" />
      
      {/* Abstract shapes */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-8 max-w-2xl animate-fade-in">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <Globe className="mr-1 h-3.5 w-3.5" />
                Professional Interpretation Services
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-4">
                Breaking Language Barriers with Real-Time Interpretation
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mt-6 text-balance">
                Connect with certified interpreters in seconds. Available 24/7 for video, phone, and in-person interpretation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </div>
            
            {/* Language cycling display */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Available in:</span>
              <div className="h-6 overflow-hidden" ref={animationRef}>
                <div 
                  className={`font-medium text-primary transition-all duration-500 ${
                    isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-2'
                  }`}
                >
                  {languages[currentLanguageIndex]}
                </div>
              </div>
              <span>and 100+ more languages</span>
            </div>
          </div>
          
          {/* Hero image/illustration */}
          <div className="flex-1 w-full max-w-xl animate-fade-in">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-tr from-primary/10 to-accent/20 rounded-2xl overflow-hidden shadow-medium border border-white/20 backdrop-blur">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Start Video Call</h3>
                    <p className="text-sm text-muted-foreground mb-4">Connect with an interpreter in seconds</p>
                    <Button size="sm" className="mx-auto">
                      Join Now
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -left-12 top-1/4 glass-card p-4 rounded-xl animate-float shadow-soft">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Headphones className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Spanish</h4>
                    <p className="text-xs text-muted-foreground">Maria C.</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-8 bottom-1/4 glass-card p-4 rounded-xl animate-float shadow-soft" style={{animationDelay: "1s"}}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Mandarin</h4>
                    <p className="text-xs text-muted-foreground">Wei L.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
          <div className="animate-bounce">
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
