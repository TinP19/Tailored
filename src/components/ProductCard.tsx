import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  specs: string[];
  badge?: string;
}

const ProductCard = ({ name, image, price, originalPrice, specs, badge }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <Badge className="absolute top-3 left-3">{badge}</Badge>
        )}
      </div>
      <CardContent className="p-5 space-y-4">
        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
        <ul className="space-y-1">
          {specs.map((spec, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {spec}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}
          </div>
          <Button size="sm">Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
