
import { ArrowRight, Globe, Star, Users, Headset, CreditCard, Building, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="pt-28 pb-16 bg-accent/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How Our Interpretation Service Works</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connecting clients with professional interpreters through our streamlined, AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/interpreters">Find an Interpreter</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Process Flow Section */}
      <div className="py-20 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Client Flow */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary/10 text-primary px-4 py-1 rounded-bl-lg font-medium text-sm">
              For Clients
            </div>
            <Users className="h-12 w-12 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">How Clients Use Our Service</h2>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Create a Request</h3>
                  <p className="text-muted-foreground">Specify your language needs and interpretation requirements</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Choose an Interpreter</h3>
                  <p className="text-muted-foreground">Select a specific interpreter or get matched with the first available</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Receive Interpretation</h3>
                  <p className="text-muted-foreground">Connect via video, phone, or in-person for your session</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Pay & Rate</h3>
                  <p className="text-muted-foreground">Pay for the service and leave a rating for your interpreter</p>
                </div>
              </div>
            </div>
            
            <Button className="mt-8" asChild>
              <Link to="/interpreters">Find an Interpreter</Link>
            </Button>
          </div>
          
          {/* Interpreter Flow */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary/10 text-primary px-4 py-1 rounded-bl-lg font-medium text-sm">
              For Interpreters
            </div>
            <Headset className="h-12 w-12 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">How Interpreters Work With Us</h2>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Create Your Profile</h3>
                  <p className="text-muted-foreground">Sign up and showcase your interpretation skills and languages</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Set Your Services & Rates</h3>
                  <p className="text-muted-foreground">Define your availability, specialties, and pricing</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Receive Job Requests</h3>
                  <p className="text-muted-foreground">Get notified of interpretation opportunities that match your profile</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Get Paid & Build Reputation</h3>
                  <p className="text-muted-foreground">Receive payment and ratings to enhance your profile</p>
                </div>
              </div>
            </div>
            
            <Button className="mt-8">Register as Interpreter</Button>
          </div>
          
          {/* LSP Flow */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary/10 text-primary px-4 py-1 rounded-bl-lg font-medium text-sm">
              For Language Service Providers
            </div>
            <Building className="h-12 w-12 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">For Language Service Providers</h2>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Create Business Profile</h3>
                  <p className="text-muted-foreground">Establish your LSP account with company details and services</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Add Your Interpreters</h3>
                  <p className="text-muted-foreground">Invite and manage interpreters who work for your agency</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Manage Incoming Calls</h3>
                  <p className="text-muted-foreground">Route calls and requests to your interpreters efficiently</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Grow Your Business</h3>
                  <p className="text-muted-foreground">Expand your client base and monitor interpreter performance</p>
                </div>
              </div>
            </div>
            
            <Button className="mt-8">Register as LSP</Button>
          </div>
        </div>
        
        {/* Mutual Rating System */}
        <div className="bg-accent/30 rounded-xl p-8 border border-border/50 shadow-sm text-center max-w-3xl mx-auto">
          <Star className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Mutual Rating System</h2>
          <p className="text-muted-foreground mb-6">
            Our platform features a transparent two-way rating system where both clients and interpreters 
            can rate each other after completing a session, ensuring quality and accountability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-background rounded-lg p-4 border border-border/50">
              <h3 className="font-medium text-lg flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Clients Rate Interpreters
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on language proficiency, professionalism, and accuracy
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border/50">
              <h3 className="font-medium text-lg flex items-center">
                <Headset className="h-4 w-4 mr-2" />
                Interpreters Rate Clients
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on clarity of requests, punctuality, and cooperation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
