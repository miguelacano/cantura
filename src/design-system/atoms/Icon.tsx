import { HTMLAttributes } from "react";

type IconSize = "sm" | "md" | "lg" | "xl";

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols name, e.g. "check_circle", "arrow_forward" */
  name: string;
  size?: IconSize;
  /** Filled variant of the icon */
  filled?: boolean;
}

const sizeClasses: Record<IconSize, string> = {
  sm: "text-base", // ~16px
  md: "text-xl", // ~20px
  lg: "text-2xl", // ~24px
  xl: "text-3xl", // ~30px
};

export function Icon({
  name,
  size = "md",
  filled = false,
  className = "",
  style,
  ...props
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${sizeClasses[size]} ${className}`}
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
