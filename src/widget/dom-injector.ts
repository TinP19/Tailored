import type { Decision } from '../tailored/types';
import { renderHero } from './templates';

/**
 * Safely injects personalized content into the host page.
 * Looks for elements with data-tailored attributes and replaces their content.
 */
export function injectPersonalization(decision: Decision): void {
  // Inject hero
  const heroTarget = document.querySelector('[data-tailored="hero"]');
  if (heroTarget) {
    heroTarget.innerHTML = renderHero(decision);

    // Wire up CTA click tracking
    const ctaBtn = heroTarget.querySelector('[data-tailored-cta]');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        console.log('[Tailored] CTA clicked', { template: decision.template, cta: decision.cta });
        document.dispatchEvent(new CustomEvent('tailored:cta_click', {
          detail: { template: decision.template, cta: decision.cta },
        }));
      });
    }
  }

  // Inject social proof
  const socialTarget = document.querySelector('[data-tailored="social-proof"]');
  if (socialTarget && decision.social_proof) {
    socialTarget.textContent = decision.social_proof;
  }

  // Log what happened
  console.log('[Tailored] Personalization injected:', {
    template: decision.template,
    hero_image: decision.hero_image,
    cta: decision.cta,
  });
}
