import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { DecisionObject, Signals, Intent, EventType } from '@/tailored/types';
import { runEngine } from '@/tailored/engine';
import { trackEvent as track, seedDemoData } from '@/tailored/tracker';

// Type for the widget API exposed on window.Tailored
interface TailoredWidgetAPI {
  init(config?: { debug?: boolean }): DecisionObject;
  getDecision(): DecisionObject | null;
  onDecision(callback: (decision: DecisionObject) => void): void;
  offDecision(callback: (decision: DecisionObject) => void): void;
  simulate(intent: Intent): Promise<DecisionObject>;
  runWithOverrides(overrides: Partial<Signals>): Promise<DecisionObject>;
  version: string;
}

function getWidget(): TailoredWidgetAPI | null {
  return (window as unknown as { Tailored?: TailoredWidgetAPI }).Tailored || null;
}

interface TailoredContextValue {
  decision: DecisionObject | null;
  isOverrideMode: boolean;
  detectIntent: () => void;
  setOverrideIntent: (intent: Intent) => void;
  setOverrideSignals: (partial: Partial<Signals>) => void;
  clearOverrides: () => void;
  trackEvent: (type: EventType, data: Record<string, unknown>) => void;
}

const TailoredContext = createContext<TailoredContextValue | null>(null);

const INTENT_UTM_MAP: Record<Intent, string> = {
  BUY_NOW: 'buy now',
  COMPARE: 'best vs top',
  USE_CASE: 'gaming setup',
  BUDGET: 'cheap deal budget',
  RESEARCH: 'how to choose',
  GIFTING: 'gift for him',
};

function trackDecision(result: DecisionObject) {
  track('intent_detected', result.visitor_id, {
    intent: result.classification.primary_intent,
    confidence: result.classification.confidence,
    template: result.decision.template,
    fallback_used: result.fallback_used,
    claude_used: result.claude_used,
    referrer_type: result.signals.referrer_type,
  });

  track('hero_shown', result.visitor_id, {
    template: result.decision.template,
    intent: result.classification.primary_intent,
  });
}

export function TailoredProvider({ children }: { children: ReactNode }) {
  const [decision, setDecision] = useState<DecisionObject | null>(null);
  const [isOverrideMode, setIsOverrideMode] = useState(false);

  const detectIntent = useCallback(async () => {
    const widget = getWidget();
    if (widget) {
      widget.init();
    } else {
      const result = await runEngine();
      setDecision(result);
      trackDecision(result);
    }
  }, []);

  const setOverrideIntent = useCallback(async (intent: Intent) => {
    setIsOverrideMode(true);
    const widget = getWidget();
    if (widget) {
      await widget.simulate(intent);
    } else {
      const result = await runEngine({ utm_term: INTENT_UTM_MAP[intent] });
      setDecision(result);
      trackDecision(result);
    }
  }, []);

  const setOverrideSignals = useCallback(async (partial: Partial<Signals>) => {
    setIsOverrideMode(true);
    const widget = getWidget();
    if (widget) {
      await widget.runWithOverrides(partial);
    } else {
      const result = await runEngine(partial);
      setDecision(result);
      trackDecision(result);
    }
  }, []);

  const clearOverrides = useCallback(async () => {
    setIsOverrideMode(false);
    const widget = getWidget();
    if (widget) {
      widget.init();
    } else {
      const result = await runEngine();
      setDecision(result);
      trackDecision(result);
    }
  }, []);

  const trackEvent = useCallback((type: EventType, data: Record<string, unknown>) => {
    if (decision) {
      track(type, decision.visitor_id, data);
    }
  }, [decision]);

  // Mount: Bridge with widget API or fall back to direct engine
  useEffect(() => {
    seedDemoData();

    const widget = getWidget();
    if (widget) {
      // Read existing decision from widget (Phase 1 rules result)
      const existing = widget.getDecision();
      if (existing) {
        setDecision(existing);
      }

      // Listen for all future updates (Phase 2 AI, simulate, etc.)
      // Widget handles its own tracking, so React only updates state here
      const handler = (result: DecisionObject) => {
        setDecision(result);
      };
      widget.onDecision(handler);

      return () => widget.offDecision(handler);
    } else {
      // Fallback: run engine directly (widget not loaded)
      (async () => {
        const result = await runEngine();
        setDecision(result);

        track('page_view', result.visitor_id, {
          url: window.location.href,
          referrer: document.referrer,
        });

        trackDecision(result);
      })();
    }
  }, []);

  // Re-detect when URL search params change
  useEffect(() => {
    const handlePopState = () => {
      if (!isOverrideMode) {
        detectIntent();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOverrideMode, detectIntent]);

  return (
    <TailoredContext.Provider
      value={{
        decision,
        isOverrideMode,
        detectIntent,
        setOverrideIntent,
        setOverrideSignals,
        clearOverrides,
        trackEvent,
      }}
    >
      {children}
    </TailoredContext.Provider>
  );
}

export function useTailored(): TailoredContextValue {
  const ctx = useContext(TailoredContext);
  if (!ctx) throw new Error('useTailored must be used within TailoredProvider');
  return ctx;
}
