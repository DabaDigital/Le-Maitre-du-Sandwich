"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { nav, site } from "@/lib/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Minimal header drawn with `mix-blend-difference`, so the same white type reads on
 * black scenes and flips to black over white editorial pages.
 */
export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
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
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-paper mix-blend-difference">
        <div className="flex h-16 items-center gap-6 px-5 lg:h-20 lg:px-[5vw]">
          <Link href="/" className="pointer-events-auto flex items-center gap-3" aria-label={`${site.name} : accueil`}>
            <Logo id="header-logo" tone="light" className="size-10 lg:size-11" />
            <span className="eyebrow hidden leading-tight sm:block">
              Le Maître
              <br />
              du Sandwich
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="pointer-events-auto mx-auto hidden gap-6 lg:flex xl:gap-9">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "eyebrow py-2 transition-opacity",
                    active ? "opacity-100 underline decoration-1 underline-offset-8" : "opacity-60 hover:opacity-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pointer-events-auto ml-auto flex items-center gap-6 lg:ml-0">
            <Link href="/panier" className="eyebrow whitespace-nowrap py-2 hover:opacity-70">
              Panier <span className="tabular-nums">({count})</span>
            </Link>
            {/* Wrapped: the button's own inline-flex would override "hidden". */}
            <span className="hidden md:max-lg:block xl:block">
              <ButtonLink href="/menu" variant="outline-light" size="sm">
                Commander
              </ButtonLink>
            </span>
            <button
              type="button"
              className="eyebrow py-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpenOn(pathname)}
            >
              Menu
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
            <Logo id="mobile-menu-logo" tone="light" className="size-10" />
            <button
              type="button"
              autoFocus
              onClick={() => setOpenOn(null)}
              className="eyebrow inline-flex items-center gap-2 py-2"
            >
              Fermer
              <X className="size-4" />
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="flex flex-1 flex-col justify-center px-5">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className="display flex items-baseline gap-4 border-t border-paper/10 py-4 text-[11vw] aria-[current=page]:text-paper/40"
              >
                <span className="eyebrow text-paper/40">0{index + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 px-5 pb-8">
            <ButtonLink href="/menu" variant="light" size="lg">
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
