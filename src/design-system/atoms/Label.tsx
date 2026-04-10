import { LabelHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const labelVariants = cva(
  "text-xs font-bold tracking-widest uppercase",
  {
    variants: {
      muted: {
        true: "text-text-muted",
        false: "text-text-primary",
      },
    },
    defaultVariants: {
      muted: false,
    },
  }
);

interface LabelProps
  extends
    LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

export function Label({ muted, className, children, ...props }: LabelProps) {
  return (
    <label className={cn(labelVariants({ muted }), className)} {...props}>
      {children}
    </label>
  );
}
