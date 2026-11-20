// Testes da economia de crédito (respostas prontas e cache), da liberação paga por produto,
// do consumo para cobrança e da tela do dono.
import assert from 'node:assert/strict';
import test from 'node:test';
import type { AddressInfo } from 'node:net';
import express, { type NextFunction, type Request, type Response } from 'express';
import { conferirResposta, PERGUNTAS_TESTE, rodarConferidor } from './conferidor';
import {
  AVISO_RESPOSTA_GERAL,
  buscarPronta,
  chaveCache,
  conferirRespostasProntas,
  decidirPronta,
  podeGravarCache,
  VERSAO_BASE,
} from './economia';
import { urlOficial } from './fontes';
import { cnpjValido, criarLiberacoes, lerLiberadosPadrao, MENSAGEM_NAO_LIBERADO } from './liberacao';
import { criarArmazemMemoria } from './registro';
import { RESPOSTAS_PRONTAS, type RespostaPronta } from './respostasProntas';
import { registrarRotasConsultor, registrarRotasDonoConsultor } from './rotas';
import { criarConsultor, mesAtual } from './servico';
import type { PerguntaConsultor, RespostaBruta } from './tipos';

const TOKEN = 'token-economia';
const LIB = '11222333000181'; // liberado pela lista padrão
const NAO = '11444777000161'; // não liberado

function respostaIA(extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    resposta: 'A provisão de férias é reconhecida mensalmente pelo regime de competência.',
    area: 'contabil',
    fontes: [{ titulo: 'CFC', url: 'https://cfc.org.br/tecnica/perguntas-frequentes/livro-diario/' }],
    confianca: 'alta',
    encaminharContador: false,
    acoesSugeridas: [],
    ...extra,
  });
}

async function subir(opcoes: { texto?: string; uso?: RespostaBruta['uso'] } = {}) {
  const armazem = criarArmazemMemoria();
  const liberacoes = criarLiberacoes(armazem, { padrao: () => [LIB], cacheMs: 0 });
  let chamadasIA = 0;
  const consultor = criarConsultor({
    armazem,
    liberacoes,
    gerar: async () => {
      chamadasIA++;
      return { texto: opcoes.texto ?? respostaIA(), fontesPesquisa: [], modelo: 'teste', uso: opcoes.uso ?? { entrada: 100, saida: 50, total: 150 } };
    },
  });
  const app = express();
  app.use(express.json());
  registrarRotasConsultor(app, { consultor, armazem, lerToken: () => TOKEN, maxPorMinuto: 1000 });
  // Dono simulado: cabeçalho x-dono: sim (no servidor real é exigirDono de acesso.ts).
  const exigirDono = (req: Request, res: Response, next: NextFunction) => {
    if (req.header('x-dono') !== 'sim') return void res.status(403).json({ sucesso: false, motivo: 'Somente o dono do sistema pode fazer isto.' });
    (req as any).donoLogin = 'dono@murade';
    next();
  };
  registrarRotasDonoConsultor(app, { consultor, armazem, exigirDono });
  const srv = app.listen(0);
  await new Promise((r) => srv.once('listening', r));
  const base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
  const chamar = (caminho: string, o: { corpo?: unknown; token?: string | null; dono?: boolean } = {}) =>
    fetch(base + caminho, {
      method: o.corpo !== undefined ? 'POST' : 'GET',
      headers: { 'content-type': 'application/json', ...(o.token === null ? {} : { 'x-murade-consultor-token': o.token ?? TOKEN }), ...(o.dono ? { 'x-dono': 'sim' } : {}) },
      body: o.corpo !== undefined ? JSON.stringify(o.corpo) : undefined,
    });
  const perguntar = async (corpo: Partial<PerguntaConsultor>) => {
    const r = await chamar('/api/consultor/perguntar', { corpo: { sistema: 'fiscal', ...corpo } });
    return { status: r.status, j: await r.json() };
  };
  return { chamar, perguntar, armazem, consultor, chamadasIA: () => chamadasIA, fechar: () => new Promise((r) => srv.close(r)) };
}

// ── Banco de respostas prontas ──────────────────────────────────
test('prontas: pelo menos 80, ids únicos, fonte oficial, data de conferência e todas as áreas pedidas', () => {
  assert.ok(RESPOSTAS_PRONTAS.length >= 80, `são ${RESPOSTAS_PRONTAS.length}`);
  assert.equal(new Set(RESPOSTAS_PRONTAS.map((p) => p.id)).size, RESPOSTAS_PRONTAS.length);
  for (const p of RESPOSTAS_PRONTAS) {
    assert.ok(p.fontes.length > 0 && p.fontes.every((f) => urlOficial(f.url)), `${p.id}: fonte oficial`);
    assert.match(p.conferidoEm, /^2026-\d{2}-\d{2}$/, `${p.id}: data`);
    assert.ok(p.perguntas.length >= 2 && p.chaves.length >= 1 && p.resposta.length > 60, `${p.id}: completa`);
  }
  const ids = RESPOSTAS_PRONTAS.map((p) => p.id).join(' ');
  for (const tema of ['sn-pgdas', 'sn-defis', 'sn-fator-r', 'mei-limite-2027', 'lp-presuncao', 'ret-csrf', 'dctfweb', 'esocial-', 'inss-tabela', 'irrf-', 'fgts-', 'ferias-', '13-', 'rescisao-', 'aviso-', 'ecd-', 'ecf-', 'livro', 'icms-go', 'iss-goiania', 'rt-'])
    assert.ok(ids.includes(tema), `tema ${tema}`);
  assert.ok(RESPOSTAS_PRONTAS.filter((p) => p.id.startsWith('rt-')).length >= 10, 'Reforma Tributária detalhada');
  assert.equal(conferirRespostasProntas().situacao, 'ok');
});

test('prontas: cada variação encontra a própria resposta (sem ambiguidade)', () => {
  for (const p of RESPOSTAS_PRONTAS) for (const q of p.perguntas) assert.equal(buscarPronta(q)?.pronta.id, p.id, `"${q}"`);
});

test('prontas: perguntas reformuladas acham a resposta; perguntas de outro assunto, cálculo ou caso concreto vão para a IA', () => {
  const certas: [string, string][] = [
    ['qual o dia de vencimento do DAS?', 'sn-pgdas-das-prazo'],
    ['até que dia pago o das do simples?', 'sn-pgdas-das-prazo'],
    ['prazo da defis', 'sn-defis-prazo'],
    ['quanto tempo de experiência no máximo?', 'experiencia'],
    ['qual o prazo pra pagar rescisão', 'rescisao-prazo'],
    ['quantos dias de aviso previo no maximo', 'aviso-previo-proporcional'],
    ['o que é o fator r', 'sn-fator-r'],
    ['ibs e cbs o que são', 'rt-o-que-e'],
    ['como funciona o split payment', 'rt-split-payment'],
    ['em 2026 pago CBS?', 'rt-2026-ano-teste'],
    ['qual a aliquota do icms em goias', 'icms-go-aliquota'],
    ['tabela inss 2026', 'inss-tabela-2026'],
    ['prazo do s-2299', 'esocial-s2299'],
    ['mei pode ter quantos funcionarios', 'mei-empregado'],
    ['como fica o simples nacional com a reforma tributaria', 'rt-simples'],
  ];
  for (const [q, id] of certas) assert.equal(buscarPronta(q)?.pronta.id, id, q);
  const ia = [
    'quanto fica a rescisão de um empregado com salário de R$ 3.500,00?',
    'calcule o DAS de uma receita de 50 mil',
    'como lançar depreciação de veículo',
    'qual a alíquota do ISS de Goiânia para advocacia',
    'o DAS vence dia 25?',
    'discordo, vou pagar a rescisão em 15 dias',
    'qual a multa do FGTS atrasado',
    'qual o prazo do S-2210 CAT',
    'qual a alíquota de referência da CBS em 2027',
    'limite do MEI em 2030',
  ];
  for (const q of ia) assert.equal(decidirPronta({ pergunta: q, sistema: 'fiscal' }).tipo, 'nenhuma', q);
});

test('prontas: as perguntas do robô respondidas por pronta trazem a resposta-chave conferida (inclusive IBS/CBS)', () => {
  let n = 0;
  for (const t of PERGUNTAS_TESTE) {
    const d = decidirPronta({ pergunta: t.pergunta, sistema: t.sistema, contextoEmpresa: t.contextoEmpresa });
    if (d.tipo === 'nenhuma') continue;
    n++;
    assert.deepEqual(conferirResposta(d.resposta.resposta, t.chaves), [], t.id);
  }
  assert.ok(n >= 35, `${n} perguntas-teste com resposta pronta`);
  assert.ok(PERGUNTAS_TESTE.filter((t) => t.id.startsWith('rt-')).length >= 5, 'perguntas-teste de IBS/CBS');
});

test('prontas: personaliza com os dados da empresa sem IA; regime diferente não usa a pronta', () => {
  const p = decidirPronta({ pergunta: 'Na minha empresa, até quando pago o DAS?', sistema: 'fiscal', contextoEmpresa: { regime: 'simples', anexoSimples: 'III', razaoSocial: 'Ferragista JE' } });
  assert.equal(p.tipo, 'pronta');
  assert.ok(p.tipo === 'pronta' && p.personalizada && p.resposta.resposta.startsWith('Para a Ferragista JE, que é do Simples Nacional, Anexo III:'));
  assert.equal(decidirPronta({ pergunta: 'Até quando pago o DAS?', sistema: 'fiscal', contextoEmpresa: { regime: 'presumido' } }).tipo, 'nenhuma');
  const geral = decidirPronta({ pergunta: 'Na minha empresa, até quando pago o DAS?', sistema: 'fiscal' });
  assert.equal(geral.tipo, 'geral');
  assert.ok(geral.tipo === 'geral' && geral.resposta.resposta.includes(AVISO_RESPOSTA_GERAL));
});

test('conferência das prontas: sem fonte oficial ou sem data = falha; mais de 180 dias = aviso', () => {
  const base = RESPOSTAS_PRONTAS[0];
  const ruim: RespostaPronta[] = [
    { ...base, id: 'a', fontes: [{ titulo: 'blog', url: 'https://blogcontabil.com.br/x' }] },
    { ...base, id: 'b', conferidoEm: '' },
  ];
  const r = conferirRespostasProntas(ruim, new Date('2026-11-20T12:00:00Z'));
  assert.equal(r.situacao, 'com_falhas');
  assert.deepEqual(r.semFonteOficial, ['a']);
  assert.deepEqual(r.semData, ['b']);
  const velha = conferirRespostasProntas([{ ...base, id: 'c', conferidoEm: '2026-01-02' }], new Date('2026-11-20T12:00:00Z'));
  assert.equal(velha.situacao, 'com_avisos');
  assert.equal(velha.maisDe180Dias[0].id, 'c');
  assert.ok(velha.maisDe180Dias[0].dias > 180);
});

// ── Fluxo: pronta, cache e IA ───────────────────────────────────
test('fluxo: resposta pronta sai sem chamar a IA, com origem e custoIA', async () => {
  const s = await subir();
  try {
    const { status, j } = await s.perguntar({ pergunta: 'Qual o prazo de entrega da DEFIS?', escritorio: LIB });
    assert.equal(status, 200);
    assert.equal(j.origem, 'pronta');
    assert.equal(j.custoIA, false);
    assert.equal(j.liberado, true);
    assert.equal(j.respostaProntaId, 'sn-defis-prazo');
    assert.ok(j.fontes.length && j.conferidoEm);
    assert.equal(s.chamadasIA(), 0);
  } finally {
    await s.fechar();
  }
});

test('cache: pergunta genérica repetida vira resposta sem custo; com dados da empresa nunca vai para o cache', async () => {
  const s = await subir();
  try {
    const a = await s.perguntar({ pergunta: 'Como contabilizar a provisão de férias?', escritorio: LIB });
    assert.equal(a.j.origem, 'ia');
    assert.equal(a.j.custoIA, true);
    const b = await s.perguntar({ pergunta: 'como contabilizar a provisão de férias', escritorio: LIB });
    assert.equal(b.j.origem, 'cache');
    assert.equal(b.j.custoIA, false);
    assert.equal(s.chamadasIA(), 1);
    // Escritório sem o adicional também recebe o que está no cache (sem custo).
    const c = await s.perguntar({ pergunta: 'Como contabilizar a provisão de férias?', escritorio: NAO });
    assert.equal(c.j.origem, 'cache');
    assert.equal(c.j.liberado, false);

    // Com contexto de empresa: a IA personaliza e a resposta não é guardada.
    await s.perguntar({ pergunta: 'Como contabilizar o leasing financeiro?', escritorio: LIB, contextoEmpresa: { regime: 'presumido', razaoSocial: 'Empresa X' } });
    await s.perguntar({ pergunta: 'Como contabilizar o leasing financeiro?', escritorio: LIB });
    assert.equal(s.chamadasIA(), 3);
    // Com CNPJ ou "minha empresa" na pergunta: não guarda.
    await s.perguntar({ pergunta: 'Como contabilizar o leasing da 12.345.678/0001-90?', escritorio: LIB });
    await s.perguntar({ pergunta: 'Como contabilizar o leasing da 12.345.678/0001-90?', escritorio: LIB });
    assert.equal(s.chamadasIA(), 5);
  } finally {
    await s.fechar();
  }
});

test('cache: só confiança alta com fonte oficial; a chave muda com a versão da base', async () => {
  const p: PerguntaConsultor = { pergunta: 'Como contabilizar o leasing?', sistema: 'contabil' };
  const boa = { resposta: 'x', area: 'contabil', fontes: [{ titulo: 'CFC', url: 'https://cfc.org.br' }], confianca: 'alta', encaminharContador: false, acoesSugeridas: [], avisoResponsabilidade: '' } as const;
  assert.equal(podeGravarCache(p, { ...boa, fontes: [...boa.fontes], acoesSugeridas: [] }), true);
  assert.equal(podeGravarCache(p, { ...boa, fontes: [...boa.fontes], acoesSugeridas: [], confianca: 'media' }), false);
  assert.equal(podeGravarCache(p, { ...boa, fontes: [], acoesSugeridas: [] }), false);
  assert.equal(podeGravarCache({ ...p, contextoEmpresa: { regime: 'simples' } }, { ...boa, fontes: [...boa.fontes], acoesSugeridas: [] }), false);
  assert.equal(podeGravarCache({ ...p, pergunta: 'Meu CPF é 123.456.789-09, como contabilizo?' }, { ...boa, fontes: [...boa.fontes], acoesSugeridas: [] }), false);
  assert.notEqual(chaveCache(p), chaveCache(p, 'outra-versao'));
  assert.equal(chaveCache(p), chaveCache({ ...p, pergunta: 'como contabilizar o leasing' }), 'mesma pergunta normalizada');
  assert.match(VERSAO_BASE, /^[0-9a-f]{16}$/);
});

// ── Liberação paga por produto ──────────────────────────────────
test('liberação: escritório sem o adicional recebe prontas, e o que precisaria de IA volta liberado:false sem gastar', async () => {
  const s = await subir();
  try {
    const pronta = await s.perguntar({ pergunta: 'Qual o prazo de entrega da ECD?', escritorio: NAO });
    assert.equal(pronta.j.origem, 'pronta');
    assert.equal(pronta.j.liberado, false);
    const bloq = await s.perguntar({ pergunta: 'Como contabilizar o arrendamento mercantil?', escritorio: NAO });
    assert.equal(bloq.status, 200);
    assert.equal(bloq.j.liberado, false);
    assert.equal(bloq.j.origem, 'bloqueado');
    assert.equal(bloq.j.custoIA, false);
    assert.equal(bloq.j.resposta, MENSAGEM_NAO_LIBERADO);
    assert.equal(bloq.j.resposta, 'O Consultor Murade completo é um adicional. Fale com o seu fornecedor para liberar.');
    // Sem escritório: também não usa IA.
    const sem = await s.perguntar({ pergunta: 'Como contabilizar o arrendamento mercantil?' });
    assert.equal(sem.j.liberado, false);
    // Caso concreto sem dados e sem o adicional: regra geral pronta com aviso.
    const geral = await s.perguntar({ pergunta: 'Na minha empresa, até quando pago o DAS?', escritorio: NAO });
    assert.equal(geral.j.origem, 'pronta');
    assert.ok(geral.j.resposta.includes(AVISO_RESPOSTA_GERAL));
    assert.equal(s.chamadasIA(), 0);
    // CNPJ inválido no corpo → 400.
    assert.equal((await s.perguntar({ pergunta: 'x', escritorio: 'esc-001' })).status, 400);
    assert.equal((await s.perguntar({ pergunta: 'x', escritorio: '11222333000182' })).status, 400);
  } finally {
    await s.fechar();
  }
});

test('liberação: GET /liberado por produto (sem produto = consultor), token obrigatório; a tabela prevalece sobre a lista padrão', async () => {
  const s = await subir();
  try {
    assert.equal((await s.chamar(`/api/consultor/liberado?escritorio=${LIB}`, { token: null })).status, 401);
    let j = await (await s.chamar(`/api/consultor/liberado?escritorio=11.222.333/0001-81`)).json();
    assert.deepEqual([j.produto, j.liberado], ['consultor', true]);
    j = await (await s.chamar(`/api/consultor/liberado?escritorio=${LIB}&produto=escola`)).json();
    assert.deepEqual([j.produto, j.liberado], ['escola', true], 'lista padrão vale para os dois produtos');
    j = await (await s.chamar(`/api/consultor/liberado?escritorio=${NAO}&produto=escola`)).json();
    assert.equal(j.liberado, false);
    assert.match(j.mensagem, /Escola Murade é um adicional/);
    assert.equal((await s.chamar(`/api/consultor/liberado?escritorio=${LIB}&produto=outro`)).status, 400);
    assert.equal((await s.chamar(`/api/consultor/liberado?escritorio=123`)).status, 400);

    await s.consultor.liberacoes.definir({ escritorio: LIB, produto: 'consultor', liberado: false, liberadoPor: 'dono' });
    j = await (await s.chamar(`/api/consultor/liberado?escritorio=${LIB}`)).json();
    assert.equal(j.liberado, false, 'desligado na tabela prevalece sobre a lista padrão');
    j = await (await s.chamar(`/api/consultor/liberado?escritorio=${LIB}&produto=escola`)).json();
    assert.equal(j.liberado, true, 'produtos independentes');
  } finally {
    await s.fechar();
  }
});

test('liberação: CNPJ (inclusive alfanumérico) e lista padrão da variável', () => {
  assert.equal(cnpjValido('11.222.333/0001-81'), true);
  assert.equal(cnpjValido('12.ABC.345/01DE-35'), true, 'exemplo oficial do CNPJ alfanumérico');
  assert.equal(cnpjValido('11222333000182'), false);
  assert.equal(cnpjValido('00000000000000'), false);
  assert.deepEqual(lerLiberadosPadrao('11.222.333/0001-81, lixo; 11444777000161 11444777000161'), [LIB, NAO]);
  assert.deepEqual(lerLiberadosPadrao(undefined), []);
});

// ── Consumo ─────────────────────────────────────────────────────
test('consumo: conta por escritório, produto e mês (perguntas, IA, prontas, cache, bloqueadas, tokens e usos da Escola)', async () => {
  const s = await subir({ uso: { entrada: 1000, saida: 200, total: 1300 } });
  try {
    await s.perguntar({ pergunta: 'Qual o prazo de entrega da ECF?', escritorio: LIB }); // pronta
    await s.perguntar({ pergunta: 'Como contabilizar a provisão de férias?', escritorio: LIB }); // IA
    await s.perguntar({ pergunta: 'Como contabilizar a provisão de férias?', escritorio: LIB }); // cache
    await s.perguntar({ pergunta: 'Como contabilizar o arrendamento mercantil?', escritorio: NAO }); // bloqueada
    const r = await s.chamar('/api/consultor/registrar-uso', { corpo: { escritorio: LIB, produto: 'escola', quantidade: 3 } });
    assert.equal(r.status, 201);
    const mes = mesAtual();
    const c = await s.armazem.consumo(mes);
    const lib = c.find((x) => x.escritorio === LIB && x.produto === 'consultor')!;
    assert.deepEqual([lib.perguntas, lib.prontas, lib.ia, lib.cache, lib.tokensEntrada, lib.tokensSaida, lib.tokensTotal], [3, 1, 1, 1, 1000, 200, 1300]);
    const nao = c.find((x) => x.escritorio === NAO)!;
    assert.deepEqual([nao.perguntas, nao.bloqueadas, nao.ia], [1, 1, 0]);
    assert.equal(c.find((x) => x.escritorio === LIB && x.produto === 'escola')!.usos, 3);
    // O robô (interno) não conta consumo.
    await rodarConferidor(s.consultor, PERGUNTAS_TESTE.slice(0, 3));
    assert.equal((await s.armazem.consumo(mes)).find((x) => x.escritorio === LIB && x.produto === 'consultor')!.perguntas, 3);
  } finally {
    await s.fechar();
  }
});

// ── Tela do dono ────────────────────────────────────────────────
test('dono: só o dono vê; liberar, desligar com segunda confirmação, consumo do mês e CSV', async () => {
  const s = await subir();
  try {
    assert.equal((await s.chamar('/api/consultor/dono/escritorios')).status, 403, 'escritório cliente não vê');
    assert.equal((await s.chamar('/api/consultor/dono/liberacao', { corpo: { escritorio: NAO, produto: 'escola', liberado: true } })).status, 403);

    let r = await s.chamar('/api/consultor/dono/liberacao', { dono: true, corpo: { escritorio: '11.444.777/0001-61', produto: 'escola', liberado: true, nome: '=HYPERLINK("x")', plano: 'Plano 1' } });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).liberacao.liberadoPor, 'dono@murade');
    r = await s.chamar('/api/consultor/dono/liberacao', { dono: true, corpo: { escritorio: NAO, produto: 'escola', liberado: false } });
    assert.equal(r.status, 400, 'desligar sem a segunda confirmação');
    r = await s.chamar('/api/consultor/dono/liberacao', { dono: true, corpo: { escritorio: NAO, produto: 'escola', liberado: false, confirmar: true } });
    assert.equal(r.status, 200);
    assert.equal((await s.chamar('/api/consultor/dono/liberacao', { dono: true, corpo: { escritorio: '123', produto: 'escola', liberado: true } })).status, 400);
    assert.equal((await s.chamar('/api/consultor/dono/liberacao', { dono: true, corpo: { escritorio: NAO, produto: 'curso', liberado: true } })).status, 400);

    await s.perguntar({ pergunta: 'Qual o prazo de entrega da ECD?', escritorio: LIB });
    const j = await (await s.chamar('/api/consultor/dono/escritorios', { dono: true })).json();
    assert.equal(j.sucesso, true);
    const lib = j.escritorios.find((e: any) => e.escritorio === LIB);
    assert.deepEqual([lib.produtos.consultor.liberado, lib.produtos.consultor.origem, lib.produtos.escola.liberado], [true, 'padrao', true]);
    assert.equal(lib.consumo.consultor.prontas, 1);
    const nao = j.escritorios.find((e: any) => e.escritorio === NAO);
    assert.deepEqual([nao.produtos.escola.liberado, nao.produtos.escola.origem, nao.produtos.consultor.liberado, nao.nome], [false, 'tabela', false, '=HYPERLINK("x")']);

    const csv = await s.chamar(`/api/consultor/dono/consumo.csv?mes=${mesAtual()}`, { dono: true });
    assert.equal(csv.status, 200);
    assert.match(csv.headers.get('content-type') ?? '', /text\/csv/);
    const bytes = new Uint8Array(await csv.arrayBuffer());
    assert.deepEqual([...bytes.slice(0, 3)], [0xef, 0xbb, 0xbf], 'BOM para o Excel abrir com acentos');
    const texto = new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes);
    assert.ok(texto.startsWith('﻿mes;escritorio_cnpj;nome;plano;produto;liberado;perguntas;com_ia;prontas;cache;bloqueadas;usos'));
    assert.ok(texto.includes(`;${LIB};`));
    assert.ok(texto.includes(`"'=HYPERLINK(""x"")"`), 'célula com fórmula é neutralizada');
    assert.equal((await s.chamar('/api/consultor/dono/consumo.csv')).status, 403);
  } finally {
    await s.fechar();
  }
});

test('saúde: inclui a conferência das respostas prontas', async () => {
  const s = await subir();
  try {
    const j = await (await s.chamar('/api/consultor/saude')).json();
    assert.equal(j.respostasProntas.situacao, 'ok');
    assert.equal(j.respostasProntas.total, RESPOSTAS_PRONTAS.length);
    const saude = await rodarConferidor(s.consultor, PERGUNTAS_TESTE.slice(0, 2));
    assert.equal(saude.respostasProntas?.total, RESPOSTAS_PRONTAS.length);
  } finally {
    await s.fechar();
  }
});

// ── Procedimentos ("como faço…") e ondeFazer ────────────────────
const TELAS = [
  { id: 'fgts-guias', nome: 'Guias do FGTS', caminho: 'DP > FGTS > Guias', oQueFaz: 'Gera a guia do FGTS mensal e rescisória' },
  { id: 'simples-das', nome: 'Gerar DAS', caminho: 'Fiscal > Simples Nacional > Gerar DAS', oQueFaz: 'Gera o DAS do Simples, inclusive vencido' },
];

test('procedimentos: "como faço" acha o passo a passo com portal oficial; com a tela do sistema, manda para o sistema', () => {
  const procs = RESPOSTAS_PRONTAS.filter((p) => p.ondeFazer);
  assert.ok(procs.length >= 7);
  for (const p of procs) assert.ok(urlOficial(p.ondeFazer!.url), p.id);
  const casos: [string, string][] = [
    ['como pego a CND?', 'proc-emitir-cnd'],
    ['como parcelo o DAS?', 'proc-parcelar-simples'],
    ['como dou baixa no MEI?', 'proc-baixa-mei'],
    ['como retifico o PGDAS-D?', 'proc-retificar-pgdas'],
    ['como emito a guia do FGTS rescisório?', 'proc-guia-fgts-rescisorio'],
    ['como gero o DAS de um mês vencido?', 'proc-emitir-das'],
  ];
  for (const [q, id] of casos) {
    const d = decidirPronta({ pergunta: q, sistema: 'fiscal' });
    assert.ok(d.tipo === 'pronta' && d.pronta.id === id, q);
    assert.equal(d.tipo === 'pronta' && d.resposta.ondeFazer?.tipo, 'externo', q);
  }
  // Regra (não procedimento) continua com a resposta de regra.
  assert.equal(buscarPronta('Em quantas parcelas posso parcelar débitos do Simples Nacional?')?.pronta.id, 'sn-parcelamento');

  const sis = decidirPronta({ pergunta: 'como emito a guia do FGTS rescisório?', sistema: 'dp', telasDoSistema: TELAS });
  assert.equal(sis.tipo, 'pronta');
  if (sis.tipo !== 'pronta') return;
  assert.deepEqual([sis.resposta.ondeFazer?.tipo, sis.resposta.ondeFazer?.tela], ['sistema', 'fgts-guias']);
  assert.ok(sis.resposta.resposta.startsWith('No sistema: abra DP > FGTS > Guias'));
  assert.ok(sis.resposta.resposta.includes('fgtsdigital.sistema.gov.br'), 'mantém a regra oficial');
  const das = decidirPronta({ pergunta: 'como gero o DAS de um mês vencido?', sistema: 'fiscal', telasDoSistema: TELAS });
  assert.equal(das.tipo === 'pronta' && das.resposta.ondeFazer?.tela, 'simples-das');
  const fora = decidirPronta({ pergunta: 'como dou baixa no MEI?', sistema: 'fiscal', telasDoSistema: TELAS });
  assert.equal(fora.tipo === 'pronta' && fora.resposta.ondeFazer?.tipo, 'externo', 'o sistema não faz baixa de MEI: portal oficial');
});

test('ondeFazer da IA: tela só se existir no mapa; portal só oficial; telasDoSistema validado; não vai para o cache', async () => {
  const texto = respostaIA({ resposta: 'No sistema: abra Fiscal > NF-e > Cancelar.', ondeFazer: { tipo: 'sistema', tela: 'nfe-cancelar', passos: ['Abra Fiscal > NF-e > Cancelar.'] } });
  const s = await subir({ texto });
  try {
    const telas = [{ id: 'nfe-cancelar', nome: 'Cancelar NF-e', caminho: 'Fiscal > NF-e > Cancelar', oQueFaz: 'Cancela a NF-e autorizada' }];
    const a = await s.perguntar({ pergunta: 'Como cancelo uma NF-e?', escritorio: LIB, telasDoSistema: telas as any });
    assert.deepEqual(a.j.ondeFazer, { tipo: 'sistema', tela: 'nfe-cancelar', passos: ['Abra Fiscal > NF-e > Cancelar.'] });
    const b = await s.perguntar({ pergunta: 'Como cancelo uma NF-e?', escritorio: LIB, telasDoSistema: [{ id: 'outra', nome: 'x', caminho: 'y', oQueFaz: 'z' }] as any });
    assert.equal(b.j.ondeFazer, undefined, 'tela inexistente no mapa é descartada');
    assert.equal(s.chamadasIA(), 2, 'com mapa de telas não usa cache');
    assert.equal((await s.perguntar({ pergunta: 'x', telasDoSistema: 'telas' as any })).status, 400);
  } finally {
    await s.fechar();
  }
});

test('ondeFazer externo: url não oficial é descartada', async () => {
  const { validarOndeFazer } = await import('./validar');
  assert.deepEqual(validarOndeFazer({ tipo: 'externo', url: 'https://blog.com/x', passos: ['a'] }), { tipo: 'externo', passos: ['a'] });
  assert.deepEqual(validarOndeFazer({ tipo: 'externo', url: 'https://fgtsdigital.sistema.gov.br', passos: [] }), { tipo: 'externo', url: 'https://fgtsdigital.sistema.gov.br', passos: [] });
  assert.equal(validarOndeFazer({ tipo: 'externo', url: 'https://blog.com', passos: [] }), undefined);
  assert.equal(validarOndeFazer({ tipo: 'sistema', tela: 'x', passos: ['a'] }, []), undefined);
});
