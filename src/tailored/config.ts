import type { Intent } from './types';

export const INTENT_TEMPLATE_MAP: Record<Intent, string> = {
  BUY_NOW:  'hero_urgency',
  COMPARE:  'hero_comparison',
  USE_CASE: 'hero_lifestyle',
  BUDGET:   'hero_value',
  RESEARCH: 'hero_guide',
  GIFTING:  'hero_gift',
};

export const SECTION_ORDER_MAP: Record<Intent, string[]> = {
  BUY_NOW:  ['deals', 'reviews', 'guides'],
  COMPARE:  ['guides', 'reviews', 'deals'],
  USE_CASE: ['deals', 'guides', 'reviews'],
  BUDGET:   ['deals', 'reviews', 'guides'],
  RESEARCH: ['guides', 'deals', 'reviews'],
  GIFTING:  ['deals', 'guides', 'reviews'],
};

export const SOCIAL_PROOF_MAP: Record<Intent, string> = {
  BUY_NOW:  '47 people bought this in the last hour',
  COMPARE:  'Rated #1 by 3 major review sites',
  USE_CASE: 'Recommended by 8,000+ gamers',
  BUDGET:   'Save an average of $120 vs. retail',
  RESEARCH: 'Read by 25,000 shoppers this month',
  GIFTING:  'Top-rated gift — 4.8★ from 2,100 reviews',
};

export const INTENT_COLORS: Record<Intent, string> = {
  BUY_NOW:  '#ef4444',
  COMPARE:  '#3b82f6',
  USE_CASE: '#a855f7',
  BUDGET:   '#22c55e',
  RESEARCH: '#06b6d4',
  GIFTING:  '#f59e0b',
};

export const CONFIDENCE_THRESHOLD = 0.30;
export const DEFAULT_INTENT: Intent = 'RESEARCH';
