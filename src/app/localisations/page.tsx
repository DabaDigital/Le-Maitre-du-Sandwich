import type { Metadata } from "next";
import { LocationsSection } from "@/components/locations/LocationsSection";

export const metadata: Metadata = {
  title: "Casablanca",
  description: "Nos 3 restaurants à Casablanca : Sidi Maârouf, Allée des Mimosas et Bd Emile Zola.",
};

export default function LocationsPage() {
  return (
    <div className="bg-void pt-12">
      <LocationsSection as="h1" />
    </div>
  );
}
