import Image from "next/image";
import { resolveLegacyImageSrc } from "@/lib/image";
import { IconBox } from "@/components/ui/Icon";

type Props = {
  imagem: string | null;
  alt: string;
  isUnavailable?: boolean;
};

export function ProductImage({ imagem, alt, isUnavailable }: Props) {
  const src = resolveLegacyImageSrc(imagem);

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-white">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 220px, 45vw"
          className={`object-contain p-3 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-[1.04] ${isUnavailable ? "opacity-30 grayscale" : ""}`}
          loading="lazy"
        />
      ) : (
        /*
          Metade do catálogo de demonstração chega sem foto, e o fallback
          anterior era um "A" cinza de 30px: lia como fonte quebrada, não
          como decisão. Caixa de papelão + rótulo é o vocabulário de uma
          distribuidora e usa o mesmo mono das outras metainformações do
          card (Cód. 019563) — dado ruim de catálogo passa a parecer
          tratado. Peso visual abaixo de qualquer foto real: um traço de
          ink-400 sobre surface-100, nada de marca nem de moldura.
        */
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-100"
          role="img"
          aria-label={`${alt} — sem imagem`}
        >
          <IconBox className="h-8 w-8 text-ink-400" />
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-400">Sem imagem</span>
        </div>
      )}
    </div>
  );
}
