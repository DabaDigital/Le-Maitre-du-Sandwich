"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { brand } from "@/lib/assets";
import { useReducedMotion } from "@/lib/motion";
import { hours, nav, site, socials } from "@/lib/site";
import { stores } from "@/lib/stores";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The closing scene on every page: a crown turning slowly as it sinks into the dark. */
export function Finale() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-finale-crown]",
        { scale: 1.25, yPercent: -12, autoAlpha: 1, filter: "blur(0px)" },
        {
          scale: 0.45,
          yPercent: 30,
          autoAlpha: 0.08,
          filter: "blur(6px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-finale-line]",
        { yPercent: 40, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "top 20%", scrub: true },
        },
      );
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <footer ref={root} className="relative overflow-hidden bg-void text-paper">
      <div className="relative flex min-h-[130svh] flex-col px-5 pb-10 pt-32 lg:px-[5vw]">
        {/* Crown lit from above, disappearing into black. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="sticky top-0 grid h-svh place-items-center">
            <div className="absolute inset-0 bg-[radial-gradient(40%_36%_at_50%_45%,#222_0%,#0b0b0b_55%,#050505_80%)]" />
            {brand.footerCrown && (
              <div data-finale-crown className="relative w-[min(58vw,540px)] [perspective:1200px]">
                <div className="animate-[spin-slow_9s_ease-in-out_infinite_alternate] [transform-style:preserve-3d]">
                  <AssetImage asset={brand.footerCrown} alt="" sizes="540px" />
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="display relative text-center text-[24vw] lg:text-[11.5vw]">
          <span data-finale-line className="block">
            Good food.
          </span>
          <span data-finale-line className="block">
            Good mood.
          </span>
        </p>

        <div className="relative mt-auto grid gap-12 pt-24 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <p className="eyebrow text-paper/50">Commandes &amp; infos</p>
            <a href={site.phoneHref} className="mt-4 block text-4xl font-black tracking-tight hover:underline lg:text-5xl">
              {site.phone}
            </a>
            <ButtonLink href="/menu" variant="light" size="lg" className="mt-8">
              Commander maintenant
            </ButtonLink>
          </div>
          <nav aria-label="Pied de page">
            <p className="eyebrow text-paper/50">Le site</p>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/75 hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow text-paper/50">Casablanca</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/75">
              {stores.map((store) => (
                <li key={store.id}>{store.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-paper/50">Horaires</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/75">
              {hours.map((slot) => (
                <li key={slot.days}>
                  {slot.days} · {slot.time}
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex gap-4 text-sm">
              {socials.map((social) =>
                social.href ? (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {social.label}
                    </a>
                  </li>
                ) : (
                  <li key={social.label} className="text-paper/30" title="Bientôt disponible">
                    {social.label}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="relative mt-16 flex flex-col justify-between gap-2 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.city}
          </p>
          <p>{site.slogan}</p>
        </div>
      </div>
    </footer>
  );
}
