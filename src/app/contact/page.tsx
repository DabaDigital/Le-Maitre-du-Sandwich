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

const row = "grid gap-6 border-t border-paper/10 py-12 lg:grid-cols-[18rem_1fr] lg:py-16";

export default function ContactPage() {
  return (
    <div className="bg-void text-paper">
      <section className="px-5 pb-20 pt-36 lg:px-[5vw] lg:pb-28 lg:pt-48">
        <p className="kicker">Commandes &amp; infos</p>
        <h1 className="display mt-3 text-[22vw] lg:text-[12vw]">Contact</h1>
        <a href={site.phoneHref} className="display mt-8 block text-[15vw] transition-colors hover:text-flame lg:text-[7vw]">
          {site.phone}
        </a>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={site.phoneHref} variant="light" size="lg" arrow>
            Appeler
          </ButtonLink>
          <ButtonLink href={whatsappUrl()} variant="outline-light" size="lg">
            Écrire sur WhatsApp
          </ButtonLink>
        </div>
      </section>

      <div className="px-5 pb-28 lg:px-[5vw] lg:pb-40">
        <section className={row}>
          <h2 className="kicker">Horaires</h2>
          <dl className="space-y-3">
            {hours.map((slot) => (
              <div key={slot.days} className="flex flex-wrap items-baseline justify-between gap-4">
                <dt className="display text-3xl lg:text-5xl">{slot.days}</dt>
                <dd className="text-xl font-bold tabular-nums lg:text-3xl">{slot.time}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={row}>
          <h2 className="kicker">Adresses</h2>
          <ul className="space-y-6">
            {stores.map((store) => (
              <li key={store.id} className="flex flex-wrap items-baseline justify-between gap-4">
                <span>
                  <span className="block display text-3xl lg:text-5xl">{store.name}</span>
                  <span className="mt-1 block text-sm text-paper/55">{store.address}</span>
                </span>
                <a
                  href={directionsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow inline-flex items-center gap-1.5 text-paper/70 hover:text-paper"
                >
                  Itinéraire
                  <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={row}>
          <h2 className="kicker">Réseaux</h2>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {socials.map((social) =>
              social.href ? (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="display text-3xl transition-colors hover:text-flame lg:text-5xl"
                  >
                    {social.label}
                  </a>
                </li>
              ) : (
                <li key={social.label} className="display text-3xl text-paper/25 lg:text-5xl">
                  {social.label}
                  <span className="eyebrow ml-3 align-middle font-sans text-flame">Bientôt</span>
                </li>
              ),
            )}
          </ul>
        </section>

        <section className={row}>
          <h2 className="kicker">Infos pratiques</h2>
          <ul className="space-y-3 text-lg font-semibold lg:text-2xl">
            {practical.map((item) => (
              <li key={item} className="flex gap-4">
                <span aria-hidden className="mt-[0.6em] h-0.5 w-4 shrink-0 bg-flame" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
