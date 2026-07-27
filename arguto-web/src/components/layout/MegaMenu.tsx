"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useState } from "react";
import type { Navigation } from "@/lib/schemas/navigation";
import type { Channel } from "@/lib/schemas/channel";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconChevronDown, IconChevronRight } from "@/components/ui/Icon";

type Props = {
  navigation: Navigation;
  channels: Channel[];
};

const triggerClasses =
  "flex h-11 items-center gap-1 px-3 text-sm font-medium text-ink-700 hover:text-brand-600 data-[state=open]:text-brand-600";

const panelClasses =
  "absolute left-0 top-full z-20 w-full border-t border-border bg-white shadow-lg " +
  "data-[state=closed]:hidden motion-safe:data-[state=open]:animate-[menu-panel-in_var(--duration-normal)_var(--ease-out-expo)]";

export function MegaMenu({ navigation, channels }: Props) {
  const [activeCode, setActiveCode] = useState(navigation.departamentos[0]?.codigo ?? "");
  const activeDepartment =
    navigation.departamentos.find((department) => department.codigo === activeCode) ??
    navigation.departamentos[0];

  return (
    <NavigationMenu.Root className="relative hidden border-b border-border bg-surface-0 lg:block">
      <NavigationMenu.List className="mx-auto flex w-full max-w-[var(--container-max)] items-center gap-1 px-[var(--space-gutter)]">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClasses}>
            Departamentos
            <IconChevronDown className="h-4 w-4" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content forceMount className={panelClasses}>
            <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-[260px_1fr] gap-8 px-[var(--space-gutter)] py-6">
              <ul aria-label="Departamentos" className="flex flex-col gap-0.5 border-r border-border pr-6">
                {navigation.departamentos.map((department) => (
                  <li key={department.codigo}>
                    <Link
                      href={department.rota}
                      onMouseEnter={() => setActiveCode(department.codigo)}
                      onFocus={() => setActiveCode(department.codigo)}
                      className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium ${
                        department.codigo === activeCode
                          ? "bg-brand-50 text-brand-600"
                          : "text-ink-700 hover:bg-surface-100"
                      }`}
                    >
                      {department.nome}
                      <IconChevronRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="max-h-96 overflow-y-auto">
                {activeDepartment && activeDepartment.categorias.length > 0 ? (
                  <>
                    <ul className="columns-2 gap-6">
                      {activeDepartment.categorias.map((category) => (
                        <li key={category.codigo} className="break-inside-avoid pb-2.5">
                          <Link href={category.rota} className="text-sm text-ink-700 hover:text-brand-600">
                            {category.nome}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={activeDepartment.rota}
                      className="mt-3 inline-flex items-center gap-1 border-t border-border pt-3 text-sm font-medium text-brand-600"
                    >
                      Ver tudo em {activeDepartment.nome}
                      <IconChevronRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <EmptyState
                    title={`${activeDepartment?.nome ?? ""} ainda não tem subcategorias cadastradas`}
                    action={
                      activeDepartment ? (
                        <Link href={activeDepartment.rota} className="text-sm font-medium text-brand-600">
                          Ver tudo em {activeDepartment.nome} →
                        </Link>
                      ) : null
                    }
                  />
                )}
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/Fornecedores/" className={triggerClasses}>
              Fornecedores
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/Ofertas/" className={triggerClasses}>
              Ofertas
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        {channels.length > 0 ? (
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className={triggerClasses}>
              Canais
              <IconChevronDown className="h-4 w-4" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content forceMount className={panelClasses}>
              <ul className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-1 px-[var(--space-gutter)] py-4">
                {channels.map((channel) => (
                  <li key={channel.id}>
                    <Link href={channel.rota} className="block rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-surface-100">
                      {channel.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        ) : null}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
