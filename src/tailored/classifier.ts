import type { Intent, Signals, Classification } from './types';
import { CONFIDENCE_THRESHOLD, DEFAULT_INTENT } from './config';

const ALL_INTENTS: Intent[] = ['BUY_NOW', 'COMPARE', 'USE_CASE', 'BUDGET', 'RESEARCH', 'GIFTING'];

interface KeywordRule {
  keywords: string[];
  weight: number;
  intent: Intent;
}

const KEYWORD_RULES: KeywordRule[] = [
  { keywords: ['buy', 'order', 'add to cart', 'now', 'purchase', 'checkout'], weight: 0.45, intent: 'BUY_NOW' },
  { keywords: ['best', 'vs', 'top', 'compare', 'review', 'which', 'versus'], weight: 0.40, intent: 'COMPARE' },
  { keywords: ['gaming', 'coding', 'work', 'streaming', 'student', 'studio', 'creative', 'office'], weight: 0.30, intent: 'USE_CASE' },
  { keywords: ['cheap', 'under', 'budget', 'deal', 'sale', 'affordable', 'value', 'discount'], weight: 0.40, intent: 'BUDGET' },
  { keywords: ['gift', 'for him', 'for her', 'christmas', 'birthday', 'holiday', 'present', 'wedding'], weight: 0.35, intent: 'GIFTING' },
];

export interface ClassifyResult {
  classification: Classification;
  fallback_used: boolean;
}

export function classifyIntent(signals: Signals): ClassifyResult {
  const scores: Record<Intent, number> = {
    BUY_NOW: 0, COMPARE: 0, USE_CASE: 0, BUDGET: 0, RESEARCH: 0, GIFTING: 0,
  };

  const reasons: string[] = [];

  // UTM keyword matching
  if (signals.utm_term) {
    const text = signals.utm_term.toLowerCase();

    for (const rule of KEYWORD_RULES) {
      for (const kw of rule.keywords) {
        if (text.includes(kw)) {
          scores[rule.intent] += rule.weight;
          reasons.push(`UTM contains '${kw}' → ${rule.intent} (+${rule.weight})`);
          break;
        }
      }
    }
  }

  // Referrer bonuses
  switch (signals.referrer_type) {
    case 'review_site':
      scores.COMPARE += 0.25;
      reasons.push(`Referrer is review_site → COMPARE (+0.25)`);
      break;
    case 'social':
      scores.USE_CASE += 0.15;
      reasons.push(`Referrer is social → USE_CASE (+0.15)`);
      break;
    case 'email':
    case 'direct':
      scores.BUY_NOW += 0.10;
      reasons.push(`Referrer is ${signals.referrer_type} → BUY_NOW (+0.10)`);
      break;
    case 'search_organic':
      scores.RESEARCH += 0.10;
      reasons.push(`Referrer is search_organic → RESEARCH (+0.10)`);
      break;
  }

  // Composite: mobile + evening → research
  if (signals.device === 'mobile' && signals.time_context.startsWith('evening')) {
    scores.RESEARCH += 0.10;
    reasons.push(`Mobile + evening → RESEARCH (+0.10)`);
  }

  // Find top two intents
  const sorted = ALL_INTENTS.slice().sort((a, b) => scores[b] - scores[a]);
  let primary_intent = sorted[0];
  const secondary_intent = scores[sorted[1]] > 0 ? sorted[1] : null;
  let confidence = Math.min(scores[primary_intent], 1);
  let fallback_used = false;

  if (confidence < CONFIDENCE_THRESHOLD) {
    primary_intent = DEFAULT_INTENT;
    confidence = CONFIDENCE_THRESHOLD;
    fallback_used = true;
    reasons.push(`Confidence below ${CONFIDENCE_THRESHOLD} → fallback to ${DEFAULT_INTENT}`);
  }

  reasons.push(`Primary: ${primary_intent} (${confidence.toFixed(2)})`);

  return {
    classification: {
      primary_intent,
      confidence,
      secondary_intent,
      reasoning: reasons.join('. ') + '.',
      scores,
    },
    fallback_used,
  };
}
