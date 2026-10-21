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
> **Fonte oficial:** [Perguntas e Respostas do Simples Nacional (Receita Federal)](https://www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/perguntaosn.pdf). **Conferidos em 20/10/2026:** limites de ME/EPP e regra dos 20% de excesso do sublimite; prazo da DEFIS (31 de março, [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/marco/prazo-para-transmissao-da-defis-termina-em-31-de-marco)). **Não reconferidos nesta revisão:** alíquotas dos anexos, Fator R e dia de vencimento do DAS — confirme no Portal do Simples Nacional antes de aplicar. A Receita divulgou novas regras de multa por atraso do PGDAS-D/DEFIS (dez/2025); verifique no portal.

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
  - *Regra de excesso (Receita Federal — Perguntas e Respostas do Simples Nacional):* se o excesso sobre o sublimite for de **até 20%** (até R$ 4.320.000,00), a empresa fica impedida de recolher ICMS/ISS pelo Simples **a partir do ano seguinte**; se passar de 20% (R$ 4.320.000,01 a R$ 4.800.000,00), deve comunicar a exclusão, com efeitos a partir do mês seguinte ao excesso. Consulte o Portal do Simples Nacional para a regra vigente e o sublimite adotado por cada estado.

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
    id: 'mei-opcao-exclusao',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/mei-opcao-exclusao.md',
    title: 'MEI e Simples Nacional: Opção, Desenquadramento e Exclusão',
    summary: 'Limite do MEI (R$ 81.000), DAS-MEI 2026, excesso de receita (20%), opção em janeiro, tipos de exclusão do Simples, prazos e multa de R$ 200 (fontes Receita Federal).',
    tags: ['MEI', 'DAS-MEI', 'DASN-SIMEI', 'Opção pelo Simples', 'Exclusão do Simples', 'Desenquadramento', 'LC 123/2006'],
    lastUpdated: '2026-10-20',
    officialLink: 'https://www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/perguntaomei.pdf',
    officialLinkLabel: 'Perguntas e Respostas MEI (Receita Federal)',
    content: `# MEI e Simples Nacional: Opção, Desenquadramento e Exclusão

> **Fontes oficiais (conferidas em 20/10/2026):**
> - [Perguntas e Respostas MEI e Simei (Receita Federal)](https://www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/perguntaomei.pdf)
> - [Manual da Exclusão do Simples Nacional (Receita Federal)](https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/MANUAL_EXCLUSAO.pdf)
> - [Valores do DAS-MEI 2026 (Receita Federal, 02/01/2026)](https://www8.receita.fazenda.gov.br/simplesnacional/noticias/NoticiaCompleta.aspx?id=c3b2044c-ff97-432a-b33c-ecf2a3df6dc3)
> - [LC 123/2006, arts. 16 e 17 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm)
> **Não conferido nesta revisão:** texto integral dos arts. 18-A, 29 e 30 da LC 123 (o Planalto trunca a página); os itens abaixo vêm dos manuais da Receita. Confirme no Portal do Simples Nacional antes de aplicar.

## 1. MEI: limite e requisitos
- Limite de receita bruta: **R$ 81.000,00 por ano-calendário** (Perguntas e Respostas MEI, item 1.2). No ano de início de atividade é proporcional: **R$ 6.750,00 por mês**, contando fração de mês como mês inteiro. Não existe limite maior para exportação.
- Requisitos: ser empresário individual (sociedade não pode ser MEI); um único estabelecimento; não ser titular, sócio ou administrador de outra empresa; não ser startup; no máximo **um empregado**, que receba até um salário mínimo ou o piso da categoria; não prestar serviço por cessão ou locação de mão de obra; exercer só ocupações do Anexo XI da Resolução CGSN nº 140/2018.

## 2. DAS-MEI em 2026 (salário mínimo R$ 1.621,00, Decreto nº 12.797/2025)
- INSS: **R$ 81,05** (5% do salário mínimo). Transportador autônomo de cargas: **R$ 194,52** (12%).
- ICMS: **R$ 1,00** (só quem é contribuinte). ISS: **R$ 5,00** (só quem é contribuinte).
- A Receita não publica o total por atividade nessa notícia; a soma (R$ 82,05, R$ 86,05 ou R$ 87,05) é cálculo, não valor publicado.
- DASN-SIMEI: até o **último dia de maio**, sobre a receita do ano anterior; o prazo não é adiado por fim de semana ou feriado.

## 3. MEI: excesso de receita
- **Até 20% acima do limite:** o MEI deve comunicar o desenquadramento; o excesso é pago em DAS no vencimento de **janeiro do ano seguinte**, com as alíquotas do Simples Nacional.
- **Mais de 20% acima:** o desenquadramento **retroage a 1º de janeiro** do ano do excesso (ou ao início da atividade).
- Comunicação obrigatória: até o **último dia útil do mês seguinte** ao fato (excesso, perda de condição). Sem comunicar, há desenquadramento de ofício e multa.

## 4. Simples Nacional: opção
- Art. 16 da LC 123: a opção é **irretratável para todo o ano-calendário**; feita em **janeiro, até o último dia útil**, vale desde 1º de janeiro (§ 2º). Para empresa em início de atividade o prazo é contado a partir da inscrição (§ 3º): **prazo em dias não reconferido; consulte o Portal do Simples Nacional**.
- Art. 17: lista de vedações (por exemplo sócio domiciliado no exterior, capital com participação de ente público, débito com INSS ou Fazenda sem exigibilidade suspensa, geração/distribuição de energia elétrica, entre outras).

## 5. Simples Nacional: exclusão (Manual da Exclusão)
- **Opcional:** comunicada em janeiro, vale desde 1º de janeiro do ano; em outro mês, vale a partir de 1º de janeiro do ano seguinte.
- **Obrigatória, por débitos:** comunicar até o último dia útil do mês seguinte; efeito em 1º de janeiro do ano seguinte.
- **Obrigatória, excesso de receita até 20%:** comunicar até o último dia útil de janeiro do ano seguinte; efeito em 1º de janeiro do ano seguinte.
- **Obrigatória, excesso acima de 20%:** comunicar até o último dia útil do mês seguinte ao excesso; efeito no mês seguinte ao excesso.
- **Multa por comunicação em atraso:** **10% dos tributos do Simples devidos no mês anterior ao efeito da exclusão, mínimo de R$ 200,00** (LC 123, art. 36, conforme o manual).
- **De ofício:** feita pela Receita, Estado/DF ou Município. Gera termo de exclusão, que pode ser impugnado no prazo da lei do ente. Em caso de **débitos ou irregularidade cadastral**, regularizar em **30 dias da ciência** mantém a empresa no regime. Infrações graves (por exemplo embaraço à fiscalização) têm efeito retroativo e impedimento de **3 anos** para voltar (10 anos em certos casos de fraude).
- Quem é excluído do Simples é automaticamente excluído do SIMEI.

> Itens que o manual deixa sem descrição (4.5.4, 4.5.11 e 4.5.12) não estão cobertos aqui. Diante de dúvida, o agente deve dizer **"preciso confirmar"** e indicar o Portal do Simples Nacional.
`
  },
  {
    id: 'lucro-real-pis-cofins',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/lucro-real-pis-cofins-irpj-csll.md',
    title: 'Lucro Real, IRPJ, CSLL e PIS/Cofins não cumulativo',
    summary: 'Obrigatoriedade do Lucro Real (R$ 78 milhões), IRPJ 15% + adicional 10%, apuração e prazos, CSLL 9%/15%, PIS 1,65% e Cofins 7,6% com créditos e exclusões (fontes Planalto e Receita Federal).',
    tags: ['Lucro Real', 'IRPJ', 'CSLL', 'PIS', 'Cofins', 'não cumulativo', 'Lei 9.430/1996', 'Lei 9.249/1995', 'JCP'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/IRPJ',
    officialLinkLabel: 'IRPJ (Receita Federal)',
    content: `# Lucro Real, IRPJ, CSLL e PIS/Cofins não cumulativo

> **Fontes oficiais (conferidas em 20/10/2026):**
> - [Lei 9.249/1995 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/l9249.htm)
> - [Lei 9.430/1996 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/l9430.htm)
> - [Lei 9.718/1998, texto compilado (Planalto)](https://planalto.gov.br/ccivil_03/leis/L9718compilada.htm)
> - [Lei 10.637/2002, compilada (PIS)](https://www.planalto.gov.br/ccivil_03/leis/2002/l10637compilado.htm) e [Lei 10.833/2003 (Cofins)](https://planalto.gov.br/ccivil_03/leis/2003/l10.833.htm)
> - [IRPJ (Receita Federal)](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/IRPJ) e [CSLL (Receita Federal)](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/CSLL)
> **Multas e juros:** ver o documento "Multas e juros sobre tributos federais" (conferido em 21/10/2026; a multa qualificada passou a 100% pela Lei 14.689/2023, com 150% só na reincidência).
> **Não conferido nesta revisão:** art. 10 da Lei 10.833 a partir do inciso VII; e o efeito das alterações da LC 214/2025 sobre PIS/Cofins (as páginas listam alterações). **Diante de dúvida, o agente deve dizer "preciso confirmar".**

## 1. Quem é obrigado ao Lucro Real (Lei 9.718/1998, art. 14)
- Receita total no ano-calendário anterior **superior a R$ 78.000.000,00** (ou proporcional ao número de meses, se o período for menor que 12).
- Bancos, seguradoras, capitalização e previdência privada (inciso II, nos termos da lei).
- Lucros, rendimentos ou ganhos de capital vindos do exterior (inciso III).
- Benefícios fiscais de isenção ou redução do imposto (inciso IV).
- Quem pagou o imposto mensal por estimativa durante o ano (inciso V, art. 2º da Lei 9.430).
- Factoring/serviços contínuos de crédito (VI) e securitização de créditos (VII).
- O **Lucro Presumido** só é permitido com receita bruta do ano anterior **até R$ 78.000.000,00** (ou R$ 6.500.000,00 por mês de atividade, se menos de 12 meses) (art. 13).

## 2. IRPJ
- Alíquota de **15%** sobre o lucro, mais **adicional de 10%** sobre a parcela que exceder **R$ 20.000,00 multiplicados pelo número de meses do período** (Lei 9.249, art. 3º e §1º; R$ 60.000,00 no trimestre é apenas a conta de 3 × 20.000; a Receita não traz esse número escrito).
- **Apuração trimestral:** períodos encerrados em 31/03, 30/06, 30/09 e 31/12 (Lei 9.430, art. 1º). A alternativa é a **estimativa mensal** com ajuste anual (art. 2º).
- **Pagamento:** quota única até o **último dia útil do mês seguinte** ao fim do período, ou **até 3 quotas mensais iguais**, nenhuma abaixo de **R$ 1.000,00** (Lei 9.430, art. 5º).
- **Presunções do Lucro Presumido** (Lei 9.249, art. 15): 8% da receita (geral); 1,6% revenda de combustíveis; 16% transporte de passageiros; 32% serviços em geral; 38,4% crédito por Empresa Simples de Crédito.
- **Despesas não dedutíveis** (art. 13): rol de oito itens, incluindo alimentação de sócios, acionistas e administradores.
- **JCP (juros sobre o capital próprio, art. 9º):** limitado à variação da TJLP; exige lucros pelo menos o dobro dos juros; retenção na fonte de **17,5%** conforme o texto consolidado no Planalto (alteração por LC 224/2025; versões antigas mostravam 15%). Confirme a vigência antes de aplicar.

## 3. CSLL
- **9%** para pessoas jurídicas em geral; **15%** para seguros privados, capitalização e instituições do art. 1º, § 1º, I a VII, IX e X da LC 105/2001 (Receita Federal).
- Pagamento: trimestral em quota única até o último dia útil do mês seguinte (ou até 3 quotas; nenhuma abaixo de R$ 1.000,00; CSLL abaixo de **R$ 2.000,00** em quota única); estimativa mensal até o último dia útil do mês seguinte; ajuste anual até o último dia útil de março do ano seguinte.
- Códigos de DARF (Receita Federal): 2484 (não financeira, estimativa), 6012 (não financeira, trimestral), 6773 (não financeira, ajuste anual), 2372 (presumido ou arbitrado), 5638 (arbitrado).

## 4. PIS e Cofins não cumulativos (Lei 10.637/2002 e Lei 10.833/2003)
- **PIS: 1,65%** (Lei 10.637, art. 2º) e **Cofins: 7,6%** (Lei 10.833, art. 2º) sobre o total das receitas do mês.
- **Créditos** (art. 3º de ambas): bens para revenda; bens e serviços usados como insumo; energia elétrica e térmica; aluguéis de prédios, máquinas e equipamentos pagos a pessoa jurídica; arrendamento mercantil de pessoa jurídica; máquinas e equipamentos do ativo imobilizado; edificações e benfeitorias; devoluções; armazenagem e frete na venda (Cofins); vale-transporte, refeição, alimentação e fardamento em empresas de limpeza e conservação (inciso X).
- **Ficam no regime cumulativo (fora do não cumulativo):** Lucro Presumido ou Arbitrado, optantes do Simples, entidades imunes, órgãos públicos e fundações, cooperativas (exceto as de produção agropecuária), entre outros (Lei 10.833, art. 10; Lei 10.637, art. 8º). As alíquotas do cumulativo (0,65% e 3%) estão na Lei 9.718 e **não foram reconferidas aqui**.
- A **Reforma Tributária** prevê a substituição de PIS/Cofins pela CBS; veja o documento da Reforma para o cronograma.`
  },
  {
    id: 'iss-ipi',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/iss-ipi.md',
    title: 'ISS (LC 116/2003) e IPI: incidência, base, alíquotas e prazos',
    summary: 'ISS: fato gerador, não incidência, local, base de cálculo, alíquotas de 2% a 5% e retenção (LC 116). IPI: fato gerador, contribuintes, apuração mensal e prazos dia 25 e dia 10 (Receita Federal e RIPI).',
    tags: ['ISS', 'LC 116/2003', 'IPI', 'Tipi', 'RIPI', 'Decreto 7.212/2010', 'retenção ISS', 'alíquota mínima 2%'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm',
    officialLinkLabel: 'LC 116/2003 (Planalto)',
    content: `# ISS (LC 116/2003) e IPI (Receita Federal e RIPI)

> **Fontes oficiais (conferidas em 20/10/2026):**
> - [Lei Complementar 116/2003, arts. 1º a 10 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm)
> - [IPI, orientação tributária (Receita Federal)](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/ipi)
> - [Tipi, tabela de incidência do IPI (Receita Federal)](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/tipi-tabela-de-incidencia-do-imposto-sobre-produtos-industrializados)
> - [Regulamento do IPI, Decreto 7.212/2010 (Planalto)](https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/decreto/d7212.htm)
> **Conferido em 21/10/2026 na mesma página da LC 116:** os 40 itens da lista de serviços (títulos), o art. 7º, o art. 8º (máximo 5%), o art. 8º-A (mínimo 2%) e o art. 8º-B (ver seção 1-A); Decreto 11.158/2022 (Tipi) e Decreto 12.665/2025 (ver seção 3-A).
> **Conferido em 21/10/2026:** códigos de receita do IPI (seção 3-B).
> **Não conferido nesta revisão:** subitens da lista de serviços; leis municipais de ISS (alíquotas, prazos e retenção de cada município, inclusive Goiânia); alíquotas de produtos na Tipi; base de cálculo e art. 122 do RIPI (a página do Planalto foi cortada). **Diante de dúvida, o agente deve dizer "preciso confirmar".**

## 1. ISS: incidência (LC 116/2003)
- **Fato gerador (art. 1º):** prestação de serviços **constantes da lista anexa**, ainda que não seja a atividade principal do prestador; vale também para serviço vindo do exterior (§ 1º).
- **Não incide (art. 2º):** exportação de serviços para o exterior (inciso I); serviços de relação de emprego (II); intermediação de títulos, depósitos bancários e principal e juros de operações de crédito (III). Serviço executado no Brasil não é exportação mesmo que o pagamento venha de residente no exterior (parágrafo único).
- **Local do imposto (art. 3º):** em regra, o **estabelecimento do prestador** (ou o domicílio, se não houver estabelecimento). Há exceções listadas nos incisos I a XXV, em que o imposto é do local da execução ou do tomador (por exemplo, certos serviços de construção). O texto no Planalto mostra versões antigas e novas juntas: confira o inciso aplicável antes de afirmar.

## 1-A. Lista de serviços, base de cálculo e alíquotas (LC 116/2003, conferido no Planalto em 21/10/2026)
- **Base de cálculo (art. 7º):** o **preço do serviço**; o material fornecido pelo prestador nos itens 7.02 e 7.05 fica fora da base.
- **Alíquota máxima (art. 8º, II):** **5%** para os demais serviços. **Alíquota mínima (art. 8º-A):** **2%**; benefícios que reduzam abaixo disso são vedados, salvo itens 7.02, 7.05 e 16.01 (conforme o texto lido).
- **Art. 8º-B:** para fatos geradores de 2029 a 2032, as alíquotas são reduzidas em 10% (2029), 20% (2030), 30% (2031) e 40% (2032) em relação às vigentes em 31/12/2028. **Preciso confirmar** a redação exata no texto consolidado antes de aplicar.
- **Os 40 itens da lista (títulos):** 1 informática; 2 pesquisa e desenvolvimento; 3 locação e cessão de direito de uso; 4 saúde e assistência médica; 5 medicina veterinária; 6 cuidados pessoais, estética e atividades físicas; 7 engenharia, arquitetura, construção civil, limpeza, saneamento; 8 educação e ensino; 9 hospedagem e turismo; 10 intermediação; 11 guarda, estacionamento, vigilância; 12 diversões e lazer; 13 fonografia, fotografia, cinematografia, reprografia; 14 bens de terceiros; 15 setor bancário ou financeiro; 16 transporte municipal; 17 apoio técnico, administrativo, jurídico, contábil e comercial; 18 regulação de sinistros e seguros; 19 loterias e apostas; 20 serviços portuários e aeroportuários; 21 registros públicos, cartorários e notariais; 22 exploração de rodovia; 23 programação e comunicação visual; 24 chaveiros, carimbos, placas; 25 funerários; 26 coleta e entrega de correspondências, courier; 27 assistência social; 28 avaliação de bens e serviços; 29 biblioteconomia; 30 biologia, biotecnologia e química; 31 serviços técnicos em edificações, eletrônica e telecomunicações; 32 desenhos técnicos; 33 desembaraço aduaneiro e despachantes; 34 investigações particulares; 35 reportagem, assessoria de imprensa e relações públicas; 36 meteorologia; 37 artistas, atletas e modelos; 38 museologia; 39 ourivesaria e lapidação; 40 obras de arte sob encomenda.
- **Serviços contábeis:** estão no item 17 (apoio técnico, administrativo, jurídico, contábil). O **subitem exato** e a alíquota do município (Goiânia, por exemplo) **não foram conferidos**: **preciso confirmar** na lei municipal.

## 2. ISS: base de cálculo, alíquotas e retenção
- **Base de cálculo (art. 7º):** o **preço do serviço**. Não entram na base os **materiais fornecidos pelo prestador** nos itens **7.02 e 7.05** (art. 7º, § 2º, I).
- **Alíquota máxima:** **5%** (art. 8º, para os demais serviços). **Alíquota mínima:** **2%** (art. 8º-A); é vedado conceder isenção ou redução que leve a carga abaixo de 2%, exceto para os subitens **7.02, 7.05 e 16.01** (art. 8º-A, § 1º). Lei municipal que descumprir o mínimo, em serviço prestado a tomador de outro município, é nula (§ 2º), e o prestador pode pedir restituição (§ 3º).
- **Responsabilidade e retenção (art. 6º):** o município pode, por lei, atribuir a responsabilidade a **terceiro vinculado ao fato gerador**; o terceiro responde pelo imposto, multa e juros **mesmo que a retenção não tenha sido feita** (§ 1º). Entre os responsáveis (§ 2º) estão o tomador ou intermediário de serviço vindo do exterior e certas empresas nos subitens 3.05, 7.02 e 17.05.
- **Prazos de recolhimento e alíquota efetiva** dependem da **lei do município**: a LC 116 não fixa esses dados. Para empresa do Simples Nacional, o ISS vai no DAS (veja o documento do Simples Nacional).

## 3. IPI: incidência (Receita Federal e RIPI)
- **Fato gerador (Receita Federal, item 1.1):** (1) **desembaraço aduaneiro** de produto de procedência estrangeira; (2) **saída do produto do estabelecimento industrial** ou equiparado a industrial. O RIPI traz o fato gerador no **art. 35** (existem duas versões no texto, a alterada pelo Decreto 10.668/2021 é a que vale).
- **Industrialização (RIPI, art. 4º):** qualquer operação que **modifique a natureza, o funcionamento, o acabamento, a apresentação ou a finalidade** do produto (o texto lista cinco modalidades, I a V).
- **Contribuintes (art. 24 do RIPI e Receita Federal, item 2.1):** o **importador** (no desembaraço); o **industrial** (nas saídas); o **equiparado a industrial**; e quem consome ou usa papel destinado a livros, jornais e periódicos fora da imunidade. **Cada estabelecimento é contribuinte autônomo** para cada fato gerador.
- **Alíquotas:** variam conforme o produto e estão na **Tipi**. A Receita não traz as alíquotas na página do IPI, e a página da Tipi não informa o número do decreto: a Tipi vigente foi aprovada pelo Decreto 11.158/2022 (ver seção 3-A); **preciso confirmar a alíquota do produto** (código NCM) na Tipi atualizada antes de calcular.

## 4. IPI: apuração e prazo (Receita Federal, itens 5 e 6)
- **Período de apuração:** **mensal** para as saídas de estabelecimento industrial ou equiparado. Não vale para IPI na importação.
- **Prazo de recolhimento:**
  - **Importação:** antes da saída do produto da unidade da Receita que processa o desembaraço.
  - **Produtos do código 2402.20.00 da Tipi:** até o **dia 10 do mês seguinte** ao fato gerador.
  - **Demais produtos:** até o **dia 25 do mês seguinte** ao fato gerador.
  - Se o dia não for útil, o prazo **antecipa** para o dia útil anterior.

## 3-A. Tipi vigente (conferido no Planalto em 21/10/2026)
- O **Decreto 11.158, de 29/07/2022**, aprovou a Tipi (art. 1º), com efeitos desde **01/08/2022**, e revogou os Decretos 10.923/2021 e 11.055/2022.
- O **Decreto 12.665, de 10/10/2025** alterou a Tipi para instituir **ex-tarifários** de 6,75% (canudos e copos, pratos e itens descartáveis de plástico e papel), com efeitos tributários a partir de 01/02/2026 segundo a página lida.
- Há outras alterações posteriores da Tipi (por exemplo, o Decreto 12.549/2025 apareceu na busca, mas **não foi lido**): **preciso confirmar** a Tipi atualizada na Receita Federal antes de aplicar qualquer alíquota.
- Fontes: [Decreto 11.158/2022](https://planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/d11158.htm), [Decreto 12.665/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12665.htm).

## 3-B. Códigos de receita do IPI (Receita Federal, página atualizada em 27/07/2023, lida em 21/10/2026)
Todos com periodicidade **mensal**. Principais: **0668** IPI sobre bebidas do capítulo 22; **0676** IPI sobre veículos das posições 87.03 e 87.06; **0821** cervejas e **0838** demais bebidas (bebidas frias); **1020** cigarros com tabaco (a variação /06 é o regime especial do código 2402.20.00); **1097** máquinas, aparelhos e material de transporte; **5110** charutos, cigarrilhas e cigarros sem tabaco; **5123** demais produtos; **2401** e **2410** operações intra-orçamentárias. Variações /16 são para perda de benefício fiscal. Fonte: [IPI, tabelas de códigos (Receita Federal)](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dctf/tabelas-de-codigos-extensoes/ipi). O **prazo de recolhimento por código** não foi confirmado nesta fonte: **preciso confirmar** no calendário da Receita.`
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
>
> **Fonte oficial conferida em 21/10/2026:** [Lei 9.249/1995 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/l9249.htm), arts. 3º, 10, 15 e 20. **Conferido:** alíquota de 15% do IRPJ e adicional de 10% sobre o lucro que exceder R$ 20.000 por mês (art. 3º, § 1º); presunção do IRPJ de 8% (regra geral, art. 15), 1,6% para revenda de combustíveis, álcool e gás natural, 16% para transporte exceto de carga, 32% para serviços em geral, locação de bens e factoring (art. 15, § 1º); presunção da CSLL de 12% (regra geral) e 32% para as atividades de 32% (art. 20); lucros e dividendos sem retenção de IR na fonte e fora da base do beneficiário (art. 10, em regra).
> **Não conferido nesta revisão:** o limite de receita de R$ 78 milhões, a alíquota de 9% da CSLL (art. 3º da Lei 7.689), o 8% para serviços hospitalares, os prazos e as alíquotas de PIS/Cofins cumulativos e de retenções na fonte (RIR/2018 e Lei 10.833/2003, art. 30), e o crédito do art. 10-A (tributação de lucros acima de determinado valor, que a página lida cita). **Diante de dúvida, o agente deve dizer "preciso confirmar".**

---

## 1. Conceito e Regras de Opção

O Lucro Presumido é uma modalidade de tributação simplificada para determinação da base de cálculo do IRPJ e da CSLL de pessoas jurídicas que não estejam obrigadas à tributação pelo Lucro Real.

- **Limite de Receita Total:** Até R$ 78.000.000,00 no ano-calendário anterior (ou R$ 6.500.000,00 multiplicado pelo número de meses de atividade).
- **Periodicidade de Apuração do IRPJ e CSLL:** Trimestral (encerrados em 31/03, 30/06, 30/09 e 31/12).
- **Forma de Opção:** Concretiza-se com o pagamento da primeira quota ou quota única do imposto devido correspondente ao primeiro trimestre do ano-calendário (ou primeira apuração). A opção é irretratável para todo o ano-calendário.

---

## 2. Coeficientes de Presunção da Receita

A base de cálculo estimada dos tributos federais sobre o lucro decorre da aplicação de alíquotas de presunção fixadas por lei:

| Segmento de Atividade | Presunção IRPJ | Presunção CSLL |
| :--- | :--- | :--- |
| **Revenda de combustíveis, álcool e gás natural** | 1,6% | 12,0% |
| **Comércio e Indústria em geral** | 8,0% | 12,0% |
| **Transporte de Cargas** | 8,0% | 12,0% |
| **Transporte de Passageiros** | 16,0% | 12,0% |
| **Serviços Hospitalares e Atividades Médicas Equiparadas (RDC Anvisa)** | 8,0% | 12,0% |
| **Prestação de Serviços em geral (engenharia, advocacia, TI, consultoria)** | 32,0% | 32,0% |
| **Intermediação de negócios, corretagem e administração de bens móveis** | 32,0% | 32,0% |

---

## 3. Apuração do IRPJ e CSLL Trimestral

### IRPJ
1. **Base de Cálculo:** (Receita Bruta do Trimestre × % Presunção) + Demais Receitas e Ganhos de Capital.
2. **Alíquota Básica:** 15% sobre a Base de Cálculo.
3. **Adicional do IRPJ:** 10% sobre a parcela da base de cálculo trimestral que exceder R$ 60.000,00 (R$ 20.000,00 por mês).

### CSLL
1. **Base de Cálculo:** (Receita Bruta do Trimestre × % Presunção) + Demais Receitas.
2. **Alíquota:** 9% sobre a Base de Cálculo (ressalvadas instituições financeiras e equiparadas).

---

## 4. PIS e COFINS no Regime Cumulativo

No Lucro Presumido, via de regra, aplica-se o **Regime Cumulativo** de PIS e COFINS (Lei nº 9.718/1998):
- **Alíquota PIS:** 0,65% sobre a receita bruta mensal (sem direito a tomada de créditos sobre insumos ou compras).
- **Alíquota COFINS:** 3,00% sobre a receita bruta mensal.
- **Vencimento:** Até o 25º dia do mês subsequente ao de competência (se cair em dia não útil, antecipa-se para o primeiro dia útil anterior).

---

## 5. Retenções na Fonte e Deduções

Quando a empresa optante pelo Lucro Presumido presta serviços para outras pessoas jurídicas, está sujeita às seguintes retenções na fonte:
- **IRRF (art. 714 a 716 do RIR/2018):** 1,5% sobre os serviços profissionais de natureza técnica ou intelectual (ou 1,0% para limpeza e segurança).
- **CSRF (PIS, COFINS e CSLL retidos - Lei 10.833/2003, art. 30):** 4,65% no total:
  - PIS: 0,65%
  - COFINS: 3,00%
  - CSLL: 1,00%
- *Dedução direta:* Os valores comprovadamente retidos em notas fiscais são abatidos diretamente dos tributos apurados na competência.

---

## 6. Distribuição Isenta de Lucros

> **Atenção — mudança a partir de 2026 (Lei nº 15.270/2025, [texto oficial](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm), conferida em 20/10/2026):** os lucros e dividendos pagos por uma mesma pessoa jurídica a uma mesma pessoa física residente no Brasil estão sujeitos a **retenção de 10% na fonte quando passarem de R$ 50.000,00 no mês**; a alíquota incide sobre o total pago, sem deduções (art. 6º-A da Lei 9.250/1995). Ficam fora da retenção os lucros apurados até o ano-calendário de 2025, cuja distribuição tenha sido aprovada até 31/12/2025 e seja exigível nos termos da lei civil ou empresarial. Há ainda imposto mínimo (IRPFM, art. 16-A) para pessoas físicas com renda anual acima de R$ 600.000,00, com alíquota de até 10% a partir de R$ 1.200.000,00. Para casos concretos, consulte as [Perguntas e Respostas da Receita sobre lucros e dividendos](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/dezembro/receita-federal-lanca-perguntas-e-respostas-sobre-tributacao-de-altas-rendas-consideracoes-sobre-lucros-e-dividendos/manual_padrao_rfb_per_tributacao_sutri_v2.pdf).

Até o limite de R$ 50.000,00 mensais por pagadora e beneficiário, e para os lucros do período anterior descrito acima, a distribuição não sofre essa retenção, desde que:
1. O valor distribuído não exceda o Lucro Presumido apurado diminuído dos tributos correspondentes (IRPJ, CSLL, PIS, COFINS, ISS e ICMS); OU
2. A empresa mantenha **escrituração contábil regular (Livro Diário e Razão)** demonstrando que o lucro contábil efetivo foi superior ao presumido. Essa é a melhor prática recomendada pela consultoria Murade.`
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

> **Status de conferência (21/10/2026):** conferido o que está na seção 0 abaixo (LC 87/1996 no Planalto e alíquotas interestaduais no portal DIFAL das SEFAZ). **Também conferida em 21/10/2026:** a LC 190/2022 (seção 0-A). **Não foram reconferidos:** o restante deste documento (EC 87/2015, fórmulas de DIFAL, MVA e base dupla) nem a alíquota interna de Goiás. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.

> **Legislação Base:** Lei Complementar nº 87/1996 (Lei Kandir), Emenda Constitucional nº 87/2015, Lei Complementar nº 190/2022 e Convênios ICMS / CONFAZ.

## 0-A. DIFAL: LC 190/2022 (conferida em 21/10/2026 na [publicação da Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/leicom/2022/leicomplementar-190-4-janeiro-2022-792209-publicacaooriginal-164316-pl.html))
- **Quem recolhe a diferença (art. 4º, § 2º da LC 87, incluído pela LC 190):** pela diferença entre a alíquota interna do Estado de destino e a interestadual, é contribuinte o **destinatário**, se for contribuinte do imposto, e o **remetente ou prestador**, se o destinatário **não** for contribuinte.
- **Art. 12, inciso XVI:** novo fato gerador na saída de estabelecimento de contribuinte de bens destinados a consumidor final não contribuinte em outro Estado. Inciso XV: entrada, no Estado, de bens adquiridos por contribuinte para uso, consumo ou ativo imobilizado. Inciso XIV: início de transporte interestadual não vinculado a operação subsequente, com tomador não contribuinte no destino.
- **Base de cálculo (art. 13, §§ 1º e 3º, e incisos IX e X):** o valor da operação (ou preço do serviço) é a base para o imposto de cada Estado, e o imposto do destino é a **diferença entre a alíquota interna e a interestadual**. Os §§ 6º e 7º definem quais alíquotas entram no cálculo da base; **preciso confirmar** a fórmula exata antes de calcular (a leitura foi um resumo do texto).
- **Crédito (art. 20-A):** nas hipóteses XIV e XVI, o crédito de operações anteriores só pode ser deduzido do débito devido ao Estado de **origem**.
- **Portal (art. 24-A):** os Estados e o DF devem manter portal com legislação, alíquotas, benefícios e obrigações acessórias, com apuração centralizada e emissão de guias; alguns dispositivos só valem a partir do primeiro dia útil do terceiro mês após a disponibilização do portal (§ 4º).
- **Vigência (art. 3º):** vigora desde a publicação (04/01/2022), mas a produção de efeitos respeita a noventena (art. 150, III, "c" da CF). A data prática de cobrança do DIFAL: **preciso confirmar** (a leitura não trouxe a data final).

## 0. Conferido em fonte oficial (21/10/2026)
**LC 87/1996 (Lei Kandir), [texto no Planalto](https://planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm?origin=instituicao)** (a página foi lida até o art. 33):
- **Art. 2º, fatos geradores:** circulação de mercadorias (inclusive alimentos e bebidas em bares e restaurantes), transporte interestadual e intermunicipal, comunicação onerosa; o § 1º estende o imposto a importações e a serviços iniciados no exterior.
- **Art. 3º, não incidência:** livros, jornais, periódicos e o papel para sua impressão; operações que destinem ao exterior mercadorias e serviços (exportação); entre outras hipóteses listadas no artigo.
- **Art. 12:** o fato gerador ocorre, por exemplo, na saída da mercadoria do estabelecimento (inciso I), no início do transporte (V) e no desembaraço aduaneiro (IX). **§ 4º:** não há fato gerador na transferência entre estabelecimentos do mesmo titular, mantendo-se os créditos anteriores. **Preciso confirmar** a redação atual desse § 4º, porque o STF e a LC 204/2023 trataram desse tema; não afirme a regra sem conferir.
- **Art. 20, crédito:** o contribuinte tem direito ao crédito do imposto anteriormente cobrado; não há crédito de bens e serviços alheios à atividade ou ligados a operações isentas ou não tributadas (§§ 1º e 3º); o crédito do ativo permanente é apropriado em 1/48 por mês (§ 5º), com regras de limite e cancelamento que variam por versão do texto.
- **Art. 21, estorno:** o crédito deve ser estornado quando a mercadoria ou o serviço for usado em operação posterior isenta ou não tributada, utilizado em fim alheio à atividade, ou perecer, deteriorar-se ou for extraviado.

**Alíquotas interestaduais, [portal DIFAL das SEFAZ](https://dfe-portal.svrs.rs.gov.br/Difal/aliquotas):**
- **4%:** operações interestaduais com bens e mercadorias importados (ou com conteúdo importado superior a 40%).
- **7%:** saídas das regiões Sul e Sudeste (exceto Espírito Santo) para Centro-Oeste, Norte, Nordeste e Espírito Santo.
- **12%:** saídas do Centro-Oeste, Norte, Nordeste e Espírito Santo para os demais estados, e entre Sul e Sudeste (exceto ES). Goiás está no Centro-Oeste, então suas saídas interestaduais são, em regra, de 12% (exceto importados, a 4%): confirme a regra do produto.
- A página não traz a data de atualização nem a alíquota interna de Goiás: **preciso confirmar** a alíquota interna na Lei 11.651/1991 (art. 27). A Lei estadual 19.925/2017, lida na Casa Civil de Goiás, **não fixa 17% nem 19%**; ela trata de itens como 23% (inciso IX do art. 27), 14% para óleo diesel e um acréscimo de dois pontos percentuais para o fundo Protege Goiás em certos produtos e serviços.

---

## 1. Princípios Constitucionais do ICMS

O Imposto sobre Operações relativas à Circulação de Mercadorias e sobre Prestações de Serviços de Transporte Interestadual e Intermunicipal e de Comunicação (ICMS) é um imposto de competência estadual e distrital (art. 155, II da CF/88), regido pelos princípios:
1. **Não-cumulatividade:** O imposto devido em cada operação é compensado com o montante cobrado nas operações anteriores (sistema de créditos fiscais).
2. **Seletividade:** Alíquotas diferenciadas em função da essencialidade das mercadorias e dos serviços (ex.: alimentos da cesta básica com alíquotas reduzidas vs. supérfluos com alíquotas majoradas).

---

## 2. Alíquotas Interestaduais Padronizadas pelo Senado Federal

Nas operações interestaduais destinadas a contribuintes ou a não-contribuintes do imposto:
- **Resolução do Senado Federal nº 22/1989:**
  - **7,0%:** Operações com mercadorias originárias do Sul e Sudeste (exceto Espírito Santo) destinadas às regiões Norte, Nordeste, Centro-Oeste e ao Estado do Espírito Santo.
  - **12,0%:** Operações realizadas entre estados das regiões Sul e Sudeste, ou de estados do Norte/Nordeste/Centro-Oeste para qualquer outra unidade federativa.
- **Resolução do Senado Federal nº 13/2012 (Conteúdo de Importação):**
  - **4,0%:** Mercadorias importadas do exterior que não tenham passado por processo de industrialização ou que, submetidas a industrialização no Brasil, possuam Conteúdo de Importação superior a 40% (FCI - Ficha de Conteúdo de Importação).

---

## 3. DIFAL (Diferencial de Alíquotas)

O DIFAL equaliza a carga tributária incidente entre os estados de origem e destino da mercadoria:

$$\\text{DIFAL} = \\text{Alíquota Interna do Estado de Destino} - \\text{Alíquota Interestadual da Operação}$$

### Cenários de Aplicação:
1. **Consumidor Final Não Contribuinte (E-commerce / Venda Não Presencial):**
   - Regulamentado pela **LC 190/2022**.
   - O remetente é o responsável pelo cálculo e recolhimento do DIFAL integralmente em favor do Estado de destino da mercadoria (via GNRE ou DARE antes da saída da mercadoria, ou por inscrição estadual de substituto tributário).
2. **Consumidor Final Contribuinte (Uso, Consumo ou Ativo Imobilizado):**
   - O destinatário da mercadoria apura e recolhe o DIFAL na entrada no seu estado.
   - Há estados que utilizam a fórmula com **base dupla** (ex.: SP, MG, PR), recalculando o valor da mercadoria sem o ICMS de origem antes de aplicar a alíquota interna.

---

## 4. Substituição Tributária (ICMS-ST)

Na Substituição Tributária, a responsabilidade pelo recolhimento do ICMS de toda a cadeia subsequente (fabricante $\\to$ distribuidor $\\to$ varejista $\\to$ consumidor final) é atribuída a um único contribuinte (o **Substituto Tributário**, usualmente o fabricante ou importador).

### Cálculo com MVA (Margem de Valor Agregado):
1. $\\text{Base de Cálculo da Operação Própria} = \\text{Valor da Mercadoria} + \\text{Frete} + \\text{Seguro} + \\text{Outras Despesas}$
2. $\\text{ICMS Próprio} = \\text{Base Própria} \\times \\text{Alíquota Interestadual ou Interna}$
3. $\\text{Base de Cálculo do ICMS-ST} = (\\text{Base Própria} + \\text{IPI}) \\times (1 + \\text{MVA Ajustada})$
4. $\\text{ICMS-ST Devido} = (\\text{Base de Cálculo do ICMS-ST} \\times \\text{Alíquota Interna Destino}) - \\text{ICMS Próprio}$

> **Atenção:** Em compras interestaduais, caso a alíquota interna de destino seja superior à interestadual, deve-se calcular a **MVA Ajustada** conforme fórmula do CONFAZ para neutralizar a disparidade de alíquotas.`
  },
  {
    id: 'reforma-tributaria',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/reforma-tributaria.md',
    title: 'Reforma Tributária: IVA Dual (IBS/CBS), IS e Cronograma 2026-2033',
    summary: 'Substituição do PIS, COFINS, IPI, ICMS e ISS por CBS (Federal) e IBS (Estados/Municípios), teste de 0,9%/0,1% em 2026 e split payment.',
    tags: ['Reforma Tributária', 'EC 132/2023', 'IBS', 'CBS', 'Split Payment'],
    lastUpdated: '2026-10-20',
    officialLink: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm',
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

## 2. Cronograma de Transição (conferido em 20/10/2026)

> **Fontes oficiais:** [Lei Complementar nº 214/2025](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm) (regulamenta IBS, CBS e IS) e [Agência Câmara, 06/01/2026](https://www.camara.leg.br/noticias/1237089-reforma-tributaria-comeca-fase-de-transicao-com-testes-de-novos-impostos-em-2026/).

- **2026:** fase de testes. As notas fiscais passam a trazer CBS e IBS; os dados são registrados, mas os novos tributos ainda não são cobrados de fato (alíquotas de teste de 0,9% CBS e 0,1% IBS, conforme a LC 214/2025).
- **2027:** começa a cobrança da CBS e do Imposto Seletivo (IS). A CBS substitui PIS, Cofins e IPI.
- **A partir de 2029:** o IBS entra em transição, substituindo gradualmente ICMS e ISS. Os percentuais de cada ano estão nos arts. 361 a 366 e 369 da LC 214/2025 — consulte o texto antes de aplicar números.
- **2033:** extinção total de ICMS e ISS; modelo definitivo com IBS, CBS e IS.

**Não confirmei** nesta revisão, em fonte oficial acessível, a regra detalhada de compensação do teste de 2026 com PIS/Cofins nem os percentuais anuais de 2029–2032.`
  },
  {
    id: 'clt-principios',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/clt-principios.md',
    title: 'CLT: Princípios Trabalhistas, Jornada, Férias e Rescisões',
    summary: 'Princípios fundamentais (in dubio pro operario, primazia da realidade), tipos contratuais, limite de 44h semanais, banco de horas e prazos rescisórios.',
    tags: ['CLT', 'Decreto-Lei 5.452/43', 'Jornada', 'Férias', 'Rescisão Contratual'],
    lastUpdated: '2026-10-21',
    officialLink: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    officialLinkLabel: 'CLT - Presidência da República',
    content: `# Princípios Trabalhistas da CLT e Rotinas de Departamento Pessoal

> **Legislação Base:** Decreto-Lei nº 5.452/1943 (CLT), Lei nº 13.467/2017 (Reforma Trabalhista), Súmulas e OJs do TST.
>
> **Fonte oficial conferida em 21/10/2026:** [Lei 12.506/2011, aviso prévio proporcional (Planalto)](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm).
> **Conferido em 21/10/2026 na [Lei 13.467/2017 (Planalto)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13467.htm), que dá nova redação à CLT:** art. 58-A (tempo parcial: até 30 horas semanais; horas suplementares com acréscimo de 50% sobre o salário-hora); art. 59 (duas horas extras por dia; § 5º banco de horas por acordo individual escrito com compensação em até seis meses; § 6º compensação por acordo individual, tácito ou escrito); art. 59-A (12x36 por acordo, com a remuneração abrangendo o descanso semanal e os feriados); art. 59-B (horas extras habituais não descaracterizam o acordo de compensação); art. 134 (férias em até três períodos, um com pelo menos 14 dias corridos; vedado iniciar nos dois dias que antecedem feriado ou repouso semanal); art. 477 (§ 6º: pagamento das verbas e entrega dos documentos em até **dez dias** contados do término do contrato; § 4º: pagamento em dinheiro, depósito ou cheque visado, e só em dinheiro ou depósito para analfabeto); art. 611-A (negociado prevalece sobre o legislado em temas como jornada, observados os limites constitucionais, e intervalo mínimo de 30 minutos para jornadas acima de 6 horas).
> **Também conferido na [CLT atualizada (Câmara dos Deputados)](https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-5452-1-maio-1943-415500-normaatualizada-pe.html):** art. 58 (jornada normal de até 8 horas diárias; § 1º tolerância de 5 minutos por marcação, até 10 minutos por dia); **art. 59, § 1º: a hora extra é remunerada com acréscimo de pelo menos 50%** sobre a hora normal; § 2º (compensação por acordo ou convenção coletiva dispensa o acréscimo); § 3º (na rescisão sem compensação integral, pagam-se as horas extras não compensadas); art. 71 (intervalo obrigatório em trabalho contínuo acima de 6 horas; § 1º intervalo de 15 minutos quando não passar de 6 horas; § 4º a supressão total ou parcial do intervalo gera indenização do período suprimido com acréscimo de 50% sobre a hora normal). **O art. 59 não fixa 100% para domingos e feriados.**
> **Não conferido nesta revisão:** os demais artigos da CLT citados abaixo (a página compilada do Planalto não carregou inteira), a multa do art. 477, § 8º, e as súmulas do TST. O conteúdo é a versão anterior, mantida como referência. **Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar o artigo na [CLT no Planalto](https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm).**
>
> **Pontos que exigem cuidado:** (1) o adicional de **100%** em domingos e feriados **não consta** do art. 59 nem da Constituição citados aqui; ele vem de lei específica, súmulas ou da convenção coletiva: **preciso confirmar** antes de afirmar. (2) O aviso prévio da tabela de rescisão deve ser lido junto com a seção 5-A abaixo.

---

## 1. Princípios Basilares do Direito do Trabalho

O Departamento Pessoal (DP) deve estruturar todos os seus procedimentos operacionais em estrita observância aos princípios tutelares do Direito do Trabalho:
1. **Princípio da Proteção:** Subdivide-se em:
   - *In dubio pro operario:* Havendo dúvida fundada na interpretação de norma jurídica, aplica-se a que melhor atenda ao trabalhador.
   - *Aplicação da norma mais favorável:* O trabalhador tem direito à norma que lhe for mais benéfica no confronto entre Lei, CCT e Contrato, ressalvadas as hipóteses do art. 611-A da CLT.
   - *Condição mais benéfica:* Cláusulas contratuais mais vantajosas incorporam-se ao patrimônio jurídico do empregado (Súmula 51 do TST).
2. **Primazia da Realidade sobre a Forma:** A verdade real dos fatos operacionais no ambiente de trabalho sobrepõe-se a documentos formalmente assinados que não correspondam à prática diária.
3. **Irrenunciabilidade de Direitos:** O trabalhador não pode abrir mão de direitos cogentes mínimos garantidos pela legislação (ex.: férias, 13º, salário mínimo legal ou piso convencional).
4. **Inalterabilidade Contratual Lesiva (Art. 468 da CLT):** É nula qualquer alteração unilateral ou bilateral nas condições de trabalho que resulte em prejuízos diretos ou indiretos ao empregado.

---

## 2. Modalidades de Contrato de Trabalho

- **Prazo Indeterminado:** Regra geral do ordenamento jurídico brasileiro.
- **Prazo Determinado (Art. 443 da CLT):** Válido para serviços de natureza transitória, atividades empresariais de caráter transitório ou Contrato de Experiência (prazo máximo de 90 dias, com no máximo uma prorrogação).
- **Trabalho Intermitente (Art. 452-A da CLT):** Prestação de serviços com subordinação, não contínua, com alternância de períodos de prestação de serviços e de inatividade. O empregador convoca com no mínimo 3 dias corridos de antecedência; a cada período, paga-se imediatamente a remuneração, férias proporcionais com 1/3, 13º proporcional e DSR.
- **Teletrabalho / Home Office (Art. 75-A da CLT):** Deve constar expressamente em aditivo contratual individual, discriminando o fornecimento e manutenção dos equipamentos e a infraestrutura tecnológica.

---

## 3. Jornada de Trabalho e Intervalos

- **Limite Padrão:** Máximo de 8 horas diárias e 44 horas semanais (Art. 7º, XIII da CF/88).
- **Horas Extras:** Limite de até 2 horas diárias, remuneradas com acréscimo de no mínimo 50% em dias úteis ou 100% em domingos e feriados (ou conforme percentual superior previsto na CCT da categoria).
- **Banco de Horas:**
  - *Individual e Tácito/Escrito:* Compensação no mesmo mês (sem formalidade escrita) ou até 6 meses (com acordo individual escrito).
  - *Anual:* Exige negociação coletiva formal (Acordo ou Convenção Coletiva de Trabalho).
- **Intervalo Intrajornada (Almoço/Repouso):**
  - Jornada superior a 6 horas: Mínimo de 1 hora (podendo ser reduzido para até 30 minutos mediante Acordo ou CCT, art. 611-A, III).
  - Jornada entre 4 e 6 horas: Intervalo obrigatório de 15 minutos.
- **Intervalo Interjornada:** Mínimo de 11 horas consecutivas de descanso entre o término de uma jornada diária e o início da seguinte (Art. 66 da CLT).

---

## 4. Férias Individuais e Coletivas

- **Período Aquisitivo e Concessivo:** A cada 12 meses de vigência contratual (período aquisitivo), o empregado adquire direito a 30 dias de férias, que devem ser concedidas pelo empregador nos 12 meses subsequentes (período concessivo), sob pena de pagamento em dobro (Art. 137 da CLT).
- **Fracionamento (Art. 134, § 1º):** Desde que haja concordância do empregado, as férias podem ser usufruídas em até 3 períodos:
  - Um período não poderá ser inferior a 14 dias corridos;
  - Os demais não poderão ser inferiores a 5 dias corridos cada.
- **Início das Férias:** Vedado o início nos dois dias que antecedem feriado ou repouso semanal remunerado (RSR) - ou seja, não pode iniciar em quinta ou sexta-feira para quem descansa no fim de semana.
- **Abono Pecuniário ("Vender 10 dias"):** Faculdade exclusiva do empregado requerer a conversão de 1/3 das férias em dinheiro, solicitado com até 15 dias de antecedência do vencimento do período aquisitivo.

---

## 5. Modalidades de Rescisão Contratual

| Tipo de Rescisão | Saldo Salário | Aviso Prévio | 13º Proporcional | Férias Vencidas + 1/3 | Férias Proporcionais + 1/3 | Saque FGTS | Multa Rescisória FGTS | Seguro-Desemprego |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sem Justa Causa** | Sim | Sim (Trab./Inden.) | Sim | Sim | Sim | Sim | 40% | Sim |
| **Pedido de Demissão** | Sim | Cumpre ou Indeniza | Sim | Sim | Sim | Não | Não | Não |
| **Acordo Mútuo (Art. 484-A)** | Sim | 50% se indenizado | Sim | Sim | Sim | Sim (até 80%) | 20% | Não |
| **Demissão por Justa Causa (Art. 482)** | Sim | Não | Não | Sim | Não | Não | Não | Não |
| **Rescisão Indireta (Falta grave patronal)**| Sim | Sim | Sim | Sim | Sim | Sim | 40% | Sim |

### 5-A. Aviso prévio proporcional (Lei 12.506/2011, **conferida no Planalto**)
- O aviso prévio é de **30 dias** para o empregado com **até 1 ano de serviço** na mesma empresa (art. 1º).
- **Acrescentam-se 3 dias por ano de serviço** na mesma empresa, **até o máximo de 60 dias de acréscimo, perfazendo no máximo 90 dias** (parágrafo único).
- Exemplo (aplicação da regra acima): 5 anos de serviço = 30 + (3 x 5) = **45 dias**. A contagem de anos incompletos e a aplicação ao pedido de demissão **não constam da lei**: **preciso confirmar** na jurisprudência do TST antes de afirmar.

> **Prazo Legal de Pagamento da Rescisão (Art. 477, § 6º da CLT):** Até **10 dias corridos** contados do término do contrato de trabalho, independentemente do tipo de aviso prévio (trabalhado ou indenizado). O descumprimento gera a multa de 1 salário do empregado (art. 477, § 8º).`
  },
  {
    id: 'eSocial-prazos',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/eSocial-prazos.md',
    title: 'eSocial: Calendário de Eventos, Prazos Oficiais e DCTFWeb',
    summary: 'Tabela de eventos periódicos e não periódicos (S-2190, S-2200, S-2210, S-2220, S-2240, S-2299, S-1200) e transmissão para DCTFWeb.',
    tags: ['eSocial', 'DCTFWeb', 'S-2200 Admissão', 'S-2299 Desligamento', 'Prazos'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.esocial.gov.br',
    officialLinkLabel: 'Portal Oficial do eSocial',
    content: `# eSocial - Calendário Oficial, Prazos de Eventos e DCTFWeb

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
3. Vencimento informado antes: **dia 20 do mês seguinte**, com antecipação se o dia não for útil. **Não conferido**: confirme na Receita.`
  },
  {
    id: 'fgts-inss',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/fgts-inss.md',
    title: 'FGTS Digital e INSS: Faixas Progressivas, Guia Pix e Multas',
    summary: 'Tabela do INSS 2026 (7,5% a 14%, teto R$ 8.475,55), FGTS Digital com vencimento até o dia 20 e pagamento via Pix.',
    tags: ['FGTS Digital', 'INSS Progressivo', 'Teto RGPS', 'CPP', 'Pix Obrigatório'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal',
    officialLinkLabel: 'INSS — Tabela de contribuição',
    content: `# FGTS Digital e INSS - Regras de Apuração, Faixas Progressivas e Recolhimentos

> **Legislação Base:** Lei nº 8.036/1990, Lei nº 8.212/1991, Emenda Constitucional nº 103/2019 (Reforma da Previdência), Lei nº 14.438/2022 (que alterou os procedimentos de recolhimento do FGTS), Portaria MTE nº 240/2024 (FGTS Digital) e Portarias Interministeriais MPS/MF.

---

## 1. Tabela de contribuição do INSS 2026 (Empregado, doméstico e avulso)

> **Fonte oficial:** [INSS — Tabela de contribuição mensal](https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal). **Base:** Portaria Interministerial MPS/MF nº 13, de 9/1/2026, vigente desde a competência janeiro/2026. **Conferida em 20/10/2026.**

Desde a EC 103/2019 o desconto é **progressivo**: cada alíquota incide só sobre a parcela do salário dentro da respectiva faixa.

| Salário de contribuição (R$) | Alíquota |
| :--- | :--- |
| Até 1.621,00 | 7,5% |
| De 1.621,01 até 2.902,84 | 9% |
| De 2.902,85 até 4.354,27 | 12% |
| De 4.354,28 até 8.475,55 | 14% |

- **Teto do salário de contribuição:** R$ 8.475,55.
- **Contribuição máxima do empregado (calculada pela progressão acima):** R$ 988,09.
- **Contribuinte individual, facultativo e MEI (INSS, mesma página, conferida em 21/10/2026):** sobre base de R$ 1.621,00, **5%** (exclusiva do facultativo de baixa renda e do MEI) = R$ 81,05; **11%** (exclusiva do plano simplificado) = R$ 178,31; **20%** entre o salário mínimo e o teto, ou seja, de R$ 324,20 a R$ 1.695,11. Na página, o **13º salário não entra na soma** para enquadrar a faixa e tem a alíquota aplicada separadamente. Com vínculos concomitantes, as remunerações são somadas, respeitando o teto. **Retenção pela empresa (Lei 10.666/2003, art. 4º, conferida na [publicação da Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/lei/2003/lei-10666-8-maio-2003-496649-publicacaooriginal-1-pl.html), texto de 2003):** a empresa é obrigada a **arrecadar a contribuição do contribuinte individual a seu serviço, descontando-a da remuneração**, e a recolhê-la com a contribuição a seu cargo; o artigo **não traz percentual** e, na redação original, fala em recolhimento até o dia 2 do mês seguinte, prazo que **pode ter mudado** (preciso confirmar hoje, com a DCTFWeb). O percentual de 11% aplicado na retenção: **preciso confirmar** na Lei 8.212/1991, art. 21 e art. 4º da Lei 10.666.
- Os valores mudam todo ano por portaria; para outra competência, confira a tabela do ano na fonte oficial.

---

## 2. Contribuição Patronal Previdenciária (CPP), RAT e Terceiros

> **Fonte oficial (conferida em 21/10/2026):** [Lei 8.212/1991, art. 22, texto compilado (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/L8212compilado.htm). **Não conferido nesta revisão:** percentuais e códigos de Terceiros/FPAS, regra do Simples Nacional Anexo IV, desoneração da folha (Lei 14.973/2024 e Reforma Tributária). **Diante de dúvida sobre esses itens, o agente deve dizer "preciso confirmar".**

O que o **art. 22 da Lei 8.212/1991** diz (lido no Planalto):
1. **Inciso I, contribuição da empresa sobre a folha:** **20%** sobre o total das remunerações pagas, devidas ou creditadas a qualquer título, durante o mês, aos segurados empregados e trabalhadores avulsos.
2. **Inciso II, RAT (financia aposentadoria especial e benefícios por incapacidade decorrentes de riscos ambientais):** **1%** para empresa cujo risco de acidentes do trabalho é considerado **leve**, **2%** para **médio** e **3%** para **grave**, sobre as remunerações de empregados e avulsos.
3. **§ 3º:** o Ministério competente pode **alterar o enquadramento** das empresas (leve, médio, grave) com base em estatísticas de acidentes, para estimular a prevenção. O texto do Planalto **não traz o FAP**. **FAP conferido em 21/10/2026** no [Ministério da Previdência](https://www.gov.br/previdencia/pt-br/assuntos/previdencia-social/saude-e-seguranca-do-trabalhador/fap) e na [notícia do FAP 2027, de 30/09/2026](https://www.gov.br/previdencia/pt-br/noticias/2026/setembro/fator-acidentario-de-prevencao-fap-com-vigencia-para-2027-esta-disponivel-para-consulta-a-partir-desta-quarta-feira-30): o FAP é um multiplicador de **0,5000 a 2,0000**, calculado **por estabelecimento** com base nos acidentes e doenças do trabalho dos últimos dois anos, e **multiplica as alíquotas de 1%, 2% ou 3%**. Abaixo de 1,0 reduz a contribuição (até a metade); acima de 1,0 aumenta (até o dobro). Muda **todo ano**. A contestação do FAP 2027 pode ser feita de 01 a 30/11/2026 (notícia oficial). A consulta é feita no serviço do gov.br; o valor de cada empresa **preciso confirmar** caso a caso.
4. **Inciso III:** **20%** sobre o total das remunerações pagas ou creditadas a **contribuintes individuais** que prestem serviço à empresa (por exemplo, autônomos e pró-labore de sócios).
5. **Inciso IV:** o texto do Planalto indica que a **execução está suspensa pela Resolução do Senado nº 10/2016**. Não aplique esse inciso sem confirmar.

**Outras entidades e fundos (Terceiros: Sistema S, Salário-Educação, INCRA e outros):** o percentual varia conforme a **atividade da empresa (código FPAS)**. Os percentuais e a tabela **não foram conferidos** em fonte oficial nesta revisão: **preciso confirmar** a tabela de Terceiros vigente na Receita Federal antes de calcular.

**Quem paga a CPP sobre a folha:** empresas do Lucro Presumido e do Lucro Real recolhem a CPP e o RAT sobre a folha. Para o **Simples Nacional**, a regra depende do anexo (no Anexo IV a contribuição patronal sai do DAS); essa regra **não foi reconferida** aqui, **preciso confirmar** na LC 123/2006 antes de afirmar.

> Observação de revisão: a versão anterior deste documento trazia faixas de FAP (0,5 a 2,0), de Terceiros (4,5% a 5,8%) e um "total patronal típico" (26,5% a 31,8%) sem fonte oficial (a faixa do FAP, de 0,5 a 2,0, **foi depois confirmada** em fonte oficial; ver acima). Foram **retirados** por não estarem confirmados.

---

> **Lei 8.036/1990 conferida em 21/10/2026** ([texto atualizado na Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/lei/1990/lei-8036-11-maio-1990-365155-normaatualizada-pl.pdf)): **art. 15**: depósito de 8% da remuneração **até o dia 20 de cada mês** em conta vinculada; **§ 7º**: contratos de aprendizagem com alíquota de **2%**; **art. 18, § 1º**: na despedida sem justa causa, o empregador deposita importância igual a **40% do montante de todos os depósitos** realizados na conta vinculada; **art. 22**: quem não deposita responde pela **TR** sobre o valor, **juros de mora de 0,5% ao mês** ou fração e multa (§ 1º; o percentual da multa **não foi lido**: preciso confirmar); **art. 26**: a Justiça do Trabalho é competente para os litígios entre trabalhadores e empregadores sobre a lei.

## 3. FGTS Digital - O Novo Paradigma Operacional

A plataforma do **FGTS Digital** (instituída pela Lei nº 14.438/2022 e Portaria MTE nº 240/2024) unificou a arrecadação do FGTS diretamente a partir dos eventos de remuneração (S-1200) e desligamento (S-2299) do eSocial.

### Principais Alterações em Relação à Antiga SEFIP/Conectividade Social:
1. **Mudança do Prazo de Recolhimento Mensal:**
   - O vencimento do FGTS mensal mudou do dia 7 para **até o dia 20** do mês seguinte (competência a partir de 03/2024). Se o dia 20 não for dia útil, o prazo é antecipado (exemplo oficial: competência 03/2024 venceu em 19/04/2024). A emissão antecipada da guia não antecipa a obrigação de pagamento. Fonte: [FGTS Digital](https://www.fgts.gov.br/Paginas/empregador/fgts-digital.aspx).
2. **Meio Exclusivo de Pagamento:**
   - A quitação da Guia do FGTS Digital (GFD) é feita **via Pix, pelo QR Code impresso na guia** (confirmado na página oficial do FGTS Digital).
3. **Alíquotas do FGTS:**
   - **8,0%:** Empregados em regime geral da CLT, temporários e diretores com FGTS.
   - **2,0%:** Contrato de Aprendizagem (Jovem Aprendiz, Lei 10.097/2000).
   - **11,2% (8% mensal + 3,2% rescisório compulsório):** Empregados Domésticos (recolhido no DAE/eSocial Doméstico).

### FGTS Rescisório e Multa de 40%:
- Na demissão sem justa causa ou rescisão indireta, o empregador gera a guia rescisória (GRFGTS) calculando **40% sobre o saldo histórico consolidado da conta vinculada do trabalhador** (inclusive valores depositados no mês da rescisão).
- No acordo entre empregado e empregador (art. 484-A da CLT), a multa rescisória do FGTS é de **20%**, e o empregado tem direito a sacar até **80%** do saldo da conta.`
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

> **Status de conferência (21/10/2026):** Nada deste documento foi reconferido (CLT arts. 611 e seguintes e 611-A, Súmulas do TST). Cada convenção coletiva deve ser lida no Sistema Mediador do Ministério do Trabalho: **preciso confirmar**. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.

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

> **Status de conferência (21/10/2026):** Documento de estrutura contábil não reconferido nas NBC/CPC do CFC: **preciso confirmar** antes de citar norma. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.

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
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.cfc.org.br',
    officialLinkLabel: 'Conselho Federal de Contabilidade (CFC)',
    content: `# Livros Contábeis Obrigatórios, Demonstrações Financeiras e Guarda de Documentos

> **Legislação Base:** Código Civil Brasileiro (Lei nº 10.406/2002, arts. 1.179 a 1.195), Lei nº 6.404/1976, NBC TG 1000 e Resoluções do CFC.
>
> **Fontes oficiais indicadas:** [Código Civil (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm) e [Lei 6.404/1976 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm).
> **Não conferido nesta revisão (21/10/2026):** a página do Código Civil no Planalto só carregou até o art. 232, então **nenhum artigo deste documento foi reconferido**. Também não foram conferidos: os prazos de guarda da seção 3, o Tema 608 do STF citado e a Súmula 362 do TST (ver bloco de súmulas e temas), e a obrigatoriedade da DFC. O conteúdo é a versão anterior, mantida como referência. **Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar o artigo.**
> **Pontos duvidosos:** o prazo de guarda de "contratos e livro de registro de empregados: vitalício" e de "LTCAT/PCMSO/PPP: 20 anos" são práticas usuais, não texto de lei conferido; a guarda do FGTS por "30 anos/5 anos" deve ser conferida contra o Tema 608 (que trata de prescrição do FGTS), sem afirmar que é "prazo de guarda".

---

## 1. Livros Contábeis Obrigatórios e Facultativos

O artigo 1.179 do Código Civil estabelece que o empresário e a sociedade empresária são obrigados a seguir um sistema de contabilidade e a levantar anualmente o balanço patrimonial e o de resultado econômico (exceto o Microempreendedor Individual - MEI).

### Principais Livros:
1. **Livro Diário:**
   - **Natureza:** Obrigatório a todas as pessoas jurídicas empresárias.
   - **Características:** Indivisível, cronológico, sem rasuras ou borrões. Registra dia a dia todos os fatos que modifiquem o patrimônio da empresa.
   - **Formalidades Extrínsecas:** Deve conter Termo de Abertura e Termo de Encerramento devidamente assinados pelo administrador da sociedade e pelo profissional contábil legalmente habilitado com CRC ativo, além de autenticação na Junta Comercial competente (ou via SPED/ECD).
2. **Livro Razão:**
   - **Natureza:** Obrigatório para a apuração sistemática do saldo individualizado de cada conta contábil.
   - Permite a visualização detalhada do histórico de lançamentos a débito e crédito que culminaram no saldo patrimonial final.
3. **Livro Caixa:**
   - Obrigatório para empresas que optam pelo recolhimento de impostos pelo regime de caixa (ou facultativo para entidades com escrituração contábil completa). Registra as entradas e saídas de recursos financeiros.

---

## 2. Demonstrações Contábeis de Elaboração Obrigatória

Ao final de cada exercício social (usualmente coincidente com o ano civil em 31 de dezembro), a entidade deve elaborar as seguintes demonstrações contábeis:

1. **Balanço Patrimonial (BP):** Quadro estático da posição financeira e patrimonial em determinada data, equilibrando o Ativo total com o Passivo + Patrimônio Líquido.
2. **Demonstração do Resultado do Exercício (DRE):** Apresentação vertical e ordenada das receitas operacionais, deduções tributárias, custos, margem bruta, despesas operacionais e resultado líquido final (lucro ou prejuízo).
3. **Demonstração das Mutações do Patrimônio Líquido (DMPL):** Evidencia a movimentação de todas as contas que compõem o PL (reservas, lucros acumulados, aumentos de capital).
4. **Demonstração dos Fluxos de Caixa (DFC):** Obrigatória para companhias abertas, sociedades de grande porte ou entidades sob a NBC TG 1000, detalhando os fluxos operacionais, de investimento e de financiamento.
5. **Notas Explicativas (NE):** Parte integrante obrigatória das demonstrações, esclarecendo critérios contábeis adotados, contingências fiscais e trabalhistas, partes relacionadas e eventos subsequentes.

---

## 3. Prazos Prescricionais e Guarda de Documentos

O descarte precipitado de documentos fiscais e trabalhistas pode acarretar penalidades severas e condenações em autuações:

| Tipo de Documento | Prazo Recomendado de Guarda | Fundamentação Legal |
| :--- | :--- | :--- |
| **Notas Fiscais, Livros Fiscais e SPED** | **5 anos** (contados do primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado) | Art. 173 do Código Tributário Nacional (CTN) |
| **Recibos de Entrega de ECD e ECF** | **5 anos** (ou até julgamento final de processo fiscal pendente) | Legislação da Receita Federal |
| **Comprovantes de Recolhimento de FGTS** | **30 anos** (para fatos anteriores a 13/11/2014) ou **5 anos** com modulação pelo STF (ARE 709.212) | STF Tema 608 / Súmula 362 do TST |
| **Contratos de Trabalho, Livro de Registro de Empregados e Acordos** | **Indeterminado / Vitalício** | Comprovação previdenciária de aposentadoria junto ao INSS |
| **LTCAT, PCMSO, PPRA e PPP (SST)** | **20 anos** | Normas Regulamentadoras MTE e INSS |
| **Recibos de Férias, 13º e Cartões de Ponto** | **5 anos** (durante o contrato) e até **2 anos** após rescisão | Art. 7º, XXIX da Constituição Federal |`
  },
  {
    id: 'ecd-ecf',
    category: 'contabil',
    categoryLabel: 'Contábil',
    filePath: 'contabil/ecd-ecf.md',
    title: 'ECD e ECF: Escrituração Digital do SPED e Prazos',
    summary: 'SPED Contábil (ECD até último dia útil de junho segundo o gov.br, a confirmar na IN 2.003/2021) e SPED Fiscal (ECF até último dia útil de julho), blocos principais e malha fiscal da RFB.',
    tags: ['ECD', 'ECF', 'SPED', 'e-LALUR', 'Malha Fina RFB'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.receita.fazenda.gov.br',
    officialLinkLabel: 'Receita Federal - SPED',
    content: `# ECD e ECF - Obrigações do SPED Contábil e Fiscal

> **Legislação Base:** Instrução Normativa RFB nº 2.003/2021 (ECD), Instrução Normativa RFB nº 2.004/2021 (ECF) e Manual de Orientação do Leiaute SPED.
>
> **Fontes oficiais (conferidas em 21/10/2026):**
> - [Serviço "Entregar ECD" (gov.br)](https://www.gov.br/pt-br/servicos/entregar-escrituracao-contabil-digital)
> - [Serviço "Entregar ECF" (gov.br)](https://www.gov.br/pt-br/servicos/entregar-escrituracao-contabil-fiscal)
> - Textos das IN: [IN RFB 2.003/2021](https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=114965&visao=anotado) e [IN RFB 2.004/2021](https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=114966) (a página não exibiu o texto na leitura automática; **não conferi os artigos**).
>
> **O que foi conferido:** apenas o que as páginas de serviço do gov.br dizem sobre prazo e quem entrega (resumido abaixo).
> **Não conferido nesta revisão:** a lista completa de obrigados e dispensados (itens 1.A e 2.A), as regras de assinatura digital, multas por atraso, prorrogações, blocos e cruzamentos da seção 3. Tudo isso é a versão anterior, mantida como referência. **Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a IN RFB 2.003/2021 (ECD) ou 2.004/2021 (ECF).**
>
> **ATENÇÃO, prazo da ECD:** o serviço do gov.br informa **último dia útil de JUNHO** do ano seguinte; a versão anterior deste documento dizia **maio**. Prevalece a fonte oficial lida (junho), mas **preciso confirmar** no art. da IN 2.003/2021 e em eventuais prorrogações do ano.
>
> **Prazo da ECF (gov.br):** último dia útil de **julho** do ano seguinte ao ano-calendário. A ECF é entregue **de forma centralizada pela matriz**.

---

## 1. ECD (Escrituração Contábil Digital - SPED Contábil)

A ECD substitui a emissão e encadernação em papel dos livros contábeis tradicionais perante as Juntas Comerciais e Cartórios de Registro Civil de Pessoas Jurídicas.

### A. Quem está Obrigado a Entregar:
1. Pessoas jurídicas sujeitas à tributação do Imposto de Renda com base no **Lucro Real**;
2. Pessoas jurídicas tributadas com base no **Lucro Presumido** que distribuírem lucros isentos em valor superior à presunção legal sem retenção do IRRF;
3. Pessoas jurídicas Imunes e Isentas que auferirem receitas ou doações em valor superior aos limites fixados pela RFB;
4. Sociedades em Conta de Participação (SCP) como livros próprios vinculados à sócia ostensiva.
- *Empresas do Simples Nacional:* Desobrigadas da ECD perante a Receita Federal, salvo se necessitarem para comprovação de distribuição de lucros isentos ou licitações públicas.

### B. Prazo de Transmissão:
- **Regra Geral (gov.br):** até o **último dia útil do mês de junho** do ano seguinte ao da escrituração (a versão anterior dizia maio; **preciso confirmar** na IN RFB 2.003/2021). Prorrogações extraordinárias são publicadas pela RFB e devem ser consultadas a cada ano.
- **Assinatura Digital Obrigatória:** Exige dois certificados digitais modelo e-PJ ou e-CPF:
  1. Certificado digital do **Contabilista / Responsável Técnico** (com procuração ou CRC ativo);
  2. Certificado digital do **Representante Legal da Empresa** (e-PJ ou e-CPF do procurador).

---

## 2. ECF (Escrituração Contábil Fiscal)

A ECF é a obrigação acessória mais complexa do ecossistema SPED, substituindo a antiga DIPJ (Declaração de Informações Econômico-Fiscais da Pessoa Jurídica). Ela interliga os saldos contábeis recuperados da ECD com a memória de cálculo do IRPJ e da CSLL.

### A. Quem está Obrigado:
- Todas as pessoas jurídicas instaladas no Brasil (imunes, isentas, Lucro Real, Lucro Presumido e Lucro Arbitrado).
- **Dispensadas:** Pessoas jurídicas optantes pelo Simples Nacional, órgãos públicos, autarquias e fundações públicas, e pessoas jurídicas inativas.

### B. Prazo de Transmissão:
- **Regra Geral:** Até o **último dia útil do mês de julho** do ano-calendário subsequente ao ano da escrituração.

### C. Estrutura dos Principais Blocos da ECF:
- **Bloco 0:** Abertura, identificação e parâmetros de tributação (forma de apuração, dados cadastrais).
- **Bloco C:** Recuperação de dados da ECD do mesmo período (importação automática do Balanço e DRE).
- **Bloco E:** Recuperação de dados da ECF anterior e cálculo fiscal.
- **Bloco J:** Plano de Contas e Mapeamento para o Plano de Contas Referencial.
- **Bloco K:** Saldos das Contas Contábeis e Referenciais.
- **Bloco L:** Balanço Patrimonial e DRE do Lucro Real.
- **Bloco M:** e-LALUR (Livro de Apuração do Lucro Real) e e-LACS (Livro de Apuração da CSLL): adições, exclusões e compensações de prejuízos fiscais.
- **Bloco P:** Apuração do IRPJ e CSLL das empresas do **Lucro Presumido** (receitas trimestrais, presunções, retenções e cálculo do adicional de 10%).
- **Bloco X:** Informações econômicas (operações no exterior, sócios, rendimentos de dirigentes).
- **Bloco Y:** Informações gerais (discriminação de receitas, doações, royalties, incentivos fiscais).

---

## 3. Riscos de Inconsistências e Cruzamentos da RFB

A malha fina corporativa da Receita Federal processa automaticamente os cruzamentos entre:
1. **ECD $\\leftrightarrow$ ECF:** Divergências entre o saldo final das contas de resultado e o DRE da ECF geram notificação imediata.
2. **ECF $\\leftrightarrow$ DCTFWeb / EFD-Contribuições:** Diferenças entre o faturamento declarado na ECF e as bases de cálculo de PIS/COFINS e CPRB.
3. **ECF $\\leftrightarrow$ DIMOF / e-Financeira:** Confronto entre o volume financeiro movimentado em contas bancárias e a receita bruta operacional escriturada.`
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
    lastUpdated: '2026-10-21',
    officialLink: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    officialLinkLabel: 'CLT - Presidência da República / Planalto',
    content: `# Legislação Trabalhista Integral — CLT e Leis Conexas do Planalto

> **Status de conferência (21/10/2026):** este é um resumo anterior, **não reconferido artigo por artigo** em fonte oficial. Em caso de divergência, **prevalecem os documentos marcados como conferidos** (ids: clt-principios, fgts-inss, eSocial-prazos). Pontos específicos abaixo marcados com "preciso confirmar" devem ser confirmados antes de afirmar. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.
> **Observações:** Pontos duvidosos: o adicional de **100%** em domingos e feriados **não foi confirmado** em lei (preciso confirmar); a multa do art. 477, § 8º, o banco de horas coletivo de até 1 ano, o art. 488 e as regras de abono e pagamento de férias **não foram reconferidos**. Já foram conferidos no Planalto (Lei 13.467/2017): art. 477, § 6º (dez dias), art. 59, §§ 5º e 6º, art. 134 (três períodos, um com 14 dias) e a Lei 12.506/2011 (aviso prévio).

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
    lastUpdated: '2026-10-21',
    officialLink: 'https://www8.receita.fazenda.gov.br/SimplesNacional',
    officialLinkLabel: 'Portal do Simples Nacional (Receita Federal)',
    content: `# Simples Nacional — Lei Complementar nº 123/2006 Consolidada

> **Status de conferência (21/10/2026):** este é um resumo anterior, **não reconferido artigo por artigo** em fonte oficial. Em caso de divergência, **prevalecem os documentos marcados como conferidos** (ids: simples-nacional, mei-opcao-exclusao). Pontos específicos abaixo marcados com "preciso confirmar" devem ser confirmados antes de afirmar. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.
> **Observações:** Os limites de ME/EPP, o sublimite e a regra do excesso foram conferidos no documento "simples-nacional". **Fator R conferido** (21/10/2026) no texto compilado da LC 123/2006, art. 18, § 5º-J: atividades dos §§ 5º-I são tributadas pelo **Anexo III quando a razão entre a folha de salários e a receita bruta é igual ou superior a 28%**; abaixo disso, certas atividades vão para o **Anexo V** (§§ 5º-K e 5º-M tratam do cálculo, com os 12 meses anteriores). Fonte: [LC 123/2006 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm). **As tabelas numéricas dos Anexos I a V (faixas, alíquotas e parcelas a deduzir) NÃO foram conferidas**: as páginas oficiais dos anexos não abriram. **Preciso confirmar** na LC 123/2006 (anexos) e na Resolução CGSN 140/2018 antes de calcular qualquer DAS; não use os valores abaixo como definitivos.

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
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.esocial.gov.br',
    officialLinkLabel: 'Portal Oficial do eSocial (Governo Federal)',
    content: `# eSocial e FGTS Digital — Manual de Operação e Prazos Oficiais

> **Status de conferência (21/10/2026):** este é um resumo anterior, **não reconferido artigo por artigo** em fonte oficial. Em caso de divergência, **prevalecem os documentos marcados como conferidos** (ids: eSocial-prazos, fgts-inss). Pontos específicos abaixo marcados com "preciso confirmar" devem ser confirmados antes de afirmar. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.
> **Observações:** Pontos duvidosos: o prazo de S-2230 (dia 15) e de S-2210 (CAT) **não foram conferidos**; a "Lei nº 14.438/2022" **foi confirmada** pelo Ministério do Trabalho como a lei que fixou o vencimento mensal do FGTS no dia 20; a "Portaria Conjunta MTE/RFB nº 33/2023" **não foi confirmada**: preciso confirmar. Admissão (dia anterior) e desligamento (10 dias) conferem com o MOS S-1.3.

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
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.cfc.org.br',
    officialLinkLabel: 'Conselho Federal de Contabilidade (CFC)',
    content: `# Normas Brasileiras de Contabilidade (CFC) e Legislação Societária

> **Status de conferência (21/10/2026):** este é um resumo anterior, **não reconferido artigo por artigo** em fonte oficial. Em caso de divergência, **prevalecem os documentos marcados como conferidos** (ids: livros-obrigacoes). Pontos específicos abaixo marcados com "preciso confirmar" devem ser confirmados antes de afirmar. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.
> **Observações:** Os artigos 1.179 a 1.195 do Código Civil **não foram reconferidos** (o Planalto cortou a página). A afirmação de que o Livro Caixa é "facultativo e simplificado para optantes do Simples" **não foi confirmada**: preciso confirmar.

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
    title: 'Reforma Tributária: EC 132/2023, LC 214/2025 e LC 227/2026',
    summary: 'Novo sistema tributário brasileiro sobre o consumo: IVA Dual com CBS (Federal) e IBS (Estados e Municípios), Imposto Seletivo, Split Payment, extinção de PIS, COFINS, IPI, ICMS e ISS e cronograma 2026-2033.',
    tags: ['Reforma Tributária', 'EC 132/2023', 'LC 214/2025', 'LC 227/2026', 'IBS', 'CBS', 'Split Payment', 'IVA Dual', 'Congresso Nacional'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm',
    officialLinkLabel: 'Portal da Reforma Tributária (Câmara e Senado)',
    content: `# Reforma Tributária do Consumo — EC nº 132/2023 e Leis Complementares

> **Status de conferência (21/10/2026):** este é um resumo anterior, **não reconferido artigo por artigo** em fonte oficial. Em caso de divergência, **prevalecem os documentos marcados como conferidos** (ids: reforma-tributaria). Pontos específicos abaixo marcados com "preciso confirmar" devem ser confirmados antes de afirmar. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.
> **Observações:** O conteúdo sobre IBS, CBS, IS e split payment é descritivo e **não teve cada artigo da LC 214/2025 reconferido**; datas de transição devem ser lidas no documento "reforma-tributaria", que tem a revisão de 20/10/2026.

> **Fonte Oficial Governamental:** Congresso Nacional (Câmara dos Deputados e Senado Federal).
> **Legislação Base:** Emenda Constitucional nº 132/2023; Lei Complementar nº 214, de 16/1/2025 (institui IBS, CBS e IS — originada do PLP 68/2024); Lei Complementar nº 227, de 13/1/2026 (originada do PLP 108/2024; cria o Comitê Gestor do IBS). **Conferida em 20/10/2026.**
> **Texto oficial:** https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm
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

## 3. Cronograma de Transição (2026 a 2033)
- **2026 — Testes:** notas fiscais com campos de CBS e IBS; fase de testes, sem cobrança efetiva dos novos tributos (alíquotas de teste 0,9% CBS e 0,1% IBS, LC 214/2025).
- **2027:** início da cobrança da CBS (substitui PIS, Cofins e IPI) e do Imposto Seletivo.
- **A partir de 2029:** transição do IBS, substituindo gradualmente ICMS e ISS (percentuais anuais: LC 214/2025, arts. 361 a 366 e 369).
- **2033:** extinção total de ICMS e ISS.

Fonte: [Agência Câmara, 06/01/2026](https://www.camara.leg.br/noticias/1237089-reforma-tributaria-comeca-fase-de-transicao-com-testes-de-novos-impostos-em-2026/) e [LC 214/2025](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm).

> Pontos **não confirmados** nesta revisão: compensação do teste de 2026 com PIS/Cofins, tratamento do IPI após 2027 e percentuais anuais de 2029–2032. Diante de pergunta sobre esses pontos, cite o artigo da LC 214/2025 e indique o link oficial.`
  },
  {
    id: 'tributos-icms-ipi-iss',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/tributos-icms-ipi-iss.md',
    title: 'ICMS, IPI, ISS, PIS/COFINS e Tributos Federais (Receita Federal & SEFAZ GO)',
    summary: 'Regulamento do ICMS (LC 87/96 Lei Kandir, LC 190/22 DIFAL e SEFAZ GO RCTE Lei 11.651/91), IPI (Decreto 7.212/10), ISS municipal (LC 116/03), PIS/COFINS cumulativo/não-cumulativo e IRPJ/CSLL no Lucro Presumido e Real.',
    tags: ['ICMS', 'IPI', 'ISS', 'SEFAZ GO', 'Receita Federal', 'DIFAL', 'Lucro Presumido', 'PIS/COFINS'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.receita.fazenda.gov.br',
    officialLinkLabel: 'Receita Federal & SEFAZ Goiás',
    content: `# Tributos Indiretos e Federais — ICMS, IPI, ISS e Lucro Presumido

> **Status de conferência (21/10/2026):** este é um resumo anterior, **não reconferido artigo por artigo** em fonte oficial. Em caso de divergência, **prevalecem os documentos marcados como conferidos** (ids: iss-ipi, multas-juros-tributos-federais). Pontos específicos abaixo marcados com "preciso confirmar" devem ser confirmados antes de afirmar. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.
> **Observações:** A **alíquota modal de 19% do ICMS em Goiás** **não foi confirmada**: a Lei estadual 19.925/2017 não fixa 17% nem 19%. Preciso confirmar na Lei 11.651/1991, art. 27 (SEFAZ-GO). As alíquotas interestaduais (4%, 7% e 12%) foram conferidas no portal DIFAL; a LC 87/1996 está no documento "icms-regras". ISS (LC 116) e IPI (Tipi, Decreto 11.158/2022) estão conferidos no documento "iss-ipi".

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
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.planalto.gov.br/legislacao',
    officialLinkLabel: 'Presidência da República / DREI',
    content: `# Legislação Societária, Empresarial e Jurídica na Contabilidade

> **Status de conferência (21/10/2026):** este é um resumo anterior, **não reconferido artigo por artigo** em fonte oficial. Em caso de divergência, **prevalecem os documentos marcados como conferidos** (ids: sumulas-temas-stf-stj). Pontos específicos abaixo marcados com "preciso confirmar" devem ser confirmados antes de afirmar. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.
> **Observações:** **Conferido (Câmara dos Deputados, 21/10/2026):** CTN art. 135 (responsabilidade pessoal por excesso de poderes ou infração de lei, contrato social ou estatuto), art. 142 (lançamento é competência privativa da autoridade administrativa; atividade vinculada e obrigatória) e art. 150, § 4º (se a lei não fixar prazo, a homologação ocorre em 5 anos da ocorrência do fato gerador, salvo dolo, fraude ou simulação). **Atenção:** a ficha da norma na Câmara informa que os arts. 156, 168 e 174 do CTN foram alterados pela LC 236/2026 (e o 174 também pela LC 208/2024), então **não use de memória a prescrição ou o prazo desses artigos**. **Não conferidos:** o texto dos arts. 173, 174 e 195 do CTN, os artigos do Código Civil e as Súmulas 430 e 435 do STJ: preciso confirmar. A Lei 13.874/2019 e a IN DREI 81/2020 também **não foram conferidas**.

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
  },
  {
    id: 'sumulas-temas-stf-stj',
    category: 'contabil',
    categoryLabel: 'Contábil',
    filePath: 'contabil/sumulas-temas-stf-stj.md',
    title: 'Teses do STF e do STJ: ICMS na base de PIS/Cofins, FGTS e insumos',
    summary: 'Tema 69 do STF (ICMS fora da base de PIS/Cofins, marco 15/03/2017), Tema 608 do STF (FGTS prescreve em 5 anos) e Tema 779 do STJ (insumo: essencialidade ou relevância), com fonte oficial e pontos a confirmar.',
    tags: ['STF', 'STJ', 'Tema 69', 'Tema 608', 'Tema 779', 'Jurisprudência'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=2585258&numeroProcesso=574706&classeProcesso=RE&numeroTema=69',
    officialLinkLabel: 'STF - Tema 69',
    content: `# Teses do STF e do STJ de Interesse Fiscal, Contábil e Trabalhista

> **Fontes oficiais (conferidas em 21/10/2026):**
> - [STF, Tema 69 de repercussão geral (RE 574.706)](https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=2585258&numeroProcesso=574706&classeProcesso=RE&numeroTema=69) e [notícia do STF de 23/10/2023](https://noticias.stf.jus.br/postsnoticias/stf-define-alcance-de-decisao-sobre-exclusao-do-icms-da-base-de-calculo-de-pis-cofins/)
> - [STF, Tema 608 (ARE 709.212)](https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=4294417&numeroProcesso=709212&classeProcesso=ARE&numeroTema=608) e [notícia do STF de 16/03/2017](https://noticias.stf.jus.br/postsnoticias/plenario-conclui-julgamento-sobre-prazo-prescricional-para-cobranca-de-valores-de-fgts/)
> - [STJ, notícia de 10/05/2018 sobre o conceito de insumo (REsp 1.221.170, Tema 779)](https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias-antigas/2018/2018-05-10_06-51_Primeira-Secao-define-conceito-de-insumo-para-creditamento-de-PIS-e-Cofins.aspx)
>
> **Limite desta revisão:** foram conferidas somente as três teses abaixo, e apenas pelas notícias oficiais dos tribunais. **O texto formal de cada tese (redação do acórdão) não foi lido**: consulte os links de andamento do tema. Súmulas do TST, súmulas do STJ e a Súmula Vinculante 24 já citadas em outros documentos desta base **não foram reconferidas**. **Diante de qualquer dúvida, o agente deve dizer "preciso confirmar".**

---

## 1. STF, Tema 69: ICMS na base do PIS e da Cofins (RE 574.706)
- O STF decidiu que o **ICMS não integra a base de cálculo do PIS e da Cofins**.
- **Modulação:** o marco é **15/03/2017** (data do julgamento do mérito). Em 2021, o STF acolheu em parte embargos e limitou os efeitos da decisão a essa data. Segundo a notícia do STF de 23/10/2023, a tese do Tema 1.279 (RE 1.452.421) repete o marco: não cabe restituição ou compensação de fato gerador anterior a 15/03/2017, salvo ação judicial ou procedimento administrativo ajuizado até essa data.
- **Preciso confirmar:** se o ICMS excluído é o **destacado** na nota ou o **pago**. A notícia lida não trata dessa distinção; veja o acórdão de embargos antes de afirmar. Também **preciso confirmar** a redação exata do Tema 1.279.

## 2. STF, Tema 608: prescrição do FGTS (ARE 709.212)
- Em novembro de 2014, o Plenário alterou de **30 para 5 anos** o prazo de prescrição para a cobrança de valores de FGTS não depositados (notícia do STF de 16/03/2017).
- A notícia lida **não menciona modulação**. **Preciso confirmar** a regra de transição (fatos anteriores a 13/11/2014) no acórdão antes de afirmar.
- Esse tema trata de **prescrição da cobrança**, e não de prazo de guarda de documentos.

## 3. STJ, Tema 779: conceito de insumo para créditos de PIS/Cofins (REsp 1.221.170)
- A Primeira Seção fixou que o conceito de insumo se analisa pelos critérios de **essencialidade ou relevância**, considerando a imprescindibilidade ou a importância do bem ou serviço para a atividade econômica do contribuinte (notícia do STJ de 10/05/2018; acórdão de 24/04/2018).
- **Preciso confirmar:** a redação formal da tese, como a Receita aplica o conceito (parecer normativo) e a aplicação a cada despesa concreta.

---

## 4. Como o agente deve usar este documento
1. Citar o número do tema e o link oficial.
2. Dizer que a leitura foi da notícia oficial e que a redação do acórdão deve ser conferida.
3. Para outras súmulas ou temas não listados aqui, responder "preciso confirmar" e indicar a busca no portal do STF, do STJ ou do TST.`
  },
  {
    id: 'multas-juros-tributos-federais',
    category: 'fiscal',
    categoryLabel: 'Fiscal / Tributário',
    filePath: 'fiscal/multas-juros-tributos-federais.md',
    title: 'Multas e Juros sobre Tributos Federais (mora, Selic e multa de ofício)',
    summary: 'Multa de mora de 0,33% ao dia limitada a 20%, juros Selic, multa de ofício de 75% e multa qualificada de 100% (150% só na reincidência) após a Lei 14.689/2023, com fontes oficiais e pontos a confirmar.',
    tags: ['Multa de mora', 'Selic', 'Multa de ofício', 'Lei 9.430', 'Lei 14.689'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14689.htm',
    officialLinkLabel: 'Lei 14.689/2023 - Planalto',
    content: `# Multas e Juros sobre Tributos Federais em Atraso ou Lançados de Ofício

> **Fontes oficiais (conferidas em 21/10/2026):**
> - [Receita Federal, ECF Perguntas e Respostas PJ 2021, capítulo XVIII Acréscimos Legais (arquivo atualizado até 31/12/2020)](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/ecf/perguntas-e-respostas-pessoa-juridica-2021-arquivos/capitulo-xviii-acrescimos-legais-2021.pdf)
> - [Lei 14.689/2023, art. 8º, que alterou o art. 44 da Lei 9.430/1996 (Planalto)](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14689.htm)
> - [Lei 9.430/1996 (Planalto)](https://www.planalto.gov.br/ccivil_03/leis/l9430.htm) (a página cortou antes dos arts. 44 e 61, por isso não foram lidos diretamente)
> **Não conferido nesta revisão:** o texto atual dos arts. 44 (incisos e §§ 1º-B e seguintes) e 61 da Lei 9.430 no Planalto; as reduções de multa vigentes hoje; regras do Simples Nacional, de tributos municipais e estaduais e de contribuições previdenciárias. **Diante de dúvida, o agente deve dizer "preciso confirmar".**

## 1. Multa de mora (pagamento espontâneo em atraso)
- **0,33% por dia de atraso, limitada a 20%**, contada do dia seguinte ao vencimento até o dia do pagamento (Lei 9.430/1996, arts. 47 e 61; fonte: Receita Federal).
- Não incide quando o tributo é lançado de ofício (a multa de ofício a substitui). Pagamento até o 20º dia após receber o termo de início de fiscalização ainda é espontâneo, segundo a Receita.

## 2. Juros de mora pela Selic
- Sobre o valor do débito, **sem a multa de mora**: Selic acumulada de cada mês, desde o 1º dia do mês seguinte ao vencimento até o mês anterior ao pagamento, **mais 1% no mês do pagamento** (Lei 9.430/1996, art. 61, § 3º, e art. 5º do DL 1.736/1979, segundo a Receita).
- Os juros continuam correndo mesmo com a cobrança suspensa; depósito integral afasta os juros.

## 3. Multa de ofício (lançamento pela fiscalização)
- **75%** sobre o tributo não pago, não declarado ou declarado com inexatidão (art. 44, I, da Lei 9.430; fonte da Receita, arquivo de 2021).
- **Multa qualificada (sonegação, fraude ou conluio, arts. 71 a 73 da Lei 4.502/1964): 100%** após a **Lei 14.689/2023**; **150% apenas em caso de reincidência**, isto é, nova infração no prazo de 2 anos. A qualificação **não se aplica** se a conduta dolosa não for individualizada e comprovada ou se houver sentença penal de absolvição com apreciação de mérito (texto da Lei 14.689 lido no Planalto).
- **ATENÇÃO:** a documentação da Receita lida (arquivo de 2021) ainda fala em 150%. Prevalece a lei mais nova (Lei 14.689/2023), mas **preciso confirmar** a aplicação a fatos geradores anteriores à vigência da lei.
- **Reduções por pagamento ou parcelamento após a notificação** (50%, 40%, 30% e 20% da multa, conforme prazo e fase, segundo a Receita em 2021): **preciso confirmar** no art. 6º da Lei 8.218/1991 vigente.
- **Majoração de 50%** por não atender intimação ou não entregar arquivos digitais (art. 44, § 2º, segundo a Receita em 2021): **preciso confirmar** a redação atual.`
  },
  {
    id: 'irrf-salario-familia-2026',
    category: 'dp-trabalhista',
    categoryLabel: 'DP / Trabalhista',
    filePath: 'dp-trabalhista/irrf-salario-familia-2026.md',
    title: 'Valores de 2026 para a Folha: IRRF, redução da Lei 15.270, salário-família e FGTS Digital',
    summary: 'Tabela mensal do IRRF 2026 (Lei 15.191), redução até R$ 5.000 e R$ 7.350 (Lei 15.270), dedução por dependente, salário-família R$ 67,54, teto do INSS e prazos do FGTS Digital (dia 20 e dez dias), com fonte oficial.',
    tags: ['IRRF 2026', 'Lei 15.270', 'Salário-família', 'FGTS Digital', 'Folha de pagamento'],
    lastUpdated: '2026-10-21',
    officialLink: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026',
    officialLinkLabel: 'Receita Federal - Tabelas 2026',
    content: `# Valores de 2026 para a Folha: IRRF, Salário-Família, Salário Mínimo e FGTS

> **Fontes oficiais (conferidas em 21/10/2026):**
> - [Receita Federal, tabelas de tributação de 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026) (página publicada em 12/09/2025 e atualizada em 27/04/2026): Lei 15.191/2025 e Lei 15.270/2025
> - [INSS, tabela de contribuição mensal](https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal) (Portaria Interministerial MPS/MF nº 13, de 09/01/2026)
> - [INSS, valor limite do salário-família](https://www.gov.br/inss/pt-br/direitos-e-deveres/salario-familia/valor-limite-para-direito-ao-salario-familia)
> - [Ministério do Trabalho, FGTS Digital: verbas mensais e rescisórias e prazo de recolhimento](https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/comunicados/do-enquadramento-das-verbas-remuneratorias-em-tipo-mensal-e-tipo-rescisorio-prazo-de-recolhimento)
> - [Manual de Orientação do FGTS Digital, versão 1.60 (05/05/2026)](https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/manual-e-documentacao-tecnica/manual-de-orientacao-do-fgts-digital-versao-1-60-05-05-2026.pdf)
> **Não conferido nesta revisão:** a ordem exata do cálculo do IRRF mensal (base, INSS, dependentes, desconto simplificado e redução da Lei 15.270), o IRRF sobre 13º, férias, PLR e rendimentos acima de R$ 50 mil, e o Decreto que fixa o salário mínimo. **Diante de dúvida, o agente deve dizer "preciso confirmar".**

## 1. Tabela mensal do IRRF a partir de janeiro de 2026 (Lei 15.191/2025)
| Base de cálculo mensal | Alíquota | Parcela a deduzir |
| :--- | :--- | :--- |
| Até R$ 2.428,80 | isento | - |
| De R$ 2.428,81 até R$ 2.826,65 | 7,5% | R$ 182,16 |
| De R$ 2.826,66 até R$ 3.751,05 | 15,0% | R$ 394,16 |
| De R$ 3.751,06 até R$ 4.664,68 | 22,5% | R$ 675,49 |
| Acima de R$ 4.664,68 | 27,5% | R$ 908,73 |

- **Dedução mensal por dependente:** R$ 189,59.
- **Desconto simplificado (limite mensal):** R$ 607,20.
- **Rendimentos previdenciários isentos para maiores de 65 anos:** R$ 1.903,98 (parcela isenta).

## 2. Redução mensal do imposto (Lei 15.270/2025), vigente desde janeiro de 2026
| Rendimentos tributáveis mensais | Redução do imposto |
| :--- | :--- |
| Até R$ 5.000,00 | Até R$ 312,89, de modo que o imposto devido seja **zero** |
| De R$ 5.000,01 até R$ 7.350,00 | R$ 978,62 menos (0,133145 x rendimentos tributáveis do mês) |
| A partir de R$ 7.350,00 | sem redução (a redução diminui linearmente até zero) |

- A tabela **anual** (exercício 2027, ano-calendário 2026) não se aplica à retenção mensal.
- **Preciso confirmar:** a página lida não detalha a ordem do cálculo (por exemplo, se a redução incide sobre o imposto calculado pela tabela progressiva após as deduções). Use o exemplo oficial da Receita antes de implementar.

## 3. Salário mínimo, teto e salário-família (2026)
- **Salário mínimo:** R$ 1.621,00. A página do INSS usa R$ 1.621,00 como piso de contribuição e R$ 324,20 (20% desse valor) como mínimo do plano de 20%. O decreto que fixa o valor não foi aberto aqui, mas o documento do MEI desta base cita o Decreto 12.797/2025.
- **Teto do salário de contribuição:** R$ 8.475,55 (reajuste de 3,9%, segundo o INSS).
- **Salário-família:** cota de **R$ 67,54** por dependente para quem tem remuneração mensal de até **R$ 1.980,38** (Portaria Interministerial MPS/MF nº 13/2026). Acima do limite, não há direito.

## 4. FGTS Digital: alíquotas e prazos (Ministério do Trabalho)
- **FGTS mensal:** vence até o **dia 20 do mês seguinte** ao da remuneração (alterado pela Lei 14.438/2022), a partir do início da arrecadação pelo FGTS Digital. Antes disso o vencimento era dia 7.
- **FGTS rescisório:** vence em **até dez dias** do término do contrato (Lei 8.036/1990, art. 18, § 3º, combinado com o art. 477, § 6º, da CLT). Se esse dia não for útil, o manual diz que o prazo vai para o **dia útil anterior**.
- **O que é cada tipo:** mensal são as verbas devidas mensalmente (salário, 1ª e 2ª parcelas do 13º); rescisório são as verbas devidas em razão da rescisão pelo empregador (saldo de salário, aviso prévio, 13º). **Pedido de demissão:** todas as verbas, inclusive as da rescisão, são do tipo mensal, vencendo no dia 20 do mês seguinte.
- **Alíquotas (manual, item 5.1.4):** **8%** para a maioria das categorias; **2%** para aprendiz e contratos Verde e Amarelo (códigos 103, 107 e 108).
- **Base legal conferida (Lei 8.036/1990, [texto atualizado na Câmara](https://www2.camara.leg.br/legin/fed/lei/1990/lei-8036-11-maio-1990-365155-normaatualizada-pl.pdf)):** art. 15 (8% até o dia 20; § 7º aprendiz 2%); **art. 18, § 1º: multa de 40% do montante de todos os depósitos** na despedida sem justa causa. O percentual de **20%** (acordo do art. 484-A da CLT) **preciso confirmar** na CLT.
- **Encargos por atraso (Lei 8.036, art. 22):** TR sobre o valor, juros de mora de 0,5% ao mês ou fração e multa; o percentual da multa e a forma de cálculo no FGTS Digital **preciso confirmar**.
- **Guia:** desde março de 2024 o empregador usa o FGTS Digital para gerar a guia (GFD).`
  }
];
