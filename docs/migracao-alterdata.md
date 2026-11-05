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
módulos DP e Contábil.

**Resolvido (05/11/2026): não precisa de tabela de ligação DP↔Contábil —
já está resolvido pelo que já confirmamos.** `wphd.empresa.cdempresa` já
é a chave que liga TUDO: as tabelas particionadas de `wdp` (ex. `f00002`,
`tb00002`) e as de `wcont` (ex. `lt00002`, `sd00002`, `mv00002`) usam o
mesmo sufixo numérico, que é o `cdempresa` do cadastro mestre (ver seção
"sufixo numérico = `wphd.empresa.cdempresa`" acima) — então DP e Contábil
já estão ligados por tabela nenhuma a mais: ambos apontam pro mesmo
`cdempresa`. E do lado Murade, a ligação entre os três sistemas nunca foi
por ID interno do Alterdata mesmo — é sempre pelo **CNPJ** (`dp_companies.
cnpj`, `murade_fiscal_empresas.cnpj`, `murade_contabil_...cnpj`, ver seção
"Schema de destino" abaixo). Ou seja: o importador usa `wphd.empresa.
nrcgc` (o CNPJ) como chave universal de ligação — tanto pra juntar os
dados dos três módulos do Alterdata entre si (via `cdempresa`) quanto pra
gravar nos três sistemas Murade (via `cnpj`). Não existe, e não é preciso
que exista, uma tabela dedicada de "ligação DP↔Contábil".

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

**Confirmado também (05/11/2026) para as tabelas de configuração por
módulo** (`wfiscal.empresa`, `wdp.empdp`, `wcont.empcont` — as que achamos
no início e que são parâmetro, não cadastro): comparando `cdempresa`/
`idempresa` dessas três contra `wphd.empresa.cdempresa` com `FULL OUTER
JOIN`, a imensa maioria bate exatamente (ex.: `wcont.empcont`: 12 de 15
batem; `wfiscal.empresa`: 24 de 26 batem), e as exceções são só empresas
que usam um módulo e não outro (a própria "MURAD ASSESSORIA CONTABIL",
`cdempresa=8`, por exemplo, não tem linha em `wfiscal.empresa` — faz
sentido, o escritório não é cliente Fiscal de si mesmo). **Conclusão
prática pro importador: `wphd.empresa.cdempresa` é a chave universal; usar
`LEFT JOIN` contra as tabelas de cada módulo e tratar ausência como
"empresa não usa esse módulo", nunca como erro.** Como essas tabelas de
config guardam parâmetro de cálculo do Alterdata (que não deve ser
replicado, por instrução do Beny), não é prioridade mapear coluna a coluna
delas — só confirmar a chave já foi suficiente.

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
| `pc` | Provisão de férias/13º (cálculo) | `tipo_provisao`, `tipo_apuracao`, `avos_bruto`, `avos_especial`, `data_ferias_inicial/final` |
| `pv` | Provisão de encargos (INSS/FAP/FPAS/SAT) | `aliquota_fap`, `aliquota_fpas`, `aliquota_sat`, `avos_devidos_dec`, `avos_ferias` |
| `se` | Log de importação de arquivo do eSocial | `importador_esocial`, `solicitacao_id`, `arquivo`, `data_importacao` |

As 3 famílias condicionais (`pc`, `pv`, `se`) completam as 22 famílias de
`wdp` inspecionadas — `pc`/`pv` são cálculo de provisão (férias/13º/
encargos), não dado bruto a importar; `se` é só log de importação do
eSocial do Alterdata, sem valor pra migração.

**Achado crítico: `tb` é a tabela de sócios que estava faltando.**
`wphd.empresa` (cadastro mestre) não tem nenhuma coluna de sócio — mas
`wdp.tb00002` (e demais `tb*`) tem `idsocio`, `nmsocio`, endereço completo,
`dtadmissao`, `dtdemissao`, `vlsalario` (pró-labore) e dados de cota/classe
societária. Ou seja: **o quadro societário mora no módulo de
Departamento Pessoal, por empresa**, não no cadastro mestre do `wphd`.
Isso resolve a dúvida de onde ficam os sócios, levantada na seção anterior.

### Confirmado (05/11/2026): lista completa de colunas de `wdp.f*` (funcionário) — 262 colunas

A lista parcial usada até aqui (só as ~25 colunas mais óbvias) estava
muito incompleta. Extraímos a estrutura real completa de `wdp.f00002`
via `information_schema.columns` — **262 colunas**, bem mais rica do que
qualquer cadastro de funcionário do lado Murade hoje:

| # | Coluna | Tipo | # | Coluna | Tipo |
|---|--------|------|---|--------|------|
| 1 | `idfuncionario` | varchar | 132 | `dtentrada` | timestamp |
| 2 | `cdchamada` | varchar | 133 | `dsinformacoes` | varchar |
| 3 | `nmfuncionario` | varchar | 134 | `tppagamentorais` | varchar |
| 4 | `nmendereco` | varchar | 135 | `nrci` | double |
| 5 | `nrendereco` | varchar | 136 | `tipodeficiencia` | varchar |
| 6 | `nmcomplemento` | varchar | 137 | `dtinicialprocesso` | timestamp |
| 7 | `nmbairro` | varchar | 138 | `dtfinalprocesso` | timestamp |
| 8 | `nmcidade` | varchar | 139 | `nrprocesso` | varchar |
| 9 | `cduf` | varchar | 140 | `nrvaraprocesso` | varchar |
| 10 | `nrcep` | varchar | 141 | `nranoprocesso` | integer |
| 11 | `nrddd` | varchar | 142 | `dtalteracaocad` | timestamp |
| 12 | `nrtelefone` | varchar | 143 | `dtultrescisao` | timestamp |
| 13 | `nrcelular` | varchar | 144 | `cdmotivorct` | varchar |
| 14 | `dtnascimento` | timestamp | 145 | `tpcontrato` | varchar |
| 15 | `tpestadocivil` | varchar | 146 | `motivo_estabilidade` | varchar |
| 16 | `tpsexo` | varchar | 147 | `prorrogacao_tempo_determindado` | date |
| 17 | `nmnacionalidade` | varchar | 148 | `alpensaofgts` | double |
| 18 | `nranochegada` | integer | 149 | `tipo_conta` | smallint |
| 19 | `tpinstrucao` | varchar | 150 | `tipo_certidao_civil` | smallint |
| 20 | `tpinstrucaorais` | varchar | 151 | `data_certidao_civil` | date |
| 21 | `dtvctoexperiencia` | timestamp | 152 | `termo_matricula_certidao_civil` | varchar |
| 22 | `dtprorrogacaoexperiencia` | timestamp | 153 | `livro_certidao_civil` | varchar |
| 23 | `dtadmissao` | timestamp | 154 | `folha_certidao_civil` | varchar |
| 24 | `dttransferencia` | timestamp | 155 | `cartorio_certidao_civil` | varchar |
| 25 | `tpcausatransferencia` | varchar | 156 | `uf_certidao_civil` | varchar |
| 26 | `dtdemissao` | timestamp | 157 | `municipio_certidao_civil` | varchar |
| 27 | `tpcausademissao` | varchar | 158 | `quantidade_dias_ferias` | smallint |
| 28 | `stavisoindenizado` | varchar | 159 | `tipo_identidade` | smallint |
| 29 | `stterminocontrato` | varchar | 160 | `inscricao_orgao_classe` | varchar |
| 30 | `tpvinculo` | varchar | 161 | `emissor_orgao_classe` | varchar |
| 31 | `dtvctoatestado` | timestamp | 162 | `data_expedicao_orgao_classe` | date |
| 32 | `iddepartamento` | varchar | 163 | `data_validade_orgao_classe` | date |
| 33 | `idfuncao` | varchar | 164 | `orgao_emissor_cnh` | varchar |
| 34 | `vlsalariobase` | double | 165 | `data_expedicao_cnh` | date |
| 35 | `tpformapgto` | varchar | 166 | `tipo_logradouro` | varchar |
| 36 | `nrminpordia` | integer | 167 | `residencia_propria` | boolean |
| 37 | `stprimtrabcaged` | varchar | 168 | `utilizou_recursos_fgts` | boolean |
| 38 | `tpreintegracao` | varchar | 169 | `data_chegada` | date |
| 39 | `nrlivroficharegistro` | integer | 170 | `casado_com_brasileiro` | boolean |
| 40 | `tplivroficharegistro` | varchar | 171 | `filho_com_brasileiro` | boolean |
| 41 | `nrfolhalivroficharegistro` | integer | 172 | `data_naturalizacao` | date |
| 42 | `dsobservacaorecibo` | varchar | 173 | `pais_nascimento_id` | integer |
| 43 | `idagencia` | varchar | 174 | `pais_residencia_id` | integer |
| 44 | `nrcontacorrente` | varchar | 175 | `municipio_nascimento_ibge_codigo` | varchar |
| 45 | `idbanco` | varchar | 176 | `municipio_residencia_ibge_codigo` | varchar |
| 46 | `cdcamaracompensacao` | varchar | 177 | `codigo_postal` | varchar |
| 47 | `tpcontribuicaosindical` | varchar | 178 | `tipo_admissao` | smallint |
| 48 | `cdretencaoirrf` | varchar | 179 | `indicativo_admissao` | smallint |
| 49 | `tpfaixainss` | varchar | 180 | `cnpj_vinculo_anterior` | varchar |
| 50 | `stadiantamento` | varchar | 181 | `matricula_vinculo_anterior` | varchar |
| 51 | `aladiantamento` | double | 182 | `data_inicio_vinculo_anterior` | date |
| 52 | `alvaletransporte` | double | 183 | `observacao_transferencia` | varchar |
| 53 | `idsindicatogrcs` | varchar | 184 | `admissao_especial_caged` | boolean |
| 54 | `nridentidade` | varchar | 185 | `aviso_trabalhado_fixo_30_dias` | boolean |
| 55 | `nmorgaoexpedidor` | varchar | 186 | `uf_emissor_cnh` | varchar |
| 56 | `dtexpedicao` | timestamp | 187 | `data_primeira_cnh` | timestamp |
| 57 | `tpidentifpispasep` | varchar | 188 | `tipo_condicao_trabalhador_estrangeiro` | smallint |
| 58 | `cdufexpedicao` | varchar | 189 | `tipo_jornada_trabalho` | smallint |
| 59 | `nrpispasep` | varchar | 190 | `tipo_contratacao_temporaria` | smallint |
| 60 | `dtpis` | timestamp | 191 | `tipo_provimento` | smallint |
| 61 | `nrcpf` | varchar | 192 | `numero_recibo_admissao_preliminar` | varchar |
| 62 | `nrctps` | varchar | 193 | `banco_adicional_id` | varchar |
| 63 | `nrseriectps` | varchar | 194 | `agencia_adicional_id` | varchar |
| 64 | `cdufctps` | varchar | 195 | `numero_conta_corrente_adicional` | varchar |
| 65 | `dtexpedicaoctps` | timestamp | 196 | `tipo_conta_adicional` | smallint |
| 66 | `nrcertificadoreservista` | varchar | 197 | `deficiencia_fisica` | boolean |
| 67 | `nrserie` | varchar | 198 | `deficiencia_auditiva` | boolean |
| 68 | `nrcategoriamilitar` | varchar | 199 | `deficiencia_visual` | boolean |
| 69 | `nrtituloeleitor` | varchar | 200 | `deficiencia_mental` | boolean |
| 70 | `nrzonaeleitoral` | varchar | 201 | `deficiencia_intelectual` | boolean |
| 71 | `nrsecaoeleitoral` | varchar | 202 | `tipo_cumprimento_aviso` | smallint |
| 72 | `nrcarteirahabilitacao` | varchar | 203 | `rescisao_sabado_compensado` | boolean |
| 73 | `dtvctohabilitacao` | timestamp | 204 | `categoria_trabalhador_esocial` | smallint |
| 74 | `tphabilitacao` | varchar | 205 | `sem_horario_fixo` | boolean |
| 75 | `dtvalcarteiraidentest` | timestamp | 206 | `nao_atualiza_salario` | boolean |
| 76 | `tpvistoestrangeiro` | varchar | 207 | `mensagem_escala_id` | varchar |
| 77 | `dtvalidadecarttrabest` | timestamp | 208 | `tipo_transportador` | varchar |
| 78 | `nrcontafgts` | varchar | 209 | `cota_deficiente` | boolean |
| 79 | `cdufcontafgts` | varchar | 210 | `temporario_justificativa_legal` | text |
| 80 | `stmudouenderecofgts` | varchar | 211 | `temporario_tipo_inclusao` | smallint |
| 81 | `dtopcaofgts` | timestamp | 212 | `matricula_esocial` | varchar |
| 82 | `vlsaldofgts` | double | 213 | `salario_variavel_descricao` | text |
| 83 | `dsobservacao` | text | 214 | `regime_previdenciario` | smallint |
| 84 | `idhorario` | varchar | 215 | `lei_anistia` | varchar |
| 85 | `dsfoto` | varchar | 216 | `remuneracoes_pagas_juizo` | boolean |
| 86 | `nmmae` | varchar | 217 | `transferencia_esocial_causa` | smallint |
| 87 | `nmpai` | varchar | 218 | `reintegracao_tipo` | smallint |
| 88 | `vllimitecredito` | double | 219 | `natureza_atividade_trabalhador` | smallint |
| 89 | `nrcartaoponto` | varchar | 220 | `cheque_pagamento` | boolean |
| 90 | `dtavisoprevio` | timestamp | 221 | `cheque_banco_id` | varchar |
| 91 | `stavisoprevio` | varchar | 222 | `caged_regime_de_tempo_parcial` | boolean |
| 92 | `tpocorrencia` | varchar | 223 | `indicador_aviso_previo` | smallint |
| 93 | `tpcategoria` | integer | 224 | `cnpj_empresa_sucessora` | varchar |
| 94 | `tpcartaosalario` | varchar | 225 | `observacao_esocial` | text |
| 95 | `nmagenciabkfolha` | varchar | 226 | `forma_pagamento_id` | integer |
| 96 | `nrcepagenciabkfolha` | varchar | 227 | `orgao_classe_uf` | varchar |
| 97 | `cddocbkfolha` | varchar | 228 | `horas_semanais` | smallint |
| 98 | `nrbancobkfolha` | varchar | 229 | `jornada_tipo_descricao` | text |
| 99 | `stfgtsmesanterior` | varchar | 230 | `controlar_no_gerente_esocial` | boolean |
| 100 | `tpfuncaposentado` | varchar | 231 | `reintegracao_processo_numero` | varchar |
| 101 | `tpcorraca` | varchar | 232 | `reintegracao_data_efeito_financeiro` | date |
| 102 | `stdeficiente` | varchar | 233 | `reintegracao_data_retorno` | date |
| 103 | `streabilitado` | varchar | 234 | `dados_contrato_determinado` | varchar |
| 104 | `strestantecontrato` | varchar | 235 | `possui_clausula_assecuratoria` | boolean |
| 105 | `qtdiastrabalhados` | integer | 236 | `esocial_identificado_no_ret` | boolean |
| 106 | `qtdiassalariofamilia` | integer | 237 | `inativo_folha` | boolean |
| 107 | `qtdiasfaltasproporcionais` | integer | 238 | `tempo_residencia` | integer |
| 108 | `qtdiasfaltas` | integer | 239 | `horario_noturno` | boolean |
| 109 | `qtfaltasperiodoaquisitivo` | integer | 240 | `tipo_jornada_esocial` | smallint |
| 110 | `usuarioswmail` | varchar | 241 | `reintegracao_avos_13_pagos` | integer |
| 111 | `stsituacaolegal` | varchar | 242 | `curso_cetpp` | integer |
| 112 | `cdocupacaoprincipal` | varchar | 243 | `pontuacao_cnh` | integer |
| 113 | `cdnaturezaocupacao` | varchar | 244 | `data_consulta_cnh` | date |
| 114 | `cdufnascimento` | varchar | 245 | `observacao_cnh` | text |
| 115 | `nmmunnascimento` | varchar | 246 | `sem_matricula_esocial` | boolean |
| 116 | `idbancopis` | varchar | 247 | `cargo_funcao_acumulavel` | boolean |
| 117 | `idagenciapis` | varchar | 248 | `temporario_estab_nrinscricao` | varchar |
| 118 | `nrdecretonaturalizado` | varchar | 249 | `processo_trabalhista_demissao` | varchar |
| 119 | `qtavosperdidos` | varchar | 250 | `processo_trabalhista_2200` | boolean |
| 120 | `qtdiastrabnaopagos` | integer | 251 | `contratacao_por_empresa_cotista` | boolean |
| 121 | `stgerarais` | varchar | 252 | `nrhorames` | integer |
| 122 | `dtvenctoaprendizagem` | timestamp | 253 | `inscricao_entidade` | varchar |
| 123 | `tranfpoutraemp` | varchar | 254 | `tipo_chave_pix` | smallint |
| 124 | `dscausademissao` | varchar | 255 | `chave_pix` | varchar |
| 125 | `stindalvara` | varchar | 256 | `nmsocial` | varchar |
| 126 | `nmcurto` | varchar | 257 | `indicativo_nif` | smallint |
| 127 | `tipobeneficioticket` | varchar | 258 | `nif` | varchar |
| 128 | `dtestabilidade` | timestamp | 259 | `forma_tributacao` | varchar |
| 129 | `stimprimeetiqueta` | boolean | 260 | `qtdiasindenizados` | integer |
| 130 | `stimprimefolhaponto` | boolean | 261 | `processo_inventario` | boolean |
| 131 | `nrcartaoticket` | varchar | 262 | `motivo_desligamento_esocial` | varchar |
**Conclusões da lista completa:**

- **Pix na folha**: `tipo_chave_pix` (#254) + `chave_pix` (#255) — o
  Alterdata já guarda a chave Pix do funcionário pra pagamento de salário.
  Não existe campo equivalente hoje no `Funcionario` do Murade DP.
- **Nome social**: `nmsocial` (#256) — campo específico pra pessoas trans,
  usado no eSocial (evento S-2200/S-2300). Gap direto se o Murade DP não
  tiver esse campo.
- **NIF de estrangeiro**: `indicativo_nif` (#257) + `nif` (#258) — dado de
  funcionário estrangeiro sem CPF, usado no eSocial. Vem junto com vários
  outros campos de estrangeiro já na lista (`tpvistoestrangeiro`,
  `data_naturalizacao`, `pais_nascimento_id`, `pais_residencia_id`,
  `tipo_condicao_trabalhador_estrangeiro`, etc.).
- **`forma_tributacao` (#259) é por funcionário**, não só por empresa —
  achado importante porque a seção "Regime tributário" abaixo falava só
  do regime da empresa; aqui existe uma granularidade por pessoa também
  (provavelmente relevante pra autônomo/contribuinte individual dentro da
  folha).
- **Vale-transporte tem número de cartão direto no funcionário**:
  `nrcartaoticket` (#131) + `tipobeneficioticket` (#127) — diferente do que
  a tabela de prefixos acima sugeria (que seria só em `wdp.p*`); o
  Alterdata guarda isso também na ficha principal do funcionário.
- **Deficiência granular**: além de `tipodeficiencia` (#136, texto livre),
  existem 5 booleanos específicos — `deficiencia_fisica`,
  `deficiencia_auditiva`, `deficiencia_visual`, `deficiencia_mental`,
  `deficiencia_intelectual` (#197-201) — mais `cota_deficiente` (#209) pra
  cota legal de PCD.
- **Conta bancária adicional**: além de `idbanco`/`idagencia`/
  `nrcontacorrente` (#43-45, conta principal), existem `banco_adicional_id`,
  `agencia_adicional_id`, `numero_conta_corrente_adicional`,
  `tipo_conta_adicional` (#193-196) — segunda conta, cenário não mapeado
  no Murade DP hoje.
- **Bastante campo específico de eSocial** (`categoria_trabalhador_esocial`,
  `tipo_jornada_esocial`, `transferencia_esocial_causa`, `matricula_esocial`,
  `sem_matricula_esocial`, `esocial_identificado_no_ret`,
  `observacao_esocial`, `controlar_no_gerente_esocial`,
  `motivo_desligamento_esocial`) — confirma o padrão já visto nas tabelas
  auxiliares: o Alterdata é fortemente orientado a eSocial em todo o DP.
- **Reintegração** tem seu próprio grupo de campos (`reintegracao_tipo`,
  `reintegracao_processo_numero`, `reintegracao_data_efeito_financeiro`,
  `reintegracao_data_retorno`, `reintegracao_avos_13_pagos`) — caso de
  readmissão por decisão judicial, não coberto hoje no cadastro resumido
  do Murade.

**Impacto no importador:** o agente que está implementando o importador
(`alterdataMigracao.ts`, em andamento) recebeu só a lista parcial antiga.
O mapeamento origem→destino de funcionário precisa ser revisado contra
esta lista completa antes de considerar o import pronto — principalmente
os campos novos listados acima (Pix, nome social, NIF, forma de
tributação por pessoa, deficiência granular, conta bancária adicional).
Como o `Funcionario` do Murade já tem o campo `origemAlterdata?:
Record<string,string>` pra guardar a ficha original lado a lado, o que
não tiver campo próprio no Murade ainda pode ao menos ser preservado ali
sem perda de dado, até o cadastro ser estendido.

### Confirmado (05/11/2026): famílias de `wcont`

| Prefixo | O que é | Colunas-chave |
|---|---|---|
| `cc` | Lançamento contábil (com centro de custo) | `idmovimento`, `idconta`, `idcontrapartida`, `vllancamento`, `dtlancamento` |
| `cl` | Lote de lançamentos | `idlote`, `vltotaldebitos`, `vltotalcreditos`, `stlote` |
| `cm` | Lançamento contábil (variante) | mesmas colunas de `cc`, com `stconversaomoeda` |
| `con` | Conciliação (bancária/contábil) | `idconciliacao`, `idmovimento`, `dtconciliacao` |
| `cs` | Saldo de conta | `idsaldo`, `idconta`, `dtsaldo`, `vldebito`, `vlcredito` |
| `ct` | Saldo de conta por centro de custo | `idsaldo`, `idconta`, `idccusto`, `vldebito`, `vlcredito` |
| `lf` | Lançamento fixo (modelo recorrente) | `idlancfixo`, `idcontadevedora`, `idcontacredora`, `vllancamento` |
| `lk` | Referência simples de lote (tabela mínima) | só `idlote` |
| `lt` | Lote de lançamentos (idêntica a `cl`) | mesmas colunas de `cl` |
| `mc` | Lançamento contábil (idêntica a `cc`) | mesmas colunas de `cc` |
| `mv` | Lançamento contábil com auditoria (variante de `cm`) | mesmas colunas de `cm` + `origemusuario`, `ultimousuario` |
| `sc` | Saldo por centro de custo (idêntica a `ct`) | mesmas colunas de `ct` |
| `sd` | Saldo de conta (idêntica a `cs`) | mesmas colunas de `cs` |

**Resolvido (05/11/2026): por que há pares estruturalmente idênticos
(`cc`≈`mc`, `cl`≈`lt`, `cs`≈`sd`, `ct`≈`sc`, `cm`≈`mv`).** A hipótese de
"exercício atual vs. histórico" não se confirmou. Testamos `count(*)` de
`cc`/`cl`/`cs`/`ct`/`sc`/`cm` em várias empresas (sufixos `00001`, `00002`,
`00003`, `00008`) e **todas deram zero linhas em todas elas** — inclusive
pra `cc`, verificamos as 25 tabelas `cc*` que existem no banco e todas
estão vazias. Já `lt`, `sd` e `mv` (os pares de `cl`, `cs`/`ct` e `cm`,
respectivamente) têm dado de verdade (ex.: `lt00002`=146, `sd00002`=2031,
`mv00002`=3370; `lt00008`=2, `sd00008`=110, `mv00008`=190). **Conclusão:
`cc`, `cl`, `cs`, `ct`, `sc` e `cm` são tabelas mortas/vestigiais** —
existem (provavelmente de uma convenção de nomenclatura antiga do
Alterdata) mas nunca são populadas pela versão atual do sistema; `lt`,
`sd` e `mv` são as tabelas realmente ativas de lote/saldo/lançamento. Não
achamos uma tabela viva equivalente a `ct`/`sc` (saldo por centro de
custo) — mesmo em empresas com `wphd.empresa.centrocusto = true` (ex.
`cdempresa=60`) a tabela `wcont.cc00060` nem existe, então saldo por
centro de custo parece não estar persistido em nenhuma tabela deste
backup. **Impacto no importador: ignorar `cc`/`cl`/`cs`/`ct`/`sc`/`cm`
por completo e ler só `lt`/`sd`/`mv`** quando chegar a vez do Contábil
(2º passo do fluxo, depois do DP — não bloqueante agora).

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

## Schema de destino no Murade (levantado em 05/11/2026)

Levantamento completo do lado Murade (os 3 repositórios: `departamento-
pessoal`, `murade-fiscal`, `murade-contabil`). **Achado mais importante:
não existe um schema SQL centralizado nem ORM com migrations** — cada
módulo cria sua(s) tabela(s) via `CREATE TABLE IF NOT EXISTS` embutido no
próprio código TypeScript (idempotente, sem pasta `migrations/`). E nas
entidades mais sensíveis (empresa, funcionário, sócio), a tabela Postgres
tem poucas colunas fixas + **um campo `payload`/`dados` (jsonb) — ou um
payload cifrado (`payload_ciphertext`/`payload_iv`/`payload_tag`, bytea
com AES-256-GCM) — guardando o registro inteiro como JSON**. A estrutura
real de campos está nas *interfaces TypeScript*, não em colunas SQL.

### Empresa (3 representações, uma por sistema — não é tabela compartilhada)

| Sistema | Tabela | Chave | Onde o schema do payload está definido |
|---|---|---|---|
| Fiscal (fonte mais completa) | `murade_fiscal_empresas` | `cnpj` (14 char) | interface `Empresa`, `murade-fiscal/src/types.ts` |
| DP (cadastro operacional, usado na folha) | `dp_companies` | `cnpj` | interface `EmpresaCliente`, `departamento-pessoal/src/types/murad.ts` |
| Contábil (não tem cadastro próprio, só réplica) | `contabil_empresas_compartilhadas` + `contabil_company_workspaces` | `cnpj` | mesmo formato jsonb do Fiscal |

Campos-chave do `Empresa` (Fiscal): `razaoSocial, nomeFantasia, cnpj,
inscricaoEstadual, regimeTributario ('Simples Nacional'|'Lucro
Presumido'|'Lucro Real'|'MEI'|'Não informado'), uf, cidade, status,
certificado?, dadosContratuais?` (este último tem endereço completo,
capital social, data de abertura, objeto social e `socios[]`). O
`EmpresaCliente` do DP tem campos equivalentes mais granulares (CNAE,
FPAS, RAT, FAP, anexo Simples, departamentos, etc.).
**CNPJ é a chave em todo lugar** — normalizado pra 14 caracteres sem
máscara, compatível com `wphd.empresa.nrcgc`.

### Funcionário

Tabela `dp_employees` (`cnpj, employee_id` chave composta) — **payload
inteiro cifrado** (AES-256-GCM, chave em `DP_DATA_ENCRYPTION_KEY`).
Interface `Funcionario` (`departamento-pessoal/src/types/murad.ts`) tem
~70 campos (dados pessoais, CTPS, PIS, endereço, admissão, cargo, CBO,
salário, vale-transporte, plano de saúde, férias resumidas, status
eSocial). **Já existe um campo pronto pra isso**: `origemAlterdata?:
Record<string,string>` — guarda a ficha original do sistema de origem
lado a lado com os campos convertidos, pra conferência.

**Atenção:** o lado Alterdata é bem mais rico — `wdp.f*` tem **262
colunas** confirmadas (ver seção "lista completa de colunas de `wdp.f*`"
acima), quase 4x o que o `Funcionario` do Murade tem campo próprio hoje.
Destaques sem equivalente direto no Murade: chave Pix (`tipo_chave_pix`/
`chave_pix`), nome social (`nmsocial`), NIF de estrangeiro
(`indicativo_nif`/`nif`), `forma_tributacao` por funcionário (não só por
empresa), deficiência granular (5 booleanos por tipo), conta bancária
adicional. Tudo que não tiver campo próprio cai em `origemAlterdata` sem
perda de dado, mas o mapeamento do importador precisa ser revisado contra
a lista completa, não contra a lista parcial usada inicialmente.

### Dependente

**Não é tabela separada** — é array `dependentesDetalhe[]` dentro do
próprio JSON do `Funcionario` (cifrado junto): `{tpDep, nome, dtNascto,
cpf?, depIRRF, depSF}`.

### Sócio / pró-labore

Duas entidades sem ligação entre si:
- **DP** (a principal pra migração, por causa do pró-labore mensal):
  `dp_socios` (payload cifrado: `{id, nome, cpf, dependentes, ativo}` —
  **sem `dtadmissao`/`dtdemissao`**, diferente do `wdp.tb*` do Alterdata)
  + `dp_prolabore_mes` (lançamento mensal, texto claro: `cnpj, socio_id,
  competencia, valor, inss, irrf, liquido`).
- **Fiscal** (pra contrato social, sem pró-labore): `SocioEmpresa` dentro
  de `Empresa.dadosContratuais.socios[]` — `{nome, cpf, qualificacao,
  percentualCapital, nacionalidade?, estadoCivil?, profissao?}`.

**Gap:** nem `dp_socios` nem `SocioEmpresa` têm data de admissão/saída do
sócio — campo que o Alterdata tem (`wdp.tb*.dtadmissao/dtdemissao`). Vai
sobrar só em `origemAlterdata` até o cadastro ser estendido.

### Férias/afastamento

Sem tabela de histórico por período. Existe: (1) campos resumidos no
próprio `Funcionario` (`dataAquisitivoFerias`, `feriasGozadas`,
`diasFeriasVencidas`); (2) `dp_absence_draft_history` — log append-only
de afastamentos (inclusive férias, como motivo `'Férias (S-2230 código
15)'`), pensado pro eSocial S-2230, não como cadastro mestre de período.
**Gap:** não existe hoje uma tabela equivalente ao histórico de períodos
aquisitivos do Alterdata (`wdp.a*`).

### Histórico de cargo/função

**Não existe nenhum campo ou tabela** — `Funcionario` só guarda cargo/CBO
**atual**, sem versionamento. Gap direto com `wdp.fh*`.

### Folha de pagamento

Fragmentada em várias tabelas por estágio (`dp_payroll_previews`,
`dp_payroll_closures` — esta é o snapshot final fechado, imutável —,
`dp_payroll_drafts`, `dp_payroll_auto_results`, etc.), todas chaveadas por
`(cnpj, competence, employee_ref)`. Formato das rubricas segue o cálculo
de `calculateMonthlyCltPreview` em `departamento-pessoal/src/server/
payroll.ts` — não é uma tabela de rubricas normalizada linha a linha.

### Vale-transporte

Só dois campos no `Funcionario` (`valeTransporte: boolean,
valeTransporteValor: number`) — sem número de cartão/matrícula como no
Alterdata. **Correção (05/11/2026):** o número do cartão não está só em
`wdp.p*` — a própria ficha do funcionário (`wdp.f*`) já tem
`nrcartaoticket` + `tipobeneficioticket` direto (ver lista completa de
colunas acima). **Achado importante:** o cálculo de folha hoje **ainda
não desconta VT automaticamente** (há um `throw` explícito dizendo que
não está implementado).

### Contribuição sindical

Existe só o **cadastro do sindicato** (`dp_sindicatos`, com regras tipo
`percentualAssistencial`, `mesDescontoAssistencial`) — **não existe
lançamento mensal por funcionário** registrando o valor efetivamente
descontado. Gap direto com `wdp.s*`.

### Regime tributário

Sempre um campo de texto único e atual dentro do cadastro da empresa
(`regimeTributario`/`regime`) em cada sistema — **nenhum dos três
sistemas Murade guarda histórico de regime por período**, diferente do
Alterdata (`wfiscal.empssimples` tem período). Contábil usa esse campo só
pra decidir qual motor de cálculo chamar (`ecfPresumidoService.ts` vs.
`ecfRealService.ts`) — não achamos (nem no Alterdata nem no Murade) uma
tabela que separe Presumido de Real além desse campo único; não é
bloqueante porque nenhum dos dois lados rastreia isso por período mesmo.

### Gaps a criar no Murade DP (tabelas que não existem ainda, necessárias pra não perder dado do Alterdata)

Seguindo o padrão de nomenclatura já usado (`dp_<entidade>`):

| Tabela nova | Pra quê | Supre o quê do Alterdata |
|---|---|---|
| `dp_ferias_periodos` | histórico de períodos aquisitivos de férias por funcionário/ano | `wdp.a*` |
| `dp_historico_cargo` | histórico de mudança de cargo/função/CBO/departamento | `wdp.fh*` |
| `dp_contribuicao_sindical_mes` | lançamento mensal de contribuição sindical descontada | `wdp.s*` |
| `fiscal_regime_tributario_historico` | histórico de período de enquadramento tributário | `wfiscal.empssimples` |

### Importadores que já existem (caminho diferente do que este documento investiga)

Cada sistema já tem um importador próprio de **CSV/TXT/XML** (não lê
`.bcir`/dump Postgres nativo): `MuradeMigracao.ts` (Fiscal, só empresas),
`muradeDpMigracao.ts` (DP, mais amplo — funcionário, férias, 13º, lê XML
de NF-e/CT-e/eSocial) e `migracaoContabilService.ts` (Contábil). Esses
importadores cobrem um caminho diferente do que este documento persegue
(restauração nativa do `.bcir` → Postgres → leitura direta das tabelas).
Os dois caminhos podem coexistir, mas não compartilham código hoje — é
uma decisão de arquitetura em aberto: usar/estender um desses, ou seguir
com um importador novo que lê direto do Postgres restaurado.

### Risco técnico a resolver antes de escrever dado de verdade

O importador precisa:
1. Replicar a função de cifragem AES-256-GCM (`encryptFuncionario`/
   `cifrarJsonDP` em `departamento-pessoal/src/server/auth.ts`) pra gravar
   em `dp_employees`/`dp_socios` — exige acesso a `DP_DATA_ENCRYPTION_KEY`
   (segredo de produção).
2. Adquirir o mesmo `pg_advisory_lock` por CNPJ que `salvarEmpresaEscopada`/
   `salvarFuncionarioEscopado` usam, pra não conflitar com um fechamento de
   folha em andamento.
3. Rodar com acesso simultâneo ao Postgres restaurado do Alterdata (hoje
   só acessível via pgAdmin III no notebook do Beny, rede local) **e** ao
   Postgres do Murade (Render) — hoje nenhum ambiente tem os dois ao
   mesmo tempo.

**Decidido (05/11/2026): rodar o importador direto no notebook do Beny**,
não expor o Postgres restaurado nem exportar dump. Justificativa: o
notebook já enxerga os dois lados ao mesmo tempo — o restaurado por
`localhost:5432` (rede local) e o Postgres do Murade no Render pela
internet normal (todas as instâncias do Render usadas aqui têm
`ipAllowList` liberado, então qualquer máquina com internet alcança).
Isso evita criar infraestrutura nova (banco temporário no Render custa
e dá outro lugar pra vazar dado) e evita expor a porta 5432 do
restaurado pra internet (rede doméstica, sem necessidade). Passo a
passo:
1. Rodar primeiro em **modo dry-run** (só lê o Alterdata restaurado,
   não escreve em lugar nenhum) — não precisa nem de
   `DP_DATA_ENCRYPTION_KEY` nem de acesso de escrita ao Render, só o
   Node.js instalado no notebook e o código do importador.
2. Conferir o relatório do dry-run (quantas empresas, quantos
   funcionários, o que ficaria só em `origemAlterdata` por falta de
   campo no Murade) antes de cogitar escrever de verdade.
3. Só depois disso, e com o Beny por perto (mesma régua que ele já usa
   pra nota fiscal: operação sensível, quer acompanhar), rodar contra o
   Murade DP **de homologação** primeiro (`murade-dp-homologacao`,
   banco próprio, sem risco pra produção) — e só então, se tudo bater,
   contra produção, com `DP_DATA_ENCRYPTION_KEY` de produção informada
   na hora (não guardada solta no notebook).

## Próximos passos (bloqueados até ter mais acesso ao banco restaurado)

1. ~~Terminar de extrair as colunas 13-70 de `wphd.empresa`~~ — feito
   (05/11/2026, lista completa das 70 colunas acima). Ainda falta
   confirmar a chave que liga esse cadastro mestre às tabelas de
   configuração `wfiscal.empresa` / `wdp.empdp` / `wcont.empcont` por
   `cdempresa`/`idempresa`. A tabela de sócios (`wdp.tb*`) e a de Simples
   Nacional (`wfiscal.empssimples`) já foram achadas (ver acima); falta só
   achar onde distingue Lucro Presumido de Lucro Real.
2. ~~Checar `wdp.empcon`~~ e ~~achar a ligação DP↔Contábil~~ — ambos
   feitos: `wdp.empcon` é cadastro de empresa contratada/tomadora de
   serviço (terceirização), não ligação entre módulos. E a "ligação" nem
   precisava de tabela própria: DP e Contábil já batem pelo mesmo
   `cdempresa` de `wphd.empresa` (sufixo das tabelas particionadas), e do
   lado Murade a chave sempre foi o CNPJ mesmo (ver seção acima).
3. ~~Descobrir a tabela de mapeamento do sufixo numérico~~ e ~~confirmar que
   bate com `cdempresa`~~ — ambos feitos e confirmados (05/11/2026, ver
   seção acima): o sufixo numérico de 5 dígitos é exatamente o `cdempresa`
   de `wphd.empresa`, sem tabela de mapeamento à parte (com a ressalva de
   4 empresas cadastradas no mestre sem tabelas de DP).
4. ~~Levantar estrutura de `wdp` e `wcont` por família de prefixo~~ e
   ~~entender os pares estruturalmente idênticos~~ — ambos feitos: 22
   famílias de `wdp`, 13 de `wcont`, e confirmado (05/11/2026, ver seção
   acima) que `cc`/`cl`/`cs`/`ct`/`sc`/`cm` são tabelas mortas (zero linhas
   em toda empresa testada) — as ativas são `lt`/`sd`/`mv`.
5. ~~Localizar a tabela de enquadramento tributário~~ — parcialmente
   feito: Simples Nacional achado em `wfiscal.empssimples`. Não achamos
   uma tabela separada pra Presumido vs. Real — mas confirmamos que o
   próprio Murade também não rastreia isso por período (só um campo
   atual), então não é bloqueante: o importador grava o valor mais atual
   que conseguir inferir.
6. ~~Levantar o schema de destino real nos sistemas Murade~~ — feito
   (05/11/2026, ver seção "Schema de destino no Murade" acima). Achado
   principal: não tem ORM/migrations, tabelas usam payload jsonb ou
   cifrado (AES-256-GCM); faltam 4 tabelas no Murade pra não perder dado
   (férias por período, histórico de cargo, contribuição sindical mensal,
   histórico de regime tributário — ver tabela de gaps acima).
7. ~~Decidir o caminho de execução do importador~~ — decidido (05/11/2026,
   ver seção "Risco técnico" acima): importador novo lendo direto do
   Postgres restaurado, rodando no próprio notebook do Beny (já enxerga
   os dois bancos ao mesmo tempo), em 3 passos: dry-run → homologação →
   produção. Não vai precisar adaptar os importadores CSV/XML que já
   existem (`MuradeMigracao.ts`, `muradeDpMigracao.ts`,
   `migracaoContabilService.ts`) — caminhos independentes.
8. ~~Criar as tabelas novas de destino~~ e ~~escrever o código do
   importador~~ — em andamento (05/11/2026): implementação disparada num
   agente separado (tabelas `dp_ferias_periodos`/`dp_historico_cargo`/
   `dp_contribuicao_sindical_mes` + `alterdataMigracao.ts`, modo dry-run
   por padrão, sem push até revisão). **Pendência conhecida:** esse
   agente recebeu só a lista parcial antiga de colunas de `wdp.f*`
   (~25 campos); a lista completa (262 colunas, ver seção acima) só foi
   extraída depois — o mapeamento de funcionário precisa ser revisado
   contra a lista completa antes de considerar pronto. A 4ª tabela
   (`fiscal_regime_tributario_historico`, no repo `murade-fiscal`) ainda
   não foi criada — ficou fora do escopo desse agente (só DP).
9. Testar o importador contra uma cópia/amostra dos dados antes de rodar
   contra os dados reais de produção.
10. Nunca replicar bugs conhecidos do Alterdata (cálculo de Simples
    Nacional e agendamento automático de guias falham com frequência,
    segundo relato do Beny — motivo inclusive de multas em clientes
    dele). A migração traz só dado, nunca lógica de cálculo.

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
