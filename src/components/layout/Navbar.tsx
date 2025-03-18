
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if the link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-medium">Interpreter</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-foreground' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/interpreters" 
              className={`text-sm font-medium transition-colors ${
                isActive('/interpreters') ? 'text-foreground' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Interpreters
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-sm font-medium transition-colors ${
                isActive('/how-it-works') ? 'text-foreground' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing') ? 'text-foreground' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="h-9">
              <Phone className="h-4 w-4 mr-2" />
              Book a Call
            </Button>
            <Button size="sm" className="h-9">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 py-3 space-y-1 bg-white/95 backdrop-blur-md shadow-medium">
            <Link
              to="/"
              className={`block py-2 px-3 text-base font-medium rounded-md hover:bg-accent transition-colors ${
                isActive('/') ? 'bg-accent/50' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/interpreters"
              className={`block py-2 px-3 text-base font-medium rounded-md hover:bg-accent transition-colors ${
                isActive('/interpreters') ? 'bg-accent/50' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Interpreters
            </Link>
            <Link
              to="/how-it-works"
              className={`block py-2 px-3 text-base font-medium rounded-md hover:bg-accent transition-colors ${
                isActive('/how-it-works') ? 'bg-accent/50' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/pricing"
              className={`block py-2 px-3 text-base font-medium rounded-md hover:bg-accent transition-colors ${
                isActive('/pricing') ? 'bg-accent/50' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-4 flex flex-col space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Book a Call
              </Button>
              <Button className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
