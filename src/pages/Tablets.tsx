import { useState } from "react";
import Header from "@/components/Header";
import CategoryHeroSection, { TemplateType } from "@/components/CategoryHeroSection";
import TemplateSwitcher from "@/components/TemplateSwitcher";
import CategoryProducts from "@/components/CategoryProducts";
import SocialProof from "@/components/SocialProof";
import FeaturesSection from "@/components/FeaturesSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { tabletProducts } from "@/data/products";

import tabletsPower from "@/assets/tablets-power.jpg";
import tabletsValue from "@/assets/tablets-value.jpg";
import tabletsVersatility from "@/assets/tablets-versatility.jpg";

const tabletImages = {
  power: tabletsPower,
  value: tabletsValue,
  versatility: tabletsVersatility,
};

const Tablets = () => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("power");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CategoryHeroSection
          activeTemplate={activeTemplate}
          category="tablets"
          images={tabletImages}
        />
        <CategoryProducts
          title="Featured Tablets"
          description="Portable powerhouses for creativity, entertainment, and productivity."
          products={tabletProducts}
        />
        <SocialProof />
        <FeaturesSection />
        <Newsletter />
      </main>
      <Footer />
      <TemplateSwitcher
        activeTemplate={activeTemplate}
        onTemplateChange={setActiveTemplate}
      />
    </div>
  );
};

export default Tablets;
