/**
 * Context Signal Collector - Gathers intent signals from the page
 * VC Track: At least 2 signals - URL/UTM, referrer, on-page behavior, persona toggle
 */

import type { ContextSignals, IntentType } from "./types";

/** Parse referrer URL into a type */
function inferReferrerType(referrer: string): ContextSignals["referrerType"] {
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host.includes("google") || host.includes("bing") || host.includes("duckduckgo")) return "google";
    if (host.includes("facebook") || host.includes("twitter") || host.includes("instagram") || host.includes("linkedin")) return "social";
    if (host.includes("mail") || host.includes("outlook") || host.includes("gmail")) return "email";
  } catch {
    // invalid URL
  }
  return "other";
}

/** Extract UTM params from URL */
function extractUtm(params: URLSearchParams): ContextSignals["utm"] {
  return {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
  };
}

/** Parse ?persona=BUY_NOW from URL for demo mode */
function getPersonaFromUrl(params: URLSearchParams): IntentType | undefined {
  const p = params.get("persona")?.toUpperCase();
  const valid: IntentType[] = ["BUY_NOW", "COMPARE", "USE_CASE", "BUDGET", "UNKNOWN"];
  if (p && valid.includes(p as IntentType)) return p as IntentType;
  return undefined;
}

/**
 * Collect all context signals from the current page/browser.
 * Call this on page load (or when persona override changes).
 */
export function collectContextSignals(options?: {
  personaOverride?: IntentType;
  earlyBehavior?: ContextSignals["earlyBehavior"];
}): ContextSignals {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const referrer = typeof window !== "undefined" ? document.referrer || null : null;

  const urlParams: Record<string, string> = {};
  params.forEach((v, k) => {
    urlParams[k] = v;
  });

  const searchQuery = params.get("q") ?? params.get("query") ?? params.get("search") ?? params.get("intent") ?? null;
  const personaFromUrl = getPersonaFromUrl(params);
  const personaOverride = options?.personaOverride ?? personaFromUrl;

  return {
    urlParams,
    searchQuery,
    referrer,
    referrerType: inferReferrerType(referrer ?? ""),
    utm: extractUtm(params),
    personaOverride,
    earlyBehavior: options?.earlyBehavior,
    collectedAt: new Date().toISOString(),
  };
}

/** Serialize signals for logging / debugging */
export function serializeSignalsForLog(signals: ContextSignals): string {
  return JSON.stringify(
    {
      searchQuery: signals.searchQuery,
      referrerType: signals.referrerType,
      utm: signals.utm,
      personaOverride: signals.personaOverride,
      earlyBehavior: signals.earlyBehavior,
    },
    null,
    2
  );
}
