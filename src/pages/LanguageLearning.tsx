
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, Video, FileText, GraduationCap, Star, Search, Filter } from "lucide-react";
import { LearningResource } from "@/types/languageLearning";

// Mock data for language learning resources
const mockLearningResources: LearningResource[] = [
  {
    id: "1",
    title: "Spanish for Beginners: Essential Phrases",
    description: "Learn the most common Spanish phrases for everyday conversations.",
    language: "es",
    level: "beginner",
    type: "video",
    duration: 15,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2670&auto=format&fit=crop",
    url: "/language-learning/spanish-beginners",
    isFeatured: true,
    tags: ["conversation", "basics", "travel"]
  },
  {
    id: "2",
    title: "Business Mandarin: Meeting Etiquette",
    description: "Master the language and customs of Chinese business meetings.",
    language: "zh",
    level: "intermediate",
    type: "course",
    duration: 180,
    image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=2670&auto=format&fit=crop",
    url: "/language-learning/business-mandarin",
    tags: ["business", "formal", "professional"]
  },
  {
    id: "3",
    title: "French Grammar Exercises",
    description: "Interactive exercises to practice French verb conjugations and grammar rules.",
    language: "fr",
    level: "intermediate",
    type: "exercise",
    duration: 45,
    image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=2671&auto=format&fit=crop",
    url: "/language-learning/french-grammar",
    tags: ["grammar", "practice", "verbs"]
  },
  {
    id: "4",
    title: "Japanese Kanji Mastery",
    description: "Learn to read and write the most common 500 kanji characters.",
    language: "ja",
    level: "advanced",
    type: "course",
    duration: 360,
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2692&auto=format&fit=crop",
    url: "/language-learning/japanese-kanji",
    tags: ["reading", "writing", "characters"]
  },
  {
    id: "5",
    title: "German Conversation Practice",
    description: "Real-world dialogue examples with native speakers.",
    language: "de",
    level: "intermediate",
    type: "video",
    duration: 30,
    image: "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=2670&auto=format&fit=crop",
    url: "/language-learning/german-conversation",
    tags: ["speaking", "listening", "practice"]
  },
  {
    id: "6",
    title: "Arabic Alphabet for Beginners",
    description: "Learn to read and write the Arabic alphabet with proper pronunciation.",
    language: "ar",
    level: "beginner",
    type: "course",
    duration: 120,
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2670&auto=format&fit=crop",
    url: "/language-learning/arabic-alphabet",
    isFeatured: true,
    tags: ["alphabet", "writing", "pronunciation"]
  }
];

const LanguageLearning = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter resources based on search and filters
  const filteredResources = mockLearningResources.filter(resource => {
    const matchesLanguage = !selectedLanguage || resource.language === selectedLanguage;
    const matchesLevel = !selectedLevel || resource.level === selectedLevel;
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesLanguage && matchesLevel && matchesSearch;
  });

  const featuredResources = mockLearningResources.filter(r => r.isFeatured);

  // Resource type icons
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'exercise': return <BookOpen className="h-4 w-4" />;
      case 'course': return <GraduationCap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  // Level badge colors
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Language Learning</h1>
          <p className="text-muted-foreground max-w-3xl">
            Enhance your language skills with our curated learning resources. From beginner to advanced, 
            find courses, videos, and exercises tailored to your needs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search resources..." 
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

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full sm:w-48">
              <LanguageSelector 
                selectedCode={selectedLanguage || ""}
                onSelect={(lang) => setSelectedLanguage(lang.code)}
                label="Language"
                placeholder="All languages"
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="text-sm font-medium">Level</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                value={selectedLevel || ""}
                onChange={(e) => setSelectedLevel(e.target.value === "" ? null : e.target.value)}
              >
                <option value="">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex-1"></div>
            <div className="self-end">
              <Button variant="outline" onClick={() => {
                setSelectedLanguage(null);
                setSelectedLevel(null);
                setSearchQuery("");
              }}>
                Clear Filters
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">All Learning Resources</h2>
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
                          className={`${getLevelColor(resource.level)}`}
                        >
                          {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {resource.duration} min
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
                        {getResourceTypeIcon(resource.type)}
                        <span className="ml-1 capitalize">{resource.type}</span>
                      </div>
                      <Button onClick={() => navigate(resource.url)}>
                        Start Learning
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No resources found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters or search term</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedLanguage(null);
                    setSelectedLevel(null);
                    setSearchQuery("");
                  }}
                >
                  Show all resources
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="featured" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
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
                        className={`${getLevelColor(resource.level)}`}
                      >
                        {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {resource.duration} min
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
                      {getResourceTypeIcon(resource.type)}
                      <span className="ml-1 capitalize">{resource.type}</span>
                    </div>
                    <Button onClick={() => navigate(resource.url)}>
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLearningResources.filter(r => r.type === 'course').map((resource) => (
                <Card key={resource.id} className="overflow-hidden h-full flex flex-col">
                  {/* Card content similar to above */}
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
                        className={`${getLevelColor(resource.level)}`}
                      >
                        {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {resource.duration} min
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
                      <GraduationCap className="h-4 w-4" />
                      <span className="ml-1">Course</span>
                    </div>
                    <Button onClick={() => navigate(resource.url)}>
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLearningResources.filter(r => r.type === 'video').map((resource) => (
                <Card key={resource.id} className="overflow-hidden h-full flex flex-col">
                  {/* Card content similar to above */}
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
                        className={`${getLevelColor(resource.level)}`}
                      >
                        {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {resource.duration} min
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
                      <Video className="h-4 w-4" />
                      <span className="ml-1">Video</span>
                    </div>
                    <Button onClick={() => navigate(resource.url)}>
                      Watch Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to action */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need personalized language learning?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our interpreters can provide one-on-one language tutoring sessions tailored to your needs.
            Get real-time practice and feedback from native speakers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => navigate("/interpreters")}>
              Find a Language Tutor
            </Button>
            <Button variant="outline" onClick={() => navigate("/call")}>
              Schedule a Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageLearning;
