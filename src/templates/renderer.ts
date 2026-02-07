import { DecisionObject } from '../types';

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderHeroImpact(d: DecisionObject): string {
  const badgeHtml = d.badge
    ? `<span class="isw-badge">${escapeHtml(d.badge)}</span>`
    : '';

  return `
    <div class="isw-hero isw-hero-impact">
      <div class="isw-hero-bg">
        <img class="isw-hero-bg-img" src="${escapeHtml(d.heroImageSrc)}" alt="${escapeHtml(d.headline)}" loading="eager" />
        <div class="isw-hero-overlay"></div>
      </div>
      <div class="isw-hero-content">
        ${badgeHtml}
        <h1 class="isw-headline">${escapeHtml(d.headline)}</h1>
        <p class="isw-subheadline">${escapeHtml(d.subheadline)}</p>
        <a class="isw-cta" href="${escapeHtml(d.ctaLink)}">${escapeHtml(d.ctaText)}</a>
      </div>
    </div>
  `;
}

function renderHeroComparison(d: DecisionObject): string {
  return `
    <div class="isw-hero isw-hero-comparison">
      <div class="isw-hero-content isw-hero-content-top">
        <h1 class="isw-headline">${escapeHtml(d.headline)}</h1>
        <p class="isw-subheadline">${escapeHtml(d.subheadline)}</p>
      </div>
      <div class="isw-comparison-split">
        <div class="isw-comparison-left">
          <img class="isw-comparison-img" src="${escapeHtml(d.heroImageSrc)}" alt="Monitor Option A" loading="eager" />
          <span class="isw-comparison-label">UltraView Pro 27"</span>
        </div>
        <div class="isw-comparison-divider">
          <span class="isw-comparison-vs">VS</span>
        </div>
        <div class="isw-comparison-right">
          <img class="isw-comparison-img" src="${escapeHtml(d.heroImageSrc)}" alt="Monitor Option B" loading="eager" />
          <span class="isw-comparison-label">CinemaWide 34"</span>
        </div>
      </div>
      <div class="isw-hero-actions">
        <a class="isw-cta" href="${escapeHtml(d.ctaLink)}">${escapeHtml(d.ctaText)}</a>
      </div>
    </div>
  `;
}

function renderHeroLifestyle(d: DecisionObject): string {
  const tagHtml = d.useCaseTag
    ? `<span class="isw-use-case-tag">${escapeHtml(d.useCaseTag)}</span>`
    : '';

  return `
    <div class="isw-hero isw-hero-lifestyle">
      <img class="isw-hero-bg-img" src="${escapeHtml(d.heroImageSrc)}" alt="${escapeHtml(d.headline)}" loading="eager" />
      <div class="isw-hero-overlay isw-hero-overlay-bottom"></div>
      <div class="isw-hero-content isw-hero-content-bottom">
        ${tagHtml}
        <h1 class="isw-headline">${escapeHtml(d.headline)}</h1>
        <p class="isw-subheadline">${escapeHtml(d.subheadline)}</p>
        <a class="isw-cta isw-cta-outline" href="${escapeHtml(d.ctaLink)}">${escapeHtml(d.ctaText)}</a>
      </div>
    </div>
  `;
}

const TEMPLATE_RENDERERS: Record<string, (d: DecisionObject) => string> = {
  hero_impact: renderHeroImpact,
  hero_comparison: renderHeroComparison,
  hero_lifestyle: renderHeroLifestyle,
};

export function renderTemplate(decision: DecisionObject): string {
  const renderer = TEMPLATE_RENDERERS[decision.template];
  if (!renderer) {
    console.warn(`[IntentSwap] Unknown template: ${decision.template}, falling back to hero_impact`);
    return renderHeroImpact(decision);
  }
  return renderer(decision);
}
