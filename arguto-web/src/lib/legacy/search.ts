import { productsFixture } from "@/lib/fixtures/products";
import { legacySearchResultSchema, type SearchSuggestion } from "@/lib/schemas/search";
import { z } from "zod";
import { fetchLegacyJson, isFixtureMode } from "./client";

const SUGGESTION_LIMIT = 8;

/**
 * `_ajax_busca.aspx?format=json` já existe e já devolve JSON em produção
 * (docs/01-ESCOPO.md §2.1) — o único endpoint do legado que não precisa de
 * nenhuma fachada nova.
 */
export async function searchProducts(term: string): Promise<SearchSuggestion[]> {
  const query = term.trim();
  if (query.length < 3) return [];

  if (isFixtureMode()) {
    const lower = query.toLowerCase();
    return productsFixture
      .filter((product) => product.descricaoSite.toLowerCase().includes(lower))
      .slice(0, SUGGESTION_LIMIT)
      .map((product) => ({
        nome: product.descricaoSite,
        imagem: product.imagem,
        link: product.link,
      }));
  }

  const results = await fetchLegacyJson(
    `/v1/_ajax_busca.aspx?Palavra=${encodeURIComponent(query)}&format=json`,
    z.array(legacySearchResultSchema),
    { revalidate: 0, timeoutMs: 2500 },
  );

  return results.slice(0, SUGGESTION_LIMIT).map((result) => ({
    nome: result.Produto.trim(),
    imagem: result.Foto,
    link: result.Link,
  }));
}
