# ICMS - Regras Fundamentais, DIFAL e Substituição Tributária

> **Status de conferência (21/10/2026):** Nada deste documento foi reconferido em fonte oficial (LC 87/1996, EC 87/2015, LC 190/2022, Convênios do CONFAZ). Fórmulas de DIFAL, MVA e base dupla: **preciso confirmar** na legislação do estado de destino. Diante de dúvida, o agente deve dizer "preciso confirmar" e indicar a fonte oficial.

> **Legislação Base:** Lei Complementar nº 87/1996 (Lei Kandir), Emenda Constitucional nº 87/2015, Lei Complementar nº 190/2022 e Convênios ICMS / CONFAZ.

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

$$\text{DIFAL} = \text{Alíquota Interna do Estado de Destino} - \text{Alíquota Interestadual da Operação}$$

### Cenários de Aplicação:
1. **Consumidor Final Não Contribuinte (E-commerce / Venda Não Presencial):**
   - Regulamentado pela **LC 190/2022**.
   - O remetente é o responsável pelo cálculo e recolhimento do DIFAL integralmente em favor do Estado de destino da mercadoria (via GNRE ou DARE antes da saída da mercadoria, ou por inscrição estadual de substituto tributário).
2. **Consumidor Final Contribuinte (Uso, Consumo ou Ativo Imobilizado):**
   - O destinatário da mercadoria apura e recolhe o DIFAL na entrada no seu estado.
   - Há estados que utilizam a fórmula com **base dupla** (ex.: SP, MG, PR), recalculando o valor da mercadoria sem o ICMS de origem antes de aplicar a alíquota interna.

---

## 4. Substituição Tributária (ICMS-ST)

Na Substituição Tributária, a responsabilidade pelo recolhimento do ICMS de toda a cadeia subsequente (fabricante $\to$ distribuidor $\to$ varejista $\to$ consumidor final) é atribuída a um único contribuinte (o **Substituto Tributário**, usualmente o fabricante ou importador).

### Cálculo com MVA (Margem de Valor Agregado):
1. $\text{Base de Cálculo da Operação Própria} = \text{Valor da Mercadoria} + \text{Frete} + \text{Seguro} + \text{Outras Despesas}$
2. $\text{ICMS Próprio} = \text{Base Própria} \times \text{Alíquota Interestadual ou Interna}$
3. $\text{Base de Cálculo do ICMS-ST} = (\text{Base Própria} + \text{IPI}) \times (1 + \text{MVA Ajustada})$
4. $\text{ICMS-ST Devido} = (\text{Base de Cálculo do ICMS-ST} \times \text{Alíquota Interna Destino}) - \text{ICMS Próprio}$

> **Atenção:** Em compras interestaduais, caso a alíquota interna de destino seja superior à interestadual, deve-se calcular a **MVA Ajustada** conforme fórmula do CONFAZ para neutralizar a disparidade de alíquotas.
