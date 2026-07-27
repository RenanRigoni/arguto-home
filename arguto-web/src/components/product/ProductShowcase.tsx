import type { Product } from "@/lib/schemas/product";
import { Container } from "@/components/ui/Container";
import { PaginatedRail } from "@/components/ui/PaginatedRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "./ProductCard";

type Props = {
  titulo: string;
  rotaVerTodos?: string;
  produtos: Product[];
  variant?: "default" | "oferta";
};

export function ProductShowcase({ titulo, rotaVerTodos, produtos, variant = "default" }: Props) {
  if (produtos.length === 0) return null;

  const isOffer = variant === "oferta";

  /*
    Quatro vitrines iguais em sequência (Ofertas + 3 departamentos) somavam
    ~46% da altura da página com o mesmo fundo, o mesmo título e o mesmo
    trilho — o olho lia tudo como um bloco só. A de oferta ganha superfície
    própria e a marca laranja; os departamentos continuam brancos e por isso
    passam a se ler como um grupo. Ritmo por diferença real de conteúdo, não
    alternância mecânica de cor.
  */
  return (
    <section
      aria-labelledby={`showcase-${slugify(titulo)}`}
      className={`border-t border-border py-8 sm:py-10 ${isOffer ? "bg-surface-100" : ""}`}
    >
      <Container className="scroll-reveal">
        <SectionHeading
          id={`showcase-${slugify(titulo)}`}
          title={titulo}
          href={rotaVerTodos}
          hasOfferMark={isOffer}
        />
        <PaginatedRail aria-label={titulo}>
          {produtos.map((product) => (
            <div key={product.codProduto} className="snap-start">
              <ProductCard product={product} isOffer={isOffer} />
            </div>
          ))}
        </PaginatedRail>
      </Container>
    </section>
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-");
}
