import gsap from "gsap";
import type { Layer, LayeredFood } from "./assets";

type Canvas = { w: number; h: number };
type Phase = "closed" | "open" | "wide";

const boxOf = (layer: Layer) => layer.asset.box ?? [0, 0, layer.asset.w, layer.asset.h];

/** Extent of the visible food across all layers, as fractions of the shared canvas. */
export function contentExtent(layers: Layer[], canvas: Canvas) {
  const boxes = layers.map(boxOf);
  const top = Math.min(...boxes.map((b) => b[1]));
  const bottom = Math.max(...boxes.map((b) => b[1] + b[3]));
  const left = Math.min(...boxes.map((b) => b[0]));
  const right = Math.max(...boxes.map((b) => b[0] + b[2]));
  return {
    top: top / canvas.h,
    bottom: bottom / canvas.h,
    height: (bottom - top) / canvas.h,
    left: left / canvas.w,
    right: right / canvas.w,
  };
}

/**
 * How the layer files were authored, read from how much neighbouring layers overlap:
 * "closed" — each layer sits where it is in the finished sandwich (they overlap heavily);
 * "exploded" — the layers were cut from an opened-up image and already sit apart.
 */
export function layoutOf(layers: Layer[]): "closed" | "exploded" {
  const boxes = layers.map(boxOf);
  let overlap = 0;
  for (let i = 1; i < boxes.length; i++) {
    const [a, b] = [boxes[i - 1], boxes[i]];
    const shared = Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]);
    overlap += Math.max(0, shared) / Math.min(a[3], b[3]);
  }
  return overlap / (boxes.length - 1) > 0.5 ? "closed" : "exploded";
}

// Exploded-cut layers: spacing between layer centres, relative to the spacing as supplied.
const EXPLODED_SPACING: Record<Phase, number> = { closed: 0.4, open: 1, wide: 1.4 };
// Closed-cut layers: gap added between neighbours, in multiples of the sandwich height.
const CLOSED_SPREAD: Record<Phase, number> = { closed: 0, open: 0.3, wide: 0.62 };

/**
 * yPercent (of the canvas height) for each layer in a phase of the opening. Layers only ever
 * move vertically, in order, so their horizontal alignment and proportions are untouched.
 */
export function phaseOffsets(layers: Layer[], canvas: Canvas, phase: Phase) {
  if (layoutOf(layers) === "exploded") {
    const extent = contentExtent(layers, canvas);
    const middle = ((extent.top + extent.bottom) / 2) * canvas.h;
    const factor = EXPLODED_SPACING[phase];
    return layers.map((layer) => {
      const box = boxOf(layer);
      const center = box[1] + box[3] / 2;
      return (((center - middle) * (factor - 1)) / canvas.h) * 100;
    });
  }
  const step = contentExtent(layers, canvas).height * CLOSED_SPREAD[phase] * 100;
  const middle = (layers.length - 1) / 2;
  return layers.map((_, i) => (i - middle) * step);
}

type ExplodeTargets = {
  stage: HTMLElement;
  /** The complete photo shown before and after the opening. */
  main: Element | null;
  /** Container of the layer cutouts. */
  stack: HTMLElement;
  /** Layer boxes and the caption boxes that ride with them (same canvas, same index). */
  movers: HTMLElement[][];
  captions: Element[];
  layers: Layer[];
  canvas: Canvas;
  float: { amp: number };
};

/**
 * Adds the opening sequence to a scroll timeline: photo → layers closed → separate →
 * separate further → closed again → photo. Returns the time at which it ends.
 */
export function addExplode(tl: gsap.core.Timeline, t: ExplodeTargets, at: number, baseScale: number) {
  const closed = phaseOffsets(t.layers, t.canvas, "closed");
  const open = phaseOffsets(t.layers, t.canvas, "open");
  const wide = phaseOffsets(t.layers, t.canvas, "wide");
  const boxes = t.layers.map(boxOf);

  // Scale the stage so the opened stack fits the viewport.
  const fit = (offsets: number[]) => () => {
    const tops = boxes.map((b, i) => (b[1] / t.canvas.h) * 100 + offsets[i]);
    const bottoms = boxes.map((b, i) => ((b[1] + b[3]) / t.canvas.h) * 100 + offsets[i]);
    const span = ((Math.max(...bottoms) - Math.min(...tops)) / 100) * t.stack.offsetHeight;
    return Math.min(baseScale, (window.innerHeight * 0.86) / Math.max(span, 1));
  };

  t.movers.forEach((group) => gsap.set(group, { y: 0, yPercent: (i: number) => closed[i] }));

  // The photo dissolves into layers that are already moving apart, so the switch reads as the
  // sandwich opening. Without a main photo, the layers are shown throughout.
  t.movers.forEach((group) => {
    tl.to(group, { yPercent: (i: number) => open[i], duration: 1.4, stagger: { each: 0.05, from: "center" } }, at + 0.2);
  });
  if (t.main) {
    tl.fromTo(t.stack, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.38, ease: "power1.in" }, at + 0.4);
    tl.to(t.main, { autoAlpha: 0, duration: 0.38, ease: "power1.out" }, at + 0.45);
  }
  tl.to(t.stage, { scale: fit(open), duration: 1.4 }, at + 0.2)
    .to(t.float, { amp: 1, duration: 0.8 }, at + 1)
    .fromTo(t.captions, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.07 }, at + 1);

  t.movers.forEach((group) => {
    tl.to(group, { yPercent: (i: number) => wide[i], duration: 1.4, ease: "sine.inOut" }, at + 2);
  });
  tl.to(t.stage, { scale: fit(wide), duration: 1.4, ease: "sine.inOut" }, at + 2);

  tl.to(t.captions, { autoAlpha: 0, duration: 0.4, stagger: 0.03 }, at + 3.5).to(t.float, { amp: 0, duration: 0.5 }, at + 3.5);
  t.movers.forEach((group) => {
    tl.to(
      group,
      { yPercent: (i: number) => closed[i], duration: 1.5, stagger: { each: 0.04, from: "edges" }, ease: "power3.inOut" },
      at + 3.6,
    );
  });
  tl.to(t.stage, { scale: baseScale, duration: 1.5, ease: "power3.inOut" }, at + 3.6);

  // Closing mirrors the opening: the photo returns as the layers settle.
  if (t.main) {
    tl.to(t.main, { autoAlpha: 1, duration: 0.38, ease: "power1.in" }, at + 4.65);
    tl.to(t.stack, { autoAlpha: 0, duration: 0.38, ease: "power1.out" }, at + 4.8);
  }
  return at + 5.6;
}

/** Gentle vertical-only bob while the stack is open (keeps layers horizontally aligned). */
export function floatTicker(floats: HTMLElement[], float: { amp: number }, amplitude: number) {
  let resting = true;
  return (time: number) => {
    if (float.amp < 0.001) {
      if (!resting) floats.forEach((el) => (el.style.transform = ""));
      resting = true;
      return;
    }
    resting = false;
    floats.forEach((el, i) => {
      el.style.transform = `translate3d(0, ${(Math.sin(time * 0.9 + i * 1.7) * 5 * float.amp * amplitude).toFixed(2)}px, 0)`;
    });
  };
}

/**
 * Where to place the layer canvas inside a stage shaped like the main photo. Undefined when the
 * canvas is the main photo's own canvas (the layers then cover the stage exactly).
 */
export function stackPlacement(food: LayeredFood, span = 0.84) {
  const { main, layers, canvas } = food;
  if (!main || !layers || !canvas) return undefined;
  if (Math.abs(main.w - canvas.w) <= 2 && Math.abs(main.h - canvas.h) <= 2) return undefined;
  const extent = contentExtent(layers, canvas);
  const width = (span / (extent.right - extent.left)) * 100;
  const heightInStage = (width / 100) * (main.w / main.h) * (canvas.h / canvas.w);
  const cx = (extent.left + extent.right) / 2;
  const cy = (extent.top + extent.bottom) / 2;
  return { left: 50 - cx * width, top: (0.5 - cy * heightInStage) * 100, width };
}
