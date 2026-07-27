import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  "aria-label": string;
};

/**
 * Trilho horizontal em CSS puro — scroll-snap nativo, sem biblioteca de
 * carrossel (docs/05-HOME-SPEC.md §3.4/§8.8). Navegação por teclado e
 * touch funcionam pelo scroll nativo do navegador.
 */
export function ScrollRail({ children, className, "aria-label": ariaLabel }: Props) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
