import Image from "next/image";
import Link from "next/link";
import { getNavigation } from "@/lib/legacy/navigation";
import { assetPath } from "@/lib/assetPath";
import { toDisplayCase } from "@/lib/format";
import { Container } from "@/components/ui/Container";

const paymentBadges: Array<{ slug: string; label: string }> = [
  { slug: "visa", label: "Visa" },
  { slug: "mastercard", label: "Mastercard" },
  { slug: "amex", label: "American Express" },
  { slug: "boleto", label: "Boleto bancário" },
  { slug: "safebrowsing", label: "Navegação segura" },
];

export async function SiteFooter() {
  const navigation = await getNavigation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-white/90">
      <Container className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <nav aria-label="Produtos">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Produtos</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {navigation.departamentos.map((department) => (
              <li key={department.codigo}>
                {/* Taxonomia legada vem em caixa-alta; no rodapé ela convivia
                    com "Fornecedores"/"Ofertas" em capitulação normal. */}
                <Link href={department.rota} className="hover:text-white">
                  {toDisplayCase(department.nome)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/Fornecedores/" className="hover:text-white">
                Fornecedores
              </Link>
            </li>
            <li>
              <Link href="/Ofertas/" className="hover:text-white">
                Ofertas
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Minha conta">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Minha conta</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/Login/" className="hover:text-white">
                Entrar
              </Link>
            </li>
            <li>
              <Link href="/MeusPedidos/" className="hover:text-white">
                Meus pedidos
              </Link>
            </li>
            <li>
              <Link href="/MeusDados/" className="hover:text-white">
                Meus dados
              </Link>
            </li>
            <li>
              <Link href="/Carrinho/" className="hover:text-white">
                Carrinho
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Atendimento">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Atendimento</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/Contato/" className="hover:text-white">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/Faq/" className="hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/ComoComprar/" className="hover:text-white">
                Como comprar
              </Link>
            </li>
            <li>
              <Link href="/RegrasFrete/" className="hover:text-white">
                Regras de frete
              </Link>
            </li>
            <li>
              <Link href="/VendasCorporativas/" className="hover:text-white">
                Vendas corporativas
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Institucional">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Institucional</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/PrazosGarantias/" className="hover:text-white">
                Prazos e garantias
              </Link>
            </li>
            <li>
              <Link href="/PrazoEntrega/" className="hover:text-white">
                Prazo de entrega
              </Link>
            </li>
            <li>
              <Link href="/TrocasDevolucoes/" className="hover:text-white">
                Trocas e devoluções
              </Link>
            </li>
            <li>
              <Link href="/PoliticaDePrivacidade/" className="hover:text-white">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link href="/PoliticaDePagamento/" className="hover:text-white">
                Política de pagamento
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center gap-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          {/*
            logo-arguto.png tem fundo branco opaco (sem alpha), não uma
            versão monocromática — brightness-0 invert virava um retângulo
            branco sólido em cima do fundo escuro. Pill branca em vez de
            filtro, mesmo padrão já usado nos selos de pagamento ao lado.
          */}
          <div className="rounded-sm bg-white px-3 py-2">
            <Image src={assetPath("/brand/logo-arguto.png")} alt="Arguto" width={157} height={34} className="h-6 w-auto" />
          </div>

          <ul className="flex items-center gap-2.5" aria-label="Formas de pagamento aceitas">
            {paymentBadges.map((badge) => (
              <li key={badge.slug} className="flex h-7 items-center rounded-sm bg-white px-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetPath(`/icons/${badge.slug}.svg`)}
                  alt={badge.label}
                  width={32}
                  height={20}
                  className="h-5 w-auto"
                />
              </li>
            ))}
          </ul>
        </Container>

        <Container className="pb-8 text-xs text-white/60">
          <p>
            © {year} Arguto — LUFIR Comércio e Representação LTDA. Todos os direitos reservados.{" "}
            <Link href="/PoliticaDePrivacidade/" className="underline hover:text-white/90">
              Política de privacidade
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
