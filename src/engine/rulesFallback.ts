/**
 * Rules-based fallback when no LLM API key is configured.
 * Produces same LLMDecision shape for consistent consumption.
 */

import type { CollectedContext } from "./contextCollector";
import type { PersonalizationRegistry } from "./registry";
import type { LLMDecision } from "./llmDecisionEngine";

const INTENT_PATTERNS: { pattern: RegExp; intent: string; template: string; image: string; cta: string }[] = [
  { pattern: /buy|order|purchase|add\s+to\s+cart|get\s+now/i, intent: "BUY_NOW", template: "hero_urgent", image: "img_gaming", cta: "buy_now" },
  { pattern: /compare|vs|versus|best|review|which/i, intent: "COMPARE", template: "hero_compare", image: "img_comparison", cta: "compare" },
  { pattern: /gaming|gamer|esports|144hz/i, intent: "USE_CASE_GAMING", template: "hero_lifestyle", image: "img_gaming", cta: "buy_now" },
  { pattern: /work|coding|productivity|office/i, intent: "USE_CASE_WORK", template: "hero_lifestyle", image: "img_office", cta: "buy_now" },
  { pattern: /design|creative|photo|video\s*edit/i, intent: "USE_CASE_DESIGN", template: "hero_lifestyle", image: "img_design", cta: "buy_now" },
  { pattern: /cheap|budget|deal|discount|affordable|value/i, intent: "BUDGET", template: "hero_urgent", image: "img_deal", cta: "view_deals" },
];

const DEFAULT_DECISION: Omit<LLMDecision, "reasoning"> = {
  intent: "BROWSE",
  confidence: 0.5,
  template_id: "hero_compare",
  image_id: "img_comparison",
  cta_id: "explore",
  headline: "Technology That Works as Hard as You",
  subheadline: "Professional-grade laptops, tablets, and screens built for productivity, creativity, and seamless collaboration.",
};

export function getRulesDecision(context: CollectedContext, _registry: PersonalizationRegistry): LLMDecision {
  const text = [
    context.search_query ?? "",
    context.query_params,
    context.referrer,
    context.utm_campaign ?? "",
  ]
    .join(" ")
    .toLowerCase();

  // Persona override
  if (context.persona_override) {
    const overrideIntent = context.persona_override.toUpperCase().replace(/-/g, "_");
    const match =
      INTENT_PATTERNS.find((p) => p.intent === overrideIntent) ??
      (overrideIntent === "BROWSE"
        ? { intent: "BROWSE", template: "hero_compare", image: "img_comparison", cta: "explore" }
        : INTENT_PATTERNS[0]);
    return {
      ...DEFAULT_DECISION,
      intent: overrideIntent,
      confidence: 1,
      template_id: match.template,
      image_id: match.image,
      cta_id: match.cta,
      headline: "Personalized for your intent",
      subheadline: `Showing content optimized for ${overrideIntent.replace(/_/g, " ").toLowerCase()} intent.`,
      reasoning: {
        intent_signals: [`Persona override: ${overrideIntent}`],
        template_choice: "Selected based on demo persona override",
        image_choice: "Matched to override intent",
        cta_choice: "CTA aligned with intent",
      },
    };
  }

  for (const { pattern, intent, template, image, cta } of INTENT_PATTERNS) {
    if (pattern.test(text)) {
      return {
        intent,
        confidence: 0.85,
        template_id: template,
        image_id: image,
        cta_id: cta,
        headline: DEFAULT_DECISION.headline,
        subheadline: DEFAULT_DECISION.subheadline,
        reasoning: {
          intent_signals: [`Query/params match: "${context.search_query || context.query_params}"`],
          template_choice: `Template "${template}" selected for ${intent}`,
          image_choice: `Image "${image}" matches use case`,
          cta_choice: `CTA "${cta}" for ${intent} intent`,
        },
      };
    }
  }

  return {
    ...DEFAULT_DECISION,
    reasoning: {
      intent_signals: ["No clear intent signals - using browse default"],
      template_choice: "Compare template for exploratory visitors",
      image_choice: "Comparison image for general browsing",
      cta_choice: "Explore CTA for low-intent visitor",
    },
  };
}
