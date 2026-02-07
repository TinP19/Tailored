export type IntentId = 'BUY_NOW' | 'COMPARE' | 'USE_CASE' | 'BUDGET' | 'GENERAL';
export type SubIntent = 'gaming' | 'coding' | 'design' | 'office' | null;
export type SignalSource = 'utm_source' | 'utm_medium' | 'utm_content' | 'utm_campaign' | 'query_param' | 'referrer' | 'persona_override';

export interface Signal {
  source: SignalSource;
  rawValue: string;
  matchedKeyword: string | null;
  contributedTo: IntentId | null;
  weight: number;
}

export interface IntentScores {
  BUY_NOW: number;
  COMPARE: number;
  USE_CASE: number;
  BUDGET: number;
}

export interface IntentResult {
  intent: IntentId;
  subIntent: SubIntent;
  confidence: number;
  scores: IntentScores;
  signals: Signal[];
}

export interface TemplateDefinition {
  id: string;
  description: string;
  slots: string[];
}

export interface TemplateRegistry {
  templates: Record<string, TemplateDefinition>;
}

export interface ContentVariant {
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_link: string;
  badge?: string | null;
  use_case_tag?: string | null;
}

export interface ImageAsset {
  id: string;
  src: string;
  alt: string;
  intentAffinity: IntentId;
  subIntentAffinity?: SubIntent;
}

export interface DecisionObject {
  timestamp: string;
  intent: IntentId;
  subIntent: SubIntent;
  confidence: number;
  template: string;
  heroImage: string;
  heroImageSrc: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  badge: string | null;
  useCaseTag: string | null;
  signalsUsed: Signal[];
  reason: string;
}

export interface RollbackSnapshot {
  target: HTMLElement;
  originalHTML: string;
}

export interface WidgetConfig {
  siteId: string;
  debug: boolean;
  imageBaseUrl: string;
}
