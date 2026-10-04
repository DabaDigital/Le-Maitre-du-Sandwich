import type { Metadata } from "next";
import { MenuCategory } from "@/components/menu/MenuCategory";
import { MenuNav } from "@/components/menu/MenuNav";
import { categories, productsIn } from "@/lib/menu";

export const metadata: Metadata = {
  title: "La carte",
  description:
    "Hot baguettes, burgers XXL, accompagnements et boissons. Commandez en ligne, livraison offerte à Casablanca.",
};

export default function MenuPage() {
  return (
    <>
      <header className="relative isolate overflow-hidden bg-void px-5 pb-14 pt-32 text-paper lg:px-[5vw] lg:pb-20 lg:pt-40">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_80%_40%,rgb(150_80_40/0.2),transparent_70%),radial-gradient(35%_40%_at_95%_100%,rgb(228_45_31/0.12),transparent_70%)]"
        />
        <p className="kicker">Livraison offerte · Casablanca</p>
        <h1 className="display mt-3 text-[28vw] lg:text-[14vw]">La carte</h1>
        <p className="mt-6 max-w-md text-paper/60">
          Choisissez, personnalisez, commandez. Cliquez sur un produit pour le faire tourner et le composer.
        </p>
      </header>
      <MenuNav />
      {categories.map((category, index) => (
        <MenuCategory
          key={category.id}
          category={category}
          items={productsIn(category.id)}
          index={index}
        />
      ))}
    </>
  );
}
