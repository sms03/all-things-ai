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
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.5 }
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
    <div className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div ref={heroRef} className="text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-4 tracking-tight leading-none">
              Discover the Future of
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Tools
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Explore, compare, and find the perfect AI tools to revolutionize your workflow.
            <br />
            <span className="text-lg text-gray-500 mt-2 block">
              From productivity to creativity, we've got you covered.
            </span>
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                <i className="ri-search-line absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                <input
                  type="text"
                  placeholder="Search for AI tools, features, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-36 py-5 text-lg bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 text-gray-900 rounded-2xl"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link to="/explore">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <i className="ri-compass-3-line mr-2"></i>
                Explore All Tools
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white">
                <i className="ri-add-circle-line mr-2"></i>
                Submit Your Tool
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl group">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-3xl font-bold text-blue-600 mb-2 relative z-10">{tools.length}</div>
              <div className="text-sm font-medium text-gray-600 relative z-10">AI Tools</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl group">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-3xl font-bold text-green-600 mb-2 relative z-10">{categories.length}</div>
              <div className="text-sm font-medium text-gray-600 relative z-10">Categories</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl group">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-3xl font-bold text-purple-600 mb-2 relative z-10">{aiAgentsCount}</div>
              <div className="text-sm font-medium text-gray-600 relative z-10">AI Agents</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl group">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-3xl font-bold text-orange-600 mb-2 relative z-10">{mcpServersCount}</div>
              <div className="text-sm font-medium text-gray-600 relative z-10">MCP Servers</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hero;
