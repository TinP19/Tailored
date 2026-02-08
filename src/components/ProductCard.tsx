import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  rating: number;
  image?: string;
  delay?: number;
  isVisible?: boolean;
}

export function ProductCard({ name, description, price, rating, image, delay = 0, isVisible = true }: ProductCardProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <Card
      className={`glass card-glow overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="aspect-square bg-white relative overflow-hidden group">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📦</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < fullStars
                    ? 'fill-yellow-500 text-yellow-500'
                    : i === fullStars && hasHalfStar
                    ? 'fill-yellow-500/50 text-yellow-500'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">({rating})</span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-foreground">
              ${price.toLocaleString()}
            </span>
            <Button size="sm" className="bg-primary hover:bg-primary/90 glow-primary-hover">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
