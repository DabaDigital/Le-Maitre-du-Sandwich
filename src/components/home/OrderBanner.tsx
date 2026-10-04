import { CreditCard, MessageCircle, Truck } from "lucide-react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { entrecote } from "@/lib/assets";

const { exploded } = entrecote;

const perks = [
  { icon: Truck, label: "Livraison offerte", detail: "Partout à Casablanca" },
  { icon: MessageCircle, label: "Commande WhatsApp", detail: "Confirmée en direct" },
  { icon: CreditCard, label: "Paiement au choix", detail: "À la livraison ou par carte" },
];

/** The red "Commandez en ligne" band that closes the home page. */
export function OrderBanner() {
  return (
    <section aria-labelledby="order-title" className="flame-surface relative isolate overflow-hidden text-paper">
      <div className="grid items-center gap-8 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_auto] lg:gap-10 lg:px-[5vw] lg:py-12">
        <div>
          <p className="eyebrow text-paper/80">Vos sandwichs préférés</p>
          <h2 id="order-title" className="display mt-3 text-[16vw] sm:text-7xl lg:text-[clamp(3.5rem,5.4vw,5.75rem)]">
            Commandez
            <br />
            en ligne
          </h2>
          <ButtonLink href="/menu" variant="light" arrow className="mt-7 max-lg:hidden">
            Commander maintenant
          </ButtonLink>
        </div>

        {/* A transparent cutout, so the sandwich sits straight on the red. */}
        {exploded && (
          <div
            aria-hidden
            className="mx-auto w-[min(80vw,22rem)] [filter:drop-shadow(0_30px_40px_rgb(60_0_0/0.55))] lg:-my-6 lg:w-[min(100%,24rem)]"
          >
            <div className="bob">
              <AssetImage asset={exploded} alt="" sizes="(min-width: 1024px) 24rem, 80vw" />
            </div>
          </div>
        )}

        <ul className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-5">
          {perks.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex flex-col items-center gap-2 text-center lg:flex-row lg:gap-4 lg:text-left">
              <span className="grid size-11 shrink-0 place-items-center rounded-btn border border-paper/40">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] lg:text-[11px] lg:tracking-[0.16em]">{label}</span>
                <span className="hidden text-xs text-paper/75 lg:block">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <ButtonLink href="/menu" variant="light" arrow className="w-full lg:hidden">
          Commander maintenant
        </ButtonLink>
      </div>
    </section>
  );
}
