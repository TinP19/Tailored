import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ExternalLink, Code2, Zap, Layers, BarChart3, Tag, Brain, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const SNIPPET_HTML = `<!-- 1. Add a container where you want the personalized hero -->
<div data-tailored="hero"></div>

<!-- 2. (Optional) Add social proof anywhere on the page -->
<span data-tailored="social-proof"></span>

<!-- 3. Add the script before </body> -->
<script src="https://cdn.tailored.dev/widget/tailored.min.js"></script>`;

const SNIPPET_SHOPIFY = `<!-- In your Shopify theme: Online Store > Themes > Edit Code -->
<!-- Add to the section where you want the hero (e.g. index.liquid): -->
<div data-tailored="hero"></div>

<!-- Add to theme.liquid before </body>: -->
<script src="https://cdn.tailored.dev/widget/tailored.min.js"></script>`;

const SNIPPET_WORDPRESS = `<!-- Add to your theme's header.php where you want the hero: -->
<div data-tailored="hero"></div>

<!-- Add to footer.php before </body>, or use a plugin like "Insert Headers and Footers": -->
<script src="https://cdn.tailored.dev/widget/tailored.min.js"></script>`;

const SNIPPET_WEBFLOW = `<!-- In Webflow: Project Settings > Custom Code -->
<!-- Add an Embed element where you want the hero: -->
<div data-tailored="hero"></div>

<!-- Add to "Footer Code" in Project Settings: -->
<script src="https://cdn.tailored.dev/widget/tailored.min.js"></script>`;

const platforms: { name: string; snippet: string }[] = [
  { name: 'HTML', snippet: SNIPPET_HTML },
  { name: 'Shopify', snippet: SNIPPET_SHOPIFY },
  { name: 'WordPress', snippet: SNIPPET_WORDPRESS },
  { name: 'Webflow', snippet: SNIPPET_WEBFLOW },
];

const INTENTS = [
  { intent: 'BUY_NOW', template: 'hero_urgency', trigger: '"buy now", "order", "price"' },
  { intent: 'COMPARE', template: 'hero_comparison', trigger: '"best vs", "top", "compare"' },
  { intent: 'USE_CASE', template: 'hero_lifestyle', trigger: '"gaming setup", "work from home"' },
  { intent: 'BUDGET', template: 'hero_value', trigger: '"cheap", "deal", "budget"' },
  { intent: 'RESEARCH', template: 'hero_guide', trigger: '"how to choose", "review" (default)' },
  { intent: 'GIFTING', template: 'hero_gift', trigger: '"gift for", "present"' },
];

export default function Install() {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState(0);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(platforms[activePlatform].snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold">
            Tailored
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">Demo Store</Button>
            </Link>
            <Link to="/pulse">
              <Button variant="ghost" size="sm">Analytics</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 px-4 py-1.5">
            <Code2 className="mr-2 h-4 w-4" />
            Plug-and-Play Install
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            One Script. Instant Personalization.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Add a single line of code to personalize your website for every visitor.
            No backend required. Setup in under 5 minutes.
          </p>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Intent Detection</h3>
              <p className="text-sm text-muted-foreground">
                Powered by Gemini 2.0 Flash Lite. Detects visitor intent from UTM params, referrer, device, and time context.
              </p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Layers className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Two-Phase Rendering</h3>
              <p className="text-sm text-muted-foreground">
                Phase 1: Instant rules-based hero (0ms). Phase 2: Gemini AI upgrades the decision seamlessly.
              </p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-2">Built-in Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Tracks intent detection, CTA clicks, and variant performance automatically.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Snippet Section */}
        <Card className="glass mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Install on Your Site</h2>

            {/* Platform Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {platforms.map((p, i) => (
                <Button
                  key={p.name}
                  variant={activePlatform === i ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivePlatform(i)}
                >
                  {p.name}
                </Button>
              ))}
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="bg-background/60 border border-border/40 rounded-lg p-4 font-mono text-sm overflow-x-auto text-primary/80">
                {platforms[activePlatform].snippet}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-3 right-3"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              No dependencies. Works on any website — Shopify, Webflow, WordPress, or custom HTML.
            </p>
          </CardContent>
        </Card>

        {/* Data Attributes */}
        <Card className="glass mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Data Attributes</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Mark elements on your page with these attributes. The widget will automatically inject personalized content into them.
            </p>
            <div className="space-y-3">
              <div className="bg-background/60 border border-border/40 rounded-lg p-4">
                <code className="text-sm font-mono text-primary/80">data-tailored="hero"</code>
                <p className="text-xs text-muted-foreground mt-1">
                  The widget injects a full personalized hero section here — headline, subheadline, CTA button, and social proof badge. Styled automatically.
                </p>
              </div>
              <div className="bg-background/60 border border-border/40 rounded-lg p-4">
                <code className="text-sm font-mono text-primary/80">data-tailored="social-proof"</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Injects a social proof message (e.g. "47 people bought this in the last hour"). Place it anywhere on your page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Intents */}
        <Card className="glass mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">6 Intent-Based Templates</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              The AI detects visitor intent and picks the best hero variant. Each intent maps to a unique template with tailored messaging.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Intent</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Template</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Trigger Signals</th>
                  </tr>
                </thead>
                <tbody>
                  {INTENTS.map(({ intent, template, trigger }) => (
                    <tr key={intent} className="border-b border-border/20">
                      <td className="py-2 px-3 font-mono text-xs text-primary/80">{intent}</td>
                      <td className="py-2 px-3 font-mono text-xs">{template}</td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">{trigger}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Decision Object */}
        <Card className="glass mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Explainable Decision Object</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Every personalization decision produces a structured, inspectable object. The AI explains why it chose each variant.
            </p>
            <pre className="bg-background/60 border border-border/40 rounded-lg p-4 font-mono text-sm overflow-x-auto text-muted-foreground">
{`{
  "intent": "COMPARE",
  "template": "hero_comparison",
  "hero_image": "asus-rog",
  "cta": "Compare All Models",
  "confidence": 0.82,
  "reasoning": "UTM contains 'best vs' signals, referrer is Google search
               — strong comparison intent detected.",
  "claude_used": true,
  "signals": {
    "utm_term": "best gaming laptop vs",
    "referrer_type": "google",
    "device": "desktop",
    "time_context": "evening"
  }
}`}
            </pre>
          </CardContent>
        </Card>

        {/* JavaScript API */}
        <Card className="glass mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">JavaScript API</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The widget exposes <code className="text-primary/80">window.Tailored</code> for full programmatic control.
            </p>
            <pre className="bg-background/60 border border-border/40 rounded-lg p-4 font-mono text-sm overflow-x-auto text-muted-foreground">
{`// Get the current personalization decision
const decision = Tailored.getDecision();
console.log(decision.decision.template);   // "hero_urgency"
console.log(decision.decision.hero_image); // "macbook-pro"
console.log(decision.decision.cta);        // "Buy Now — Free Next-Day Delivery"
console.log(decision.classification.reasoning); // AI explanation

// Re-initialize (re-detect intent from current page context)
Tailored.init();

// Simulate a specific intent (async — two-phase rendering)
await Tailored.simulate('BUY_NOW');
await Tailored.simulate('COMPARE');
await Tailored.simulate('GIFTING');

// Run with custom signal overrides
await Tailored.runWithOverrides({
  utm_term: 'cheap gaming monitor',
  referrer_type: 'google',
});

// Subscribe to decision updates (AI upgrades, simulations)
Tailored.onDecision((decision) => {
  console.log('New decision:', decision);
});

// Unsubscribe
Tailored.offDecision(myCallback);

// Listen for CTA clicks
document.addEventListener('tailored:cta_click', (e) => {
  console.log('CTA clicked:', e.detail);
});

// Check version
console.log(Tailored.version); // "1.0.0"`}
            </pre>
          </CardContent>
        </Card>

        {/* Live Demo Link */}
        <Card className="glass mb-8">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">See it in action</h3>
              <p className="text-sm text-muted-foreground">
                View the widget running on a standalone HTML page — no React, no framework, just the script tag.
              </p>
            </div>
            <a href="/demo.html" target="_blank" rel="noopener noreferrer">
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Demo Page
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
