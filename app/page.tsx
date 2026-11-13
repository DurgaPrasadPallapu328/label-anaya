import { AnnouncementBar } from "@/components/home/announcement-bar";
import { CategorySection } from "@/components/home/category-section";
import { Header } from "@/components/home/header";
import { HeroSection } from "@/components/home/hero-section";
import { TrustBenefits } from "@/components/home/trust-benefits";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <HeroSection />
        <CategorySection />
        <TrustBenefits />
      </main>
    </>
  );
}
