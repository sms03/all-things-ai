
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import TrendingTools from '@/components/TrendingTools';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Background } from '@/components/Background';

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
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-16 shadow-2xl animate-fade-in max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-8 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-white mb-3 tracking-tight">Loading AI tools</div>
            <div className="text-white/70 text-sm">Discovering the future of AI</div>
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
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      <div ref={containerRef} className="pt-20">
        <Hero />
        <TrendingTools tools={trendingTools} />
      </div>
    </div>
  );
};

export default Index;
