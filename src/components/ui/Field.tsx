import type { InputHTMLAttributes, ReactNode } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
};

const inputClasses =
  "mt-1 block w-full border-0 border-b border-paper/20 bg-transparent px-0 py-2.5 text-[15px] font-medium text-paper placeholder:text-paper/30 transition-[border-color,box-shadow] read-only:text-paper/60 focus:border-paper focus:shadow-[0_1px_0_0_var(--color-paper)] focus:outline-none aria-invalid:border-[#ff6b5c] aria-invalid:shadow-[0_1px_0_0_#ff6b5c]";

/** Checkout input on the dark scene: bottom border only (design system). */
export function Field({ id, label, error, hint, className, ...input }: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-[0.14em] text-paper/55">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClasses}
        {...input}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-[#ff6b5c]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-paper/50">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
