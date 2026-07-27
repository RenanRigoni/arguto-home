"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";
import type { Navigation } from "@/lib/schemas/navigation";
import { IconChevronDown, IconClose } from "@/components/ui/Icon";

type Props = {
  navigation: Navigation;
  isOpen: boolean;
  onClose: () => void;
};

export function MobileNav({ navigation, isOpen, onClose }: Props) {
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink-900/40" />
        <Dialog.Content
          className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm overflow-y-auto bg-white shadow-lg"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Dialog.Title className="font-display text-lg text-ink-900">Navegação</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Fechar menu"
                className="flex h-11 w-11 items-center justify-center rounded-md text-ink-700 hover:bg-surface-100"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Departamentos" className="p-2">
            {navigation.departamentos.map((department) => {
              const isExpanded = expandedCode === department.codigo;

              return (
                <div key={department.codigo} className="border-b border-border last:border-none">
                  <div className="flex items-center">
                    <Link
                      href={department.rota}
                      onClick={onClose}
                      className="flex-1 px-3 py-3.5 text-sm font-medium text-ink-900"
                    >
                      {department.nome}
                    </Link>
                    {department.categorias.length > 0 ? (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-label={`Mostrar categorias de ${department.nome}`}
                        onClick={() => setExpandedCode(isExpanded ? null : department.codigo)}
                        className="flex h-11 w-11 items-center justify-center text-ink-500"
                      >
                        <IconChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    ) : null}
                  </div>

                  {isExpanded ? (
                    <ul className="pb-2">
                      {department.categorias.map((category) => (
                        <li key={category.codigo}>
                          <Link
                            href={category.rota}
                            onClick={onClose}
                            className="block px-6 py-2.5 text-sm text-ink-700"
                          >
                            {category.nome}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex flex-col gap-1 border-t border-border p-3">
            <Link href="/Fornecedores/" onClick={onClose} className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-100">
              Fornecedores
            </Link>
            <Link href="/Ofertas/" onClick={onClose} className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-100">
              Ofertas
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
