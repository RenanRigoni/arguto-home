# Escopo Técnico — Redesign do Frontend arguto.com.br

**Cliente:** LUFIR Comércio e Representação LTDA (Grupo Arguto) — Uberlândia/MG
**Projeto:** Redesign e modernização da camada de apresentação do e-commerce B2B
**Data:** julho/2026
**Versão:** 2.0 — substitui integralmente a versão 1.0
**Status:** proposta

---

## 0. O que mudou da v1.0 para esta versão

A versão anterior deste documento propunha reconstruir o e-commerce B2B: banco
PostgreSQL espelhando o catálogo, sincronizador Protheus → Postgres, APIs novas
de produto/preço/estoque, autenticação própria, integração nova de pedidos.

**Isso foi descartado.**

A premissa correta é: o motor funciona. O que está ruim é a carroceria.

```
ANTES (v1.0)   PROTHEUS → integração → backend → [NOVO BANCO] → [NOVA API] → novo site
AGORA (v2.0)   PROTHEUS → integração → backend → NOVO FRONTEND
```

Nada entre o Protheus e o backend muda. Nenhuma regra comercial é reescrita.
Nenhum funcionário muda de rotina. O que é substituído é exclusivamente a camada
que o cliente final enxerga — e ela é substituída porque é comprovadamente a
origem dos problemas de performance, SEO, acessibilidade e manutenção.

**Consequência direta:** o esforço caiu de 389h para **214h**, e o investimento
de R$ 73.400 para **R$ 15.000**.

---

## 1. Objetivo

Substituir HTML, CSS e JavaScript do site público e da área logada por uma
camada de apresentação moderna, consumindo os mesmos endpoints, as mesmas
regras comerciais e o mesmo backend que já estão em produção.

### Metas mensuráveis

| Métrica | Hoje (medido) | Meta |
|---|---:|---:|
| Peso da home | 24,17 MB | < 1,5 MB |
| Requisições da home | 118 | < 40 |
| Peso de CSS + JS (não comprimido) | 1.089 KB em 25 arquivos | < 180 KB em ≤ 4 arquivos |
| Cópias de jQuery carregadas | 3 | 0 |
| Cópias de Bootstrap carregadas | 2 | 0 |
| Bibliotecas de carrossel | 2 (Swiper + Slick) | 1 |
| Bibliotecas de menu | 2 (mmenu + xmenu) | 0 (CSS nativo) |
| Scripts `*.debugger.js` em produção | 2 | 0 |
| Contêineres Google Analytics/Tag | 3 | 1 |
| Imagens com `alt` | 1 de 119 | 100% |
| Imagens com lazy loading | 0 de 119 | 100% below-fold |
| `robots.txt` | HTTP 404 | 200 |
| `sitemap.xml` | HTTP 404 | 200, gerado do catálogo |
| Tags `<h1>` na home | 0 | 1 |
| LCP (4G, home) | não medido | < 2,5 s |
| INP | não medido | < 200 ms |
| CLS | não medido | < 0,1 |
| Acessibilidade | não avaliada | WCAG 2.2 AA |

Todas as métricas de "hoje" foram medidas diretamente contra produção em
26/07/2026. Evidência em [03-AUDITORIA-FRONTEND.md](03-AUDITORIA-FRONTEND.md).

---

## 2. Descobertas da investigação técnica

Antes de propor arquitetura, o sistema atual foi investigado por requisição
direta. Estes são os fatos que sustentam todo o resto do documento.

### 2.1 Já existe endpoint JSON no sistema

```
GET /v1/_ajax_busca.aspx?Palavra=biscoito&format=json
```

Retorna JSON real:

```json
[
  {"Foto":"/content/produto/010101/019030/Trat_22082022_105524.png",
   "Produto":"BISCOITO  AYMORÉ MARIA 185G",
   "Link":"/p/BISCOITO--AYMOR-MARIA-185G/019030/",
   "LinhaDiv":"0"}
]
```

**Por que isso importa:** prova que o desenvolvedor do sistema atual já sabe
emitir JSON e já fez isso em produção. Pedir o mesmo em outra página não é
arquitetura nova — é repetir um padrão que já existe na casa.

### 2.2 A listagem de produtos é paginada e pública

```
GET /v1/ProdutoAjax.aspx?Offset=0&CodDepartamento=000900&CodCategoria=000500
```

HTTP 200 sem autenticação. Retorna fragmento HTML com produto, foto, link e
descrição do portal ADM. `&format=json` é **ignorado** nessa página — só
funciona em `_ajax_busca.aspx`.

### 2.3 Adicionar ao carrinho é GET simples, sem ViewState

```
GET /v1/_salva_produto.aspx?CodProduto=019563&Qtd=4
```

Resposta (HTTP 200):

```html
<script>
    parent.CarrinhoTopo();
    $('#MostraPainelCarrinho').fadeIn(200);
    setTimeout(function () {
        $("#MostraPainelCarrinho").removeAttr("style");
        parent.history.back();
    }, 3000);
</script>
```

Sessão via cookie. **Nenhum dado de status é retornado** — nem sucesso, nem
erro, nem o novo total do carrinho. A resposta é um script desenhado para ser
injetado num iframe.

### 2.4 Estoque e múltiplo de embalagem vêm renderizados na página

Da página de produto `019563`:

```js
var EST = 2910;   // estoque
var MUL = 4;      // múltiplo de embalagem
```

A validação de estoque e múltiplo é **exclusivamente client-side**. Um `curl`
direto no `_salva_produto.aspx` ignora as duas regras. Ver seção 9, risco R-06.

### 2.5 Login usa postback WebForms com ViewState

`/Login/` posta para si mesma com:

| Campo | Tipo |
|---|---|
| `__VIEWSTATE` | hidden, gerado por request |
| `__VIEWSTATEGENERATOR` | hidden |
| `__EVENTVALIDATION` | hidden, gerado por request |
| `ctl00$PH_Content$CPFCNPJLog` | texto |
| `ctl00$PH_Content$SenhaLog` | password |
| `ctl00$PH_Content$BtLog` | submit |

Esse é o mecanismo mais hostil à reutilização externa de todo o sistema, e é o
que determina a fronteira arquitetural da seção 4.

### 2.6 Identidade e carrinho vivem em cookies simples

O servidor responde com quatro cookies:

```
Set-Cookie: ASP.NET_SessionId=y1jx1seh25mee5pl5kfxuom0; path=/; HttpOnly; SameSite=Lax
Set-Cookie: 010101_CCLIID=; expires=...; path=/
Set-Cookie: 010101_CCLICOD=; expires=...; path=/
Set-Cookie: 010101_CCAR=; expires=...; path=/
```

`ASP.NET_SessionId` = sessão do framework · `CCLIID` = ID do cliente ·
`CCLICOD` = código do cliente · `CCAR` = carrinho. Prefixo `010101` = empresa 01
+ filial 01 do Protheus. Todos com escopo `path=/` em `arguto.com.br`.

**Por que isso importa:** cookies com `path=/` no domínio raiz fluem para
qualquer coisa servida nesse domínio. Isso é o que torna a arquitetura da
seção 4 possível sem tocar em autenticação.

**`SameSite=Lax` fecha uma porta.** Servir a área logada em subdomínio ou
domínio separado quebraria o login — o cookie de sessão não acompanharia a
navegação. A convivência tem que ser sob o mesmo domínio, via rewrite
server-side (§4.5). Não é preferência de arquitetura; é o que o cookie permite.

### 2.7 Mapa de rotas de produção

| Rota | Natureza |
|---|---|
| `/` | pública |
| `/produtos/{dep-slug}/{codDep}/` | pública — departamento |
| `/produtos/{dep-slug}/{cat-slug}/{codDep}/{codCat}/` | pública — categoria |
| `/produtos/fornecedor/{NOME}/{codForn+loja}/` | pública — fornecedor |
| `/p/{slug}/{codProduto}/` | pública — produto |
| `/Fornecedores/` · `/Fornecedores/{canal}/{id}/` | pública |
| `/Canais/{canal-slug}/{id}/` | pública (varejo-alimentar=1, farma=3) |
| `/Ofertas/` | pública |
| `/ComoComprar/` `/RegrasFrete/` `/VendasCorporativas/` `/PrazosGarantias/` `/Faq/` `/PoliticaDePrivacidade/` `/PoliticaDePagamento/` `/PrazoEntrega/` `/TrocasDevolucoes/` `/Contato/` | institucional |
| `/Login/` | autenticada — ViewState |
| `/Carrinho/` | autenticada |
| `/MeusPedidos/` | autenticada |
| `/MeusDados/` | autenticada |

Códigos observados: departamentos `000900` ALIMENTOS, `000901` BAZAR, `000902`
BEBIDAS, `000903` CUIDADOS PESSOAIS, `000904` LIMPEZA, `000905` PET.
Fornecedor `00032001` = `A2_COD` (000320) + `A2_LOJA` (01).

**Defeito encontrado:** existem `/Contato/` e `/contato/` no mesmo HTML. IIS
serve os dois. Duplicação de URL — corrigir com 301 no redesign.

---

## 3. Classificação: preservado, novo, adaptado

### 3.1 EXISTENTE E PRESERVADO — não se toca

| Item | Observação |
|---|---|
| Protheus | fonte da verdade, zero alteração |
| Portal ADM B2B | zero alteração, mesma rotina de cadastro |
| Integração Protheus ↔ backend | zero alteração |
| Banco de dados atual | zero alteração de schema |
| Regra de preço por cliente | reutilizada como está |
| Regra de estoque | reutilizada como está |
| Autenticação e sessão | reutilizada como está |
| Regra de crédito / bloqueio | reutilizada como está |
| Regra de frete | reutilizada como está |
| Pedido mínimo e múltiplo de embalagem | reutilizada como está |
| Gravação de pedido no Protheus | zero alteração |
| Consulta de Meus Pedidos | zero alteração |
| Cookies de sessão e carrinho | reutilizados como estão |
| Estrutura de URLs públicas | **preservada**, ver seção 6 |
| Arquivos de imagem em `/content/produto/` | preservados no lugar |
| Servidor IIS / Plesk | permanece no ar |

**Nenhum item desta tabela entra no orçamento.** Nenhum funcionário é
treinado novamente para nenhum deles.

### 3.2 NOVO / REDESENHADO — o escopo do projeto

| Item | Tratamento |
|---|---|
| HTML de todas as páginas públicas | reescrito |
| CSS | reescrito do zero, Tailwind v4 |
| JavaScript | reescrito, sem jQuery |
| Sistema de design (tokens, tipografia, componentes) | novo |
| Home | redesign completo |
| Header, busca, mega-menu | redesign completo |
| Listagem de departamento / categoria / fornecedor | redesign completo |
| Página de produto | redesign completo |
| Ofertas | redesign completo |
| 10 páginas institucionais | redesign completo |
| Login e Cadastro | reskin (seção 4.3) |
| Carrinho e Checkout | reskin (seção 4.3) |
| Meus Pedidos e Meus Dados | reskin (seção 4.3) |
| Responsividade | reconstruída |
| Pipeline de imagens | novo |
| `robots.txt`, `sitemap.xml`, JSON-LD, metadados | novos |
| Acessibilidade WCAG 2.2 AA | nova |

### 3.3 ADAPTAÇÃO MÍNIMA NECESSÁRIA — negociada no discovery

Só existem **três** pedidos ao time deles, e nenhum toca em regra de negócio.
Todos têm alternativa caso sejam recusados.

| # | Pedido | Esforço deles | Se recusarem |
|---|---|---|---|
| A-01 | `&format=json` em `ProdutoAjax.aspx`, no mesmo padrão que já existe em `_ajax_busca.aspx` | ~2–4 h | parser de HTML no adaptador (+10 h no meu lado, mais frágil) |
| A-02 | `_salva_produto.aspx` retornar `{"ok":true,"itens":N,"erro":null}` quando receber `&format=json` | ~2–4 h | ler o carrinho logo depois e inferir o resultado (+6 h, pior UX) |
| A-03 | Validar estoque e múltiplo **no servidor** dentro de `_salva_produto.aspx` | ~4 h | não há alternativa — ver risco R-06 |

**A-03 não é capricho de arquitetura.** Hoje a única barreira contra um pedido
com quantidade inválida é um `if` em JavaScript. É uma correção de segurança que
o site atual já precisa, independente deste projeto. Vai no relatório mesmo que
o redesign não seja contratado.

Nada além disso é pedido. Sem banco novo. Sem sincronizador. Sem API de preço.
Sem API de estoque. Sem autenticação nova. Sem CMS. Sem portal novo.

---

## 4. Arquitetura

### 4.1 Princípio

O sistema é dividido pela linha que já existe nele: **o que tem sessão e o que
não tem.**

| | Público (sem sessão) | Autenticado (com sessão) |
|---|---|---|
| Valor de SEO | 100% | 0% |
| Responsável pelos 24 MB | sim | parcial |
| Onde mora o risco financeiro | nenhum | preço, crédito, pedido, Protheus |
| Mecânica | GET simples, dados já expostos | postback ViewState |
| **Tratamento** | **reconstrução completa** | **reskin no lugar** |

A parte cara e arriscada de reconstruir é justamente a que ninguém vê no Google
e que só clientes já cadastrados acessam. Ela recebe o tratamento barato. A
parte que define a impressão de qualidade, que carrega os 24 MB e que responde
por todo o SEO recebe o tratamento completo.

Isso é o que faz o projeto caber em R$ 15.000 sem virar gambiarra.

### 4.2 Superfície pública — reconstrução

```
Navegador
   │
   ▼
Next.js (Vercel)  ── rotas /, /produtos/*, /p/*, /Ofertas/, institucionais
   │
   │  adaptadores server-side (sem regra de negócio)
   ▼
IIS existente ── _ajax_busca.aspx · ProdutoAjax.aspx · páginas /p/ e /produtos/
   │
   ▼
backend atual → integração atual → PROTHEUS
```

O Next.js **não tem banco de dados**. Ele lê do sistema existente, formata e
renderiza. Cache HTTP com `revalidate` do próprio Next, sem persistência.

Os adaptadores são funções puras de tradução: recebem HTML ou JSON do legado,
devolvem objeto tipado. Zero regra comercial dentro deles. Se o legado disser
que o preço é R$ 12,40, o adaptador devolve R$ 12,40 — ele não sabe calcular
preço e nunca vai saber.

### 4.3 Superfície autenticada — reskin no lugar

```
Navegador
   │
   ▼
Next.js rewrite (proxy transparente, mesmo domínio)
   │
   ▼
IIS existente ── /Login/ /Carrinho/ /MeusPedidos/ /MeusDados/
                 mesmas .aspx, mesmo code-behind, mesmo ViewState
                 markup e CSS substituídos
```

As páginas `.aspx` continuam sendo as mesmas, executando o mesmo code-behind.
O que muda é o HTML que elas emitem e a folha de estilo que as veste. Os
controles WebForms (`ctl00$PH_Content$...`) mantêm os mesmos IDs e nomes — é
isso que garante que o ViewState continua funcionando e que nenhuma regra de
carrinho, crédito ou frete é tocada.

**Por que proxy e não domínio separado:** os cookies `010101_CCLIID`,
`010101_CCLICOD` e `010101_CCAR` têm `path=/` em `arguto.com.br`. Servindo tudo
sob o mesmo domínio via rewrite, eles fluem sem nenhuma alteração de
autenticação. O cliente navega do catálogo novo para o carrinho antigo e a
sessão simplesmente continua.

### 4.4 Por que essa arquitetura e não outra

| Alternativa | Por que foi descartada |
|---|---|
| Banco espelho + sincronizador (v1.0) | duplica o catálogo, cria divergência com o Protheus, e o problema real nunca foi o backend |
| Next.js reconstruindo também o checkout | replicar postback ViewState externamente é frágil e coloca o pedido — a parte que dá dinheiro — na parte mais nova do sistema |
| Reskin puro, tudo dentro do WebForms | mais barato ainda, mas trava o cliente no WebForms para sempre e não resolve bem imagem, ISR e Core Web Vitals |
| SPA client-side pura | sem SSR, o catálogo continua invisível no Google — perde o principal ganho comercial |

### 4.5 Estratégia de corte (rollout)

O rewrite é por rota. Cada rota migrada é uma linha de configuração; cada rota
não migrada continua sendo servida pelo IIS como hoje.

```js
// next.config.ts — rotas ainda no legado
async rewrites() {
  return [
    { source: '/Login/:path*',       destination: 'https://origin.arguto.com.br/Login/:path*' },
    { source: '/Carrinho/:path*',    destination: 'https://origin.arguto.com.br/Carrinho/:path*' },
    { source: '/MeusPedidos/:path*', destination: 'https://origin.arguto.com.br/MeusPedidos/:path*' },
    { source: '/MeusDados/:path*',   destination: 'https://origin.arguto.com.br/MeusDados/:path*' },
    { source: '/content/:path*',     destination: 'https://origin.arguto.com.br/content/:path*' },
  ];
}
```

Consequência prática: **rollback de qualquer página é uma linha de código e um
deploy de 40 segundos.** Se a nova página de produto der problema numa
sexta-feira, ela volta a ser a antiga antes de alguém reclamar. É esse controle
que torna o risco do projeto aceitável no preço proposto.

---

## 5. Stack

| Camada | Escolha | Justificativa |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/ISR resolve o SEO que o site não tem; rewrites resolvem a convivência com o legado |
| Linguagem | TypeScript (strict) | o contrato com o legado é frágil; tipagem é onde a quebra aparece cedo |
| Estilo | Tailwind CSS v4 + tokens CSS | um arquivo compilado no lugar de 11; o mesmo CSS veste as `.aspx` reskinadas |
| Componentes | Radix UI primitives | acessibilidade de teclado e ARIA sem escrever do zero |
| Validação | Zod | valida o que volta do legado antes de renderizar |
| Imagem | `next/image` + `remotePatterns` | otimiza os PNGs onde eles já estão, sem migrar arquivo nem mudar o portal ADM |
| Testes | Vitest (adaptadores) + Playwright (E2E) | teste de contrato avisa quando o legado muda |
| Erros | Sentry | quebra de contrato do legado precisa aparecer antes do cliente ligar |
| Hospedagem | Vercel | rewrites nativos, ISR, CDN de imagem — os três pilares dessa arquitetura |

### Fora da stack, por decisão

jQuery · Bootstrap · Popper · Slick · mmenu · xmenu · easy-autocomplete ·
biblioteca de estado global · banco de dados · ORM · CMS · sincronizador ·
serviço de busca externo.

O autocomplete atual (`easy-autocomplete`, 15,8 KB + 9,6 KB de CSS + jQuery)
vira um componente Radix Combobox de ~2 KB consumindo o mesmo
`_ajax_busca.aspx?format=json` que já existe.

---

## 6. URLs

**Todas as URLs públicas são preservadas byte a byte.** Não há migração de URL,
não há perda de indexação, não há redirect em massa.

| Rota | Ação |
|---|---|
| `/produtos/{dep}/{cod}/` | preservada |
| `/produtos/{dep}/{cat}/{codDep}/{codCat}/` | preservada |
| `/produtos/fornecedor/{NOME}/{cod}/` | preservada |
| `/p/{slug}/{cod}/` | preservada |
| `/Canais/{slug}/{id}/` · `/Fornecedores/*` · `/Ofertas/` | preservadas |
| institucionais | preservadas |
| `/Login/` `/Carrinho/` `/MeusPedidos/` `/MeusDados/` | preservadas (proxy) |

Redirects 301 criados — apenas correções de defeito existente:

| De | Para | Motivo |
|---|---|---|
| `/contato/` | `/Contato/` | duplicação de URL hoje em produção |
| `/produtos/{dep}/{cod}` (sem barra final) | `/produtos/{dep}/{cod}/` | ambas as formas coexistem no HTML atual |

Novos, hoje inexistentes: `robots.txt`, `sitemap.xml` (gerado do catálogo,
todas as páginas de produto ativas), `sitemap-index.xml`.

---

## 7. Módulos e esforço

| # | Módulo | Horas |
|---|---|---:|
| M0 | Discovery técnico com acesso autenticado | 16 |
| M1 | Fundação e sistema de design | 20 |
| M2 | Camada de adaptadores do legado | 26 |
| M3 | Vitrine pública | 66 |
| M4 | Institucional e ofertas | 14 |
| M5 | Reskin da área autenticada | 28 |
| M6 | Performance, SEO e acessibilidade | 22 |
| M7 | QA, rollout e entrega | 22 |
| | **Total** | **214** |

### M0 — Discovery técnico (16 h)

Único módulo que exige coisa deles: **uma credencial de cliente de teste**.

- Auditoria de rede da jornada logada completa: login → catálogo com preço →
  carrinho → checkout → pedido → Meus Pedidos
- Mapear campos ViewState de `/Carrinho/`, `/MeusDados/`, cadastro
- Confirmar como o preço por cliente chega na listagem e na página de produto
- Confirmar comportamento de crédito bloqueado, estoque zero, pedido mínimo
- Confirmar acesso ao código-fonte das `.aspx` (requisito de M5)
- Fechar as três adaptações da seção 3.3

**Entregável:** mapa de rotas e contratos + decisão assinada sobre A-01, A-02,
A-03. Detalhe em [02-INVESTIGACAO.md](02-INVESTIGACAO.md).

### M1 — Fundação e sistema de design (20 h)

- Next.js 15 + TypeScript strict + Tailwind v4
- Tokens: cor, tipografia, espaçamento, elevação, motion
- Componentes base: botão, input, card de produto, breadcrumb, paginação,
  modal, toast, skeleton
- Configuração de rewrites e ambiente de staging
- Pipeline de deploy, preview por branch

### M2 — Camada de adaptadores (26 h)

| Adaptador | Fonte |
|---|---|
| `buscarProdutos(filtros, offset)` | `ProdutoAjax.aspx` |
| `buscarProduto(cod)` | página `/p/{slug}/{cod}/` |
| `buscaRapida(termo)` | `_ajax_busca.aspx?format=json` |
| `arvoreNavegacao()` | menu da home |
| `listarFornecedores(canal?)` | `/Fornecedores/` |
| `resumoCarrinho(cookies)` | `_ajax_carrinho_topo.aspx` |
| `adicionarAoCarrinho(cod, qtd, cookies)` | `_salva_produto.aspx` |

Inclui: validação Zod na saída, cache/revalidação, propagação de cookie de
sessão e **suíte de testes de contrato**. Os testes de contrato rodam contra
produção e falham quando o time deles mexe no ASP.NET — é o sistema de alarme
que impede o site novo de quebrar silenciosamente.

Se A-01 for aprovado, este módulo cai ~10 h.

### M3 — Vitrine pública (66 h)

| Tela | Horas |
|---|---:|
| Home | 16 |
| Header, busca com autocomplete, mega-menu, footer | 16 |
| Listagem: departamento, categoria, subcategoria, paginação, ordenação | 14 |
| Fornecedor e índice de fornecedores | 8 |
| Página de produto | 12 |

### M4 — Institucional e ofertas (14 h)

Ofertas + 10 páginas institucionais sobre layout compartilhado + formulário de
contato + newsletter (mantendo o endpoint atual).

### M5 — Reskin da área autenticada (28 h)

| Tela | Horas |
|---|---:|
| Login e Cadastro | 6 |
| Carrinho | 8 |
| Checkout | 8 |
| Meus Pedidos | 3 |
| Meus Dados | 3 |

Substituição de markup e CSS dentro das `.aspx` existentes. **Nenhuma linha de
code-behind é alterada.** IDs e nomes dos controles WebForms preservados.

**Pré-requisito:** acesso ao código-fonte das `.aspx` e à publicação no IIS. Se
não houver, ver seção 9, risco R-01.

### M6 — Performance, SEO e acessibilidade (22 h)

- `next/image` em todo o catálogo, AVIF/WebP, dimensões explícitas, lazy
  below-fold, `fetchpriority=high` só no LCP
- Banners: substituir os PNG de 1,17 MB carregados em dobro (desktop + mobile
  simultâneos) por `<picture>` com fonte única por breakpoint
- `alt` em 100% das imagens, vindo da descrição do portal ADM
- `robots.txt` + `sitemap.xml` dinâmico
- JSON-LD: Product, BreadcrumbList, Organization
- Metadados e Open Graph por rota (hoje todas as tags `og:` estão vazias)
- Consolidação de 3 contêineres Google Tag em 1
- WCAG 2.2 AA: contraste, foco visível, navegação por teclado, landmarks,
  `prefers-reduced-motion`
- Iteração até bater as metas da seção 1

### M7 — QA, rollout e entrega (22 h)

- E2E Playwright dos fluxos críticos, incluindo a fronteira novo→legado
- Cross-browser: Chrome, Firefox, Safari, Edge
- Responsivo: 320, 375, 768, 1024, 1440, 1920
- Rollout rota a rota com rollback de uma linha
- Runbook operacional + treinamento (o portal ADM não muda, mas o time precisa
  saber o que passou a ser gerado sozinho)
- 15 dias de acompanhamento pós-go-live

---

## 8. Cronograma

14 semanas, ~15 h/semana.

| Semana | Entrega |
|---|---|
| 1 | M0 — discovery, credencial de teste, decisão sobre adaptações |
| 2 | M1 — fundação e design system |
| 3–4 | M2 — adaptadores + testes de contrato |
| 5 | M3 — home |
| 6 | M3 — header, busca, navegação |
| 7 | M3 — listagens |
| 8 | M3 — fornecedor + produto |
| 9 | M4 — institucional e ofertas |
| 10–11 | M5 — reskin da área autenticada |
| 12 | M6 — performance, SEO, acessibilidade |
| 13 | M7 — QA e correções |
| 14 | M7 — rollout e go-live |

**Marcos de aprovação:** fim da semana 1 (discovery), fim da semana 5 (home
navegável em staging), fim da semana 8 (vitrine pública completa), fim da
semana 11 (jornada logada completa), semana 14 (go-live).

---

## 9. Riscos

| # | Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|---|
| R-01 | Sem acesso ao código das `.aspx` (fornecedor externo detém) | média | alto | M5 vira injeção de CSS/JS via master page, ou é cortado do escopo com redução de R$ 2.000 |
| R-02 | Time deles altera o HTML do `ProdutoAjax.aspx` e quebra o parser | média | médio | testes de contrato em CI diário; A-01 elimina o risco na origem |
| R-03 | ViewState não sobrevive ao proxy do Vercel | baixa | alto | validado na semana 1; plano B é reverse proxy no IIS deles, sem Vercel na rota autenticada |
| R-04 | Preço por cliente não é acessível fora do render da página | média | médio | mantém a listagem com preço dentro do legado reskinado; catálogo público segue sem preço, como já é hoje |
| R-05 | Servidor deles cai e derruba a vitrine junto | baixa | alto | ISR com `stale-while-revalidate` — a última versão renderizada continua servindo |
| R-06 | **Estoque e múltiplo validados só no client** | **alta** | **alto** | A-03; **já é vulnerabilidade em produção hoje**, reportada independente do projeto |
| R-07 | Escopo cresce durante a execução | alta | alto | tabela de adicionais assinada junto do contrato; nada entra sem aditivo |
| R-08 | Latência extra do proxy na área logada | média | baixo | medida na semana 1; se passar de 150 ms, rota fica direto no IIS |

---

## 10. Segurança

- Nenhum segredo em repositório. Token de acesso ao legado, se houver, em
  variável de ambiente.
- Todo tráfego entre Next.js e IIS por HTTPS/TLS 1.2+.
- Cookies de sessão apenas repassados, nunca lidos, gravados ou persistidos.
- Nenhum dado de cliente, preço ou pedido armazenado fora do sistema atual.
- Validação Zod em toda resposta do legado antes de renderizar.
- Headers de segurança: HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, CSP com nonce.
- **R-06 é reportado formalmente ao cliente na semana 1**, com ou sem contrato
  assinado para o restante.

---

## 11. Investimento

**R$ 15.000** — 214 horas.

| Marco | % | Valor |
|---|---:|---:|
| Assinatura + início do discovery | 30% | R$ 4.500 |
| Vitrine pública aprovada em staging (fim S8) | 30% | R$ 4.500 |
| Jornada logada aprovada em staging (fim S11) | 20% | R$ 3.000 |
| Go-live | 20% | R$ 3.000 |

### O que não está incluído

Migração de conteúdo institucional (textos vêm do site atual como estão) ·
produção de fotografia · redação publicitária · novo logotipo ou identidade
visual · integração com marketplace, ERP adicional ou gateway de pagamento ·
app mobile · alteração de qualquer regra de negócio · hospedagem (Vercel Pro,
~US$ 20/mês, contratado por eles).

### Adicionais, se pedidos

| Item | Valor |
|---|---:|
| Reconstrução completa do checkout em Next.js (fora do reskin) | R$ 6.500 |
| Filtros facetados na listagem (marca, preço, atributo) | R$ 2.800 |
| Lista de compra recorrente / recompra rápida | R$ 3.200 |
| Área de representante comercial | R$ 4.500 |
| Blog / central de conteúdo com CMS | R$ 3.800 |
| Redação de conteúdo institucional | R$ 1.800 |
| Manutenção evolutiva | R$ 1.200/mês |

---

## 12. Critérios de aceite

Técnicos:

- [ ] Home < 1,5 MB e < 40 requisições
- [ ] CSS + JS < 180 KB em no máximo 4 arquivos
- [ ] Zero jQuery, Bootstrap, Popper, Slick, mmenu, xmenu no bundle
- [ ] Zero arquivo `*.debugger.js` em produção
- [ ] LCP < 2,5 s · INP < 200 ms · CLS < 0,1 em 4G simulado
- [ ] Lighthouse ≥ 90 em Performance, Acessibilidade, SEO e Best Practices
- [ ] 100% das imagens com `alt` e dimensões explícitas
- [ ] `robots.txt` e `sitemap.xml` respondendo 200
- [ ] JSON-LD válido no Rich Results Test
- [ ] Zero erro axe-core de severidade crítica ou séria
- [ ] Navegação completa por teclado em todos os fluxos
- [ ] Todas as URLs públicas atuais respondendo 200 na nova stack

Funcionais:

- [ ] Todo produto visível hoje continua visível
- [ ] Hierarquia canal → departamento → categoria → subcategoria idêntica
- [ ] Fornecedor e grupo filtram como hoje
- [ ] Descrição do portal ADM aparece corretamente
- [ ] Login autentica o mesmo cliente que autentica hoje
- [ ] Preço exibido é idêntico ao do site atual para o mesmo cliente
- [ ] Estoque e múltiplo de embalagem respeitados
- [ ] Pedido gravado no Protheus com os mesmos campos
- [ ] Meus Pedidos lista os mesmos pedidos
- [ ] Portal ADM continua funcionando sem nenhuma alteração
- [ ] Nenhum funcionário mudou de rotina

---

## 13. Documentos relacionados

| Documento | Conteúdo |
|---|---|
| [02-INVESTIGACAO.md](02-INVESTIGACAO.md) | roteiro do discovery: o que investigar no código e na rede antes de escrever qualquer linha |
| [03-AUDITORIA-FRONTEND.md](03-AUDITORIA-FRONTEND.md) | inventário do frontend legado classificado em preservar / substituir / remover / consolidar / otimizar |
