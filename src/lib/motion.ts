import { useSyncExternalStore } from "react";

function mediaStore(query: string) {
  const subscribe = (callback: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", callback);
    return () => list.removeEventListener("change", callback);
  };
  const get = () => window.matchMedia(query).matches;
  return { subscribe, get };
}

const reduced = mediaStore("(prefers-reduced-motion: reduce)");
const finePointer = mediaStore("(hover: hover) and (pointer: fine)");
const desktop = mediaStore("(min-width: 1024px)");

/** Matches Tailwind's `lg` breakpoint. False on the server. */
export function useDesktop() {
  return useSyncExternalStore(desktop.subscribe, desktop.get, () => false);
}

/** False on the server and during hydration, then tracks the OS setting. */
export function useReducedMotion() {
  return useSyncExternalStore(reduced.subscribe, reduced.get, () => false);
}

/** True for mouse/trackpad users; touch devices get automatic motion instead of cursor tracking. */
export function useFinePointer() {
  return useSyncExternalStore(finePointer.subscribe, finePointer.get, () => false);
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
