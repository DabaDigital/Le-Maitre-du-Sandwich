import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { NotreCarte } from "@/components/home/NotreCarte";
import { OrderBanner } from "@/components/home/OrderBanner";
import { SavoirFaire } from "@/components/home/SavoirFaire";
import { Signatures } from "@/components/home/Signatures";
import { LocationsSection } from "@/components/locations/LocationsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SavoirFaire />
      <Signatures />
      <NotreCarte />
      <Experience />
      <LocationsSection />
      <OrderBanner />
    </>
  );
}
