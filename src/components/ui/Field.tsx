import type { InputHTMLAttributes, ReactNode } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
};

const inputClasses =
  "mt-1 block w-full border-0 border-b border-ink/25 bg-transparent px-0 py-2.5 text-[15px] font-medium text-ink placeholder:text-steel/70 transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_1px_0_0_#111] focus:outline-none aria-invalid:border-[#b42318] aria-invalid:shadow-[0_1px_0_0_#b42318]";

/** Checkout input: white surface, bottom border only (design system). */
export function Field({ id, label, error, hint, className, ...input }: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-[0.14em] text-steel">
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
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-[#b42318]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-steel">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
