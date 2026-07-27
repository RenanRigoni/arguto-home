# TAREFA: página HTML de apresentação comercial — auditoria Arguto

> ## ⚠️ EXECUÇÃO AUTÔNOMA — LEIA PRIMEIRO
>
> **O Renan está dormindo e não vai responder nada.** Execute a tarefa inteira sozinho,
> do começo ao fim, incluindo o commit e a publicação online (§12).
>
> - **Não faça perguntas.** Nem de escolha, nem de confirmação, nem de aprovação.
> - **Não pare no meio** esperando resposta. Não existe resposta.
> - Toda decisão de conteúdo, visual e técnica já está definida neste documento.
> - Se surgir uma dúvida não prevista: escolha a opção mais conservadora — a que **não
>   quebra o que já está no ar** — siga em frente e registre a decisão no relatório final.
> - A tarefa só está concluída quando a página estiver **publicada e respondendo 200**
>   (§12, passos 3 e 4). Criar o arquivo local não é entregar.

Você vai construir **um único arquivo HTML autocontido** que o Renan (dev.RR) vai projetar numa reunião para **os donos da Arguto**, uma distribuidora de alimentos/bebidas/limpeza de Uberlândia-MG.

Objetivo da página: **fazer os donos fecharem o contrato de redesenho do site.**

Não é relatório técnico. É **peça de convencimento** construída sobre dados técnicos reais.

---

## 0. Skills — use, mas com uma ressalva importante

### Use estas

**1. `/design-taste-frontend`** — invoque **antes** de escrever qualquer HTML.

É a skill de página de persuasão (landing/portfólio), exatamente o gênero desta peça. Ela vai pedir um "Design Read" e três dials. **Já estão decididos** — use estes valores, não recalcule:

> **Design Read:** *"Página de diagnóstico técnico para donos de distribuidora não-técnicos, com linguagem de credibilidade orientada a dado, no sistema de marca dev.RR (dark mode, azul/violeta, Bricolage + Jakarta + DM Mono)."*

| Dial | Valor | Por quê |
|---|---:|---|
| `DESIGN_VARIANCE` | **7** | Editorial e intencional, mas é peça de negócio — nada de caos artístico |
| `MOTION_INTENSITY` | **3** | Vai ser **projetada numa reunião**. Movimento pesado engasga em projetor e mina a seriedade. Motion sutil só na entrada de seção |
| `VISUAL_DENSITY` | **5** | Densa em dado (métricas, tabelas), mas precisa respirar |

**2. `/ui-ux-pro-max`** — use **no fim**, como conferência.

Rode o checklist de acessibilidade e touch/interação dela contra a página pronta. Esta página **aponta** falhas de contraste e alvo de toque; ela mesma não pode ter nenhuma. Corrija o que a skill acusar antes de publicar.

### ⛔ NÃO use `/impeccable` nem `/audit` nesta tarefa

Parecem as skills certas, mas **carregam a marca errada** e vão sabotar o resultado.

O protocolo de contexto delas lê `PRODUCT.md` e `DESIGN.md` da raiz do projeto — e esses arquivos descrevem a marca da **Arguto** (indigo `#292C95` + laranja `#F2811D`, Big Shoulders + IBM Plex, direção "The Freight Manifest").

**Esta página não é da Arguto. É da dev.RR** — dark mode, azul/violeta, Bricolage + Jakarta. Carregar aquele contexto faria você construir a página na identidade do cliente que está sendo auditado, com laranja como cor primária — que o guia da dev.RR **proíbe** explicitamente.

A marca correta, completa e já extraída, está na §3 deste documento. É a única fonte de verdade visual aqui.

---

## 1. Quem vai olhar essa tela

Donos de distribuidora, 40–60 anos, **não são técnicos**. Não sabem o que é LCP, cabeçalho HTTP, certificado TLS ou WCAG.

Eles entendem: **cliente que desiste, venda perdida, concorrente ganhando, risco de multa, telefone tocando.**

Regra de ouro da página: **todo dado técnico vem acompanhado da tradução em dinheiro ou risco.** Nunca solte um número técnico sozinho.

Exemplo do que fazer:

> **22,7 segundos**
> É quanto o cliente espera a página abrir no celular.
> *O comprador desiste em 3. Ou seja: quem abre seu site pelo celular vai embora antes de ver o primeiro produto.*

Exemplo do que **não** fazer:

> LCP: 22,7s (Largest Contentful Paint acima do threshold de 2,5s recomendado pelo Core Web Vitals)

---

## 2. Arquivos de entrada — leia antes de escrever

| Arquivo | Para quê |
|---|---|
| `c:\Users\Renan\Desktop\PROJETOS\ARGUTO-FAR\docs\AUDITORIA-SITE-ATUAL.md` | **Leia inteiro.** É a auditoria completa, 810 linhas, com todos os achados e as ressalvas |
| `C:\Users\Renan\Desktop\RR\brand-guide.html` | Guia de marca dev.RR — confira se bate com a §3 abaixo |
| `C:\Users\Renan\Desktop\RR\public\logos\logo-primary-white.svg` | Logo horizontal para o topo |
| `C:\Users\Renan\Desktop\RR\public\logos\logo-icon-color.svg` | Ícone para favicon / rodapé |

**Sobre o logo:** abra o `.svg`, copie o código-fonte SVG e **cole inline dentro do HTML**. Não use `<img src="...">` com caminho local — a página tem que abrir por duplo-clique, offline, sem imagem quebrada no meio da reunião. Se o SVG tiver `width`/`height` fixos, troque por `height:32px;width:auto` no CSS e mantenha o `viewBox`.

---

## 3. Marca dev.RR — valores exatos, não invente

```css
/* Superfícies — SEMPRE fundo escuro */
--surface:          #07070F;
--surface-muted:    #0B0B16;
--surface-elevated: #10101E;
--surface-card:     #0E1428;
--surface-footer:   #080E1A;

/* Azul — cor primária de ação */
--brand-50:  #0D1829;
--brand-100: #152240;
--brand-200: #1E3566;
--brand-400: #60A5FA;
--brand-500: #3B82F6;
--brand-600: #2563EB;   /* ★ botões, CTAs, destaques */
--brand-700: #1D4ED8;
--brand-900: #1E3A5F;

/* Texto */
--content-primary:   #F1F5F9;
--content-secondary: #94A3B8;
--content-muted:     #7C8A9C;

/* Semânticas */
--emerald: #10B981;   /* sucesso, "resolvido" */
--red:     #F87171;   /* problema, atenção */
--amber:   #FBBF24;   /* alerta intermediário */
--violet:  #8B5CF6;   /* acento — NUNCA como cor principal */

/* Bordas */
--border:        rgba(255,255,255,.08);
--border-soft:   rgba(255,255,255,.06);
--border-strong: rgba(255,255,255,.12);

/* Forma */
--radius-card:  2rem;
--radius-inner: 1.625rem;
--radius-pill:  9999px;

--shadow-card: 0 4px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05);
```

### Tipografia

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet">
```

| Papel | Fonte | Uso |
|---|---|---|
| **Display** | Bricolage Grotesque 800 | **Só o H1.** `clamp(2.75rem, 6vw, 5.5rem)`, lh 1.04, ls -0.03em |
| **Sans** | Plus Jakarta Sans | H2, H3, corpo, UI, labels. H2: `clamp(1.875rem,4vw,3rem)` 700 |
| **Mono** | DM Mono 500 | **Só números, métricas e eyebrows.** Eyebrow: 0.75rem UPPERCASE, ls 0.12em, cor brand-400 |

Fallback obrigatório (se a fonte não carregar offline, não pode desmontar):
```css
--font-display: 'Bricolage Grotesque', 'Arial Black', system-ui, sans-serif;
--font-sans:    'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
--font-mono:    'DM Mono', ui-monospace, 'Cascadia Mono', Consolas, monospace;
```

### Proibições da marca — o guia lista explicitamente

- ❌ **Texto com gradiente** (`background-clip:text`) — proibido no guia
- ❌ Fundo branco, creme ou cinza claro **em qualquer parte**
- ❌ Violeta como cor principal — só acento pontual
- ❌ Laranja, rosa ou amarelo como cor primária
- ❌ Mais de 2 cores de destaque no mesmo bloco
- ❌ Fontes fora do sistema (nada de Inter, Montserrat, Poppins)
- ❌ Logo com sombra, contorno ou distorção
- ❌ Ícones "flat coloridos" estilo cartoon
- ❌ Linguagem técnica com o público leigo

---

## 4. Os dados. Todos verificados. Não invente número nenhum.

Se um número não estiver aqui nem no `AUDITORIA-SITE-ATUAL.md`, **não coloque na página.**

### 4.1 Nota do Google (Lighthouse 12.8.2 — motor do PageSpeed Insights)

| Categoria | Desktop | Mobile |
|---|---:|---:|
| Performance | 49/100 | 53/100 |
| Acessibilidade | 71/100 | 71/100 |
| Boas práticas | 78/100 | 75/100 |
| SEO | 82/100 | 82/100 |

### 4.2 Velocidade no celular

| Métrica | Medido | Alvo Google |
|---|---:|---:|
| Tempo até ver o conteúdo (LCP) | **22,7 s** | 2,5 s |
| Tempo até poder usar a página | **26,5 s** | 3,8 s |
| Speed Index | 15,7 s | 3,4 s |
| Primeiro conteúdo na tela | 11,7 s | 1,8 s |
| Instabilidade visual (CLS, desktop) | 0,175 | 0,1 |

### 4.3 Peso

- Página completa: **24,3 MB** (23 MB só de imagem, 123 arquivos)
- No celular: **21,6 MB de banner** + 930 KB de logos
- **930 KB de logos de fornecedor baixados e nunca exibidos no celular** (29 no DOM, **0 visíveis**)
- **62 arquivos PNG somando 22,7 MB. Zero WebP.**
- **10 MB são arquivo duplicado byte-idêntico** — mesmo banner com dois nomes, hash MD5 igual, baixado duas vezes
- Nenhuma imagem usa carregamento preguiçoso (`lazy`)
- O próprio Google aponta: **20.903 KB** economizáveis em imagem e **71 KB** em compressão de texto

### 4.4 Disponibilidade

- Site fora do ar por **~19 minutos** durante a auditoria (03:43 → 04:02)
- 13 amostras consecutivas com falha de conexão
- Confirmado de **duas redes independentes** (banda larga + celular 5G)
- **Não há monitoramento** — ninguém é avisado quando cai

### 4.5 Segurança

- **`www.arguto.com.br` mostra tela vermelha de "site não confiável"** — o certificado cobre só `arguto.com.br`, não o `www`. Quem digita "www" ou tem favorito com "www" não entra.
- **Cookie de sessão sem a proteção `Secure`** — verificado em conta real logada. Sem HSTS. O identificador da sessão do cliente pode trafegar sem criptografia.
- **Zero cabeçalhos de segurança**: sem HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Servidor anuncia versão exata: `Microsoft-IIS/10.0`, `ASP.NET 4.0.30319`, `PleskWin`
- **Três versões de jQuery ao mesmo tempo**, uma de 2015, com CVEs públicos (CVE-2020-11022, CVE-2020-11023, CVE-2019-11358, CVE-2015-9251)
- Arquivos de depuração (`.debugger.js`) publicados em produção
- TLS 1.3 não suportado

### 4.6 LGPD — risco jurídico

- **Cookies do Google gravados antes de qualquer clique** (`_ga`, `_ga_XV1YMHHS5T`, `_ga_1XH1ZS571S`); 4 envios ao Analytics já efetuados antes do aviso
- Aviso de cookies **só tem botão "OK"** — não existe recusar, nem escolha por finalidade, nem link para a política
- **No celular, a Política de Privacidade é inalcançável**: os links que funcionam estão ocultos (largura 0) e o único visível aponta para `content.asp` → **404**
- Duas propriedades GA4 medindo em paralelo

### 4.7 Aparecer no Google e no WhatsApp

- **Zero `<h1>`** — a home não declara o próprio assunto
- Títulos fora de ordem (começa em H5, desce pra H4, depois H2)
- Sem `meta description`
- Título da aba: `B2B Arguto` — 11 caracteres, sem "distribuidora", "atacado", "Uberlândia"
- **Zero dados estruturados (JSON-LD)** — Google não mostra preço nem disponibilidade no resultado
- **Zero Open Graph** — link compartilhado no WhatsApp sai **sem imagem e sem título**, só a URL crua. E o WhatsApp é canal de venda deles (têm botão flutuante no site)
- `robots.txt` → 404 · `sitemap.xml` → 404 · `favicon` → 404

### 4.8 Busca do site

| Termo buscado | O que devolve |
|---|---|
| **`leite`** | 10 resultados, **nenhum é leite** — BALA ARCOR BUTTER TOFFEES LEITE, BALA BUTTER TOFFEE LEITE CONDENSADO |
| **`cafe`** | 6 resultados, **nenhum é café** — bala e iogurte |
| **`coca`** | BOMBOM BONOBON **PAÇOCA** (acha "coca" dentro de "paçoca") |

Uma requisição por tecla digitada, sem pausa — 5 letras = 5 consultas ao banco.

### 4.9 Acessibilidade e experiência

- **118 de 119 imagens sem descrição** (`alt`)
- 25 links sem nome identificável; 2 botões sem nome — inclusive **o botão de busca do celular**
- **Botão "VER PREÇO" com contraste 2,59:1** — mínimo exigido é 4,5:1. É o botão de venda, repetido em todo card
- 41 elementos de toque menores que 24×24 px; as bolinhas do carrossel têm **8×8 px**
- Sem `<main>`, sem "pular para o conteúdo" — usuário de teclado passa por **162 elementos** antes de chegar aos produtos
- **Menu se sobrepõe ao banner entre 768 e 1024 px** — "PET / FORNECEDORES / **OFERTAS**" escritos por cima da foto
- Aviso de cookies **cobre os botões de compra** no celular
- Setas do carrossel desenhadas **por cima da foto do produto**
- **Botão "voltar" recarrega os 24 MB inteiros** (bfcache bloqueado por `unload handler`) — navegar catálogo é o comportamento de compra
- Página de erro 404 é a tela crua do servidor, sem marca, sem caminho de volta, com acento quebrado

---

## 5. REGRA CENTRAL: todo problema tem que ter solução

O Renan foi explícito: **não adianta apontar problema que não dá pra resolver.** Um problema sem saída só assusta o cliente e não vende nada.

Então **cada** problema mostrado na página precisa aparecer dentro de um destes três baldes, com o balde **visível e rotulado**:

### 🟦 Balde A — "Resolvido no site novo"
Entra pronto na entrega do Renan. Sem custo extra, sem depender de terceiro.

> imagens em WebP · carregamento preguiçoso · `<h1>` e títulos em ordem · meta description · dados estruturados · Open Graph pro WhatsApp · descrição em todas as imagens · contraste do botão de compra · alvos de toque · `<main>` e pular-conteúdo · layout testado de 320 a 1920 px · banner duplicado eliminado · página 404 com marca · busca com pausa · aviso de cookies que não cobre o botão · fim do jQuery (o "voltar" volta a ser instantâneo)

### 🟨 Balde B — "Ajuste de configuração no servidor"
Não é redesenho. É configuração. **Rápido e barato** — o Renan entrega a especificação exata e a hospedagem executa.

> certificado cobrindo `www` (minutos) · proteção `Secure` no cookie + HSTS · ligar compressão · ligar cache · cabeçalhos de segurança · esconder versão do servidor · TLS 1.3

### 🟩 Balde C — "Precisa investigar / acompanhar"
Honesto: não dá pra prometer solução sem ver a causa. Mas o Renan já instala o monitoramento.

> as quedas do site — instalar monitoramento de disponibilidade com alerta, para no mínimo **saberem** quando cai · relevância da busca (depende do sistema interno, exige diagnóstico)

**Esse enquadramento é o argumento comercial mais forte da página.** O Balde B, dito em voz alta, mostra que o Renan está resolvendo o problema do cliente e não empurrando projeto — e isso **aumenta** a chance de fechar, não diminui.

---

## 6. Honestidade — isso protege o Renan na reunião

A auditoria tem uma seção de limitações (§16). Respeite:

**Nunca escreva na página:**
- que a auditoria **provou** que o site cai sob carga → só está provado que **caiu por ~19 min**, causa não determinada
- que o cookie de sessão **foi capturado** → está provado que **falta a proteção**, não houve captura
- que as logos de fornecedor estão **distorcidas** → isso foi verificado e **descartado**; o correto é "baixadas e nunca exibidas"
- que a busca por `arroz` está quebrada → **descartado**, pode ser estoque real. Use `leite` e `cafe`, que são incontestáveis

**Inclua uma seção curta "Como medimos"** com: Google Lighthouse 12.8.2 (mesmo motor do PageSpeed Insights), navegador Chrome automatizado, testes de 320 a 1920 px, data 27/07/2026. Isso responde na hora o "de onde você tirou isso?" — e se alguém do lado deles quiser conferir, confere.

Se houver um técnico na sala, ele vai testar exatamente esses pontos. Qualquer exagero derruba o resto junto.

---

## 7. Estrutura da página

Uma página, rolagem vertical, seções nessa ordem:

**1. Topo** — logo dev.RR (SVG inline) + eyebrow em mono: `DIAGNÓSTICO TÉCNICO · ARGUTO.COM.BR · JULHO 2026`

**2. Herói** — H1 em Bricolage com a frase de impacto. Sugestões (escolha uma, não use as três):
- "Seu site está afastando cliente antes dele ver o primeiro produto."
- "22,7 segundos. É o que seu cliente espera antes de desistir."

Abaixo, 3–4 números grandes em DM Mono com legenda leiga curta:
`22,7s` tempo de espera no celular · `24,3 MB` peso da página · `49/100` nota do Google · `19 min` fora do ar

**3. "O que eu fiz"** — 3 linhas explicando que foi medição com a ferramenta oficial do Google, não opinião. Sem jargão.

**4. Os achados** — o coração. Agrupe em blocos por **impacto no negócio**, não por categoria técnica:

| Bloco | O que entra |
|---|---|
| 💸 **Você está perdendo venda agora** | lentidão 22,7s · 24,3 MB · "voltar" recarrega tudo · busca que devolve bala quando pedem leite · botão de compra com contraste ruim |
| 🚫 **Cliente que não consegue nem entrar** | `www` com alerta de site não confiável · 19 min fora do ar sem ninguém saber · menu por cima do banner no tablet · aviso de cookies cobrindo o botão |
| 🔍 **Você é invisível no Google e no WhatsApp** | sem `<h1>` · sem descrição · sem sitemap · link no WhatsApp sem imagem nem título · sem dados estruturados |
| ⚖️ **Risco jurídico (LGPD)** | rastreio antes do consentimento · aviso sem opção de recusar · Política de Privacidade inalcançável no celular |
| 🔒 **Segurança** | cookie de sessão sem proteção · zero cabeçalhos · jQuery de 2015 com falhas públicas · versão do servidor exposta |

Cada achado = um card com:
- **título em linguagem de dono de negócio** (não técnica)
- o número/evidência em DM Mono
- 1–2 frases traduzindo para dinheiro ou risco
- **etiqueta do balde** (A / B / C) com cor: A=`--emerald`, B=`--amber`, C=`--brand-400`
- em `<details>` recolhido, o detalhe técnico para quem quiser conferir

**5. "Dá pra ver agora"** — o roteiro de demonstração ao vivo, como checklist numerado. Isso transforma a reunião em demonstração:
1. digitar `www.arguto.com.br` → tela vermelha
2. buscar `leite` no site → só bala
3. abrir o PageSpeed no celular → 53/100
4. no celular, procurar a Política de Privacidade no rodapé → não existe
5. estreitar a janela pra ~800px → "OFERTAS" por cima do banner
6. compartilhar o link no WhatsApp → sem imagem, sem título

**6. Antes → Depois** — tabela ou par de colunas comparando situação atual × entrega. Use os três baldes aqui como legenda.

**7. Como medimos** — seção curta de credibilidade (§6).

**8. Fechamento + CTA** — proposta de valor dev.RR e botão de WhatsApp em `--brand-600`. Tom da marca: "Você fala direto comigo. Sem gerente de conta, sem terceirizado." CTA: **"Fale no WhatsApp"**.

**9. Rodapé** — logo ícone, `dev.RR`, `devrigoni.com.br`, data.

---

## 8. Qualidade visual — não entregue template genérico

- **Hierarquia por escala**: os números grandes precisam dominar. Contraste real de tamanho entre número e legenda (proporção ≥ 2,5×).
- **Ritmo variado** no espaçamento entre seções. Nada de padding idêntico em tudo.
- **Profundidade**: use `--surface-card` sobre `--surface`, borda sutil, `--shadow-card`. Nada de tudo achatado no mesmo plano.
- **Textura de fundo**: dot grid sutil é permitido pelo guia. Use com moderação, opacidade baixa.
- **Glow azul-violeta sutil** só em 1–2 elementos de destaque (o guia permite). Não espalhe.
- Cards **não** podem ser todos do mesmo tamanho — destaque os achados mais graves com card maior ou largura dupla.
- Estados de hover/focus **desenhados**, não default do navegador.
- `prefers-reduced-motion`: respeite, desligando animação.

---

## 9. Requisitos técnicos

- **Um único arquivo `.html`**, autocontido. CSS em `<style>` inline no head. Sem framework, sem CDN de JS, sem build.
- Abre por duplo-clique, offline. Se as fontes do Google não carregarem, o fallback segura o layout.
- **Responsivo de verdade** — vai ser projetado em telão e talvez aberto no celular. Teste mentalmente 390px, 768px, 1440px, 1920px. Sem rolagem horizontal.
- Tabelas largas dentro de `overflow-x:auto`.
- **Imprimível**: `@media print` que force fundo escuro em cor ou, se preferir, um modo de impressão legível. Eles podem querer imprimir.
- Semântica correta: **um** `<h1>`, hierarquia `h1→h2→h3` em ordem, `<main>`, `<section>`, `<table>` de verdade onde for tabela.
- **Contraste mínimo 4,5:1** em todo texto. Seria constrangedor apontar contraste ruim numa página com contraste ruim. Confira `--content-muted` (#7C8A9C) sobre `--surface` (#07070F) antes de usar em texto pequeno.
- Todo elemento interativo com foco visível e alvo ≥ 24×24px. **A página tem que passar na própria auditoria que ela apresenta.**
- `<title>`: `Diagnóstico Técnico — arguto.com.br | dev.RR`
- `lang="pt-BR"`, favicon inline (data URI com o ícone SVG)

---

## 10. Onde salvar

```
c:\Users\Renan\Desktop\PROJETOS\ARGUTO-FAR\apresentacao\diagnostico-arguto.html
```

Crie a pasta `apresentacao/` se não existir.

---

## 11. Checklist antes de entregar

- [ ] Li o `AUDITORIA-SITE-ATUAL.md` inteiro antes de escrever
- [ ] Nenhum número inventado — todos vieram da §4 ou do documento
- [ ] Nenhum problema aparece sem balde A, B ou C
- [ ] Não afirmei que o site cai sob carga, nem que o cookie foi capturado, nem que as logos estão distorcidas, nem que a busca por `arroz` está quebrada
- [ ] Todo dado técnico tem tradução leiga ao lado
- [ ] Fundo escuro em toda a página, zero fundo claro
- [ ] Zero texto com gradiente
- [ ] Bricolage só no H1
- [ ] DM Mono só em número/métrica/eyebrow
- [ ] Logo SVG inline, com respiro, sem distorção
- [ ] Um `<h1>` só, hierarquia em ordem
- [ ] Contraste ≥ 4,5:1 em todo texto
- [ ] Sem rolagem horizontal em 390px
- [ ] Abre offline por duplo-clique
- [ ] A página passaria na auditoria que ela mesma apresenta
- [ ] Invoquei `/design-taste-frontend` antes de escrever, com os dials da §0
- [ ] Rodei `/ui-ux-pro-max` no fim e corrigi o que acusou
- [ ] **Não** usei `/impeccable` nem `/audit` (carregariam a marca da Arguto)
- [ ] Commitei a auditoria pendente **e** a página (§12, passo 1)
- [ ] `git push` feito e deploy concluído com sucesso (§12, passo 2)
- [ ] **As duas URLs retornam 200** — home e diagnóstico (§12, passo 3)
- [ ] Abri a página publicada e conferi fontes, logo, imagens e console (§12, passo 4)
- [ ] Deixei o relatório final para o Renan (§12)

---

## 12. Publicar online — execute sozinho, do início ao fim

> **O Renan está dormindo. Ele NÃO vai responder pergunta nenhuma.**
> Execute tudo desta seção sem pedir confirmação, sem pedir escolha, sem pedir aprovação.
> Toda decisão já está tomada abaixo. Se aparecer uma dúvida não prevista, escolha a
> opção mais conservadora (a que não quebra o que já está no ar) e siga em frente,
> registrando o que decidiu no relatório final.

A reunião será pelo link, não pelo arquivo. Publicar faz parte da entrega — sem isso, a tarefa não está concluída.

### Ambiente (já verificado, pode confiar)

| Item | Valor |
|---|---|
| Repositório | `https://github.com/RenanRigoni/arguto-home` (**público**) |
| Branch | `main` |
| `gh` CLI | autenticado como `RenanRigoni` ✅ |
| Home já publicada | `https://renanrigoni.github.io/arguto-home/` ← **não pode quebrar** |
| Workflow | `.github/workflows/pages.yml` |

### O que já foi preparado para você

O workflow **já contém** a etapa "Publicar página de diagnóstico", que copia
`apresentacao/diagnostico-arguto.html` para `out/diagnostico/index.html` depois do build.

**Não edite o workflow.** Basta salvar o arquivo no caminho da §10 e commitar.

Resultado final:

```
https://renanrigoni.github.io/arguto-home/             ← home (intacta)
https://renanrigoni.github.io/arguto-home/diagnostico/ ← a apresentação
```

Sem colisão: `/diagnostico` não é rota do Next.

### Passo 1 — commitar TUDO que está pendente

Além do HTML que você criou, há trabalho da auditoria ainda sem commit. **Leve tudo junto**, em dois commits separados por assunto:

```bash
cd "c:/Users/Renan/Desktop/PROJETOS/ARGUTO-FAR"

# 1) Auditoria + a etapa de publicação no workflow
git add docs/AUDITORIA-SITE-ATUAL.md docs/_uptime-arguto.log docs/_lighthouse/ \
        .github/workflows/pages.yml prompt-apresentacao.md
git commit -m "docs: auditoria técnica do site atual da Arguto

Medição com Lighthouse 12.8.2, Chromium automatizado e requisições HTTP
diretas, em viewports de 320 a 1920px. Inclui log de disponibilidade
(queda de ~19 min confirmada de duas redes independentes) e os relatórios
brutos do Lighthouse para desktop e mobile.

Workflow ganha a etapa que publica a página de diagnóstico em /diagnostico/,
sem afetar a home em /."

# 2) A página de apresentação
git add apresentacao/diagnostico-arguto.html
git commit -m "feat: página de diagnóstico técnico para apresentação comercial"

git push origin main
```

Se `git add` reclamar de arquivo inexistente, remova só esse caminho da linha e siga — não interrompa a sequência.

### Passo 2 — acompanhar o deploy até o fim

```bash
gh run watch --exit-status
```

Se falhar, leia o log e **conserte**:

```bash
gh run view --log-failed
```

**Nunca** desative uma etapa do workflow para "fazer passar". Se o erro estiver na sua página HTML, corrija a página. Se estiver na etapa de cópia, corrija o caminho do arquivo.

### Passo 3 — verificar as duas URLs (obrigatório antes de declarar pronto)

```bash
curl -s -o /dev/null -w "home        %{http_code}\n" https://renanrigoni.github.io/arguto-home/
curl -s -o /dev/null -w "diagnostico %{http_code}\n" https://renanrigoni.github.io/arguto-home/diagnostico/
```

**As duas precisam retornar `200`.** Se a home retornar qualquer outra coisa, você quebrou algo — conserte antes de encerrar. Se o diagnóstico não responder, aguarde ~1 min (propagação do Pages) e teste de novo; se persistir, investigue o log do deploy.

### Passo 4 — conferir a página publicada de verdade

Abra `https://renanrigoni.github.io/arguto-home/diagnostico/` e confirme:

- as fontes carregaram (não caiu no fallback)
- o logo aparece
- nenhuma imagem quebrada
- sem rolagem horizontal em 390px de largura
- nenhum erro no console

Corrija e republique se algo estiver errado. **Só encerre com a página funcionando no ar.**

### Regras invioláveis

- **Não** altere `arguto-web/`, `next.config.ts` nem o workflow. A home já está no ar.
- O repositório é **público**. Nada de preço negociado, dado de cliente, credencial ou informação confidencial da Arguto na página. Só os achados técnicos deste prompt.
- **Não pergunte nada ao Renan.** Decida e execute.

### Relatório final para o Renan

Ao terminar, deixe uma mensagem curta com:

1. As duas URLs, com o status HTTP de cada uma
2. O que foi commitado (os dois commits)
3. Qualquer decisão que você tomou fora do previsto neste prompt
4. Qualquer coisa que ficou pendente ou que ele deva revisar antes da reunião

---

## 13. O espírito da coisa

O Renan não vai vender "site bonito". Vai vender **conserto de um problema que está custando dinheiro hoje**.

A página precisa provocar três reações, nessa ordem:

1. **"Eu não sabia disso."** — os números medidos, especialmente o alerta de segurança no `www` e os 22,7 segundos.
2. **"Isso está me custando venda."** — a tradução para o negócio.
3. **"E ele já sabe como resolver."** — os três baldes, com prazo e clareza.

Sem alarmismo, sem exagero, sem termo técnico solto. **Confiança vem da precisão, não do susto.**
