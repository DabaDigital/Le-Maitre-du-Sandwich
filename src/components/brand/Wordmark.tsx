import { cn } from "@/lib/cn";

/** Text logo: "Le Maître" in display type over a letter-spaced "du Sandwich". */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-start leading-none", className)}>
      <span className="font-display text-[1.45em] uppercase tracking-[0.03em]">Le Maître</span>
      <span className="mt-[0.3em] text-[0.5em] font-semibold uppercase tracking-[0.42em]">du Sandwich</span>
    </span>
  );
}
