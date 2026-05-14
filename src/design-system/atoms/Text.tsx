import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-lg font-normal leading-relaxed",
      md: "text-base font-normal leading-relaxed",
      sm: "text-sm font-normal leading-relaxed",
    },
    muted: {
      true: "text-text-muted",
      false: "text-text-primary",
    },
  },
  defaultVariants: {
    size: "md",
    muted: false,
  },
});

type TextTag = "p" | "span" | "div";

interface TextProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: TextTag;
}

export function Text({
  as: Tag = "p",
  size,
  muted,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag className={cn(textVariants({ size, muted }), className)} {...props}>
      {children}
    </Tag>
  );
}
