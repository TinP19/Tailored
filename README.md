# Tailored

**AI-powered website personalization, installed with a single script tag.**

Tailored detects visitor intent in real time and swaps the hero section to match what they're looking for. It reads UTM parameters, referrer source, device type, and time of day, then picks the best hero template from a library of 6 intent-driven variants. Powered by Gemini 2.0 Flash Lite.

Built for the Global AI Hackathon 2025 — VC Track, Challenge #10: Plug-And-Play Dynamic Website.

---

## How It Works

1. A site owner adds `<script src="tailored.min.js"></script>` to their page
2. The widget reads visitor signals from the browser (UTM, referrer, device, time)
3. **Phase 1 (0ms):** A rules engine classifies intent and injects a personalized hero instantly
4. **Phase 2 (~0.5s):** Gemini AI upgrades the decision in the background — no loading spinner
5. If the AI fails, the rules-based hero stays. Nothing breaks.

## The 6 Intents

| Intent | Template | Trigger Examples |
|--------|----------|-----------------|
| BUY_NOW | `hero_urgency` | "buy now", "order", "price" |
| COMPARE | `hero_comparison` | "best vs", "top", "compare" |
| USE_CASE | `hero_lifestyle` | "gaming setup", "work from home" |
| BUDGET | `hero_value` | "cheap", "deal", "budget" |
| RESEARCH | `hero_guide` | "how to choose", "review" |
| GIFTING | `hero_gift` | "gift for", "present" |

## Quick Start

```bash
# Install dependencies
npm install

# Create .env.local with your Gemini API key
echo "VITE_GEMINI_API_KEY=your_key_here" > .env.local

# Start dev server
npm run dev
```

Open http://localhost:8080 and use the TailoredLens panel (bottom-right) to switch between intents.

Try adding URL params to see automatic detection:
- http://localhost:8080/?utm_term=buy+now
- http://localhost:8080/?utm_term=best+vs+top
- http://localhost:8080/?utm_term=gift+for+him

## Project Structure

```
src/
  widget/
    tailored-widget.ts   # The plug-and-play widget (compiles to tailored.min.js)
    dom-injector.ts       # Injects personalized HTML into data-tailored elements
    templates.ts          # 6 hero template renderers (self-contained HTML/CSS)
  tailored/
    signals.ts            # Signal detection (UTM, referrer, device, time)
    classifier.ts         # Intent classification with keyword scoring
    claude.ts             # Gemini 2.0 Flash Lite API client
    config.ts             # Template registry, section orders, social proof
    engine.ts             # Orchestrates signals → classification → decision
    types.ts              # TypeScript types for the full system
  contexts/
    TailoredContext.tsx    # React bridge — reads from window.Tailored API
  components/
    hero/                 # 6 rich React hero components (urgency, comparison, etc.)
    TailoredLens.tsx      # Live debug panel — simulate intents, inspect decisions
  pages/
    Index.tsx             # Demo store homepage
    Install.tsx           # Installation guide with code snippets
    TailoredPulse.tsx     # Analytics dashboard
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build the React demo app |
| `npm run build:widget` | Build the standalone widget (`dist/widget/tailored.min.js`) |
| `npm run preview` | Preview the production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint the codebase |

## Standalone Widget Usage

For any website (no React needed):

```html
<div data-tailored="hero"></div>
<script src="tailored.min.js"></script>
```

Build the widget:

```bash
npm run build:widget
# Output: dist/widget/tailored.min.js
```

## JavaScript API

The widget exposes `window.Tailored`:

```javascript
Tailored.getDecision()              // Current decision object
Tailored.simulate('BUY_NOW')        // Force an intent
Tailored.onDecision((d) => { ... }) // Subscribe to changes
Tailored.runWithOverrides({ ... })  // Custom signal overrides
Tailored.init()                     // Re-run detection
Tailored.version                    // "1.0.0"
```

## Tech Stack

- **Gemini 2.0 Flash Lite** — AI decision engine
- **TypeScript** — Widget and React app
- **Vite** — Dev server and IIFE/module bundling
- **React** — Demo store presentation layer
- **Tailwind CSS** — Styling with custom design tokens
- **Recharts** — Analytics charts in TailoredPulse

## Pages

| Route | Description |
|-------|-------------|
| `/` | Demo e-commerce store with AI-personalized hero |
| `/install` | Installation guide with platform-specific snippets |
| `/pulse` | Real-time analytics dashboard |
| `/demo.html` | Standalone widget demo (no React) |

## Team

Built by Team Tailored for the Global AI Hackathon 2025.
