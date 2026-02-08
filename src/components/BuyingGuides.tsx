import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Guide cover images
import laptopsGuideImg from '@/assets/guides/laptops-guide.jpg';
import monitorsGuideImg from '@/assets/guides/monitors-guide.jpg';
import gamingSetupGuideImg from '@/assets/guides/gaming-setup-guide.jpg';

const guides = [
  {
    title: 'Best Laptops 2026',
    description: 'Find the perfect laptop for work, gaming, or creative projects.',
    readTime: '5 min read',
    image: laptopsGuideImg,
  },
  {
    title: 'Monitor Buying Guide',
    description: 'Resolution, refresh rate, panel type — everything you need to know.',
    readTime: '7 min read',
    image: monitorsGuideImg,
  },
  {
    title: 'Gaming Setup Essentials',
    description: 'Build the ultimate gaming station with our expert recommendations.',
    readTime: '6 min read',
    image: gamingSetupGuideImg,
  },
];

export function BuyingGuides() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} data-tailored-section="guides" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Not Sure Where to Start?</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our expert guides help you make informed decisions
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <Card
              key={guide.title}
              className={`glass card-glow overflow-hidden group cursor-pointer transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-0">
                {/* Cover image */}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  {/* Read time badge */}
                  <Badge
                    variant="secondary"
                    className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {guide.readTime}
                  </Badge>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                  
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    <span>Read Guide</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
