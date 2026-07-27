import { z } from "zod";

export const searchSuggestionSchema = z.object({
  nome: z.string(),
  imagem: z.string().nullable(),
  link: z.string(),
});

export type SearchSuggestion = z.infer<typeof searchSuggestionSchema>;

/** Contrato bruto de _ajax_busca.aspx?format=json (docs/01-ESCOPO.md §2.1). */
export const legacySearchResultSchema = z.object({
  Foto: z.string().nullable(),
  Produto: z.string(),
  Link: z.string(),
  LinhaDiv: z.string().optional(),
});
