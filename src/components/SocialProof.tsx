import { Card, CardContent } from "@/components/ui/card";
import { Star, Shield, Truck, Headphones } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Developer",
    content: "The ProBook Elite exceeded all my expectations. Blazing fast for development and incredibly portable.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Marcus Johnson",
    role: "Content Creator",
    content: "Finally a laptop that can handle 4K video editing without breaking a sweat. Worth every penny!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Emily Roberts",
    role: "Graduate Student",
    content: "Amazing value for students. Great battery life and handles all my research software effortlessly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

const trustBadges = [
  { icon: Shield, label: "2-Year Warranty", description: "Full coverage included" },
  { icon: Truck, label: "Free Shipping", description: "Orders over $500" },
  { icon: Headphones, label: "24/7 Support", description: "Expert help anytime" },
];

const SocialProof = () => {
  return (
    <section className="py-20">
      <div className="container">
        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Thousands</h2>
          <p className="text-muted-foreground text-lg">
            See what our customers have to say about their experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground">{testimonial.content}</p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 rounded-xl bg-muted/50 border border-border"
            >
              <div className="p-3 rounded-lg bg-primary/10">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{badge.label}</p>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
