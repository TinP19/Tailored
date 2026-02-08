/**
 * AI Prompts for Intent Classification & Decision Engine
 * Use with LLM API (OpenAI, Anthropic, etc.) when available.
 * Rules-based fallback is used when no API is configured.
 */

import type { ContextSignals, IntentType } from "./types";

const INTENT_OPTIONS: IntentType[] = ["BUY_NOW", "COMPARE", "USE_CASE", "BUDGET", "UNKNOWN"];

/** System prompt for intent classification */
export const INTENT_CLASSIFICATION_SYSTEM = `You are an intent classifier for an e-commerce website selling laptops, tablets, and displays.

Your job: infer the visitor's primary intent from context signals (URL params, referrer, search query, UTM).

Output ONE of these intents only:
- BUY_NOW: Visitor is ready to purchase. Signals: "buy", "order", "get now", "add to cart", urgent language, high commercial intent.
- COMPARE: Visitor is researching, comparing options. Signals: "best", "vs", "comparison", "review", "which", "difference".
- USE_CASE: Visitor cares about a specific use case (gaming, coding, design, work). Signals: "for gaming", "for work", "for design", "coding", professional/creative use.
- BUDGET: Visitor is price-sensitive. Signals: "cheap", "affordable", "deal", "discount", "under $X", "value", "budget".
- UNKNOWN: Ambiguous or no clear signals. Use when confidence is low.

Be conservative: when in doubt, choose UNKNOWN. Only use specific intents when signals clearly support them.`;

/** User prompt for intent classification - inject signals */
export function buildIntentClassificationUserPrompt(signals: ContextSignals): string {
  const parts: string[] = [
    "Classify the visitor intent from these context signals:",
    "",
    "## URL / Search",
    `- Search/query param: ${signals.searchQuery ?? "(none)"}`,
    `- All URL params: ${JSON.stringify(signals.urlParams)}`,
    "",
    "## Referrer",
    `- Referrer type: ${signals.referrerType}`,
    `- Full referrer URL: ${signals.referrer ?? "(direct)"}`,
    "",
    "## UTM",
    JSON.stringify(signals.utm, null, 2),
    "",
  ];

  if (signals.personaOverride) {
    parts.push(`## Demo Override (use this as the intent)`, `Persona: ${signals.personaOverride}`, "");
  }

  if (signals.earlyBehavior) {
    parts.push(`## Early Behavior (first 5 seconds)`, `Behavior: ${signals.earlyBehavior}`, "");
  }

  parts.push(
    "Respond with valid JSON only:",
    `{ "intent": "<one of ${INTENT_OPTIONS.join(", ")}>", "confidence": <0-1>, "reason": "<brief explanation>", "contributingSignals": ["<signal1>", "<signal2>"] }`
  );

  return parts.join("\n");
}

/** System prompt for decision engine */
export const DECISION_ENGINE_SYSTEM = `You are a personalization decision engine for an e-commerce homepage hero section.

You receive a classified intent and must pick:
1. Template: power | value | versatility
   - power: Performance/gaming focus. Headlines about dominance, speed, gaming.
   - value: Budget/deals focus. Headlines about smart prices, family, affordability.
   - versatility: Pro/productivity focus. Headlines about flexibility, work, creativity.

2. Hero image key: gaming_setup | office_pro | budget_home | gaming_value | compare_pro | buy_now_hero

3. CTA priority: buy | compare | explore

Intent → Template mapping:
- BUY_NOW → power (urgency, "Shop Gaming")
- COMPARE → versatility (exploration, "Compare Models")
- USE_CASE → power if gaming, versatility if pro/design
- BUDGET → value
- UNKNOWN → versatility (safe default)

Output valid JSON only. Be consistent with the mapping above.`;

/** User prompt for decision engine - inject intent + template options */
export function buildDecisionEngineUserPrompt(
  intent: IntentType,
  classificationReason: string
): string {
  return `Intent: ${intent}
Classification reason: ${classificationReason}

Select template, hero_image key, and cta_priority.

Respond with valid JSON only:
{
  "template": "power" | "value" | "versatility",
  "hero_image": "gaming_setup" | "office_pro" | "budget_home" | "gaming_value" | "compare_pro" | "buy_now_hero",
  "cta_priority": "buy" | "compare" | "explore"
}`;
}
