"use client";

import { useState } from "react";
import { formatMultipleLabel } from "@/lib/format";
import { IconMinus, IconPlus } from "@/components/ui/Icon";

type Props = {
  codProduto: string;
  estoque: number;
  multiplo: number;
};

type Status = "idle" | "loading" | "success" | "error";

export function AddToCartControl({ codProduto, estoque, multiplo }: Props) {
  const [quantidade, setQuantidade] = useState(multiplo > 1 ? multiplo : 1);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const multipleLabel = formatMultipleLabel(multiplo);

  function updateQuantity(next: number) {
    const clamped = Math.max(multiplo, Math.min(next, estoque));
    setQuantidade(clamped);
    setMessage(null);
    setStatus("idle");
  }

  function validate(): string | null {
    if (quantidade <= 0) return "Selecione a quantidade desejada.";
    if (quantidade > estoque) return "Quantidade indisponível em estoque.";
    if (multiplo > 1 && quantidade % multiplo !== 0) return `A quantidade deve ser múltipla de ${multiplo}.`;
    return null;
  }

  async function handleAddToCart() {
    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codProduto, quantidade }),
      });
      const result: { ok: boolean; erro: string | null } = await response.json();

      if (result.ok) {
        setStatus("success");
        setMessage("Produto adicionado ao carrinho.");
      } else {
        setStatus("error");
        setMessage(result.erro ?? "Não foi possível adicionar o produto.");
      }
    } catch {
      setStatus("error");
      setMessage("Não foi possível adicionar o produto. Tente novamente.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex h-11 items-center rounded-md border border-border-strong">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => updateQuantity(quantidade - multiplo)}
            className="flex h-full w-11 items-center justify-center text-ink-700 transition-colors duration-[var(--duration-fast)] hover:bg-surface-100 active:scale-[0.94]"
          >
            <IconMinus className="h-4 w-4" />
          </button>
          <span
            className="w-10 text-center font-mono text-sm text-ink-900"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Quantidade: ${quantidade}`}
          >
            {quantidade}
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => updateQuantity(quantidade + multiplo)}
            className="flex h-full w-11 items-center justify-center text-ink-700 transition-colors duration-[var(--duration-fast)] hover:bg-surface-100 active:scale-[0.94]"
          >
            <IconPlus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={status === "loading"}
          className="h-11 flex-1 rounded-md bg-accent-500 text-sm font-medium text-white transition-transform duration-[var(--duration-fast)] hover:bg-accent-600 active:scale-[0.98] disabled:opacity-60"
        >
          {status === "loading" ? "Adicionando…" : "Adicionar"}
        </button>
      </div>

      {multipleLabel ? <p className="text-xs text-warning-600">{multipleLabel}</p> : null}

      <p role="status" aria-live="polite" className={`text-xs ${status === "error" ? "text-danger-600" : "text-success-600"}`}>
        {message}
      </p>
    </div>
  );
}
