"use client";

import { ArrowRight, Banknote, CreditCard, MessageCircle } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { cart, type CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/lib/site";
import {
  buildOrderMessage,
  createOrderReference,
  normalizeMoroccanPhone,
  paymentLabels,
  whatsappUrl,
  type Customer,
  type PaymentMethod,
} from "@/lib/whatsapp";

export type Confirmation = {
  reference: string;
  whatsappUrl: string;
  total: number;
  count: number;
  payment: PaymentMethod;
  name: string;
};

type Values = Customer;
type Errors = Partial<Record<keyof Values, string>>;

const paymentOptions: { id: PaymentMethod; icon: typeof Banknote; hint: string }[] = [
  { id: "livraison", icon: Banknote, hint: "Vous réglez à la réception de la commande." },
  { id: "carte", icon: CreditCard, hint: "Modalités du paiement par carte confirmées sur WhatsApp." },
];

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Indiquez votre nom complet.";
  if (!normalizeMoroccanPhone(values.phone)) errors.phone = "Numéro marocain invalide (ex. 06 12 34 56 78).";
  if (values.address.trim().length < 6) errors.address = "Indiquez une adresse de livraison complète.";
  return errors;
}

type CheckoutFormProps = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  onConfirmed: (confirmation: Confirmation) => void;
};

export function CheckoutForm({ lines, count, subtotal, onConfirmed }: CheckoutFormProps) {
  const [values, setValues] = useState<Values>({ name: "", phone: "", address: "", note: "" });
  const [payment, setPayment] = useState<PaymentMethod>("livraison");
  const [attempted, setAttempted] = useState(false);
  const errors = attempted ? validate(values) : {};
  const total = subtotal + site.deliveryFee;
  const submitLabel = payment === "carte" ? "Payer maintenant" : "Passer la commande";

  const bind = (key: keyof Values) => ({
    value: values[key],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value })),
    error: errors[key],
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setAttempted(true);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const reference = createOrderReference();
    const customer: Customer = {
      name: values.name.trim(),
      phone: normalizeMoroccanPhone(values.phone)!,
      address: values.address.trim(),
      note: values.note.trim(),
    };
    const url = whatsappUrl(buildOrderMessage({ reference, lines, subtotal, customer, payment }));

    window.open(url, "_blank", "noopener,noreferrer");
    onConfirmed({ reference, whatsappUrl: url, total, count, payment, name: customer.name });
    cart.clear();
    scrollToTarget(0);
  }

  return (
    <form noValidate onSubmit={submit} aria-labelledby="delivery-title">
      <h2 id="delivery-title" className="kicker">
        Livraison
      </h2>

      <div className="mt-8 space-y-8">
        <Field id="name" label="Nom complet" autoComplete="name" required {...bind("name")} />
        <Field
          id="phone"
          label="Téléphone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="06 12 34 56 78"
          required
          {...bind("phone")}
        />
        <Field
          id="address"
          label="Adresse"
          autoComplete="street-address"
          placeholder="Rue, numéro, immeuble, étage"
          required
          {...bind("address")}
        />
        <Field id="city" label="Ville" value={site.city} readOnly hint="Nous livrons partout à Casablanca." />
        <Field id="note" label="Instructions (facultatif)" placeholder="Code d'entrée, parfum du soda…" {...bind("note")} />
      </div>

      <fieldset className="mt-14">
        <legend className="kicker">Paiement</legend>
        <div className="mt-5 border-t border-paper/10">
          {paymentOptions.map(({ id, icon: Icon, hint }) => (
            <label
              key={id}
              className="flex cursor-pointer items-center gap-5 border-b border-paper/10 py-5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-paper"
            >
              <input
                type="radio"
                name="payment"
                value={id}
                checked={payment === id}
                onChange={() => setPayment(id)}
                className="size-4 accent-flame"
              />
              <Icon className="size-5 shrink-0" />
              <span className="min-w-0">
                <span className="display block text-2xl">{paymentLabels[id]}</span>
                <span className="block text-xs text-paper/55">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-10 hidden lg:block">
        <Button type="submit" variant="flame" size="lg" className="w-full">
          {submitLabel} · <span className="tabular-nums">{formatPrice(total)}</span>
          <ArrowRight className="size-4" />
        </Button>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-paper/55">
          <MessageCircle className="size-3.5" />
          Votre commande s&apos;ouvre dans WhatsApp : appuyez sur Envoyer.
        </p>
      </div>

      {/* Phones: total and submit always within reach. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-paper/10 bg-void/95 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-paper backdrop-blur lg:hidden">
        <div className="flex items-center gap-4">
          <div>
            <p className="eyebrow text-paper/55">Total · {count}</p>
            <p className="display text-2xl tabular-nums">{formatPrice(total)}</p>
          </div>
          <Button type="submit" variant="flame" size="lg" className="flex-1">
            {submitLabel}
          </Button>
        </div>
        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-paper/55">
          <MessageCircle className="size-3" />
          Envoi de la commande via WhatsApp
        </p>
      </div>
    </form>
  );
}
