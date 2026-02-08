import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckCircle2, Gamepad2 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import gamingSetup from '@/assets/guides/gaming-setup-guide.jpg';
import lgMonitor from '@/assets/products/lg-monitor.jpg';
import keychronKeyboard from '@/assets/products/keychron-keyboard.jpg';
import razerMouse from '@/assets/products/razer-mouse.jpg';

export function HeroLifestyle() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      data-tailored="hero-lifestyle"
      className="relative min-h-[70vh] flex items-center pt-20 md:pt-24 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={gamingSetup}
          alt="Gaming setup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side */}
          <div
            className={`text-center lg:text-left transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 px-4 py-1.5">
              <Gamepad2 className="mr-2 h-4 w-4" />
              Gaming Collection
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Built for Gaming.{' '}
              <span className="gradient-text">Ready for Anything.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Curated setups designed for peak performance
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-gaming text-lg px-8"
              >
                Shop Gaming Setups
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-2 justify-center lg:justify-start text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>
                Recommended by <strong className="text-foreground">8,000+ gamers</strong>
              </span>
            </div>
          </div>

          {/* Floating Bundle Card */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <Card className="glass-strong p-6 max-w-md mx-auto float">
              <h3 className="text-xl font-semibold mb-4">Gaming Essentials Bundle</h3>
              
              {/* Bundle Items */}
              <div className="flex gap-3 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img src={lgMonitor} alt="Monitor" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img src={keychronKeyboard} alt="Keyboard" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img src={razerMouse} alt="Mouse" className="w-full h-full object-cover" />
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                Monitor + Keyboard + Mouse
              </p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold">$899</span>
                <span className="text-muted-foreground line-through">$1,149</span>
                <Badge className="bg-success text-success-foreground">Save $250</Badge>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90">
                View Bundle
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
