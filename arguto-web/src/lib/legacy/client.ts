import type { ZodType } from "zod";
import { LegacyContractError, LegacyError, LegacyTimeoutError } from "./errors";

const LEGACY_ORIGIN = process.env.LEGACY_ORIGIN ?? "https://origin.arguto.com.br";
const DEFAULT_TIMEOUT_MS = 4000;

type FetchLegacyJsonOptions = {
  revalidate?: number;
  timeoutMs?: number;
  cookieHeader?: string;
};

/**
 * Único ponto de fetch para a fachada legada (docs/04-ESTRUTURA.md §4 e §3.3).
 * Toda resposta é validada pelo schema Zod do chamador antes de virar dado
 * tipado — se o contrato quebrar, o chamador decide o fallback visual, a
 * página nunca quebra inteira por causa de uma seção.
 */
export async function fetchLegacyJson<T>(
  path: string,
  schema: ZodType<T>,
  options: FetchLegacyJsonOptions = {},
): Promise<T> {
  const { revalidate = 900, timeoutMs = DEFAULT_TIMEOUT_MS, cookieHeader } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${LEGACY_ORIGIN}${path}`, {
      signal: controller.signal,
      next: { revalidate },
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });

    if (!response.ok) {
      throw new LegacyError(`${path} respondeu ${response.status}`);
    }

    const json: unknown = await response.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
      throw new LegacyContractError(path, { cause: parsed.error });
    }

    return parsed.data;
  } catch (error: unknown) {
    if (error instanceof LegacyError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new LegacyTimeoutError(path);
    }
    throw new LegacyError(`Falha ao chamar ${path}`, { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

export function isFixtureMode(): boolean {
  return process.env.USE_FIXTURES === "true";
}
