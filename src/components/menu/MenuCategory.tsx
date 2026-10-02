"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { FoodPhoto } from "@/components/food/FoodPhoto";
import { productPhoto } from "@/lib/assets";
import { cart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/lib/menu";
import { openProduct } from "@/lib/panel";
import { showToast } from "@/lib/toast";

type MenuCategoryProps = {
  category: Category;
  items: Product[];
  index: number;
};

/**
 * One category: the dishes set in big type, with the hovered dish's photo on stage.
 * Dishes without a supplied photo show their name in outline instead of a stand-in image.
 */
export function MenuCategory({ category, items, index }: MenuCategoryProps) {
  const [active, setActive] = useState(items[0].slug);
  const current = items.find((p) => p.slug === active) ?? items[0];

  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-title`}
      className={cn("scroll-mt-16 px-5 py-24 text-paper lg:px-[5vw] lg:py-36", index % 2 ? "bg-[#0b0b0b]" : "bg-void")}
    >
      <div className="flex flex-col gap-4">
        <h2 id={`${category.id}-title`} className="display text-[8vw] lg:text-[7.6vw]">
          {category.name}
        </h2>
        <p className="eyebrow text-paper/50">
          0{index + 1} · {items.length} produit{items.length > 1 ? "s" : ""} · {category.tagline}
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="relative aspect-[16/10] self-start max-lg:w-full lg:sticky lg:top-24">
          {items.map((product) => {
            const photo = productPhoto(product.slug);
            const on = product.slug === current.slug;
            return (
              <div
                key={product.slug}
                aria-hidden={!on}
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-[opacity,scale,rotate] duration-[900ms] ease-cine",
                  on ? "scale-100 rotate-0 opacity-100" : "pointer-events-none scale-90 -rotate-3 opacity-0",
                )}
              >
                {photo ? (
                  <FoodPhoto asset={photo} alt={product.name} sway className="w-full" sizes="(min-width: 1024px) 50vw, 90vw" />
                ) : (
                  <p className="display px-4 text-center text-[11vw] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.25)] lg:text-[5vw]">
                    {product.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <ul>
          {items.map((product) => {
            const on = product.slug === current.slug;
            return (
              <li key={product.slug} onMouseEnter={() => setActive(product.slug)} className="border-t border-paper/15">
                <div className="flex items-start gap-4 py-7 lg:py-9">
                  <button
                    type="button"
                    onFocus={() => setActive(product.slug)}
                    onClick={() => {
                      setActive(product.slug);
                      openProduct(product.slug);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span
                      className={cn(
                        "block text-[8vw] font-black uppercase leading-[0.9] tracking-[-0.03em] transition-opacity duration-500 lg:text-[3.6vw]",
                        !on && "opacity-35",
                      )}
                    >
                      {product.name}
                    </span>
                    <span className="mt-3 block text-sm text-paper/55">{product.shortDesc}</span>
                  </button>
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <span className="text-xl font-black tabular-nums lg:text-2xl">{formatPrice(product.price)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        cart.add(product.slug);
                        showToast({ title: `${product.name} ajouté`, href: "/panier", action: "Panier" });
                      }}
                      aria-label={`Ajouter ${product.name} au panier`}
                      className="grid size-11 place-items-center rounded-full border border-paper/25 transition-colors hover:bg-paper hover:text-ink"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
