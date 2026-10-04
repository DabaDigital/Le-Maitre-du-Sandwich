/**
 * Width of the longest line in em, at the display face's average capital width (~0.52em).
 * Set it as `--glyphs` and size the title with `calc(<box width in cqw> / var(--glyphs))`
 * so long single words ("Accompagnements") shrink to fit their card instead of overflowing.
 */
export function fitGlyphs(lines: string[]) {
  return (Math.max(...lines.map((line) => line.length)) * 0.52).toFixed(2);
}
