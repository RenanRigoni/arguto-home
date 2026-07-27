const LEGACY_ORIGIN = process.env.NEXT_PUBLIC_LEGACY_ORIGIN ?? "https://origin.arguto.com.br";

/**
 * O catálogo legado grava produto em 3 prefixos (Trat_/Thumb_/T_) e 4
 * extensões, incluindo .jfif — sem suporte em Safari antigo quando servido
 * cru, como o site legado faz hoje. Isso não exige tratamento aqui: o
 * next/image decodifica pelo conteúdo real do arquivo (não pela extensão) e
 * sempre reencoda para AVIF/WebP antes de chegar ao navegador. O problema do
 * .jfif é resolvido pela própria pipeline de otimização, não por reescrita
 * de caminho.
 */
export function resolveLegacyImageSrc(path: string | null): string | null {
  if (!path) return null;
  return `${LEGACY_ORIGIN}${path}`;
}
