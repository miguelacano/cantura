import { InputHTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange"
> {
  label?: string;
  onChange?: (checked: boolean) => void;
}

export function Toggle({
  label,
  className,
  id,
  onChange,
  ...props
}: ToggleProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 cursor-pointer select-none",
        className
      )}
      htmlFor={id}
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          role="switch"
          className="sr-only peer"
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          {...props}
        />
        {/* Track */}
        <div className="w-9 h-5 rounded-full bg-surface-elevated border border-border-default transition-colors peer-checked:bg-brand-primary peer-checked:border-brand-primary peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary-subtle peer-disabled:opacity-50" />
        {/* Thumb */}
        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-surface-card shadow-sm transition-transform peer-checked:translate-x-4" />
      </div>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
}
