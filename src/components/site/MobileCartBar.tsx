"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

/** Phones: the cart stays one tap away once something is in it (hidden on the cart page). */
export function MobileCartBar() {
  const pathname = usePathname();
  const { count, subtotal } = useCart();
  if (!count || pathname === "/panier") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <Link
        href="/panier"
        className="flex h-14 items-center justify-between rounded-full bg-paper px-6 text-ink shadow-[0_16px_40px_rgb(0_0_0/0.45)]"
      >
        <span className="eyebrow">
          Panier <span className="tabular-nums">({count})</span>
        </span>
        <span className="text-base font-black tabular-nums">{formatPrice(subtotal)}</span>
      </Link>
    </div>
  );
}
