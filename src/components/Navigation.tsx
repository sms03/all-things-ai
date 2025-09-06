import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading: rolesLoading } = useRoles();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: 'ri-home-4-line' },
    { name: 'Explore', path: '/explore', icon: 'ri-compass-3-line' },
    { name: 'Project Ideas', path: '/project-ideas', icon: 'ri-lightbulb-line' },
    { name: 'Comparisons', path: '/comparisons', icon: 'ri-scales-3-line' },
    { name: 'Submit Tool', path: '/submit', icon: 'ri-add-circle-line' },
  ];

  // Add admin link for admins only
  const onAdminRoute = location.pathname.startsWith('/admin');
  if (user && (isAdmin() || rolesLoading || onAdminRoute)) {
    navItems.push({ name: 'Admin', path: '/admin', icon: 'ri-shield-user-line' });
  }
  return (
    <>
      {/* Main Pill Navigation */}
      <nav 
        ref={navRef} 
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50' 
            : 'bg-white/80 backdrop-blur-md shadow-md border border-gray-200/30'
        } rounded-full`}
      >
        <div className="flex items-center px-4 sm:px-6 py-2 max-w-fit mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mr-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
              <i className="ri-robot-2-fill text-white text-lg"></i>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block whitespace-nowrap">
              All Things AI
            </span>
          </Link>

          {/* Desktop Navigation Pills */}
          <div className="hidden md:flex items-center space-x-1 mr-2">
            {navItems.map((item) => (
              <div key={`nav-${item.path}`} className="flex items-center">
                {item.path === '/admin' && (
                  <span
                    className="mx-1 h-5 w-px bg-gray-300/80 dark:bg-gray-600/80"
                    aria-hidden="true"
                  />
                )}
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Separator between last nav pill and Profile for non-admin users (desktop) */}
          {user && !isAdmin() && (
            <span
              className="hidden md:block h-6 w-px bg-gray-300/80 dark:bg-gray-600/80 mr-2"
              aria-hidden="true"
            />
          )}

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-1">
                <Link to="/profile">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-full px-3 py-2 text-sm"
                  >
                    <i className="ri-user-line text-sm"></i>
                    <span className="hidden lg:block ml-2">Profile</span>
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-gray-900 hover:bg-red-600 rounded-full px-3 py-2 text-sm"
                >
                  <i className="ri-logout-box-line text-sm"></i>
                  <span className="hidden lg:block ml-2">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-red-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm shadow-md transition-all duration-200 hover:shadow-lg">
                  <i className="ri-login-box-line text-sm"></i>
                  <span className="hidden lg:block ml-2">Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100/80"
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-lg`}></i>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <div className="space-y-3">
              {navItems.map((item) => (
                <div key={`mobile-${item.path}`}> 
                  {item.path === '/admin' && (
                    <div className="my-1 border-t border-gray-200/60 dark:border-gray-700/60" />
                  )}
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center space-x-3 ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <i className={`${item.icon} text-lg`}></i>
                    <span>{item.name}</span>
                  </Link>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200/50 space-y-3">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl">
                        <i className="ri-user-line mr-3 text-lg"></i>
                        Profile
                      </Button>
                    </Link>
                    <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start px-4 py-3 text-gray-600 hover:bg-gray-500 hover:text-gray-900 rounded-xl">
                      <i className="ri-logout-box-line mr-3 text-lg"></i>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md">
                      <i className="ri-login-box-line mr-2"></i>
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
