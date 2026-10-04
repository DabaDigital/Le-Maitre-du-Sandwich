import type { Metadata } from "next";
import { AssetImage, FoodPhoto } from "@/components/food/FoodPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { brand, productPhoto, type Asset } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Nos Ambiances",
  description: "Un comptoir urbain, une cuisine ouverte et une seule obsession : le goût. Good food, good mood.",
};

const pillars = [
  {
    title: "Produits frais",
    text: "Des ingrédients sélectionnés chaque jour : légumes croquants, viande de qualité, pain chaud.",
    visual: productPhoto("entrecote"),
  },
  {
    title: "Recettes maison",
    text: "Nos sauces signature et nos recettes sont préparées en cuisine, pas ailleurs.",
    visual: productPhoto("classic-xxl"),
  },
  {
    title: "Esprit Casablanca",
    text: "Trois adresses, une même énergie urbaine, directe et généreuse.",
    visual: brand.fries,
  },
];

/** Inline food between words: the editorial trick that keeps the food in the sentence. */
function Inline({ asset }: { asset: Asset | null }) {
  if (!asset) return null;
  return (
    <span className="mx-[0.12em] inline-block w-[2.2em] align-middle">
      <AssetImage asset={asset} alt="" sizes="160px" />
    </span>
  );
}

export default function AmbiancesPage() {
  return (
    <>
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-void px-5 pb-16 pt-32 text-paper lg:px-[5vw] lg:pb-24">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(40%_40%_at_70%_40%,rgb(150_80_40/0.22),transparent_70%),radial-gradient(40%_30%_at_85%_100%,rgb(228_45_31/0.12),transparent_70%)]" />
        {brand.crown && (
          <div aria-hidden className="absolute right-[10vw] top-[18vh] w-[min(22vw,260px)] [perspective:1200px]">
            <div className="animate-[spin-slow_9s_ease-in-out_infinite_alternate]">
              <AssetImage asset={brand.crown} alt="" sizes="260px" preload />
            </div>
          </div>
        )}
        <p className="kicker relative">Nos ambiances</p>
        <h1 className="display relative mt-3 text-[19vw] lg:text-[12vw]">
          Good food,
          <br />
          good mood.
        </h1>
      </section>

      <section className="bg-void px-5 py-28 text-paper lg:px-[5vw] lg:py-40">
        <p className="display max-w-6xl text-[10vw] leading-[1.12] lg:text-[5vw]">
          Des baguettes <Inline asset={productPhoto("entrecote")} /> servies chaudes, des steaks saisis minute{" "}
          <Inline asset={productPhoto("classic-xxl")} />, des frites <Inline asset={brand.fries} /> coupées chaque jour. Une
          seule règle&nbsp;: pas de compromis sur le goût.
        </p>
      </section>

      <section className="bg-void text-paper">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className="grid items-center gap-10 border-t border-paper/10 px-5 py-20 lg:grid-cols-[4rem_1.3fr_1fr] lg:gap-16 lg:px-[5vw] lg:py-28"
          >
            <span className="kicker">0{index + 1}</span>
            <div>
              <h2 className="display text-[14vw] lg:text-[6.5vw]">{pillar.title}</h2>
              <p className="mt-6 max-w-md text-paper/60">{pillar.text}</p>
            </div>
            {pillar.visual && (
              <FoodPhoto asset={pillar.visual} alt="" sway className="max-w-[620px]" sizes="(min-width: 1024px) 35vw, 90vw" />
            )}
          </div>
        ))}
      </section>

      <section className="flame-surface flex flex-col items-start gap-10 px-5 py-24 text-paper lg:flex-row lg:items-end lg:justify-between lg:px-[5vw]">
        <h2 className="display text-[16vw] lg:text-[7.5vw]">
          Venez
          <br />
          nous voir.
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/localisations" variant="light" size="lg" arrow>
            Nos 3 adresses
          </ButtonLink>
          <ButtonLink href="/menu" variant="outline-light" size="lg">
            La carte
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
