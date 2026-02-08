# Tailored — Hackathon Pitch Deck Prompt

> Use this prompt with an AI slide generator (Gamma, Beautiful.ai, Canva AI, or ChatGPT) to create a polished pitch deck for the Global AI Hackathon — VC Track, Challenge #10: Plug-And-Play Dynamic Website.

---

## Design Directives

**Overall Aesthetic:** Clean, modern, and professional. White and light-gray backgrounds with black text. Minimal and spacious — generous white space, no clutter. Think Apple keynote meets Stripe's documentation style. Sophisticated and investor-ready.

**Color Palette:**
- Slide backgrounds: `#FFFFFF` (pure white) or `#F8F9FA` (off-white)
- Headings: `#1A1E2E` (near-black)
- Body text: `#6C757D` (medium gray)
- Subtle borders/dividers: `#DEE2E6` (light gray)
- Card backgrounds: `#F1F3F5` (very light gray) with `1px solid #DEE2E6` border
- Code blocks: `#F8F9FA` background with `#343A40` text
- Intent accent colors (used sparingly for color-coding the 6 intents — NOT as backgrounds, only as left-border accents, dots, or badges):
  - BUY_NOW: `#ef4444` (red)
  - COMPARE: `#3b82f6` (blue)
  - USE_CASE: `#a855f7` (purple)
  - BUDGET: `#22c55e` (green)
  - RESEARCH: `#06b6d4` (cyan)
  - GIFTING: `#f59e0b` (amber)

**Typography:**
- Headings: DM Sans, Bold (700), 36-48pt. Color: `#1A1E2E`
- Subheadings: DM Sans, Semibold (600), 20-24pt. Color: `#343A40`
- Body: DM Sans, Regular (400), 16-18pt. Color: `#6C757D`
- Code/data: Monospace (SF Mono, Fira Code, or Consolas), 14pt. Color: `#343A40` on `#F8F9FA`
- Keep text minimal per slide — maximum 5-6 lines of body text. Let visuals carry the message.

**Visual Style:**
- No gradients on backgrounds — keep them flat white or off-white
- Use thin gray borders (`1px solid #DEE2E6`) around cards and sections
- Subtle drop shadows on cards: `0 2px 8px rgba(0,0,0,0.08)`
- Rounded corners (8-12px) on cards and code blocks
- Use simple, clean line icons (Lucide or Phosphor style) in `#6C757D`
- Diagrams should use clean lines, labeled boxes, and directional arrows
- Charts should be flat with no 3D effects — use the intent accent colors for data series

---

## Slide-by-Slide Breakdown

---

### Slide 1 — Title

**Headline:** Tailored
**Subheadline:** AI-Powered Personalization for Every Website
**Tagline (smaller, below):** One script tag. Instant personalization. No backend required.

**Visual description for AI to generate:**
- Center the word "Tailored" in large bold DM Sans (60pt) in `#1A1E2E` on a white background
- Below it, the subheadline in `#6C757D` at 24pt
- Below the tagline, show a code snippet in a light gray rounded card:
  ```html
  <script src="tailored.min.js"></script>
  ```
- At the bottom, small footer text: "Global AI Hackathon 2025 | VC Track | Challenge #10: Plug-And-Play Dynamic Website"
- Optional: a row of 6 small colored dots (one per intent color) as a subtle brand element

---

### Slide 2 — The Problem

**Headline:** Every Visitor Sees the Same Page

**Content — 3 sections, each with a line icon + text:**

1. **Intent Mismatch** (icon: target with X)
   A visitor searching "buy 4K gaming monitor now" arrives at your site ready to purchase — but sees the same generic homepage as someone researching "best monitors 2025 comparison." The page doesn't adapt. The visitor bounces.

2. **High Bounce Rates** (icon: trending-down arrow)
   Studies show 70%+ of e-commerce visitors bounce within 10 seconds when the landing page doesn't match their search intent. Every mismatched page is lost revenue.

3. **Enterprise-Only Solutions** (icon: lock)
   Tools like Dynamic Yield, Optimizely, and Adobe Target solve this — but they cost $50K-$200K/year, require dedicated analytics teams, and take months to implement. The 30M+ SMBs on Shopify, Webflow, and WordPress are priced out entirely.

**Visual description for AI to generate:**
- Create a diagram showing 3 different visitors (represented as simple person icons with colored labels):
  - Visitor A (red dot): Thought bubble says "I want to BUY a monitor NOW"
  - Visitor B (blue dot): Thought bubble says "Which monitor is BEST?"
  - Visitor C (amber dot): Thought bubble says "Need a GIFT for my brother"
- All 3 arrows point to the SAME generic webpage mockup (a simple gray rectangle labeled "Generic Homepage")
- Below the diagram, a red banner: "Same page. Different needs. Lost conversions."
- Layout: diagram takes 60% of the slide, the 3 text bullets are on the right side at 40%

---

### Slide 3 — The Solution

**Headline:** Tailored Reads Intent. Picks the Right Experience.

**Content:**

Tailored is a plug-and-play AI widget that personalizes any website in real time. Site owners paste one `<script>` tag — and every visitor automatically sees a hero section tailored to their intent.

**4 key points (each with a checkmark icon):**
- **One script tag** — installs in under 5 minutes on any website (Shopify, Webflow, WordPress, custom HTML)
- **4 signal types** — detects visitor intent from UTM parameters, referrer source, device type, and time of day
- **AI-powered decisions** — Gemini 2.0 Flash Lite picks the optimal hero template, product image, and CTA button from a finite, safe library
- **No chatbot, no full-page generation** — just smart, templatized personalization with safe fallbacks

**Visual description for AI to generate:**
- Same 3 visitors from Slide 2, but now each arrow points to a DIFFERENT webpage mockup:
  - Visitor A (red) → "Urgency Hero" page (labeled "Don't Miss Out — Ships Today" with a red accent bar)
  - Visitor B (blue) → "Comparison Hero" page (labeled "Find Your Perfect Match" with a blue accent bar)
  - Visitor C (amber) → "Gift Guide Hero" page (labeled "Give the Gift of Great Tech" with an amber accent bar)
- Below: a green banner: "Right page. Right intent. Higher conversions."
- This should mirror the Slide 2 diagram structure so the before/after contrast is immediate

---

### Slide 4 — How the Script Tag Works

**Headline:** What Happens When the Script Loads

**This slide explains the widget internals — the "how" for judges who want to see technical depth.**

**Content — Vertical numbered timeline (1-5), each step in a light gray card:**

**Step 1: Script Tag Loads (0ms)**
The site owner pastes `<script src="tailored.min.js"></script>` before `</body>`. The script is an IIFE (Immediately Invoked Function Expression) — a single self-contained JavaScript file with zero external dependencies. It executes instantly on page load and exposes `window.Tailored` as a global API.

**Step 2: Signal Collection (0ms)**
The widget reads 4 types of visitor signals from the browser — no cookies, no tracking pixels, no server required:
- `window.location.search` → parses UTM parameters (`utm_term`, `utm_source`, `utm_medium`)
- `document.referrer` → classifies referrer type (Google, Reddit, Instagram, email, direct)
- `navigator.userAgent` → detects device type (mobile, tablet, desktop)
- `new Date()` → determines time context (morning/afternoon/evening, weekday/weekend)

**Step 3: Intent Classification (0ms)**
The rules engine scores each of 6 intents using keyword matching against the UTM terms. Each intent has a dictionary of trigger words (e.g., BUY_NOW: "buy", "order", "price", "deal"). Referrer type, device type, and time of day add weighted bonuses. The highest-scoring intent wins. If no intent scores above 30% confidence, it falls back to RESEARCH (safe default).

**Step 4: DOM Injection (0ms)**
The widget finds any elements marked with `data-tailored="hero"` on the page and injects a fully-styled hero section — headline, subheadline, CTA button, and social proof badge. Styles are inlined (no external CSS needed). The page is personalized before the visitor even finishes processing the page load.

**Step 5: AI Enhancement (~0.5-1s, async)**
In the background, the widget sends the visitor's signals to Gemini 2.0 Flash Lite via API. The AI selects the optimal template, hero image, and CTA from a constrained asset registry. When the AI responds, the widget seamlessly swaps the hero — the visitor never sees a loading state. If the AI fails or times out (5s limit), the rules-based hero stays. No degradation.

**Visual description for AI to generate:**
- A vertical timeline/flowchart with 5 numbered steps, connected by thin gray lines with downward arrows
- Each step is a white card with a light gray border, containing the step title in bold and a 1-2 line description
- On the right side of steps 1-4, show a small "0ms" badge in a green pill
- On the right side of step 5, show a "~0.5s async" badge in a purple pill
- Between step 4 and step 5, add a horizontal dashed line labeled "Visitor sees personalized page here (instant)"

---

### Slide 5 — Two-Phase Rendering Architecture

**Headline:** Two-Phase Rendering: Instant First, Smart Second

**This slide shows the key architectural innovation — no loading spinner, ever.**

**Content — Side-by-side comparison:**

**Left column: Phase 1 — Rules Engine (Synchronous, 0ms)**
- Runs entirely in the browser, no network call
- Keyword scoring across 6 intent dictionaries
- Weighted bonuses from referrer + device + time
- Picks the best template from the registry
- Injects hero into DOM immediately
- Result: Visitor sees a personalized page in <16ms (one frame)

**Right column: Phase 2 — Gemini AI (Asynchronous, ~0.5-1s)**
- Sends signals + classification to Gemini 2.0 Flash Lite
- Model: `gemini-2.0-flash-lite` — fastest Gemini model, no "thinking" overhead
- AI picks optimal template + image + CTA from constrained asset list
- Returns structured JSON with reasoning explanation
- Widget seamlessly swaps the hero (no flash, no spinner)
- 5-minute cache prevents redundant API calls

**Bottom callout (full width):**
"The visitor always sees a personalized page instantly. The AI upgrades the decision silently in the background. If the AI fails, the rules-based hero stays — safe by default."

**Visual description for AI to generate:**
- Two equal-width columns, each in a white card with a light gray border
- Left card header: "Phase 1: Rules" with a cyan (`#06b6d4`) left border accent
- Right card header: "Phase 2: AI" with a purple (`#a855f7`) left border accent
- Below both columns, a horizontal timeline bar:
  - 0ms mark → "Page loads" (black dot)
  - 0ms mark → "Phase 1: Hero injected" (cyan dot, labeled)
  - ~500ms mark → "Phase 2: AI upgrades hero" (purple dot, labeled)
  - Arrow continues to the right → "Visitor browsing, uninterrupted"
- The timeline bar should be on a light gray background strip

---

### Slide 6 — The 6 Intent-Based Templates

**Headline:** 6 Intents. 6 Templates. Every Visitor Gets Their Match.

**Content — 3x2 grid of template cards:**

Each card should contain:
- A colored left border (2-3px) using the intent's accent color
- Intent name in bold (e.g., "BUY_NOW")
- Template name in monospace (e.g., `hero_urgency`)
- Badge text (what the visitor sees, e.g., "Limited Stock")
- Headline (e.g., "Don't Miss Out — Ships Today")
- CTA button text (e.g., "Buy Now — Free Next-Day Delivery")
- Social proof line (e.g., "47 people bought this in the last hour")

**The 6 templates:**

| # | Intent | Template | Badge | Headline | CTA | Social Proof | Color |
|---|--------|----------|-------|----------|-----|-------------|-------|
| 1 | BUY_NOW | `hero_urgency` | Limited Stock | Don't Miss Out — Ships Today | Buy Now — Free Next-Day Delivery | 47 people bought this in the last hour | Red `#ef4444` |
| 2 | COMPARE | `hero_comparison` | Top Picks | Find Your Perfect Match | Compare All Models | Rated #1 by 3 major review sites | Blue `#3b82f6` |
| 3 | USE_CASE | `hero_lifestyle` | Curated Collection | Built for Your Lifestyle | Shop Gaming Setups | Recommended by 8,000+ users | Purple `#a855f7` |
| 4 | BUDGET | `hero_value` | Best Value | Premium Tech. Honest Prices. | Shop Best Value | Thousands saved this month | Green `#22c55e` |
| 5 | RESEARCH | `hero_guide` | Expert Resources | Your Journey Starts Here | Take the Quiz — Find Your Match | Read by 25,000 shoppers this month | Cyan `#06b6d4` |
| 6 | GIFTING | `hero_gift` | Gift Guide | Give the Gift of Great Tech | Shop Gift Guide | Top-rated gift — 4.8 stars | Amber `#f59e0b` |

**Bottom callout:** "Each template has fixed content slots: hero image, headline, subheadline, CTA, and social proof. The AI picks from this finite registry — no hallucinated content, always safe."

**Visual description for AI to generate:**
- 3 columns, 2 rows of cards (6 total)
- Each card is ~300px wide, white background, with a colored left border matching the intent color
- Inside each card: intent name (bold, 14pt), template name (monospace, 12pt, gray), headline (16pt), CTA text in a small colored pill button, and social proof in italic gray text
- Cards should have subtle drop shadows and 8px rounded corners

---

### Slide 7 — Signal Detection Deep Dive

**Headline:** 4 Signal Types. Real-Time Intent Scoring.

**Content — 4 horizontal cards, stacked vertically, each with an icon + title + example + detail:**

**1. UTM Parameters** (icon: search magnifying glass)
- Source: `window.location.search`
- Example: `?utm_term=buy+4k+gaming+monitor&utm_source=google`
- How it works: The widget maintains 6 keyword dictionaries (one per intent). Each UTM term is scored against all 6 dictionaries. "buy" scores +3 for BUY_NOW, "gaming" scores +2 for USE_CASE, etc. Highest aggregate score wins.
- Weight: Primary signal (highest influence)

**2. Referrer Type** (icon: globe)
- Source: `document.referrer`
- Example: `https://www.google.com/search?q=best+monitor`
- How it works: Referrer URL is classified into categories: Google Search → boosts RESEARCH/COMPARE; Reddit/social → boosts USE_CASE; Email campaign → boosts BUY_NOW (already nurtured); Direct → neutral.
- Weight: Secondary signal (adds bonus to intent scores)

**3. Device Type** (icon: smartphone + monitor)
- Source: `navigator.userAgent`
- Example: Mobile (iPhone 15), Desktop (Chrome on Windows)
- How it works: Mobile visitors are more likely impulse buyers → boosts BUY_NOW and BUDGET. Desktop visitors are more likely researchers → boosts COMPARE and RESEARCH.
- Weight: Modifier signal (adjusts scores by +1-2 points)

**4. Time Context** (icon: clock)
- Source: `new Date()`
- Example: Saturday 8:00 PM → Evening + Weekend
- How it works: Evening + weekend → boosts GIFTING and USE_CASE (leisure shopping). Weekday morning → boosts RESEARCH (work-related browsing). Lunch hours → boosts BUY_NOW (quick purchases).
- Weight: Modifier signal (adjusts scores by +1-2 points)

**Bottom callout:** "All 4 signals combine into a weighted score per intent. If the top score is below 30% confidence, the widget defaults to RESEARCH — a safe, educational experience that works for any visitor."

**Visual description for AI to generate:**
- 4 horizontal cards stacked vertically, each taking the full slide width
- Each card has: an icon on the left (40x40px, gray), signal name in bold, source in monospace, and a brief description
- On the right side of each card, show a small "weight" indicator: Primary (dark bar), Secondary (medium bar), Modifier (light bar)
- Below all 4 cards, a horizontal "scoring funnel" diagram:
  - 4 arrows (one per signal) feeding into a central box labeled "Intent Classifier"
  - 6 output arrows from the classifier, each labeled with an intent and a confidence percentage
  - The highest-confidence arrow is highlighted (e.g., "COMPARE: 82%")

---

### Slide 8 — Explainable AI Decisions

**Headline:** Every Decision is Structured, Inspectable, and Explainable

**Content:**

The hackathon challenge requires a structured decision object with an explanation of WHY the AI chose each variant. Tailored outputs a full `DecisionObject` for every visitor:

**Show the structured decision object in a code block:**

```json
{
  "visitor_id": "v_3a8f2c",
  "timestamp": "2025-06-15T20:14:32.000Z",
  "signals": {
    "utm_term": "best gaming laptop vs macbook",
    "utm_source": "google",
    "referrer_type": "google",
    "device": "desktop",
    "time_context": "evening",
    "is_weekend": true
  },
  "classification": {
    "primary_intent": "COMPARE",
    "confidence": 0.82,
    "reasoning": "UTM contains 'best' and 'vs' — strong comparison signals. Google referrer confirms search-driven research. Desktop device supports in-depth comparison browsing."
  },
  "decision": {
    "template": "hero_comparison",
    "hero_image": "asus-rog",
    "cta": "Compare All Models",
    "section_order": ["hero", "comparison_table", "reviews", "features"],
    "social_proof": "Rated #1 by 3 major review sites"
  },
  "claude_used": true,
  "fallback_used": false
}
```

**3 callout boxes below the code block:**

1. **`classification.reasoning`** — The AI explains its logic in plain English. Site owners can audit WHY each visitor saw what they saw. No black box.
2. **`claude_used: true`** — Boolean flag shows whether the AI enhanced the decision (true) or the rules engine alone made the call (false). Transparent provenance.
3. **`fallback_used: false`** — Shows whether the system fell back to the safe default (RESEARCH) due to low confidence. Safety is built in.

**Visual description for AI to generate:**
- The JSON code block takes the top 60% of the slide, rendered in a light gray card with monospace font
- Highlight the `reasoning` field with a yellow-ish background highlight or a subtle border
- Below the code block, 3 small cards in a row, each with a key name in monospace, an arrow, and a plain-English explanation
- Use a small "magnifying glass" icon next to the headline to convey inspectability

---

### Slide 9 — Plug-and-Play Installation

**Headline:** 3 Steps. Under 5 Minutes. Any Website.

**Content — 3 numbered steps, each in its own card:**

**Step 1: Add the hero container**
```html
<div data-tailored="hero"></div>
```
Place this `<div>` anywhere on your page where you want the personalized hero section to appear. The widget will automatically inject the full hero (headline, subheadline, CTA button, social proof) with self-contained styles.

**Step 2: (Optional) Add social proof**
```html
<span data-tailored="social-proof"></span>
```
Place this anywhere else on the page — the widget fills it with context-appropriate social proof text (e.g., "47 people bought this in the last hour" for BUY_NOW intent).

**Step 3: Add the script**
```html
<script src="tailored.min.js"></script>
```
Add this before `</body>`. The script is a single IIFE bundle — no dependencies, no build step, no npm install. It runs immediately, detects intent, and personalizes the page.

**Platform compatibility badges:** HTML | Shopify | WordPress | Webflow

**Callout:** "That's it. No backend server. No API keys to manage. No database. No build step. The widget is completely self-contained — it works on any website that can include a `<script>` tag."

**Visual description for AI to generate:**
- 3 numbered cards arranged vertically (1, 2, 3), each with a code snippet in a light gray box and a description paragraph
- Step 2 has a subtle "(Optional)" badge in gray
- Below the 3 cards, show 4 platform logos in a row (HTML5 logo, Shopify bag, WordPress W, Webflow logo) — each in a small circle with gray borders
- At the bottom, a green checkmark icon with the callout text

---

### Slide 10 — The JavaScript API

**Headline:** Full Programmatic Control via `window.Tailored`

**Content:**

Beyond automatic personalization, site owners get a full JavaScript API for custom integrations, A/B testing, and debugging.

**API methods in a 2-column layout:**

| Method | Description |
|--------|-------------|
| `Tailored.init()` | Re-run the full detection pipeline (rules + AI) |
| `Tailored.getDecision()` | Returns the current DecisionObject |
| `Tailored.simulate('BUY_NOW')` | Force a specific intent (for testing/preview) |
| `Tailored.onDecision(callback)` | Subscribe to decision changes (AI upgrades, simulations) |
| `Tailored.offDecision(callback)` | Unsubscribe from decision changes |
| `Tailored.runWithOverrides({...})` | Run with custom signal overrides (for debug panels) |
| `Tailored.version` | Current widget version string |

**Code example below the table:**
```javascript
// Listen for personalization decisions
Tailored.onDecision((decision) => {
  console.log('Intent:', decision.classification.primary_intent);
  console.log('Template:', decision.decision.template);
  console.log('AI used:', decision.claude_used);
  console.log('Reasoning:', decision.classification.reasoning);
});

// Simulate a gifting visitor for preview
await Tailored.simulate('GIFTING');
```

**Visual description for AI to generate:**
- Top half: a clean 2-column table with method names in monospace on the left and descriptions on the right
- Bottom half: a code block in a light gray card with syntax highlighting (function names in blue, strings in green, comments in gray)
- Small "API" badge icon in the top-right corner of the slide

---

### Slide 11 — Built-in Analytics Dashboard (TailoredPulse)

**Headline:** Real-Time Personalization Analytics — Built In

**Content:**

Tailored includes a full analytics dashboard called TailoredPulse that tracks every personalization decision automatically. No Google Analytics integration needed.

**Dashboard components to visualize:**

**Row 1: 4 KPI Cards (horizontal)**
- **Total Visitors**: 2,847 (icon: users, trend: +12.4% green arrow up)
- **Personalized %**: 94.2% (icon: percent, trend: +3.1% green arrow up)
- **Avg Confidence**: 0.78 (icon: activity pulse, mini sparkline chart)
- **Fallback Rate**: 5.8% (icon: alert triangle, trend: -2.1% green arrow down — lower is better)

**Row 2: 2 Charts side by side**

**Left chart — Intent Distribution (Donut Chart)**
- 6 segments, each colored by intent:
  - BUY_NOW (red): 28%
  - COMPARE (blue): 22%
  - USE_CASE (purple): 18%
  - BUDGET (green): 14%
  - RESEARCH (cyan): 12%
  - GIFTING (amber): 6%
- Center of donut: "2,847 visitors"
- Legend on the right with colored dots + labels + percentages

**Right chart — Template Performance (Horizontal Bar Chart)**
- Y-axis: template names (`hero_urgency`, `hero_comparison`, `hero_lifestyle`, `hero_value`, `hero_guide`, `hero_gift`)
- X-axis: Click-through Rate (CTR) percentage, 0-20%
- Bar colors: each bar uses its intent accent color
- Data: hero_urgency: 18.2%, hero_comparison: 14.7%, hero_lifestyle: 12.1%, hero_value: 15.3%, hero_guide: 8.4%, hero_gift: 16.8%

**Row 3: Recent Decisions Table**
- Columns: Time | Intent (colored badge) | Confidence (progress bar) | Template | CTA Clicked | Referrer
- 5 example rows with realistic data
- Confidence column shows a small horizontal progress bar (gray background, colored fill matching intent)

**Visual description for AI to generate:**
- Mock up a full dashboard layout on a white background
- Row 1: 4 equal-width KPI cards with the numbers prominently displayed, small trend arrows in green/red
- Row 2: Donut chart on left (half width), horizontal bar chart on right (half width)
- Row 3: A data table with 5 rows, alternating very light gray row backgrounds
- All cards have light gray borders and subtle drop shadows
- Use the 6 intent colors for chart segments and bar fills

---

### Slide 12 — Live Preview Mode (TailoredLens)

**Headline:** Preview Mode for Site Owners — Test Every Intent Live

**Content:**

TailoredLens is a built-in debug panel that floats in the bottom-right corner of any page running the Tailored widget. Site owners can:

- **Simulate any intent** — Click one of 6 intent buttons to instantly see how the hero changes for that visitor type. The widget runs the full two-phase pipeline (rules instant → AI upgrade).
- **Override signals manually** — Type a custom UTM term, select a referrer source (Google, Reddit, Instagram, Email, Direct), toggle between desktop and mobile view.
- **Inspect the decision JSON** — Expand the Decision Inspector accordion to see the full DecisionObject with signals, classification, confidence score, and AI reasoning.
- **See AI vs Rules status** — A badge shows whether the current decision was made by Gemini AI (purple "Gemini AI" badge) or the rules engine alone (blue "Rules" badge). An amber "Override" badge appears when signals are manually overridden.

**How it satisfies the hackathon:**
This is the "Preview mode for site owners: simulate intents and see variants" stretch goal from the challenge spec. Judges can click all 6 intents and watch the hero change in real time.

**Visual description for AI to generate:**
- Show a browser window mockup with a demo e-commerce page in the background
- In the bottom-right corner, the TailoredLens panel is open, showing:
  - A row of 6 small buttons, each colored by intent (red, blue, purple, green, cyan, amber)
  - An "Override Signals" section with a text input and a dropdown
  - A "Decision Inspector" section showing a collapsed JSON preview
  - A status badge reading "Gemini AI" in a purple pill
- The browser page behind the panel shows a hero section (e.g., the comparison hero with a blue accent)
- Draw a subtle arrow from one of the intent buttons to the hero section to show the connection

---

### Slide 13 — Data Flow Diagram (Full System)

**Headline:** End-to-End Data Flow

**This slide shows the complete system architecture for technically-minded judges.**

**Visual description for AI to generate — a labeled diagram with these components:**

**Left side: "Any Website"**
- A browser window containing:
  - `<div data-tailored="hero">` (labeled)
  - `<script src="tailored.min.js">` (labeled)
  - Arrow labeled "1. Script loads, reads signals" pointing down to...

**Center: "Tailored Widget (client-side)"**
- A large box containing 4 smaller boxes connected by arrows:
  - Box 1: `parseSignals()` — "Reads UTM, referrer, device, time from browser APIs"
  - Arrow down to Box 2: `classifyIntent()` — "Scores 6 intents using keyword dictionaries + weighted bonuses"
  - Arrow down to Box 3: `INTENT_TEMPLATE_MAP` — "Maps winning intent to template + image + CTA"
  - Arrow down to Box 4: `injectPersonalization()` — "Swaps hero DOM element with styled HTML"
- A separate dashed arrow from Box 2 going right to...

**Right side: "Gemini 2.0 Flash Lite API"**
- A cloud/API box labeled "Gemini AI"
- Input arrow: "Signals + Classification → structured prompt"
- Output arrow: "JSON response → { template, hero_image, cta, reasoning }"
- Dashed arrow back to Box 4 in the center: "Seamlessly upgrade hero"

**Bottom: "Analytics (localStorage)"**
- Arrow from Box 4 down to an analytics box
- Contains: "page_view, intent_detected, hero_shown, cta_click events"
- Arrow right to "TailoredPulse Dashboard"

**Visual style:**
- White background, black text, gray borders on all boxes
- Use thin arrows (1-2px) with small labels
- The "Gemini AI" box has a purple left border accent
- The "Widget" box has a cyan left border accent
- The "Analytics" box has an amber left border accent

---

### Slide 14 — Market Opportunity

**Headline:** Personalization for the 30 Million Sites That Can't Afford It

**Content:**

**The problem with the market today:**
- The website personalization market is worth $12B+ and growing 15% YoY
- It's dominated by enterprise platforms: Dynamic Yield ($200K/yr), Optimizely ($100K/yr), Adobe Target ($150K/yr)
- These tools require dedicated analytics teams, months of implementation, and complex backend infrastructure
- Result: only the top 0.1% of websites (enterprise e-commerce) have any personalization at all

**The opportunity:**
- 30M+ Shopify stores, 40M+ WordPress sites, and millions of Webflow sites have ZERO real-time personalization
- These businesses generate $500B+ in annual revenue combined
- Even a 1% conversion rate improvement = billions in additional revenue across the long tail
- Tailored captures this market with a $0 barrier to entry: one script tag, instant results

**Positioning:** "Tailored is Stripe for website experiences — plug-and-play, developer-friendly, AI-first. Start with hero personalization, expand to product recommendations, checkout optimization, and full-page personalization."

**Visual description for AI to generate:**
- A pyramid/funnel diagram with 3 tiers:
  - **Top tier (smallest, dark gray):** "Enterprise" — Dynamic Yield, Optimizely, Adobe Target — "$100K-$200K/year" — "0.1% of websites"
  - **Middle tier (medium, medium gray):** "Mid-Market" — "Basic A/B testing tools" — "$500-$5K/year" — "~1% of websites"
  - **Bottom tier (largest, with a colored border):** "SMB Long Tail" — "Tailored" — "One script tag, free to start" — "30M+ websites with ZERO personalization"
- The bottom tier should be highlighted with a subtle green or cyan accent border
- Next to the pyramid, show a simple upward arrow with "$12B+ market" and "15% YoY growth"

---

### Slide 15 — Tech Stack

**Headline:** Built With Modern, Production-Ready Tools

**Content — Tech badges in a 2x3 grid, each as a card with an icon + name + role:**

| Technology | Role |
|------------|------|
| **Gemini 2.0 Flash Lite** | AI decision engine — fastest Gemini model, sub-second structured JSON responses, no "thinking" overhead |
| **TypeScript** | Widget + React application — full type safety across the entire codebase |
| **Vite** | Build tooling — IIFE bundle for widget (tailored.min.js), module bundling for React demo app |
| **Tailwind CSS** | Styling system — utility-first CSS with custom design tokens and glass-morphism utilities |
| **Recharts** | Analytics visualization — donut charts, bar charts, area charts, and sparklines in TailoredPulse |
| **React** | Demo store presentation layer — rich hero components, TailoredLens debug panel, routing |

**Architecture summary (2 boxes):**

**Box 1: The Product (what ships to customers)**
`tailored.min.js` — A single IIFE JavaScript file. Contains signal detection, intent classification, rules engine, Gemini AI client, DOM injector, and event tracking. Zero dependencies. Works on any website.

**Box 2: The Demo (what judges see today)**
React SPA wrapping the widget. The `<script>` tag loads the widget first. React reads `window.Tailored.getDecision()` on mount, subscribes to updates via `onDecision(callback)`, and renders rich hero components with animations, the TailoredLens debug panel, and the TailoredPulse analytics dashboard.

**Visual description for AI to generate:**
- Top section: 6 tech cards in a 3x2 grid, each with a technology icon (or letter logo), name in bold, and role in smaller gray text
- Bottom section: 2 side-by-side cards:
  - Left card: "The Product" with a package icon, white background, with the description
  - Right card: "The Demo" with a monitor icon, light gray background, with the description
- An arrow from left card to right card labeled "powers"

---

### Slide 16 — Live Demo

**Headline:** See It Live

**Content:**

**Demo links (each as a clickable card):**

| Page | URL | What It Shows |
|------|-----|---------------|
| **Demo Store** | `[URL]/` | Full e-commerce homepage with AI-personalized hero. Try adding `?utm_term=buy+now` or `?utm_term=gift+for+him` to the URL to see the hero change. |
| **Standalone Widget** | `[URL]/demo.html` | Bare HTML page with just the `<script>` tag — no React, no framework. Proves the widget works on any site. |
| **Install Guide** | `[URL]/install` | Interactive installation page with platform-specific code snippets (HTML, Shopify, WordPress, Webflow) and full API docs. |
| **Analytics Dashboard** | `[URL]/pulse` | TailoredPulse real-time analytics showing intent distribution, template performance, and recent decisions. |

**Judge instructions:**
1. Open the Demo Store
2. Open the TailoredLens panel (bottom-right corner)
3. Click each of the 6 intent buttons and watch the hero change
4. Check the Decision Inspector to see the AI reasoning
5. Open the browser console — type `Tailored.getDecision()` to see the full decision object
6. Add `?utm_term=cheap+deal` to the URL and reload — watch the widget detect BUDGET intent automatically

**Visual description for AI to generate:**
- 4 cards in a 2x2 grid, each with the page name, a brief description, and a small browser-window mockup showing what the page looks like
- Below the grid, a numbered list (1-6) of judge instructions in a light gray box
- Each card has a small external-link icon in the top-right corner

---

### Slide 17 — Thank You

**Headline:** Tailored
**Subheadline:** One Script. Instant Personalization.

**Content:**
- GitHub: `github.com/TinP19/Tailored`
- Team: [Your team names here]
- Challenge: #10 — Plug-And-Play Dynamic Website
- Track: VC Track — Global AI Hackathon 2025

**Visual description for AI to generate:**
- Centered layout on white background
- "Tailored" in large bold text (60pt) at the top
- Subheadline below in gray
- The script tag snippet one more time in a light gray code card:
  ```html
  <script src="tailored.min.js"></script>
  ```
- Team names and GitHub link below
- A row of 6 colored dots (intent colors) as a footer accent element
- Clean, memorable, and simple — this is the last thing judges see

---

## Additional Notes for the Slide Generator

**Layout rules:**
- Every slide has a white (`#FFFFFF`) or off-white (`#F8F9FA`) background — no dark backgrounds
- Maximum 5-6 lines of body text per slide — use visuals, diagrams, and code blocks to carry information
- All cards use: white background, `1px solid #DEE2E6` border, `0 2px 8px rgba(0,0,0,0.08)` shadow, 8-12px rounded corners
- Headings are always `#1A1E2E`, body text is always `#6C757D`

**Color usage:**
- The 6 intent accent colors are ONLY used for: left-border accents on cards, chart segments, badge backgrounds, and small dots/pills
- They are NEVER used as slide backgrounds or large fill areas
- The overall palette is white, light gray, dark gray, and black — with intent colors as precise accents

**Charts and diagrams:**
- All charts are flat (no 3D, no glossy effects)
- Bar charts use horizontal bars with rounded ends
- Donut charts have a hole ratio of ~60%
- Flowcharts use thin lines (1-2px) with small arrowheads
- All chart labels use DM Sans, 12-14pt, in `#6C757D`

**Code blocks:**
- Background: `#F8F9FA`
- Text: `#343A40`
- Border: `1px solid #DEE2E6`
- Font: Monospace, 14pt
- Rounded corners: 8px

**Tone:**
- Professional and investor-ready, not casual
- Technical depth where it matters (architecture, AI, data flow) — show judges we understand the engineering
- Business opportunity where it matters (market size, positioning) — show judges we understand the market
- The pitch should feel like a product demo AND a business case — not just a tech showcase

**Total slides:** 17 (aim for a 7-10 minute presentation)
