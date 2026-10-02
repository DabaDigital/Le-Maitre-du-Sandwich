# Le Maître du Sandwich

A cinematic, food-first website. Built with Next.js 16 (App Router), Tailwind CSS 4, GSAP ScrollTrigger and Lenis.

Production images are declared in `src/lib/assets.ts` (see below).

```bash
npm install
npm run dev      # http://localhost:4000
npm run build && npm start
```

## Experience

| Route | Contents |
| --- | --- |
| `/` | Scroll story (the sandwich comes toward the camera, opens, its ingredients float, then it closes and steps aside), the 4 signatures as full-page scenes, the menu index, the Casablanca map |
| `/menu` | The menu by category: a large food object plus the dishes set in big type |
| `/menu/[slug]` | Product page (the same view as the panel) |
| `/panier` | Cart → delivery → payment → the order is sent on WhatsApp |
| `/localisations` | Stylized Casablanca map (OpenStreetMap data) and the 3 addresses |
| `/ambiances`, `/contact` | Brand pages |

Clicking a product anywhere opens the full-screen **product panel**: the food can be dragged to rotate it, and the panel has options, quantity and add to cart. With `prefers-reduced-motion`, the scroll story is replaced by still compositions.

## Production images

Every image has one explicit role in **`src/lib/assets.ts`**: main photos, the ordered layers for the 2.5D opening (top to bottom), exploded references and brand assets. Files go anywhere under `public/images/` and are matched by **exact filename**. Never rename them.

```bash
npm run assets   # rescan public/images (also runs automatically before dev and build)
```

The scan writes `src/lib/asset-manifest.json` (dimensions, transparency, visible-pixel box) and lists every `Missing asset: …`.

Rules applied:
- **Missing files:** a missing file is never replaced. Its role simply disappears (no image, or type only).
- **Layers:** layers are drawn at their native size on a shared canvas (a 1–2 px difference is tolerated, never stretched). They only move vertically, which keeps their relative positions.
- **Photos without transparency** (e.g. `entrecote-main.webp`) only appear on black scenes, with their edges feathered.
- **Exploded references** (`*-exploded.webp`) are never displayed.

To replace an image, drop in a new file with the same name, then run `npm run assets`.

## Content to fill in (`TODO`)

- `src/lib/site.ts`: **WhatsApp number** that receives orders, opening hours, social media links.
- `src/lib/menu.ts`: sides, drinks and the prices of extras.
- `src/lib/stores.ts`: exact addresses, GPS coordinates and opening hours.

The map (`public/map/casablanca.svg`) is drawn from OpenStreetMap data (© OpenStreetMap contributors, ODbL).
