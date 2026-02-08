/**
 * Intent Classification - Rules-based (MVP) + prompt for LLM
 * VC Track: Infer intent from 2+ signals (URL, referrer, UTM, persona)
 */

import type { ContextSignals, IntentClassification, IntentType } from "./types";

const BUY_NOW_PATTERNS = [
  /buy\s+(now|today)?/i,
  /order\s+now/i,
  /add\s+to\s+cart/i,
  /get\s+(it|now)/i,
  /purchase/i,
  /intent\s*=\s*buy/i,
  /utm_campaign=.*(sale|buy|order)/i,
];

const COMPARE_PATTERNS = [
  /best\s+.+\s+(vs|versus|compared)/i,
  /vs\s+/i,
  /comparison/i,
  /compare/i,
  /review/i,
  /which\s+(is|one)/i,
  /difference\s+between/i,
  /2024|2025|2026.*(best|top)/i,
];

const USE_CASE_PATTERNS = [
  /for\s+gaming/i,
  /gaming\s+(monitor|laptop|pc)/i,
  /for\s+(work|coding|design)/i,
  /coding\s+(monitor|laptop)/i,
  /design\s+(monitor|laptop)/i,
  /professional/i,
  /creative\s+work/i,
];

const BUDGET_PATTERNS = [
  /cheap/i,
  /affordable/i,
  /budget/i,
  /deal/i,
  /discount/i,
  /under\s+\$\d+/i,
  /value\s+(pick|monitor)/i,
  /best\s+value/i,
];

/** Map ?intent= or ?persona= URL param values to IntentType */
const URL_INTENT_MAP: Record<string, IntentType> = {
  buy: "BUY_NOW",
  buy_now: "BUY_NOW",
  compare: "COMPARE",
  use_case: "USE_CASE",
  budget: "BUDGET",
  unknown: "UNKNOWN",
};

/** Rules-based intent classification (no API required) */
export function classifyIntentRules(signals: ContextSignals): IntentClassification {
  // Demo override takes precedence
  if (signals.personaOverride && signals.personaOverride !== "UNKNOWN") {
    return {
      intent: signals.personaOverride,
      confidence: 1,
      reason: `Demo persona override: ${signals.personaOverride}`,
      contributingSignals: ["personaOverride"],
    };
  }

  // URL param ?intent=buy or ?persona=BUY_NOW (already handled above)
  const intentParam = signals.urlParams["intent"]?.toLowerCase().replace(/-/g, "_");
  if (intentParam && URL_INTENT_MAP[intentParam]) {
    return {
      intent: URL_INTENT_MAP[intentParam],
      confidence: 0.95,
      reason: `URL param intent=${signals.urlParams["intent"]}`,
      contributingSignals: ["urlParams.intent"],
    };
  }

  const text = [
    signals.searchQuery ?? "",
    JSON.stringify(signals.urlParams),
    signals.referrer ?? "",
    Object.values(signals.utm).filter(Boolean).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  const contributingSignals: string[] = [];

  // Check patterns in order of specificity
  for (const pattern of BUY_NOW_PATTERNS) {
    if (pattern.test(text)) {
      contributingSignals.push(`query/params match: ${pattern.source}`);
      return {
        intent: "BUY_NOW",
        confidence: 0.85,
        reason: `Query/params contain buy/order signals: "${signals.searchQuery || "URL params"}"`,
        contributingSignals,
      };
    }
  }

  for (const pattern of COMPARE_PATTERNS) {
    if (pattern.test(text)) {
      contributingSignals.push(`query/params match: ${pattern.source}`);
      return {
        intent: "COMPARE",
        confidence: 0.85,
        reason: `Query contains comparison signals: "${signals.searchQuery || "URL params"}"`,
        contributingSignals,
      };
    }
  }

  for (const pattern of BUDGET_PATTERNS) {
    if (pattern.test(text)) {
      contributingSignals.push(`query/params match: ${pattern.source}`);
      return {
        intent: "BUDGET",
        confidence: 0.85,
        reason: `Query contains budget/value signals: "${signals.searchQuery || "URL params"}"`,
        contributingSignals,
      };
    }
  }

  for (const pattern of USE_CASE_PATTERNS) {
    if (pattern.test(text)) {
      contributingSignals.push(`query/params match: ${pattern.source}`);
      const isGaming = /gaming/i.test(text);
      return {
        intent: "USE_CASE",
        confidence: 0.8,
        reason: `Query signals use-case focus${isGaming ? " (gaming)" : " (pro/design)"}`,
        contributingSignals,
      };
    }
  }

  // Referrer heuristics
  if (signals.referrerType === "email") {
    contributingSignals.push("referrer: email");
    return {
      intent: "BUY_NOW",
      confidence: 0.6,
      reason: "Email referrer often indicates promo/deal intent (buy-ready)",
      contributingSignals,
    };
  }

  if (signals.referrerType === "google" && !signals.searchQuery) {
    contributingSignals.push("referrer: google, no query");
    return {
      intent: "UNKNOWN",
      confidence: 0.4,
      reason: "Google referrer but no search query captured - ambiguous",
      contributingSignals,
    };
  }

  // Default: unknown
  return {
    intent: "UNKNOWN",
    confidence: 0.3,
    reason: "No clear intent signals in URL, referrer, or UTM params",
    contributingSignals: ["default fallback"],
  };
}
