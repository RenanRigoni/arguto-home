import { productsAuthenticatedFixture, productsFixture } from "@/lib/fixtures/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

export const metadata = { robots: { index: false, follow: false } };

/**
 * Página de desenvolvimento — não faz parte da home pública.
 * Demonstra os 7 estados do ProductCard lado a lado
 * (docs/05-HOME-SPEC.md §8.7 e §11, etapa 11).
 */
export default function ProductStatesDevPage() {
  const states = [
    { label: "1. Anônimo (sem sessão)", node: <ProductCard product={productsFixture[0]} /> },
    { label: "2. Autenticado (com preço)", node: <ProductCard product={productsAuthenticatedFixture[0]} /> },
    {
      // índice 6 (007915) tem estoque zero com preço normal — índice 2 também
      // tem estoque zero, mas seu preço é 0 de propósito (ver fixtures/products.ts),
      // o que misturaria dois estados diferentes num único card.
      label: "3. Produto indisponível (estoque zero)",
      node: <ProductCard product={productsAuthenticatedFixture[6]} />,
    },
    { label: "4. Carregando", node: <ProductCardSkeleton /> },
    {
      label: "5. Sem imagem",
      node: <ProductCard product={productsAuthenticatedFixture[9]} />,
    },
    {
      label: "6. Oferta",
      node: <ProductCard product={productsAuthenticatedFixture[0]} isOffer />,
    },
    {
      label: "7. Múltiplo de embalagem (12)",
      node: <ProductCard product={productsAuthenticatedFixture[5]} />,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl text-ink-900">Estados do ProductCard</h1>
      <div className="flex flex-wrap gap-8">
        {states.map((state) => (
          <div key={state.label} className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink-500">{state.label}</p>
            {state.node}
          </div>
        ))}
      </div>
    </div>
  );
}
