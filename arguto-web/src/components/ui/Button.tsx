import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "md" | "sm";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent-500 text-white hover:bg-accent-600 border border-transparent",
  secondary: "bg-white text-brand-600 border border-border-strong hover:border-brand-600",
  ghost: "bg-transparent text-ink-700 hover:bg-surface-100 border border-transparent",
  link: "bg-transparent text-brand-600 hover:text-brand-900 underline underline-offset-4 p-0 h-auto",
};

const sizeClasses: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-3.5 text-sm",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-[var(--duration-fast)] disabled:opacity-50 disabled:pointer-events-none";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
    href: string;
  };

type NativeButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const OWN_KEYS = ["variant", "size", "className", "children", "href"] as const;

function pickNativeProps<T extends object>(props: T): Omit<T, (typeof OWN_KEYS)[number]> {
  const nativeProps = { ...props };
  for (const key of OWN_KEYS) {
    delete (nativeProps as Record<string, unknown>)[key];
  }
  return nativeProps;
}

function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return typeof props.href === "string";
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(baseClasses, variantClasses[variant], variant !== "link" && sizeClasses[size], className);

  if (isLinkButton(props)) {
    const anchorProps = pickNativeProps(props);
    return (
      <Link href={props.href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = pickNativeProps(props);
  return (
    <button type={props.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
