# eSocial - Calendário Oficial, Prazos de Eventos e DCTFWeb

> **Legislação Base:** Portarias Conjuntas MTE/RFB, Manual de Orientação do eSocial (MOS) versão vigente e Instrução Normativa RFB nº 2.005/2021.

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
São os eventos disparados por atos pontuais da rotina trabalhista:

| Código | Descrição do Evento | Prazo Legal Improrrogável de Envio |
| :--- | :--- | :--- |
| **S-2190** | Registro Preliminar de Admissão | Até o final do dia imediatamente anterior ao início da prestação de serviços (usado quando faltam dados complementares). |
| **S-2200** | Cadastramento Inicial e Admissão de Trabalhador | Até o final do dia imediatamente anterior ao início do trabalho (ou até dia 15 do mês seguinte se enviado o S-2190). |
| **S-2205** | Alteração de Dados Cadastrais do Trabalhador | Até o dia 15 do mês subsequente à alteração cadastral informada. |
| **S-2206** | Alteração de Contrato de Trabalho (cargo, salário, jornada) | Até o dia 15 do mês subsequente à competência da alteração. |
| **S-2210** | Comunicação de Acidente de Trabalho (CAT) | Até o **primeiro dia útil seguinte** à ocorrência do acidente (ou imediatamente em caso de morte). |
| **S-2220** | Monitoramento da Saúde do Trabalhador (ASO admissional, periódico, demissional) | Até o **dia 15 do mês subsequente** à emissão do ASO (Atestado de Saúde Ocupacional). |
| **S-2230** | Afastamento Temporário (atestado médico > 3 dias, licença maternidade, auxílio por incapacidade temporária) | Até o dia 15 do mês seguinte (ou até o 16º dia para afastamento que gere encaminhamento ao INSS). |
| **S-2240** | Condições Ambientais do Trabalho - Agentes Nocivos (LTCAT / PPP Eletrônico) | Até o dia 15 do mês seguinte ao início da exposição a agentes químicos, físicos, biológicos ou periculosidade. |
| **S-2299** | Desligamento / Rescisão Contratual | Até **10 dias corridos** após o término do vínculo empregatício (sempre antes do envio do S-1200/fechamento da folha). |
| **S-2300** | Trabalhador Sem Vínculo de Emprego (Diretor Não Empregado, Estagiário, Autônomo) | Até o dia 15 do mês seguinte ao do início da prestação de serviços. |

### C. Eventos Periódicos (Folha de Pagamento Mensal)
- **S-1200:** Remuneração do Trabalhador vinculado ao Regime Geral de Previdência Social (proventos, descontos, horas extras, adicionais).
- **S-1210:** Pagamentos de Rendimentos do Trabalho (data de quitação financeira e regime de caixa do IRRF).
- **S-1299:** Fechamento dos Eventos Periódicos.
- **S-1298:** Reabertura de Eventos Periódicos.

> **Prazo Periódico:** O fechamento dos eventos periódicos (S-1299) deve ocorrer até o **dia 15 do mês seguinte** ao da competência (antecipando-se para o primeiro dia útil anterior se dia 15 cair em final de semana ou feriado).

---

## 2. A Integração com DCTFWeb e Fechamento Previdenciário

A transmissão do evento S-1299 no eSocial (juntamente com os eventos de retenção da EFD-Reinf - R-4000 e R-2000) gera automaticamente a declaração na **DCTFWeb**:
1. **DARF Previdenciário Unificado:** Substituiu em definitivo a antiga GPS.
2. **Vencimento do DARF Previdenciário:** Até o **dia 20 do mês subsequente** ao de competência (antecipa-se se coincidir com dia não útil).
3. **Cruzamento em Malha Fiscal:** Erros em rubricas do S-1010 ou divergência entre S-1200 e S-1210 bloqueiam a emissão da CND (Certidão Negativa de Débitos) e geram Autos de Infração automatizados pela Receita Federal.
