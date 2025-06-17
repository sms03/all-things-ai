
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import ToolCard from '@/components/ToolCard';
import type { Tool } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';

interface TrendingToolsProps {
  tools: Tool[];
}

const TrendingTools = ({ tools }: TrendingToolsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.tool-card'),
        { opacity: 0, scale: 0.8, y: 50 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)",
          scrollTrigger: sectionRef.current
        }
      );
    }
  }, [tools]);

  return (
    <section ref={sectionRef} className="py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-6 tracking-tight">
            <i className="ri-fire-line mr-4"></i>
            Trending Tools
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
            Discover the most popular AI tools that are transforming workflows worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {tools.map((tool, index) => (
            <div key={tool.id} className="tool-card">
              <ToolCard tool={tool} index={index} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/explore">
            <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 px-8 py-4 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-105">
              <i className="ri-compass-3-line mr-2"></i>
              Explore All Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingTools;
