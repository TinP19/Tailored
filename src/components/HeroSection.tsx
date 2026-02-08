import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import heroPower from "@/assets/hero-power.jpg";
import heroValue from "@/assets/hero-value.jpg";
import heroVersatility from "@/assets/hero-versatility.jpg";

import type { ResolvedDecision } from "@/engine";

export type TemplateType = "power" | "value" | "versatility";

interface HeroTemplate {
  id: TemplateType;
  headline: string;
  subheadline: string;
  cta: string;
  ctaLink: string;
  image: string;
}

const defaultTemplates: Record<TemplateType, HeroTemplate> = {
  power: {
    id: "power",
    headline: "Fuel Your Digital Dominance",
    subheadline: "Next-gen laptops, tablets, and displays engineered for gamers and power users who refuse to compromise.",
    cta: "Shop Gaming",
    ctaLink: "/laptops",
    image: heroPower,
  },
  value: {
    id: "value",
    headline: "Smart Tech for Your Home",
    subheadline: "Quality devices at prices that make sense. From family entertainment to everyday productivity, we've got you covered.",
    cta: "Explore Deals",
    ctaLink: "/deals",
    image: heroValue,
  },
  versatility: {
    id: "versatility",
    headline: "Technology That Works as Hard as You",
    subheadline: "Professional-grade laptops, tablets, and screens built for productivity, creativity, and seamless collaboration.",
    cta: "Shop Pro Devices",
    ctaLink: "/catalog",
    image: heroVersatility,
  },
};

interface HeroSectionProps {
  /** Legacy: template-based content (used with TemplateSwitcher manual override) */
  activeTemplate?: TemplateType;
  /** LLM/resolved decision (takes precedence when provided) */
  decision?: ResolvedDecision | null;
}

const HeroSection = ({ activeTemplate = "power", decision }: HeroSectionProps) => {
  const template = decision
    ? {
        id: "personalized" as TemplateType,
        headline: decision.headline,
        subheadline: decision.subheadline,
        cta: decision.cta_text,
        ctaLink: decision.cta_link,
        image: decision.image_url,
      }
    : defaultTemplates[activeTemplate];

  return (
    <section className="hero-section relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={template.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={template.image}
            alt={template.headline}
            className="hero-image w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="hero-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {template.headline}
            </h1>
            <p className="hero-subheadline text-lg md:text-xl text-muted-foreground max-w-xl">
              {template.subheadline}
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <a href={template.ctaLink} className="hero-cta">{template.cta}</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <a href="/compare">Compare Models</a>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Explanation badge - shown when decision has reasoning */}
      {decision && (
        <PersonalizationBadge decision={decision} />
      )}
    </section>
  );
};

function PersonalizationBadge({ decision }: { decision: ResolvedDecision }) {
  return (
    <div className="personalization-badge absolute bottom-6 left-6 z-20 max-w-xs">
      <details className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-lg">
        <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
          ✨ Personalized for you
        </summary>
        <div className="badge-explanation mt-2 text-xs text-muted-foreground space-y-1">
          <p><strong>Intent:</strong> {decision.intent}</p>
          <p><strong>Confidence:</strong> {(decision.confidence * 100).toFixed(0)}%</p>
          <p><strong>Why:</strong> {decision.reasoning.template_choice}</p>
        </div>
      </details>
    </div>
  );
}

export default HeroSection;
