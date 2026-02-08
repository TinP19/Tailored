/**
 * Personalization Registry - Templates, Images, CTAs
 * LLM selects from this finite inventory
 */

import heroPower from "@/assets/hero-power.jpg";
import heroValue from "@/assets/hero-value.jpg";
import heroVersatility from "@/assets/hero-versatility.jpg";

export interface RegistryTemplate {
  id: string;
  name: string;
  layout: string;
  description: string;
  tags: string[];
}

export interface RegistryImage {
  id: string;
  url: string;
  description: string;
  tags: string[];
  mood: string;
  use_cases: string[];
}

export interface RegistryCTA {
  id: string;
  text: string;
  link: string;
  variant?: string;
  intent: string[];
}

export interface PersonalizationRegistry {
  templates: RegistryTemplate[];
  images: RegistryImage[];
  ctas: RegistryCTA[];
}

export const registry: PersonalizationRegistry = {
  templates: [
    {
      id: "hero_urgent",
      name: "Urgent Buy Now",
      layout: "product_right_cta_left",
      description: "Emphasizes availability, urgency, trust signals. Best for high purchase intent.",
      tags: ["buy_now", "conversion", "urgent"],
    },
    {
      id: "hero_compare",
      name: "Compare & Explore",
      layout: "split_products",
      description: "Shows multiple options side-by-side. Best for research/comparison intent.",
      tags: ["compare", "research", "educational"],
    },
    {
      id: "hero_lifestyle",
      name: "Lifestyle Focus",
      layout: "fullwidth_overlay",
      description: "Emotional connection through use-case imagery. Best for specific needs (gaming, work, design).",
      tags: ["gaming", "work", "design", "lifestyle"],
    },
  ],

  images: [
    {
      id: "img_gaming",
      url: heroPower,
      description: "RGB-lit gaming setup with high-performance display, mechanical keyboard",
      tags: ["gaming", "performance", "144hz", "rgb"],
      mood: "energetic",
      use_cases: ["gaming", "streaming", "esports"],
    },
    {
      id: "img_office",
      url: heroVersatility,
      description: "Clean professional workspace with monitors for productivity",
      tags: ["professional", "productivity", "work", "dual_monitor"],
      mood: "calm",
      use_cases: ["work", "coding", "multitasking"],
    },
    {
      id: "img_design",
      url: heroVersatility,
      description: "Professional-grade display for creative work",
      tags: ["design", "creative", "color_accuracy", "4k"],
      mood: "creative",
      use_cases: ["design", "photo_editing", "video_editing"],
    },
    {
      id: "img_comparison",
      url: heroVersatility,
      description: "Multiple options showing variety and choice",
      tags: ["compare", "variety", "options"],
      mood: "neutral",
      use_cases: ["browsing", "comparing", "researching"],
    },
    {
      id: "img_deal",
      url: heroValue,
      description: "Value-focused setup emphasizing smart prices",
      tags: ["budget", "sale", "discount", "price"],
      mood: "promotional",
      use_cases: ["budget", "deals", "value"],
    },
    {
      id: "img_premium",
      url: heroPower,
      description: "Premium display showcasing quality and performance",
      tags: ["premium", "quality", "4k", "luxury"],
      mood: "aspirational",
      use_cases: ["premium", "high_end"],
    },
  ],

  ctas: [
    {
      id: "buy_now",
      text: "Shop Now",
      link: "/shop",
      variant: "Get Started",
      intent: ["BUY_NOW", "USE_CASE_GAMING", "USE_CASE_WORK", "USE_CASE_DESIGN"],
    },
    {
      id: "compare",
      text: "Compare Models",
      link: "/compare",
      intent: ["COMPARE"],
    },
    {
      id: "explore",
      text: "Explore Options",
      link: "/catalog",
      intent: ["BROWSE"],
    },
    {
      id: "view_deals",
      text: "View Deals",
      link: "/deals",
      intent: ["BUDGET"],
    },
  ],
};
