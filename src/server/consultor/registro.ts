// Registro das perguntas/respostas do Consultor e do resultado do robô conferidor.
// Com DATABASE_URL (o mesmo Postgres que o serviço já usa para as contas), grava em tabelas próprias.
// Sem DATABASE_URL, guarda em memória com limite (some quando o serviço reinicia).
import pg from 'pg';
import { mascararObjeto, mascararTexto } from './mascarar';
import type { Area, Confianca, Decisao, Fonte, Sistema } from './tipos';

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
  situacao: 'respondida' | 'gemini_indisponivel' | 'erro';
};

export type ResultadoTeste = { id: string; pergunta: string; situacao: 'acertou' | 'errou' | 'nao_testado'; faltou?: string[]; detalhe?: string };
export type SaudeConsultor = {
  quando: string;
  situacao: 'ok' | 'com_falhas' | 'nao_testado';
  total: number;
  acertos: number;
  erros: number;
  naoTestados: number;
  resultados: ResultadoTeste[];
};

export interface Armazem {
  tipo: 'postgres' | 'memoria';
  salvar(r: RegistroConsulta): Promise<void>;
  naoRespondidas(limite: number): Promise<RegistroConsulta[]>;
  salvarSaude(s: SaudeConsultor): Promise<void>;
  ultimaSaude(): Promise<SaudeConsultor | null>;
  salvarDecisao(d: Decisao): Promise<Decisao>;
  decisoes(escritorio: string | undefined, limite: number): Promise<Decisao[]>;
}

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
  return {
    tipo: 'memoria',
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
    })().catch((e) => {
      pronto = null;
      throw e;
    }));

  return {
    tipo: 'postgres',
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
  };
}
