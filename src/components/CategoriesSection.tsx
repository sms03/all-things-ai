import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const CategoriesSection = () => {
  const { categories, loading } = useSupabaseData();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && sectionRef.current && categories.length > 0) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.category-card'),
        { opacity: 0, scale: 0.9, y: 30 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: "back.out(1.2)"
        }
      );
    }
  }, [loading, categories]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <div className="text-lg text-gray-600">Loading categories...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Browse AI Tools by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the perfect AI tools for your specific needs across various categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category, index) => (
            <div key={category.id} className="category-card">
              <Link to={`/explore?category=${category.slug}`}>
                <Button
                  variant="outline"
                  className="w-full h-20 text-left border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-start w-full">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-1">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-500 group-hover:text-blue-600 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/explore">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg h-12 transition-all duration-300 hover:scale-105">
              <i className="ri-grid-line mr-2"></i>
              View All Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;