/**
 * Tailored Widget — Plug-and-play personalization for any website.
 * Add this script to any page: <script src="tailored.min.js"></script>
 * Mark elements with data-tailored="hero" to personalize them.
 */

import type { Signals, DecisionObject, Intent } from '../tailored/types';
import { INTENT_TEMPLATE_MAP, SECTION_ORDER_MAP, SOCIAL_PROOF_MAP } from '../tailored/config';
import { parseSignals } from '../tailored/signals';
import { classifyIntent } from '../tailored/classifier';
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

function runWidgetEngine(overrides?: Partial<Signals>): DecisionObject {
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

const TailoredAPI = {
  init(config?: { debug?: boolean }) {
    currentDecision = runWidgetEngine();
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
      console.log('[Tailored] Decision:', currentDecision);
    }

    return currentDecision;
  },

  getDecision(): DecisionObject | null {
    return currentDecision;
  },

  simulate(intent: Intent) {
    const UTM_MAP: Record<Intent, string> = {
      BUY_NOW: 'buy now',
      COMPARE: 'best vs top',
      USE_CASE: 'gaming setup',
      BUDGET: 'cheap deal budget',
      RESEARCH: 'how to choose',
      GIFTING: 'gift for him',
    };

    currentDecision = runWidgetEngine({ utm_term: UTM_MAP[intent] });
    injectPersonalization(currentDecision.decision);
    trackEvent('intent_detected', {
      intent: currentDecision.classification.primary_intent,
      confidence: currentDecision.classification.confidence,
      template: currentDecision.decision.template,
      simulated: true,
    });

    console.log(`[Tailored] Simulated intent: ${intent}`, currentDecision.decision);
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
