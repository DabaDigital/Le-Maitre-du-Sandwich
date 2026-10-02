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
      <header className="bg-void px-5 pb-16 pt-36 text-paper lg:px-[5vw] lg:pb-24 lg:pt-48">
        <p className="eyebrow text-paper/50">Livraison offerte · Casablanca</p>
        <h1 className="display mt-6 text-[26vw] lg:text-[17vw]">La carte</h1>
        <p className="mt-8 max-w-md text-paper/60">
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
