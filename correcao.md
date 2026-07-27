Quero corrigir uma premissa fundamental da análise anterior sobre a recriação do e-commerce B2B da Arguto.

NÃO quero reconstruir o sistema B2B do zero.

O objetivo do projeto é REDESENHAR e MODERNIZAR o frontend atual do arguto.com.br, reaproveitando ao máximo toda a estrutura, rotas, integrações, backend e regras de negócio que já existem.

Considere a seguinte premissa como obrigatória:

PROTHEUS → integração atual → backend/banco atual → site atual

deve passar a ser:

PROTHEUS → integração atual → backend/banco atual → NOVO FRONTEND

O Protheus continua intacto.

O portal administrativo B2B continua intacto.

O processo atual de cadastro de produtos continua intacto.

As regras comerciais existentes continuam intactas.

As rotas e mecanismos atuais de consulta e gravação devem ser reutilizados sempre que tecnicamente possível.

Não quero criar uma nova arquitetura simplesmente porque seria mais moderna.

O objetivo é substituir a INTERFACE, não o SISTEMA.

Hoje, por exemplo:

* o produto é cadastrado no Protheus;
* grupo, fornecedor/marca, categoria e demais relacionamentos já chegam ao site;
* preço por cliente já possui lógica existente;
* estoque já possui lógica existente;
* login e identificação do cliente já existem;
* carrinho possui regras existentes;
* pedido mínimo e múltiplos de embalagem já existem;
* limite/bloqueio do cliente já existe;
* frete já possui regra existente;
* pedidos já são gravados no Protheus;
* Meus Pedidos já consulta os pedidos;
* o portal ADM B2B permite alterar descrição, imagens e outros conteúdos dos produtos.

Tudo isso deve continuar funcionando.

Não quero criar novamente:

* API de produtos se já existe uma forma de obter os produtos;
* API de preço se a consulta atual pode ser reutilizada;
* API de estoque se a consulta atual pode ser reutilizada;
* sistema de autenticação novo;
* banco PostgreSQL apenas para duplicar o catálogo;
* sincronização Protheus → PostgreSQL;
* sistema novo de carrinho;
* regra nova de preço;
* regra nova de crédito;
* regra nova de frete;
* integração nova de pedidos com Protheus;
* CMS novo;
* portal administrativo novo;
* cadastro novo de produtos;
* estrutura paralela à operação atual.

Também NÃO quero alterar a rotina dos funcionários.

A experiência interna deve continuar sendo algo como:

PROTHEUS
→ cadastra produto e informações operacionais

PORTAL ADM B2B
→ adiciona/edita descrição, imagem e conteúdo web

SITE
→ apresenta essas informações ao cliente

A única diferença será que o último elemento passa a ser um frontend completamente redesenhado.

Portanto, antes de propor qualquer componente novo de backend, banco, API, middleware ou integração, investigue:

1. Como o site atual obtém essa informação?
2. Existe endpoint, request AJAX, WebMethod, handler ASP.NET, API, controller ou chamada já existente?
3. Essa chamada pode ser reutilizada pelo novo frontend?
4. Existe alguma razão real para substituí-la?
5. É possível preservar a URL/rota existente?
6. É possível apenas trocar a camada visual?

Priorize REUTILIZAÇÃO.

Exemplo:

Se atualmente:

Frontend ASP.NET
→ endpoint atual
→ regra comercial
→ Protheus

quero:

Novo frontend
→ MESMO endpoint, ou adaptação mínima
→ MESMA regra comercial
→ Protheus

Não:

Novo frontend
→ nova API
→ novo banco
→ nova regra comercial
→ nova integração
→ Protheus

Não devemos aumentar o risco e o custo do projeto sem necessidade.

O novo frontend pode utilizar Next.js, React, TypeScript ou outra stack moderna se isso fizer sentido, mas a stack escolhida deve se adaptar ao backend existente, e não obrigar a empresa a reconstruir a infraestrutura para atender ao frontend.

O trabalho esperado é principalmente:

* redesign da Home;
* redesign do Header e navegação;
* redesign do menu de departamentos/categorias;
* redesign das listagens de produtos;
* redesign de fornecedor/marca;
* redesign da busca;
* redesign da página de produto;
* redesign de ofertas;
* redesign de login;
* redesign de cadastro;
* redesign do carrinho;
* redesign do checkout;
* redesign de Meus Pedidos;
* redesign de Meus Dados;
* redesign das páginas institucionais;
* responsividade completa;
* melhoria de UX/UI;
* melhoria de performance;
* otimização de imagens;
* melhoria de SEO;
* acessibilidade;
* modernização visual geral.

Nas funcionalidades autenticadas, a intenção é construir uma nova interface para as funcionalidades existentes, e NÃO recriar suas regras de negócio.

Exemplo:

NOVO CARRINHO ≠ nova regra de carrinho.

NOVO CARRINHO = nova interface utilizando as regras e operações já existentes.

NOVO CHECKOUT ≠ nova integração com Protheus.

NOVO CHECKOUT = nova experiência visual acionando o processo de pedido existente.

NOVA PÁGINA DE PRODUTO ≠ novo cadastro de produto.

NOVA PÁGINA DE PRODUTO = nova apresentação dos dados já fornecidos pelo ecossistema atual.

Com base nisso, REFAÇA o escopo técnico anterior.

Quero que você:

1. Analise novamente a arquitetura do projeto assumindo que a prioridade absoluta é reutilizar o sistema existente.

2. Separe claramente:

   * EXISTENTE E PRESERVADO;
   * NOVO / REDESENHADO;
   * ADAPTAÇÃO MÍNIMA NECESSÁRIA.

3. Liste o que precisa ser investigado no código/network requests do sistema atual antes de definirmos qualquer nova arquitetura.

4. Identifique quais páginas/telas precisam apenas de redesign.

5. Identifique onde talvez seja necessária uma pequena camada adaptadora para permitir que o frontend moderno utilize uma funcionalidade antiga.

6. Não proponha PostgreSQL, novas APIs, sincronizadores, autenticação ou serviços novos sem antes demonstrar que a estrutura atual não pode ser reutilizada.

7. Recalcule o esforço de desenvolvimento considerando REDESIGN + INTEGRAÇÃO COM SISTEMA EXISTENTE, em vez de reconstrução completa do B2B.

8. Refaça o cronograma.

9. Reavalie quais tecnologias realmente são necessárias.

10. Aponte os principais riscos especificamente relacionados à reutilização do legado ASP.NET/Protheus.

11. Estruture o projeto para que o Protheus e o portal ADM não precisem sofrer nenhuma alteração, salvo se durante o discovery for comprovado tecnicamente que alguma pequena adaptação é inevitável.

12. Considere que quero comercializar esse projeto como freelancer, com investimento total próximo de R$ 15.000, então evite arquitetura excessivamente complexa e engenharia desnecessária. O projeto precisa ser profissional e seguro, mas proporcional ao objetivo real.

A ideia central é:

PRESERVAR O MOTOR.
TROCAR A CARROCERIA.

Não redesenhe a arquitetura inteira quando o que precisamos redesenhar é principalmente a experiência do usuário.

No final, apresente um NOVO ESCOPO TÉCNICO COMPLETO substituindo o anterior, já baseado nessa premissa.

IMPORTANTE: reutilizar a estrutura existente NÃO significa reutilizar os problemas técnicos do frontend atual.

Quero preservar as rotas, integrações, regras de negócio, Protheus, portal ADM e mecanismos funcionais existentes, mas quero SUBSTITUIR e CORRIGIR a camada frontend sempre que ela for responsável por problemas de performance, manutenção, acessibilidade ou experiência do usuário.

Na análise anterior foram identificados problemas como:

* home com aproximadamente 24 MB;
* cerca de 118 requisições;
* múltiplas versões de jQuery carregadas simultaneamente;
* Bootstrap carregado mais de uma vez;
* Popper duplicado;
* JavaScript e CSS redundantes;
* imagens sem otimização adequada;
* ausência de lazy loading;
* grande quantidade de imagens sem `alt`;
* possíveis recursos bloqueando renderização;
* arquitetura frontend antiga baseada em ASP.NET WebForms.

Esses problemas DEVEM ser corrigidos no redesign.

Portanto, diferencie claramente:

REUTILIZAR:

* endpoints existentes;
* rotas funcionais;
* integração com Protheus;
* regras de preço;
* estoque;
* autenticação;
* cadastro;
* carrinho;
* pedidos;
* regras comerciais;
* portal administrativo;
* estrutura de dados existente quando adequada.

NÃO REUTILIZAR OBRIGATORIAMENTE:

* HTML atual;
* CSS atual;
* JavaScript legado;
* jQuery;
* Bootstrap;
* Popper;
* plugins antigos;
* bundles existentes;
* componentes visuais;
* estrutura DOM;
* técnicas antigas de carregamento;
* dependências duplicadas;
* código frontend que prejudique performance ou manutenção.

A ideia é:

PRESERVAR BACKEND E REGRAS DE NEGÓCIO.
RECONSTRUIR O FRONTEND.

O frontend novo deve consumir as funcionalidades existentes de maneira mais eficiente.

Se hoje determinada funcionalidade exige uma chamada como:

Frontend ASP.NET antigo
→ endpoint existente
→ backend
→ Protheus

podemos substituir por:

Novo frontend
→ endpoint existente
→ backend
→ Protheus

sem carregar toda a estrutura JavaScript/CSS antiga que atualmente existe na página.

Quero que a nova análise também faça uma auditoria do frontend legado e classifique cada recurso encontrado como:

1. PRESERVAR;
2. SUBSTITUIR;
3. REMOVER;
4. CONSOLIDAR;
5. OTIMIZAR.

Analise especialmente:

* scripts JavaScript;
* bibliotecas duplicadas;
* CSS;
* frameworks;
* fontes;
* imagens;
* banners;
* chamadas de rede;
* requests AJAX;
* recursos de terceiros;
* analytics;
* pixels;
* plugins;
* dependências que bloqueiam renderização;
* tamanho dos bundles;
* quantidade de requisições;
* cache;
* compressão;
* lazy loading;
* carregamento de imagens;
* Core Web Vitals.

O objetivo é que o redesign não seja apenas visual.

Quero aproveitar o projeto para modernizar tecnicamente a camada frontend, melhorando:

* velocidade;
* responsividade;
* UX;
* acessibilidade;
* SEO;
* manutenção;
* estabilidade;
* peso das páginas;
* quantidade de requisições;
* Core Web Vitals.

Mas sem transformar essas melhorias em uma reconstrução desnecessária do backend.

A regra central continua sendo:

Se o problema está no FRONTEND → podemos reconstruir e melhorar.

Se algo no BACKEND já funciona corretamente → preferimos integrar e reutilizar.

Somente proponha alteração de backend quando houver uma limitação comprovada que impeça o novo frontend de funcionar corretamente.

Ao recalcular o escopo e as horas, inclua essas otimizações de frontend como parte do REDESIGN, e não como reconstrução do sistema B2B.
