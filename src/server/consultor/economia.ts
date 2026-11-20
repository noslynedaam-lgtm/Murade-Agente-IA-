// Economia de crédito do Gemini: respostas prontas (conferidas) e cache das respostas da IA.
import crypto from 'node:crypto';
import { KNOWLEDGE_BASE_DOCS } from '../../data/knowledgeDocs';
import { urlOficial } from './fontes';
import { mascararTexto } from './mascarar';
import { RESPOSTAS_PRONTAS, type RespostaPronta } from './respostasProntas';
import { numeros, pareceCasoConcreto, pareceDivergencia, pareceSeguimento, pedeCalculo, perguntaNormalizada, semelhanca, termos } from './similaridade';
import { AVISO_RESPONSABILIDADE, type Area, type ContextoEmpresa, type OndeFazer, type PerguntaConsultor, type RespostaConsultor, type TelaSistema } from './tipos';

// ── Busca da resposta pronta ─────────────────────────────────────
/** Semelhança mínima (Dice) entre a pergunta e uma das variações. Conservador: na dúvida, vai para a IA. */
export const LIMIAR_PRONTA = 0.5;
/** Parte mínima das palavras da pergunta que precisa existir no vocabulário da resposta pronta. */
const COBERTURA_MINIMA = 0.6;
/** Diferença mínima entre a melhor e a segunda melhor resposta (senão é ambíguo e vai para a IA). */
const MARGEM = 0.06;
const MAX_TERMOS = 30;

type Indice = { pronta: RespostaPronta; variacoes: string[][]; vocabulario: Set<string>; chaves: string[][][]; numeros: Set<string>; exceto: string[][] };

function indexar(prontas: RespostaPronta[]): Indice[] {
  return prontas.map((pronta) => {
    const variacoes = pronta.perguntas.map(termos);
    const vocabulario = new Set(variacoes.flat());
    const chaves = pronta.chaves.map((grupo) => grupo.map(termos).filter((t) => t.length > 0));
    for (const grupo of chaves) for (const alt of grupo) for (const t of alt) vocabulario.add(t);
    const nums = new Set([...numeros(variacoes.flat()), ...numeros(termos(pronta.resposta))]);
    const exceto = (pronta.exceto ?? []).map(termos).filter((t) => t.length > 0);
    return { pronta, variacoes, vocabulario, chaves, numeros: nums, exceto };
  });
}

let INDICE_PADRAO: Indice[] | null = null;
const indicePadrao = () => (INDICE_PADRAO ??= indexar(RESPOSTAS_PRONTAS));
const cacheIndices = new WeakMap<RespostaPronta[], Indice[]>();

export type Achado = { pronta: RespostaPronta; nota: number };

/** Procura a resposta pronta mais parecida; devolve null quando não há uma clara o bastante. */
export function buscarPronta(pergunta: string, prontas?: RespostaPronta[]): Achado | null {
  const indice = prontas ? (cacheIndices.get(prontas) ?? (cacheIndices.set(prontas, indexar(prontas)), cacheIndices.get(prontas)!)) : indicePadrao();
  const q = termos(pergunta);
  if (!q.length || q.length > MAX_TERMOS) return null;
  const qSet = new Set(q);
  const qNums = numeros(q);
  const notas: Achado[] = [];
  for (const it of indice) {
    if (!it.chaves.every((grupo) => grupo.some((alt) => alt.every((t) => qSet.has(t))))) continue;
    if (it.exceto.some((alt) => alt.every((t) => qSet.has(t)))) continue;
    if (qNums.some((n) => !it.numeros.has(n))) continue; // número que a resposta não trata → IA
    const cobertura = [...qSet].filter((t) => it.vocabulario.has(t)).length / qSet.size;
    if (cobertura < COBERTURA_MINIMA) continue;
    const nota = Math.max(...it.variacoes.map((v) => semelhanca(q, v)));
    if (nota >= LIMIAR_PRONTA) notas.push({ pronta: it.pronta, nota });
  }
  if (!notas.length) return null;
  notas.sort((a, b) => b.nota - a.nota);
  if (notas.length > 1 && notas[0].nota - notas[1].nota < MARGEM) return null; // ambíguo
  return notas[0];
}

// ── Decisão: pronta, IA ou pronta geral ──────────────────────────
const NOMES_REGIME: Record<string, string> = { simples: 'Simples Nacional', presumido: 'Lucro Presumido', real: 'Lucro Real', mei: 'MEI (SIMEI)' };

function temContexto(c?: ContextoEmpresa): c is ContextoEmpresa {
  return !!c && Object.values(c).some((v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length));
}

/** Frase de abertura com os dados da empresa (modelo de texto, sem IA). */
export function aberturaEmpresa(c: ContextoEmpresa): string {
  const partes: string[] = [];
  if (c.regime) partes.push(`que é do ${NOMES_REGIME[c.regime]}${c.regime === 'simples' && c.anexoSimples ? `, Anexo ${c.anexoSimples}` : ''}`);
  if (c.temFuncionarios !== undefined) partes.push(c.temFuncionarios ? `com ${c.qtdFuncionarios ?? 'algum(ns)'} empregado(s)` : 'sem empregados');
  if (c.municipio || c.uf) partes.push(`em ${[c.municipio, c.uf].filter(Boolean).join('/')}`);
  const nome = c.razaoSocial ? mascararTexto(c.razaoSocial).slice(0, 120) : 'sua empresa';
  return `Para ${c.razaoSocial ? `a ${nome}` : nome}${partes.length ? `, ${partes.join(', ')}` : ''}:`;
}

export type DecisaoPronta =
  | { tipo: 'pronta'; resposta: RespostaConsultor; pronta: RespostaPronta; personalizada: boolean }
  /** A pergunta tem resposta pronta, mas depende do caso da empresa e não deu para personalizar: IA (se liberado) ou a regra geral com aviso. */
  | { tipo: 'geral'; resposta: RespostaConsultor; pronta: RespostaPronta }
  | { tipo: 'nenhuma'; motivo: string };

/** Tela do sistema chamador que faz o procedimento da resposta pronta (pelas palavras da tela), ou nenhuma. */
export function acharTela(pr: RespostaPronta, telas: TelaSistema[] | undefined, pergunta = ''): TelaSistema | undefined {
  if (!pr.ondeFazer || !telas?.length) return undefined;
  const grupos = pr.ondeFazer.palavrasTela.map((g) => g.map(termos).filter((t) => t.length > 0));
  const q = termos(`${pergunta} ${pr.perguntas.join(' ')}`);
  const candidatas = telas
    .map((t) => ({ t, ts: termos(`${t.nome} ${t.caminho} ${t.oQueFaz}`) }))
    .filter(({ ts }) => {
      const set = new Set(ts);
      return grupos.every((g) => g.some((alt) => alt.every((x) => set.has(x))));
    })
    .map(({ t, ts }) => ({ t, nota: semelhanca(q, ts) }))
    .sort((a, b) => b.nota - a.nota);
  return candidatas[0]?.t;
}

/** Texto e ondeFazer do procedimento: tela do sistema quando houver; senão portal oficial. */
function procedimento(pr: RespostaPronta, texto: string, p: PerguntaConsultor): { texto: string; ondeFazer?: OndeFazer } {
  if (!pr.ondeFazer) return { texto };
  const tela = acharTela(pr, p.telasDoSistema, p.pergunta);
  if (tela) {
    const inicio = `No sistema: abra ${tela.caminho} (${tela.nome})${tela.oQueFaz ? ` — ${tela.oQueFaz}` : ''}.`;
    return {
      texto: `${inicio}\n\nRegras oficiais e o caminho fora do sistema, se precisar:\n${texto}`,
      ondeFazer: { tipo: 'sistema', tela: tela.id, passos: [`Abra ${tela.caminho}.`, ...pr.ondeFazer.passos.slice(-1)] },
    };
  }
  return { texto, ondeFazer: { tipo: 'externo', url: pr.ondeFazer.url, passos: [...pr.ondeFazer.passos] } };
}

function montar(pr: RespostaPronta, texto: string, p?: PerguntaConsultor): RespostaConsultor {
  const proc = p ? procedimento(pr, texto, p) : { texto };
  return {
    ...(proc.ondeFazer ? { ondeFazer: proc.ondeFazer } : {}),
    resposta: proc.texto,
    area: pr.area,
    fontes: pr.fontes.map((f) => ({ ...f })),
    confianca: 'alta',
    encaminharContador: false,
    acoesSugeridas: [],
    avisoResponsabilidade: AVISO_RESPONSABILIDADE,
    origem: 'pronta',
    custoIA: false,
    respostaProntaId: pr.id,
    conferidoEm: pr.conferidoEm,
  };
}

export const AVISO_RESPOSTA_GERAL =
  'Esta é a regra geral. Para analisar o caso da sua empresa, use o Consultor Murade completo (adicional) ou fale com o contador responsável.';

/** Decide se a pergunta pode ser respondida por uma resposta pronta, sem IA. */
export function decidirPronta(p: PerguntaConsultor, prontas?: RespostaPronta[]): DecisaoPronta {
  if (pareceDivergencia(p.pergunta)) return { tipo: 'nenhuma', motivo: 'divergencia' };
  if (p.historico?.length && pareceSeguimento(p.pergunta)) return { tipo: 'nenhuma', motivo: 'seguimento' };
  if (pedeCalculo(p.pergunta)) return { tipo: 'nenhuma', motivo: 'calculo' };
  const achado = buscarPronta(p.pergunta, prontas);
  if (!achado) return { tipo: 'nenhuma', motivo: 'sem_pronta' };
  const pr = achado.pronta;
  const ctx = p.contextoEmpresa;
  // Empresa de outro regime: a regra pronta não se aplica a ela.
  if (ctx?.regime && pr.aplicaA && !pr.aplicaA.includes(ctx.regime)) return { tipo: 'nenhuma', motivo: 'regime_diferente' };
  if (pareceCasoConcreto(p.pergunta)) {
    if (temContexto(ctx) && (ctx.regime || !pr.aplicaA)) {
      const r = montar(pr, pr.resposta, p);
      return { tipo: 'pronta', resposta: { ...r, resposta: `${aberturaEmpresa(ctx)}\n\n${r.resposta}` }, pronta: pr, personalizada: true };
    }
    return { tipo: 'geral', resposta: montar(pr, `${pr.resposta}\n\n${AVISO_RESPOSTA_GERAL}`, p), pronta: pr };
  }
  return { tipo: 'pronta', resposta: montar(pr, pr.resposta, p), pronta: pr, personalizada: false };
}

// ── Cache das respostas da IA ────────────────────────────────────
export const VALIDADE_CACHE_DIAS = 30;

/** Versão da base: muda quando qualquer bloco ou resposta pronta muda → o cache antigo deixa de valer. */
export const VERSAO_BASE = crypto
  .createHash('sha256')
  .update(JSON.stringify(KNOWLEDGE_BASE_DOCS.map((d) => [d.id, d.lastUpdated, d.content])))
  .update(JSON.stringify(RESPOSTAS_PRONTAS))
  .digest('hex')
  .slice(0, 16);

const AREA_DO_SISTEMA: Record<string, Area> = { fiscal: 'fiscal', dp: 'dp', contabil: 'contabil', fiscoia: 'outro' };

export function chaveCache(p: Pick<PerguntaConsultor, 'pergunta' | 'sistema'>, versao = VERSAO_BASE): string {
  return crypto.createHash('sha256').update(`${versao}|${AREA_DO_SISTEMA[p.sistema] ?? 'outro'}|${perguntaNormalizada(p.pergunta)}`).digest('hex');
}

// Dados que identificam empresa ou pessoa: CNPJ/CPF, valores, e-mail, telefone (o mascaramento muda o texto).
const DADO_ESPECIFICO = /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{5,}|r\$\s*\d|@/i;

/** Pergunta genérica, sem dados de empresa/pessoa: pode usar o cache. */
export function perguntaGenerica(p: PerguntaConsultor): boolean {
  if (p.historico?.length) return false;
  // "Como faço…" com mapa de telas: a resposta depende das telas do sistema chamador.
  if (p.telasDoSistema?.length && termos(p.pergunta).includes('comofazer')) return false;
  const t = p.pergunta;
  if (t.length > 400 || mascararTexto(t) !== t || DADO_ESPECIFICO.test(t)) return false;
  if (pareceCasoConcreto(t) || pedeCalculo(t) || pareceDivergencia(t)) return false;
  return termos(t).length > 0;
}

/** Pode gravar no cache: pergunta genérica SEM contexto de empresa e resposta segura (confiança alta, com fonte oficial). */
export function podeGravarCache(p: PerguntaConsultor, r: RespostaConsultor): boolean {
  if (!perguntaGenerica(p) || temContexto(p.contextoEmpresa) || p.telasDoSistema?.length) return false;
  if (r.confianca !== 'alta' || r.encaminharContador || r.divergencia || r.recusado || !r.fontes.length) return false;
  if (mascararTexto(r.resposta) !== r.resposta || DADO_ESPECIFICO.test(r.resposta.replace(/\b(19|20)\d\d\b/g, ''))) return false;
  return true;
}

/** O que vai para o cache: sem ações (dependem das ferramentas do sistema chamador) e sem campos da consulta. */
export function respostaParaCache(r: RespostaConsultor): RespostaConsultor {
  const { origem: _o, custoIA: _c, liberado: _l, divergencia: _d, ondeFazer, ...resto } = r;
  return { ...resto, ...(ondeFazer && ondeFazer.tipo === 'externo' ? { ondeFazer } : {}), acoesSugeridas: [] };
}

// ── Conferência das respostas prontas (robô diário) ──────────────
export const DIAS_ALERTA_CONFERENCIA = 180;

export type ConferenciaProntas = {
  quando: string;
  situacao: 'ok' | 'com_avisos' | 'com_falhas';
  total: number;
  semFonteOficial: string[];
  semData: string[];
  maisDe180Dias: { id: string; conferidoEm: string; dias: number }[];
  idsRepetidos: string[];
};

export function conferirRespostasProntas(prontas: RespostaPronta[] = RESPOSTAS_PRONTAS, hoje = new Date()): ConferenciaProntas {
  const semFonteOficial: string[] = [];
  const semData: string[] = [];
  const maisDe180Dias: ConferenciaProntas['maisDe180Dias'] = [];
  const vistos = new Set<string>();
  const idsRepetidos: string[] = [];
  for (const pr of prontas) {
    if (vistos.has(pr.id)) idsRepetidos.push(pr.id);
    vistos.add(pr.id);
    if (!pr.fontes.length || pr.fontes.some((f) => !urlOficial(f.url)) || (pr.ondeFazer && !urlOficial(pr.ondeFazer.url))) semFonteOficial.push(pr.id);
    const t = Date.parse(`${pr.conferidoEm}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pr.conferidoEm ?? '') || Number.isNaN(t) || t > hoje.getTime()) {
      semData.push(pr.id);
      continue;
    }
    const dias = Math.floor((hoje.getTime() - t) / 86_400_000);
    if (dias > DIAS_ALERTA_CONFERENCIA) maisDe180Dias.push({ id: pr.id, conferidoEm: pr.conferidoEm, dias });
  }
  return {
    quando: hoje.toISOString(),
    situacao: semFonteOficial.length || semData.length || idsRepetidos.length ? 'com_falhas' : maisDe180Dias.length ? 'com_avisos' : 'ok',
    total: prontas.length,
    semFonteOficial,
    semData,
    maisDe180Dias,
    idsRepetidos,
  };
}
