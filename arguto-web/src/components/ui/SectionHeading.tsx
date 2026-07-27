import Link from "next/link";
import { IconChevronRight } from "./Icon";

type Props = {
  id?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  /**
   * Marca laranja curta acima do título. Reservada pra seção de oferta:
   * é sinal de escassez/ação, mesmo papel que o selo "Oferta" do card
   * (DESIGN.md §2, Regra da Escassez) — não é enfeite de seção e não deve
   * se espalhar pelas demais.
   */
  hasOfferMark?: boolean;
};

export function SectionHeading({ id, title, href, linkLabel = "Ver todos", hasOfferMark }: Props) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div>
        {hasOfferMark ? <span aria-hidden="true" className="mb-2.5 block h-[3px] w-10 bg-accent-500" /> : null}
        <h2 id={id} className="font-display-heading text-xl text-ink-900 sm:text-2xl">
          {title}
        </h2>
      </div>
      {href ? (
        /*
          "Ver todos" media 81×20 no toque — abaixo dos 24px da WCAG 2.5.8,
          e não é link de meio de frase pra valer a isenção. O padding
          vertical sobe o alvo pra 32px e a margem negativa devolve a caixa
          visual ao lugar: nada muda no layout, só a área do dedo.
        */
        <Link
          href={href}
          className="-my-1.5 inline-flex shrink-0 items-center gap-1 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-900"
        >
          {linkLabel}
          <IconChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
