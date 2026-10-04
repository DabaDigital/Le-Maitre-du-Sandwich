"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { entrecote } from "@/lib/assets";
import { useReducedMotion } from "@/lib/motion";
import { site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const photo = entrecote.main;

/** Opening scene: a full-screen hero, the title on the left and the banner photo glowing on the right. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Leaving the hero: the copy lifts away and the photo sinks slowly (parallax). The phrase sits on
  // the photo, so it sinks with it by the same distance.
  useGSAP(
    () => {
      if (reduced) return;
      const scrollTrigger = { trigger: root.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true };
      const photoEl = root.current?.querySelector<HTMLElement>("[data-hero-photo]");
      gsap.to("[data-hero-photo]", { y: () => (photoEl?.offsetHeight ?? 0) * 0.12, ease: "none", scrollTrigger });
      gsap.to("[data-hero-copy]", { yPercent: -50, autoAlpha: 0.15, ease: "none", scrollTrigger });
      gsap.to("[data-hero-script]", { yPercent: -100, autoAlpha: 0.15, ease: "none", scrollTrigger });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col overflow-hidden bg-void pb-30 pt-24 text-paper lg:min-h-svh lg:justify-center lg:pb-16 lg:pt-0"
    >
      {/* Light, embers and smoke; the photo's orange glow carries on up behind the nav. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(38%_55%_at_96%_4%,rgb(215_100_25/0.5),rgb(130_55_12/0.2)_45%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_62%,rgb(150_80_40/0.2),transparent_70%)] lg:bg-[radial-gradient(42%_52%_at_70%_46%,rgb(150_80_40/0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_85%_100%,rgb(228_45_31/0.12),transparent_70%)]" />
        <div className="smoke right-[2%] top-[4%] size-[48vw]" />
        <div className="smoke right-[24%] top-[-12%] size-[30vw] [animation-delay:-6s]" />
        <div className="smoke right-[-8%] top-[30%] size-[36vw] [animation-delay:-11s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div data-hero-copy className="relative z-10 px-5 lg:max-w-[56vw] lg:px-[5vw]">
        <p className="kicker rise">Depuis toujours</p>
        <h1
          id="hero-title"
          className="display rise mt-4 text-[13vw] text-paper [text-shadow:0_6px_40px_rgb(0_0_0/0.6)] lg:text-[clamp(4rem,7.4vw,8.5rem)]"
          style={{ ["--delay" as string]: "80ms" }}
        >
          Le Maître
          <br />
          du Sandwich
        </h1>
        <p
          className="rise mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper lg:text-[15px] lg:tracking-[0.3em]"
          style={{ ["--delay" as string]: "180ms" }}
        >
          {site.slogan}
        </p>
        <p
          className="rise mt-5 max-w-sm text-sm leading-relaxed text-paper/65 max-lg:text-paper/80 max-lg:[text-shadow:0_2px_12px_rgb(0_0_0/0.9)]"
          style={{ ["--delay" as string]: "260ms" }}
        >
          Des recettes généreuses, des ingrédients soigneusement sélectionnés et un goût unique qui fait toute la
          différence.
        </p>
        <div className="rise mt-8" style={{ ["--delay" as string]: "340ms" }}>
          <ButtonLink href="/menu" variant="light" arrow>
            Commander maintenant
          </ButtonLink>
        </div>
      </div>

      {photo && (
        // A banner photo. Large screens: a little wider than the screen (both edges run off it),
        // centred slightly above the middle, sandwich on the right and black under the copy. Phones:
        // it rises behind the paragraph and button, the sandwich crossing below them and running off the
        // right edge. "lighten" lets its black areas take on the scene behind them.
        <div className="pointer-events-none relative -ml-[61vw] -mt-[46vw] w-[200vw] max-w-none self-start mix-blend-lighten lg:absolute lg:-left-[2vw] lg:top-[43%] lg:m-0 lg:w-[103vw] lg:-translate-y-1/2">
          {/* Separate wrappers so scroll parallax, entrance and idle motion never share a transform. */}
          <div data-hero-photo>
            <div className="hero-enter" style={{ ["--delay" as string]: "150ms" }}>
              <div className="breathe">
                <AssetImage
                  asset={photo}
                  alt="L'Entrecôte, notre baguette signature"
                  preload
                  feather={false}
                  className="hero-feather"
                  sizes="(min-width: 1024px) 103vw, 200vw"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The wrapper takes the scroll drift; the phrase inside keeps its own entrance animation. */}
      <div
        data-hero-script
        aria-hidden
        className="pointer-events-none absolute bottom-16 right-5 z-10 lg:bottom-[20vh] lg:right-[5vw]"
      >
        <p
          className="rise -rotate-[9deg] text-right font-script text-[2.6rem] leading-[0.85] text-paper/90 lg:text-[clamp(2.6rem,3.6vw,3.8rem)]"
          style={{ ["--delay" as string]: "700ms" }}
        >
          Du goût
          <br />
          <span className="pl-10">Sans compromis</span>
        </p>
      </div>

      <a
        href="#savoir-faire"
        className="rise absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 text-[9px] font-bold uppercase leading-snug tracking-[0.2em] text-paper/70 transition-colors hover:text-paper lg:bottom-16"
        style={{ ["--delay" as string]: "900ms" }}
      >
        <span aria-hidden className="flex h-8 w-5 justify-center rounded-full border-2 border-paper/60 pt-1.5">
          <span className="block h-1.5 w-1 animate-[wheel_1.8s_var(--ease-cine)_infinite] rounded-full bg-flame" />
        </span>
        Scroller
        <br />
        pour découvrir
      </a>
    </section>
  );
}
