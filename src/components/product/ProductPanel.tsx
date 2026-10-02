"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getProduct } from "@/lib/menu";
import { closeProduct, openProduct, usePanelState } from "@/lib/panel";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { ProductView } from "./ProductView";

/** Full-screen product scene opened from anywhere via `openProduct(slug)`. */
export function ProductPanel() {
  const state = usePanelState();
  const pathname = usePathname();
  const product = state && state.path === pathname ? getProduct(state.slug) : undefined;
  const isOpen = Boolean(product);

  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProduct();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      data-lenis-prevent
      className="fixed inset-0 z-[80] animate-[panel-in_900ms_var(--ease-cine)] overflow-y-auto bg-void text-paper lg:overflow-hidden"
    >
      <ProductView key={product.slug} product={product} onNavigate={openProduct} />
      <button
        type="button"
        autoFocus
        onClick={closeProduct}
        className="eyebrow fixed right-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-ink hover:bg-mist lg:right-8 lg:top-7"
      >
        Fermer
        <X className="size-4" />
      </button>
    </div>
  );
}
