import { isFixtureMode } from "./client";

export type AddToCartResult = {
  ok: boolean;
  erro: string | null;
};

/**
 * `_salva_produto.aspx?CodProduto=&Qtd=` já existe e já grava no carrinho
 * via GET simples (docs/01-ESCOPO.md §2.3), mas hoje devolve um `<script>`
 * sem status legível. A adaptação A-02 (docs/05-HOME-SPEC.md, seção de
 * adaptações mínimas) pede `&format=json` devolvendo
 * `{ ok, itens, erro }` — quando existir, troca-se só o parse da resposta
 * abaixo, a assinatura desta função não muda.
 */
export async function addToCart(codProduto: string, quantidade: number): Promise<AddToCartResult> {
  if (isFixtureMode()) {
    return { ok: true, erro: null };
  }

  const legacyOrigin = process.env.LEGACY_ORIGIN ?? "https://origin.arguto.com.br";
  const url = `${legacyOrigin}/v1/_salva_produto.aspx?CodProduto=${encodeURIComponent(codProduto)}&Qtd=${quantidade}`;

  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    return { ok: false, erro: "Não foi possível adicionar o produto ao carrinho." };
  }

  return { ok: true, erro: null };
}
