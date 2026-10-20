export interface OfficialSource {
  name: string;
  url: string;
  desc: string;
}

export const OFFICIAL_SOURCES: OfficialSource[] = [
  {
    name: 'Receita Federal',
    url: 'https://www.receita.fazenda.gov.br',
    desc: 'Portal oficial para tributos federais, certidões, CNPJ, DCTFWeb, IRPJ, CSLL, PIS e COFINS.',
  },
  {
    name: 'SEFAZ Goiás — Consulta NFe',
    url: 'http://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal',
    desc: 'Consulta pública oficial de Notas Fiscais Eletrônicas e autenticidade de documentos fiscais.',
  },
  {
    name: 'eSocial',
    url: 'https://www.esocial.gov.br',
    desc: 'Ambiente oficial para admissões, demissões, folha de pagamento e eventos trabalhistas e previdenciários.',
  },
  {
    name: 'CLT — Consolidação das Leis do Trabalho',
    url: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    desc: 'Texto legal compilado oficial da Presidência da República para relações de emprego e rescisões.',
  },
  {
    name: 'Simples Nacional — Portal',
    url: 'https://www8.receita.fazenda.gov.br/SimplesNacional',
    desc: 'Portal oficial do PGDAS-D, DEFIS, enquadramento ME/EPP, Fator R e sublimites.',
  },
  {
    name: 'CFC — Conselho Federal de Contabilidade',
    url: 'https://www.cfc.org.br',
    desc: 'Normas Brasileiras de Contabilidade (NBCs), resoluções e regulamentação profissional nacional.',
  },
  {
    name: 'Reforma Tributária — Portal da Câmara',
    url: 'https://www.camara.leg.br/reformatributaria',
    desc: 'Acompanhamento oficial da EC 132/2023, Leis Complementares regulamentadoras do IBS e CBS.',
  },
];

export interface KnowledgeDoc {
  id: string;
  category: 'fiscal' | 'dp-trabalhista' | 'contabil' | 'aviso-legal' | 'fontes-oficiais';
  categoryLabel: string;
  filePath: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
  lastUpdated: string;
  officialLink?: string;
  officialLinkLabel?: string;
}

export const KNOWLEDGE_BASE_DOCS: KnowledgeDoc[] = [
  {
    id: 'simples-nacional',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/simples-nacional.md',
    title: 'Simples Nacional: Enquadramento, Anexos e Fator R',
    summary: 'Limites de faturamento (R$ 4.8M e sublimite R$ 3.6M), Anexos I a V, alíquotas nominais vs efetivas e cálculo da regra do Fator R (28%).',
    tags: ['Simples Nacional', 'Fator R', 'LC 123/2006', 'PGDAS-D', 'Sublimite ICMS/ISS'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www8.receita.fazenda.gov.br/SimplesNacional',
    officialLinkLabel: 'Portal do Simples Nacional',
    content: `# Simples Nacional - Guia Operacional e Técnico

> **Legislação Base:** Lei Complementar nº 123/2006, Resoluções CGSN nº 140/2018 e alterações posteriores.

---

## 1. Conceito e Enquadramento

O Regime Especial Unificado de Arrecadação de Tributos e Contribuições devidos pelas Microempresas e Empresas de Pequeno Porte (Simples Nacional) unifica em uma única guia de recolhimento (o DAS - Documento de Arrecadação do Simples Nacional) os seguintes tributos:
- **Federais:** IRPJ, CSLL, PIS/Pasep, COFINS, IPI e CPP (Contribuição Patronal Previdenciária, exceto Anexo IV).
- **Estadual:** ICMS.
- **Municipal:** ISS.

### Limites e Sublimites de Faturamento
- **Microempresa (ME):** Receita bruta anual de até R$ 360.000,00.
- **Empresa de Pequeno Porte (EPP):** Receita bruta anual superior a R$ 360.000,00 e igual ou inferior a R$ 4.800.000,00.
- **Sublimite Estadual/Distrital (ICMS e ISS):** R$ 3.600.000,00 acumulados nos últimos 12 meses (RBT12).
  - *Regra prática:* Ultrapassado o sublimite de R$ 3.600.000,00 (por mais de 20% ou no ano-calendário subsequente se menor que 20%), o ICMS e o ISS passam a ser recolhidos fora do Simples Nacional, pelas regras ordinárias estaduais (SPED Fiscal/GIA) e municipais (Nota Fiscal de Serviços Eletrônica).

---

## 2. Estrutura dos Anexos

| Anexo | Atividades Principais | Alíquota Nominal Inicial | Alíquota Máxima | Particularidade Previdenciária |
| :--- | :--- | :--- | :--- | :--- |
| **Anexo I** | Comércio em geral | 4,00% | 19,00% | Inclui CPP na guia DAS |
| **Anexo II** | Indústria | 4,50% | 30,00% | Inclui CPP e IPI na guia DAS |
| **Anexo III** | Serviços (manutenção, saúde básica, etc.) | 6,00% | 33,00% | Inclui CPP na guia DAS |
| **Anexo IV** | Serviços advocatícios, construção civil, vigilância | 4,50% | 33,00% | **NÃO inclui CPP** (recolhe CPP 20% + RAT no DCTFWeb) |
| **Anexo V** | Serviços intelectuais, tecnologia, engenharia | 15,50% | 30,50% | Sujeito à regra do **Fator R** |

---

## 3. A Regra do Fator R (Anexo III vs Anexo V)

Determinadas atividades intelectuais e técnicas (art. 18, § 5º-J da LC 123/2006), tais como desenvolvimento de software, consultoria, engenharia, medicina, psicologia, perícia e jornalismo, são tributadas originariamente pelo **Anexo V** (alíquota inicial de 15,5%).

Contudo, se a razão entre a folha de salários dos últimos 12 meses e a receita bruta dos últimos 12 meses for igual ou superior a 28%, a empresa é tributada pelo benéfico **Anexo III** (alíquota inicial de 6,0%):

$$\\text{Fator R} = \\frac{\\text{Folha de Salários dos últimos 12 meses (incluindo Pró-Labore + Encargos)}}{\\text{Receita Bruta dos últimos 12 meses (RBT12)}}$$

- **Se Fator R $\\ge 0,28$ (28%):** Tributa no **Anexo III** (Economia tributária substancial).
- **Se Fator R $< 0,28$ (28%):** Tributa no **Anexo V**.

---

## 4. Fórmula do Cálculo da Alíquota Efetiva

A alíquota aplicada sobre o faturamento do mês não é a nominal, mas sim a alíquota efetiva calculada conforme fórmula do PGDAS-D:

$$\\text{Alíquota Efetiva} = \\frac{(\\text{RBT12} \\times \\text{Alíquota Nominal}) - \\text{Parcela a Deduzir}}{\\text{RBT12}}$$

---

## 5. Prazos e Obrigações Acessórias

1. **Vencimento do DAS:** Dia 20 do mês subsequente ao de competência.
2. **PGDAS-D:** Declaração mensal obrigatória até o vencimento do DAS.
3. **DEFIS:** Transmissão anual até 31 de março.`
  },
  {
    id: 'lucro-presumido',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/lucro-presumido.md',
    title: 'Lucro Presumido: Presunções, IRPJ, CSLL e PIS/COFINS',
    summary: 'Teto de R$ 78M, coeficientes de presunção (8% e 32%), adicional de 10% do IRPJ, PIS/COFINS cumulativo (3,65%) e retenções na fonte.',
    tags: ['Lucro Presumido', 'IRPJ', 'CSLL', 'PIS/COFINS', 'CSRF 4.65%'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www.receita.fazenda.gov.br',
    officialLinkLabel: 'Receita Federal do Brasil (RIR/2018)',
    content: `# Lucro Presumido - Manual Técnico e Apuração

> **Legislação Base:** Lei nº 9.718/1998, Decreto nº 9.580/2018 (RIR/2018) e Instrução Normativa RFB nº 1.700/2017.

---

## 1. Conceito e Regras de Opção

O Lucro Presumido é uma modalidade de tributação simplificada para determinação da base de cálculo do IRPJ e da CSLL de pessoas jurídicas que não estejam obrigadas à tributação pelo Lucro Real.

- **Limite de Receita Total:** Até R$ 78.000.000,00 no ano-calendário anterior.
- **Periodicidade de Apuração do IRPJ e CSLL:** Trimestral (31/03, 30/06, 30/09 e 31/12).
- **Opção:** Concretiza-se com o pagamento da 1ª quota ou quota única do imposto trimestral, sendo irretratável para o ano inteiro.

---

## 2. Coeficientes de Presunção da Receita

| Segmento de Atividade | Presunção IRPJ | Presunção CSLL |
| :--- | :--- | :--- |
| **Comércio e Indústria em geral** | 8,0% | 12,0% |
| **Transporte de Cargas** | 8,0% | 12,0% |
| **Transporte de Passageiros** | 16,0% | 12,0% |
| **Serviços Hospitalares (RDC Anvisa)** | 8,0% | 12,0% |
| **Prestação de Serviços em geral** | 32,0% | 32,0% |

---

## 3. Apuração do IRPJ e CSLL Trimestral

### IRPJ
1. **Base de Cálculo:** (Receita Bruta do Trimestre × % Presunção) + Ganhos de Capital.
2. **Alíquota Básica:** 15% sobre a Base de Cálculo.
3. **Adicional do IRPJ:** 10% sobre a parcela da base de cálculo que exceder R$ 60.000,00 no trimestre (R$ 20.000,00/mês).

### CSLL
1. **Base de Cálculo:** (Receita Bruta do Trimestre × % Presunção).
2. **Alíquota:** 9% sobre a Base de Cálculo.

---

## 4. PIS e COFINS no Regime Cumulativo

- **Alíquota PIS:** 0,65% sobre a receita bruta mensal.
- **Alíquota COFINS:** 3,00% sobre a receita bruta mensal.
- Total PIS/COFINS: **3,65%** sem apropriação de créditos.
- **Vencimento:** Até o 25º dia do mês subsequente.`
  },
  {
    id: 'icms-regras',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/icms-regras.md',
    title: 'ICMS: Alíquotas Interestaduais, DIFAL e Substituição Tributária',
    summary: 'Operações interestaduais (4%, 7%, 12%), DIFAL para consumidor final não contribuinte (LC 190/22) e cálculo de ICMS-ST com MVA ajustada.',
    tags: ['ICMS', 'DIFAL', 'Substituição Tributária', 'MVA', 'LC 87/96'],
    lastUpdated: '2026-10-17',
    officialLink: 'http://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal',
    officialLinkLabel: 'SEFAZ Goiás — Consulta NFe',
    content: `# ICMS - Regras Fundamentais, DIFAL e Substituição Tributária

> **Legislação Base:** Lei Complementar nº 87/1996 (Lei Kandir), EC nº 87/2015, LC nº 190/2022 e Convênios ICMS / CONFAZ.

---

## 1. Alíquotas Interestaduais Padronizadas

- **7,0%:** Origem Sul e Sudeste (exceto ES) para Norte, Nordeste, Centro-Oeste e ES.
- **12,0%:** Entre Estados do Sul e Sudeste, ou saídas do Norte/Nordeste/Centro-Oeste para qualquer Estado.
- **4,0%:** Mercadorias importadas do exterior com conteúdo de importação superior a 40% (Resolução do Senado nº 13/2012 e FCI).

---

## 2. DIFAL (Diferencial de Alíquotas)

$$\\text{DIFAL} = \\text{Alíquota Interna Destino} - \\text{Alíquota Interestadual}$$

- **Consumidor Final Não Contribuinte (E-commerce):** O remetente apura e recolhe em favor do Estado de destino via GNRE ou Inscrição Estadual.
- **Consumidor Final Contribuinte (Uso/Consumo ou Ativo):** O destinatário apura e recolhe na entrada.`
  },
  {
    id: 'reforma-tributaria',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/reforma-tributaria.md',
    title: 'Reforma Tributária: IVA Dual (IBS/CBS), IS e Cronograma 2026-2033',
    summary: 'Substituição do PIS, COFINS, IPI, ICMS e ISS por CBS (Federal) e IBS (Estados/Municípios), teste de 0,9%/0,1% em 2026 e split payment.',
    tags: ['Reforma Tributária', 'EC 132/2023', 'IBS', 'CBS', 'Split Payment'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www.camara.leg.br/reformatributaria',
    officialLinkLabel: 'Portal da Câmara (Reforma Tributária)',
    content: `# Reforma Tributária sobre o Consumo - Guia de Transição

> **Legislação Base:** Emenda Constitucional nº 132/2023 e Leis Complementares regulamentadoras.

---

## 1. O Novo Modelo: IVA Dual e Imposto Seletivo

Extinção de 5 tributos cumulativos:
- **Federais:** PIS, COFINS e IPI.
- **Estadual:** ICMS.
- **Municipal:** ISS.

Substitutos:
1. **CBS (Contribuição sobre Bens e Serviços):** Federal, gerida pela Receita Federal.
2. **IBS (Imposto sobre Bens e Serviços):** Gerido pelo Comitê Gestor (Estados e Municípios).
3. **IS (Imposto Seletivo):** Extra-fiscal para produtos prejudiciais à saúde/meio ambiente.

---

## 2. Cronograma de Transição

- **2026:** Alíquota de teste de **0,9% (CBS)** e **0,1% (IBS)**.
- **2027:** CBS em vigor pleno; PIS/COFINS extintos; IPI a zero; início do IS.
- **2029 a 2032:** Redução gradual de ICMS e ISS em 1/10 ao ano.
- **2033:** Vigência definitiva e plena do novo modelo IBS/CBS.`
  },
  {
    id: 'clt-principios',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/clt-principios.md',
    title: 'CLT: Princípios Trabalhistas, Jornada, Férias e Rescisões',
    summary: 'Princípios fundamentais (in dubio pro operario, primazia da realidade), tipos contratuais, limite de 44h semanais, banco de horas e prazos rescisórios.',
    tags: ['CLT', 'Decreto-Lei 5.452/43', 'Jornada', 'Férias', 'Rescisão Contratual'],
    lastUpdated: '2026-10-17',
    officialLink: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    officialLinkLabel: 'CLT - Presidência da República',
    content: `# Princípios Trabalhistas da CLT e Rotinas de DP

> **Legislação Base:** CLT (Decreto-Lei nº 5.452/1943) e Lei nº 13.467/2017.

---

## 1. Princípios Basilares

- **Princípio da Proteção:** *In dubio pro operario*, aplicação da norma mais favorável e condição mais benéfica.
- **Primazia da Realidade:** Fatos reais prevalecem sobre formalidades contratuais.
- **Irrenunciabilidade:** Direitos trabalhistas mínimos cogentes não podem ser renunciados.
- **Inalterabilidade Contratual Lesiva (Art. 468 CLT):** Proibidas alterações contratuais unilaterais ou prejudiciais.

---

## 2. Jornada, Horas Extras e Intervalos

- **Jornada Padrão:** 8 horas diárias e 44 horas semanais.
- **Horas Extras:** Acréscimo mínimo de 50% em dias úteis ou 100% em domingos e feriados.
- **Intervalo Intrajornada:** Mínimo de 1 hora para jornadas superiores a 6 horas (podendo ser reduzido para 30 min por acordo coletivo).
- **Intervalo Interjornada:** Mínimo de 11 horas consecutivas entre jornadas diárias.

---

## 3. Prazos Rescisórios (Art. 477, § 6º CLT)

O pagamento de todas as verbas rescisórias deve ser efetuado em até **10 dias corridos** após o término do contrato, sob pena de multa de 1 salário do empregado.`
  },
  {
    id: 'eSocial-prazos',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/eSocial-prazos.md',
    title: 'eSocial: Calendário de Eventos, Prazos Oficiais e DCTFWeb',
    summary: 'Tabela de eventos periódicos e não periódicos (S-2190, S-2200, S-2210, S-2220, S-2240, S-2299, S-1200) e transmissão para DCTFWeb.',
    tags: ['eSocial', 'DCTFWeb', 'S-2200 Admissão', 'S-2299 Desligamento', 'Prazos'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www.esocial.gov.br',
    officialLinkLabel: 'Portal Oficial do eSocial',
    content: `# eSocial - Calendário Oficial e Prazos de Eventos

> **Legislação Base:** Portarias Conjuntas MTE/RFB e Manual de Orientação do eSocial (MOS).

---

## 1. Prazos dos Eventos Não Periódicos

- **S-2190 / S-2200 (Admissão):** Até o final do dia imediatamente anterior ao início do trabalho.
- **S-2210 (CAT - Acidente de Trabalho):** Até o 1º dia útil seguinte ao acidente (ou imediatamente em óbito).
- **S-2220 (ASO / Saúde do Trabalhador):** Até dia 15 do mês subsequente à emissão.
- **S-2240 (Condições Ambientais - SST):** Até dia 15 do mês seguinte ao início da exposição aos riscos.
- **S-2299 (Desligamento):** Até **10 dias corridos** do término do vínculo.

---

## 2. Eventos Periódicos (Folha de Pagamento)

- **S-1200 / S-1210 / S-1299:** Fechamento da folha mensal até o **dia 15 do mês seguinte**.
- **DCTFWeb (DARF Previdenciário):** Transmitida após fechamento da folha, com vencimento no **dia 20 do mês subsequente**.`
  },
  {
    id: 'fgts-inss',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/fgts-inss.md',
    title: 'FGTS Digital e INSS: Faixas Progressivas, Guia Pix e Multas',
    summary: 'Tabela do INSS 2026 (7,5% a 14%, teto R$ 8.475,55), FGTS Digital com vencimento até o dia 20 e pagamento via Pix.',
    tags: ['FGTS Digital', 'INSS Progressivo', 'Teto RGPS', 'CPP', 'Pix Obrigatório'],
    lastUpdated: '2026-10-20',
    officialLink: 'https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal',
    officialLinkLabel: 'INSS — Tabela de contribuição',
    content: `# FGTS Digital e INSS - Regras de Apuração

> **Legislação Base:** Lei nº 8.036/1990, EC nº 103/2019 e Lei nº 14.438/2022 (FGTS Digital).

---

## 1. Tabela de contribuição do INSS 2026 (Empregado, doméstico e avulso)

> **Fonte oficial:** [INSS — Tabela de contribuição mensal](https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal) · **Base:** Portaria Interministerial MPS/MF nº 13, de 9/1/2026 · vigente desde a competência janeiro/2026 · conferida em 20/10/2026.

| Salário de contribuição (R$) | Alíquota |
| :--- | :--- |
| Até 1.621,00 | 7,5% |
| De 1.621,01 até 2.902,84 | 9% |
| De 2.902,85 até 4.354,27 | 12% |
| De 4.354,28 até 8.475,55 | 14% |

- **Teto do salário de contribuição:** R$ 8.475,55.
- **Cálculo:** progressivo, aplicando cada alíquota somente à parcela do salário dentro da respectiva faixa.
- **Contribuição máxima do empregado (calculada por essa progressão):** R$ 988,09.
- **Atenção:** os valores mudam todo ano por portaria. Para outra competência, confira a tabela do ano na fonte oficial.

---

## 2. FGTS Digital

> **Fontes oficiais:** [FGTS — FGTS Digital](https://www.fgts.gov.br/Paginas/empregador/fgts-digital.aspx) e [MTE — FGTS Digital](https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital) · **Base:** Lei nº 8.036/1990 (art. 17-A) e Portaria MTE nº 240/2024 · conferida em 20/10/2026.

- **Vencimento mensal:** até o dia 20 de cada mês (competência a partir de 03/2024). Quando o dia 20 não é dia útil, o prazo é antecipado (exemplo oficial: competência 03/2024 venceu em 19/04/2024, sexta-feira).
- **Forma de pagamento:** Pix, por meio do QR Code impresso na Guia do FGTS Digital (GFD).
- **A emissão antecipada da guia não antecipa a obrigação de pagamento:** o prazo continua sendo o do vencimento.
- **Alíquota geral:** 8% sobre a remuneração (2% para Jovem Aprendiz).
- **Multa Rescisória:** 40% na demissão sem justa causa ou 20% no acordo mútuo (art. 484-A CLT).`
  },
  {
    id: 'cct-normas',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/convenções-coletivas/cct-act-normas.md',
    title: 'Convenções Coletivas (CCT) e Acordos Coletivos (ACT)',
    summary: 'Diferenças práticas, prevalência do ACT sobre CCT (art. 620 CLT), direitos negociáveis (art. 611-A) vs indisponíveis (art. 611-B) e pisos salariais.',
    tags: ['Convenções Coletivas', 'CCT', 'ACT', 'Art. 611-A CLT', 'Piso Sindical'],
    lastUpdated: '2026-10-17',
    officialLink: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    officialLinkLabel: 'CLT - Presidência da República (Art. 611-A)',
    content: `# Convenções Coletivas (CCT) e Acordos Coletivos (ACT)

> **Legislação Base:** CLT, arts. 611 a 625 e Lei nº 13.467/2017.

---

## 1. Regra de Prevalência

- **Art. 620 da CLT:** As cláusulas pactuadas em **Acordo Coletivo de Trabalho (ACT)** sempre prevalecem sobre as estipuladas em Convenção Coletiva de Trabalho (CCT).

---

## 2. O Negociado sobre o Legislado

- **Permitido (Art. 611-A):** Pactuação de banco de horas anual, intervalo intrajornada até 30 min, teletrabalho, plano de cargos e salários.
- **Proibido (Art. 611-B - Direitos Indisponíveis):** Redução de salário mínimo, supressão de FGTS e multa de 40%, 13º salário, férias remuneradas com 1/3, normas de segurança do trabalho.`
  },
  {
    id: 'plano-de-contas',
    category: 'contabil',
    categoryLabel: 'Contábil',
    filePath: 'contabil/plano-de-contas.md',
    title: 'Plano de Contas, Escrituração e Princípios Contábeis',
    summary: 'Estrutura dos 5 grupos (Ativo, Passivo/PL, Custos, Despesas, Receitas), partidas dobradas, regime de competência e Plano Referencial SPED.',
    tags: ['Plano de Contas', 'Partidas Dobradas', 'Regime de Competência', 'NBC TG 1000', 'SPED'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www.cfc.org.br',
    officialLinkLabel: 'Conselho Federal de Contabilidade (CFC)',
    content: `# Plano de Contas e Escrituração Contábil

> **Legislação Base:** Lei nº 6.404/1976 e Normas Brasileiras de Contabilidade (NBC TG 1000 / CPC 00).

---

## 1. Estrutura dos 5 Grupos

1. **Ativo:** Bens e direitos controlados (Circulante e Não Circulante).
2. **Passivo e Patrimônio Líquido:** Obrigações com terceiros e capital próprio.
3. **Custos:** Gastos diretos na produção ou revenda (CMV, CSP).
4. **Despesas Operacionais:** Gastos administrativos, comerciais e financeiros.
5. **Receitas:** Acréscimos patrimoniais provenientes de vendas e serviços.

---

## 2. Princípio da Competência

Obrigatório pela NBC TG: receitas e despesas devem ser registradas no período em que ocorrerem seus fatos geradores, independentemente do pagamento ou recebimento financeiro.`
  },
  {
    id: 'livros-obrigacoes',
    category: 'contabil',
    categoryLabel: 'Contábil',
    filePath: 'contabil/livros-obrigacoes.md',
    title: 'Livros Contábeis Obrigatórios e Guarda de Documentos',
    summary: 'Livro Diário, Razão, Caixa, elaboração das demonstrações (BP, DRE, DMPL, DFC) e tabela de prazos prescricionais de guarda (5 a 30 anos).',
    tags: ['Livro Diário', 'Livro Razão', 'DRE', 'Balanço Patrimonial', 'Prazos Prescricionais'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www.cfc.org.br',
    officialLinkLabel: 'Conselho Federal de Contabilidade (CFC)',
    content: `# Livros Contábeis e Demonstrações Financeiras

> **Legislação Base:** Código Civil (Lei nº 10.406/2002, arts. 1.179 a 1.195) e Lei nº 6.404/1976.

---

## 1. Livros Obrigatórios

- **Livro Diário:** Registro contínuo, cronológico e obrigatório de todos os atos e fatos. Deve conter Termos de Abertura e Encerramento com assinatura do Contador (CRC ativo) e Administrador.
- **Livro Razão:** Demonstrativo sistemático do saldo individualizado de cada conta.

---

## 2. Demonstrações Obrigatórias

- Balanço Patrimonial (BP);
- Demonstração do Resultado do Exercício (DRE);
- Demonstração das Mutações do Patrimônio Líquido (DMPL);
- Notas Explicativas (NE).

---

## 3. Prazos de Guarda de Documentos

- **Documentos Fiscais e SPED:** 5 anos (Art. 173 CTN).
- **FGTS e Folha de Pagamento:** 30 anos (fatos até 2014) ou 5 anos modulados (Tema 608 STF).
- **Contratos e Ficha de Registro de Empregados:** Guarda vitalícia/indeterminada.`
  },
  {
    id: 'ecd-ecf',
    category: 'contabil',
    categoryLabel: 'Contábil',
    filePath: 'contabil/ecd-ecf.md',
    title: 'ECD e ECF: Escrituração Digital do SPED e Prazos',
    summary: 'SPED Contábil (ECD até último dia útil de maio) e SPED Fiscal (ECF até último dia útil de julho), blocos principais e malha fiscal da RFB.',
    tags: ['ECD', 'ECF', 'SPED', 'e-LALUR', 'Malha Fina RFB'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www.receita.fazenda.gov.br',
    officialLinkLabel: 'Receita Federal - SPED',
    content: `# ECD e ECF - Obrigações do SPED Contábil e Fiscal

> **Legislação Base:** Instruções Normativas RFB nº 2.003/2021 e 2.004/2021.

---

## 1. ECD (Escrituração Contábil Digital)

- **Obrigatoriedade:** Empresas no Lucro Real, e Lucro Presumido com distribuição de lucros isentos acima da presunção legal.
- **Prazo:** Último dia útil de **maio** do ano seguinte.
- **Assinatura:** Certificado digital do Contador (CRC) e do Representante Legal da empresa.

---

## 2. ECF (Escrituração Contábil Fiscal)

- **Obrigatoriedade:** Todas as pessoas jurídicas (Lucro Real, Presumido e Arbitrado). Dispensadas empresas do Simples Nacional.
- **Prazo:** Último dia útil de **julho** do ano seguinte.
- **Principais Blocos:** Bloco L (Balanço), Bloco M (e-LALUR/e-LACS Lucro Real) e Bloco P (Apuração Lucro Presumido).`
  },
  {
    id: 'aviso-legal',
    category: 'aviso-legal',
    categoryLabel: 'Aviso Legal',
    filePath: 'aviso-legal.md',
    title: 'Termo de Aviso Legal e Responsabilidade Técnica',
    summary: '⚠️ "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."',
    tags: ['Aviso Legal', 'CRC', 'CFC', 'Responsabilidade Técnica', 'Orientação'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www.cfc.org.br',
    officialLinkLabel: 'Conselho Federal de Contabilidade (CFC)',
    content: `# Termo de Aviso Legal e Responsabilidade Técnica

> **"Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."**

---

## 1. Natureza Informativa e Orientativa

O **Murade Agente IA** é uma plataforma tecnológica de inteligência artificial aplicada, desenhada para atuar como ferramenta de apoio consultivo, pesquisa legislativa, simulação prévia e organização de rotinas nas áreas Fiscal, de Departamento Pessoal Trabalhista e Contábil no território brasileiro.

Todas as respostas geradas pelo agente, relatórios, cálculos automáticos, fluxogramas e interpretações de normas têm caráter estritamente **informativo, pedagógico e orientativo**.

Nenhuma interação fornecida pelo sistema substitui, desonera ou substitui o parecer, a consultoria jurídica ou o laudo técnico individualizado emitido por um **Contador devidamente registrado no Conselho Regional de Contabilidade (CRC)**, por um **Advogado inscrito na Ordem dos Advogados do Brasil (OAB)** ou por perito legalmente qualificado.

---

## 2. Dinâmica Legislativa e Peculiaridades Locais

A legislação tributária, previdenciária e trabalhista brasileira apresenta constantes alterações por Medidas Provisórias, Leis Complementares, Convênios e Instruções Normativas.

A aplicação de qualquer interpretação legal, enquadramento fiscal, alíquota de retenção, rescisão de contrato de trabalho ou cálculo de encargo deve ser **obrigatoriamente validada e auditada pelo profissional responsável técnico** antes de qualquer transmissão oficial perante a Receita Federal, Caixa Econômica Federal (FGTS Digital), eSocial, Juntas Comerciais ou Secretarias de Fazenda Estaduais e Municipais.`
  },
  {
    id: 'fontes-oficiais',
    category: 'fontes-oficiais',
    categoryLabel: 'Fontes Oficiais',
    filePath: 'fontes-oficiais.md',
    title: 'Fontes Oficiais para Consulta e Legislação Vigente',
    summary: 'Portais oficiais homologados do Governo Federal, Receita Federal, SEFAZ Goiás, eSocial, CLT, Simples Nacional, CFC e Câmara dos Deputados.',
    tags: ['Fontes Oficiais', 'Receita Federal', 'SEFAZ GO', 'eSocial', 'CLT', 'Simples Nacional', 'CFC', 'Reforma Tributária'],
    lastUpdated: '2026-10-17',
    officialLink: 'https://www.receita.fazenda.gov.br',
    officialLinkLabel: 'Receita Federal do Brasil',
    content: `# Fontes Oficiais para Consulta e Legislação Vigente

> **Diretriz de Rigor:** Responda SOMENTE com as informações que estão nos arquivos da Base de Conhecimento. Se não encontrar a resposta nos arquivos, consulte os portais e links oficiais abaixo.

---

## 📌 Links Oficiais para Consulta e Conferência

- **Receita Federal:** https://www.receita.fazenda.gov.br
- **SEFAZ Goiás — Consulta NFe:** http://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal
- **eSocial:** https://www.esocial.gov.br
- **CLT — Consolidação das Leis do Trabalho:** http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm
- **Simples Nacional — Portal:** https://www8.receita.fazenda.gov.br/SimplesNacional
- **CFC — Conselho Federal de Contabilidade:** https://www.cfc.org.br
- **Reforma Tributária — Portal da Câmara:** https://www.camara.leg.br/reformatributaria

---

## 📌 Regras de Salvaguarda e Citação

1. **Fonte obrigatória:** Toda resposta deve citar expressamente a fonte correspondente: \`📌 Fonte: [nome do arquivo]\`.
2. **Link oficial de apoio:** Se houver link oficial correspondente na base, acrescente: \`🔗 Confira também: [link oficial]\`.
3. **Aviso Legal:**
   ⚠️ *"Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."*`
  },
  {
    id: 'clt-legislacao-integral',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/clt-legislacao-integral.md',
    title: 'CLT e Legislação Trabalhista Integral (Planalto - Decreto-Lei nº 5.452/1943)',
    summary: 'Compilação completa da CLT atualizada (Lei 13.467/17): rescisões e prazos (Art. 477), jornada e banco de horas (Arts. 58-75), férias (Arts. 129-153), equiparação (Art. 461), FGTS (Lei 8.036/90) e Aviso Prévio (Lei 12.506/11).',
    tags: ['CLT Integral', 'Planalto', 'Decreto-Lei 5.452/43', 'Reforma Trabalhista', 'Prazos Rescisórios', 'Aviso Prévio', 'Jornada'],
    lastUpdated: '2026-10-19',
    officialLink: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    officialLinkLabel: 'CLT - Presidência da República / Planalto',
    content: `# Legislação Trabalhista Integral — CLT e Leis Conexas do Planalto

> **Fonte Oficial Governamental:** Presidência da República / Casa Civil — Subchefia de Assuntos Jurídicos.
> **Texto Legal:** Decreto-Lei nº 5.452/1943 compilado com as Leis nº 13.467/2017 (Reforma Trabalhista), nº 12.506/2011 (Aviso Prévio), nº 8.036/1990 (FGTS) e nº 4.090/1962 (13º Salário).
> **Link Oficial:** http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm

---

## 1. Rescisão Contratual e Prazos Obrigatórios (Art. 477 da CLT)
- **Prazo Unificado de Quitação (§ 6º):** A entrega ao empregado dos documentos comprobatórios da extinção contratual e o pagamento das verbas rescisórias devem ser efetuados em até **10 (dez) dias corridos** contados a partir do término do contrato, independentemente do tipo de aviso prévio (trabalhado ou indenizado).
- **Multa por Atraso (§ 8º):** A inobservância do prazo sujeita o empregador à autuação administrativa e ao pagamento de multa equivalente a **1 (um) salário mensal integral** em favor do empregado, salvo comprovação de que o trabalhador deu causa à mora.
- **Homologação:** Desnecessária perante sindicato ou Ministério do Trabalho. A quitação efetuada perante o empregador é plenamente válida para os valores discriminados no Termo de Rescisão (TRCT).

---

## 2. Aviso Prévio Proporcional (Lei nº 12.506/2011)
- **Regra Geral:** Mínimo de 30 (trinta) dias para empregados com até 1 (um) ano de serviço na mesma empresa.
- **Acréscimo por Antiguidade:** São acrescidos **3 (três) dias por ano completo** de serviço prestado, até o limite máximo de **60 dias adicionais**, perfazendo um teto de até **90 (noventa) dias** de aviso prévio.
- **Redução de Jornada (Art. 488 CLT):** Durante o aviso prévio trabalhado, o trabalhador pode optar pela redução de **2 horas diárias** ou dispensa do trabalho por **7 dias corridos** consecutivos.

---

## 3. Jornada de Trabalho, Banco de Horas e Descansos (Arts. 58 a 75 da CLT)
- **Limite Constitucional:** 8 (oito) horas diárias e 44 (quarenta e quatro) horas semanais.
- **Horas Extras:** Remuneradas com acréscimo de no mínimo **50%** em dias normais e **100%** em domingos e feriados civis e religiosos.
- **Banco de Horas Individual:** Válido por acordo individual escrito, desde que a compensação ocorra no período máximo de **6 (seis) meses**.
- **Banco de Horas Coletivo:** Mediante acordo ou convenção coletiva, com prazo de compensação de até **1 (um) ano**.
- **Intervalo Intrajornada (Art. 71 CLT):** Obrigatório no mínimo 1 hora para jornada superior a 6 horas (reduzível para até 30 minutos por Acordo Coletivo conforme Art. 611-A da CLT). Intervalo entre jornadas de no mínimo **11 horas consecutivas** (Art. 66).
- **Teletrabalho (Arts. 75-A a 75-F):** Prestação de serviços fora das dependências do empregador preponderantemente ou híbrida, formalizada por aditivo contratual escrito com regras expressas sobre fornecimento de equipamentos e infraestrutura.

---

## 4. Férias Anuais Remuneradas (Arts. 129 a 153 da CLT)
- **Período Aquisitivo e Concessivo:** A cada 12 meses de vigência contratual (aquisitivo), o trabalhador adquire direito a 30 dias de férias, devendo ser concedidas nos 12 meses subsequentes (concessivo).
- **Pagamento em Dobro (Art. 137 CLT):** Férias concedidas após o período concessivo devem ser pagas em dobro.
- **Fracionamento (Art. 134, § 1º CLT):** Permitido em até **3 (três) períodos**, sendo que um deles não pode ser inferior a **14 dias corridos** e os demais não inferiores a **5 dias corridos** cada.
- **Abono Pecuniário (Art. 143 CLT):** Faculdade do empregado converter 1/3 do período de férias em abono em dinheiro, requerido até 15 dias antes do término do período aquisitivo.
- **Prazo de Pagamento (Art. 145 CLT):** A remuneração das férias e o terço constitucional (1/3) devem ser quitados até **2 dias antes** do início do gozo.`
  },
  {
    id: 'simples-nacional-completo',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/simples-nacional-completo.md',
    title: 'Simples Nacional: Lei Complementar nº 123/2006 e Resolução CGSN nº 140/2018',
    summary: 'Manual integral do regime unificado do Simples Nacional: Anexos I a V com tabelas de alíquotas e parcelas a deduzir, apuração do Fator R (28%), sublimite estadual de ICMS/ISS (R$ 3,6M), MEI e PGDAS-D.',
    tags: ['Simples Nacional', 'LC 123/2006', 'CGSN 140/2018', 'Anexos I a V', 'Fator R', 'PGDAS-D', 'MEI', 'Sublimite'],
    lastUpdated: '2026-10-19',
    officialLink: 'https://www8.receita.fazenda.gov.br/SimplesNacional',
    officialLinkLabel: 'Portal do Simples Nacional (Receita Federal)',
    content: `# Simples Nacional — Lei Complementar nº 123/2006 Consolidada

> **Fonte Oficial Governamental:** Comitê Gestor do Simples Nacional (CGSN) / Receita Federal do Brasil.
> **Legislação Base:** Lei Complementar nº 123/2006, Resolução CGSN nº 140/2018 e alterações posteriores.
> **Link Oficial:** https://www8.receita.fazenda.gov.br/SimplesNacional

---

## 1. Enquadramento, Limites e Sublimites de Faturamento
- **Microempresa (ME):** Receita bruta anual de até **R$ 360.000,00**.
- **Empresa de Pequeno Porte (EPP):** Receita bruta anual de **R$ 360.000,01 até R$ 4.800.000,00**.
- **Sublimite Estadual/Distrital para ICMS e ISS:** **R$ 3.600.000,00** de receita bruta acumulada nos 12 meses anteriores (RBT12).
  - *Efeito Prático:* Ao ultrapassar R$ 3,6M, a empresa continua recolhendo os tributos federais (IRPJ, CSLL, PIS, COFINS, CPP) dentro do DAS, porém o ICMS estadual e o ISS municipal passam a ser recolhidos em guias próprias fora do Simples pelas regras gerais de débito e crédito (SPED Fiscal e NFSe).

---

## 2. A Fórmula Oficial da Alíquota Efetiva do PGDAS-D
A alíquota recolhida mensalmente no DAS é calculada progressivamente a cada competência pela fórmula:

$$\\text{Alíquota Efetiva} = \\frac{(\\text{RBT12} \\times \\text{Alíquota Nominal da Faixa}) - \\text{Parcela a Deduzir}}{\\text{RBT12}}$$

*Onde RBT12 é a Receita Bruta Total acumulada nos 12 meses anteriores ao período de apuração.*

---

## 3. Estrutura Completa dos 5 Anexos do Simples Nacional
1. **Anexo I — Comércio:**
   - 1ª Faixa (até R$ 180k): 4,00% (dedução R$ 0,00).
   - 2ª Faixa (R$ 180k a R$ 360k): 7,30% (dedução R$ 5.940,00).
   - 3ª Faixa (R$ 360k a R$ 720k): 9,50% (dedução R$ 13.860,00).
   - 4ª Faixa (R$ 720k a R$ 1,8M): 10,70% (dedução R$ 22.500,00).
   - 5ª Faixa (R$ 1,8M a R$ 3,6M): 14,30% (dedução R$ 87.300,00).
   - 6ª Faixa (R$ 3,6M a R$ 4,8M): 19,00% (dedução R$ 378.000,00).
   - *Inclui CPP patronal dentro da guia DAS.*

2. **Anexo II — Indústria:**
   - Alíquotas nominais de 4,50% a 30,00%. Inclui IPI e CPP dentro do DAS.

3. **Anexo III — Serviços em Geral (Manutenção, Locação, Saúde básica e Fator R >= 28%):**
   - 1ª Faixa: 6,00% (dedução R$ 0,00).
   - 2ª Faixa: 11,20% (dedução R$ 9.360,00).
   - 3ª Faixa: 13,50% (dedução R$ 17.640,00).
   - 4ª Faixa: 16,00% (dedução R$ 35.640,00).
   - 5ª Faixa: 21,00% (dedução R$ 125.640,00).
   - 6ª Faixa: 33,00% (dedução R$ 648.000,00).

4. **Anexo IV — Serviços Advocatícios, Construção Civil, Vigilância e Limpeza:**
   - Alíquotas nominais de 4,50% a 33,00%.
   - **Atenção:** NÃO inclui CPP no DAS. A empresa deve recolher a Contribuição Previdenciária Patronal (20% + RAT + Terceiros) à parte na DCTFWeb.

5. **Anexo V — Serviços Intelectuais e de Tecnologia (Sujeitos ao Fator R):**
   - 1ª Faixa: 15,50% (dedução R$ 0,00).
   - Alíquota máxima: 30,50%.

---

## 4. A Regra Prática e Matemática do Fator R (Art. 18, § 5º-J da LC 123/2006)
- Se $\\frac{\\text{Folha de Salários + Pró-Labore + FGTS dos últimos 12 meses}}{\\text{Receita Bruta Total dos últimos 12 meses (RBT12)}} \\ge 0,28$ (28%):
  A empresa tributa pelo **Anexo III** (início em 6,0%), gerando imensa economia tributária frente ao Anexo V (15,5%).
- Se for inferior a 28%, tributa no **Anexo V**.`
  },
  {
    id: 'esocial-fgts-digital',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/esocial-fgts-digital.md',
    title: 'eSocial & FGTS Digital: Manual MOS S-1.3, Prazos de Eventos e DCTFWeb',
    summary: 'Manual oficial do eSocial (Decreto nº 8.373/2014) e do FGTS Digital (Lei nº 14.438/2022): admissão S-2200, demissão S-2299, fechamento S-1299, DARF Previdenciário DCTFWeb e recolhimento via Pix no dia 20.',
    tags: ['eSocial', 'FGTS Digital', 'Pix', 'DCTFWeb', 'S-2200', 'S-2299', 'S-1200', 'MOS S-1.3'],
    lastUpdated: '2026-10-19',
    officialLink: 'https://www.esocial.gov.br',
    officialLinkLabel: 'Portal Oficial do eSocial (Governo Federal)',
    content: `# eSocial e FGTS Digital — Manual de Operação e Prazos Oficiais

> **Fonte Oficial Governamental:** Ministério do Trabalho e Emprego (MTE) e Receita Federal do Brasil (RFB).
> **Legislação Base:** Decreto nº 8.373/2014, Portaria Conjunta MTE/RFB nº 33/2023, Lei nº 14.438/2022 (FGTS Digital).
> **Link Oficial:** https://www.esocial.gov.br

---

## 1. Prazos Oficiais de Envio dos Eventos Trabalhistas
1. **Admissão de Empregado (Eventos S-2190 e S-2200):**
   - Transmissão obrigatória até o final do dia imediatamente anterior ao início efetivo da prestação de serviços.
2. **Desligamento e Rescisão (Evento S-2299):**
   - Até **10 (dez) dias corridos** a contar do término do vínculo empregatício.
3. **Afastamento Temporário (Evento S-2230):**
   - Até o dia 15 do mês seguinte ao do afastamento por motivo de doença superior a 3 dias ou licença maternidade.
4. **Acidente de Trabalho (Evento S-2210 - CAT):**
   - Até o primeiro dia útil seguinte ao do acidente ou de imediato em caso de morte.
5. **Eventos de Folha e Remuneração (S-1200, S-1210 e S-1299):**
   - Transmissão e fechamento mensal até o **dia 15 do mês subsequente** ao de competência.

---

## 2. DCTFWeb e Unificação dos Encargos Previdenciários
- Após o fechamento do evento S-1299 no eSocial e da EFD-Reinf, os débitos previdenciários e de terceiros são consolidados na DCTFWeb.
- **DARF Previdenciário Numerado:** Vencimento no **dia 20 do mês subsequente** ao da competência (antecipando-se para o dia útil anterior se cair em fim de semana ou feriado).

---

## 3. FGTS Digital — Plataforma Oficial e Recolhimento via Pix
- **Data de Vencimento Mensal:** Dia **20 do mês subsequente** (substituindo o antigo dia 7 da GFIP/SEFIP).
- **Meio de Pagamento Exclusivo:** **Pix**, por meio de QR Code ou chave Pix gerada na guia oficial. Não há código de barras tradicional.
- **Alíquotas do FGTS:**
  - 8% para trabalhadores em geral (CLT).
  - 2% para contrato de Jovem Aprendiz (Lei 10.097/2000).
- **FGTS Rescisório:** Multa de 40% na dispensa sem justa causa (ou 20% por culpa recíproca/acordo mútuo do art. 484-A CLT), gerada e quitada dentro da plataforma do FGTS Digital em até 10 dias da rescisão.`
  },
  {
    id: 'normas-contabeis-cfc',
    category: 'contabil',
    categoryLabel: 'Contábil',
    filePath: 'contabil/normas-contabeis-cfc.md',
    title: 'Normas Contábeis (CFC), NBCs, Lei das S.A. 6.404/76 e Livros Obrigatórios',
    summary: 'Conselho Federal de Contabilidade (Decreto-Lei nº 9.295/1946): Normas Brasileiras de Contabilidade (NBC TG 1000 PME e CPC 00 R2), escrituração no Livro Diário e Razão (Código Civil arts. 1.179 a 1.195), DRE, Balanço e SPED ECD/ECF.',
    tags: ['CFC', 'Normas Contábeis', 'NBC TG', 'Lei 6.404/76', 'Livro Diário', 'SPED ECD', 'DRE', 'Balanço Patrimonial'],
    lastUpdated: '2026-10-19',
    officialLink: 'https://www.cfc.org.br',
    officialLinkLabel: 'Conselho Federal de Contabilidade (CFC)',
    content: `# Normas Brasileiras de Contabilidade (CFC) e Legislação Societária

> **Fonte Oficial:** Conselho Federal de Contabilidade (CFC) e Comitê de Pronunciamentos Contábeis (CPC).
> **Legislação Base:** Decreto-Lei nº 9.295/1946, Lei nº 6.404/1976 (Lei das S.A.), Código Civil (Lei nº 10.406/2002, arts. 1.179 a 1.195) e NBC TG 1000 (R1).
> **Link Oficial:** https://www.cfc.org.br

---

## 1. Princípios Fundamentais e Estrutura Conceitual (CPC 00 / NBC TG)
- **Regime de Competência:** Os efeitos das transações e outros eventos são reconhecidos nos períodos a que se referem, independentemente do recebimento ou pagamento em dinheiro.
- **Entidade:** O patrimônio da pessoa jurídica não se confunde com o patrimônio particular dos sócios ou administradores.
- **Continuidade:** Pressupõe que a entidade continuará em operação no futuro previsível.

---

## 2. Livros Contábeis Obrigatórios (Código Civil arts. 1.179 a 1.195)
- **Livro Diário:** Obrigatório para toda sociedade empresária. Deve conter o registro metódico e uniforme de todos os atos e operações da empresa, com Termos de Abertura e Encerramento autenticados na Junta Comercial e assinatura digital do Contador legalmente habilitado (com CRC ativo).
- **Livro Razão:** Obrigatório para detalhar o saldo e a movimentação analítica de todas as contas do Plano de Contas.
- **Livro Caixa:** Facultativo e simplificado para optantes pelo Simples Nacional que não distribuam lucros acima do limite de presunção legal.

---

## 3. Demonstrações Contábeis de Elaboração Mandatória
1. **Balanço Patrimonial (BP):** Evidencia a posição patrimonial e financeira dividida entre Ativo Circulante, Ativo Não Circulante, Passivo Circulante, Passivo Não Circulante e Patrimônio Líquido.
2. **Demonstração do Resultado do Exercício (DRE):** Apuração do Lucro ou Prejuízo Líquido deduzindo da Receita Bruta: devoluções, abatimentos, impostos sobre vendas, custos (CMV/CSP), despesas operacionais e financeiras, e IRPJ/CSLL.
3. **DMPL (Mutações do Patrimônio Líquido):** Demonstra todas as movimentações nas contas de capital, reservas e lucros acumulados.
4. **DFC (Fluxo de Caixa):** Obrigatória para companhias abertas e empresas de grande porte (método direto ou indireto).
5. **Notas Explicativas (NE):** Esclarecimentos sobre critérios contábeis adotados, contingências e partes relacionadas.

---

## 4. SPED Contábil — ECD e ECF (Instruções Normativas RFB nº 2.003 e 2.004)
- **ECD (Escrituração Contábil Digital):** Transmissão anual até o **último dia útil de maio** do ano subsequente. Obrigatória para empresas do Lucro Real e empresas do Lucro Presumido que distribuam lucros superiores à presunção do IRPJ.
- **ECF (Escrituração Contábil Fiscal):** Transmissão anual até o **último dia útil de julho** do ano seguinte. Vincula o resultado contábil da ECD com a apuração fiscal do IRPJ (e-LALUR) e da CSLL (e-LACS).`
  },
  {
    id: 'reforma-tributaria-ec132',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/reforma-tributaria-ec132.md',
    title: 'Reforma Tributária: Emenda Constitucional nº 132/2023 e PLP 68/2024',
    summary: 'Novo sistema tributário brasileiro sobre o consumo: IVA Dual com CBS (Federal) e IBS (Estados e Municípios), Imposto Seletivo, Split Payment, extinção de PIS, COFINS, IPI, ICMS e ISS e cronograma 2026-2033.',
    tags: ['Reforma Tributária', 'EC 132/2023', 'PLP 68/2024', 'IBS', 'CBS', 'Split Payment', 'IVA Dual', 'Congresso Nacional'],
    lastUpdated: '2026-10-19',
    officialLink: 'https://www.camara.leg.br/reformatributaria',
    officialLinkLabel: 'Portal da Reforma Tributária (Câmara e Senado)',
    content: `# Reforma Tributária do Consumo — EC nº 132/2023 e Leis Complementares

> **Fonte Oficial Governamental:** Congresso Nacional (Câmara dos Deputados e Senado Federal).
> **Legislação Base:** Emenda Constitucional nº 132/2023, Projeto de Lei Complementar PLP nº 68/2024 e PLP nº 108/2024.
> **Links Oficiais:** https://www.camara.leg.br/reformatributaria e https://www.senado.leg.br

---

## 1. O Novo Modelo Tributário Nacional: IVA Dual
A Reforma unifica 5 tributos vigentes em um modelo moderno de Imposto sobre Valor Agregado (IVA) com base ampla e não cumulatividade plena:
1. **CBS (Contribuição sobre Bens e Serviços):** De competência Federal, administrada pela Receita Federal, substituindo PIS e COFINS e absorvendo a maior parte do IPI.
2. **IBS (Imposto sobre Bens e Serviços):** De competência Compartilhada entre Estados, Distrito Federal e Municípios, administrado pelo Comitê Gestor do IBS, substituindo ICMS e ISS.
3. **IS (Imposto Seletivo):** Tributo regulatório de competência federal incidente sobre produção ou comercialização de bens e serviços prejudiciais à saúde ou ao meio ambiente.

---

## 2. Princípios Estruturantes da Reforma
- **Tributação no Destino:** A arrecadação do IBS pertence integralmente ao local de consumo final do bem ou serviço, acabando definitivamente com a Guerra Fiscal entre Estados.
- **Crédito Financeiro Integral:** Toda aquisição de bem material, imaterial ou serviço utilizado na atividade econômica gera crédito fiscal imediato (exceto consumo pessoal).
- **Split Payment Inteligente:** Retenção e recolhimento instantâneo do imposto no momento exato da liquidação financeira da transação comercial (via Pix, cartão ou arranjo bancário), evitando inadimplência e sonegação.

---

## 3. Cronograma Oficial de Transição (2026 a 2033)
- **2026 — Período de Teste e Calibração:**
  - Alíquota teste de **0,9% para a CBS** e **0,1% para o IBS** (compensáveis com o PIS/COFINS devido).
- **2027 — Entrada em Vigor Plena da CBS:**
  - Extinção definitiva do PIS e da COFINS;
  - Redução a zero das alíquotas do IPI (exceto produtos com similar fabricado na Zona Franca de Manaus);
  - Início da cobrança do Imposto Seletivo (IS).
- **2029 a 2032 — Transição Gradual do ICMS e ISS para o IBS:**
  - Redução das alíquotas de ICMS e ISS à razão de 1/10 (10%) a cada ano;
  - Aumento proporcional e simultâneo das alíquotas do IBS.
- **2033 — Vigência Plena do Novo Sistema:**
  - Extinção definitiva do ICMS e do ISS. Modelo consolidado exclusivamente com IBS, CBS e Imposto Seletivo.`
  },
  {
    id: 'tributos-icms-ipi-iss',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/tributos-icms-ipi-iss.md',
    title: 'ICMS, IPI, ISS, PIS/COFINS e Tributos Federais (Receita Federal & SEFAZ GO)',
    summary: 'Regulamento do ICMS (LC 87/96 Lei Kandir, LC 190/22 DIFAL e SEFAZ GO RCTE Lei 11.651/91), IPI (Decreto 7.212/10), ISS municipal (LC 116/03), PIS/COFINS cumulativo/não-cumulativo e IRPJ/CSLL no Lucro Presumido e Real.',
    tags: ['ICMS', 'IPI', 'ISS', 'SEFAZ GO', 'Receita Federal', 'DIFAL', 'Lucro Presumido', 'PIS/COFINS'],
    lastUpdated: '2026-10-19',
    officialLink: 'https://www.receita.fazenda.gov.br',
    officialLinkLabel: 'Receita Federal & SEFAZ Goiás',
    content: `# Tributos Indiretos e Federais — ICMS, IPI, ISS e Lucro Presumido

> **Fontes Oficiais:** Receita Federal do Brasil (RFB) e Secretaria de Estado da Economia de Goiás (SEFAZ-GO).
> **Legislação Base:** Lei Complementar nº 87/1996 (Kandir), LC nº 190/2022 (DIFAL), Lei nº 11.651/1991 (CTE-GO), Decreto nº 7.212/2010 (RIPI), LC nº 116/2003 (ISS) e Decreto nº 9.580/2018 (RIR/2018).
> **Links Oficiais:** https://www.receita.fazenda.gov.br e http://nfe.sefaz.go.gov.br

---

## 1. ICMS e Diferencial de Alíquotas (DIFAL - LC 190/2022)
- **Fato Gerador:** Circulação de mercadorias e prestação de serviços de transporte interestadual e de comunicação.
- **Operação Interestadual com Consumidor Final Não Contribuinte (E-commerce):**
  - O remetente recolhe o DIFAL para o Estado de destino:
  $$\\text{DIFAL} = \\text{Alíquota Interna do Destino} - \\text{Alíquota Interestadual (7% ou 12% ou 4% importados)}$$
- **SEFAZ Goiás (RCTE):** Alíquota modal interna padrão de 19% em Goiás (Lei Estadual 11.651/1991). Exigência de recolhimento prévio via DARE ou GNRE nas operações sujeitas à Substituição Tributária (ICMS-ST).

---

## 2. IPI — Imposto sobre Produtos Industrializados (Decreto nº 7.212/2010)
- **Fato Gerador:** Desembaraço aduaneiro de produtos de procedência estrangeira ou a saída de produto do estabelecimento industrial (ou equiparado a industrial).
- **Tabela TIPI:** Alíquotas específicas e *ad valorem* vinculadas à classificação fiscal NCM (Nomenclatura Comum do Mercosul).

---

## 3. ISS — Imposto Sobre Serviços de Qualquer Natureza (LC nº 116/2003)
- **Competência:** Municipal e Distrital.
- **Alíquotas Constitucionais:** Mínima de **2,0%** (vedada renúncia fiscal art. 8º-A da LC 116) e máxima de **5,0%**.
- **Local de Incidência (Art. 3º):** Como regra geral, no estabelecimento prestador, ressalvadas exceções legais taxativas como construção civil, vigilância e eventos (onde incide no local da execução do serviço).

---

## 4. PIS, COFINS, IRPJ e CSLL no Lucro Presumido
- **PIS e COFINS Cumulativos (Lei nº 9.718/1998):**
  - PIS: 0,65% sobre receita bruta.
  - COFINS: 3,00% sobre receita bruta.
  - Carga conjunta: **3,65%** sem aproveitamento de créditos.
- **IRPJ e CSLL Trimestrais:**
  - Base de presunção IRPJ: 8% (comércio e indústria) ou 32% (serviços em geral).
  - Alíquota IRPJ: 15% básica + adicional de 10% sobre o excedente a R$ 60.000,00 no trimestre.
  - Base de presunção CSLL: 12% (comércio) ou 32% (serviços). Alíquota CSLL: 9%.`
  },
  {
    id: 'direito-societario-juridico',
    category: 'contabil',
    categoryLabel: 'Contábil / Jurídico',
    filePath: 'contabil/direito-societario-juridico.md',
    title: 'Legislação Jurídica Empresarial, Societária e Tributária (Código Civil & DREI)',
    summary: 'Direito Societário para contabilidade: Sociedades Limitadas (arts. 1.052 a 1.087 CC), Sociedade Limitada Unipessoal (SLU), Instruções DREI, responsabilidade tributária dos sócios (Art. 135 CTN) e crimes tributários (Lei 8.137/90).',
    tags: ['Direito Societário', 'Código Civil', 'SLU', 'DREI', 'Responsabilidade Tributária', 'Art 135 CTN', 'Crimes Fiscais'],
    lastUpdated: '2026-10-19',
    officialLink: 'https://www.planalto.gov.br/legislacao',
    officialLinkLabel: 'Presidência da República / DREI',
    content: `# Legislação Societária, Empresarial e Jurídica na Contabilidade

> **Fontes Oficiais:** Presidência da República / Departamento Nacional de Registro Empresarial e Integração (DREI).
> **Legislação Base:** Código Civil (Lei nº 10.406/2002, arts. 966 a 1.141), Lei nº 13.874/2019 (Liberdade Econômica - SLU), Código Tributário Nacional (Lei nº 5.172/1966) e Lei nº 8.137/1990.
> **Link Oficial:** https://www.planalto.gov.br/legislacao

---

## 1. Tipos Societários e Registro Mercantil
- **Sociedade Limitada (Ltda - Arts. 1.052 a 1.087 CC):** A responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social.
- **Sociedade Limitada Unipessoal (SLU - Art. 1.052, § 1º CC):** Permite a constituição de sociedade limitada por apenas 1 (uma) pessoa física ou jurídica, sem exigência de capital social mínimo, extinguindo a antiga EIRELI.
- **Instrução Normativa DREI nº 81/2020:** Padroniza as regras de abertura, alteração, transformação, fusão e dissolução empresarial perante as Juntas Comerciais do Brasil.

---

## 2. Responsabilidade Tributária dos Administradores (Art. 135 do CTN)
- Os sócios-gerentes, diretores e administradores respondem pessoalmente pelos créditos correspondentes a obrigações tributárias resultantes de atos praticados com **excesso de poderes ou infração de lei, contrato social ou estatutos**.
- **Súmula 430 do STJ:** O simples inadimplemento da obrigação tributária não gera, por si só, a responsabilidade solidária do sócio-gerente. Contudo, a dissolução irregular da sociedade (Súmula 435 STJ) presume infração à lei e autoriza o redirecionamento da execução fiscal.

---

## 3. Crimes Contra a Ordem Tributária (Lei nº 8.137/1990)
- Constitui crime contra a ordem tributária suprimir ou reduzir tributo mediante omissão de informação, declaração falsa às autoridades fazendárias, falsificação de notas fiscais ou emissão de documento fiscal inexato.
- **Súmula Vinculante 24 do STF:** O processo penal por crime material contra a ordem tributária somente pode ser instaurado após o lançamento definitivo do tributo na esfera administrativa fiscal.`
  }
];
