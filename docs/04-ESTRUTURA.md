# Estrutura de Construção — Cenário de Acesso Total

**Premissa deste documento:** `.aspx` e `.aspx.cs` legíveis e editáveis no
servidor, publicação por FTP/Plesk, Web Site Project com recompilação em runtime.
Cenário "bom" da [02-INVESTIGACAO §5.0](02-INVESTIGACAO.md).

**Relação com o escopo:** [01-ESCOPO.md](01-ESCOPO.md) continua sendo o
documento de escopo e risco, dimensionado para acesso **não confirmado** (214 h
/ R$ 15.000). Este documento detalha a construção quando o acesso existe, e
propõe o ajuste que ele permite: **228 h / R$ 16.000**. A diferença está na
§8.

---

## 1. O que muda com acesso total

| | Sem acesso | Com acesso |
|---|---|---|
| Obter catálogo | parser de HTML do `ProdutoAjax.aspx` | **fachada JSON** escrita por mim |
| Risco de quebra quando eles mexem no site | alto (R-02) | **eliminado** |
| A-01 / A-02 / A-03 | pedidos negociados com terceiros | **tarefas minhas** |
| Validação server-side de estoque (R-06) | depende deles | **corrigida no projeto** |
| Carrinho | reskin com postback | **reconstruído em Next.js** |
| Área logada | reskin no lugar | reskin no lugar (inalterado) |

O ganho principal não é fazer mais coisa em Next.js. É que **a parte mais
frágil do projeto deixa de existir.** Parsear HTML de um sistema que outra
pessoa pode alterar era o maior risco estrutural. Ele sai.

### O que continua valendo, sem exceção

Protheus intocado · portal ADM intocado · rotina dos funcionários intocada ·
regra de preço, estoque, crédito, frete, pedido mínimo e múltiplo **executadas
pelo mesmo código que as executa hoje** · gravação de pedido no Protheus pelo
mesmo caminho · URLs públicas preservadas.

---

## 2. Arquitetura

```
                        Navegador
                            │
                            ▼
              ┌─────────────────────────────┐
              │   Next.js  (arguto.com.br)  │
              └─────────────────────────────┘
                 │                        │
   rotas próprias│                        │rewrite transparente
                 │                        │
                 ▼                        ▼
      ┌──────────────────┐     ┌─────────────────────┐
      │  fachada JSON    │     │  páginas .aspx      │
      │  /v1/api/*.aspx  │     │  Login, Checkout,   │
      │  (nova, fina)    │     │  MeusPedidos, ...   │
      └──────────────────┘     │  markup reskinado   │
                 │             └─────────────────────┘
                 │                        │
                 └────────────┬───────────┘
                              ▼
              código de negócio existente (.aspx.cs)
                              ▼
                     backend / integração
                              ▼
                          PROTHEUS
```

**A fachada JSON não contém regra de negócio.** Ela chama exatamente os mesmos
métodos que as páginas atuais chamam e serializa o retorno. Se a regra de preço
mudar no Protheus amanhã, a fachada devolve o preço novo sem nenhuma alteração —
porque ela nunca soube calcular preço.

### Por que fachada e não parser

| | Parser de HTML | Fachada JSON |
|---|---|---|
| Quebra quando mudam o markup | sim | não |
| Manutenção contínua | permanente | zero |
| Campos disponíveis | só o que a tela mostra | todos os que o método retorna |
| Esforço inicial | 26 h | 32 h |
| Esforço em 12 meses | 26 h + manutenção | 32 h |

A fachada custa 6 h a mais e elimina um risco permanente. Decisão fácil.

---

## 3. Estrutura no servidor deles (IIS)

Legenda: **`+`** novo · **`~`** modificado · **`=`** intocado

```
wwwroot/
├── v1/
│   ├── api/                              +  fachada JSON — pasta nova
│   │   ├── _Base.cs                      +  serialização, auth, erro padrão
│   │   ├── navegacao.aspx  (+.cs)        +  canais, departamentos, categorias
│   │   ├── catalogo.aspx   (+.cs)        +  listagem com filtros e paginação
│   │   ├── produto.aspx    (+.cs)        +  detalhe do produto
│   │   ├── fornecedores.aspx (+.cs)      +  lista de fornecedores
│   │   ├── ofertas.aspx    (+.cs)        +  produtos em oferta
│   │   └── carrinho.aspx   (+.cs)        +  ler, adicionar, alterar, remover
│   │
│   ├── _ajax_busca.aspx                  =  já emite JSON, reutilizado direto
│   ├── ProdutoAjax.aspx                  =  intocado — fallback se a fachada falhar
│   ├── _ajax_carrinho_topo.aspx          =  intocado
│   ├── _salva_produto.aspx (~.cs)        ~  validação server-side (R-06)
│   ├── _modal_login.aspx                 =  intocado
│   │
│   ├── css/                              =  congelado — só a área logada consome
│   └── js/                               =  congelado
│
├── App_Themes/
│   └── novo/                             +  CSS do redesign para as .aspx
│       └── arguto.css                    +  build do Tailwind, arquivo único
│
├── Novo.master (+.cs)                    +  master page nova — convive com a antiga
├── Site.master                           =  intocada, permite rollback por página
│
├── Login/          (~.aspx)              ~  só markup; code-behind intocado
├── Carrinho/       (~.aspx)              ~  reskin; a versão Next.js assume depois
├── Checkout/       (~.aspx)              ~  só markup; code-behind intocado
├── MeusPedidos/    (~.aspx)              ~  só markup; code-behind intocado
├── MeusDados/      (~.aspx)              ~  só markup; code-behind intocado
│
├── content/produto/                      =  imagens intocadas, portal ADM inalterado
└── bin/                                  =  intocado
```

### 3.1 Regra da master page

**`Site.master` não é editada. Nunca.** Cria-se `Novo.master` e cada página
troca de master individualmente:

```aspx
<%@ Page MasterPageFile="~/Novo.master" ... %>
```

Voltar uma página ao visual antigo = trocar uma palavra e salvar. Mesmo
controle de rollback que o rewrite dá do lado do Next.js, aplicado ao lado
WebForms.

### 3.2 Regra do code-behind

**Nenhum arquivo `.aspx.cs` de página existente é alterado**, com uma única
exceção documentada: `_salva_produto.aspx.cs`, para corrigir R-06.

Nos reskins, os controles WebForms mantêm `ID` e `runat` idênticos:

```aspx
<!-- ANTES -->
<input name="ctl00$PH_Content$CPFCNPJLog" type="text"
       id="ctl00_PH_Content_CPFCNPJLog" class="form-control" />

<!-- DEPOIS — mesmo controle, nova aparência -->
<asp:TextBox ID="CPFCNPJLog" runat="server"
             CssClass="ag-field" autocomplete="username" inputmode="numeric" />
```

O `ID` é o que gera o `name` que o ViewState espera. Preservado o `ID`,
preservado o postback, preservada a regra.

### 3.3 A fachada, concretamente

Cada endpoint tem o mesmo formato. Exemplo de `catalogo.aspx.cs`:

```csharp
// v1/api/catalogo.aspx.cs
// Fachada JSON sobre o catálogo. NÃO contém regra de negócio.
// Chama o mesmo método de acesso a dados que ProdutoAjax.aspx já utiliza.

using System;
using System.Collections.Generic;
using System.Web;

public partial class v1_api_catalogo : ApiBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            // Entrada validada e normalizada antes de qualquer uso.
            string codDep  = Param.Codigo(Request.QueryString["dep"]);
            string codCat  = Param.Codigo(Request.QueryString["cat"]);
            string codSub  = Param.Codigo(Request.QueryString["sub"]);
            string codForn = Param.Codigo(Request.QueryString["fornecedor"]);
            int offset     = Param.Inteiro(Request.QueryString["offset"], 0, 0, 100000);
            int limite     = Param.Inteiro(Request.QueryString["limite"], 24, 1, 60);

            // >>> MESMA CHAMADA QUE ProdutoAjax.aspx JÁ FAZ HOJE <<<
            // Substituir pelo método real identificado no discovery.
            List<Produto> itens = CatalogoDAL.Listar(
                codDep, codCat, codSub, codForn, offset, limite);

            Ok(new {
                itens  = itens,
                offset = offset,
                limite = limite,
                fim    = itens.Count < limite
            });
        }
        catch (Exception ex)
        {
            Erro(ex);   // loga o detalhe, devolve mensagem genérica ao cliente
        }
    }
}
```

E o `ApiBase` compartilhado:

```csharp
// v1/api/_Base.cs
using System;
using System.Web;
using System.Web.UI;
using System.Web.Script.Serialization;   // nativo do .NET 4 — zero dependência nova

public abstract class ApiBase : Page
{
    protected void Ok(object dados)
    {
        Escrever(200, new { ok = true, dados = dados, erro = (string)null });
    }

    protected void Falha(int status, string mensagem)
    {
        Escrever(status, new { ok = false, dados = (object)null, erro = mensagem });
    }

    protected void Erro(Exception ex)
    {
        // Detalhe vai para o log do servidor; nunca para a resposta.
        System.Diagnostics.Trace.TraceError(ex.ToString());
        Falha(500, "Erro ao processar a requisicao.");
    }

    private void Escrever(int status, object payload)
    {
        Response.Clear();
        Response.TrySkipIisCustomErrors = true;
        Response.StatusCode  = status;
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(new JavaScriptSerializer().Serialize(payload));
        Response.End();
    }
}
```

Três propriedades que tornam isso seguro e reversível:

1. **Sem SQL.** A fachada nunca monta query. Ela chama método existente.
2. **Sem regra.** Preço, estoque, crédito e frete vêm prontos de quem já os calcula.
3. **Sem efeito colateral.** Apagar a pasta `/v1/api/` devolve o sistema ao
   estado exato de hoje.

### 3.4 Segurança da fachada

| Endpoint | Sessão exigida | Dado sensível |
|---|---|---|
| `navegacao` `catalogo` `produto` `fornecedores` `ofertas` | não | nenhum — já é público hoje |
| `carrinho` | **sim** | itens do cliente |
| campo `preco` em qualquer endpoint | **sim** | preço por cliente |

Regras aplicadas:

- Endpoint com sessão valida `ASP.NET_SessionId` + `010101_CCLIID` **antes** de
  qualquer acesso a dado. Sem sessão → HTTP 401, corpo genérico.
- `preco` só é serializado quando há cliente identificado. Sem sessão, o campo
  **não existe no JSON** — não vem nulo, não vem zero.
- Toda entrada passa por `Param.*` antes de qualquer uso. Sem concatenação
  em query.
- Erro nunca devolve stack trace, nome de tabela, nome de coluna ou mensagem
  do SQL Server. Detalhe vai para o log.
- A fachada não grava log de preço, CNPJ ou item de carrinho.
- `Cache-Control: no-store` em tudo que exige sessão.

### 3.5 A correção de R-06

Único code-behind existente alterado. `_salva_produto.aspx.cs`:

```csharp
// Validação que hoje existe apenas em JavaScript na página de produto.
// Move para o servidor. Sem alterar nenhuma regra — apenas passa a
// aplicar no servidor a mesma regra que a tela já declara.

int estoque  = ProdutoDAL.EstoqueDisponivel(codProduto);
int multiplo = ProdutoDAL.MultiploEmbalagem(codProduto);

if (qtd <= 0)                 { Falha("Quantidade invalida."); return; }
if (qtd > estoque)            { Falha("Quantidade indisponivel em estoque."); return; }
if (multiplo > 0
    && qtd % multiplo != 0)   { Falha("Quantidade deve ser multipla de " + multiplo + "."); return; }

// segue o fluxo existente, inalterado
```

Vale para as duas frentes: protege o site novo **e** o site atual, que continua
no ar durante todo o projeto.

---

## 4. Estrutura no Next.js

```
arguto-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    raiz: fontes, tema, skip-link, landmarks
│   │   ├── page.tsx                      home
│   │   ├── globals.css                   tokens + camadas Tailwind
│   │   ├── robots.ts                     hoje 404
│   │   ├── sitemap.ts                    hoje 404 — gerado do catálogo
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── produtos/
│   │   │   ├── [depSlug]/
│   │   │   │   ├── [codDep]/page.tsx                        /produtos/alimentos/000900/
│   │   │   │   └── [catSlug]/[codDep]/[codCat]/page.tsx     /produtos/alimentos/biscoitos/000900/000500/
│   │   │   └── fornecedor/[nome]/[cod]/page.tsx             /produtos/fornecedor/AYMORE/00032001/
│   │   │
│   │   ├── p/[slug]/[cod]/
│   │   │   ├── page.tsx                  página de produto
│   │   │   └── opengraph-image.tsx       OG dinâmico — hoje as tags estão vazias
│   │   │
│   │   ├── Canais/[canal]/[id]/page.tsx
│   │   ├── Fornecedores/
│   │   │   ├── page.tsx
│   │   │   └── [canal]/[id]/page.tsx
│   │   ├── Ofertas/page.tsx
│   │   ├── Busca/page.tsx                resultado completo — não existe hoje
│   │   ├── Carrinho/page.tsx             reconstruído, sem postback
│   │   │
│   │   ├── (institucional)/              layout compartilhado, 10 páginas
│   │   │   ├── layout.tsx
│   │   │   ├── ComoComprar/page.tsx
│   │   │   ├── RegrasFrete/page.tsx
│   │   │   ├── VendasCorporativas/page.tsx
│   │   │   ├── PrazosGarantias/page.tsx
│   │   │   ├── PrazoEntrega/page.tsx
│   │   │   ├── TrocasDevolucoes/page.tsx
│   │   │   ├── PoliticaDePrivacidade/page.tsx
│   │   │   ├── PoliticaDePagamento/page.tsx
│   │   │   ├── Faq/page.tsx
│   │   │   └── Contato/page.tsx
│   │   │
│   │   └── api/
│   │       ├── carrinho/route.ts         repassa sessão para a fachada
│   │       ├── busca/route.ts            autocomplete
│   │       └── revalidate/route.ts       invalidação por tag, token no header
│   │
│   ├── components/
│   │   ├── layout/                       Header · MegaMenu · MenuMobile · Footer · Breadcrumb
│   │   ├── produto/                      CardProduto · Galeria · FichaTecnica · SeletorQtd
│   │   │                                 · BadgeEstoque · Semelhantes · BotaoPreco
│   │   ├── catalogo/                     Grade · Ordenacao · Paginacao · FiltroLateral
│   │   │                                 · ChipsFiltro · EstadoVazio
│   │   ├── carrinho/                     ItemCarrinho · Resumo · MiniCarrinho · AvisoMultiplo
│   │   ├── busca/                        CampoBusca · Autocomplete · Sugestoes
│   │   ├── home/                         Hero · FaixaCanais · VitrineFornecedores
│   │   │                                 · DestaquesCategoria · Institucional
│   │   └── ui/                           Botao · Campo · Modal · Toast · Skeleton
│   │                                     · Tabs · Acordeao · Alerta
│   │
│   ├── lib/
│   │   ├── legado/                       ÚNICO ponto que fala com o IIS
│   │   │   ├── cliente.ts                fetch tipado, timeout, retry, propagação de cookie
│   │   │   ├── navegacao.ts
│   │   │   ├── catalogo.ts
│   │   │   ├── produto.ts
│   │   │   ├── busca.ts
│   │   │   ├── carrinho.ts
│   │   │   └── erros.ts
│   │   ├── schemas/                      Zod — o contrato com o legado, em código
│   │   ├── seo/                          jsonLd.ts · metadata.ts · breadcrumb.ts
│   │   ├── imagem.ts                     normaliza png/jpg/jfif e Trat_/Thumb_/T_
│   │   ├── url.ts                        slug e código ↔ rota, nos dois sentidos
│   │   └── formato.ts                    moeda, quantidade, múltiplo
│   │
│   ├── hooks/                            useCarrinho · useBuscaDebounce · useMediaQuery
│   └── styles/                           tokens.css · tipografia.css
│
├── tests/
│   ├── contrato/                         roda contra a fachada real — alarme de quebra
│   ├── unit/                             adaptadores, formatação, URL
│   └── e2e/                              jornadas Playwright, incluindo a fronteira
│
├── public/
├── next.config.ts                        rewrites, remotePatterns, headers
├── tailwind.config.ts
├── tsconfig.json                         strict
├── .env.example                          nenhum segredo versionado
├── vitest.config.ts
├── playwright.config.ts
└── README.md
```

### 4.1 Detalhes que decidem se funciona

**Maiúsculas nas pastas.** `Canais`, `Fornecedores`, `Ofertas`, `Carrinho`,
`Contato` — exatamente como estão em produção. O sistema de arquivos define a
URL, e as URLs são preservadas. Fica esteticamente estranho ao lado de
`produtos/` minúsculo. É o site atual que é inconsistente; preservar URL vale
mais que uniformidade de nome de pasta.

**Profundidades de rota não colidem.** `/produtos/*` tem três formas de 2, 3 e
4 segmentos. `fornecedor` é segmento estático e o Next resolve estático antes de
dinâmico. Sem ambiguidade.

**`lib/legado/` é a única porta.** Nenhum componente chama o IIS direto. Toda
resposta passa por Zod antes de virar objeto. Quando algo mudar do lado deles,
quebra em um lugar só, com erro nomeado, e o Sentry avisa.

### 4.2 `next.config.ts`

```ts
import type { NextConfig } from 'next';

const ORIGIN = process.env.LEGADO_ORIGIN!;   // https://origin.arguto.com.br

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'origin.arguto.com.br', pathname: '/content/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async rewrites() {
    return [
      // Rotas que permanecem no WebForms reskinado.
      { source: '/Login/:path*',       destination: `${ORIGIN}/Login/:path*` },
      { source: '/Cadastro/:path*',    destination: `${ORIGIN}/Cadastro/:path*` },
      { source: '/Checkout/:path*',    destination: `${ORIGIN}/Checkout/:path*` },
      { source: '/MeusPedidos/:path*', destination: `${ORIGIN}/MeusPedidos/:path*` },
      { source: '/MeusDados/:path*',   destination: `${ORIGIN}/MeusDados/:path*` },
      { source: '/content/:path*',     destination: `${ORIGIN}/content/:path*` },
      { source: '/v1/:path*',          destination: `${ORIGIN}/v1/:path*` },
    ];
  },

  async redirects() {
    return [
      { source: '/contato/', destination: '/Contato/', permanent: true },
    ];
  },
};

export default config;
```

Cada linha de `rewrites` é uma rota ainda no legado. **Migrar = apagar a linha.
Reverter = colocar de volta.** Deploy em ~40 segundos.

---

## 5. Fronteira Next.js ↔ WebForms

O usuário não pode perceber a travessia. Quatro exigências:

| Exigência | Como |
|---|---|
| Mesmo domínio | rewrite server-side; browser só vê `arguto.com.br` |
| Mesma sessão | cookies repassados como header; `SameSite=Lax` satisfeito |
| Mesmo visual | build do Tailwind gera **dois arquivos da mesma fonte**: um para o Next, outro para `App_Themes/novo/arguto.css` |
| Mesmo header e footer | `Novo.master` reproduz o markup do Header/Footer do Next; auditado a cada release |

O header e o footer existem duas vezes — em React e em `Novo.master`. É a
duplicação que o projeto aceita conscientemente. A alternativa (renderizar o
header do Next dentro do WebForms) custa mais do que vale e cria acoplamento em
runtime. Divergência visual é pega no QA de cada release.

---

## 6. O que fica onde

| Funcionalidade | Onde vive | Regra de negócio |
|---|---|---|
| Home, navegação, busca | Next.js | nenhuma |
| Listagem e produto | Next.js | nenhuma — dados da fachada |
| Ofertas, institucional | Next.js | nenhuma |
| **Carrinho** | **Next.js** | **executada pelo code-behind via fachada** |
| Login, Cadastro | WebForms reskinado | intocada |
| **Checkout e pedido** | **WebForms reskinado** | **intocada** |
| Meus Pedidos, Meus Dados | WebForms reskinado | intocada |

### Por que o carrinho muda de lado e o checkout não

**Carrinho vai.** Hoje, alterar a quantidade de um item recarrega a página
inteira com postback. Comprador B2B monta pedido com dezenas de itens — é onde
a dor é maior e mais frequente. As operações já são GETs simples; a fachada as
deixa limpas. Maior ganho de UX da área logada, com risco baixo.

**Checkout fica.** É onde o pedido é gravado no Protheus. O ganho de reconstruir
é cosmético; o custo de errar é financeiro. Reskinado, ele fica visualmente
idêntico ao resto do site, executando o mesmo código que executa hoje.

**A condição que poderia mudar isso:** se no discovery a gravação do pedido
estiver isolada em um método chamável (`GravaPedido(...)`) e não escrita dentro
do handler `BtFinalizar_Click`, o checkout **pode** migrar depois como adicional
de R$ 6.500. Se estiver inline no handler — o padrão mais comum nesse estilo de
código — expor exigiria refatorar lógica de negócio, e aí **não migra nunca**.
Isso é confirmado lendo o code-behind na semana 1.

---

## 7. Ordem de construção

| Fase | Constrói | Depende de |
|---|---|---|
| 1 | discovery + fachada `navegacao` e `catalogo` | acesso ao servidor |
| 2 | fundação Next.js + design system | — |
| 3 | adaptadores + Zod + testes de contrato | fase 1 |
| 4 | home | fases 2 e 3 |
| 5 | header, mega-menu, busca, footer | fase 4 |
| 6 | listagens (departamento, categoria, fornecedor) | fase 3 |
| 7 | fachada `produto` + página de produto | fase 3 |
| 8 | ofertas + institucional | fase 5 |
| 9 | `Novo.master` + CSS compartilhado | fase 5 |
| 10 | reskin Login, Cadastro, Checkout, MeusPedidos, MeusDados | fase 9 |
| 11 | fachada `carrinho` + correção R-06 + carrinho em Next.js | fases 3 e 10 |
| 12 | performance, SEO, acessibilidade | fases 4–11 |
| 13 | QA, rollout rota a rota, go-live | tudo |

A fachada é construída em pedaços, junto da tela que a consome. Nunca de uma
vez: endpoint sem consumidor não tem como ser validado.

---

## 8. Esforço

| # | Módulo | 01-ESCOPO | Este documento | Δ |
|---|---|---:|---:|---:|
| M0 | Discovery técnico | 16 | 14 | −2 |
| M1 | Fundação e design system | 20 | 20 | — |
| M2 | Fachada JSON + adaptadores | 26 | 32 | +6 |
| M3 | Vitrine pública | 66 | 66 | — |
| M4 | Institucional e ofertas | 14 | 14 | — |
| M5 | Área logada | 28 | 38 | +10 |
| M6 | Performance, SEO, acessibilidade | 22 | 22 | — |
| M7 | QA, rollout, entrega | 22 | 22 | — |
| | **Total** | **214** | **228** | **+14** |

Detalhe das duas diferenças:

**M2 +6 h** — escrever a fachada (~20 h) custa mais que escrever um parser
(~14 h), mas elimina R-02 e todo o custo de manutenção futuro.

**M5 +10 h** — carrinho em Next.js (12 h) no lugar de reskin (8 h), mais
`Novo.master` e a camada de continuidade visual (6 h).

### Investimento

| Configuração | Horas | Valor | Carrinho |
|---|---:|---:|---|
| **A** — conforme 01-ESCOPO | 214 | R$ 15.000 | reskin com postback |
| **B** — recomendada | 228 | **R$ 16.000** | reconstruído em Next.js |

R$ 70/h nas duas. **Recomendo B.** O carrinho é onde o comprador B2B passa mais
tempo, e recarregar a página a cada mudança de quantidade é o pior problema de
usabilidade que sobra no sistema. R$ 1.000 para resolver é a melhor relação
custo-benefício do escopo inteiro.

Marcos de pagamento, exclusões e tabela de adicionais: [01-ESCOPO §11](01-ESCOPO.md).

---

## 9. Cronograma

15 semanas, ~15 h/semana.

| Semana | Entrega |
|---|---|
| 1 | discovery, leitura do code-behind, decisão sobre o checkout |
| 2 | fundação e design system |
| 3 | fachada `navegacao` + `catalogo`, adaptadores, testes de contrato |
| 4 | home |
| 5 | header, mega-menu, busca, footer |
| 6 | listagens |
| 7 | fachada `produto` + página de produto |
| 8 | fornecedor, ofertas |
| 9 | institucional |
| 10 | `Novo.master` + CSS compartilhado + reskin Login/Cadastro |
| 11 | reskin Checkout, MeusPedidos, MeusDados |
| 12 | fachada `carrinho` + correção R-06 + carrinho em Next.js |
| 13 | performance, SEO, acessibilidade |
| 14 | QA, cross-browser, responsivo |
| 15 | rollout rota a rota, go-live, acompanhamento |

Marcos de aprovação: S1 discovery · S4 home em staging · S9 vitrine pública
completa · S12 jornada logada completa · S15 go-live.

---

## 10. Riscos que mudam neste cenário

| # | Risco | Antes | Agora |
|---|---|---|---|
| R-01 | Sem acesso ao código | média / alto | **eliminado** (premissa) |
| R-02 | Parser quebra quando mudam o HTML | média / médio | **eliminado** (fachada) |
| R-03 | ViewState não sobrevive ao proxy | baixa / alto | inalterado — validado na S1 |
| R-04 | Preço inacessível fora do render | média / médio | **reduzido** — a fachada expõe o campo com sessão |
| R-05 | Servidor deles cai | baixa / alto | inalterado — ISR com `stale-while-revalidate` |
| R-06 | Estoque validado só no client | alta / alto | **corrigido dentro do projeto** |
| R-07 | Escopo cresce | alta / alto | inalterado — tabela de adicionais assinada |
| R-08 | Latência do proxy | média / baixo | inalterado — medido na S1 |
| **R-09** | **Regra de negócio escondida em JavaScript legado** | — | **novo** |
| **R-10** | **Divergência visual entre header do Next e do `Novo.master`** | — | **novo** |

**R-09** — probabilidade média, impacto alto. Já há precedente comprovado: a
validação de estoque e múltiplo vive hoje **apenas** em JavaScript. Se houver
outras regras escondidas em `.js`, elas se perdem ao reescrever o frontend.
Mitigação: varredura completa dos arquivos `.js` na semana 1, com inventário
item a item. Está na [02-INVESTIGACAO §5.3](02-INVESTIGACAO.md).

**R-10** — probabilidade alta, impacto baixo. Header e footer existem em React
e em `Novo.master`. Mitigação: checklist de paridade visual no QA de cada
release; ambos consomem tokens do mesmo build de CSS.

---

## 11. Definição de pronto

Além dos critérios de [01-ESCOPO §12](01-ESCOPO.md):

- [ ] `/v1/api/` tem cobertura de teste de contrato em CI
- [ ] Apagar `/v1/api/` devolve o sistema ao comportamento atual — verificado
- [ ] Nenhum `.aspx.cs` de página existente alterado, exceto `_salva_produto.aspx.cs`
- [ ] Todo controle WebForms reskinado mantém `ID` original — auditado arquivo a arquivo
- [ ] `Site.master` intocada e funcional como rollback
- [ ] `_salva_produto.aspx` rejeita quantidade acima do estoque e fora do múltiplo — testado com `curl`
- [ ] Endpoint com sessão devolve 401 sem cookie válido — testado
- [ ] Campo `preco` ausente do JSON quando não há sessão — testado
- [ ] Header e footer visualmente idênticos nos dois lados da fronteira
- [ ] Inventário de regras encontradas em JavaScript legado, entregue por escrito
