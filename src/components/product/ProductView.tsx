"use client";

import gsap from "gsap";
import { ArrowLeft, ArrowRight, Move3d } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { FoodPhoto } from "@/components/food/FoodPhoto";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cart, unitPriceFor } from "@/lib/cart";
import { productPhoto } from "@/lib/assets";
import { PriceTag } from "@/components/ui/PriceTag";
import { formatPrice } from "@/lib/format";
import { getCategory, products, type Product } from "@/lib/menu";
import { showToast } from "@/lib/toast";

const MAX_Y = 34;
const MAX_X = 16;

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

type ProductViewProps = {
  product: Product;
  /** Heading level: the page view owns the h1, the overlay panel uses an h2. */
  as?: "h1" | "h2";
  onNavigate?: (slug: string) => void;
};

/** The product as a cinematic stage: the food dominates and turns under the pointer. */
export function ProductView({ product, as: Title = "h2", onNavigate }: ProductViewProps) {
  const [qty, setQty] = useState(1);
  const [removed, setRemoved] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const object = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ry: number; rx: number } | null>(null);
  const category = getCategory(product.category);
  const photo = productPhoto(product.slug);
  const total = unitPriceFor(product, extras) * qty;

  const index = products.findIndex((p) => p.slug === product.slug);
  const prev = products[(index - 1 + products.length) % products.length];
  const next = products[(index + 1) % products.length];

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!object.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gsap.killTweensOf(object.current);
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      ry: Number(gsap.getProperty(object.current, "rotationY")),
      rx: Number(gsap.getProperty(object.current, "rotationX")),
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !object.current) return;
    const { x, y, ry, rx } = drag.current;
    gsap.to(object.current, {
      rotationY: gsap.utils.clamp(-MAX_Y, MAX_Y, ry + (event.clientX - x) * 0.25),
      rotationX: gsap.utils.clamp(-MAX_X, MAX_X, rx - (event.clientY - y) * 0.15),
      scale: 1.04,
      transformPerspective: 1300,
      duration: 0.5,
      ease: "power3.out",
    });
  }

  function onPointerUp() {
    drag.current = null;
    if (!object.current) return;
    gsap.to(object.current, { rotationY: 0, rotationX: 0, scale: 1, duration: 1.6, ease: "elastic.out(1, 0.45)" });
  }

  function add() {
    cart.add(product.slug, qty, removed, extras);
    showToast({ title: `${qty} × ${product.name} ajouté${qty > 1 ? "s" : ""}`, href: "/panier", action: "Panier" });
    setQty(1);
  }

  return (
    <div className="grid min-h-full lg:h-full lg:grid-cols-[1.35fr_1fr]">
      {/* Stage */}
      <div className="relative flex min-h-[62svh] select-none items-center justify-center overflow-hidden bg-[radial-gradient(55%_50%_at_50%_52%,rgb(150_80_40/0.28)_0%,#120f0d_55%,#080707_85%)] lg:min-h-0">
        <p
          aria-hidden
          className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[24vw] text-transparent [-webkit-text-stroke:1px_rgb(243_235_223/0.12)] lg:text-[15vw]"
        >
          {product.name.split(" ").at(-1)}
        </p>
        {photo ? (
          <div
            className="relative w-[94vw] max-w-[1000px] cursor-grab touch-none active:cursor-grabbing lg:w-[52vw]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <FoodPhoto
              key={product.slug}
              asset={photo}
              alt={product.name}
              sway
              preload
              tiltRef={object}
              sizes="(min-width: 1024px) 52vw, 94vw"
            />
          </div>
        ) : (
          <p className="display relative px-6 text-center text-[9vw] lg:text-[5vw]">{product.name}</p>
        )}
        {photo && (
          <p className="eyebrow absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-paper/40">
            <Move3d className="size-4" />
            Glissez pour faire pivoter
          </p>
        )}
        {onNavigate && (
          <div className="absolute inset-x-5 top-1/2 flex -translate-y-1/2 justify-between lg:inset-x-8">
            <button
              type="button"
              onClick={() => onNavigate(prev.slug)}
              className="grid size-12 place-items-center rounded-full border border-paper/20 hover:border-flame hover:bg-flame"
              aria-label={`Produit précédent : ${prev.name}`}
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(next.slug)}
              className="grid size-12 place-items-center rounded-full border border-paper/20 hover:border-flame hover:bg-flame"
              aria-label={`Produit suivant : ${next.name}`}
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center px-5 py-12 lg:overflow-y-auto lg:px-12 lg:py-24" data-lenis-prevent>
        <p className="kicker">{category.name}</p>
        <Title className="display mt-3 text-[13vw] lg:text-[4.4vw]">{product.name}</Title>
        <PriceTag price={product.price} size="lg" className="mt-4 self-start" />
        <p className="mt-6 max-w-md leading-relaxed text-paper/65">{product.description}</p>

        <h3 className="eyebrow mt-10 text-paper/50">Ingrédients</h3>
        <p className="mt-3 text-lg font-semibold leading-snug">{product.ingredients.join(" · ")}</p>
        <p className="mt-2 text-xs text-paper/45">
          Allergènes : {product.allergens.length ? product.allergens.join(", ") : "aucun allergène majeur"}
        </p>

        {Boolean(product.removable?.length || product.extras?.length) && (
          <div className="mt-8 flex flex-wrap gap-2">
            {product.removable?.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={removed.includes(item)}
                onClick={() => setRemoved((list) => toggle(list, item))}
                className="h-9 rounded-full border border-paper/20 px-4 text-xs font-semibold transition-colors hover:border-paper aria-pressed:border-flame aria-pressed:bg-flame aria-pressed:text-paper"
              >
                Sans {item.toLowerCase()}
              </button>
            ))}
            {product.extras?.map((extra) => (
              <button
                key={extra.id}
                type="button"
                aria-pressed={extras.includes(extra.id)}
                onClick={() => setExtras((list) => toggle(list, extra.id))}
                className="h-9 rounded-full border border-paper/20 px-4 text-xs font-semibold transition-colors hover:border-paper aria-pressed:border-flame aria-pressed:bg-flame aria-pressed:text-paper"
              >
                {extra.label} +{formatPrice(extra.price)}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <QuantityStepper value={qty} onChange={setQty} label={product.name} className="self-start" />
          <Button variant="flame" size="lg" onClick={add} className="sm:flex-1">
            Ajouter au panier · <span className="tabular-nums">{formatPrice(total)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
