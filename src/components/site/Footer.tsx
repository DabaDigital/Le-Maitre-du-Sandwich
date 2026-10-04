import { Crown, Phone } from "lucide-react";
import Link from "next/link";
import { SocialIcon } from "@/components/brand/SocialIcon";
import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { nav, site, socials } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-void px-5 pb-8 pt-14 text-paper lg:px-[5vw] lg:pt-16">
      <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:text-left">
        <Link href="/" className="flex flex-col items-center gap-3 text-lg lg:block" aria-label={`${site.name} : accueil`}>
          <Crown aria-hidden className="size-10 text-gold lg:hidden" strokeWidth={1.4} />
          <Wordmark />
        </Link>

        <nav aria-label="Pied de page">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start lg:gap-x-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[11px] font-bold uppercase tracking-[0.16em] text-paper/60 transition-colors hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-5" aria-label="Réseaux sociaux">
          {socials.map((social) =>
            social.href ? (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="block text-paper/80 transition-colors hover:text-flame"
                >
                  <SocialIcon name={social.label} className="size-5" />
                </a>
              </li>
            ) : (
              <li key={social.label} title={`${social.label} : bientôt disponible`} className="text-paper/25">
                <SocialIcon name={social.label} className="size-5" />
                <span className="sr-only">{social.label} (bientôt disponible)</span>
              </li>
            ),
          )}
        </ul>

        <div className="flex flex-col items-center gap-4 lg:items-end">
          <a href={site.phoneHref} className="inline-flex items-center gap-2.5 font-display text-xl tracking-wide hover:text-flame">
            <Phone className="size-4 text-flame" strokeWidth={2.5} />
            {site.phone}
          </a>
          <ButtonLink href="/menu" variant="light" size="sm" arrow>
            Commander
          </ButtonLink>
        </div>
      </div>

      <div className="mt-12 flex flex-col justify-between gap-2 border-t border-paper/10 pt-6 text-center text-xs text-paper/40 sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} {site.name}. Tous droits réservés.
        </p>
        <p>{site.slogan}</p>
      </div>
    </footer>
  );
}
