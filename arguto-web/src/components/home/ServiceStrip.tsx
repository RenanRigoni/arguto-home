import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { IconCart, IconStorefront, IconTruck } from "@/components/ui/Icon";

const items = [
  {
    icon: IconCart,
    title: "Compre conosco",
    text: "Na dúvida se pode comprar conosco? Saiba as regras.",
    href: "/ComoComprar/",
  },
  {
    icon: IconTruck,
    title: "Entrega",
    text: "Fazemos entrega gratuita e rápida. Confira as regras.",
    href: "/RegrasFrete/",
  },
  {
    icon: IconStorefront,
    title: "Vendas Corporativas",
    text: "Ofertas especiais para pagamentos à vista e parcelamento facilitado.",
    href: "/VendasCorporativas/",
  },
];

export function ServiceStrip() {
  return (
    <section aria-label="Informações de compra e entrega" className="border-t border-border bg-surface-50">
      <Container className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-center gap-3 rounded-md border border-border bg-white px-4 py-4 transition-colors duration-[var(--duration-fast)] hover:border-brand-600"
          >
            {/*
              Ícones eram accent-600: três laranjas informativos competindo
              com o CTA. Laranja é reservado a ação e escassez (DESIGN.md §2,
              Regra da Escassez) — aqui é informação, então indigo.
            */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center text-brand-600">
              <item.icon className="h-6 w-6" />
            </span>
            <p className="text-sm text-ink-700">
              <strong className="font-semibold text-ink-900">{item.title}:</strong> {item.text}
            </p>
          </Link>
        ))}
      </Container>
    </section>
  );
}
