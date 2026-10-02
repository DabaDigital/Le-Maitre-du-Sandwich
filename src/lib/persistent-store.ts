import { useSyncExternalStore } from "react";

/**
 * A tiny localStorage-backed store read through useSyncExternalStore.
 * The server snapshot is always `fallback`, so hydration never mismatches;
 * the persisted value appears right after hydration and syncs across tabs.
 */
export function createPersistentStore<T>(key: string, fallback: T, parse: (raw: unknown) => T) {
  let value = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  function read(): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : parse(JSON.parse(raw));
    } catch {
      return fallback;
    }
  }

  function get() {
    if (!loaded) {
      value = read();
      loaded = true;
    }
    return value;
  }

  function set(next: T) {
    value = next;
    loaded = true;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode, quota): keep the in-memory value.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      loaded = false;
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue() {
    return useSyncExternalStore(subscribe, get, () => fallback);
  }

  return { get, set, useValue };
}

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true once the client has taken over. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
