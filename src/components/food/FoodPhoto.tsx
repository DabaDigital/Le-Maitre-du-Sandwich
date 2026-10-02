import Image from "next/image";
import type { Ref } from "react";
import type { Asset } from "@/lib/assets";
import { cn } from "@/lib/cn";

type AssetImageProps = {
  asset: Asset;
  alt: string;
  sizes?: string;
  preload?: boolean;
  quality?: number;
  /** "width": natural height at full width. "contain": fit a box. "cover": fill a box (thumbnails). */
  fit?: "width" | "contain" | "cover";
  /** Feather the edges of photos that have a background (default true). */
  feather?: boolean;
  className?: string;
};

/**
 * A production image exactly as supplied: never recoloured or filtered (only cart thumbnails crop).
 * Photos shot on a background (no transparency) get feathered edges so they melt into
 * the black scenes instead of reading as a framed rectangle.
 */
export function AssetImage({
  asset,
  alt,
  sizes = "50vw",
  preload,
  quality,
  fit = "width",
  feather = true,
  className,
}: AssetImageProps) {
  return (
    <Image
      src={asset.src}
      width={asset.w}
      height={asset.h}
      alt={alt}
      sizes={sizes}
      preload={preload}
      quality={quality}
      draggable={false}
      className={cn(
        "pointer-events-none block select-none",
        fit === "width" ? "h-auto w-full" : fit === "contain" ? "size-full object-contain" : "size-full object-cover",
        feather && !asset.alpha && "photo-feather",
        className,
      )}
    />
  );
}

type FoodPhotoProps = AssetImageProps & {
  /** Scene the object sits in: cutouts on black get a pool of light under their shadow. */
  env?: "dark" | "light";
  /** Slow idle 3D sway. */
  sway?: boolean;
  /** Rotate, scale (and deepen the shadow of cutouts) when an ancestor `.group` is hovered. */
  hoverable?: boolean;
  /** Element to drive with cursor tilt / drag rotation. */
  tiltRef?: Ref<HTMLDivElement>;
};

/** A food image floating freely in the scene: no frame, just light, depth and motion. */
export function FoodPhoto({
  asset,
  alt,
  sizes,
  preload,
  quality,
  env = "dark",
  sway = false,
  hoverable = false,
  tiltRef,
  className,
}: FoodPhotoProps) {
  return (
    <div className={cn("relative [perspective:1400px]", asset.alpha && "pb-[9%]", className)}>
      {/* Cutouts need a shadow to sit in space; photos carry their own light. */}
      {asset.alpha && env === "dark" && <div aria-hidden className="food-floor" />}
      {asset.alpha && (
        <div
          aria-hidden
          className={cn(
            "food-shadow",
            env === "dark" ? "opacity-90" : "opacity-60",
            hoverable && "group-hover:scale-x-115 group-hover:opacity-100",
          )}
        />
      )}
      {/* Separate wrappers so cursor tilt, hover and idle sway never fight over one transform. */}
      <div ref={tiltRef} className="relative will-change-transform [transform-style:preserve-3d]">
        <div
          className={cn(
            hoverable &&
              "transition-[transform,filter] duration-[900ms] ease-cine group-hover:[transform:rotateY(12deg)_rotateZ(-3deg)_scale(1.06)]",
            hoverable && !asset.alpha && "group-hover:drop-shadow-[0_40px_60px_rgb(0_0_0/0.8)]",
          )}
        >
          <div className={cn(sway && "sway")}>
            <AssetImage asset={asset} alt={alt} sizes={sizes} preload={preload} quality={quality} />
          </div>
        </div>
      </div>
    </div>
  );
}
