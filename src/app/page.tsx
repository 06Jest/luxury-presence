import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactVisit } from "@/components/sections/ContactVisit";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { PropertySearch } from "@/components/sections/PropertySearch";
import { Services } from "@/components/sections/Services";
import { TrackRecord } from "@/components/sections/TrackRecord";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustLogos } from "@/components/sections/TrustLogos";
import Chatbot from "@/components/sections/ChatBox";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Intro />
        <TrackRecord />
        <PropertySearch />
        <Gallery />
        <Services />
        <TrustLogos />
        <Testimonials />
        <ContactVisit />
      </main>
      <Chatbot />
      <SiteFooter />
    </>
  );
}
