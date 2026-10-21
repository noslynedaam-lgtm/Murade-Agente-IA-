# Simples Nacional - Guia Operacional e Técnico

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

$$\text{Fator R} = \frac{\text{Folha de Salários dos últimos 12 meses (incluindo Pró-Labore + Encargos)}}{\text{Receita Bruta dos últimos 12 meses (RBT12)}}$$

- **Se Fator R $\ge 0,28$ (28%):** Tributa no **Anexo III** (Economia tributária substancial).
- **Se Fator R $< 0,28$ (28%):** Tributa no **Anexo V**.

> **Dica Murade:** Empresas que faturam sem funcionários formais frequentemente avaliam o valor do Pró-Labore dos sócios para atingir o Fator R de 28%; simule antes, pois o pró-labore também gera INSS e IRRF.

---

## 4. Fórmula do Cálculo da Alíquota Efetiva

A alíquota aplicada sobre o faturamento do mês não é a nominal, mas sim a alíquota efetiva calculada conforme fórmula do PGDAS-D:

$$\text{Alíquota Efetiva} = \frac{(\text{RBT12} \times \text{Alíquota Nominal}) - \text{Parcela a Deduzir}}{\text{RBT12}}$$

Em seguida, aplicam-se os percentuais de repartição dos tributos (IRPJ, CSLL, PIS, COFINS, CPP, ICMS/ISS) conforme tabelas da LC 123/2006.

---

## 5. Prazos e Obrigações Acessórias

1. **Vencimento do DAS:** Dia 20 do mês subsequente ao de competência (se cair em dia não útil, prorroga-se para o primeiro dia útil seguinte).
2. **PGDAS-D:** Declaração mensal obrigatória transmitida até o vencimento do DAS, mesmo sem faturamento (declaração zerada).
3. **DEFIS (Declaração de Informações Socioeconômicas e Fiscais):** Entrega anual até 31 de março do ano-calendário subsequente. **ATENÇÃO:** a Receita noticiou em 11/08/2026 que, segundo as Resoluções CGSN 190 e 191/2026, a Defis será substituída por informações no PGDAS-D entre janeiro e março, com efeitos em regra a partir de 2027. Veja "Novidades de 2026" e **preciso confirmar** a data de início.
4. **Segregação de Receitas com Substituição Tributária (ST) e Monofásicos:**
   - Produtos sujeitos a PIS/COFINS monofásico (autopeças, farmácia, cosméticos, bebidas) ou ICMS-ST devem ser segregados no PGDAS-D para não pagar esses tributos em duplicidade.
