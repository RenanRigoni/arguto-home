import { cookies } from "next/headers";
import { isFixtureMode } from "./client";

export type Session = {
  isAuthenticated: boolean;
  cartItemCount: number;
};

/**
 * Lê a sessão do legado a partir dos cookies existentes
 * (010101_CCLIID / 010101_CCLICOD / 010101_CCAR — docs/01-ESCOPO.md §2.6).
 * Nunca escreve cookie. Contagem do carrinho hoje não é lida de um cookie
 * legível — quando a fachada `carrinho` existir, este ponto passa a chamá-la.
 */
export async function getSession(): Promise<Session> {
  if (isFixtureMode()) {
    return { isAuthenticated: false, cartItemCount: 0 };
  }

  const cookieStore = await cookies();
  const clienteId = cookieStore.get("010101_CCLIID")?.value;

  return {
    isAuthenticated: Boolean(clienteId),
    cartItemCount: 0,
  };
}
