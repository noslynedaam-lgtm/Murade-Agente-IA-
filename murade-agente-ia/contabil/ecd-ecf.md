# ECD e ECF - Obrigações do SPED Contábil e Fiscal

> **Legislação Base:** Instrução Normativa RFB nº 2.003/2021 (ECD), Instrução Normativa RFB nº 2.004/2021 (ECF) e Manual de Orientação do Leiaute SPED.

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
- **Regra Geral:** Até o **último dia útil do mês de maio** do ano-calendário subsequente ao da escrituração (salvo prorrogações extraordinárias publicadas pela RFB).
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
1. **ECD $\leftrightarrow$ ECF:** Divergências entre o saldo final das contas de resultado e o DRE da ECF geram notificação imediata.
2. **ECF $\leftrightarrow$ DCTFWeb / EFD-Contribuições:** Diferenças entre o faturamento declarado na ECF e as bases de cálculo de PIS/COFINS e CPRB.
3. **ECF $\leftrightarrow$ DIMOF / e-Financeira:** Confronto entre o volume financeiro movimentado em contas bancárias e a receita bruta operacional escriturada.
