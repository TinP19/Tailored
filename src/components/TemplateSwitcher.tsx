import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Zap, DollarSign, Layers } from "lucide-react";
import type { TemplateType } from "./HeroSection";

interface TemplateSwitcherProps {
  activeTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const templates = [
  {
    id: "power" as TemplateType,
    label: "Power",
    icon: Zap,
    description: "Performance focus",
  },
  {
    id: "value" as TemplateType,
    label: "Value",
    icon: DollarSign,
    description: "Budget focus",
  },
  {
    id: "versatility" as TemplateType,
    label: "Versatility",
    icon: Layers,
    description: "Flexibility focus",
  },
];

const TemplateSwitcher = ({ activeTemplate, onTemplateChange }: TemplateSwitcherProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-2">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground px-3 hidden sm:block">
            Preview Template:
          </span>
          <ToggleGroup
            type="single"
            value={activeTemplate}
            onValueChange={(value) => value && onTemplateChange(value as TemplateType)}
            className="gap-1"
          >
            {templates.map((template) => (
              <ToggleGroupItem
                key={template.id}
                value={template.id}
                aria-label={template.label}
                className="flex items-center gap-2 px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all"
              >
                <template.icon className="h-4 w-4" />
                <span className="font-medium">{template.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default TemplateSwitcher;
