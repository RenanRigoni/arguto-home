import { suppliersFixture } from "@/lib/fixtures/suppliers";
import { supplierSchema, type Supplier } from "@/lib/schemas/supplier";
import { z } from "zod";
import { fetchLegacyJson, isFixtureMode } from "./client";

/** Fachada: GET /v1/api/fornecedores.aspx (docs/04-ESTRUTURA.md §3). */
export async function getSuppliers(): Promise<Supplier[]> {
  if (isFixtureMode()) return suppliersFixture;
  return fetchLegacyJson("/v1/api/fornecedores.aspx", z.array(supplierSchema), {
    revalidate: 3600,
  });
}
