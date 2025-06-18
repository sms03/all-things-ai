
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Star, TrendingUp } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { useTopRatedTools } from '@/hooks/useTopRatedTools';

const TopRatedTools = () => {
  const { topRatedTools, loading } = useTopRatedTools(8);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && sectionRef.current && topRatedTools.length > 0) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.tool-card'),
        { opacity: 0, scale: 0.8, y: 50 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)"
        }
      );
    }
  }, [loading, topRatedTools]);

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-gray-900">Loading top-rated tools...</div>
          </div>
        </div>
      </section>
    );
  }

  if (topRatedTools.length === 0) {
    return (
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <Star className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Rated Tools Yet</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Be the first to rate and review AI tools to help others discover the best ones!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            <TrendingUp className="inline-block w-10 h-10 mr-4 text-blue-600" />
            Top Rated Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the highest-rated AI tools based on real user reviews and ratings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {topRatedTools.map((tool, index) => (
            <div key={tool.id} className="tool-card h-full">
              <ToolCard tool={tool} index={index} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/explore">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg h-12 transition-all duration-300 hover:scale-105">
              <Star className="w-5 h-5 mr-2" />
              Explore All Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopRatedTools;
