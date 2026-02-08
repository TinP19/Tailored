import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTailored } from '@/contexts/TailoredContext';
import nintendoSwitch from '@/assets/products/nintendo-switch.jpg';
import boseSpeaker from '@/assets/products/bose-speaker.jpg';
import logitechMouse from '@/assets/products/logitech-mouse.jpg';

const valuePicks = [
  {
    name: 'Nintendo Switch',
    image: nintendoSwitch,
    originalPrice: '$349',
    salePrice: '$279',
  },
  {
    name: 'Bose Speaker',
    image: boseSpeaker,
    originalPrice: '$179',
    salePrice: '$129',
  },
  {
    name: 'Logitech MX Master',
    image: logitechMouse,
    originalPrice: '$99',
    salePrice: '$69',
  },
];

export function HeroValue() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { trackEvent, decision } = useTailored();

  const ctaText = decision?.decision.cta ?? 'Shop Best Value';

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
      data-tailored="hero-value"
      className="relative min-h-[70vh] flex items-center pt-20 md:pt-24 overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-success/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-success/10 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge className="mb-6 bg-success/20 text-success border-success/30 px-4 py-1.5 text-base">
            <Sparkles className="mr-2 h-4 w-4" />
            Save up to $400
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Premium Tech. Honest Prices.
          </h1>

          <p className="text-2xl md:text-3xl text-muted-foreground mb-2">
            Gaming Laptops from <span className="text-success font-bold">$599</span>
          </p>

          <p className="text-muted-foreground">
            Or $25/mo with 0% APR
          </p>
        </div>

        {/* Value Picks */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {valuePicks.map((pick, index) => (
            <Card
              key={pick.name}
              className={`glass overflow-hidden card-glow transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={pick.image}
                  alt={pick.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">{pick.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground line-through text-sm">
                    {pick.originalPrice}
                  </span>
                  <span className="text-xl font-bold text-success">{pick.salePrice}</span>
                </div>
              </div>
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
            className="bg-success hover:bg-success/90 text-success-foreground text-lg px-8"
            onClick={() => handleCtaClick('primary')}
          >
            {ctaText}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-success/50 hover:bg-success/10 hover:border-success text-lg px-8"
            onClick={() => handleCtaClick('secondary')}
          >
            See All Deals Under $500
          </Button>
        </div>
      </div>
    </section>
  );
}
