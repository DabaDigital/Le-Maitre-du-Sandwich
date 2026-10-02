import manifest from "./asset-manifest.json";
import type { CategoryId } from "./menu";

/**
 * The single source of truth for production images: every file has one explicit role.
 * Files live anywhere under /public/images. Reference a file by its exact filename, or by its
 * path under /public/images when the same filename exists in more than one folder.
 * To replace an image, drop the new file in with the same name and run `npm run assets`.
 * Layers are listed top → bottom and must share one canvas so they stack into one sandwich.
 */
export const ASSET_FILES = {
  entrecote: {
    main: "entrecote-main.webp",
    // Visual reference only: never displayed in place of the layers.
    reference: "entrecote-exploded.webp",
    // Final layer set (cut from the exploded reference). The older files with the same names
    // directly in entrecote/ are not used.
    layers: [
      { file: "entrecote/layers/entrecote-bread-top.png", label: "Pain croustillant", note: "Baguette chaude, croûte dorée" },
      { file: "entrecote/layers/entrecote-sauce.png", label: "Sauce maison", note: "Notre recette signature" },
      { file: "entrecote/layers/entrecote-onions.png", label: "Oignons caramélisés", note: "Dorés lentement" },
      { file: "entrecote/layers/entrecote-tomato.png", label: "Tomate mûre", note: "Tranchée à la commande" },
      { file: "entrecote/layers/entrecote-lettuce.png", label: "Salade croquante", note: "Feuilles fraîches du jour" },
      { file: "entrecote/layers/entrecote-steak.png", label: "Entrecôte grillée", note: "Saisie minute" },
      { file: "entrecote/layers/entrecote-bread-bottom.png", label: "Mie moelleuse", note: "Cuite chaque matin" },
    ],
  },
  classicXXL: {
    main: "classic-xxl-main.webp",
    reference: "classic-xxl-exploded.webp",
    layers: [
      { file: "classic-xxl-bun-top.png", label: "Bun brioché", note: "Doré, moelleux" },
      { file: "classic-xxl-sauce.png", label: "Sauce", note: "La recette du Maître" },
      { file: "classic-xxl-lettuce.png", label: "Salade", note: "Croquante" },
      { file: "classic-xxl-tomato.png", label: "Tomate", note: "Tranchée fraîche" },
      { file: "classic-xxl-onions.png", label: "Oignons", note: "Émincés" },
      { file: "classic-xxl-cheese-top.png", label: "Cheddar", note: "Fondant" },
      { file: "classic-xxl-patty-top.png", label: "Steak", note: "Bœuf grillé" },
      { file: "classic-xxl-cheese-bottom.png", label: "Cheddar", note: "Entre les steaks" },
      { file: "classic-xxl-patty-bottom.png", label: "Steak", note: "Double, forcément" },
      { file: "classic-xxl-bun-bottom.png", label: "Bun", note: "La base" },
    ],
  },
  mitraillette: {
    main: "mitraillette-main.webp",
  },
  brand: {
    crown: "crown.webp",
    fries: "fries.webp",
    // Decorative backdrop for the Casablanca section; the map itself stays geographic.
    cityscape: "casablanca-cityscape.webp",
    footerCrown: "footer-crown.webp",
  },
} as const;

export type Asset = {
  file: string;
  src: string;
  w: number;
  h: number;
  /** True for transparent cutouts; false for photos shot on a background. */
  alpha: boolean;
  /** Visible-pixel bounding box [x, y, w, h] in the file's own pixels (cutouts only). */
  box: [number, number, number, number] | null;
};

type ManifestEntry = Omit<Asset, "file"> & { format?: string };
// Generated JSON types boxes as number[]; the scanner always writes [x, y, w, h].
const files = manifest.files as unknown as Record<string, ManifestEntry>;

const keys = Object.keys(files);

/** Resolves a path under public/images (folder/…/name.ext) or a filename that exists exactly once. */
export function resolveAsset(file: string): Asset | null {
  const matches = file.includes("/") ? keys.filter((k) => k === file) : keys.filter((k) => k.split("/").pop() === file);
  // An ambiguous filename is not guessed: `npm run assets` reports it.
  if (matches.length !== 1) return null;
  const entry = files[matches[0]];
  return { file, src: entry.src, w: entry.w, h: entry.h, alpha: entry.alpha, box: entry.box };
}

export type Layer = { file: string; label: string; note: string; asset: Asset };

export type LayeredFood = {
  main: Asset | null;
  /**
   * The layers that are present, in order (missing files are skipped, never substituted and
   * reported by `npm run assets`). Null unless at least two are present on one shared canvas.
   */
  layers: Layer[] | null;
  /** The shared canvas the layers are positioned on (largest layer width/height). */
  canvas: { w: number; h: number } | null;
};

// Exported layers can differ by a pixel or two (e.g. 1671 vs 1672 px). Each layer is drawn at
// its native size from the canvas origin, so nothing is stretched to hide the difference.
const CANVAS_TOLERANCE = 2;

function layered(config: { main: string; layers: readonly { file: string; label: string; note: string }[] }): LayeredFood {
  const resolved = config.layers.map((layer) => ({ ...layer, asset: resolveAsset(layer.file) }));
  const layers = resolved.filter((layer): layer is Layer => layer.asset !== null);
  if (layers.length < 2) return { main: resolveAsset(config.main), layers: null, canvas: null };
  const canvas = {
    w: Math.max(...layers.map((layer) => layer.asset.w)),
    h: Math.max(...layers.map((layer) => layer.asset.h)),
  };
  const aligned = layers.every(
    (layer) => canvas.w - layer.asset.w <= CANVAS_TOLERANCE && canvas.h - layer.asset.h <= CANVAS_TOLERANCE,
  );
  return { main: resolveAsset(config.main), layers: aligned ? layers : null, canvas: aligned ? canvas : null };
}

export const entrecote = layered(ASSET_FILES.entrecote);
export const classicXXL = layered(ASSET_FILES.classicXXL);

export const brand = {
  crown: resolveAsset(ASSET_FILES.brand.crown),
  fries: resolveAsset(ASSET_FILES.brand.fries),
  cityscape: resolveAsset(ASSET_FILES.brand.cityscape),
  footerCrown: resolveAsset(ASSET_FILES.brand.footerCrown),
};

/** Product photos by menu slug. Products without a supplied photo are shown with type only. */
const productPhotos: Record<string, Asset | null> = {
  entrecote: entrecote.main,
  "classic-xxl": classicXXL.main,
  mitraillette: resolveAsset(ASSET_FILES.mitraillette.main),
};

export function productPhoto(slug: string): Asset | null {
  return productPhotos[slug] ?? null;
}

/** Menu index: the image that represents each category. Categories without one are shown as type only. */
export const categoryVisuals: Record<CategoryId, Asset | null> = {
  baguettes: entrecote.main,
  burgers: classicXXL.main,
  accompagnements: brand.fries,
  boissons: null,
};
