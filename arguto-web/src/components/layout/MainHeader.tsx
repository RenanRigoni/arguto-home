"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Navigation } from "@/lib/schemas/navigation";
import type { Session } from "@/lib/legacy/session";
import { assetPath } from "@/lib/assetPath";
import { Button } from "@/components/ui/Button";
import { IconCart, IconMenu, IconUser } from "@/components/ui/Icon";
import { SearchField } from "@/components/search/SearchField";
import { MobileNav } from "./MobileNav";

type Props = {
  navigation: Navigation;
  session: Session;
};

export function MainHeader({ navigation, session }: Props) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  return (
    <div className="border-b border-border bg-white">
      {/*
        gap menor + logo menor no mobile é o que faz [menu][logo][conta][carrinho]
        caber numa linha só em 375px. Antes as ações quebravam pra uma linha
        própria (header de 3 fileiras, 185px de altura) com um vão vazio à
        esquerda — o comprador recorrente pagava isso em scroll toda visita.
      */}
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-wrap items-center gap-x-3 gap-y-3 px-[var(--space-gutter)] py-3 lg:gap-x-4">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Abrir menu de navegação"
          className="flex h-11 w-11 items-center justify-center rounded-md text-ink-700 hover:bg-surface-100 lg:hidden"
        >
          <IconMenu className="h-6 w-6" />
        </button>

        <Link href="/" aria-label="Arguto — página inicial" className="shrink-0">
          <Image
            src={assetPath("/brand/logo-arguto.png")}
            alt="Arguto"
            width={166}
            height={36}
            className="h-7 w-auto sm:h-9"
          />
        </Link>

        <div className="order-3 w-full lg:order-2 lg:w-auto lg:flex-1">
          <SearchField />
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 lg:order-3 lg:ml-0">
          {session.isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                onBlur={() => setTimeout(() => setIsAccountMenuOpen(false), 120)}
                className="flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink-700 hover:bg-surface-100"
              >
                <IconUser className="h-5 w-5" />
                <span className="hidden sm:inline">Minha conta</span>
              </button>
              {isAccountMenuOpen ? (
                <ul
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-1.5 w-48 rounded-md border border-border bg-white py-1.5 shadow-md"
                >
                  <li role="none">
                    <Link role="menuitem" href="/MeusPedidos/" className="block px-4 py-2 text-sm text-ink-700 hover:bg-surface-100">
                      Meus pedidos
                    </Link>
                  </li>
                  <li role="none">
                    <Link role="menuitem" href="/MeusDados/" className="block px-4 py-2 text-sm text-ink-700 hover:bg-surface-100">
                      Meus dados
                    </Link>
                  </li>
                  <li role="none">
                    <Link role="menuitem" href="/Login/?sair=1" className="block px-4 py-2 text-sm text-ink-700 hover:bg-surface-100">
                      Sair
                    </Link>
                  </li>
                </ul>
              ) : null}
            </div>
          ) : (
            <Button href="/Login/" variant="secondary" size="sm">
              Entrar
            </Button>
          )}

          <Link
            href="/Carrinho/"
            aria-label={`Carrinho, ${session.cartItemCount} ${session.cartItemCount === 1 ? "item" : "itens"}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-md text-ink-700 hover:bg-surface-100"
          >
            <IconCart className="h-6 w-6" />
            {session.cartItemCount > 0 ? (
              <span className="badge-pop absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-semibold text-white">
                {session.cartItemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      <MobileNav navigation={navigation} isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </div>
  );
}
