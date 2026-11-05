# Migração de dados do Alterdata para o Murade

> Documento interno de planejamento. Atualizado em 05/11/2026.

## Por quê

A maioria dos escritórios de contabilidade que são clientes (ou clientes em
potencial) do Murade hoje usa o Alterdata. Alguns têm 30, 50, até 100+
empresas cadastradas. Redigitar isso tudo na mão é inviável. O objetivo é
conseguir importar os dados diretamente de um backup `.bcir` do Alterdata
pros sistemas Murade (Fiscal, Departamento Pessoal, Contábil).

## O que já sabemos sobre o formato `.bcir`

- Não é um formato proprietário "misterioso": é um backup nativo do banco de
  dados da Alterdata (na prática, um dump do PostgreSQL — o caso mais comum
  — ou do SQL Server), compactado e com a extensão trocada para `.bcir` de
  propósito. A própria documentação da Alterdata confirma que isso existe
  **"para dificultar a localização destes arquivos"** por ransomware — ou
  seja, é ofuscação, não um container novo.
- Não existe ferramenta de linha de comando nem restauração silenciosa
  documentada publicamente para esses backups. A única forma confiável de
  abrir um é restaurar com a ferramenta nativa "Alterdata Backup" contra um
  PostgreSQL local.

## Estrutura do banco restaurado (confirmada em 04-05/11/2026)

Restauramos um backup real (`ALTERDATA_PACK`) em PostgreSQL 11 local e
inspecionamos via pgAdmin III. O banco tem 32 schemas. Os que interessam
pra migração, com o número de tabelas de cada um:

| Schema     | Módulo Alterdata equivalente | Tabelas |
|------------|-------------------------------|---------|
| `wfiscal`  | Fiscal                        | 1305    |
| `wdp`      | Departamento Pessoal           | 1485    |
| `wcont`    | Contábil                      | 538     |
| `wguias`   | Guias de impostos (DAS, DARF, GPS, GNRE, DARE por estado) | 52 |
| `wlalur`   | LALUR/LACS                    | 94      |
| `winss`    | (quase tudo migrou pra dentro de `wdp`; só sobrou `logevt`) | 1 |

Total: **3475 tabelas** nesses 6 schemas (lista completa salva, ver seção
"Fonte dos dados" abaixo).

### Correção importante (05/11/2026): `empresa`/`empdp`/`empcont` NÃO são o cadastro mestre

Inspecionamos as colunas reais de `wfiscal.empresa` (84 colunas), `wdp.empdp`
(195 colunas) e `wcont.empcont` (36 colunas) via `information_schema.columns`.
Nenhuma das três tem razão social, nome fantasia, CNPJ ou endereço — são
tabelas de **configuração/parâmetro por módulo**, chaveadas por
`cdempresa`/`idempresa` (livro fiscal, flags de regime tributário, dados de
FGTS/eSocial/GPS, parâmetros de cálculo, etc.), não o cadastro da empresa em
si.

**O cadastro mestre de verdade é `wphd.empresa`** (schema `wphd` — não estava
na lista dos 6 schemas iniciais, foi achado buscando por colunas tipo
`%fantasia%`/`%razao%`/`%cnpj%` em todos os ~32 schemas do banco). Tem 70
colunas — lista completa (05/11/2026):

| # | Coluna | Tipo | # | Coluna | Tipo |
|---|--------|------|---|--------|------|
| 1 | `cdempresa` | integer | 36 | `nmcidadebureau` | character varying |
| 2 | `nmempresa` | character varying | 37 | `nrcepbureau` | character varying |
| 3 | `nmfantasia` | character varying | 38 | `nrtelefonebureau1` | character varying |
| 4 | `dsatividade` | character varying | 39 | `nrtelefonebureau2` | character varying |
| 5 | `dsendereco` | character varying | 40 | `nrtelefonebureau3` | character varying |
| 6 | `nmbairro` | character varying | 41 | `nmemailbureau` | character varying |
| 7 | `nmcidade` | character varying | 42 | `stativa` | boolean |
| 8 | `nrcep` | character varying | 43 | `imglogotipoempresa` | bytea |
| 9 | `cduf` | character varying | 44 | `stformatologomarca` | character varying |
| 10 | `nrtelefone` | character varying | 45 | `cdnire` | character varying |
| 11 | `nrinscrmunicipal` | character varying | 46 | `st_dc` | boolean |
| 12 | `nrinscrestadual` | character varying | 47 | `nroab` | character varying |
| 13 | `nrregcartorio` | character varying | 48 | `dtiniservcont` | timestamp |
| 14 | `nrregjuntacomercial` | character varying | 49 | `dtfimservcont` | timestamp |
| 15 | `dtregjuntacomercial` | timestamp | 50 | `dtiniservinfo` | timestamp |
| 16 | `vlcapital` | double precision | 51 | `dtfimservinfo` | timestamp |
| 17 | `dtinicioatividade` | timestamp | 52 | `cdmunicipio` | character varying |
| 18 | `nrcgc` | character varying | 53 | `nrsuframa` | character varying |
| 19 | `dtfimatividade` | timestamp | 54 | `logindc` | character varying |
| 20 | `obs` | text | 55 | `idmunicipio` | integer |
| 21 | `lancautomatico` | boolean | 56 | `nmnomecompleto` | character varying |
| 22 | `centrocusto` | boolean | 57 | `nrfax` | character varying |
| 23 | `nmemail` | character varying | 58 | `dtconvempresa` | timestamp |
| 24 | `tpcalculoir` | character varying | 59 | `dtexpedicaonire` | timestamp |
| 25 | `cdnaturezajuridica` | character varying | 60 | `codigo_susep` | character varying |
| 26 | `cdcnae` | character varying | 61 | `bairro_completo` | character varying |
| 27 | `trabbureau` | boolean | 62 | `endereco_completo` | character varying |
| 28 | `nmbureau` | character varying | 63 | `escritorio_data_entrada` | date |
| 29 | `nmresponsavelbureau` | character varying | 64 | `escritorio_data_saida` | date |
| 30 | `nrcnpjcpfresponsavel` | character varying | 65 | `endereco_complemento` | character varying |
| 31 | `nrcrecicrc` | character varying | 66 | `tipo_porte_empresa` | smallint |
| 32 | `nrcpfresponsavel` | character varying | 67 | `nome_auditor` | character varying |
| 33 | `nmenderecobureau` | character varying | 68 | `codigo_cvm_auditor` | integer |
| 34 | `cdufbureau` | character varying | 69 | `dtnascimento` | timestamp |
| 35 | `nmbairrobureau` | character varying | 70 | `certificado_id` | integer |

**Conclusões da lista completa:**

- **CNPJ confirmado**: é a coluna `nrcgc` (#18) — "CGC" é o nome antigo do
  CNPJ, a Alterdata manteve o nome legado na coluna mas é o CNPJ mesmo.
- **Responsável/contador**: `nrcnpjcpfresponsavel` (#30), `nrcpfresponsavel`
  (#32) e `nrcrecicrc` (#31, registro CRC) — dados do contador/responsável
  técnico, não dos sócios da empresa.
- **Não tem sócios/quadro societário nesta tabela.** Não existe nenhuma
  coluna de sócio(s) em `wphd.empresa` — isso confirma que dados de sócios
  devem estar em uma tabela relacionada à parte (ainda não localizada; entra
  no próximo levantamento).
- **Não tem "regime tributário" (Simples/Presumido/Real) direto** — e
  **achamos onde fica (05/11/2026)**: não é nenhuma coluna de
  `wphd.empresa`. É a tabela `wfiscal.empssimples` (uma linha por período
  em que a empresa esteve no Simples Nacional, chaveada por `idempresa`):
  `dtinicial`/`dtfinal` (período no Simples), `tpempsfederal` (anexo/tabela
  federal), `nrfaixasfederal` (faixa de alíquota), `aliqadicionalsfederal`,
  `aliqmesocio`, `sticmssn` (ICMS pelo Simples), `pis_cofins_monofasico_...`,
  `nao_optante_mei_caminhoneiro`. Ou seja: **se a empresa tem um registro
  aberto (sem `dtfinal`) em `empssimples`, ela é Simples Nacional; se não
  tem nenhum, é Lucro Presumido ou Lucro Real** — essa segunda distinção
  (Presumido vs. Real) ainda não foi localizada, provavelmente fica em
  alguma tabela de `wcont` ligada à ECF/ECD (regime de apuração do lucro).
- Bastante coisa de "bureau" (`nmbureau`, `nmresponsavelbureau`,
  `nrtelefonebureau1-3`, `nmemailbureau`, `nmenderecobureau`, etc.) — parece
  ser dado do próprio escritório de contabilidade (o "bureau" prestador de
  serviço), não da empresa cliente. Faz sentido já que o Alterdata é
  multiempresa por escritório.
- `escritorio_data_entrada`/`escritorio_data_saida` (datas) sugerem período
  em que aquela empresa foi cliente daquele escritório — útil pra saber se
  uma empresa do backup ainda está ativa como cliente ou já saiu.

Falta confirmar se `wphd.empresa.cdempresa` é a chave que liga com
`wfiscal.empresa.cdempresa` / `wdp.empdp.idempresa` / `wcont.empcont.idempresa`
(os três módulos provavelmente referenciam o cadastro mestre do `wphd` pelo
mesmo código) — próximo passo com acesso ao banco.

**Correção (05/11/2026): `wdp.empcon` NÃO é a ligação DP↔Contábil.**
Inspecionamos as 10 colunas — `idempcontratada`, `cdchamada`, `nmempresa`,
`dsendereco`, `nmbairro`, `nmcidade`, `nrcep`, `cduf`, `nrcgc`,
`nrtelefone` — e é um mini-cadastro de **empresa contratada/tomadora de
serviço** (CNPJ + endereço de uma empresa terceira, usada em contexto de
cessão de mão-de-obra/terceirização dentro do DP), não um elo entre os
módulos DP e Contábil. A ligação DP↔Contábil continua sem tabela
identificada.

### Achado importante: dados particionados por empresa em tabelas separadas

Em vários pontos, a Alterdata não guarda os dados de todas as empresas numa
tabela só com uma coluna `empresa_id` — ela cria uma tabela física por
empresa, numerada, por tipo de dado (prefixo de 1-3 letras + sufixo numérico
de 5 dígitos). Isso muda a estratégia do importador: não dá pra simplesmente
fazer um `SELECT * FROM tabela WHERE empresa_id = X` — para esses grupos de
tabela, o importador tem que ler a tabela certa por empresa usando o código
dela como sufixo.

**Confirmado em 05/11/2026, só analisando os nomes das 3475 tabelas (sem
precisar de acesso ao banco):** dentro de um mesmo schema, o conjunto de
sufixos numéricos é **idêntico** entre as famílias de prefixo — ou seja, o
sufixo é o código interno da empresa na Alterdata, e vale igual pra todo
tipo de dado daquele schema. Isso elimina a dúvida de "como saber qual
sufixo corresponde a qual empresa por tipo de tabela": é o mesmo número em
todas.

**Em `wdp`** (Departamento Pessoal), 19 famílias de prefixo —
`a`, `d`, `e`, `f`, `fc`, `fh`, `h`, `hr`, `ih`, `im`, `ir`, `l`, `m`, `p`,
`r`, `s`, `t`, `tb`, `v` — compartilham exatamente os mesmos **51 códigos de
empresa**:

```
00001-00012, 00014-00023, 00026, 00028-00030, 00032-00034, 00036-00042,
00044-00049, 00051-00055, 00057, 00058, 00060, 00061
```

Outras 3 famílias (`pc`, `pv`, `se`) compartilham um subconjunto de **38**
desses mesmos códigos (empresas que usam aquele recurso específico —
hipótese a confirmar: `pc`/`pv` parecem ligados a ponto eletrônico e `se` a
algo opcional tipo sindicato/escala).

**Em `wcont`** (Contábil), o padrão se repete em escala menor: famílias
`cc`/`cl`/`cm`/`cs`/`ct` compartilham 24 códigos (21 reais + `99997`/`99998`/
`99999`, que parecem ser contas de template/demonstração da própria
Alterdata, não empresa real); famílias `lk`/`lt`/`mc`/`mv`/`sc`/`sd`
compartilham 30; `con` compartilha 30; `lf` compartilha 25. Ou seja, nem
toda empresa do Contábil usa todos os módulos — mas o conjunto de códigos de
empresa é um subconjunto fechado do mesmo grupo em todos os casos.

### Confirmado (05/11/2026): sufixo numérico = `wphd.empresa.cdempresa`, com uma ressalva

`wphd.empresa` tem 38 empresas cadastradas, com `cdempresa` variando de 2 a
63 (ex.: `cdempresa=8` é a própria "MURAD ASSESSORIA CONTABIL LTDA", ou
seja, o escritório do Beny também está cadastrado como empresa no banco).
Comparando essa lista com o conjunto de 51 sufixos achado em `wdp` (seção
acima): **todo código que aparece nos dois lados bate exatamente** — ex.:
empresa `cdempresa=8` ↔ tabelas `a00008`, `d00008`, `f00008` etc. Ou seja,
a hipótese está confirmada: **o sufixo numérico de 5 dígitos é o
`cdempresa` do cadastro mestre, sem necessidade de tabela de mapeamento à
parte.**

A ressalva: existem códigos em `wphd.empresa` (`43`, `59`, `62`, `63`) que
**não aparecem** no conjunto de sufixos de `wdp` — ou seja, essas empresas
estão cadastradas no mestre mas não têm nenhuma tabela de Departamento
Pessoal criada para elas (provavelmente são clientes só de Fiscal e/ou só
de Contábil, nunca tiveram folha processada). O importador precisa tratar
isso como caso normal: nem toda empresa do cadastro mestre tem dados em
todos os três módulos.

### Confirmado (05/11/2026): o que cada prefixo de `wdp` realmente guarda

Inspecionamos as colunas reais de uma tabela de cada família (sufixo
`00002`, a empresa "SHENG IMPORTADORA DE AVIAMENTOS"). **A maioria das
hipóteses anteriores estava errada** — só `f` bateu com o esperado:

| Prefixo | O que é (confirmado pelas colunas) | Colunas-chave |
|---|---|---|
| `a` | **Afastamento/férias** (não "admissão") | `dtperiodoaquisinicial/final`, `nrdiasdireito`, `nrdiasgozado`, `nrdiasfaltas` |
| `d` | **Dependente** do funcionário (não "demissão") | `iddependente`, `nmdependente`, `tprelacao`, `dtnascimento` |
| `e` | Evento × funcionário (tabela simples, base) | `idfuncionario`, `idevento`, `vlevento` |
| `f` | **Funcionário/ficha cadastral** — confirmado | `nmfuncionario`, endereço completo, `dtnascimento`, `tpestadocivil` |
| `fc` | Rateio por centro de custo | `idcentrodecusto`, `iddepartamento`, `vlpercentual` |
| `fh` | Histórico de função/cargo (promoções) | `funcaoant`/`funcaoatual`, `cboant`/`cboatual`, `cargoant`/`cargoatual` |
| `h` | Histórico de processamento de folha (cada rodada) | `dtrefinicial/final`, `tpprocessamento`, `decimo_terceiro_intermitente` |
| `hr` | Histórico de reajuste salarial (dissídio) | `dtreajuste`, `tpreajuste`, `nrparcelas` |
| `ih` | Histórico (variante próxima de `h`, provável sub-rotina) | `idhistorico`, `dtrefinicial/final`, `cdcontrdpto` |
| `im` | Movimento de contribuição (plano de saúde/ISS) | `plano_saude_*`, `aliqiss`, `idevento` |
| `ir` | IRRF/INSS/FGTS por evento, inclusive de contribuintes individuais | `tpfaixairrf`, `alirrf`, `alinss`, `stfgts` |
| `l` | Lançamento/histórico de **salário** (reajustes individuais) | `vlsalario`, `vlnovosalario`, `dissidio_data_assinatura` |
| `m` | Movimento de ponto/evento variável | `nrminutosfaltas`, `nrminutostrabalhados`, `vlmovimento` |
| `p` | Vale-transporte ("passagens") | `numero_cartao`, `matricula` |
| `r` | **Resumo de folha** consolidado por funcionário (não "rescisão") | `vlsalariofuncionario`, `vlremuneracao`, `nrdependentes` |
| `s` | Contribuição **sindical** (não "salário") | `idsindicato`, `vlcontribsindical` |
| `t` | **Troca** de departamento/setor (não "tomador") | `idsetoranterior`, `idsetoratual`, `dtmudanca` |
| `tb` | **Tributação de sócios / pró-labore** — achado crítico, ver abaixo | `idsocio`, `nmsocio`, `dtadmissao`, `dtdemissao`, `vlsalario` |
| `v` | **Vacinação** (não "vínculo") | `idvacina`, `nmvacina`, `dtvacina` |

**Achado crítico: `tb` é a tabela de sócios que estava faltando.**
`wphd.empresa` (cadastro mestre) não tem nenhuma coluna de sócio — mas
`wdp.tb00002` (e demais `tb*`) tem `idsocio`, `nmsocio`, endereço completo,
`dtadmissao`, `dtdemissao`, `vlsalario` (pró-labore) e dados de cota/classe
societária. Ou seja: **o quadro societário mora no módulo de
Departamento Pessoal, por empresa**, não no cadastro mestre do `wphd`.
Isso resolve a dúvida de onde ficam os sócios, levantada na seção anterior.

Ainda não inspecionadas as 3 famílias extras que só algumas empresas usam
(`pc`, `pv`, `se`) nem as famílias de `wcont` (`cc`, `cl`, `cm`, `cs`, `ct`,
`lk`, `lt`, `mc`, `mv`, `sc`, `sd`, `con`, `lf`) — próximo passo.

### Módulos mais pesados (prioridade de mapeamento)

- `wdp`: dominado por `esocial_*` (fila, lote, hash, snapshot, totalizador,
  eventos) — reflete o quanto o eSocial pesa no DP.
- `wfiscal`: dominado por `sped_reinf_*`, `sped_*`, `giamto_*` (GIA por
  estado), apuração de ICMS, Simples Nacional.
- `wcont`: `ecd_*`, `ecf_*`, `demonstrativo_contabil_*`, `lancamento`,
  `contas`.

## Decisão de arquitetura do fluxo de importação (confirmada com o Beny em 05/11/2026)

**A entrada da migração é pelo Departamento Pessoal.** Da lá, o processo
separa e distribui os dados pros sistemas Contábil e Fiscal. Ou seja, o
fluxo é:

```
Backup Alterdata (.bcir restaurado) 
        │
        ▼
   Importador DP  →  cadastra empresas + funcionários + folha no Murade DP
        │
        ├──────────────▶  distribui dados pro Murade Contábil
        └──────────────▶  distribui dados pro Murade Fiscal
```

Isso é diferente da ordem normal dos robôs operacionais do dia a dia
(que é Fiscal → DP → Contábil e Fiscal → Contábil) — essa ordem de robôs
continua valendo pra rotina normal. A ordem DP-primeiro é só pra migração
inicial de dados vindos do Alterdata, porque o cadastro de empresa mais
completo (CNPJ, sócios, endereço, dados cadastrais gerais) tende a estar
mais completo no módulo de DP/cadastro do cliente.

## Próximos passos (bloqueados até ter mais acesso ao banco restaurado)

1. ~~Terminar de extrair as colunas 13-70 de `wphd.empresa`~~ — feito
   (05/11/2026, lista completa das 70 colunas acima). Ainda falta
   confirmar a chave que liga esse cadastro mestre às tabelas de
   configuração `wfiscal.empresa` / `wdp.empdp` / `wcont.empcont` por
   `cdempresa`/`idempresa`. A tabela de sócios (`wdp.tb*`) e a de Simples
   Nacional (`wfiscal.empssimples`) já foram achadas (ver acima); falta só
   achar onde distingue Lucro Presumido de Lucro Real.
2. ~~Checar `wdp.empcon`~~ — feito: não é ligação DP↔Contábil, é cadastro
   de empresa contratada/tomadora de serviço (terceirização). A ligação
   DP↔Contábil continua sem tabela identificada — próximo passo.
3. ~~Descobrir a tabela de mapeamento do sufixo numérico~~ e ~~confirmar que
   bate com `cdempresa`~~ — ambos feitos e confirmados (05/11/2026, ver
   seção acima): o sufixo numérico de 5 dígitos é exatamente o `cdempresa`
   de `wphd.empresa`, sem tabela de mapeamento à parte (com a ressalva de
   4 empresas cadastradas no mestre sem tabelas de DP).
4. ~~Levantar estrutura de `wdp` pras tabelas por família de prefixo~~ —
   feito pra 19 das famílias em `wdp` (ver tabela de prefixos confirmados
   acima); faltam só as 3 famílias condicionais (`pc`, `pv`, `se`) e as
   famílias de `wcont` (`cc`, `cl`, `cm`, `cs`, `ct`, `lk`, `lt`, `mc`,
   `mv`, `sc`, `sd`, `con`, `lf`).
5. Inspecionar as colunas das famílias de `wcont` e das 3 condicionais de
   `wdp` que faltaram.
6. ~~Localizar a tabela de enquadramento tributário~~ — parcialmente
   feito: Simples Nacional achado em `wfiscal.empssimples` (ver acima,
   período + parâmetros por `idempresa`). Falta achar onde distingue
   Lucro Presumido de Lucro Real pra quem não é Simples — candidato mais
   provável é alguma tabela de `wcont` ligada à ECF/apuração do lucro.
7. Depois de ter colunas + tipos de dado de tudo, desenhar o ETL real
   (provável abordagem: um robô/serviço batch que lê direto do Postgres
   restaurado — ou de um dump exportado — e grava no schema do Murade,
   nunca reaproveitando lógica de cálculo do Alterdata, só os dados
   brutos).
8. Nunca replicar bugs conhecidos do Alterdata (cálculo de Simples
   Nacional e agendamento automático de guias falham com frequência,
   segundo relato do Beny — motivo inclusive de multas em clientes dele).
   A migração traz só dado, nunca lógica de cálculo.

## Fonte dos dados

Lista completa das 3475 tabelas (schema + nome) extraída via
`information_schema.tables` do banco `ALTERDATA_PACK` restaurado
localmente pelo Beny em 04-05/11/2026. Arquivo bruto não versionado aqui
por ser só uma lista de nomes de tabela sem dado nenhum — pode ser
regerado a qualquer momento com:

```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema IN ('wfiscal','wdp','wcont','winss','wguias','wlalur')
ORDER BY table_schema, table_name;
```
