import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ExternalLink, Code2, Zap, Shield, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SNIPPET = `<script src="https://cdn.tailored.dev/widget/tailored.min.js"></script>`;

const SNIPPET_HTML = `<!-- Add this to your HTML -->
<div data-tailored="hero"></div>

<!-- Then add the script before </body> -->
<script src="https://cdn.tailored.dev/widget/tailored.min.js"></script>`;

const SNIPPET_SHOPIFY = `<!-- In your Shopify theme, go to Online Store > Themes > Edit Code -->
<!-- Add to theme.liquid before </body>: -->

<script src="https://cdn.tailored.dev/widget/tailored.min.js"></script>`;

const platforms: { name: string; snippet: string }[] = [
  { name: 'HTML', snippet: SNIPPET_HTML },
  { name: 'Shopify', snippet: SNIPPET_SHOPIFY },
  { name: 'WordPress', snippet: `<!-- Add to your theme's footer.php or via a plugin: -->\n\n${SNIPPET}` },
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
                Detects visitor intent from UTM params, referrer, device, and time context
              </p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Safe Templates</h3>
              <p className="text-sm text-muted-foreground">
                Picks from 6 pre-built hero variants — no full page generation, always safe
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
                Tracks intent, CTA clicks, and variant performance automatically
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Snippet Section */}
        <Card className="glass mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Install on Your Site</h2>

            {/* Platform Tabs */}
            <div className="flex gap-2 mb-4">
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

            {/* Widget size info */}
            <p className="text-xs text-muted-foreground mt-3">
              Widget size: ~10 KB (4 KB gzipped). No dependencies. Works on any website.
            </p>
          </CardContent>
        </Card>

        {/* Live Demo Link */}
        <Card className="glass mb-8">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">See it in action</h3>
              <p className="text-sm text-muted-foreground">
                View the widget running on a standalone HTML page
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

        {/* API */}
        <Card className="glass">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">JavaScript API</h2>
            <pre className="bg-background/60 border border-border/40 rounded-lg p-4 font-mono text-sm overflow-x-auto text-muted-foreground">
{`// Get the current personalization decision
const decision = Tailored.getDecision();
console.log(decision.decision.template);  // "hero_urgency"
console.log(decision.decision.hero_image); // "macbook-pro"
console.log(decision.decision.cta);        // "Buy Now..."

// Simulate a different intent
Tailored.simulate('BUY_NOW');
Tailored.simulate('COMPARE');
Tailored.simulate('GIFTING');

// Listen for CTA clicks
document.addEventListener('tailored:cta_click', (e) => {
  console.log('CTA clicked:', e.detail);
});`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
