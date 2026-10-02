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
        <h2 id="cart-title" className="eyebrow text-steel">
          Votre panier ({count})
        </h2>
        <Link href="/menu" className="eyebrow hover:underline">
          + Ajouter
        </Link>
      </div>

      <ul className="mt-8 border-t border-ink/10">
        {lines.map((line) => {
          const photo = productPhoto(line.slug);
          return (
          <li key={line.key} className="flex gap-5 border-b border-ink/10 py-7">
            {photo && (
              <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-btn sm:w-32">
                <AssetImage asset={photo} alt="" sizes="128px" fit="cover" feather={false} />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-black uppercase leading-none tracking-tight sm:text-2xl">
                    {line.product.name}
                  </h3>
                  <p className="mt-2 text-xs text-steel">{formatPrice(line.unitPrice)} l&apos;unité</p>
                  {line.removed.length > 0 && (
                    <p className="mt-1 text-xs font-semibold">Sans {line.removed.join(", ").toLowerCase()}</p>
                  )}
                  {line.extraItems.length > 0 && (
                    <p className="mt-0.5 text-xs font-semibold">+ {line.extraItems.map((e) => e.label).join(", ")}</p>
                  )}
                </div>
                <span className="text-lg font-black tabular-nums">{formatPrice(line.total)}</span>
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
                  className="eyebrow text-steel hover:text-ink"
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
          <dt className="text-steel">Sous-total</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-steel">Livraison</dt>
          <dd className="font-semibold tabular-nums">
            {formatPrice(site.deliveryFee)}
            {site.deliveryFee === 0 && <span className="font-normal text-steel"> · offerte</span>}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink pt-5">
          <dt className="eyebrow">Total</dt>
          <dd className="text-5xl font-black tabular-nums tracking-tight">{formatPrice(subtotal + site.deliveryFee)}</dd>
        </div>
      </dl>
    </section>
  );
}
