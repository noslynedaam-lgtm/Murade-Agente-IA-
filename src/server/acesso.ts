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
const DURACAO_LONGA_S = 90 * 24 * 3600;
/** Celular/tablet com conta própria do Agente: a senha é pedida só no primeiro acesso (90 dias), a menos que a pessoa ligue "pedir senha ao abrir". */
export function ehCelularUA(ua: string): boolean { return /Android|iPhone|iPad|iPod|Mobile/i.test(ua || ''); }
function exigeSenhaAoAbrir(req: Request): boolean { return /(?:^|;\s*)murade_exigir_senha=1(?:;|$)/.test(req.header('cookie') || ''); }
export function duracaoContaPropria(req: Request): number { return ehCelularUA(req.header('user-agent') || '') && !exigeSenhaAoAbrir(req) ? DURACAO_LONGA_S : DURACAO_S; }
const COOKIE = 'agente_sessao';

export type Empresa = { cnpj: string; nome: string };
export type Sessao = { usuario: string; empresas: Empresa[]; exp: number; uid?: string; sid?: string; esc?: boolean; dono?: boolean; ger?: boolean };

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
  if (!s || !s.uid) { if (s) cookie(res, '', 0); res.status(401).json({ error: 'Entre com seu usuário para usar o Agente IA.', codigo: 'NAO_AUTENTICADO' }); return; }
  (req as any).sessaoAgente = s;
  next();
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
    // Cookie de sessão do modo antigo (sem conta própria): não vale mais; pede novo login.
    if (s) { cookie(res, '', 0); return res.json({ autenticado: false }); }
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
          const dur = duracaoContaPropria(req);
          cookie(res, assinar({ usuario: l.usuario.login, empresas: [], uid: l.usuario.id, exp: Math.floor(Date.now() / 1000) + dur }), dur);
          return res.json({ autenticado: true, usuario: l.usuario.login, empresas: [], ehEscritorio: l.usuario.ehEscritorio, donoSistema: l.usuario.donoSistema, contasProprias: true });
        }
      } catch (e) { console.error('Falha no login local do Agente:', e); return res.status(503).json({ motivo: 'Autenticação indisponível agora. Tente novamente.' }); }
    }
    return res.status(503).json({ motivo: 'Contas do Agente IA não estão ativas neste serviço.' });
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
    return res.status(503).json({ sucesso: false, motivo: 'Contas do Agente IA não estão ativas neste serviço.' });
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
        const dur = duracaoContaPropria(req);
        cookie(res, assinar({ usuario: l.usuario.login, empresas: [], uid: l.usuario.id, exp: Math.floor(Date.now() / 1000) + dur }), dur);
        return res.json({ autenticado: true, usuario: l.usuario.login, empresas: [], ehEscritorio: l.usuario.ehEscritorio, donoSistema: l.usuario.donoSistema, contasProprias: true });
      } catch (e) { console.error('Falha ao ativar convite do Agente:', e); return res.status(503).json({ motivo: 'Não foi possível ativar agora.' }); }
    }
    return res.status(503).json({ motivo: 'Contas do Agente IA não estão ativas neste serviço.' });
  });

  // Liga/desliga "manter conectado" na sessão atual (celular). Desligado = volta a pedir senha em 12 horas. Só para contas próprias do Agente
  // (essas são conferidas a cada acesso: se a conta for bloqueada ou excluída, o celular cai na hora).
  app.post('/api/auth/manter-conectado', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const s = ler(req);
    if (!s) return res.status(401).json({ sucesso: false, motivo: 'Entre no sistema primeiro.' });
    if (!s.uid || !(await contaDaRequisicao(req))) return res.status(400).json({ sucesso: false, motivo: 'Esta opção vale para contas próprias do Agente IA.' });
    const ativo = req.body?.ativo === true;
    if (ativo && !ehCelularUA(req.header('user-agent') || '')) return res.status(400).json({ sucesso: false, motivo: 'Esta opção vale só para celular e tablet.' });
    const dur = ativo ? DURACAO_LONGA_S : DURACAO_S;
    cookie(res, assinar({ ...s, exp: Math.floor(Date.now() / 1000) + dur }), dur);
    return res.json({ sucesso: true, manterConectado: ativo });
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


// Equipe e convites pelo Murade DP (usado enquanto o Agente não tem banco próprio): o Agente repassa o pedido
// com a sessão do próprio usuário no DP, que confere as permissões, e entrega o link já com o endereço do Agente.
function enderecoDoAgente(req: Request): string {
  const env = process.env.PUBLIC_APP_URL?.trim() || process.env.RENDER_EXTERNAL_URL?.trim();
  if (env) return env.replace(/\/$/, '');
  const proto = String(req.header('x-forwarded-proto') || req.protocol).split(',')[0];
  return `${proto}://${req.get('host')}`;
}
