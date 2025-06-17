
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
  const navRef = useRef<HTMLNavElement>(null);

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
    <nav ref={navRef} className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <i className="ri-robot-2-fill text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
              A2Z AI Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-xl'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
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
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
                  >
                    <i className="ri-user-line mr-2"></i>
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
                >
                  <i className="ri-logout-box-line mr-2"></i>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
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
              className="p-3 rounded-full text-white hover:bg-white/10 transition-all duration-300"
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/20 px-8 py-6 space-y-4 bg-white/5 backdrop-blur-xl rounded-b-3xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 flex items-center space-x-3 ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-white/20 space-y-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start px-4 py-3 rounded-2xl text-base text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
                      <i className="ri-user-line mr-3 text-lg"></i>
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start px-4 py-3 rounded-2xl text-base text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
                    <i className="ri-logout-box-line mr-3 text-lg"></i>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-2xl shadow-lg transition-all duration-300 border-0">
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
