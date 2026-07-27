import { z } from "zod";

/**
 * Espelha exatamente o que a fachada legada expõe (docs/05-HOME-SPEC.md §7/§8.2).
 * preco: null !== 0 — null é "sem sessão", 0 seria preço zerado (erro de cadastro).
 * imagem: null é caso normal do catálogo real, não erro.
 */
export const productSchema = z.object({
  codProduto: z.string(),
  descricaoSite: z.string(),
  descricaoProtheus: z.string(),
  imagem: z.string().nullable(),
  fornecedor: z.string(),
  fornecedorCodigo: z.string(),
  canal: z.string().nullable(),
  grupo: z.string().nullable(),
  categoria: z.string().nullable(),
  subcategoria: z.string().nullable(),
  estoque: z.number().int().nonnegative(),
  multiplo: z.number().int().positive(),
  preco: z.number().nonnegative().nullable(),
  link: z.string(),
});

export type Product = z.infer<typeof productSchema>;
