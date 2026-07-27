const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatMultipleLabel(multiplo: number): string | null {
  if (multiplo <= 1) return null;
  return `Múltiplo de ${multiplo}`;
}

/**
 * O legado entrega descricaoSite em CAIXA ALTA (convenção do Protheus).
 * Texto corrido em caixa alta é comprovadamente mais lento de ler que caixa
 * mista — perde-se a forma da palavra que o olho usa pra reconhecer sem
 * soletrar. Normaliza só para exibição; o dado bruto (busca, alt, SEO)
 * continua intacto onde precisar do valor original.
 */
export function toDisplayCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/(^|[\s\-/(])([a-zà-ÿ])/g, (_, separator: string, letter: string) => separator + letter.toUpperCase());
}
