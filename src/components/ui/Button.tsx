import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "quiet";

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[0.8125rem] uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-600 disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-terracotta-600 text-sand-50 hover:bg-terracotta-700",
  outline:
    "border border-clay-400 text-ink-800 hover:border-ink-800 hover:bg-sand-100",
  quiet: "border border-sand-50/50 text-sand-50 hover:bg-sand-50/10",
};

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
