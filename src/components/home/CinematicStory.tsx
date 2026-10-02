"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { AssetImage, FoodPhoto } from "@/components/food/FoodPhoto";
import { LayerStack } from "@/components/food/LayerStack";
import { Button, ButtonLink } from "@/components/ui/Button";
import { brand, classicXXL, entrecote } from "@/lib/assets";
import { cart } from "@/lib/cart";
import { addExplode, floatTicker, stackPlacement } from "@/lib/explode";
import { formatPrice } from "@/lib/format";
import { getProduct } from "@/lib/menu";
import { useFinePointer, useReducedMotion } from "@/lib/motion";
import { openProduct } from "@/lib/panel";
import { showToast } from "@/lib/toast";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const hero = getProduct("entrecote")!;
const next = getProduct("classic-xxl")!;
const main = entrecote.main;
const layers = entrecote.layers;
const canvas = entrecote.canvas;
const nextPhoto = classicXXL.main;
// The stage takes the main photo's proportions; without it, the layer canvas.
const stageAspect = main ? main.w / main.h : canvas ? canvas.w / canvas.h : 16 / 9;

const chapters = [
  "Ouverture",
  ...(layers ? ["Les ingrédients", "L'assemblage"] : []),
  ...(nextPhoto ? ["À suivre"] : []),
];

function HeroCopy() {
  return (
    <>
      <div
        data-hero-copy
        className="absolute inset-x-5 top-[14svh] z-10 lg:inset-x-auto lg:bottom-[25vh] lg:left-[5vw] lg:top-auto lg:max-w-[40vw]"
      >
        <p className="eyebrow text-paper/50">Hot baguettes · XXL burgers · Casablanca</p>
        <h1 className="display mt-5 text-[14.5vw] lg:text-[clamp(3.5rem,5.7vw,8rem)]">
          Votre
          <br />
          sandwich,
          <br />
          nos règles.
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60 max-lg:hidden lg:text-base">
          Des ingrédients frais. Des recettes authentiques. Une seule obsession&nbsp;: le goût.
        </p>
      </div>
      <div
        data-hero-cta
        className="absolute inset-x-5 bottom-[5svh] z-10 flex flex-col gap-3 sm:flex-row lg:inset-x-auto lg:bottom-[11vh] lg:left-[5vw]"
      >
        <ButtonLink href="#la-carte" variant="light" size="lg">
          Découvrir le menu
        </ButtonLink>
        <ButtonLink href="/menu" variant="outline-light" size="lg">
          Commander
        </ButtonLink>
      </div>
    </>
  );
}

function Backdrop() {
  return (
    <div data-camera aria-hidden className="absolute -inset-[8%]">
      <div
        data-backdrop
        className="absolute inset-0 bg-[radial-gradient(70%_38%_at_50%_62%,#1e1e1e_0%,#0c0c0c_50%,#050505_80%)] lg:bg-[radial-gradient(46%_44%_at_68%_54%,#1e1e1e_0%,#0c0c0c_48%,#050505_78%)]"
      />
    </div>
  );
}

function CrownAccent() {
  if (!brand.crown) return null;
  return (
    <div data-crown aria-hidden className="absolute left-[72%] top-[-6%] w-[10%]">
      <div data-crown-depth>
        <div className="drift" style={{ ["--r" as string]: "14deg" }}>
          <AssetImage asset={brand.crown} alt="" sizes="10vw" />
        </div>
      </div>
    </div>
  );
}

/** The hero sandwich: the complete photo, with the layer stack waiting underneath for the opening. */
function Stage() {
  return (
    <div
      data-stage
      className="absolute left-[calc(50%-var(--w)/2)] top-[calc(60%-var(--w)/var(--aspect)/2)] w-(--w) [--w:min(122vw,130svh)] lg:left-[calc(68%-var(--w)/2)] lg:top-[calc(53%-var(--w)/var(--aspect)/2)] lg:[--w:min(60vw,150vh)]"
      style={{ aspectRatio: stageAspect, ["--aspect" as string]: stageAspect }}
    >
      <div data-tilt className="absolute inset-0 [transform-style:preserve-3d]">
        <div className="sway size-full">
          {main && (
            <div data-main className="absolute inset-0">
              <AssetImage asset={main} alt={`${hero.name}, notre signature`} fit="contain" preload sizes="(min-width: 1024px) 62vw, 122vw" />
            </div>
          )}
          {layers && canvas && (
            <LayerStack layers={layers} canvas={canvas} placement={stackPlacement(entrecote)} hidden={Boolean(main)} preload />
          )}
        </div>
      </div>
      <CrownAccent />
    </div>
  );
}

export function CinematicStory() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  // Scroll-driven story.
  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const el = root.current;
      const q = gsap.utils.selector(el);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const chapterEls = q("[data-chapter]") as HTMLElement[];

      const mm = gsap.matchMedia();
      mm.add({ lg: "(min-width: 1024px)", sm: "(max-width: 1023px)" }, (context) => {
        const lg = Boolean(context.conditions?.lg);
        const toCenterX = () => window.innerWidth / 2 - (stage.offsetLeft + stage.offsetWidth / 2);
        const toCenterY = () => window.innerHeight / 2 - (stage.offsetTop + stage.offsetHeight / 2);
        const baseScale = lg ? 1.15 : 1.05;
        const float = { amp: 0 };
        const chapterStarts: number[] = [];

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const time = self.progress * tl.duration();
              const active = chapterStarts.findLastIndex((start) => time >= start);
              chapterEls.forEach((chapter, i) => (chapter.dataset.active = String(i === active)));
            },
          },
        });

        // 1 · The sandwich comes toward the camera.
        chapterStarts.push(0);
        tl.to(q("[data-hero-copy]"), { autoAlpha: 0, y: -70, duration: 0.8 }, 0)
          .to(q("[data-hero-cta], [data-hero-meta]"), { autoAlpha: 0, y: 30, duration: 0.6 }, 0)
          .to(stage, { x: toCenterX, y: toCenterY, scale: baseScale, duration: 1.2 }, 0)
          .to(q("[data-crown]"), { xPercent: 120, yPercent: -220, rotation: 30, autoAlpha: 0, duration: 1.1 }, 0)
          .to(q("[data-backdrop]"), { scale: 1.3, duration: 1.2 }, 0)
          .fromTo(q("[data-chapters]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.8);
        let time = 1.3;

        // 2–4 · The layers separate, separate further, then close back into the photo.
        if (layers && canvas) {
          chapterStarts.push(time);
          const stack = q("[data-stack]")[0] as HTMLElement;
          const end = addExplode(
            tl,
            {
              stage,
              main: q("[data-main]")[0] ?? null,
              stack,
              movers: [q("[data-layer]") as HTMLElement[], q("[data-caption-track]") as HTMLElement[]],
              captions: q("[data-caption]"),
              layers,
              canvas,
              float,
            },
            time,
            baseScale,
          );
          chapterStarts.push(time + 3.5);
          tl.fromTo(q("[data-bigtype='a']"), { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 1.4 }, time + 0.2).to(
            q("[data-bigtype='a']"),
            { autoAlpha: 0, duration: 0.8 },
            time + 4.2,
          );
          time = end;
        }

        // 5 · The finished sandwich steps aside; the next product enters.
        if (nextPhoto) {
          chapterStarts.push(time);
          tl.to(
            stage,
            {
              x: () => toCenterX() - window.innerWidth * (lg ? 0.3 : 0),
              y: () => toCenterY() - (lg ? 0 : window.innerHeight * 0.24),
              scale: lg ? 0.62 : 0.5,
              duration: 1.6,
              ease: "power3.inOut",
            },
            time,
          )
            .fromTo(
              q("[data-next]"),
              { x: () => window.innerWidth * 0.6, rotation: 12, autoAlpha: 0 },
              { x: 0, rotation: 0, autoAlpha: 1, duration: 1.7, ease: "power3.out" },
              time + 0.2,
            )
            .fromTo(q("[data-bigtype='b']"), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 1 }, time + 0.5)
            .fromTo(q("[data-aside-label]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, time + 1)
            .fromTo(q("[data-next-copy]"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8 }, time + 1.1);
          time += 2;
        } else {
          tl.fromTo(q("[data-aside-label]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, time);
          time += 0.6;
        }
        tl.to({}, { duration: 1.2 }, time);

        const tick = floatTicker(q("[data-float]") as HTMLElement[], float, lg ? 1 : 0.6);
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  // Cursor: the sandwich tilts toward the pointer (±5°) and the camera light drifts against it.
  useGSAP(
    () => {
      if (reduced || !fine || !root.current) return;
      const q = gsap.utils.selector(root.current);
      const to = (target: Element | undefined, prop: string, duration = 1.2) =>
        target ? gsap.quickTo(target, prop, { duration, ease: "power3" }) : () => {};
      const tilt = q("[data-tilt]")[0];
      const nextTilt = q("[data-next-tilt]")[0];
      gsap.set([tilt, nextTilt].filter(Boolean), { transformPerspective: 1400 });
      const movers: [(value: number) => unknown, number, "x" | "y"][] = [
        [to(tilt, "rotationY"), 10, "x"],
        [to(tilt, "rotationX"), -7, "y"],
        [to(tilt, "x"), 18, "x"],
        [to(tilt, "y"), 12, "y"],
        [to(nextTilt, "rotationY"), 12, "x"],
        [to(nextTilt, "rotationX"), -8, "y"],
        [to(q("[data-camera]")[0], "x", 1.8), -40, "x"],
        [to(q("[data-camera]")[0], "y", 1.8), -28, "y"],
        [to(q("[data-crown-depth]")[0], "x", 1.4), 50, "x"],
        [to(q("[data-crown-depth]")[0], "y", 1.4), 36, "y"],
      ];
      const onMove = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        for (const [set, amount, axis] of movers) set((axis === "y" ? ny : nx) * amount);
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [reduced, fine] },
  );

  if (reduced) return <StaticStory />;

  return (
    <section
      ref={root}
      aria-label={`${hero.name}, ingrédient par ingrédient`}
      className={
        layers
          ? "relative h-[560svh] bg-void text-paper lg:h-[700vh]"
          : "relative h-[300svh] bg-void text-paper lg:h-[340vh]"
      }
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <Backdrop />

        <p
          data-bigtype="a"
          aria-hidden
          className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[22vw] text-transparent opacity-0 [-webkit-text-stroke:1px_rgb(255_255_255/0.16)]"
        >
          Entrecôte
        </p>
        <p
          data-bigtype="b"
          aria-hidden
          className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[42vw] text-transparent opacity-0 [-webkit-text-stroke:1px_rgb(255_255_255/0.12)] lg:text-left lg:indent-[40vw]"
        >
          XXL
        </p>

        <HeroCopy />

        <div data-hero-meta className="absolute right-[5vw] top-[13vh] hidden text-right lg:block">
          <p className="eyebrow text-paper/40">N° 01 — Hot baguette</p>
          <p className="mt-2 text-sm font-bold">
            {hero.name} · {formatPrice(hero.price)}
          </p>
        </div>
        <div data-hero-meta aria-hidden className="absolute bottom-[11vh] right-[5vw] hidden items-center gap-4 lg:flex">
          <span className="eyebrow text-paper/40">Défiler</span>
          <span className="block h-14 w-px overflow-hidden bg-paper/15">
            <span className="block h-full w-full animate-[scroll-cue_2.2s_var(--ease-cine)_infinite] bg-paper" />
          </span>
        </div>

        {chapters.length > 1 && (
          <ol data-chapters aria-hidden className="absolute left-[5vw] top-[13vh] hidden gap-8 opacity-0 lg:flex">
            {chapters.map((chapter, i) => (
              <li
                key={chapter}
                data-chapter
                data-active={i === 0}
                className="eyebrow flex items-center gap-3 text-paper/30 transition-colors duration-500 data-[active=true]:text-paper"
              >
                <span className="text-paper/40">0{i + 1}</span>
                {chapter}
              </li>
            ))}
          </ol>
        )}

        <Stage />

        <div data-aside-label className="absolute bottom-[12vh] left-[5vw] hidden opacity-0 lg:block">
          <p className="eyebrow text-paper/50">N° 01</p>
          <p className="mt-2 text-2xl font-black uppercase tracking-tight">{hero.name}</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="text-lg font-bold tabular-nums">{formatPrice(hero.price)}</span>
            <Button
              size="sm"
              variant="outline-light"
              onClick={() => {
                cart.add(hero.slug);
                showToast({ title: `${hero.name} ajouté`, href: "/panier", action: "Panier" });
              }}
            >
              Ajouter
            </Button>
          </div>
        </div>

        {nextPhoto && (
          <>
            <div
              data-next
              className="absolute right-[4vw] top-[calc(50%-min(18vw,32vh))] w-[min(46vw,80vh)] opacity-0 max-lg:left-[6vw] max-lg:right-auto max-lg:top-[38svh] max-lg:w-[88vw]"
            >
              <div data-next-tilt>
                <FoodPhoto asset={nextPhoto} alt={next.name} sway sizes="(min-width: 1024px) 46vw, 88vw" />
              </div>
            </div>
            <div
              data-next-copy
              className="absolute bottom-[5svh] left-5 right-5 opacity-0 lg:bottom-[11vh] lg:left-auto lg:right-[5vw] lg:text-right"
            >
              <p className="eyebrow text-paper/50">À suivre · XXL Burgers</p>
              <p className="display mt-3 text-[13vw] lg:text-[5.4vw]">{next.name}</p>
              <div className="mt-5 flex items-center gap-5 lg:justify-end">
                <span className="text-2xl font-black tabular-nums">{formatPrice(next.price)}</span>
                <Button variant="light" onClick={() => openProduct(next.slug)}>
                  Découvrir
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/** Reduced-motion version: the same story told as still compositions. */
function StaticStory() {
  return (
    <section aria-label={`${hero.name}, ingrédient par ingrédient`} className="relative bg-void text-paper">
      <div className="relative h-svh min-h-[640px] overflow-hidden">
        <Backdrop />
        <HeroCopy />
        <Stage />
      </div>
      {layers && (
        <div className="px-5 py-24 lg:px-[5vw]">
          <p className="eyebrow text-paper/50">Ingrédient par ingrédient</p>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {layers.map((layer, i) => (
              <li key={layer.file} className="border-t border-paper/15 pt-5">
                <span className="eyebrow text-paper/40">0{i + 1}</span>
                <span className="mt-2 block text-xl font-extrabold uppercase tracking-tight">{layer.label}</span>
                <span className="text-sm text-paper/55">{layer.note}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
