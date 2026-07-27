import type { Metadata } from "next";
import type { Product } from "@/lib/schemas/product";
import { getCatalog, getOffers } from "@/lib/legacy/catalog";
import { getChannels } from "@/lib/legacy/channels";
import { getNavigation } from "@/lib/legacy/navigation";
import { getSession } from "@/lib/legacy/session";
import { getSuppliers } from "@/lib/legacy/suppliers";
import { homeMetadata } from "@/lib/seo/metadata";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonLd";
import { Hero } from "@/components/home/Hero";
import { DepartmentGrid } from "@/components/home/DepartmentGrid";
import { ServiceStrip } from "@/components/home/ServiceStrip";
import { ChannelSection } from "@/components/home/ChannelSection";
import { SupplierShowcase } from "@/components/home/SupplierShowcase";
import { CustomerOnboarding } from "@/components/home/CustomerOnboarding";
import { ProductShowcase } from "@/components/product/ProductShowcase";

export const metadata: Metadata = homeMetadata;

/*
  Título em caixa mista de propósito: o nome cru do Protheus é "ALIMENTOS",
  e as vitrines eram as únicas headlines da home ainda em caixa alta —
  "Categorias", "Ofertas" e "Canais de atendimento" ao lado delas. O código
  do departamento é o que liga ao legado, não a grafia do rótulo.
*/
const FEATURED_DEPARTMENTS = [
  { codigo: "000900", nome: "Alimentos", rota: "/produtos/alimentos/000900/" },
  { codigo: "000902", nome: "Bebidas", rota: "/produtos/bebidas/000902/" },
  { codigo: "000904", nome: "Limpeza", rota: "/produtos/limpeza/000904/" },
];

/*
  Vitrine é prateleira: o que não tem estoque não ocupa a altura dos olhos.
  Duas ofertas indisponíveis estavam nas posições 2 e 4 de "Ofertas" — o
  trilho mais comercial da página abria anunciando o que a Arguto não pode
  entregar. Ordenação estável, então a ordem comercial que o legado mandou
  é preservada dentro de cada grupo; nada é escondido, só desce.
*/
function availableFirst(produtos: Product[]): Product[] {
  return [...produtos].sort((a, b) => Number(b.estoque > 0) - Number(a.estoque > 0));
}

export default async function HomePage() {
  const [navigation, session, offers, channels, suppliers, ...departmentCatalogs] = await Promise.all([
    getNavigation(),
    getSession(),
    getOffers(12),
    getChannels(),
    getSuppliers(),
    ...FEATURED_DEPARTMENTS.map((department) => getCatalog({ departamento: department.codigo, limite: 12 })),
  ]);

  const organizationJsonLd = buildOrganizationJsonLd();
  const webSiteJsonLd = buildWebSiteJsonLd();

  /*
    Um SKU que está em oferta também vive no departamento dele, então o
    mesmo card aparecia duas vezes com meia tela de distância — a home
    passava a impressão de catálogo curto. A vitrine de oferta vem antes,
    então ela fica com o item e o departamento mostra o resto. Só aplica
    se sobrar vitrine cheia; abaixo disso é melhor repetir do que exibir
    um trilho vazio.
  */
  const offerCodes = new Set(offers.map((product) => product.codProduto));
  const MIN_RAIL_SIZE = 6;
  const departmentRails = departmentCatalogs.map((catalog) => {
    const withoutOffers = catalog.filter((product) => !offerCodes.has(product.codProduto));
    return availableFirst(withoutOffers.length >= MIN_RAIL_SIZE ? withoutOffers : catalog);
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />

      <Hero isAuthenticated={session.isAuthenticated} />
      <DepartmentGrid departments={navigation.departamentos} />

      <ProductShowcase
        titulo="Ofertas"
        rotaVerTodos="/Ofertas/"
        produtos={availableFirst(offers)}
        variant="oferta"
      />

      {FEATURED_DEPARTMENTS.map((department, index) => (
        <ProductShowcase
          key={department.codigo}
          titulo={department.nome}
          rotaVerTodos={department.rota}
          produtos={departmentRails[index]}
        />
      ))}

      {/*
        Regras de compra, frete e vendas corporativas são condição de
        compra, não isca: ficavam entre Categorias e Ofertas, ou seja, 123px
        de texto informativo separando "escolhi o departamento" de "vi o
        preço". Descem para junto de Canais e Fornecedores, onde a página
        deixa de vender e passa a explicar como comprar. Mesmo conteúdo,
        mesmo componente, mesma rota.
      */}
      <ServiceStrip />
      <ChannelSection channels={channels} />
      <SupplierShowcase suppliers={suppliers} />
      {/*
        "Como se tornar cliente Arguto" não tem o que dizer pra quem já é
        cliente: são ~320px de conteúdo irrelevante entre o comprador
        recorrente e o rodapé, toda visita.
      */}
      {session.isAuthenticated ? null : <CustomerOnboarding />}
    </>
  );
}
