import Image from "next/image";
import type { Layer } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { contentExtent, phaseOffsets, type Phase } from "@/lib/explode";

type LayerStackProps = {
  layers: Layer[];
  canvas: { w: number; h: number };
  /**
   * Placement of the canvas inside the stage, in % of the stage box.
   * Omit when the canvas matches the stage (e.g. layers exported from the main photo's canvas).
   */
  placement?: { left: number; top: number; width: number };
  /** Hidden until the timeline swaps it in for the main photo. */
  hidden?: boolean;
  captions?: boolean;
  /** How the stack renders before any timeline moves it. */
  phase?: Phase;
  preload?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * One sandwich made of transparent layers on a shared canvas. Every layer wrapper covers the
 * whole canvas and the PNG inside keeps its native size from the canvas origin, so the files
 * line up exactly as authored. Opening the sandwich only translates the wrappers vertically;
 * the stack renders in `phase` (see phaseOffsets) until a scroll timeline takes over.
 */
export function LayerStack({
  layers,
  canvas,
  placement,
  hidden = false,
  captions = true,
  phase = "closed",
  preload,
  sizes = "(min-width: 1024px) 70vw, 130vw",
  className,
}: LayerStackProps) {
  const extent = contentExtent(layers, canvas);
  const offsets = phaseOffsets(layers, canvas, phase);

  return (
    <div
      data-stack
      className={cn("absolute", !placement && "inset-0", hidden && "invisible opacity-0", className)}
      style={
        placement
          ? { left: `${placement.left}%`, top: `${placement.top}%`, width: `${placement.width}%`, aspectRatio: `${canvas.w} / ${canvas.h}` }
          : undefined
      }
    >
      {layers.map((layer, i) => (
        <div
          key={layer.file}
          data-layer
          className="absolute inset-0 will-change-transform"
          style={{ zIndex: layers.length - i, transform: `translateY(${offsets[i]}%)` }}
        >
          <div data-float className="size-full">
            <Image
              src={layer.asset.src}
              width={layer.asset.w}
              height={layer.asset.h}
              alt=""
              quality={90}
              preload={preload}
              sizes={sizes}
              draggable={false}
              className="pointer-events-none absolute left-0 top-0 max-w-none select-none"
              style={{ width: `${(layer.asset.w / canvas.w) * 100}%`, height: `${(layer.asset.h / canvas.h) * 100}%` }}
            />
          </div>
        </div>
      ))}

      {captions &&
        layers.map((layer, i) => {
          const box = layer.asset.box ?? [0, 0, layer.asset.w, layer.asset.h];
          const top = ((box[1] + box[3] / 2) / canvas.h) * 100;
          const left = i % 2 === 0;
          return (
            <div
              key={layer.file}
              data-caption-track
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[60]"
              style={{ transform: `translateY(${offsets[i]}%)` }}
            >
              <div
                data-caption
                className={cn(
                  "invisible absolute w-[26%] -translate-y-1/2 opacity-0 [text-shadow:0_2px_12px_rgb(0_0_0/0.85)]",
                  left ? "text-right" : "text-left",
                )}
                style={
                  left
                    ? { top: `${top}%`, right: `${(1 - extent.left) * 100 + 2}%` }
                    : { top: `${top}%`, left: `${extent.right * 100 + 2}%` }
                }
              >
                <p className="eyebrow text-paper/40 max-lg:hidden">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-[10px] font-extrabold uppercase tracking-tight text-paper lg:text-lg">{layer.label}</p>
                <p className="mt-0.5 text-sm text-paper/55 max-lg:hidden">{layer.note}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
