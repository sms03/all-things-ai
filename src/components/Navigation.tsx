
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User, LogIn, Plus, Zap, Brain } from 'lucide-react';
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
    <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
      isScrolled ? 'navbar-small' : 'navbar-large'
    }`}>
      <div className={`glass rounded-full px-6 transition-all duration-300 ease-in-out ${
        isScrolled ? 'py-2' : 'py-4'
      } shadow-2xl border border-white/20`}>
        <div className="flex items-center justify-between space-x-8">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold transition-all duration-300 ${
              isScrolled ? 'text-lg' : 'text-xl'
            }`}
          >
            <div className="relative">
              <Brain className={`transition-all duration-300 ${isScrolled ? 'w-6 h-6' : 'w-8 h-8'} text-blue-500 animate-pulse-glow`} />
              <Zap className={`absolute -top-1 -right-1 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-400`} />
            </div>
            <span className="hidden sm:block">A2Z AI Tools</span>
            <span className="sm:hidden">A2Z</span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-3">
            {/* Populate Tools - Hidden on mobile when scrolled */}
            <div className={`transition-all duration-300 ${isScrolled ? 'hidden md:block' : 'block'}`}>
              <PopulateTools />
            </div>
            
            {/* Submit Tool Button */}
            <Link to="/submit-tool">
              <Button 
                variant="outline" 
                size={isScrolled ? "sm" : "default"}
                className="glass-card border-white/20 hover:glass hover:border-white/30 transition-all duration-300 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
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
                  className="glass-card border-white/20 hover:glass hover:border-white/30 transition-all duration-300 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <Avatar className={`transition-all duration-300 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6'} mr-2`}>
                    <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
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
                  className="glass-card border-white/20 hover:glass hover:border-white/30 transition-all duration-300 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
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
