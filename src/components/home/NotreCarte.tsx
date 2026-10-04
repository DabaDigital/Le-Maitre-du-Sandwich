import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AssetImage } from "@/components/food/FoodPhoto";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryVisuals } from "@/lib/assets";
import { fitGlyphs } from "@/lib/display-fit";
import { categories, productsIn } from "@/lib/menu";

/** The four menu categories as cards, each opening its part of the menu. */
export function NotreCarte() {
  return (
    <section id="la-carte" aria-labelledby="la-carte-title" className="bg-void px-5 py-14 text-paper lg:px-[5vw] lg:py-16">
      <SectionHeading
        id="la-carte-title"
        kicker="Découvrez toutes nos catégories"
        title="Notre carte"
        aside="Des sandwichs pour toutes les envies."
      />
      {/* Phones: a swipeable row of cards. */}
      <ul className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:mt-12 lg:grid-cols-4 lg:gap-5">
        {categories.map((category) => {
          const visual = categoryVisuals[category.id];
          const count = productsIn(category.id).length;
          const words = category.name.split(" ");
          return (
            <li key={category.id} className="w-[68vw] shrink-0 snap-start sm:w-auto">
              <Link
                href={`/menu#${category.id}`}
                className="group @container relative isolate flex aspect-[4/5] flex-col overflow-hidden rounded-card border border-paper/10 bg-coal p-5 transition-colors duration-500 hover:border-flame/50 sm:p-6 lg:aspect-[5/6]"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_70%_75%,rgb(150_80_40/0.2),transparent_70%)]"
                />
                <h3
                  className="display relative z-10 text-[length:min(44px,calc(94cqw/var(--glyphs)))] leading-[0.95]"
                  style={{ ["--glyphs" as string]: fitGlyphs(words) }}
                >
                  {words.map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))}
                </h3>

                {visual ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-[22%] bottom-[14%] w-[118%] transition-transform duration-[900ms] ease-cine group-hover:-translate-y-2 group-hover:-rotate-3 group-hover:scale-105"
                  >
                    <AssetImage asset={visual} alt="" sizes="(min-width: 1024px) 26vw, 55vw" />
                  </div>
                ) : (
                  <p className="mt-3 max-w-[13rem] text-xs leading-relaxed text-paper/55">
                    {category.tagline}
                    <span className="mt-1 block text-paper/35">
                      {count} produit{count > 1 ? "s" : ""}
                    </span>
                  </p>
                )}

                <span className="relative mt-auto inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                  Voir le menu
                  <ArrowRight
                    className="size-3.5 text-flame transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
