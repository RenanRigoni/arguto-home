import { z } from "zod";

export const supplierSchema = z.object({
  codigo: z.string(),
  nome: z.string(),
  slug: z.string(),
  logo: z.string().nullable(),
  rota: z.string(),
});

export type Supplier = z.infer<typeof supplierSchema>;
