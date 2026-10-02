"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { brand } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { directionsUrl, stores } from "@/lib/stores";
import { CasablancaMap } from "./CasablancaMap";

/** Casablanca: the stylized map plus the three addresses as large type that drives it. */
export function LocationsSection({ as: Title = "h2" }: { as?: "h1" | "h2" }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="casablanca"
      aria-labelledby="casablanca-title"
      className="relative isolate overflow-hidden bg-void px-5 py-28 text-paper lg:px-[5vw] lg:py-40"
    >
      {/* Decorative skyline behind the title only; the map below stays geographic. */}
      {brand.cityscape && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80svh]">
          <AssetImage
            asset={brand.cityscape}
            alt=""
            fit="cover"
            feather={false}
            sizes="100vw"
            className="opacity-45 [mask-image:linear-gradient(to_bottom,#000_25%,transparent)]"
          />
        </div>
      )}
      <div className="flex flex-col gap-6">
        <Title id="casablanca-title" className="display text-[12vw] lg:text-[11.5vw]">
          Casablanca
        </Title>
        <p className="max-w-sm text-sm leading-relaxed text-paper/60 lg:ml-auto lg:text-base">
          Trois adresses. Une seule passion&nbsp;: le sandwich. Survolez une adresse pour vous y rendre.
        </p>
      </div>

      <CasablancaMap active={active} onActive={setActive} className="mt-12 lg:mt-16" />

      <ul className="mt-4">
        {stores.map((store, index) => (
          <li
            key={store.id}
            onMouseEnter={() => setActive(store.id)}
            className="border-b border-paper/10"
          >
            <div className="grid items-baseline gap-2 py-6 lg:grid-cols-[4rem_1fr_auto_auto] lg:gap-10 lg:py-8">
              <span className="eyebrow text-paper/40">0{index + 1}</span>
              <button
                type="button"
                onClick={() => setActive(store.id)}
                onFocus={() => setActive(store.id)}
                className={cn(
                  "display text-left text-[10vw] transition-colors duration-500 lg:text-[5.2vw]",
                  active && active !== store.id ? "text-paper/25" : "text-paper",
                )}
              >
                {store.name}
              </button>
              <span className="text-sm text-paper/55 lg:max-w-56">
                {store.address}
                <br />
                {store.hours}
              </span>
              <span className="flex gap-6">
                <a
                  href={directionsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow inline-flex items-center gap-1.5 hover:underline"
                >
                  Itinéraire
                  <ArrowUpRight className="size-3.5" />
                </a>
                <a href={site.phoneHref} className="eyebrow hover:underline">
                  Appeler
                </a>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
