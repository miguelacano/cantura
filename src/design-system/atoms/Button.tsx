import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Icon } from "./Icon";
import { cn } from "../lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-text-inverse hover:bg-brand-primary-hover disabled:opacity-50",
        secondary:
          "bg-brand-primary-subtle text-brand-primary hover:opacity-90 disabled:opacity-50",
        outline:
          "border border-brand-primary text-brand-primary hover:bg-brand-primary-subtle disabled:opacity-50",
        ghost:
          "text-brand-primary hover:bg-brand-primary-subtle disabled:opacity-50",
      },
      size: {
        sm: "px-3 py-1.5 text-sm gap-1.5",
        md: "px-4 py-2 text-sm gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  /** Material Symbols icon name rendered before the label */
  iconLeft?: string;
}

export function Button({
  variant,
  size,
  loading = false,
  iconLeft,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Icon name="progress_activity" size="sm" className="animate-spin" />
      ) : iconLeft ? (
        <Icon name={iconLeft} size="sm" />
      ) : null}
      {children}
    </button>
  );
}
