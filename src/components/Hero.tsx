
import { Button } from '@/components/ui/button';
import { Search, ArrowRight } from 'lucide-react';
import Beams from './Beams';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Beams Background */}
      <div className="absolute inset-0 w-full h-full">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white mb-6 leading-[1.1]">
            The best AI tools.
            <br />
            <span className="font-normal bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              All in one place.
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
            Discover, explore, and bookmark the world's most powerful AI tools. 
            Curated for creators, developers, and innovators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 min-w-[200px]"
            >
              <Search className="w-5 h-5 mr-2" />
              Explore Tools
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              className="text-gray-200 hover:text-white px-8 py-4 text-lg font-medium rounded-full hover:bg-white/10 transition-all duration-300 min-w-[200px]"
            >
              Submit Tool
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-light text-white mb-2">500+</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-light text-white mb-2">15+</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-light text-white mb-2">10K+</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
