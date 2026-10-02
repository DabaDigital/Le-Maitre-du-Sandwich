"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { LayerStack } from "@/components/food/LayerStack";
import type { LayeredFood } from "@/lib/assets";
import { addExplode, floatTicker, stackPlacement } from "@/lib/explode";
import type { Product } from "@/lib/menu";
import { useReducedMotion } from "@/lib/motion";
import { openProduct } from "@/lib/panel";
import { SignatureActions, SignatureMeta } from "./ProductShowcase";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ExplodeRowProps = { product: Product; food: LayeredFood; index: number };

/**
 * A signature product that opens as you scroll past it: main photo → layers separate →
 * separate further → close → main photo. Same principles as the L'Entrecôte story.
 */
export function ExplodeRow({ product, food, index }: ExplodeRowProps) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const layers = food.layers!;
  const canvas = food.canvas!;
  const stageAspect = food.main ? food.main.w / food.main.h : canvas.w / canvas.h;

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const q = gsap.utils.selector(root.current);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const float = { amp: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1.1, invalidateOnRefresh: true },
      });
      addExplode(
        tl,
        {
          stage,
          main: q("[data-main]")[0] ?? null,
          stack: q("[data-stack]")[0] as HTMLElement,
          movers: [q("[data-layer]") as HTMLElement[], q("[data-caption-track]") as HTMLElement[]],
          captions: q("[data-caption]"),
          layers,
          canvas,
          float,
        },
        0.4,
        1,
      );
      tl.to({}, { duration: 0.6 });
      const tick = floatTicker(q("[data-float]") as HTMLElement[], float, 1);
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <article
      ref={root}
      aria-labelledby={`${product.slug}-title`}
      className={reduced ? "relative border-t border-paper/10" : "relative h-[420svh] border-t border-paper/10 lg:h-[480vh]"}
    >
      <div className={reduced ? "relative px-5 py-16 lg:px-[5vw]" : "sticky top-0 flex h-svh flex-col overflow-hidden px-5 py-20 lg:px-[5vw] lg:py-24"}>
        <SignatureMeta product={product} index={index} />
        <h3 id={`${product.slug}-title`} className="display relative z-0 mt-6 text-[10vw] lg:text-[7vw]">
          <button type="button" onClick={() => openProduct(product.slug)} className="text-left uppercase">
            {product.name}
          </button>
        </h3>

        <div className="relative flex-1">
          <div
            data-stage
            className="absolute left-1/2 top-1/2 w-[min(100%,calc((100svh-18rem)*var(--aspect)))] -translate-x-1/2 -translate-y-1/2"
            style={{ aspectRatio: stageAspect, ["--aspect" as string]: stageAspect }}
          >
            {food.main && (
              <div data-main className="absolute inset-0">
                <AssetImage asset={food.main} alt={product.name} fit="contain" sizes="(min-width: 1024px) 70vw, 100vw" />
              </div>
            )}
            <LayerStack layers={layers} canvas={canvas} placement={stackPlacement(food)} hidden={Boolean(food.main)} />
          </div>
        </div>

        <SignatureActions product={product} className="relative z-20" />
      </div>
    </article>
  );
}
