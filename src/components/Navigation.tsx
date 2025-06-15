
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User, LogIn, Plus, Brain } from 'lucide-react';
import { Button } from '@/components/Button';
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
      isScrolled ? 'py-2' : 'py-4'
    } bg-white/95 backdrop-blur-xl dark:bg-black/95 border-b border-gray-100/50 dark:border-white/10`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-3 text-gray-900 dark:text-white font-semibold transition-all duration-700 hover:scale-105 ${
              isScrolled ? 'text-xl' : 'text-2xl'
            }`}
          >
            <div className={`bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 rounded-2xl p-2 transition-all duration-700 ${
              isScrolled ? 'w-8 h-8' : 'w-10 h-10'
            } shadow-lg`}>
              <Brain className={`text-white dark:text-black transition-all duration-700 ${isScrolled ? 'w-4 h-4' : 'w-6 h-6'}`} />
            </div>
            <span className="hidden sm:block tracking-tight">A2Z AI Tools</span>
            <span className="sm:hidden">A2Z</span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-3">
            {/* Populate Tools */}
            <div className={`transition-all duration-700 ${isScrolled ? 'hidden md:block' : 'block'}`}>
              <PopulateTools />
            </div>
            
            {/* Submit Tool Button */}
            <Link to="/submit-tool">
              <Button 
                variant="outline" 
                size={isScrolled ? "sm" : "md"}
                className={`font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg ${
                  isScrolled ? 'h-9 px-4 text-sm' : 'h-11 px-6 text-base'
                }`}
              >
                <Plus className={`mr-2 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                <span className="hidden sm:inline tracking-tight">Submit Tool</span>
                <span className="sm:hidden">Submit</span>
              </Button>
            </Link>
            
            {/* User Authentication */}
            {user ? (
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size={isScrolled ? "sm" : "md"}
                  className={`font-medium rounded-full transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'h-9 px-4' : 'h-11 px-4'
                  }`}
                >
                  <Avatar className={`mr-2 transition-all duration-300 ${isScrolled ? 'w-6 h-6' : 'w-7 h-7'}`}>
                    <AvatarFallback className="text-sm bg-gradient-to-br from-gray-900 to-gray-700 text-white dark:from-white dark:to-gray-300 dark:text-black font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline tracking-tight">Profile</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  size={isScrolled ? "sm" : "md"}
                  className={`font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg ${
                    isScrolled ? 'h-9 px-4 text-sm' : 'h-11 px-6 text-base'
                  }`}
                >
                  <LogIn className={`mr-2 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  <span className="hidden sm:inline tracking-tight">Sign In</span>
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
