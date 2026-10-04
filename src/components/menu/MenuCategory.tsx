"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { FoodPhoto } from "@/components/food/FoodPhoto";
import { PriceTag } from "@/components/ui/PriceTag";
import { productPhoto } from "@/lib/assets";
import { cart } from "@/lib/cart";
import { cn } from "@/lib/cn";
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
      className={cn("scroll-mt-28 px-5 py-20 text-paper lg:scroll-mt-32 lg:px-[5vw] lg:py-28", index % 2 ? "bg-coal" : "bg-void")}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-16">
        <div>
          <p className="kicker">
            0{index + 1} · {items.length} produit{items.length > 1 ? "s" : ""}
          </p>
          <h2 id={`${category.id}-title`} className="display mt-3 text-[15vw] lg:text-[6.4vw]">
            {category.name}
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-paper/65 lg:pb-3">{category.tagline}</p>
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
                  <p className="display px-4 text-center text-[11vw] text-transparent [-webkit-text-stroke:1px_rgb(243_235_223/0.25)] lg:text-[5vw]">
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
                        "display block text-[10vw] transition-opacity duration-500 lg:text-[3.8vw]",
                        !on && "opacity-35",
                      )}
                    >
                      {product.name}
                    </span>
                    <span className="mt-3 block text-sm text-paper/55">{product.shortDesc}</span>
                  </button>
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <PriceTag price={product.price} />
                    <button
                      type="button"
                      onClick={() => {
                        cart.add(product.slug);
                        showToast({ title: `${product.name} ajouté`, href: "/panier", action: "Panier" });
                      }}
                      aria-label={`Ajouter ${product.name} au panier`}
                      className="grid size-11 place-items-center rounded-btn border border-paper/25 transition-colors hover:border-flame hover:bg-flame"
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
