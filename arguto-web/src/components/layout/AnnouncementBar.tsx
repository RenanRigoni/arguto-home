import Link from "next/link";
import { getSession } from "@/lib/legacy/session";

/**
 * Barra de topo única. Antes eram duas faixas indigo empilhadas
 * (AnnouncementBar + UtilityBar), ~84px de cromo antes do header — e
 * três azuis diferentes no primeiro viewport contando o hero. Aqui viram
 * uma faixa só de 36px: atalhos utilitários à esquerda, chamada de login
 * à direita.
 *
 * Os atalhos aparecem pra todo mundo (cliente logado também precisa de
 * "Meus pedidos"); só a chamada "Já é nosso cliente?" some depois do
 * login — preço só existe com sessão (docs/05-HOME-SPEC.md §7), então a
 * frase é fato confirmado, não cupom inventado.
 */
export async function AnnouncementBar() {
  const session = await getSession();

  return (
    <div className="bg-brand-900 text-white">
      <div className="mx-auto flex h-9 w-full max-w-[var(--container-max)] items-center justify-between gap-4 px-[var(--space-gutter)] text-xs">
        <nav aria-label="Atalhos de atendimento e conta" className="flex items-center gap-4 sm:gap-6">
          <Link href="/Contato/" className="text-white/80 transition-colors hover:text-white">
            Atendimento
          </Link>
          <Link href="/ComoComprar/" className="hidden text-white/80 transition-colors hover:text-white sm:inline">
            Como comprar
          </Link>
          <Link href="/MeusPedidos/" className="text-white/80 transition-colors hover:text-white">
            Meus pedidos
          </Link>
        </nav>

        {session.isAuthenticated ? null : (
          <p className="flex items-center gap-2 text-white/80">
            <span className="hidden md:inline">Já é nosso cliente?</span>
            <Link
              href="/Login/"
              className="font-semibold text-white underline underline-offset-[3px] transition-colors hover:text-accent-500"
            >
              Entre para ver preços
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
