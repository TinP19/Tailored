import { Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCountdown } from '@/hooks/useCountdown';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Deal images
import samsungOledTvImg from '@/assets/products/samsung-oled-tv.jpg';
import airpodsImg from '@/assets/products/airpods-pro.jpg';
import razerMouseImg from '@/assets/products/razer-mouse.jpg';

interface DealCardProps {
  name: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  initialHours: number;
  image: string;
  delay: number;
  isVisible: boolean;
}

function DealCard({ name, originalPrice, salePrice, discount, initialHours, image, delay, isVisible }: DealCardProps) {
  const { hours, minutes, seconds } = useCountdown(initialHours);

  return (
    <Card
      className={`glass card-glow overflow-hidden relative transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Urgent badge */}
      <Badge className="absolute top-3 right-3 bg-success text-success-foreground font-bold animate-pulse z-10">
        <Zap className="h-3 w-3 mr-1" />
        {discount}% OFF
      </Badge>

      <CardContent className="p-0">
        {/* Product Image */}
        <div className="aspect-video bg-white relative overflow-hidden group">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-5 space-y-4">
          <h3 className="font-semibold text-lg text-foreground">{name}</h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-success">
              ${salePrice.toLocaleString()}
            </span>
            <span className="text-muted-foreground line-through">
              ${originalPrice.toLocaleString()}
            </span>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-destructive animate-pulse" />
            <span className="text-muted-foreground">Ends in:</span>
            <div className="flex gap-1 font-mono font-bold text-foreground">
              <span className="bg-secondary px-2 py-1 rounded">
                {String(hours).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground">:</span>
              <span className="bg-secondary px-2 py-1 rounded">
                {String(minutes).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground">:</span>
              <span className="bg-secondary px-2 py-1 rounded text-destructive">
                {String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <Button className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold">
            Grab This Deal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const deals = [
  {
    name: 'Samsung 55" OLED 4K TV',
    originalPrice: 1499,
    salePrice: 999,
    discount: 33,
    initialHours: 5,
    image: samsungOledTvImg,
  },
  {
    name: 'Apple AirPods Pro 3',
    originalPrice: 279,
    salePrice: 199,
    discount: 29,
    initialHours: 8,
    image: airpodsImg,
  },
  {
    name: 'Razer DeathAdder V3 Pro',
    originalPrice: 149,
    salePrice: 99,
    discount: 34,
    initialHours: 3,
    image: razerMouseImg,
  },
];

export function DealsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} data-tailored-section="deals" className="py-16 md:py-24 bg-gradient-to-b from-transparent via-destructive/5 to-transparent">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-success animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold">Today's Deals</h2>
            <Zap className="h-6 w-6 text-success animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Limited time offers — grab them before they're gone!
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <DealCard
              key={deal.name}
              {...deal}
              delay={index * 150}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
