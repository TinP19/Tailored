import { Signal, IntentId, SubIntent, IntentScores, IntentResult } from '../types';

const CONFIDENCE_THRESHOLD = 3;

const USE_CASE_SUB_INTENTS: Record<string, SubIntent> = {
  gaming: 'gaming',
  game: 'gaming',
  coding: 'coding',
  programming: 'coding',
  code: 'coding',
  design: 'design',
  creative: 'design',
  office: 'office',
  work: 'office',
};

function detectSubIntent(signals: Signal[]): SubIntent {
  for (const signal of signals) {
    const raw = signal.rawValue.toLowerCase();
    for (const [keyword, subIntent] of Object.entries(USE_CASE_SUB_INTENTS)) {
      if (raw.includes(keyword)) {
        return subIntent;
      }
    }
  }
  return null;
}

export function scoreIntents(signals: Signal[]): IntentResult {
  const scores: IntentScores = {
    BUY_NOW: 0,
    COMPARE: 0,
    USE_CASE: 0,
    BUDGET: 0,
  };

  for (const signal of signals) {
    if (signal.contributedTo && signal.contributedTo !== 'GENERAL') {
      scores[signal.contributedTo] += signal.weight;
    }
  }

  let topIntent: IntentId = 'GENERAL';
  let topScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topIntent = intent as IntentId;
    }
  }

  if (topScore < CONFIDENCE_THRESHOLD) {
    topIntent = 'GENERAL';
  }

  const subIntent = topIntent === 'USE_CASE' ? detectSubIntent(signals) : null;

  return {
    intent: topIntent,
    subIntent,
    confidence: topScore,
    scores,
    signals,
  };
}
