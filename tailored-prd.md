# Tailored — Product Requirements Document
### Hack-Nation Global AI Hackathon 2026 | Plug-and-Play Dynamic Website Track

---

## 1. Product Vision

**Tailored** is an AI-powered personalization engine delivered as a single embeddable script tag. Any e-commerce store pastes one line of code and instantly gets intent-aware, dynamically personalized shopping experiences — no analytics team, no A/B testing platform, no enterprise budget required.

**Tagline:** _"Every visitor gets the store that was built for them."_

**Demo Domain:** A Best Buy-style tech retailer ("TechHaven") selling laptops, monitors, headphones, keyboards, smart home devices, gaming gear, phones, and accessories.

### Why "Tailored" Stands Out

Most personalization tools answer: _"What product should we recommend?"_
Tailored answers a harder question: _"What **version of the store** should this visitor experience?"_

It doesn't just swap a hero image. It reshapes the entire above-the-fold narrative — layout, imagery, copy tone, social proof, urgency signals, and CTA strategy — all driven by real-time intent classification with full explainability.

---

## 2. Core Concept: Intent-Driven Store Morphing

### 2.1 The Intent Taxonomy

Tailored classifies every visitor into one of **6 intent archetypes**:

| Intent | Signal Examples | Store Behavior |
|--------|----------------|----------------|
| **BUY_NOW** | UTM: `buy`, `deal`, `order`; direct URL with product name | Urgency-first: countdown badges, "In Stock — Ships Today", prominent Add to Cart |
| **COMPARE** | UTM: `best`, `vs`, `top`, `review`; referrer from review sites | Comparison-first: side-by-side layouts, spec highlights, "See How They Stack Up" CTA |
| **USE_CASE** | UTM: `gaming`, `coding`, `work`, `streaming`, `student` | Context-first: lifestyle hero imagery, curated bundles, "Built for [Use Case]" messaging |
| **BUDGET** | UTM: `cheap`, `under`, `deal`, `budget`, `sale` | Value-first: price-anchored hero, "Best Value" badges, savings callouts, financing options |
| **RESEARCH** | Referrer from Google organic, no UTM; general queries | Education-first: buying guides, category overviews, "Not sure? Start here" CTA |
| **GIFTING** | UTM: `gift`, `for him`, `for her`, seasonal keywords | Gift-first: curated gift bundles, price-range filters, "Gift Wrap Available" badges |

### 2.2 Multi-Signal Intent Detection

Tailored fuses **4 signal sources** (exceeding the 2+ minimum):

1. **URL Query / UTM Parameters** — highest confidence; parsed on load
2. **Referrer Classification** — Google organic vs. social vs. email vs. direct vs. review site (Wirecutter, RTINGS, Reddit)
3. **Device + Time Context** — mobile at 11pm suggests casual browsing vs. desktop at 2pm suggests work purchasing
4. **Demo Persona Toggle** — a floating debug pill lets judges simulate any intent instantly

Signals are weighted and combined into a confidence-scored intent classification. If confidence is below threshold → fallback to a safe, neutral default experience.

---

## 3. Feature Specifications

### 3.1 One-Line Install (Shopify-Ready)

**The entire system ships as a single `<script>` tag:**

```html
<script src="https://cdn.tailored.dev/widget.js" data-store="techhaven" async></script>
```

- **Zero dependencies** — vanilla JS, IIFE-bundled
- **No backend required** for the host site — all logic runs client-side or calls Tailored's lightweight API
- **Safe injection** — uses `MutationObserver` to wait for target elements; never breaks existing page structure
- **Graceful fallback** — if anything fails (network, parsing, timeout), the original page renders untouched
- **Install time target: < 60 seconds**

Optional: A simulated "Shopify App Install" flow — user clicks "Install", sees a mock OAuth screen, and the script is injected into their demo store with a satisfying confirmation animation.

### 3.2 Template Registry (6 Variants)

Each template defines a **hero section blueprint** with configurable slots:

```json
{
  "template_id": "hero_urgency",
  "layout": "split_left_image",
  "slots": {
    "hero_image": "string (asset_id)",
    "badge": "string | null",
    "headline": "string",
    "subheadline": "string",
    "cta_primary": { "label": "string", "link": "string", "style": "solid | outline" },
    "cta_secondary": { "label": "string", "link": "string" } | null,
    "social_proof": "string | null",
    "urgency_bar": "string | null"
  }
}
```

**6 Hero Templates:**

| Template | Layout | Best For | Key Element |
|----------|--------|----------|-------------|
| `hero_urgency` | Split (image left, copy right) | BUY_NOW | Countdown timer + "Ships Today" badge |
| `hero_comparison` | Three-column product cards | COMPARE | Side-by-side specs with highlight differences |
| `hero_lifestyle` | Full-bleed lifestyle image | USE_CASE | Large contextual photo (gaming den, home office, studio) |
| `hero_value` | Price-anchored center layout | BUDGET | Slashed prices, "Save $X" callouts, financing pill |
| `hero_guide` | Editorial / magazine style | RESEARCH | Category cards, "Start Here" flow, trust signals |
| `hero_gift` | Warm, curated grid | GIFTING | Gift bundles by price range, "Gift Wrap" badge, recipient selector |

### 3.3 Asset Library (30+ Assets)

**Product Categories Covered (Best Buy style):**
- Laptops (gaming, ultrabook, budget, workstation)
- Monitors (4K, ultrawide, budget, professional)
- Headphones (gaming, ANC, audiophile, budget)
- Keyboards & Mice (mechanical, ergonomic, wireless)
- Smart Home (speakers, cameras, hubs, lighting)
- Gaming (consoles, controllers, chairs, accessories)
- Phones & Tablets
- Accessories & Cables

**Hero Images (minimum 8):**
- Gaming battlestation setup (neon-lit, RGB, immersive)
- Clean home office with ultrawide monitor
- Creative studio / design workspace
- Price comparison graphic with "VS" treatment
- Gift-wrapped tech products on warm background
- Student dorm setup with laptop + accessories
- Smart home living room lifestyle shot
- Minimalist product grid on white (default/neutral)

**Badge Assets (6):**
- "Ships Today" (green)
- "Best Value" (blue)
- "Top Rated" (gold star)
- "Gift Ready" (red bow)
- "Compare & Save" (purple)
- "Staff Pick" (orange)

**All assets are pre-generated and stored statically.** The AI selects from this finite library — it never generates images at runtime.

### 3.4 The Decision Engine — "TailoredCore"

This is the brain. It runs in **< 50ms** on page load.

**Architecture:**

```
Signals (URL, referrer, device, time)
        ↓
   Signal Parser (extracts raw features)
        ↓
   Intent Classifier (weighted rules + optional LLM fallback)
        ↓
   Template Selector (intent → template mapping + product category awareness)
        ↓
   Slot Filler (selects specific assets, copy, CTAs per template)
        ↓
   Decision Object (structured JSON — fully explainable)
        ↓
   DOM Injector (safe swap with fallback)
```

**Decision Object Output (always generated):**

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
    "secondary_intent": "USE_CASE_GAMING",
    "reasoning": "UTM contains 'best' (comparison signal, +0.4) and 'gaming' (use-case signal, +0.3). Referrer is organic search (research/compare pattern, +0.17). High confidence in COMPARE with gaming context."
  },
  "decision": {
    "template": "hero_comparison",
    "hero_image": "asset_gaming_battlestation_vs",
    "badge": "Top Rated",
    "headline": "Find Your Perfect Gaming Laptop",
    "subheadline": "See how the top 2026 gaming laptops compare on performance, display, and value.",
    "cta_primary": { "label": "Compare Top 5", "link": "/compare/gaming-laptops", "style": "solid" },
    "cta_secondary": { "label": "Read Buyer's Guide", "link": "/guides/gaming-laptops" },
    "social_proof": "Trusted by 12,000+ gamers this month",
    "urgency_bar": null,
    "product_category_boost": "gaming_laptops"
  },
  "fallback_used": false
}
```

**Rules Engine Detail:**

The classifier uses a **weighted keyword + signal scoring system**:

| Signal | Keywords / Patterns | Weight | Maps To |
|--------|-------------------|--------|---------|
| UTM contains `buy`, `order`, `add to cart` | exact + fuzzy match | 0.45 | BUY_NOW |
| UTM contains `best`, `vs`, `top`, `compare`, `review` | exact match | 0.40 | COMPARE |
| UTM contains category context (`gaming`, `work`, `studio`) | exact match | 0.30 | USE_CASE |
| UTM contains `cheap`, `under $X`, `budget`, `deal` | exact + regex | 0.40 | BUDGET |
| UTM contains `gift`, `for him/her`, holiday terms | exact match | 0.35 | GIFTING |
| Referrer is review site (wirecutter, rtings, reddit) | domain match | 0.25 | COMPARE |
| Referrer is social (instagram, tiktok, facebook) | domain match | 0.15 | USE_CASE |
| Referrer is email / direct | type match | 0.10 | BUY_NOW |
| Device is mobile + time is evening | composite | 0.10 | RESEARCH |
| No strong signals detected | fallback | — | RESEARCH (safe default) |

Scores are summed per intent category. Highest score wins. If top score < 0.30 confidence threshold → default template.

**Optional LLM Escalation:** If the UTM string is complex or ambiguous (e.g., `"should I upgrade from my 2024 MacBook to gaming laptop or keep for coding"`), the decision engine can optionally call a lightweight LLM endpoint to classify — but this is the exception, not the norm. The rules engine handles 90%+ of cases instantly.

### 3.5 Personalization Injection (DOM Swap)

On page load:

1. Script loads asynchronously (non-blocking)
2. Parses signals from `window.location`, `document.referrer`, `navigator.userAgent`
3. Runs TailoredCore decision engine (< 50ms)
4. Locates target container via `data-tailored="hero"` attribute (or configurable CSS selector)
5. Renders selected template HTML into target container
6. Applies transition animation (fade-in, 200ms)
7. Logs decision object to console + Tailored debug panel

**Safety guarantees:**
- If target element not found → no-op, original page untouched
- If decision engine throws → fallback template rendered
- If script fails to load → page works normally (progressive enhancement)
- All DOM mutations happen inside a single `requestAnimationFrame` call to avoid layout thrash

### 3.6 ✨ Creative Feature: "Tailored Lens" — Store Owner Preview Mode

A **floating control panel** (only visible to authenticated store owners or in demo mode) that lets you:

- **Simulate any intent** — dropdown to pick BUY_NOW, COMPARE, USE_CASE, BUDGET, RESEARCH, GIFTING
- **Override signals** — manually set UTM, referrer, device type
- **Watch the swap live** — see the hero morph in real-time with a smooth transition
- **Inspect the decision** — expandable panel showing the full decision JSON with highlighted reasoning
- **Compare variants side-by-side** — split screen showing 2 intent variants simultaneously
- **Copy shareable preview links** — generate URLs with pre-set UTM params to share specific variants with team members

This is the **"wow moment" for the demo** — judges can play with the lens and instantly see how different visitors experience the same store.

### 3.7 ✨ Creative Feature: "Tailored Pulse" — Live Intent Analytics Dashboard

A lightweight analytics view showing:

- **Real-time intent distribution** — pie/bar chart of visitor intents (simulated with demo traffic)
- **Variant performance** — which template/CTA combination gets the most engagement
- **Intent → Click heatmap** — which CTAs are clicked by which intent segments
- **Confidence distribution** — histogram showing how confident the classifier is across visits
- **"Missed Personalization" alerts** — flags visits where confidence was too low and default was served, suggesting new rules

This transforms Tailored from a "widget" into a **personalization intelligence platform** — store owners don't just get personalization, they get *understanding* of their visitors.

### 3.8 ✨ Creative Feature: "Tailored Adapt" — Section Reordering

Beyond hero swaps, Tailored can **reorder page sections** based on intent:

| Intent | Section Order |
|--------|--------------|
| BUY_NOW | Hero → Flash Deals → Trending → Categories → Reviews |
| COMPARE | Hero → Comparison Tools → Buying Guides → Top Rated → Categories |
| USE_CASE | Hero → Curated Bundles → Use Case Spotlight → Trending → Reviews |
| BUDGET | Hero → Deals & Clearance → Price Drops → Budget Picks → Financing |
| RESEARCH | Hero → Buying Guides → Category Explorer → Trending → Reviews |
| GIFTING | Hero → Gift Bundles → Price Range Picker → Gift Cards → Trending |

Sections are tagged with `data-tailored-section="deals"` attributes. The script reorders them via DOM manipulation. Same finite content — just prioritized differently.

### 3.9 ✨ Creative Feature: "Tailored Proof" — Contextual Social Proof

Social proof messaging adapts to intent:

| Intent | Social Proof Display |
|--------|---------------------|
| BUY_NOW | "47 people bought this in the last hour" |
| COMPARE | "Rated #1 by 3 major review sites" |
| USE_CASE | "Recommended by 8,000+ gamers" |
| BUDGET | "Save an average of $120 vs. retail" |
| RESEARCH | "Read by 25,000 shoppers this month" |
| GIFTING | "Top-rated gift — 4.8★ from 2,100 reviews" |

These are pre-written copy variants (finite), selected by the decision engine, not generated.

---

## 4. Demo Store: "TechHaven"

### 4.1 Store Overview

TechHaven is a fictional Best Buy-style electronics retailer. The demo site is a single-page application with:

- **Hero section** (Tailored-powered — the main showcase)
- **Category navigation bar** (Laptops, Monitors, Audio, Gaming, Smart Home, Phones, Accessories)
- **Featured Products grid** (8-12 products across categories)
- **Deals / Value section**
- **Buying Guides section**
- **Reviews / Social Proof section**
- **Footer**

### 4.2 Product Catalog (Demo Data)

| Category | Example Products | Price Range |
|----------|-----------------|-------------|
| Laptops | MacBook Pro M4, ASUS ROG Strix, Dell XPS 15, Acer Aspire (budget) | $499 – $2,499 |
| Monitors | LG UltraGear 4K 27", Samsung Odyssey OLED, Dell UltraSharp, AOC Budget 24" | $149 – $1,299 |
| Headphones | Sony WH-1000XM6, HyperX Cloud III, AirPods Pro 3, Sennheiser HD 560S | $49 – $399 |
| Keyboards | Keychron Q1 Pro, Logitech MX Keys, Razer Huntsman V3, Corsair K70 | $69 – $249 |
| Smart Home | Echo Hub, Philips Hue Starter Kit, Ring Doorbell, Nest Thermostat | $49 – $299 |
| Gaming | PS5 Pro, Xbox Series X, Steam Deck OLED, Gaming Chair | $199 – $699 |
| Phones | iPhone 16 Pro, Samsung Galaxy S26, Pixel 10, OnePlus 13 | $599 – $1,199 |

### 4.3 Demo Flow for Judges

**Recommended demo sequence (3-4 minutes):**

1. **Show default store** — visit TechHaven with no UTM params → clean, neutral RESEARCH experience
2. **Trigger BUY_NOW** — add `?utm_term=buy+gaming+laptop+now` → watch hero morph to urgency layout with countdown
3. **Trigger COMPARE** — change to `?utm_term=best+monitor+2026+vs` → hero becomes comparison layout
4. **Trigger BUDGET** — change to `?utm_term=cheap+headphones+deal` → hero becomes value-first with savings callouts
5. **Open Tailored Lens** — show the debug panel, inspect decision objects, demonstrate confidence scores
6. **Live persona toggle** — flip between all 6 intents, watch the store reshape each time
7. **Show Tailored Pulse** — display the analytics dashboard with simulated traffic distribution
8. **Show the install** — demonstrate the single script tag, paste into a blank HTML page, show it working

---

## 5. Technical Architecture

### 5.1 System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    HOST WEBSITE                          │
│                                                         │
│  <script src="tailored.js" data-store="techhaven"/>     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Tailored Runtime                    │    │
│  │                                                  │    │
│  │  Signal Parser ──→ Intent Classifier             │    │
│  │                          ↓                       │    │
│  │                   Template Selector              │    │
│  │                          ↓                       │    │
│  │                    Slot Filler                    │    │
│  │                          ↓                       │    │
│  │                   DOM Injector                    │    │
│  │                          ↓                       │    │
│  │              Decision Logger / Debug              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
│  │   Hero   │  │ Sections │  │  Social Proof Bar   │    │
│  │ (swapped)│  │(reordered)│  │    (adapted)       │    │
│  └──────────┘  └──────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐
│       Tailored Lens (overlay)    │
│  Intent simulator + decision     │
│  inspector + variant preview     │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│       Tailored Pulse (dashboard) │
│  Intent analytics + performance  │
│  tracking + confidence histogram │
└──────────────────────────────────┘
```

### 5.2 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Widget Core | Vanilla JS (ES2020+), IIFE bundle | Zero dependencies, no host site conflicts |
| Bundler | esbuild | Fast, produces minimal bundle |
| Template Rendering | Template literals + DOM API | No framework overhead, direct DOM manipulation |
| Asset Hosting | Static CDN (Cloudflare Pages or Vercel) | Fast global delivery of images + script |
| Decision Engine | Pure JS rules engine (client-side) | < 50ms execution, no network dependency |
| LLM Fallback (optional) | Claude Sonnet API (server-side edge function) | Only for ambiguous UTM strings |
| Demo Store | React + Tailwind CSS + Vite | Fast to build, clean demo UI |
| Tailored Lens | Preact (embedded in widget, tree-shaken) | Lightweight overlay UI without bloating the widget |
| Tailored Pulse | React + Recharts | Analytics dashboard — separate from widget, for store owners |
| Event Tracking | Custom lightweight event logger (beacon API) | Minimal performance impact, tracks CTA clicks |

### 5.3 Bundle Size Target

| Component | Target Size |
|-----------|-------------|
| `tailored.js` (core widget) | < 15 KB gzipped |
| Template assets (JSON) | < 3 KB |
| Images (hero set) | Lazy-loaded, not in bundle |
| Tailored Lens (debug overlay) | < 8 KB (only loaded in debug mode) |

---

## 6. Evaluation Alignment

Mapping features to the challenge's evaluation criteria:

| Criterion | How Tailored Addresses It |
|-----------|--------------------------|
| **Plug-and-Play Install** | Single script tag, < 60 second setup, works on static HTML |
| **Templatized Variants** | 6 hero templates × 6 intent archetypes = rich but finite |
| **Asset Library** | 8+ hero images, 6 badges, all intent-mapped — never random |
| **Intent Detection (2+ signals)** | 4 signals: UTM, referrer, device/time, demo toggle |
| **Explainable Decision Engine** | Full decision JSON with per-signal reasoning + confidence scores |
| **Personalization Injection** | Safe DOM swap with fallback, requestAnimationFrame, MutationObserver |
| **No chatbot** | ✅ Zero chat UI |
| **Finite templates + assets** | ✅ All pre-defined, AI selects — never generates |
| **Safe fallback** | ✅ Default template on any failure |

### Standout Differentiators (Beyond Requirements):

| Feature | Why It Stands Out |
|---------|-------------------|
| **Tailored Lens** (preview mode) | Judges can interact live — this IS the demo |
| **Tailored Pulse** (analytics) | Elevates from widget → platform |
| **Section Reordering** | Goes beyond hero swap — entire page adapts |
| **Contextual Social Proof** | Shows depth of personalization thinking |
| **6 Intent Archetypes** (vs 4 required) | Broader coverage including GIFTING (seasonal awareness) |
| **4 Signal Sources** (vs 2 required) | Richer, more confident classification |
| **Confidence Scoring + Fallback Logic** | Shows production-readiness mindset |

---

## 7. Development Milestones (24-Hour Hackathon)

| Hour | Milestone | Deliverable |
|------|-----------|-------------|
| 0–2 | Foundation | Demo store scaffolded (React + Tailwind), product data loaded, basic layout |
| 2–4 | Decision Engine | Signal parser + rules-based intent classifier working in isolation |
| 4–6 | Template System | 6 hero templates defined in JSON, slot-filling logic, DOM injection working |
| 6–8 | Asset Library | All hero images sourced/generated, badge assets created, mapped to intents |
| 8–10 | Integration | Widget script bundled, installed on demo store, full signal → swap pipeline working |
| 10–12 | Tailored Lens | Debug overlay with intent simulator, decision inspector, live preview |
| 12–14 | Section Reordering + Social Proof | Page section reorder logic, contextual social proof variants |
| 14–16 | Tailored Pulse | Analytics dashboard with simulated traffic, intent distribution, confidence charts |
| 16–18 | Polish & Edge Cases | Fallback testing, animation tuning, mobile responsiveness, bundle optimization |
| 18–20 | Demo Preparation | Demo script rehearsed, shareable URLs prepared, Lens presets configured |
| 20–22 | Buffer | Bug fixes, final polish, screenshot/recording backup |
| 22–24 | Submission | README, demo video, live link, decision object examples documented |

---

## 8. Success Criteria

The project succeeds if a judge can:

1. **Visit TechHaven with different UTM params and see a meaningfully different store each time**
2. **Open Tailored Lens and understand exactly why each variant was chosen**
3. **Paste the script tag into a blank HTML page and see it work in under 60 seconds**
4. **Look at Tailored Pulse and understand visitor intent patterns at a glance**
5. **Walk away thinking: "Every Shopify store should have this"**

---

*Tailored — Because every visitor deserves the store that was built for them.*
