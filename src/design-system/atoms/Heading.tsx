import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const headingVariants = cva("text-text-primary", {
  variants: {
    level: {
      lg: "text-4xl font-extrabold tracking-tight",
      md: "text-2xl font-bold tracking-tight",
      sm: "text-xl font-bold tracking-tight",
      xs: "text-base font-semibold",
    },
  },
  defaultVariants: {
    level: "md",
  },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const defaultTag: Record<"lg" | "md" | "sm" | "xs", HeadingTag> = {
  lg: "h1",
  md: "h2",
  sm: "h3",
  xs: "h4",
};

interface HeadingProps
  extends
    HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  /** Override the rendered HTML element */
  as?: HeadingTag;
}

export function Heading({
  level,
  as,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = as ?? defaultTag[level ?? "md"];
  return (
    <Tag className={cn(headingVariants({ level }), className)} {...props}>
      {children}
    </Tag>
  );
}
