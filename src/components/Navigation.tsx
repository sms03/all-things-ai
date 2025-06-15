
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
      isScrolled ? 'py-3' : 'py-6'
    } bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-3 text-gray-900 dark:text-white font-bold transition-all duration-500 hover:scale-105 ${
              isScrolled ? 'text-xl' : 'text-2xl'
            }`}
          >
            <div className={`bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 rounded-2xl p-2 transition-all duration-500 ${
              isScrolled ? 'w-8 h-8' : 'w-10 h-10'
            }`}>
              <Brain className={`text-white dark:text-black transition-all duration-500 ${isScrolled ? 'w-4 h-4' : 'w-6 h-6'}`} />
            </div>
            <span className="hidden sm:block">A2Z AI Tools</span>
            <span className="sm:hidden">A2Z</span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Populate Tools */}
            <div className={`transition-all duration-500 ${isScrolled ? 'hidden md:block' : 'block'}`}>
              <PopulateTools />
            </div>
            
            {/* Submit Tool Button */}
            <Link to="/submit-tool">
              <Button 
                variant="ghost" 
                size={isScrolled ? "sm" : "default"}
                className={`font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105 ${
                  isScrolled ? 'h-9 px-4 text-sm' : 'h-11 px-6 text-base'
                }`}
              >
                <Plus className={`mr-2 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
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
                  className={`font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'h-9 px-4' : 'h-11 px-4'
                  }`}
                >
                  <Avatar className={`mr-2 transition-all duration-300 ${isScrolled ? 'w-6 h-6' : 'w-7 h-7'}`}>
                    <AvatarFallback className="text-sm bg-gradient-to-br from-black to-gray-700 text-white dark:from-white dark:to-gray-300 dark:text-black font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="ghost" 
                  size={isScrolled ? "sm" : "default"}
                  className={`font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'h-9 px-4 text-sm' : 'h-11 px-6 text-base'
                  }`}
                >
                  <LogIn className={`mr-2 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
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
