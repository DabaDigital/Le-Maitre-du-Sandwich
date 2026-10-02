import { CinematicStory } from "@/components/home/CinematicStory";
import { MenuIndex } from "@/components/home/MenuIndex";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { LocationsSection } from "@/components/locations/LocationsSection";

export default function HomePage() {
  return (
    <>
      <CinematicStory />
      <ProductShowcase />
      <MenuIndex />
      <LocationsSection />
    </>
  );
}
