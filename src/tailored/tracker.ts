import type { EventType, TrackedEvent, AnalyticsData, Intent } from './types';
import { INTENT_COLORS, INTENT_TEMPLATE_MAP } from './config';

const STORAGE_KEY = 'tailored_events';
const MAX_EVENTS = 500;

function generateId(): string {
  return 'e_' + Math.random().toString(36).slice(2, 10);
}

function readEvents(): TrackedEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: TrackedEvent[]): void {
  const trimmed = events.length > MAX_EVENTS ? events.slice(-MAX_EVENTS) : events;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function trackEvent(type: EventType, visitor_id: string, data: Record<string, unknown>): void {
  const event: TrackedEvent = {
    id: generateId(),
    type,
    timestamp: new Date().toISOString(),
    visitor_id,
    data,
  };
  const events = readEvents();
  events.push(event);
  writeEvents(events);
}

export function getEvents(filter?: { type?: EventType; since?: string }): TrackedEvent[] {
  let events = readEvents();
  if (filter?.type) events = events.filter(e => e.type === filter.type);
  if (filter?.since) {
    const since = new Date(filter.since).getTime();
    events = events.filter(e => new Date(e.timestamp).getTime() >= since);
  }
  return events;
}

function timeRangeToSince(timeRange: 'today' | '7days' | '30days'): string {
  const now = new Date();
  switch (timeRange) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return start.toISOString();
    }
    case '7days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d.toISOString();
    }
    case '30days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d.toISOString();
    }
  }
}

const ALL_INTENTS: Intent[] = ['BUY_NOW', 'COMPARE', 'USE_CASE', 'BUDGET', 'RESEARCH', 'GIFTING'];

export function getAnalytics(timeRange: 'today' | '7days' | '30days'): AnalyticsData {
  const since = timeRangeToSince(timeRange);
  const all = readEvents().filter(e => new Date(e.timestamp).getTime() >= new Date(since).getTime());

  const pageViews = all.filter(e => e.type === 'page_view');
  const detections = all.filter(e => e.type === 'intent_detected');
  const heroShown = all.filter(e => e.type === 'hero_shown');
  const ctaClicks = all.filter(e => e.type === 'cta_click');

  const totalVisitors = new Set(pageViews.map(e => e.visitor_id)).size;

  const personalizedCount = detections.filter(e => (e.data.confidence as number) >= 0.30).length;
  const personalizedPct = detections.length > 0 ? (personalizedCount / detections.length) * 100 : 0;

  const confidences = detections.map(e => e.data.confidence as number);
  const avgConfidence = confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;

  const fallbackCount = detections.filter(e => e.data.fallback_used === true).length;
  const fallbackRate = detections.length > 0 ? (fallbackCount / detections.length) * 100 : 0;

  // Intent distribution
  const intentCounts: Record<string, number> = {};
  for (const e of detections) {
    const intent = e.data.intent as string;
    intentCounts[intent] = (intentCounts[intent] || 0) + 1;
  }
  const totalDetections = detections.length || 1;
  const intentDistribution = ALL_INTENTS.map(name => ({
    name,
    value: Math.round(((intentCounts[name] || 0) / totalDetections) * 100),
    color: INTENT_COLORS[name],
  }));

  // Confidence distribution (buckets 0.0 to 1.0)
  const buckets = Array.from({ length: 11 }, (_, i) => ({ range: (i / 10).toFixed(1), count: 0 }));
  for (const c of confidences) {
    const idx = Math.min(Math.floor(c * 10), 10);
    buckets[idx].count++;
  }

  // Variant performance (CTR per template)
  const templateShown: Record<string, number> = {};
  const templateClicked: Record<string, number> = {};
  for (const e of heroShown) {
    const t = e.data.template as string;
    templateShown[t] = (templateShown[t] || 0) + 1;
  }
  for (const e of ctaClicks) {
    const t = e.data.template as string;
    templateClicked[t] = (templateClicked[t] || 0) + 1;
  }
  const variantPerformance = Object.values(INTENT_TEMPLATE_MAP).map(template => {
    const shown = templateShown[template] || 0;
    const clicked = templateClicked[template] || 0;
    const ctr = shown > 0 ? Math.round((clicked / shown) * 1000) / 10 : 0;
    const displayName = template.replace('hero_', 'Hero').replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
    return { name: displayName, ctr };
  });

  // Heatmap: intent x cta_type
  const heatmapData = ALL_INTENTS.map(intent => {
    const intentClicks = ctaClicks.filter(e => e.data.intent === intent);
    const intentShownCount = heroShown.filter(e => e.data.intent === intent).length || 1;
    const primary = intentClicks.filter(e => e.data.cta_type === 'primary').length;
    const secondary = intentClicks.filter(e => e.data.cta_type === 'secondary').length;
    const noClick = Math.max(0, intentShownCount - primary - secondary);
    return {
      intent,
      primary: Math.round((primary / intentShownCount) * 100) / 100,
      secondary: Math.round((secondary / intentShownCount) * 100) / 100,
      none: Math.round((noClick / intentShownCount) * 100) / 100,
    };
  });

  // Recent decisions
  const recentDecisions = detections
    .slice(-20)
    .reverse()
    .map(e => {
      const ago = Math.round((Date.now() - new Date(e.timestamp).getTime()) / 60000);
      return {
        time: ago < 1 ? 'just now' : `${ago}m ago`,
        intent: e.data.intent as string,
        confidence: e.data.confidence as number,
        template: e.data.template as string,
        cta: (e.data.cta_clicked as string) || 'None',
        referrer: (e.data.referrer_type as string) || 'Direct',
      };
    });

  // Sparkline: last 8 confidence averages grouped
  const sparklineData: { value: number }[] = [];
  const chunkSize = Math.max(1, Math.floor(confidences.length / 8));
  for (let i = 0; i < 8; i++) {
    const chunk = confidences.slice(i * chunkSize, (i + 1) * chunkSize);
    const avg = chunk.length > 0 ? chunk.reduce((a, b) => a + b, 0) / chunk.length : avgConfidence;
    sparklineData.push({ value: Math.round(avg * 100) / 100 });
  }

  return {
    totalVisitors,
    personalizedPct: Math.round(personalizedPct * 10) / 10,
    avgConfidence: Math.round(avgConfidence * 100) / 100,
    fallbackRate: Math.round(fallbackRate * 10) / 10,
    intentDistribution,
    confidenceDistribution: buckets,
    variantPerformance,
    heatmapData,
    recentDecisions,
    sparklineData,
  };
}

export function seedDemoData(): void {
  const existing = readEvents();
  if (existing.length >= 5) return;

  const events: TrackedEvent[] = [];
  const now = Date.now();

  const intentWeights: [Intent, number][] = [
    ['BUY_NOW', 28], ['COMPARE', 24], ['USE_CASE', 18],
    ['BUDGET', 15], ['RESEARCH', 10], ['GIFTING', 5],
  ];

  const referrerTypes = ['Google', 'Reddit', 'Instagram', 'Email', 'Direct'];

  for (let i = 0; i < 80; i++) {
    const visitorId = 'v_' + Math.random().toString(16).slice(2, 8);
    const daysAgo = Math.random() * 30;
    const ts = new Date(now - daysAgo * 86400000).toISOString();

    // Weighted intent selection
    const roll = Math.random() * 100;
    let cumulative = 0;
    let intent: Intent = 'RESEARCH';
    for (const [name, weight] of intentWeights) {
      cumulative += weight;
      if (roll < cumulative) { intent = name; break; }
    }

    const confidence = 0.30 + Math.random() * 0.65;
    const template = INTENT_TEMPLATE_MAP[intent];
    const referrer = referrerTypes[Math.floor(Math.random() * referrerTypes.length)];
    const fallback_used = confidence < 0.35;

    // page_view
    events.push({
      id: generateId(), type: 'page_view', timestamp: ts, visitor_id: visitorId,
      data: { referrer },
    });

    // intent_detected
    events.push({
      id: generateId(), type: 'intent_detected', timestamp: ts, visitor_id: visitorId,
      data: { intent, confidence, template, fallback_used, referrer_type: referrer },
    });

    // hero_shown
    events.push({
      id: generateId(), type: 'hero_shown', timestamp: ts, visitor_id: visitorId,
      data: { template, intent },
    });

    // cta_click (60% chance)
    if (Math.random() < 0.6) {
      const cta_type = Math.random() < 0.7 ? 'primary' : 'secondary';
      events.push({
        id: generateId(), type: 'cta_click', timestamp: ts, visitor_id: visitorId,
        data: { template, intent, cta_type },
      });
    }
  }

  // Sort by timestamp
  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  writeEvents(events);
}
