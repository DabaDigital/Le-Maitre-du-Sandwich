"use client";

import Link from "next/link";
import { AssetImage } from "@/components/food/FoodPhoto";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cart, type CartLine } from "@/lib/cart";
import { productPhoto } from "@/lib/assets";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

type CartSummaryProps = { lines: CartLine[]; count: number; subtotal: number };

export function CartSummary({ lines, count, subtotal }: CartSummaryProps) {
  return (
    <section aria-labelledby="cart-title">
      <div className="flex items-baseline justify-between">
        <h2 id="cart-title" className="kicker">
          Votre panier ({count})
        </h2>
        <Link href="/menu" className="eyebrow text-paper/70 hover:text-paper">
          + Ajouter
        </Link>
      </div>

      <ul className="mt-8 border-t border-paper/10">
        {lines.map((line) => {
          const photo = productPhoto(line.slug);
          return (
          <li key={line.key} className="flex gap-5 border-b border-paper/10 py-7">
            {photo && (
              <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-card sm:w-32">
                <AssetImage asset={photo} alt="" sizes="128px" fit="cover" feather={false} />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="display text-2xl sm:text-3xl">
                    {line.product.name}
                  </h3>
                  <p className="mt-2 text-xs text-paper/55">{formatPrice(line.unitPrice)} l&apos;unité</p>
                  {line.removed.length > 0 && (
                    <p className="mt-1 text-xs font-semibold">Sans {line.removed.join(", ").toLowerCase()}</p>
                  )}
                  {line.extraItems.length > 0 && (
                    <p className="mt-0.5 text-xs font-semibold">+ {line.extraItems.map((e) => e.label).join(", ")}</p>
                  )}
                </div>
                <span className="display text-2xl tabular-nums">{formatPrice(line.total)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <QuantityStepper
                  size="sm"
                  value={line.qty}
                  onChange={(qty) => cart.setQty(line.key, qty)}
                  label={line.product.name}
                />
                <button
                  type="button"
                  onClick={() => cart.remove(line.key)}
                  className="eyebrow text-paper/55 hover:text-paper"
                  aria-label={`Retirer ${line.product.name} du panier`}
                >
                  Retirer
                </button>
              </div>
            </div>
          </li>
          );
        })}
      </ul>

      <dl className="mt-8 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-paper/55">Sous-total</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-paper/55">Livraison</dt>
          <dd className="font-semibold tabular-nums">
            {formatPrice(site.deliveryFee)}
            {site.deliveryFee === 0 && <span className="font-normal text-paper/55"> · offerte</span>}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-paper/40 pt-5">
          <dt className="eyebrow">Total</dt>
          <dd className="display text-6xl tabular-nums">{formatPrice(subtotal + site.deliveryFee)}</dd>
        </div>
      </dl>
    </section>
  );
}
