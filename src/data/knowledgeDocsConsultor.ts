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
    summary: 'Limite anual do MEI (R$ 81.000, proporcional R$ 6.750 por mês no início), desenquadramento por excesso até e acima de 20%, contratação de um único empregado, composição do DAS-MEI e DASN-SIMEI até o último dia de maio.',
    tags: ['MEI', 'SIMEI', 'DASN-SIMEI', 'DAS-MEI', 'limite MEI', 'empregado do MEI', 'desenquadramento'],
    lastUpdated: CONFERIDO,
    officialLink: 'https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoMEI.pdf',
    officialLinkLabel: 'Perguntas e Respostas MEI e Simei (CGSN)',
    content: `# MEI: limites e obrigações

> **Fontes oficiais (conferidas em 20/11/2026):**
> - [Perguntas e Respostas MEI e Simei (CGSN, atualizado em 29/04/2025)](https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoMEI.pdf): perguntas 1.2, 3.1, 3.6, 3.9, 6.3, 6.4 e 6.8
> - [LC 123/2006, compilação no Senado](https://legis.senado.leg.br/norma/572878/publicacao/34621013): art. 18-A, § 1º
> **ATENÇÃO:** a compilação da LC 123 traz a marca "vide LC 238/2026" no art. 18-A, §§ 1º e 2º, e no art. 18-C (limite e empregado do MEI). **O conteúdo da LC 238/2026 não foi lido: preciso confirmar se o limite ou as regras do empregado mudaram e desde quando.** Também não foi conferido o dia de vencimento do DAS-MEI.

## 1. Limite de receita (LC 123, art. 18-A, § 1º; Perguntão MEI 1.2 e 6.4)
- **R$ 81.000,00** por ano-calendário (texto lido; ver alerta da LC 238/2026).
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
> **ATENÇÃO, mudanças de 2026:** (1) a **EC 141/2026** muda a jornada constitucional para 40 horas semanais com transição (ver bloco próprio desta base); os artigos da CLT abaixo ainda trazem a redação antiga. (2) Os arts. 391-A, 392, 392-A, 393 e 473, III, trazem a marca **"vide Lei 15.371, de 31/3/2026"** (licença-maternidade/paternidade e afins): **o conteúdo dessa lei não foi lido, preciso confirmar** antes de afirmar prazos de licença. O adicional de 100% em domingos e feriados não está na CLT lida.

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
- Falecimento de cônjuge, ascendente, descendente, irmão ou dependente: até **2 dias**; casamento: até **3 dias**; nascimento de filho, adoção ou guarda: **5 dias** (inciso III, ver alerta da Lei 15.371/2026); doação de sangue: 1 dia por ano; alistamento eleitoral: até 2 dias; vestibular; comparecimento a juízo; até 6 consultas da esposa/companheira na gravidez; 1 dia por ano para acompanhar filho de até 6 anos ao médico; até 3 dias por ano para exames preventivos de câncer.
- **Licença-maternidade (art. 392):** 120 dias, sem prejuízo do emprego e do salário (ver alerta da Lei 15.371/2026). **Gestante no aviso prévio (art. 391-A):** a gravidez confirmada durante o aviso, trabalhado ou indenizado, garante a estabilidade provisória.

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
];
