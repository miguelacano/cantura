import { SelectHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { Icon } from "./Icon";
import { cn } from "../lib/utils";

const selectVariants = cva(
  "w-full appearance-none rounded-md border bg-surface-card text-text-primary text-base transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary-subtle focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed pl-3 pr-9 py-2",
  {
    variants: {
      hasError: {
        true: "border-error-text",
        false: "border-border-default hover:border-border-strong",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Inline error message shown below the select */
  error?: string;
  /** Disabled placeholder option shown when no value is selected */
  placeholder?: string;
}

export function Select({
  error,
  placeholder,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const errorId = id && error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error || undefined}
          aria-describedby={errorId}
          className={selectVariants({ hasError: !!error })}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-text-subtle">
          <Icon name="expand_more" size="sm" />
        </span>
      </div>
      {error && (
        <span id={errorId} className="text-xs text-error-text">
          {error}
        </span>
      )}
    </div>
  );
}
