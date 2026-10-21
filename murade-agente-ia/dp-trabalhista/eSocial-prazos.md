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
