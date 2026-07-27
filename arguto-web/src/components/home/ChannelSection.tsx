import Link from "next/link";
import type { Channel } from "@/lib/schemas/channel";
import { toDisplayCase } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBox, IconChevronRight, IconPharmacy, IconStorefront } from "@/components/ui/Icon";

type Props = {
  channels: Channel[];
};

/**
 * Canal não é departamento: é o segmento comercial que a Arguto atende.
 * Antes os dois canais eram duas caixas brancas quase vazias com um nome
 * em caixa-alta e uma seta — o trecho mais inacabado da home. Agora cada
 * um tem ícone, rótulo "CANAL" e afordância de link explícita, em altura
 * menor, então lê como estrutura comercial e não como categoria vazia.
 *
 * REQUER CONTEÚDO VALIDADO: uma linha de descrição por canal (o que cada
 * segmento cobre) resolveria o resto. O contrato atual só devolve
 * id/nome/slug/rota (lib/schemas/channel.ts) e não se inventa fato
 * comercial (PRODUCT.md §Design Principles 2).
 */
const ICON_BY_SLUG: Record<string, typeof IconStorefront> = {
  "varejo-alimentar": IconStorefront,
  farma: IconPharmacy,
};

export function ChannelSection({ channels }: Props) {
  if (channels.length === 0) return null;

  return (
    <section aria-labelledby="channels-heading" className="border-t border-border py-8 sm:py-10">
      <Container className="scroll-reveal">
        <SectionHeading id="channels-heading" title="Canais de atendimento" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {channels.map((channel) => {
            const Icon = ICON_BY_SLUG[channel.slug] ?? IconBox;

            return (
              <Link
                key={channel.id}
                href={channel.rota}
                className="group flex items-center gap-4 rounded-md border border-border bg-white px-4 py-4 transition-colors duration-[var(--duration-fast)] hover:border-brand-600"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-400">Canal</span>
                  <span className="block truncate font-display-heading text-lg leading-tight text-ink-900">
                    {toDisplayCase(channel.nome)}
                  </span>
                </span>
                <IconChevronRight className="h-5 w-5 shrink-0 text-ink-400 transition-colors duration-[var(--duration-fast)] group-hover:text-brand-600" />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
