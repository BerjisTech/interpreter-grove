
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from '@/contexts/UserRoleContext';
import { CulturalResource, ConsultantProfile } from "@/types/culturalConsultancy";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, User, Globe, Edit, Trash, Plus, Clock, CheckCircle } from "lucide-react";

// Mock data for cultural resources
const mockResources: CulturalResource[] = [
  {
    id: "1",
    title: "Japanese Business Etiquette",
    description: "Learn the proper etiquette for business meetings and negotiations in Japan.",
    culture: "Japanese",
    category: "business",
    image: "https://images.unsplash.com/photo-1526299577547-7b9d8be916cd?q=80&w=2574&auto=format&fit=crop",
    isFeatured: true,
    tags: ["business", "etiquette", "meetings"]
  },
  {
    id: "2",
    title: "Arab Social Customs",
    description: "Understanding social interactions, hospitality, and family structures in Arab cultures.",
    culture: "Arab",
    category: "social",
    image: "https://images.unsplash.com/photo-1519915051152-7b3597fe2abe?q=80&w=2574&auto=format&fit=crop",
    tags: ["social", "family", "hospitality"]
  },
  {
    id: "3",
    title: "Indian Festival Calendar",
    description: "A comprehensive guide to major Indian festivals, their significance and celebrations.",
    culture: "Indian",
    category: "traditions",
    image: "https://images.unsplash.com/photo-1593105522588-5935ca98898c?q=80&w=2670&auto=format&fit=crop",
    tags: ["festivals", "celebrations", "traditions"]
  }
];

// Mock data for consultants
const mockConsultants: ConsultantProfile[] = [
  {
    id: "1",
    name: "Yuki Tanaka",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop",
    cultures: ["Japanese", "Korean"],
    languages: ["ja", "ko", "en"],
    expertise: ["Business", "Technology", "Education"],
    rating: 4.9,
    reviews: 142,
    availability: "Weekdays",
    hourlyRate: 85,
    online: true
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
    cultures: ["Egyptian", "Arab"],
    languages: ["ar", "en", "fr"],
    expertise: ["Business", "Hospitality", "Academia"],
    rating: 4.7,
    reviews: 98,
    availability: "Evenings, Weekends",
    hourlyRate: 75,
    online: false
  }
];

// Mock client appointments
const mockAppointments = [
  {
    id: "1",
    consultantId: "1",
    consultantName: "Yuki Tanaka",
    date: new Date(2023, 7, 15, 14, 0),
    duration: 60,
    topic: "Japanese business meeting preparation",
    status: "upcoming"
  },
  {
    id: "2",
    consultantId: "2",
    consultantName: "Ahmed Hassan",
    date: new Date(2023, 7, 10, 16, 0),
    duration: 45,
    topic: "Egyptian social customs overview",
    status: "completed"
  }
];

const ConsultancyManagement = () => {
  const { role } = useUserRole();
  const [activeTab, setActiveTab] = useState("resources");
  
  // Category badge colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'traditions': return 'bg-amber-100 text-amber-800';
      case 'etiquette': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cultural Consultancy</h1>
        {role === 'freelancer' && (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Create New Resource
          </Button>
        )}
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          {role === 'client' && (
            <>
              <TabsTrigger value="resources">Cultural Resources</TabsTrigger>
              <TabsTrigger value="consultants">Find Consultants</TabsTrigger>
              <TabsTrigger value="appointments">My Appointments</TabsTrigger>
            </>
          )}
          {role === 'freelancer' && (
            <>
              <TabsTrigger value="resources">My Resources</TabsTrigger>
              <TabsTrigger value="clients">My Clients</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </>
          )}
        </TabsList>
        
        {/* Cultural Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockResources.map(resource => (
              <Card key={resource.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={resource.image} 
                    alt={resource.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge variant="outline" className={getCategoryColor(resource.category)}>
                      {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                    </Badge>
                    <Badge variant="outline">{resource.culture}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {resource.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-normal text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>{resource.culture}</span>
                  </div>
                  {role === 'client' && (
                    <Button variant="default" size="sm">Read More</Button>
                  )}
                  {role === 'freelancer' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Consultants Tab (Client View) */}
        {role === 'client' && (
          <TabsContent value="consultants" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockConsultants.map(consultant => (
                <Card key={consultant.id} className="flex flex-col md:flex-row overflow-hidden">
                  <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                    <img 
                      src={consultant.image} 
                      alt={consultant.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className={`absolute top-2 right-2 rounded-full w-3 h-3 ${consultant.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{consultant.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Globe className="h-4 w-4 mr-1" />
                            {consultant.cultures.join(", ")}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">${consultant.hourlyRate}/hr</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow py-2">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Expertise: {consultant.expertise.join(", ")}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Available: {consultant.availability}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{consultant.rating}</span>
                          <span className="text-muted-foreground">({consultant.reviews} reviews)</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <Button className="w-full">Book Consultation</Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
        
        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{role === 'client' ? 'My Appointments' : 'Upcoming Sessions'}</CardTitle>
              <CardDescription>
                {role === 'client' 
                  ? 'Your scheduled consultations with cultural experts' 
                  : 'Your upcoming consultation sessions with clients'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAppointments.map(appointment => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className={`p-1 ${appointment.status === 'upcoming' ? 'bg-blue-100' : 'bg-green-100'}`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{appointment.topic}</CardTitle>
                        <Badge variant={appointment.status === 'upcoming' ? 'outline' : 'success'}>
                          {appointment.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {role === 'client' ? `Consultant: ${appointment.consultantName}` : 'Client: John Doe'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {appointment.date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {appointment.date.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })} 
                          ({appointment.duration} min)
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t flex justify-end gap-2">
                      {appointment.status === 'upcoming' ? (
                        <>
                          <Button variant="outline">Reschedule</Button>
                          <Button>Join Meeting</Button>
                        </>
                      ) : (
                        <Button variant="outline">View Notes</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Clients Tab (Consultant View) */}
        {role === 'freelancer' && (
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Clients</CardTitle>
                <CardDescription>Manage your client relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="flex items-center p-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop" 
                          alt="John Doe"
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">John Doe</h3>
                        <p className="text-sm text-muted-foreground">3 sessions completed</p>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4 mr-1" />
                          Profile
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="flex items-center p-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop" 
                          alt="Jane Smith"
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Jane Smith</h3>
                        <p className="text-sm text-muted-foreground">1 session completed</p>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4 mr-1" />
                          Profile
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ConsultancyManagement;
