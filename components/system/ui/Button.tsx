import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "saffron" | "dark";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-navy-600 text-white shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_8px_20px_-8px_rgba(31,67,184,0.55)] hover:bg-navy-700",
  secondary: "bg-white text-ink ring-1 ring-inset ring-line-strong hover:bg-surface",
  ghost: "text-ink-2 hover:bg-surface hover:text-ink",
  saffron: "bg-saffron-500 text-ink shadow-[0_8px_20px_-8px_rgba(255,138,31,0.6)] hover:bg-saffron-400",
  dark: "bg-ink text-white hover:bg-[#1c1f2a]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-3.5 text-label",
  md: "h-11 gap-2 px-5 text-[15px]",
  lg: "h-14 gap-2.5 px-7 text-[17px]",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseProps &
  (
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
  );

/**
 * Pill buttons. Press feedback is a CSS transform (off the main thread) so it
 * stays crisp even while a page is busy.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", iconLeft, iconRight, className, children, ...rest },
  ref,
) {
  const classes = cn(
    "group/btn relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium",
    "transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const content = (
    <>
      {iconLeft}
      <span>{children}</span>
      {iconRight && (
        <span className="transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5">{iconRight}</span>
      )}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...anchor } = rest;
    if (external) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} target="_blank" rel="noreferrer" className={classes} {...anchor}>
          {content}
        </a>
      );
    }
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...anchor}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} className={classes} {...button}>
      {content}
    </button>
  );
});
