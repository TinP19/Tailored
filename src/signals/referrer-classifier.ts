import { Signal, IntentId } from '../types';
import referrerMap from '../engine/referrers.json';

type ReferrerCategory = 'shopping' | 'review_blog' | 'social_forum' | 'deal_site';

const CATEGORY_TO_INTENT: Record<ReferrerCategory, IntentId> = {
  shopping: 'BUY_NOW',
  review_blog: 'COMPARE',
  social_forum: 'USE_CASE',
  deal_site: 'BUDGET',
};

export function classifyReferrer(referrer: string): Signal | null {
  if (!referrer) return null;

  let hostname: string;
  try {
    hostname = new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }

  for (const [category, domains] of Object.entries(referrerMap)) {
    for (const domain of domains) {
      if (domain.includes('/')) {
        // Path-based match (e.g. "google.com/shopping")
        if (referrer.includes(domain)) {
          return {
            source: 'referrer',
            rawValue: referrer,
            matchedKeyword: domain,
            contributedTo: CATEGORY_TO_INTENT[category as ReferrerCategory] ?? null,
            weight: 2,
          };
        }
      } else {
        // Hostname match (including subdomains like old.reddit.com)
        if (hostname === domain || hostname.endsWith('.' + domain)) {
          return {
            source: 'referrer',
            rawValue: referrer,
            matchedKeyword: domain,
            contributedTo: CATEGORY_TO_INTENT[category as ReferrerCategory] ?? null,
            weight: 2,
          };
        }
      }
    }
  }

  return null;
}
