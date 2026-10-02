import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { hours, site, socials } from "@/lib/site";
import { directionsUrl, stores } from "@/lib/stores";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: `Commandes et infos au ${site.phone}. Horaires, adresses et informations pratiques.`,
};

const practical = [
  "Livraison offerte partout à Casablanca.",
  "Paiement à la livraison ou par carte bancaire.",
  "Commande en ligne envoyée directement sur WhatsApp.",
  "Allergènes indiqués sur chaque produit.",
];

const row = "grid gap-6 border-t border-ink/10 py-12 lg:grid-cols-[18rem_1fr] lg:py-16";

export default function ContactPage() {
  return (
    <div className="bg-paper text-ink">
      <section className="px-5 pb-20 pt-36 lg:px-[5vw] lg:pb-28 lg:pt-48">
        <p className="eyebrow text-steel">Commandes &amp; infos</p>
        <h1 className="display mt-6 text-[17vw] lg:text-[14vw]">Contact</h1>
        <a href={site.phoneHref} className="mt-12 block text-[13vw] font-black tracking-[-0.04em] hover:underline lg:text-[8vw]">
          {site.phone}
        </a>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={site.phoneHref} variant="dark" size="lg">
            Appeler
          </ButtonLink>
          <ButtonLink href={whatsappUrl()} variant="outline-dark" size="lg">
            Écrire sur WhatsApp
          </ButtonLink>
        </div>
      </section>

      <div className="px-5 pb-28 lg:px-[5vw] lg:pb-40">
        <section className={row}>
          <h2 className="eyebrow text-steel">Horaires</h2>
          <dl className="space-y-3">
            {hours.map((slot) => (
              <div key={slot.days} className="flex flex-wrap items-baseline justify-between gap-4">
                <dt className="text-2xl font-black uppercase tracking-tight lg:text-4xl">{slot.days}</dt>
                <dd className="text-xl font-bold tabular-nums lg:text-3xl">{slot.time}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={row}>
          <h2 className="eyebrow text-steel">Adresses</h2>
          <ul className="space-y-6">
            {stores.map((store) => (
              <li key={store.id} className="flex flex-wrap items-baseline justify-between gap-4">
                <span>
                  <span className="block text-2xl font-black uppercase tracking-tight lg:text-4xl">{store.name}</span>
                  <span className="mt-1 block text-sm text-steel">{store.address}</span>
                </span>
                <a
                  href={directionsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow inline-flex items-center gap-1.5 hover:underline"
                >
                  Itinéraire
                  <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={row}>
          <h2 className="eyebrow text-steel">Réseaux</h2>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {socials.map((social) =>
              social.href ? (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-black uppercase tracking-tight hover:underline lg:text-4xl"
                  >
                    {social.label}
                  </a>
                </li>
              ) : (
                <li key={social.label} className="text-2xl font-black uppercase tracking-tight text-ink/25 lg:text-4xl">
                  {social.label}
                  <span className="eyebrow ml-3 align-middle text-steel">Bientôt</span>
                </li>
              ),
            )}
          </ul>
        </section>

        <section className={row}>
          <h2 className="eyebrow text-steel">Infos pratiques</h2>
          <ul className="space-y-3 text-lg font-semibold lg:text-2xl">
            {practical.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
