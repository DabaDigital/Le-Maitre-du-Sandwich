"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { entrecote } from "@/lib/assets";
import { useReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const { exploded, ingredients } = entrecote;
// All leader lines end on one column, just right of the widest ingredient (% of the image width).
const COLUMN = 90;

/** "Un sandwich d'exception": the Entrecôte opened up, each ingredient named beside it. */
export function SavoirFaire() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !exploded) return;
      const q = gsap.utils.selector(root.current);
      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: q("[data-stage]")[0], start: "top 85%", end: "center 50%", scrub: 1 },
        })
        .fromTo(q("[data-exploded]"), { autoAlpha: 0, scale: 0.86, y: 60 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1 }, 0)
        .fromTo(q("[data-leader]"), { scaleX: 0 }, { scaleX: 1, duration: 0.35, stagger: 0.06 }, 0.55)
        .fromTo(q("[data-label]"), { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.06 }, 0.6);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="savoir-faire"
      aria-labelledby="savoir-faire-title"
      className="relative isolate overflow-hidden bg-void px-5 py-16 text-paper lg:px-[5vw] lg:py-14"
    >
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="kicker">Notre savoir-faire</p>
          <h2 id="savoir-faire-title" className="display mt-3 text-[15vw] sm:text-7xl lg:text-[clamp(3.5rem,5.2vw,5.5rem)]">
            Un sandwich
            <br />
            d&apos;exception
          </h2>
          <p className="mt-6 text-[13px] font-bold uppercase leading-relaxed tracking-[0.14em] text-flame">
            Des ingrédients qui font
            <br />
            toute la différence.
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/65">
            Chaque sandwich est une composition maîtrisée, avec des ingrédients frais et soigneusement sélectionnés pour
            un équilibre parfait entre saveurs et générosité.
          </p>
          <p aria-hidden className="mt-8 -rotate-6 font-script text-5xl text-paper/80">
            Le Maître
          </p>
        </div>

        {exploded && (
          <div>
          {/* Large screens: the right padding leaves room for the labels, which sit past the image's
              right edge. Phones and tablets: the image (--w wide) runs off the left of the screen by
              33/70 of its width, so the labels' column (90% of it) lands at 3/7 of --w from the edge. */}
          <div className="max-lg:-mx-5 lg:pr-[14rem]">
            <div
              data-stage
              className="@container relative max-lg:-ml-[calc(var(--w)*33/70)] max-lg:w-(--w) max-lg:[--w:min(140vw,900px)]"
              style={{ aspectRatio: `${exploded.w} / ${exploded.h}` }}
            >
              <div
                aria-hidden
                className="absolute -inset-[10%] bg-[radial-gradient(closest-side,rgb(150_80_40/0.28),transparent)]"
              />
              <div data-exploded className="absolute inset-0">
                <AssetImage
                  asset={exploded}
                  alt="L'Entrecôte ouverte, ingrédient par ingrédient"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
              <ol aria-label="Les ingrédients">
                {ingredients.map(({ label, note, y, x }) => (
                  <li
                    key={label}
                    className="absolute z-10 flex items-center"
                    style={{ top: `${y}%`, left: `${x}%`, translate: "0 -50%" }}
                  >
                    <span
                      data-leader
                      aria-hidden
                      className="relative block h-px origin-left bg-paper/35"
                      style={{ width: `${COLUMN - x}cqw` }}
                    >
                      <span className="absolute -left-0.5 -top-[2px] size-[5px] rounded-full bg-paper/70" />
                    </span>
                    {/* Phones: as wide as the space between the column and the screen edge. */}
                    <span data-label className="block w-[calc(100vw-var(--w)*3/7-16px)] pl-3 lg:w-52">
                      <span className="block text-[10px] font-bold uppercase leading-tight tracking-[0.1em] max-[380px]:tracking-[0.04em] sm:text-[11px] sm:leading-normal sm:tracking-[0.14em]">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-snug text-paper/55 max-[380px]:text-[9px] sm:text-[11px]">{note}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
            <ButtonLink href="/ambiances" variant="outline-light" arrow className="mt-8 w-full lg:hidden">
              Découvrir notre histoire
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
