# Especificação de Construção — Home

**Para:** modelo executor
**Escopo:** HOME apenas. Nenhuma outra página.
**Autoridade:** [01-ESCOPO.md](01-ESCOPO.md) · [04-ESTRUTURA.md](04-ESTRUTURA.md).
Não redesenhar arquitetura. Não criar backend. Não criar regra de negócio.

---

## 0. Como usar este documento

Este documento é a fonte da verdade da implementação. Ele já contém todas as
decisões de design, taxonomia, copy, cores, contratos de dados e estrutura de
arquivos.

**Você não precisa tomar nenhuma decisão de produto ou de design.** Se algo
parecer faltando, a resposta correta é a §3 (proibições) ou a §2 (fatos), não
improvisar.

Ordem obrigatória: §1 → §2 → §3 → §4 → §5 → §6 → §7 → §8 → §9 → §10.

Nada é inventado neste documento. Cada dado veio de investigação direta do site
em produção em 26/07/2026.

---

## 1. Convenção de nomes

| Item | Idioma | Exemplo |
|---|---|---|
| Nome de componente, arquivo, função, variável, tipo | **inglês** | `ProductCard`, `fetchCatalog` |
| Texto visível ao usuário | **português BR** | `"Busque por produto, marca ou categoria"` |
| Campo de dado vindo da fachada legada | **português**, espelhando o legado | `codProduto`, `descricaoSite`, `multiplo` |
| Rota / URL | **exatamente como está em produção** | `/produtos/alimentos/000900/` |

Isto revisa o esboço de nomes em [04-ESTRUTURA §4](04-ESTRUTURA.md), que
misturava os dois idiomas. Regra única: **código em inglês, dado e texto em
português.**

---

## 2. Fatos confirmados — use só isto

Tudo abaixo foi extraído do site em produção. É a única fonte de conteúdo real
autorizada.

### 2.1 Marca

| Token | Valor | Origem |
|---|---|---|
| Indigo (primária) | `#292C95` | `/v1/css/arguto.css` — cor de link, botão, `h2`, `bg-primary` |
| Laranja (acento) | `#F2811D` | **arco do logo** em `/v1/img/LogoArguto.png` — **valor estimado, confirmar com conta-gotas no PNG antes de finalizar tokens** |
| Logo | `/v1/img/LogoArguto.png` — 32,8 KB | wordmark indigo + arco laranja + monograma "A" |
| Favicon | `/v1/img/arguto.ico` | |

**O laranja existe na marca e não aparece em lugar nenhum do CSS atual.** Usá-lo
como acento não é invenção — é aplicar a identidade que já existe. Use-o com
disciplina: CTA primário, badge de oferta, indicador de foco. Nunca como fundo
de seção inteira.

### 2.2 Departamentos — os 6 reais

| Código | Nome | Rota |
|---|---|---|
| `000900` | ALIMENTOS | `/produtos/alimentos/000900/` |
| `000901` | BAZAR | `/produtos/bazar/000901/` |
| `000902` | BEBIDAS | `/produtos/bebidas/000902/` |
| `000903` | CUIDADOS PESSOAIS | `/produtos/cuidados-pessoais/000903/` |
| `000904` | LIMPEZA | `/produtos/limpeza/000904/` |
| `000905` | PET | — (só a categoria filha aparece hoje) |

### 2.3 Categorias reais por departamento

```
ALIMENTOS (000900)
  000500 BISCOITOS              /produtos/alimentos/biscoitos/000900/000500/
  000503 CHOCOLATES            /produtos/alimentos/chocolates/000900/000503/
  000514 CONDIMENTOS           /produtos/alimentos/condimentos/000900/000514/
  000517 ENLATADOS             /produtos/alimentos/enlatados/000900/000517/
  000502 GULOSEIMAS            /produtos/alimentos/guloseimas/000900/000502/
  000505 MASSAS                /produtos/alimentos/massas/000900/000505/
  000506 MOLHOS / ATOMATADOS   /produtos/alimentos/molhos--atomatados/000900/000506/
  000530 PANETONE              /produtos/alimentos/panetone/000900/000530/
  000534 QUEIJOS               /produtos/alimentos/queijos/000900/000534/
  000529 SNACKS                /produtos/alimentos/snacks/000900/000529/
  000522 TEMPEROS              /produtos/alimentos/temperos/000900/000522/

BEBIDAS (000902)
  000507 BEBIDAS ALCOÓLICAS    /produtos/bebidas/bebidas-alcoolicas/000902/000507/
  000501 BEBIDAS NÃO ALCOÓLICAS /produtos/bebidas/bebidas-nao-alcoolicas/000902/000501/

CUIDADOS PESSOAIS (000903)
  000508 HIGIENE PESSOAL       /produtos/cuidados-pessoais/higiene-pessoal/000903/000508/

LIMPEZA (000904)
  000521 LIMPEZA                       /produtos/limpeza/limpeza/000904/000521/
  000509 UTILIDADE DOMÉSTICA / LIMPEZA /produtos/limpeza/utilidade-domestica--limpeza/000904/000509/

PET (000905)
  000535 ALIMENTOS PET         /produtos/pet/alimentos-pet/000905/000535/

BAZAR (000901) — sem categorias expostas hoje
```

**BAZAR não tem categoria filha visível.** O MegaMenu precisa lidar com
departamento sem filhos sem quebrar e sem coluna vazia.

### 2.4 Fornecedores — os 15 reais, com logo

Logos em `/content/Fornecedor/{ddMMyyyy_HHmmss}.png`. Código = `A2_COD` + `A2_LOJA`.

| Nome | Código | Rota |
|---|---|---|
| ARCOR | `00201401` | `/produtos/fornecedor/ARCOR/00201401/` |
| AYMORE | `00032001` | `/produtos/fornecedor/AYMORE/00032001/` |
| BARILLA | `00217701` | `/produtos/fornecedor/BARILLA/00217701/` |
| BETTANIN | `00729001` | `/produtos/fornecedor/BETTANIN/00729001/` |
| COOXUPE | `00775401` | `/produtos/fornecedor/COOXUPE/00775401/` |
| DANONE | `00759401` | `/produtos/fornecedor/DANONE/00759401/` |
| GULOZITOS | `00780701` | `/produtos/fornecedor/GULOZITOS/00780701/` |
| HEINZ | `00569901` | `/produtos/fornecedor/HEINZ/00569901/` |
| MEZZANI | `00797201` | `/produtos/fornecedor/MEZZANI/00797201/` |
| NATURAL ONE | `00797301` | `/produtos/fornecedor/NATURAL-ONE/00797301/` |
| PERNOD | `00296701` | `/produtos/fornecedor/PERNOD/00296701/` |
| POLENGHI | `00790201` | `/produtos/fornecedor/POLENGHI/00790201/` |
| QUATREE | `00791101` | `/produtos/fornecedor/QUATREE/00791101/` |
| RED BULL | `00172601` | `/produtos/fornecedor/RED-BULL/00172601/` |
| UNILEVER CLEAN | `00633301` | `/produtos/fornecedor/UNILEVER-CLEAN/00633301/` |

### 2.5 Canais

| ID | Nome | Rota |
|---|---|---|
| `1` | VAREJO ALIMENTAR | `/Canais/varejo-alimentar/1/` |
| `3` | FARMA | `/Canais/farma/3/` |

Canais `2` (FOOD SERVICE) e LIMPEZA aparecem na ficha de produto mas **não têm
rota confirmada na home**. Não crie rota para eles. O componente deve renderizar
a lista que a fachada devolver, sem número fixo de itens.

### 2.6 Copy real — copiar literalmente

Do bloco `.faixa-home` da home atual:

| Título | Texto | Rota |
|---|---|---|
| `Compre conosco` | `Na dúvida se pode comprar conosco? Saiba as regras.` | `/ComoComprar/` |
| `Entrega` | `Fazemos entrega gratuita e rápida. Confira as regras.` | `/RegrasFrete/` |
| `Vendas Corporativas` | `Ofertas especiais para pagamentos à vista e parcelamento facilitado.` | `/VendasCorporativas/` |

Ícones já existentes: `/v1/img/shoppingcart.svg` · `/v1/img/truck.svg` ·
`/v1/img/market.svg`

**"Entrega gratuita" é o diferencial comercial mais forte que a empresa
declara.** Use-o com destaque. Não reescreva, não amplifique, não invente
prazo, raio de entrega ou valor mínimo.

Login: título real do modal = `Informe seu CNPJ ou CPF`.

Bandeiras de pagamento no rodapé, reais: `/v1/img/visa.svg` · `mastercard.svg`
· `amex.svg` · `boleto.svg` · `safebrowsing.svg`

### 2.7 Rotas institucionais e de conta

```
/ComoComprar/   /RegrasFrete/   /VendasCorporativas/   /PrazosGarantias/
/PrazoEntrega/  /TrocasDevolucoes/   /PoliticaDePrivacidade/
/PoliticaDePagamento/   /Faq/   /Contato/
/Login/   /Carrinho/   /MeusPedidos/   /MeusDados/
/Fornecedores/   /Ofertas/
```

Defeitos a corrigir na home nova: rodapé aponta "Política de Privacidade" para
`content.asp` (**link morto**) — apontar para `/PoliticaDePrivacidade/`.
Copyright `© 2020` → ano corrente.

### 2.8 Campos de produto disponíveis

Confirmados na página de produto e no `ProdutoAjax.aspx`:

| Campo | Sempre? | Origem |
|---|---|---|
| `codProduto` (`019563`) | sim | `B1_COD` |
| `descricaoSite` (`BISCOITO AYMORE MAIZENA CHOCOLATE 170G`) | sim | portal ADM |
| `descricaoProtheus` (`AYMORE MAIZENA CHOCOLATE 170G (40)`) | sim | `B1_DESC` |
| `imagem` (`/content/produto/010101/019563/Trat_10032023_165250.png`) | não | portal ADM |
| `fornecedor` (`AYMORE`) | sim | |
| `canal` (`VAREJO ALIMENTAR`) | sim | |
| `grupo` (`AYM NEUTROS`) | sim | `BM_GRUPO` |
| `categoria` / `subcategoria` | sim | |
| `estoque` (`2910`) | sim | público hoje |
| `multiplo` (`4`) | sim | público hoje |
| `preco` | **só autenticado** | |

Imagem tem 3 prefixos (`Trat_`, `Thumb_`, `T_`) e 4 extensões (`.png`, `.jpg`,
`.jfif`, `.jpeg`). **`.jfif` quebra em Safari antigo** — normalizar via
`next/image`. Produto sem imagem existe — precisa de fallback.

---

## 3. Proibições absolutas

### 3.1 Conteúdo — nunca inventar

Proibido em qualquer lugar da página:

- número de clientes, pedidos, entregas, SKUs, funcionários, veículos
- anos de mercado, ano de fundação, história da empresa
- cidades ou estados atendidos, raio de entrega, prazo de entrega
- depoimentos, avaliações, notas, selos, prêmios, certificações
- logos de clientes
- qualquer estatística com número

**Não existe nenhum dado institucional confirmado além do que está na §2.6.**
Se uma seção precisar de número, a seção não existe.

### 3.2 Dados — módulos que não podem existir

| Proibido | Motivo |
|---|---|
| "Mais vendidos" / "Mais procurados" | backend não expõe ranking |
| "Novidades" / "Lançamentos" | backend não expõe data de cadastro |
| "Recomendados para você" | não existe |
| Contador de estoque tipo "restam 3" | `estoque` é quantidade de depósito, não escassez |
| Preço para visitante anônimo | não existe sem sessão |
| Avaliação / estrelas | não existe |

### 3.3 Design — não fazer

Gradiente roxo/azul decorativo · glassmorphism · blur pesado · card com glow ·
grid decorativo aleatório · dashboard falso flutuando · excesso de pill badge ·
raio grande em tudo · animação de entrada com elemento voando · parallax
decorativo · hero ocupando a tela inteira · toda seção virando card arredondado
isolado · dark mode (o projeto é claro por decisão).

### 3.4 Técnico — não fazer

jQuery · Bootstrap · Popper · Swiper · Slick · qualquer biblioteca de carrossel
· biblioteca de ícones inteira · biblioteca de componentes pronta · framework de
animação · store global · `useEffect` para buscar dado que o servidor pode
buscar · `"use client"` em componente que não tem interação · chamada a endpoint
legado fora de `src/lib/legacy/` · dado hardcoded dentro de componente de
apresentação.

---

## 4. Design tokens

Arquivo: `src/styles/tokens.css`, importado por `src/app/globals.css`.
Tailwind v4 — declarar em `@theme`.

### 4.1 Cor

```
--color-brand-900   #14165A     texto sobre claro, hover de primário
--color-brand-700   #1F2275
--color-brand-600   #292C95     ← PRIMÁRIA da marca
--color-brand-500   #3D41B0
--color-brand-100   #E4E5F5     fundo de destaque suave
--color-brand-50    #F2F3FA

--color-accent-600  #C25E0A     hover do acento
--color-accent-500  #F2811D     ← ACENTO da marca (arco do logo) — confirmar valor
--color-accent-100  #FDEEDD     fundo de badge de oferta

--color-ink-900     #14161C     título
--color-ink-700     #3A3F4A     corpo
--color-ink-500     #6A7180     secundário
--color-ink-400     #9AA1AF     desabilitado

--color-surface-0   #FFFFFF     card, header
--color-surface-50  #FAFAFB     fundo de página
--color-surface-100 #F3F4F6     fundo de seção alternada

--color-border      #E3E5EA     padrão
--color-border-strong #CBCFD8   divisor forte

--color-success-600 #157347     em estoque
--color-warning-600 #B45309     aviso de múltiplo
--color-danger-600  #B42318     indisponível
```

Contraste mínimo AA: texto normal 4.5:1, texto grande e ícone 3:1.
`--color-ink-500` sobre `--color-surface-0` = 4.6:1 ✓. Não usar `ink-400` para
texto informativo, apenas para estado desabilitado.

### 4.2 Tipografia

Uma família: **Inter**, via `next/font/local` ou `next/font/google`,
`display: swap`, **pesos 400, 500, 600, 700 apenas**.

> Não replicar o erro atual: o site hoje carrega **18 variações de Lato** de CDN
> externo, render-blocking, no caminho crítico do LCP.

```
--text-xs    0.75rem / 1.1rem      código, metadado
--text-sm    0.875rem / 1.25rem    rótulo, nome de produto no card
--text-base  1rem / 1.5rem         corpo
--text-lg    1.125rem / 1.65rem    subtítulo
--text-xl    1.375rem / 1.8rem     título de seção mobile
--text-2xl   1.75rem / 2.1rem      título de seção desktop
--text-3xl   clamp(2rem, 1.4rem + 2.4vw, 3.25rem)   h1 do hero
```

Nome de produto: `--text-sm`, peso 500, **`line-clamp-2`**, `min-height` fixa
de 2 linhas. Descrições reais chegam a 48 caracteres
(`BISCOITO AYMORÉ TORTUGUITA RECH CHOCO BAUNI 86G`) — o card não pode saltar de
altura.

### 4.3 Espaçamento, raio, elevação, motion

```
--space-section-y   clamp(2.5rem, 1.8rem + 3vw, 4.5rem)
--space-gutter      clamp(1rem, 0.6rem + 1.6vw, 2rem)
--container-max     1320px

--radius-sm    4px    campo, badge
--radius-md    6px    botão, card
--radius-lg    10px   modal, painel do megamenu
                      (nunca acima de 12px — regra dura)

--shadow-sm    0 1px 2px rgb(20 22 28 / 0.06)
--shadow-md    0 4px 12px rgb(20 22 28 / 0.08)
--shadow-lg    0 12px 32px rgb(20 22 28 / 0.12)     só megamenu e modal

--duration-fast    120ms
--duration-normal  200ms
--ease-out         cubic-bezier(0.16, 1, 0.3, 1)
```

Animar **apenas** `transform`, `opacity`, `background-color`, `border-color`.
Nunca `width`, `height`, `top`, `left`, `margin`, `font-size`.

Envolver toda transição em:
```css
@media (prefers-reduced-motion: reduce) { /* duration: 1ms, sem transform */ }
```

### 4.4 Foco

Um único estilo, global, visível sobre qualquer fundo:

```css
:focus-visible {
  outline: 2px solid var(--color-accent-500);
  outline-offset: 2px;
  border-radius: 2px;
}
```

Nunca `outline: none` sem substituto.

---

## 5. Blueprint da home

| # | Seção | Propósito | Ação primária | Fonte de dado | S/C | Componente |
|---|---|---|---|---|---|---|
| 1 | Skip link | acessibilidade | pular para conteúdo | — | S | `SkipLink` |
| 2 | Utility bar | atalhos de conta e atendimento | ir para Meus Pedidos / Contato | estático | S | `UtilityBar` |
| 3 | Main header | identidade + **busca** + conta + carrinho | **buscar produto** | sessão (conta/carrinho) | **C** | `MainHeader` |
| 4 | Mega menu | navegar catálogo inteiro | abrir departamento | `getNavigation()` | **C** | `MegaMenu` |
| 5 | Hero | posicionamento + entrada no catálogo | ver produtos / ser cliente | estático | S | `Hero` |
| 6 | Departamentos | acesso rápido aos 6 departamentos | abrir departamento | `getNavigation()` | S | `DepartmentGrid` |
| 7 | Faixa de serviço | 3 diferenciais reais | ler regra de compra/entrega | estático §2.6 | S | `ServiceStrip` |
| 8 | Ofertas | descoberta comercial | abrir produto / adicionar | `getOffers()` | S | `ProductShowcase` |
| 9 | Vitrine por departamento (×N) | descoberta de portfólio | abrir produto / adicionar | `getCatalog({dep})` | S | `ProductShowcase` |
| 10 | Canais | mostrar segmentos atendidos | abrir canal | `getChannels()` | S | `ChannelSection` |
| 11 | Fornecedores | confiança + descoberta por marca | abrir catálogo do fornecedor | `getSuppliers()` | S | `SupplierShowcase` |
| 12 | Como se tornar cliente | converter visitante | ir para cadastro | estático | S | `CustomerOnboarding` |
| 13 | Footer | navegação completa + legal | qualquer destino | estático | S | `SiteFooter` |

Apenas **3 Client Components** na página inteira: `MainHeader`, `MegaMenu`,
`AddToCartControl` (dentro do `ProductCard`, e só quando autenticado).

### 5.1 Desvios do esboço em `prompt.md` §25 — com motivo

| Esboço | Decisão | Motivo |
|---|---|---|
| `LogisticsSection` | **removida** | zero dado institucional confirmado. Construí-la exigiria inventar números ou foto de CD — proibido pela §3.1. Slot documentado na §9.3 para quando o cliente fornecer material |
| `B2BBenefits` + `FinalCTA` | **fundidas em `ServiceStrip` + `CustomerOnboarding`** | os únicos diferenciais reais são os três da §2.6. Dois blocos institucionais separados repetiriam a mesma informação com menos substância |
| `ServiceStrip` no fim | **movida para logo após os departamentos** | é onde ela já vive no site atual — mantém a familiaridade exigida pelo `prompt.md` §31, e "entrega gratuita" é forte demais para ficar no rodapé |
| `OfferShowcase` separado de `ProductShowcase` | **mesmo componente, prop diferente** | a diferença é a fonte de dado, não o layout. Dois componentes seria duplicação |

Resultado: **uma** seção institucional (`ServiceStrip`) e **uma** de conversão
(`CustomerOnboarding`), ambas curtas, ambas com conteúdo real. O resto da página
é catálogo — que é o que `prompt.md` §26 exige.

### 5.2 Comportamento acima da dobra @1440px

Visível sem rolar: logo · busca em destaque · conta · carrinho · barra de
departamentos · h1 do hero · CTA · **primeira fileira de cards de departamento**.

O hero ocupa **no máximo 380px de altura em desktop e 240px em mobile**. Nunca
`100vh`. `prompt.md` §26 é regra dura.

---

## 6. Árvore de arquivos

Criar exatamente isto. Nada além.

```
src/
├── app/
│   ├── layout.tsx                    S   html/body, fonte, skip link, header, footer
│   ├── page.tsx                      S   home — compõe as seções, busca dados em paralelo
│   ├── globals.css                       reset + @theme + camadas
│   ├── loading.tsx                   S   skeleton da home
│   ├── error.tsx                     C   boundary de erro
│   └── not-found.tsx                 S
│
├── components/
│   ├── layout/
│   │   ├── SkipLink.tsx              S
│   │   ├── UtilityBar.tsx            S
│   │   ├── MainHeader.tsx            C   busca + conta + carrinho
│   │   ├── MegaMenu.tsx              C   navegação de catálogo
│   │   ├── MobileNav.tsx             C   drawer mobile
│   │   ├── SiteHeader.tsx            S   compõe UtilityBar + MainHeader + MegaMenu
│   │   └── SiteFooter.tsx            S
│   │
│   ├── search/
│   │   ├── SearchField.tsx           C   input + submit
│   │   └── SearchSuggestions.tsx     C   painel de autocomplete
│   │
│   ├── home/
│   │   ├── Hero.tsx                  S
│   │   ├── DepartmentGrid.tsx        S
│   │   ├── ServiceStrip.tsx          S
│   │   ├── ChannelSection.tsx        S
│   │   ├── SupplierShowcase.tsx      S
│   │   └── CustomerOnboarding.tsx    S
│   │
│   ├── product/
│   │   ├── ProductCard.tsx           S   card completo
│   │   ├── ProductCardSkeleton.tsx   S
│   │   ├── ProductImage.tsx          S   next/image + fallback
│   │   ├── ProductShowcase.tsx       S   título + trilho + link "ver todos"
│   │   ├── PriceDisplay.tsx          S   preço OU "Ver preço"
│   │   ├── StockBadge.tsx            S
│   │   └── AddToCartControl.tsx      C   quantidade + botão — só autenticado
│   │
│   └── ui/
│       ├── Button.tsx                S   variantes primary/secondary/ghost/link
│       ├── Field.tsx                 S   input + label + erro
│       ├── Container.tsx             S   largura máxima + gutter
│       ├── Section.tsx               S   espaçamento vertical + fundo alternado
│       ├── SectionHeading.tsx        S   h2 + link opcional "ver todos"
│       ├── ScrollRail.tsx            S   trilho horizontal CSS puro — sem lib
│       ├── Skeleton.tsx              S
│       └── EmptyState.tsx            S
│
├── lib/
│   ├── legacy/                           ÚNICO ponto que fala com o legado
│   │   ├── client.ts                     fetch tipado, timeout, retry, cookie
│   │   ├── navigation.ts                 getNavigation()
│   │   ├── catalog.ts                    getCatalog(), getOffers()
│   │   ├── suppliers.ts                  getSuppliers()
│   │   ├── channels.ts                   getChannels()
│   │   ├── session.ts                    getSession() — lê cookie, nunca escreve
│   │   └── errors.ts                     LegacyError, LegacyTimeoutError, LegacyContractError
│   │
│   ├── schemas/                          Zod — o contrato, em código
│   │   ├── product.ts
│   │   ├── navigation.ts
│   │   ├── supplier.ts
│   │   └── channel.ts
│   │
│   ├── fixtures/                         mock de desenvolvimento
│   │   ├── products.ts
│   │   ├── navigation.ts
│   │   ├── suppliers.ts
│   │   ├── channels.ts
│   │   └── README.md                     como remover quando a fachada existir
│   │
│   ├── seo/
│   │   ├── metadata.ts                   metadata base + da home
│   │   └── jsonLd.ts                     Organization + WebSite
│   │
│   ├── image.ts                          normaliza Trat_/Thumb_/T_ e .jfif
│   ├── url.ts                            slug ⇄ rota, nos dois sentidos
│   ├── format.ts                         moeda BRL, quantidade, múltiplo
│   └── cn.ts                             merge de className
│
├── hooks/
│   ├── useDebouncedValue.ts
│   └── useMediaQuery.ts
│
├── styles/
│   ├── tokens.css
│   └── typography.css
│
└── types/
    └── index.ts                          reexporta tipos inferidos do Zod

public/
├── brand/logo-arguto.svg                 vetorizar do PNG; manter PNG de fallback
├── brand/logo-arguto.png
└── icons/                                shoppingcart · truck · market · phone · map
                                          · visa · mastercard · amex · boleto · safebrowsing
```

**S** = Server Component (padrão, sem diretiva) · **C** = `"use client"` na
primeira linha.

---

## 7. Contratos de dados

`src/lib/schemas/` — Zod é a fonte, os tipos são inferidos. Nunca declarar
`interface` à mão para dado do legado.

```ts
// product.ts
Product {
  codProduto: string          // "019563" — 6 dígitos, com zeros à esquerda
  descricaoSite: string       // portal ADM — usar SEMPRE que existir
  descricaoProtheus: string   // B1_DESC — fallback e atributo title
  imagem: string | null       // caminho relativo; null = usar fallback
  fornecedor: string          // "AYMORE"
  fornecedorCodigo: string    // "00032001"
  canal: string | null
  grupo: string | null
  categoria: string | null
  subcategoria: string | null
  estoque: number             // 0 = indisponível
  multiplo: number            // 1 = sem restrição
  preco: number | null        // null quando não autenticado — NUNCA 0
  link: string                // "/p/{slug}/{cod}/" — vem pronto do legado
}

// navigation.ts
Department { codigo, nome, slug, rota, categorias: Category[] }
Category   { codigo, nome, slug, rota }
Navigation { departamentos: Department[] }

// supplier.ts
Supplier { codigo, nome, slug, logo: string | null, rota }

// channel.ts
Channel { id, nome, slug, rota }
```

Regras de contrato, obrigatórias:

1. **`preco: null` ≠ `preco: 0`.** `null` = sem sessão. `0` = preço zerado, que
   é erro de cadastro. `PriceDisplay` trata os dois de forma diferente.
2. **`imagem: null` é caso normal**, não erro. Produto sem foto existe no
   catálogo real.
3. **Toda resposta do legado passa por `.safeParse()`.** Falha → `LegacyContractError`
   → seção renderiza `EmptyState`, **a página não quebra**.
4. **Nenhum componente importa de `lib/fixtures/`.** Só `lib/legacy/*` importa,
   e apenas quando `process.env.USE_FIXTURES === "true"`.

---

## 8. Especificação por componente

### 8.1 `SiteHeader` / `UtilityBar` / `MainHeader`

**UtilityBar** (S) — fundo `brand-900`, altura 36px, texto `--text-xs` branco.
Some abaixo de 768px.
Esquerda: `Atendimento` → `/Contato/`. Direita: `Como comprar` → `/ComoComprar/`
· `Meus pedidos` → `/MeusPedidos/`.
Nada além disso. `prompt.md` §5 proíbe link de enchimento.

**MainHeader** (C) — fundo branco, `sticky top-0 z-40`, `--shadow-sm` ao rolar.
Grid desktop: `logo (200px) | busca (1fr) | ações (auto)`.
Grid mobile: `menu (44px) | logo (1fr) | busca-ícone | carrinho` — busca vira
linha inteira abaixo.

Alvo de toque mínimo **44×44px** em tudo que é clicável no mobile.

Ações:
- **Sem sessão:** botão `Entrar` → `/Login/`, variante `secondary`.
- **Com sessão:** `Minha conta` (menu: Meus Pedidos, Meus Dados, Sair).
- **Carrinho:** sempre visível. Badge com contagem, `aria-label="Carrinho, {n} itens"`.
  Sem itens → sem badge, nunca "0".

Por que Client: contagem do carrinho e estado de sessão vêm de cookie e mudam
sem navegação.

**Logo:** `<a href="/">` com `aria-label="Arguto — página inicial"`. Altura fixa
40px desktop / 32px mobile, `width`/`height` explícitos. **É o candidato a LCP
do header — `priority`.**

### 8.2 `MegaMenu` (C)

Barra horizontal abaixo do MainHeader, fundo `surface-0`, borda inferior.

Itens: `Departamentos` (abre painel) · `Fornecedores` → `/Fornecedores/` ·
`Ofertas` → `/Ofertas/` · `Canais` (abre painel).

Painel de Departamentos — **duas colunas**:
```
┌──────────────────┬─────────────────────────────────┐
│ ALIMENTOS      › │  BISCOITOS     MASSAS           │
│ BAZAR            │  CHOCOLATES    MOLHOS           │
│ BEBIDAS          │  CONDIMENTOS   PANETONE         │
│ CUIDADOS PESS.   │  ENLATADOS     QUEIJOS          │
│ LIMPEZA          │  GULOSEIMAS    SNACKS           │
│ PET              │                TEMPEROS         │
│                  │  ─────────────────────────────  │
│                  │  Ver tudo em ALIMENTOS  →       │
└──────────────────┴─────────────────────────────────┘
```

Regras duras:

- Coluna esquerda: hover **ou** foco troca a direita. Sem clique necessário.
- **Departamento sem categoria (BAZAR):** direita mostra `EmptyState` curto +
  o link "Ver tudo em BAZAR". Nunca coluna vazia.
- Escala: direita usa `columns: 2` CSS com `max-height` e rolagem interna.
  Precisa aguentar 30+ categorias sem estourar a viewport.
- **Acessibilidade (usar Radix `NavigationMenu`, é o único lugar que justifica
  dependência):** `Esc` fecha e devolve foco ao gatilho · `Tab` percorre em
  ordem visual · setas navegam entre departamentos · `aria-expanded` no gatilho
  · painel com `role="region"` e `aria-label`.
- Abre com `opacity` + `translateY(-4px)` em `--duration-fast`. Nada mais.
- **Todos os links existem no DOM**, mesmo com painel fechado — requisito de
  crawl (`prompt.md` §20). Ocultar com `hidden`/`display:none`, nunca só com JS.

**MobileNav** (C): drawer da esquerda, acordeão de departamento → categorias.
Foco preso dentro enquanto aberto. `Esc` fecha. Fundo da página com
`aria-hidden` e rolagem travada.

### 8.3 `SearchField` + `SearchSuggestions` (C)

O elemento mais importante do header.

- Altura 48px desktop / 44px mobile. Borda `border-strong` 1.5px. Foco: borda
  `brand-600` + ring do acento.
- Placeholder: `Busque por produto, marca ou categoria`
- `<label class="sr-only">Buscar produtos</label>`
- Botão de busca com ícone **e** `aria-label="Buscar"`. Desktop mostra texto `Buscar`.
- Submete para `/Busca/?q={termo}` via `<form method="get">` — **funciona sem
  JavaScript**.

Autocomplete: dispara com ≥ 3 caracteres, debounce 250ms, chama
`GET /api/search?q=` (route handler → `_ajax_busca.aspx?format=json`, que **já
existe e já devolve JSON**).

Combobox ARIA correto: `role="combobox"` `aria-expanded` `aria-controls`
`aria-activedescendant` · setas navegam · `Enter` seleciona · `Esc` fecha ·
clique fora fecha. Cada sugestão: miniatura 40×40 + `descricaoSite`, link direto
para o produto. Zero resultado → `Nenhum produto encontrado para "{termo}"` +
link para busca completa.

### 8.4 `Hero` (S)

**Máximo 380px desktop / 240px mobile.** Nunca `100vh`.

Composição: duas colunas em desktop (texto 55% / imagem 45%), empilhado no
mobile com imagem virando faixa de 160px.

```
h1     Distribuição que movimenta o seu negócio.
p      Alimentos, bebidas, limpeza, cuidados pessoais, bazar e pet.
       Portfólio completo das principais indústrias, com entrega gratuita.
CTA-1  Ver produtos          → /produtos/alimentos/000900/   (primary)
CTA-2  Quero ser cliente     → /Login/                        (secondary)
```

Justificativa da copy: cada afirmação é verificável. Os 6 departamentos são a
§2.2. "Entrega gratuita" é literal da §2.6. Nenhum número, nenhuma promessa
nova.

`CTA-2` vai para `/Login/` porque **é lá que o cadastro vive hoje** — a mesma
página tem os blocos de login e de cadastro
(`ctl00$PH_Content$CPFCNPJCad`). Não criar rota nova.

Imagem: sem material real da operação, usar **composição de produtos reais do
catálogo** (imagens de `/content/produto/`), não foto de banco de imagem.
`priority` + `fetchPriority="high"` — **é o LCP da página, e é o único elemento
que recebe `priority` na home inteira.** `width`/`height` explícitos.

Fundo: `surface-50` liso ou faixa `brand-600` sólida. **Sem gradiente.**

### 8.5 `DepartmentGrid` (S)

6 tiles. Desktop `grid-cols-6` (ou 3×2 em ≤1024px), mobile `ScrollRail`
horizontal com snap.

Tile: ícone/imagem 64px, nome em `--text-sm` peso 600 caixa alta, borda 1px,
`radius-md`. Hover: borda `brand-600` + `translateY(-2px)`. **Tile inteiro é um
`<a>`** — nunca link dentro de div clicável.

Ordem fixa: ALIMENTOS · BEBIDAS · LIMPEZA · CUIDADOS PESSOAIS · BAZAR · PET
(volume comercial provável primeiro; ajustável quando houver dado real).

PET não tem rota de departamento própria hoje → aponta para
`/produtos/pet/alimentos-pet/000905/000535/`.

### 8.6 `ServiceStrip` (S)

Faixa `brand-600` de borda a borda, texto branco. 3 colunas desktop, empilhado
mobile.

Conteúdo **literal** da §2.6 — não reescrever. Ícones SVG inline dos assets
existentes, `currentColor`, 40px.

Cada item é um `<a>` inteiro para a rota indicada. `--text-base` no título,
`--text-sm` no apoio.

### 8.7 `ProductCard` (S) — o componente mais importante

Reutilizado em toda a plataforma. Construir com esse peso.

```
┌────────────────────────┐
│                        │  imagem 1:1, fundo surface-0
│       [imagem]         │  contain, padding 12px
│                        │  badge "OFERTA" canto sup. esq. se aplicável
├────────────────────────┤
│ AYMORE                 │  fornecedor · text-xs · ink-500 · caixa alta
│ Biscoito Aymoré        │  descricaoSite · text-sm/500 · line-clamp-2
│ Maizena Chocolate 170g │  ALTURA FIXA de 2 linhas
│ Cód. 019563 · cx 40    │  text-xs · ink-500
├────────────────────────┤
│ R$ 12,40  /un          │  autenticado
│   ou                   │
│ [ Ver preço ]          │  anônimo → /Login/
├────────────────────────┤
│ [ − ] [  4  ] [ + ]    │  só autenticado
│ [   Adicionar      ]   │
└────────────────────────┘
```

Dimensões: **largura 200–240px**, altura total ≤ 380px. Desktop 1440px mostra
**5–6 cards simultâneos**. `prompt.md` §9 exige densidade.

Estados obrigatórios:

| Estado | Comportamento |
|---|---|
| Anônimo | sem preço, sem quantidade. Botão `Ver preço` → `/Login/` |
| Autenticado | preço + quantidade + `Adicionar` |
| `estoque === 0` | imagem a 60% de opacidade, badge `Indisponível` em `danger-600`, controles desabilitados com `aria-disabled` |
| `imagem === null` | `ProductImage` mostra monograma "A" sobre `surface-100` + `alt` com o nome do produto |
| Carregando | `ProductCardSkeleton` com **as mesmas dimensões** — CLS zero |
| Oferta | badge `OFERTA` em `accent-500` |
| `multiplo > 1` | texto `Múltiplo de {n}` abaixo da quantidade, `--text-xs`, `warning-600` |

`alt` da imagem = `descricaoSite`. Nunca vazio. Nunca "imagem do produto".

O card inteiro **não** é um link — o `<a>` cobre imagem e título. Motivo: os
controles de quantidade são interativos e não podem estar dentro de âncora.

`AddToCartControl` (C) é o **único** pedaço cliente. Valida `multiplo` e
`estoque` **antes** de chamar, mostra erro inline em vez de `alert()`, e o
servidor revalida (R-06). Feedback por `Toast` + atualização do badge do
carrinho. Nunca `window.location.reload()`.

### 8.8 `ProductShowcase` (S)

`SectionHeading` (h2 + `Ver todos →`) + `ScrollRail` de `ProductCard`.

`ScrollRail`: **CSS puro** — `overflow-x:auto`, `scroll-snap-type: x mandatory`,
`scrollbar-width: thin`. Setas prev/next só em desktop, `aria-hidden` (a rolagem
por teclado já funciona nativamente). **Zero biblioteca de carrossel.**

Props: `titulo`, `rotaVerTodos`, `produtos: Product[]`, `variant: "default" | "oferta"`.

Lista vazia → **a seção inteira não renderiza**. Nunca mostrar título com trilho
vazio.

Usos na home: 1× Ofertas + até 3× por departamento (ALIMENTOS, BEBIDAS,
LIMPEZA). **Máximo 4 vitrines** — além disso a página vira scroll infinito sem
propósito.

### 8.9 `ChannelSection` (S)

Cards largos dos canais da §2.5. Explica que a Arguto atende contextos de compra
diferentes — não é o mesmo que categoria.

Renderiza o que a fachada devolver. **Não fixar em 2 itens.** Se vier 1, layout
não quebra; se vier 4, também não.

Título: `Canais de atendimento`. Sem copy inventada sobre cada canal — só nome +
link.

### 8.10 `SupplierShowcase` (S)

Título: `Grandes marcas, um só parceiro`

Grade de logos — **não trilho**. Desktop `grid-cols-5`, tablet 4, mobile 3.
Container do logo: proporção 3:2, fundo branco, borda 1px, logo `object-contain`
com padding 16px. Hover: borda `brand-600`.

Logo inteiro é `<a>` para o catálogo do fornecedor. `alt` = nome do fornecedor.
**Nunca `alt=""`** — o site atual erra exatamente isso.

Rodapé da seção: `Ver todos os fornecedores →` → `/Fornecedores/`.

Não fazer parecer parede de patrocinador: os logos levam a catálogo, então são
navegação, não ornamento. Grade regular com borda, sem escala de cinza, sem
opacidade reduzida.

### 8.11 `CustomerOnboarding` (S)

Fundo `surface-100`. 4 passos numerados, horizontal em desktop, vertical em
mobile.

```
1  Cadastre sua empresa      CNPJ ou CPF
2  Aguarde a liberação       análise cadastral
3  Acesse preços e condições preço exclusivo por cliente
4  Monte seus pedidos        direto pelo site
```

Base factual: o login pede CPF/CNPJ (§2.6), o preço só aparece autenticado
(§2.8), e existe bloco de cadastro em `/Login/`. **Não afirmar prazo de
liberação** — não confirmado.

CTA: `Quero ser cliente` → `/Login/`.

> ⚠️ Marcar com comentário `// CONFIRMAR NO DISCOVERY`: o processo real de
> liberação cadastral. Se o discovery mostrar que difere, corrigir os passos.
> `prompt.md` §14 exige o processo real.

### 8.12 `SiteFooter` (S)

Fundo `brand-900`, texto branco. 4 colunas desktop, acordeão mobile.

```
PRODUTOS          MINHA CONTA        ATENDIMENTO       INSTITUCIONAL
Departamentos     Entrar             Contato           Prazos e garantias
Fornecedores      Meus pedidos       FAQ               Prazo de entrega
Ofertas           Meus dados         Como comprar      Trocas e devoluções
Canais            Carrinho           Regras de frete   Política de privacidade
                                     Vendas corporativas  Política de pagamento
```

Rodapé: logo em versão clara · bandeiras (visa, mastercard, amex, boleto,
safebrowsing) com `alt` · `© {ano corrente} Arguto. Todos os direitos
reservados.` · razão social `LUFIR Comércio e Representação LTDA` · link para
`/PoliticaDePrivacidade/`.

**Corrigir dois defeitos do site atual:** o link de privacidade aponta hoje para
`content.asp` (morto) — apontar para `/PoliticaDePrivacidade/`. E o ano é fixo
`2020` — usar `new Date().getFullYear()`.

O texto legal longo do rodapé atual pode ser mantido, dentro de `<details>` com
resumo `Direitos autorais e uso do conteúdo`.

---

## 9. Dados e fixtures

### 9.1 Regra

A fachada `/v1/api/` ([04-ESTRUTURA §3](04-ESTRUTURA.md)) **ainda não existe**.
Toda função de `lib/legacy/` deve:

1. tentar a fachada quando `USE_FIXTURES !== "true"`;
2. usar fixture quando `USE_FIXTURES === "true"`;
3. validar com Zod nos dois caminhos — a fixture também passa pelo schema;
4. em erro, lançar `LegacyError`. O chamador decide o fallback visual.

Assinatura idêntica nos dois modos. **Trocar de fixture para fachada não pode
exigir alteração em nenhum componente.**

### 9.2 Fixtures obrigatórias — dados reais

| Arquivo | Conteúdo |
|---|---|
| `navigation.ts` | 6 departamentos e todas as categorias da §2.3, com códigos e rotas reais |
| `suppliers.ts` | 15 fornecedores da §2.4, com códigos e caminhos de logo reais |
| `channels.ts` | canais da §2.5 |
| `products.ts` | **mínimo 24 produtos**, usando códigos, descrições e caminhos de imagem reais observados |

Produtos reais já confirmados para semear a fixture:

```
019563  BISCOITO AYMORE MAIZENA CHOCOLATE 170G       AYMORE  /content/produto/010101/019563/Trat_10032023_165250.png
019030  BISCOITO AYMORÉ MARIA 185G                   AYMORE  /content/produto/010101/019030/Trat_22082022_105524.png
021601  BISCOITO AYMORÉ TORTUGUITA RECH CHOCO 86G    AYMORE  /content/produto/010101/021601/Trat_13052026_154704.png
021602  BISCOITO AYMORÉ TORTUGUITA RECH BRIGAD. 86G  AYMORE  /content/produto/010101/021602/Trat_04052026_164436.png
019022  BISCOITO AYMORÉ AMANTEIGADO CHOCOLATE 248G   AYMORE  /content/produto/010101/019022/Trat_07112022_083234.png
007910  BISCOITO AYMORÉ AMANTEIGADO CHOCOLATE 330G   AYMORE  /content/produto/010101/007910/Trat_01112021_112701.jpg
007915  BISCOITO AYMORÉ AMANTEIGADO COCO 330G        AYMORE  /content/produto/010101/007915/Trat_01112021_113340.jpg
016980  AYM TORTUGUITA WAFER CHOCOLATE 85G (48)      AYMORE  /content/produto/010101/016980/T_28042020_165052_372.jpg
019025  AYM AMANT LEITE COM CHOCOLATE 248G           AYMORE  /content/produto/010101/019025/Trat_23092024_145420.jfif
```

Completar até 24 distribuindo entre os outros fornecedores da §2.4. **Descrições
plausíveis do ramo são aceitáveis na fixture; qualquer afirmação institucional
não é.**

A fixture **precisa** conter os casos difíceis, senão os estados nunca são
testados:

- ≥ 2 produtos com `imagem: null`
- ≥ 2 com `estoque: 0`
- ≥ 3 com `multiplo` de 4, 6 e 12
- ≥ 1 com `.jfif`
- ≥ 1 com descrição de 50+ caracteres
- **todos com `preco: null`** (modo anônimo é o padrão)
- ≥ 4 com preço preenchido em uma fixture separada `productsAuthenticated`

### 9.3 Slot institucional — deixar vazio

`LogisticsSection` **não é construída**. Registrar em
`src/components/home/README.md`:

```
LogisticsSection — NÃO IMPLEMENTAR AINDA
Requer material que o cliente ainda não forneceu:
foto do centro de distribuição, cobertura geográfica, números da operação.
Inventar qualquer um desses viola prompt.md §28 e docs/05-HOME-SPEC.md §3.1.
Slot fica entre ChannelSection e SupplierShowcase quando houver material.
```

---

## 10. SEO, performance e acessibilidade

### 10.1 SEO

`app/layout.tsx` — `metadataBase`, `title.template = "%s | Arguto"`, `lang="pt-BR"`.

Home:
```
title       Arguto — Distribuidora de alimentos, bebidas e limpeza
description Portfólio das principais indústrias em alimentos, bebidas, limpeza,
            cuidados pessoais, bazar e pet. Compra B2B com entrega gratuita.
canonical   https://arguto.com.br/
openGraph   type=website, locale=pt_BR, imagem 1200×630 gerada
```

JSON-LD via `<script type="application/ld+json">` no Server Component:
`Organization` (nome, logo, url, `LUFIR Comércio e Representação LTDA`) +
`WebSite` com `SearchAction` apontando para `/Busca/?q={search_term_string}`.

**Não incluir** `address`, `telephone`, `aggregateRating`, `numberOfEmployees`
— não confirmados.

Hierarquia: **exatamente um `<h1>`** (hero). Cada seção com `<h2>`. Sem pular
nível. O site atual tem **zero `<h1>`** — é um dos defeitos a corrigir.

### 10.2 Performance

| Regra | Aplicação |
|---|---|
| Server Component por padrão | apenas 3 clientes na página |
| `priority` | **só na imagem do hero** |
| `loading="lazy"` | tudo abaixo da dobra |
| `width`/`height` ou `aspect-ratio` | **toda** imagem, sem exceção |
| `next/image` `formats` | `["image/avif","image/webp"]` |
| `sizes` | obrigatório em toda imagem responsiva |
| Fonte | `next/font`, self-hosted, `display: swap`, 4 pesos |
| Ícone | SVG inline, nunca fonte de ícone |
| Terceiro | **nenhum** nesta entrega. GTM entra depois, num só contêiner |
| Busca de dados | `Promise.all` em `page.tsx`, nunca cascata |

Orçamento da home: **JS < 120 KB não comprimido · CSS < 60 KB · < 40 requisições
· peso total < 1,5 MB.** Referência atual: 24,17 MB e 118 requisições.

### 10.3 Acessibilidade — WCAG 2.2 AA

- `SkipLink` primeiro elemento focável → `#main`
- Landmarks: `<header>` `<nav aria-label>` `<main id="main">` `<footer>`
- `:focus-visible` global visível, nunca removido
- Alvo de toque ≥ 44×44px no mobile
- Contraste ≥ 4.5:1 texto, ≥ 3:1 ícone e borda
- `alt` descritivo em **100%** das imagens (o site atual tem 1 de 119)
- Nada comunicado só por cor — indisponível tem texto, não só opacidade
- `prefers-reduced-motion` respeitado em toda transição
- Navegação completa por teclado, incluindo MegaMenu e autocomplete
- `aria-live="polite"` no feedback de adicionar ao carrinho

---

## 11. Ordem de implementação

Não pular etapa. Cada checkpoint tem que passar antes da próxima.

| # | Etapa | Checkpoint |
|---|---|---|
| 1 | `tokens.css`, `typography.css`, `globals.css` | tokens resolvem no navegador |
| 2 | `ui/`: Button, Field, Container, Section, SectionHeading, Skeleton, EmptyState, ScrollRail | página de teste renderiza todas as variantes |
| 3 | `lib/`: schemas, fixtures, legacy com `USE_FIXTURES`, image, url, format | `getNavigation()` devolve dado validado |
| 4 | `layout.tsx`, SkipLink, landmarks, fonte | esqueleto navegável por teclado |
| 5 | UtilityBar, MainHeader, SiteHeader | header responsivo 320→1920 |
| 6 | MegaMenu, MobileNav | teclado e leitor de tela OK, BAZAR sem quebrar |
| 7 | SearchField, SearchSuggestions | funciona **com JS desligado** (form GET) |
| 8 | Hero | ≤ 380px desktop, LCP identificado |
| 9 | DepartmentGrid | 6 tiles, mobile com snap |
| 10 | ServiceStrip | copy literal da §2.6 |
| 11 | **ProductImage, PriceDisplay, StockBadge, ProductCard, Skeleton** | **todos os 7 estados da §8.7 renderizados lado a lado numa página de teste** |
| 12 | AddToCartControl | valida múltiplo e estoque, erro inline |
| 13 | ProductShowcase | trilho CSS puro, lista vazia some |
| 14 | ChannelSection, SupplierShowcase | grade com N variável |
| 15 | CustomerOnboarding | comentário `CONFIRMAR NO DISCOVERY` presente |
| 16 | SiteFooter | link de privacidade corrigido, ano dinâmico |
| 17 | `page.tsx` compondo tudo com `Promise.all` | home completa |
| 18 | Passe responsivo | 320 · 375 · 430 · 768 · 1024 · 1440 · 1920 sem overflow |
| 19 | Passe de acessibilidade | axe-core zero crítico e sério |
| 20 | Passe de performance | orçamento da §10.2 atingido |

**Etapa 11 é a mais importante do documento.** O `ProductCard` será reutilizado
em listagem, busca, produto, ofertas e carrinho. Errar ali se paga em todas as
outras páginas.

---

## 12. Aceite

- [ ] Zero jQuery, Bootstrap, Popper, Swiper, Slick no bundle
- [ ] Apenas 3 Client Components na home
- [ ] JS < 120 KB · CSS < 60 KB · < 40 requisições · < 1,5 MB
- [ ] Exatamente um `<h1>`
- [ ] 100% das imagens com `alt` descritivo e dimensões explícitas
- [ ] Só a imagem do hero com `priority`
- [ ] Busca funciona com JavaScript desabilitado
- [ ] MegaMenu operável só por teclado; `Esc` devolve o foco
- [ ] BAZAR (sem categorias) não quebra o MegaMenu
- [ ] Os 7 estados do `ProductCard` implementados e demonstráveis
- [ ] `preco: null` e `preco: 0` renderizam diferente
- [ ] Produto sem imagem tem fallback com `alt` correto
- [ ] Nenhum componente importa de `lib/fixtures/`
- [ ] Nenhuma chamada a endpoint legado fora de `lib/legacy/`
- [ ] Zero dado inventado — toda afirmação rastreável à §2
- [ ] Link de privacidade → `/PoliticaDePrivacidade/`, não `content.asp`
- [ ] Ano do copyright dinâmico
- [ ] Sem overflow horizontal em 320px
- [ ] axe-core sem erro crítico ou sério
- [ ] `prefers-reduced-motion` respeitado
- [ ] Nenhuma rota nova criada — todas as URLs da §2.7 preservadas
