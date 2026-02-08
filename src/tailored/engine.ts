import type { Signals, DecisionObject } from './types';
import { INTENT_TEMPLATE_MAP, SECTION_ORDER_MAP, SOCIAL_PROOF_MAP } from './config';
import { parseSignals } from './signals';
import { classifyIntent } from './classifier';

function getVisitorId(): string {
  const key = 'tailored_visitor_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = 'v_' + Math.random().toString(16).slice(2, 8);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function runEngine(overrides?: Partial<Signals>): DecisionObject {
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
      section_order: SECTION_ORDER_MAP[intent],
      social_proof: SOCIAL_PROOF_MAP[intent],
    },
    fallback_used,
  };
}
