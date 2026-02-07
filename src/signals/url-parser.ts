import { Signal, SignalSource, IntentId } from '../types';
import { classifyReferrer } from './referrer-classifier';
import keywords from '../engine/keywords.json';

type KeywordCategory = 'buy_keywords' | 'compare_keywords' | 'usecase_keywords' | 'budget_keywords';

const CATEGORY_TO_INTENT: Record<KeywordCategory, IntentId> = {
  buy_keywords: 'BUY_NOW',
  compare_keywords: 'COMPARE',
  usecase_keywords: 'USE_CASE',
  budget_keywords: 'BUDGET',
};

const UTM_PARAMS: SignalSource[] = ['utm_source', 'utm_medium', 'utm_content', 'utm_campaign'];

function matchKeywords(value: string): { intent: IntentId; keyword: string } | null {
  const lower = value.toLowerCase();

  for (const [category, wordList] of Object.entries(keywords)) {
    const intentId = CATEGORY_TO_INTENT[category as KeywordCategory];
    if (!intentId) continue;

    for (const kw of wordList) {
      if (lower.includes(kw.toLowerCase())) {
        return { intent: intentId, keyword: kw };
      }
    }
  }
  return null;
}

export function collectSignals(): Signal[] {
  const signals: Signal[] = [];
  const params = new URLSearchParams(window.location.search);

  // 1. UTM params (weight 3)
  for (const paramName of UTM_PARAMS) {
    const value = params.get(paramName);
    if (!value) continue;

    const match = matchKeywords(value);
    signals.push({
      source: paramName,
      rawValue: value,
      matchedKeyword: match?.keyword ?? null,
      contributedTo: match?.intent ?? null,
      weight: match ? 3 : 0,
    });
  }

  // 2. Non-UTM query params (weight 3)
  params.forEach((value, key) => {
    if (key.startsWith('utm_')) return;
    const match = matchKeywords(value);
    if (match) {
      signals.push({
        source: 'query_param',
        rawValue: `${key}=${value}`,
        matchedKeyword: match.keyword,
        contributedTo: match.intent,
        weight: 3,
      });
    }
  });

  // 3. Referrer (weight 2)
  const referrerSignal = classifyReferrer(document.referrer);
  if (referrerSignal) {
    signals.push(referrerSignal);
  }

  return signals;
}
