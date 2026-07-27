import dynamic from "next/dynamic";
import Link from "next/link";
import type { Product } from "@/lib/schemas/product";
import { toDisplayCase } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { PriceDisplay } from "./PriceDisplay";
import { StockBadge } from "./StockBadge";

/**
 * Code-split: só baixa o JS do stepper/adicionar quando o card realmente
 * pode renderizá-lo (cliente autenticado + estoque > 0). Visitante anônimo
 * — 100% do tráfego institucional/SEO da home — nunca paga esse bundle
 * (docs/05-HOME-SPEC.md, achado de performance do /audit).
 */
const AddToCartControl = dynamic(() => import("./AddToCartControl").then((mod) => mod.AddToCartControl));

type Props = {
  product: Product;
  isOffer?: boolean;
};

export function ProductCard({ product, isOffer }: Props) {
  const isAuthenticated = product.preco !== null;
  const isAvailable = product.estoque > 0;
  const canAddToCart = isAuthenticated && isAvailable;
  const displayName = toDisplayCase(product.descricaoSite);

  return (
    <article className="group flex w-[200px] shrink-0 flex-col overflow-hidden rounded-md border border-border bg-white transition-colors duration-[var(--duration-fast)] hover:border-border-strong sm:w-[220px]">
      <div className="relative">
        <Link href={product.link} aria-hidden="true" tabIndex={-1}>
          <ProductImage imagem={product.imagem} alt={displayName} isUnavailable={!isAvailable} />
        </Link>
        <StockBadge estoque={product.estoque} />
        {/*
          Produto sem estoque carregava os dois selos ao mesmo tempo:
          "Indisponível" à esquerda e "Oferta" à direita, na mesma imagem.
          Além do ruído, é uma promessa que a Arguto não pode cumprir —
          sem estoque não há oferta, só o aviso.
        */}
        {isOffer && isAvailable ? (
          <span className="absolute right-2 top-2 rounded-sm bg-accent-500 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Oferta
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-border p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{product.fornecedor}</p>

        <Link href={product.link} className="min-h-[2.5rem]">
          <h3 className="line-clamp-2 text-sm font-medium tracking-wide text-ink-900">{displayName}</h3>
        </Link>

        <p className="font-mono text-xs text-ink-500">Cód. {product.codProduto}</p>

        <div className="mt-auto flex flex-col gap-2 pt-1">
          <PriceDisplay preco={product.preco} isUnavailable={!isAvailable} />

          {canAddToCart ? (
            <AddToCartControl codProduto={product.codProduto} estoque={product.estoque} multiplo={product.multiplo} />
          ) : null}
        </div>
      </div>
    </article>
  );
}
