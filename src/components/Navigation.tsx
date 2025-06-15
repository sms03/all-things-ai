
import { useState } from 'react';
import { Menu, X, Search, Scale, User, BookOpen, Plus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl dark:bg-black/95 border-b border-gray-100/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Search className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              AI Tools Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Browse Tools
            </Link>
            {user && (
              <Link 
                to="/comparisons" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center space-x-1"
              >
                <Scale className="w-4 h-4" />
                <span>Comparisons</span>
              </Link>
            )}
            <Link 
              to="/submit-tool" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Tool</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/comparisons" className="flex items-center">
                      <Scale className="mr-2 h-4 w-4" />
                      <span>My Comparisons</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="rounded-full">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 border-t border-gray-100/20 dark:border-white/10 mt-4 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Browse Tools
              </Link>
              {user && (
                <Link 
                  to="/comparisons" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center space-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  <Scale className="w-4 h-4" />
                  <span>Comparisons</span>
                </Link>
              )}
              <Link 
                to="/submit-tool" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center space-x-1"
                onClick={() => setIsOpen(false)}
              >
                <Plus className="w-4 h-4" />
                <span>Submit Tool</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
