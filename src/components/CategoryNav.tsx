import { Laptop, Monitor, Headphones, Gamepad2, Home, Smartphone, Cable } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const categories = [
  { name: 'Laptops', icon: Laptop },
  { name: 'Monitors', icon: Monitor },
  { name: 'Audio', icon: Headphones },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Smart Home', icon: Home },
  { name: 'Phones', icon: Smartphone },
  { name: 'Accessories', icon: Cable },
];

export function CategoryNav() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-8 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div
          className={`flex gap-3 overflow-x-auto scrollbar-hide py-2 transition-all duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant="ghost"
                className={`flex-shrink-0 gap-2 px-5 py-6 rounded-full glass hover:bg-primary/10 hover:border-primary/50 glow-primary-hover transition-all duration-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
