import { useSyncExternalStore } from "react";

export type ToastMessage = { id: number; title: string; href?: string; action?: string };

let current: ToastMessage | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function showToast(toast: Omit<ToastMessage, "id">) {
  current = { ...toast, id: Date.now() };
  emit();
  clearTimeout(timer);
  timer = setTimeout(dismissToast, 3200);
}

export function dismissToast() {
  current = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useToast() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
