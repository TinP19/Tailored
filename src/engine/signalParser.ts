// ============================================================================
// Tailored — Signal Parser
// Extracts and structures raw signals from the browser environment.
// Pure function — reads window/navigator/document, returns structured data.
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ReferrerType =
  | 'search_organic'
  | 'search_paid'
  | 'social'
  | 'review_site'
  | 'email'
  | 'direct'
  | 'unknown';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type TimeContext = 'morning' | 'afternoon' | 'evening' | 'night';

export interface UTMData {
  term: string[];
  source: string;
  medium: string;
  campaign: string;
}

export interface ReferrerData {
  url: string;
  type: ReferrerType;
}

export interface DeviceData {
  type: DeviceType;
  time_context: TimeContext;
}

export interface SignalData {
  utm: UTMData;
  referrer: ReferrerData;
  device: DeviceData;
  raw_url: string;
}

/**
 * Optional overrides for testing and for TailoredLens debug panel.
 * Any field provided here replaces the corresponding browser-read value.
 */
export interface SignalOverrides {
  url?: string;
  referrer?: string;
  userAgent?: string;
  hour?: number;
  viewportWidth?: number;
}

// ---------------------------------------------------------------------------
// Domain classification tables
// ---------------------------------------------------------------------------

const SEARCH_ORGANIC_DOMAINS = [
  'google.com',
  'google.co',
  'bing.com',
  'duckduckgo.com',
  'yahoo.com',
  'baidu.com',
  'yandex.com',
  'ecosia.org',
];

const SOCIAL_DOMAINS = [
  'instagram.com',
  'tiktok.com',
  'facebook.com',
  'fb.com',
  'twitter.com',
  'x.com',
  'reddit.com',
  'youtube.com',
  'linkedin.com',
  'pinterest.com',
  'threads.net',
  'snapchat.com',
];

const REVIEW_SITE_DOMAINS = [
  'wirecutter.com',
  'rtings.com',
  'tomsguide.com',
  'techradar.com',
  'pcmag.com',
  'theverge.com',
  'cnet.com',
  'tomshardware.com',
  'notebookcheck.net',
];

const PAID_CLICK_PARAMS = ['gclid', 'msclkid', 'fbclid', 'dclid'];

const EMAIL_ESP_DOMAINS = [
  'mail.google.com',
  'outlook.live.com',
  'mail.yahoo.com',
  'mailchimp.com',
  'sendgrid.net',
  'klaviyo.com',
  'constantcontact.com',
];

// ---------------------------------------------------------------------------
// 1. UTM Parser
// ---------------------------------------------------------------------------

function parseUTM(searchString: string): UTMData {
  const params = new URLSearchParams(searchString);

  const rawTerm = params.get('utm_term') ?? '';
  const source = (params.get('utm_source') ?? '').toLowerCase().trim();
  const medium = (params.get('utm_medium') ?? '').toLowerCase().trim();
  const campaign = (params.get('utm_campaign') ?? '').toLowerCase().trim();

  // Tokenize utm_term: lowercase, split on spaces, +, -, %20, commas
  const term = rawTerm
    .toLowerCase()
    .split(/[\s+\-,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  return { term, source, medium, campaign };
}

// ---------------------------------------------------------------------------
// 2. Referrer Classifier
// ---------------------------------------------------------------------------

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function domainMatches(hostname: string, domains: string[]): boolean {
  return domains.some(
    (domain) => hostname === domain || hostname.endsWith('.' + domain),
  );
}

function classifyReferrer(
  referrerUrl: string,
  searchString: string,
  utmMedium: string,
): ReferrerData {
  if (!referrerUrl || referrerUrl.trim() === '') {
    return { url: '', type: 'direct' };
  }

  const hostname = extractHostname(referrerUrl);
  if (!hostname) {
    return { url: referrerUrl, type: 'unknown' };
  }

  // Check paid search first (URL contains click ID params)
  const params = new URLSearchParams(searchString);
  const hasPaidParam = PAID_CLICK_PARAMS.some((p) => params.has(p));
  if (hasPaidParam) {
    return { url: referrerUrl, type: 'search_paid' };
  }

  // Check email (utm_medium or ESP domain)
  if (utmMedium === 'email' || domainMatches(hostname, EMAIL_ESP_DOMAINS)) {
    return { url: referrerUrl, type: 'email' };
  }

  // Check review sites
  if (domainMatches(hostname, REVIEW_SITE_DOMAINS)) {
    return { url: referrerUrl, type: 'review_site' };
  }

  // Check social (before search, since reddit/youtube are also search-like)
  if (domainMatches(hostname, SOCIAL_DOMAINS)) {
    return { url: referrerUrl, type: 'social' };
  }

  // Check organic search
  if (domainMatches(hostname, SEARCH_ORGANIC_DOMAINS)) {
    return { url: referrerUrl, type: 'search_organic' };
  }

  return { url: referrerUrl, type: 'unknown' };
}

// ---------------------------------------------------------------------------
// 3. Device & Time Context
// ---------------------------------------------------------------------------

const MOBILE_REGEX =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
const TABLET_REGEX = /iPad|Android(?!.*Mobile)|Tablet/i;

function detectDevice(userAgent: string, viewportWidth: number): DeviceType {
  if (TABLET_REGEX.test(userAgent)) return 'tablet';
  if (MOBILE_REGEX.test(userAgent) || viewportWidth < 768) return 'mobile';
  return 'desktop';
}

function getTimeContext(hour: number): TimeContext {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Reads the browser environment and returns a structured SignalData object.
 *
 * Pure in the sense that it has no side effects — it only reads from
 * window, navigator, and document. All globals can be overridden via
 * the `overrides` param for testing and for the TailoredLens debug panel.
 */
export function parseSignals(overrides: SignalOverrides = {}): SignalData {
  // Read from browser or use overrides
  const rawUrl =
    overrides.url ??
    (typeof window !== 'undefined' ? window.location.href : '');
  const referrerUrl =
    overrides.referrer ??
    (typeof document !== 'undefined' ? document.referrer : '');
  const userAgent =
    overrides.userAgent ??
    (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const hour = overrides.hour ?? new Date().getHours();
  const viewportWidth =
    overrides.viewportWidth ??
    (typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Extract search string from URL
  let searchString = '';
  try {
    searchString = new URL(rawUrl).search;
  } catch {
    // If URL parsing fails, try to extract ?... portion directly
    const qIndex = rawUrl.indexOf('?');
    if (qIndex !== -1) searchString = rawUrl.slice(qIndex);
  }

  // Parse each signal source
  const utm = parseUTM(searchString);
  const referrer = classifyReferrer(referrerUrl, searchString, utm.medium);
  const device: DeviceData = {
    type: detectDevice(userAgent, viewportWidth),
    time_context: getTimeContext(hour),
  };

  return {
    utm,
    referrer,
    device,
    raw_url: rawUrl,
  };
}
