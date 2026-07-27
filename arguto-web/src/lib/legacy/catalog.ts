import { navigationFixture } from "@/lib/fixtures/navigation";
import { productsFixture } from "@/lib/fixtures/products";
import { productSchema, type Product } from "@/lib/schemas/product";
import { z } from "zod";
import { fetchLegacyJson, isFixtureMode } from "./client";

type CatalogQuery = {
  departamento?: string;
  categoria?: string;
  fornecedor?: string;
  offset?: number;
  limite?: number;
};

function buildQueryString(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.departamento) params.set("dep", query.departamento);
  if (query.categoria) params.set("cat", query.categoria);
  if (query.fornecedor) params.set("fornecedor", query.fornecedor);
  params.set("offset", String(query.offset ?? 0));
  params.set("limite", String(query.limite ?? 12));
  return params.toString();
}

/**
 * Product (docs/05-HOME-SPEC.md §7) não carrega o código do departamento —
 * só categoria/subcategoria. Em modo fixture, o departamento é resolvido
 * cruzando com a taxonomia real de navigationFixture.
 */
function filterFixtureByQuery(query: CatalogQuery): Product[] {
  let produtos = productsFixture;

  if (query.categoria) {
    produtos = produtos.filter((produto) => produto.categoria === query.categoria);
  } else if (query.departamento) {
    const departamento = navigationFixture.departamentos.find((dep) => dep.codigo === query.departamento);
    const categoriasDoDepartamento = new Set(departamento?.categorias.map((cat) => cat.nome) ?? []);
    produtos = produtos.filter((produto) => produto.categoria !== null && categoriasDoDepartamento.has(produto.categoria));
  }

  if (query.fornecedor) {
    produtos = produtos.filter((produto) => produto.fornecedorCodigo === query.fornecedor);
  }

  return produtos;
}

/** Fachada: GET /v1/api/catalogo.aspx (docs/04-ESTRUTURA.md §3.3). */
export async function getCatalog(query: CatalogQuery = {}): Promise<Product[]> {
  if (isFixtureMode()) {
    const filtrado = filterFixtureByQuery(query);
    return filtrado.slice(query.offset ?? 0, (query.offset ?? 0) + (query.limite ?? 12));
  }

  return fetchLegacyJson(`/v1/api/catalogo.aspx?${buildQueryString(query)}`, z.array(productSchema), {
    revalidate: 900,
  });
}

/** Fachada: GET /v1/api/ofertas.aspx (docs/04-ESTRUTURA.md §3.3). */
export async function getOffers(limite = 12): Promise<Product[]> {
  if (isFixtureMode()) {
    // Amostragem espaçada só para a fixture de dev: dá variedade de
    // fornecedor/categoria em vez dos 12 primeiros itens (quase todos
    // AYMORE/biscoitos), que deixaria "Ofertas" idêntica à vitrine de
    // ALIMENTOS.
    const passo = Math.max(1, Math.floor(productsFixture.length / limite));
    return productsFixture.filter((_, index) => index % passo === 0).slice(0, limite);
  }
  return fetchLegacyJson(`/v1/api/ofertas.aspx?limite=${limite}`, z.array(productSchema), {
    revalidate: 900,
  });
}
