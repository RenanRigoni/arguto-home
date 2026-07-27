import { z } from "zod";

export const categorySchema = z.object({
  codigo: z.string(),
  nome: z.string(),
  slug: z.string(),
  rota: z.string(),
});

export const departmentSchema = z.object({
  codigo: z.string(),
  nome: z.string(),
  slug: z.string(),
  rota: z.string(),
  categorias: z.array(categorySchema),
});

export const navigationSchema = z.object({
  departamentos: z.array(departmentSchema),
});

export type Category = z.infer<typeof categorySchema>;
export type Department = z.infer<typeof departmentSchema>;
export type Navigation = z.infer<typeof navigationSchema>;
