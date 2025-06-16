
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Menu, X, BarChart3, Plus, Users, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/20 dark:bg-black/90 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
              AI Tools Directory
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "primary" : "ghost"}
                className="font-medium"
              >
                Discover
              </Button>
            </Link>
            <Link to="/comparisons">
              <Button 
                variant={isActive('/comparisons') ? "primary" : "ghost"}
                className="font-medium"
              >
                <Users className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </Link>
            {user && (
              <Link to="/analytics">
                <Button 
                  variant={isActive('/analytics') ? "primary" : "ghost"}
                  className="font-medium"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            )}
            <Link to="/submit">
              <Button 
                variant={isActive('/submit') ? "primary" : "ghost"}
                className="font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Tool
              </Button>
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button 
                    variant={isActive('/profile') ? "primary" : "ghost"}
                    size="sm"
                    className="font-medium"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="primary" className="font-medium">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100/20 dark:border-white/10">
            <div className="space-y-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive('/') ? "primary" : "ghost"}
                  className="w-full justify-start font-medium"
                >
                  Discover
                </Button>
              </Link>
              <Link to="/comparisons" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive('/comparisons') ? "primary" : "ghost"}
                  className="w-full justify-start font-medium"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </Link>
              {user && (
                <Link to="/analytics" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant={isActive('/analytics') ? "primary" : "ghost"}
                    className="w-full justify-start font-medium"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
              )}
              <Link to="/submit" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive('/submit') ? "primary" : "ghost"}
                  className="w-full justify-start font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Tool
                </Button>
              </Link>
              
              <div className="pt-4 border-t border-gray-100/20 dark:border-white/10">
                {user ? (
                  <div className="space-y-3">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant={isActive('/profile') ? "primary" : "ghost"}
                        className="w-full justify-start font-medium"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full font-medium">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
