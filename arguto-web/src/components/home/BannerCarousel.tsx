"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconChevronRight } from "@/components/ui/Icon";

type Props = {
  images: string[];
};

const AUTOPLAY_MS = 6000;

/**
 * Banners reais baixados do site atual (fornecedores: Gulozitos, Arcor
 * etc.) — a peça de campanha já vem pronta do fornecedor, sem texto
 * nosso por cima (docs/05-HOME-SPEC.md §6: não fabricar conteúdo de
 * campanha). Mesma disciplina de motion do resto do site: pausa no
 * hover/foco, desliga com prefers-reduced-motion.
 *
 * Não traz superfície nem largura própria: mora dentro da banda indigo
 * do Hero, que já dá Container e fundo. Aqui só a peça e os controles.
 */
export function BannerCarousel({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotionRef.current || images.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, images.length]);

  if (images.length === 0) return null;

  function goTo(index: number) {
    setActiveIndex(((index % images.length) + images.length) % images.length);
  }

  return (
    <div
      role="group"
      aria-roledescription="carrossel"
      aria-label="Ofertas de fornecedores"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative">
        <button
          type="button"
          aria-label="Banner anterior"
          onClick={() => goTo(activeIndex - 1)}
          className="absolute -left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-900 shadow-md transition-colors duration-[var(--duration-fast)] hover:text-brand-600 sm:flex"
        >
          <IconChevronRight className="h-4 w-4 rotate-180" />
        </button>

        <Link
          href="/Fornecedores/"
          className="relative block aspect-[18/5] w-full overflow-hidden rounded-lg bg-white"
          aria-label="Ver fornecedores"
        >
          {/*
            As 15 ficam montadas o tempo todo, troca é só opacidade — não
            remount por índice. Remount forçava re-fetch a cada clique e
            deixava o banner ainda não visitado em branco até baixar
            (bug real visto pelo cliente). ~1MB total pro conjunto todo,
            custo aceitável pra eliminar o flash.
          */}
          {images.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 1320px, 100vw"
              className={`object-cover transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              priority={index === 0}
            />
          ))}
        </Link>

        <button
          type="button"
          aria-label="Próximo banner"
          onClick={() => goTo(activeIndex + 1)}
          className="absolute -right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-900 shadow-md transition-colors duration-[var(--duration-fast)] hover:text-brand-600 sm:flex"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/*
        15 bolinhas de 1,5px numa tela de 375 é alvo impossível de acertar
        (WCAG 2.5.8) e ruído visual. No mobile o controle vira anterior /
        contador / próximo, com alvo de 44px — as setas laterais só existem
        de sm pra cima. De sm em diante voltam as bolinhas clicáveis.
      */}
      {images.length > 1 ? (
        <>
          <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={() => goTo(activeIndex - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-md text-white/80 hover:text-white"
            >
              <IconChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <p aria-live="polite" className="font-mono text-xs text-white/80">
              {activeIndex + 1} / {images.length}
            </p>
            <button
              type="button"
              aria-label="Próximo banner"
              onClick={() => goTo(activeIndex + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-md text-white/80 hover:text-white"
            >
              <IconChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/*
            A bolinha continua com 6px, mas o botão tem 24px de alvo
            (WCAG 2.5.8 AA): o alvo é o padding, não o desenho.
          */}
          <div role="tablist" aria-label="Banners" className="mt-1.5 hidden justify-center sm:flex">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Banner ${index + 1} de ${images.length}`}
                onClick={() => goTo(index)}
                className="group flex h-6 w-6 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] ${
                    index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/35 group-hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
