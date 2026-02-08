/**
 * AI Pipeline - LLM-Based Decision Agent
 * User Signals → LLM Prompt → Structured Decision + Explanation
 * Falls back to rules when VITE_ANTHROPIC_API_KEY is not set.
 */

import { collectContext, initScrollTracking } from "./contextCollector";
import { getLLMDecision } from "./llmDecisionEngine";
import { getRulesDecision } from "./rulesFallback";
import { registry } from "./registry";
import type { LLMDecision } from "./llmDecisionEngine";
import type { PersonalizationRegistry } from "./registry";

export type { LLMDecision };
export { registry };

/** Resolved decision with actual URLs and CTA from registry */
export interface ResolvedDecision extends LLMDecision {
  image_url: string;
  cta_text: string;
  cta_link: string;
}

function resolveDecision(decision: LLMDecision, reg: PersonalizationRegistry): ResolvedDecision {
  const image = reg.images.find((i) => i.id === decision.image_id);
  const cta = reg.ctas.find((c) => c.id === decision.cta_id);
  return {
    ...decision,
    image_url: image?.url ?? reg.images[0].url,
    cta_text: cta?.text ?? decision.cta_id,
    cta_link: cta?.link ?? "#",
  };
}

export interface PipelineOptions {
  personaOverride?: string;
}

/**
 * Run the personalization pipeline: context → LLM (or rules) → resolved decision.
 * Uses Claude when VITE_ANTHROPIC_API_KEY is set; otherwise rules fallback.
 */
export async function runPersonalizationPipeline(options?: PipelineOptions): Promise<{
  decision: ResolvedDecision;
  source: "llm" | "rules";
}> {
  initScrollTracking();
  const context = collectContext({ personaOverride: options?.personaOverride });

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  let rawDecision: LLMDecision;

  if (apiKey && apiKey !== "") {
    try {
      rawDecision = await getLLMDecision(context, registry);
      return { decision: resolveDecision(rawDecision, registry), source: "llm" };
    } catch (err) {
      console.warn("[Personalization] LLM failed, falling back to rules:", err);
      rawDecision = getRulesDecision(context, registry);
      return { decision: resolveDecision(rawDecision, registry), source: "rules" };
    }
  } else {
    rawDecision = getRulesDecision(context, registry);
    return { decision: resolveDecision(rawDecision, registry), source: "rules" };
  }
}
