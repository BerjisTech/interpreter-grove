
import { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  Languages, 
  Users, 
  Star, 
  Clock, 
  Briefcase,
  Stethoscope,
  Scale,
  Cpu,
  GraduationCap,
  Building2
} from 'lucide-react';

// Languages available for filtering
const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Russian',
  'Arabic', 'Portuguese', 'Japanese', 'Hindi', 'Korean', 'Italian'
];

// Specialties available for filtering
const SPECIALTIES = [
  { name: 'Medical', icon: Stethoscope },
  { name: 'Legal', icon: Scale },
  { name: 'Technical', icon: Cpu },
  { name: 'Education', icon: GraduationCap },
  { name: 'Business', icon: Building2 }
];

interface FiltersProps {
  filters: {
    languages: string[];
    isNative: boolean | null;
    minRating: number;
    maxRating: number;
    type: string;
    availability: string;
    minJobsCompleted: number;
    minHours: number;
    specialties: string[];
    searchQuery: string;
  };
  setFilters: (filters: any) => void;
}

const InterpreterFilters = ({ filters, setFilters }: FiltersProps) => {
  // Track if an individual filter is active
  const hasActiveFilters = 
    filters.languages.length > 0 || 
    filters.isNative !== null || 
    filters.minRating > 0 || 
    filters.type !== 'all' || 
    filters.availability !== 'all' || 
    filters.minJobsCompleted > 0 || 
    filters.minHours > 0 ||
    filters.specialties.length > 0;

  // Handle language filter changes
  const handleLanguageChange = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    setFilters({ ...filters, languages: newLanguages });
  };

  // Handle specialty filter changes
  const handleSpecialtyChange = (specialty: string) => {
    const newSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    setFilters({ ...filters, specialties: newSpecialties });
  };

  return (
    <Card className="border border-border/40 bg-background/60 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-lg">Advanced Filters</h3>
          </div>
          {hasActiveFilters && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {filters.languages.length + filters.specialties.length + 
                (filters.isNative !== null ? 1 : 0) + 
                (filters.minRating > 0 ? 1 : 0) + 
                (filters.type !== 'all' ? 1 : 0) + 
                (filters.availability !== 'all' ? 1 : 0) + 
                (filters.minJobsCompleted > 0 ? 1 : 0) + 
                (filters.minHours > 0 ? 1 : 0)
              } active
            </Badge>
          )}
        </div>

        <Tabs defaultValue="languages" className="mt-4">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="languages" className="flex gap-1 items-center">
              <Languages className="h-4 w-4" />
              <span>Languages</span>
            </TabsTrigger>
            <TabsTrigger value="expertise" className="flex gap-1 items-center">
              <Star className="h-4 w-4" />
              <span>Expertise</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex gap-1 items-center">
              <Briefcase className="h-4 w-4" />
              <span>Experience</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex gap-1 items-center">
              <Clock className="h-4 w-4" />
              <span>Type</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mt-3">
                {LANGUAGES.map((language) => (
                  <Badge 
                    key={language}
                    variant={filters.languages.includes(language) ? "default" : "outline"} 
                    className={`cursor-pointer px-3 py-1 text-sm ${
                      filters.languages.includes(language) 
                        ? 'bg-primary/90 text-primary-foreground hover:bg-primary/70' 
                        : 'bg-accent/50 hover:bg-accent'
                    }`}
                    onClick={() => handleLanguageChange(language)}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="native" 
                  checked={filters.isNative === true}
                  onCheckedChange={(checked) => {
                    setFilters({ 
                      ...filters, 
                      isNative: checked === true ? true : checked === false ? false : null 
                    });
                  }}
                />
                <Label htmlFor="native" className="cursor-pointer">Native speakers only</Label>
              </div>
            </div>
          </TabsContent>
          
          {/* Expertise Tab */}
          <TabsContent value="expertise" className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[filters.minRating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => setFilters({ ...filters, minRating: value[0] })}
                  className="flex-1"
                />
                <span className="w-10 text-center font-medium flex items-center gap-1">
                  {filters.minRating} <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <Label className="text-sm font-medium mb-3 block">Specialties</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-3">
                {SPECIALTIES.map((specialty) => (
                  <Badge 
                    key={specialty.name}
                    variant={filters.specialties.includes(specialty.name) ? "default" : "outline"} 
                    className={`cursor-pointer px-3 py-2 h-auto flex items-center justify-center gap-1.5 ${
                      filters.specialties.includes(specialty.name) 
                        ? 'bg-primary/90 text-primary-foreground hover:bg-primary/70' 
                        : 'bg-accent/50 hover:bg-accent'
                    }`}
                    onClick={() => handleSpecialtyChange(specialty.name)}
                  >
                    <specialty.icon className="h-3.5 w-3.5" />
                    {specialty.name}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Minimum Jobs Completed
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[filters.minJobsCompleted]}
                  min={0}
                  max={500}
                  step={25}
                  onValueChange={(value) => setFilters({ ...filters, minJobsCompleted: value[0] })}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">
                  {filters.minJobsCompleted}+
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <Label className="text-sm font-medium mb-3 block">
                Minimum Hours Completed
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[filters.minHours]}
                  min={0}
                  max={2000}
                  step={100}
                  onValueChange={(value) => setFilters({ ...filters, minHours: value[0] })}
                  className="flex-1"
                />
                <span className="w-16 text-center font-medium">
                  {filters.minHours}+ hrs
                </span>
              </div>
            </div>
          </TabsContent>
          
          {/* Type Tab */}
          <TabsContent value="availability" className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Interpreter Type</Label>
              <RadioGroup 
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="type-all" />
                  <Label htmlFor="type-all">All Interpreters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freelance" id="type-freelance" />
                  <Label htmlFor="type-freelance">Freelance Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agency" id="type-agency" />
                  <Label htmlFor="type-agency">Agency Only</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <Label className="text-sm font-medium mb-3 block">Availability</Label>
              <RadioGroup 
                value={filters.availability}
                onValueChange={(value) => setFilters({ ...filters, availability: value })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="availability-all" />
                  <Label htmlFor="availability-all">All Interpreters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="availability-online" />
                  <Label htmlFor="availability-online">Available Now</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InterpreterFilters;
