"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchSuggestion } from "@/lib/schemas/search";
import { IconSearch } from "@/components/ui/Icon";
import { SearchSuggestions } from "./SearchSuggestions";

async function fetchSuggestions(term: string, signal: AbortSignal): Promise<SearchSuggestion[]> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal });
  if (!response.ok) return [];
  return (await response.json()) as SearchSuggestion[];
}

export function SearchField() {
  const router = useRouter();
  const listboxId = useId();
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);

  function handleChange(value: string) {
    setTerm(value);
    setActiveIndex(-1);

    abortRef.current?.abort();

    if (value.trim().length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsOpen(true);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(value, controller.signal);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    controller.signal.addEventListener("abort", () => clearTimeout(timeoutId));
  }

  function handleSelect(suggestion: SearchSuggestion) {
    setIsOpen(false);
    setTerm(suggestion.nome);
    router.push(suggestion.link);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <form
      method="get"
      action="/Busca/"
      role="search"
      className="relative w-full"
      onSubmit={() => setIsOpen(false)}
    >
      <label htmlFor="site-search" className="sr-only">
        Buscar produtos
      </label>
      <div className="flex h-12 items-center rounded-md border border-border-strong bg-white focus-within:border-brand-600 sm:h-11">
        <input
          id="site-search"
          name="q"
          type="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          placeholder="Busque por produto, marca ou categoria"
          value={term}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsOpen(false), 120)}
          onFocus={() => term.trim().length >= 3 && setIsOpen(true)}
          className="h-full flex-1 bg-transparent px-4 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
        <kbd
          aria-hidden="true"
          className="mr-2 hidden shrink-0 items-center gap-0.5 rounded-sm border border-border-strong px-1.5 py-0.5 text-[11px] text-ink-400 lg:flex"
        >
          Ctrl K
        </kbd>
        <button
          type="submit"
          aria-label="Buscar"
          className="flex h-full items-center gap-2 rounded-r-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          <IconSearch className="h-5 w-5" />
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </div>

      {isOpen ? (
        <SearchSuggestions
          id={listboxId}
          term={term}
          suggestions={suggestions}
          activeIndex={activeIndex}
          isLoading={isLoading}
          onSelect={handleSelect}
          onHoverIndex={setActiveIndex}
        />
      ) : null}
    </form>
  );
}
