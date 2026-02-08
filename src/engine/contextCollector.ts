/**
 * Enhanced Context Collector - LLM-Based Decision Agent
 * Collects URL, UTM, referrer, behavioral signals (simulated for demo), device context
 */

const SESSION_KEY = "vbb_session_start";
const PAGE_COUNT_KEY = "vbb_pages_viewed";

function getUTMParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

function getSessionTime(): number {
  if (typeof window === "undefined") return 0;
  try {
    const start = sessionStorage.getItem(SESSION_KEY);
    if (!start) {
      sessionStorage.setItem(SESSION_KEY, String(Date.now()));
      return 0;
    }
    return Math.floor((Date.now() - parseInt(start, 10)) / 1000);
  } catch {
    return 0;
  }
}

function getPageCount(): number {
  if (typeof window === "undefined") return 1;
  try {
    const count = parseInt(sessionStorage.getItem(PAGE_COUNT_KEY) ?? "1", 10);
    return count;
  } catch {
    return 1;
  }
}

let scrollDepth = 0;
export function initScrollTracking(): void {
  if (typeof window === "undefined") return;
  const onScroll = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      scrollDepth = Math.round((window.scrollY / docHeight) * 100);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

function getScrollDepth(): number {
  if (typeof window === "undefined") return 0;
  return scrollDepth;
}

export interface CollectedContext {
  url: string;
  query_params: string;
  referrer: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  time_on_site: number;
  pages_viewed: number;
  scroll_depth: number;
  device_type: "mobile" | "desktop";
  screen_size: string;
  search_query: string | null;
  persona_override?: string;
}

/**
 * Collect full context for the LLM decision prompt.
 */
export function collectContext(options?: { personaOverride?: string }): CollectedContext {
  const isClient = typeof window !== "undefined";
  const params = isClient ? new URLSearchParams(window.location.search) : new URLSearchParams();

  return {
    url: isClient ? window.location.href : "",
    query_params: params.toString(),
    referrer: isClient ? document.referrer : "",
    utm_source: getUTMParam("utm_source"),
    utm_medium: getUTMParam("utm_medium"),
    utm_campaign: getUTMParam("utm_campaign"),
    time_on_site: getSessionTime(),
    pages_viewed: getPageCount(),
    scroll_depth: getScrollDepth(),
    device_type: isClient && /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? "mobile" : "desktop",
    screen_size: isClient ? `${window.innerWidth}x${window.innerHeight}` : "0x0",
    search_query: params.get("q") ?? params.get("query") ?? params.get("search") ?? params.get("intent") ?? null,
    persona_override: options?.personaOverride,
  };
}
