import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection, { TemplateType } from "@/components/HeroSection";
import TemplateSwitcher from "@/components/TemplateSwitcher";
import PersonaSimulator from "@/components/PersonaSimulator";
import FeaturedProducts from "@/components/FeaturedProducts";
import SocialProof from "@/components/SocialProof";
import FeaturesSection from "@/components/FeaturesSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { runPersonalizationPipeline } from "@/engine";
import type { ResolvedDecision } from "@/engine";

const Index = () => {
  const [decision, setDecision] = useState<ResolvedDecision | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("power");
  const [personaOverride, setPersonaOverride] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useManualTemplate, setUseManualTemplate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    runPersonalizationPipeline({ personaOverride: personaOverride ?? undefined })
      .then(({ decision: d }) => {
        if (!cancelled) {
          setDecision(d);
          setUseManualTemplate(false);
        }
      })
      .catch((err) => {
        if (!cancelled) console.error("[Personalization]", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [personaOverride]);

  const handleTemplateChange = (t: TemplateType) => {
    setActiveTemplate(t);
    setUseManualTemplate(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {loading ? (
          <section className="min-h-[90vh] flex items-center justify-center">
            <p className="text-muted-foreground">Loading personalized experience...</p>
          </section>
        ) : (
          <HeroSection
            activeTemplate={activeTemplate}
            decision={useManualTemplate ? null : decision}
          />
        )}
        <FeaturedProducts />
        <SocialProof />
        <FeaturesSection />
        <Newsletter />
      </main>
      <Footer />
      <TemplateSwitcher
        activeTemplate={activeTemplate}
        onTemplateChange={handleTemplateChange}
      />
      <PersonaSimulator
        persona={personaOverride}
        onPersonaChange={setPersonaOverride}
        decision={decision}
      />
    </div>
  );
};

export default Index;
