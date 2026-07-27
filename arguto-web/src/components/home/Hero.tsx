import { assetPath } from "@/lib/assetPath";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BannerCarousel } from "./BannerCarousel";

/**
 * Banners reais baixados de arguto.com.br (fornecedores: Gulozitos,
 * Arcor e outros), comprimidos PNG/JPG → WebP (~9,97MB → ~1,09MB).
 * Quando o cliente tiver um processo de upload próprio (portal ADM),
 * troca-se por dado vindo da fachada — a lista abaixo já usa asset real,
 * não fabricado.
 */
const bannerImages = [
  "/banner/01072026_140420.webp",
  "/banner/02062025_154741.webp",
  "/banner/06072026_141447.webp",
  "/banner/07102025_110211.webp",
  "/banner/10042026_150703.webp",
  "/banner/10062025_091022.webp",
  "/banner/10072026_103842.webp",
  "/banner/13072026_171440.webp",
  "/banner/23062025_112327.webp",
  "/banner/23062025_131707.webp",
  "/banner/23062025_133201.webp",
  "/banner/23062025_134614.webp",
  "/banner/24062025_083114.webp",
  "/banner/25112025_170541.webp",
  "/banner/26022026_092826.webp",
].map(assetPath);

/**
 * Banda única de abertura: a frase da Arguto e a peça de campanha do
 * fornecedor dividem a MESMA superfície indigo. Antes eram duas coisas
 * soltas — barra azul, vão branco, banner de fornecedor sobre cinza — e
 * o olho batia primeiro na marca do fornecedor, não na Arguto.
 *
 * Superfície em brand-900, o mesmo indigo escuro da barra de topo e do
 * rodapé (pedido do cliente): as três faixas escuras passam a emoldurar
 * a página com a mesma cor, em vez de usar dois tons de indigo diferentes.
 *
 * O h1 finalmente usa o passo Display do DESIGN.md (§3), que existia no
 * sistema e nunca era aplicado: era um <h1> de 18px. A campanha continua
 * inteira, sem corte e sem texto nosso por cima — só passa a estar
 * apoiada na superfície da marca em vez de flutuar sozinha.
 */
type Props = {
  isAuthenticated: boolean;
};

export function Hero({ isAuthenticated }: Props) {
  return (
    <section aria-labelledby="hero-heading" className="bg-brand-900">
      <Container className="py-5 sm:py-7">
        <div className="reveal-cascade flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h1
            id="hero-heading"
            className="font-display-heading max-w-[24ch] text-[clamp(1.625rem,1rem+2vw,2.5rem)] leading-[1.05] text-white"
          >
            Distribuição completa, com entrega gratuita.
          </h1>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="/produtos/alimentos/000900/" variant="primary">
              Ver produtos
            </Button>
            {/*
              Cliente autenticado recebia "Quero ser cliente" — ele já é.
              A segunda ação vira a que ele realmente usa toda visita.
            */}
            {isAuthenticated ? (
              <Button href="/MeusPedidos/" variant="secondary">
                Meus pedidos
              </Button>
            ) : (
              <Button href="/Login/" variant="secondary">
                Quero ser cliente
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <BannerCarousel images={bannerImages} />
        </div>
      </Container>
    </section>
  );
}
