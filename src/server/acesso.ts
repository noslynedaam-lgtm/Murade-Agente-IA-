import crypto from 'node:crypto';
import { emailConfigurado, enviarEmail } from './emailMurade';
import type { Express, Request, Response, NextFunction } from 'express';
import { contasAtivas, entrarLocal, usuarioAtivo, haUsuarios, criarPrimeiroAcesso, resgatarConvite, registrarRotasDeContas, criarLinkEsqueciSenha, type UsuarioConta } from './contas';

// Acesso ao Agente IA: a conta é a mesma do Murade DP (usuário, senha, convite e empresas).
// O Agente não guarda senhas: valida no DP e emite uma sessão assinada própria (cookie HttpOnly).
// Sem AGENTE_SESSION_SECRET, deriva uma chave estável (HMAC de rótulo fixo) de um segredo que já existe no serviço, para o login não cair a cada reinício/despertar.
const BASE_SEGREDO = process.env.AGENTE_SESSION_SECRET || process.env.MURADE_INTEGRATION_TOKEN || process.env.DATABASE_URL || process.env.GEMINI_API_KEY || '';
const SEGREDO = process.env.AGENTE_SESSION_SECRET || (BASE_SEGREDO ? crypto.createHmac('sha256', BASE_SEGREDO).update('murade-agente-sessao-v1').digest('hex') : crypto.randomBytes(32).toString('hex'));
const DURACAO_S = 12 * 3600;
const COOKIE = 'agente_sessao';

export type Empresa = { cnpj: string; nome: string };
export type Sessao = { usuario: string; empresas: Empresa[]; exp: number; uid?: string; sid?: string; esc?: boolean; dono?: boolean; ger?: boolean };

// Sessões abertas no Murade DP (na memória deste serviço): permitem gerar convites e gerenciar a equipe pelo DP.
const sessoesDP = new Map<string, { cookie: string; exp: number }>();
function guardarSessaoDP(cookieDP: string): string {
  const agora = Date.now() / 1000;
  for (const [k, v] of sessoesDP) if (v.exp < agora) sessoesDP.delete(k);
  const sid = crypto.randomBytes(18).toString('base64url');
  sessoesDP.set(sid, { cookie: cookieDP, exp: agora + DURACAO_S });
  return sid;
}

const dpBase = () => (process.env.MURADE_DP_URL || 'https://murade-dp.onrender.com').replace(/\/$/, '');

function assinar(s: Sessao): string {
  const corpo = Buffer.from(JSON.stringify(s)).toString('base64url');
  const mac = crypto.createHmac('sha256', SEGREDO).update(corpo).digest('base64url');
  return `${corpo}.${mac}`;
}

function ler(req: Request): Sessao | null {
  const cookie = (req.header('cookie') || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  if (!cookie) return null;
  const [corpo, mac] = cookie.slice(COOKIE.length + 1).split('.');
  if (!corpo || !mac) return null;
  const esperado = crypto.createHmac('sha256', SEGREDO).update(corpo).digest('base64url');
  const a = Buffer.from(mac); const b = Buffer.from(esperado);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(corpo, 'base64url').toString('utf8')) as Sessao;
    return s.exp > Date.now() / 1000 ? s : null;
  } catch { return null; }
}

function cookie(res: Response, valor: string, maxAge: number) {
  const seguro = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE}=${valor}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${seguro}`);
}

async function contaDaRequisicao(req: Request): Promise<UsuarioConta | null> {
  const s = ler(req); if (!s?.uid) return null;
  try { return await usuarioAtivo(s.uid); } catch { return null; }
}
export async function exigirAcesso(req: Request, res: Response, next: NextFunction) {
  const s = ler(req);
  if (s?.uid && !(await contaDaRequisicao(req))) { cookie(res, '', 0); res.status(401).json({ error: 'Seu acesso foi encerrado ou bloqueado.', codigo: 'NAO_AUTENTICADO' }); return; }
  if (!s) { res.status(401).json({ error: 'Entre com seu usuário para usar o Agente IA.', codigo: 'NAO_AUTENTICADO' }); return; }
  (req as any).sessaoAgente = s;
  next();
}

async function entrarPeloDP(login: string, senha: string): Promise<{ ok: true; sessao: Sessao } | { ok: false; status: number; motivo: string }> {
  try {
    const r = await fetch(`${dpBase()}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, senha }), signal: AbortSignal.timeout(10000) });
    if (!r.ok) {
      const d: any = await r.json().catch(() => ({}));
      return { ok: false, status: r.status === 429 ? 429 : 401, motivo: d.motivo || 'Usuário ou senha incorretos.' };
    }
    const dados: any = await r.json();
    const setCookie = (r.headers as any).getSetCookie ? (r.headers as any).getSetCookie() : [];
    const cookieDP = setCookie.map((c: string) => c.split(';')[0]).join('; ');
    let empresas: Empresa[] = (dados.cnpjs || []).map((cnpj: string) => ({ cnpj, nome: cnpj }));
    if (cookieDP) {
      try {
        const e = await fetch(`${dpBase()}/api/empresas`, { headers: { cookie: cookieDP }, signal: AbortSignal.timeout(10000) });
        if (e.ok) {
          const lista: any = await e.json();
          const nomes = new Map<string, string>((lista.empresas || []).map((x: any) => [String(x.cnpj || '').replace(/[^0-9A-Za-z]/g, '').toUpperCase(), String(x.nomeFantasia || x.razaoSocial || x.cnpj)]));
          empresas = empresas.map((x) => ({ cnpj: x.cnpj, nome: nomes.get(String(x.cnpj).replace(/[^0-9A-Za-z]/g, '').toUpperCase()) || x.cnpj }));
        }
      } catch { /* mantém o CNPJ como nome */ }
    }
    let sid: string | undefined; let esc = false; let dono = false; let ger = false;
    if (cookieDP) {
      try {
        const me = await fetch(`${dpBase()}/api/auth/me`, { headers: { cookie: cookieDP }, signal: AbortSignal.timeout(10000) });
        if (me.ok) { const m: any = await me.json(); esc = m.ehEscritorio === true; dono = m.donoSistema === true; ger = m.podeGerenciarEmpresas === true; }
      } catch { /* sem permissões de gestão */ }
      sid = guardarSessaoDP(cookieDP);
    }
    return { ok: true, sessao: { usuario: String(dados.usuario || login), empresas, exp: Math.floor(Date.now() / 1000) + DURACAO_S, sid, esc, dono, ger } };
  } catch {
    return { ok: false, status: 503, motivo: 'Não foi possível falar com o Murade DP agora. Tente novamente.' };
  }
}

export function registrarRotasDeAcesso(app: Express) {
  app.get('/api/auth/session', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const s = ler(req);
    if (s?.uid) {
      const u = await contaDaRequisicao(req);
      if (!u) { cookie(res, '', 0); return res.json({ autenticado: false }); }
      return res.json({ autenticado: true, usuario: u.login, empresas: [], ehEscritorio: u.ehEscritorio, donoSistema: u.donoSistema, contasProprias: true });
    }
    if (s) return res.json({ autenticado: true, usuario: s.usuario, empresas: s.empresas, ehEscritorio: Boolean(s.sid && sessoesDP.has(s.sid) && s.esc), donoSistema: Boolean(s.sid && sessoesDP.has(s.sid) && s.dono), podeGerenciar: Boolean(s.sid && sessoesDP.has(s.sid) && (s.ger || s.esc || s.dono)), viaDP: true });
    let primeiroAcesso = false;
    if (contasAtivas() && process.env.AGENTE_BOOTSTRAP_TOKEN) { try { primeiroAcesso = !(await haUsuarios()); } catch { /* sem banco */ } }
    res.json({ autenticado: false, primeiroAcesso });
  });
  app.post('/api/auth/setup', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      const r = await criarPrimeiroAcesso(String(req.body?.token || ''), String(req.body?.login || '').trim().toLowerCase(), String(req.body?.senha || ''));
      if (!r.ok) return res.status(400).json({ motivo: r.motivo });
      return res.status(201).json({ sucesso: true });
    } catch { return res.status(503).json({ motivo: 'Não foi possível configurar agora.' }); }
  });

  app.post('/api/auth/login', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const login = String(req.body?.login || '').trim().toLowerCase();
    const senha = String(req.body?.senha || '');
    if (!login || !senha) return res.status(400).json({ motivo: 'Informe usuário e senha.' });
    if (contasAtivas()) {
      try {
        const l = await entrarLocal(login, senha.slice(0, 256), req.ip || 'unknown');
        if (l) {
          if (!l.ok) return res.status(l.status).json({ motivo: l.motivo });
          cookie(res, assinar({ usuario: l.usuario.login, empresas: [], uid: l.usuario.id, exp: Math.floor(Date.now() / 1000) + DURACAO_S }), DURACAO_S);
          return res.json({ autenticado: true, usuario: l.usuario.login, empresas: [], ehEscritorio: l.usuario.ehEscritorio, donoSistema: l.usuario.donoSistema, contasProprias: true });
        }
      } catch (e) { console.error('Falha no login local do Agente:', e); return res.status(503).json({ motivo: 'Autenticação indisponível agora. Tente novamente.' }); }
    }
    const r = await entrarPeloDP(login, senha.slice(0, 256));
    if (!r.ok) return res.status(r.status).json({ motivo: r.motivo });
    cookie(res, assinar(r.sessao), DURACAO_S);
    return res.json({ autenticado: true, usuario: r.sessao.usuario, empresas: r.sessao.empresas, ehEscritorio: r.sessao.esc === true, donoSistema: r.sessao.dono === true, podeGerenciar: r.sessao.ger === true || r.sessao.esc === true || r.sessao.dono === true, viaDP: true });
  });

  // Link do WhatsApp: ativa o convite (cria a conta com a senha escolhida) e já entra.
  const tentativasEsqueci = new Map<string, number[]>();
  app.post('/api/auth/esqueci-senha', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const lg = String(req.body?.login || '').trim().toLowerCase();
    const resposta = { sucesso: true, mensagem: 'Se este e-mail estiver cadastrado, enviamos um link para criar a nova senha. Confira também a caixa de spam.' };
    const agora = Date.now();
    for (const k of [`ip:${req.ip || 'x'}`, `lg:${lg}`]) { const l = (tentativasEsqueci.get(k) || []).filter((t) => agora - t < 15 * 60_000); if (l.length >= (k.startsWith('ip:') ? 10 : 3)) return res.status(429).json({ sucesso: false, motivo: 'Muitas tentativas. Aguarde alguns minutos.' }); l.push(agora); tentativasEsqueci.set(k, l); }
    if (tentativasEsqueci.size > 5000) tentativasEsqueci.clear();
    if (contasAtivas()) {
      if (!emailConfigurado()) return res.status(503).json({ sucesso: false, motivo: 'A recuperação por e-mail ainda não foi ativada neste sistema. Peça ao responsável do escritório para gerar um link de nova senha.' });
      try {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lg) && lg.length <= 120) {
          const link = await criarLinkEsqueciSenha(req, lg);
          if (link) await enviarEmail(lg, 'Murade: criar nova senha', `Olá!\n\nRecebemos um pedido para criar uma nova senha no Murade Agente IA.\nAbra o link abaixo (vale 24 horas e só pode ser usado uma vez):\n\n${link}\n\nSe não foi você, ignore este e-mail: sua senha continua a mesma.`);
        }
      } catch (e) { console.error('Falha na recuperação de senha:', e instanceof Error ? e.message : e); }
      return res.json(resposta);
    }
    // Modo DP: as contas moram no Murade DP; o pedido vai para lá (o e-mail sai de lá, com o link do DP).
    try {
      const r = await fetch(`${dpBase()}/api/auth/esqueci-senha`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: dpBase() }, body: JSON.stringify({ login: lg }), signal: AbortSignal.timeout(15000) });
      const d: any = await r.json().catch(() => ({}));
      return res.status(r.status).json(d);
    } catch { return res.status(503).json({ sucesso: false, motivo: 'Não foi possível falar com o Murade DP agora. Tente de novo em instantes.' }); }
  });
  app.post('/api/auth/redeem', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const login = String(req.body?.login || '').trim().toLowerCase();
    const senha = String(req.body?.senha || '');
    const convite = String(req.body?.convite || '');
    if (!login || !senha || !convite) return res.status(400).json({ motivo: 'Confira usuário, senha e link de convite.' });
    if (contasAtivas()) {
      try {
        const rc = await resgatarConvite(login, senha.slice(0, 256), convite);
        if (!rc.ok) return res.status(400).json({ motivo: rc.motivo });
        const l = await entrarLocal(login, senha.slice(0, 256), req.ip || 'unknown');
        if (!l || !l.ok) return res.status(401).json({ motivo: 'Senha atualizada, mas o acesso continua bloqueado. Peça ao responsável do escritório para desbloquear a conta.' });
        cookie(res, assinar({ usuario: l.usuario.login, empresas: [], uid: l.usuario.id, exp: Math.floor(Date.now() / 1000) + DURACAO_S }), DURACAO_S);
        return res.json({ autenticado: true, usuario: l.usuario.login, empresas: [], ehEscritorio: l.usuario.ehEscritorio, donoSistema: l.usuario.donoSistema, contasProprias: true });
      } catch (e) { console.error('Falha ao ativar convite do Agente:', e); return res.status(503).json({ motivo: 'Não foi possível ativar agora.' }); }
    }
    try {
      const r = await fetch(`${dpBase()}/api/auth/redeem`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, senha, convite }), signal: AbortSignal.timeout(10000) });
      const d: any = await r.json().catch(() => ({}));
      if (!r.ok) return res.status(r.status === 400 ? 400 : 503).json({ motivo: d.motivo || 'Não foi possível ativar o convite.' });
    } catch { return res.status(503).json({ motivo: 'Não foi possível falar com o Murade DP agora.' }); }
    const e = await entrarPeloDP(login, senha.slice(0, 256));
    if (!e.ok) return res.status(e.status).json({ motivo: e.motivo });
    cookie(res, assinar(e.sessao), DURACAO_S);
    return res.json({ autenticado: true, usuario: e.sessao.usuario, empresas: e.sessao.empresas, ehEscritorio: e.sessao.esc === true, donoSistema: e.sessao.dono === true, podeGerenciar: e.sessao.ger === true || e.sessao.esc === true || e.sessao.dono === true, viaDP: true });
  });

  registrarGestaoPeloDP(app);
  registrarRotasDeContas(app, contaDaRequisicao);
  app.post('/api/auth/logout', (_req, res) => { cookie(res, '', 0); res.json({ sucesso: true }); });

  // Licença por empresa: cadastrada e gerenciada no Murade DP; aqui só se lê.
  app.get('/api/licenca', exigirAcesso, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const cnpj = String(req.query.cnpj ?? '').replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    const s: Sessao = (req as any).sessaoAgente;
    if (cnpj.length !== 14 || !s.empresas.some((e) => String(e.cnpj).replace(/[^0-9A-Za-z]/g, '').toUpperCase() === cnpj)) return res.status(403).json({ motivo: 'Este CNPJ não está vinculado ao seu acesso.' });
    const token = process.env.MURADE_INTEGRATION_TOKEN;
    if (!token) return res.json({ indisponivel: true, motivo: 'Integração com o DP não configurada neste sistema.' });
    try {
      const r = await fetch(`${dpBase()}/api/integracao/licenca?cnpj=${encodeURIComponent(cnpj)}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) });
      if (!r.ok) return res.json({ indisponivel: true, motivo: 'O DP não respondeu à consulta de licença.' });
      return res.json({ licenca: (await r.json() as any).licenca });
    } catch { return res.json({ indisponivel: true, motivo: 'Não foi possível falar com o DP agora.' }); }
  });
}


// Equipe e convites pelo Murade DP (usado enquanto o Agente não tem banco próprio): o Agente repassa o pedido
// com a sessão do próprio usuário no DP, que confere as permissões, e entrega o link já com o endereço do Agente.
function enderecoDoAgente(req: Request): string {
  const env = process.env.PUBLIC_APP_URL?.trim() || process.env.RENDER_EXTERNAL_URL?.trim();
  if (env) return env.replace(/\/$/, '');
  const proto = String(req.header('x-forwarded-proto') || req.protocol).split(',')[0];
  return `${proto}://${req.get('host')}`;
}

function registrarGestaoPeloDP(app: Express) {
  const rotas: Array<[string, string, (req: Request) => string, (req: Request) => any]> = [
    ['post', '/api/auth/invites', () => '/api/auth/invites', (r) => ({ login: String(r.body?.login || '').trim().toLowerCase(), cnpj: String(r.body?.cnpj || ''), papel: r.body?.papel === 'viewer' ? 'viewer' : 'operator' })],
    ['get', '/api/auth/team/detalhes', () => '/api/auth/team/detalhes', () => undefined],
    ['post', '/api/auth/team', () => '/api/auth/team', (r) => ({ login: String(r.body?.login || '').trim().toLowerCase() })],
    ['post', '/api/auth/team/:login/nova-senha', (r) => `/api/auth/team/${encodeURIComponent(String(r.params.login))}/nova-senha`, () => ({})],
    ['post', '/api/auth/team/:login/bloqueio', (r) => `/api/auth/team/${encodeURIComponent(String(r.params.login))}/bloqueio`, (r) => ({ bloqueado: r.body?.bloqueado !== false })],
    ['post', '/api/auth/tenants/:login/bloqueio', (r) => `/api/auth/tenants/${encodeURIComponent(String(r.params.login))}/bloqueio`, (r) => ({ bloqueado: r.body?.bloqueado === true })],
    ['post', '/api/auth/tenants/:login/limite', (r) => `/api/auth/tenants/${encodeURIComponent(String(r.params.login))}/limite`, (r) => { const b = r.body?.limite; return { limite: b === null || b === '' || b === undefined ? null : Number(b) }; }],
    ['get', '/api/auth/atividade', (r) => `/api/auth/atividade?${new URLSearchParams(Object.entries(r.query).filter(([, v]) => typeof v === 'string') as [string, string][]).toString()}`, () => undefined],
    ['get', '/api/auth/team', () => '/api/auth/team/detalhes', () => undefined],
    ['post', '/api/auth/team/:login/reset-link', (r) => `/api/auth/team/${encodeURIComponent(String(r.params.login))}/nova-senha`, () => ({})],
    ['post', '/api/auth/team/:login/block', (r) => `/api/auth/team/${encodeURIComponent(String(r.params.login))}/bloqueio`, (r) => ({ bloqueado: r.body?.bloqueado === true })],
    ['post', '/api/auth/team/:login/reenviar', (r) => `/api/auth/team/${encodeURIComponent(String(r.params.login))}/reenviar`, () => ({})],
    ['delete', '/api/auth/team/:login/convite', (r) => `/api/auth/team/${encodeURIComponent(String(r.params.login))}/convite`, () => undefined],
    ['post', '/api/auth/team/:login/excluir', (r) => `/api/auth/team/${encodeURIComponent(String(r.params.login))}/excluir`, () => ({})],
    ['post', '/api/auth/team/invite', () => '/api/auth/team/invite', (r) => ({ login: String(r.body?.login || '').trim().toLowerCase() })],
    ['delete', '/api/auth/team/:login', (r) => `/api/auth/team/${encodeURIComponent(String(r.params.login))}`, () => undefined],
    ['get', '/api/auth/tenants', () => '/api/auth/tenants', () => undefined],
    ['post', '/api/auth/tenants/invite', () => '/api/auth/tenants/invite', (r) => ({ login: String(r.body?.login || '').trim().toLowerCase() })],
    ['post', '/api/auth/tenants/:login/block', (r) => `/api/auth/tenants/${encodeURIComponent(String(r.params.login))}/bloqueio`, (r) => ({ bloqueado: r.body?.bloqueado === true })],
    ['post', '/api/auth/tenants/:login/limit', (r) => `/api/auth/tenants/${encodeURIComponent(String(r.params.login))}/limite`, (r) => { const b = r.body?.limite; return { limite: b === null || b === '' || b === undefined ? null : Number(b) }; }],
  ];
  for (const [metodo, caminho, destino, corpo] of rotas) {
    (app as any)[metodo](caminho, async (req: Request, res: Response, next: NextFunction) => {
      if (contasAtivas()) { next(); return; }
      res.setHeader('Cache-Control', 'no-store');
      const s = ler(req);
      if (!s) { res.status(401).json({ sucesso: false, motivo: 'Entre com seu usuário para continuar.' }); return; }
      const dp = s.sid ? sessoesDP.get(s.sid) : undefined;
      if (!dp || dp.exp < Date.now() / 1000) { res.status(401).json({ sucesso: false, motivo: 'Sua sessão com o DP expirou. Saia e entre de novo no Agente IA.' }); return; }
      try {
        const b = corpo(req);
        const r = await fetch(`${dpBase()}${destino(req)}`, {
          method: metodo.toUpperCase(),
          headers: { cookie: dp.cookie, Origin: dpBase(), ...(b !== undefined ? { 'Content-Type': 'application/json' } : {}) },
          body: b !== undefined ? JSON.stringify(b) : undefined,
          signal: AbortSignal.timeout(15000),
        });
        const d: any = await r.json().catch(() => ({}));
        if (d && typeof d.conviteUrl === 'string') {
          try { const u = new URL(d.conviteUrl); d.conviteUrl = `${enderecoDoAgente(req)}/${u.hash}`; } catch { /* mantém */ }
        }
        if (d && typeof d.conviteUrl === 'string' && /\/reset-link$/.test(req.path)) d.link = d.conviteUrl;
        if (d && Array.isArray(d.membros) && req.path === '/api/auth/team') {
          d.equipe = d.membros.map((m: any) => ({ login: m.login, disabled: m.bloqueado === true }));
          d.convitesPendentes = (d.convites || []).map((c: any) => ({ login: c.login, expires_at: c.expiraEm }));
        }
        res.status(r.status).json(d);
      } catch { res.status(503).json({ sucesso: false, motivo: 'Não foi possível falar com o Murade DP agora.' }); }
    });
  }
}
