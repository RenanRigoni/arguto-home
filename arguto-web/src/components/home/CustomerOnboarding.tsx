import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconBuilding, IconCart, IconClock, IconTag } from "@/components/ui/Icon";

// CONFIRMAR NO DISCOVERY: processo real de liberação cadastral
// (docs/05-HOME-SPEC.md §8.11). Ajustar os passos abaixo se divergir.
const steps = [
  {
    number: 1,
    title: "Cadastre sua empresa",
    description: "Informe CNPJ ou CPF para iniciar o cadastro.",
    Icon: IconBuilding,
  },
  {
    number: 2,
    title: "Aguarde a liberação",
    description: "Seu cadastro passa por uma análise antes da liberação.",
    Icon: IconClock,
  },
  {
    number: 3,
    title: "Acesse preços e condições",
    description: "Preço e condições exclusivos por cliente, após login.",
    Icon: IconTag,
  },
  {
    number: 4,
    title: "Monte seus pedidos",
    description: "Compre direto pelo site, com o mesmo processo de sempre.",
    Icon: IconCart,
  },
];

export function CustomerOnboarding() {
  return (
    <section aria-labelledby="onboarding-heading" className="border-t border-border bg-surface-100 py-10 sm:py-12">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 id="onboarding-heading" className="font-display-heading text-xl text-ink-900 sm:text-2xl">
              Como se tornar cliente Arguto
            </h2>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              Ainda não é nosso cliente? O acesso a preços e pedidos é liberado após o cadastro.
            </p>
          </div>
          <Button href="/Login/" variant="primary" className="shrink-0">
            Quero ser cliente
          </Button>
        </div>

        {/*
          Quatro caixinhas iguais com ícone-em-quadrado + título + parágrafo
          é literalmente o padrão de "seção gerada por IA" que o PRODUCT.md
          lista como anti-referência. Mesma informação, sem caixa: o passo
          é marcado por um numeral em Big Shoulders sobre uma régua — os
          border-top dos itens formam a linha de progressão entre eles, sem
          pseudo-elemento nem posicionamento absoluto.
        */}
        <ol className="scroll-reveal mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="border-t-2 border-border-strong pt-4">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="font-display-heading text-3xl leading-none text-brand-600">
                  {String(step.number).padStart(2, "0")}
                </span>
                <step.Icon className="h-5 w-5 shrink-0 text-ink-400" />
              </div>
              <p className="mt-3 text-sm font-semibold text-ink-900">{step.title}</p>
              <p className="mt-1.5 text-sm text-ink-500">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
