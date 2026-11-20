import assert from 'node:assert/strict';
import test from 'node:test';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { escolherBlocos, montarInstrucao } from './cerebro';
import { conferirResposta, PERGUNTAS_TESTE, rodarConferidor } from './conferidor';
import { dominioOficial, filtrarFontesOficiais, fontesDaPesquisa } from './fontes';
import { mascararObjeto, mascararTexto } from './mascarar';
import { criarArmazemMemoria } from './registro';
import { criarLiberacoes } from './liberacao';
import { registrarRotasConsultor, tokenConfere } from './rotas';
import { criarConsultor } from './servico';
import { AVISO_RESPONSABILIDADE, FRASE_ACEITE, GeminiIndisponivel, type PerguntaConsultor, type RespostaBruta } from './tipos';
import { montarResposta, validarPergunta } from './validar';

const TOKEN = 'segredo-de-teste-123';
/** CNPJs válidos de teste: um liberado pela lista padrão, outro não. */
export const CNPJ_LIBERADO = '11222333000181';
export const CNPJ_OUTRO = '11444777000161';

function respostaModelo(extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    resposta: 'O DAS vence no dia 20 do mês seguinte (Resolução CGSN 140, art. 40).',
    area: 'fiscal',
    fontes: [
      { titulo: 'Perguntão do Simples', url: 'https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoSN.pdf' },
      { titulo: 'Blog qualquer', url: 'https://www.blogcontabil.com.br/das' },
    ],
    confianca: 'alta',
    encaminharContador: false,
    acoesSugeridas: [
      { ferramenta: 'gerar_das', descricao: 'Gerar o DAS da competência', argumentos: '{"competencia":"2026-10"}' },
      { ferramenta: 'ferramenta_inventada', descricao: 'Não existe' },
    ],
    ...extra,
  });
}

async function subir(gerar: (p: PerguntaConsultor) => Promise<RespostaBruta>, token: string | null = TOKEN) {
  const armazem = criarArmazemMemoria();
  const liberacoes = criarLiberacoes(armazem, { padrao: () => [CNPJ_LIBERADO], cacheMs: 0 });
  const consultor = criarConsultor({ gerar: async (p) => gerar(p), armazem, liberacoes });
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  registrarRotasConsultor(app, { consultor, armazem, lerToken: () => token ?? undefined, maxPorMinuto: 1000 });
  const srv = app.listen(0);
  await new Promise((r) => srv.once('listening', r));
  const base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
  const chamar = (caminho: string, opcoes: { corpo?: unknown; token?: string | null; metodo?: string } = {}) =>
    fetch(base + caminho, {
      method: opcoes.metodo ?? (opcoes.corpo !== undefined ? 'POST' : 'GET'),
      headers: {
        'content-type': 'application/json',
        ...(opcoes.token === null ? {} : { 'x-murade-consultor-token': opcoes.token ?? TOKEN }),
      },
      body:
        opcoes.corpo !== undefined
          ? JSON.stringify(
              caminho === '/api/consultor/perguntar' && opcoes.corpo && typeof opcoes.corpo === 'object' && !('escritorio' in (opcoes.corpo as object))
                ? { ...(opcoes.corpo as object), escritorio: CNPJ_LIBERADO }
                : opcoes.corpo,
            )
          : undefined,
    });
  return { chamar, armazem, fechar: () => new Promise((r) => srv.close(r)) };
}

const geradorFixo = (texto = respostaModelo()) => async (): Promise<RespostaBruta> => ({ texto, fontesPesquisa: [], modelo: 'teste' });

// ── Autenticação ────────────────────────────────────────────────
test('autenticação: sem MURADE_CONSULTOR_TOKEN → 503 "não configurado"', async () => {
  const s = await subir(geradorFixo(), null);
  try {
    const r = await s.chamar('/api/consultor/perguntar', { corpo: { pergunta: 'x', sistema: 'fiscal' } });
    assert.equal(r.status, 503);
    assert.match((await r.json()).erro, /não configurado/);
  } finally {
    await s.fechar();
  }
});

test('autenticação: sem token ou com token errado → 401; nas três rotas', async () => {
  const s = await subir(geradorFixo());
  try {
    assert.equal((await s.chamar('/api/consultor/perguntar', { corpo: { pergunta: 'x', sistema: 'fiscal' }, token: null })).status, 401);
    assert.equal((await s.chamar('/api/consultor/perguntar', { corpo: { pergunta: 'x', sistema: 'fiscal' }, token: 'errado' })).status, 401);
    assert.equal((await s.chamar('/api/consultor/nao-respondidas', { token: 'errado' })).status, 401);
    assert.equal((await s.chamar('/api/consultor/saude', { token: null })).status, 401);
    assert.equal((await s.chamar('/api/consultor/saude')).status, 200);
  } finally {
    await s.fechar();
  }
});

test('tokenConfere: igual, diferente, tamanhos diferentes e vazio', () => {
  assert.equal(tokenConfere('abc', 'abc'), true);
  assert.equal(tokenConfere('abd', 'abc'), false);
  assert.equal(tokenConfere('abcdef', 'abc'), false);
  assert.equal(tokenConfere('', ''), false);
});

// ── Validação do corpo ──────────────────────────────────────────
test('validação: pergunta obrigatória, limite de 30000, sistema válido, regime válido', async () => {
  assert.equal(validarPergunta(null).ok, false);
  assert.equal(validarPergunta({ sistema: 'fiscal' }).ok, false);
  assert.equal(validarPergunta({ pergunta: '   ', sistema: 'fiscal' }).ok, false);
  assert.equal(validarPergunta({ pergunta: 'a'.repeat(30001), sistema: 'fiscal' }).ok, false);
  assert.equal(validarPergunta({ pergunta: 'a'.repeat(30000), sistema: 'fiscal' }).ok, true);
  assert.equal(validarPergunta({ pergunta: 'oi', sistema: 'rh' }).ok, false);
  assert.equal(validarPergunta({ pergunta: 'oi', sistema: 'dp', contextoEmpresa: { regime: 'lucro' } }).ok, false);
  assert.equal(validarPergunta({ pergunta: 'oi', sistema: 'dp', historico: 'x' }).ok, false);
  const v = validarPergunta({
    pergunta: 'oi',
    sistema: 'contabil',
    contextoEmpresa: { regime: 'simples', uf: 'go', outros: { a: 1, b: { c: 1 } } },
    historico: Array.from({ length: 12 }, (_, i) => ({ papel: i % 2 ? 'consultor' : 'usuario', texto: `m${i}` })),
    ferramentasDisponiveis: [{ nome: 'gerar_das', descricao: 'Gera DAS' }, { descricao: 'sem nome' }],
  });
  assert.ok(v.ok);
  if (v.ok) {
    assert.equal(v.valor.historico!.length, 8);
    assert.equal(v.valor.historico![7].texto, 'm11');
    assert.equal(v.valor.contextoEmpresa!.uf, 'GO');
    assert.deepEqual(v.valor.contextoEmpresa!.outros, { a: 1 });
    assert.equal(v.valor.ferramentasDisponiveis!.length, 1);
  }
  const s = await subir(geradorFixo());
  try {
    const r = await s.chamar('/api/consultor/perguntar', { corpo: { pergunta: '', sistema: 'fiscal' } });
    assert.equal(r.status, 400);
  } finally {
    await s.fechar();
  }
});

// ── Filtro de fontes ────────────────────────────────────────────
test('fontes: só domínios oficiais (e subdomínios), sem imitações', () => {
  assert.equal(dominioOficial('www.planalto.gov.br'), true);
  assert.equal(dominioOficial('www2.camara.leg.br'), true);
  assert.equal(dominioOficial('appasp.economia.go.gov.br'), true);
  assert.equal(dominioOficial('cfc.org.br'), true);
  assert.equal(dominioOficial('gov.br.golpe.com'), false);
  assert.equal(dominioOficial('falsogov.br'), false);
  assert.equal(dominioOficial('jornalcontabil.com.br'), false);
  const f = filtrarFontesOficiais([
    { titulo: 'Planalto', url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm' },
    { titulo: 'Repetida', url: 'http://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm' },
    { titulo: 'Blog', url: 'https://www.contabeis.com.br/x' },
    { titulo: 'Truque', url: 'https://gov.br@evil.com/' },
    { titulo: 'JS', url: 'javascript:alert(1)' },
    { titulo: 'Sem url' },
  ]);
  assert.deepEqual(f.map((x) => x.titulo), ['Planalto']);
  const p = fontesDaPesquisa([
    { web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc', title: 'gov.br' } },
    { web: { uri: 'https://www.gov.br/esocial/pt-br', title: 'eSocial' } },
    { web: { uri: 'https://blog.com/x', title: 'blog.com' } },
  ]);
  assert.equal(p.fontes.length, 1);
  assert.ok(p.dominiosOficiaisVistos.includes('gov.br'));
});

test('resposta: descarta fonte não oficial; sem fonte oficial → confiança baixa e encaminhar', () => {
  const ok = montarResposta(JSON.parse(respostaModelo()), { sistema: 'fiscal', ferramentas: [] });
  assert.equal(ok.fontes.length, 1);
  assert.equal(ok.confianca, 'alta');
  assert.equal(ok.encaminharContador, false);
  assert.equal(ok.avisoResponsabilidade, AVISO_RESPONSABILIDADE);

  const semOficial = montarResposta(JSON.parse(respostaModelo({ fontes: [{ titulo: 'Blog', url: 'https://www.blogcontabil.com.br/das' }] })), { sistema: 'fiscal' });
  assert.equal(semOficial.fontes.length, 0);
  assert.equal(semOficial.confianca, 'baixa');
  assert.equal(semOficial.encaminharContador, true);
  assert.ok(semOficial.motivoEncaminhamento);

  const invalida = montarResposta(null, { sistema: 'dp' });
  assert.equal(invalida.confianca, 'baixa');
  assert.equal(invalida.encaminharContador, true);
  assert.equal(invalida.area, 'dp');
});

// ── Ações só de ferramentasDisponiveis ──────────────────────────
test('ações: só ferramentas recebidas; argumentos em texto JSON viram objeto', async () => {
  const s = await subir(geradorFixo());
  try {
    const r = await s.chamar('/api/consultor/perguntar', {
      corpo: { pergunta: 'Em qual conta contábil lanço o DAS pago?', sistema: 'fiscal', ferramentasDisponiveis: [{ nome: 'gerar_das', descricao: 'Gera o DAS' }] },
    });
    assert.equal(r.status, 200);
    const j = await r.json();
    assert.deepEqual(j.acoesSugeridas.map((a: any) => a.ferramenta), ['gerar_das']);
    assert.deepEqual(j.acoesSugeridas[0].argumentos, { competencia: '2026-10' });
    assert.equal(j.fontes.length, 1);
    assert.equal(j.avisoResponsabilidade, AVISO_RESPONSABILIDADE);

    const sem = await (await s.chamar('/api/consultor/perguntar', { corpo: { pergunta: 'Em qual conta contábil lanço o DAS pago?', sistema: 'fiscal' } })).json();
    assert.deepEqual(sem.acoesSugeridas, []);
  } finally {
    await s.fechar();
  }
});

// ── Mascaramento e registro ─────────────────────────────────────
test('mascaramento: CPF, e-mail, telefone e PIS somem; CNPJ de empresa fica', () => {
  const t = mascararTexto('João CPF 123.456.789-09, outro 12345678909, CNPJ 12.345.678/0001-90 e 12345678000190, joao@x.com, (62) 99999-1234, PIS 123.45678.90-1');
  assert.ok(!t.includes('123.456.789-09'));
  assert.ok(!t.includes('12345678909'));
  assert.ok(!t.includes('joao@x.com'));
  assert.ok(!t.includes('99999-1234'));
  assert.ok(!t.includes('123.45678.90-1'));
  assert.ok(t.includes('12.345.678/0001-90'));
  assert.ok(t.includes('12345678000190'));
  const o = mascararObjeto({ cnpj: '123.456.789-09', razaoSocial: 'MARIA 12345678909', regime: 'mei' });
  assert.equal(o.cnpj, '***********');
  assert.ok(!o.razaoSocial.includes('12345678909'));
});

test('registro: pergunta guardada mascarada; baixa confiança aparece em nao-respondidas', async () => {
  const s = await subir(geradorFixo(respostaModelo({ fontes: [], confianca: 'media' })));
  try {
    await s.chamar('/api/consultor/perguntar', { corpo: { pergunta: 'Meu CPF é 123.456.789-09, posso abrir MEI?', sistema: 'fiscal' } });
    const j = await (await s.chamar('/api/consultor/nao-respondidas')).json();
    assert.equal(j.total, 1);
    assert.ok(!j.itens[0].pergunta.includes('123.456.789-09'));
    assert.equal(j.itens[0].confianca, 'baixa');
    assert.equal(j.itens[0].encaminharContador, true);
  } finally {
    await s.fechar();
  }
});

test('Gemini fora: rota responde 503 com resposta padrão e registra "gemini_indisponivel"', async () => {
  const s = await subir(async () => {
    throw new GeminiIndisponivel('cota');
  });
  try {
    const r = await s.chamar('/api/consultor/perguntar', { corpo: { pergunta: 'Como contabilizar a provisão de férias?', sistema: 'fiscal' } });
    assert.equal(r.status, 503);
    const j = await r.json();
    assert.equal(j.encaminharContador, true);
    assert.equal(j.avisoResponsabilidade, AVISO_RESPONSABILIDADE);
    const n = await (await s.chamar('/api/consultor/nao-respondidas')).json();
    assert.equal(n.itens[0].situacao, 'gemini_indisponivel');
  } finally {
    await s.fechar();
  }
});

// ── Conferidor ──────────────────────────────────────────────────
test('conferidor sem Gemini: registra "não testado", nunca "erro"', async () => {
  const sem = await rodarConferidor(null);
  assert.equal(sem.situacao, 'nao_testado');
  assert.equal(sem.naoTestados, PERGUNTAS_TESTE.length);
  assert.equal(sem.erros, 0);

  const armazem = criarArmazemMemoria();
  const fora = criarConsultor({ gerar: async () => { throw new GeminiIndisponivel('fora'); }, armazem });
  const r = await rodarConferidor(fora);
  assert.equal(r.erros, 0, 'Gemini fora nunca vira erro');
  assert.ok(r.naoTestados >= 1, 'o que precisa de IA fica "não testado"');
  assert.ok(r.acertos >= 30, 'com o Gemini fora, as respostas prontas continuam sendo conferidas');
  assert.ok(r.resultados.filter((x) => x.situacao === 'acertou').every((x) => x.origem === 'pronta'));
  const so = criarConsultor({ gerar: async () => { throw new GeminiIndisponivel('fora'); }, armazem, prontas: [] });
  assert.equal((await rodarConferidor(so)).situacao, 'nao_testado');
  assert.equal((await armazem.naoRespondidas(10)).length, 0, 'teste do robô não entra no registro de perguntas');
});

test('conferidor: acerta por palavra-chave e aponta o que faltou', async () => {
  assert.ok(PERGUNTAS_TESTE.length >= 20);
  assert.deepEqual(conferirResposta('Vence no dia 20 do mês seguinte.', [['20', 'vinte']]), []);
  assert.deepEqual(conferirResposta('Até dez dias do término (CLT, art. 477, § 6º).', [['10 dias', 'dez dias'], ['477']]), []);
  assert.deepEqual(conferirResposta('Até o último dia útil do mês.', [['ultimo dia util']]), []);
  assert.equal(conferirResposta('Pague em 30 dias.', [['10 dias', 'dez dias'], ['477']]).length, 2);

  const armazem = criarArmazemMemoria();
  const consultor = criarConsultor({
    armazem,
    prontas: [], // aqui o teste é da IA
    gerar: async (p) => ({
      texto: respostaModelo({ resposta: p.pergunta.includes('PGDAS') ? 'Até o dia 20.' : 'Não sei.' }),
      fontesPesquisa: [],
    }),
  });
  const r = await rodarConferidor(consultor, PERGUNTAS_TESTE.filter((t) => ['pgdas-prazo', 'fgts-multa'].includes(t.id)));
  assert.equal(r.acertos, 1);
  assert.equal(r.erros, 1);
  assert.equal(r.situacao, 'com_falhas');
});

// ── Cérebro ─────────────────────────────────────────────────────
test('cérebro: escolhe blocos conferidos e põe contexto, ferramentas e aviso de verdade na instrução', () => {
  const blocos = escolherBlocos('Qual o prazo do PGDAS-D e do DAS no Simples Nacional?', 'fiscal', { regime: 'simples' });
  assert.ok(blocos.length > 0);
  assert.ok(blocos.some((b) => b.id === 'simples-prazos-obrigacoes-conferido'));
  const instr = montarInstrucao(
    { pergunta: 'x', sistema: 'dp', contextoEmpresa: { regime: 'simples', anexoSimples: 'III' }, ferramentasDisponiveis: [{ nome: 'gerar_das', descricao: 'Gera DAS' }] },
    blocos,
  );
  assert.match(instr, /Simples Nacional/);
  assert.match(instr, /Anexo do Simples: III/);
  assert.match(instr, /gerar_das/);
  assert.match(instr, /planalto\.gov\.br/);
});

// ── Divergência: o contador decide diferente ────────────────────
const RESPOSTA_DIVERGENCIA = respostaModelo({
  resposta: 'Pela CLT, art. 477, § 6º, o certo é pagar a rescisão em até 10 dias (link oficial).',
  area: 'dp',
  fontes: [{ titulo: 'CLT (Câmara)', url: 'https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-5452-1-maio-1943-415500-normaatualizada-pe.html' }],
  divergencia: {
    orientacao: 'Pagar as verbas rescisórias em até 10 dias do término do contrato (CLT, art. 477, § 6º).',
    fonteTitulo: 'Blog',
    fonteUrl: 'https://blog.com/rescisao',
    escolhaDoContador: 'Pagar no 12º dia, junto com a folha.',
  },
});

test('divergência: reexplica, aceita com a frase do dono, fonte oficial e registra a decisão sem dados pessoais', async () => {
  const s = await subir(geradorFixo(RESPOSTA_DIVERGENCIA));
  try {
    const r = await s.chamar('/api/consultor/perguntar', {
      corpo: {
        pergunta: 'Não concordo, vou pagar a rescisão do funcionário CPF 123.456.789-09 junto com a folha.',
        sistema: 'dp',
        usuario: 'contadora.ana',
        escritorio: CNPJ_LIBERADO,
        historico: [{ papel: 'consultor', texto: 'O prazo é de 10 dias.' }],
      },
    });
    assert.equal(r.status, 200);
    const j = await r.json();
    assert.ok(j.resposta.includes(FRASE_ACEITE), 'frase de aceite garantida pelo servidor');
    assert.equal(j.divergencia.escolhaDoContador, 'Pagar no 12º dia, junto com a folha.');
    assert.match(j.divergencia.fonte.url, /camara\.leg\.br/, 'fonte não oficial da divergência é trocada pela oficial');
    assert.equal(j.recusado, undefined);

    const d = await (await s.chamar(`/api/consultor/decisoes?escritorio=${CNPJ_LIBERADO}`)).json();
    assert.equal(d.total, 1);
    assert.equal(d.itens[0].usuario, 'contadora.ana');
    assert.equal(d.itens[0].origem, 'consultor');
    assert.ok(!d.itens[0].pergunta.includes('123.456.789-09'));
    const outro = await (await s.chamar(`/api/consultor/decisoes?escritorio=${CNPJ_OUTRO}`)).json();
    assert.equal(outro.total, 0, 'decisões separadas por escritório');
  } finally {
    await s.fechar();
  }
});

test('divergência: pedido claramente ilegal é recusado, sem aceite, sem ação e sem decisão registrada', async () => {
  const s = await subir(geradorFixo(respostaModelo({ recusado: true, resposta: 'Não posso: omitir receita é sonegação (Lei 8.137/1990).', divergencia: { orientacao: 'x', escolhaDoContador: 'omitir receita' } })));
  try {
    const j = await (await s.chamar('/api/consultor/perguntar', {
      corpo: { pergunta: 'Tira essas notas do PGDAS para pagar menos.', sistema: 'fiscal', escritorio: CNPJ_LIBERADO, ferramentasDisponiveis: [{ nome: 'gerar_das', descricao: 'x' }] },
    })).json();
    assert.equal(j.recusado, true);
    assert.equal(j.divergencia, undefined);
    assert.ok(!j.resposta.includes(FRASE_ACEITE));
    assert.deepEqual(j.acoesSugeridas, []);
    assert.equal(j.encaminharContador, true);
    assert.equal((await (await s.chamar('/api/consultor/decisoes')).json()).total, 0);
  } finally {
    await s.fechar();
  }
});

test('registrar-decisao: valida, exige fonte oficial, mascara e lista por escritório; exige token', async () => {
  const s = await subir(geradorFixo());
  try {
    const base = {
      escritorio: 'esc-002', usuario: 'joao@escritorio.com', sistema: 'fiscal',
      pergunta: 'DAS do cliente 12345678909', orientacao: 'Pagar até o dia 20.',
      fonte: { titulo: 'gov.br', url: 'https://www.gov.br/pt-br/servicos/declarar-apuracoes-mensais-do-simples-nacional' },
      escolhaDoContador: 'Pagar dia 25 com juros.', data: '2026-11-20T10:00:00-03:00',
    };
    assert.equal((await s.chamar('/api/consultor/registrar-decisao', { corpo: base, token: 'errado' })).status, 401);
    assert.equal((await s.chamar('/api/consultor/registrar-decisao', { corpo: { ...base, escolhaDoContador: '' } })).status, 400);
    assert.equal((await s.chamar('/api/consultor/registrar-decisao', { corpo: { ...base, fonte: { titulo: 'blog', url: 'https://blog.com' } } })).status, 400);
    assert.equal((await s.chamar('/api/consultor/registrar-decisao', { corpo: { ...base, data: 'ontem' } })).status, 400);
    const r = await s.chamar('/api/consultor/registrar-decisao', { corpo: base });
    assert.equal(r.status, 201);
    const d = await (await s.chamar('/api/consultor/decisoes?escritorio=esc-002')).json();
    assert.equal(d.total, 1);
    assert.equal(d.itens[0].usuario, '[e-mail]');
    assert.ok(!d.itens[0].pergunta.includes('12345678909'));
    assert.equal(d.itens[0].data, '2026-11-20T13:00:00.000Z');
    assert.equal(d.itens[0].origem, 'sistema');
    assert.equal((await s.chamar('/api/consultor/decisoes', { token: null })).status, 401);
  } finally {
    await s.fechar();
  }
});

test('base: blocos novos são escolhidos para as perguntas da área', () => {
  const casos: [string, string, string][] = [
    ['Qual o prazo do S-2299 de desligamento no eSocial?', 'dp', 'esocial-prazos-nao-periodicos-mos'],
    ['Como funciona a licença-paternidade da Lei 15.371?', 'dp', 'licenca-paternidade-lei-15371'],
    ['Posso parcelar o Simples em quantas parcelas?', 'fiscal', 'obrigacoes-federais-ecd-ecf-dirbi-certidoes-parcelamento'],
    ['Prazo do DIFAL do Simples em Goiás?', 'fiscal', 'icms-go-st-difal-monofasico'],
    ['Como pagar PLR sem encargos?', 'dp', 'plr-seguro-desemprego-consignado'],
  ];
  for (const [pergunta, sistema, id] of casos) {
    const ids = escolherBlocos(pergunta, sistema).map((b) => b.id);
    assert.ok(ids.includes(id), `${pergunta} → esperava ${id}, veio ${ids.join(', ')}`);
  }
});
