import { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Material Symbols icon name rendered before the label */
  iconLeft?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-text-inverse hover:bg-brand-primary-hover disabled:opacity-50",
  secondary:
    "bg-brand-primary-subtle text-brand-primary hover:opacity-90 disabled:opacity-50",
  outline:
    "border border-brand-primary text-brand-primary hover:bg-brand-primary-subtle disabled:opacity-50",
  ghost: "text-brand-primary hover:bg-brand-primary-subtle disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
