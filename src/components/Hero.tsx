import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const Hero = () => {
  const { tools, categories } = useSupabaseData();
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current && statsRef.current) {
      gsap.fromTo(heroRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
      );
      
      gsap.fromTo(statsRef.current.children,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.5 }
      );
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const aiAgentsCount = tools.filter(tool => 
    tool.tags?.some(tag => tag.toLowerCase().includes('agent')) ||
    tool.description?.toLowerCase().includes('agent')
  ).length;

  const mcpServersCount = tools.filter(tool => 
    tool.tags?.some(tag => tag.toLowerCase().includes('mcp')) ||
    tool.description?.toLowerCase().includes('mcp')
  ).length;

  return (
    <div className="relative pt-12 pb-8 lg:pt-20 lg:pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={heroRef} className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Discover the Future of
            <span className="block text-blue-600">AI Tools</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Explore, compare, and find the perfect AI tools to revolutionize your workflow. 
            From productivity to creativity, we've got you covered.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6 md:mb-8">
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
              <input
                type="text"
                placeholder="Search for AI tools, features, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 md:mb-12">
            <Link to="/explore">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg h-12">
                <i className="ri-compass-3-line mr-2"></i>
                Explore All Tools
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg h-12">
                <i className="ri-add-circle-line mr-2"></i>
                Submit Your Tool
              </Button>
            </Link>
          </div>

          {/* Scroll Down Indicator */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('browse-categories');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 focus-ring"
              aria-label="Scroll down for more"
            >
              <span>Scroll for more</span>
              <i className="ri-arrow-down-s-line text-lg animate-bounce" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{tools.length}</div>
              <div className="text-sm font-medium text-gray-600">AI Tools</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
              <div className="text-sm font-medium text-gray-600">Categories</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">{aiAgentsCount}</div>
              <div className="text-sm font-medium text-gray-600">AI Agents</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">{mcpServersCount}</div>
              <div className="text-sm font-medium text-gray-600">MCP Servers</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hero;
