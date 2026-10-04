"use client";

import { useState } from "react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { useCart } from "@/lib/cart";
import { productPhoto } from "@/lib/assets";
import { bestSellers } from "@/lib/menu";
import { openProduct } from "@/lib/panel";
import { useHydrated } from "@/lib/persistent-store";
import { CartSummary } from "./CartSummary";
import { CheckoutForm, type Confirmation } from "./CheckoutForm";
import { OrderConfirmation } from "./OrderConfirmation";

export function CheckoutView() {
  const hydrated = useHydrated();
  const { lines, count, subtotal } = useCart();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  if (confirmation) return <OrderConfirmation confirmation={confirmation} />;

  // The cart lives in localStorage: wait for it rather than flashing "empty".
  if (!hydrated) return <div aria-busy="true" className="min-h-[60svh]" />;

  if (!count) {
    return (
      <div className="py-10">
        <p className="kicker">Votre commande</p>
        <h1 className="display mt-3 text-[18vw] lg:text-[9vw]">
          Panier
          <br />
          vide.
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-paper/60">
          Le Maître vous attend : baguettes chaudes, burgers XXL et frites maison.
        </p>
        <ButtonLink href="/menu" variant="light" size="lg" arrow className="mt-10">
          Découvrir la carte
        </ButtonLink>

        <ul className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {bestSellers.map((product) => {
            const photo = productPhoto(product.slug);
            return (
            <li key={product.slug}>
              <button type="button" onClick={() => openProduct(product.slug)} className="group w-full text-left">
                {photo && (
                  <span className="block aspect-[4/3] overflow-hidden rounded-card border border-paper/10">
                    <span className="block size-full transition-transform duration-700 ease-cine group-hover:scale-105">
                      <AssetImage asset={photo} alt="" sizes="(min-width: 1024px) 22vw, 45vw" fit="cover" feather={false} />
                    </span>
                  </span>
                )}
                <span className="display mt-5 block text-2xl">{product.name}</span>
                <PriceTag price={product.price} className="mt-2" />
              </button>
            </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="pb-28 lg:pb-0">
      <p className="kicker">Panier</p>
      <h1 className="display mt-3 text-[18vw] lg:text-[9vw]">
        Votre
        <br />
        commande
      </h1>
      <div className="mt-16 grid gap-20 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <CartSummary lines={lines} count={count} subtotal={subtotal} />
        <CheckoutForm lines={lines} count={count} subtotal={subtotal} onConfirmed={setConfirmation} />
      </div>
    </div>
  );
}
