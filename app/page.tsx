import { About } from "@/components/about";
import { Advantages } from "@/components/advantages";
import { Contacts } from "@/components/contacts";
import { CtaSection } from "@/components/cta-section";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { Process } from "@/components/process";
import { RatingSummary } from "@/components/rating-summary";
import { Reviews } from "@/components/reviews";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Advantages />
        <About />
        <Process />
        <Gallery />
        <Reviews />
        <RatingSummary />
        <CtaSection />
        <Contacts />
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </>
  );
}
