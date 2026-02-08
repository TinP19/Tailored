# Tailored — 1-Page Technical Report

## 1. Problem & Challenge

Every e-commerce website shows the same homepage to every visitor regardless of intent. A shopper ready to buy sees the same generic page as someone comparing options or looking for a gift. This kills conversions: over 70% of visitors bounce when the landing page doesn't match their search intent. Personalization tools that solve this (Dynamic Yield, Optimizely, Adobe Target) cost $50K-$200K/year, require dedicated teams, and take months to deploy. The 30M+ small and mid-sized businesses running on Shopify, Webflow, and WordPress have no affordable way to personalize their sites.

## 2. Target Audience

**Primary:** Small and mid-sized e-commerce store owners on Shopify, Webflow, WordPress, or custom-built sites. They have limited technical resources, no analytics teams, and need a solution that works immediately without complex setup.

**Secondary:** Marketing teams at growing brands who want to test intent-based personalization without committing to enterprise contracts or lengthy integrations.

## 3. Solution & Core Features

Tailored is a plug-and-play AI widget installed with a single `<script>` tag. On every page load, it detects visitor intent from UTM parameters, referrer source, device type, and time of day, then selects the best-matching hero experience from 6 pre-built templates. Each template includes a tailored headline, call-to-action, product image, and social proof message.

**Core features:** real-time intent detection across 4 signal types, 6 intent-driven hero variants (buy, compare, use-case, budget, research, gifting), an analytics dashboard (TailoredPulse) tracking every decision, and a live preview panel (TailoredLens) where site owners can simulate intents and inspect AI reasoning.

## 4. Unique Selling Proposition

Tailored's two-phase rendering shows a personalized hero instantly (0ms) using a client-side rules engine, then silently upgrades the decision with Gemini AI in under a second. Visitors never see a loading state. If the AI fails, the rules-based version stays, nothing breaks. Every decision outputs a structured JSON object with the AI's plain-English reasoning, making every choice auditable and explainable. No other personalization tool offers this combination of instant rendering, AI enhancement, and full transparency in a zero-config script tag.

## 5. Implementation & Technology

| Component | Technology | Role |
|-----------|-----------|------|
| AI Engine | Gemini 2.0 Flash Lite | Fastest Gemini model, sub-second structured JSON decisions |
| Widget | TypeScript, IIFE bundle | Self-contained script, zero dependencies, runs on any site |
| Demo App | React, Tailwind CSS, Vite | Rich hero components, debug panel, analytics dashboard |
| Analytics | Recharts, localStorage | Client-side event tracking and visualization |
| Intent Detection | Custom rules engine | Keyword scoring with referrer/device/time bonuses |

The widget handles signal detection, intent classification, AI calls, and DOM injection entirely client-side. No backend server or database required.

## 6. Results & Impact

The working prototype delivers end-to-end personalization: a visitor arriving with `?utm_term=buy+now` instantly sees an urgency-focused hero, while `?utm_term=gift+for+him` triggers a gift guide experience. All 6 intents produce distinct, AI-reasoned hero variants. Gemini AI responds in under 1 second with the two-phase approach ensuring zero perceived latency. The analytics dashboard tracks intent distribution, template performance, and per-visitor decision history. The preview panel lets site owners test all 6 intents live and inspect the full decision object, satisfying the hackathon's explainability and preview-mode requirements. Installation requires pasting 2 lines of HTML.
