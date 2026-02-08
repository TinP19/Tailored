import { useState } from "react";
import Header from "@/components/Header";
import CategoryHeroSection, { TemplateType } from "@/components/CategoryHeroSection";
import TemplateSwitcher from "@/components/TemplateSwitcher";
import CategoryProducts from "@/components/CategoryProducts";
import SocialProof from "@/components/SocialProof";
import FeaturesSection from "@/components/FeaturesSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { tvProducts } from "@/data/products";

import tvsPower from "@/assets/tvs-power.jpg";
import tvsValue from "@/assets/tvs-value.jpg";
import tvsVersatility from "@/assets/tvs-versatility.jpg";

const tvImages = {
  power: tvsPower,
  value: tvsValue,
  versatility: tvsVersatility,
};

const TVs = () => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("power");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CategoryHeroSection
          activeTemplate={activeTemplate}
          category="tvs"
          images={tvImages}
        />
        <CategoryProducts
          title="Featured TVs"
          description="Stunning displays for gaming, movies, and everything you love to watch."
          products={tvProducts}
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

export default TVs;
