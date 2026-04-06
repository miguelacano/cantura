import Image from "next/image";
import { HTMLAttributes } from "react";

type AvatarSize = "sm" | "md" | "lg";
type AvatarStatus = "online" | "offline" | "away";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  /** Fallback text when no src — typically first + last initial */
  initials?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  alt?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-6 text-xs",
  md: "size-8 text-sm",
  lg: "size-10 text-base",
};

const sizePixels: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

const statusDotSizeClasses: Record<AvatarSize, string> = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

const statusColorClasses: Record<AvatarStatus, string> = {
  online: "bg-success-bold",
  offline: "bg-text-subtle",
  away: "bg-warning-icon",
};

export function Avatar({
  src,
  initials,
  size = "md",
  status,
  alt = "",
  className = "",
  ...props
}: AvatarProps) {
  const px = sizePixels[size];

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="rounded-full object-cover"
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-brand-primary-subtle text-brand-primary font-bold flex items-center justify-center select-none`}
        >
          {initials ?? "?"}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusDotSizeClasses[size]} rounded-full border-2 border-surface-card ${statusColorClasses[status]}`}
        />
      )}
    </div>
  );
}
