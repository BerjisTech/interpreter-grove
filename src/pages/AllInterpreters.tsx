
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InterpreterFilters from '@/components/interpreters/InterpreterFilters';
import InterpreterGrid from '@/components/interpreters/InterpreterGrid';
import { Interpreter } from '@/types/interpreter';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';

const AllInterpreters = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    languages: [],
    isNative: null,
    minRating: 0,
    maxRating: 5,
    type: 'all',
    availability: 'all',
    minJobsCompleted: 0,
    minHours: 0,
    specialties: [],
    searchQuery: '',
  });

  // Mock data for interpreters
  const interpreters: Interpreter[] = [
    {
      id: '1',
      name: 'Maria Rodriguez',
      languages: ['Spanish', 'English'],
      rating: 4.8,
      reviews: 127,
      availability: 'Weekdays 9AM-5PM',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop',
      specialties: ['Medical', 'Legal'],
      online: true,
      isNative: true,
      jobsCompleted: 245,
      hoursCompleted: 890,
      type: 'freelance'
    },
    {
      id: '2',
      name: 'John Kim',
      languages: ['Korean', 'English'],
      rating: 4.6,
      reviews: 98,
      availability: 'Weekends & Evenings',
      image: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?q=80&w=1000&auto=format&fit=crop',
      specialties: ['Technical', 'Business'],
      online: false,
      isNative: true,
      jobsCompleted: 178,
      hoursCompleted: 650,
      type: 'freelance'
    },
    {
      id: '3',
      name: 'Aisha Patel',
      languages: ['Hindi', 'Gujarati', 'English'],
      rating: 4.9,
      reviews: 203,
      availability: 'Available 24/7',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop',
      specialties: ['Medical', 'Education'],
      online: true,
      isNative: true,
      jobsCompleted: 312,
      hoursCompleted: 1120,
      type: 'agency'
    },
    {
      id: '4',
      name: 'Lukas Weber',
      languages: ['German', 'English', 'French'],
      rating: 4.7,
      reviews: 156,
      availability: 'Weekdays & Evenings',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop',
      specialties: ['Legal', 'Business'],
      online: true,
      isNative: true,
      jobsCompleted: 220,
      hoursCompleted: 780,
      type: 'agency'
    },
    {
      id: '5',
      name: 'Sofia Petrova',
      languages: ['Russian', 'English'],
      rating: 4.5,
      reviews: 87,
      availability: 'Weekdays 10AM-7PM',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
      specialties: ['Technical', 'Legal'],
      online: false,
      isNative: true,
      jobsCompleted: 142,
      hoursCompleted: 510,
      type: 'freelance'
    },
    {
      id: '6',
      name: 'Michael Chen',
      languages: ['Mandarin', 'Cantonese', 'English'],
      rating: 4.9,
      reviews: 211,
      availability: 'Flexible Hours',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
      specialties: ['Business', 'Education'],
      online: true,
      isNative: true,
      jobsCompleted: 298,
      hoursCompleted: 950,
      type: 'agency'
    },
    {
      id: '7',
      name: 'Emma Johnson',
      languages: ['English', 'French'],
      rating: 4.3,
      reviews: 65,
      availability: 'Weekdays Only',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      specialties: ['Medical'],
      online: false,
      isNative: false,
      jobsCompleted: 92,
      hoursCompleted: 310,
      type: 'freelance'
    },
    {
      id: '8',
      name: 'Carlos Mendez',
      languages: ['Spanish', 'Portuguese', 'English'],
      rating: 4.7,
      reviews: 167,
      availability: 'Evenings & Weekends',
      image: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=1000&auto=format&fit=crop',
      specialties: ['Legal', 'Medical'],
      online: true,
      isNative: true,
      jobsCompleted: 251,
      hoursCompleted: 870,
      type: 'agency'
    }
  ];

  const filteredInterpreters = interpreters.filter(interpreter => {
    // Filter by search query
    if (filters.searchQuery && !interpreter.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !interpreter.languages.some(lang => lang.toLowerCase().includes(filters.searchQuery.toLowerCase())) &&
        !interpreter.specialties.some(spec => spec.toLowerCase().includes(filters.searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Filter by languages
    if (filters.languages.length > 0 && !filters.languages.some(lang => interpreter.languages.includes(lang))) {
      return false;
    }
    
    // Filter by native speaker status
    if (filters.isNative !== null && interpreter.isNative !== filters.isNative) {
      return false;
    }
    
    // Filter by rating
    if (interpreter.rating < filters.minRating || interpreter.rating > filters.maxRating) {
      return false;
    }
    
    // Filter by type (freelance/agency)
    if (filters.type !== 'all' && interpreter.type !== filters.type) {
      return false;
    }
    
    // Filter by availability
    if (filters.availability === 'online' && !interpreter.online) {
      return false;
    }
    
    // Filter by jobs completed
    if (interpreter.jobsCompleted < filters.minJobsCompleted) {
      return false;
    }
    
    // Filter by hours completed
    if (interpreter.hoursCompleted < filters.minHours) {
      return false;
    }
    
    // Filter by specialties
    if (filters.specialties.length > 0 && !filters.specialties.some(spec => interpreter.specialties.includes(spec))) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Hero section */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Find Your Perfect Interpreter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with professional interpreters for any language, any time. Use our advanced filters to find the perfect match for your needs.
            </p>
          </div>
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-auto md:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, language or specialty..."
                className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.searchQuery}
                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center"
              >
                <Search className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFilters({
                  languages: [],
                  isNative: null,
                  minRating: 0,
                  maxRating: 5,
                  type: 'all',
                  availability: 'all',
                  minJobsCompleted: 0,
                  minHours: 0,
                  specialties: [],
                  searchQuery: '',
                })}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mb-8">
              <InterpreterFilters filters={filters} setFilters={setFilters} />
            </div>
          )}
          
          {/* Results Stats */}
          <div className="mb-6 text-sm text-muted-foreground">
            <p>
              Showing <span className="font-medium text-foreground">{filteredInterpreters.length}</span> interpreters
              {filters.languages.length > 0 && ` for ${filters.languages.join(', ')}`}
              {filters.specialties.length > 0 && ` in ${filters.specialties.join(', ')}`}
            </p>
          </div>
          
          {/* Results Grid */}
          <InterpreterGrid interpreters={filteredInterpreters} />
          
          {filteredInterpreters.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2">No interpreters found</h3>
              <p className="text-muted-foreground">Try adjusting your filters for more results.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AllInterpreters;
