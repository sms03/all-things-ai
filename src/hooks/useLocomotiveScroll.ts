import { useEffect, useRef } from 'react';

export const useLocomotiveScroll = (start: boolean = true) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<any>(null);

  useEffect(() => {
    if (!start) return;

    const initializeScroll = async () => {
      try {
        console.log('Initializing Locomotive Scroll...');
        
        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        
        if (!scrollRef.current) {
          console.error('Locomotive Scroll: Container ref is null');
          return;
        }

        if (locomotiveScrollRef.current) {
          console.log('Locomotive Scroll: Already initialized, destroying previous instance');
          locomotiveScrollRef.current.destroy();
          locomotiveScrollRef.current = null;
        }

        // Ensure the container has the correct properties
        const container = scrollRef.current;
        container.style.position = 'relative';
        container.style.minHeight = '100vh';

        console.log('Locomotive Scroll: Creating new instance with container:', container);

        locomotiveScrollRef.current = new LocomotiveScroll({
          el: container,
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
        });

        console.log('Locomotive Scroll: Instance created successfully');

        // Expose to global window for debugging
        (window as any).locomotive = locomotiveScrollRef.current;

        // Update scroll after initialization
        setTimeout(() => {
          if (locomotiveScrollRef.current) {
            console.log('Locomotive Scroll: Updating after initialization');
            locomotiveScrollRef.current.update();
          }
        }, 500);

        // Update scroll on window resize
        const handleResize = () => {
          if (locomotiveScrollRef.current) {
            console.log('Locomotive Scroll: Updating on resize');
            locomotiveScrollRef.current.update();
          }
        };

        const handleLoad = () => {
          if (locomotiveScrollRef.current) {
            console.log('Locomotive Scroll: Updating on load');
            locomotiveScrollRef.current.update();
          }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('load', handleLoad);

        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('load', handleLoad);
        };
      } catch (error) {
        console.error('Failed to initialize Locomotive Scroll:', error);
      }
    };

    initializeScroll();

    return () => {
      if (locomotiveScrollRef.current) {
        console.log('Locomotive Scroll: Destroying instance');
        locomotiveScrollRef.current.destroy();
        locomotiveScrollRef.current = null;
      }
    };
  }, [start]);

  const updateScroll = () => {
    if (locomotiveScrollRef.current) {
      console.log('Locomotive Scroll: Manual update called');
      locomotiveScrollRef.current.update();
    } else {
      console.log('Locomotive Scroll: Cannot update - no instance');
    }
  };

  const scrollTo = (target: string | HTMLElement, options?: any) => {
    if (locomotiveScrollRef.current) {
      console.log('Locomotive Scroll: Scrolling to:', target);
      locomotiveScrollRef.current.scrollTo(target, options);
    } else {
      console.log('Locomotive Scroll: Cannot scroll - no instance');
    }
  };

  return { scrollRef, updateScroll, scrollTo, locomotive: locomotiveScrollRef.current };
};
