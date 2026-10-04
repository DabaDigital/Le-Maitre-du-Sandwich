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
      <p className="kicker">Commande {reference}</p>
      <h1 className="display mt-3 text-[16vw] lg:text-[8vw]">
        Merci
        <br />
        {firstName}.
      </h1>
      <p className="mt-8 max-w-lg text-lg leading-relaxed text-paper/55">
        Envoyez le message pré-rempli dans WhatsApp : notre équipe confirme votre commande et le délai de livraison
        dans la foulée.
      </p>

      <ol className="mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4" aria-label="Statut de la commande">
        {steps.map((step, index) => (
          <li key={step} aria-current={index === 0 ? "step" : undefined}>
            <span className={cn("block h-px", index === 0 ? "bg-flame" : "bg-paper/15")} />
            <span className={cn("eyebrow mt-3 block leading-relaxed", index === 0 ? "text-paper" : "text-paper/40")}>
              {step}
            </span>
          </li>
        ))}
      </ol>

      <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-6">
        <div>
          <dt className="eyebrow text-paper/55">Total</dt>
          <dd className="display mt-2 text-4xl tabular-nums">{formatPrice(total)}</dd>
        </div>
        <div>
          <dt className="eyebrow text-paper/55">Articles</dt>
          <dd className="display mt-2 text-4xl tabular-nums">{count}</dd>
        </div>
        <div>
          <dt className="eyebrow text-paper/55">Paiement</dt>
          <dd className="display mt-2 text-4xl">{paymentLabels[payment]}</dd>
        </div>
      </dl>

      <div className="mt-14 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={whatsappUrl} variant="light" size="lg" arrow>
          Ouvrir à nouveau WhatsApp
        </ButtonLink>
        <ButtonLink href={site.phoneHref} variant="outline-light" size="lg">
          {site.phone}
        </ButtonLink>
      </div>
      <p className="mt-8 text-sm text-paper/55">
        WhatsApp ne s&apos;est pas ouvert ? Utilisez le bouton ci-dessus ou appelez-nous.{" "}
        <Link href="/menu" className="font-semibold text-paper underline underline-offset-4">
          Retour à la carte
        </Link>
      </p>
    </div>
  );
}
