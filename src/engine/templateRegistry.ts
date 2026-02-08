// ============================================================================
// Tailored — Template Registry
// Single source of truth for all personalization content, templates, and assets.
// ============================================================================

// ---------------------------------------------------------------------------
// 1. INTENTS
// ---------------------------------------------------------------------------

export const INTENTS = {
  BUY_NOW: 'BUY_NOW',
  COMPARE: 'COMPARE',
  USE_CASE: 'USE_CASE',
  BUDGET: 'BUDGET',
  RESEARCH: 'RESEARCH',
  GIFTING: 'GIFTING',
} as const;

export type Intent = (typeof INTENTS)[keyof typeof INTENTS];

// ---------------------------------------------------------------------------
// 2. Types
// ---------------------------------------------------------------------------

export interface BadgeConfig {
  text: string;
  color: 'red' | 'blue' | 'purple' | 'green' | 'cyan' | 'amber';
}

export interface CTAConfig {
  label: string;
  link: string;
  style: 'solid' | 'outline' | 'ghost' | 'gradient';
}

export interface TemplateConfig {
  intent: Intent;
  template_id: string;
  component: string;
  layout: 'split_left_image' | 'three_column_cards' | 'full_bleed_image' | 'price_anchored_center' | 'editorial_cards' | 'curated_grid';
  hero_image: string;
  badge: BadgeConfig | null;
  headline: string;
  subheadline: string;
  cta_primary: CTAConfig;
  cta_secondary: CTAConfig | null;
  social_proof: string;
  urgency_bar: string | null;
  section_order: [string, string, string];
}

export interface AssetEntry {
  id: string;
  path: string;
  category: 'hero' | 'product' | 'guide';
  used_by: Intent[];
}

// ---------------------------------------------------------------------------
// 3. TEMPLATES — Full config for each intent
// ---------------------------------------------------------------------------

export const TEMPLATES: Record<Intent, TemplateConfig> = {
  // ── BUY_NOW → HeroUrgency ───────────────────────────────────────────────
  [INTENTS.BUY_NOW]: {
    intent: 'BUY_NOW',
    template_id: 'hero_urgency',
    component: 'HeroUrgency',
    layout: 'split_left_image',
    hero_image: '@/assets/products/macbook-pro.jpg',
    badge: { text: 'Limited Stock', color: 'red' },
    headline: 'MacBook Pro M4',
    subheadline: 'In Stock, Ships Today',
    cta_primary: {
      label: 'Buy Now — Free Next-Day Delivery',
      link: '/product/macbook-pro',
      style: 'solid',
    },
    cta_secondary: null,
    social_proof: '47 purchased in the last hour',
    urgency_bar: 'Deal ends in {countdown}',
    section_order: ['deals', 'reviews', 'guides'],
  },

  // ── COMPARE → HeroComparison ────────────────────────────────────────────
  [INTENTS.COMPARE]: {
    intent: 'COMPARE',
    template_id: 'hero_comparison',
    component: 'HeroComparison',
    layout: 'three_column_cards',
    hero_image: '@/assets/products/asus-rog.jpg',
    badge: null,
    headline: 'Find Your Perfect Gaming Laptop',
    subheadline: 'See how the top picks compare on what matters',
    cta_primary: {
      label: 'Compare All 5',
      link: '/compare/gaming-laptops',
      style: 'solid',
    },
    cta_secondary: {
      label: 'Read Full Reviews',
      link: '/reviews/gaming-laptops',
      style: 'outline',
    },
    social_proof: 'Rated #1 by 3 major review sites',
    urgency_bar: null,
    section_order: ['guides', 'reviews', 'deals'],
  },

  // ── USE_CASE → HeroLifestyle ────────────────────────────────────────────
  [INTENTS.USE_CASE]: {
    intent: 'USE_CASE',
    template_id: 'hero_lifestyle',
    component: 'HeroLifestyle',
    layout: 'full_bleed_image',
    hero_image: '@/assets/guides/gaming-setup-guide.jpg',
    badge: { text: 'Gaming Collection', color: 'purple' },
    headline: 'Built for Gaming. Ready for Anything.',
    subheadline: 'Curated setups designed for peak performance',
    cta_primary: {
      label: 'Shop Gaming Setups',
      link: '/collections/gaming',
      style: 'solid',
    },
    cta_secondary: null,
    social_proof: 'Recommended by 8,000+ gamers',
    urgency_bar: null,
    section_order: ['deals', 'guides', 'reviews'],
  },

  // ── BUDGET → HeroValue ──────────────────────────────────────────────────
  [INTENTS.BUDGET]: {
    intent: 'BUDGET',
    template_id: 'hero_value',
    component: 'HeroValue',
    layout: 'price_anchored_center',
    hero_image: '@/assets/products/nintendo-switch.jpg',
    badge: { text: 'Save up to $400', color: 'green' },
    headline: 'Premium Tech. Honest Prices.',
    subheadline: 'Gaming Laptops from $599 — Or $25/mo with 0% APR',
    cta_primary: {
      label: 'Shop Best Value',
      link: '/deals/best-value',
      style: 'solid',
    },
    cta_secondary: {
      label: 'See All Deals Under $500',
      link: '/deals/under-500',
      style: 'outline',
    },
    social_proof: 'Save an average of $120 vs. retail',
    urgency_bar: null,
    section_order: ['deals', 'reviews', 'guides'],
  },

  // ── RESEARCH → HeroGuide ────────────────────────────────────────────────
  [INTENTS.RESEARCH]: {
    intent: 'RESEARCH',
    template_id: 'hero_guide',
    component: 'HeroGuide',
    layout: 'editorial_cards',
    hero_image: '@/assets/guides/laptops-guide.jpg',
    badge: { text: 'Expert Resources', color: 'cyan' },
    headline: 'Your Tech Journey Starts Here',
    subheadline: 'Explore guides, comparisons, and expert picks',
    cta_primary: {
      label: 'Take the Quiz — Find Your Match',
      link: '/quiz',
      style: 'solid',
    },
    cta_secondary: null,
    social_proof: 'Read by 25,000 shoppers this month',
    urgency_bar: null,
    section_order: ['guides', 'deals', 'reviews'],
  },

  // ── GIFTING → HeroGift ──────────────────────────────────────────────────
  [INTENTS.GIFTING]: {
    intent: 'GIFTING',
    template_id: 'hero_gift',
    component: 'HeroGift',
    layout: 'curated_grid',
    hero_image: '@/assets/products/ipad-pro.jpg',
    badge: { text: 'Gift Guide 2025', color: 'amber' },
    headline: 'Give the Gift of Great Tech',
    subheadline: 'Curated bundles they\'ll actually love',
    cta_primary: {
      label: 'Shop Gift Guide',
      link: '/gift-guide',
      style: 'gradient',
    },
    cta_secondary: {
      label: 'Add Gift Wrapping — Free',
      link: '/gift-wrapping',
      style: 'ghost',
    },
    social_proof: 'Top-rated gift — 4.8\u2605 from 2,100 reviews',
    urgency_bar: null,
    section_order: ['deals', 'guides', 'reviews'],
  },
};

// ---------------------------------------------------------------------------
// 4. ASSETS — Catalog of all hero images and badges with file paths
// ---------------------------------------------------------------------------

export const ASSETS: Record<string, AssetEntry> = {
  // Hero / Background images
  hero_lifestyle: {
    id: 'hero_lifestyle',
    path: '@/assets/hero-lifestyle.jpg',
    category: 'hero',
    used_by: [],
  },
  gaming_setup: {
    id: 'gaming_setup',
    path: '@/assets/guides/gaming-setup-guide.jpg',
    category: 'hero',
    used_by: ['USE_CASE'],
  },

  // Guide cover images
  laptops_guide: {
    id: 'laptops_guide',
    path: '@/assets/guides/laptops-guide.jpg',
    category: 'guide',
    used_by: ['RESEARCH'],
  },
  monitors_guide: {
    id: 'monitors_guide',
    path: '@/assets/guides/monitors-guide.jpg',
    category: 'guide',
    used_by: ['RESEARCH'],
  },

  // Product images
  macbook_pro: {
    id: 'macbook_pro',
    path: '@/assets/products/macbook-pro.jpg',
    category: 'product',
    used_by: ['BUY_NOW', 'COMPARE'],
  },
  asus_rog: {
    id: 'asus_rog',
    path: '@/assets/products/asus-rog.jpg',
    category: 'product',
    used_by: ['COMPARE'],
  },
  dell_xps: {
    id: 'dell_xps',
    path: '@/assets/products/dell-xps.jpg',
    category: 'product',
    used_by: ['COMPARE'],
  },
  lg_monitor: {
    id: 'lg_monitor',
    path: '@/assets/products/lg-monitor.jpg',
    category: 'product',
    used_by: ['USE_CASE'],
  },
  keychron_keyboard: {
    id: 'keychron_keyboard',
    path: '@/assets/products/keychron-keyboard.jpg',
    category: 'product',
    used_by: ['USE_CASE'],
  },
  razer_mouse: {
    id: 'razer_mouse',
    path: '@/assets/products/razer-mouse.jpg',
    category: 'product',
    used_by: ['USE_CASE'],
  },
  nintendo_switch: {
    id: 'nintendo_switch',
    path: '@/assets/products/nintendo-switch.jpg',
    category: 'product',
    used_by: ['BUDGET'],
  },
  bose_speaker: {
    id: 'bose_speaker',
    path: '@/assets/products/bose-speaker.jpg',
    category: 'product',
    used_by: ['BUDGET'],
  },
  logitech_mouse: {
    id: 'logitech_mouse',
    path: '@/assets/products/logitech-mouse.jpg',
    category: 'product',
    used_by: ['BUDGET', 'GIFTING'],
  },
  sony_headphones: {
    id: 'sony_headphones',
    path: '@/assets/products/sony-headphones.jpg',
    category: 'product',
    used_by: ['RESEARCH', 'GIFTING'],
  },
  ipad_pro: {
    id: 'ipad_pro',
    path: '@/assets/products/ipad-pro.jpg',
    category: 'product',
    used_by: ['GIFTING'],
  },
  airpods_pro: {
    id: 'airpods_pro',
    path: '@/assets/products/airpods-pro.jpg',
    category: 'product',
    used_by: [],
  },
  apple_watch: {
    id: 'apple_watch',
    path: '@/assets/products/apple-watch.jpg',
    category: 'product',
    used_by: [],
  },
  dji_drone: {
    id: 'dji_drone',
    path: '@/assets/products/dji-drone.jpg',
    category: 'product',
    used_by: [],
  },
  gopro_hero: {
    id: 'gopro_hero',
    path: '@/assets/products/gopro-hero.jpg',
    category: 'product',
    used_by: [],
  },
  iphone_16: {
    id: 'iphone_16',
    path: '@/assets/products/iphone-16.jpg',
    category: 'product',
    used_by: [],
  },
  philips_hue: {
    id: 'philips_hue',
    path: '@/assets/products/philips-hue.jpg',
    category: 'product',
    used_by: [],
  },
  ps5_pro: {
    id: 'ps5_pro',
    path: '@/assets/products/ps5-pro.jpg',
    category: 'product',
    used_by: [],
  },
  ring_doorbell: {
    id: 'ring_doorbell',
    path: '@/assets/products/ring-doorbell.jpg',
    category: 'product',
    used_by: [],
  },
  samsung_galaxy: {
    id: 'samsung_galaxy',
    path: '@/assets/products/samsung-galaxy.jpg',
    category: 'product',
    used_by: [],
  },
  samsung_oled_tv: {
    id: 'samsung_oled_tv',
    path: '@/assets/products/samsung-oled-tv.jpg',
    category: 'product',
    used_by: [],
  },
  samsung_tv: {
    id: 'samsung_tv',
    path: '@/assets/products/samsung-tv.jpg',
    category: 'product',
    used_by: [],
  },
  xbox_series_x: {
    id: 'xbox_series_x',
    path: '@/assets/products/xbox-series-x.jpg',
    category: 'product',
    used_by: [],
  },
};

// ---------------------------------------------------------------------------
// 5. SOCIAL_PROOF — Contextual social proof message per intent
// ---------------------------------------------------------------------------

export const SOCIAL_PROOF: Record<Intent, string> = {
  BUY_NOW: '47 people bought this in the last hour',
  COMPARE: 'Rated #1 by 3 major review sites',
  USE_CASE: 'Recommended by 8,000+ gamers',
  BUDGET: 'Save an average of $120 vs. retail',
  RESEARCH: 'Read by 25,000 shoppers this month',
  GIFTING: 'Top-rated gift — 4.8\u2605 from 2,100 reviews',
};

// ---------------------------------------------------------------------------
// 6. SECTION_ORDERS — Page section order per intent
// ---------------------------------------------------------------------------

export const SECTION_ORDERS: Record<Intent, [string, string, string]> = {
  BUY_NOW: ['deals', 'reviews', 'guides'],
  COMPARE: ['guides', 'reviews', 'deals'],
  USE_CASE: ['deals', 'guides', 'reviews'],
  BUDGET: ['deals', 'reviews', 'guides'],
  RESEARCH: ['guides', 'deals', 'reviews'],
  GIFTING: ['deals', 'guides', 'reviews'],
};

// ---------------------------------------------------------------------------
// 7. INTENT_COLORS — Consistent color palette across Lens + Pulse
// ---------------------------------------------------------------------------

export const INTENT_COLORS: Record<Intent, string> = {
  BUY_NOW: '#ef4444',
  COMPARE: '#3b82f6',
  USE_CASE: '#a855f7',
  BUDGET: '#22c55e',
  RESEARCH: '#06b6d4',
  GIFTING: '#f59e0b',
};

// ---------------------------------------------------------------------------
// 8. BADGES — All badge variants used across templates
// ---------------------------------------------------------------------------

export const BADGES: Record<string, BadgeConfig> = {
  limited_stock: { text: 'Limited Stock', color: 'red' },
  save_up_to: { text: 'Save up to $400', color: 'green' },
  gaming_collection: { text: 'Gaming Collection', color: 'purple' },
  expert_resources: { text: 'Expert Resources', color: 'cyan' },
  gift_guide: { text: 'Gift Guide 2025', color: 'amber' },
  top_rated: { text: 'Top Rated', color: 'amber' },
  best_value: { text: 'Best Value', color: 'blue' },
  ships_today: { text: 'Ships Today', color: 'green' },
  compare_save: { text: 'Compare & Save', color: 'purple' },
  staff_pick: { text: 'Staff Pick', color: 'amber' },
};

// ---------------------------------------------------------------------------
// 9. CONFIDENCE_THRESHOLD — Minimum confidence to personalize
// ---------------------------------------------------------------------------

export const CONFIDENCE_THRESHOLD = 0.3;
export const DEFAULT_INTENT: Intent = 'RESEARCH';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get template config for an intent */
export function getTemplateForIntent(intent: Intent): TemplateConfig {
  return TEMPLATES[intent];
}

/** Get section order for an intent */
export function getSectionOrder(intent: Intent): [string, string, string] {
  return SECTION_ORDERS[intent];
}

/** Get social proof copy for an intent */
export function getSocialProof(intent: Intent): string {
  return SOCIAL_PROOF[intent];
}

/** Get all assets used by a specific intent */
export function getAssetsForIntent(intent: Intent): AssetEntry[] {
  return Object.values(ASSETS).filter((asset) => asset.used_by.includes(intent));
}

/** List all intents */
export function getAllIntents(): Intent[] {
  return Object.values(INTENTS);
}
