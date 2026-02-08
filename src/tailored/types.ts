export type Intent = 'BUY_NOW' | 'COMPARE' | 'USE_CASE' | 'BUDGET' | 'RESEARCH' | 'GIFTING';

export type Device = 'desktop' | 'mobile';

export type TimeContext =
  | 'morning_weekday' | 'afternoon_weekday' | 'evening_weekday'
  | 'morning_weekend' | 'afternoon_weekend' | 'evening_weekend';

export type ReferrerType = 'search_organic' | 'review_site' | 'social' | 'email' | 'direct' | 'unknown';

export interface Signals {
  utm_term: string | null;
  referrer: string;
  referrer_type: ReferrerType;
  device: Device;
  time_context: TimeContext;
}

export interface Classification {
  primary_intent: Intent;
  confidence: number;
  secondary_intent: Intent | null;
  reasoning: string;
  scores: Record<Intent, number>;
}

export interface Decision {
  template: string;
  section_order: string[];
  social_proof: string;
}

export interface DecisionObject {
  visitor_id: string;
  timestamp: string;
  signals: Signals;
  classification: Classification;
  decision: Decision;
  fallback_used: boolean;
}

export type EventType = 'page_view' | 'intent_detected' | 'cta_click' | 'hero_shown' | 'section_reorder';

export interface TrackedEvent {
  id: string;
  type: EventType;
  timestamp: string;
  visitor_id: string;
  data: Record<string, unknown>;
}

export interface AnalyticsData {
  totalVisitors: number;
  personalizedPct: number;
  avgConfidence: number;
  fallbackRate: number;
  intentDistribution: { name: string; value: number; color: string }[];
  confidenceDistribution: { range: string; count: number }[];
  variantPerformance: { name: string; ctr: number }[];
  heatmapData: { intent: string; primary: number; secondary: number; none: number }[];
  recentDecisions: { time: string; intent: string; confidence: number; template: string; cta: string; referrer: string }[];
  sparklineData: { value: number }[];
}
