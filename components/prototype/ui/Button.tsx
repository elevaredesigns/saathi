import { CircleNotch } from "@phosphor-icons/react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "saffron" | "dark" | "danger";
type Size = "lg" | "md" | "sm";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-navy-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_24px_-10px_rgba(31,67,184,0.6)] active:bg-navy-700",
  secondary: "bg-white text-ink ring-1 ring-inset ring-line-strong active:bg-surface",
  ghost: "bg-transparent text-navy-600 active:bg-navy-50",
  saffron: "bg-saffron-500 text-ink shadow-[0_10px_24px_-10px_rgba(255,138,31,0.65)] active:bg-saffron-400",
  dark: "bg-ink text-white active:bg-[#1c1f2a]",
  danger: "bg-red-50 text-red-600 active:bg-red-50/70",
};

const sizeClasses: Record<Size, string> = {
  lg: "h-[54px] px-6 text-[17px] rounded-[16px]",
  md: "h-[46px] px-5 text-[15px] rounded-[14px]",
  sm: "h-[36px] px-3.5 text-[13px] rounded-[12px]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/** App button. Feedback is on press (scale), never after release. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "lg", fullWidth, loading, iconLeft, iconRight, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex select-none items-center justify-center gap-2 font-semibold tracking-[-0.005em]",
        "transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out active:scale-[0.97]",
        "disabled:pointer-events-none disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? <CircleNotch size={18} weight="bold" className="animate-spin" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
});
