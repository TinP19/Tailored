import { useState, useEffect } from 'react';
import {
  Zap,
  GitCompare,
  Gamepad2,
  DollarSign,
  BookOpen,
  Gift,
  ChevronDown,
  Copy,
  Check,
  Target,
  Monitor,
  Smartphone,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

import type { Intent } from '@/engine/templateRegistry';
import type { DecisionObject } from '@/engine/decisionBuilder';
import type { SignalOverrides } from '@/engine/signalParser';
import { injectPersonalization, getCurrentDecision } from '@/engine/domInjector';

// ---------------------------------------------------------------------------
// Intent pill config
// ---------------------------------------------------------------------------

type Device = 'desktop' | 'mobile';

const intentPills: { id: Intent; label: string; icon: typeof Zap; colorClass: string; glowClass: string }[] = [
  {
    id: 'BUY_NOW',
    label: 'BUY NOW',
    icon: Zap,
    colorClass: 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30',
    glowClass: 'shadow-[0_0_20px_hsl(0_84%_60%/0.4)]'
  },
  {
    id: 'COMPARE',
    label: 'COMPARE',
    icon: GitCompare,
    colorClass: 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30',
    glowClass: 'shadow-[0_0_20px_hsl(217_91%_60%/0.4)]'
  },
  {
    id: 'USE_CASE',
    label: 'USE CASE',
    icon: Gamepad2,
    colorClass: 'bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30',
    glowClass: 'shadow-[0_0_20px_hsl(271_91%_65%/0.4)]'
  },
  {
    id: 'BUDGET',
    label: 'BUDGET',
    icon: DollarSign,
    colorClass: 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30',
    glowClass: 'shadow-[0_0_20px_hsl(142_71%_45%/0.4)]'
  },
  {
    id: 'RESEARCH',
    label: 'RESEARCH',
    icon: BookOpen,
    colorClass: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30',
    glowClass: 'shadow-[0_0_20px_hsl(188_94%_43%/0.4)]'
  },
  {
    id: 'GIFTING',
    label: 'GIFTING',
    icon: Gift,
    colorClass: 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30',
    glowClass: 'shadow-[0_0_20px_hsl(38_92%_50%/0.4)]'
  },
];

// ---------------------------------------------------------------------------
// Referrer dropdown → URL mapping (for signal parser domain classification)
// ---------------------------------------------------------------------------

const REFERRER_URL_MAP: Record<string, string> = {
  google: 'https://www.google.com/search?q=tech',
  reddit: 'https://www.reddit.com/r/tech',
  wirecutter: 'https://www.wirecutter.com/reviews/best-laptop',
  instagram: 'https://www.instagram.com/',
  email: 'https://mail.google.com/',
  direct: '',
};

// ---------------------------------------------------------------------------
// JSON syntax highlighter
// ---------------------------------------------------------------------------

function highlightJson(json: string): React.ReactNode[] {
  return json.split('\n').map((line, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Match and colorize tokens one at a time
    while (remaining.length > 0) {
      // Key: "something":
      const keyMatch = remaining.match(/^(\s*)"([^"]+)"(:)/);
      if (keyMatch) {
        parts.push(<span key={key++}>{keyMatch[1]}</span>);
        parts.push(<span key={key++} className="text-muted-foreground">"{keyMatch[2]}"</span>);
        parts.push(<span key={key++}>{keyMatch[3]}</span>);
        remaining = remaining.slice(keyMatch[0].length);
        continue;
      }

      // String value: "something"
      const strMatch = remaining.match(/^(\s*)"([^"]*)"(,?\s*)/);
      if (strMatch) {
        parts.push(<span key={key++}>{strMatch[1]}</span>);
        parts.push(<span key={key++} className="text-green-400">"{strMatch[2]}"</span>);
        parts.push(<span key={key++}>{strMatch[3]}</span>);
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // Number value
      const numMatch = remaining.match(/^(\s*)(\d+\.?\d*)(,?\s*)/);
      if (numMatch) {
        parts.push(<span key={key++}>{numMatch[1]}</span>);
        parts.push(<span key={key++} className="text-blue-400">{numMatch[2]}</span>);
        parts.push(<span key={key++}>{numMatch[3]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      // Boolean / null
      const boolMatch = remaining.match(/^(\s*)(true|false|null)(,?\s*)/);
      if (boolMatch) {
        parts.push(<span key={key++}>{boolMatch[1]}</span>);
        parts.push(<span key={key++} className="text-amber-400">{boolMatch[2]}</span>);
        parts.push(<span key={key++}>{boolMatch[3]}</span>);
        remaining = remaining.slice(boolMatch[0].length);
        continue;
      }

      // Brackets, commas, whitespace — take one char
      parts.push(<span key={key++} className="text-muted-foreground">{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }

    return <div key={i}>{parts}</div>;
  });
}

// ---------------------------------------------------------------------------
// Build condensed decision view for the inspector
// ---------------------------------------------------------------------------

function buildInspectorJson(d: DecisionObject): string {
  return JSON.stringify({
    intent: d.classification.primary_intent,
    confidence: Math.round(d.classification.confidence * 1000) / 1000,
    secondary: d.classification.secondary_intent,
    template: d.decision.template_id,
    headline: d.decision.headline,
    cta: d.decision.cta_primary.label,
    section_order: d.decision.section_order,
    social_proof: d.decision.social_proof,
    reasoning: d.classification.reasoning,
    fallback: d.fallback_used,
  }, null, 2);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TailoredLens = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIntent, setActiveIntent] = useState<Intent>('RESEARCH');
  const [decision, setDecision] = useState<DecisionObject | null>(null);
  const [utmTerm, setUtmTerm] = useState('');
  const [referrer, setReferrer] = useState('google');
  const [device, setDevice] = useState<Device>('desktop');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync with the live engine decision when the panel opens
  useEffect(() => {
    const current = window.__tailored_decision ?? getCurrentDecision();
    if (current) {
      setDecision(current);
      setActiveIntent(current.classification.primary_intent);
    }
  }, [isExpanded]);

  const handleExpand = () => {
    setIsAnimating(true);
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsAnimating(false);
    }, 280);
  };

  const handleIntentClick = (intent: Intent) => {
    setActiveIntent(intent);
    const result = injectPersonalization(undefined, intent);
    if (result) setDecision(result);
  };

  const handleDetectIntent = () => {
    const overrides: SignalOverrides = {};

    if (utmTerm.trim()) {
      const encoded = encodeURIComponent(utmTerm.trim());
      overrides.url = `${window.location.origin}/?utm_term=${encoded}`;
    }

    overrides.referrer = REFERRER_URL_MAP[referrer] ?? '';
    overrides.viewportWidth = device === 'mobile' ? 375 : 1200;

    const result = injectPersonalization(overrides);
    if (result) {
      setDecision(result);
      setActiveIntent(result.classification.primary_intent);
    }
  };

  const handleCopyJson = async () => {
    const json = decision ? JSON.stringify(decision, null, 2) : '{}';
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleCollapse();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Collapsed pill button
  if (!isExpanded && !isAnimating) {
    return (
      <button
        onClick={handleExpand}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full glass-strong border border-border/60 hover:border-primary/50 transition-all duration-300 group"
        aria-label="Open Tailored Lens panel"
      >
        <span className="relative flex items-center justify-center">
          <Target className="w-4 h-4 text-primary" />
          <span className="absolute inset-0 animate-ping opacity-30">
            <Target className="w-4 h-4 text-primary" />
          </span>
        </span>
        <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
          Tailored Lens
        </span>
      </button>
    );
  }

  // Expanded panel
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 w-[400px] max-h-[85vh] rounded-xl glass-strong border border-border/60 shadow-2xl overflow-hidden flex flex-col",
        isExpanded && !isAnimating && "animate-in slide-in-from-bottom-4 fade-in duration-300",
        isAnimating && !isExpanded && "animate-out slide-out-to-bottom-4 fade-out duration-280"
      )}
      role="dialog"
      aria-label="Tailored Lens personalization debugger"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card/40">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">Tailored Lens</span>
        </div>
        <button
          onClick={handleCollapse}
          className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
          aria-label="Minimize panel"
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Intent Simulator */}
        <div className="p-4 border-b border-border/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Intent Simulator
          </h3>
          <div className="flex flex-wrap gap-2">
            {intentPills.map(({ id, label, icon: Icon, colorClass, glowClass }) => (
              <button
                key={id}
                onClick={() => handleIntentClick(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200",
                  colorClass,
                  activeIntent === id && glowClass
                )}
                aria-pressed={activeIntent === id}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Active Intent: <span className="text-foreground font-medium">{activeIntent.replace('_', ' ')}</span>
            {decision && (
              <span className="ml-2 text-blue-400">
                ({Math.round(decision.classification.confidence * 100)}% confidence)
              </span>
            )}
          </p>
        </div>

        {/* Signal Override */}
        <div className="p-4 border-b border-border/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Signal Override
          </h3>
          <div className="space-y-3">
            {/* UTM Term */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">UTM Term</label>
              <Input
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="e.g. best gaming laptop"
                className="h-8 text-xs bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

            {/* Referrer */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Referrer</label>
              <Select value={referrer} onValueChange={setReferrer}>
                <SelectTrigger className="h-8 text-xs bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="google">Google (search)</SelectItem>
                  <SelectItem value="reddit">Reddit (social)</SelectItem>
                  <SelectItem value="wirecutter">Wirecutter (review site)</SelectItem>
                  <SelectItem value="instagram">Instagram (social)</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Device Toggle */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Device</label>
              <div className="flex gap-1 p-1 rounded-lg bg-background/50 border border-border/50">
                <button
                  onClick={() => setDevice('desktop')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    device === 'desktop'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    device === 'mobile'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile
                </button>
              </div>
            </div>

            {/* Detect Intent Button */}
            <Button
              size="sm"
              className="w-full h-8 text-xs mt-2"
              onClick={handleDetectIntent}
            >
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Detect Intent
            </Button>
          </div>
        </div>

        {/* Decision Inspector */}
        <div className="p-4">
          <Accordion type="single" collapsible defaultValue="decision">
            <AccordionItem value="decision" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Decision Inspector
                </h3>
              </AccordionTrigger>
              <AccordionContent className="pt-3 pb-0">
                {/* JSON Viewer */}
                <div className="rounded-lg bg-background/60 border border-border/40 p-3 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-hide">
                  {decision ? (
                    highlightJson(buildInspectorJson(decision))
                  ) : (
                    <span className="text-muted-foreground italic">
                      No decision yet — click an intent or detect
                    </span>
                  )}
                </div>

                {/* Copy Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyJson}
                  className="w-full h-8 text-xs mt-3 border-border/50"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy Decision JSON
                    </>
                  )}
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-card/40">
        <span className="text-[10px] text-muted-foreground">
          Tailored v1.0 — Live Engine
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCollapse}
          className="h-7 px-3 text-xs"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
