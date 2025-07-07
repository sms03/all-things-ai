import React from 'react';
import ScrollDebug from '@/components/ScrollDebug';

const LocomotiveTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div data-scroll-section>
        <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div data-scroll data-scroll-speed="0.5">
            <h1 className="text-6xl font-bold text-white text-center">
              Locomotive Scroll Test
            </h1>
            <p className="text-xl text-white/80 text-center mt-4">
              This should move at different speeds
            </p>
          </div>
        </div>
      </div>
      
      <div data-scroll-section>
        <div className="h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
          <div data-scroll data-scroll-speed="1">
            <h2 className="text-4xl font-bold text-white text-center">
              Second Section
            </h2>
            <p className="text-lg text-white/80 text-center mt-4">
              This should move at normal speed
            </p>
          </div>
        </div>
      </div>
      
      <div data-scroll-section>
        <div className="h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <div data-scroll data-scroll-speed="1.5">
            <h2 className="text-4xl font-bold text-white text-center">
              Third Section
            </h2>
            <p className="text-lg text-white/80 text-center mt-4">
              This should move faster
            </p>
          </div>
        </div>
      </div>
      
      <ScrollDebug />
    </div>
  );
};

export default LocomotiveTest;
