"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { nav, site } from "@/lib/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const subscribeScroll = (callback: () => void) => {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
};

/** True once the page has scrolled past the top. False on the server. */
function useScrolled() {
  return useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
}

/** Transparent over the hero, then a dark glass bar once the page scrolls. */
export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const scrolled = useScrolled();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOn(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b text-paper transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-paper/10 bg-void/85 backdrop-blur-md" : "border-transparent",
        )}
      >
        <div className="flex h-16 items-center gap-6 px-5 lg:h-20 lg:px-[5vw]">
          <Link href="/" className="text-[15px] lg:text-base" aria-label={`${site.name} : accueil`}>
            <Wordmark />
          </Link>

          <nav aria-label="Navigation principale" className="mx-auto hidden gap-7 lg:flex xl:gap-11">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                    "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-flame after:transition-transform after:duration-500 after:ease-cine",
                    active ? "text-paper after:scale-x-100" : "text-paper/60 after:scale-x-0 hover:text-paper",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <Link
              href="/panier"
              aria-label={`Panier : ${count} article${count > 1 ? "s" : ""}`}
              className="relative grid size-9 place-items-center rounded-btn border border-paper/15 transition-colors hover:border-paper/60"
            >
              <ShoppingBag className="size-4" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-flame px-1 text-[10px] font-bold tabular-nums">
                  {count}
                </span>
              )}
            </Link>
            {/* Wrapped: the button's own inline-flex would override "hidden". */}
            <span className="hidden sm:block">
              <ButtonLink href="/menu" variant="outline-light" size="sm" arrow>
                Commander
              </ButtonLink>
            </span>
            <button
              type="button"
              className="-mr-2 grid size-9 place-items-center lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpenOn(pathname)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-void text-paper lg:hidden"
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Wordmark className="text-[15px]" />
            <button
              type="button"
              autoFocus
              onClick={() => setOpenOn(null)}
              aria-label="Fermer le menu"
              className="grid size-10 place-items-center rounded-btn border border-paper/15"
            >
              <X className="size-4" />
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="flex flex-1 flex-col justify-center px-5">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className="display flex items-baseline gap-4 border-t border-paper/10 py-4 text-[12vw] aria-[current=page]:text-flame"
              >
                <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-flame">0{index + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 px-5 pb-8">
            <ButtonLink href="/menu" variant="light" size="lg" arrow>
              Commander maintenant
            </ButtonLink>
            <ButtonLink href={site.phoneHref} variant="outline-light" size="lg">
              {site.phone}
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
}
