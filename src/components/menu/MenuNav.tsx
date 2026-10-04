"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { categories, type CategoryId } from "@/lib/menu";

/** Category tabs that stick under the header; the red bar follows the section in view. */
export function MenuNav() {
  const [active, setActive] = useState<CategoryId>(categories[0].id);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as CategoryId);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Catégories du menu"
      className="sticky top-16 z-40 border-y border-paper/10 bg-void/90 text-paper backdrop-blur-md lg:top-20"
    >
      <ul className="no-scrollbar flex gap-7 overflow-x-auto px-5 lg:gap-10 lg:px-[5vw]">
        {categories.map((category) => (
          <li key={category.id} className="shrink-0">
            <a
              href={`#${category.id}`}
              aria-current={active === category.id ? "true" : undefined}
              onClick={() => setActive(category.id)}
              className={cn(
                "relative block py-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-flame after:transition-transform after:duration-500 after:ease-cine",
                active === category.id ? "text-paper after:scale-x-100" : "text-paper/55 after:scale-x-0 hover:text-paper",
              )}
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
