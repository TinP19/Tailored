/**
 * Template Registry - Finite set of hero templates
 * Each template has slots: hero image, headline, subheadline, CTA label + link target
 * VC Track: Templatized personalization (no full page generation)
 */

import type { TemplateType } from "./types";

export interface HeroTemplate {
  id: TemplateType;
  headline: string;
  subheadline: string;
  cta: string;
  cta_priority: "buy" | "compare" | "explore";
  /** Asset key - resolved from asset library */
  defaultImageKey: string;
}

export const HERO_TEMPLATES: Record<TemplateType, HeroTemplate> = {
  power: {
    id: "power",
    headline: "Fuel Your Digital Dominance",
    subheadline: "Next-gen laptops, tablets, and displays engineered for gamers and power users who refuse to compromise.",
    cta: "Shop Gaming",
    cta_priority: "buy",
    defaultImageKey: "gaming_setup",
  },
  value: {
    id: "value",
    headline: "Smart Tech for Your Home",
    subheadline: "Quality devices at prices that make sense. From family entertainment to everyday productivity, we've got you covered.",
    cta: "Explore Deals",
    cta_priority: "explore",
    defaultImageKey: "budget_home",
  },
  versatility: {
    id: "versatility",
    headline: "Technology That Works as Hard as You",
    subheadline: "Professional-grade laptops, tablets, and screens built for productivity, creativity, and seamless collaboration.",
    cta: "Shop Pro Devices",
    cta_priority: "compare",
    defaultImageKey: "office_pro",
  },
};
