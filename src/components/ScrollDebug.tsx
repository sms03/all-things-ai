import React, { useEffect, useState } from 'react';

export const ScrollDebug: React.FC = () => {
  const [scrollInfo, setScrollInfo] = useState({
    isScrolling: false,
    scrollY: 0,
    pageHeight: 0,
    windowHeight: 0,
  });

  useEffect(() => {
    const updateScrollInfo = () => {
      setScrollInfo(prev => ({
        ...prev,
        pageHeight: document.body.scrollHeight,
        windowHeight: window.innerHeight,
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

    updateScrollInfo();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateScrollInfo);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollInfo);
    };
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50 font-mono max-w-sm">
      <div className="font-bold mb-2">Scroll Debug</div>
      <div>Scrolling: {scrollInfo.isScrolling ? '✅' : '❌'}</div>
      <div>Scroll Y: {scrollInfo.scrollY}</div>
      <div>Page Height: {scrollInfo.pageHeight}</div>
      <div>Window Height: {scrollInfo.windowHeight}</div>
      <div>Progress: {((scrollInfo.scrollY / (scrollInfo.pageHeight - scrollInfo.windowHeight)) * 100).toFixed(1)}%</div>
    </div>
  );
};

export default ScrollDebug;
