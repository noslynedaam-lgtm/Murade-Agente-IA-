// Registro das perguntas/respostas do Consultor e do resultado do robô conferidor.
// Com DATABASE_URL (o mesmo Postgres que o serviço já usa para as contas), grava em tabelas próprias.
// Sem DATABASE_URL, guarda em memória com limite (some quando o serviço reinicia).
import pg from 'pg';
import { mascararObjeto, mascararTexto } from './mascarar';
import type { Area, Confianca, Decisao, Fonte, RespostaConsultor, Sistema } from './tipos';

export type RegistroConsulta = {
  id?: string;
  criadoEm?: string;
  sistema: Sistema;
  pergunta: string;
  resposta: string;
  area: Area;
  confianca: Confianca;
  encaminharContador: boolean;
  motivoEncaminhamento?: string;
  fontes: Fonte[];
  regime?: string;
  modelo?: string;
  situacao: 'respondida' | 'gemini_indisponivel' | 'erro' | 'nao_liberado';
};

export type ResultadoTeste = { id: string; pergunta: string; situacao: 'acertou' | 'errou' | 'nao_testado'; faltou?: string[]; detalhe?: string; origem?: 'pronta' | 'cache' | 'ia' };

/** Liberação paga de um produto ('consultor' | 'escola') para um escritório (CNPJ). */
export type Liberacao = {
  escritorio: string;
  produto: 'consultor' | 'escola';
  liberado: boolean;
  nome?: string;
  plano?: string;
  observacao?: string;
  liberadoPor: string;
  quando: string;
};

/** Resposta da IA guardada para perguntas repetidas (sem dados de empresa ou pessoa). */
export type EntradaCache = {
  chave: string;
  area: string;
  pergunta: string; // pergunta normalizada
  resposta: RespostaConsultor;
  versaoBase: string;
  criadoEm: string;
  expiraEm: string;
};

/** Consumo por escritório, produto e mês (AAAA-MM), para cobrança. */
export type Consumo = {
  escritorio: string;
  produto: 'consultor' | 'escola';
  mes: string;
  perguntas: number;
  ia: number;
  prontas: number;
  cache: number;
  bloqueadas: number;
  usos: number;
  tokensEntrada: number;
  tokensSaida: number;
  tokensTotal: number;
};

export const CONSUMO_ZERO = { perguntas: 0, ia: 0, prontas: 0, cache: 0, bloqueadas: 0, usos: 0, tokensEntrada: 0, tokensSaida: 0, tokensTotal: 0 };
export type IncrementoConsumo = Pick<Consumo, 'escritorio' | 'produto' | 'mes'> & Partial<Omit<Consumo, 'escritorio' | 'produto' | 'mes'>>;
export type SaudeConsultor = {
  quando: string;
  situacao: 'ok' | 'com_falhas' | 'nao_testado';
  total: number;
  acertos: number;
  erros: number;
  naoTestados: number;
  resultados: ResultadoTeste[];
  /** Conferência das respostas prontas: fonte oficial, data e as com mais de 180 dias sem conferir. */
  respostasProntas?: import('./economia').ConferenciaProntas;
};

export interface Armazem {
  tipo: 'postgres' | 'memoria';
  salvar(r: RegistroConsulta): Promise<void>;
  naoRespondidas(limite: number): Promise<RegistroConsulta[]>;
  salvarSaude(s: SaudeConsultor): Promise<void>;
  ultimaSaude(): Promise<SaudeConsultor | null>;
  salvarDecisao(d: Decisao): Promise<Decisao>;
  decisoes(escritorio: string | undefined, limite: number): Promise<Decisao[]>;
  lerCache(chave: string): Promise<EntradaCache | null>;
  salvarCache(e: EntradaCache): Promise<void>;
  liberacao(escritorio: string, produto: Liberacao['produto']): Promise<Liberacao | null>;
  liberacoes(): Promise<Liberacao[]>;
  salvarLiberacao(l: Liberacao): Promise<Liberacao>;
  somarConsumo(c: IncrementoConsumo): Promise<void>;
  consumo(mes: string): Promise<Consumo[]>;
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.round(v) : 0);

/** Remove dados pessoais da decisão antes de gravar. */
export function limparDecisao(d: Decisao): Decisao {
  return {
    ...d,
    escritorio: mascararTexto(d.escritorio).slice(0, 80),
    usuario: mascararTexto(d.usuario).slice(0, 80),
    pergunta: mascararTexto(d.pergunta).slice(0, 30000),
    orientacao: mascararTexto(d.orientacao).slice(0, 4000),
    escolhaDoContador: mascararTexto(d.escolhaDoContador).slice(0, 4000),
  };
}

/** Remove dados pessoais antes de gravar. */
export function limparRegistro(r: RegistroConsulta): RegistroConsulta {
  return {
    ...r,
    pergunta: mascararTexto(r.pergunta).slice(0, 30000),
    resposta: mascararTexto(r.resposta).slice(0, 12000),
    motivoEncaminhamento: r.motivoEncaminhamento ? mascararTexto(r.motivoEncaminhamento).slice(0, 500) : undefined,
    fontes: mascararObjeto(r.fontes),
  };
}

const precisaCompletar = (r: RegistroConsulta) => r.confianca === 'baixa' || r.encaminharContador || r.situacao !== 'respondida';

export function criarArmazemMemoria(limite = 500): Armazem {
  const registros: RegistroConsulta[] = [];
  let saude: SaudeConsultor | null = null;
  let seq = 0;
  const decisoes: Decisao[] = [];
  const cache = new Map<string, EntradaCache>();
  const liberacoes = new Map<string, Liberacao>();
  const consumo = new Map<string, Consumo>();
  return {
    tipo: 'memoria',
    async lerCache(chave) {
      const e = cache.get(chave);
      if (!e) return null;
      if (Date.parse(e.expiraEm) <= Date.now()) {
        cache.delete(chave);
        return null;
      }
      return e;
    },
    async salvarCache(e) {
      cache.set(e.chave, e);
      if (cache.size > 2000) cache.delete(cache.keys().next().value as string);
    },
    async liberacao(escritorio, produto) {
      return liberacoes.get(`${escritorio}|${produto}`) ?? null;
    },
    async liberacoes() {
      return [...liberacoes.values()].sort((a, b) => a.escritorio.localeCompare(b.escritorio) || a.produto.localeCompare(b.produto));
    },
    async salvarLiberacao(l) {
      const k = `${l.escritorio}|${l.produto}`;
      const antes = liberacoes.get(k);
      // Igual ao Postgres: nome/plano/observação não informados mantêm o valor anterior.
      const x: Liberacao = { ...l, nome: l.nome ?? antes?.nome, plano: l.plano ?? antes?.plano, observacao: l.observacao ?? antes?.observacao };
      liberacoes.set(k, x);
      return { ...x };
    },
    async somarConsumo(c) {
      const k = `${c.escritorio}|${c.produto}|${c.mes}`;
      const atual = consumo.get(k) ?? { escritorio: c.escritorio, produto: c.produto, mes: c.mes, ...CONSUMO_ZERO };
      for (const campo of Object.keys(CONSUMO_ZERO) as (keyof typeof CONSUMO_ZERO)[]) atual[campo] += num(c[campo]);
      consumo.set(k, atual);
    },
    async consumo(mes) {
      return [...consumo.values()].filter((c) => c.mes === mes).map((c) => ({ ...c }));
    },
    async salvar(r) {
      registros.push({ ...limparRegistro(r), id: String(++seq), criadoEm: new Date().toISOString() });
      if (registros.length > limite) registros.splice(0, registros.length - limite);
    },
    async naoRespondidas(n) {
      return registros.filter(precisaCompletar).slice(-n).reverse();
    },
    async salvarSaude(s) {
      saude = s;
    },
    async ultimaSaude() {
      return saude;
    },
    async salvarDecisao(d) {
      const x = { ...limparDecisao(d), id: String(++seq), criadoEm: new Date().toISOString() };
      decisoes.push(x);
      if (decisoes.length > limite) decisoes.splice(0, decisoes.length - limite);
      return x;
    },
    async decisoes(escritorio, n) {
      return decisoes.filter((d) => !escritorio || d.escritorio === escritorio).slice(-n).reverse();
    },
  };
}

export function criarArmazemPostgres(url: string): Armazem {
  const pool = new pg.Pool({ connectionString: url, max: 2, ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false } });
  let pronto: Promise<void> | null = null;
  const preparar = () =>
    (pronto ??= (async () => {
      await pool.query(`CREATE TABLE IF NOT EXISTS consultor_registros(
        id bigserial PRIMARY KEY,
        criado_em timestamptz NOT NULL DEFAULT now(),
        sistema text NOT NULL,
        pergunta text NOT NULL,
        resposta text NOT NULL,
        area text NOT NULL,
        confianca text NOT NULL,
        encaminhar boolean NOT NULL,
        motivo text,
        fontes jsonb NOT NULL DEFAULT '[]'::jsonb,
        regime text,
        modelo text,
        situacao text NOT NULL)`);
      await pool.query('CREATE INDEX IF NOT EXISTS consultor_registros_pendentes ON consultor_registros(criado_em DESC) WHERE confianca = \'baixa\' OR encaminhar OR situacao <> \'respondida\'');
      await pool.query(`CREATE TABLE IF NOT EXISTS consultor_decisoes(
        id bigserial PRIMARY KEY,
        criado_em timestamptz NOT NULL DEFAULT now(),
        data timestamptz NOT NULL,
        escritorio text NOT NULL,
        usuario text NOT NULL,
        sistema text NOT NULL,
        pergunta text NOT NULL,
        orientacao text NOT NULL,
        fonte jsonb,
        escolha text NOT NULL,
        origem text NOT NULL)`);
      await pool.query('CREATE INDEX IF NOT EXISTS consultor_decisoes_escritorio ON consultor_decisoes(escritorio, criado_em DESC)');
      await pool.query('CREATE TABLE IF NOT EXISTS consultor_saude(id bigserial PRIMARY KEY, criado_em timestamptz NOT NULL DEFAULT now(), resultado jsonb NOT NULL)');
      await pool.query(`CREATE TABLE IF NOT EXISTS consultor_cache(
        chave text PRIMARY KEY,
        area text NOT NULL,
        pergunta text NOT NULL,
        resposta jsonb NOT NULL,
        versao_base text NOT NULL,
        criado_em timestamptz NOT NULL DEFAULT now(),
        expira_em timestamptz NOT NULL,
        usos integer NOT NULL DEFAULT 0)`);
      await pool.query(`CREATE TABLE IF NOT EXISTS consultor_liberacoes(
        escritorio_cnpj text NOT NULL,
        produto text NOT NULL DEFAULT 'consultor',
        liberado boolean NOT NULL,
        nome text,
        plano text,
        observacao text,
        liberado_por text NOT NULL,
        quando timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (escritorio_cnpj, produto))`);
      await pool.query(`CREATE TABLE IF NOT EXISTS consultor_consumo(
        escritorio text NOT NULL,
        produto text NOT NULL DEFAULT 'consultor',
        mes text NOT NULL,
        perguntas integer NOT NULL DEFAULT 0,
        com_ia integer NOT NULL DEFAULT 0,
        prontas integer NOT NULL DEFAULT 0,
        cache integer NOT NULL DEFAULT 0,
        bloqueadas integer NOT NULL DEFAULT 0,
        usos integer NOT NULL DEFAULT 0,
        tokens_entrada bigint NOT NULL DEFAULT 0,
        tokens_saida bigint NOT NULL DEFAULT 0,
        tokens_total bigint NOT NULL DEFAULT 0,
        PRIMARY KEY (escritorio, produto, mes))`);
    })().catch((e) => {
      pronto = null;
      throw e;
    }));

  const linhaLiberacao = (l: any): Liberacao => ({
    escritorio: l.escritorio_cnpj,
    produto: l.produto,
    liberado: l.liberado,
    nome: l.nome ?? undefined,
    plano: l.plano ?? undefined,
    observacao: l.observacao ?? undefined,
    liberadoPor: l.liberado_por,
    quando: new Date(l.quando).toISOString(),
  });
  return {
    tipo: 'postgres',
    async lerCache(chave) {
      await preparar();
      const { rows } = await pool.query('UPDATE consultor_cache SET usos = usos + 1 WHERE chave = $1 AND expira_em > now() RETURNING *', [chave]);
      const l = rows[0];
      if (!l) return null;
      return { chave: l.chave, area: l.area, pergunta: l.pergunta, resposta: l.resposta, versaoBase: l.versao_base, criadoEm: new Date(l.criado_em).toISOString(), expiraEm: new Date(l.expira_em).toISOString() };
    },
    async salvarCache(e) {
      await preparar();
      await pool.query(
        `INSERT INTO consultor_cache(chave, area, pergunta, resposta, versao_base, criado_em, expira_em) VALUES($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (chave) DO UPDATE SET resposta = EXCLUDED.resposta, criado_em = EXCLUDED.criado_em, expira_em = EXCLUDED.expira_em, versao_base = EXCLUDED.versao_base`,
        [e.chave, e.area, e.pergunta, JSON.stringify(e.resposta), e.versaoBase, e.criadoEm, e.expiraEm],
      );
      // Limpeza leve: vencidas e de versões antigas da base.
      if (Math.random() < 0.05) await pool.query('DELETE FROM consultor_cache WHERE expira_em < now() OR versao_base <> $1', [e.versaoBase]);
    },
    async liberacao(escritorio, produto) {
      await preparar();
      const { rows } = await pool.query('SELECT * FROM consultor_liberacoes WHERE escritorio_cnpj = $1 AND produto = $2', [escritorio, produto]);
      return rows[0] ? linhaLiberacao(rows[0]) : null;
    },
    async liberacoes() {
      await preparar();
      const { rows } = await pool.query('SELECT * FROM consultor_liberacoes ORDER BY escritorio_cnpj, produto');
      return rows.map(linhaLiberacao);
    },
    async salvarLiberacao(l) {
      await preparar();
      const { rows } = await pool.query(
        `INSERT INTO consultor_liberacoes(escritorio_cnpj, produto, liberado, nome, plano, observacao, liberado_por, quando) VALUES($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (escritorio_cnpj, produto) DO UPDATE SET liberado = EXCLUDED.liberado,
           nome = COALESCE(EXCLUDED.nome, consultor_liberacoes.nome), plano = COALESCE(EXCLUDED.plano, consultor_liberacoes.plano),
           observacao = COALESCE(EXCLUDED.observacao, consultor_liberacoes.observacao), liberado_por = EXCLUDED.liberado_por, quando = EXCLUDED.quando
         RETURNING *`,
        [l.escritorio, l.produto, l.liberado, l.nome ?? null, l.plano ?? null, l.observacao ?? null, l.liberadoPor, l.quando],
      );
      return linhaLiberacao(rows[0]);
    },
    async somarConsumo(c) {
      await preparar();
      await pool.query(
        `INSERT INTO consultor_consumo(escritorio, produto, mes, perguntas, com_ia, prontas, cache, bloqueadas, usos, tokens_entrada, tokens_saida, tokens_total)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (escritorio, produto, mes) DO UPDATE SET
           perguntas = consultor_consumo.perguntas + EXCLUDED.perguntas, com_ia = consultor_consumo.com_ia + EXCLUDED.com_ia,
           prontas = consultor_consumo.prontas + EXCLUDED.prontas, cache = consultor_consumo.cache + EXCLUDED.cache,
           bloqueadas = consultor_consumo.bloqueadas + EXCLUDED.bloqueadas, usos = consultor_consumo.usos + EXCLUDED.usos,
           tokens_entrada = consultor_consumo.tokens_entrada + EXCLUDED.tokens_entrada, tokens_saida = consultor_consumo.tokens_saida + EXCLUDED.tokens_saida,
           tokens_total = consultor_consumo.tokens_total + EXCLUDED.tokens_total`,
        [c.escritorio, c.produto, c.mes, num(c.perguntas), num(c.ia), num(c.prontas), num(c.cache), num(c.bloqueadas), num(c.usos), num(c.tokensEntrada), num(c.tokensSaida), num(c.tokensTotal)],
      );
    },
    async consumo(mes) {
      await preparar();
      const { rows } = await pool.query('SELECT * FROM consultor_consumo WHERE mes = $1 ORDER BY escritorio, produto', [mes]);
      return rows.map((l: any) => ({
        escritorio: l.escritorio,
        produto: l.produto,
        mes: l.mes,
        perguntas: Number(l.perguntas),
        ia: Number(l.com_ia),
        prontas: Number(l.prontas),
        cache: Number(l.cache),
        bloqueadas: Number(l.bloqueadas),
        usos: Number(l.usos),
        tokensEntrada: Number(l.tokens_entrada),
        tokensSaida: Number(l.tokens_saida),
        tokensTotal: Number(l.tokens_total),
      }));
    },
    async salvar(r) {
      await preparar();
      const x = limparRegistro(r);
      await pool.query(
        'INSERT INTO consultor_registros(sistema, pergunta, resposta, area, confianca, encaminhar, motivo, fontes, regime, modelo, situacao) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        [x.sistema, x.pergunta, x.resposta, x.area, x.confianca, x.encaminharContador, x.motivoEncaminhamento ?? null, JSON.stringify(x.fontes), x.regime ?? null, x.modelo ?? null, x.situacao],
      );
      // Mantém só 1 ano de histórico (limpeza leve, de vez em quando).
      if (Math.random() < 0.02) await pool.query("DELETE FROM consultor_registros WHERE criado_em < now() - interval '365 days'");
    },
    async naoRespondidas(n) {
      await preparar();
      const { rows } = await pool.query(
        "SELECT * FROM consultor_registros WHERE confianca = 'baixa' OR encaminhar OR situacao <> 'respondida' ORDER BY criado_em DESC LIMIT $1",
        [n],
      );
      return rows.map((l: any) => ({
        id: String(l.id),
        criadoEm: new Date(l.criado_em).toISOString(),
        sistema: l.sistema,
        pergunta: l.pergunta,
        resposta: l.resposta,
        area: l.area,
        confianca: l.confianca,
        encaminharContador: l.encaminhar,
        motivoEncaminhamento: l.motivo ?? undefined,
        fontes: l.fontes ?? [],
        regime: l.regime ?? undefined,
        modelo: l.modelo ?? undefined,
        situacao: l.situacao,
      }));
    },
    async salvarSaude(s) {
      await preparar();
      await pool.query('INSERT INTO consultor_saude(resultado) VALUES($1)', [JSON.stringify(s)]);
      await pool.query("DELETE FROM consultor_saude WHERE criado_em < now() - interval '90 days'");
    },
    async ultimaSaude() {
      await preparar();
      const { rows } = await pool.query('SELECT resultado FROM consultor_saude ORDER BY criado_em DESC LIMIT 1');
      return rows[0]?.resultado ?? null;
    },
    async salvarDecisao(d) {
      await preparar();
      const x = limparDecisao(d);
      const { rows } = await pool.query(
        'INSERT INTO consultor_decisoes(data, escritorio, usuario, sistema, pergunta, orientacao, fonte, escolha, origem) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, criado_em',
        [x.data, x.escritorio, x.usuario, x.sistema, x.pergunta, x.orientacao, x.fonte ? JSON.stringify(x.fonte) : null, x.escolhaDoContador, x.origem],
      );
      return { ...x, id: String(rows[0].id), criadoEm: new Date(rows[0].criado_em).toISOString() };
    },
    async decisoes(escritorio, n) {
      await preparar();
      const { rows } = escritorio
        ? await pool.query('SELECT * FROM consultor_decisoes WHERE escritorio = $1 ORDER BY criado_em DESC LIMIT $2', [escritorio, n])
        : await pool.query('SELECT * FROM consultor_decisoes ORDER BY criado_em DESC LIMIT $1', [n]);
      return rows.map((l: any) => ({
        id: String(l.id),
        criadoEm: new Date(l.criado_em).toISOString(),
        data: new Date(l.data).toISOString(),
        escritorio: l.escritorio,
        usuario: l.usuario,
        sistema: l.sistema,
        pergunta: l.pergunta,
        orientacao: l.orientacao,
        fonte: l.fonte ?? null,
        escolhaDoContador: l.escolha,
        origem: l.origem,
      }));
    },
  };
}

/** Postgres quando houver DATABASE_URL; se o banco falhar, cai para a memória sem derrubar o consultor. */
export function criarArmazem(): Armazem {
  const memoria = criarArmazemMemoria();
  const url = process.env.DATABASE_URL;
  if (!url) return memoria;
  const banco = criarArmazemPostgres(url);
  const comReserva = <A extends unknown[], R>(f: (...a: A) => Promise<R>, g: (...a: A) => Promise<R>) =>
    async (...a: A): Promise<R> => {
      try {
        return await f(...a);
      } catch (e) {
        console.error('[consultor] banco indisponível, usando memória:', (e as Error)?.message);
        return g(...a);
      }
    };
  return {
    tipo: 'postgres',
    salvar: comReserva(banco.salvar, memoria.salvar),
    naoRespondidas: comReserva(banco.naoRespondidas, memoria.naoRespondidas),
    salvarSaude: comReserva(banco.salvarSaude, memoria.salvarSaude),
    ultimaSaude: comReserva(banco.ultimaSaude, memoria.ultimaSaude),
    salvarDecisao: comReserva(banco.salvarDecisao, memoria.salvarDecisao),
    decisoes: comReserva(banco.decisoes, memoria.decisoes),
    lerCache: comReserva(banco.lerCache, memoria.lerCache),
    salvarCache: comReserva(banco.salvarCache, memoria.salvarCache),
    liberacao: comReserva(banco.liberacao, memoria.liberacao),
    liberacoes: comReserva(banco.liberacoes, memoria.liberacoes),
    // Liberar/desligar é decisão do dono: se o banco falhar, avisa (não grava só na memória, que some no reinício).
    salvarLiberacao: banco.salvarLiberacao,
    somarConsumo: comReserva(banco.somarConsumo, memoria.somarConsumo),
    consumo: comReserva(banco.consumo, memoria.consumo),
  };
}
