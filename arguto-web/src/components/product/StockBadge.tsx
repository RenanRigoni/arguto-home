type Props = {
  estoque: number;
};

export function StockBadge({ estoque }: Props) {
  if (estoque > 0) return null;

  return (
    <span className="absolute left-2 top-2 rounded-sm bg-danger-600 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
      Indisponível
    </span>
  );
}
