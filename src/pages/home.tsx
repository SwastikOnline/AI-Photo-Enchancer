import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import ImageEnhancer from "@/components/image-enhancer";
import FeaturesSection from "@/components/features-section";
import PricingSection from "@/components/pricing-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ImageEnhancer />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
