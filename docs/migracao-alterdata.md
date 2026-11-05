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
colunas; confirmadas até agora (ordinal 1 a 12):

| # | Coluna | Tipo |
|---|--------|------|
| 1 | `cdempresa` | integer |
| 2 | `nmempresa` | character varying |
| 3 | `nmfantasia` | character varying |
| 4 | `dsatividade` | character varying |
| 5 | `dsendereco` | character varying |
| 6 | `nmbairro` | character varying |
| 7 | `nmcidade` | character varying |
| 8 | `nrcep` | character varying |
| 9 | `cduf` | character varying |
| 10 | `nrtelefone` | character varying |
| 11 | `nrinscrmunicipal` | character varying |
| 12 | `nrinscrestadual` | character varying |

Faltam as colunas 13-70 (inclui com certeza CNPJ e provavelmente sócios,
e-mail, regime tributário geral) — ficou pendente porque o pgAdmin no
notebook do Beny voltou a pedir senha do Postgres no meio da extração.
Próxima sessão com acesso: terminar esse SELECT e também conferir se
`wphd.empresa.cdempresa` é a chave que liga com `wfiscal.empresa.cdempresa` /
`wdp.empdp.idempresa` / `wcont.empcont.idempresa` (os três módulos
provavelmente referenciam o cadastro mestre do `wphd` pelo mesmo código).

Também achamos `wdp.empcon` (schema `wdp`, nome parecido mas diferente de
`empcont` que é do `wcont`) — ainda não inspecionado, mas o nome sugere que
pode ser uma tabela de ligação DP↔Contábil, vale checar antes de montar o
de-para final.

### Achado importante: dados particionados por empresa em tabelas separadas

Em vários pontos (principalmente `wcont`), a Alterdata não guarda os dados
de todas as empresas numa tabela só com uma coluna `empresa_id` — ela cria
uma tabela física por empresa, numerada, por tipo de dado. Exemplos vistos:

- `cc00001`, `cc00002`, ..., `cc99999` (um tipo de dado, provavelmente conta
  corrente ou centro de custo — ainda não confirmado)
- `cl00001`, `cl00002`, ... (outro tipo de dado)
- `cm00001`, `cm00002`, ... (outro tipo de dado)

Isso muda a estratégia do importador: não dá pra simplesmente fazer um
`SELECT * FROM tabela WHERE empresa_id = X` — para esses grupos de tabela,
o importador vai ter que descobrir o sufixo numérico que corresponde a cada
empresa (provavelmente existe uma tabela de mapeamento tipo "código interno
da empresa → sufixo", ainda não localizada) e ler a tabela certa por
empresa.

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

1. Terminar de extrair as colunas 13-70 de `wphd.empresa` (o cadastro
   mestre de verdade — ver seção acima) e confirmar a chave que liga esse
   cadastro mestre às tabelas de configuração `wfiscal.empresa` /
   `wdp.empdp` / `wcont.empcont` por `cdempresa`/`idempresa`.
2. Checar `wdp.empcon` — pode ser a ligação DP↔Contábil.
3. Descobrir a tabela de mapeamento do sufixo numérico das tabelas
   particionadas por empresa (`cc00001` etc.) — provavelmente alguma
   tabela de "empresa" ou "configuração" tem uma coluna com esse número.
4. Levantar estrutura de `wdp` pras tabelas de funcionário/folha
   (candidatas: tabelas que começam com `func*`, `evento*`, `rpadrao`,
   `rporig`) pra desenhar o importador de DP.
5. Depois de ter colunas + tipos de dado, desenhar o ETL real (provável
   abordagem: um robô/serviço batch que lê direto do Postgres restaurado
   — ou de um dump exportado — e grava no schema do Murade, nunca
   reaproveitando lógica de cálculo do Alterdata, só os dados brutos).
6. Nunca replicar bugs conhecidos do Alterdata (cálculo de Simples
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
