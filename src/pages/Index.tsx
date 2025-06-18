
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import TrendingTools from '@/components/TrendingTools';
import TopRatedTools from '@/components/TopRatedTools';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';

const Index = () => {
  const { tools, loading } = useSupabaseData();
  const { trackEvent } = useAnalytics();
  const containerRef = useRef<HTMLDivElement>(null);

  // Track page view
  useEffect(() => {
    trackEvent('page_view', { page: 'home' });
  }, [trackEvent]);

  // GSAP animations on mount
  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center bg-white border border-gray-200 rounded-lg p-12 shadow-sm max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto mb-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-gray-900 mb-2">Loading AI tools</div>
            <div className="text-gray-600 text-sm">Discovering the future of AI</div>
          </div>
        </div>
      </div>
    );
  }

  // Get trending tools (top rated and most recent)
  const trendingTools = tools
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div ref={containerRef} className="pt-4">
        <Hero />
        <TopRatedTools />
        <TrendingTools tools={trendingTools} />
      </div>
    </div>
  );
};

export default Index;
