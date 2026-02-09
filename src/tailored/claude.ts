import type { Signals, Classification } from './types';
import { ASSET_REGISTRY, CTA_OPTIONS } from './assets';

export interface ClaudeDecisionResult {
  template: string;
  hero_image: string;
  cta: string;
  reasoning: string;
}

// In-memory cache to avoid redundant API calls
const cache = new Map<string, { data: ClaudeDecisionResult; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(signals: Signals, intent: string): string {
  return `${signals.utm_term ?? ''}|${signals.referrer_type}|${signals.device}|${intent}`;
}

function buildPrompt(signals: Signals, classification: Classification): string {
  const assetList = ASSET_REGISTRY.map(
    a => `- ${a.id}: ${a.name} — ${a.description} (category: ${a.category}, price: ${a.price_range}, use_case: ${a.use_case.join(',')}, vibe: ${a.vibe.join(',')})`
  ).join('\n');

  const ctaList = CTA_OPTIONS.map((c, i) => `${i + 1}. "${c}"`).join('\n');

  return `You are the decision engine for an e-commerce personalization widget. Based on the visitor signals below, choose the best hero template, hero image, and CTA text.

VISITOR SIGNALS:
- Detected intent: ${classification.primary_intent} (${(classification.confidence * 100).toFixed(0)}% confidence)
- UTM term: "${signals.utm_term || 'none'}"
- Referrer type: ${signals.referrer_type}
- Device: ${signals.device}
- Time context: ${signals.time_context}

AVAILABLE TEMPLATES (pick exactly one):
- hero_urgency: Scarcity/countdown — best for BUY_NOW intent
- hero_comparison: Side-by-side spec grid — best for COMPARE intent
- hero_lifestyle: Full-bleed lifestyle imagery — best for USE_CASE intent
- hero_value: Price-focused deals — best for BUDGET intent
- hero_guide: Educational/editorial — best for RESEARCH intent
- hero_gift: Gift tiers and wrapping — best for GIFTING intent

AVAILABLE HERO IMAGES (pick exactly one id):
${assetList}

AVAILABLE CTAs (pick exactly one):
${ctaList}

RULES:
1. The template MUST align with the detected intent.
2. The hero image should match the intent vibe and visitor context (e.g., gaming products for gaming intent, budget products for budget intent).
3. The CTA should match the action implied by the intent.
4. Provide a concise 1-2 sentence reasoning.

Respond ONLY with a JSON object in this exact format, no markdown fences:
{"template":"hero_urgency","hero_image":"macbook-pro","cta":"Buy Now — Free Next-Day Delivery","reasoning":"Your reasoning here."}`;
}

function parseResponse(text: string): ClaudeDecisionResult {
  // Strip markdown fences if present
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in AI response');

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate template
  const validTemplates = ['hero_urgency', 'hero_comparison', 'hero_lifestyle', 'hero_value', 'hero_guide', 'hero_gift'];
  if (!validTemplates.includes(parsed.template)) throw new Error(`Invalid template: ${parsed.template}`);

  // Validate hero_image exists in registry
  const validIds = ASSET_REGISTRY.map(a => a.id);
  if (!validIds.includes(parsed.hero_image)) throw new Error(`Invalid hero_image: ${parsed.hero_image}`);

  return {
    template: parsed.template,
    hero_image: parsed.hero_image,
    cta: parsed.cta || 'Shop Now',
    reasoning: parsed.reasoning || 'AI-selected personalization.',
  };
}

export async function getClaudeDecision(
  signals: Signals,
  classification: Classification
): Promise<ClaudeDecisionResult | null> {
  // Check cache
  const key = getCacheKey(signals, classification.primary_intent);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const model = 'gemini-2.0-flash-lite';
    const response = await fetch(
      `/api/gemini/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: buildPrompt(signals, classification) }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 512,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn('Gemini API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const result = parseResponse(text);

    // Cache the result
    cache.set(key, { data: result, ts: Date.now() });

    return result;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      console.warn('Gemini API timed out, falling back to rules engine');
    } else {
      console.warn('Gemini API error:', err);
    }
    return null;
  }
}
