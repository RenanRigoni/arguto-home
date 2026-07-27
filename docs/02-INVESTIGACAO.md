# Roteiro de Investigação Técnica — Discovery

**Objetivo:** confirmar, com evidência, que cada funcionalidade do site atual
pode ser reutilizada pelo novo frontend — e identificar exatamente onde não pode.
**Duração:** 16 h · semana 1
**Substitui:** `02-INTEGRACAO.md` v1.0 (arquivado — propunha construir APIs
novas, premissa descartada)

---

## 0. Regra do discovery

Para **cada** funcionalidade, a pergunta não é "como eu construiria isso?".
A pergunta é, nesta ordem:

1. Como o site atual obtém essa informação?
2. Existe endpoint, AJAX, WebMethod, handler ou controller já pronto?
3. Essa chamada pode ser consumida pelo novo frontend como está?
4. Se não, qual é a **menor** alteração possível do lado deles?
5. A URL/rota atual pode ser preservada?
6. Dá para trocar só a camada visual?

**Só se as seis respostas falharem** é que se cogita algo novo — e aí a
justificativa vai por escrito neste documento, com o motivo técnico.

Nenhuma linha de código do novo frontend é escrita antes deste roteiro estar
respondido.

---

## 1. O que já foi investigado (26/07/2026)

Feito sem nenhum acesso ao cliente, por requisição direta a produção. Não
precisa ser refeito.

| Achado | Status |
|---|---|
| `_ajax_busca.aspx?Palavra=X&format=json` retorna **JSON real** | ✅ confirmado |
| `ProdutoAjax.aspx?Offset&CodDepartamento&CodCategoria` retorna HTML, público, HTTP 200 | ✅ confirmado |
| `ProdutoAjax.aspx` **ignora** `&format=json` | ✅ confirmado |
| `_salva_produto.aspx?CodProduto=X&Qtd=N` — GET simples, sem ViewState | ✅ confirmado |
| `_salva_produto.aspx` retorna `<script>`, **sem status legível** | ✅ confirmado |
| `_ajax_carrinho_topo.aspx` retorna fragmento HTML, sessão por cookie | ✅ confirmado |
| `/Login/` usa `__VIEWSTATE` + `__EVENTVALIDATION` + `ctl00$PH_Content$*` | ✅ confirmado |
| Cookies `010101_CCLIID`, `010101_CCLICOD`, `010101_CCAR`, `path=/` | ✅ confirmado |
| Estoque (`EST`) e múltiplo (`MUL`) renderizados como variáveis JS na página | ✅ confirmado |
| Validação de estoque/múltiplo é **client-side apenas** | ✅ confirmado |
| Mapa completo de rotas públicas | ✅ confirmado |
| gzip ativo · `robots.txt` 404 · `sitemap.xml` 404 | ✅ confirmado |

Detalhamento em [01-ESCOPO.md §2](01-ESCOPO.md) e
[03-AUDITORIA-FRONTEND.md](03-AUDITORIA-FRONTEND.md).

---

## 2. O único pedido de acesso

> **Uma credencial de cliente de teste**, com preço, estoque e limite de crédito
> configurados, autorizada a gerar pedido em ambiente de homologação — ou em
> produção com pedido posteriormente cancelado.

Sem isso, metade da jornada é caixa-preta e o orçamento da área logada vira
chute.

Não é pedido: acesso ao Protheus · acesso ao banco · VPN · acesso ao portal ADM
· dados de cliente real · exportação de base.

**Se M5 (reskin da área logada) for contratado**, some-se: acesso ao
código-fonte das `.aspx` e ao processo de publicação no IIS. Se não houver, ver
§7.

---

## 3. Investigação em rede — jornada anônima

Ferramenta: DevTools → Network, "Preserve log", "Disable cache".

### 3.1 Home

- [ ] Listar toda requisição, com tamanho e tempo
- [ ] Identificar o recurso do LCP
- [ ] Confirmar quais são render-blocking
- [ ] Verificar se banner desktop e mobile são baixados juntos
- [ ] Confirmar as 3 tags Google (`G-XV1YMHHS5T`, `G-1XH1ZS571S`, `GTM-WMKFD6P`)
- [ ] Capturar a estrutura do menu — todos os departamentos e categorias

### 3.2 Listagem

- [ ] Interceptar `ProdutoAjax.aspx` na paginação e capturar **todos** os
      parâmetros aceitos
- [ ] Testar: subcategoria filtra? fornecedor? grupo? canal?
- [ ] Existe parâmetro de ordenação?
- [ ] Qual é o tamanho da página (quantos produtos por `Offset`)?
- [ ] Qual o comportamento quando `Offset` passa do fim?
- [ ] Existe contador total de produtos em algum lugar?

### 3.3 Produto

- [ ] Confirmar todos os campos renderizados na tabela de características
- [ ] Confirmar padrão de imagem: `Trat_` vs `Thumb_` vs `T_`
- [ ] Existe galeria com múltiplas imagens ou só uma?
- [ ] "Produtos semelhantes" — qual é o critério? Vem do Protheus?
- [ ] `EST` e `MUL` são sempre renderizados, mesmo deslogado?

### 3.4 Busca

- [ ] Confirmar limite de resultados do `_ajax_busca.aspx`
- [ ] O campo `LinhaDiv` significa o quê?
- [ ] Busca por código de produto funciona?
- [ ] Existe página de resultado completo, além do autocomplete?
- [ ] Comportamento com acento, plural, termo inexistente

---

## 4. Investigação em rede — jornada autenticada

**Bloco crítico.** Só executável com a credencial de teste.

### 4.1 Login

- [ ] Capturar o POST completo de `/Login/`: todos os campos, todos os headers
- [ ] Registrar todo `Set-Cookie` da resposta
- [ ] O redirect pós-login vai para onde?
- [ ] Existe "esqueci a senha"? Qual o fluxo?
- [ ] Sessão expira em quanto tempo?
- [ ] Comportamento com CPF/CNPJ inexistente, senha errada, cliente bloqueado

### 4.2 Cadastro

- [ ] Capturar o fluxo completo (`ctl00$PH_Content$CPFCNPJCad` → ?)
- [ ] Quantas etapas? Quais campos?
- [ ] Cadastro cai direto no Protheus ou fica pendente de aprovação?
- [ ] Existe validação de CNPJ contra base externa?

### 4.3 Preço — **a pergunta mais importante do discovery**

- [ ] O preço aparece na **listagem** ou só na página de produto?
- [ ] O preço vem no HTML renderizado ou via AJAX separado?
- [ ] **Se for AJAX:** capturar endpoint, parâmetros e formato → possivelmente
      reutilizável direto pelo frontend novo
- [ ] **Se vier no HTML:** confirma a decisão de manter a listagem com preço
      dentro do legado reskinado (§4.4 do escopo)
- [ ] Existe preço promocional / tabela de oferta separada?
- [ ] Como aparece produto sem preço para aquele cliente?

Esta resposta define se a listagem com preço é reconstruída em Next.js ou
apenas reskinada. É a maior variável de esforço do projeto inteiro.

### 4.4 Carrinho

- [ ] `_salva_produto.aspx` **revalida estoque e múltiplo no servidor?**
      → testar com `curl` e `Qtd` inválido. **Resposta vai no relatório de
      segurança independente do contrato.**
- [ ] Como se altera quantidade de item já no carrinho? Endpoint?
- [ ] Como se remove item? Endpoint?
- [ ] Como se limpa o carrinho?
- [ ] O carrinho persiste entre sessões ou vive só no cookie `010101_CCAR`?
- [ ] O que acontece quando um produto no carrinho fica sem estoque?
- [ ] `/Carrinho/` usa ViewState? Capturar todos os campos

### 4.5 Checkout e pedido

- [ ] Quantas etapas até o pedido gravar?
- [ ] Onde entra o frete? Qual a regra? É calculado ou é tabela?
- [ ] Onde entra a condição de pagamento?
- [ ] Onde entra o pedido mínimo? Valor ou quantidade?
- [ ] Como o limite/bloqueio de crédito se manifesta na tela?
- [ ] **Existe proteção contra duplo envio?** Testar duplo clique
- [ ] Qual o retorno após gravar? Número de pedido? Vem do Protheus na hora?
- [ ] Existe e-mail de confirmação? Sai de onde?

### 4.6 Meus Pedidos e Meus Dados

- [ ] Quais campos são listados?
- [ ] Existe detalhe do pedido? Rastreio? Status vem do Protheus?
- [ ] Há paginação ou filtro por período?
- [ ] Meus Dados é leitura ou edição? Edição grava onde?

---

## 5. Investigação no código-fonte

Só se houver acesso. Cada item confirmado no código economiza horas de
tentativa e erro.

### 5.0 Modo de publicação — **fazer isto primeiro**

Decide se M5 é viável **sem** a solution do Visual Studio, sem compilador e sem
o desenvolvedor original. É a checagem de maior retorno do discovery inteiro, e
qualquer pessoa com acesso à pasta do site no servidor responde em 5 minutos.

| # | Verificar na pasta do site | Se sim |
|---|---|---|
| 1 | Os arquivos `.aspx` abrem no Bloco de Notas e contêm HTML legível? | markup editável direto |
| 2 | Existem arquivos `.aspx.cs` ao lado dos `.aspx`? | code-behind também editável |
| 3 | O que há em `/bin/`? Muitas DLLs com o nome do projeto? | lógica compilada, trancada |
| 4 | Existe `PrecompiledApp.config` na raiz? | **precompilado — nada é editável** |

| Cenário | `.aspx` | `.aspx.cs` | Consequência |
|---|---|---|---|
| **Web Site Project** | legível | presente | escopo completo; A-01/02/03 viáveis sem o dev original |
| **Híbrido** | legível | ausente, DLLs em `/bin/` | M5 vive; A-01/02/03 morrem; preço mantido |
| **Precompilado** | stub | ausente | nada editável; projeto vira só vitrine pública, **−R$ 2.000** |

Indícios favoráveis já observados: hospedagem Plesk Windows (deploy por FTP é o
caminho padrão), páginas AJAX soltas (`_salva_produto.aspx`, `_ajax_busca.aspx`,
`ProdutoAjax.aspx`) no layout típico de Web Site Project, e blocos `<script>`
com valor renderizado inline (`var EST = 2910;`) — padrão de markup editável.

**Em Web Site Project o ASP.NET recompila sozinho no primeiro request após a
alteração.** Editar markup não exige Visual Studio nem build.

### 5.1 Estrutura

- [ ] `.aspx` são WebForms puro ou há MVC/WebAPI convivendo?
- [ ] Existe uma master page única? Quantas?
- [ ] O CSS/JS é referenciado na master ou repetido por página?
- [ ] Existe bundling do ASP.NET (`ScriptBundle`/`StyleBundle`) ou tags soltas?
- [ ] Versionado em Git? Existe ambiente de homologação?
- [ ] Existe backup do site além do servidor de produção?

### 5.2 O que responde às perguntas de reuso

- [ ] Como `_ajax_busca.aspx` produz JSON — que padrão foi usado?
      **É esse padrão que se pede replicado no `ProdutoAjax.aspx` (A-01).**
- [ ] `ProdutoAjax.aspx` monta HTML em string ou usa Repeater?
      String é mais fácil de bifurcar em JSON.
- [ ] Existe camada de acesso a dados isolada, ou SQL dentro do code-behind?
- [ ] Existe alguma classe de serviço já retornando objeto (não HTML)?

### 5.3 Riscos escondidos

- [ ] Existe lógica de negócio dentro de arquivo `.js`?
      **Se sim, ela é perdida ao reescrever o frontend e precisa ser mapeada
      item a item.** Este é o maior risco não-óbvio do projeto.
- [ ] Existe `Session[...]` guardando algo além de identidade?
- [ ] Existe dependência de `Request.UrlReferrer` ou `parent.history.back()`?
      (o `_salva_produto.aspx` usa `parent.history.back()` — quem mais usa?)

---

## 6. Investigação de infraestrutura

- [ ] Versão exata do IIS e do .NET
- [ ] Servidor é dedicado, VPS ou compartilhado?
- [ ] Existe CDN na frente? (evidência atual: não)
- [ ] Brotli está habilitado além do gzip?
- [ ] HTTP/2 ou HTTP/3?
- [ ] Quem controla o DNS de `arguto.com.br`?
- [ ] É possível criar `origin.arguto.com.br` apontando para o IIS atual?
      **Requisito da arquitetura de rewrite (§4.5 do escopo).**
- [ ] O servidor aceita requisição server-side vinda de IP externo (Vercel)?
- [ ] Existe WAF, rate limit ou bloqueio por User-Agent?
- [ ] Qual a janela de manutenção aceitável?

---

## 7. As perguntas de processo

Curtas, e decidem mais que qualquer detalhe técnico.

| # | Pergunta | Por que decide |
|---|---|---|
| P-01 | **Quem mantém o ASP.NET hoje — TI interna ou fornecedor externo?** | se for externo, ele controla o acesso ao código e tem incentivo para travar. Muda M5 e o risco R-01 inteiro |
| P-01b | O desenvolvedor que construiu o site era **CLT ou PJ**? | CLT → o código é da empresa e provavelmente está no servidor. PJ contratado por projeto → pode nunca ter havido entrega de fonte. **Ter servidor próprio não implica ter o código.** Responder junto com §5.0 |
| P-02 | Quem pode aprovar uma alteração no código do site? | define se A-01/A-02/A-03 são viáveis |
| P-03 | Existe ambiente de homologação? | sem ele, todo teste é em produção |
| P-04 | Qual o prazo típico de uma alteração pequena no site hoje? | calibra o cronograma das adaptações |
| P-05 | Quem decide sobre o Google Tag / analytics? | consolidar 3 contêineres em 1 é decisão de marketing |
| P-06 | Existe intenção de trocar o Protheus ou o portal ADM nos próximos 24 meses? | mudaria a arquitetura inteira |
| P-07 | Quantos clientes ativos usam o site hoje? Qual o volume de pedidos? | dimensiona a janela de go-live e o risco |

**P-01 é a pergunta que decide o projeto.** Se o ASP.NET é mantido por
fornecedor externo, o realismo manda assumir que A-01, A-02 e A-03 serão
recusados ou cobrados caro, e o escopo deve ser fechado sem depender deles.

---

## 8. Decisões que saem do discovery

Preencher e assinar ao fim da semana 1.

| # | Decisão | Opções | Definido |
|---|---|---|---|
| D-01 | Credencial de teste liberada | sim / não | |
| D-02 | Acesso ao código das `.aspx` | sim / não | |
| D-03 | A-01 — `format=json` no `ProdutoAjax.aspx` | aceito / recusado | |
| D-04 | A-02 — status JSON no `_salva_produto.aspx` | aceito / recusado | |
| D-05 | A-03 — validação server-side de estoque/múltiplo | aceito / recusado | |
| D-06 | `origin.arguto.com.br` pode ser criado | sim / não | |
| D-07 | Listagem com preço: reconstruída ou reskinada | Next.js / legado | |
| D-08 | M5 (reskin da área logada) permanece no escopo | sim / não | |
| D-09 | Ambiente de homologação disponível | sim / não | |
| D-10 | Janela de go-live | data | |

### Impacto de cada recusa

| Decisão | Se "não" |
|---|---|
| D-01 | área logada sai do escopo; preço fica −R$ 3.500 e só a vitrine pública é entregue |
| D-02 / D-08 | M5 sai; **−28 h, −R$ 2.000**; área logada continua com a aparência atual |
| D-03 | +10 h de parser HTML no adaptador, absorvidas sem alterar preço |
| D-04 | +6 h e UX pior no adicionar-ao-carrinho, absorvidas |
| D-05 | vulnerabilidade permanece; registrada por escrito e assinada por eles |
| D-06 | plano B: reverse proxy no IIS deles, ou área logada em subdomínio próprio |
| D-07 = "legado" | M3 cai ~6 h; listagem com preço fica reskinada |
| D-09 | testes em produção fora de horário comercial; risco documentado |

---

## 9. Plano B

Se ao fim da semana 1 nada tiver sido liberado — sem credencial, sem código,
sem alteração possível:

1. **O discovery encerra.** A execução não começa.
2. Entrega do relatório técnico: auditoria de frontend completa, achado de
   segurança R-06, mapa de rotas e endpoints, plano de correção priorizado.
3. Proposta alternativa: **redesign apenas da vitrine pública anônima**, sem
   nenhuma dependência deles — é integralmente viável com o que já foi
   levantado em 26/07 sem acesso algum.

O cliente gastou uma semana e a primeira parcela para descobrir isso. Não três
meses.

---

## 10. Checklist de aceite do discovery

Semana 1 só fecha com:

- [ ] Jornada logada completa gravada em HAR
- [ ] Todo endpoint mapeado com método, parâmetros, resposta e requisito de sessão
- [ ] Contrato de dados de cada adaptador de M2 escrito
- [ ] Todas as 10 decisões da §8 preenchidas e assinadas
- [ ] `_salva_produto.aspx` testado quanto a revalidação server-side
- [ ] Achado de segurança comunicado formalmente por escrito
- [ ] Latência do proxy Vercel → IIS medida (limite: 150 ms)
- [ ] ViewState validado atravessando o proxy
- [ ] Cronograma e preço confirmados ou reajustados com base no que se achou
