import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTailored } from '@/contexts/TailoredContext';
import asusRog from '@/assets/products/asus-rog.jpg';
import dellXps from '@/assets/products/dell-xps.jpg';
import macbookPro from '@/assets/products/macbook-pro.jpg';

const products = [
  {
    name: 'ASUS ROG Strix G16',
    image: asusRog,
    specs: { ram: '32GB DDR5', gpu: 'RTX 4070', display: '16" 240Hz' },
    price: '$1,799',
    rating: 4.8,
  },
  {
    name: 'Dell XPS 15',
    image: dellXps,
    specs: { ram: '32GB DDR5', gpu: 'RTX 4060', display: '15.6" OLED' },
    price: '$1,599',
    rating: 4.7,
  },
  {
    name: 'MacBook Pro M4',
    image: macbookPro,
    specs: { ram: '18GB Unified', gpu: 'M4 Pro GPU', display: '16" Liquid Retina' },
    price: '$2,499',
    rating: 4.9,
  },
];

export function HeroComparison() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { trackEvent, decision } = useTailored();

  const handleCtaClick = (ctaType: 'primary' | 'secondary') => {
    trackEvent('cta_click', {
      template: decision?.decision.template,
      intent: decision?.classification.primary_intent,
      cta_type: ctaType,
    });
  };

  return (
    <section
      ref={ref}
      data-tailored="hero-comparison"
      className="relative min-h-[70vh] flex items-center pt-20 md:pt-24 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Find Your Perfect Gaming Laptop
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how the top picks compare on what matters
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {products.map((product, index) => (
            <Card
              key={product.name}
              className={`glass overflow-hidden card-glow transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                
                {/* Specs */}
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>RAM</span>
                    <span className="text-foreground font-medium">{product.specs.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPU</span>
                    <span className="text-foreground font-medium">{product.specs.gpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Display</span>
                    <span className="text-foreground font-medium">{product.specs.display}</span>
                  </div>
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{product.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary glow-primary-hover text-lg px-8"
            onClick={() => handleCtaClick('primary')}
          >
            Compare All 5
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 hover:bg-primary/10 hover:border-primary text-lg px-8"
            onClick={() => handleCtaClick('secondary')}
          >
            Read Full Reviews
          </Button>
        </div>
      </div>
    </section>
  );
}
