export function buildSearchUrl(term: string): string {
  const params = new URLSearchParams({ q: term });
  return `/Busca/?${params.toString()}`;
}
