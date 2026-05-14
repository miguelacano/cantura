import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const fillVariants = cva("h-full rounded-full transition-all", {
  variants: {
    variant: {
      default: "bg-brand-primary",
      success: "bg-success-bold",
      warning: "bg-warning-icon",
      error: "bg-error-text",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ProgressBarProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof fillVariants> {
  /** 0–100 */
  value: number;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  value,
  variant,
  label,
  showPercent = false,
  className,
  ...props
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-xs font-medium text-text-muted">{label}</span>
          )}
          {showPercent && (
            <span className="text-xs font-medium text-text-subtle">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={fillVariants({ variant })}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
