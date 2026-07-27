# Auditoria do Frontend Legado — arguto.com.br

**Data da medição:** 26/07/2026
**Método:** requisição direta a produção (`curl`, `Accept-Encoding: identity`) +
inspeção de DOM renderizado via Playwright
**Escopo:** camada de apresentação apenas. Backend, Protheus e portal ADM não
foram auditados e não fazem parte deste documento.

---

## 0. Como ler

Cada recurso encontrado recebe uma classificação:

| Classe | Significado |
|---|---|
| **PRESERVAR** | funciona, tem valor, continua |
| **SUBSTITUIR** | a função é necessária, a implementação não |
| **REMOVER** | não faz nada de útil, sai sem substituto |
| **CONSOLIDAR** | duplicado — sobra um, o resto sai |
| **OTIMIZAR** | continua, mas com tratamento diferente |

Tudo classificado aqui é **frontend**. Nenhum item desta auditoria toca em
regra de negócio, integração ou Protheus.

---

## 1. Resumo executivo

| | |
|---|---|
| Peso da home | **24,17 MB** |
| Requisições | **118** |
| CSS + JS não comprimido | **1.089 KB** em **25 arquivos** |
| Desperdício puro em JS (removível sem perda de função) | **181 KB** |
| Cópias de jQuery carregadas | **3** |
| Cópias de Bootstrap | **2** |
| Cópias de Popper | **2** |
| Bibliotecas de carrossel simultâneas | **2** |
| Bibliotecas de menu simultâneas | **2** |
| Arquivos `*.debugger.js` em produção | **2** |
| Contêineres Google Tag | **3** |
| Imagens sem `alt` | **118 de 119** |
| Imagens com lazy loading | **0 de 119** |
| Tags `<h1>` | **0** |
| `robots.txt` | **HTTP 404** |
| `sitemap.xml` | **HTTP 404** |

**Nada nesta lista é culpa do backend.** Todos são defeitos da camada que este
projeto substitui.

---

## 2. JavaScript

Ordem real de carregamento na home, com tamanho medido sem compressão:

| # | Arquivo | Bytes | Classe | Motivo |
|---:|---|---:|---|---|
| 1 | `jquery-1.11.3.min.js` | 95.962 | **SUBSTITUIR** | JS nativo cobre 100% do uso real |
| 2 | `swiper-bundle.min.js` | 138.888 | **SUBSTITUIR** | CSS scroll-snap resolve os carrosséis |
| 3 | `jquery-3.4.1.slim.min.js` | 71.039 | **REMOVER** | carregado e imediatamente sobrescrito pelo item 6; nunca é usado |
| 4 | `bootstrap.bundle.min.js` | 80.933 | **SUBSTITUIR** | Radix cobre modal, dropdown e collapse |
| 5 | `popper.min.js` | 21.262 | **REMOVER** | já vem dentro do bundle do item 4 |
| 6 | `jquery-1.11.3.min.js` | — | **REMOVER** | segunda tag do mesmo arquivo; jQuery inicializa duas vezes |
| 7 | `jquery-migrate-1.2.1.min.js` | 7.200 | **REMOVER** | shim de compatibilidade de 2013; sem jQuery, não faz sentido |
| 8 | `jquery.mmenu.all.js` | 62.251 | **CONSOLIDAR** | duplicado do item 10 |
| 9 | `jquery.mmenu.debugger.js` | 16.455 | **REMOVER** | ferramenta de debug em produção |
| 10 | `bootstrap.min.js` | 60.050 | **REMOVER** | Bootstrap pela segunda vez; o bundle do item 4 já contém tudo |
| 11 | `jquery.xmenu.all.js` | 62.232 | **CONSOLIDAR** | duplicado do item 8 |
| 12 | `jquery.xmenu.debugger.js` | 16.455 | **REMOVER** | ferramenta de debug em produção |
| 13 | `slick.min.js` | 42.864 | **CONSOLIDAR** | segunda biblioteca de carrossel; Swiper já está carregado |
| 14 | `ruby-main.js` | 6.409 | **SUBSTITUIR** | **Ruby Mega Menu v1.0** — plugin jQuery comprado, não é código autoral |
| 15 | `easy-autocomplete.min.js` | 15.833 | **SUBSTITUIR** | vira Radix Combobox de ~2 KB sobre o mesmo endpoint |

**Total: 697.833 bytes ≈ 682 KB**

### 2.1 Desperdício puro

Itens que podem sair **hoje**, sem redesign, sem perda de nenhuma funcionalidade:

| Arquivo | Bytes | Por quê |
|---|---:|---|
| `jquery-3.4.1.slim.min.js` | 71.039 | sobrescrito antes de ser usado |
| `bootstrap.min.js` | 60.050 | duplicata do bundle |
| `popper.min.js` | 21.262 | já está dentro do bundle |
| `jquery.mmenu.debugger.js` | 16.455 | debug em produção |
| `jquery.xmenu.debugger.js` | 16.455 | debug em produção |
| | **185.261** | **≈ 181 KB** |

Isso é 181 KB baixados, parseados e executados por cada visitante, todo dia,
sem produzir absolutamente nada.

### 2.2 O bug de ordem de carregamento

```
linha 1580  jquery-1.11.3.min.js       → define window.$
linha 1582  jquery-3.4.1.slim.min.js   → sobrescreve window.$ com a versão slim
linha 1586  jquery-1.11.3.min.js       → sobrescreve de volta com 1.11.3
```

A versão *slim* do jQuery **não tem `$.ajax` nem `$.fn.load`**. Ou seja: se a
ordem de carregamento variar por qualquer motivo — rede lenta, cache parcial,
mudança de CDN — o autocomplete e o carrinho do topo param de funcionar, porque
ambos dependem de `.load()`.

O site está funcionando por coincidência da ordem de download.

### 2.3 Depois

| | Antes | Depois |
|---|---:|---:|
| Arquivos JS | 15 | ≤ 2 (chunks do Next) |
| Bytes não comprimidos | 682 KB | < 120 KB |
| Bibliotecas de terceiros | 9 | 1 (Radix, tree-shaken) |

---

## 3. CSS

| Arquivo | Bytes | Classe | Motivo |
|---|---:|---|---|
| `bootstrap.min.css` | 160.308 | **SUBSTITUIR** | framework inteiro para usar grid e alguns utilitários |
| `font-awesome.min.css` | 31.004 | **SUBSTITUIR** | fonte de ícones inteira; vira SVG inline só dos usados |
| `style.css` | 13.069 | **SUBSTITUIR** | migra para tokens |
| `arguto.css` | 1.351 | **SUBSTITUIR** | migra para tokens |
| `jquery.mmenu.all.css` | 62.222 | **CONSOLIDAR** | duplicado do próximo |
| `jquery.xmenu.all.css` | 75.280 | **CONSOLIDAR** | duplicado do anterior |
| `swiper-bundle.min.css` | 13.688 | **SUBSTITUIR** | scroll-snap nativo |
| `slick.css` | 1.856 | **REMOVER** | segunda lib de carrossel |
| `slick-theme.css` | 3.405 | **REMOVER** | segunda lib de carrossel |
| `ruby-main.css?v=2` | 19.968 | **SUBSTITUIR** | tema do site; vira design tokens |
| `easy-autocomplete.min.css` | 9.605 | **REMOVER** | some junto com a lib |

**Total: 391.756 bytes ≈ 383 KB em 11 arquivos**

**Depois:** 1 arquivo, < 60 KB, gerado pelo Tailwind com purge — só o CSS que a
página realmente usa.

### 3.1 Observação sobre menus

`mmenu` e `xmenu` somam **137 KB de CSS + 124 KB de JS = 261 KB** para um menu
lateral e um mega-menu. Ambos são resolvíveis com CSS moderno (`:has`,
`grid`, `popover`) e ~3 KB de JS. É o maior ganho isolado da auditoria.

---

## 4. Imagens

| Item | Medido | Classe | Tratamento |
|---|---|---|---|
| Peso total de imagens na home | **23,6 MB de 24,17 MB** | **OTIMIZAR** | `next/image`, AVIF/WebP |
| Banners principais | **1,17 MB cada, PNG** | **OTIMIZAR** | AVIF com fallback WebP → alvo < 120 KB |
| Banner desktop + mobile | **ambos baixados simultaneamente** | **OTIMIZAR** | `<picture>` com `media` — só um é baixado |
| Imagens com `alt` | **1 de 119** | **OTIMIZAR** | `alt` da descrição do portal ADM |
| Imagens com `loading="lazy"` | **0 de 119** | **OTIMIZAR** | lazy em tudo below-fold |
| Imagens com `width`/`height` | nenhuma nas listagens | **OTIMIZAR** | dimensões explícitas — mata o CLS |
| Arquivos em `/content/produto/` | — | **PRESERVAR** | ficam onde estão; o portal ADM continua gravando lá |

**Nenhum arquivo de imagem é movido, renomeado ou reprocessado no servidor
deles.** O `next/image` lê da origem atual via `remotePatterns` e serve
otimizado pelo CDN. O fluxo de upload do portal ADM não muda em nada.

### 4.1 Formatos encontrados no catálogo

`Trat_*.png`, `Trat_*.jpg`, `Trat_*.jfif`, `Thumb_*.png`, `T_*.jpg` —
convivendo na mesma listagem. **`.jfif` não é suportado por Safari antigo.**
Classe: **OTIMIZAR** — a normalização acontece na entrega, não no arquivo de
origem.

---

## 5. Fontes

| Recurso | Classe | Tratamento |
|---|---|---|
| Google Fonts — Lato, **18 variações** (`0,100;0,300;0,400;0,700;0,900;1,100;...`) | **OTIMIZAR** | `next/font` self-hosted, 2–3 pesos reais |
| Font Awesome 4.7.0 (fonte + CSS) | **SUBSTITUIR** | SVG inline apenas dos ícones usados |

Font Awesome 4.7.0 foi lançado em **outubro de 2016** e está sem manutenção. A
fonte inteira é baixada para exibir cerca de uma dúzia de ícones.

Carregar 18 variações de Lato de um CDN externo é render-blocking mais
resolução DNS de terceiro no caminho crítico do LCP.

---

## 6. Terceiros e analytics

| Recurso | Classe | Motivo |
|---|---|---|
| `gtag/js?id=G-XV1YMHHS5T` | **CONSOLIDAR** | primeira propriedade GA4 |
| `gtag/js?id=G-1XH1ZS571S` | **CONSOLIDAR** | segunda propriedade GA4 — mesmos eventos, dados divididos |
| `GTM-WMKFD6P` | **CONSOLIDAR** | terceiro contêiner; deve ser o único |
| Google Maps `<iframe>` embutido no footer | **OTIMIZAR** | carrega em toda página; vira imagem estática com link, ou lazy sob interação |
| `fonts.googleapis.com` | **OTIMIZAR** | self-host |

Três contêineres de tag significa que os dados de audiência estão divididos em
três lugares e provavelmente ninguém confia em nenhum deles. **Consolidar em um
GTM é decisão do marketing, não minha** — o documento aponta, eles decidem.

---

## 7. Rede, cache e compressão

| Item | Estado | Classe |
|---|---|---|
| Compressão gzip | **ativa** (bootstrap.min.css 160 KB → 20,7 KB) | **PRESERVAR** |
| Brotli | não confirmado | **OTIMIZAR** |
| `Cache-Control` em páginas | `private` | **OTIMIZAR** |
| CDN | ausente — tudo sai do IIS em Uberlândia | **OTIMIZAR** |
| HTTP/2 ou /3 | não confirmado | **OTIMIZAR** |
| Requisições totais | 118 | **OTIMIZAR** → < 40 |

Compressão funcionando é o único ponto genuinamente bom da auditoria. Fica
registrado.

O problema não é a compressão — é **o que** está sendo comprimido. 181 KB de
lixo comprimido continua sendo lixo.

---

## 8. HTML e semântica

| Item | Estado | Classe |
|---|---|---|
| Tags `<h1>` | **0** | **SUBSTITUIR** |
| `<meta name="description">` | vazia | **SUBSTITUIR** |
| Tags `og:*` | presentes, **todas vazias** | **SUBSTITUIR** |
| JSON-LD / dados estruturados | ausente | **SUBSTITUIR** (criar) |
| `robots.txt` | **404** | **SUBSTITUIR** (criar) |
| `sitemap.xml` | **404** | **SUBSTITUIR** (criar) |
| Landmarks ARIA | ausentes | **SUBSTITUIR** |
| Copyright no footer | **"© 2020"** | **SUBSTITUIR** |
| `/Contato/` e `/contato/` | ambas servidas | **CONSOLIDAR** (301) |
| Links mortos (`content.asp`, `contato.html`, `href=''`) | presentes | **REMOVER** |
| Estrutura de URL pública | funcional e semântica | **PRESERVAR** |
| Iframe para `_modal_login.aspx` | **SUBSTITUIR** | modal Radix consumindo o mesmo endpoint |

**Sobre o `sitemap.xml` 404:** milhares de páginas de produto existem, são
públicas, respondem 200, têm URL semântica — e o Google não tem como descobri-las
em escala. É catálogo inteiro invisível na busca. Esse é o item de maior retorno
comercial da auditoria inteira, e o custo de corrigir é uma rota gerada
automaticamente.

---

## 9. O que se preserva

Para não restar dúvida sobre o que **não** é tocado:

| Item | Classe |
|---|---|
| Estrutura de URLs públicas | **PRESERVAR** |
| Endpoint `_ajax_busca.aspx?format=json` | **PRESERVAR** |
| Endpoint `ProdutoAjax.aspx` | **PRESERVAR** |
| Endpoint `_salva_produto.aspx` | **PRESERVAR** |
| Endpoint `_ajax_carrinho_topo.aspx` | **PRESERVAR** |
| Cookies `010101_CCLIID` / `CCLICOD` / `CCAR` | **PRESERVAR** |
| Mecanismo de login e ViewState | **PRESERVAR** |
| Arquivos em `/content/produto/` | **PRESERVAR** |
| Hierarquia canal → dep → cat → subcat | **PRESERVAR** |
| Códigos de departamento, categoria, fornecedor | **PRESERVAR** |
| Compressão gzip | **PRESERVAR** |
| Portal ADM B2B | **PRESERVAR** |
| Protheus e toda a integração | **PRESERVAR** |

---

## 10. Achado de segurança — fora do escopo de redesign

**Severidade: alta. Existe hoje, independe deste projeto.**

A página de produto renderiza:

```js
var EST = 2910;   // estoque
var MUL = 4;      // múltiplo de embalagem
```

E valida no navegador:

```js
if (QTD > EST) { alert('Quantidade não disponível em estoque.'); return; }
if (QTD % MUL != 0) { alert('A quantidade deve ser multipla de 4.'); return; }
```

A gravação no carrinho é um GET direto:

```
GET /v1/_salva_produto.aspx?CodProduto=019563&Qtd=4
```

Qualquer pessoa pode chamar essa URL com qualquer quantidade, pulando as duas
validações. Se `_salva_produto.aspx` não revalidar no servidor — e não há
indício de que revalide — é possível inserir no carrinho quantidade acima do
estoque e fora do múltiplo de embalagem, que seguem para o pedido no Protheus.

**Recomendação:** validar estoque e múltiplo dentro de `_salva_produto.aspx`,
no servidor. Correção estimada em ~4 h.

Este item é comunicado ao cliente na primeira reunião, com ou sem contrato
assinado. Não é argumento de venda — é obrigação de quem encontrou.

---

## 11. Consolidado

| Categoria | Antes | Depois | Redução |
|---|---:|---:|---:|
| Arquivos JS | 15 | ≤ 2 | −87% |
| JS não comprimido | 682 KB | < 120 KB | −82% |
| Arquivos CSS | 11 | 1 | −91% |
| CSS não comprimido | 383 KB | < 60 KB | −84% |
| Bibliotecas de terceiros | 9 | 1 | −89% |
| Contêineres de tag | 3 | 1 | −67% |
| Peso total da home | 24,17 MB | < 1,5 MB | **−94%** |
| Requisições | 118 | < 40 | −66% |

Nenhuma dessas linhas exige uma única alteração no Protheus, no portal ADM, no
banco de dados ou em qualquer regra comercial.
