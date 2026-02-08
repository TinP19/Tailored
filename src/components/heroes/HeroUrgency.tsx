import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Truck, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountdown } from '@/hooks/useCountdown';
import macbookPro from '@/assets/products/macbook-pro.jpg';

export function HeroUrgency() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { hours, minutes, seconds } = useCountdown(5);

  const formatTime = (n: number) => n.toString().padStart(2, '0');

  return (
    <section
      ref={ref}
      data-tailored="hero-urgency"
      className="relative min-h-[70vh] flex flex-col pt-20 md:pt-24 overflow-hidden"
    >
      {/* Urgency Countdown Bar */}
      <div className="urgency-bar text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <Clock className="h-5 w-5 animate-pulse" />
          <span className="font-semibold">Deal ends in</span>
          <div className="flex items-center gap-1 font-mono text-lg font-bold">
            <span className="bg-black/30 px-2 py-1 rounded">{formatTime(hours)}</span>
            <span>:</span>
            <span className="bg-black/30 px-2 py-1 rounded">{formatTime(minutes)}</span>
            <span>:</span>
            <span className="bg-black/30 px-2 py-1 rounded">{formatTime(seconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Side */}
            <div
              className={`relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass">
                <img
                  src={macbookPro}
                  alt="MacBook Pro M4"
                  className="w-full h-full object-cover"
                />
                {/* Limited Stock Badge */}
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground stock-pulse px-3 py-1.5 text-sm">
                  Limited Stock
                </Badge>
              </div>
            </div>

            {/* Content Side */}
            <div
              className={`text-center lg:text-left transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                MacBook Pro M4
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground mb-6">
                In Stock, Ships Today
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                <Button
                  size="lg"
                  className="bg-success hover:bg-success/90 text-success-foreground text-lg px-8 py-6 group"
                >
                  <Truck className="mr-2 h-5 w-5" />
                  Buy Now — Free Next-Day Delivery
                </Button>
              </div>

              {/* Social Proof */}
              <div
                className={`flex items-center gap-2 justify-center lg:justify-start text-muted-foreground transition-all duration-700 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <TrendingUp className="h-5 w-5 text-success" />
                <span>
                  <strong className="text-foreground">47 purchased</strong> in the last hour
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
