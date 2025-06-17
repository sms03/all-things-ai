
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Beams from './Beams';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(contentRef.current.querySelector('.hero-title'), 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      )
      .fromTo(contentRef.current.querySelector('.hero-subtitle'), 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      )
      .fromTo(contentRef.current.querySelector('.hero-buttons'), 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(contentRef.current.querySelector('.hero-stats'), 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );
    }
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef}>
          <h1 className="hero-title text-6xl sm:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-8 leading-[1.1]">
            The future of AI.
            <br />
            <span className="font-normal bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              All in one place.
            </span>
          </h1>
          
          <p className="hero-subtitle text-xl sm:text-2xl text-white/80 mb-16 font-light leading-relaxed max-w-4xl mx-auto">
            Discover, explore, and master the world's most powerful AI tools. 
            From creative assistants to productivity boosters, AI agents to MCP servers.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link to="/explore">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 text-lg font-medium rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0 min-w-[220px]"
              >
                <i className="ri-compass-3-line mr-3 text-xl"></i>
                Explore Tools
              </Button>
            </Link>
            
            <Link to="/submit">
              <Button 
                variant="ghost" 
                size="lg"
                className="text-white hover:text-white px-10 py-4 text-lg font-medium rounded-full hover:bg-white/10 backdrop-blur-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 min-w-[220px]"
              >
                <i className="ri-add-circle-line mr-3 text-xl"></i>
                Submit Tool
              </Button>
            </Link>
          </div>

          {/* Enhanced Stats */}
          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group cursor-pointer">
              <div className="text-4xl sm:text-5xl font-light text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-robot-2-line text-blue-400"></i>
              </div>
              <div className="text-3xl sm:text-4xl font-light text-white mb-2">500+</div>
              <div className="text-sm text-white/60 uppercase tracking-wide">AI Tools</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl sm:text-5xl font-light text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-apps-line text-purple-400"></i>
              </div>
              <div className="text-3xl sm:text-4xl font-light text-white mb-2">15+</div>
              <div className="text-sm text-white/60 uppercase tracking-wide">Categories</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl sm:text-5xl font-light text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-user-star-line text-pink-400"></i>
              </div>
              <div className="text-3xl sm:text-4xl font-light text-white mb-2">10K+</div>
              <div className="text-sm text-white/60 uppercase tracking-wide">Users</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl sm:text-5xl font-light text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-cpu-line text-green-400"></i>
              </div>
              <div className="text-3xl sm:text-4xl font-light text-white mb-2">AI+</div>
              <div className="text-sm text-white/60 uppercase tracking-wide">Agents & MCP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
