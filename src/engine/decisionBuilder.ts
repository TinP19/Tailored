// ============================================================================
// Tailored — Decision Builder
// Takes a ClassificationResult + SignalData and assembles a full
// DecisionObject by looking up the matched intent in the template registry.
// Pure data transform — no DOM manipulation, no side effects.
// ============================================================================

import type { Intent, BadgeConfig, CTAConfig } from './templateRegistry';
import { TEMPLATES } from './templateRegistry';
import type { SignalData } from './signalParser';
import type { ClassificationResult } from './intentClassifier';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ENGINE_VERSION = '1.0.0';
const VISITOR_ID_PREFIX = 'v_';
const VISITOR_ID_LENGTH = 6;

// ---------------------------------------------------------------------------
// Decision types
// ---------------------------------------------------------------------------

export interface DecisionSlots {
  template: string;
  template_id: string;
  layout: string;
  hero_image: string;
  badge: BadgeConfig | null;
  headline: string;
  subheadline: string;
  cta_primary: CTAConfig;
  cta_secondary: CTAConfig | null;
  social_proof: string;
  urgency_bar: string | null;
  section_order: string[];
}

export interface DecisionObject {
  visitor_id: string;
  timestamp: string;
  signals: SignalData;
  classification: ClassificationResult;
  decision: DecisionSlots;
  fallback_used: boolean;
  engine_version: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateVisitorId(): string {
  const hex = Array.from({ length: VISITOR_ID_LENGTH }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
  return VISITOR_ID_PREFIX + hex;
}

/**
 * Get or create a stable visitor ID for the current session.
 * Falls back to generating a fresh one if sessionStorage is unavailable.
 */
function getVisitorId(): string {
  const STORAGE_KEY = 'tailored_visitor_id';
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = generateVisitorId();
    sessionStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // sessionStorage unavailable (SSR, privacy mode, tests)
    return generateVisitorId();
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Assembles a full DecisionObject from classification results and raw signals.
 *
 * @param classification - Output from classifyIntent()
 * @param signals        - Output from parseSignals()
 * @param visitorId      - Optional override for testing (skips sessionStorage)
 */
export function buildDecision(
  classification: ClassificationResult,
  signals: SignalData,
  visitorId?: string,
): DecisionObject {
  const intent: Intent = classification.primary_intent;
  const template = TEMPLATES[intent];

  const decision: DecisionSlots = {
    template: template.component,
    template_id: template.template_id,
    layout: template.layout,
    hero_image: template.hero_image,
    badge: template.badge,
    headline: template.headline,
    subheadline: template.subheadline,
    cta_primary: template.cta_primary,
    cta_secondary: template.cta_secondary,
    social_proof: template.social_proof,
    urgency_bar: template.urgency_bar,
    section_order: [...template.section_order],
  };

  return {
    visitor_id: visitorId ?? getVisitorId(),
    timestamp: new Date().toISOString(),
    signals,
    classification,
    decision,
    fallback_used: classification.fallback_used,
    engine_version: ENGINE_VERSION,
  };
}
