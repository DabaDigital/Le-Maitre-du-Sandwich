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

const photo = entrecote.main;

/** "Plus qu'un sandwich": the copy beside a close-up the camera slowly pulls back from. */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-closeup]",
        { scale: 1.75 },
        {
          scale: 1.35,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      aria-labelledby="experience-title"
      className="relative isolate overflow-hidden bg-void py-10 text-paper lg:py-6"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-0">
        <div className="relative z-10 px-5 lg:pl-[5vw] lg:pr-0">
          <p className="kicker">Une expérience unique</p>
          <h2 id="experience-title" className="display mt-3 text-[15vw] sm:text-7xl lg:text-[clamp(3.5rem,5.6vw,6rem)]">
            Plus qu&apos;un
            <br />
            sandwich
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/65">
            Des portions généreuses, un pain croustillant, des viandes savoureuses et des recettes travaillées pour une
            expérience incomparable.
          </p>
          <ButtonLink href="/menu" variant="light" arrow className="mt-8">
            Commander maintenant
          </ButtonLink>
        </div>

        {photo && (
          <div
            aria-hidden
            className="relative mx-5 aspect-[4/3] overflow-hidden rounded-card border border-paper/10 lg:mx-0 lg:aspect-[16/10] lg:rounded-none lg:border-0 lg:[mask-image:linear-gradient(to_right,transparent,#000_22%),linear-gradient(to_bottom,transparent,#000_12%,#000_85%,transparent)] lg:[mask-composite:intersect]"
          >
            <div data-closeup className="size-full origin-[58%_52%] scale-[1.4]">
              <AssetImage asset={photo} alt="" fit="cover" feather={false} sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
