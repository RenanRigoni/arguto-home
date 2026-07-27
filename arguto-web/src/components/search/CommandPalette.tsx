"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Navigation } from "@/lib/schemas/navigation";
import type { Supplier } from "@/lib/schemas/supplier";
import type { CommandResult } from "@/lib/schemas/commandPalette";
import { toDisplayCase } from "@/lib/format";
import { IconSearch } from "@/components/ui/Icon";

type Props = {
  navigation: Navigation;
  suppliers: Supplier[];
};

const GROUP_LABEL: Record<CommandResult["group"], string> = {
  departamento: "Departamentos",
  categoria: "Categorias",
  fornecedor: "Fornecedores",
  produto: "Produtos",
};

const GROUP_ORDER: CommandResult["group"][] = ["produto", "departamento", "categoria", "fornecedor"];

/*
 * Rótulo exibido em caixa mista, igual ao resto do site: o produto já
 * passava por toDisplayCase e departamento/categoria/fornecedor não, então
 * a mesma lista misturava "Biscoito Aymoré Maria 185g" com "BEBIDAS NÃO
 * ALCOÓLICAS". A busca abaixo continua sobre o rótulo exibido — como ela é
 * case-insensitive e o termo digitado também é normalizado, nada muda no
 * que casa.
 */
function buildStaticIndex(navigation: Navigation, suppliers: Supplier[]): CommandResult[] {
  const departmentResults: CommandResult[] = navigation.departamentos.map((department) => ({
    group: "departamento",
    label: toDisplayCase(department.nome),
    href: department.rota,
  }));

  const categoryResults: CommandResult[] = navigation.departamentos.flatMap((department) =>
    department.categorias.map((category) => ({
      group: "categoria" as const,
      label: toDisplayCase(category.nome),
      sublabel: toDisplayCase(department.nome),
      href: category.rota,
    })),
  );

  const supplierResults: CommandResult[] = suppliers.map((supplier) => ({
    group: "fornecedor",
    label: toDisplayCase(supplier.nome),
    href: supplier.rota,
  }));

  return [...departmentResults, ...categoryResults, ...supplierResults];
}

export function CommandPalette({ navigation, suppliers }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [productResults, setProductResults] = useState<CommandResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const staticIndex = useMemo(() => buildStaticIndex(navigation, suppliers), [navigation, suppliers]);

  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      setTerm("");
      setProductResults([]);
      setActiveIndex(0);
    }
  }

  function handleTermChange(value: string) {
    setTerm(value);
    setActiveIndex(0);
  }

  useEffect(() => {
    abortRef.current?.abort();

    if (term.trim().length < 3) {
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const suggestions: { nome: string; link: string }[] = await response.json();
        setProductResults(
          suggestions.map((suggestion) => ({
            group: "produto" as const,
            label: toDisplayCase(suggestion.nome),
            href: suggestion.link,
          })),
        );
      } catch {
        setProductResults([]);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [term]);

  const filteredStatic = useMemo(() => {
    const query = term.trim().toLowerCase();
    if (query.length === 0) return [];
    return staticIndex.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 15);
  }, [staticIndex, term]);

  const results = useMemo(() => {
    const effectiveProductResults = term.trim().length < 3 ? [] : productResults;
    const combined = [...effectiveProductResults, ...filteredStatic];
    return GROUP_ORDER.flatMap((group) => combined.filter((item) => item.group === group));
  }, [productResults, filteredStatic, term]);

  function handleSelect(result: CommandResult) {
    handleOpenChange(false);
    router.push(result.href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSelect(results[activeIndex]);
    }
  }

  let runningIndex = -1;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/50" />
        <Dialog.Content
          className="fixed left-1/2 top-24 z-50 w-[90vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-lg bg-white shadow-lg motion-safe:data-[state=open]:animate-[menu-panel-in_var(--duration-normal)_var(--ease-out-expo)]"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Busca rápida</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <IconSearch className="h-5 w-5 shrink-0 text-ink-400" />
            <input
              autoFocus
              type="text"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="command-palette-listbox"
              aria-activedescendant={results.length > 0 ? `command-palette-option-${activeIndex}` : undefined}
              value={term}
              onChange={(event) => handleTermChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar produto, departamento ou fornecedor..."
              className="h-14 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
            <kbd className="hidden shrink-0 rounded-sm border border-border-strong px-1.5 py-0.5 text-[11px] text-ink-500 sm:inline">
              Esc
            </kbd>
          </div>

          {term.trim().length > 0 ? (
            <ul id="command-palette-listbox" role="listbox" className="max-h-[60vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-ink-500">
                  Nenhum resultado para &ldquo;{term}&rdquo;.
                </li>
              ) : (
                GROUP_ORDER.map((group) => {
                  const groupItems = results.filter((item) => item.group === group);
                  if (groupItems.length === 0) return null;

                  return (
                    <li key={group}>
                      <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                        {GROUP_LABEL[group]}
                      </p>
                      <ul role="group" aria-label={GROUP_LABEL[group]}>
                        {groupItems.map((item) => {
                          runningIndex += 1;
                          const index = runningIndex;
                          const isActive = index === activeIndex;

                          return (
                            <li key={`${item.group}-${item.href}`}>
                              <button
                                type="button"
                                id={`command-palette-option-${index}`}
                                role="option"
                                aria-selected={isActive}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => handleSelect(item)}
                                className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left ${
                                  isActive ? "bg-brand-50" : ""
                                }`}
                              >
                                <span className={`text-sm text-ink-900 ${item.group === "produto" ? "tracking-wide" : ""}`}>
                                  {item.label}
                                </span>
                                {item.sublabel ? (
                                  <span className="text-xs text-ink-500">{item.sublabel}</span>
                                ) : null}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })
              )}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-ink-500">
              Digite para buscar em todo o catálogo, departamentos e fornecedores.
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-ink-400">
            <span>↑↓ para navegar, Enter para ir</span>
            <Link href="/Busca/" onClick={() => handleOpenChange(false)} className="text-brand-600 hover:text-brand-900">
              Busca completa
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
