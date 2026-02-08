/**
 * Tailored Widget — Plug-and-play personalization for any website.
 * Add this script to any page: <script src="tailored.min.js"></script>
 * Mark elements with data-tailored="hero" to personalize them.
 */

import type { Signals, DecisionObject, Intent } from '../tailored/types';
import { INTENT_TEMPLATE_MAP, SECTION_ORDER_MAP, SOCIAL_PROOF_MAP } from '../tailored/config';
import { parseSignals } from '../tailored/signals';
import { classifyIntent } from '../tailored/classifier';
import { getClaudeDecision } from '../tailored/claude';
import { injectPersonalization } from './dom-injector';

// Lightweight defaults (no image imports for small bundle size)
const WIDGET_HERO_IMAGE_DEFAULTS: Record<Intent, string> = {
  BUY_NOW: 'macbook-pro',
  COMPARE: 'asus-rog',
  USE_CASE: 'hero-lifestyle',
  BUDGET: 'nintendo-switch',
  RESEARCH: 'ipad-pro',
  GIFTING: 'sony-headphones',
};

const WIDGET_CTA_DEFAULTS: Record<Intent, string> = {
  BUY_NOW: 'Buy Now — Free Next-Day Delivery',
  COMPARE: 'Compare All Models',
  USE_CASE: 'Shop Gaming Setups',
  BUDGET: 'Shop Best Value',
  RESEARCH: 'Take the Quiz — Find Your Match',
  GIFTING: 'Shop Gift Guide',
};

const UTM_MAP: Record<Intent, string> = {
  BUY_NOW: 'buy now',
  COMPARE: 'best vs top',
  USE_CASE: 'gaming setup',
  BUDGET: 'cheap deal budget',
  RESEARCH: 'how to choose',
  GIFTING: 'gift for him',
};

function getVisitorId(): string {
  const key = 'tailored_visitor_id';
  let id: string | null = null;
  try { id = sessionStorage.getItem(key); } catch { /* noop */ }
  if (!id) {
    id = 'v_' + Math.random().toString(16).slice(2, 8);
    try { sessionStorage.setItem(key, id); } catch { /* noop */ }
  }
  return id;
}

/** Synchronous rules-based engine for instant Phase 1 rendering */
function runRulesEngine(overrides?: Partial<Signals>): DecisionObject {
  const signals = parseSignals(overrides);
  const { classification, fallback_used } = classifyIntent(signals);
  const intent = classification.primary_intent;

  return {
    visitor_id: getVisitorId(),
    timestamp: new Date().toISOString(),
    signals,
    classification,
    decision: {
      template: INTENT_TEMPLATE_MAP[intent],
      hero_image: WIDGET_HERO_IMAGE_DEFAULTS[intent],
      cta: WIDGET_CTA_DEFAULTS[intent],
      section_order: SECTION_ORDER_MAP[intent],
      social_proof: SOCIAL_PROOF_MAP[intent],
    },
    fallback_used,
    claude_used: false,
  };
}

/** Async Phase 2: Enhance a rules decision with Gemini AI */
async function enhanceWithAI(rulesDecision: DecisionObject): Promise<DecisionObject> {
  const { signals, classification } = rulesDecision;
  const intent = classification.primary_intent;

  const aiResult = await getClaudeDecision(signals, classification);
  if (!aiResult) return rulesDecision;

  return {
    ...rulesDecision,
    timestamp: new Date().toISOString(),
    classification: {
      ...classification,
      reasoning: aiResult.reasoning,
    },
    decision: {
      template: aiResult.template,
      hero_image: aiResult.hero_image,
      cta: aiResult.cta,
      section_order: SECTION_ORDER_MAP[intent],
      social_proof: SOCIAL_PROOF_MAP[intent],
    },
    claude_used: true,
  };
}

function trackEvent(type: string, data: Record<string, unknown>): void {
  try {
    const key = 'tailored_events';
    const raw = localStorage.getItem(key);
    const events = raw ? JSON.parse(raw) : [];
    events.push({
      id: 'e_' + Math.random().toString(36).slice(2, 10),
      type,
      timestamp: new Date().toISOString(),
      visitor_id: getVisitorId(),
      data,
    });
    const trimmed = events.length > 500 ? events.slice(-500) : events;
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch { /* localStorage not available */ }
}

let currentDecision: DecisionObject | null = null;
const _listeners: Array<(decision: DecisionObject) => void> = [];

function notifyListeners(decision: DecisionObject) {
  for (const cb of _listeners) {
    try { cb(decision); } catch { /* noop */ }
  }
}

const TailoredAPI = {
  init(config?: { debug?: boolean }) {
    // Phase 1: Instant rules-based rendering
    currentDecision = runRulesEngine();
    injectPersonalization(currentDecision.decision);

    trackEvent('page_view', { url: window.location.href });
    trackEvent('intent_detected', {
      intent: currentDecision.classification.primary_intent,
      confidence: currentDecision.classification.confidence,
      template: currentDecision.decision.template,
    });
    trackEvent('hero_shown', {
      template: currentDecision.decision.template,
      intent: currentDecision.classification.primary_intent,
    });

    if (config?.debug) {
      console.log('[Tailored] Phase 1 (rules):', currentDecision);
    }

    // Phase 2: Async AI enhancement
    enhanceWithAI(currentDecision).then(aiDecision => {
      if (aiDecision.claude_used) {
        currentDecision = aiDecision;
        injectPersonalization(aiDecision.decision);
        notifyListeners(aiDecision);

        trackEvent('ai_enhanced', {
          template: aiDecision.decision.template,
          intent: aiDecision.classification.primary_intent,
          reasoning: aiDecision.classification.reasoning,
        });

        if (config?.debug) {
          console.log('[Tailored] Phase 2 (AI):', aiDecision);
        }
      } else {
        // AI failed, notify listeners with rules decision so React can render
        notifyListeners(currentDecision!);
      }
    });

    return currentDecision;
  },

  getDecision(): DecisionObject | null {
    return currentDecision;
  },

  /** Subscribe to decision updates (AI enhancement, simulate, etc.) */
  onDecision(callback: (decision: DecisionObject) => void) {
    _listeners.push(callback);
    // Fire immediately with current decision if available
    if (currentDecision) {
      try { callback(currentDecision); } catch { /* noop */ }
    }
  },

  offDecision(callback: (decision: DecisionObject) => void) {
    const idx = _listeners.indexOf(callback);
    if (idx >= 0) _listeners.splice(idx, 1);
  },

  /** Simulate a specific intent (two-phase: rules instant → AI async) */
  async simulate(intent: Intent): Promise<DecisionObject> {
    // Phase 1: Instant rules-based
    currentDecision = runRulesEngine({ utm_term: UTM_MAP[intent] });
    injectPersonalization(currentDecision.decision);
    notifyListeners(currentDecision);

    trackEvent('intent_detected', {
      intent: currentDecision.classification.primary_intent,
      confidence: currentDecision.classification.confidence,
      template: currentDecision.decision.template,
      simulated: true,
    });

    console.log(`[Tailored] Simulated intent: ${intent}`, currentDecision.decision);

    // Phase 2: Async AI enhancement
    const aiDecision = await enhanceWithAI(currentDecision);
    if (aiDecision.claude_used) {
      currentDecision = aiDecision;
      injectPersonalization(aiDecision.decision);
      notifyListeners(aiDecision);
      console.log(`[Tailored] AI-enhanced simulation: ${intent}`, aiDecision.decision);
    }

    return currentDecision;
  },

  /** Run with raw signal overrides (for advanced debug panel) */
  async runWithOverrides(overrides: Partial<Signals>): Promise<DecisionObject> {
    currentDecision = runRulesEngine(overrides);
    injectPersonalization(currentDecision.decision);
    notifyListeners(currentDecision);

    const aiDecision = await enhanceWithAI(currentDecision);
    if (aiDecision.claude_used) {
      currentDecision = aiDecision;
      injectPersonalization(aiDecision.decision);
      notifyListeners(aiDecision);
    }

    return currentDecision;
  },

  version: '1.0.0',
};

(window as unknown as Record<string, unknown>).Tailored = TailoredAPI;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TailoredAPI.init());
} else {
  TailoredAPI.init();
}
