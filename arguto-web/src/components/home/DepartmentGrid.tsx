import Image from "next/image";
import Link from "next/link";
import type { Department } from "@/lib/schemas/navigation";
import { assetPath } from "@/lib/assetPath";
import { toDisplayCase } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { ScrollRail } from "@/components/ui/ScrollRail";
import {
  IconBeverage,
  IconBox,
  IconDroplet,
  IconGrain,
  IconPaw,
  IconPersonalCare,
} from "@/components/ui/Icon";

type Props = {
  departments: Department[];
};

const ICON_BY_CODE: Record<string, typeof IconGrain> = {
  "000900": IconGrain,
  "000902": IconBeverage,
  "000904": IconDroplet,
  "000903": IconPersonalCare,
  "000901": IconBox,
  "000905": IconPaw,
};

/** Fotos reais de categoria fornecidas pelo cliente, comprimidas pra WebP (~11,7MB → ~320KB total). */
const IMAGE_BY_CODE: Record<string, string> = {
  "000900": "/categorias/alimentos.webp",
  "000902": "/categorias/bebidas.webp",
  "000904": "/categorias/limpeza.webp",
  "000903": "/categorias/cuidados_pessoais.webp",
  "000901": "/categorias/bazar.webp",
  "000905": "/categorias/pet.webp",
};

const DISPLAY_ORDER = ["000900", "000902", "000904", "000903", "000901", "000905"];

/**
 * Descrição vem só das subcategorias reais da própria taxonomia — nunca
 * copy inventado. A taxonomia legada, porém, é suja: "LIMPEZA" tem a
 * categoria "UTILIDADE DOMESTICA / LIMPEZA", e o resultado cru era
 * "Limpeza, Utilidade Doméstica / Limpeza" — gagueira com barra no meio,
 * na frente do cliente. Aqui a barra vira separador de verdade e os
 * termos repetidos (inclusive o nome do próprio departamento) caem.
 */
function buildDescription(department: Department): string | null {
  if (department.categorias.length === 0) return null;

  const descartar = normalizeTerm(department.nome);
  const termos: string[] = [];

  for (const categoria of department.categorias) {
    for (const parte of categoria.nome.split("/")) {
      const termo = toDisplayCase(parte.trim());
      if (!termo) continue;
      const chave = normalizeTerm(termo);
      if (chave === descartar) continue;
      if (termos.some((existente) => normalizeTerm(existente) === chave)) continue;
      termos.push(termo);
    }
  }

  if (termos.length === 0) return null;
  const sufixo = termos.length > 3 ? " e mais" : "";
  return `${termos.slice(0, 3).join(", ")}${sufixo}`;
}

function normalizeTerm(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function DepartmentGrid({ departments }: Props) {
  const tiles = DISPLAY_ORDER.map((codigo) => departments.find((d) => d.codigo === codigo))
    .filter((department): department is Department => Boolean(department))
    .map((department) => ({
      department,
      imagem: IMAGE_BY_CODE[department.codigo] ? assetPath(IMAGE_BY_CODE[department.codigo]) : null,
      descricao: buildDescription(department),
    }));

  return (
    <section aria-labelledby="departments-heading" className="border-t border-border py-8 sm:py-10">
      <Container>
        <h2 id="departments-heading" className="font-display-heading mb-6 text-xl text-ink-900 sm:text-2xl">
          Categorias
        </h2>
        <ScrollRail aria-label="Categorias" className="sm:hidden">
          {tiles.map((tile) => (
            <DepartmentTile key={tile.department.codigo} {...tile} className="w-56 shrink-0 snap-start" />
          ))}
        </ScrollRail>
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {tiles.map((tile) => (
            <DepartmentTile key={tile.department.codigo} {...tile} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function DepartmentTile({
  department,
  imagem,
  descricao,
  className,
}: {
  department: Department;
  imagem: string | null;
  descricao: string | null;
  className?: string;
}) {
  const Icon = ICON_BY_CODE[department.codigo] ?? IconBox;

  return (
    <Link
      href={department.rota}
      className={`group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-md bg-ink-900 transition-transform duration-[var(--duration-fast)] hover:-translate-y-0.5 ${className ?? ""}`}
    >
      {imagem ? (
        <Image
          src={imagem}
          alt=""
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 60vw"
          className="object-cover object-center opacity-90 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-50">
          <Icon className="h-12 w-12 text-brand-600" />
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent"
      />
      <div className="relative p-4 text-white">
        <p className="font-display-heading text-lg leading-tight">{toDisplayCase(department.nome)}</p>
        {descricao ? <p className="mt-1 line-clamp-2 text-xs text-white/80">{descricao}</p> : null}
      </div>
    </Link>
  );
}
