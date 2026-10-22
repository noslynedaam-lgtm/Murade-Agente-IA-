import crypto from 'node:crypto';
import pg from 'pg';
import type { Express, Request, Response } from 'express';

// Contas PRÓPRIAS do Agente IA (login independente), no mesmo modelo de escritórios do Fiscal e do DP:
// dono do sistema → escritórios (cada um com equipe e limite de usuários) → usuários.
// Só ativa com DATABASE_URL. Sem ele, o Agente segue entrando pela conta do DP (modo anterior).
let pool: pg.Pool | null = null;
export const contasAtivas = (): boolean => Boolean(process.env.DATABASE_URL);
function db(): pg.Pool {
  if (!pool) pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 4, ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '') ? undefined : { rejectUnauthorized: false } });
  return pool;
}
let pronto: Promise<void> | null = null;
export function prepararContas(): Promise<void> {
  if (!pronto) pronto = (async () => {
    await db().query(`CREATE TABLE IF NOT EXISTS agente_users(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), login text UNIQUE NOT NULL, password_salt text NOT NULL, password_hash text NOT NULL,
      office_admin boolean NOT NULL DEFAULT false, office_owner uuid, tenant_id uuid, disabled boolean NOT NULL DEFAULT false,
      max_usuarios integer, created_at timestamptz NOT NULL DEFAULT now())`);
    await db().query(`CREATE TABLE IF NOT EXISTS agente_invites(
      token_hash text PRIMARY KEY, login text NOT NULL, created_by uuid NOT NULL, office_owner uuid, novo_escritorio boolean NOT NULL DEFAULT false,
      expires_at timestamptz NOT NULL, redefinir_senha boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now())`);
    await db().query('ALTER TABLE agente_invites ADD COLUMN IF NOT EXISTS redefinir_senha boolean NOT NULL DEFAULT false');
  })().catch((e) => { pronto = null; throw e; });
  return pronto;
}

const kdf = (senha: string, salt: string) => new Promise<Buffer>((ok, no) => crypto.scrypt(senha, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (e, k) => e ? no(e) : ok(k)));
const LOGIN_OK = /^[a-z0-9._@+-]{3,80}$/;
const falhas = new Map<string, { n: number; ate: number }>();

export type UsuarioConta = { id: string; login: string; ehEscritorio: boolean; donoSistema: boolean; tenantId: string };

async function ehDono(id: string, login: string): Promise<boolean> {
  const lista = (process.env.MURADE_DONO_SISTEMA || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (lista.length) return lista.includes(login);
  const r = await db().query('SELECT id FROM agente_users WHERE office_admin=true ORDER BY created_at,id LIMIT 1');
  return String(r.rows[0]?.id) === String(id);
}

const cacheAtivo = new Map<string, { ate: number; v: UsuarioConta | null }>();
// Confere a cada requisição (cache de 10 s) se o usuário continua ativo: bloqueio de escritório vale logo.
export async function usuarioAtivo(id: string): Promise<UsuarioConta | null> {
  const c = cacheAtivo.get(id); if (c && c.ate > Date.now()) return c.v;
  await prepararContas();
  const r = await db().query('SELECT id,login,office_admin,tenant_id FROM agente_users WHERE id=$1 AND disabled=false', [id]);
  const u = r.rows[0];
  const v: UsuarioConta | null = u ? { id: u.id, login: u.login, ehEscritorio: u.office_admin === true, donoSistema: u.office_admin === true && await ehDono(u.id, u.login), tenantId: String(u.tenant_id || u.id) } : null;
  cacheAtivo.set(id, { ate: Date.now() + 10_000, v }); return v;
}
const limparCache = () => cacheAtivo.clear();

export async function entrarLocal(login: string, senha: string, ip: string): Promise<{ ok: true; usuario: UsuarioConta } | { ok: false; status: number; motivo: string } | null> {
  const f = falhas.get(ip);
  if (f && f.ate > Date.now() && f.n >= 8) return { ok: false, status: 429, motivo: 'Muitas tentativas. Aguarde 15 minutos.' };
  await prepararContas();
  const r = await db().query('SELECT id,password_salt,password_hash,disabled FROM agente_users WHERE login=$1', [login]);
  const row = r.rows[0];
  if (!row) return null; // não é conta local: o chamador tenta o modo anterior (DP)
  const atual = await kdf(senha, row.password_salt); const esperado = Buffer.from(row.password_hash, 'hex');
  const valida = atual.length === esperado.length && crypto.timingSafeEqual(atual, esperado);
  if (!valida || row.disabled) {
    const c = falhas.get(ip); falhas.set(ip, c && c.ate > Date.now() ? { n: c.n + 1, ate: c.ate } : { n: 1, ate: Date.now() + 15 * 60_000 });
    return { ok: false, status: 401, motivo: row.disabled && valida ? 'Acesso bloqueado. Fale com o fornecedor.' : 'Usuário ou senha incorretos.' };
  }
  falhas.delete(ip);
  const u = await usuarioAtivo(row.id); return u ? { ok: true, usuario: u } : { ok: false, status: 401, motivo: 'Acesso indisponível.' };
}

export async function haUsuarios(): Promise<boolean> { await prepararContas(); return (await db().query('SELECT 1 FROM agente_users LIMIT 1')).rowCount! > 0; }

const baseUrl = (req: Request) => process.env.PUBLIC_APP_URL?.trim() || process.env.RENDER_EXTERNAL_URL?.trim() || `${req.protocol}://${req.get('host')}`;
function linkConvite(req: Request, token: string, login: string, redefinirSenha = false) { const params = new URLSearchParams({ convite: token, login }); if (redefinirSenha) params.set('redefinir', '1'); const u = new URL('/', baseUrl(req)); u.hash = params.toString(); return u.toString(); }
const hashToken = (t: string) => crypto.createHash('sha256').update(t).digest('hex');

async function limiteAtingido(donoId: string): Promise<string | null> {
  const r = await db().query(`SELECT o.max_usuarios,
    (SELECT count(*)::int FROM agente_users t WHERE t.tenant_id=o.id AND t.id<>o.id AND t.disabled=false)
    + (SELECT count(*)::int FROM agente_invites i WHERE i.office_owner=o.id AND i.expires_at>now()) AS equipe
    FROM agente_users o WHERE o.id=$1`, [donoId]);
  const l = r.rows[0]; if (!l || l.max_usuarios == null) return null;
  return 1 + Number(l.equipe) >= Number(l.max_usuarios) ? `O plano deste escritório permite ${l.max_usuarios} usuário(s) (dono incluso) e todos já estão em uso. Fale com o fornecedor para ampliar.` : null;
}

export async function criarPrimeiroAcesso(token: string, login: string, senha: string): Promise<{ ok: boolean; motivo?: string }> {
  const esperado = process.env.AGENTE_BOOTSTRAP_TOKEN || '';
  if (!esperado) return { ok: false, motivo: 'Primeiro acesso não está liberado neste serviço.' };
  const a = Buffer.from(token), b = Buffer.from(esperado);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, motivo: 'Chave de configuração incorreta.' };
  if (!LOGIN_OK.test(login) || senha.length < 12 || senha.length > 256) return { ok: false, motivo: 'Use um usuário válido e senha de 12 a 256 caracteres.' };
  await prepararContas();
  const c = await db().connect();
  try {
    await c.query('BEGIN'); await c.query('LOCK TABLE agente_users IN EXCLUSIVE MODE');
    if ((await c.query('SELECT 1 FROM agente_users LIMIT 1')).rowCount) { await c.query('ROLLBACK'); return { ok: false, motivo: 'A configuração inicial já foi concluída.' }; }
    const salt = crypto.randomBytes(16).toString('hex'); const hash = (await kdf(senha, salt)).toString('hex');
    const r = await c.query('INSERT INTO agente_users(login,password_salt,password_hash,office_admin,tenant_id) VALUES($1,$2,$3,true,gen_random_uuid()) RETURNING id', [login, salt, hash]);
    await c.query('UPDATE agente_users SET tenant_id=id WHERE id=$1', [r.rows[0].id]);
    await c.query('COMMIT'); return { ok: true };
  } catch (e) { await c.query('ROLLBACK').catch(() => undefined); throw e; } finally { c.release(); }
}

export async function resgatarConvite(login: string, senha: string, convite: string): Promise<{ ok: boolean; motivo?: string }> {
  if (!LOGIN_OK.test(login) || senha.length < 12 || senha.length > 256) return { ok: false, motivo: 'Use um usuário válido e senha de 12 a 256 caracteres.' };
  await prepararContas();
  const c = await db().connect();
  try {
    await c.query('BEGIN');
    const inv = await c.query('DELETE FROM agente_invites WHERE token_hash=$1 AND expires_at>now() RETURNING login,office_owner,novo_escritorio,redefinir_senha', [hashToken(convite)]);
    const i = inv.rows[0];
    if (!i || i.login !== login) { await c.query('ROLLBACK'); return { ok: false, motivo: 'Link inválido, usado ou expirado. Peça um novo.' }; }
    const salt = crypto.randomBytes(16).toString('hex'); const hash = (await kdf(senha, salt)).toString('hex');
    if (i.redefinir_senha === true) {
      const alterado = await c.query('UPDATE agente_users SET password_salt=$1,password_hash=$2 WHERE login=$3 AND office_owner IS NOT DISTINCT FROM $4 RETURNING id', [salt, hash, login, i.office_owner]);
      if (!alterado.rowCount) { await c.query('ROLLBACK'); return { ok: false, motivo: 'Esta conta não pertence mais à equipe. Peça um novo convite.' }; }
      await c.query('COMMIT'); return { ok: true };
    }
    if ((await c.query('SELECT 1 FROM agente_users WHERE login=$1', [login])).rowCount) { await c.query('ROLLBACK'); return { ok: false, motivo: 'Este usuário já existe.' }; }
    const id = crypto.randomUUID();
    const tenant = i.novo_escritorio ? id : i.office_owner;
    await c.query('INSERT INTO agente_users(id,login,password_salt,password_hash,office_admin,office_owner,tenant_id) VALUES($1,$2,$3,$4,$5,$6,$7)', [id, login, salt, hash, i.novo_escritorio === true, i.novo_escritorio ? null : i.office_owner, tenant]);
    await c.query('COMMIT'); return { ok: true };
  } catch (e) { await c.query('ROLLBACK').catch(() => undefined); throw e; } finally { c.release(); }
}

type Handler = (req: Request, res: Response, u: UsuarioConta) => Promise<void>;
export function registrarRotasDeContas(app: Express, usuarioDaRequisicao: (req: Request) => Promise<UsuarioConta | null>) {
  const com = (exige: 'escritorio' | 'dono', h: Handler) => async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (!contasAtivas()) { res.status(404).json({ sucesso: false, motivo: 'Contas próprias não estão ativas neste serviço.' }); return; }
      const u = await usuarioDaRequisicao(req);
      if (!u || (exige === 'escritorio' && !u.ehEscritorio) || (exige === 'dono' && !u.donoSistema)) { res.status(403).json({ sucesso: false, motivo: exige === 'dono' ? 'Somente o dono do sistema pode fazer isto.' : 'Somente o responsável do escritório pode fazer isto.' }); return; }
      await prepararContas(); await h(req, res, u);
    } catch (e) { console.error('Falha em contas do Agente:', e); res.status(503).json({ sucesso: false, motivo: 'Não foi possível concluir agora.' }); }
  };
  const loginReq = (req: Request) => String(req.body?.login || '').trim().toLowerCase();

  app.get('/api/auth/team', com('escritorio', async (_req, res, u) => {
    const r = await db().query('SELECT login,disabled,created_at FROM agente_users WHERE office_owner=$1 ORDER BY login', [u.id]);
    const pendentes = await db().query("SELECT login,expires_at FROM agente_invites WHERE office_owner=$1 AND redefinir_senha=false AND expires_at>now() ORDER BY login", [u.id]);
    const l = await db().query('SELECT max_usuarios FROM agente_users WHERE id=$1', [u.id]);
    res.json({ sucesso: true, equipe: r.rows, convitesPendentes: pendentes.rows, limite: l.rows[0]?.max_usuarios ?? null });
  }));
  app.post('/api/auth/team/invite', com('escritorio', async (req, res, u) => {
    const login = loginReq(req);
    if (!LOGIN_OK.test(login)) { res.status(400).json({ sucesso: false, motivo: 'Informe um nome de usuário válido.' }); return; }
    const cheio = await limiteAtingido(u.id); if (cheio) { res.status(409).json({ sucesso: false, motivo: cheio }); return; }
    if ((await db().query('SELECT 1 FROM agente_users WHERE login=$1', [login])).rowCount) { res.status(409).json({ sucesso: false, motivo: 'Este usuário já existe.' }); return; }
    const token = crypto.randomBytes(32).toString('base64url');
    await db().query("INSERT INTO agente_invites(token_hash,login,created_by,office_owner,expires_at) VALUES($1,$2,$3,$3,now()+interval '24 hours')", [hashToken(token), login, u.id]);
    res.status(201).json({ sucesso: true, conviteUrl: linkConvite(req, token, login), login, expiraEmHoras: 24 });
  }));
  app.post('/api/auth/team/:login/block', com('escritorio', async (req, res, u) => {
    const bloqueado = req.body?.bloqueado === true;
    const r = await db().query('UPDATE agente_users SET disabled=$1 WHERE login=$2 AND office_owner=$3 RETURNING login', [bloqueado, String(req.params.login).toLowerCase(), u.id]);
    limparCache();
    if (!r.rowCount) { res.status(404).json({ sucesso: false, motivo: 'Esse usuário não é da sua equipe.' }); return; }
    res.json({ sucesso: true, login: r.rows[0].login, bloqueado });
  }));
  app.post('/api/auth/team/:login/reset-link', com('escritorio', async (req, res, u) => {
    const login = String(req.params.login).toLowerCase();
    const membro = await db().query('SELECT 1 FROM agente_users WHERE login=$1 AND office_owner=$2', [login, u.id]);
    if (!membro.rowCount) { res.status(404).json({ sucesso: false, motivo: 'Esse usuário não é da sua equipe.' }); return; }
    const token = crypto.randomBytes(32).toString('base64url');
    await db().query('DELETE FROM agente_invites WHERE login=$1 AND office_owner=$2 AND redefinir_senha=true', [login, u.id]);
    await db().query("INSERT INTO agente_invites(token_hash,login,created_by,office_owner,redefinir_senha,expires_at) VALUES($1,$2,$3,$3,true,now()+interval '24 hours')", [hashToken(token), login, u.id]);
    res.status(201).json({ sucesso: true, link: linkConvite(req, token, login, true), expiraEmHoras: 24 });
  }));
  app.delete('/api/auth/team/:login', com('escritorio', async (req, res, u) => {
    const c = await db().connect();
    try {
      await c.query('BEGIN');
      const r = await c.query('UPDATE agente_users SET office_owner=NULL, tenant_id=id, disabled=true WHERE login=$1 AND office_owner=$2 RETURNING login', [String(req.params.login).toLowerCase(), u.id]);
      if (!r.rowCount) { await c.query('ROLLBACK'); res.status(404).json({ sucesso: false, motivo: 'Esse usuário não é da sua equipe.' }); return; }
      await c.query('DELETE FROM agente_invites WHERE login=$1 AND office_owner=$2', [String(req.params.login).toLowerCase(), u.id]);
      await c.query('COMMIT'); limparCache(); res.json({ sucesso: true, login: r.rows[0].login });
    } catch (e) { await c.query('ROLLBACK').catch(() => undefined); throw e; } finally { c.release(); }
  }));
  app.get('/api/auth/tenants', com('dono', async (_req, res, u) => {
    const r = await db().query(`SELECT u.login,u.disabled,u.created_at,u.max_usuarios,(SELECT count(*)::int FROM agente_users t WHERE t.tenant_id=u.id AND t.id<>u.id) AS usuarios
      FROM agente_users u WHERE u.office_admin=true AND u.tenant_id=u.id AND u.id<>$1 ORDER BY u.created_at`, [u.id]);
    res.json({ sucesso: true, escritorios: r.rows });
  }));
  app.post('/api/auth/tenants/invite', com('dono', async (req, res, u) => {
    const login = loginReq(req);
    if (!LOGIN_OK.test(login)) { res.status(400).json({ sucesso: false, motivo: 'Informe um nome de usuário válido.' }); return; }
    if ((await db().query('SELECT 1 FROM agente_users WHERE login=$1', [login])).rowCount) { res.status(409).json({ sucesso: false, motivo: 'Este usuário já existe.' }); return; }
    const token = crypto.randomBytes(32).toString('base64url');
    await db().query("INSERT INTO agente_invites(token_hash,login,created_by,novo_escritorio,expires_at) VALUES($1,$2,$3,true,now()+interval '24 hours')", [hashToken(token), login, u.id]);
    res.status(201).json({ sucesso: true, conviteUrl: linkConvite(req, token, login), login, expiraEmHoras: 24 });
  }));
  app.post('/api/auth/tenants/:login/block', com('dono', async (req, res, u) => {
    const alvo = await db().query('SELECT id FROM agente_users WHERE login=$1 AND office_admin=true AND tenant_id=id AND id<>$2', [String(req.params.login).toLowerCase(), u.id]);
    if (!alvo.rowCount) { res.status(404).json({ sucesso: false, motivo: 'Escritório não encontrado.' }); return; }
    await db().query('UPDATE agente_users SET disabled=$1 WHERE tenant_id=$2', [req.body?.bloqueado === true, alvo.rows[0].id]); limparCache();
    res.json({ sucesso: true, bloqueado: req.body?.bloqueado === true });
  }));
  app.post('/api/auth/tenants/:login/limit', com('dono', async (req, res, u) => {
    const b = req.body?.limite; const limite = b === null || b === '' ? null : Number(b);
    if (limite !== null && (!Number.isInteger(limite) || limite < 1 || limite > 1000)) { res.status(400).json({ sucesso: false, motivo: 'Informe um limite de 1 a 1000 (ou vazio para sem limite).' }); return; }
    const r = await db().query('UPDATE agente_users SET max_usuarios=$1 WHERE login=$2 AND office_admin=true AND tenant_id=id AND id<>$3 RETURNING login', [limite, String(req.params.login).toLowerCase(), u.id]);
    if (!r.rowCount) { res.status(404).json({ sucesso: false, motivo: 'Escritório não encontrado.' }); return; }
    res.json({ sucesso: true, limite });
  }));
}
