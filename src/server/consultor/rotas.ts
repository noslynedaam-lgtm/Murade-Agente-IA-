// Rotas do Consultor Murade para os outros sistemas (Fiscal, DP, Contábil, Fisco IA).
// Autenticação por cabeçalho x-murade-consultor-token comparado em tempo constante com MURADE_CONSULTOR_TOKEN.
import crypto from 'node:crypto';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import type { Armazem } from './registro';
import type { Consultor } from './servico';
import { LIMITE_PERGUNTA, validarDecisao, validarPergunta } from './validar';
import { PERGUNTAS_TESTE } from './conferidor';

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
        ultimaConferencia: ultima ?? null,
        situacao: ultima?.situacao ?? 'ainda_nao_rodou',
      });
    } catch {
      res.status(500).json({ erro: 'Não consegui ler a saúde do Consultor.' });
    }
  });
}
