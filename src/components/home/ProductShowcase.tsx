"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { FoodPhoto } from "@/components/food/FoodPhoto";
import { Button } from "@/components/ui/Button";
import { classicXXL, productPhoto } from "@/lib/assets";
import { cart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { getCategory, getProduct, type Product } from "@/lib/menu";
import { useReducedMotion } from "@/lib/motion";
import { openProduct } from "@/lib/panel";
import { showToast } from "@/lib/toast";
import { ExplodeRow } from "./ExplodeRow";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const signatures = ["entrecote", "mitraillette", "classic-xxl", "spicy-xxl"].map((slug) => getProduct(slug)!);

function addToCart(product: Product) {
  cart.add(product.slug);
  showToast({ title: `${product.name} ajouté`, href: "/panier", action: "Panier" });
}

export function SignatureMeta({ product, index }: { product: Product; index: number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="eyebrow text-paper/50">
        0{index + 1} / 0{signatures.length} — {getCategory(product.category).name}
      </p>
      <p className="text-2xl font-black tabular-nums lg:text-4xl">{formatPrice(product.price)}</p>
    </div>
  );
}

export function SignatureActions({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("flex max-w-md flex-col gap-5", className)}>
      <p className="text-sm leading-relaxed text-paper/60 lg:text-base">{product.ingredients.join(" · ")}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="light" onClick={() => addToCart(product)}>
          Ajouter au panier
        </Button>
        <button
          type="button"
          onClick={() => openProduct(product.slug)}
          className="eyebrow inline-flex items-center gap-2 px-2 py-3 hover:underline"
        >
          Voir en détail
          <ArrowUpRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-signature]").forEach((row) => {
        const flip = row.dataset.side === "right" ? -1 : 1;
        const trigger = { trigger: row, start: "top bottom", end: "bottom top", scrub: true };
        const object = row.querySelector("[data-object]");
        if (object) {
          gsap.fromTo(
            object,
            { yPercent: 14, rotation: -4 * flip, scale: 0.94 },
            { yPercent: -12, rotation: 3 * flip, scale: 1.03, ease: "none", scrollTrigger: trigger },
          );
        }
        gsap.fromTo(
          row.querySelector("[data-name]"),
          { xPercent: -5 * flip },
          { xPercent: 4 * flip, ease: "none", scrollTrigger: trigger },
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} id="signatures" aria-labelledby="signatures-title" className="bg-void text-paper">
      <header className="flex flex-col gap-6 px-5 pb-10 pt-28 lg:flex-row lg:items-end lg:justify-between lg:px-[5vw] lg:pt-40">
        <h2 id="signatures-title" className="display text-[14vw] lg:text-[11vw]">
          Les
          <br />
          signatures
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-paper/55 lg:pb-4 lg:text-base">
          Quatre recettes qui ont fait le nom du Maître. Survolez pour les découvrir, cliquez pour les faire tourner.
        </p>
      </header>

      {signatures.map((product, index) => {
        if (product.slug === "classic-xxl" && classicXXL.layers) {
          return <ExplodeRow key={product.slug} product={product} food={classicXXL} index={index} />;
        }
        const side = index % 2 === 0 ? "left" : "right";
        const photo = productPhoto(product.slug);
        const words = product.name.split(" ");
        return (
          <article
            key={product.slug}
            data-signature
            data-side={side}
            className="group relative flex min-h-[88svh] flex-col justify-center overflow-hidden border-t border-paper/10 px-5 py-16 lg:min-h-[96vh] lg:px-[5vw]"
          >
            <SignatureMeta product={product} index={index} />

            <h3
              data-name
              className={cn(
                "display relative z-0 mt-6 text-[10vw] lg:mt-10 lg:text-[10.5vw]",
                side === "right" && "lg:text-right",
              )}
            >
              <button
                type="button"
                onClick={() => openProduct(product.slug)}
                className="text-left uppercase after:absolute after:inset-0 after:z-10 focus-visible:outline-none lg:[text-align:inherit]"
                aria-label={`${product.name}, ${formatPrice(product.price)} : voir en détail`}
              >
                {words.map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
              </button>
            </h3>

            {photo && (
              <div
                data-object
                className={cn(
                  "pointer-events-none relative z-[5] -mt-[3vw] ml-auto w-[96vw] max-w-none lg:absolute lg:top-1/2 lg:mt-0 lg:w-[min(58vw,104vh)] lg:-translate-y-1/2",
                  side === "left" ? "lg:right-[1vw]" : "lg:left-[1vw]",
                )}
              >
                <FoodPhoto asset={photo} alt={product.name} hoverable sizes="(min-width: 1024px) 58vw, 96vw" />
              </div>
            )}

            {/* Revealed on hover (always visible on touch screens, and when there is no photo). */}
            <SignatureActions
              product={product}
              className={cn(
                "relative z-20 mt-6 transition-[opacity,translate] duration-700 ease-cine lg:mt-10",
                photo &&
                  "pointer-fine:translate-y-4 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:translate-y-0 pointer-fine:group-focus-within:opacity-100",
                side === "right" && "lg:ml-auto lg:items-end lg:text-right",
              )}
            />
          </article>
        );
      })}
    </section>
  );
}
