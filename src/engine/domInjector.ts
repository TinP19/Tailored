// ============================================================================
// Tailored — DOM Injector
// Orchestrates the full pipeline: signals → classify → decide → inject.
// Handles hero swapping (React mount), section reordering (DOM), and
// social proof swapping (text).
// ============================================================================

import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { parseSignals, type SignalOverrides, type SignalData } from './signalParser';
import { classifyIntent } from './intentClassifier';
import { buildDecision, type DecisionObject } from './decisionBuilder';
import { DEFAULT_INTENT, type Intent } from './templateRegistry';

// Hero components
import { HeroUrgency } from '@/components/heroes/HeroUrgency';
import { HeroComparison } from '@/components/heroes/HeroComparison';
import { HeroLifestyle } from '@/components/heroes/HeroLifestyle';
import { HeroValue } from '@/components/heroes/HeroValue';
import { HeroGuide } from '@/components/heroes/HeroGuide';
import { HeroGift } from '@/components/heroes/HeroGift';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LOG_PREFIX = '%c[Tailored]';
const LOG_STYLE = 'color: #3b82f6; font-weight: bold;';
const FADE_DURATION_MS = 300;
const ENGINE_TIMEOUT_MS = 100;

const HERO_SELECTOR = '[data-tailored="hero"]';
const SECTION_SELECTOR = '[data-tailored-section]';
const SOCIAL_PROOF_SELECTOR = '[data-tailored="social-proof"]';

// ---------------------------------------------------------------------------
// Hero component map
// ---------------------------------------------------------------------------

type HeroComponent = React.ComponentType;

const HERO_MAP: Record<Intent, HeroComponent> = {
  BUY_NOW: HeroUrgency,
  COMPARE: HeroComparison,
  USE_CASE: HeroLifestyle,
  BUDGET: HeroValue,
  RESEARCH: HeroGuide,
  GIFTING: HeroGift,
};

// ---------------------------------------------------------------------------
// Module state — persisted across calls so re-invocation is safe
// ---------------------------------------------------------------------------

let heroRoot: Root | null = null;
let currentDecision: DecisionObject | null = null;

// ---------------------------------------------------------------------------
// Hero swap
// ---------------------------------------------------------------------------

function swapHero(intent: Intent, container: HTMLElement): void {
  const Component = HERO_MAP[intent] ?? HERO_MAP[DEFAULT_INTENT];

  // Fade out
  container.style.transition = `opacity ${FADE_DURATION_MS}ms ease`;
  container.style.opacity = '0';

  requestAnimationFrame(() => {
    // Small delay to let the fade-out paint
    setTimeout(() => {
      // Mount or re-render the hero
      if (!heroRoot) {
        // Clear any existing React-rendered content inside the container
        container.innerHTML = '';
        heroRoot = createRoot(container);
      }

      heroRoot.render(createElement(Component));

      // Fade in on next frame
      requestAnimationFrame(() => {
        container.style.opacity = '1';
      });
    }, FADE_DURATION_MS);
  });
}

// ---------------------------------------------------------------------------
// Section reordering
// ---------------------------------------------------------------------------

function reorderSections(sectionOrder: string[]): void {
  const sectionElements = document.querySelectorAll<HTMLElement>(SECTION_SELECTOR);
  if (sectionElements.length === 0) return;

  // Build a map of section key → element
  const sectionMap = new Map<string, HTMLElement>();
  const unmapped: HTMLElement[] = [];

  sectionElements.forEach((el) => {
    const key = el.getAttribute('data-tailored-section');
    if (key) {
      sectionMap.set(key, el);
    } else {
      unmapped.push(el);
    }
  });

  // All sections must share the same parent
  const parent = sectionElements[0].parentElement;
  if (!parent) return;

  // Grab a stable reference: the node right after the last section.
  // This won't move during reordering, so we can insertBefore it repeatedly.
  const lastSection = sectionElements[sectionElements.length - 1];
  const referenceNode = lastSection.nextSibling; // may be null → appendChild

  requestAnimationFrame(() => {
    // Append in specified order
    for (const key of sectionOrder) {
      const el = sectionMap.get(key);
      if (el) {
        parent.insertBefore(el, referenceNode);
        sectionMap.delete(key);
      }
    }

    // Append any sections not in the order array (keep original relative order)
    for (const el of sectionMap.values()) {
      parent.insertBefore(el, referenceNode);
    }

    // Append any unmapped sections at the end
    for (const el of unmapped) {
      parent.insertBefore(el, referenceNode);
    }
  });
}

// ---------------------------------------------------------------------------
// Social proof swap
// ---------------------------------------------------------------------------

function swapSocialProof(message: string): void {
  const el = document.querySelector<HTMLElement>(SOCIAL_PROOF_SELECTOR);
  if (!el) return;

  // Insert a dynamic tagline above the existing stats grid
  const existingTagline = el.querySelector('[data-tailored-proof]');
  if (existingTagline) {
    existingTagline.textContent = message;
    return;
  }

  const tagline = document.createElement('p');
  tagline.setAttribute('data-tailored-proof', 'true');
  tagline.className =
    'text-center text-lg font-medium text-foreground mb-4 transition-opacity duration-300';
  tagline.textContent = message;
  tagline.style.opacity = '0';

  // Insert before the first child (the stats flex container)
  el.insertBefore(tagline, el.firstChild);

  requestAnimationFrame(() => {
    tagline.style.opacity = '1';
  });
}

// ---------------------------------------------------------------------------
// Expose decision globally for TailoredLens
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    __tailored_decision?: DecisionObject | null;
    __tailored_reinject?: (overrides?: SignalOverrides) => void;
  }
}

// ---------------------------------------------------------------------------
// Engine pipeline
// ---------------------------------------------------------------------------

function runPipeline(overrides?: SignalOverrides, forceIntent?: Intent): DecisionObject {
  const signals: SignalData = parseSignals(overrides);

  const classification = forceIntent
    ? {
        primary_intent: forceIntent,
        secondary_intent: null as Intent | null,
        confidence: 1.0,
        scores: { BUY_NOW: 0, COMPARE: 0, USE_CASE: 0, BUDGET: 0, RESEARCH: 0, GIFTING: 0, [forceIntent]: 1.0 },
        reasoning: `Forced by TailoredLens → ${forceIntent}`,
        fallback_used: false,
        signals_used: ['lens_override'] as string[],
      }
    : classifyIntent(signals);

  return buildDecision(classification, signals);
}

// ---------------------------------------------------------------------------
// Main exports
// ---------------------------------------------------------------------------

/**
 * Runs the full personalization pipeline and injects into the DOM.
 *
 * Safe to call multiple times — re-invocation re-runs the engine and
 * updates the hero, sections, and social proof in place.
 *
 * @param overrides    Optional signal overrides (for TailoredLens debug panel)
 * @param forceIntent  Optional intent to force (skips classifier, confidence=1.0)
 */
export function injectPersonalization(overrides?: SignalOverrides, forceIntent?: Intent): DecisionObject | null {
  let decision: DecisionObject;

  // ── 1. Run engine with timeout guard ─────────────────────────────────

  try {
    const start = performance.now();
    decision = runPipeline(overrides, forceIntent);
    const elapsed = performance.now() - start;

    if (elapsed > ENGINE_TIMEOUT_MS) {
      console.warn(
        LOG_PREFIX,
        LOG_STYLE,
        `Engine took ${elapsed.toFixed(1)}ms (>${ENGINE_TIMEOUT_MS}ms) — consider optimizing`,
      );
    }
  } catch (err) {
    console.error(LOG_PREFIX, LOG_STYLE, 'Engine error, falling back to default:', err);

    // Build a fallback decision
    try {
      const fallbackSignals = parseSignals(overrides);
      decision = buildDecision(
        {
          primary_intent: DEFAULT_INTENT,
          secondary_intent: null,
          confidence: 0,
          scores: { BUY_NOW: 0, COMPARE: 0, USE_CASE: 0, BUDGET: 0, RESEARCH: 0, GIFTING: 0 },
          reasoning: 'Engine error — using safe default.',
          fallback_used: true,
          signals_used: ['error_fallback'],
        },
        fallbackSignals,
      );
    } catch {
      console.error(LOG_PREFIX, LOG_STYLE, 'Critical failure — aborting injection.');
      return null;
    }
  }

  // ── 2. Store globally for TailoredLens ───────────────────────────────

  currentDecision = decision;
  window.__tailored_decision = decision;
  window.__tailored_reinject = injectPersonalization;

  // ── 3. Log decision ──────────────────────────────────────────────────

  console.log(LOG_PREFIX, LOG_STYLE, decision);

  // ── 4. Hero swap ─────────────────────────────────────────────────────

  const heroContainer = document.querySelector<HTMLElement>(HERO_SELECTOR);
  if (heroContainer) {
    swapHero(decision.classification.primary_intent, heroContainer);
  } else {
    console.warn(LOG_PREFIX, LOG_STYLE, `Hero container not found (${HERO_SELECTOR}). Skipping hero swap.`);
  }

  // ── 5. Section reorder ───────────────────────────────────────────────

  reorderSections(decision.decision.section_order);

  // ── 6. Social proof swap ─────────────────────────────────────────────

  swapSocialProof(decision.decision.social_proof);

  return decision;
}

/**
 * Returns the most recent decision object without re-running the engine.
 */
export function getCurrentDecision(): DecisionObject | null {
  return currentDecision;
}

/**
 * Clears the injected hero root so the next call creates a fresh mount.
 * Useful if the React page tree re-renders and the container is replaced.
 */
export function resetHeroRoot(): void {
  if (heroRoot) {
    heroRoot.unmount();
    heroRoot = null;
  }
}
