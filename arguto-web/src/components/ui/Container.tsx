import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: Props) {
  return (
    <div
      className={cn("mx-auto w-full px-[var(--space-gutter)]", className)}
      style={{ maxWidth: "var(--container-max)" }}
    >
      {children}
    </div>
  );
}
