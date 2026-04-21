import { InputHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { Icon } from "./Icon";
import { cn } from "../lib/utils";

const inputVariants = cva(
  "w-full rounded-md border bg-surface-card text-text-primary text-base placeholder:text-text-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary-subtle focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2",
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

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** Inline error message shown below the input */
  error?: string;
  /** Material Symbols icon name rendered inside the leading edge */
  leadingIcon?: string;
}

export function Input({
  error,
  leadingIcon,
  className,
  id,
  ...props
}: InputProps) {
  const errorId = id && error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="relative">
        {leadingIcon && (
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-subtle">
            <Icon name={leadingIcon} size="sm" />
          </span>
        )}
        <input
          id={id}
          aria-invalid={!!error || undefined}
          aria-describedby={errorId}
          className={cn(
            inputVariants({ hasError: !!error }),
            leadingIcon && "pl-9"
          )}
          {...props}
        />
      </div>
      {error && (
        <span id={errorId} className="text-xs text-error-text">
          {error}
        </span>
      )}
    </div>
  );
}
