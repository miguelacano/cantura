import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional centered text label — renders a flex row layout */
  label?: string;
}

export function Divider({ label, className, ...props }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)} {...props}>
        <div className="flex-1 h-px bg-border-default" />
        <span className="text-xs font-medium text-text-subtle">{label}</span>
        <div className="flex-1 h-px bg-border-default" />
      </div>
    );
  }

  return (
    <hr
      className={cn("border-none h-px bg-border-default", className)}
      {...(props as HTMLAttributes<HTMLHRElement>)}
    />
  );
}
