
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 border-b border-gray-100/20 dark:border-gray-800/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <span className="text-white dark:text-gray-900 text-xl font-bold ibm-plex-serif-bold">A</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight ibm-plex-serif-bold">
              A2Z AI Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-base font-medium transition-all duration-200 flex items-center space-x-2 ibm-plex-serif-medium ${
                  location.pathname === item.path
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.name === 'Admin' && <Shield className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 ibm-plex-serif-medium px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="flex items-center space-x-2 ibm-plex-serif-medium px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="ibm-plex-serif-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100/20 dark:border-gray-800/20 py-6 space-y-2 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 flex items-center space-x-3 ibm-plex-serif-medium ${
                  location.pathname === item.path
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.name === 'Admin' && <Shield className="w-5 h-5" />}
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-100/20 dark:border-gray-800/20 space-y-2">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start px-4 py-3 rounded-xl ibm-plex-serif-medium text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                      <User className="w-5 h-5 mr-3" />
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start px-4 py-3 rounded-xl ibm-plex-serif-medium text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full ibm-plex-serif-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 py-3 rounded-xl shadow-lg transition-all duration-200">
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
