import { WidgetConfig, RollbackSnapshot, DecisionObject, IntentId } from './types';
import { findTarget, createSnapshot, swapDOM, rollback } from './injection/dom-injector';
import { injectStyles, removeStyles } from './injection/style-injector';
import { preloadImage } from './injection/image-preloader';
import { collectSignals } from './signals/url-parser';
import { scoreIntents } from './engine/intent-scorer';
import { makeDecision } from './engine/decision-maker';
import { renderTemplate } from './templates/renderer';
import { showDebugPanel, updatePanel } from './debug/debug-panel';

function readConfig(): WidgetConfig {
  const scriptEl = document.querySelector(
    'script[data-site-id]'
  ) as HTMLScriptElement | null;

  const params = new URLSearchParams(window.location.search);

  return {
    siteId: scriptEl?.dataset.siteId ?? 'default',
    debug: params.get('intentswap_debug') === 'true',
    imageBaseUrl: scriptEl?.dataset.imageBase ?? './assets/images/',
  };
}

async function main(): Promise<void> {
  const config = readConfig();
  let snapshot: RollbackSnapshot | null = null;

  try {
    // Step 1: Find injection target
    const target = findTarget();
    if (!target) {
      console.log('[IntentSwap] No hero target found. Doing nothing.');
      return;
    }

    // Step 2: Snapshot for rollback
    snapshot = createSnapshot(target);

    // Step 3: Collect signals
    const signals = collectSignals();

    // Step 4: Score intents
    const intentResult = scoreIntents(signals);

    // Step 5: Make decision
    const decision = makeDecision(intentResult, config);

    // Step 6: Render template HTML
    const html = renderTemplate(decision);

    // Step 7: Inject scoped styles
    injectStyles();

    // Step 8: Preload hero image, then swap
    try {
      await preloadImage(decision.heroImageSrc);
    } catch {
      console.warn('[IntentSwap] Image preload timed out, swapping anyway.');
    }

    // Step 9: Swap DOM
    swapDOM(target, html);

    // Step 10: Log decision
    console.log('[IntentSwap] Decision:', decision);

    // Step 11: Debug panel
    if (config.debug) {
      showDebugPanel(decision, (newIntent: IntentId) => {
        // Re-run decision engine with forced intent
        const simResult = {
          ...intentResult,
          intent: newIntent,
          subIntent: newIntent === 'USE_CASE' ? intentResult.subIntent ?? 'gaming' as const : null,
          confidence: 99,
        };
        const simDecision = makeDecision(simResult, config);
        const simHtml = renderTemplate(simDecision);
        swapDOM(target, simHtml);
        updatePanel(simDecision);

        // Re-wire simulate buttons
        const panel = document.getElementById('isw-debug-panel');
        if (panel) {
          const ALL_INTENTS: IntentId[] = ['BUY_NOW', 'COMPARE', 'USE_CASE', 'BUDGET', 'GENERAL'];
          ALL_INTENTS.forEach((intent) => {
            const btn = panel.querySelector(`[data-isw-simulate="${intent}"]`);
            if (btn) {
              const newBtn = btn.cloneNode(true) as HTMLElement;
              btn.parentNode?.replaceChild(newBtn, btn);
              newBtn.addEventListener('click', () => {
                const simRes = {
                  ...intentResult,
                  intent: intent,
                  subIntent: intent === 'USE_CASE' ? intentResult.subIntent ?? 'gaming' as const : null,
                  confidence: 99,
                };
                const simDec = makeDecision(simRes, config);
                const simH = renderTemplate(simDec);
                swapDOM(target, simH);
                updatePanel(simDec);
              });
            }
          });

          // Re-wire copy button
          const copyBtn = panel.querySelector('[data-isw-copy]');
          if (copyBtn) {
            const newCopyBtn = copyBtn.cloneNode(true) as HTMLElement;
            copyBtn.parentNode?.replaceChild(newCopyBtn, copyBtn);
            newCopyBtn.addEventListener('click', () => {
              navigator.clipboard.writeText(JSON.stringify(simDecision, null, 2))
                .then(() => {
                  newCopyBtn.textContent = 'Copied!';
                  setTimeout(() => { newCopyBtn.textContent = 'Copy JSON'; }, 2000);
                })
                .catch(() => {
                  newCopyBtn.textContent = 'Copy failed';
                  setTimeout(() => { newCopyBtn.textContent = 'Copy JSON'; }, 2000);
                });
            });
          }
        }
      });

      // Register keyboard shortcut for debug toggle (in addition to the one in debug-panel.ts)
      // This handles the case where debug panel isn't shown via URL param
    }

    // Register Ctrl+Shift+D for non-debug mode too (shows panel if hidden)
    if (!config.debug) {
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          // Activate debug mode on-demand
          const lateDecision = makeDecision(scoreIntents(collectSignals()), config);
          showDebugPanel(lateDecision, (newIntent: IntentId) => {
            const simResult = {
              ...intentResult,
              intent: newIntent,
              subIntent: newIntent === 'USE_CASE' ? intentResult.subIntent ?? 'gaming' as const : null,
              confidence: 99,
            };
            const simDecision = makeDecision(simResult, config);
            const simHtml = renderTemplate(simDecision);
            swapDOM(target, simHtml);
            updatePanel(simDecision);
          });
        }
      });
    }

  } catch (err) {
    console.error('[IntentSwap] Error, rolling back:', err);
    if (snapshot) {
      rollback(snapshot);
      removeStyles();
    }
  }
}

// Execute on DOMContentLoaded (or immediately if already loaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
