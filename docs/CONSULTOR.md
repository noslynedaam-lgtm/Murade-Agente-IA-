# Consultor Murade — contrato da API

Um "contador dentro do sistema": a pessoa pergunta, o Consultor responde **o que é certo, por quê (lei, artigo e link oficial)** e, quando o sistema chamador tiver uma ferramenta para isso, oferece **"quer que eu faça para você?"**.

Serviço: Murade Agente IA (`server.ts`). Código em `src/server/consultor/`.

## Configuração (Render)

| Variável | Obrigatória | Para quê |
| --- | --- | --- |
| `MURADE_CONSULTOR_TOKEN` | sim | Segredo compartilhado com os outros sistemas. Sem ela, as rotas respondem **503 "não configurado"** e o robô conferidor não roda. |
| `GEMINI_API_KEY` | sim (já existe) | Modelo. Sem ela, `/perguntar` responde 503 e o conferidor registra "não testado". |
| `DATABASE_URL` | recomendada (já existe) | Grava o registro e a saúde no Postgres (tabelas `consultor_registros` e `consultor_saude`, criadas sozinhas). Sem ela, fica em memória (últimas 500 consultas) e some no reinício. |
| `CONSULTOR_CONFERIDOR=desligado` | não | Desliga o robô conferidor diário. |
| `MURADE_CONSULTOR_LIBERADOS_PADRAO` | recomendada | CNPJs (separados por vírgula) liberados de saída nos **dois** adicionais (`consultor` e `escola`): o escritório do dono e o da contadora. Nenhum CNPJ fica fixo no código. Um registro feito na tela do dono prevalece sobre esta lista. |

Todas as rotas exigem o cabeçalho `x-murade-consultor-token` (comparação em tempo constante). Token errado/ausente → **401**.

## `POST /api/consultor/perguntar`

Corpo (JSON):

```json
{
  "pergunta": "Até quando pago o DAS?",              // obrigatório, até 30000 caracteres
  "sistema": "fiscal",                                 // 'fiscal' | 'dp' | 'contabil' | 'fiscoia'
  "contextoEmpresa": {                                 // opcional; personaliza a resposta
    "cnpj": "12.345.678/0001-90", "razaoSocial": "Ferragista JE", "regime": "simples",   // 'simples'|'presumido'|'real'|'mei'
    "anexoSimples": "I", "cnaePrincipal": "4744-0/01", "uf": "GO", "municipio": "Goiânia",
    "temFuncionarios": true, "qtdFuncionarios": 3, "faturamento12m": 850000,
    "pendencias": ["PGDAS-D 10/2026 não transmitido"], "outros": { "chave": "valor" }
  },
  "historico": [{ "papel": "usuario", "texto": "..." }, { "papel": "consultor", "texto": "..." }],   // usa só os 8 últimos
  "ferramentasDisponiveis": [{ "nome": "gerar_das", "descricao": "Gera o DAS da competência" }],
  "usuario": "contadora.ana",                          // opcional: login/ID (não nome, não CPF) — vai para o registro de decisões
  "escritorio": "11.222.333/0001-81"                   // CNPJ do ESCRITÓRIO (14 caracteres, aceita pontuação e CNPJ alfanumérico)
}
```

`escritorio` decide a **liberação paga** (adicional "consultor") e o **consumo** para cobrança. CNPJ com dígito verificador errado → **400**. Sem `escritorio`, o escritório é tratado como **não liberado** (só respostas prontas e cache).

Resposta **200**:

```json
{
  "resposta": "O DAS vence no dia 20 do mês seguinte... (português simples, com o que fazer, por quê e riscos)",
  "area": "fiscal",                       // 'contabil'|'fiscal'|'dp'|'societario'|'outro'
  "fontes": [{ "titulo": "...", "url": "https://www8.receita.fazenda.gov.br/..." }],   // só oficiais
  "confianca": "alta",                    // 'alta'|'media'|'baixa'
  "encaminharContador": false,
  "motivoEncaminhamento": "...",          // presente quando encaminharContador = true
  "acoesSugeridas": [{ "ferramenta": "gerar_das", "descricao": "...", "argumentos": { "competencia": "2026-10" } }],
  "avisoResponsabilidade": "Orientação do Consultor Murade com base na legislação citada. A decisão final é do contador responsável (CRC).",
  "divergencia": {                        // só quando o contador questiona ou quer fazer diferente
    "orientacao": "Pagar a rescisão em até 10 dias (CLT, art. 477, § 6º).",
    "fonte": { "titulo": "CLT (Câmara)", "url": "https://www2.camara.leg.br/..." },
    "escolhaDoContador": "Pagar no 12º dia, junto com a folha."
  },
  "recusado": true,                       // só quando o pedido é claramente ilegal/fraude
  "origem": "pronta",                     // 'pronta' (banco conferido) | 'cache' (IA guardada) | 'ia' (Gemini agora) | 'bloqueado' (precisava de IA e o escritório não tem o adicional)
  "custoIA": false,                       // true quando gastou (ou pode ter gastado) crédito do Gemini
  "liberado": true,                       // o escritório tem o Consultor completo?
  "respostaProntaId": "sn-pgdas-das-prazo", "conferidoEm": "2026-11-20"   // só nas respostas prontas
}
```

### Economia de crédito (regra do dono: não gastar o Gemini à toa)

Ordem de cada pergunta (`src/server/consultor/servico.ts`):

1. **Resposta pronta** (`respostasProntas.ts`, **119 respostas**, custo zero): escritas e conferidas a partir dos blocos da base (cada uma com fontes oficiais, data de conferência e o bloco de origem). Cobrem Simples/PGDAS-D/DAS/DEFIS/Fator R/anexos, MEI (LC 238/2026), Presumido (LC 224/2025), retenções, DCTFWeb/Reinf, eSocial, INSS/IRRF/salário-família 2026, FGTS, férias, 13º, rescisão, aviso prévio, jornada e adicionais, licenças, PLR, seguro-desemprego, consignado, ECD/ECF/NBC TG 1001-1002, livro caixa, DIRBI, CND, ICMS-GO (alíquota, prazos, ST, DIFAL), ISS Goiânia (SGISS) e **Reforma Tributária** (13 respostas).
   - Busca por semelhança sem IA (`similaridade.ts` + `economia.ts`): texto normalizado (sem acento), sinônimos de contador ("vencimento"="prazo", "funcionário"="empregado", "DAS" guia x "das" preposição...), **grupos de palavras obrigatórias** em cada resposta, limiar conservador (Dice ≥ 0,5, 60% das palavras da pergunta conhecidas, margem sobre a 2ª colocada). **Na dúvida vai para a IA.**
   - Nunca usa resposta pronta quando: a pergunta pede **cálculo/valor** (R$, "calcule", "quanto fica"), cita **número que a resposta não trata** (ex.: "o DAS vence dia 25?"), é **discordância** do contador, é **seguimento** de conversa curta ("e se for MEI?"), ou a empresa informada é de **outro regime** (`aplicaA`).
   - Pergunta sobre o caso da empresa ("na minha empresa…"): com `contextoEmpresa`, a resposta pronta é **personalizada por modelo de texto** ("Para a Ferragista JE, que é do Simples Nacional, Anexo III: …"), sem IA. Sem os dados: escritório liberado → IA; não liberado → regra geral com o aviso "Esta é a regra geral…".
2. **Cache da IA** (custo zero): respostas da IA com **confiança alta, fonte oficial, sem encaminhamento, sem divergência/recusa**, para pergunta **genérica** (sem `contextoEmpresa`, sem histórico, sem CPF/CNPJ/e-mail/telefone/valores, sem "minha empresa"), guardadas por **pergunta normalizada + área**, válidas por **30 dias** e invalidadas quando a **versão da base** muda (hash dos blocos e das respostas prontas). Ações sugeridas não são guardadas. Tabela `consultor_cache` (ou memória).
3. **Escritório sem o adicional "consultor"**: para aqui com `liberado: false`, `origem: "bloqueado"` e a mensagem **"O Consultor Murade completo é um adicional. Fale com o seu fornecedor para liberar."** (HTTP 200, sem gastar IA).
4. **IA** (Gemini), como antes; os tokens do `usageMetadata` são somados no consumo.

Outros códigos: **400** corpo inválido (`{ erro }`), **401** token, **429** mais de 30 perguntas por minuto na instância, **503** consultor não configurado ou Gemini fora (no caso do Gemini, o corpo traz `erro` + a mesma estrutura acima com `encaminharContador: true`), **500** erro interno.

### Regras garantidas pelo servidor (não dependem do modelo)

- **Fontes:** só ficam URLs dos domínios oficiais (e subdomínios): planalto.gov.br, gov.br, receita.fazenda.gov.br, normas.receita.fazenda.gov.br, www8.receita.fazenda.gov.br, esocial.gov.br, fgts.gov.br, caixa.gov.br, cfc.org.br, economia.go.gov.br, goias.gov.br, goiania.go.gov.br, senado.leg.br, camara.leg.br, stf.jus.br, stj.jus.br, tst.jus.br, in.gov.br, confaz.fazenda.gov.br, nfse.gov.br, sped.rfb.gov.br, serpro.gov.br. O resto é descartado.
- **Sem nenhuma fonte oficial → `confianca: "baixa"` e `encaminharContador: true`.** Confiança baixa sempre encaminha.
- **Ações:** só entram ferramentas cujo `nome` veio em `ferramentasDisponiveis`; o resto é descartado. Sem lista, `acoesSugeridas` é vazio. O Consultor **não executa nada**: o sistema chamador decide e executa (com confirmação da pessoa).
- **Aviso de responsabilidade** fixo em toda resposta.
- **Dados pessoais:** CPF, PIS/NIT, e-mail e telefone são mascarados antes de ir ao modelo e antes de gravar. CNPJ de empresa é mantido.

### Quando o contador discorda (regra do dono)

1. O Consultor **explica de novo, curto e firme**: "pela lei X, art. Y, o certo é assim (link)".
2. **Aceita fazer do jeito do contador**, sempre com a frase: *"Posso fazer do seu jeito. Fica registrado que a orientação foi outra e que a decisão é sua."* (o servidor acrescenta a frase se o modelo esquecer).
3. Devolve `divergencia` e **registra a decisão** automaticamente (origem `consultor`): pergunta, orientação, fonte oficial, escolha do contador, data, `usuario` e `escritorio` — com CPF/e-mail/telefone mascarados.
4. **Nunca recusa a decisão do contador**, exceto pedido **claramente ilegal ou fraude** (ex.: omitir receita, nota fria): aí `recusado: true`, explica a base legal, **sem** `divergencia`, **sem** ações e **sem** registrar decisão.

A fonte da divergência também precisa ser oficial; se não for, o servidor usa a primeira fonte oficial da resposta (ou marca "Fonte oficial não confirmada", com `url` vazia, e a resposta fica com confiança baixa).

### Como o "cérebro" funciona

1. Escolhe até 6 blocos da base (`src/data/knowledgeDocs.ts`) por relevância (área do sistema, tags, título, palavras) dentro de ~45 mil caracteres.
2. Instrução de contador: situação → regra → base legal → o que fazer → riscos/multas → oferecer executar; pesquisa Google só em sites oficiais; nunca afirmar o que o bloco marca como "preciso confirmar".
3. Gemini com `responseSchema` (JSON), `temperature 0.1`, mesmos modelos do `/api/chat` (`gemini-3.1-flash-lite` → `gemini-3.8-flash` → `gemini-3.1-flash-lite` sem pesquisa, caso o modelo recuse pesquisa junto com JSON).
4. Validação no servidor (regras acima).

## `POST /api/consultor/registrar-decisao`

Para o sistema chamador registrar a decisão final do contador (origem `sistema`), por exemplo depois que ele confirma "fazer do meu jeito" na tela.

```json
{
  "escritorio": "esc-001", "usuario": "contadora.ana", "sistema": "dp",
  "pergunta": "...", "orientacao": "Pagar em até 10 dias (CLT, art. 477, § 6º).",
  "fonte": { "titulo": "CLT", "url": "https://www2.camara.leg.br/..." },   // opcional; se vier, tem de ser oficial
  "escolhaDoContador": "Pagar no 12º dia.",
  "data": "2026-11-20T10:00:00-03:00"                                         // opcional (padrão: agora)
}
```

Resposta **201** `{ ok: true, decisao }`; **400** campo faltando, fonte não oficial ou data inválida. `usuario` deve ser login/ID (e-mail e CPF são mascarados). Decisões **não são apagadas** (servem de prova de que a orientação foi dada).

## `GET /api/consultor/decisoes?escritorio=esc-001&limite=100`

Lista as decisões (mais recentes primeiro, até 500). Sem `escritorio`, lista todas (uso do dono). Campos: `id, criadoEm, data, escritorio, usuario, sistema, pergunta, orientacao, fonte, escolhaDoContador, origem`. Tabela `consultor_decisoes` no Postgres (ou memória, até 500).

## Liberação paga por escritório e produto

Dois adicionais vendidos separados: **`consultor`** (Consultor completo + serviço completo) e **`escola`** (Escola Murade). Tabela `consultor_liberacoes` (`escritorio_cnpj`, `produto`, `liberado`, `nome`, `plano`, `observacao`, `liberado_por`, `quando`). Quem liga/desliga é só o dono, na tela do Agente IA. A lista `MURADE_CONSULTOR_LIBERADOS_PADRAO` vale para os dois produtos; um registro na tabela prevalece. Excluir/desligar não bloqueia CNPJ: pode liberar de novo a qualquer momento.

### `GET /api/consultor/liberado?escritorio=<cnpj>&produto=consultor|escola`

Mesmo token. Sem `produto` = `consultor` (não quebra quem já chama). Resposta: `{ escritorio, produto, liberado, mensagem? }` (`mensagem` quando não liberado). **400** CNPJ ou produto inválido. Os sistemas usam para mostrar ou esconder o "serviço completo"/Consultor completo e a Escola Murade.

### `POST /api/consultor/registrar-uso`

Mesmo token. Para os sistemas contarem o uso da **Escola Murade** (ou outro uso de um produto): `{ "escritorio": "<cnpj>", "produto": "escola", "quantidade": 1 }` → **201** `{ ok, liberado, quantidade }`.

## Consumo para cobrança e tela do dono

Tabela `consultor_consumo` por **escritório + produto + mês** (AAAA-MM, horário de Brasília): `perguntas`, `com_ia`, `prontas`, `cache`, `bloqueadas` (precisavam de IA sem liberação), `usos` (Escola), `tokens_entrada`, `tokens_saida`, `tokens_total`. O robô conferidor não conta.

Rotas **só do dono do sistema** (sessão do Agente IA; `exigirDono` em `src/server/acesso.ts`: conta própria com `donoSistema`, ou sessão do DP com `donoSistema`; escritório cliente recebe **403**):

- `GET /api/consultor/dono/escritorios?mes=AAAA-MM` — lista dos escritórios (liberados na tabela, da lista padrão ou com consumo no mês), situação dos dois produtos e consumo.
- `POST /api/consultor/dono/liberacao` — `{ escritorio, produto, liberado, nome?, plano?, observacao?, confirmar? }`. **Desligar exige `confirmar: true`** (segunda confirmação). Se o banco falhar, nada é alterado (não grava só na memória).
- `GET /api/consultor/dono/consumo.csv?mes=AAAA-MM` — CSV (`;`, UTF-8 com BOM, células com fórmula neutralizadas).

Tela: botão **"Usuários e empresas"** no topo (só aparece para o dono) → quadro azul **"Adicionais pagos: Consultor e Escola Murade"**: campo CNPJ + nome + plano + caixas Consultor/Escola + botão **Liberar**; seletor do mês; botão **Exportar CSV**; em cada escritório, dois botões (Consultor completo / Escola Murade) que alternam LIBERADO/desligado — desligar pede confirmação e depois os 4 últimos caracteres do CNPJ.

## `GET /api/consultor/nao-respondidas?limite=100`

Lista (mais recentes primeiro, até 500) as consultas com confiança baixa, encaminhadas ao contador, com erro, com o Gemini fora ou **sem liberação** (`situacao: "nao_liberado"`, mostra a procura para virar resposta pronta) — para o dono completar a base. Campos: `id, criadoEm, sistema, pergunta, resposta, area, confianca, encaminharContador, motivoEncaminhamento, fontes, regime, modelo, situacao` (`respondida`|`gemini_indisponivel`|`erro`). Também informa `armazenamento` (`postgres` ou `memoria`).

## `GET /api/consultor/saude`

Resultado do **robô conferidor**: 43 perguntas-teste (7 de IBS/CBS) com resposta-chave conferida em fonte oficial (lista em `src/server/consultor/conferidor.ts`, cada uma com a fonte). Roda 10 minutos após subir o serviço (se a última conferência tiver mais de 20 horas) e depois a cada 24 horas.

```json
{
  "armazenamento": "postgres", "perguntasTeste": 36, "situacao": "ok",
  "ultimaConferencia": { "quando": "...", "situacao": "ok", "total": 36, "acertos": 36, "erros": 0, "naoTestados": 0,
    "resultados": [{ "id": "rescisao-prazo", "pergunta": "...", "situacao": "acertou" }] }
}
```

O robô testa a resposta que o usuário recebe (pronta, cache ou IA), como uso interno (sem liberação, sem registro e sem consumo); com o Gemini fora, continua conferindo as respostas prontas e marca só o que precisa de IA como "não testado". `respostasProntas` (também na conferência diária) confere **todas as respostas prontas**: fonte oficial, data de conferência e aviso das que têm **mais de 180 dias** sem conferir (`maisDe180Dias`); `situacao` `ok` | `com_avisos` | `com_falhas`.

`situacao`: `ok`, `com_falhas` (alguma resposta perdeu a palavra-chave: veja `faltou` e a fonte em `detalhe`), `nao_testado` (Gemini fora — não é erro do consultor) ou `ainda_nao_rodou`. As perguntas do robô **não** entram no registro de não respondidas.

## Testes

`npm run test:consultor` (node:test com tsx), 32 testes. `economia.test.ts`: banco de prontas (≥80, fontes oficiais, datas, cada variação acha a própria resposta, reformulações e perguntas que devem ir à IA, perguntas do robô), personalização, conferência de 180 dias, cache (repetida sem custo, nunca com dados de empresa/pessoa, versão da base), liberação por produto (prontas sem liberação, `liberado:false` sem gastar IA, GET /liberado, tabela x lista padrão, CNPJ alfanumérico), consumo por produto/mês com tokens e usos da Escola, tela do dono (403 para cliente, segunda confirmação, CSV). `consultor.test.ts`: autenticação, validação do corpo, filtro de fontes, ações só de ferramentas recebidas, mascaramento/registro, Gemini fora, conferidor sem Gemini, divergência (aceite, recusa de pedido ilegal, registro e listagem de decisões por escritório) e escolha dos blocos da base.

## Base de conhecimento acrescentada (conferida em 20/11/2026)

`src/data/knowledgeDocsConsultor.ts`: Simples (limites, PGDAS-D/DAS, MAED, DEFIS, Fator R, livros), MEI, Lucro Presumido (presunções e LC 224/2025), retenções (CSRF, INSS 11%, encargos patronais), DCTFWeb/EFD-Reinf/eSocial periódico, CLT (jornada, adicionais, férias, 13º, faltas, contratos, rescisão), contabilidade de ME/EPP (NBC TG 1001/1002, ITG 2000), ICMS-GO 19% e ISS de Goiânia (SGISS), LC 238/2026 (MEI), licença-paternidade (Lei 15.371/2026), prazos do eSocial não periódicos (S-2200/S-2299), PLR, seguro-desemprego, consignado (Lei 15.179/2025), ECD/ECF/DIRBI/certidões/parcelamento do Simples, calendário do ICMS-GO/ST/DIFAL e PIS/Cofins monofásico, abertura de empresa na JUCEG. Cada bloco lista as fontes lidas e o que **não** foi conferido.

## Reforma Tributária (bloco conferido em 20/11/2026)

`reforma-tributaria-ibs-cbs-lc214-conferido` em `src/data/knowledgeDocsConsultor.ts`, lido no Planalto (LC 214/2025 compilada com a LC 227/2026; EC 132/2023) e na NT 004 da NFS-e Nacional: o que são IBS, CBS e IS; ano-teste 2026 (0,1% e 0,9%, compensação, dispensa para quem cumpre obrigações acessórias, Simples fora — art. 348); 2027 (CBS e IS, extinção de PIS/Cofins — art. 542 —, IPI zero); 2027-2028 (IBS 0,05% + 0,05%, CBS −0,1 p.p.); 2029-2032 (ICMS/ISS 9/10 a 6/10); 2033 (extinção); base "por fora" (art. 12); crédito condicionado ao pagamento (art. 47 a 57); split payment (arts. 31 a 36); Simples com opção semestral pelo regime regular (setembro/março) e crédito ao cliente (LC 123, arts. 13, §§ 9º a 11, e 23, § 1º-A); reduções de 30% (inclui contabilistas) e 60% e cesta básica zero (arts. 125 a 128); cashback (arts. 112 a 124); destino (art. 11); grupo IBSCBS na NFS-e; o que o contador faz agora. **Não conferido (fica de fora):** valores das alíquotas de referência, listas dos anexos, regulamento da CBS e atos do Comitê Gestor, NT 2025.002 da NF-e/NFC-e, data do split payment, resolução do CGSN sobre a opção do Simples.
