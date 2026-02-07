# Product Requirements Document
## Plug-and-Play Dynamic Website — AI Personalization Engine
### Hack-Nation 2026 | VC Track | 24-Hour Build

---

## 1. Product Overview

**Product Name:** IntentSwap (working title)

**One-liner:** A single `<script>` tag that makes any website dynamically personalize its hero experience based on visitor intent — no backend, no login, no setup beyond paste.

**What it is:** A lightweight, embeddable JavaScript widget that detects why a visitor arrived (buy, compare, research, budget-hunt), selects the optimal combination of hero image + headline + CTA from a finite template/asset registry, injects it into the DOM before the user perceives a flash, and exposes a debug panel explaining *why* this variant was chosen.

**What it is NOT:**
- Not a chatbot or conversational UI
- Not a full-page generator (no generative AI creating new layouts)
- Not a recommendation engine for products
- Not an analytics platform (though it logs decisions)

**Core Insight:** Personalization today is a $10B+ enterprise tool problem. SMBs running Shopify, Webflow, or static sites have zero access to it. If you can reduce the integration cost to a single line of HTML, personalization becomes a default growth lever — not a luxury.

---

## 2. Problem Statement

Every visitor to an SMB website sees the same static hero section regardless of whether they arrived from:
- A Google search for "buy 27 inch 4k monitor" (high purchase intent)
- A comparison blog linking "best monitors 2026" (research intent)
- A Reddit thread about "cheap 144hz monitors" (budget intent)
- An Instagram ad for a gaming setup (use-case intent)

Enterprise companies solve this with tools like Optimizely, Dynamic Yield, or Mutiny — costing $30K–$200K/year with dedicated teams. SMBs get nothing.

**The gap:** There is no personalization tool that is simultaneously:
1. Installable in under 5 minutes via copy-paste
2. Requires zero backend infrastructure from the site owner
3. Uses AI to make intelligent variant decisions (not random A/B)
4. Is safe — always falls back to default content on failure
5. Is explainable — site owners can see *why* each variant was chosen

---

## 3. Target Users

### Primary: Site Owner (installs the widget)
- SMB owner or solo marketer running a Shopify/Webflow/custom store
- Non-technical — cannot write JavaScript beyond pasting a snippet
- Cares about: conversion rate, ease of setup, not breaking their site
- Pain: knows personalization matters, can't afford enterprise tools

### Secondary: Site Visitor (experiences the personalization)
- Arrives with a specific intent encoded in their referral context
- Expects the page to feel relevant to what they're looking for
- Should never notice the personalization machinery — it just feels "right"

### Tertiary: Demo Judge (evaluates our hackathon submission)
- Wants to see: clear before/after, explainable decisions, technical depth
- Cares about: does the mechanism generalize beyond the demo domain?

---

## 4. Demo Domain & Scenario

**Domain:** E-commerce — "MonitorHub" (fictional monitors store)

**Why monitors:** High variance in visitor intent, visual product category, easy to source distinct hero imagery, clear CTA differentiation.

### Intent Taxonomy (4 primary intents)

| Intent ID | Label | Signal Examples | Visitor Mindset |
|-----------|-------|-----------------|-----------------|
| `BUY_NOW` | Purchase-Ready | UTM: `buy`, `order`, `deal`; referrer: Google Shopping; query: "buy 27 inch 4k monitor" | Ready to add-to-cart. Wants price, shipping, and a direct CTA. |
| `COMPARE` | Research/Compare | UTM: `best`, `vs`, `comparison`, `review`; referrer: blog/review site | Evaluating options. Wants side-by-side, specs, trust signals. |
| `USE_CASE` | Use-Case Driven | UTM: `gaming`, `coding`, `design`, `office`; referrer: Reddit, forums | Knows their need, not the product. Wants tailored recommendations. |
| `BUDGET` | Price-Sensitive | UTM: `cheap`, `affordable`, `under 300`, `budget`; referrer: deal sites | Wants lowest price, discounts, value messaging. |

**Fallback:** `GENERAL` — default hero shown when no intent is detected with sufficient confidence.

---

## 5. Core Requirements (MVP — Must Ship)

### 5.1 Single-Script Installation

**Requirement:** The entire widget ships as one `<script>` tag.

```html
<script src="https://cdn.intentswap.io/widget.js" data-site-id="monitorhub-001"></script>
```

**Specifications:**
- Bundle size target: < 50KB gzipped (no framework dependencies)
- Built as a self-executing IIFE using esbuild or Rollup
- Zero external dependencies at runtime (no React, no jQuery)
- The `data-site-id` attribute loads the correct template/asset configuration
- Script executes on `DOMContentLoaded` to avoid render-blocking
- If the script fails for ANY reason, the original page content remains untouched

**Acceptance Criteria:**
- [ ] Widget loads on a plain HTML page with only the script tag added
- [ ] Page content is never blank — default shows if widget fails
- [ ] No console errors on pages without the expected DOM targets
- [ ] Works in Chrome, Firefox, Safari (latest versions)

---

### 5.2 Template Registry

**Requirement:** A JSON-defined registry of 3+ hero templates, each with swappable content slots.

**Template Schema:**

```json
{
  "templates": {
    "hero_impact": {
      "id": "hero_impact",
      "description": "Bold single-image hero with large headline, ideal for high-intent visitors",
      "slots": ["hero_image", "headline", "subheadline", "cta_text", "cta_link", "badge"]
    },
    "hero_comparison": {
      "id": "hero_comparison",
      "description": "Split-view hero with two product images, comparison-oriented",
      "slots": ["hero_image_left", "hero_image_right", "headline", "subheadline", "cta_text", "cta_link"]
    },
    "hero_lifestyle": {
      "id": "hero_lifestyle",
      "description": "Full-bleed lifestyle image with overlay text, use-case driven",
      "slots": ["hero_image", "headline", "subheadline", "cta_text", "cta_link", "use_case_tag"]
    }
  }
}
```

**Specifications:**
- Templates define layout structure + which slots exist
- Templates do NOT contain content — content comes from the decision engine
- Each template maps to a CSS class that controls layout (injected by the widget)
- The widget injects scoped CSS (prefixed or shadow DOM) to avoid conflicts with host site styles

**Acceptance Criteria:**
- [ ] 3 visually distinct hero layouts are implemented
- [ ] Each template renders correctly with any valid content combination
- [ ] Templates degrade gracefully if optional slots are empty

---

### 5.3 Asset Library

**Requirement:** A curated set of 6+ images and content variants, organized by intent.

**Asset Inventory:**

| Asset ID | File | Intent Affinity | Description |
|----------|------|-----------------|-------------|
| `img_gaming_setup` | gaming-hero.jpg | USE_CASE (gaming) | RGB-lit gaming desk with ultrawide monitor |
| `img_office_clean` | office-hero.jpg | USE_CASE (work) | Minimalist office with dual monitor setup |
| `img_design_studio` | design-hero.jpg | USE_CASE (design) | Creative workspace with color-accurate display |
| `img_deal_banner` | deal-hero.jpg | BUDGET | Bold price tag / discount visual |
| `img_comparison_split` | compare-hero.jpg | COMPARE | Side-by-side monitor comparison |
| `img_premium_product` | product-hero.jpg | BUY_NOW | Clean product shot with specs overlay |

**Content Variants (per intent):**

```json
{
  "BUY_NOW": {
    "headline": "Your Perfect Monitor, Ready to Ship",
    "subheadline": "Free 2-day delivery on all 4K displays",
    "cta_text": "Shop Now →",
    "cta_link": "/shop/monitors",
    "badge": "Free Shipping"
  },
  "COMPARE": {
    "headline": "Find the Right Monitor for You",
    "subheadline": "Side-by-side specs, real reviews, expert picks",
    "cta_text": "Compare Models",
    "cta_link": "/compare",
    "badge": "Expert Rated"
  },
  "USE_CASE": {
    "headline": "Built for How You Work",
    "subheadline": "Whether you game, code, or design — we've got your screen",
    "cta_text": "See Recommendations",
    "cta_link": "/collections",
    "use_case_tag": "{{detected_use_case}}"
  },
  "BUDGET": {
    "headline": "Great Monitors Don't Have to Cost a Fortune",
    "subheadline": "Top-rated displays under $300",
    "cta_text": "See Deals",
    "cta_link": "/deals",
    "badge": "Best Value"
  }
}
```

**Acceptance Criteria:**
- [ ] 6+ distinct images are bundled/hosted and load reliably
- [ ] Images are optimized (WebP, lazy-loaded where possible)
- [ ] AI selects images based on detected intent, never randomly
- [ ] Content variants are complete for all 4 intents + 1 fallback

---

### 5.4 Intent Detection Engine

**Requirement:** Detect visitor intent from 2+ context signals before or immediately on page load.

**Signal Sources (in priority order):**

| # | Signal | Method | Latency | Reliability |
|---|--------|--------|---------|-------------|
| 1 | URL query params / UTM tags | `URLSearchParams` parsing | 0ms | High — explicit signal |
| 2 | `document.referrer` | Referrer string matching | 0ms | Medium — often stripped |
| 3 | On-page behavior | Scroll depth, click target in first 3s | 3000ms | Low — requires delay |
| 4 | Demo persona toggle | Manual UI toggle | 0ms | Demo-only |

**Intent Detection Logic:**

```
FUNCTION detectIntent(signals):
    score = { BUY_NOW: 0, COMPARE: 0, USE_CASE: 0, BUDGET: 0 }
    
    // Signal 1: URL/UTM keywords
    FOR keyword IN url_params:
        IF keyword IN buy_keywords → score.BUY_NOW += 3
        IF keyword IN compare_keywords → score.COMPARE += 3
        IF keyword IN usecase_keywords → score.USE_CASE += 3
        IF keyword IN budget_keywords → score.BUDGET += 3
    
    // Signal 2: Referrer classification
    referrer_type = classifyReferrer(document.referrer)
    IF referrer_type == "shopping" → score.BUY_NOW += 2
    IF referrer_type == "review_blog" → score.COMPARE += 2
    IF referrer_type == "social_forum" → score.USE_CASE += 2
    IF referrer_type == "deal_site" → score.BUDGET += 2
    
    // Signal 3: Persona override (demo only)
    IF persona_toggle_active → RETURN persona_toggle_value
    
    // Resolve
    top_intent = max(score)
    IF top_intent.value < CONFIDENCE_THRESHOLD → RETURN "GENERAL"
    RETURN top_intent.key
```

**Keyword Dictionaries:**

```json
{
  "buy_keywords": ["buy", "order", "purchase", "add to cart", "deal", "shop", "get"],
  "compare_keywords": ["best", "vs", "comparison", "review", "top", "rated", "which"],
  "usecase_keywords": ["gaming", "coding", "design", "office", "work", "creative", "programming"],
  "budget_keywords": ["cheap", "affordable", "under", "budget", "value", "sale", "discount"]
}
```

**Referrer Classification Map:**

```json
{
  "shopping": ["google.com/shopping", "amazon.com", "shopify.com"],
  "review_blog": ["rtings.com", "tomsguide.com", "wirecutter.com", "techradar.com"],
  "social_forum": ["reddit.com", "twitter.com", "instagram.com", "tiktok.com"],
  "deal_site": ["slickdeals.net", "honey.com", "camelcamelcamel.com"]
}
```

**Confidence Threshold:** Score must be ≥ 3 to trigger a non-default variant. This prevents weak signals from causing inappropriate personalization.

**Acceptance Criteria:**
- [ ] Intent is detected from URL params alone (signal 1)
- [ ] Intent is detected from referrer alone (signal 2)
- [ ] Combined signals produce higher confidence scores
- [ ] Below-threshold signals fall back to GENERAL
- [ ] Demo persona toggle overrides all signals

---

### 5.5 Decision Engine (Explainable)

**Requirement:** Given a detected intent, select the optimal template + content + image combination, and output a structured, human-readable decision object.

**Decision Flow:**

```
INPUT: detected_intent, confidence_score, raw_signals
    ↓
STEP 1: Select template
    BUY_NOW     → hero_impact
    COMPARE     → hero_comparison
    USE_CASE    → hero_lifestyle
    BUDGET      → hero_impact
    GENERAL     → hero_impact (default)
    ↓
STEP 2: Select content variant
    Load content from asset registry by intent ID
    ↓
STEP 3: Select hero image(s)
    Map intent → primary image
    If USE_CASE: sub-select by detected use-case keyword (gaming/coding/design)
    ↓
STEP 4: Compose decision object
```

**Decision Object Schema (output):**

```json
{
  "timestamp": "2026-02-07T14:23:01Z",
  "intent": "USE_CASE",
  "sub_intent": "gaming",
  "confidence": 5,
  "template": "hero_lifestyle",
  "hero_image": "img_gaming_setup",
  "headline": "Built for How You Work",
  "subheadline": "Whether you game, code, or design — we've got your screen",
  "cta_text": "See Recommendations",
  "cta_link": "/collections/gaming",
  "badge": null,
  "use_case_tag": "Gaming",
  "signals_used": [
    { "source": "utm_content", "value": "gaming-setup", "contributed_to": "USE_CASE", "weight": 3 },
    { "source": "referrer", "value": "reddit.com", "contributed_to": "USE_CASE", "weight": 2 }
  ],
  "reason": "URL contains 'gaming' (UTM) + referrer is social/forum → USE_CASE:gaming with confidence 5/6."
}
```

**Acceptance Criteria:**
- [ ] Every page load produces a decision object
- [ ] Decision object includes all signals that contributed to the decision
- [ ] Human-readable `reason` string is generated for every decision
- [ ] Decision is deterministic — same inputs always produce same outputs

---

### 5.6 DOM Injection (Personalization Layer)

**Requirement:** On page load, the widget identifies the hero section, swaps its contents according to the decision, and renders the selected template.

**Injection Strategy:**

```
1. Widget script loads on DOMContentLoaded
2. Locate hero target: document.querySelector('[data-intentswap="hero"]')
      ↳ Fallback: querySelector('.hero, #hero, [class*="hero"]')
      ↳ Fallback: first <section> or <header> element
      ↳ Final fallback: do nothing (show original content)
3. Read current hero content → store as rollback snapshot
4. Run intent detection → get decision object
5. Build new hero HTML from selected template + content
6. Inject scoped CSS (prefixed classes to avoid host style collisions)
7. Replace hero innerHTML with new content
8. Preload hero image → swap only after loaded (prevent flash)
9. Log decision object to console + internal event buffer
10. If ANY step fails → restore rollback snapshot → log error
```

**DOM Targeting Convention:**

Site owners mark their hero section with a data attribute:
```html
<section data-intentswap="hero">
  <!-- Original hero content (shown as default) -->
</section>
```

If no data attribute exists, the widget attempts auto-detection with graceful fallback.

**Style Isolation:**
- All injected CSS classes are prefixed: `.isw-hero-impact`, `.isw-headline`, etc.
- Consider using a shadow DOM root for full isolation (stretch goal)

**Performance Budget:**
- Time from DOMContentLoaded to hero swap: < 200ms (excluding image load)
- Hero image must be preloaded — no visible flash of default → personalized
- If image takes > 1s to load, show content with a placeholder/blur-up

**Acceptance Criteria:**
- [ ] Hero content swaps visually within 200ms of page load
- [ ] No flash-of-unstyled or flash-of-default content visible to user
- [ ] Original content is restored if widget errors
- [ ] Widget CSS does not leak into or conflict with host page styles
- [ ] Console logs the full decision object on every page load

---

### 5.7 Debug Panel (Explainability UI)

**Requirement:** A toggleable overlay that shows site owners exactly what the widget decided and why.

**Activation:** 
- URL param: `?intentswap_debug=true`
- Keyboard shortcut: `Ctrl + Shift + I` (when widget is loaded)
- Floating button in bottom-right corner (only in debug mode)

**Debug Panel Contents:**

```
┌──────────────────────────────────────────────┐
│  🔍 IntentSwap Debug Panel                   │
│──────────────────────────────────────────────│
│  Detected Intent:  USE_CASE (gaming)         │
│  Confidence:       5 / 6   ██████████░░      │
│                                              │
│  Signals:                                    │
│   • utm_content = "gaming-setup"  → +3       │
│   • referrer = "reddit.com"       → +2       │
│                                              │
│  Decision:                                   │
│   Template:   hero_lifestyle                 │
│   Image:      img_gaming_setup               │
│   Headline:   "Built for How You Work"       │
│   CTA:        "See Recommendations"          │
│                                              │
│  Reason:                                     │
│  "URL contains 'gaming' (UTM) + referrer     │
│   is social/forum → USE_CASE:gaming"         │
│                                              │
│  [Simulate: BUY_NOW] [COMPARE] [BUDGET]      │
│──────────────────────────────────────────────│
│  Decision JSON  |  Copy  |  Close            │
└──────────────────────────────────────────────┘
```

**Key Features:**
- Simulate buttons let the site owner preview every intent variant without changing URL
- Copy button exports the full decision JSON to clipboard
- Panel is always rendered inside the widget's scoped DOM (shadow DOM if possible)

**Acceptance Criteria:**
- [ ] Debug panel activates via URL param and keyboard shortcut
- [ ] Shows all signals, scores, and the final decision with reasoning
- [ ] Simulate buttons swap the hero live without page reload
- [ ] Panel is visually contained and does not disrupt page layout
- [ ] Panel is completely hidden in production (no debug param)

---

## 6. Technical Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│  VISITOR'S BROWSER                                       │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │  Host Page    │    │  IntentSwap  │    │  Debug     │ │
│  │  (any site)   │◄──▶│  Widget.js   │───▶│  Panel     │ │
│  │              │    │  (IIFE)      │    │  (overlay) │ │
│  └──────┬───────┘    └──────┬───────┘    └────────────┘ │
│         │                   │                            │
│         │            ┌──────┴───────┐                    │
│         │            │  Bundled     │                    │
│         │            │  Modules:    │                    │
│         │            │              │                    │
│         │            │  ┌─────────┐ │                    │
│         │            │  │ Signal  │ │                    │
│         │◄───────────│  │ Detector│ │                    │
│  (reads URL,         │  └────┬────┘ │                    │
│   referrer,          │       ▼      │                    │
│   DOM)               │  ┌─────────┐ │                    │
│                      │  │ Decision│ │                    │
│                      │  │ Engine  │ │                    │
│                      │  └────┬────┘ │                    │
│                      │       ▼      │                    │
│                      │  ┌─────────┐ │                    │
│                      │  │ Template│ │                    │
│                      │  │ Renderer│ │                    │
│                      │  └────┬────┘ │                    │
│                      │       ▼      │                    │
│                      │  ┌─────────┐ │                    │
│                      │  │ DOM     │ │                    │
│                      │  │ Injector│ │                    │
│                      │  └─────────┘ │                    │
│                      └──────────────┘                    │
│                                                          │
│  Everything runs client-side. Zero backend required.     │
└─────────────────────────────────────────────────────────┘
```

### Build & Bundle

| Concern | Decision | Rationale |
|---------|----------|-----------|
| Language | TypeScript | Type safety for template schemas, catches slot mismatches at build time |
| Bundler | esbuild | Fastest bundler, produces clean IIFE, < 1s builds during hackathon iteration |
| Output | Single `widget.js` IIFE | No module loading, no async chunks — one file, one request |
| Styling | CSS-in-JS (injected `<style>` tag with prefixed classes) | Avoids external CSS file; scoped to prevent host collisions |
| Hosting | GitHub Pages or Cloudflare Pages (for the demo site + widget CDN) | Free, fast, HTTPS, no infra setup |
| Images | Hosted on same CDN, referenced by URL in asset registry | Preloaded by widget before swap |

### File Structure

```
/intentswap
  /src
    /signals
      url-parser.ts          # Parse UTM, query params
      referrer-classifier.ts # Classify referrer into categories
      behavior-tracker.ts    # Optional: scroll/click signals
    /engine
      intent-scorer.ts       # Score intents from signals
      decision-maker.ts      # Map intent → template + content
      keywords.json          # Keyword dictionaries
      referrers.json         # Referrer classification map
    /templates
      registry.json          # Template definitions
      assets.json            # Content variants per intent
      renderer.ts            # Build HTML from template + slots
    /injection
      dom-injector.ts        # Find target, swap, rollback
      style-injector.ts      # Inject scoped CSS
      image-preloader.ts     # Preload hero images
    /debug
      debug-panel.ts         # Overlay UI
      simulator.ts           # Intent simulation buttons
    widget.ts                # Entry point — orchestrates all modules
  /demo
    index.html               # MonitorHub demo store page
    styles.css               # Demo site styles
  /assets
    /images                  # 6+ hero images
  esbuild.config.js          # Build config → outputs widget.js
  package.json
```

---

## 7. User Flows

### Flow 1: Site Owner Installation (< 5 minutes)

```
1. Site owner visits IntentSwap setup page
2. Copies the <script> tag
3. Pastes it into their site's <head> or before </body>
4. Adds data-intentswap="hero" to their hero section
5. Deploys → personalization is live
```

### Flow 2: Visitor Experience (< 200ms)

```
1. Visitor clicks Google result for "best 4k gaming monitor"
2. Browser loads MonitorHub homepage
3. DOMContentLoaded fires → widget.js executes
4. Signal detector reads: utm_content="gaming", referrer="google.com"
5. Intent scorer: USE_CASE:gaming (confidence: 5)
6. Decision engine selects: hero_lifestyle + img_gaming_setup + "Built for How You Work"
7. Image preloader fetches gaming-hero.jpg
8. DOM injector swaps hero section
9. Visitor sees gaming-focused hero with "See Recommendations" CTA
10. Decision object logged to console
Total time: ~150ms (before image) / ~400ms (with image)
```

### Flow 3: Debug / Preview Mode

```
1. Site owner adds ?intentswap_debug=true to their URL
2. Debug panel appears as floating overlay
3. Panel shows: detected intent, signals, scores, decision, reason
4. Owner clicks [Simulate: COMPARE]
5. Hero swaps live to comparison variant
6. Owner clicks [Simulate: BUDGET]
7. Hero swaps to budget variant
8. Owner copies decision JSON for documentation
```

---

## 8. Demo Script (for Hackathon Pitch)

**Duration:** 3 minutes

| Time | Action | What Judges See |
|------|--------|-----------------|
| 0:00 | Show the MonitorHub demo site — static, default hero | "This is what every visitor sees today — the same page." |
| 0:20 | Show the single `<script>` tag in the HTML source | "One line of code. That's the entire install." |
| 0:40 | Load page with `?utm_content=buy+4k+monitor` | Hero swaps to BUY_NOW variant — product shot, "Shop Now" CTA |
| 1:00 | Load page with `?utm_content=best+monitor+comparison` | Hero swaps to COMPARE variant — split view, "Compare Models" CTA |
| 1:20 | Load page with `?utm_content=gaming+setup&ref=reddit` | Hero swaps to USE_CASE:gaming — lifestyle image, "See Recommendations" |
| 1:40 | Load page with `?utm_content=cheap+144hz` | Hero swaps to BUDGET variant — deal banner, "See Deals" CTA |
| 2:00 | Open debug panel — show decision object + reasoning | "The site owner can see exactly why each variant was chosen." |
| 2:20 | Click simulate buttons in debug panel | "Preview any variant without changing the URL." |
| 2:40 | Kill the CDN / break the script intentionally | "If the widget fails, the original page is untouched. Safe by default." |
| 3:00 | Close with market sizing | "There are 4M+ Shopify stores. Zero have plug-and-play AI personalization." |

---

## 9. Evaluation Alignment

Mapping our features to the challenge's stated criteria:

| Challenge Criterion | Our Implementation |
|---------------------|--------------------|
| Plug-and-Play Install (Shopify-ready) | Single `<script>` tag, `data-intentswap` attribute, < 5 min setup |
| Templatized Variants (finite inventory) | 3 hero templates with typed slot schemas in JSON registry |
| Asset Library (pictures mandatory) | 6+ curated images, intent-mapped, preloaded |
| Intent Detection (2+ signals) | URL/UTM parsing + referrer classification + demo persona toggle |
| Decision Engine (explainable) | Weighted scoring → structured decision object with `reason` field |
| Personalization Injection | DOM swap with rollback, scoped CSS, image preloading, < 200ms |
| Safe fallback | Rollback snapshot on any error, confidence threshold for activation |

---

## 10. Stretch Goals (if time permits)

**Priority order based on demo impact:**

| Priority | Feature | Effort | Demo Impact |
|----------|---------|--------|-------------|
| S1 | **Preview Mode** — simulate all intents from debug panel | 1hr | Very High — judges love interactive demos |
| S2 | **Event Tracking** — log CTA clicks, show in debug panel | 1hr | Medium — shows analytics thinking |
| S3 | **Multi-page support** — personalize product page hero too | 2hr | Medium — shows generalizability |
| S4 | **A/B mode** — randomly assign 50/50 and track which converts | 2hr | Medium — shows growth/experimentation thinking |
| S5 | **LLM decision engine** — use Claude API for fuzzy intent matching | 2hr | High — but adds latency + API dependency |

---

## 11. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Widget CSS breaks host site | Medium | High | Prefix all classes with `.isw-`; test on 3+ different page structures |
| Hero image loads slowly → flash of default | High | Medium | Preload image; use blur-up placeholder; swap only after loaded |
| Intent detection is wrong | Medium | Medium | Conservative confidence threshold (≥3); GENERAL fallback is always acceptable |
| Script tag blocked by CSP | Low | High | Document CSP requirements; for demo, we control the host page |
| Judges can't tell what changed | Medium | High | Debug panel makes the before/after explicit; demo script rehearsed |
| Scope creep during 24hr build | High | High | Strict MVP cutoff at features 5.1–5.7; stretch goals only after MVP is demo-ready |

---

## 12. Task Breakdown & Time Budget (24 Hours)

| Phase | Hours | Tasks |
|-------|-------|-------|
| **Setup** | 1h | Repo, esbuild config, demo HTML page, deploy pipeline |
| **Templates + Assets** | 2h | Design 3 hero templates in HTML/CSS, source/create 6 images, write content variants |
| **Signal Detection** | 2h | URL parser, referrer classifier, keyword dictionaries, persona toggle |
| **Decision Engine** | 2h | Intent scorer, template selector, decision object builder, reason generator |
| **DOM Injection** | 3h | Target detection, rollback system, style injection, image preloading, swap logic |
| **Debug Panel** | 2h | Overlay UI, signal display, simulate buttons, copy-to-clipboard |
| **Integration & Testing** | 3h | Wire all modules together, test all 4 intents + fallback, cross-browser check |
| **Demo Site Polish** | 2h | MonitorHub page design, realistic product content, mobile responsiveness |
| **Stretch Goals** | 3h | Preview mode, event tracking (if time) |
| **Demo Prep** | 2h | Record demo video, rehearse pitch, write submission copy |
| **Buffer** | 2h | Bug fixes, edge cases, sleep |

---

## 13. Success Metrics (Post-Hackathon Vision)

If this were a real product, success would be measured by:

| Metric | Target | How |
|--------|--------|-----|
| Install-to-live time | < 5 minutes | Measure from snippet copy to first personalized page load |
| Personalization accuracy | > 80% intent match | Compare detected intent to visitor's self-reported goal (survey) |
| Conversion lift | +15-30% on hero CTA click-through | A/B test personalized vs default hero |
| Widget reliability | 99.9% safe fallback rate | Zero instances of broken pages in production |
| Adoption | 1,000 sites in first 90 days | Shopify app store listing + Product Hunt launch |

---

*This PRD is scoped for a 24-hour hackathon build. Every feature in sections 5.1–5.7 is MVP-mandatory. Everything in section 10 is stretch. Ship the MVP first, then enhance.*
