import type Lenis from "lenis";

// The page-wide smooth scroller, so overlays can pause it while open.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function lockScroll() {
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  instance?.start();
  document.documentElement.style.overflow = "";
}

export function scrollToTarget(target: string | number) {
  if (instance) instance.scrollTo(target, { duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}
