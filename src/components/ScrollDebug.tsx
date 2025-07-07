import React, { useEffect, useState } from 'react';

export const ScrollDebug: React.FC = () => {
  const [scrollInfo, setScrollInfo] = useState({
    hasLocomotive: false,
    isScrolling: false,
    scrollY: 0,
    containerHeight: 0,
    hasScrollContainer: false,
    hasScrollSections: 0,
    hasScrollElements: 0,
    htmlClass: '',
    bodyClass: '',
  });

  useEffect(() => {
    const checkLocomotiveScroll = () => {
      const container = document.querySelector('[data-scroll-container]');
      const sections = document.querySelectorAll('[data-scroll-section]');
      const elements = document.querySelectorAll('[data-scroll]');
      const hasLocomotive = !!(window as any).locomotive;
      
      setScrollInfo(prev => ({
        ...prev,
        hasLocomotive,
        containerHeight: container?.scrollHeight || 0,
        hasScrollContainer: !!container,
        hasScrollSections: sections.length,
        hasScrollElements: elements.length,
        htmlClass: document.documentElement.className,
        bodyClass: document.body.className,
      }));
    };

    const handleScroll = () => {
      setScrollInfo(prev => ({
        ...prev,
        isScrolling: true,
        scrollY: window.scrollY,
      }));

      setTimeout(() => {
        setScrollInfo(prev => ({
          ...prev,
          isScrolling: false,
        }));
      }, 100);
    };

    checkLocomotiveScroll();
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(checkLocomotiveScroll, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50 font-mono max-w-sm">
      <div className="font-bold mb-2">Locomotive Scroll Debug</div>
      <div>Instance: {scrollInfo.hasLocomotive ? '✅' : '❌'}</div>
      <div>Container: {scrollInfo.hasScrollContainer ? '✅' : '❌'}</div>
      <div>Sections: {scrollInfo.hasScrollSections}</div>
      <div>Elements: {scrollInfo.hasScrollElements}</div>
      <div>Scrolling: {scrollInfo.isScrolling ? '✅' : '❌'}</div>
      <div>Scroll Y: {scrollInfo.scrollY}</div>
      <div>Container Height: {scrollInfo.containerHeight}</div>
      <div>HTML Class: {scrollInfo.htmlClass || 'none'}</div>
      <div>Body Class: {scrollInfo.bodyClass || 'none'}</div>
    </div>
  );
};

export default ScrollDebug;
