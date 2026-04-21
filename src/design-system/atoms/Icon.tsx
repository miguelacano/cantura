import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const iconVariants = cva(
  "material-symbols-outlined select-none leading-none",
  {
    variants: {
      size: {
        sm: "text-base", // ~16px
        md: "text-xl", // ~20px
        lg: "text-2xl", // ~24px
        xl: "text-3xl", // ~30px
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface IconProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof iconVariants> {
  /** Material Symbols name, e.g. "check_circle", "arrow_forward" */
  name: string;
  /** Filled variant of the icon */
  filled?: boolean;
}

export function Icon({
  name,
  size,
  filled = false,
  className,
  style,
  ...props
}: IconProps) {
  return (
    <span
      className={cn(iconVariants({ size }), className)}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 300, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
