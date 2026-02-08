/**
 * AI Pipeline Types - Intent Classification & Decision Engine
 * VC Track: Plug-and-Play Dynamic Website Personalization
 */

/** Supported user intents (aligned with track requirements) */
export type IntentType =
  | "BUY_NOW"       // "buy 27 inch 4k monitor" - ready to purchase
  | "COMPARE"       // "best monitor 2026 comparison" - researching, comparing
  | "USE_CASE"      // "monitor for gaming / coding / design" - use-case focused
  | "BUDGET"        // "cheap 144hz monitor" - price-sensitive
  | "UNKNOWN";     // fallback when signals are ambiguous

/** Template IDs (finite set - must match HeroSection) */
export type TemplateType = "power" | "value" | "versatility";

/** CTA priority for decision engine */
export type CTAPriority = "buy" | "compare" | "explore";

/** Raw signals collected from the page/browser */
export interface ContextSignals {
  /** URL search params (e.g. ?intent=buy&utm_source=google) */
  urlParams: Record<string, string>;
  /** Full search query string */
  searchQuery: string | null;
  /** Referrer URL (document.referrer) */
  referrer: string | null;
  /** Inferred referrer type */
  referrerType: "google" | "social" | "email" | "direct" | "other";
  /** UTM parameters if present */
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  /** Demo override: forced persona (for preview mode) */
  personaOverride?: IntentType;
  /** Simulated early behavior (for demo: scroll/click in first 5s) */
  earlyBehavior?: "scroll" | "click_cta" | "idle";
  /** Timestamp when signals were collected */
  collectedAt: string;
}

/** Output of intent classification */
export interface IntentClassification {
  intent: IntentType;
  confidence: number; // 0-1
  reason: string;
  /** Which signals contributed (for debugging) */
  contributingSignals: string[];
}

/** Structured decision object (track requirement - must be explainable) */
export interface PersonalizationDecision {
  intent: IntentType;
  template: TemplateType;
  hero_image: string;
  headline: string;
  subheadline: string;
  cta: string;
  cta_priority: CTAPriority;
  reason: string;
  /** For debugging and trust */
  debug: {
    signalsUsed: string[];
    classificationReason: string;
  };
}
