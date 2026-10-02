import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** "light" buttons sit on black scenes, "dark" ones on white editorial pages. */
type Variant = "light" | "outline-light" | "dark" | "outline-dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  light: "bg-paper text-ink hover:bg-mist",
  "outline-light": "border border-paper/35 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  dark: "bg-ink text-paper hover:bg-[#2b2b2b]",
  "outline-dark": "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[10px]",
  md: "h-12 px-6 text-[11px]",
  lg: "h-14 px-8 text-[12px]",
};

type StyleProps = { variant?: Variant; size?: Size; className?: string };

export function buttonClasses({ variant = "light", size = "md", className }: StyleProps = {}) {
  return cn(
    "inline-flex select-none items-center justify-center gap-3 whitespace-nowrap rounded-btn font-bold uppercase tracking-[0.22em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = StyleProps & ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = StyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children: ReactNode };

/** Internal paths use next/link; tel:, mailto: and http(s) links render a plain <a>. */
export function ButtonLink({ variant, size, className, href, ...props }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  if (/^(https?:|tel:|mailto:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    );
  }
  return <Link href={href} className={classes} {...props} />;
}
