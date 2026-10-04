import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

type PriceTagProps = { price: number; size?: "md" | "lg"; className?: string };

/** The red price label used on cards and product pages. */
export function PriceTag({ price, size = "md", className }: PriceTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] bg-flame font-display leading-none tracking-wide tabular-nums text-paper",
        size === "md" ? "px-2 pb-[3px] pt-[5px] text-[15px]" : "px-3 pb-1 pt-[7px] text-2xl",
        className,
      )}
    >
      {formatPrice(price)}
    </span>
  );
}
