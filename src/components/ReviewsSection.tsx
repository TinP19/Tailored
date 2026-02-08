import { Star, CheckCircle2, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTailored } from '@/contexts/TailoredContext';

const reviews = [
  {
    name: 'Sarah M.',
    rating: 5,
    text: "Best tech shopping experience I've ever had! The MacBook Pro arrived next day and exceeded all my expectations. Will definitely shop here again.",
    verified: true,
  },
  {
    name: 'James K.',
    rating: 5,
    text: 'Customer service is top-notch. Had a question about my order and got an instant response. The deals section saved me over $300!',
    verified: true,
  },
  {
    name: 'Emily R.',
    rating: 4.5,
    text: "Finally, a tech store that understands what customers want. Clean website, fast shipping, and competitive prices. 10/10 recommend.",
    verified: true,
  },
];

export function ReviewsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { decision } = useTailored();
  const socialProof = decision?.decision.social_proof;

  return (
    <section ref={ref} data-tailored-section="reviews" className="py-16 md:py-24 bg-gradient-to-b from-transparent via-accent/5 to-transparent">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it — hear from our happy customers
          </p>
          {socialProof && (
            <p className="text-lg font-medium text-primary mt-4">{socialProof}</p>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, index) => (
            <Card
              key={review.name}
              className={`glass card-glow relative transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/30 mb-4" />

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(review.rating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <span className="text-sm font-semibold">{review.name.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-foreground">{review.name}</span>
                  </div>
                  
                  {review.verified && (
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof Bar */}
        <div
          data-tailored="social-proof"
          className={`glass rounded-2xl p-6 transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
