import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryNav } from '@/components/CategoryNav';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { DealsSection } from '@/components/DealsSection';
import { BuyingGuides } from '@/components/BuyingGuides';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { TailoredLens } from '@/components/TailoredLens';
import { injectPersonalization } from '@/engine/domInjector';

const Index = () => {
  useEffect(() => {
    // Run the personalization engine after React has mounted the DOM
    const timer = setTimeout(() => {
      injectPersonalization();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CategoryNav />
        <FeaturedProducts />
        <DealsSection />
        <BuyingGuides />
        <ReviewsSection />
      </main>
      <Footer />
      <TailoredLens />
    </div>
  );
};

export default Index;
