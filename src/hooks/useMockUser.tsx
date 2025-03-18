
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock interpreter data for Maria Rodriguez
export const mariaMockData = {
  id: "maria-rodriguez",
  name: "Maria Rodriguez",
  languages: ["Spanish", "English"],
  image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  online: true,
  rating: 4.9,
  reviews: 241,
  availability: "Available 9AM-5PM EST",
  specialties: ["Medical", "Legal", "Technical"],
  jobsCompleted: 183,
  type: "Certified",
  isNative: true
};

export const useMockUser = () => {
  const [isMockUser, setIsMockUser] = useState(false);
  const [mockUserType, setMockUserType] = useState<string | null>(null);
  
  // Use try/catch to handle cases when this hook might be used outside Router context
  let location;
  let navigate;
  
  try {
    location = useLocation();
    navigate = useNavigate();
  } catch (error) {
    console.warn('useMockUser: Router hooks not available, using fallback');
    location = { search: '', pathname: '' };
    navigate = () => {};
  }

  useEffect(() => {
    // Skip if not in Router context
    if (!location) return;
    
    // Check URL for mock_user parameter
    const params = new URLSearchParams(location.search);
    const mockUser = params.get('mock_user');
    
    if (mockUser) {
      // Handle different mock user types
      if (mockUser.toLowerCase() === 'maria') {
        setIsMockUser(true);
        setMockUserType('interpreter');
        localStorage.setItem('mockUser', 'maria');
        toast.success('Logged in as Maria Rodriguez (Interpreter)');
        
        // Remove query parameter without reloading the page
        if (navigate) {
          navigate(location.pathname, { replace: true });
        }
      } else if (mockUser.toLowerCase() === 'client') {
        setIsMockUser(true);
        setMockUserType('client');
        localStorage.setItem('mockUser', 'client');
        toast.success('Logged in as Test Client');
        
        // Remove query parameter without reloading the page
        if (navigate) {
          navigate(location.pathname, { replace: true });
        }
      } else {
        // Invalid mock user
        toast.error('Invalid mock user type');
        localStorage.removeItem('mockUser');
        setIsMockUser(false);
        setMockUserType(null);
        
        // Remove query parameter without reloading the page
        if (navigate) {
          navigate(location.pathname, { replace: true });
        }
      }
    } else {
      // Check if we have a mock user in localStorage
      const storedMockUser = localStorage.getItem('mockUser');
      if (storedMockUser) {
        if (storedMockUser === 'maria') {
          setIsMockUser(true);
          setMockUserType('interpreter');
        } else if (storedMockUser === 'client') {
          setIsMockUser(true);
          setMockUserType('client');
        }
      }
    }
  }, [location, navigate]);

  // Function to clear mock user
  const clearMockUser = () => {
    localStorage.removeItem('mockUser');
    setIsMockUser(false);
    setMockUserType(null);
    toast.success('Logged out mock user');
  };

  return {
    isMockUser,
    mockUserType,
    clearMockUser,
    mockData: mockUserType === 'interpreter' ? mariaMockData : null
  };
};
