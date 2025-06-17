
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { isModerator } = useRoles();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: 'ri-home-4-line' },
    { name: 'Explore', path: '/explore', icon: 'ri-compass-3-line' },
    { name: 'Comparisons', path: '/comparisons', icon: 'ri-scales-3-line' },
    { name: 'Submit Tool', path: '/submit', icon: 'ri-add-circle-line' },
  ];

  // Add admin link for moderators and admins
  if (user && isModerator()) {
    navItems.push({ name: 'Admin', path: '/admin', icon: 'ri-shield-user-line' });
  }

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-robot-2-fill text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              A2Z AI Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <i className={`${item.icon} text-base`}></i>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <i className="ri-user-line mr-2"></i>
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <i className="ri-logout-box-line mr-2"></i>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  <i className="ri-login-box-line mr-2"></i>
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
              className="p-2"
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center space-x-3 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      <i className="ri-user-line mr-3 text-lg"></i>
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                    <i className="ri-logout-box-line mr-3 text-lg"></i>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                    <i className="ri-login-box-line mr-2"></i>
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
