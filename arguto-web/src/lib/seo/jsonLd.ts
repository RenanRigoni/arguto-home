const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arguto.com.br";

/**
 * Só campos confirmados (docs/05-HOME-SPEC.md §10.1). Nada de address,
 * telephone, aggregateRating ou numberOfEmployees — não confirmados.
 */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LUFIR Comércio e Representação LTDA",
    alternateName: "Arguto",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-arguto.png`,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arguto",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/Busca/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
