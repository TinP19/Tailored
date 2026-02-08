# Tailored — Project Context & Understanding

## What Is Tailored?

Tailored is an AI-powered personalization engine for the **Hack-Nation Global AI Hackathon 2026** (Plug-and-Play Dynamic Website Track). It classifies every visitor into one of 6 intent archetypes and reshapes the entire above-the-fold experience — hero layout, section ordering, social proof copy, and CTA strategy — all in real-time with full explainability.

**Tagline:** _"Every visitor gets the store that was built for them."_

**Demo domain:** TechHaven — a Best Buy-style tech retailer.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.8.3 |
| Build | Vite | 5.4.19 |
| Styling | Tailwind CSS | 3.4.17 |
| Components | shadcn/ui (Radix UI) | 48+ components |
| Icons | Lucide React | 0.462.0 |
| Charts | Recharts | 2.15.4 |
| Routing | React Router DOM | 6.30.1 |
| Data fetching | TanStack React Query | 5.83.0 (installed, unused) |
| Testing | Vitest + jsdom | 3.2.4 |

---

## File Structure

```
src/
├── App.tsx                         # Routes: / → Index, /pulse → TailoredPulse, * → NotFound
├── main.tsx                        # React entry point
├── index.css                       # Design system tokens, custom utilities, animations
├── vite-env.d.ts
│
├── pages/
│   ├── Index.tsx                   # Main landing page (all sections composed here)
│   ├── TailoredPulse.tsx           # Analytics dashboard (100% hardcoded mock data)
│   └── NotFound.tsx                # 404 page
│
├── components/
│   ├── Navbar.tsx                  # Fixed top nav, logo, search, cart (count=3 hardcoded)
│   ├── HeroSection.tsx             # Generic/default hero (currently rendered)
│   ├── CategoryNav.tsx             # Horizontal scrollable category buttons (7 categories)
│   ├── FeaturedProducts.tsx        # 22 product cards in responsive grid
│   ├── DealsSection.tsx            # 3 deal cards with countdown timers
│   ├── BuyingGuides.tsx            # 3 guide cards with cover images
│   ├── ReviewsSection.tsx          # 3 review cards + social proof stats bar
│   ├── ProductCard.tsx             # Reusable product card component
│   ├── NavLink.tsx                 # Nav link wrapper
│   ├── Footer.tsx                  # 4-column footer with newsletter
│   ├── TailoredLens.tsx            # Debug overlay panel (all local state, no real logic)
│   │
│   ├── heroes/
│   │   ├── index.ts                # Barrel export for all 6 variants
│   │   ├── HeroUrgency.tsx         # BUY_NOW — red, countdown, "Ships Today"
│   │   ├── HeroComparison.tsx      # COMPARE — blue, 3-product spec grid
│   │   ├── HeroLifestyle.tsx       # USE_CASE — purple, gaming bundle
│   │   ├── HeroValue.tsx           # BUDGET — green, pricing/deals
│   │   ├── HeroGuide.tsx           # RESEARCH — cyan, quiz/guides
│   │   └── HeroGift.tsx            # GIFTING — amber, gift tiers
│   │
│   └── ui/                         # 48+ shadcn/ui components (button, card, input, etc.)
│
├── hooks/
│   ├── useScrollAnimation.ts       # Intersection Observer → scroll-triggered animations
│   ├── useCountdown.ts             # Countdown timer (used in HeroUrgency, DealsSection)
│   ├── use-mobile.tsx              # Viewport < 768px detection
│   └── use-toast.ts               # Toast notification hook
│
├── lib/
│   └── utils.ts                    # cn() — clsx + tailwind-merge
│
└── test/
    ├── setup.ts                    # Vitest setup
    └── example.test.ts             # Placeholder test (true === true)
```

---

## Component Tree

```
App
├── QueryClientProvider (React Query — installed but unused)
├── TooltipProvider
├── Toaster + Sonner
└── BrowserRouter
    ├── Route /
    │   └── Index
    │       ├── Navbar (fixed top)
    │       ├── <main>
    │       │   ├── HeroSection (generic — currently the only one rendered)
    │       │   ├── CategoryNav
    │       │   ├── FeaturedProducts
    │       │   ├── DealsSection
    │       │   ├── BuyingGuides
    │       │   └── ReviewsSection
    │       ├── Footer
    │       └── TailoredLens (fixed bottom-right overlay)
    ├── Route /pulse
    │   └── TailoredPulse (analytics dashboard)
    └── Route *
        └── NotFound
```

---

## The 6 Hero Variants

All built, exported from `src/components/heroes/index.ts`, but **none are rendered** — only the generic `HeroSection` shows.

| Intent | Component | data-tailored | Theme Color | Key Element | CTA |
|--------|-----------|--------------|-------------|-------------|-----|
| BUY_NOW | `HeroUrgency` | `hero-urgency` | Red | Countdown timer, "Limited Stock" badge, "Ships Today" | "Buy Now — Free Next-Day Delivery" |
| COMPARE | `HeroComparison` | `hero-comparison` | Blue | 3-product spec grid (ROG Strix, Dell XPS, MacBook Pro) | "Compare All 5" + "Read Full Reviews" |
| USE_CASE | `HeroLifestyle` | `hero-lifestyle` | Purple | Full-bleed gaming background, bundle card ($899) | "Shop Gaming Setups" |
| BUDGET | `HeroValue` | `hero-value` | Green | Slashed prices, "from $599", financing pill | "Shop Best Value" + "See All Deals Under $500" |
| RESEARCH | `HeroGuide` | `hero-guide` | Cyan | Category cards, editorial layout | "Take the Quiz" |
| GIFTING | `HeroGift` | `hero-gift` | Amber | 3 gift tier cards (Under $50/$150/$300+), red bow icons | "Shop Gift Guide" + "Add Gift Wrapping — Free" |

---

## Data-Tailored Attributes in the Markup

These HTML attributes are already placed in components, ready for the engine to hook into:

| Attribute | Location | File | Line |
|-----------|----------|------|------|
| `data-tailored="hero"` | Hero section container | `HeroSection.tsx` | wrapper div |
| `data-tailored="hero-urgency"` | Urgency variant | `HeroUrgency.tsx` | wrapper div |
| `data-tailored="hero-comparison"` | Comparison variant | `HeroComparison.tsx` | wrapper div |
| `data-tailored="hero-lifestyle"` | Lifestyle variant | `HeroLifestyle.tsx` | wrapper div |
| `data-tailored="hero-value"` | Value variant | `HeroValue.tsx` | wrapper div |
| `data-tailored="hero-guide"` | Guide variant | `HeroGuide.tsx` | wrapper div |
| `data-tailored="hero-gift"` | Gift variant | `HeroGift.tsx` | wrapper div |
| `data-tailored-section="deals"` | Deals section | `DealsSection.tsx` | `<section>` tag |
| `data-tailored-section="guides"` | Buying guides section | `BuyingGuides.tsx` | `<section>` tag |
| `data-tailored-section="reviews"` | Reviews section | `ReviewsSection.tsx` | `<section>` tag |
| `data-tailored="social-proof"` | Social proof stats bar | `ReviewsSection.tsx` | inner `<div>` |

---

## TailoredLens (Debug Overlay) — Current State

**File:** `src/components/TailoredLens.tsx`

**What exists (UI only):**
- Collapsed: floating pill button (bottom-right) with pulsing Target icon
- Expanded: 400px panel with 4 sections:
  1. **Intent Simulator** — 6 colored intent buttons (BUY_NOW red, COMPARE blue, USE_CASE purple, BUDGET green, RESEARCH cyan, GIFTING amber)
  2. **Signal Override** — UTM text input, referrer dropdown (google/reddit/instagram/email/direct), device toggle (desktop/mobile)
  3. **Decision Inspector** — JSON viewer with syntax highlighting, copy-to-clipboard
  4. **Footer** — version info + close button

**What's broken / not wired:**
- Intent buttons update local `activeIntent` state but **nothing on the page changes**
- Signal override inputs are captured but **never fed to any engine**
- "Detect Intent" button has `onClick={() => {/* Visual feedback only */}}`
- Decision inspector shows output from local `getDecisionForIntent()` mock function — not a real engine decision
- No connection to any context or shared state
- Escape key closes panel (works)
- Animations work (slide-in/out, fade)

**Local state:**
- `isExpanded`, `activeIntent`, `utmTerm`, `referrer`, `device`, `copied`, `isAnimating`

**Mock function `getDecisionForIntent(intent)`:**
- Returns hardcoded `{ intent, confidence, template, headline, cta, reason }` per intent
- Confidence values: BUY_NOW=0.92, COMPARE=0.87, all others=0.78
- This will be replaced by the real engine

---

## TailoredPulse (Analytics Dashboard) — Current State

**File:** `src/pages/TailoredPulse.tsx`

**What exists (UI only):**
- Header with "Tailored Pulse" branding, time range selector (Today/7 Days/30 Days), "TechHaven — Live" status
- 4 stats cards: Total Visitors (2,847), Personalized (94.2%), Avg Confidence (0.82 w/ sparkline), Fallback Rate (5.8%)
- Pie chart: Intent Distribution (6 slices)
- Area chart: Confidence Distribution (0.0-1.0 histogram)
- Horizontal bar chart: Variant Performance (CTR by hero template)
- Heatmap: Intent × CTA (Primary/Secondary/No Click rates per intent)
- Table: Recent Decisions (10 rows — time, intent badge, confidence bar, template, CTA clicked, referrer)

**What's broken / not wired:**
- ALL data is hardcoded arrays at the top of the file (`intentData`, `confidenceData`, `variantData`, `heatmapData`, `recentDecisions`, `sparklineData`)
- Time range selector updates `timeRange` state but **doesn't filter anything**
- No connection to any real event tracking or localStorage
- Charts render correctly with the mock data — they just need real data sources

**Shared constants:**
- `INTENT_COLORS` object maps intent names to hex colors (matches TailoredLens colors)
- `StatsCard` component accepts: `title, value, trend, trendUp, invertTrend, sparkline, icon`
- `HeatmapCell` component accepts: `{ value: number }` (0-1 scale)

---

## What Logic Currently Exists

| Feature | Status |
|---------|--------|
| Countdown timers | Working (useCountdown hook) |
| Scroll animations | Working (useScrollAnimation + Intersection Observer) |
| Mobile detection | Working (useIsMobile hook) |
| Navigation/routing | Working (React Router: /, /pulse, 404) |
| Toast notifications | Installed, not actively used |
| Product data | Hardcoded in FeaturedProducts (22 products) |
| Deal data | Hardcoded in DealsSection (3 deals) |
| Review data | Hardcoded in ReviewsSection (3 reviews) |
| Guide data | Hardcoded in BuyingGuides (3 guides) |
| Intent detection | **Does not exist** |
| Hero variant switching | **Does not exist** — only generic HeroSection renders |
| Section reordering | **Does not exist** — fixed order in Index.tsx |
| Social proof adaptation | **Does not exist** — hardcoded stats |
| Event tracking | **Does not exist** |
| Analytics data | **Does not exist** — all mock |
| State management | **Does not exist** — no context, no store, no shared state |
| API calls | **None** — React Query installed but unused |

---

## The Intent Taxonomy (from PRD)

| Intent | Signal Examples | Store Behavior |
|--------|----------------|----------------|
| **BUY_NOW** | UTM: `buy`, `deal`, `order`; direct URL with product name | Urgency-first: countdown, "In Stock — Ships Today", prominent Add to Cart |
| **COMPARE** | UTM: `best`, `vs`, `top`, `review`; referrer from review sites | Comparison-first: side-by-side layouts, spec highlights |
| **USE_CASE** | UTM: `gaming`, `coding`, `work`, `streaming`, `student` | Context-first: lifestyle hero, curated bundles |
| **BUDGET** | UTM: `cheap`, `under`, `deal`, `budget`, `sale` | Value-first: price-anchored hero, savings callouts, financing |
| **RESEARCH** | Google organic referrer, no UTM, general queries | Education-first: buying guides, "Not sure? Start here" |
| **GIFTING** | UTM: `gift`, `for him`, `for her`, seasonal keywords | Gift-first: curated bundles, price-range filters |

---

## The Decision Engine Pipeline (from PRD)

```
Signals (URL, referrer, device, time)
    → Signal Parser (extracts raw features)
    → Intent Classifier (weighted rules engine)
    → Template Selector (intent → template mapping)
    → Slot Filler (assets, copy, CTAs per template)
    → Decision Object (structured JSON with reasoning)
    → DOM Injector (hero swap + section reorder + social proof)
```

**Performance target:** < 50ms on page load

---

## Multi-Signal Detection (4 sources, PRD requires 2+)

1. **URL Query / UTM Parameters** — highest confidence; parsed on load
2. **Referrer Classification** — Google organic vs. social vs. email vs. direct vs. review site
3. **Device + Time Context** — mobile at 11pm = casual browsing vs. desktop at 2pm = work purchasing
4. **Demo Persona Toggle** — TailoredLens override for judges

---

## Weighted Scoring Rules (from PRD Section 3.4)

| Signal | Keywords / Patterns | Weight | Maps To |
|--------|-------------------|--------|---------|
| UTM contains `buy`, `order`, `add to cart` | exact + fuzzy | 0.45 | BUY_NOW |
| UTM contains `best`, `vs`, `top`, `compare`, `review` | exact | 0.40 | COMPARE |
| UTM contains category context (`gaming`, `work`, `studio`) | exact | 0.30 | USE_CASE |
| UTM contains `cheap`, `under $X`, `budget`, `deal` | exact + regex | 0.40 | BUDGET |
| UTM contains `gift`, `for him/her`, holiday terms | exact | 0.35 | GIFTING |
| Referrer is review site (wirecutter, rtings, reddit) | domain | 0.25 | COMPARE |
| Referrer is social (instagram, tiktok, facebook) | domain | 0.15 | USE_CASE |
| Referrer is email / direct | type | 0.10 | BUY_NOW |
| Device is mobile + time is evening | composite | 0.10 | RESEARCH |
| No strong signals detected | fallback | — | RESEARCH (safe default) |

**Scoring logic:** Scores summed per intent. Highest wins. If top score < 0.30 → fallback to RESEARCH default.

---

## Decision Object Shape (from PRD)

```json
{
  "visitor_id": "v_8f3a2c",
  "timestamp": "2026-02-07T14:32:01Z",
  "signals": {
    "utm_term": "best gaming laptop 2026",
    "referrer": "google.com/search",
    "referrer_type": "search_organic",
    "device": "desktop",
    "time_context": "afternoon_weekday"
  },
  "classification": {
    "primary_intent": "COMPARE",
    "confidence": 0.87,
    "secondary_intent": "USE_CASE",
    "reasoning": "UTM contains 'best' (comparison signal, +0.4) and 'gaming' (use-case signal, +0.3). Referrer is organic search (+0.17). High confidence in COMPARE with gaming context."
  },
  "decision": {
    "template": "hero_comparison",
    "section_order": ["guides", "reviews", "deals"],
    "social_proof": "Rated #1 by 3 major review sites"
  },
  "fallback_used": false
}
```

---

## Section Reordering Rules (from PRD Section 3.8)

| Intent | Section Order (of our 3 reorderable sections) |
|--------|-----------------------------------------------|
| BUY_NOW | deals → reviews → guides |
| COMPARE | guides → reviews → deals |
| USE_CASE | deals → guides → reviews |
| BUDGET | deals → reviews → guides |
| RESEARCH | guides → deals → reviews |
| GIFTING | deals → guides → reviews |

Fixed elements (never reorder): Navbar, Hero, CategoryNav, FeaturedProducts, Footer

---

## Contextual Social Proof Copy (from PRD Section 3.9)

| Intent | Social Proof Display |
|--------|---------------------|
| BUY_NOW | "47 people bought this in the last hour" |
| COMPARE | "Rated #1 by 3 major review sites" |
| USE_CASE | "Recommended by 8,000+ gamers" |
| BUDGET | "Save an average of $120 vs. retail" |
| RESEARCH | "Read by 25,000 shoppers this month" |
| GIFTING | "Top-rated gift — 4.8★ from 2,100 reviews" |

---

## Design System Notes

- **Dark theme** with CSS variable-based colors
- **Glass morphism:** `.glass` and `.glass-strong` utility classes
- **Custom animations:** float, pulse-glow, fade-in-up, gradient, shimmer, stock-pulse
- **Fonts:** DM Sans (sans), Crimson Pro (serif), SF Mono (mono)
- **Intent color palette** (used in both Lens and Pulse):
  - BUY_NOW: `#ef4444` (red)
  - COMPARE: `#3b82f6` (blue)
  - USE_CASE: `#a855f7` (purple)
  - BUDGET: `#22c55e` (green)
  - RESEARCH: `#06b6d4` (cyan)
  - GIFTING: `#f59e0b` (amber)

---

## Demo Flow for Judges (from PRD)

1. Visit TechHaven with no UTM → clean RESEARCH experience
2. Add `?utm_term=buy+gaming+laptop+now` → hero morphs to urgency layout
3. Change to `?utm_term=best+monitor+2026+vs` → hero becomes comparison layout
4. Change to `?utm_term=cheap+headphones+deal` → hero becomes value-first
5. Open TailoredLens → inspect decision, demonstrate confidence scores
6. Flip between all 6 intents via Lens → watch store reshape each time
7. Show TailoredPulse → analytics dashboard with real traffic data
8. Show the single script tag install concept

---

## NPM Scripts

```bash
npm run dev           # Vite dev server (port 8080)
npm run build         # Production build
npm run build:dev     # Development build
npm run lint          # ESLint
npm run preview       # Preview production build
npm run test          # Vitest (once)
npm run test:watch    # Vitest (watch mode)
```
