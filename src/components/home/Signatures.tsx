"use client";

import { ArrowRight, Plus } from "lucide-react";
import { AssetImage } from "@/components/food/FoodPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { signaturePhoto } from "@/lib/assets";
import { cart } from "@/lib/cart";
import { fitGlyphs } from "@/lib/display-fit";
import { formatPrice } from "@/lib/format";
import { getProduct, type Product } from "@/lib/menu";
import { openProduct } from "@/lib/panel";
import { showToast } from "@/lib/toast";

const signatures = ["entrecote", "mitraillette", "classic-xxl", "spicy-xxl"].map((slug) => getProduct(slug)!);

/** Long names drop their article onto its own line ("Le / Classic XXL"), as on the menu boards. */
function nameLines(name: string) {
  const words = name.split(" ");
  return words.length > 2 ? [words[0], words.slice(1).join(" ")] : [name];
}

function addToCart(product: Product) {
  cart.add(product.slug);
  showToast({ title: `${product.name} ajouté`, href: "/panier", action: "Panier" });
}

function SignatureCard({ product }: { product: Product }) {
  const photo = signaturePhoto(product.slug);
  const lines = nameLines(product.name);
  const outline = product.name.split(" ").at(-1)!;

  return (
    <article className="group @container relative isolate flex flex-col overflow-hidden rounded-card border border-paper/10 bg-coal transition-colors duration-500 hover:border-flame/50 sm:min-h-64 sm:flex-row lg:min-h-72">
      {/* Warm light where the food sits. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_78%_55%,rgb(150_80_40/0.22),transparent_70%)]"
      />

      <div className="relative z-10 flex flex-col p-6 sm:w-[56%] sm:p-7 lg:p-8">
        {/* Sized so the longest line fits the text column: full width on phones, 56% beside the photo. */}
        <h3
          className="display text-[length:min(36px,calc(84cqw/var(--glyphs)))] leading-[0.95] sm:text-[length:min(3rem,calc(46cqw/var(--glyphs)))]"
          style={{ ["--glyphs" as string]: fitGlyphs(lines) }}
        >
          <button
            type="button"
            onClick={() => openProduct(product.slug)}
            aria-label={`${product.name}, ${formatPrice(product.price)} : voir le détail`}
            className="text-left uppercase after:absolute after:inset-0 after:z-20 focus-visible:outline-none"
          >
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </button>
        </h3>
        <PriceTag price={product.price} className="mt-3 self-start max-sm:hidden" />
        <p className="mt-4 max-w-[17rem] text-xs leading-relaxed text-paper/60">{product.shortDesc}.</p>
        <span
          aria-hidden
          className="mt-auto inline-flex items-center gap-2 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] max-sm:hidden"
        >
          Voir le détail
          <ArrowRight className="size-3.5 text-flame transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
        </span>
        {/* Phones: the price, and a quick add above the card's link. */}
        <div className="mt-4 flex items-center justify-between sm:hidden">
          <span className="font-display text-2xl tracking-wide text-flame">{formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={() => addToCart(product)}
            aria-label={`Ajouter ${product.name} au panier`}
            className="relative z-30 grid size-10 place-items-center rounded-full border-2 border-flame text-flame transition-colors hover:bg-flame hover:text-paper"
          >
            <Plus className="size-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      {photo ? (
        // Phones: the photo heads the card. Larger screens: it bleeds off the card's right edge.
        <div
          aria-hidden
          className="pointer-events-none relative -mx-[8%] -mb-[14%] max-sm:order-first sm:absolute sm:inset-y-0 sm:right-0 sm:mx-0 sm:mb-0 sm:flex sm:w-[62%] sm:items-center"
        >
          <div className="transition-transform duration-[900ms] ease-cine group-hover:-rotate-2 group-hover:scale-[1.06] sm:w-[125%] sm:max-w-none sm:shrink-0">
            <AssetImage asset={photo} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 60vw, 100vw" />
          </div>
        </div>
      ) : (
        // No photo supplied yet: the name in outline, never a stand-in picture. Phones: a band heading
        // the card, where the photo would be.
        <p
          aria-hidden
          className="display pointer-events-none order-first flex h-28 items-end px-6 text-[length:min(7rem,calc(80cqw/var(--glyphs)))] leading-none text-transparent [-webkit-text-stroke:1px_rgb(243_235_223/0.16)] sm:absolute sm:right-6 sm:top-1/2 sm:block sm:h-auto sm:-translate-y-1/2 sm:px-0 sm:text-[length:min(7rem,calc(36cqw/var(--glyphs)))]"
          style={{ ["--glyphs" as string]: fitGlyphs([outline]) }}
        >
          {outline}
        </p>
      )}
    </article>
  );
}

export function Signatures() {
  return (
    <section id="signatures" aria-labelledby="signatures-title" className="bg-void px-5 py-14 text-paper lg:px-[5vw] lg:py-16">
      <SectionHeading
        id="signatures-title"
        kicker="Nos créations iconiques"
        title="Les signatures"
        aside="Des recettes uniques, pensées pour les vrais amateurs de goût."
      />
      <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-5">
        {signatures.map((product) => (
          <SignatureCard key={product.slug} product={product} />
        ))}
      </div>
      <ButtonLink href="/menu" variant="light" arrow className="mt-6 w-full sm:hidden">
        Voir toute la carte
      </ButtonLink>
    </section>
  );
}
