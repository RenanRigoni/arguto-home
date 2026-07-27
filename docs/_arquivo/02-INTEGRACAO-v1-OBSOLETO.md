# Contrato de Integração — E-commerce B2B Arguto

**Documento de discovery.** Levar para a reunião técnica com a TI / fornecedor do sistema atual.

**Objetivo:** definir *exatamente* quais dados o novo frontend precisa, em que
formato, com que frequência e por qual canal — para que o orçamento final seja
firme e o projeto não trave no meio.

**Nada aqui exige alteração no Protheus.** Tudo que é pedido já existe e já é
consumido pelo site atual.

---

## 0. Como usar este documento

1. Enviar as seções **1** e **2** antes da reunião (questionário + escolha de canal)
2. Na reunião, fechar o **canal de integração** (seção 2)
3. Validar o **contrato de dados** (seções 3 a 8) endpoint por endpoint
4. Preencher a **matriz de decisão** (seção 11) e assinar
5. Só depois disso o orçamento da fase de execução é fechado

Prazo do discovery: **2 semanas**.

---

## 1. Questionário técnico

### 1.1 Origem e sincronismo

| # | Pergunta | Resposta |
|---|---|---|
| 1.1 | O banco do site é SQL Server? Qual versão? | |
| 1.2 | Quem grava os dados do Protheus no banco do site — job agendado, integração TOTVS, serviço próprio ou middleware? | |
| 1.3 | Com que frequência roda? | |
| 1.4 | É full ou delta? Existe coluna de data de alteração por registro? | |
| 1.5 | O banco do site fica na mesma máquina do IIS ou em servidor separado? | |
| 1.6 | Existe réplica de leitura? | |

### 1.2 Produto e catálogo

| # | Pergunta | Resposta |
|---|---|---|
| 2.1 | Quantos SKUs ativos hoje? E no total (com inativos)? | |
| 2.2 | Quantos SKUs por canal (Varejo Alimentar / Food Service / Farma / Limpeza)? | |
| 2.3 | A tabela de produto do site é cópia da SB1 ou view com join? | |
| 2.4 | Os campos de hierarquia (departamento, categoria, subcategoria) vêm do Protheus ou são cadastrados só no portal admin? | |
| 2.5 | Existe campo de EAN / código de barras disponível? | |
| 2.6 | Existe peso, dimensão, unidade de medida, múltiplo de venda? | |
| 2.7 | Qual campo indica que o produto deve aparecer no site? | |
| 2.8 | Um produto pode pertencer a mais de um canal? | |

### 1.3 Portal administrativo B2B

| # | Pergunta | Resposta |
|---|---|---|
| 3.1 | O portal grava na **mesma** tabela do Protheus ou em tabela separada de override? | |
| 3.2 | Quais campos o portal permite sobrescrever? (descrição, imagem, destaque, ordem, texto rico?) | |
| 3.3 | Quando o Protheus sincroniza, ele **sobrescreve** o que o portal alterou? | |
| 3.4 | Quem usa o portal e com que frequência? | |
| 3.5 | O portal tem log de alteração / auditoria? | |
| 3.6 | O portal continua sendo a ferramenta oficial após o projeto? *(premissa: sim)* | |

### 1.4 Imagens

| # | Pergunta | Resposta |
|---|---|---|
| 4.1 | Confirmado o padrão `/content/produto/{empresa+filial}/{codigo}/{prefixo}_{timestamp}.{ext}`? | |
| 4.2 | O que diferencia `Trat_`, `Thumb_` e `T_`? Qual é a canônica? | |
| 4.3 | Um produto pode ter mais de uma imagem? Como se ordena? | |
| 4.4 | Existe registro em banco apontando a imagem, ou é convenção de nome de arquivo? | |
| 4.5 | Qual o volume total em disco? | |
| 4.6 | As imagens podem continuar servidas pelo domínio atual? *(premissa: sim)* | |

### 1.5 Cliente e preço

| # | Pergunta | Resposta |
|---|---|---|
| 5.1 | O preço vem de tabela de preço por cliente (DA0/DA1) ou é preço único por canal? | |
| 5.2 | Como o cliente é associado à tabela de preço? | |
| 5.3 | Existe desconto por volume, campanha ou verba de fornecedor? | |
| 5.4 | Onde ficam limite de crédito e bloqueio do cliente? | |
| 5.5 | Como funciona o cadastro de cliente novo hoje — aprovação manual? Quem aprova? | |
| 5.6 | Onde a senha do cliente é validada? Que algoritmo de hash? | |
| 5.7 | Um CNPJ pode ter múltiplos usuários? Um usuário pode ter múltiplos CNPJs? | |
| 5.8 | Existe regra de canal por cliente (cliente Farma não vê Varejo)? | |

### 1.6 Estoque e pedido

| # | Pergunta | Resposta |
|---|---|---|
| 6.1 | O estoque exibido é saldo real (SB2) ou saldo disponível já deduzido de empenho? | |
| 6.2 | Com que frequência o estoque atualiza? | |
| 6.3 | Como o pedido do site entra no Protheus hoje — gravação direta em SC5/SC6, staging table, ou API? | |
| 6.4 | Existe validação de pedido mínimo, múltiplo de caixa ou mix mínimo? Onde está a regra? | |
| 6.5 | Como o frete é calculado? Existe regra de frete grátis? | |
| 6.6 | O pedido entra já liberado ou fica pendente de aprovação comercial? | |
| 6.7 | O que acontece hoje se a gravação falhar? Existe retry? | |
| 6.8 | Existe número de pedido do site distinto do número do Protheus? | |

### 1.7 Infraestrutura e processo

| # | Pergunta | Resposta |
|---|---|---|
| 7.1 | Quem mantém o ASP.NET atual — TI interna ou fornecedor externo? | |
| 7.2 | Existe acesso ao código-fonte? Está versionado? Onde? | |
| 7.3 | Existe ambiente de homologação ou cópia do banco? | |
| 7.4 | É possível publicar um endpoint novo no IIS atual? Qual o processo e o prazo? | |
| 7.5 | Existe firewall/VPN? Quem autoriza liberação de IP? | |
| 7.6 | Qual a janela de manutenção aceitável para o cutover? | |
| 7.7 | Quem é o responsável técnico e o responsável de negócio pelo projeto? | |
| 7.8 | Existe política de segurança/LGPD documentada a seguir? | |

> **A pergunta 7.1 decide o projeto.** Se for fornecedor externo, ele pode travar
> a via A. Nesse caso ir direto para a via B com a TI interna.

---

## 2. Canal de integração — escolher UM

| | Via | Esforço | Requisito | Recomendação |
|---|---|---|---|---|
| **A** | Endpoint JSON no IIS atual | Baixo | Acesso ao código ASP.NET | ✅ **Preferida** |
| **B** | SQL Server read-only via VPN | Médio | Liberação de rede + IP fixo | Alternativa |
| **C** | API REST do Protheus (TLPP) | Alto | Fila com time TOTVS | Evitar |
| — | Parse do HTML de `/v1/ProdutoAjax.aspx` | — | — | ❌ **Só protótipo** |

### Por que a via A

O `/v1/ProdutoAjax.aspx` **já faz a consulta** que precisamos — só devolve HTML
em vez de JSON. Transformar em endpoint JSON é trocar a saída, não escrever
lógica nova. Estimativa: **150 a 250 linhas**, 1 a 2 dias de um dev ASP.NET.

Vantagens sobre a via B:
- Não expõe credencial de banco
- Não exige liberação de firewall nem IP fixo
- A TI mantém controle total sobre o que é exposto
- Auditável: dá pra logar cada chamada

### Sobre a via B

A Vercel não fornece IP de saída fixo nos planos padrão. Ligar direto no SQL
Server exigiria túnel dedicado ou expor a porta 1433 — **não recomendado**.
Se a via B for a escolhida, será necessário um worker intermediário em infra com
IP fixo, o que adiciona **~24h** ao projeto e um ponto de falha a mais.

---

## 3. Autenticação entre sistemas

| Item | Definição |
|---|---|
| Transporte | HTTPS obrigatório, TLS 1.2+ |
| Autenticação | `Authorization: Bearer <token>` |
| Token | Gerado pela TI, rotacionável, mínimo 32 bytes aleatórios |
| Escopo | Um token para leitura de catálogo, outro para operações de cliente/pedido |
| Restrição de origem | Allowlist de IP se viável, ou validação de token apenas |
| Rate limit | A definir pela TI — sugerido 600 req/min para catálogo |
| Guarda do segredo | Variável de ambiente na Vercel. Nunca em repositório. |
| Rotação | Suportar dois tokens válidos simultâneos durante a troca |

Endpoints de **catálogo** (seções 4 e 5) não retornam dado pessoal nem preço —
podem ter token de menor privilégio.

Endpoints de **cliente, preço e pedido** (seções 6 a 8) tratam dado sensível e
exigem token separado, com log de acesso.

---

## 4. `GET /api/catalogo/estrutura`

Hierarquia completa. Consumido pelo sync, não pelo usuário. Chamado 4x/dia.

```json
{
  "geradoEm": "2026-07-26T14:00:00-03:00",
  "canais": [
    { "id": 1, "codigo": "1", "nome": "VAREJO ALIMENTAR" },
    { "id": 2, "codigo": "2", "nome": "FOOD SERVICE" },
    { "id": 3, "codigo": "3", "nome": "FARMA" }
  ],
  "departamentos": [
    { "codigo": "000900", "nome": "ALIMENTOS", "canalId": 1, "ativo": true }
  ],
  "categorias": [
    { "codigo": "000500", "nome": "BISCOITOS", "departamentoCodigo": "000900", "ativo": true }
  ],
  "subcategorias": [
    { "codigo": "000002", "nome": "BISCOITOS RECHEADOS", "categoriaCodigo": "000500", "ativo": true }
  ],
  "fornecedores": [
    {
      "codigo": "000320", "loja": "01", "nome": "AYMORE",
      "nomeReduzido": "AYMORE",
      "logoUrl": "/content/Fornecedor/11032024_145453.png",
      "ativo": true
    }
  ],
  "grupos": [
    { "codigo": "0001", "nome": "AYM NEUTROS", "fornecedorCodigo": "000320", "fornecedorLoja": "01" }
  ]
}
```

**Confirmar:** o site atual usa fornecedor concatenado (`00032001` = `A2_COD` + `A2_LOJA`).
Manter os campos separados no payload e concatenar na aplicação.

---

## 5. `GET /api/catalogo/produtos`

Paginado. Suporta delta.

**Query params**

| Param | Tipo | Default | Descrição |
|---|---|---|---|
| `limit` | int | 500 | Máx. 1000 |
| `offset` | int | 0 | |
| `alteradoDesde` | ISO 8601 | — | Delta. Ausente = full |
| `canal` | string | — | Filtro opcional |

```json
{
  "total": 8421,
  "limit": 500,
  "offset": 0,
  "geradoEm": "2026-07-26T14:00:00-03:00",
  "produtos": [
    {
      "codigo": "019563",
      "descricaoProtheus": "AYMORE MAIZENA CHOCOLATE 170G (40)",
      "descricaoSite": "BISCOITO AYMORE MAIZENA CHOCOLATE 170G",
      "descricaoLonga": null,
      "ean": "7896058257434",
      "unidadeMedida": "CX",
      "multiploVenda": 40,
      "pesoBruto": 6.8,
      "canalId": 1,
      "departamentoCodigo": "000900",
      "categoriaCodigo": "000500",
      "subcategoriaCodigo": "000002",
      "fornecedorCodigo": "000320",
      "fornecedorLoja": "01",
      "grupoCodigo": "0001",
      "imagens": [
        { "tipo": "trat",  "url": "/content/produto/010101/019563/Trat_10032023_165250.png",  "ordem": 1 },
        { "tipo": "thumb", "url": "/content/produto/010101/019563/Thumb_10032023_165250.png", "ordem": 1 }
      ],
      "ativo": true,
      "exibirNoSite": true,
      "atualizadoEm": "2026-05-13T15:47:04-03:00"
    }
  ]
}
```

### Regras

- `descricaoProtheus` = `B1_DESC` original. **Nunca sobrescrever.** Usada no slug e na ficha técnica.
- `descricaoSite` = override do portal admin. `null` quando não existe → aplicação usa a do Protheus.
- `atualizadoEm` é **obrigatório** para o delta funcionar. Sem ele, todo sync é full.
- `exibirNoSite` controla visibilidade. Produto que sai do ar precisa continuar aparecendo na lista com `false` — para a aplicação removê-lo do índice e do sitemap. **Sumir do payload não basta.**

---

## 6. Preço e estoque — tempo real, sem cache

### `POST /api/cliente/precos`

Consulta em lote. A vitrine pode pedir 24 produtos de uma vez — **nunca 24 requisições**.

```json
// requisição
{
  "clienteCodigo": "000123",
  "clienteLoja": "01",
  "produtos": ["019563", "021601", "019022"]
}

// resposta
{
  "tabelaPreco": "005",
  "precos": [
    {
      "produtoCodigo": "019563",
      "precoUnitario": 4.87,
      "precoEmbalagem": 194.80,
      "multiplo": 40,
      "descontoPercentual": 0,
      "campanha": null,
      "disponivel": true
    },
    { "produtoCodigo": "021601", "disponivel": false, "motivo": "SEM_TABELA" }
  ]
}
```

### `POST /api/estoque`

```json
// requisição
{ "produtos": ["019563", "021601"] }

// resposta
{
  "estoque": [
    { "produtoCodigo": "019563", "disponivel": 340, "unidade": "CX" },
    { "produtoCodigo": "021601", "disponivel": 0,   "unidade": "CX" }
  ]
}
```

**Confirmar:** `disponivel` deve ser saldo **já deduzido de empenho** (`B2_QATU - B2_QEMP`),
não saldo bruto. Vender estoque empenhado gera cancelamento.

---

## 7. Cliente e autenticação

### `POST /api/cliente/login`

A validação de senha **continua no backend atual**. O novo frontend só consome o resultado.

```json
// requisição
{ "documento": "00307402000133", "senha": "..." }

// resposta 200
{
  "clienteCodigo": "000123",
  "clienteLoja": "01",
  "razaoSocial": "MERCADO EXEMPLO LTDA",
  "nomeFantasia": "Mercado Exemplo",
  "cnpj": "00307402000133",
  "canalId": 1,
  "tabelaPreco": "005",
  "limiteCredito": 50000.00,
  "creditoUtilizado": 12300.00,
  "bloqueado": false,
  "motivoBloqueio": null,
  "cnpjsVinculados": [
    { "codigo": "000123", "loja": "01", "cnpj": "00307402000133", "apelido": "Matriz" },
    { "codigo": "000123", "loja": "02", "cnpj": "00307402000214", "apelido": "Filial Centro" }
  ]
}

// resposta 401
{ "erro": "CREDENCIAL_INVALIDA" }

// resposta 403
{ "erro": "CLIENTE_BLOQUEADO", "motivo": "Inadimplência" }
```

**Nunca** retornar hash de senha no payload.

### `POST /api/cliente/cadastro`

Cadastro de cliente novo. Retorna protocolo, não acesso imediato — aprovação
comercial continua como é hoje.

```json
{ "protocolo": "2026-004821", "status": "AGUARDANDO_APROVACAO" }
```

---

## 8. Pedido

### `POST /api/pedido` — **endpoint crítico**

```json
// requisição
{
  "idempotencyKey": "a3f8c1e2-9b4d-4e77-8a12-5c6f0d1e2b39",
  "clienteCodigo": "000123",
  "clienteLoja": "01",
  "canalId": 1,
  "condicaoPagamento": "030",
  "observacao": "Entregar pela manhã",
  "itens": [
    { "produtoCodigo": "019563", "quantidade": 5, "precoUnitario": 4.87 },
    { "produtoCodigo": "021601", "quantidade": 2, "precoUnitario": 9.10 }
  ]
}

// resposta 201
{
  "numeroPedido": "045821",
  "numeroPedidoProtheus": "045821",
  "status": "RECEBIDO",
  "valorTotal": 1156.20,
  "valorFrete": 0,
  "previsaoEntrega": "2026-07-30"
}

// resposta 409 — regra de negócio
{
  "erro": "PEDIDO_MINIMO_NAO_ATINGIDO",
  "mensagem": "Pedido mínimo para o canal Varejo Alimentar é R$ 1.500,00",
  "detalhe": { "valorAtual": 1156.20, "valorMinimo": 1500.00 }
}

// resposta 422 — item inválido
{
  "erro": "ITEM_INVALIDO",
  "itens": [
    { "produtoCodigo": "021601", "erro": "ESTOQUE_INSUFICIENTE", "disponivel": 0 }
  ]
}
```

### Idempotência — obrigatório

`idempotencyKey` é gerada pelo frontend e **precisa ser persistida pelo backend**.

Chamada repetida com a mesma chave deve retornar **o pedido já criado**, não criar
outro. Sem isso: cliente clica duas vezes ou a rede oscila → dois pedidos no
Protheus → cancelamento manual e cliente irritado.

**Se o backend atual não suportar idempotência, isso precisa ser construído.**
É o único item deste documento que pode exigir desenvolvimento novo do lado deles.
Estimar em conjunto na reunião.

### `GET /api/cliente/pedidos` e `GET /api/cliente/pedido/{numero}`

```json
{
  "numeroPedido": "045821",
  "emissao": "2026-07-26",
  "status": "FATURADO",
  "valorTotal": 1156.20,
  "notaFiscal": { "numero": "0012345", "serie": "1", "chave": "3526...", "danfeUrl": null },
  "itens": [
    {
      "produtoCodigo": "019563",
      "descricao": "BISCOITO AYMORE MAIZENA CHOCOLATE 170G",
      "quantidade": 5, "quantidadeAtendida": 5,
      "precoUnitario": 4.87, "total": 974.00
    }
  ]
}
```

**Confirmar:** lista de status possíveis e o significado de cada um.

---

## 9. Mapeamento Protheus (referência)

Nomenclatura padrão TOTVS. **Confirmar customizações** — o campo pode ter outro nome.

| Payload | Tabela | Campo padrão |
|---|---|---|
| `produto.codigo` | SB1 | `B1_COD` |
| `produto.descricaoProtheus` | SB1 | `B1_DESC` |
| `produto.grupoCodigo` | SB1 | `B1_GRUPO` |
| `produto.unidadeMedida` | SB1 | `B1_UM` |
| `produto.ean` | SB1 | `B1_CODBAR` |
| `produto.pesoBruto` | SB1 | `B1_PESBRU` |
| `produto.ativo` | SB1 | `B1_MSBLQL` (invertido) |
| `grupo.nome` | SBM | `BM_DESC` |
| `fornecedor.codigo` / `.loja` | SA2 | `A2_COD` / `A2_LOJA` |
| `fornecedor.nome` | SA2 | `A2_NREDUZ` |
| `cliente.codigo` / `.loja` | SA1 | `A1_COD` / `A1_LOJA` |
| `cliente.cnpj` | SA1 | `A1_CGC` |
| `cliente.limiteCredito` | SA1 | `A1_LC` |
| `cliente.bloqueado` | SA1 | `A1_MSBLQL` |
| `preco.tabelaPreco` | DA0 | `DA0_CODTAB` |
| `preco.precoUnitario` | DA1 | `DA1_PRCVEN` |
| `estoque.disponivel` | SB2 | `B2_QATU - B2_QEMP` |
| pedido cabeçalho | SC5 | — |
| pedido itens | SC6 | — |
| empresa/filial (`010101`) | SM0 | — |

Departamento, categoria e subcategoria **não são padrão Protheus** — provavelmente
campos customizados na SB1 ou tabela própria do site. **Confirmar origem (pergunta 2.4).**

---

## 10. Ambiente e SLA

| Item | Requisito |
|---|---|
| Homologação | Endpoints replicados com dado de teste, ou cópia do banco |
| Dado de teste | Mínimo 3 clientes com tabelas de preço distintas |
| Disponibilidade | Catálogo pode falhar (temos cache). Preço/pedido não. |
| Tempo de resposta | Catálogo < 5 s por página. Preço < 800 ms. Pedido < 3 s. |
| Janela de manutenção | Informada com 48h de antecedência |
| Contato de incidente | Nome, telefone e e-mail do responsável técnico |

---

## 11. Matriz de decisão — preencher e assinar

| Decisão | Opção escolhida | Responsável | Prazo |
|---|---|---|---|
| Canal de integração | ☐ A · ☐ B · ☐ C | | |
| Quem desenvolve os endpoints (via A) | ☐ TI interna · ☐ Fornecedor · ☐ Freelancer | | |
| Ambiente de homologação | ☐ Sim · ☐ Não · ☐ Cópia de banco | | |
| Idempotência de pedido já existe? | ☐ Sim · ☐ Não → estimar | | |
| Frequência do sync de catálogo | ☐ 4x/dia · ☐ outro: ____ | | |
| Imagens continuam na infra atual? | ☐ Sim · ☐ Não | | |
| Portal admin permanece? | ☐ Sim · ☐ Não | | |
| Responsável técnico do cliente | | | |
| Responsável de negócio do cliente | | | |

---

## 12. Checklist de aceite da integração

Antes de iniciar a fase de execução, todos precisam estar ✅:

- [ ] Canal de integração definido e acessível em homologação
- [ ] Token emitido e testado
- [ ] `GET /catalogo/estrutura` retornando hierarquia completa
- [ ] `GET /catalogo/produtos` paginando corretamente
- [ ] Delta (`alteradoDesde`) retornando só o alterado
- [ ] Produto desativado aparecendo com `exibirNoSite: false`
- [ ] `POST /cliente/precos` respondendo em lote < 800 ms
- [ ] `POST /estoque` retornando saldo já deduzido de empenho
- [ ] `POST /cliente/login` validando credencial real
- [ ] `POST /pedido` gravando no Protheus em homologação
- [ ] `POST /pedido` **idempotente** — chave repetida não duplica
- [ ] `GET /cliente/pedidos` retornando histórico real
- [ ] Lista de status de pedido documentada
- [ ] Imagens acessíveis por URL pública com CORS liberado
- [ ] Matriz de decisão (seção 11) assinada

---

## 13. Plano B — se nada for liberado

Se ao fim do discovery nenhum canal for viável:

1. **Encerrar o discovery** com o relatório entregue (o cliente pagou por ele)
2. **Não iniciar** a fase de execução
3. Propor escopo alternativo sem integração:
   - Site institucional completo
   - Landing pages por fornecedor/campanha
   - Catálogo estático gerado de exportação CSV periódica

O discovery pago existe justamente para que este cenário custe **R$ 4.000 e duas
semanas** — em vez de descobrir no mês 3 de um projeto de seis meses.
