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
  "ferramentasDisponiveis": [{ "nome": "gerar_das", "descricao": "Gera o DAS da competência" }]
}
```

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
  "avisoResponsabilidade": "Orientação do Consultor Murade com base na legislação citada. A decisão final é do contador responsável (CRC)."
}
```

Outros códigos: **400** corpo inválido (`{ erro }`), **401** token, **429** mais de 30 perguntas por minuto na instância, **503** consultor não configurado ou Gemini fora (no caso do Gemini, o corpo traz `erro` + a mesma estrutura acima com `encaminharContador: true`), **500** erro interno.

### Regras garantidas pelo servidor (não dependem do modelo)

- **Fontes:** só ficam URLs dos domínios oficiais (e subdomínios): planalto.gov.br, gov.br, receita.fazenda.gov.br, normas.receita.fazenda.gov.br, www8.receita.fazenda.gov.br, esocial.gov.br, fgts.gov.br, caixa.gov.br, cfc.org.br, economia.go.gov.br, goias.gov.br, goiania.go.gov.br, senado.leg.br, camara.leg.br, stf.jus.br, stj.jus.br, tst.jus.br, in.gov.br, confaz.fazenda.gov.br, nfse.gov.br, sped.rfb.gov.br, serpro.gov.br. O resto é descartado.
- **Sem nenhuma fonte oficial → `confianca: "baixa"` e `encaminharContador: true`.** Confiança baixa sempre encaminha.
- **Ações:** só entram ferramentas cujo `nome` veio em `ferramentasDisponiveis`; o resto é descartado. Sem lista, `acoesSugeridas` é vazio. O Consultor **não executa nada**: o sistema chamador decide e executa (com confirmação da pessoa).
- **Aviso de responsabilidade** fixo em toda resposta.
- **Dados pessoais:** CPF, PIS/NIT, e-mail e telefone são mascarados antes de ir ao modelo e antes de gravar. CNPJ de empresa é mantido.

### Como o "cérebro" funciona

1. Escolhe até 6 blocos da base (`src/data/knowledgeDocs.ts`) por relevância (área do sistema, tags, título, palavras) dentro de ~45 mil caracteres.
2. Instrução de contador: situação → regra → base legal → o que fazer → riscos/multas → oferecer executar; pesquisa Google só em sites oficiais; nunca afirmar o que o bloco marca como "preciso confirmar".
3. Gemini com `responseSchema` (JSON), `temperature 0.1`, mesmos modelos do `/api/chat` (`gemini-3.1-flash-lite` → `gemini-3.8-flash` → `gemini-3.1-flash-lite` sem pesquisa, caso o modelo recuse pesquisa junto com JSON).
4. Validação no servidor (regras acima).

## `GET /api/consultor/nao-respondidas?limite=100`

Lista (mais recentes primeiro, até 500) as consultas com confiança baixa, encaminhadas ao contador, com erro ou com o Gemini fora — para o dono completar a base. Campos: `id, criadoEm, sistema, pergunta, resposta, area, confianca, encaminharContador, motivoEncaminhamento, fontes, regime, modelo, situacao` (`respondida`|`gemini_indisponivel`|`erro`). Também informa `armazenamento` (`postgres` ou `memoria`).

## `GET /api/consultor/saude`

Resultado do **robô conferidor**: 28 perguntas-teste com resposta-chave conferida em fonte oficial (lista em `src/server/consultor/conferidor.ts`, cada uma com a fonte). Roda 10 minutos após subir o serviço (se a última conferência tiver mais de 20 horas) e depois a cada 24 horas.

```json
{
  "armazenamento": "postgres", "perguntasTeste": 28, "situacao": "ok",
  "ultimaConferencia": { "quando": "...", "situacao": "ok", "total": 28, "acertos": 28, "erros": 0, "naoTestados": 0,
    "resultados": [{ "id": "rescisao-prazo", "pergunta": "...", "situacao": "acertou" }] }
}
```

`situacao`: `ok`, `com_falhas` (alguma resposta perdeu a palavra-chave: veja `faltou` e a fonte em `detalhe`), `nao_testado` (Gemini fora — não é erro do consultor) ou `ainda_nao_rodou`. As perguntas do robô **não** entram no registro de não respondidas.

## Testes

`npm run test:consultor` (node:test com tsx): autenticação, validação do corpo, filtro de fontes, ações só de ferramentas recebidas, mascaramento/registro, Gemini fora e conferidor sem Gemini.

## Base de conhecimento acrescentada (conferida em 20/11/2026)

`src/data/knowledgeDocsConsultor.ts`: Simples (limites, PGDAS-D/DAS, MAED, DEFIS, Fator R, livros), MEI, Lucro Presumido (presunções e LC 224/2025), retenções (CSRF, INSS 11%, encargos patronais), DCTFWeb/EFD-Reinf/eSocial periódico, CLT (jornada, adicionais, férias, 13º, faltas, contratos, rescisão), contabilidade de ME/EPP (NBC TG 1001/1002, ITG 2000), ICMS-GO 19% e ISS de Goiânia (SGISS). Cada bloco lista as fontes lidas e o que **não** foi conferido.
