/**
 * LLM-Based Decision Engine - Claude/GPT as reasoning engine
 * User Signals → LLM Prompt → Structured Decision + Explanation
 */

import type { CollectedContext } from "./contextCollector";
import type { PersonalizationRegistry } from "./registry";

export interface LLMDecision {
  intent: string;
  confidence: number;
  template_id: string;
  image_id: string;
  cta_id: string;
  headline: string;
  subheadline: string;
  reasoning: {
    intent_signals: string[];
    template_choice: string;
    image_choice: string;
    cta_choice: string;
  };
}

function buildDecisionPrompt(context: CollectedContext, reg: PersonalizationRegistry): string {
  return `You are an e-commerce personalization agent. Analyze the user context and select the optimal hero template, image, and CTA from our registry.

# USER CONTEXT
URL: ${context.url}
Query Params: ${context.query_params}
Search/Intent query: ${context.search_query ?? "none"}
Referrer: ${context.referrer || "direct"}
UTM Source: ${context.utm_source ?? "none"}
UTM Campaign: ${context.utm_campaign ?? "none"}
Device: ${context.device_type}
Screen: ${context.screen_size}
Session: ${context.pages_viewed} pages viewed, ${context.time_on_site}s on site
Scroll depth: ${context.scroll_depth}%
${context.persona_override ? `\nPERSONA OVERRIDE (use this intent): ${context.persona_override}\n` : ""}

# AVAILABLE TEMPLATES
${JSON.stringify(reg.templates, null, 2)}

# AVAILABLE HERO IMAGES
${JSON.stringify(reg.images.map((i) => ({ ...i, url: "[resolved at runtime]" })), null, 2)}

# AVAILABLE CTAs
${JSON.stringify(reg.ctas, null, 2)}

# YOUR TASK
1. Infer the user's PRIMARY INTENT from the context (choose one):
   - BUY_NOW: High purchase intent, ready to buy
   - COMPARE: Researching/comparing options
   - USE_CASE_GAMING: Gaming-specific need
   - USE_CASE_WORK: Professional/productivity need
   - USE_CASE_DESIGN: Creative/design need
   - BUDGET: Price-sensitive shopping
   - BROWSE: General exploration

2. Select the BEST MATCH for:
   - template_id (from templates)
   - image_id (from images)
   - cta_id (from ctas)

3. Write a CUSTOM headline (max 60 chars) and subheadline (max 100 chars) tailored to the inferred intent.

4. Provide clear REASONING for each choice.

Respond ONLY with valid JSON in this exact format (no markdown, no code block):
{
  "intent": "USE_CASE_GAMING",
  "confidence": 0.85,
  "template_id": "hero_urgent",
  "image_id": "img_gaming",
  "cta_id": "buy_now",
  "headline": "144Hz Gaming Displays - In Stock",
  "subheadline": "Ultra-responsive monitors for competitive gaming. Free shipping.",
  "reasoning": {
    "intent_signals": ["Query contains gaming", "Direct traffic"],
    "template_choice": "Urgent template for high-intent buyer",
    "image_choice": "Gaming setup resonates with target",
    "cta_choice": "Buy now appropriate for purchase-ready visitor"
  }
}`;
}

/**
 * Call Anthropic Claude API for personalization decision.
 * Requires VITE_ANTHROPIC_API_KEY in .env
 */
export async function getLLMDecision(
  context: CollectedContext,
  registry: PersonalizationRegistry
): Promise<LLMDecision> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "") {
    throw new Error("VITE_ANTHROPIC_API_KEY not set. Add it to .env for LLM personalization.");
  }

  const prompt = buildDecisionPrompt(context, registry);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error: ${response.status} ${err}`);
  }

  const data = (await response.json()) as { content: { text: string }[] };
  const text = data.content[0]?.text ?? "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as LLMDecision;
}
