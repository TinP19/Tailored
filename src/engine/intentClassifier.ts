// ============================================================================
// Tailored — Intent Classifier
// Scores signals against keyword maps and referrer/device bonuses to
// produce a confidence-ranked intent classification.
// Pure function — no side effects, fully unit-testable with mock SignalData.
// ============================================================================

import type { Intent } from './templateRegistry';
import { INTENTS, CONFIDENCE_THRESHOLD, DEFAULT_INTENT } from './templateRegistry';
import type { SignalData, ReferrerType, DeviceType, TimeContext } from './signalParser';

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export interface ClassificationResult {
  primary_intent: Intent;
  secondary_intent: Intent | null;
  confidence: number;
  scores: Record<Intent, number>;
  reasoning: string;
  fallback_used: boolean;
  signals_used: string[];
}

// ---------------------------------------------------------------------------
// Keyword maps — tokens that indicate each intent
// ---------------------------------------------------------------------------

const INTENT_KEYWORDS: Record<Intent, string[]> = {
  BUY_NOW: [
    'buy', 'order', 'purchase', 'add to cart', 'checkout',
    'get', 'shop', 'now', 'cart', 'shipping',
  ],
  COMPARE: [
    'best', 'vs', 'versus', 'compare', 'top', 'review',
    'rated', 'ranking', 'which', 'difference',
  ],
  USE_CASE: [
    'gaming', 'coding', 'work', 'office', 'streaming', 'design',
    'studio', 'student', 'programming', 'creative', 'music',
    'video editing', 'photo editing', 'school',
  ],
  BUDGET: [
    'cheap', 'budget', 'affordable', 'under', 'deal', 'sale',
    'discount', 'clearance', 'value', 'save', 'price',
    'inexpensive', 'low cost', 'bargain',
  ],
  RESEARCH: [
    'guide', 'how to', 'what is', 'learn', 'explained', '101',
    'tutorial', 'beginner', 'overview', 'introduction',
  ],
  GIFTING: [
    'gift', 'for him', 'for her', 'present', 'birthday',
    'christmas', 'holiday', 'wedding', 'anniversary', 'for dad',
    'for mom', 'for kids', 'gift card', 'wrap',
  ],
};

// ---------------------------------------------------------------------------
// Scoring constants
// ---------------------------------------------------------------------------

const UTM_MATCH_WEIGHT = 0.4;
const UTM_MAX_CONTRIBUTION = 0.8;
const MIN_SCORE_THRESHOLD = 0.2; // top score must exceed this to avoid fallback

const REFERRER_BONUSES: Partial<Record<ReferrerType, { intent: Intent; weight: number }[]>> = {
  review_site:    [{ intent: 'COMPARE', weight: 0.25 }],
  social:         [{ intent: 'USE_CASE', weight: 0.15 }],
  search_paid:    [{ intent: 'BUY_NOW', weight: 0.2 }],
  email:          [{ intent: 'BUY_NOW', weight: 0.15 }],
  direct:         [{ intent: 'BUY_NOW', weight: 0.1 }],
  search_organic: [{ intent: 'RESEARCH', weight: 0.1 }],
};

interface DeviceTimeRule {
  device: DeviceType;
  time: TimeContext;
  intent: Intent;
  weight: number;
}

const DEVICE_TIME_BONUSES: DeviceTimeRule[] = [
  { device: 'mobile', time: 'evening', intent: 'RESEARCH', weight: 0.1 },
  { device: 'mobile', time: 'night', intent: 'RESEARCH', weight: 0.1 },
  { device: 'desktop', time: 'afternoon', intent: 'BUY_NOW', weight: 0.05 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function initScores(): Record<Intent, number> {
  return {
    BUY_NOW: 0,
    COMPARE: 0,
    USE_CASE: 0,
    BUDGET: 0,
    RESEARCH: 0,
    GIFTING: 0,
  };
}

/** Check if a multi-word phrase exists in the token array by joining adjacent tokens. */
function containsPhrase(tokens: string[], phrase: string): boolean {
  const phraseWords = phrase.split(/\s+/);
  if (phraseWords.length === 1) {
    return tokens.includes(phrase);
  }
  // For multi-word phrases, check contiguous subsequences
  const joined = tokens.join(' ');
  return joined.includes(phrase);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function classifyIntent(signals: SignalData): ClassificationResult {
  const scores = initScores();
  const signalsUsed: string[] = [];
  const reasoningParts: string[] = [];

  const allIntents = Object.values(INTENTS);

  // ── 1. UTM keyword scoring ────────────────────────────────────────────

  const utmTokens = signals.utm.term; // already lowercased & tokenized
  // Also fold in campaign and source as additional signal tokens
  const extraTokens = [signals.utm.campaign, signals.utm.source]
    .filter((s) => s.length > 0)
    .flatMap((s) => s.split(/[\s+\-,]+/).filter((t) => t.length > 0));
  const allTokens = [...utmTokens, ...extraTokens];

  if (allTokens.length > 0) {
    const utmContributions: Record<Intent, number> = initScores();

    for (const intent of allIntents) {
      const keywords = INTENT_KEYWORDS[intent];
      for (const keyword of keywords) {
        if (containsPhrase(allTokens, keyword)) {
          utmContributions[intent] += UTM_MATCH_WEIGHT;
          reasoningParts.push(
            `UTM contains '${keyword}' (${intent} +${UTM_MATCH_WEIGHT})`,
          );
          signalsUsed.push(`utm:${keyword}`);
        }
      }
      // Cap UTM contribution per intent
      utmContributions[intent] = Math.min(utmContributions[intent], UTM_MAX_CONTRIBUTION);
      scores[intent] += utmContributions[intent];
    }
  }

  // ── 2. Referrer bonus ─────────────────────────────────────────────────

  const refType = signals.referrer.type;
  const refBonuses = REFERRER_BONUSES[refType];
  if (refBonuses) {
    for (const { intent, weight } of refBonuses) {
      scores[intent] += weight;
      reasoningParts.push(
        `Referrer is ${refType} (${intent} +${weight})`,
      );
      signalsUsed.push(`referrer:${refType}`);
    }
  }

  // ── 3. Device + time bonus ────────────────────────────────────────────

  for (const rule of DEVICE_TIME_BONUSES) {
    if (
      signals.device.type === rule.device &&
      signals.device.time_context === rule.time
    ) {
      scores[rule.intent] += rule.weight;
      reasoningParts.push(
        `${rule.device} + ${rule.time} (${rule.intent} +${rule.weight})`,
      );
      signalsUsed.push(`device_time:${rule.device}_${rule.time}`);
    }
  }

  // ── 4. Rank intents by score ──────────────────────────────────────────

  const ranked = allIntents
    .map((intent) => ({ intent, score: scores[intent] }))
    .sort((a, b) => b.score - a.score);

  const topScore = ranked[0].score;
  const secondScore = ranked[1].score;

  // ── 5. Confidence calculation ─────────────────────────────────────────
  // confidence = top / (top + second + 0.1)  — measures separation

  let confidence =
    topScore > 0
      ? topScore / (topScore + secondScore + 0.1)
      : 0;
  confidence = Math.max(0, Math.min(1, confidence));

  // ── 6. Fallback check ─────────────────────────────────────────────────

  let primaryIntent = ranked[0].intent;
  let fallbackUsed = false;

  if (confidence < CONFIDENCE_THRESHOLD || topScore < MIN_SCORE_THRESHOLD) {
    primaryIntent = DEFAULT_INTENT;
    fallbackUsed = true;
    reasoningParts.push(
      `Confidence ${confidence.toFixed(2)} below threshold ${CONFIDENCE_THRESHOLD} — falling back to ${DEFAULT_INTENT}`,
    );
    signalsUsed.push('fallback');
  }

  const secondaryIntent =
    ranked[1].score > 0 ? ranked[1].intent : null;

  // ── 7. Build reasoning string ─────────────────────────────────────────

  // Deduplicate referrer/device entries in reasoning
  const uniqueReasonParts = [...new Set(reasoningParts)];

  const reasoning =
    uniqueReasonParts.length > 0
      ? uniqueReasonParts.join('. ') +
        `. Top: ${primaryIntent} at ${confidence.toFixed(2)} confidence.`
      : `No signals detected. Defaulting to ${DEFAULT_INTENT}.`;

  // ── 8. Return ─────────────────────────────────────────────────────────

  return {
    primary_intent: primaryIntent,
    secondary_intent: secondaryIntent,
    confidence,
    scores,
    reasoning,
    fallback_used: fallbackUsed,
    signals_used: [...new Set(signalsUsed)],
  };
}
