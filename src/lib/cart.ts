import { useMemo } from "react";
import { getProduct, type Extra, type Product } from "./menu";
import { createPersistentStore } from "./persistent-store";

export const MAX_QTY = 20;

export type CartItem = {
  key: string;
  slug: string;
  qty: number;
  removed: string[];
  extras: string[];
};

export type CartLine = CartItem & {
  product: Product;
  extraItems: Extra[];
  unitPrice: number;
  total: number;
};

const EMPTY: CartItem[] = [];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isCartItem(value: unknown): value is CartItem {
  const v = value as CartItem;
  return (
    typeof v === "object" &&
    v !== null &&
    typeof v.key === "string" &&
    typeof v.slug === "string" &&
    Number.isInteger(v.qty) &&
    v.qty > 0 &&
    isStringArray(v.removed) &&
    isStringArray(v.extras)
  );
}

const store = createPersistentStore<CartItem[]>("lms-cart-v1", EMPTY, (raw) =>
  Array.isArray(raw) ? raw.filter(isCartItem) : EMPTY,
);

export function lineKey(slug: string, removed: string[], extras: string[]) {
  return [slug, [...removed].sort().join("+"), [...extras].sort().join("+")].join("|");
}

const clamp = (qty: number) => Math.max(1, Math.min(MAX_QTY, qty));

export const cart = {
  add(slug: string, qty = 1, removed: string[] = [], extras: string[] = []) {
    const key = lineKey(slug, removed, extras);
    const items = store.get();
    const existing = items.find((item) => item.key === key);
    store.set(
      existing
        ? items.map((item) => (item.key === key ? { ...item, qty: clamp(item.qty + qty) } : item))
        : [...items, { key, slug, qty: clamp(qty), removed, extras }],
    );
  },
  setQty(key: string, qty: number) {
    if (qty < 1) return cart.remove(key);
    store.set(store.get().map((item) => (item.key === key ? { ...item, qty: clamp(qty) } : item)));
  },
  remove(key: string) {
    store.set(store.get().filter((item) => item.key !== key));
  },
  clear() {
    store.set(EMPTY);
  },
};

export function unitPriceFor(product: Product, extraIds: string[]) {
  const extras = (product.extras ?? []).filter((extra) => extraIds.includes(extra.id));
  return product.price + extras.reduce((sum, extra) => sum + extra.price, 0);
}

function resolve(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = getProduct(item.slug);
    if (!product) return [];
    const extraItems = (product.extras ?? []).filter((extra) => item.extras.includes(extra.id));
    const unitPrice = unitPriceFor(product, item.extras);
    return [{ ...item, product, extraItems, unitPrice, total: unitPrice * item.qty }];
  });
}

export function useCart() {
  const items = store.useValue();
  return useMemo(() => {
    const lines = resolve(items);
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal: lines.reduce((sum, line) => sum + line.total, 0),
    };
  }, [items]);
}
