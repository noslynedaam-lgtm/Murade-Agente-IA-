# eSocial - Calendário Oficial, Prazos de Eventos e DCTFWeb

> **Fontes oficiais (conferidas em 21/10/2026):**
> - [Manual de Orientação do eSocial (MOS) S-1.3, consolidado até a NO S-1.3-07/2026 (gov.br)](https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-07-2026.pdf), itens 10.3.2 e 10.3.4.1
> - [Nota Orientativa 2019.18, prazo de envio de eventos (gov.br)](https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/nota-orientativa-018-2019-prazo-de-envio-de-eventos.pdf)
> - [Notícia oficial do Comitê Gestor sobre o prazo (gov.br, 04/06/2019)](https://www.gov.br/esocial/pt-br/noticias/comite-gestor-confirma-que-havera-mudanca-no-prazo-de-envio-do-fechamento-de-folha)
> **Não conferido nesta revisão:** prazos de S-2205, S-2206, S-2210, S-2220, S-2230, S-2240 e S-2300 (o capítulo III do MOS, que traz o prazo de cada evento, não veio no texto lido); seção da DCTFWeb; qualquer regra para empregador doméstico. **Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar o MOS.**

---

## 1. Classificação dos Eventos do eSocial

O Sistema de Escrituração Digital das Obrigações Fiscais, Previdenciárias e Trabalhistas (eSocial) padroniza a transmissão de dados do trabalhador e da empresa em três macrocategorias de eventos:

### A. Eventos Iniciais e de Tabelas
- **S-1000:** Informações do Empregador / Contribuinte (dados cadastrais, classificação tributária, indicativo de desoneração, indicativo de cooperativa ou produtor rural).
- **S-1005:** Tabela de Estabelecimentos, Obras de Construção Civil ou Unidades de Órgãos Públicos (CNAE preponderante, alíquota RAT, FAP aplicável).
- **S-1010:** Tabela de Rubricas (natureza da rubrica, incidência de INSS, FGTS, IRRF e Contribuição Sindical).
- **S-1020:** Tabela de Lotações Tributárias (código FPAS e código de Terceiros/Outras Entidades).
- **S-1070:** Tabela de Processos Administrativos / Judiciais que suspendem exigibilidade de tributos ou FGTS.

### B. Eventos Não Periódicos (Fatos Ocorridos na Relação de Emprego)
São os eventos disparados por atos pontuais da rotina trabalhista. **Conferidos em fonte oficial (MOS S-1.3 e Nota Orientativa 2019.18):**

| Código | Descrição do Evento | Prazo oficial |
| :--- | :--- | :--- |
| **S-2190** | Registro Preliminar de Admissão | Informado **até o dia anterior ao início da prestação dos serviços** (Nota Orientativa 2019.18). |
| **S-2200** | Cadastramento Inicial e Admissão de Trabalhador | **Até o dia anterior ao início da prestação dos serviços** (Nota Orientativa 2019.18 e notícia oficial do Comitê Gestor). |
| **S-2299** | Desligamento / Rescisão Contratual | **Até o 10º dia após a data da rescisão** (Nota Orientativa 2019.18 e notícia oficial). |

**Prazos NÃO conferidos nesta revisão** (informação da versão anterior, mantida só como referência; **preciso confirmar no MOS, capítulo III**):

| Código | Descrição do Evento | Prazo informado antes (não conferido) |
| :--- | :--- | :--- |
| S-2205 | Alteração de Dados Cadastrais | Dia 15 do mês seguinte (regra geral da Nota Orientativa 2019.18; o evento não é citado nominalmente). |
| S-2206 | Alteração de Contrato de Trabalho | Dia 15 do mês seguinte (regra geral; não citado nominalmente). |
| S-2210 | Comunicação de Acidente de Trabalho (CAT) | Primeiro dia útil seguinte à ocorrência; imediato em caso de morte (não conferido). |
| S-2220 | Monitoramento da Saúde do Trabalhador (ASO) | Dia 15 do mês seguinte (não conferido). |
| S-2230 | Afastamento Temporário | A Nota Orientativa diz apenas que valem os prazos próprios do evento: **preciso confirmar**. |
| S-2240 | Condições Ambientais do Trabalho | Dia 15 do mês seguinte (regra geral; não citado nominalmente). |
| S-2300 | Trabalhador Sem Vínculo (diretor não empregado, estagiário etc.) | Dia 15 do mês seguinte (regra geral; não citado nominalmente). |

> **Correção desta revisão:** a versão anterior dizia que o S-2200 podia ser enviado até o dia 15 do mês seguinte se houvesse S-2190. Essa regra **não foi confirmada**; o prazo oficial lido é **até o dia anterior ao início da prestação**.

---

### C. Eventos Periódicos (Folha de Pagamento Mensal)
- **S-1200:** Remuneração do Trabalhador vinculado ao Regime Geral de Previdência Social (proventos, descontos, horas extras, adicionais).
- **S-1210:** Pagamentos de Rendimentos do Trabalho.
- **S-1299:** Fechamento dos Eventos Periódicos.
- **S-1298:** Reabertura de Eventos Periódicos.

**Prazos oficiais (MOS S-1.3, itens 10.3.2 e 10.3.4.1):**
- **S-1200 e S-1299:** transmitir e fechar **até o dia 15 do mês seguinte** ao do período de apuração. **Se o dia 15 não for dia útil, o prazo passa para o próximo dia útil** (texto do MOS S-1.3; a versão anterior deste documento dizia "antecipa", o que **não é** o que o MOS atual diz). O S-1200 deve ser enviado antes do S-1299.
- **S-1200 de desligamento:** exceção prevista no MOS: o evento periódico do trabalhador desligado vence **em até 10 dias após o desligamento**.
- **S-1210:** **até o dia 15 do mês seguinte ou até o fechamento da folha do mês, o que ocorrer primeiro**.
- **13º salário (apuração anual):** o MOS manda enviar S-1200 e S-1299 **entre 1º e 20 de dezembro**; a Nota Orientativa 2019.18 (de 2019) fala em "dia 20 de dezembro" e, sem expediente bancário, **antecipação** para o dia útil anterior. Há diferença de redação entre as duas fontes: para o 13º, **preciso confirmar** a regra do dia não útil.
- **Não mudam com o prazo do eSocial:** os prazos legais de recolhimento de tributos e do FGTS (a notícia oficial do Comitê Gestor e a Nota Orientativa dizem isso) e os prazos do empregador doméstico.

---

## 2. A Integração com DCTFWeb e Fechamento Previdenciário

> **Seção não reconferida nesta revisão** (as páginas oficiais consultadas exigiam login ou não traziam o texto): **preciso confirmar** na Receita Federal (Manual da DCTFWeb e IN RFB 2.005/2021) antes de afirmar prazos.

Informação da versão anterior, mantida como referência:
1. A transmissão do fechamento (S-1299) no eSocial, junto com os eventos da EFD-Reinf, alimenta a **DCTFWeb**.
2. O **DARF previdenciário** gerado na DCTFWeb substituiu a GPS.
3. Vencimento informado antes: **dia 20 do mês seguinte**, com antecipação se o dia não for útil. **Não conferido**: confirme na Receita.

---

## 3. Por que o S-1200 não é aceito: as 3 fases do eSocial

> **Fontes:** estrutura de fases confirmada em várias fontes oficiais e de apoio (Manual de Orientação do eSocial — itens 9.1/9.2/10.1; jornalcontabil.com.br sobre a Fase 1 do Grupo 3; vriconsulting.com.br sobre o item 10.1 do MOS). O caminho de menu do item 4 abaixo foi **conferido ao vivo, direto no portal oficial, por print do usuário em 03/11/2026** — é a fonte mais confiável que existe porque veio da tela real.

Quando o Murade DP (ou qualquer outro sistema) tenta transmitir a folha de um funcionário (S-1200) e o eSocial rejeita, a causa quase sempre é a mesma: falta alguma coisa nas **3 fases obrigatórias**, que têm que ser cumpridas **nesta ordem**:

1. **Fase 1 — Eventos de Tabelas** (cadastro "de base" da empresa, feito uma vez e atualizado só quando muda algo):
   - **S-1000** — Informações do Empregador/Contribuinte (dados cadastrais e classificação tributária).
   - **S-1005** — Tabela de Estabelecimentos (filiais/obras).
   - **S-1010** — Tabela de Rubricas (proventos e descontos da folha).
   - **S-1020** — Tabela de Lotações Tributárias (FPAS + Código de Terceiros).
   - Sem essas 4 tabelas certas no eSocial, **nenhum evento posterior é aceito** — nem admissão, nem folha.
2. **Fase 2 — Eventos Não Periódicos**: admissão (S-2200), férias, afastamentos, desligamento (S-2299) — os fatos que acontecem na vida do funcionário.
3. **Fase 3 — Eventos Periódicos**: a folha em si (S-1200), os pagamentos (S-1210) e o fechamento do mês (S-1299).

**Na prática: se o S-1200 de um funcionário não for aceito, confira nesta ordem:** (1) a lotação tributária da empresa existe no eSocial (S-1020)? (2) a rubrica usada está mapeada corretamente (S-1010)? (3) o estabelecimento (S-1005) e os dados do empregador (S-1000) estão certos e compatíveis com a classificação tributária? Só depois disso faz sentido revisar o próprio S-1200.

## 4. Onde conferir e cadastrar cada tabela, direto no Portal Web do eSocial

> **Caminho de menu confirmado por print real do usuário em 03/11/2026:** Portal Web do eSocial → menu **"Empregador/Contribuinte"** → **"Tabelas"** → **"Tabela de Lotações Tributárias"** (URL do portal: `esocial.gov.br/portal/Lotacao/CadastroCompleto`). As demais tabelas (S-1000, S-1005, S-1010) ficam no mesmo menu "Empregador/Contribuinte", em abas/telas próprias — **o rótulo exato de cada uma pode mudar com atualizações do portal; sempre confira o menu ao vivo antes de orientar alguém com certeza absoluta.**

**Passo a passo para conferir se a lotação tributária de uma empresa já existe (antes de cadastrar uma nova):**
1. No portal, vá em **Empregador/Contribuinte → Tabelas → Tabela de Lotações Tributárias**.
2. Na tela de busca, **não** procure pelo campo "Código" (esse é o código interno da lotação, que só existe depois de cadastrada). Em vez disso, selecione **"Tipo de Inscrição" = CNPJ** e digite o **"Número de Inscrição"** (o CNPJ da empresa, só números, sem ponto/barra/traço) no campo ao lado.
3. Clique na lupa de buscar.
4. **Se aparecer um resultado:** a lotação já existe — anote o código dela e informe esse código no sistema de folha (no Murade DP, é o campo "codLotacao vigente" dentro da Etapa 3 da tela do eSocial).
5. **Se não aparecer nada:** aí sim a empresa realmente não tem lotação cadastrada, e isso precisa ser corrigido antes de qualquer S-1200 ser aceito. Clique em **"Cadastrar nova Lotação"** e preencha o tipo de lotação (geralmente tipo 01, para pessoa jurídica comum, salvo situação diferente), o FPAS e o Código de Terceiros — esses dois últimos dependem da atividade e da classificação tributária da empresa, então **não devem ser adivinhados**: confira com o responsável tributário/contador da empresa ou no sistema de origem (ex.: Alterdata) de onde a empresa migrou, porque lá normalmente já existe esse cadastro configurado.

**Atenção para quem está migrando de outro sistema (ex.: Alterdata) para o Murade DP:** o cadastro de FPAS/Código de Terceiros que aparece dentro do Alterdata é a configuração *local* que o Alterdata usa para montar e enviar o evento S-1020 — **não é a lotação em si**. Se a folha dessa empresa vem sendo transmitida mensalmente sem erro pelo Alterdata, o S-1020 correspondente **já deve estar registrado no eSocial**; nesse caso, o problema mais comum é simplesmente não achar esse registro na busca (CNPJ digitado errado, ou usuário logado na empresa errada quando há procuração para várias empresas).

**Para confirmar se a folha está sendo realmente aceita (e não só "enviada" por um sistema terceiro):** no Portal Web do eSocial, o caminho usual é **Folha de Pagamentos → Gestão da Folha** para consultar os eventos S-1200/S-1210 já processados, e o menu **"Download"** para baixar o recibo/XML de eventos aceitos com sucesso. Um evento que o eSocial recusou **não aparece** nessa consulta de download — nesse caso é preciso olhar o retorno/erro do próprio lote enviado.
