import React, { useEffect, ReactNode, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface LocomotiveScrollProviderProps {
  children: ReactNode;
  options?: any;
}

export const LocomotiveScrollProvider: React.FC<LocomotiveScrollProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveRef = useRef<any>(null);
  const location = useLocation();

  useEffect(() => {
    const initLocomotiveScroll = async () => {
      try {
        console.log('LocomotiveScrollProvider: Initializing...');
        
        // Dynamic import
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        
        if (!scrollRef.current) {
          console.error('LocomotiveScrollProvider: No scroll container ref');
          return;
        }

        // Destroy existing instance
        if (locomotiveRef.current) {
          console.log('LocomotiveScrollProvider: Destroying existing instance');
          locomotiveRef.current.destroy();
        }

        console.log('LocomotiveScrollProvider: Creating new instance');
        locomotiveRef.current = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
          multiplier: 1.5,
          class: 'is-revealed',
          scrollbarContainer: false,
          lerp: 0.08,
          smartphone: {
            smooth: true,
            breakpoint: 767,
          },
          tablet: {
            smooth: true,
            breakpoint: 1024,
          },
          reloadOnContextChange: true,
          touchMultiplier: 2,
          smoothMobile: true,
          normalizeWheel: true,
          scrollFromAnywhere: true,
          getDirection: true,
          getSpeed: true,
          ...options
        });

        // Expose globally for debugging
        (window as any).locomotive = locomotiveRef.current;
        
        console.log('LocomotiveScrollProvider: Instance created', locomotiveRef.current);

        // Initial update
        setTimeout(() => {
          if (locomotiveRef.current) {
            locomotiveRef.current.update();
            console.log('LocomotiveScrollProvider: Updated');
          }
        }, 500);

      } catch (error) {
        console.error('LocomotiveScrollProvider: Failed to initialize', error);
      }
    };

    // Wait for DOM to be ready
    const timer = setTimeout(initLocomotiveScroll, 100);

    return () => {
      clearTimeout(timer);
      if (locomotiveRef.current) {
        console.log('LocomotiveScrollProvider: Cleaning up');
        locomotiveRef.current.destroy();
        locomotiveRef.current = null;
      }
    };
  }, []);

  // Update on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locomotiveRef.current) {
        console.log('LocomotiveScrollProvider: Updating after route change');
        locomotiveRef.current.update();
        locomotiveRef.current.scrollTo(0, { duration: 0 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      ref={scrollRef} 
      data-scroll-container
      style={{ 
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

export default LocomotiveScrollProvider;
