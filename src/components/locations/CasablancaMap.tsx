"use client";

import { Navigation, Phone } from "lucide-react";
import { MAP_HEIGHT, MAP_WIDTH, districts, project } from "@/lib/casablanca";
import { cn } from "@/lib/cn";
import { useDesktop } from "@/lib/motion";
import { site } from "@/lib/site";
import { directionsUrl, stores } from "@/lib/stores";

const ZOOM = 2.6;
// Where the view rests (fraction of map height) when no restaurant is focused.
const REST_Y = 0.5;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type CasablancaMapProps = {
  active: string | null;
  onActive: (id: string | null) => void;
  className?: string;
};

/**
 * Stylized dark Casablanca drawn from OpenStreetMap data, with the restaurants as red pins. Focusing a restaurant zooms
 * the whole map toward it; pins counter-scale so they keep their size.
 */
export function CasablancaMap({ active, onActive, className }: CasablancaMapProps) {
  const desktop = useDesktop();
  // The map layer fills the frame's width; on desktop the frame is a wide strip, so the map overflows vertically.
  const frameAspect = desktop ? 21 / 9 : MAP_WIDTH / MAP_HEIGHT;
  const overflowY = (MAP_HEIGHT / MAP_WIDTH) * frameAspect;

  const store = stores.find((s) => s.id === active) ?? null;
  const focus = store ? project(store.lat, store.lng) : { x: 0.5, y: REST_Y };
  const scale = store ? ZOOM : 1;
  const tx = clamp((0.5 - focus.x * scale) * 100, (1 - scale) * 100, 0);
  const ty = clamp((0.5 / overflowY - focus.y * scale) * 100, (1 / overflowY - scale) * 100, 0);

  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-card border border-paper/10 bg-[#0c0c0c]", className)}
      style={{ aspectRatio: frameAspect }}
      onMouseLeave={() => onActive(null)}
    >
      <div
        className="absolute left-0 top-0 w-full origin-top-left transition-transform duration-[1400ms] ease-cine"
        style={{
          aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
          transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static vector map, no optimization needed */}
        <img src="/map/casablanca.svg" alt="" className="size-full select-none" draggable={false} />

        {districts.map((district) => {
          const p = project(district.lat, district.lng);
          return (
            <span
              key={district.name}
              aria-hidden
              className={cn(
                "eyebrow pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-[scale,opacity] duration-[1400ms] ease-cine",
                district.ocean ? "text-paper/25 tracking-[0.5em]" : "text-[9px] text-paper/30",
                store && "opacity-40",
              )}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, scale: 1 / scale }}
            >
              {district.name}
            </span>
          );
        })}

        {stores.map((s, index) => {
          const p = project(s.lat, s.lng);
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              aria-label={`${s.name} : ${s.address}`}
              onMouseEnter={() => onActive(s.id)}
              onFocus={() => onActive(s.id)}
              onClick={() => onActive(on ? null : s.id)}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 p-3"
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            >
              <span
                className="relative flex items-center gap-3 transition-[scale] duration-[1400ms] ease-cine"
                style={{ scale: 1 / scale }}
              >
                <span className="relative grid size-4 place-items-center">
                  <span
                    className="pin-ring absolute inset-0 rounded-full border border-flame"
                    style={{ animationDelay: `${index * 0.6}s` }}
                  />
                  <span
                    className={cn(
                      "size-3 rounded-full bg-flame shadow-[0_0_20px_4px_rgb(228_45_31/0.75)] transition-[scale] duration-500",
                      on && "scale-150",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "eyebrow whitespace-nowrap text-[10px] transition-colors",
                    on ? "text-paper" : "text-paper/60",
                  )}
                >
                  {s.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Focused restaurant: kept outside the zoomed layer so it never scales. */}
      <div
        aria-live="polite"
        className={cn(
          "absolute bottom-4 left-4 right-4 z-20 max-w-sm rounded-card border-l-2 border-flame bg-void/90 p-5 text-paper backdrop-blur transition-[opacity,translate] duration-700 ease-cine sm:right-auto lg:bottom-8 lg:left-8",
          store ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        {store && (
          <>
            <p className="kicker">Le Maître · {store.name}</p>
            <p className="mt-2 text-lg font-bold leading-snug">{store.address}</p>
            <p className="mt-1 text-sm text-paper/60">{store.hours}</p>
            <div className="mt-4 flex gap-5">
              <a
                href={directionsUrl(store)}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow inline-flex items-center gap-2 hover:underline"
              >
                <Navigation className="size-3.5" />
                Itinéraire
              </a>
              <a href={site.phoneHref} className="eyebrow inline-flex items-center gap-2 hover:underline">
                <Phone className="size-3.5" />
                Appeler
              </a>
            </div>
          </>
        )}
      </div>

      <p className="absolute bottom-2 right-3 z-20 text-[9px] text-paper/35">
        © contributeurs{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-paper"
        >
          OpenStreetMap
        </a>
      </p>
    </div>
  );
}
