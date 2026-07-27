import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hideLabel?: boolean;
  error?: string;
  fieldClassName?: string;
};

export function Field({ label, hideLabel, error, id, className, fieldClassName, ...rest }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", fieldClassName)}>
      <label htmlFor={inputId} className={hideLabel ? "sr-only" : "text-sm font-medium text-ink-700"}>
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "h-11 rounded-md border border-border-strong bg-white px-3.5 text-sm text-ink-900",
          "placeholder:text-ink-400 focus-visible:border-brand-600",
          error && "border-danger-600",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="text-sm text-danger-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
