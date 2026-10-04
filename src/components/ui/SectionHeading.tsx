import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  id: string;
  kicker: string;
  title: ReactNode;
  /** Short copy set beside the title on large screens. */
  aside?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
};

/** Red kicker, condensed display title and an optional aside: the opening of every section. */
export function SectionHeading({ id, kicker, title, aside, as: Title = "h2", className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-16", className)}>
      <div>
        <p className="kicker">{kicker}</p>
        <Title id={id} className="display mt-3 text-[15vw] sm:text-7xl lg:text-[clamp(4rem,6.4vw,6.5rem)]">
          {title}
        </Title>
      </div>
      {aside && <p className="max-w-xs text-sm leading-relaxed text-paper/65 lg:pb-3">{aside}</p>}
    </div>
  );
}
