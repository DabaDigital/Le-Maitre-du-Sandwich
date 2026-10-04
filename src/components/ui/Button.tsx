import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** "light" is the cream primary, "outline-light" the secondary; "flame" is the red accent. */
type Variant = "light" | "outline-light" | "flame";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  light: "bg-paper text-ink hover:bg-mist",
  "outline-light": "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  flame: "bg-flame text-paper hover:bg-ember",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[10px]",
  md: "h-11 px-6 text-[11px]",
  lg: "h-13 px-7 text-[12px]",
};

type StyleProps = { variant?: Variant; size?: Size; className?: string };

export function buttonClasses({ variant = "light", size = "md", className }: StyleProps = {}) {
  return cn(
    "group/btn inline-flex select-none items-center justify-center gap-3 whitespace-nowrap rounded-btn font-bold uppercase tracking-[0.16em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    className,
  );
}

/** The red arrow that ends every call to action. */
function Arrow({ variant }: { variant?: Variant }) {
  return (
    <ArrowRight
      aria-hidden
      className={cn(
        "size-3.5 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5",
        variant !== "flame" && "text-flame",
      )}
      strokeWidth={2.5}
    />
  );
}

type ContentProps = { children: ReactNode; arrow?: boolean };

type ButtonProps = StyleProps & ContentProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, className, type = "button", arrow, children, ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      {children}
      {arrow && <Arrow variant={variant} />}
    </button>
  );
}

type ButtonLinkProps = StyleProps & ContentProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** Internal paths use next/link; tel:, mailto: and http(s) links render a plain <a>. */
export function ButtonLink({ variant, size, className, href, arrow, children, ...props }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      {children}
      {arrow && <Arrow variant={variant} />}
    </>
  );
  if (/^(https?:|tel:|mailto:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}
