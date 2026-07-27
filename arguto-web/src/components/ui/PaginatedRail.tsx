"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { IconChevronRight } from "./Icon";

type Props = {
  children: ReactNode;
  "aria-label": string;
};

/**
 * Trilho com setas + bolinhas de página (pedido do cliente, referência
 * de listagem de produtos). Setas avançam uma "página" (largura visível
 * do trilho); bolinhas refletem a posição de scroll e são clicáveis.
 * Scroll nativo por toque/roda continua funcionando por baixo.
 */
export function PaginatedRail({ children, "aria-label": ariaLabel }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    function updatePageCount() {
      if (!rail) return;
      const visible = rail.clientWidth;
      if (visible === 0) return;
      setPageCount(Math.max(1, Math.round(rail.scrollWidth / visible)));
    }

    function handleScroll() {
      if (!rail) return;
      const visible = rail.clientWidth;
      if (visible === 0) return;
      /*
        O último ponto de encaixe do scroll-snap é o início do último card,
        não o fim do trilho: sobram ~8px que nunca são percorridos. Com a
        posição dividida pela largura visível, a última bolinha nunca
        acendia — no mobile o dedo chegava ao fim de Ofertas e o indicador
        continuava dizendo 7 de 8. No fim do trilho o índice é o último,
        por definição, sem depender do arredondamento.
      */
      const pages = Math.max(1, Math.round(rail.scrollWidth / visible));
      const isAtEnd = rail.scrollLeft >= rail.scrollWidth - visible - 4;
      const index = isAtEnd ? pages - 1 : Math.round(rail.scrollLeft / visible);
      setActiveIndex((current) => (current === index ? current : index));
    }

    const resizeObserver = new ResizeObserver(updatePageCount);
    resizeObserver.observe(rail);
    rail.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      rail.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function goToPage(index: number) {
    railRef.current?.scrollTo({ left: index * railRef.current.clientWidth, behavior: "smooth" });
  }

  function scrollByPage(direction: 1 | -1) {
    railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth, behavior: "smooth" });
  }

  /*
    Departamento com poucos itens (Bebidas e Limpeza têm 3) mostrava as
    duas setas assim mesmo, sobre um trilho que não rola: o clique não
    fazia nada e a seta prometia mais catálogo do que existe. Sem página
    extra as setas somem; com página extra, cada uma desliga na ponta em
    que já não há para onde ir.
  */
  const hasPages = pageCount > 1;
  const isFirstPage = activeIndex <= 0;
  const isLastPage = activeIndex >= pageCount - 1;
  const arrowClass =
    "absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-ink-700 shadow-md transition-opacity duration-[var(--duration-fast)] hover:border-brand-600 disabled:pointer-events-none disabled:opacity-0 lg:flex";

  return (
    <div>
      <div className="relative">
        {hasPages ? (
          <button
            type="button"
            aria-label="Anterior"
            disabled={isFirstPage}
            onClick={() => scrollByPage(-1)}
            className={`${arrowClass} -left-4`}
          >
            <IconChevronRight className="h-4 w-4 rotate-180" />
          </button>
        ) : null}

        <div
          ref={railRef}
          role="group"
          aria-label={ariaLabel}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>

        {hasPages ? (
          <button
            type="button"
            aria-label="Próximo"
            disabled={isLastPage}
            onClick={() => scrollByPage(1)}
            className={`${arrowClass} -right-4`}
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {hasPages ? (
        // A bolinha continua com 6px, mas o alvo clicável tem 24px
        // (WCAG 2.5.8 AA) — e este trilho é usado no mobile.
        <div role="tablist" aria-label="Páginas" className="mt-1.5 flex justify-center">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Página ${index + 1} de ${pageCount}`}
              onClick={() => goToPage(index)}
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] ${
                  index === activeIndex ? "w-5 bg-brand-600" : "w-1.5 bg-border-strong group-hover:bg-ink-400"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
