type LogoProps = {
  /** "dark" = black disc, white type. "light" = white disc, black type. */
  tone?: "dark" | "light";
  /** Unique per page instance: prefixes the SVG textPath ids. */
  id?: string;
  className?: string;
  title?: string;
};

export function Logo({ tone = "dark", id = "logo", className, title }: LogoProps) {
  const bg = tone === "dark" ? "#111111" : "#ffffff";
  const fg = tone === "dark" ? "#ffffff" : "#111111";
  const top = `${id}-arc-top`;
  const bottom = `${id}-arc-bottom`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <path id={top} d="M 28 100 A 72 72 0 0 1 172 100" />
        <path id={bottom} d="M 14 100 A 86 86 0 0 0 186 100" />
      </defs>
      <circle cx="100" cy="100" r="98" fill={bg} stroke={fg} strokeWidth={tone === "light" ? 2 : 0} />
      <circle cx="100" cy="100" r="92" fill="none" stroke={fg} strokeWidth="2" />
      <circle cx="100" cy="100" r="62" fill="none" stroke={fg} strokeWidth="1.5" />
      <g fill={fg} fontFamily="var(--font-montserrat), sans-serif" fontWeight="800">
        <text fontSize="22" letterSpacing="3">
          <textPath href={`#${top}`} startOffset="50%" textAnchor="middle">
            LE MAÎTRE
          </textPath>
        </text>
        <text fontSize="19" letterSpacing="2.5">
          <textPath href={`#${bottom}`} startOffset="50%" textAnchor="middle">
            DU SANDWICH
          </textPath>
        </text>
        <circle cx="21" cy="100" r="3" />
        <circle cx="179" cy="100" r="3" />
      </g>
      {/* Crown */}
      <path d="M79 77 L75 57 L89 67 L100 51 L111 67 L125 57 L121 77 Z" fill={fg} />
      {/* Burger */}
      <path d="M70 105 Q70 83 100 83 Q130 83 130 105 Z" fill={fg} />
      <g fill={bg}>
        <ellipse cx="90" cy="93" rx="2.4" ry="1.4" />
        <ellipse cx="102" cy="90" rx="2.4" ry="1.4" />
        <ellipse cx="113" cy="95" rx="2.4" ry="1.4" />
      </g>
      <path
        d="M68 111 q4 -4 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0"
        fill="none"
        stroke={fg}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="68" y="116" width="64" height="10" rx="5" fill={fg} />
      <path d="M70 130 H130 Q130 142 118 142 H82 Q70 142 70 130 Z" fill={fg} />
    </svg>
  );
}
