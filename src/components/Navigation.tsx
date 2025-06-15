
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User, LogIn, Plus, Brain } from 'lucide-react';
import PopulateTools from './PopulateTools';

const Navigation = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled ? 'py-2' : 'py-4'
    } bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-2 text-black dark:text-white ibm-plex-serif-bold transition-all duration-300 ${
              isScrolled ? 'text-lg' : 'text-xl'
            }`}
          >
            <Brain className={`transition-all duration-300 ${isScrolled ? 'w-6 h-6' : 'w-8 h-8'}`} />
            <span className="hidden sm:block">A2Z AI Tools</span>
            <span className="sm:hidden">A2Z</span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Populate Tools */}
            <div className={`transition-all duration-300 ${isScrolled ? 'hidden md:block' : 'block'}`}>
              <PopulateTools />
            </div>
            
            {/* Submit Tool Button */}
            <Link to="/submit-tool">
              <Button 
                variant="outline" 
                size={isScrolled ? "sm" : "default"}
                className="ibm-plex-serif-medium border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                <Plus className={`transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
                <span className="hidden sm:inline">Submit Tool</span>
                <span className="sm:hidden">Submit</span>
              </Button>
            </Link>
            
            {/* User Authentication */}
            {user ? (
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size={isScrolled ? "sm" : "default"}
                  className="ibm-plex-serif-medium hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <Avatar className={`transition-all duration-300 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6'} mr-2`}>
                    <AvatarFallback className="text-xs bg-black text-white dark:bg-white dark:text-black">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  size={isScrolled ? "sm" : "default"}
                  className="ibm-plex-serif-medium border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  <LogIn className={`transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
