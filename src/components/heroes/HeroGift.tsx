import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Gift } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTailored } from '@/contexts/TailoredContext';
import logitechMouse from '@/assets/products/logitech-mouse.jpg';
import sonyHeadphones from '@/assets/products/sony-headphones.jpg';
import ipadPro from '@/assets/products/ipad-pro.jpg';

const giftTiers = [
  {
    tier: 'Under $50',
    description: 'Accessories & extras',
    image: logitechMouse,
    example: 'Cables, chargers, cases',
  },
  {
    tier: 'Under $150',
    description: 'Audio & wearables',
    image: sonyHeadphones,
    example: 'Headphones, speakers, watches',
  },
  {
    tier: 'The Wow Gift',
    description: '$300+',
    image: ipadPro,
    example: 'Tablets, laptops, consoles',
  },
];

export function HeroGift() {
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
      data-tailored="hero-gift"
      className="relative min-h-[70vh] flex items-center pt-20 md:pt-24 overflow-hidden"
    >
      {/* Warm Gradient Background */}
      <div className="absolute inset-0 warm-gradient" />
      
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-1.5 text-base">
            <Gift className="mr-2 h-4 w-4" />
            Gift Guide 2025
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Give the Gift of Great Tech
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated bundles they'll actually love
          </p>
        </div>

        {/* Gift Tier Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {giftTiers.map((gift, index) => (
            <Card
              key={gift.tier}
              className={`glass overflow-hidden card-glow group cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={gift.image}
                  alt={gift.tier}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                
                {/* Gift Bow Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Gift className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold mb-1">{gift.tier}</h3>
                <p className="text-sm text-muted-foreground mb-2">{gift.description}</p>
                <p className="text-xs text-muted-foreground">{gift.example}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white text-lg px-8"
            onClick={() => handleCtaClick('primary')}
          >
            Shop Gift Guide
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
            onClick={() => handleCtaClick('secondary')}
          >
            <Gift className="mr-2 h-5 w-5" />
            Add Gift Wrapping — Free
          </Button>
        </div>
      </div>
    </section>
  );
}
