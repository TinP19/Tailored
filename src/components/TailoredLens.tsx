import { useState, useEffect } from 'react';
import { 
  Zap, 
  GitCompare, 
  Gamepad2, 
  DollarSign, 
  BookOpen, 
  Gift,
  ChevronDown,
  ChevronUp,
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

type Intent = 'BUY_NOW' | 'COMPARE' | 'USE_CASE' | 'BUDGET' | 'RESEARCH' | 'GIFTING';
type Device = 'desktop' | 'mobile';

const intents: { id: Intent; label: string; icon: typeof Zap; colorClass: string; glowClass: string }[] = [
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

const getDecisionForIntent = (intent: Intent) => ({
  intent,
  confidence: intent === 'COMPARE' ? 0.87 : intent === 'BUY_NOW' ? 0.92 : 0.78,
  template: `hero_${intent.toLowerCase().replace('_', '')}`,
  headline: intent === 'COMPARE' 
    ? "Find Your Perfect Gaming Laptop"
    : intent === 'BUY_NOW'
    ? "MacBook Pro M4 — In Stock, Ships Today"
    : intent === 'BUDGET'
    ? "Premium Tech. Honest Prices."
    : intent === 'GIFTING'
    ? "Give the Gift of Great Tech"
    : intent === 'USE_CASE'
    ? "Built for Gaming. Ready for Anything."
    : "Your Tech Journey Starts Here",
  cta: intent === 'COMPARE' 
    ? "Compare All 5"
    : intent === 'BUY_NOW'
    ? "Buy Now — Free Next-Day Delivery"
    : intent === 'BUDGET'
    ? "Shop Best Value"
    : intent === 'GIFTING'
    ? "Shop Gift Guide"
    : intent === 'USE_CASE'
    ? "Shop Gaming Setups"
    : "Take the Quiz",
  reason: intent === 'COMPARE'
    ? "UTM contains 'best' → comparison signal (+0.4), referrer=google (+0.2)"
    : intent === 'BUY_NOW'
    ? "UTM contains 'buy' → urgency signal (+0.5), direct traffic (+0.3)"
    : "Inferred from browsing pattern and session signals"
});

export const TailoredLens = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIntent, setActiveIntent] = useState<Intent>('COMPARE');
  const [utmTerm, setUtmTerm] = useState('');
  const [referrer, setReferrer] = useState('google');
  const [device, setDevice] = useState<Device>('desktop');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const decision = getDecisionForIntent(activeIntent);

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

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(decision, null, 2));
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
            {intents.map(({ id, label, icon: Icon, colorClass, glowClass }) => (
              <button
                key={id}
                onClick={() => setActiveIntent(id)}
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
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
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
              onClick={() => {/* Visual feedback only */}}
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
                <div className="rounded-lg bg-background/60 border border-border/40 p-3 font-mono text-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    <span className="text-muted-foreground">{'{'}</span>{'\n'}
                    {'  '}<span className="text-muted-foreground">"intent"</span>: <span className="text-green-400">"{decision.intent}"</span>,{'\n'}
                    {'  '}<span className="text-muted-foreground">"confidence"</span>: <span className="text-blue-400">{decision.confidence}</span>,{'\n'}
                    {'  '}<span className="text-muted-foreground">"template"</span>: <span className="text-green-400">"{decision.template}"</span>,{'\n'}
                    {'  '}<span className="text-muted-foreground">"headline"</span>: <span className="text-green-400">"{decision.headline}"</span>,{'\n'}
                    {'  '}<span className="text-muted-foreground">"cta"</span>: <span className="text-green-400">"{decision.cta}"</span>,{'\n'}
                    {'  '}<span className="text-muted-foreground">"reason"</span>: <span className="text-green-400">"{decision.reason}"</span>{'\n'}
                    <span className="text-muted-foreground">{'}'}</span>
                  </pre>
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
          Tailored v1.0 — Personalization Engine
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
