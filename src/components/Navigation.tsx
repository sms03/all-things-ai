
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { User, LogOut, Settings, Menu, X, Shield } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { isModerator } = useRoles();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Comparisons', path: '/comparisons' },
    { name: 'Submit Tool', path: '/submit' },
  ];

  // Add admin link for moderators and admins
  if (user && isModerator()) {
    navItems.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl dark:bg-black/95 border-b border-gray-100/20 dark:border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white dark:text-gray-900 text-lg font-bold">A</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              A2Z AI Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-base font-medium transition-colors duration-300 flex items-center space-x-1 ${
                  location.pathname === item.path
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.name === 'Admin' && <Shield className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100/20 dark:border-white/10 py-6 space-y-4 bg-white/95 backdrop-blur-xl dark:bg-black/95">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-lg font-medium transition-colors duration-300 flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.name === 'Admin' && <Shield className="w-5 h-5" />}
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-100/20 dark:border-white/10">
              {user ? (
                <div className="space-y-4">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" size="sm" className="w-full justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
