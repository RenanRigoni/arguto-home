import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  tone?: "default" | "alternate" | "brand";
  as?: "section" | "div";
  "aria-labelledby"?: string;
};

const toneClasses: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-surface-50",
  alternate: "bg-surface-100",
  brand: "bg-brand-600 text-white",
};

export function Section({ children, className, tone = "default", as = "section", ...rest }: Props) {
  const Tag = as;
  return (
    <Tag
      className={cn("py-[var(--space-section-y)]", toneClasses[tone], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
