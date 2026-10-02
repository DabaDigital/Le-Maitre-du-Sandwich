import { Minus, Plus } from "lucide-react";
import { MAX_QTY } from "@/lib/cart";
import { cn } from "@/lib/cn";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  /** Product name, used in the button labels for screen readers. */
  label: string;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  /** "light" on black scenes, "dark" on white pages. */
  tone?: "light" | "dark";
  className?: string;
};

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = MAX_QTY,
  size = "md",
  tone = "dark",
  className,
}: QuantityStepperProps) {
  const button = cn(
    "grid place-items-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-25",
    tone === "light" ? "hover:bg-paper/10" : "hover:bg-ink/5",
    size === "sm" ? "size-8" : "size-11",
  );
  const icon = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div
      role="group"
      aria-label={`Quantité : ${label}`}
      className={cn(
        "inline-flex items-center rounded-full border",
        tone === "light" ? "border-paper/25" : "border-ink/20",
        className,
      )}
    >
      <button
        type="button"
        className={button}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Diminuer la quantité (${label})`}
      >
        <Minus className={icon} strokeWidth={2} />
      </button>
      <output aria-live="polite" className={cn("text-center font-bold tabular-nums", size === "sm" ? "w-6 text-sm" : "w-8 text-base")}>
        {value}
      </output>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Augmenter la quantité (${label})`}
      >
        <Plus className={icon} strokeWidth={2} />
      </button>
    </div>
  );
}
