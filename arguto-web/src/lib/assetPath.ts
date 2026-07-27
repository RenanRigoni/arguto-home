/**
 * Prefixo do basePath para arquivos servidos de /public.
 *
 * O `next/image` só reescreve o caminho quando passa pelo otimizador. Na
 * exportação estática (GitHub Pages) o otimizador não existe — `unoptimized`
 * fica ligado — e o `src` sai cru no HTML: `/banner/x.webp` em vez de
 * `/<repo>/banner/x.webp`. Logo, banners, fotos de categoria e logos de
 * fornecedor davam 404 no host estático.
 *
 * Em produção com servidor a variável é vazia e isto é a identidade.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
