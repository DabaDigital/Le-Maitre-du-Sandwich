import { useSyncExternalStore } from "react";

// Which product the cinematic panel shows, and on which page it was opened
// (the panel only belongs to that page, so navigating away closes it).
type PanelState = { slug: string; path: string } | null;

let current: PanelState = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function openProduct(slug: string) {
  current = { slug, path: window.location.pathname };
  emit();
}

export function closeProduct() {
  current = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePanelState() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
