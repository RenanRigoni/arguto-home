export class LegacyError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "LegacyError";
  }
}

export class LegacyTimeoutError extends LegacyError {
  constructor(endpoint: string) {
    super(`Tempo esgotado ao chamar ${endpoint}`);
    this.name = "LegacyTimeoutError";
  }
}

export class LegacyContractError extends LegacyError {
  constructor(endpoint: string, options?: { cause?: unknown }) {
    super(`Resposta de ${endpoint} não bate com o contrato esperado`, options);
    this.name = "LegacyContractError";
  }
}
