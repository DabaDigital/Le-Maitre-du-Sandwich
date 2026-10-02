import type { CartLine } from "./cart";
import { formatPrice } from "./format";
import { site } from "./site";

export type PaymentMethod = "livraison" | "carte";

export const paymentLabels: Record<PaymentMethod, string> = {
  livraison: "À la livraison",
  carte: "Carte bancaire",
};

export type Customer = {
  name: string;
  phone: string;
  address: string;
  note: string;
};

export function createOrderReference() {
  return `LMS-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

/** Accepts 06…, +212 6…, 00212 6… with any spacing; returns "06 12 34 56 78" or null. */
export function normalizeMoroccanPhone(input: string) {
  let digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+212")) digits = "0" + digits.slice(4);
  else if (digits.startsWith("00212")) digits = "0" + digits.slice(5);
  if (!/^0[5-7]\d{8}$/.test(digits)) return null;
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ");
}

export function buildOrderMessage(order: {
  reference: string;
  lines: CartLine[];
  subtotal: number;
  customer: Customer;
  payment: PaymentMethod;
}) {
  const { reference, lines, subtotal, customer, payment } = order;
  const total = subtotal + site.deliveryFee;
  const out = [`*Nouvelle commande · ${site.name}*`, `Réf. ${reference}`, "", "*Commande*"];

  for (const line of lines) {
    out.push(`• ${line.qty} × ${line.product.name} — ${formatPrice(line.total)}`);
    if (line.removed.length) out.push(`   Sans : ${line.removed.join(", ")}`);
    if (line.extraItems.length) out.push(`   + ${line.extraItems.map((e) => e.label).join(", ")}`);
  }

  out.push(
    "",
    `Sous-total : ${formatPrice(subtotal)}`,
    `Livraison : ${site.deliveryFee ? formatPrice(site.deliveryFee) : "offerte (0 DH)"}`,
    `*Total : ${formatPrice(total)}*`,
    "",
    "*Livraison*",
    `Nom : ${customer.name}`,
    `Tél. : ${customer.phone}`,
    `Adresse : ${customer.address}, ${site.city}`,
  );
  if (customer.note) out.push(`Note : ${customer.note}`);
  out.push("", `*Paiement :* ${paymentLabels[payment]}`);

  return out.join("\n");
}

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
