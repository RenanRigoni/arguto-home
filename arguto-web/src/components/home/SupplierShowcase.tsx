import Image from "next/image";
import Link from "next/link";
import type { Supplier } from "@/lib/schemas/supplier";
import { assetPath } from "@/lib/assetPath";
import { toDisplayCase } from "@/lib/format";
import { ArrowScrollRail } from "@/components/ui/ArrowScrollRail";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  suppliers: Supplier[];
};

/** Logos reais enviadas pelo cliente, comprimidas PNG/JPG → WebP (~939KB → ~140KB). */
const LOGO_BY_CODIGO: Record<string, string> = {
  "00201401": "/fornecedores/arcor.webp",
  "00032001": "/fornecedores/aymore.webp",
  "00217701": "/fornecedores/barilla.webp",
  "00729001": "/fornecedores/bettanin.webp",
  "00775401": "/fornecedores/cooxupe.webp",
  "00759401": "/fornecedores/danone.webp",
  "00780701": "/fornecedores/gulozitos.webp",
  "00569901": "/fornecedores/heinz.webp",
  "00797201": "/fornecedores/mezzani.webp",
  "00797301": "/fornecedores/natural-one.webp",
  "00296701": "/fornecedores/pernod.webp",
  "00790201": "/fornecedores/polenghi.webp",
  "00791101": "/fornecedores/quatree.webp",
  "00172601": "/fornecedores/red-bull.webp",
  "00633301": "/fornecedores/unilever-clean.webp",
};

function SupplierTile({ supplier, isDecorative }: { supplier: Supplier; isDecorative?: boolean }) {
  const logoSrc = LOGO_BY_CODIGO[supplier.codigo] ? assetPath(LOGO_BY_CODIGO[supplier.codigo]) : null;

  return (
    <Link
      href={supplier.rota}
      aria-hidden={isDecorative || undefined}
      tabIndex={isDecorative ? -1 : undefined}
      className="flex aspect-[3/2] w-40 shrink-0 snap-start items-center justify-center rounded-[6.5px] border border-border bg-white p-2 transition-colors duration-[var(--duration-fast)] hover:border-brand-600"
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={supplier.nome}
          width={140}
          height={90}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      ) : (
        <span className="font-display-heading text-sm font-semibold text-brand-600" aria-label={supplier.nome}>
          {supplier.nome}
        </span>
      )}
    </Link>
  );
}

export function SupplierShowcase({ suppliers }: Props) {
  if (suppliers.length === 0) return null;

  return (
    <section aria-labelledby="suppliers-heading" className="border-t border-border py-8 sm:py-10">
      <Container className="scroll-reveal">
        <SectionHeading
          id="suppliers-heading"
          title="Grandes marcas, um só parceiro"
          href="/Fornecedores/"
          linkLabel="Ver todos os fornecedores"
        />

        {/*
          Rolagem automática (pedido do cliente, referência Alentejana).
          Conteúdo duplicado uma vez pra loop sem costura; a cópia é
          aria-hidden + não focável, só a primeira passada é real.
          Pausa no hover/foco (motion.css) — WCAG 2.2.2, são links de
          verdade, precisam ficar clicáveis parado. Quem decide entre esta
          faixa e o trilho manual abaixo é .supplier-marquee/.supplier-manual
          em motion.css: sem hover não há como pausar, então sem hover não
          há faixa animada.
        */}
        <div className="supplier-marquee overflow-hidden" aria-hidden="true">
          <div className="marquee-track flex w-max gap-3">
            {suppliers.map((supplier) => (
              <SupplierTile key={supplier.codigo} supplier={supplier} isDecorative />
            ))}
            {suppliers.map((supplier) => (
              <SupplierTile key={`${supplier.codigo}-loop`} supplier={supplier} isDecorative />
            ))}
          </div>
        </div>
        {/*
          Acesso real pra leitor de tela enquanto a faixa animada está no ar:
          ela é aria-hidden inteira. Some junto com ela — quando o trilho
          manual aparece, ele já é a versão acessível e visível, e duas
          listas dos mesmos 15 links seria duplicata pro leitor.
        */}
        <div role="group" aria-label="Fornecedores" className="supplier-marquee-sr sr-only">
          {suppliers.map((supplier) => (
            <Link key={supplier.codigo} href={supplier.rota}>
              {toDisplayCase(supplier.nome)}
            </Link>
          ))}
        </div>

        <div className="supplier-manual">
          <ArrowScrollRail aria-label="Fornecedores">
            {suppliers.map((supplier) => (
              <SupplierTile key={supplier.codigo} supplier={supplier} />
            ))}
          </ArrowScrollRail>
        </div>
      </Container>
    </section>
  );
}
