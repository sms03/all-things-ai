
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
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power3.out" }
      );
      
      gsap.fromTo(statsRef.current.children,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)", delay: 0.7 }
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
    <div className="relative py-16 lg:py-24 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div ref={heroRef} className="text-center">
          {/* Enhanced Main Heading */}
          <div className="relative inline-block mb-8">
            <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 tracking-tight leading-none">
              Discover the Future of
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Tools
              </span>
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-xl opacity-30 rounded-3xl"></div>
          </div>

          {/* Enhanced Subtitle */}
          <p className="text-2xl lg:text-3xl text-gray-700 max-w-5xl mx-auto mb-12 leading-relaxed font-medium">
            Explore, compare, and find the perfect AI tools to 
            <span className="text-blue-600 font-semibold"> revolutionize </span>
            your workflow.
            <br />
            <span className="text-lg lg:text-xl text-gray-600 mt-2 block">
              From productivity to creativity, we've got you covered.
            </span>
          </p>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-2xl">
                <i className="ri-search-line absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl"></i>
                <input
                  type="text"
                  placeholder="Search for AI tools, features, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-40 py-6 text-xl bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-500 text-gray-900 rounded-2xl"
                />
                <Button
                  type="submit"
                  className="absolute right-3 top-3 bottom-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link to="/explore">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl h-16 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 transform">
                <i className="ri-compass-3-line mr-3 text-xl"></i>
                Explore All Tools
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 px-12 py-4 text-xl h-16 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform bg-white/80 backdrop-blur-sm">
                <i className="ri-add-circle-line mr-3 text-xl"></i>
                Submit Your Tool
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform rounded-2xl overflow-hidden group">
            <CardContent className="p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-4xl font-bold text-blue-600 mb-3 relative z-10">{tools.length}</div>
              <div className="text-base font-semibold text-gray-700 relative z-10">AI Tools</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform rounded-2xl overflow-hidden group">
            <CardContent className="p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-4xl font-bold text-green-600 mb-3 relative z-10">{categories.length}</div>
              <div className="text-base font-semibold text-gray-700 relative z-10">Categories</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform rounded-2xl overflow-hidden group">
            <CardContent className="p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-4xl font-bold text-purple-600 mb-3 relative z-10">{aiAgentsCount}</div>
              <div className="text-base font-semibold text-gray-700 relative z-10">AI Agents</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform rounded-2xl overflow-hidden group">
            <CardContent className="p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-4xl font-bold text-orange-600 mb-3 relative z-10">{mcpServersCount}</div>
              <div className="text-base font-semibold text-gray-700 relative z-10">MCP Servers</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hero;
