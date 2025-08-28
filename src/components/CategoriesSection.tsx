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
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary rounded-full animate-spin border-t-transparent" aria-hidden="true"></div>
            <div className="text-lg text-muted-foreground">Loading categories...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="pt-8 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Browse AI Tools by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the perfect AI tools for your specific needs across various categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category, index) => (
            <div key={category.id} className="category-card">
              <Link to={`/explore?category=${category.slug}`}>
                <div className="group rounded-xl p-[1px] bg-gradient-to-br from-border to-transparent hover:from-primary/40 transition">
                  <Button
                    variant="outline"
                    className="relative w-full min-h-[6.5rem] text-left border border-border bg-card/80 text-card-foreground backdrop-blur-sm hover:bg-accent/70 hover:text-accent-foreground hover:border-accent transition-all duration-300 rounded-xl shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 focus-ring overflow-hidden"
                    aria-label={`Browse ${category.name} tools`}
                  >
                    <i className="ri-arrow-right-up-line absolute right-3 top-3 text-muted-foreground/50 group-hover:text-accent-foreground/80 transition" aria-hidden="true"></i>
                    <div className="flex flex-col items-start w-full gap-1 overflow-hidden pr-6">
                      <h3 className="font-semibold text-foreground group-hover:text-accent-foreground line-clamp-1 break-words w-full leading-tight text-base">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm sm:text-[0.9rem] text-muted-foreground group-hover:text-accent-foreground/90 break-words leading-snug whitespace-normal">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Button>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/explore">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg h-12 transition-all duration-300 hover:scale-105">
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