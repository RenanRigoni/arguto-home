import type { Navigation } from "@/lib/schemas/navigation";

/**
 * Taxonomia real extraída de arguto.com.br em 26/07/2026
 * (docs/05-HOME-SPEC.md §2.2/§2.3). BAZAR não tem categoria filha hoje —
 * caso obrigatório de teste para o MegaMenu.
 */
export const navigationFixture: Navigation = {
  departamentos: [
    {
      codigo: "000900",
      nome: "ALIMENTOS",
      slug: "alimentos",
      rota: "/produtos/alimentos/000900/",
      categorias: [
        { codigo: "000500", nome: "BISCOITOS", slug: "biscoitos", rota: "/produtos/alimentos/biscoitos/000900/000500/" },
        { codigo: "000503", nome: "CHOCOLATES", slug: "chocolates", rota: "/produtos/alimentos/chocolates/000900/000503/" },
        { codigo: "000514", nome: "CONDIMENTOS", slug: "condimentos", rota: "/produtos/alimentos/condimentos/000900/000514/" },
        { codigo: "000517", nome: "ENLATADOS", slug: "enlatados", rota: "/produtos/alimentos/enlatados/000900/000517/" },
        { codigo: "000502", nome: "GULOSEIMAS", slug: "guloseimas", rota: "/produtos/alimentos/guloseimas/000900/000502/" },
        { codigo: "000505", nome: "MASSAS", slug: "massas", rota: "/produtos/alimentos/massas/000900/000505/" },
        { codigo: "000506", nome: "MOLHOS / ATOMATADOS", slug: "molhos--atomatados", rota: "/produtos/alimentos/molhos--atomatados/000900/000506/" },
        { codigo: "000530", nome: "PANETONE", slug: "panetone", rota: "/produtos/alimentos/panetone/000900/000530/" },
        { codigo: "000534", nome: "QUEIJOS", slug: "queijos", rota: "/produtos/alimentos/queijos/000900/000534/" },
        { codigo: "000529", nome: "SNACKS", slug: "snacks", rota: "/produtos/alimentos/snacks/000900/000529/" },
        { codigo: "000522", nome: "TEMPEROS", slug: "temperos", rota: "/produtos/alimentos/temperos/000900/000522/" },
      ],
    },
    {
      codigo: "000902",
      nome: "BEBIDAS",
      slug: "bebidas",
      rota: "/produtos/bebidas/000902/",
      categorias: [
        { codigo: "000507", nome: "BEBIDAS ALCOÓLICAS", slug: "bebidas-alcoolicas", rota: "/produtos/bebidas/bebidas-alcoolicas/000902/000507/" },
        { codigo: "000501", nome: "BEBIDAS NÃO ALCOÓLICAS", slug: "bebidas-nao-alcoolicas", rota: "/produtos/bebidas/bebidas-nao-alcoolicas/000902/000501/" },
      ],
    },
    {
      codigo: "000904",
      nome: "LIMPEZA",
      slug: "limpeza",
      rota: "/produtos/limpeza/000904/",
      categorias: [
        { codigo: "000521", nome: "LIMPEZA", slug: "limpeza", rota: "/produtos/limpeza/limpeza/000904/000521/" },
        { codigo: "000509", nome: "UTILIDADE DOMÉSTICA / LIMPEZA", slug: "utilidade-domestica--limpeza", rota: "/produtos/limpeza/utilidade-domestica--limpeza/000904/000509/" },
      ],
    },
    {
      codigo: "000903",
      nome: "CUIDADOS PESSOAIS",
      slug: "cuidados-pessoais",
      rota: "/produtos/cuidados-pessoais/000903/",
      categorias: [
        { codigo: "000508", nome: "HIGIENE PESSOAL", slug: "higiene-pessoal", rota: "/produtos/cuidados-pessoais/higiene-pessoal/000903/000508/" },
      ],
    },
    {
      codigo: "000901",
      nome: "BAZAR",
      slug: "bazar",
      rota: "/produtos/bazar/000901/",
      categorias: [],
    },
    {
      codigo: "000905",
      nome: "PET",
      slug: "pet",
      rota: "/produtos/pet/alimentos-pet/000905/000535/",
      categorias: [
        { codigo: "000535", nome: "ALIMENTOS PET", slug: "alimentos-pet", rota: "/produtos/pet/alimentos-pet/000905/000535/" },
      ],
    },
  ],
};
