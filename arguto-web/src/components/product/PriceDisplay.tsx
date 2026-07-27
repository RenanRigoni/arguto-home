import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { IconEye } from "@/components/ui/Icon";

type Props = {
  preco: number | null;
  isUnavailable?: boolean;
};

/**
 * preco: null (sem sessão) e preco: 0 (erro de cadastro) renderizam
 * diferente de propósito — ver docs/05-HOME-SPEC.md §7, regra 1.
 */
export function PriceDisplay({ preco, isUnavailable }: Props) {
  if (preco === null) {
    return (
      <Link
        href="/Login/"
        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-brand-600 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
      >
        <IconEye className="h-4 w-4 shrink-0" />
        {/* Sem estoque o card não pode prometer compra: o selo diz
            "Indisponível" e o botão dizia "comprar" na mesma altura. */}
        {isUnavailable ? "Ver preço" : "Ver preço e comprar"}
      </Link>
    );
  }

  if (preco === 0) {
    return <p className="text-sm text-warning-600">Preço indisponível</p>;
  }

  return (
    <p className="font-mono text-base font-semibold text-ink-900">
      {formatCurrency(preco)} <span className="font-sans text-xs font-normal text-ink-500">/un</span>
    </p>
  );
}
