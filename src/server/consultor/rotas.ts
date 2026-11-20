// Rotas do Consultor Murade para os outros sistemas (Fiscal, DP, Contábil, Fisco IA).
// Autenticação por cabeçalho x-murade-consultor-token comparado em tempo constante com MURADE_CONSULTOR_TOKEN.
import crypto from 'node:crypto';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import type { Armazem, Consumo, Liberacao } from './registro';
import { mesAtual, type Consultor } from './servico';
import { LIMITE_PERGUNTA, validarDecisao, validarPergunta } from './validar';
import { PERGUNTAS_TESTE } from './conferidor';
import { conferirRespostasProntas } from './economia';
import { RESPOSTAS_PRONTAS } from './respostasProntas';
import {
  cnpjValido,
  MENSAGEM_ESCOLA_NAO_LIBERADA,
  MENSAGEM_NAO_LIBERADO,
  normalizarCnpj,
  PRODUTOS,
  produtoValido,
  type Produto,
} from './liberacao';
import { CONSUMO_ZERO } from './registro';

export function tokenConfere(recebido: string, esperado: string): boolean {
  // Compara os hashes (mesmo tamanho) para não vazar o tamanho do token pelo tempo de resposta.
  const a = crypto.createHash('sha256').update(String(recebido ?? '')).digest();
  const b = crypto.createHash('sha256').update(String(esperado ?? '')).digest();
  return crypto.timingSafeEqual(a, b) && String(esperado).length > 0;
}

export function exigirTokenConsultor(lerToken: () => string | undefined = () => process.env.MURADE_CONSULTOR_TOKEN) {
  return (req: Request, res: Response, next: NextFunction) => {
    const esperado = lerToken();
    if (!esperado) {
      res.status(503).json({ erro: 'Consultor Murade não configurado (falta MURADE_CONSULTOR_TOKEN no servidor).' });
      return;
    }
    const recebido = req.header('x-murade-consultor-token') ?? '';
    if (!recebido || !tokenConfere(recebido, esperado)) {
      res.status(401).json({ erro: 'Token do Consultor inválido ou ausente.' });
      return;
    }
    next();
  };
}

// Limite simples por instância: protege a chave Gemini de um laço descontrolado num sistema chamador.
function limitador(maxPorMinuto: number) {
  let janela = Date.now();
  let contagem = 0;
  return (_req: Request, res: Response, next: NextFunction) => {
    const agora = Date.now();
    if (agora - janela > 60_000) {
      janela = agora;
      contagem = 0;
    }
    if (++contagem > maxPorMinuto) {
      res.status(429).json({ erro: 'Muitas perguntas ao Consultor em pouco tempo. Tente de novo em um minuto.' });
      return;
    }
    next();
  };
}

export function registrarRotasConsultor(
  app: Express,
  deps: { consultor: Consultor; armazem: Armazem; lerToken?: () => string | undefined; maxPorMinuto?: number },
) {
  const auth = exigirTokenConsultor(deps.lerToken);
  // JSON próprio com limite compatível com a pergunta de 30 mil caracteres + contexto/histórico.
  const json = express.json({ limit: '300kb' });

  app.post('/api/consultor/perguntar', auth, limitador(deps.maxPorMinuto ?? 30), json, async (req, res) => {
    const v = validarPergunta(req.body);
    if (!v.ok) {
      res.status(400).json({ erro: v.erro, limitePergunta: LIMITE_PERGUNTA });
      return;
    }
    try {
      const { resposta, indisponivel } = await deps.consultor.perguntar(v.valor);
      res.status(indisponivel ? 503 : 200).json(indisponivel ? { erro: 'Serviço de IA indisponível no momento.', ...resposta } : resposta);
    } catch (e) {
      console.error('[consultor] erro na rota perguntar:', (e as Error)?.message);
      res.status(500).json({ erro: 'Erro interno no Consultor Murade.' });
    }
  });

  app.post('/api/consultor/registrar-decisao', auth, json, async (req, res) => {
    const v = validarDecisao(req.body);
    if (!v.ok) {
      res.status(400).json({ erro: v.erro });
      return;
    }
    try {
      const salva = await deps.armazem.salvarDecisao(v.valor);
      res.status(201).json({ ok: true, decisao: salva });
    } catch {
      res.status(500).json({ erro: 'Não consegui registrar a decisão.' });
    }
  });

  app.get('/api/consultor/decisoes', auth, async (req, res) => {
    const escritorio = typeof req.query.escritorio === 'string' && req.query.escritorio.trim() ? req.query.escritorio.trim().slice(0, 80) : undefined;
    const limite = Math.min(Math.max(parseInt(String(req.query.limite ?? '100'), 10) || 100, 1), 500);
    try {
      const itens = await deps.armazem.decisoes(escritorio, limite);
      res.json({ armazenamento: deps.armazem.tipo, escritorio: escritorio ?? null, total: itens.length, itens });
    } catch {
      res.status(500).json({ erro: 'Não consegui ler as decisões.' });
    }
  });

  // Os sistemas perguntam se mostram o "serviço completo"/consultor completo (produto=consultor) ou a Escola Murade (produto=escola).
  app.get('/api/consultor/liberado', auth, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const escritorio = normalizarCnpj(req.query.escritorio);
    const produto = req.query.produto === undefined || req.query.produto === '' ? 'consultor' : String(req.query.produto);
    if (!produtoValido(produto)) {
      res.status(400).json({ erro: `Parâmetro "produto" deve ser um destes: ${PRODUTOS.join(', ')}.` });
      return;
    }
    if (!cnpjValido(escritorio)) {
      res.status(400).json({ erro: 'Parâmetro "escritorio" deve ser o CNPJ do escritório (14 caracteres).' });
      return;
    }
    const s = await deps.consultor.liberacoes.situacao(escritorio, produto);
    res.json({
      escritorio,
      produto,
      liberado: s.liberado,
      ...(s.liberado ? {} : { mensagem: produto === 'escola' ? MENSAGEM_ESCOLA_NAO_LIBERADA : MENSAGEM_NAO_LIBERADO }),
    });
  });

  // Uso da Escola Murade (ou outro uso do produto) contado para cobrança: os sistemas avisam a cada aula/atividade.
  app.post('/api/consultor/registrar-uso', auth, json, async (req, res) => {
    const c = (req.body ?? {}) as Record<string, unknown>;
    const escritorio = normalizarCnpj(c.escritorio);
    const produto = c.produto === undefined ? 'escola' : c.produto;
    if (!cnpjValido(escritorio)) {
      res.status(400).json({ erro: 'Campo "escritorio" deve ser o CNPJ do escritório (14 caracteres).' });
      return;
    }
    if (!produtoValido(produto)) {
      res.status(400).json({ erro: `Campo "produto" deve ser um destes: ${PRODUTOS.join(', ')}.` });
      return;
    }
    const quantidade = Number.isInteger(c.quantidade) && (c.quantidade as number) > 0 ? Math.min(c.quantidade as number, 1000) : 1;
    const s = await deps.consultor.liberacoes.situacao(escritorio, produto);
    try {
      await deps.armazem.somarConsumo({ escritorio, produto, mes: mesAtual(), usos: quantidade });
      res.status(201).json({ ok: true, escritorio, produto, liberado: s.liberado, quantidade });
    } catch {
      res.status(500).json({ erro: 'Não consegui registrar o uso.' });
    }
  });

  app.get('/api/consultor/nao-respondidas', auth, async (req, res) => {
    const limite = Math.min(Math.max(parseInt(String(req.query.limite ?? '100'), 10) || 100, 1), 500);
    try {
      const itens = await deps.armazem.naoRespondidas(limite);
      res.json({ armazenamento: deps.armazem.tipo, total: itens.length, itens });
    } catch (e) {
      res.status(500).json({ erro: 'Não consegui ler o registro do Consultor.' });
    }
  });

  app.get('/api/consultor/saude', auth, async (_req, res) => {
    try {
      const ultima = await deps.armazem.ultimaSaude();
      res.json({
        armazenamento: deps.armazem.tipo,
        perguntasTeste: PERGUNTAS_TESTE.length,
        respostasProntas: conferirRespostasProntas(),
        ultimaConferencia: ultima ?? null,
        situacao: ultima?.situacao ?? 'ainda_nao_rodou',
      });
    } catch {
      res.status(500).json({ erro: 'Não consegui ler a saúde do Consultor.' });
    }
  });
}


// ── Tela do dono: liberação por produto e consumo para cobrança ──────────────
// Só o dono do sistema (middleware exigirDono vindo de acesso.ts). Nunca aparece para escritório cliente.

const MES_OK = /^\d{4}-(0[1-9]|1[0-2])$/;
const textoCurto = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined);

export type LinhaEscritorio = {
  escritorio: string;
  nome?: string;
  plano?: string;
  observacao?: string;
  produtos: Record<Produto, { liberado: boolean; origem: 'tabela' | 'padrao' | 'nenhuma'; liberadoPor?: string; quando?: string }>;
  consumo: Record<Produto, Omit<Consumo, 'escritorio' | 'produto' | 'mes'>>;
};

export async function listarEscritorios(deps: { armazem: Armazem; consultor: Consultor }, mes: string): Promise<LinhaEscritorio[]> {
  const [libs, consumo] = await Promise.all([deps.armazem.liberacoes(), deps.armazem.consumo(mes)]);
  const cnpjs = new Set<string>([...libs.map((l) => l.escritorio), ...deps.consultor.liberacoes.padrao(), ...consumo.map((c) => c.escritorio)]);
  const linhas: LinhaEscritorio[] = [];
  for (const cnpj of [...cnpjs].sort()) {
    const minhas = libs.filter((l) => l.escritorio === cnpj);
    const info = minhas.find((l) => l.nome || l.plano || l.observacao);
    const produtos = {} as LinhaEscritorio['produtos'];
    const cons = {} as LinhaEscritorio['consumo'];
    for (const produto of PRODUTOS) {
      const reg: Liberacao | undefined = minhas.find((l) => l.produto === produto);
      const padrao = deps.consultor.liberacoes.padrao().includes(cnpj);
      produtos[produto] = reg
        ? { liberado: reg.liberado, origem: 'tabela', liberadoPor: reg.liberadoPor, quando: reg.quando }
        : { liberado: padrao, origem: padrao ? 'padrao' : 'nenhuma' };
      const c = consumo.find((x) => x.escritorio === cnpj && x.produto === produto);
      const { escritorio: _e, produto: _p, mes: _m, ...valores } = c ?? { escritorio: '', produto, mes, ...CONSUMO_ZERO };
      cons[produto] = valores;
    }
    linhas.push({ escritorio: cnpj, nome: info?.nome, plano: info?.plano, observacao: info?.observacao, produtos, consumo: cons });
  }
  return linhas;
}

/** Célula de CSV segura (separador ";" para o Excel em português; sem fórmulas). */
function celula(v: unknown): string {
  let t = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`;
  return /[";\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}

export function consumoCsv(linhas: LinhaEscritorio[], mes: string): string {
  const cab = ['mes', 'escritorio_cnpj', 'nome', 'plano', 'produto', 'liberado', 'perguntas', 'com_ia', 'prontas', 'cache', 'bloqueadas', 'usos', 'tokens_entrada', 'tokens_saida', 'tokens_total'];
  const corpo: string[] = [cab.join(';')];
  for (const l of linhas)
    for (const produto of PRODUTOS) {
      const c = l.consumo[produto];
      corpo.push(
        [mes, l.escritorio, l.nome ?? '', l.plano ?? '', produto, l.produtos[produto].liberado ? 'sim' : 'nao', c.perguntas, c.ia, c.prontas, c.cache, c.bloqueadas, c.usos, c.tokensEntrada, c.tokensSaida, c.tokensTotal]
          .map(celula)
          .join(';'),
      );
    }
  return '\uFEFF' + corpo.join('\r\n') + '\r\n';
}

export function registrarRotasDonoConsultor(
  app: Express,
  deps: { consultor: Consultor; armazem: Armazem; exigirDono: (req: Request, res: Response, next: NextFunction) => unknown },
) {
  const json = express.json({ limit: '20kb' });
  const mesDe = (req: Request) => (typeof req.query.mes === 'string' && MES_OK.test(req.query.mes) ? req.query.mes : mesAtual());

  app.get('/api/consultor/dono/escritorios', deps.exigirDono, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const mes = mesDe(req);
    try {
      const escritorios = await listarEscritorios(deps, mes);
      res.json({ sucesso: true, mes, produtos: PRODUTOS, armazenamento: deps.armazem.tipo, respostasProntas: RESPOSTAS_PRONTAS.length, escritorios });
    } catch (e) {
      console.error('[consultor] tela do dono:', (e as Error)?.message);
      res.status(503).json({ sucesso: false, motivo: 'Não consegui ler os escritórios agora.' });
    }
  });

  app.post('/api/consultor/dono/liberacao', deps.exigirDono, json, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const c = (req.body ?? {}) as Record<string, unknown>;
    const escritorio = normalizarCnpj(c.escritorio);
    if (!cnpjValido(escritorio)) {
      res.status(400).json({ sucesso: false, motivo: 'CNPJ do escritório inválido. Confira os 14 caracteres.' });
      return;
    }
    if (!produtoValido(c.produto)) {
      res.status(400).json({ sucesso: false, motivo: `Produto deve ser um destes: ${PRODUTOS.join(', ')}.` });
      return;
    }
    if (typeof c.liberado !== 'boolean') {
      res.status(400).json({ sucesso: false, motivo: 'Informe se é para liberar (true) ou desligar (false).' });
      return;
    }
    // Desligar exige a segunda confirmação (o escritório perde o adicional na hora).
    if (c.liberado === false && c.confirmar !== true) {
      res.status(400).json({ sucesso: false, motivo: 'Para desligar, confirme de novo (segunda confirmação).' });
      return;
    }
    try {
      const salvo = await deps.consultor.liberacoes.definir({
        escritorio,
        produto: c.produto,
        liberado: c.liberado,
        nome: textoCurto(c.nome, 120),
        plano: textoCurto(c.plano, 120),
        observacao: textoCurto(c.observacao, 500),
        liberadoPor: String((req as any).donoLogin || 'dono').slice(0, 120),
      });
      res.json({ sucesso: true, liberacao: salvo });
    } catch (e) {
      console.error('[consultor] não salvou a liberação:', (e as Error)?.message);
      res.status(503).json({ sucesso: false, motivo: 'Não consegui salvar agora (banco indisponível). Nada foi alterado.' });
    }
  });

  app.get('/api/consultor/dono/consumo.csv', deps.exigirDono, async (req, res) => {
    const mes = mesDe(req);
    try {
      const csv = consumoCsv(await listarEscritorios(deps, mes), mes);
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="consumo-murade-${mes}.csv"`);
      res.send(csv);
    } catch {
      res.status(503).json({ sucesso: false, motivo: 'Não consegui gerar o CSV agora.' });
    }
  });
}
