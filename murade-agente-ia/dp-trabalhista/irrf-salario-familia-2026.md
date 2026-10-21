# Valores de 2026 para a Folha: IRRF, Salário-Família, Salário Mínimo e FGTS

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
- **Guia:** desde março de 2024 o empregador usa o FGTS Digital para gerar a guia (GFD).
