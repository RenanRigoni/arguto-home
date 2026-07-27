# Auditoria técnica — arguto.com.br (site atual)

**Data da coleta:** 27/07/2026
**Alvo:** `https://arguto.com.br/` — páginas públicas + home autenticada
**Método:** Google Lighthouse 12.8.2 (mesmo motor do PageSpeed Insights), Chromium/Playwright e requisições HTTP diretas. Viewports 320 → 1920 px.
**Autor:** Renan Rigoni

> Material de reunião. Cada afirmação tem **evidência medida e reproduzível**. O que não pôde ser confirmado — e o que eu mesmo derrubei ao reverificar — está na seção [Limitações](#16-limitações-e-correções-de-rigor).

**Benchmark público de referência (rodado pelo cliente):**
- [PageSpeed — mobile](https://pagespeed.web.dev/analysis/https-arguto-com-br/2ks1p4bfzo?hl=pt-br&form_factor=mobile)
- [PageSpeed — desktop](https://pagespeed.web.dev/analysis/https-arguto-com-br/2ks1p4bfzo?hl=pt-br&form_factor=desktop)

---

## 1. Placar da auditoria

| # | Dimensão | Nota | Achado principal |
|---|---|---|---|
| 1 | Acessibilidade | **1/4** | 118 de 119 imagens sem alt; zero `<h1>`; sem `<main>` |
| 2 | Performance | **0/4** | LCP de **22,7 s** no celular; 24 MB de página |
| 3 | Responsividade | **1/4** | Menu se sobrepõe ao banner entre 768 e 1024 px |
| 4 | Consistência visual | **1/4** | Cores fixas no CSS, sem sistema de tokens |
| 5 | Anti-padrões de UX | **2/4** | Carrossel automático, aviso de cookies cobrindo o botão de compra |
| **Total** | | **5/20** | **Crítico — problemas estruturais** |

*(Dimensões 4 e 5 foram adaptadas: o site é um legado ASP.NET, não uma interface gerada por IA — os critérios originais de "AI slop" não se aplicam e não seriam honestos aqui.)*

### Nota oficial do Google (Lighthouse 12.8.2)

| Categoria | Desktop | **Mobile** |
|---|---:|---:|
| **Performance** | **49** | **53** |
| Acessibilidade | 71 | 71 |
| Boas práticas | 78 | 75 |
| SEO | 82 | 82 |

### Core Web Vitals — celular (4G simulado)

| Métrica | Medido | Alvo do Google | Situação |
|---|---:|---:|---|
| **LCP** (maior conteúdo) | **22,7 s** | < 2,5 s | **9× acima** |
| **Tempo até interativo** | **26,5 s** | < 3,8 s | **7× acima** |
| Speed Index | 15,7 s | < 3,4 s | 4,6× acima |
| First Contentful Paint | 11,7 s | < 1,8 s | 6,5× acima |
| CLS (desktop) | 0,175 | < 0,1 | Reprovado |

**22,7 segundos.** É o tempo até o comprador ver o conteúdo principal no celular. O abandono típico começa aos 3 s.

---

## 2. Resumo executivo — os dez argumentos

| # | Achado | Medida | Onde |
|---|---|---|---|
| 1 | Site saiu do ar | **~19 min**, confirmado de 2 redes independentes | §3 |
| 2 | `www.arguto.com.br` dá alerta de segurança | Certificado não cobre o `www` | §4 |
| 3 | Cookie de sessão sem flag `Secure` | Sessão de cliente logado trafegável em texto claro | §5 |
| 4 | LCP de 22,7 s no celular | Lighthouse/PageSpeed | §6 |
| 5 | 24,3 MB de página | 21,6 MB só de banner no celular | §7 |
| 6 | 10 MB de duplicata byte-idêntica | md5 confirmado | §8 |
| 7 | Botão "voltar" recarrega tudo | bfcache bloqueado | §9 |
| 8 | Menu se sobrepõe ao banner | 768–1024 px | §10 |
| 9 | Política de Privacidade inalcançável no celular | Link visível dá 404 | §12 |
| 10 | Busca `leite` devolve só bala | Sem relevância | §14 |

---

## 3. Disponibilidade — o site sai do ar

**P0 · Crítico**

O site parou de responder por **~19 minutos** durante a auditoria.

Amostragem a cada 20 s:

```
03:43:23  HTTP 000  0.071s   FORA (conexao fechada)
03:43:43  HTTP 000  0.068s   FORA
   … 10 amostras consecutivas …
03:46:25  HTTP 000  0.073s   FORA
```

Depois, a cada 5 min (log em `docs/_uptime-arguto.log`):

```
03:47:11  FORA
03:52:11  FORA
03:57:11  FORA
04:02:12  NO AR  http=200      ← retorno
```

**Janela: 03:43 → 04:02. 13 amostras consecutivas com falha.**

`HTTP 000` respondendo em 0,07 s = **conexão recusada no handshake**. Não é lentidão nem timeout.

### Não é problema da minha rede

- `https://example.com/` carregou normalmente no mesmo instante, mesmo navegador.
- Verificado **também de um celular em 5G** — operadora, IP e rota diferentes → **também fora do ar**.

Duas redes independentes, simultaneamente sem acesso.

### Impacto

E-commerce fora do ar é faturamento parado. Não há alerta, página de status nem fallback.

> **Pergunta para a reunião:** *"Vocês têm monitoramento de uptime? Como ficam sabendo quando o site cai?"* Se a resposta for "não" — eles não sabem quando o próprio site está fora. Nós sabemos, porque medimos.

---

## 4. `www.arguto.com.br` mostra alerta de segurança

**P0 · Crítico** — o achado mais visível para qualquer pessoa.

O certificado TLS cobre **um único domínio**:

```
X509v3 Subject Alternative Name:
    DNS:arguto.com.br
```

Mas o DNS resolve o `www` normalmente, para o mesmo servidor:

```
Nome:    arguto.com.br
Address: 200.170.136.163
Aliases: www.arguto.com.br      ← existe e aponta para cá
```

| Endereço digitado | O que acontece |
|---|---|
| `http://www.arguto.com.br` | 301 → `http://arguto.com.br` (funciona, cai em HTTP) |
| `https://www.arguto.com.br` | **Falha de validação do certificado** |

- `curl` → **exit 60** (*SSL peer certificate cannot be authenticated*)
- Chromium → **`net::ERR_ABORTED`**, navegação cancelada

Como o certificado apresentado (`CN=arguto.com.br`) não corresponde ao endereço pedido, o navegador de um cliente real exibe a **tela cheia de aviso de segurança** (`NET::ERR_CERT_COMMON_NAME_INVALID`), com botão "Voltar para segurança".

### Por que é grave

- Muita gente digita `www.` por hábito.
- Chrome, Edge e Safari tentam **HTTPS primeiro**. Quem digita `www.arguto.com.br` cai direto no erro.
- Quem salvou o favorito com `www` + `https` **não consegue mais entrar**.
- O navegador literalmente diz ao comprador que **o site não é confiável**.

### Prova de que é descuido, não política

O subdomínio `empresa.arguto.com.br` **tem certificado próprio válido** (`CN=empresa.arguto.com.br`). Ou seja: sabem emitir certificado, apenas esqueceram o `www` do domínio principal.

**Correção:** reemitir incluindo `www` no SAN (Let's Encrypt faz de graça, é um parâmetro) + redirect `www` → raiz em HTTPS. **Minutos de trabalho.**

**Demonstração ao vivo:** digitar `www.arguto.com.br` na frente do cliente.

---

## 5. Segurança

**P0/P1 · Crítico a Alto**

### 5.1 Cookie de sessão sem flag `Secure` — verificado em sessão real logada

Com uma conta real autenticada no site:

```
ASP.NET_SessionId    secure: FALSE    httpOnly: true    sameSite: Lax
```

Um cookie **sem a flag `Secure` é enviado tanto em HTTPS quanto em HTTP** — é definição do padrão de cookies, não interpretação. Combinado com:

- **Sem `Strict-Transport-Security` (HSTS)** — verificado, cabeçalho ausente
- Redirect HTTP→HTTPS é **302** (temporário), não 301, e o domínio não está na lista de HSTS preload

...o resultado é que o identificador de sessão de um cliente B2B logado **pode trafegar em texto claro** numa navegação HTTP — Wi-Fi de hotel, portal cativo, proxy corporativo, link antigo. Quem capturar o cookie assume a sessão: preços negociados, histórico de pedidos, carrinho.

As três correções são de configuração: marcar o cookie como `Secure`, ligar HSTS, trocar o 302 por 301.

### 5.2 Nenhum cabeçalho de proteção

| Cabeçalho | Função | Presente? |
|---|---|---|
| `Strict-Transport-Security` | Força HTTPS | ❌ |
| `Content-Security-Policy` | Barreira contra XSS | ❌ |
| `X-Frame-Options` | Impede clickjacking | ❌ |
| `X-Content-Type-Options` | Impede MIME sniffing | ❌ |
| `Referrer-Policy` | Controla vazamento de URL | ❌ |
| `Permissions-Policy` | Restringe câmera/microfone/GPS | ❌ |

Sem `X-Frame-Options` nem CSP `frame-ancestors`, a página **pode ser embutida em iframe** por terceiro — base de golpe de clickjacking contra a área logada.

### 5.3 Servidor expõe a própria versão

```
Server: Microsoft-IIS/10.0
X-AspNet-Version: 4.0.30319
X-Powered-By: ASP.NET
X-Powered-By-Plesk: PleskWin
```

Entrega de graça o mapa da infraestrutura — servidor, versão do framework e painel de hospedagem. Primeiro passo de qualquer varredura automatizada. Não servem para nada ao visitante.

### 5.4 Bibliotecas com CVEs públicos

Três versões de jQuery ao mesmo tempo, mais o pacote de compatibilidade:

- `jquery-1.11.3.min.js` (2015) — carregada **duas vezes**
- `jquery-3.4.1.slim.min.js`
- `jquery-migrate-1.2.1.min.js`

CVEs publicados para essas versões:

- **CVE-2020-11022 / CVE-2020-11023** — XSS via manipulação de HTML; afetam **toda jQuery < 3.5.0** (as duas acima).
- **CVE-2019-11358** — poluição de protótipo (`jQuery.extend`), < 3.4.0.
- **CVE-2015-9251** — XSS em AJAX cross-domain, < 3.0.0.

> **Honestidade:** versão vulnerável **não prova** exploração — depende do uso. Mas é achado objetivo de inventário, e aparece como pendência em qualquer due diligence ou auditoria de cliente corporativo.

### 5.5 TLS 1.3 não suportado

| Protocolo | Situação |
|---|---|
| TLS 1.0 | recusado ✅ |
| TLS 1.1 | recusado ✅ |
| TLS 1.2 | aceito |
| **TLS 1.3** | **não suportado** |

Desabilitar TLS 1.0/1.1 está correto. Faltar TLS 1.3 não é vulnerabilidade, mas perde o handshake de 1 volta — mais lento em rede móvel.

### 5.6 Arquivos de depuração em produção

```
/v1/js/jquery.mmenu.debugger.js   (16.455 bytes)
/v1/js/jquery.xmenu.debugger.js   (16.455 bytes)
```

Arquivo `debugger` é ferramenta de desenvolvimento. Em produção, indica que **o ambiente de desenvolvimento foi publicado como está**, sem etapa de build.

### 5.7 Escopo deliberadamente limitado

**Não** executei varredura de vulnerabilidades (busca por `web.config`, `elmah.axd`, arquivos de backup, injeção). Testar isso num sistema de terceiro sem autorização formal por escrito não é apropriado, mesmo em contexto comercial. Os achados acima vêm de **observação passiva** de cabeçalhos e de navegação normal.

Se quiserem um teste de intrusão de verdade, é outro escopo — e precisa de autorização assinada.

---

## 6. Performance — o número que decide a reunião

**P0 · Crítico**

Lighthouse 12.8.2, o mesmo motor do PageSpeed Insights.

### Celular (4G simulado, aparelho médio)

```
Performance ............ 53/100
LCP .................... 22,7 s   (alvo < 2,5 s)
Tempo até interativo ... 26,5 s   (alvo < 3,8 s)
Speed Index ............ 15,7 s
First Contentful Paint . 11,7 s
```

### Desktop (cenário favorável)

```
Performance ............ 49/100
LCP .................... 5,9 s    (alvo < 2,5 s)
CLS .................... 0,175    (alvo < 0,1)  ← reprovado
```

### O Google aponta exatamente o que eu medi

Oportunidades listadas pelo próprio Lighthouse:

| Economia estimada | Item |
|---:|---|
| **20.903 KB** | Servir imagens em formato moderno |
| 1.576 KB | Dimensionar imagens corretamente |
| 600 KB | Codificar imagens com eficiência |
| 336 KB | Reduzir JavaScript não usado |
| **71 KB** | **Ativar compressão de texto** |
| — (204 ms) | Eliminar recursos que bloqueiam a renderização |

Os dois destacados são **confirmação independente** dos meus achados de §7 e §11.1. Não é opinião minha contra a agência atual — é o Google medindo.

---

## 7. Peso da página — 24,3 MB

**P0 · Crítico**

Medido pelo navegador (bytes reais transferidos):

```
Total de recursos:  123
Peso total:         24.832 KB  ≈ 24,3 MB
Só imagens:         23.595 KB  ≈ 23,0 MB   (78 requisições)
```

### No celular é ainda pior

Medido em viewport de 375 px:

```
Banners:  33 arquivos únicos  →  21.646 KB  ≈ 21,1 MB
Logos de fornecedor: 14 arquivos → 930 KB
```

E aqui está o detalhe que fecha o argumento:

```
Logos de fornecedor no DOM: 29
Logos de fornecedor VISÍVEIS: 0        ← nenhuma aparece no celular
```

**930 KB de logos são baixados e nunca exibidos no celular.** A seção inteira está oculta, mas as imagens são buscadas assim mesmo.

### Formatos: zero imagem moderna

| Formato | Arquivos | Peso |
|---|---:|---:|
| **PNG** | 62 | **22.685 KB** |
| JPG | 6 | 863 KB |
| SVG | 10 | 49 KB |
| WebP / AVIF | **0** | **0** |

**62 PNGs somando 22,7 MB.** PNG é formato *sem perdas*, projetado para logotipo e captura de tela — **não para fotografia**. Fotos de banner e de produto salvas em PNG é o motivo-raiz dos 20 MB. A mesma arte em WebP fica ~15× menor.

### Outros agravantes medidos

- **Nenhuma imagem usa `loading="lazy"`** — as 119 têm `loading: "auto"`; o navegador baixa os 15 banners mesmo que só o primeiro seja visto.
- **Banners ampliados:** arte `1352×376` exibida em `1425×396` — esticada **acima** do tamanho real, aparece borrada.
- **Logos de fornecedor:** `619×619` (117 KB cada) exibidas em `100×100` — **38× mais pixels que o necessário**.
- **Miniaturas de produto:** `250×250` exibidas em `263×263` — também ampliadas.

---

## 8. Metade do peso é duplicata byte-idêntica

**P0 · Crítico**

Cada banner é publicado **duas vezes**, com nomes diferentes ("desktop" e "mobile"). Verifiquei se o conteúdo era mesmo diferente, comparando MD5:

```
IDENTICAL  23062025_134614.png (b6ed5d00c1b421fc240e8d547eae5cef)
       vs  23062025_134551.png (b6ed5d00c1b421fc240e8d547eae5cef)

IDENTICAL  10042026_150703.png (3e745806931569bef8f690396b1f690a)
       vs  10042026_150911.png (3e745806931569bef8f690396b1f690a)

IDENTICAL  13072026_171440.png (ab3a7522f1b9542724f84ef2aa9b5ad1)
       vs  13072026_171432.png (ab3a7522f1b9542724f84ef2aa9b5ad1)
```

Hash idêntico = **byte a byte o mesmo arquivo**. Não é versão mobile otimizada — é o mesmo arquivo com outro nome.

Como as URLs diferem, o navegador **não reaproveita o download**: baixa os dois. E a cópia "mobile" fica com tamanho renderizado `0×0`.

**10 MB baixados para nunca aparecer na tela.** Corrigir é **deletar arquivo** — não exige redesign nenhum.

---

## 9. O botão "voltar" recarrega o site inteiro

**P1 · Alto** — achado do Lighthouse que passa despercebido e custa caro.

```
Auditoria: "Page prevented back/forward cache restoration"
Motivo:    "The page has an unload handler in a sub frame"
Tipo:      Actionable (corrigível)
```

O **bfcache** é o recurso que faz o botão "voltar" restaurar a página anterior instantaneamente, do jeito que estava. Um `unload handler` num iframe desativa isso para a página toda.

Consequência prática, numa loja: o comprador abre um produto, volta, abre outro, volta… **cada "voltar" recarrega os 24 MB do zero.** No celular, são os 22,7 s de novo, a cada retorno.

Navegar por catálogo é exatamente o comportamento de compra. É o pior lugar possível para ter esse defeito.

Relacionado, o Lighthouse também acusa: *"Unload event listeners are deprecated and will be removed"* — a API que causa o problema está sendo removida dos navegadores.

---

## 10. Layout quebrado em tablet

**P1 · Alto**

Entre **768 px e 1024 px** — iPad na vertical, notebook pequeno, janela restaurada — a barra de menu não cabe numa linha, quebra para uma segunda, e a segunda linha é **desenhada por cima do banner**.

Medição em 768 px:

```
Menu, linha 1  (y=135):  ALIMENTOS · BAZAR · BEBIDAS · CUIDADOS PESSOAIS · LIMPEZA
Menu, linha 2  (y=207):  PET · FORNECEDORES · OFERTAS
Banner:        y = 235 → 444

Itens sobrepondo o banner:
  PET           y 207 → 279   ✗ invade o banner
  FORNECEDORES  y 207 → 279   ✗ invade o banner
  OFERTAS       y 207 → 254   ✗ invade o banner
```

Três itens de menu — incluindo **OFERTAS**, que é onde está a margem — ficam ilegíveis, escritos por cima de uma fotografia. Confirmado por medição e por captura de tela.

No mesmo intervalo, **o botão da busca cai para uma linha própria**, separado do campo.

---

## 11. Servidor mal configurado

**P1 · Alto**

### 11.1 HTML sem compressão

```
$ curl -sI --compressed https://arguto.com.br/
Content-Length: 82256
Content-Type: text/html; charset=utf-8
  (nenhum cabeçalho Content-Encoding)
```

Mesmo o navegador anunciando `gzip` e `br`, o servidor manda **82.256 bytes crus**. HTML comprime 6–8×: seriam ~11 KB. **~70 KB desperdiçados em toda visita** — e o Lighthouse confirma: *"Enable text compression — 71 KB"*.

Os arquivos `.js` e `.css` **são** comprimidos (`content-encoding: br`). Ou seja: compressão estática ligada, dinâmica desligada. Uma caixa desmarcada no IIS.

### 11.2 Nenhum cache configurado

```
$ curl -sI .../Content/Banner/23062025_134614.png
Content-Length: 811391
Last-Modified: Mon, 23 Jun 2025 16:46:14 GMT
ETag: "319932555ee4db1:0"
  (sem Cache-Control, sem Expires)
```

Sem `Cache-Control`/`Expires`, o navegador **pergunta ao servidor sobre cada arquivo em toda visita**: 123 idas e voltas antes de a página aparecer, mesmo para o comprador que entra todo dia.

### 11.3 Página de erro 404 é a do servidor, sem marca

```
<title>404 - Arquivo ou diret�rio n�o encontrado.</title>
charset=iso-8859-1
```

Quem erra um endereço ou clica num link antigo recebe a **tela padrão do IIS** — sem logotipo, sem menu, sem busca, sem caminho de volta. Simplesmente sai da loja.

Ainda por cima o charset é `iso-8859-1` enquanto o site é UTF-8 — os acentos aparecem quebrados **na própria página de erro**.

### 11.4 Ponto positivo — infraestrutura correta em três coisas

Registro para a auditoria não parecer encomendada:

- **HTTP/2 em uso** (108 dos recursos) — multiplexação ativa.
- **Listagem de diretório bloqueada** — `/Content/Banner/` e `/v1/img/` retornam 403.
- **TTFB de 87 ms** — o servidor responde rápido. O problema não é o servidor: é o que mandam por cima dele.

---

## 12. Conformidade LGPD

**P0 · Crítico — risco jurídico**

### 12.1 Rastreamento antes do consentimento

Ao abrir a home, **antes de qualquer clique**:

```
cookies gravados: _ga, _ga_XV1YMHHS5T, _ga_1XH1ZS571S
dataLayer: 7 eventos já disparados
4 envios ao Google Analytics (page_view) já efetuados
```

A LGPD (Art. 7º e 8º) exige consentimento **prévio, livre, informado e específico** para tratamento não essencial. Analytics não é essencial ao funcionamento. Aqui o consentimento é colhido **depois** do tratamento — o que o descaracteriza.

### 12.2 O banner não oferece recusa

> "Este site usa cookies para garantir que você obtenha a melhor experiência."
> **[ OK ]**

- **Só existe "OK".** Não há como recusar.
- Sem escolha por finalidade (necessário / analytics / marketing).
- Sem link para a Política de Privacidade.
- Não diz **quais** dados, **para quê**, nem **por quanto tempo**.

A orientação da ANPD é que recusar seja tão fácil quanto aceitar. Banner só com "OK" não coleta consentimento — comunica.

### 12.3 No celular, a Política de Privacidade é inalcançável

O mais grave da seção, porque são duas falhas somadas.

Medição em 375 px:

```
h4 "Institucional:"       → largura 0  (invisível)
h4 "Minha Conta:"         → largura 0  (invisível)
h4 "Vendas Corporativas"  → largura 0  (invisível)

"Política de Privacidade" → /PoliticaDePrivacidade/ → visible: FALSE
"Política de Pagamento"   → /PoliticaDePagamento/   → visible: FALSE
"Trocas e devoluções"     → /TrocasDevolucoes/      → visible: FALSE
```

Os links que **funcionam** estão escondidos. E o único link de política que **aparece** no celular aponta para:

```
href="content.asp"  →  HTTP 404
```

**No celular não existe caminho para a Política de Privacidade.** Os links certos estão ocultos; o visível está quebrado.

Exigência direta da LGPD (Art. 9º) e do CDC quanto a trocas e devoluções.

### 12.4 Duas propriedades GA4 em paralelo

`G-1XH1ZS571S`, `G-XV1YMHHS5T` e o contêiner GTM `GTM-WMKFD6P`, com `page_view` duplicado. Além do dado inflado, é mais dado pessoal compartilhado com terceiro do que o necessário.

---

## 13. SEO

**P1 · Alto** — Lighthouse dá 82/100, mas o que falta é estrutural.

### 13.1 A página não tem `<h1>`

```js
document.querySelectorAll('h1').length  →  0
```

**Zero.** A home da empresa não declara o próprio assunto.

### 13.2 Hierarquia de títulos invertida

```
H5 ×8    ← menu
H4 ×3    ← tarjas de serviço
H2  "ALIMENTOS"   ← primeira seção real
H2  "BEBIDAS"
H2  "LIMPEZA"
H4 ×4    ← rodapé
```

Começa em H5, desce para H4, e só então aparece o H2. O Lighthouse confirma: *"Heading elements are not in a sequentially-descending order"* — 3 ocorrências.

### 13.3 Sem descrição, título genérico

```
<title>B2B Arguto</title>          ← 11 caracteres
<meta name="description">          ← AUSENTE (confirmado pelo Lighthouse)
```

O título não contém "distribuidora", "atacado", "alimentos", "Uberlândia" — nenhum termo que um comprador digitaria.

### 13.4 Zero dados estruturados — e zero preview em rede social

| Recurso | Situação |
|---|---|
| **JSON-LD** (`Product`, `Organization`, `LocalBusiness`) | **0** |
| **Open Graph** (`og:title`, `og:image`, `og:description`) | **0** |
| **Twitter Card** | **0** |
| `<link rel="canonical">` | **ausente** |
| `hreflang` | 0 |
| `theme-color` / manifest | ausentes |

Duas consequências comerciais concretas:

- **Sem JSON-LD**, o Google não consegue exibir preço, disponibilidade nem avaliação nos resultados. Concorrente com marcação aparece com card rico; a Arguto aparece como texto puro.
- **Sem Open Graph**, quando um vendedor compartilha o link no **WhatsApp** — que é o canal de vendas deles, tanto que há botão flutuante do WhatsApp no site — **não aparece imagem, título nem descrição**. Só a URL crua. O link parece spam.

### 13.5 Arquivos básicos ausentes

| Recurso | Status |
|---|---|
| `/robots.txt` | **404** |
| `/sitemap.xml` | **404** |
| `/favicon.ico` | **404** |
| `/v1/img/arguto.ico` (referenciado no HTML) | **404** |

O favicon quebrado gera erro no console em toda visita — o Lighthouse registra como *"Browser errors were logged to the console"*.

---

## 14. Busca do site

**P1 · Alto** — numa distribuidora, a busca **é** o caminho de compra.

### 14.1 Quem procura leite recebe bala

Endpoint `/v1/_ajax_busca.aspx`, todos HTTP 200 com resposta válida:

| Termo | Resultados | Primeiros itens retornados |
|---|---:|---|
| **`leite`** | 10 | BALA ARCOR BUTTER TOFFEES LEITE 400G · BALA ARCOR BUTTER TOFFEES LEITE 90G · BALA BUTTER TOFFEE LEITE CONDENSADO 100G |
| **`cafe`** | 6 | BALA ARCOR BUTTER TOFFEES CAFE EXPRESO 400G · BALA ARCOR BUTTER TOFFEES CAFÉ EXP 90G · DANONE ACTIVIA CAFÉ DA MANHÃ 170G |
| **`coca`** | 4 | BOMBOM ARCOR BONOBON PACOCA 750G · BOMBOM ARCOR BONOBON PAÇOCA DP 18X15G |
| `feijao` | 1 | FEIJÃO PRETO QUERO 340G |
| `biscoito` | 10 | BISCOITO AYMORÉ MARIA 185G … |

- Buscar **leite** → 10 resultados, **nenhum é leite**. Tudo bala de caramelo, porque a palavra "leite" está no nome do doce.
- Buscar **café** → 6 resultados, **nenhum é café**. Bala e iogurte.
- Buscar **coca** → paçoca, porque "co-ca" está dentro de "pa**coca**".

Consulta `LIKE %termo%` crua: **sem ranqueamento por relevância, sem peso de categoria, sem tolerância a erro de digitação, sem sinônimos.**

Quem sabe o que quer **digita**. Uma busca que devolve bala para quem procurou leite empurra o pedido para o telefone — ou para o concorrente.

### 14.2 Uma requisição por tecla digitada

Digitar "arroz" (5 letras) disparou **5 requisições**:

```
?Palavra=a     ?Palavra=ar    ?Palavra=arr
?Palavra=arro  ?Palavra=arroz
```

Sem *debounce* (a pausa de ~300 ms antes de consultar). Cada letra de cada busca de cada visitante vira consulta ao banco — relevante à luz da §3.

---

## 15. Acessibilidade

**P1 · Alto** · Lighthouse: **71/100**

### 15.1 O que a auditoria do Google acusou

| Ocorrências | Falha |
|---:|---|
| **60** | Imagens sem atributo `alt` |
| **25** | Links sem nome identificável |
| **15** | Alvos de toque com tamanho/espaçamento insuficiente |
| **6** | Contraste insuficiente entre texto e fundo |
| **3** | Títulos fora de ordem sequencial |
| **2** | Botões sem nome acessível |
| 1 | `[aria-hidden="true"]` contendo elemento focável |
| 1 | Links distinguíveis apenas pela cor |
| 1 | Sem meta description |

*(60 é a contagem do Lighthouse no viewport dele; na minha medição do DOM completo são **118 de 119** imagens sem alt.)*

### 15.2 O botão de comprar reprova contraste

| Texto | Cor | Fundo | Contraste | Exigido |
|---|---|---|---:|---:|
| **"VER PREÇO"** | branco | laranja `#F5821F` | **2,59:1** | 4,5:1 |
| "OFERTAS" (menu) | laranja `#F5821F` | cinza claro | **2,36:1** | 4,5:1 |

O Lighthouse aponta as mesmas 6 ocorrências, todas no elemento `.btn-preco` — **é o botão de venda, repetido em cada card de produto**. Tem pouco mais da metade do contraste mínimo. Para quem tem baixa visão, ou para qualquer pessoa no celular sob sol, o texto do botão de comprar some.

### 15.3 Links e botões sem nome

Como as imagens não têm `alt`, os links que contêm só imagem ficam **sem nome nenhum**:

```
<a href="/">                                              ← o logotipo
<a href=".../produtos/fornecedor/BETTANIN/00729001/">      ← logos de fornecedor
<a href=".../produtos/fornecedor/QUATREE/00791101/">
```

E dois botões sem nome acessível — incluindo **o botão de busca do celular**:

```
<button type="submit" onclick="BuscaProd('PalavraMob');">
```

Num leitor de tela isso é anunciado como "botão", sem mais nada. O usuário não tem como saber que é a busca.

### 15.4 Campos de formulário sem rótulo

```
#Palavra     (busca desktop) → sem <label>, sem aria-label
#PalavraMob  (busca mobile)  → sem <label>, sem aria-label
name/email/phone (formulário RD) → sem <label>
```

Só há `placeholder`, que some ao digitar. Viola WCAG 3.3.2.

### 15.5 Sem `<main>`, sem link de pular navegação

```
landmarks:  main: 0   header: 0   nav: 2   footer: 1
skip link:  ausente
elementos focáveis: 162
```

Não existe `<main>` nem `<header>` semântico. Quem usa leitor de tela **não tem como saltar ao conteúdo**; e sem "pular para o conteúdo", o usuário de teclado passa por até **162 elementos** — menu, submenus, 15 logos, carrosséis — antes de chegar aos produtos. **Em toda página.**

### 15.6 `aria-hidden` com elemento focável dentro

O menu off-canvas (`#menumobile`) está marcado `aria-hidden="true"` mas contém links focáveis. O usuário de teclado tabula para dentro de um menu **que o leitor de tela afirma não existir** — fica navegando às cegas.

### 15.7 Ponto positivo — o foco é visível

De 60 elementos testados, **59 exibem indicador de foco** ao receber `Tab`. Só o botão "Previous" do carrossel não tem.

---

## 16. Limitações e correções de rigor

Seção deliberada. Levar dado frágil para reunião destrói a credibilidade dos dados bons. **Três achados meus foram derrubados na reverificação e estão listados aqui, não no corpo do relatório.**

### Achados que eu derrubei

1. **"Logos de fornecedor distorcidas"** — o Lighthouse acusou 29 imagens com proporção errada. Fui verificar: no celular as logos têm dimensão **zero** (29 no DOM, 0 visíveis). O aviso era **artefato de elemento oculto**, não distorção real. **Descartado.** O que sobra é o achado legítimo de §7: 930 KB baixados e nunca exibidos.

2. **"Busca por `arroz` retorna vazio"** — resposta válida e vazia, mas ao reverificar, `feijao` encontrou "FEIJÃO PRETO QUERO" e a normalização de acento funciona. Como eles vendem mercearia, o zero em `arroz`/`oleo`/`acucar` **pode ser ausência real de estoque**. **Descartado.** O argumento é o resultado *errado* (§14.1), que não depende de estoque.

3. **"Menu se sobrepõe ao banner" — primeira medição deu falso negativo.** Meu seletor pegou o menu off-canvas escondido em vez do visível, e retornou "nenhuma sobreposição" enquanto a captura de tela mostrava o contrário. Refiz com filtro de visibilidade e confirmei numericamente (§10). **Mantido, mas só depois de corrigir o método.**

### O que não foi verificado

4. **Causa da queda (§3):** confirmei ~19 min fora, de duas redes independentes. **Não determinei a causa** e **não afirmo que a auditoria a provocou**. Foram ~200 requisições em ~6 min — volume comparável ao de um usuário navegando. Se isso derruba o site, é achado de capacidade grave; mas **não está provado**.

5. **Vazamento do cookie de sessão em HTTP (§5.1):** o cookie **comprovadamente** não tem `Secure` e **comprovadamente** não há HSTS. A consequência decorre do padrão de cookies. Mas **não demonstrei uma captura real** do cookie em trânsito — o Chrome moderno faz upgrade automático para HTTPS, o que mitiga parcialmente. Apresentar como **risco de configuração**, não como exploração demonstrada.

6. **Dados de campo (CrUX):** os números de Lighthouse são de laboratório. Os relatórios de PageSpeed rodados pelo cliente (links no topo) podem trazer dados reais de usuário, que são mais fortes ainda.

7. **Leitor de tela real (NVDA/VoiceOver):** não testado. Os achados de acessibilidade vêm de medição e da auditoria automatizada.

8. **Área logada:** naveguei autenticado apenas em modo leitura, na home. **Não** testei carrinho, checkout ou pedidos — e **não** registrei preço, ID de cliente ou dado pessoal neste documento. É provável que existam mais achados lá.

9. **Varredura de vulnerabilidade:** deliberadamente não executada (§5.7).

10. **Demais páginas:** auditada a home. Os achados de servidor (§5, §11) valem para o site inteiro; os de conteúdo foram medidos só na home.

---

## 17. Roteiro de demonstração ao vivo

Sem ferramenta especial, na frente do cliente:

| Ordem | O que mostrar | Como | Efeito |
|---|---|---|---|
| 1 | **Alerta de segurança** | Digitar `www.arguto.com.br` | Tela vermelha: "site não é confiável" |
| 2 | **Busca devolve bala** | Digitar `leite` na busca | 10 balas, zero leite |
| 3 | **Nota do Google** | Abrir o PageSpeed do celular | Performance 53, LCP 22,7 s |
| 4 | **Política sumida** | No celular, rolar até o rodapé | Não existe caminho para a política |
| 5 | **Menu quebrado** | Estreitar a janela para ~800 px | "OFERTAS" escrito por cima do banner |
| 6 | **Voltar recarrega tudo** | Abrir produto → botão voltar | Recarrega inteiro, não instantâneo |
| 7 | Cookies antes do aceite | F12 → *Application* → *Cookies* | `_ga` já existe antes do "OK" |
| 8 | Compartilhar no WhatsApp | Mandar o link para si mesmo | Sem imagem, sem título, só URL crua |
| 9 | Peso da página | F12 → *Network* → recarregar | ~24 MB |
| 10 | Sem `<h1>` | Console → `document.querySelectorAll('h1').length` | `0` |

**Ordem sugerida:** comece pelo item 1. É visual, instantâneo, não precisa de explicação técnica, e nenhum cliente aceita que o próprio site diga ao comprador que não é confiável.

---

## 18. O que a home nova já resolve

| Achado no site atual | Estado na home nova |
|---|---|
| LCP 22,7 s / 24,3 MB (§6, §7) | WebP: categorias 11,7 MB → 320 KB; logos 939 KB → 140 KB |
| Sem `lazy loading` (§7) | `loading="lazy"` abaixo da dobra via `next/image` |
| 62 PNG, zero WebP (§7) | WebP em todo asset |
| Banner duplicado (§8) | Uma única fonte por banner |
| HTML sem compressão (§11.1) | Compressão automática na plataforma |
| Sem cache (§11.2) | Assets com hash e cache imutável |
| 21 scripts, 3 jQuery, 3 carrosséis (§5.4) | Zero jQuery; rolagem nativa via CSS scroll-snap |
| Arquivos `debugger` em produção (§5.6) | Build de produção separado |
| Menu sobrepondo banner (§10) | Layout testado de 320 a 1920 px |
| 404 sem marca (§11.3) | Página de erro com identidade e navegação |
| Sem `<h1>` (§13.1) | `<h1>` único e descritivo |
| Hierarquia H5→H4→H2 (§13.2) | `h1 → h2 → h3` em ordem |
| Sem meta description (§13.3) | Metadados completos (`baseMetadata`) |
| Zero JSON-LD / Open Graph (§13.4) | Dados estruturados + preview em WhatsApp/LinkedIn |
| 118 imagens sem alt (§15.1) | Alt descritivo; placeholder anunciado como "sem imagem" |
| Botão de compra 2,59:1 (§15.2) | Contraste ≥ 4,5:1 verificado |
| Links/botões sem nome (§15.3) | `aria-label` em todo controle só-ícone |
| Campos sem rótulo (§15.4) | Busca com `aria-label` e `role="listbox"` |
| Sem `<main>`/skip link (§15.5) | `<main id="main">` + "Pular para o conteúdo" |
| Alvos de 8×8 px (§15.1) | Alvos ≥ 24×24 px (WCAG 2.5.8 AA) |
| Rodapé some no mobile (§12.3) | Rodapé completo em qualquer largura |
| Uma requisição por tecla (§14.2) | Busca com *debounce* |

### O que dizer na reunião — e o que não dizer

**Diga:** boa parte de §5 e §11 (compressão, cache, cabeçalhos, certificado `www`, flag `Secure`) **é configuração de servidor, não redesign**. Dá para corrigir no site atual, sem mexer no visual. Ofereça isso.

Isso aumenta a credibilidade: mostra que o objetivo é resolver o problema, não empurrar projeto. E o argumento do site novo **se sustenta sozinho** no que configuração não resolve — estrutura semântica (§13), acessibilidade (§15), layout responsivo (§10), peso de imagem (§7) e busca (§14).

**Não diga** que a auditoria provou que o site cai sob carga (§16.4), nem que o cookie de sessão foi capturado (§16.5). As duas coisas são mais fracas do que parecem, e um técnico do outro lado derruba na hora — levando junto a credibilidade do resto.

---

## 19. Prioridade sugerida

| Prioridade | Item | Esforço | Por quê |
|---|---|---|---|
| **P0** | Certificado cobrindo `www` (§4) | **Minutos** | Navegador diz que o site não é confiável |
| **P0** | Flag `Secure` + HSTS (§5.1) | **Minutos** | Sessão de cliente logado |
| **P0** | Disponibilidade (§3) | Investigar | Fora do ar = zero venda |
| **P0** | Política de Privacidade no mobile (§12.3) | Baixo | Exposição legal |
| **P0** | Consentimento antes do rastreio (§12.1–12.2) | Baixo | Exposição legal |
| **P0** | Apagar banners duplicados (§8) | **Muito baixo** | −10 MB deletando arquivo |
| **P1** | Converter imagens para WebP (§7) | Baixo | −20 MB; o maior ganho isolado |
| **P1** | Ligar compressão + cache (§11.1–11.2) | Muito baixo | Caixa de configuração no IIS |
| **P1** | Contraste do "VER PREÇO" (§15.2) | **Muito baixo** | Uma cor; é o botão de venda |
| **P1** | Cabeçalhos de segurança (§5.2–5.3) | Baixo | Configuração de servidor |
| **P1** | Corrigir menu em tablet (§10) | Baixo | Layout visivelmente quebrado |
| **P1** | `<h1>`, meta description, sitemap (§13) | Baixo | SEO básico |
| **P1** | Open Graph (§13.4) | Baixo | Link no WhatsApp é canal de venda |
| **P2** | Remover `unload` handler / bfcache (§9) | Médio | "Voltar" instantâneo |
| **P2** | `alt` nas imagens (§15.1) | Médio | Volume alto de itens |
| **P2** | Relevância + debounce na busca (§14) | Médio | Conversão |
| **P2** | Atualizar/limpar jQuery (§5.4) | Médio | Risco de regressão |
| **P3** | TLS 1.3 (§5.5) | Baixo | Handshake mais rápido |
| **P3** | Página 404 com marca (§11.3) | Baixo | Retenção |

---

**Coleta:** 27/07/2026 · Lighthouse 12.8.2 (motor do PageSpeed Insights), Chromium/Playwright, requisições HTTP diretas · viewports 320–1920 px.
**Artefatos:** `docs/_uptime-arguto.log` · `lh-mobile.json` · `lh-desktop.json`
