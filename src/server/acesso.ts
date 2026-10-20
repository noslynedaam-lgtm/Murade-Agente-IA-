import crypto from 'node:crypto';
import type { Express, Request, Response, NextFunction } from 'express';

// Acesso ao Agente IA: a conta é a mesma do Murade DP (usuário, senha, convite e empresas).
// O Agente não guarda senhas: valida no DP e emite uma sessão assinada própria (cookie HttpOnly).
const SEGREDO = process.env.AGENTE_SESSION_SECRET || crypto.randomBytes(32).toString('hex'); // sem env: sessões caem ao reiniciar
const DURACAO_S = 12 * 3600;
const COOKIE = 'agente_sessao';

export type Empresa = { cnpj: string; nome: string };
export type Sessao = { usuario: string; empresas: Empresa[]; exp: number };

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

export function exigirAcesso(req: Request, res: Response, next: NextFunction) {
  const s = ler(req);
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
      // Encerra a sessão aberta no DP: o Agente usa só a sua própria.
      fetch(`${dpBase()}/api/auth/logout`, { method: 'POST', headers: { cookie: cookieDP } }).catch(() => undefined);
    }
    return { ok: true, sessao: { usuario: String(dados.usuario || login), empresas, exp: Math.floor(Date.now() / 1000) + DURACAO_S } };
  } catch {
    return { ok: false, status: 503, motivo: 'Não foi possível falar com o Murade DP agora. Tente novamente.' };
  }
}

export function registrarRotasDeAcesso(app: Express) {
  app.get('/api/auth/session', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const s = ler(req);
    res.json(s ? { autenticado: true, usuario: s.usuario, empresas: s.empresas } : { autenticado: false });
  });

  app.post('/api/auth/login', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const login = String(req.body?.login || '').trim().toLowerCase();
    const senha = String(req.body?.senha || '');
    if (!login || !senha) return res.status(400).json({ motivo: 'Informe usuário e senha.' });
    const r = await entrarPeloDP(login, senha.slice(0, 256));
    if (!r.ok) return res.status(r.status).json({ motivo: r.motivo });
    cookie(res, assinar(r.sessao), DURACAO_S);
    return res.json({ autenticado: true, usuario: r.sessao.usuario, empresas: r.sessao.empresas });
  });

  // Link do WhatsApp: ativa o convite (cria a conta com a senha escolhida) e já entra.
  app.post('/api/auth/redeem', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const login = String(req.body?.login || '').trim().toLowerCase();
    const senha = String(req.body?.senha || '');
    const convite = String(req.body?.convite || '');
    if (!login || !senha || !convite) return res.status(400).json({ motivo: 'Confira usuário, senha e link de convite.' });
    try {
      const r = await fetch(`${dpBase()}/api/auth/redeem`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, senha, convite }), signal: AbortSignal.timeout(10000) });
      const d: any = await r.json().catch(() => ({}));
      if (!r.ok) return res.status(r.status === 400 ? 400 : 503).json({ motivo: d.motivo || 'Não foi possível ativar o convite.' });
    } catch { return res.status(503).json({ motivo: 'Não foi possível falar com o Murade DP agora.' }); }
    const e = await entrarPeloDP(login, senha.slice(0, 256));
    if (!e.ok) return res.status(e.status).json({ motivo: e.motivo });
    cookie(res, assinar(e.sessao), DURACAO_S);
    return res.json({ autenticado: true, usuario: e.sessao.usuario, empresas: e.sessao.empresas });
  });

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
