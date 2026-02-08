/**
 * Asset Library - Finite set of images for hero sections
 * AI must choose images based on intent, not randomly.
 * VC Track: Asset Library with 6+ images
 */

import type { IntentType } from "./types";

// Import paths for Vite bundling
import heroPower from "@/assets/hero-power.jpg";
import heroValue from "@/assets/hero-value.jpg";
import heroVersatility from "@/assets/hero-versatility.jpg";

export interface Asset {
  key: string;
  url: string;
  /** Which intents this asset is best for */
  intentFit: IntentType[];
  description: string;
}

export const ASSET_LIBRARY: Asset[] = [
  {
    key: "gaming_setup",
    url: heroPower,
    intentFit: ["BUY_NOW", "USE_CASE"],
    description: "Gaming/high-performance setup - gaming monitors, RGB",
  },
  {
    key: "office_pro",
    url: heroVersatility,
    intentFit: ["COMPARE", "USE_CASE"],
    description: "Office/professional workspace - productivity, coding, design",
  },
  {
    key: "budget_home",
    url: heroValue,
    intentFit: ["BUDGET"],
    description: "Home entertainment, family use - value-focused",
  },
  // Additional variants can map to same images with different intent semantics
  {
    key: "gaming_value",
    url: heroPower,
    intentFit: ["BUDGET"],
    description: "Gaming on a budget - affordable performance",
  },
  {
    key: "compare_pro",
    url: heroVersatility,
    intentFit: ["COMPARE"],
    description: "Side-by-side comparison feel - professional",
  },
  {
    key: "buy_now_hero",
    url: heroPower,
    intentFit: ["BUY_NOW"],
    description: "Ready-to-buy urgency - premium gaming",
  },
];

/** Resolve asset key to URL */
export function getAssetUrl(key: string): string {
  const asset = ASSET_LIBRARY.find((a) => a.key === key);
  return asset?.url ?? ASSET_LIBRARY[0].url;
}

/** Get best asset for intent */
export function getAssetForIntent(intent: IntentType): string {
  const asset = ASSET_LIBRARY.find((a) => a.intentFit.includes(intent));
  return asset?.url ?? ASSET_LIBRARY[0].url;
}
