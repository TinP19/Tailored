import { IntentResult, IntentId, SubIntent, DecisionObject, WidgetConfig } from '../types';
import assets from '../templates/assets.json';

const INTENT_TEMPLATE_MAP: Record<IntentId, string> = {
  BUY_NOW: 'hero_impact',
  COMPARE: 'hero_comparison',
  USE_CASE: 'hero_lifestyle',
  BUDGET: 'hero_impact',
  GENERAL: 'hero_impact',
};

const INTENT_IMAGE_MAP: Record<IntentId, string> = {
  BUY_NOW: 'product-hero.jpg',
  COMPARE: 'compare-hero.jpg',
  USE_CASE: 'office-hero.jpg',
  BUDGET: 'deal-hero.jpg',
  GENERAL: 'product-hero.jpg',
};

const SUB_INTENT_IMAGE_MAP: Record<string, string> = {
  gaming: 'gaming-hero.jpg',
  coding: 'office-hero.jpg',
  design: 'design-hero.jpg',
  office: 'office-hero.jpg',
};

const INTENT_IMAGE_ID_MAP: Record<IntentId, string> = {
  BUY_NOW: 'img_premium_product',
  COMPARE: 'img_comparison_split',
  USE_CASE: 'img_office_clean',
  BUDGET: 'img_deal_banner',
  GENERAL: 'img_premium_product',
};

const SUB_INTENT_IMAGE_ID_MAP: Record<string, string> = {
  gaming: 'img_gaming_setup',
  coding: 'img_office_clean',
  design: 'img_design_studio',
  office: 'img_office_clean',
};

function selectImage(intent: IntentId, subIntent: SubIntent): { file: string; id: string } {
  if (intent === 'USE_CASE' && subIntent) {
    return {
      file: SUB_INTENT_IMAGE_MAP[subIntent] ?? INTENT_IMAGE_MAP[intent],
      id: SUB_INTENT_IMAGE_ID_MAP[subIntent] ?? INTENT_IMAGE_ID_MAP[intent],
    };
  }
  return {
    file: INTENT_IMAGE_MAP[intent],
    id: INTENT_IMAGE_ID_MAP[intent],
  };
}

function generateReason(intentResult: IntentResult, templateId: string, imageId: string): string {
  const contributing = intentResult.signals.filter(s => s.weight > 0);

  if (contributing.length === 0) {
    return `No intent signals detected. Showing default hero (${templateId}).`;
  }

  const parts: string[] = [];
  for (const signal of contributing) {
    if (signal.source === 'referrer') {
      parts.push(`referrer is ${signal.matchedKeyword} (+${signal.weight})`);
    } else {
      parts.push(`${signal.source}='${signal.rawValue}' matched '${signal.matchedKeyword}' (+${signal.weight})`);
    }
  }

  const intentLabel = intentResult.subIntent
    ? `${intentResult.intent}:${intentResult.subIntent}`
    : intentResult.intent;

  return `${parts.join(' + ')} → ${intentLabel} with confidence ${intentResult.confidence}. Selected ${templateId} with ${imageId}.`;
}

export function makeDecision(intentResult: IntentResult, config: WidgetConfig): DecisionObject {
  const { intent, subIntent, confidence, signals } = intentResult;

  const templateId = INTENT_TEMPLATE_MAP[intent];

  const variants = assets.variants as Record<string, any>;
  const content = variants[intent] ?? variants['GENERAL'];

  const image = selectImage(intent, subIntent);
  const heroImageSrc = `${config.imageBaseUrl}${image.file}`;

  let useCaseTag: string | null = null;
  if (intent === 'USE_CASE' && subIntent) {
    useCaseTag = subIntent.charAt(0).toUpperCase() + subIntent.slice(1);
  }

  let ctaLink = content.cta_link;
  if (intent === 'USE_CASE' && subIntent) {
    ctaLink = `${content.cta_link}/${subIntent}`;
  }

  const reason = generateReason(intentResult, templateId, image.id);

  return {
    timestamp: new Date().toISOString(),
    intent,
    subIntent,
    confidence,
    template: templateId,
    heroImage: image.id,
    heroImageSrc,
    headline: content.headline,
    subheadline: content.subheadline,
    ctaText: content.cta_text,
    ctaLink,
    badge: content.badge ?? null,
    useCaseTag,
    signalsUsed: signals.filter(s => s.weight > 0),
    reason,
  };
}
