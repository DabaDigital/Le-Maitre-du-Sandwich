"use client";

import Link from "next/link";
import { dismissToast, useToast } from "@/lib/toast";

export function Toast() {
  const toast = useToast();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4 md:bottom-8"
    >
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto flex animate-toast-in items-center gap-5 rounded-full bg-paper py-2 pl-6 pr-2 text-ink shadow-[0_20px_60px_rgb(0_0_0/0.45)]"
        >
          <span className="eyebrow">{toast.title}</span>
          {toast.href && (
            <Link
              href={toast.href}
              onClick={dismissToast}
              className="rounded-full bg-ink px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-paper hover:bg-[#2b2b2b]"
            >
              {toast.action}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
