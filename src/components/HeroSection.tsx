import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import heroLifestyle from '@/assets/hero-lifestyle.jpg';

export function HeroSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      data-tailored="hero"
      className="relative min-h-[70vh] flex items-center pt-20 md:pt-24 overflow-hidden"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Side */}
          <div
            className={`relative order-2 lg:order-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass">
              <img 
                src={heroLifestyle} 
                alt="Modern tech lifestyle workspace" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              
              {/* Floating badge */}
              <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-sm font-medium animate-float">
                ✨ New Arrivals
              </div>
            </div>

            {/* Floating accent elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-xl pulse-glow" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-xl pulse-glow" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Content Side */}
          <div
            className={`order-1 lg:order-2 text-center lg:text-left transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              The Tech You Want.{' '}
              <span className="gradient-text">
                The Experience You Deserve.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Shop 10,000+ products with free next-day delivery. Premium brands, unbeatable prices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary glow-primary-hover group text-lg px-8"
              >
                Shop Now
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10 hover:border-primary text-lg px-8"
              >
                Browse Deals
              </Button>
            </div>

            {/* Social Proof */}
            <div
              className={`flex items-center gap-2 justify-center lg:justify-start text-muted-foreground transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>Trusted by <strong className="text-foreground">50,000+</strong> customers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
