
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from '@/contexts/UserRoleContext';
import { LearningResource } from "@/types/languageLearning";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Video, FileText, GraduationCap, Edit, Trash, Plus, Users } from "lucide-react";

// Mock data for courses
const mockCourses: LearningResource[] = [
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
  }
];

// Mock data for course progress
const mockProgress = [
  {
    resourceId: "1",
    userId: "user1",
    completed: true,
    progress: 100,
    lastAccessed: new Date(2023, 5, 15)
  },
  {
    resourceId: "2",
    userId: "user1",
    completed: false,
    progress: 45,
    lastAccessed: new Date(2023, 6, 2)
  }
];

const CourseManagement = () => {
  const { role } = useUserRole();
  const [activeTab, setActiveTab] = useState("my-courses");
  
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Language Learning</h1>
        {role === 'freelancer' && (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Create New Course
          </Button>
        )}
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          {role === 'client' && (
            <>
              <TabsTrigger value="my-courses">My Courses</TabsTrigger>
              <TabsTrigger value="browse-courses">Browse Courses</TabsTrigger>
            </>
          )}
          {role === 'freelancer' && (
            <>
              <TabsTrigger value="my-courses">My Courses</TabsTrigger>
              <TabsTrigger value="student-progress">Student Progress</TabsTrigger>
              <TabsTrigger value="create-course">Create Course</TabsTrigger>
            </>
          )}
        </TabsList>
        
        {/* Client View - My Courses */}
        <TabsContent value="my-courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCourses.filter((_, index) => index < 2).map(course => (
              <Card key={course.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{course.duration} min</span>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge variant="outline" className={getLevelColor(course.level)}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                    {role === 'client' && (
                      <Badge variant={mockProgress.find(p => p.resourceId === course.id)?.completed 
                        ? "success" : "secondary"}>
                        {mockProgress.find(p => p.resourceId === course.id)?.completed 
                          ? "Completed" 
                          : `${mockProgress.find(p => p.resourceId === course.id)?.progress || 0}% Complete`}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {course.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-normal text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {getResourceTypeIcon(course.type)}
                    <span className="ml-1 capitalize">{course.type}</span>
                  </div>
                  {role === 'client' && (
                    <Button variant="default" size="sm">
                      {mockProgress.find(p => p.resourceId === course.id)?.completed 
                        ? "Review" : "Continue"}
                    </Button>
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
        
        {/* Client View - Browse Courses */}
        <TabsContent value="browse-courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCourses.map(course => (
              <Card key={course.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge variant="outline" className={getLevelColor(course.level)}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {course.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-normal text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {getResourceTypeIcon(course.type)}
                    <span className="ml-1 capitalize">{course.type}</span>
                  </div>
                  <Button variant="default" size="sm">Enroll</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Tutor View - Student Progress */}
        {role === 'freelancer' && (
          <TabsContent value="student-progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>View how your students are doing with your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Total Students</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-2xl font-bold">42</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Course Completion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-2xl font-bold">78%</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Active Learners</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-2xl font-bold">24</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {/* Tutor View - Create Course */}
        {role === 'freelancer' && (
          <TabsContent value="create-course" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Language Course</CardTitle>
                <CardDescription>Design and publish a new course for your students</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Course creation form would be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CourseManagement;
