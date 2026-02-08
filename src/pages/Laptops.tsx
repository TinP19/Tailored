import { useState } from "react";
import Header from "@/components/Header";
import CategoryHeroSection, { TemplateType } from "@/components/CategoryHeroSection";
import TemplateSwitcher from "@/components/TemplateSwitcher";
import CategoryProducts from "@/components/CategoryProducts";
import SocialProof from "@/components/SocialProof";
import FeaturesSection from "@/components/FeaturesSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { laptopProducts } from "@/data/products";

import heroPower from "@/assets/hero-power.jpg";
import heroValue from "@/assets/hero-value.jpg";
import heroVersatility from "@/assets/hero-versatility.jpg";

const laptopImages = {
  power: heroPower,
  value: heroValue,
  versatility: heroVersatility,
};

const Laptops = () => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("power");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CategoryHeroSection
          activeTemplate={activeTemplate}
          category="laptops"
          images={laptopImages}
        />
        <CategoryProducts
          title="Featured Laptops"
          description="Powerful machines for work, play, and everything in between."
          products={laptopProducts}
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

export default Laptops;
