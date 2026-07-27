"use client";

import Image from "next/image";
import { resolveLegacyImageSrc } from "@/lib/image";
import { toDisplayCase } from "@/lib/format";
import { IconBox, IconChevronRight } from "@/components/ui/Icon";
import type { SearchSuggestion } from "@/lib/schemas/search";

type Props = {
  id: string;
  term: string;
  suggestions: SearchSuggestion[];
  activeIndex: number;
  isLoading: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
  onHoverIndex: (index: number) => void;
};

export function SearchSuggestions({
  id,
  term,
  suggestions,
  activeIndex,
  isLoading,
  onSelect,
  onHoverIndex,
}: Props) {
  if (isLoading) {
    return (
      <div
        id={id}
        role="listbox"
        className="absolute left-0 right-0 top-full z-30 mt-1.5 rounded-lg border border-border bg-white p-4 text-sm text-ink-500 shadow-lg"
      >
        Buscando…
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div
        id={id}
        role="listbox"
        className="absolute left-0 right-0 top-full z-30 mt-1.5 rounded-lg border border-border bg-white p-4 text-sm text-ink-500 shadow-lg"
      >
        {/*
          Sugestão vazia sem saída é beco sem fim: o combobox filtra por
          nome, mas a busca completa do legado cobre mais campo. O link é a
          rota real do formulário, não uma promessa de resultado.
        */}
        <p>Nenhuma sugestão para &ldquo;{term}&rdquo;.</p>
        <a
          href={`/Busca/?q=${encodeURIComponent(term)}`}
          /* mesmo motivo do onMouseDown das opções: o onBlur do input
             fecha o painel e comeria o clique antes de navegar. */
          onMouseDown={(event) => event.preventDefault()}
          className="mt-2 inline-flex items-center gap-1 font-medium text-brand-600 underline underline-offset-4 hover:text-brand-900"
        >
          Buscar &ldquo;{term}&rdquo; em todo o catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
      <ul id={id} role="listbox" aria-label="Sugestões de produtos" className="max-h-96 overflow-y-auto py-2">
        {suggestions.map((suggestion, index) => {
          const isActive = index === activeIndex;
          const imageSrc = resolveLegacyImageSrc(suggestion.imagem);

          return (
            <li
              key={suggestion.link}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={isActive}
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(suggestion);
              }}
              onMouseEnter={() => onHoverIndex(index)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm ${
                isActive ? "bg-brand-50" : ""
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-50">
                {imageSrc ? (
                  <Image src={imageSrc} alt="" width={40} height={40} className="h-full w-full object-contain" />
                ) : (
                  /* mesmo vocabulário do card sem foto — caixa, não letra solta */
                  <IconBox className="h-4 w-4 text-ink-400" />
                )}
              </span>
              <span className="line-clamp-2 tracking-wide text-ink-700">{toDisplayCase(suggestion.nome)}</span>
            </li>
          );
        })}
      </ul>

      {/*
        A lista mostra no máximo o que o autocomplete devolve, e não havia
        saída visível para o resto: quem varria as sugestões e não achava
        precisava adivinhar que Enter leva à busca completa. O estado vazio
        já tinha essa saída; o estado com resultado não tinha.
      */}
      <a
        href={`/Busca/?q=${encodeURIComponent(term)}`}
        onMouseDown={(event) => event.preventDefault()}
        className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-sm font-medium text-brand-600 transition-colors duration-[var(--duration-fast)] hover:bg-brand-50"
      >
        <span className="line-clamp-1">Ver todos os resultados para &ldquo;{term}&rdquo;</span>
        <IconChevronRight className="h-4 w-4 shrink-0" />
      </a>
    </div>
  );
}
