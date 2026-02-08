import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryNav } from '@/components/CategoryNav';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { DealsSection } from '@/components/DealsSection';
import { BuyingGuides } from '@/components/BuyingGuides';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { TailoredLens } from '@/components/TailoredLens';

const Index = () => {
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
