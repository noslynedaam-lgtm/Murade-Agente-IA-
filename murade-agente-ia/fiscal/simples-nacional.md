# Simples Nacional - Guia Operacional e Técnico

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

$$\text{Fator R} = \frac{\text{Folha de Salários dos últimos 12 meses (incluindo Pró-Labore + Encargos)}}{\text{Receita Bruta dos últimos 12 meses (RBT12)}}$$

- **Se Fator R $\ge 0,28$ (28%):** Tributa no **Anexo III** (Economia tributária substancial).
- **Se Fator R $< 0,28$ (28%):** Tributa no **Anexo V**.

> **Dica Murade:** Empresas que faturam sem funcionários formais frequentemente ajustam o valor do Pró-Labore dos sócios para atingir exatamente 28% da receita bruta mensal estimada, otimizando legalmente a carga tributária global mesmo com o recolhimento de INSS e IRRF pessoa física.

---

## 4. Fórmula do Cálculo da Alíquota Efetiva

A alíquota aplicada sobre o faturamento do mês não é a nominal, mas sim a alíquota efetiva calculada conforme fórmula do PGDAS-D:

$$\text{Alíquota Efetiva} = \frac{(\text{RBT12} \times \text{Alíquota Nominal}) - \text{Parcela a Deduzir}}{\text{RBT12}}$$

Em seguida, aplicam-se os percentuais de repartição dos tributos (IRPJ, CSLL, PIS, COFINS, CPP, ICMS/ISS) conforme tabelas da LC 123/2006.

---

## 5. Prazos e Obrigações Acessórias

1. **Vencimento do DAS:** Dia 20 do mês subsequente ao de competência (se cair em dia não útil, prorroga-se para o primeiro dia útil seguinte).
2. **PGDAS-D:** Declaração mensal obrigatória transmitida até o vencimento do DAS, mesmo sem faturamento (declaração zerada).
3. **DEFIS (Declaração de Informações Socioeconômicas e Fiscais):** Entrega anual até 31 de março do ano-calendário subsequente.
4. **Segregação de Receitas com Substituição Tributária (ST) e Monofásicos:**
   - Produtos sujeitos a PIS/COFINS monofásico (autopeças, farmácia, cosméticos, bebidas) ou ICMS-ST devem ser segregados no PGDAS-D para não pagar esses tributos em duplicidade.
