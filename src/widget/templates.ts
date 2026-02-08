import type { Decision } from '../tailored/types';

const STYLES = `
<style>
.tailored-hero { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; padding: 48px 24px; text-align: center; border-radius: 16px; margin: 0 auto; max-width: 960px; position: relative; overflow: hidden; }
.tailored-hero h1 { font-size: 2.5rem; font-weight: 800; line-height: 1.1; margin: 0 0 12px; }
.tailored-hero p { font-size: 1.1rem; opacity: 0.7; margin: 0 0 24px; }
.tailored-hero .th-badge { display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
.tailored-hero .th-cta { display: inline-block; padding: 14px 32px; border-radius: 12px; font-size: 1rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; transition: transform 0.15s, box-shadow 0.15s; }
.tailored-hero .th-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.tailored-hero .th-meta { font-size: 0.85rem; opacity: 0.6; margin-top: 16px; }
.th-urgency { background: linear-gradient(135deg, #1a0505, #2d0a0a); color: #fff; border: 1px solid rgba(239,68,68,0.3); }
.th-urgency .th-badge { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.4); }
.th-urgency .th-cta { background: #22c55e; color: #fff; }
.th-comparison { background: linear-gradient(135deg, #0a0a1a, #0a0e2d); color: #fff; border: 1px solid rgba(59,130,246,0.3); }
.th-comparison .th-badge { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.4); }
.th-comparison .th-cta { background: #3b82f6; color: #fff; }
.th-lifestyle { background: linear-gradient(135deg, #0f0520, #1a0530); color: #fff; border: 1px solid rgba(168,85,247,0.3); }
.th-lifestyle .th-badge { background: rgba(168,85,247,0.2); color: #c084fc; border: 1px solid rgba(168,85,247,0.4); }
.th-lifestyle .th-cta { background: #a855f7; color: #fff; }
.th-value { background: linear-gradient(135deg, #051a0a, #0a2d10); color: #fff; border: 1px solid rgba(34,197,94,0.3); }
.th-value .th-badge { background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4); }
.th-value .th-cta { background: #22c55e; color: #fff; }
.th-guide { background: linear-gradient(135deg, #051a1a, #0a2d2d); color: #fff; border: 1px solid rgba(6,182,212,0.3); }
.th-guide .th-badge { background: rgba(6,182,212,0.2); color: #22d3ee; border: 1px solid rgba(6,182,212,0.4); }
.th-guide .th-cta { background: #06b6d4; color: #fff; }
.th-gift { background: linear-gradient(135deg, #1a1005, #2d1a0a); color: #fff; border: 1px solid rgba(245,158,11,0.3); }
.th-gift .th-badge { background: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid rgba(245,158,11,0.4); }
.th-gift .th-cta { background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; }
</style>`;

const TEMPLATE_CONFIG: Record<string, { cssClass: string; badge: string; headline: string; sub: string; socialProof: string }> = {
  hero_urgency: {
    cssClass: 'th-urgency',
    badge: 'Limited Stock',
    headline: 'Don\'t Miss Out — Ships Today',
    sub: 'Grab this deal before stock runs out.',
    socialProof: '47 people bought this in the last hour',
  },
  hero_comparison: {
    cssClass: 'th-comparison',
    badge: 'Top Picks',
    headline: 'Find Your Perfect Match',
    sub: 'See how the top products compare side-by-side.',
    socialProof: 'Rated #1 by 3 major review sites',
  },
  hero_lifestyle: {
    cssClass: 'th-lifestyle',
    badge: 'Curated Collection',
    headline: 'Built for Your Lifestyle',
    sub: 'Setups designed for peak performance.',
    socialProof: 'Recommended by 8,000+ users',
  },
  hero_value: {
    cssClass: 'th-value',
    badge: 'Best Value',
    headline: 'Premium Tech. Honest Prices.',
    sub: 'Save an average of $120 vs. retail.',
    socialProof: 'Thousands saved this month',
  },
  hero_guide: {
    cssClass: 'th-guide',
    badge: 'Expert Resources',
    headline: 'Your Journey Starts Here',
    sub: 'Explore guides, comparisons, and expert picks.',
    socialProof: 'Read by 25,000 shoppers this month',
  },
  hero_gift: {
    cssClass: 'th-gift',
    badge: 'Gift Guide',
    headline: 'Give the Gift of Great Tech',
    sub: 'Curated bundles they\'ll actually love.',
    socialProof: 'Top-rated gift — 4.8 stars',
  },
};

export function renderHero(decision: Decision): string {
  const config = TEMPLATE_CONFIG[decision.template] ?? TEMPLATE_CONFIG.hero_guide;
  const cta = decision.cta || 'Shop Now';

  return `${STYLES}
<div class="tailored-hero ${config.cssClass}">
  <span class="th-badge">${config.badge}</span>
  <h1>${config.headline}</h1>
  <p>${config.sub}</p>
  <button class="th-cta" data-tailored-cta>${cta}</button>
  <p class="th-meta">${config.socialProof}</p>
</div>`;
}
