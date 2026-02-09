import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTailored } from '@/contexts/TailoredContext';
import laptopsGuide from '@/assets/guides/laptops-guide.jpg';
import monitorsGuide from '@/assets/guides/monitors-guide.jpg';
import sonyHeadphones from '@/assets/products/sony-headphones.jpg';

const categories = [
  {
    name: 'Laptops',
    image: laptopsGuide,
    articles: 24,
  },
  {
    name: 'Monitors',
    image: monitorsGuide,
    articles: 18,
  },
  {
    name: 'Audio',
    image: sonyHeadphones,
    articles: 15,
  },
];

export function HeroGuide() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { trackEvent, decision } = useTailored();

  const ctaText = decision?.decision.cta ?? 'Take the Quiz — Find Your Match';

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
      data-tailored="hero-guide"
      className="relative min-h-[70vh] flex items-center pt-20 md:pt-24 overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 text-primary mb-6">
            <BookOpen className="h-6 w-6" />
            <span className="font-medium">Expert Resources</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Your Tech Journey Starts Here
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore guides, comparisons, and expert picks
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {categories.map((category, index) => (
            <Card
              key={category.name}
              className={`glass overflow-hidden card-glow group cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.articles} articles</p>
                </div>
              </div>
              <div className="p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-primary hover:text-primary"
                >
                  Explore
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div
          className={`flex flex-col items-center gap-6 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary glow-primary-hover text-lg px-8"
            onClick={() => handleCtaClick('primary')}
          >
            {ctaText}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Trust Badge */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span>Unbiased recommendations, always</span>
          </div>
        </div>
      </div>
    </section>
  );
}
