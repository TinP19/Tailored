import type { Signals, DecisionObject } from './types';
import { INTENT_TEMPLATE_MAP, SECTION_ORDER_MAP, SOCIAL_PROOF_MAP } from './config';
import { HERO_IMAGE_DEFAULTS, CTA_DEFAULTS } from './assets';
import { parseSignals } from './signals';
import { classifyIntent } from './classifier';
import { getClaudeDecision } from './claude';

function getVisitorId(): string {
  const key = 'tailored_visitor_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = 'v_' + Math.random().toString(16).slice(2, 8);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function runEngine(overrides?: Partial<Signals>): Promise<DecisionObject> {
  const signals = parseSignals(overrides);
  const { classification, fallback_used } = classifyIntent(signals);
  const intent = classification.primary_intent;

  // Try Claude AI first
  const claudeResult = await getClaudeDecision(signals, classification);

  if (claudeResult) {
    return {
      visitor_id: getVisitorId(),
      timestamp: new Date().toISOString(),
      signals,
      classification: {
        ...classification,
        reasoning: claudeResult.reasoning,
      },
      decision: {
        template: claudeResult.template,
        hero_image: claudeResult.hero_image,
        cta: claudeResult.cta,
        section_order: SECTION_ORDER_MAP[intent],
        social_proof: SOCIAL_PROOF_MAP[intent],
      },
      fallback_used,
      claude_used: true,
    };
  }

  // Fallback to rules engine
  return {
    visitor_id: getVisitorId(),
    timestamp: new Date().toISOString(),
    signals,
    classification,
    decision: {
      template: INTENT_TEMPLATE_MAP[intent],
      hero_image: HERO_IMAGE_DEFAULTS[intent],
      cta: CTA_DEFAULTS[intent],
      section_order: SECTION_ORDER_MAP[intent],
      social_proof: SOCIAL_PROOF_MAP[intent],
    },
    fallback_used,
    claude_used: false,
  };
}
