import { TextareaHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

const textareaVariants = cva(
  "w-full rounded-md border bg-surface-card text-text-primary text-base placeholder:text-text-subtle transition-colors resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-brand-primary-subtle focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2",
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

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Inline error message shown below the textarea */
  error?: string;
}

export function Textarea({ error, className, id, ...props }: TextareaProps) {
  const errorId = id && error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <textarea
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={errorId}
        className={textareaVariants({ hasError: !!error })}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-xs text-error-text">
          {error}
        </span>
      )}
    </div>
  );
}
