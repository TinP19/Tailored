/**
 * Decision Engine - Maps intent → template + assets
 * Must output structured, explainable decision (track requirement)
 * Can use rules (MVP) or LLM when API available
 */

import type { IntentType, PersonalizationDecision, TemplateType } from "./types";
import type { IntentClassification } from "./types";
import { HERO_TEMPLATES } from "./templateRegistry";
import { getAssetForIntent, getAssetUrl } from "./assetLibrary";

/** Intent → Template mapping (explainable rules) */
const INTENT_TO_TEMPLATE: Record<IntentType, TemplateType> = {
  BUY_NOW: "power",
  COMPARE: "versatility",
  USE_CASE: "power", // can refine to power vs versatility based on sub-signals
  BUDGET: "value",
  UNKNOWN: "versatility", // safe default
};

/** Sub-refinement: USE_CASE gaming → power, USE_CASE pro/design → versatility */
function refineUseCaseTemplate(signals: { searchQuery?: string | null }): TemplateType {
  const text = (signals.searchQuery ?? "").toLowerCase();
  if (/gaming|game|gamer/i.test(text)) return "power";
  if (/design|creative|professional|coding|work/i.test(text)) return "versatility";
  return "power"; // default USE_CASE to power
}

/**
 * Run the decision engine: intent + classification → full personalization decision.
 */
export function runDecisionEngine(
  classification: IntentClassification,
  signals: { searchQuery?: string | null }
): PersonalizationDecision {
  const intent = classification.intent;

  let template: TemplateType = INTENT_TO_TEMPLATE[intent];
  if (intent === "USE_CASE") {
    template = refineUseCaseTemplate(signals);
  }

  const heroTemplate = HERO_TEMPLATES[template];
  const hero_image = getAssetForIntent(intent);

  const cta_priority = heroTemplate.cta_priority;

  const reason = buildReason(intent, template, classification.reason);

  return {
    intent,
    template,
    hero_image,
    headline: heroTemplate.headline,
    subheadline: heroTemplate.subheadline,
    cta: heroTemplate.cta,
    cta_priority,
    reason,
    debug: {
      signalsUsed: classification.contributingSignals,
      classificationReason: classification.reason,
    },
  };
}

function buildReason(intent: IntentType, template: TemplateType, classificationReason: string): string {
  const templateReasons: Record<TemplateType, string> = {
    power: "Power template selected: performance/gaming focus.",
    value: "Value template selected: budget/deals focus.",
    versatility: "Versatility template selected: pro/productivity focus.",
  };
  return `Intent "${intent}" → ${templateReasons[template]} ${classificationReason}`;
}

/** Resolve asset key to URL (for external/script use) */
export { getAssetUrl };
