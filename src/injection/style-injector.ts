const STYLE_ELEMENT_ID = 'isw-styles';

export function injectStyles(): void {
  if (document.getElementById(STYLE_ELEMENT_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = getStyles();
  document.head.appendChild(style);
}

export function removeStyles(): void {
  const el = document.getElementById(STYLE_ELEMENT_ID);
  if (el) el.remove();
}

function getStyles(): string {
  return `
    /* IntentSwap Widget — Scoped Styles */

    .isw-hero {
      position: relative;
      width: 100%;
      min-height: 500px;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-sizing: border-box;
    }

    .isw-hero *, .isw-hero *::before, .isw-hero *::after {
      box-sizing: border-box;
    }

    /* ── hero_impact ── */
    .isw-hero-impact {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 500px;
      position: relative;
    }

    .isw-hero-impact .isw-hero-bg {
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    .isw-hero-impact .isw-hero-bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .isw-hero-impact .isw-hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.55) 100%);
    }

    .isw-hero-impact .isw-hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 3rem 2rem;
      max-width: 700px;
      color: #ffffff;
    }

    /* ── hero_comparison ── */
    .isw-hero-comparison {
      text-align: center;
      padding: 3rem 2rem;
      background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
      color: #0f172a;
    }

    .isw-hero-content-top {
      margin-bottom: 2rem;
    }

    .isw-comparison-split {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      align-items: center;
      margin-bottom: 2rem;
    }

    .isw-comparison-left,
    .isw-comparison-right {
      flex: 1;
      max-width: 380px;
      text-align: center;
    }

    .isw-comparison-img {
      width: 100%;
      height: 280px;
      object-fit: cover;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .isw-comparison-label {
      display: block;
      margin-top: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      color: #334155;
    }

    .isw-comparison-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.5rem;
    }

    .isw-comparison-vs {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #3b82f6;
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .isw-hero-actions {
      margin-top: 1rem;
    }

    /* ── hero_lifestyle ── */
    .isw-hero-lifestyle {
      position: relative;
      min-height: 500px;
      display: flex;
      align-items: flex-end;
    }

    .isw-hero-lifestyle .isw-hero-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
    }

    .isw-hero-overlay-bottom {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
      z-index: 2;
    }

    .isw-hero-content-bottom {
      position: relative;
      z-index: 3;
      padding: 3rem;
      max-width: 600px;
      color: #ffffff;
    }

    /* ── Shared elements ── */
    .isw-headline {
      font-size: 2.75rem;
      font-weight: 800;
      line-height: 1.1;
      margin: 0 0 1rem 0;
      letter-spacing: -0.02em;
    }

    .isw-subheadline {
      font-size: 1.2rem;
      font-weight: 400;
      opacity: 0.85;
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
    }

    .isw-cta {
      display: inline-block;
      padding: 0.875rem 2rem;
      background: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-size: 1.05rem;
      font-weight: 600;
      transition: background 0.2s ease, transform 0.15s ease;
      border: none;
      cursor: pointer;
    }

    .isw-cta:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .isw-cta-outline {
      background: transparent;
      border: 2px solid #ffffff;
      color: #ffffff;
    }

    .isw-cta-outline:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .isw-badge {
      display: inline-block;
      padding: 0.3rem 0.85rem;
      background: #22c55e;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      border-radius: 4px;
      margin-bottom: 1rem;
      letter-spacing: 0.08em;
    }

    .isw-use-case-tag {
      display: inline-block;
      padding: 0.3rem 0.85rem;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 4px;
      margin-bottom: 1rem;
      letter-spacing: 0.1em;
      backdrop-filter: blur(4px);
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .isw-hero {
        min-height: 400px;
      }

      .isw-headline {
        font-size: 1.85rem;
      }

      .isw-subheadline {
        font-size: 1rem;
      }

      .isw-hero-impact .isw-hero-content {
        padding: 2rem 1.25rem;
      }

      .isw-comparison-split {
        flex-direction: column;
        gap: 1rem;
      }

      .isw-comparison-left,
      .isw-comparison-right {
        max-width: 100%;
      }

      .isw-comparison-img {
        height: 200px;
      }

      .isw-hero-content-bottom {
        padding: 2rem 1.25rem;
      }
    }
  `;
}
