// Blocos acrescentados para o Consultor Murade (conferência em 20/11/2026).
// Regra: só entra aqui o que foi lido na fonte oficial citada; o que não foi lido fica marcado "preciso confirmar".
import type { KnowledgeDoc } from './knowledgeDocs';

const CONFERIDO = '2026-11-20';

export const BLOCOS_CONSULTOR_2026_11: KnowledgeDoc[] = [
  {
    id: 'simples-prazos-obrigacoes-conferido',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/simples-prazos-obrigacoes-conferido.md',
    title: 'Simples Nacional: limites, PGDAS-D/DAS (dia 20), MAED, DEFIS, Fator R e livros obrigatórios',
    summary: 'Limites ME (R$ 360 mil) e EPP (R$ 4,8 milhões), PGDAS-D e DAS até o dia 20, multa MAED, DEFIS até 31 de março, Fator R de 28% (Anexo III x V) e livros obrigatórios (Livro Caixa, Registro de Inventário), conferidos no Perguntão do Simples, no gov.br e na LC 123.',
    tags: ['Simples Nacional', 'PGDAS-D', 'DAS', 'DEFIS', 'Fator R', 'MAED', 'Livro Caixa', 'Anexo III', 'Anexo V', 'prazo do DAS', 'limite EPP'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoSN.pdf',
    officialLinkLabel: 'Perguntas e Respostas do Simples Nacional (Receita Federal)',
    content: `# Simples Nacional: prazos e obrigações do dia a dia do escritório

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [Perguntas e Respostas do Simples Nacional (Perguntão), atualizado parcialmente em 09/10/2026](https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoSN.pdf): perguntas 5.11, 6.4, 6.5, 6.8, 6.10 e 11.2
> - [gov.br, serviço "Declarar apurações mensais do Simples Nacional" (atualizado em 29/07/2026)](https://www.gov.br/pt-br/servicos/declarar-apuracoes-mensais-do-simples-nacional)
> - [gov.br, serviço "Declarar apurações e informações anuais do Simples Nacional" (DEFIS, modificado em 27/07/2026)](https://www.gov.br/pt-br/servicos/declarar-apuracoes-e-informacoes-anuais-do-simples-nacional)
> - [LC 123/2006, compilação no Senado/Câmara](https://legis.senado.leg.br/norma/572878/publicacao/34621013): arts. 3º, 18 (§§ 5º-J, 5º-M e 24), 21, 25 e 26
> **Não conferido nesta revisão:** o texto direto da Resolução CGSN 140/2018 (o site normas.receita não abriu; os artigos abaixo são os citados pelo Perguntão), os anexos com alíquotas e as vedações do art. 17 da LC 123. **Diante de dúvida, dizer "preciso confirmar".**

## 1. Limites (LC 123/2006, art. 3º)
- **Microempresa (ME):** receita bruta anual **igual ou inferior a R$ 360.000,00**.
- **Empresa de pequeno porte (EPP):** receita bruta anual **superior a R$ 360.000,00 e igual ou inferior a R$ 4.800.000,00**.

## 2. PGDAS-D e DAS: dia 20
- **Entrega do PGDAS-D:** até o **dia 20 do mês seguinte** ao dos fatos geradores, que é o mesmo prazo de pagamento (gov.br; Perguntão 6.4).
- **Pagamento do DAS:** termina no **dia 20 do mês seguinte** ao da receita auferida (competência) ou recebida (caixa). **Se não houver expediente bancário no dia 20, prorroga para o primeiro dia útil seguinte** (Perguntão 6.8; Resolução CGSN 140/2018, art. 40).
- Observação: o art. 21, III, da LC 123 fala em "último dia útil da primeira quinzena do mês subsequente" **enquanto o CGSN não regulamentar**; o CGSN regulamentou o dia 20 (art. 40 da Resolução 140, citado no Perguntão).
- Valor não pago no prazo sofre os encargos da legislação do imposto de renda (Perguntão 6.8).

## 3. Multa por atraso do PGDAS-D (MAED) (LC 123, art. 38-A; Perguntão 6.5)
- **Atraso ou falta de entrega:** **2% ao mês-calendário ou fração** sobre os tributos apurados, contados do dia seguinte ao prazo, **limitada a 20%**, com **multa mínima de R$ 50,00** por mês de referência.
- **Informações incorretas ou omitidas:** R$ 20,00 para cada grupo de dez informações.
- **Reduções:** à metade se entregue após o prazo mas antes de procedimento de ofício; a 75% se entregue no prazo da intimação. A MAED é gerada na transmissão em atraso.

## 4. DEFIS (Perguntão 6.10; Resolução CGSN 140, art. 72; gov.br)
- Entrega até **31 de março** do ano seguinte ao dos fatos geradores.
- Incorporação, cisão, fusão ou extinção: até o **último dia de junho** se o evento ocorrer no primeiro quadrimestre; nos demais casos, até o último dia do mês seguinte ao evento.
- Prazos fixos: **não são prorrogados nem antecipados** em fim de semana ou feriado.
- **Atenção 2027:** a notícia da Receita de 11/08/2026 (Resoluções CGSN 190/191) diz que a DEFIS será substituída por informações no PGDAS-D de janeiro a março. **Preciso confirmar** a partir de quando (ver bloco "Novidades de 2026").

## 5. Fator R: 28% (LC 123, art. 18, §§ 5º-J, 5º-M e 24; Perguntão 5.11; Resolução CGSN 140, art. 26)
- Atividades sujeitas ao Fator R vão para o **Anexo III** quando a razão entre a folha de salários (FS12) e a receita bruta (RBT12) for **igual ou superior a 28% (0,28)**; **inferior a 28% vai para o Anexo V**.
- **Até 2026:** folha e receita dos 12 meses anteriores ao período de apuração. **A partir de 2027:** os 12 meses anteriores ao **mês anterior** ao período de apuração (Perguntão 5.11).
- **Entra na folha (FS12):** remunerações informadas no eSocial/GFIP, **pró-labore**, 13º salário, contribuição patronal previdenciária e FGTS. **Não entra:** aluguéis, distribuição de lucros, estagiários e valores pagos a MEI (Perguntão 5.11). A LC 123, art. 18, § 24, define folha como o montante pago nos doze meses anteriores, incluídos encargos.

## 6. Livros obrigatórios do optante (Perguntão 11.2; Resolução CGSN 140, art. 63; LC 123, art. 26, § 2º)
- **Livro Caixa** (movimentação financeira e bancária), **Registro de Inventário**, Registro de Entradas (contribuintes do ICMS), Registro de Serviços Prestados e Tomados (ISS) e livros específicos (combustíveis, selo, impressão de documentos, veículos), conforme a atividade.
- **O Livro Caixa é dispensado** para quem mantém **Livro Diário e Razão** devidamente escriturados.
- A ME/EPP pode adotar contabilidade simplificada (LC 123, art. 27).

## 7. Empresa sem movimento
- O PGDAS-D é mensal para todo optante; o gov.br e o Perguntão lidos **não tratam** expressamente do mês sem receita. **Preciso confirmar** a orientação oficial antes de afirmar como declarar o período zerado.`,
  },
  {
    id: 'mei-limites-obrigacoes-conferido',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/mei-limites-obrigacoes-conferido.md',
    title: 'MEI: limite de R$ 81 mil, excesso de 20%, empregado único, DAS-MEI e DASN-SIMEI (31 de maio)',
    summary: 'Limite anual do MEI (R$ 81.000 em 2026, R$ 110.000 em 2027 e R$ 140.000 a partir de 2028 pela LC 238/2026; proporcional R$ 6.750 por mês no início), desenquadramento por excesso até e acima de 20%, contratação de um único empregado, composição do DAS-MEI e DASN-SIMEI até o último dia de maio.',
    tags: ['MEI', 'SIMEI', 'LC 238/2026', 'remissão MEI', 'DASN-SIMEI', 'DAS-MEI', 'limite MEI', 'empregado do MEI', 'desenquadramento'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoMEI.pdf',
    officialLinkLabel: 'Perguntas e Respostas MEI e Simei (CGSN)',
    content: `# MEI: limites e obrigações

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [Perguntas e Respostas MEI e Simei (CGSN, atualizado em 29/04/2025)](https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoMEI.pdf): perguntas 1.2, 3.1, 3.6, 3.9, 6.3, 6.4 e 6.8
> - [LC 123/2006, compilação no Senado](https://legis.senado.leg.br/norma/572878/publicacao/34621013): art. 18-A, § 1º
> - [LC 238/2026, de 21/10/2026 (Senado)](https://legis.senado.leg.br/norma/44276013/publicacao/44280206)
> **Não conferido nesta revisão:** o dia de vencimento do DAS-MEI e o percentual da CPP do MEI com empregado.

## 0. LC 238/2026: o que muda (texto lido no Senado)
- **2026:** continua o limite de **R$ 81.000,00**.
- **2027:** limite anual de **R$ 110.000,00** (art. 2º); no início de atividade, **R$ 9.166,67 por mês**.
- **A partir de 1º/1/2028:** limite de **R$ 140.000,00** (novo § 1º do art. 18-A); no início de atividade, **R$ 11.666,67 por mês**. A ampliação depende de a renúncia constar nas leis orçamentárias de 2027 a 2029 (art. 3º).
- **Empregados (art. 18-C, a partir de 1º/1/2027):** o **MEI rural** pode ter até **2 empregados** com 1 salário mínimo ou piso; em afastamento legal de empregado, pode contratar substituto pelo tempo do afastamento.
- **Remissão (arts. 5º a 7º, a partir de 1º/1/2027):** perdão integral das dívidas do MEI com a União de fatos geradores **até 13/10/2026** (inclusive parceladas), com a condição de manter em dia as contribuições dos **6 meses seguintes**; não dá restituição; regulamentação pela PGFN.

## 1. Limite de receita (LC 123, art. 18-A, § 1º; Perguntão MEI 1.2 e 6.4)
- **R$ 81.000,00** por ano-calendário em 2026 (para 2027 e 2028, ver item 0).
- **Ano de início:** R$ 6.750,00 multiplicados pelo número de meses entre o início e o fim do ano, contando fração de mês como mês inteiro.
- **Excesso de até 20%:** desenquadramento a partir de **1º de janeiro do ano seguinte**; comunicar até o último dia útil do mês seguinte ao excesso; o excesso é pago em "DAS de excesso" gerado na DASN-SIMEI, no vencimento do DAS de janeiro do ano seguinte (Perguntas 6.4 e 6.8).
- **Excesso acima de 20%:** o desenquadramento **retroage a 1º de janeiro** do ano do excesso (ou ao início da atividade).

## 2. Empregado (LC 123, art. 18-C; Perguntas 1.2, 3.1, 3.6 e 6.3)
- O MEI pode ter **no máximo um empregado**, que receba **um salário mínimo ou o piso da categoria**. Contratar mais de um leva ao desenquadramento.
- Com empregado, passa a ser devida a contribuição patronal e o MEI deixa de ter a dispensa de eSocial/RAIS; FGTS é devido. O percentual da CPP do MEI com empregado **não consta** do documento lido: **preciso confirmar**.

## 3. DAS-MEI (Pergunta 3.1)
- INSS: **5% do limite mínimo do salário de contribuição** (12% para o MEI transportador autônomo de cargas); **ICMS R$ 1,00** (se contribuinte) e **ISS R$ 5,00** (se contribuinte).

## 4. DASN-SIMEI (Pergunta 3.9; Resolução CGSN 140, art. 109)
- Entregar até o **último dia de maio** de cada ano, com a receita bruta do ano anterior e a informação de empregado contratado. Prazo sem prorrogação.`,
  },
  {
    id: 'lucro-presumido-presuncoes-lc224',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/lucro-presumido-presuncoes-lc224.md',
    title: 'Lucro Presumido: percentuais de presunção (Lei 9.249, arts. 15 e 20), adicional do IRPJ e acréscimo de 10% da LC 224/2025',
    summary: 'Presunção do IRPJ (8%, 1,6%, 16%, 32%) e da CSLL (12% e 32%), IRPJ 15% com adicional de 10% acima de R$ 20 mil por mês, e acréscimo de 10% nos percentuais sobre a receita que exceder R$ 5 milhões no ano (LC 224/2025), com vigência no IRPJ desde o 1º trimestre e na CSLL desde o 2º trimestre de 2026.',
    tags: ['Lucro Presumido', 'presunção', 'IRPJ', 'CSLL', 'LC 224/2025', '32%', '8%', 'adicional IRPJ', 'Lei 9.249'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/beneficios-fiscais/perguntas-e-respostas-reducao-de-beneficios-v2.pdf',
    officialLinkLabel: 'Receita Federal: Perguntas e Respostas LC 224/2025',
    content: `# Lucro Presumido: presunções e LC 224/2025

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [Lei 9.249/1995, texto atualizado na Câmara](https://www2.camara.leg.br/legin/fed/lei/1995/lei-9249-26-dezembro-1995-349062-normaatualizada-pl.html): arts. 3º, 10, 15 e 20
> - [Receita Federal, Perguntas e Respostas "Redução dos Incentivos e Benefícios Tributários" V2 (LC 224/2025)](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/beneficios-fiscais/perguntas-e-respostas-reducao-de-beneficios-v2.pdf): perguntas 8, 11 a 14
> **Não conferido nesta revisão:** alíquotas e prazos de PIS/Cofins cumulativos, o texto da própria LC 224/2025 e o percentual de serviços hospitalares (a Lei 9.249 apenas os exclui dos 32%). Há notícias de decisões judiciais sobre a LC 224 (TRF3); **não foram lidas: preciso confirmar** antes de orientar sobre ações judiciais.

## 1. Percentuais de presunção do IRPJ (Lei 9.249, art. 15)
- **8%** da receita bruta mensal (regra geral: comércio, indústria, transporte de carga).
- **1,6%**: revenda, para consumo, de combustíveis derivados de petróleo, álcool carburante e gás natural.
- **16%**: transporte, exceto de carga.
- **32%**: prestação de serviços em geral, intermediação de negócios, administração, locação ou cessão de bens e direitos, factoring e construção vinculada a concessão.
- **38,4%**: operações de crédito de Empresa Simples de Crédito.
- Atividades diversificadas: aplica-se o percentual de cada atividade (§ 2º).

## 2. Presunção da CSLL (Lei 9.249, art. 20)
- **32%** para as atividades do art. 15, § 1º, III (serviços em geral etc.); **38,4%** para ESC; **12%** para as demais receitas.

## 3. Alíquota e adicional do IRPJ (Lei 9.249, art. 3º)
- **15%**, mais **adicional de 10%** sobre a parcela do lucro que exceder **R$ 20.000,00 multiplicados pelo número de meses** do período (R$ 60 mil no trimestre). O adicional não admite deduções.

## 4. LC 224/2025: acréscimo de 10% nos percentuais (Receita Federal, perguntas 8 e 11 a 14)
- Os percentuais de presunção sobem **10%** (exemplo oficial: 8% passa a **8,8%**; 32% passa a **35,2%**), **somente sobre a receita bruta que exceder R$ 5.000.000,00 no ano** (R$ 1.250.000,00 por trimestre), apurado proporcionalmente a cada período e a cada atividade.
- Receitas tributadas integralmente (financeiras, ganhos de capital) não entram no cálculo do limite.
- **Vigência:** IRPJ a partir do **1º trimestre de 2026**; CSLL a partir do **2º trimestre de 2026** (para a CSLL em 2026 o limite anual é R$ 3.750.000,00).
- **Exemplo oficial (1º trimestre de 2026, só comércio, receita de R$ 1.500.000,00):** 8% sobre R$ 1.250.000,00 + 8,8% sobre R$ 250.000,00.

## 5. Lucros e dividendos (Lei 9.249, art. 10, redação da Lei 15.270/2025)
- Isenção na fonte desde que observados os arts. 6º-A e 16-A da Lei 9.250/1995; lucros apurados **até o ano-calendário de 2025** com distribuição aprovada **até 31/12/2025** continuam isentos (§ 5º, I). Remessa ao exterior: **10%** na fonte (§ 4º). Detalhes da retenção mensal no bloco do Lucro Presumido desta base.`,
  },
  {
    id: 'retencoes-csrf-inss-encargos',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/retencoes-csrf-inss-encargos.md',
    title: 'Retenções na fonte: CSRF 4,65% (Lei 10.833), INSS 11% na cessão de mão de obra (Lei 8.212, art. 31) e encargos patronais',
    summary: 'Retenção de PIS/Cofins/CSLL de 4,65% em serviços entre pessoas jurídicas, dispensa até R$ 10,00, Simples não sofre retenção, recolhimento até o último dia útil do 2º decêndio; retenção de 11% do INSS na cessão de mão de obra até o dia 20; contribuição patronal de 20% e RAT de 1% a 3%; PLR e diárias fora do salário de contribuição.',
    tags: ['CSRF', 'retenção 4,65%', 'PIS Cofins CSLL retidos', 'cessão de mão de obra', 'retenção 11% INSS', 'CPP 20%', 'RAT', 'PLR', 'Lei 10.833', 'Lei 8.212'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www2.camara.leg.br/legin/fed/lei/2003/lei-10833-29-dezembro-2003-497045-normaatualizada-pl.html',
    officialLinkLabel: 'Lei 10.833/2003 (texto atualizado, Câmara)',
    content: `# Retenções na fonte e encargos sobre a folha

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [Lei 10.833/2003, texto atualizado (Câmara)](https://www2.camara.leg.br/legin/fed/lei/2003/lei-10833-29-dezembro-2003-497045-normaatualizada-pl.html): arts. 30, 31, 32 e 35
> - [Lei 8.212/1991, texto atualizado (Câmara)](https://www2.camara.leg.br/legin/fed/lei/1991/lei-8212-24-julho-1991-363647-normaatualizada-pl.html): arts. 22, 28, 30 e 31
> **Não conferido nesta revisão:** IRRF de 1,5% sobre serviços profissionais (Decreto 9.580/2018), retenção de ISS em Goiânia, tabela de Terceiros (FPAS) e as Instruções Normativas que detalham a retenção de 11% (IN RFB 2.110/2022). **Preciso confirmar** antes de afirmar esses pontos.

## 1. CSRF: PIS, Cofins e CSLL retidos (Lei 10.833/2003)
- **Quando (art. 30):** pagamentos de pessoa jurídica a pessoa jurídica de direito privado por **limpeza, conservação, manutenção, segurança, vigilância, transporte de valores, locação de mão de obra, assessoria creditícia** e pela **remuneração de serviços profissionais**. Também retêm associações, sociedades simples, fundações e condomínios edilícios (§ 1º).
- **Alíquota (art. 31):** **4,65%** = **1% CSLL + 3% Cofins + 0,65% PIS**, mesmo que o prestador seja do regime não cumulativo.
- **Dispensa (art. 31, § 3º):** retenção de valor **igual ou inferior a R$ 10,00** (exceto DARF eletrônico via Siafi).
- **Não se retém (art. 32):** de **optantes pelo Simples Nacional**, de empresas estrangeiras de transporte de valores e, quanto à CSLL, de cooperativas. Optante pelo Simples, como tomador, também não está obrigado a reter (art. 30, § 2º).
- **Recolhimento (art. 35):** até o **último dia útil do segundo decêndio do mês seguinte** ao do pagamento.

## 2. INSS: retenção de 11% na cessão de mão de obra (Lei 8.212, art. 31)
- O contratante de serviços por **cessão de mão de obra, inclusive trabalho temporário**, retém **11% do valor bruto da nota fiscal ou fatura** e recolhe em nome da cedente **até o dia 20 do mês seguinte** à emissão (dia útil anterior se não houver expediente bancário).
- O valor retido é **destacado na nota** e compensado pela cedente nas contribuições sobre a folha (§ 1º).
- **Cessão de mão de obra (§ 3º):** colocar segurados à disposição do contratante, em suas dependências ou nas de terceiros, para serviços contínuos, ligados ou não à atividade-fim.
- **Exemplos (§ 4º):** limpeza, conservação e zeladoria; vigilância e segurança; empreitada de mão de obra; trabalho temporário (Lei 6.019/1974).

## 3. Encargos patronais (Lei 8.212)
- **Art. 22, I:** **20%** sobre o total das remunerações de empregados e avulsos.
- **Art. 22, II (RAT):** **1% (risco leve), 2% (médio) ou 3% (grave)** conforme a atividade preponderante.
- **Art. 22, III:** **20%** sobre remunerações de contribuintes individuais (pró-labore, autônomos).
- **Art. 30, I, b:** recolher **até o dia 20 do mês seguinte** à competência.
- **Não integram o salário de contribuição (art. 28, § 9º):** **PLR** paga de acordo com lei específica (alínea j) e **diárias para viagens** (alínea h).
- Empresas do Simples: a CPP depende do anexo (no Anexo IV é recolhida à parte); ver bloco do Simples desta base.`,
  },
  {
    id: 'dctfweb-reinf-esocial-prazos-2026',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/dctfweb-reinf-esocial-prazos-2026.md',
    title: 'DCTFWeb (último dia útil do mês seguinte), EFD-Reinf (quem envia) e prazos do eSocial periódico (dia 15)',
    summary: 'DCTFWeb e DCTF unificadas (IN RFB 2.237/2024) com prazo no último dia útil do mês seguinte; MIT para IRPJ, CSLL, PIS, Cofins e IPI; quem está obrigado à EFD-Reinf; S-1200/S-1299 até o dia 15, 13º entre 1 e 20 de dezembro, S-1210 em regime de caixa.',
    tags: ['DCTFWeb', 'MIT', 'EFD-Reinf', 'eSocial', 'S-1200', 'S-1299', 'S-1210', 'prazo DCTFWeb', 'IN RFB 2.237/2024', 'fechamento da folha'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www.gov.br/pt-br/servicos/declarar-debitos-e-creditos-tributarios-federais',
    officialLinkLabel: 'gov.br: Declarar débitos e créditos tributários federais (DCTFWeb)',
    content: `# DCTFWeb, EFD-Reinf e prazos do eSocial periódico

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [gov.br, "Declarar débitos e créditos tributários federais" (DCTFWeb/MIT), modificado em 12/11/2026](https://www.gov.br/pt-br/servicos/declarar-debitos-e-creditos-tributarios-federais): IN RFB 2.237/2024
> - [gov.br, serviço EFD-Reinf, modificado em 29/07/2026](https://www.gov.br/pt-br/servicos/efd-reinf): IN RFB 2.043/2021
> - [Manual de Orientação do eSocial S-1.3, consolidado até a NO S-1.3 12.2026](https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-12-2026.pdf/@@download/file)
> **Não conferido nesta revisão:** o valor da multa da DCTFWeb (MAED), o prazo da EFD-Reinf em si, os prazos de S-2200, S-2206, S-2230 e S-2299 (capítulo III do MOS não lido) e o prazo do informe de rendimentos após a extinção da DIRF. **Preciso confirmar** antes de afirmar.

## 1. DCTFWeb (IN RFB 2.237/2024)
- A **DCTF e a DCTFWeb foram unificadas**. O **MIT** (Módulo de Inclusão de Tributos) substitui o PGD DCTF para IRPJ, CSLL, PIS/Pasep, IPI, Cofins, CIDE, IOF e outros.
- A DCTFWeb se alimenta do **eSocial, da EFD-Reinf e do MIT**.
- **Prazo (regra mensal):** até o **último dia útil do mês seguinte** ao dos fatos geradores. (O prazo antigo do dia 15 valia até o período 12/2024.)
- Atraso gera a **MAED** (o valor não está na página).
- MEI com empregado e optantes do Simples com até 1 empregado podem assinar com conta gov.br nível prata ou ouro; empresas usam certificado digital.

## 2. EFD-Reinf (IN RFB 2.043/2021)
- Obrigados, **mesmo imunes e isentos**, entre outros: quem **presta ou contrata serviços por cessão de mão de obra**; PJ responsáveis pela **retenção de PIS, Cofins e CSLL**; optantes pela **CPRB**; produtor rural PJ, agroindústria e adquirentes de produção rural; associações desportivas e patrocinadores; **quem pagou ou creditou rendimentos com IRRF**.
- Retenções ligadas ao **trabalho** vão pelo **eSocial**, não pela Reinf.
- A DCTFWeb só fica disponível após o fechamento da Reinf e do eSocial.

## 3. eSocial: eventos periódicos (MOS S-1.3)
- **S-1200/S-1202/S-1207 e fechamento S-1299:** até o **dia 15 do mês seguinte** ao período de apuração; se o dia não for útil, **prorroga para o primeiro dia útil seguinte**.
- **13º salário (apuração anual):** S-1200 e S-1299 **entre 1º e 20 de dezembro**.
- **S-1210 (pagamentos):** até o dia 15 do mês seguinte **ou até o fechamento da folha, o que ocorrer primeiro**; segue o **regime de caixa**.
- **Desligamento entre os dias 1 e 4 do mês:** a remuneração do mês anterior deve ser enviada até o **décimo dia seguinte ao desligamento**.
- Os prazos do eSocial **não alteram** os prazos de recolhimento de tributos e do FGTS.`,
  },
  {
    id: 'clt-jornada-ferias-rescisao-conferido',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/clt-jornada-ferias-rescisao-conferido.md',
    title: 'CLT conferida: jornada, horas extras, noturno, adicionais, férias, 13º, licenças, contrato de experiência e rescisão',
    summary: 'Artigos da CLT conferidos no texto atualizado da Câmara: jornada de 8h, hora extra mínima de 50%, banco de horas, 12x36, intervalos, adicional noturno de 20%, insalubridade e periculosidade, férias (faltas, fracionamento, dobra, abono, pagamento 2 dias antes), 13º (Lei 4.749), faltas justificadas, licença-maternidade, experiência de 90 dias, rescisão em 10 dias, justa causa, acordo do 484-A e aviso prévio.',
    tags: ['CLT', 'horas extras', 'adicional noturno', 'insalubridade', 'periculosidade', 'férias', '13º salário', 'rescisão', 'art. 477', 'art. 484-A', 'aviso prévio', 'justa causa', 'contrato de experiência', 'faltas justificadas', 'banco de horas', '12x36'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-5452-1-maio-1943-415500-normaatualizada-pe.html',
    officialLinkLabel: 'CLT, texto atualizado (Câmara dos Deputados)',
    content: `# CLT: regras do dia a dia do Departamento Pessoal (texto conferido)

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [CLT (Decreto-Lei 5.452/1943), texto atualizado na Câmara, atualizado em 06/04/2026](https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-5452-1-maio-1943-415500-normaatualizada-pe.html)
> - [Lei 4.749/1965 (13º salário), Senado](https://legis.senado.leg.br/norma/546602/publicacao/15810446)
> - [eSocial, notícia sobre a 1ª parcela do 13º](https://www.gov.br/esocial/pt-br/noticias/prazo-para-pagamento-da-primeira-parcela-do-13o-salario-encerra-se-dia-30-de-novembro-fique-atento-programe-se-evite-deixar-para-a-ultima-hora)
> **ATENÇÃO, mudanças de 2026:** (1) a **EC 141/2026** muda a jornada constitucional para 40 horas semanais com transição (ver bloco próprio desta base); os artigos da CLT abaixo ainda trazem a redação antiga. (2) A **Lei 15.371/2026** (licença-paternidade) **entra em vigor em 1º/1/2027**: até lá valem os 5 dias do art. 473, III; ver o bloco próprio desta base. O adicional de 100% em domingos e feriados não está na CLT lida.

## 1. Jornada e horas extras
- **Art. 58:** até **8 horas diárias**. **Art. 58-A (tempo parcial):** até 30h semanais sem extras, ou até 26h com até 6 extras (pagas com 50%).
- **Art. 59:** até **2 horas extras por dia**, por acordo individual, convenção ou acordo coletivo; adicional de **no mínimo 50%** (§ 1º).
- **Banco de horas:** compensação em até **1 ano** por acordo/convenção coletiva, limite de 10h diárias (§ 2º); por **acordo individual escrito, em até 6 meses** (§ 5º).
- **Art. 59-A (12x36):** por acordo individual escrito, convenção ou acordo coletivo; a remuneração mensal já abrange DSR e feriados.
- **Art. 66:** **11 horas** consecutivas de descanso entre jornadas.
- **Art. 71:** jornada acima de 6h: intervalo de **1 a 2 horas**; de 4 a 6h: **15 minutos**. Intervalo não concedido: paga-se **só o tempo suprimido com 50%**, natureza **indenizatória** (§ 4º).
- **Art. 73:** trabalho noturno (urbano) das **22h às 5h**, adicional de **no mínimo 20%**, hora noturna de **52 minutos e 30 segundos**.

## 2. Adicionais
- **Insalubridade (art. 192):** **40%, 20% ou 10% do salário mínimo** (graus máximo, médio e mínimo).
- **Periculosidade (art. 193):** **30% sobre o salário**, sem gratificações, prêmios ou PLR (§ 1º); inclui inflamáveis, explosivos, energia elétrica, segurança patrimonial/pessoal e **trabalho em motocicleta** (§ 4º). O empregado pode optar pela insalubridade se devida (§ 2º) — não se acumulam.
- **Exames médicos (art. 168):** obrigatórios, pagos pelo empregador, na **admissão, demissão e periodicamente**.

## 3. Férias
- **Art. 130:** 30 dias (até 5 faltas), 24 (6 a 14), 18 (15 a 23), 12 (24 a 32). É proibido descontar faltas das férias.
- **Art. 134:** concedidas nos 12 meses seguintes ao período aquisitivo; com concordância do empregado, em até **3 períodos**, um de **no mínimo 14 dias** e os outros de **no mínimo 5 dias** corridos.
- **Art. 137:** concedidas fora do prazo: **pagamento em dobro**.
- **Art. 143:** o empregado pode converter **1/3** das férias em **abono pecuniário**.
- **Art. 145:** pagar férias e abono **até 2 dias antes do início**.
- **Art. 146, parágrafo único:** férias proporcionais na rescisão (exceto justa causa) à razão de **1/12 por mês** ou fração **superior a 14 dias**.

## 4. 13º salário (Lei 4.749/1965)
- **1ª parcela (adiantamento):** entre **fevereiro e novembro**, metade do salário do mês anterior; a notícia oficial do eSocial confirma o limite de **30 de novembro**. Pode ser paga com as férias se o empregado pedir **em janeiro** (art. 2º, § 2º).
- **2ª parcela:** até **20 de dezembro** (art. 1º), descontado o adiantamento.
- Rescisão antes do pagamento: o adiantamento pode ser compensado com o 13º devido e, se não bastar, com outro crédito trabalhista (art. 3º).

## 5. Faltas justificadas (art. 473)
- Falecimento de cônjuge, ascendente, descendente, irmão ou dependente: até **2 dias**; casamento: até **3 dias**; nascimento de filho, adoção ou guarda: **5 dias** em 2026 (inciso III; a partir de 2027, Lei 15.371/2026); doação de sangue: 1 dia por ano; alistamento eleitoral: até 2 dias; vestibular; comparecimento a juízo; até 6 consultas da esposa/companheira na gravidez; 1 dia por ano para acompanhar filho de até 6 anos ao médico; até 3 dias por ano para exames preventivos de câncer.
- **Licença-maternidade (art. 392):** 120 dias, sem prejuízo do emprego e do salário. **Gestante no aviso prévio (art. 391-A):** a gravidez confirmada durante o aviso, trabalhado ou indenizado, garante a estabilidade provisória.

## 6. Contratos
- **Experiência:** no máximo **90 dias** (art. 445, parágrafo único). Prazo determinado prorrogado **mais de uma vez** vira indeterminado (art. 451).
- **Intermitente:** art. 443, § 3º.

## 7. Rescisão
- **Prazo (art. 477, § 6º):** entregar os documentos e pagar as verbas **até 10 dias contados do término do contrato**.
- **Multa por atraso (art. 477, § 8º):** multa administrativa de **160 BTN por trabalhador** e multa a favor do empregado **equivalente ao seu salário**, salvo se o empregado deu causa à mora.
- **Justa causa (art. 482):** improbidade; incontinência ou mau procedimento; negociação habitual sem permissão; condenação criminal transitada em julgado; desídia; embriaguez habitual ou em serviço; violação de segredo; indisciplina ou insubordinação; abandono de emprego; ofensas à honra ou físicas; jogos de azar; perda da habilitação por conduta dolosa.
- **Acordo (art. 484-A):** pela **metade** o aviso prévio (se indenizado) e a indenização do FGTS (40% vira **20%**); demais verbas integrais; saque de até **80%** do FGTS; **sem seguro-desemprego**.
- **Aviso prévio (art. 487):** 8 dias para pagamento semanal ou menor; **30 dias** para quinzenal/mensal ou mais de 12 meses de casa. A Lei 12.506/2011 acrescenta 3 dias por ano, até 90 dias (ver bloco CLT desta base).
- **Redução no aviso dado pelo empregador (art. 488):** **2 horas por dia** sem prejuízo do salário, ou faltar **7 dias corridos** (1 dia no caso do aviso de 8 dias).
- **FGTS:** multa de 40% (Lei 8.036, art. 18, § 1º) e prazos no bloco do FGTS Digital desta base.`,
  },
  {
    id: 'contabilidade-me-epp-nbc-tg-1001-1002',
    category: 'contabil',
    categoryLabel: 'Contabilidade',
    filePath: 'contabil/contabilidade-me-epp-nbc-tg-1001-1002.md',
    title: 'Contabilidade de micro e pequenas empresas: NBC TG 1002 e NBC TG 1001 (desde 2023), ITG 2000 e guarda dos livros',
    summary: 'Desde 2023 a NBC TG 1002 vale para microentidades (receita até R$ 4,8 milhões) e a NBC TG 1001 para pequenas empresas (acima de R$ 4,8 até R$ 78 milhões); a NBC TG 1000 ficou para médias empresas; ITG 2000 (escrituração, autenticação pelo SPED, demonstrações no Diário) e guarda até prescrição/decadência (CC art. 1.194).',
    tags: ['NBC TG 1002', 'NBC TG 1001', 'ITG 1000', 'ITG 2000', 'NBC TG 1000', 'microentidade', 'escrituração contábil', 'Livro Diário', 'CFC', 'ECD'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://cfc.org.br/noticias/contador-conheca-as-normas-de-contabilidade-voltadas-para-as-micro-e-pequenas-empresas/',
    officialLinkLabel: 'CFC: normas de contabilidade para micro e pequenas empresas',
    content: `# Contabilidade de ME e EPP: qual norma usar

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [CFC, notícia de 04/01/2022: normas de contabilidade para micro e pequenas empresas](https://cfc.org.br/noticias/contador-conheca-as-normas-de-contabilidade-voltadas-para-as-micro-e-pequenas-empresas/)
> - [CFC, perguntas frequentes sobre o Livro Diário](https://cfc.org.br/tecnica/perguntas-frequentes/livro-diario/)
> **Não conferido nesta revisão:** o texto integral das NBC TG 1001 e 1002, a resolução que revogou a ITG 1000 (a notícia de 2022 diz que "será revogada") e a lista de obrigados à ECD (IN RFB 2.003/2021). Diante de dúvida, dizer "preciso confirmar".

## 1. Qual norma (CFC)
- **NBC TG 1002 (Microentidades):** entidades com fins lucrativos e receita bruta **até R$ 4,8 milhões por ano**. Demonstrações pelo regime de competência: **balanço patrimonial, DRE e demonstração de lucros ou prejuízos acumulados** (sem fluxo de caixa).
- **NBC TG 1001 (Pequenas Empresas):** receita **acima de R$ 4,8 milhões até R$ 78 milhões** por ano. Demonstrações: balanço, resultado, mutações do PL ou lucros/prejuízos acumulados, **fluxos de caixa** e notas explicativas.
- **Vigência:** exercícios iniciados a partir de **1º/1/2023** (adoção antecipada permitida em 2022).
- **NBC TG 1000** passou a ser obrigatória **apenas para médias empresas**. A **ITG 1000** foi anunciada como revogada (confirmar a resolução).

## 2. Escrituração (ITG 2000 e FAQ do CFC)
- As demonstrações contábeis devem ser elaboradas **mesmo sem movimento**, e o Livro Diário registrado no órgão competente.
- Livros exigidos por lei (Diário, Razão) devem ser autenticados; com a **ECD**, a autenticação é feita pelo **SPED** (Decreto 8.683/2016), sem Junta Comercial.
- As demonstrações são **transcritas no Diário** e assinadas pelo profissional da contabilidade (ITG 2000, item 13). Na escrituração digital não se imprime nem encaderna (item 17).
- ECD autenticada só é substituída por erro que não possa ser corrigido por lançamento extemporâneo (ITG 2000, itens 31 a 36). Erros de exercícios anteriores: NBC TG 23, em "Ajustes de Exercícios Anteriores".
- **Guarda:** o Código Civil (art. 1.194) manda conservar a escrituração **enquanto não houver prescrição ou decadência**; o CFC recomenda guarda permanente dos livros.
- Simples Nacional: o Livro Caixa é dispensado para quem mantém Diário e Razão (ver bloco do Simples).`,
  },
  {
    id: 'icms-go-iss-goiania-conferido',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/icms-go-iss-goiania-conferido.md',
    title: 'Goiás e Goiânia: alíquota interna geral do ICMS de 19% (desde 1º/4/2024) e ISS de Goiânia no SGISS (NFS-e, REST, DUAM)',
    summary: 'Lei estadual 22.460/2023 fixou 19% para operações internas (art. 27, I, do CTE-GO) com efeitos a partir de 1º/4/2024; Goiânia opera o SGISS desde 1º/10/2025 (Decreto 2.824/2025): NFS-e ABRASF 2.04, declaração de retenções (REST) até o dia 5, guia DUAM.',
    tags: ['ICMS Goiás', 'alíquota 19%', 'Lei 22.460/2023', 'CTE-GO', 'ISS Goiânia', 'SGISS', 'NFS-e Goiânia', 'REST', 'DUAM', 'ISS retido'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://appasp.economia.go.gov.br/legislacao/arquivos/Leis/L_22460.htm',
    officialLinkLabel: 'Lei 22.460/2023 (Secretaria da Economia de Goiás)',
    content: `# ICMS em Goiás e ISS em Goiânia

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [Lei estadual 22.460/2023 (Secretaria da Economia de Goiás)](https://appasp.economia.go.gov.br/legislacao/arquivos/Leis/L_22460.htm)
> - [Prefeitura de Goiânia, FAQ do SGISS (V3)](https://www.goiania.go.gov.br/wp-content/uploads/2026/03/FAQ_FINAL_V3.pdf)
> **Não conferido nesta revisão:** alíquotas do ISS de Goiânia por item e o dia de vencimento (Código Tributário Municipal, LC 344/2021, não aberto), substituição tributária e DIFAL em Goiás (RCTE, Decreto 4.852/1997, não aberto), benefícios fiscais e alíquotas diferenciadas (incisos II, III, VII e IX do art. 27 do CTE). **Preciso confirmar** antes de afirmar esses pontos.

## 1. ICMS em Goiás
- **Alíquota interna geral: 19%** nas operações e prestações internas (Lei 11.651/1991, Código Tributário do Estado, art. 27, I, na redação da **Lei 22.460/2023**), salvo as exceções dos incisos II, III, VII e IX.
- **Efeitos a partir de 1º/4/2024** (art. 4º, na redação da Lei 22.572/2024).
- Optante pelo Simples recolhe o ICMS no DAS (salvo ST, DIFAL e outras hipóteses do art. 13, § 1º, da LC 123): **preciso confirmar** a regra específica no RCTE antes de orientar.

## 2. ISS em Goiânia (SGISS)
- **SGISS** (sistema de gestão do ISSQN) em operação desde **1º/10/2025**, regulamentado pelo **Decreto municipal 2.824/2025** e pelas Instruções Normativas 14, 15, 16, 17 e 19/2025.
- **NFS-e:** a Prefeitura deixou de ter emissor próprio; usa-se emissor de mercado no padrão **ABRASF 2.04** (o emissor gratuito "Nota Eletrônica" ia até 30/11/2025), com envio dos XML ao SGISS. Cancelar ou substituir: até o **5º dia do mês seguinte** à emissão.
- **Retenção (tomador):** declarar as notas com ISS retido (**REST**) até o **5º dia do mês seguinte** ao fato gerador; se não declarar, o sistema apura e gera a guia.
- **Competência:** encerramento espontâneo até o **dia 5** de cada mês; a guia (**DUAM**) pode ser gerada a qualquer momento.
- **Simples Nacional:** se o ISS **não for retido**, informar a alíquota na NFS-e é facultativo e o ISS é pago no **DAS**; se for retido, a alíquota é **obrigatória** na nota.
- **Reforma Tributária:** a NFS-e de padrão nacional passa a ser exigida no cronograma do Ato Conjunto RFB/CGIBS 4/2026 (ver bloco "Novidades de 2026"); confirmar a adesão de Goiânia.`,
  },
  {
    id: 'licenca-paternidade-lei-15371',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/licenca-paternidade-lei-15371.md',
    title: 'Licença-paternidade (Lei 15.371/2026): 10 dias em 2027, 15 em 2028, salário-paternidade e estabilidade do pai',
    summary: 'Lei 15.371/2026, em vigor em 1º/1/2027: licença-paternidade e salário-paternidade de 10 dias (2027), 15 dias (2028) e 20 dias (2029, condicionado à meta fiscal); empresa paga e é reembolsada; MEI e avulso recebem direto da Previdência; estabilidade do pai até 1 mês após a licença.',
    tags: ['licença-paternidade', 'salário-paternidade', 'Lei 15.371/2026', 'estabilidade do pai', 'art. 473 CLT', 'Empresa Cidadã'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://legis.senado.leg.br/norma/42975603/publicacao/42998279',
    officialLinkLabel: 'Lei 15.371/2026 (Senado)',
    content: `# Licença-paternidade: Lei 15.371/2026

> **Fonte oficial (conferida em 20/11/2026):** [Lei 15.371, de 31/03/2026 (Senado Federal)](https://legis.senado.leg.br/norma/42975603/publicacao/42998279)
> **Não conferido:** regulamento do INSS sobre o reembolso à empresa e os eventos do eSocial para o salário-paternidade. **Preciso confirmar** antes de orientar a rotina de folha.

## 1. Vigência
- A lei **entra em vigor em 1º/1/2027** (art. 14). **Em 2026 continua valendo a licença de 5 dias** do art. 473, III, da CLT.

## 2. Duração (art. 11)
- **10 dias** a partir de 1º/1/2027; **15 dias** a partir de 1º/1/2028; **20 dias** a partir de 1º/1/2029, **se cumprida a meta fiscal** (senão, só a partir do segundo exercício seguinte ao cumprimento).
- Filho com deficiência: período **acrescido de 1/3** (art. 12).
- Empresa Cidadã (Lei 11.770/2008): prorrogação de **15 dias** além do período obrigatório (art. 10).
- Internação da mãe ou do recém-nascido: licença prorrogada pelo tempo da internação (CLT, art. 392, § 8º).

## 3. Quem paga (Lei 8.213, arts. 73-D e 73-E)
- **Empregado:** a **empresa paga** o salário-paternidade (remuneração integral, proporcional aos dias) e é **reembolsada** pela Previdência; ME e EPP têm direito a reembolso em prazo razoável.
- **Empregado de MEI e avulso:** pagamento **direto pela Previdência Social**; também doméstico, contribuinte individual, facultativo e segurado especial.
- O salário-paternidade **integra o salário de contribuição** (como o salário-maternidade).

## 4. Estabilidade e férias
- **Proibida a dispensa sem justa causa** do pai entre o início da licença e **1 mês após o término** (art. 4º). Rescisão depois da comunicação e antes da licença, que impeça o gozo: período **indenizado em dobro**.
- O empregado pode emendar **férias logo após a licença**, avisando com 30 dias de antecedência (CLT, art. 134, §§ 4º e 5º).
- Ausência da mãe no registro ou adoção só pelo pai: a licença-paternidade **equivale à licença-maternidade** (CLT, art. 392-D).`,
  },
  {
    id: 'esocial-prazos-nao-periodicos-mos',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/esocial-prazos-nao-periodicos-mos.md',
    title: 'eSocial: prazos de admissão (S-2200/S-2190), alterações (S-2205/S-2206), afastamento (S-2230), reintegração e desligamento (S-2299 em 10 dias)',
    summary: 'Prazos do Manual de Orientação do eSocial S-1.3 (consolidado até a NO S-1.3 12.2026): S-2190 e S-2200 até o dia anterior ao início do trabalho; S-2205 e S-2206 até o dia 15 do mês seguinte; S-2230 de até 15 dias até o dia 15; S-2298 até o dia 15; S-2299 em até 10 dias do desligamento, antecipando se não for dia útil.',
    tags: ['eSocial', 'S-2200', 'S-2190', 'S-2205', 'S-2206', 'S-2230', 'S-2298', 'S-2299', 'prazo admissão eSocial', 'prazo desligamento eSocial'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-12-2026.pdf/@@download/file',
    officialLinkLabel: 'Manual de Orientação do eSocial S-1.3',
    content: `# eSocial: prazos dos eventos não periódicos (MOS S-1.3)

> **Fonte oficial (conferida em 20/11/2026):** [Manual de Orientação do eSocial S-1.3, consolidado até a NO S-1.3 12.2026](https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-12-2026.pdf/@@download/file), item "Prazo de envio" de cada evento.
> **Não conferido nesta revisão:** prazos de S-2210 (CAT), S-2220, S-2240 e do S-2230 acima de 15 dias. **Preciso confirmar.**

| Evento | Prazo de envio (MOS) |
| :--- | :--- |
| **S-2190** Registro preliminar | até o final do **dia imediatamente anterior** ao início da prestação do serviço |
| **S-2200** Admissão | empregados: até o **dia imediatamente anterior** ao início da prestação dos serviços |
| **S-2205** Alteração cadastral | até o **dia 15 do mês seguinte** ao mês de referência |
| **S-2206** Alteração contratual | até o **dia 15 do mês seguinte** ao da competência informada |
| **S-2230** Afastamento de até 15 dias | até o **dia 15 do mês seguinte** ao da ocorrência |
| **S-2298** Reintegração | até o **dia 15 do mês seguinte** ao da reintegração (dia não útil: primeiro dia útil seguinte) |
| **S-2299** Desligamento | **até 10 dias** contados da data do desligamento (exclui-se o dia do desligamento); **se cair em dia não útil, antecipa para o dia útil anterior** |

- **S-2299, exceções:** desligamento por transferência ou mudança de CPF, e estatutários: até o **dia 15 do mês seguinte** (dia não útil: posterga).
- **S-1200 de quem saiu entre os dias 1 e 4 do mês:** a remuneração do mês anterior vai até o **décimo dia** seguinte ao desligamento (ver bloco DCTFWeb/Reinf/eSocial).`,
  },
  {
    id: 'plr-seguro-desemprego-consignado',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/plr-seguro-desemprego-consignado.md',
    title: 'PLR (Lei 10.101/2000), seguro-desemprego (requisitos) e consignado Crédito do Trabalhador (Lei 15.179/2025)',
    summary: 'PLR negociada por comissão com sindicato ou acordo coletivo, até 2 pagamentos por ano com intervalo mínimo de um trimestre, sem encargos trabalhistas e com IR exclusivo na fonte por tabela própria; seguro-desemprego: 12 de 18 meses na 1ª vez, 9 de 12 na 2ª, 6 meses nas demais; consignado privado: empregador desconta e repassa, inclusive na rescisão, com multa de 30% por retenção sem repasse.',
    tags: ['PLR', 'participação nos lucros', 'Lei 10.101', 'seguro-desemprego', 'consignado', 'Crédito do Trabalhador', 'Lei 15.179/2025', 'empréstimo consignado'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www2.camara.leg.br/legin/fed/lei/2000/lei-10101-19-dezembro-2000-353953-normaatualizada-pl.html',
    officialLinkLabel: 'Lei 10.101/2000 (texto atualizado, Câmara)',
    content: `# PLR, seguro-desemprego e consignado do trabalhador

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [Lei 10.101/2000, texto atualizado (Câmara)](https://www2.camara.leg.br/legin/fed/lei/2000/lei-10101-19-dezembro-2000-353953-normaatualizada-pl.html)
> - [gov.br, "Solicitar o Seguro-Desemprego" (modificado em 25/09/2026)](https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego): Lei 7.998/1990 e Resolução Codefat 957/2022
> - [Lei 15.179/2025 (Senado)](https://legis.senado.leg.br/norma/41160586/publicacao/41164746)
> **Não conferido:** número de parcelas e prazo para pedir o seguro-desemprego; valores da tabela anual do IR sobre PLR; margem consignável do empregado CLT (a Lei 15.179 não fixa percentual geral) e o prazo de repasse do consignado. **Preciso confirmar.**

## 1. PLR (Lei 10.101/2000)
- **Negociação (art. 2º):** por **comissão paritária** com representante indicado pelo sindicato **ou** por **convenção/acordo coletivo**, com **regras claras e objetivas**.
- **Natureza (art. 3º):** não substitui nem complementa a remuneração e **não é base de encargo trabalhista**. Também não integra o salário de contribuição do INSS (Lei 8.212, art. 28, § 9º, j).
- **Periodicidade (art. 3º, § 2º):** **no máximo 2 pagamentos no mesmo ano civil**, com intervalo **mínimo de um trimestre civil**.
- **IR (art. 3º, § 5º):** **exclusivo na fonte**, separado dos demais rendimentos, pela **tabela anual própria** do Anexo (faixas de 0% a 27,5%); não entra no ajuste anual.
- **Lucro Real (art. 3º, § 1º):** dedutível como despesa operacional no exercício.

## 2. Seguro-desemprego (gov.br)
- Para quem foi **dispensado sem justa causa** e não tem renda própria suficiente nem benefício de prestação continuada (salvo auxílio-acidente, auxílio suplementar e abono de permanência).
- **Tempo de trabalho:** **1ª solicitação: 12 meses nos últimos 18**; **2ª: 9 meses nos últimos 12**; **demais: cada um dos 6 meses** anteriores à dispensa.
- O empregador entrega o **Requerimento do Seguro-Desemprego** na dispensa sem justa causa.
- **Acordo do art. 484-A da CLT não dá direito** ao seguro-desemprego (CLT, art. 484-A; ver bloco CLT).

## 3. Consignado "Crédito do Trabalhador" (Lei 15.179/2025, que altera a Lei 10.820/2003)
- **Obrigações do empregador (art. 2º-A, § 2º, I):** fazer o desconto das prestações, **inclusive nas verbas rescisórias**; prestar informações fiéis da folha; disponibilizar o termo de rescisão. O recolhimento pode ser por documento de arrecadação gerado no sistema; eSocial é condição para formalizar e averbar.
- **Rescisão ou suspensão:** a consignação é **redirecionada automaticamente** (art. 1º, § 9º).
- **Reter e não repassar (art. 3º):** **multa administrativa de 30%** do valor retido e não repassado, Termo de Débito Salarial (título executivo), pagamento atualizado com juros, além de sanções civis e penais em caso de apropriação. O empregador responde pelas informações, pelo desconto e pelo recolhimento (art. 5º).`,
  },
  {
    id: 'obrigacoes-federais-ecd-ecf-dirbi-certidoes-parcelamento',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/obrigacoes-federais-ecd-ecf-dirbi-certidoes-parcelamento.md',
    title: 'ECD (junho), ECF (julho), DIRBI (dia 20 do 2º mês), certidões federais (CND/CPEND) e parcelamento do Simples (60x, mínimo R$ 300)',
    summary: 'Prazos da ECD (último dia útil de junho) e da ECF (último dia útil de julho) no gov.br; DIRBI até o dia 20 do segundo mês seguinte, com dispensa para Simples (exceto CPRB) e MEI; tipos de certidão federal (Portaria Conjunta RFB/PGFN 1.751/2014); parcelamento ordinário do Simples em até 60 parcelas de no mínimo R$ 300, rescisão com 3 parcelas em atraso e reparcelamento com entrada de 10% ou 20%.',
    tags: ['ECD', 'ECF', 'DIRBI', 'certidão negativa', 'CND', 'CPEND', 'parcelamento Simples', 'PARCSN', 'reparcelamento', 'dívida ativa'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www.gov.br/pt-br/servicos/parcelar-imposto-simples',
    officialLinkLabel: 'gov.br: Parcelar débitos do Simples Nacional',
    content: `# Obrigações federais do escritório: ECD, ECF, DIRBI, certidões e parcelamento

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [gov.br, Entregar ECD (modificado em 29/07/2026)](https://www.gov.br/pt-br/servicos/entregar-escrituracao-contabil-digital) e [Entregar ECF (29/07/2026)](https://www.gov.br/pt-br/servicos/entregar-escrituracao-contabil-fiscal)
> - [Receita Federal, DIRBI (modificado em 28/07/2026)](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirbi-declaracao-de-incentivos-renuncias-beneficios-e-imunidades-de-natureza-tributaria)
> - [gov.br, Emitir certidão de regularidade fiscal (15/12/2025)](https://www.gov.br/pt-br/servicos/emitir-certidao-de-regularidade-fiscal-perante-a-fazenda-nacional)
> - [gov.br, Parcelar débitos do Simples Nacional (08/09/2026)](https://www.gov.br/pt-br/servicos/parcelar-imposto-simples)
> **Não conferido:** a lista de obrigados e dispensados da ECD e da ECF (IN RFB 2.003/2021 e 2.004/2021; o site normas.receita não abriu), as multas, o **prazo de validade** da certidão federal, a correção das parcelas (Selic), PERT e transação da PGFN. **Preciso confirmar.**

## 1. ECD e ECF
- **ECD:** pessoas jurídicas (inclusive equiparadas, imunes e isentas) obrigadas a manter escrituração contábil pela legislação comercial transmitem até o **último dia útil de junho** do ano seguinte (IN RFB 2.003/2021).
- **ECF:** pessoas jurídicas, inclusive equiparadas, de forma centralizada pela matriz, até o **último dia útil de julho** do ano seguinte (IN RFB 2.004/2021).
- Quem é dispensado (por exemplo, optante do Simples) **não consta nas páginas lidas**: preciso confirmar na IN antes de afirmar.

## 2. DIRBI (IN RFB 2.198/2024; Lei 14.973/2024)
- Obrigadas: PJ de direito privado em geral (inclusive equiparadas, imunes e isentas) e consórcios, **que usufruam de incentivos, renúncias, benefícios ou imunidades** tributárias; entrega **centralizada pela matriz**.
- **Dispensados:** **ME/EPP do Simples Nacional** (salvo as sujeitas à CPRB, no período em que estiverem no Simples), **MEI** e PJ em início de atividade (até o mês anterior à inscrição no CNPJ).
- **Prazo:** até o **dia 20 do segundo mês seguinte** ao do período de apuração.

## 3. Certidão de regularidade fiscal federal (CTN, arts. 205 e 206; Portaria Conjunta RFB/PGFN 1.751/2014)
- Emitida em conjunto pela **Receita Federal e PGFN**.
- **CND:** sem pendências; **CPEND (positiva com efeitos de negativa):** dívidas com exigibilidade suspensa ou garantidas; **CPD (positiva):** dívidas ou declarações não entregues.
- **Falta de declaração também impede a CND.**

## 4. Parcelamento ordinário do Simples Nacional (IN RFB 1.508/2014)
- Débitos do Simples (PGDAS-D) **ainda não enviados à Dívida Ativa**: até **60 parcelas**, mínimo de **R$ 300,00**. Depois de enviados à Dívida Ativa, o pedido é na **PGFN**.
- **Rescisão:** falta de pagamento de **3 parcelas, seguidas ou não**, ou da última; os débitos vão para a Dívida Ativa.
- **Reparcelamento:** permitido, incluindo novos débitos; primeira parcela de **10%** do total, ou **20%** se já houve reparcelamento.`,
  },
  {
    id: 'icms-go-st-difal-monofasico',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/icms-go-st-difal-monofasico.md',
    title: 'Goiás: calendário do ICMS (próprio, ST, DIFAL), DIFAL do Simples, e PIS/Cofins monofásico no Simples',
    summary: 'Prazos do ICMS em Goiás (IN 155/94-GSF consolidada até a IN 1613/2025): próprio até o dia 20 após a apuração, ST com remetente do Simples até o dia 2 do 2º mês, DIFAL do Simples para comercialização até o dia 10 do 2º mês; manual da SEFAZ sobre DIFAL do Simples; PIS/Cofins monofásico (Lei 10.147/2000) e segregação no PGDAS-D (Perguntão 7.2 a 7.4), ICMS-ST no PGDAS-D (7.1, 7.6, 7.9).',
    tags: ['ICMS Goiás', 'calendário ICMS', 'substituição tributária', 'ICMS-ST', 'DIFAL', 'diferencial de alíquotas', 'monofásico', 'PIS Cofins monofásico', 'Lei 10.147', 'segregação PGDAS-D', 'RCTE'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://goias.gov.br/economia/wp-content/uploads/sites/45/2026/01/Calendario_de_Recolhimento_de_ICMS_20250401-9.pdf',
    officialLinkLabel: 'SEFAZ-GO: Calendário de recolhimento do ICMS',
    content: `# ICMS em Goiás (prazos, ST, DIFAL) e PIS/Cofins monofásico

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [Secretaria da Economia de Goiás, Calendário de Recolhimento do ICMS (IN 155/94-GSF consolidada até a IN 1613/2025-GSE)](https://goias.gov.br/economia/wp-content/uploads/sites/45/2026/01/Calendario_de_Recolhimento_de_ICMS_20250401-9.pdf)
> - [Secretaria da Economia de Goiás, manual sobre DIFAL do Simples Nacional (vigência 01/03/2018)](https://goias.gov.br/economia/wp-content/uploads/sites/45/2018/02/manual-sobre-difal-simples-nacional-6cc.pdf)
> - [Lei 10.147/2000, texto atualizado (Câmara)](https://www2.camara.leg.br/legin/fed/lei/2000/lei-10147-21-dezembro-2000-377630-normaatualizada-pl.html) e [Perguntão do Simples Nacional, perguntas 7.1 a 7.9](https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoSN.pdf)
> **Não conferido:** lista de mercadorias sujeitas à ST em Goiás (Anexo VIII do RCTE), MVA, os coeficientes do DIFAL após a alíquota interna de 19% (o manual é de 2018 e usa coeficientes fixos), tabelas de CFOP, CST e CSOSN, e outras leis monofásicas (autopeças, bebidas, combustíveis). **Preciso confirmar.**

## 1. Prazos do ICMS em Goiás (calendário oficial)
- **ICMS próprio** (comércio, serviços, indústria): até o **20º dia após o fim do período de apuração**.
- **ST, substituto inscrito no CCE-GO:** remetente do regime normal: até o **dia 9 do mês seguinte** à saída; remetente **do Simples**: até o **dia 2 do segundo mês** seguinte; cimento: dia 10 do mês seguinte; **substituto não inscrito: no momento da saída**.
- **Complemento de ICMS-ST do optante do Simples:** até o **dia 10 do segundo mês** seguinte à saída.
- **DIFAL — Simples, aquisição para comercialização, produção rural ou industrialização:** até o **dia 10 do segundo mês** seguinte ao período de apuração.
- **DIFAL — remetente de outro Estado para consumidor final não contribuinte em GO:** inscrito no CCE-GO: até o **dia 15 do mês seguinte**; não inscrito: no momento da saída.
- **Vencimento em dia não útil:** paga **sem acréscimos no primeiro dia útil seguinte** (RCTE, art. 75, § 3º).

## 2. DIFAL do optante do Simples em Goiás (manual SEFAZ-GO de 2018; LC 123, art. 13, § 1º, XIII, h)
- Devido na **aquisição interestadual para comercialização ou produção rural** (inclusive MEI); fora: mercadoria com ST/antecipação e matéria-prima para indústria optante (isenta, RCTE, Anexo IX, art. 6º, CXXIV).
- Apurado por operação e somado no mês; pago em **DARE 5.1 distinto, código 4502**. O manual usa redução de base (RCTE, Anexo IX, art. 8º, VIII) com carga de 11%; **os coeficientes devem ser reconferidos** depois da alíquota interna de 19%.

## 3. PIS/Cofins monofásico
- **Lei 10.147/2000, art. 1º:** o **fabricante ou importador** de produtos farmacêuticos (2,1% PIS e 9,9% Cofins) e de perfumaria, toucador e higiene pessoal (2,2% e 10,3%) recolhe a contribuição concentrada; **art. 2º:** **alíquota zero** na revenda por quem não é industrial nem importador (**não vale para optante do Simples**, que trata pela segregação).
- **No Simples (Perguntão 7.2 a 7.4; LC 123, art. 18, § 4º-A, I, e § 12; CGSN 140, art. 25, § 6º):** a receita de produto monofásico deve ser **segregada** no PGDAS-D para **não pagar PIS e Cofins no DAS**; quem comercializa usa o Anexo I, quem industrializa ou importa usa o Anexo II.
- **ICMS-ST no PGDAS-D:** o substituído informa a receita com ST para não pagar o ICMS no DAS (7.1); o ICMS-ST devido pelo optante substituto é recolhido **fora do DAS** (7.6; CGSN 140, arts. 25, § 8º, II, e 28) e **não integra a receita bruta** (7.9; art. 28, § 4º).`,
  },
  {
    id: 'abertura-empresa-goias-juceg',
    category: 'contabil',
    categoryLabel: 'Contabilidade',
    filePath: 'contabil/abertura-empresa-goias-juceg.md',
    title: 'Abertura de empresa em Goiás (JUCEG/REDESIM): viabilidade, DBE, FCN, taxas, contrato, assinatura digital e órgãos municipais',
    summary: 'Passo a passo oficial da JUCEG para abrir LTDA pelo Portal do Empreendedor Goiano e gov.br: consulta de viabilidade (protocolo GOP), DBE da Receita, FCN, taxas, contrato eletrônico, anexos, assinatura digital, protocolo e trâmites posteriores na REDESIM.',
    tags: ['abertura de empresa', 'JUCEG', 'REDESIM', 'viabilidade', 'DBE', 'FCN', 'contrato social', 'Portal do Empreendedor Goiano', 'baixa de empresa'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://goias.gov.br/juceg/passo-a-passo-sociedade-empresaria-limitada-ltda-abertura/',
    officialLinkLabel: 'JUCEG: passo a passo LTDA (abertura)',
    content: `# Abertura de empresa em Goiás (JUCEG / REDESIM)

> **Fonte oficial (conferida em 20/11/2026):** [JUCEG, passo a passo LTDA, abertura](https://goias.gov.br/juceg/passo-a-passo-sociedade-empresaria-limitada-ltda-abertura/) — **a página é de 12/08/2019**; a JUCEG publicou manuais de 2026 (abertura LTDA e EI, baixa de EI) que **não foram lidos**. Confira o manual mais recente antes de orientar.
> **Não conferido:** valores das taxas, prazos de análise, inscrição estadual e municipal, alteração contratual e baixa. **Preciso confirmar.**

## Passos (processo digital)
1. **Viabilidade:** Portal do Empreendedor Goiano → Matriz → Abertura (redireciona ao gov.br); confere atividade no endereço e nome empresarial; gera o **protocolo GOP**; órgão de registro: Junta Comercial. Precisa de conta gov.br.
2. **DBE:** após a aprovação pela JUCEG e Prefeitura, preencher e transmitir o **DBE** da Receita Federal com o GOP.
3. **Acompanhar** pelo GOP no Portal do Empreendedor Goiano.
4. **FCN:** preencher e transmitir a Ficha de Cadastro Nacional.
5. **Taxas:** gerar e pagar.
6. **Contrato social:** Contrato Eletrônico → Contrato Próprio.
7. **Anexar** contrato e documentos (DARE, DARF, DBE etc.) e só então **assinar digitalmente**; o bloco "Documentos" recebe chancela, o bloco "Demais Documentos" não.
8. **Protocolar** após a assinatura de todos os sócios.
9. **Deferimento:** seguir nos demais órgãos da REDESIM (Prefeitura, Bombeiros, Vigilância Sanitária etc.).
- O sistema (em 2019) não atendia eletronicamente o caso de várias procurações.`,
  },
{
    id: 'reforma-tributaria-ibs-cbs-lc214-conferido',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/reforma-tributaria-ibs-cbs-lc214-conferido.md',
    title: 'Reforma Tributária explicada: IBS, CBS e Imposto Seletivo, ano-teste 2026, 2027-2033, Simples, crédito, split payment, reduções, cashback, destino e notas fiscais',
    summary: 'Guia didático conferido na EC 132/2023 (ADCT arts. 125 a 129; CF arts. 153, VIII, e 156-A) e na LC 214/2025 com as alterações da LC 227/2026 (Planalto): o que são IBS, CBS e IS; 2026 com 0,1% e 0,9% compensáveis e dispensa para quem cumpre obrigações acessórias (art. 348); Simples fora do teste de 2026; 2027 CBS e IS, extinção de PIS/Cofins (art. 542) e IPI zero; 2029-2032 ICMS/ISS em 9/10 a 6/10; Simples com opção semestral pelo regime regular (LC 123, art. 13, §§ 9º a 11) e crédito ao cliente (art. 23, § 1º-A); crédito (art. 47), split payment (arts. 31 a 35), reduções de 30% e 60% e cesta básica zero (arts. 125 a 128), cashback (arts. 112 a 124), destino (art. 11) e grupo IBSCBS na NFS-e.',
    tags: ['Reforma Tributária', 'IBS', 'CBS', 'Imposto Seletivo', 'LC 214/2025', 'LC 227/2026', 'EC 132/2023', 'ano-teste 2026', 'split payment', 'cashback', 'cesta básica', 'redução de 60%', 'redução de 30%', 'IBSCBS', 'cClassTrib', 'regime regular', 'crédito IBS CBS', 'transição ICMS ISS'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://planalto.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm',
    officialLinkLabel: 'LC 214/2025, texto compilado (Planalto)',
    content: `# Reforma Tributária do consumo: IBS, CBS e Imposto Seletivo (explicado do zero)

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [LC 214/2025, texto compilado com as alterações da LC 227/2026 (Planalto)](https://planalto.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm): arts. 1º, 4º a 12, 14 a 18, 27, 29, 31 a 36, 41, 47 a 57, 112 a 128, 343 a 348, 409, 474, 517, 542 e 544
> - [Emenda Constitucional 132/2023 (Planalto)](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm): CF arts. 153, VIII, e 156-A, § 1º; ADCT arts. 125 a 129
> - [NFS-e Nacional, Nota Técnica SE/CGNFS-e 004 v2.00, de 10/12/2025 (gov.br/nfse)](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc-producao-restrita-piloto/nt-004-se-cgnfse-novo-layout-rtc-v2-00-20251210.pdf)
> **Não conferido nesta revisão (não afirmar):** os valores das alíquotas de referência da CBS e do IBS (dependem de resolução do Senado, LC 214 art. 18); a lista de produtos dos anexos (cesta básica, 60%); o regulamento da CBS e os atos do Comitê Gestor do IBS; a Nota Técnica 2025.002 da NF-e/NFC-e no Portal Nacional da NF-e (não aberta) e versões da NT da NFS-e posteriores à 004; a data de início do split payment; a resolução do CGSN sobre a opção do Simples pelo regime regular. **Diante de pergunta sobre esses pontos: "preciso confirmar".**

## 1. O que muda, em uma frase
Cinco tributos sobre o consumo (PIS, Cofins, IPI, ICMS e ISS) vão sendo trocados por três: **CBS** (federal, no lugar de PIS e Cofins), **IBS** (de Estados e Municípios, no lugar de ICMS e ISS) e **Imposto Seletivo – IS** (federal, sobre o que faz mal à saúde ou ao meio ambiente). IBS e CBS funcionam como um **IVA**: cada etapa paga sobre o que vende e **desconta como crédito** o que foi pago nas compras.

## 2. Os três tributos
- **IBS e CBS (LC 214, art. 1º; CF, art. 156-A):** incidem sobre **operações onerosas com bens (materiais ou imateriais) e serviços** (art. 4º), inclusive importação. Não incidem, por exemplo, sobre salários, transferências entre estabelecimentos do mesmo contribuinte, dividendos e rendimentos financeiros (art. 6º). Princípio da **neutralidade** (art. 2º).
- **Alíquota do IBS = alíquota estadual + alíquota municipal do destino** (art. 15); a CBS é fixada pela União; cada ente fixa a sua por lei e, sem lei, vale a **alíquota de referência** fixada por **resolução do Senado** (arts. 14 e 18). Mesma alíquota para todas as operações, salvo exceções da lei (art. 16).
- **Imposto Seletivo (CF, art. 153, VIII; LC 214, art. 409):** sobre produção, extração, comercialização ou importação de bens e serviços prejudiciais à saúde ou ao meio ambiente; a lei lista veículos, embarcações e aeronaves, produtos fumígenos, bebidas alcoólicas, bebidas açucaradas, bens minerais e concursos de prognósticos (art. 409, § 1º). **Não incide** sobre exportações, energia elétrica e telecomunicações (CF, art. 153, § 6º, I). Incidência única; na extração, alíquota máxima de 1% do valor de mercado.

## 3. Cronograma (EC 132, ADCT arts. 125 a 129; LC 214, arts. 343 a 348, 474, 542 e 544)
| Ano | O que acontece |
| :--- | :--- |
| **2026** | **IBS 0,1%** (estadual) e **CBS 0,9%** (LC 214, arts. 343 e 346). O valor é **compensado com PIS/Cofins** (e, se faltar débito, com outro tributo federal ou ressarcido em até 60 dias) (art. 348, I e II). **Fica dispensado o recolhimento** para quem **cumprir as obrigações acessórias** (art. 348, § 1º). As alíquotas de 2026 **não se aplicam aos optantes do Simples Nacional** (art. 348, III, "c"). PIS e Cofins continuam devidos integralmente (art. 348, § 2º). Auto de infração por falta de obrigação acessória: intimação para regularizar em 60 dias e, atendida, a penalidade é extinta (art. 348, §§ 3º e 4º, LC 227/2026). |
| **2027 e 2028** | Começam a ser cobrados a **CBS** e o **Imposto Seletivo**; **extintos o PIS e a Cofins** (ADCT, art. 126; LC 214, art. 542, revogação a partir de 1º/1/2027). **IPI com alíquota zero**, salvo produtos com industrialização incentivada na Zona Franca de Manaus. **IBS 0,05% estadual + 0,05% municipal** e CBS **reduzida em 0,1 ponto percentual** (ADCT, art. 127; LC 214, arts. 344 e 347). |
| **2029 a 2032** | ICMS e ISS cobrados a **9/10 (2029), 8/10 (2030), 7/10 (2031) e 6/10 (2032)** das alíquotas atuais; benefícios fiscais reduzidos na mesma proporção (ADCT, art. 128; LC 214, arts. 501 e 508). O IBS cresce na transição. |
| **2033** | **ICMS e ISS extintos** (ADCT, art. 129). |

## 4. Base de cálculo e "por fora" (LC 214, art. 12; CF, art. 156-A, § 1º, IX)
- Base = valor total cobrado (acréscimos, juros, multas, descontos condicionados, frete, seguros, taxas).
- **Não entram:** o **próprio IBS e a CBS** (cálculo "por fora"), o IPI, os **descontos incondicionais**, reembolsos por conta e ordem e, **de 2026 a 2032, o ICMS, o ISS e o PIS/Cofins** (art. 12, § 2º).

## 5. Crédito: não cumulatividade (LC 214, arts. 47 a 57)
- O contribuinte do **regime regular** se credita do IBS/CBS das compras **quando o débito do fornecedor foi extinto** (pago, compensado, retido no split payment ou recolhido pelo adquirente) (art. 47). Exige **documento fiscal eletrônico idôneo** e **destaque correto** (art. 47, § 1º; art. 48, parágrafo único). IBS e CBS **não se compensam entre si**.
- **Sem crédito:** bens e serviços de **uso ou consumo pessoal** (art. 57) e compras imunes, isentas ou com alíquota zero (art. 49), salvo crédito presumido.
- Crédito perde o direito de uso em **5 anos** (art. 54); não pode ser transferido, salvo fusão, cisão ou incorporação (art. 55).

## 6. Split payment (LC 214, arts. 31 a 36)
- No pagamento eletrônico (cartão, Pix, boleto etc.), o **prestador de pagamento separa o IBS/CBS e recolhe no momento da liquidação financeira**; o fornecedor recebe o líquido. **Padrão** (art. 32): consulta o sistema da Receita/Comitê Gestor e recolhe a diferença ainda não extinta. **Simplificado** (art. 33): percentual pré-fixado, opcional; **não gera crédito ao adquirente contribuinte** e o excedente volta ao fornecedor em até 3 dias úteis.
- **Recolhimento pelo adquirente** (art. 36): o comprador do regime regular pode recolher ele mesmo quando o meio de pagamento não permite a separação.
- Implantação **gradual**; a data não foi conferida.

## 7. Simples Nacional e MEI
- Continuam existindo; recolhem IBS/CBS **dentro do DAS** (LC 214, art. 41, § 2º).
- **Opção pelo regime regular do IBS/CBS (LC 123, art. 13, §§ 9º a 11, redação da LC 227/2026, efeitos a partir de 1º/1/2027):** o optante pode apurar IBS e CBS **por fora do DAS**, pelo regime regular. A opção vale por **semestre** (janeiro e julho), é **irretratável** no semestre e é feita em **setembro** (para o semestre de janeiro) e **março** (para o de julho), na forma do CGSN.
- **Crédito para o cliente:** quem compra de optante que recolhe **pelo DAS** e está no regime regular se credita do IBS/CBS **no montante equivalente ao cobrado no Simples** (LC 123, art. 23, § 1º-A; LC 214, art. 47, § 9º). No regime regular, o optante gera o crédito cheio destacado na nota, como qualquer contribuinte.
- Quem recebeu ressarcimento no ano corrente ou anterior não pode sair do regime regular (LC 214, art. 41, § 5º).

## 8. Reduções e alíquota zero (LC 214, arts. 125 a 128)
- **Alíquota zero:** **Cesta Básica Nacional** (Anexo I, art. 125).
- **Redução de 30%:** serviços de **profissões intelectuais regulamentadas**, entre elas **contabilistas**, advogados, administradores, engenheiros, economistas, arquitetos (art. 127), com requisitos para a pessoa jurídica (sócios habilitados, sem sócio PJ, serviços prestados pelos sócios).
- **Redução de 60%:** educação, saúde, dispositivos médicos e de acessibilidade, medicamentos, alimentos destinados ao consumo humano, higiene pessoal e limpeza de baixa renda, produtos agropecuários in natura, insumos agropecuários, produções artísticas e culturais, comunicação institucional, atividades desportivas e segurança nacional/cibernética (art. 128), com listas em anexos.

## 9. Cashback: devolução personalizada (LC 214, arts. 112 a 124)
- Para famílias do **CadÚnico** com renda **per capita até meio salário mínimo**, residentes no País e com CPF regular (art. 113).
- **100% da CBS e 20% do IBS** em botijão de GLP até 13 kg, energia elétrica, água, esgoto, gás canalizado e telecomunicações; **20% da CBS e 20% do IBS** nos demais casos (art. 118). Estados e Municípios podem aumentar o percentual do IBS.
- Começa sobre o consumo de **janeiro de 2027 (CBS)** e **janeiro de 2029 (IBS)** (art. 123).

## 10. Destino: onde o imposto fica (LC 214, art. 11)
- Bem móvel: **local da entrega**; imóvel e serviços sobre imóvel: onde está o imóvel; serviço presencial: onde é prestado; transporte de passageiros: início; carga: entrega; **demais serviços e bens imateriais: domicílio principal do adquirente** (inciso X, redação da LC 227/2026).

## 11. Notas fiscais (NFS-e Nacional, NT 004 de 10/12/2025)
- A NFS-e ganhou o grupo **IBSCBS** (com **CST**, **cClassTrib**, destinatário, valores, diferimento etc.), em produção desde **5/1/2026**. Pela NT 004, **o preenchimento não era obrigatório em 2026** (regras suspensas "temporariamente"), mas, se informado, é validado. Conferir a versão mais recente da NT antes de orientar o emissor.
- NF-e/NFC-e: a NT 2025.002 cria os grupos de IBS, CBS e IS, **não conferida aqui**.

## 12. O que o contador faz agora (com base nos artigos acima)
1. Emitir as notas com os campos de IBS/CBS (CST e cClassTrib) assim que o emissor permitir e cumprir as obrigações acessórias: é isso que **dispensa o recolhimento de 2026** (art. 348, § 1º).
2. Continuar apurando e pagando **PIS/Cofins, ICMS e ISS normalmente** em 2026.
3. Para cada cliente do Simples que vende para empresas, simular se vale optar pelo **regime regular do IBS/CBS** — a primeira janela para 2027 é **setembro** do ano anterior, conforme regulamentação do CGSN.
4. Revisar cadastros (NCM/NBS) para identificar **cesta básica, reduções de 30%/60%** e produtos sujeitos ao **Imposto Seletivo**.
5. Revisar contratos e preços: o IBS/CBS é **por fora** e o crédito depende do **pagamento** do débito na etapa anterior.`,
  },
];

