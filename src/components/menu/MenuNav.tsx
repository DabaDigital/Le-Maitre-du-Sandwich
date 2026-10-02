"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { categories, type CategoryId } from "@/lib/menu";

/** Floating category index; blends like the header so it reads on black and white sections. */
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
      className="pointer-events-none sticky top-16 z-40 text-paper mix-blend-difference lg:top-20"
    >
      <ul className="no-scrollbar pointer-events-auto flex gap-6 overflow-x-auto px-5 py-3 lg:px-[5vw]">
        {categories.map((category) => (
          <li key={category.id} className="shrink-0">
            <a
              href={`#${category.id}`}
              aria-current={active === category.id ? "true" : undefined}
              onClick={() => setActive(category.id)}
              className={cn(
                "eyebrow transition-opacity",
                active === category.id ? "opacity-100 underline underline-offset-8" : "opacity-50 hover:opacity-100",
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
