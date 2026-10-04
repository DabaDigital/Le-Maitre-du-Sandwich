import type { Layer } from "./assets";

type Canvas = { w: number; h: number };
export type Phase = "closed" | "open" | "wide";

export const boxOf = (layer: Layer) => layer.asset.box ?? [0, 0, layer.asset.w, layer.asset.h];

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
