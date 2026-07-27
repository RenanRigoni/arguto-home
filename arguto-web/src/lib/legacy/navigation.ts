import { navigationFixture } from "@/lib/fixtures/navigation";
import { navigationSchema, type Navigation } from "@/lib/schemas/navigation";
import { fetchLegacyJson, isFixtureMode } from "./client";

/** Fachada: GET /v1/api/navegacao.aspx (docs/04-ESTRUTURA.md §3). */
export async function getNavigation(): Promise<Navigation> {
  if (isFixtureMode()) return navigationFixture;
  return fetchLegacyJson("/v1/api/navegacao.aspx", navigationSchema, { revalidate: 3600 });
}
