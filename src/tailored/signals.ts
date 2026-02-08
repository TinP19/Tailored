import type { Signals, ReferrerType, Device, TimeContext } from './types';

const SEARCH_DOMAINS = ['google.com', 'bing.com', 'duckduckgo.com', 'yahoo.com'];
const REVIEW_DOMAINS = ['wirecutter.com', 'rtings.com', 'reddit.com', 'tomsguide.com'];
const SOCIAL_DOMAINS = ['instagram.com', 'tiktok.com', 'facebook.com', 'twitter.com', 'youtube.com'];

function classifyReferrer(referrer: string): ReferrerType {
  if (!referrer) return 'direct';

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();

    if (hostname === window.location.hostname) return 'direct';
    if (SEARCH_DOMAINS.some(d => hostname.includes(d))) return 'search_organic';
    if (REVIEW_DOMAINS.some(d => hostname.includes(d))) return 'review_site';
    if (SOCIAL_DOMAINS.some(d => hostname.includes(d))) return 'social';
    if (hostname.includes('mail') || hostname.includes('email')) return 'email';
  } catch {
    // invalid URL
  }

  return 'unknown';
}

function detectDevice(): Device {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 768) return 'mobile';
  if (/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return 'mobile';
  return 'desktop';
}

function getTimeContext(): TimeContext {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const isWeekend = day === 0 || day === 6;
  const period = hour >= 6 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'afternoon' : 'evening';
  const dayType = isWeekend ? 'weekend' : 'weekday';

  return `${period}_${dayType}` as TimeContext;
}

export function parseSignals(overrides?: Partial<Signals>): Signals {
  const params = new URLSearchParams(window.location.search);
  const utmParts = [params.get('utm_term'), params.get('utm_source'), params.get('utm_campaign'), params.get('intent')]
    .filter(Boolean)
    .join(' ');

  const signals: Signals = {
    utm_term: utmParts || null,
    referrer: document.referrer,
    referrer_type: classifyReferrer(document.referrer),
    device: detectDevice(),
    time_context: getTimeContext(),
  };

  if (overrides) {
    return { ...signals, ...overrides };
  }

  return signals;
}
