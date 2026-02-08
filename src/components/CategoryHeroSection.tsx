import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export type TemplateType = "power" | "value" | "versatility";
export type CategoryType = "laptops" | "tablets" | "tvs";

interface CategoryTemplate {
  headline: string;
  subheadline: string;
  cta: string;
}

interface CategoryHeroSectionProps {
  activeTemplate: TemplateType;
  category: CategoryType;
  images: Record<TemplateType, string>;
}

const categoryTemplates: Record<CategoryType, Record<TemplateType, CategoryTemplate>> = {
  laptops: {
    power: {
      headline: "Laptops Built for Domination",
      subheadline: "High-performance machines with blazing-fast processors and pro-grade graphics for gamers and creators who demand the best.",
      cta: "Shop Gaming Laptops",
    },
    value: {
      headline: "Smart Laptops, Smarter Prices",
      subheadline: "Reliable computing power for the whole family without breaking the bank. Quality you can trust at prices you'll love.",
      cta: "View Laptop Deals",
    },
    versatility: {
      headline: "Laptops That Adapt to You",
      subheadline: "From spreadsheets to video calls to creative projects — professional laptops that handle every challenge effortlessly.",
      cta: "Explore Pro Laptops",
    },
  },
  tablets: {
    power: {
      headline: "Gaming Tablets, Unleashed",
      subheadline: "Portable powerhouses with stunning displays and lightning-fast performance for gaming, streaming, and creative work on the go.",
      cta: "Shop Gaming Tablets",
    },
    value: {
      headline: "Tablets for the Whole Family",
      subheadline: "Entertainment, education, and everyday productivity in one affordable package. Perfect for home use and on-the-go convenience.",
      cta: "View Tablet Deals",
    },
    versatility: {
      headline: "Your Productivity, Anywhere",
      subheadline: "Professional-grade tablets that transform how you work. Take notes, create, collaborate — all with precision and ease.",
      cta: "Explore Pro Tablets",
    },
  },
  tvs: {
    power: {
      headline: "The Ultimate Gaming Display",
      subheadline: "Ultra-fast refresh rates, deep blacks, and vibrant colors that bring your games to life. Built for competitive gaming and immersive entertainment.",
      cta: "Shop Gaming TVs",
    },
    value: {
      headline: "Home Entertainment Made Easy",
      subheadline: "Stunning picture quality for movie nights, sports, and streaming — all at a price that fits your budget.",
      cta: "View TV Deals",
    },
    versatility: {
      headline: "Displays That Command Attention",
      subheadline: "Crystal-clear 4K screens for boardrooms, home offices, and professional presentations. Make every meeting memorable.",
      cta: "Explore Pro Displays",
    },
  },
};

const CategoryHeroSection = ({ activeTemplate, category, images }: CategoryHeroSectionProps) => {
  const template = categoryTemplates[category][activeTemplate];
  const image = images[activeTemplate];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${category}-${activeTemplate}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={image}
            alt={template.headline}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${category}-${activeTemplate}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {template.headline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              {template.subheadline}
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="text-lg px-8">
                {template.cta}
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Compare Models
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CategoryHeroSection;
