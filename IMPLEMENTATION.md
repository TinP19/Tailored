# Tailored — Implementation Plan

## Context

The TechHaven UI is fully built (Lovable-generated). All 6 hero variants, the TailoredLens debug panel, and the TailoredPulse analytics dashboard exist as React components — but they're entirely static. Nothing is wired together. We need to build the logic layer that makes personalization actually work.

**Goal:** Wire up the full pipeline: signal detection → intent classification → hero swapping → section reordering → social proof adaptation → debug panel → event tracking → real analytics.

---

## Phase 1: Core Engine

Create `src/tailored/` directory with 6 files.

### 1. `src/tailored/types.ts` — Shared type definitions

```ts
// The 6 intent archetypes
type Intent = 'BUY_NOW' | 'COMPARE' | 'USE_CASE' | 'BUDGET' | 'RESEARCH' | 'GIFTING';

type Device = 'desktop' | 'mobile';
type TimeContext = 'morning_weekday' | 'afternoon_weekday' | 'evening_weekday'
                 | 'morning_weekend' | 'afternoon_weekend' | 'evening_weekend';
type ReferrerType = 'search_organic' | 'review_site' | 'social' | 'email' | 'direct' | 'unknown';

// Raw signals extracted from browser environment
interface Signals {
  utm_term: string | null;
  referrer: string;
  referrer_type: ReferrerType;
  device: Device;
  time_context: TimeContext;
}

// Output of the intent classifier
interface Classification {
  primary_intent: Intent;
  confidence: number;               // 0-1, clamped
  secondary_intent: Intent | null;
  reasoning: string;                 // human-readable explanation
  scores: Record<Intent, number>;    // full score breakdown for debug
}

// What the engine decided to render
interface Decision {
  template: string;                  // e.g. "hero_urgency"
  section_order: string[];           // e.g. ["deals", "guides", "reviews"]
  social_proof: string;              // intent-specific copy
}

// The complete decision object (logged, displayed in Lens, tracked)
interface DecisionObject {
  visitor_id: string;
  timestamp: string;
  signals: Signals;
  classification: Classification;
  decision: Decision;
  fallback_used: boolean;
}

// Event tracking
type EventType = 'page_view' | 'intent_detected' | 'cta_click' | 'hero_shown' | 'section_reorder';

interface TrackedEvent {
  id: string;
  type: EventType;
  timestamp: string;
  visitor_id: string;
  data: Record<string, unknown>;
}
```

Export all types.

---

### 2. `src/tailored/config.ts` — Static mappings

All the lookup tables the engine needs. No logic, just data.

**Intent → Template:**
```ts
const INTENT_TEMPLATE_MAP: Record<Intent, string> = {
  BUY_NOW:  'hero_urgency',
  COMPARE:  'hero_comparison',
  USE_CASE: 'hero_lifestyle',
  BUDGET:   'hero_value',
  RESEARCH: 'hero_guide',
  GIFTING:  'hero_gift',
};
```

**Intent → Section Order:**
```ts
const SECTION_ORDER_MAP: Record<Intent, string[]> = {
  BUY_NOW:  ['deals', 'reviews', 'guides'],
  COMPARE:  ['guides', 'reviews', 'deals'],
  USE_CASE: ['deals', 'guides', 'reviews'],
  BUDGET:   ['deals', 'reviews', 'guides'],
  RESEARCH: ['guides', 'deals', 'reviews'],
  GIFTING:  ['deals', 'guides', 'reviews'],
};
```

**Intent → Social Proof Copy:**
```ts
const SOCIAL_PROOF_MAP: Record<Intent, string> = {
  BUY_NOW:  '47 people bought this in the last hour',
  COMPARE:  'Rated #1 by 3 major review sites',
  USE_CASE: 'Recommended by 8,000+ gamers',
  BUDGET:   'Save an average of $120 vs. retail',
  RESEARCH: 'Read by 25,000 shoppers this month',
  GIFTING:  'Top-rated gift — 4.8★ from 2,100 reviews',
};
```

**Intent Colors** (reuse in components):
```ts
const INTENT_COLORS: Record<Intent, string> = {
  BUY_NOW:  '#ef4444',
  COMPARE:  '#3b82f6',
  USE_CASE: '#a855f7',
  BUDGET:   '#22c55e',
  RESEARCH: '#06b6d4',
  GIFTING:  '#f59e0b',
};
```

**Confidence threshold:**
```ts
const CONFIDENCE_THRESHOLD = 0.30;
const DEFAULT_INTENT: Intent = 'RESEARCH';
```

---

### 3. `src/tailored/signals.ts` — Signal parser

Single function: `parseSignals(overrides?: Partial<Signals>): Signals`

**UTM parsing:**
- Read `window.location.search` → `URLSearchParams`
- Extract `utm_term`, `utm_source`, `utm_campaign`
- Also check for `?intent=` param (direct demo links)
- Combine into single string for keyword matching

**Referrer classification:**
- Read `document.referrer`
- Match domain against known lists:
  - `google.com`, `bing.com`, `duckduckgo.com`, `yahoo.com` → `search_organic`
  - `wirecutter.com`, `rtings.com`, `reddit.com`, `tomsguide.com` → `review_site`
  - `instagram.com`, `tiktok.com`, `facebook.com`, `twitter.com`, `youtube.com` → `social`
  - Contains `mail` or `email` → `email`
  - Empty or same-origin → `direct`

**Device detection:**
- Check viewport width < 768 OR user agent contains mobile keywords → `mobile`
- Else → `desktop`

**Time context:**
- `new Date()` → extract hour and day-of-week
- Hour 6-12 = morning, 12-18 = afternoon, 18-6 = evening
- Day 0,6 = weekend, else weekday
- Combine: e.g. `afternoon_weekday`

**Overrides:** If `overrides` param provided (from TailoredLens), merge on top of real signals. This lets the debug panel override any signal while keeping the rest real.

---

### 4. `src/tailored/classifier.ts` — Intent classifier

Single function: `classifyIntent(signals: Signals): Classification`

**Algorithm:**

1. Initialize score map: `{ BUY_NOW: 0, COMPARE: 0, USE_CASE: 0, BUDGET: 0, RESEARCH: 0, GIFTING: 0 }`

2. If `utm_term` exists, tokenize (lowercase, split on spaces/+/-/%) and match:

| Keyword Set | Weight | Target Intent |
|-------------|--------|---------------|
| `buy`, `order`, `add to cart`, `now`, `purchase`, `checkout` | +0.45 | BUY_NOW |
| `best`, `vs`, `top`, `compare`, `review`, `which`, `versus` | +0.40 | COMPARE |
| `gaming`, `coding`, `work`, `streaming`, `student`, `studio`, `creative`, `office` | +0.30 | USE_CASE |
| `cheap`, `under`, `budget`, `deal`, `sale`, `affordable`, `value`, `discount` | +0.40 | BUDGET |
| `gift`, `for him`, `for her`, `christmas`, `birthday`, `holiday`, `present`, `wedding` | +0.35 | GIFTING |

3. Apply referrer bonuses:
   - `review_site` → COMPARE +0.25
   - `social` → USE_CASE +0.15
   - `email` or `direct` → BUY_NOW +0.10
   - `search_organic` → RESEARCH +0.10

4. Apply composite signal:
   - `device === 'mobile'` AND time contains `evening` → RESEARCH +0.10

5. Find highest score → `primary_intent`, second highest → `secondary_intent`

6. Calculate `confidence` = highest score, clamped to [0, 1]

7. If confidence < 0.30 → set `primary_intent = 'RESEARCH'`, `fallback_used = true`

8. Build `reasoning` string listing each signal that contributed:
   - e.g. `"UTM contains 'best' → COMPARE (+0.40). UTM contains 'gaming' → USE_CASE (+0.30). Referrer is search_organic → RESEARCH (+0.10). Primary: COMPARE (0.65)."`

---

### 5. `src/tailored/engine.ts` — TailoredCore orchestrator

Single function: `runEngine(overrides?: Partial<Signals>): DecisionObject`

**Steps:**
1. `parseSignals(overrides)` → signals
2. `classifyIntent(signals)` → classification
3. Look up `template` from `INTENT_TEMPLATE_MAP[classification.primary_intent]`
4. Look up `section_order` from `SECTION_ORDER_MAP[classification.primary_intent]`
5. Look up `social_proof` from `SOCIAL_PROOF_MAP[classification.primary_intent]`
6. Get or create `visitor_id` from `sessionStorage` (format: `v_` + 6 random hex chars)
7. Assemble `DecisionObject` with `timestamp: new Date().toISOString()`
8. Return it

This is the single entry point other code calls.

---

### 6. `src/tailored/tracker.ts` — Event tracking + localStorage analytics

**localStorage key:** `tailored_events`

**Functions:**

`trackEvent(type: EventType, visitor_id: string, data: Record<string, unknown>): void`
- Create `TrackedEvent` with unique id, timestamp
- Read existing events from localStorage, append, write back
- Cap at 500 events max (drop oldest)

`getEvents(filter?: { type?: EventType, since?: string }): TrackedEvent[]`
- Read from localStorage, apply optional filters

`getAnalytics(timeRange: 'today' | '7days' | '30days'): AnalyticsData`
- Filter events by time range
- Compute and return:
  - `totalVisitors`: unique `visitor_id` count from `page_view` events
  - `personalizedPct`: `intent_detected` events with confidence >= 0.30 / total decisions
  - `avgConfidence`: mean confidence from `intent_detected` events
  - `fallbackRate`: decisions where fallback_used / total decisions
  - `intentDistribution`: count per intent from `intent_detected` events → array for pie chart
  - `confidenceDistribution`: histogram buckets (0.0, 0.1, ..., 1.0) → array for area chart
  - `variantPerformance`: for each template, CTR = `cta_click` count / `hero_shown` count → array for bar chart
  - `heatmapData`: cross-tab of intent × cta_type (primary/secondary/none) → array for heatmap
  - `recentDecisions`: last 20 `intent_detected` events with full data → array for table
  - `sparklineData`: last 8 avg confidence values (grouped by time bucket)

`seedDemoData(): void`
- If localStorage has < 5 events, generate ~80 realistic demo events:
  - Spread across last 30 days
  - Cover all 6 intents (weighted: BUY_NOW 28%, COMPARE 24%, USE_CASE 18%, BUDGET 15%, RESEARCH 10%, GIFTING 5%)
  - Vary confidence (0.3-0.95 range)
  - Include matching `page_view`, `intent_detected`, `hero_shown`, `cta_click` events
  - Varied referrers (Google, Reddit, Instagram, Email, Direct)
  - This ensures Pulse has data on first load

---

## Phase 2: React Context

### 7. `src/contexts/TailoredContext.tsx` — Shared personalization state

**State:**
```ts
{
  decision: DecisionObject | null;
  isOverrideMode: boolean;
  overrideSignals: Partial<Signals>;
}
```

**Actions exposed via context:**
- `detectIntent()` — runs `runEngine(isOverrideMode ? overrideSignals : undefined)`, updates `decision` state, tracks `intent_detected` + `hero_shown` events
- `setOverrideIntent(intent: Intent)` — enters override mode, sets override UTM to a keyword that triggers the intent (e.g. BUY_NOW → `"buy now"`), then calls `detectIntent()`
- `setOverrideSignals(partial: Partial<Signals>)` — merges into `overrideSignals`, enters override mode
- `clearOverrides()` — resets `overrideSignals` to `{}`, exits override mode, calls `detectIntent()` with real signals
- `trackEvent(type, data)` — convenience wrapper for tracker

**Provider behavior:**
- On mount: call `seedDemoData()`, then `detectIntent()`
- Track `page_view` event on mount
- Re-run detection when URL search params change

---

## Phase 3: Wire Up Components

### 8. Modify `src/App.tsx`

Minimal change — wrap the router contents with `<TailoredProvider>`:

```tsx
<TailoredProvider>
  <BrowserRouter>
    <Routes>...</Routes>
  </BrowserRouter>
</TailoredProvider>
```

---

### 9. Modify `src/pages/Index.tsx`

**Current:** Renders `<HeroSection />` and sections in fixed order.

**Changes:**
- Import `useTailored` context hook
- Import all 6 hero variants from `@/components/heroes`
- Create a `HERO_MAP` mapping template strings to components:
  ```ts
  const HERO_MAP = {
    hero_urgency: HeroUrgency,
    hero_comparison: HeroComparison,
    hero_lifestyle: HeroLifestyle,
    hero_value: HeroValue,
    hero_guide: HeroGuide,
    hero_gift: HeroGift,
  };
  ```
- Replace `<HeroSection />` with dynamic selection:
  ```tsx
  const HeroComponent = decision ? HERO_MAP[decision.decision.template] ?? HeroSection : HeroSection;
  ```
- Wrap hero in a div with CSS fade transition (opacity + transition on key change)
- Create a `SECTION_MAP` for reorderable sections:
  ```ts
  const SECTION_MAP = { deals: DealsSection, guides: BuyingGuides, reviews: ReviewsSection };
  ```
- Replace the 3 static section renders with dynamic:
  ```tsx
  const sectionOrder = decision?.decision.section_order ?? ['deals', 'guides', 'reviews'];
  {sectionOrder.map(key => { const S = SECTION_MAP[key]; return <S key={key} />; })}
  ```
- Fixed elements stay in place: Navbar, CategoryNav, FeaturedProducts, Footer, TailoredLens

---

### 10. Modify `src/components/TailoredLens.tsx`

**Goal:** Replace all local mock logic with real engine via context. Keep all existing UI/animations.

**Changes:**
- Import `useTailored` context hook
- Remove local `getDecisionForIntent()` function
- Remove local `activeIntent` state (derive from `decision.classification.primary_intent`)
- Keep `isExpanded`, `copied`, `isAnimating` as local UI state
- Keep `utmTerm`, `referrer`, `device` as local input state

**Intent Simulator buttons:**
- `onClick` → call `context.setOverrideIntent(id)` (this triggers real engine → hero swaps live)

**Signal Override inputs:**
- UTM input `onChange` → update local `utmTerm` state (don't trigger yet)
- Referrer dropdown `onValueChange` → update local `referrer` state
- Device toggle `onClick` → update local `device` state

**"Detect Intent" button:**
- `onClick` → call `context.setOverrideSignals({ utm_term: utmTerm, referrer_type: referrer, device })` then `context.detectIntent()`

**Decision Inspector:**
- Replace the hardcoded JSON display with `context.decision` — show the full real `DecisionObject`
- Copy button copies the real decision JSON

**Add "Reset to Auto-Detect" button** in the footer area:
- `onClick` → `context.clearOverrides()` — goes back to reading real URL signals

---

### 11. Modify `src/components/ReviewsSection.tsx`

**Goal:** Make the social proof bar dynamic based on intent.

**Changes:**
- Import `useTailored` context hook
- Above the stats grid (50K+, 4.9/5, etc.), add a dynamic tagline:
  ```tsx
  const socialProof = decision?.decision.social_proof;
  {socialProof && <p className="text-center text-lg font-medium mb-4">{socialProof}</p>}
  ```
- Keep the existing stats grid (50K+, 4.9/5, 10K+, 24/7) exactly as-is below the dynamic line

---

### 12. Modify hero variant components — CTA click tracking

For each of the 6 hero files, add an `onClick` to CTA buttons that tracks the event:

```tsx
const { trackEvent, decision } = useTailored();

const handleCtaClick = (ctaType: 'primary' | 'secondary') => {
  trackEvent('cta_click', {
    template: decision?.decision.template,
    intent: decision?.classification.primary_intent,
    cta_type: ctaType,
  });
};
```

**Files and their CTAs:**

| File | Primary CTA | Secondary CTA |
|------|------------|---------------|
| `HeroUrgency.tsx` | "Buy Now — Free Next-Day Delivery" | — |
| `HeroComparison.tsx` | "Compare All 5" | "Read Full Reviews" |
| `HeroLifestyle.tsx` | "Shop Gaming Setups" | — |
| `HeroValue.tsx` | "Shop Best Value" | "See All Deals Under $500" |
| `HeroGuide.tsx` | "Take the Quiz" | — |
| `HeroGift.tsx` | "Shop Gift Guide" | "Add Gift Wrapping — Free" |

No UI changes — just add onClick handlers.

---

### 13. Modify `src/pages/TailoredPulse.tsx`

**Goal:** Replace hardcoded mock data with real data from localStorage tracker.

**Changes:**
- Import `getAnalytics`, `seedDemoData` from tracker
- On mount: call `seedDemoData()` (no-op if events already exist)
- Replace all top-level data arrays with computed values:
  - `intentData` ← `analytics.intentDistribution`
  - `confidenceData` ← `analytics.confidenceDistribution`
  - `variantData` ← `analytics.variantPerformance`
  - `heatmapData` ← `analytics.heatmapData`
  - `recentDecisions` ← `analytics.recentDecisions`
  - `sparklineData` ← `analytics.sparklineData`
  - Stats card values ← `analytics.totalVisitors`, `analytics.personalizedPct`, `analytics.avgConfidence`, `analytics.fallbackRate`
- Wire time range selector: when `timeRange` changes, re-call `getAnalytics(timeRange)`
- Add refresh: `useEffect` with `setInterval(5000)` to re-read localStorage for live updates
- Keep all existing chart components, StatsCard, HeatmapCell, and layout unchanged

---

## File Summary

### New files (7):

| # | File | Purpose |
|---|------|---------|
| 1 | `src/tailored/types.ts` | Shared type definitions |
| 2 | `src/tailored/config.ts` | Static lookup tables (template, section order, social proof, colors) |
| 3 | `src/tailored/signals.ts` | Signal parser (UTM, referrer, device, time) |
| 4 | `src/tailored/classifier.ts` | Weighted intent scoring engine |
| 5 | `src/tailored/engine.ts` | TailoredCore orchestrator |
| 6 | `src/tailored/tracker.ts` | Event tracking, localStorage, analytics computation, demo seeding |
| 7 | `src/contexts/TailoredContext.tsx` | React context provider for shared personalization state |

### Modified files (11):

| # | File | Change Summary |
|---|------|---------------|
| 8 | `src/App.tsx` | Wrap with `<TailoredProvider>` |
| 9 | `src/pages/Index.tsx` | Dynamic hero selection + section reordering |
| 10 | `src/components/TailoredLens.tsx` | Wire to real engine via context |
| 11 | `src/components/ReviewsSection.tsx` | Dynamic social proof copy |
| 12 | `src/components/heroes/HeroUrgency.tsx` | CTA click tracking |
| 13 | `src/components/heroes/HeroComparison.tsx` | CTA click tracking |
| 14 | `src/components/heroes/HeroLifestyle.tsx` | CTA click tracking |
| 15 | `src/components/heroes/HeroValue.tsx` | CTA click tracking |
| 16 | `src/components/heroes/HeroGuide.tsx` | CTA click tracking |
| 17 | `src/components/heroes/HeroGift.tsx` | CTA click tracking |
| 18 | `src/pages/TailoredPulse.tsx` | Real analytics data from localStorage |

---

## Build Order

```
Phase 1 — Core Engine (no UI changes, pure logic):
  1. types.ts
  2. config.ts
  3. signals.ts
  4. classifier.ts
  5. engine.ts
  6. tracker.ts

Phase 2 — Context (bridge between engine and UI):
  7. TailoredContext.tsx

Phase 3 — Connect UI (each step is independently testable):
  8.  App.tsx (wrap provider)
  9.  Index.tsx (hero swap + section reorder) ← first visible result
  10. TailoredLens.tsx (debug panel wiring) ← "wow moment"
  11. ReviewsSection.tsx (social proof)
  12. Hero CTAs (click tracking) — 6 files
  13. TailoredPulse.tsx (analytics dashboard) ← final piece
```

---

## Verification Checklist

| # | Test | Expected Result |
|---|------|----------------|
| 1 | Visit `localhost:8080/` (no params) | HeroGuide renders (RESEARCH fallback), sections: guides → deals → reviews |
| 2 | Visit `?utm_term=buy+gaming+laptop+now` | HeroUrgency renders, sections: deals → reviews → guides, "47 people bought..." social proof |
| 3 | Visit `?utm_term=best+monitor+2026+vs` | HeroComparison renders, sections: guides → reviews → deals |
| 4 | Visit `?utm_term=cheap+headphones+deal` | HeroValue renders, sections: deals → reviews → guides |
| 5 | Visit `?utm_term=gift+for+her` | HeroGift renders, sections: deals → guides → reviews |
| 6 | Visit `?utm_term=gaming+laptop+student` | HeroLifestyle renders, sections: deals → guides → reviews |
| 7 | Open TailoredLens → click BUY_NOW | Hero swaps to HeroUrgency with fade transition |
| 8 | Open TailoredLens → click each intent | Hero and sections update for each intent |
| 9 | TailoredLens → type UTM + click Detect | Engine re-runs with override signals, correct hero shown |
| 10 | TailoredLens → Decision Inspector | Shows real DecisionObject JSON with confidence + reasoning |
| 11 | TailoredLens → Reset to Auto | Returns to real URL-based detection |
| 12 | Click hero CTA button | Event tracked (check localStorage) |
| 13 | Visit `/pulse` | Dashboard shows real data from localStorage |
| 14 | Pulse time range selector | Charts update when switching Today/7 Days/30 Days |
| 15 | `npm run build` | No TypeScript errors |
