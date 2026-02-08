import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Info } from "lucide-react";
import type { ResolvedDecision } from "@/engine";

interface PersonaSimulatorProps {
  persona: string | null;
  onPersonaChange: (persona: string | null) => void;
  decision: ResolvedDecision | null;
}

const PERSONA_OPTIONS: { value: string; label: string }[] = [
  { value: "__AUTO__", label: "Auto (from URL)" },
  { value: "BUY_NOW", label: "Buy Now" },
  { value: "COMPARE", label: "Compare" },
  { value: "USE_CASE_GAMING", label: "Use Case: Gaming" },
  { value: "USE_CASE_WORK", label: "Use Case: Work" },
  { value: "USE_CASE_DESIGN", label: "Use Case: Design" },
  { value: "BUDGET", label: "Budget" },
  { value: "BROWSE", label: "Browse" },
];

const PersonaSimulator = ({ persona, onPersonaChange, decision }: PersonaSimulatorProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Simulate Intent</span>
        </div>
        <Select
          value={persona ?? "__AUTO__"}
          onValueChange={(v) => onPersonaChange(v === "__AUTO__" ? null : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Auto from URL" />
          </SelectTrigger>
          <SelectContent>
            {PERSONA_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {decision && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              Why this variant? <ChevronDown className="h-3 w-3" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="mt-2 text-xs bg-muted/50 p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(
                  {
                    intent: decision.intent,
                    template_id: decision.template_id,
                    cta: decision.cta_text,
                    confidence: decision.confidence,
                    reasoning: decision.reasoning,
                  },
                  null,
                  2
                )}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default PersonaSimulator;
