"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { IconChevronRight } from "./Icon";

type Props = {
  children: ReactNode;
  "aria-label": string;
};

/**
 * Trilho com setas prev/next (docs: referência Alentejana "Produtores").
 * O scroll nativo por toque/roda continua funcionando — as setas são só
 * um atalho de clique. Único pedaço client desta seção.
 */
export function ArrowScrollRail({ children, "aria-label": ariaLabel }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: 1 | -1) {
    railRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Anterior"
        onClick={() => scrollByAmount(-1)}
        className="absolute -left-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-ink-700 shadow-md hover:border-brand-600 lg:flex"
      >
        <IconChevronRight className="h-4 w-4 rotate-180" />
      </button>

      <div
        ref={railRef}
        role="group"
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Próximo"
        onClick={() => scrollByAmount(1)}
        className="absolute -right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-ink-700 shadow-md hover:border-brand-600 lg:flex"
      >
        <IconChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
