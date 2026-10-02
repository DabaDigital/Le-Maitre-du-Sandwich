"use client";

import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { categoryVisuals } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { categories, productsIn } from "@/lib/menu";

/** The menu as four giant words; the food follows the cursor over each one. */
export function MenuIndex() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const movers = useRef<((value: number) => void)[] | null>(null);
  const [active, setActive] = useState<number | null>(null);

  function follow(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || !preview.current || !root.current) return;
    movers.current ??= [
      gsap.quickTo(preview.current, "x", { duration: 0.9, ease: "power3" }),
      gsap.quickTo(preview.current, "y", { duration: 0.9, ease: "power3" }),
      gsap.quickTo(preview.current, "rotation", { duration: 1.2, ease: "power3" }),
    ];
    const box = root.current.getBoundingClientRect();
    const [x, y, rotate] = movers.current;
    x(event.clientX - box.left);
    y(event.clientY - box.top);
    rotate((event.movementX || 0) * 0.6);
  }

  return (
    <section
      ref={root}
      id="la-carte"
      aria-labelledby="la-carte-title"
      onPointerMove={follow}
      onPointerLeave={() => setActive(null)}
      className="relative overflow-hidden bg-void px-5 py-28 text-paper lg:px-[5vw] lg:py-40"
    >
      <div className="flex items-end justify-between gap-6">
        <h2 id="la-carte-title" className="eyebrow text-paper/50">
          La carte
        </h2>
        <Link href="/menu" className="eyebrow inline-flex items-center gap-2 text-paper/70 hover:text-paper">
          Toute la carte
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <ul className="mt-10">
        {categories.map((category, index) => (
          <li key={category.id} className="border-t border-paper/15 last:border-b">
            <Link
              href={`/menu#${category.id}`}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className={cn(
                "group flex items-center gap-4 py-6 transition-opacity duration-500 lg:gap-8 lg:py-9",
                active !== null && active !== index && "lg:opacity-30",
              )}
            >
              <span className="eyebrow w-8 shrink-0 text-paper/40 max-lg:hidden">0{index + 1}</span>
              <span className="display min-w-0 flex-1 text-[7.8vw] transition-transform duration-700 ease-cine group-hover:translate-x-4 lg:text-[7vw]">
                {category.name}
              </span>
              <span className="hidden text-sm font-bold tabular-nums text-paper/50 sm:block">
                ({productsIn(category.id).length})
              </span>
              {/* Touch screens: the object sits in the row instead of following a cursor. */}
              {categoryVisuals[category.id] && (
                <span aria-hidden className="w-20 shrink-0 pointer-fine:hidden">
                  <AssetImage asset={categoryVisuals[category.id]!} alt="" sizes="80px" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden aspect-[16/10] w-[min(38vw,580px)] pointer-fine:block"
        style={{ translate: "-50% -50%" }}
      >
        {categories.map((category, index) => {
          const visual = categoryVisuals[category.id];
          if (!visual) return null;
          return (
            <div
              key={category.id}
              className={cn(
                "absolute inset-0 transition-[opacity,scale,rotate] duration-700 ease-cine",
                active === index ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-12 opacity-0",
              )}
            >
              <AssetImage asset={visual} alt="" sizes="38vw" fit="contain" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
