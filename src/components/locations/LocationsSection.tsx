"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { brand } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { scrollToTarget } from "@/lib/scroll";
import { directionsUrl, stores } from "@/lib/stores";
import { CasablancaMap } from "./CasablancaMap";

/** Casablanca: the stylized map, with the three addresses below it driving the focus. */
export function LocationsSection({ as = "h2" }: { as?: "h1" | "h2" }) {
  const [active, setActive] = useState<string | null>(null);
  const map = useRef<HTMLDivElement>(null);

  function showOnMap(id: string) {
    setActive(id);
    // Phones: the map is above the list, so bring it into view to show the zoom.
    const box = map.current?.getBoundingClientRect();
    if (box && (box.top < 0 || box.bottom > window.innerHeight)) {
      scrollToTarget(window.scrollY + box.top - Math.max(80, (window.innerHeight - box.height) / 2));
    }
  }

  return (
    <section
      id="casablanca"
      aria-labelledby="casablanca-title"
      className="relative isolate overflow-hidden bg-void px-5 py-14 text-paper lg:px-[5vw] lg:py-16"
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
      <SectionHeading
        id="casablanca-title"
        as={as}
        kicker="Nos adresses"
        title="Casablanca"
        aside="Retrouvez Le Maître près de chez vous et profitez de vos sandwichs préférés dans nos 3 adresses."
      />

      <div ref={map} className="mt-10 lg:mt-12">
        <CasablancaMap active={active} onActive={setActive} />
      </div>

      {/* Phones: a swipeable row of address cards. */}
      <ul className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
        {stores.map((store) => (
          <li
            key={store.id}
            onMouseEnter={() => setActive(store.id)}
            className="flex w-[82vw] shrink-0 snap-start gap-4 rounded-card border border-paper/10 bg-coal p-5 sm:w-auto sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
          >
            <MapPin
              aria-hidden
              className={cn(
                "mt-0.5 size-7 shrink-0 transition-colors duration-500",
                active && active !== store.id ? "text-paper/30" : "text-flame",
              )}
              strokeWidth={2}
            />
            <div>
              <h3 className="display text-[1.75rem] lg:text-[clamp(1.75rem,2.3vw,2.25rem)]">{store.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">
                {store.address}
                <br />
                {store.hours}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button
                  variant="outline-light"
                  size="sm"
                  arrow
                  aria-pressed={active === store.id}
                  onClick={() => showOnMap(store.id)}
                >
                  Voir sur la carte
                </Button>
                <a
                  href={directionsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-paper/70 hover:text-paper"
                >
                  Itinéraire
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
