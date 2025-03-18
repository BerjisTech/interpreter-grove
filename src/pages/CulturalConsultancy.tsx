
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { Search, Filter, Globe, Calendar, Users, Clock, PhoneCall, Star, BookOpen, BriefcaseBusiness, MessageSquare } from "lucide-react";
import { CulturalResource, ConsultantProfile } from "@/types/culturalConsultancy";

// Mock data for cultural resources
const mockCulturalResources: CulturalResource[] = [
  {
    id: "1",
    title: "Business Etiquette in Japan",
    description: "Essential guide to Japanese business customs, gift-giving, and meeting protocols.",
    culture: "Japanese",
    category: "business",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2506&auto=format&fit=crop",
    isFeatured: true,
    tags: ["business", "etiquette", "meetings"]
  },
  {
    id: "2",
    title: "Social Customs in Latin America",
    description: "Understanding greetings, social interactions, and family values across Latin American countries.",
    culture: "Latin American",
    category: "social",
    image: "https://images.unsplash.com/photo-1589519160732-576f94c533fc?q=80&w=2670&auto=format&fit=crop",
    tags: ["social", "family", "greetings"]
  },
  {
    id: "3",
    title: "Middle Eastern Hospitality Traditions",
    description: "Learn about hosting customs, guest etiquette, and food traditions in Middle Eastern cultures.",
    culture: "Middle Eastern",
    category: "traditions",
    image: "https://images.unsplash.com/photo-1577715797722-eb2e3c3bb0bb?q=80&w=2679&auto=format&fit=crop",
    isFeatured: true,
    tags: ["hospitality", "food", "customs"]
  },
  {
    id: "4",
    title: "Understanding Chinese Cultural Values",
    description: "Explore key concepts like 'face', hierarchy, and group harmony in Chinese culture.",
    culture: "Chinese",
    category: "general",
    image: "https://images.unsplash.com/photo-1508896694512-1eade558679c?q=80&w=2670&auto=format&fit=crop",
    tags: ["values", "traditions", "society"]
  },
  {
    id: "5",
    title: "Indian Wedding Traditions",
    description: "Comprehensive guide to the customs, rituals and etiquette of Indian wedding ceremonies.",
    culture: "Indian",
    category: "traditions",
    image: "https://images.unsplash.com/photo-1610173827760-de885e85f204?q=80&w=2670&auto=format&fit=crop",
    tags: ["weddings", "ceremonies", "rituals"]
  },
  {
    id: "6",
    title: "Business Negotiations in Arab Countries",
    description: "Strategies for successful business negotiations in Arab cultural contexts.",
    culture: "Arab",
    category: "business",
    image: "https://images.unsplash.com/photo-1529651490292-99c5e5f54b07?q=80&w=2574&auto=format&fit=crop",
    tags: ["negotiations", "business", "communication"]
  }
];

// Mock data for cultural consultants
const mockConsultants: ConsultantProfile[] = [
  {
    id: "1",
    name: "Dr. Yuki Tanaka",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop",
    cultures: ["Japanese", "East Asian"],
    languages: ["Japanese", "English", "Mandarin"],
    expertise: ["Business Etiquette", "Cross-cultural Management", "Academic Exchange"],
    rating: 4.9,
    reviews: 127,
    availability: "Weekdays",
    hourlyRate: 85,
    online: true
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop",
    cultures: ["Mexican", "Latin American"],
    languages: ["Spanish", "English", "Portuguese"],
    expertise: ["Social Customs", "Festivals & Celebrations", "Immigration Support"],
    rating: 4.7,
    reviews: 98,
    availability: "Evenings & Weekends",
    hourlyRate: 75,
    online: true
  },
  {
    id: "3",
    name: "Fatima Al-Mansouri",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2761&auto=format&fit=crop",
    cultures: ["Emirati", "Middle Eastern", "Arab"],
    languages: ["Arabic", "English", "French"],
    expertise: ["Business Protocol", "Women in Business", "Cultural Heritage"],
    rating: 4.8,
    reviews: 112,
    availability: "Flexible Hours",
    hourlyRate: 90,
    online: false
  },
  {
    id: "4",
    name: "Wei Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2670&auto=format&fit=crop",
    cultures: ["Chinese", "Taiwanese"],
    languages: ["Mandarin", "Cantonese", "English"],
    expertise: ["Business Negotiations", "Technology Sector", "Educational Systems"],
    rating: 4.9,
    reviews: 156,
    availability: "Mornings & Evenings",
    hourlyRate: 95,
    online: true
  }
];

const CulturalConsultancy = () => {
  const navigate = useNavigate();
  const [selectedCulture, setSelectedCulture] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter resources based on search and filters
  const filteredResources = mockCulturalResources.filter(resource => {
    const matchesCulture = !selectedCulture || resource.culture.toLowerCase() === selectedCulture.toLowerCase();
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesCulture && matchesCategory && matchesSearch;
  });

  // Filter consultants based on search
  const filteredConsultants = mockConsultants.filter(consultant => {
    if (!searchQuery) return true;
    
    return (
      consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.cultures.some(culture => culture.toLowerCase().includes(searchQuery.toLowerCase())) ||
      consultant.languages.some(language => language.toLowerCase().includes(searchQuery.toLowerCase())) ||
      consultant.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Cultural Consultancy</h1>
          <p className="text-muted-foreground max-w-3xl">
            Navigate cultural differences with confidence. Access resources and connect with experts
            who can provide guidance on cultural norms, business etiquette, and social customs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="resources" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="resources">Cultural Resources</TabsTrigger>
              <TabsTrigger value="consultants">Cultural Consultants</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-8 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="resources" className="mt-0">
            {/* Filters for resources */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="w-full sm:w-48">
                <label className="text-sm font-medium">Culture</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  value={selectedCulture || ""}
                  onChange={(e) => setSelectedCulture(e.target.value === "" ? null : e.target.value)}
                >
                  <option value="">All cultures</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Latin American">Latin American</option>
                  <option value="Middle Eastern">Middle Eastern</option>
                  <option value="Indian">Indian</option>
                  <option value="Arab">Arab</option>
                </select>
              </div>
              <div className="w-full sm:w-48">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value === "" ? null : e.target.value)}
                >
                  <option value="">All categories</option>
                  <option value="business">Business</option>
                  <option value="social">Social</option>
                  <option value="traditions">Traditions</option>
                  <option value="etiquette">Etiquette</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="flex-1"></div>
              <div className="self-end">
                <Button variant="outline" onClick={() => {
                  setSelectedCulture(null);
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}>
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Cultural resources grid */}
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={resource.image} 
                        alt={resource.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105" 
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge 
                          variant="outline" 
                          className={`${getCategoryColor(resource.category)}`}
                        >
                          {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                        </Badge>
                        <div className="flex items-center text-xs">
                          <Globe className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{resource.culture}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 flex-grow">
                      <div className="flex flex-wrap gap-1">
                        {resource.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span className="ml-1">Resource</span>
                      </div>
                      <Button onClick={() => navigate(`/cultural-consultancy/resources/${resource.id}`)}>
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No resources found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters or search term</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCulture(null);
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                >
                  Show all resources
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="consultants" className="mt-0">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Cultural Consultants</h2>
              <p className="text-muted-foreground mb-4">
                Our consultants provide personalized guidance on cultural matters. 
                Schedule a call to discuss business etiquette, social customs, or cultural nuances.
              </p>
            </div>

            {filteredConsultants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredConsultants.map((consultant) => (
                  <Card key={consultant.id} className="overflow-hidden flex flex-col">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 p-6 flex items-center justify-center bg-primary/5">
                        <Avatar className="h-24 w-24 border-2 border-background">
                          <AvatarImage src={consultant.image} alt={consultant.name} />
                          <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{consultant.name}</h3>
                            <p className="text-muted-foreground text-sm">
                              {consultant.cultures.join(", ")} Cultural Consultant
                            </p>
                          </div>
                          <Badge variant={consultant.online ? "default" : "outline"}>
                            {consultant.online ? "Online" : "Offline"}
                          </Badge>
                        </div>

                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="ml-1 font-medium">{consultant.rating}</span>
                          </div>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{consultant.reviews} reviews</span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">${consultant.hourlyRate}/hr</span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-start">
                            <Globe className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Languages</p>
                              <p className="text-sm text-muted-foreground">{consultant.languages.join(", ")}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Expertise</p>
                              <p className="text-sm text-muted-foreground">{consultant.expertise.join(", ")}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Availability</p>
                              <p className="text-sm text-muted-foreground">{consultant.availability}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button 
                            className="flex-1" 
                            onClick={() => navigate("/call", { 
                              state: { 
                                interpreter: {
                                  id: consultant.id,
                                  name: consultant.name,
                                  languages: consultant.languages,
                                  image: consultant.image,
                                  online: consultant.online
                                },
                                callType: 'video'
                              }
                            })}
                          >
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Schedule Call
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No consultants found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search term</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Show all consultants
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Call to action */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need immediate cultural assistance?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our interpreters can provide on-demand cultural consultation for business meetings,
            travel preparation, or any cross-cultural situation you're navigating.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => navigate("/interpreters")}>
              Find a Cultural Consultant
            </Button>
            <Button variant="outline" onClick={() => navigate("/call")}>
              Start Immediate Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalConsultancy;
