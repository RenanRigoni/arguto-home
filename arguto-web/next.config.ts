import type { NextConfig } from "next";

/*
  Modo de vitrine estática, usado só pelo deploy do GitHub Pages
  (.github/workflows/pages.yml). Pages serve arquivo, não roda servidor:
  sem otimização de imagem sob demanda e com todo caminho prefixado pelo
  nome do repositório. Fora dessa variável nada muda — `npm run build`
  continua produzindo o app com servidor, que é o alvo de produção real.
*/
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.STATIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? { output: "export" as const, basePath, assetPrefix: basePath || undefined, trailingSlash: true }
    : {}),

  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        // Origem de produção prevista (docs/04-ESTRUTURA.md §3) — ainda não existe.
        protocol: "https",
        hostname: "origin.arguto.com.br",
        pathname: "/content/**",
      },
      {
        // Domínio real atual, usado em desenvolvimento via NEXT_PUBLIC_LEGACY_ORIGIN
        // enquanto origin.arguto.com.br não é criado.
        protocol: "https",
        hostname: "arguto.com.br",
        pathname: "/content/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Maior conteúdo real (banner) tem 1320px de largura máxima (--container-max).
    // Sem teto aqui o default inclui 3840w — 15 banners montados ao mesmo tempo
    // (BannerCarousel) pedindo esse tamanho em paralelo sobrecarrega o transform
    // de imagem do `next dev` (não reproduz em produção, mas é peso à toa em
    // qualquer ambiente pra um banner decorativo).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

  // Redirect é resolvido pelo servidor; na exportação estática não existe
  // servidor pra resolver, então nem é declarado (evita aviso de build).
  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          return [{ source: "/contato/", destination: "/Contato/", permanent: true }];
        },
      }),
};

export default nextConfig;
