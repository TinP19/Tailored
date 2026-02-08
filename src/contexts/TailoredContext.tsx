import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { DecisionObject, Signals, Intent, EventType } from '@/tailored/types';
import { runEngine } from '@/tailored/engine';
import { trackEvent as track, seedDemoData } from '@/tailored/tracker';

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

// Maps intent to a UTM keyword that will trigger it
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
  const [overrideSignals, setOverrideSignalsState] = useState<Partial<Signals>>({});

  const detectIntent = useCallback(async () => {
    const result = await runEngine(isOverrideMode ? overrideSignals : undefined);
    setDecision(result);
    trackDecision(result);
  }, [isOverrideMode, overrideSignals]);

  const setOverrideIntent = useCallback(async (intent: Intent) => {
    const newOverrides: Partial<Signals> = { utm_term: INTENT_UTM_MAP[intent] };
    setOverrideSignalsState(newOverrides);
    setIsOverrideMode(true);

    const result = await runEngine(newOverrides);
    setDecision(result);
    trackDecision(result);
  }, []);

  const setOverrideSignals = useCallback(async (partial: Partial<Signals>) => {
    setOverrideSignalsState(prev => {
      const merged = { ...prev, ...partial };
      setIsOverrideMode(true);

      // Fire async engine run
      runEngine(merged).then(result => {
        setDecision(result);
        trackDecision(result);
      });

      return merged;
    });
  }, []);

  const clearOverrides = useCallback(async () => {
    setOverrideSignalsState({});
    setIsOverrideMode(false);

    const result = await runEngine();
    setDecision(result);
    trackDecision(result);
  }, []);

  const trackEvent = useCallback((type: EventType, data: Record<string, unknown>) => {
    if (decision) {
      track(type, decision.visitor_id, data);
    }
  }, [decision]);

  // Initial detection on mount
  useEffect(() => {
    seedDemoData();

    (async () => {
      const result = await runEngine();
      setDecision(result);

      track('page_view', result.visitor_id, {
        url: window.location.href,
        referrer: document.referrer,
      });

      trackDecision(result);
    })();
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
