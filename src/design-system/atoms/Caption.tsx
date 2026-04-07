import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const captionVariants = cva("text-xs font-medium tracking-normal", {
  variants: {
    subtle: {
      true: "text-text-subtle",
      false: "text-text-muted",
    },
  },
  defaultVariants: {
    subtle: false,
  },
});

interface CaptionProps
  extends
    HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof captionVariants> {}

export function Caption({
  subtle,
  className,
  children,
  ...props
}: CaptionProps) {
  return (
    <span className={cn(captionVariants({ subtle }), className)} {...props}>
      {children}
    </span>
  );
}
