import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { paymentLabels } from "@/lib/whatsapp";
import type { Confirmation } from "./CheckoutForm";

const steps = ["Envoyée sur WhatsApp", "Confirmée par le restaurant", "En préparation", "En livraison"];

export function OrderConfirmation({ confirmation }: { confirmation: Confirmation }) {
  const { reference, whatsappUrl, total, count, payment, name } = confirmation;
  const firstName = name.split(/\s+/)[0];

  return (
    <div className="py-10">
      <p className="eyebrow text-steel">Commande {reference}</p>
      <h1 className="display mt-6 text-[13vw] lg:text-[8vw]">
        Merci
        <br />
        {firstName}.
      </h1>
      <p className="mt-8 max-w-lg text-lg leading-relaxed text-steel">
        Envoyez le message pré-rempli dans WhatsApp : notre équipe confirme votre commande et le délai de livraison
        dans la foulée.
      </p>

      <ol className="mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4" aria-label="Statut de la commande">
        {steps.map((step, index) => (
          <li key={step} aria-current={index === 0 ? "step" : undefined}>
            <span className={cn("block h-px", index === 0 ? "bg-ink" : "bg-ink/15")} />
            <span className={cn("eyebrow mt-3 block leading-relaxed", index === 0 ? "text-ink" : "text-steel/60")}>
              {step}
            </span>
          </li>
        ))}
      </ol>

      <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-6">
        <div>
          <dt className="eyebrow text-steel">Total</dt>
          <dd className="mt-2 text-3xl font-black tabular-nums">{formatPrice(total)}</dd>
        </div>
        <div>
          <dt className="eyebrow text-steel">Articles</dt>
          <dd className="mt-2 text-3xl font-black tabular-nums">{count}</dd>
        </div>
        <div>
          <dt className="eyebrow text-steel">Paiement</dt>
          <dd className="mt-2 text-3xl font-black uppercase tracking-tight">{paymentLabels[payment]}</dd>
        </div>
      </dl>

      <div className="mt-14 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={whatsappUrl} variant="dark" size="lg">
          Ouvrir à nouveau WhatsApp
        </ButtonLink>
        <ButtonLink href={site.phoneHref} variant="outline-dark" size="lg">
          {site.phone}
        </ButtonLink>
      </div>
      <p className="mt-8 text-sm text-steel">
        WhatsApp ne s&apos;est pas ouvert ? Utilisez le bouton ci-dessus ou appelez-nous.{" "}
        <Link href="/menu" className="font-semibold text-ink underline underline-offset-4">
          Retour à la carte
        </Link>
      </p>
    </div>
  );
}
