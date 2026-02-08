import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryNav } from '@/components/CategoryNav';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { DealsSection } from '@/components/DealsSection';
import { BuyingGuides } from '@/components/BuyingGuides';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { TailoredLens } from '@/components/TailoredLens';
import { HeroUrgency, HeroComparison, HeroLifestyle, HeroValue, HeroGuide, HeroGift } from '@/components/heroes';
import { useTailored } from '@/contexts/TailoredContext';
import type { ComponentType } from 'react';

const HERO_MAP: Record<string, ComponentType> = {
  hero_urgency: HeroUrgency,
  hero_comparison: HeroComparison,
  hero_lifestyle: HeroLifestyle,
  hero_value: HeroValue,
  hero_guide: HeroGuide,
  hero_gift: HeroGift,
};

const SECTION_MAP: Record<string, ComponentType> = {
  deals: DealsSection,
  guides: BuyingGuides,
  reviews: ReviewsSection,
};

const Index = () => {
  const { decision } = useTailored();

  const HeroComponent = decision
    ? HERO_MAP[decision.decision.template] ?? HeroSection
    : HeroSection;

  const sectionOrder = decision?.decision.section_order ?? ['deals', 'guides', 'reviews'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div
          key={decision?.decision.template ?? 'default'}
          className="animate-in fade-in duration-500"
        >
          <HeroComponent />
        </div>
        <CategoryNav />
        <FeaturedProducts />
        {sectionOrder.map(key => {
          const Section = SECTION_MAP[key];
          return Section ? <Section key={key} /> : null;
        })}
      </main>
      <Footer />
      <TailoredLens />
    </div>
  );
};

export default Index;
