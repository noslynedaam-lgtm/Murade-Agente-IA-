// Validação do corpo da pergunta e da resposta do modelo.
import { filtrarFontesOficiais } from './fontes';
import {
  AREAS,
  AVISO_RESPONSABILIDADE,
  CONFIANCAS,
  REGIMES,
  SISTEMAS,
  type AcaoSugerida,
  type Area,
  type Confianca,
  type ContextoEmpresa,
  type Ferramenta,
  type Fonte,
  type MensagemHistorico,
  type PerguntaConsultor,
  type RespostaConsultor,
} from './tipos';

export const LIMITE_PERGUNTA = 30000;
const LIMITE_HISTORICO = 8;
const LIMITE_TEXTO_HISTORICO = 4000;
const LIMITE_FERRAMENTAS = 40;

type Ok<T> = { ok: true; valor: T };
type Erro = { ok: false; erro: string };

const texto = (v: unknown, max: number): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;

export function validarPergunta(corpo: unknown): Ok<PerguntaConsultor> | Erro {
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return { ok: false, erro: 'Corpo da requisição deve ser um objeto JSON.' };
  const c = corpo as Record<string, unknown>;

  if (typeof c.pergunta !== 'string' || !c.pergunta.trim()) return { ok: false, erro: 'Campo "pergunta" é obrigatório (texto).' };
  if (c.pergunta.length > LIMITE_PERGUNTA) return { ok: false, erro: `Campo "pergunta" passa de ${LIMITE_PERGUNTA} caracteres.` };
  if (typeof c.sistema !== 'string' || !(SISTEMAS as readonly string[]).includes(c.sistema))
    return { ok: false, erro: `Campo "sistema" deve ser um destes: ${SISTEMAS.join(', ')}.` };

  // contextoEmpresa (opcional)
  let contextoEmpresa: ContextoEmpresa | undefined;
  if (c.contextoEmpresa !== undefined && c.contextoEmpresa !== null) {
    if (typeof c.contextoEmpresa !== 'object' || Array.isArray(c.contextoEmpresa)) return { ok: false, erro: 'Campo "contextoEmpresa" deve ser um objeto.' };
    const e = c.contextoEmpresa as Record<string, unknown>;
    if (e.regime !== undefined && e.regime !== null && !(REGIMES as readonly string[]).includes(String(e.regime)))
      return { ok: false, erro: `contextoEmpresa.regime deve ser um destes: ${REGIMES.join(', ')}.` };
    const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
    contextoEmpresa = {
      cnpj: texto(e.cnpj, 20),
      razaoSocial: texto(e.razaoSocial, 200),
      regime: (e.regime as ContextoEmpresa['regime']) ?? undefined,
      anexoSimples: texto(e.anexoSimples, 20),
      cnaePrincipal: texto(e.cnaePrincipal, 20),
      uf: texto(e.uf, 2)?.toUpperCase(),
      municipio: texto(e.municipio, 80),
      temFuncionarios: typeof e.temFuncionarios === 'boolean' ? e.temFuncionarios : undefined,
      qtdFuncionarios: num(e.qtdFuncionarios),
      faturamento12m: num(e.faturamento12m),
      pendencias: Array.isArray(e.pendencias) ? e.pendencias.filter((p) => typeof p === 'string').slice(0, 30).map((p) => (p as string).slice(0, 300)) : undefined,
    };
    if (e.outros && typeof e.outros === 'object' && !Array.isArray(e.outros)) {
      const outros: Record<string, string | number | boolean> = {};
      for (const [k, v] of Object.entries(e.outros as Record<string, unknown>).slice(0, 30)) {
        if (typeof v === 'string') outros[k.slice(0, 60)] = v.slice(0, 300);
        else if (typeof v === 'number' && Number.isFinite(v)) outros[k.slice(0, 60)] = v;
        else if (typeof v === 'boolean') outros[k.slice(0, 60)] = v;
      }
      contextoEmpresa.outros = outros;
    }
  }

  // historico (opcional): só os últimos 8
  let historico: MensagemHistorico[] | undefined;
  if (c.historico !== undefined && c.historico !== null) {
    if (!Array.isArray(c.historico)) return { ok: false, erro: 'Campo "historico" deve ser uma lista.' };
    historico = c.historico
      .filter((h) => h && typeof h === 'object' && (h.papel === 'usuario' || h.papel === 'consultor') && typeof h.texto === 'string')
      .slice(-LIMITE_HISTORICO)
      .map((h) => ({ papel: h.papel, texto: String(h.texto).slice(0, LIMITE_TEXTO_HISTORICO) }));
  }

  // ferramentasDisponiveis (opcional)
  let ferramentasDisponiveis: Ferramenta[] | undefined;
  if (c.ferramentasDisponiveis !== undefined && c.ferramentasDisponiveis !== null) {
    if (!Array.isArray(c.ferramentasDisponiveis)) return { ok: false, erro: 'Campo "ferramentasDisponiveis" deve ser uma lista.' };
    ferramentasDisponiveis = c.ferramentasDisponiveis
      .filter((f) => f && typeof f === 'object' && typeof f.nome === 'string' && f.nome.trim())
      .slice(0, LIMITE_FERRAMENTAS)
      .map((f) => ({ nome: String(f.nome).trim().slice(0, 80), descricao: String(f.descricao ?? '').slice(0, 400) }));
  }

  return {
    ok: true,
    valor: { pergunta: c.pergunta.trim(), sistema: c.sistema as PerguntaConsultor['sistema'], contextoEmpresa, historico, ferramentasDisponiveis },
  };
}

/** Lê o JSON do modelo mesmo se vier dentro de bloco de código ou com texto em volta. */
export function lerJsonModelo(textoModelo: string): Record<string, unknown> | null {
  const t = String(textoModelo ?? '').trim();
  const tentativas = [t, t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')];
  const ini = t.indexOf('{');
  const fim = t.lastIndexOf('}');
  if (ini >= 0 && fim > ini) tentativas.push(t.slice(ini, fim + 1));
  for (const x of tentativas) {
    try {
      const v = JSON.parse(x);
      if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
    } catch {
      /* tenta a próxima */
    }
  }
  return null;
}

/**
 * Monta a resposta final a partir do que o modelo devolveu, aplicando as regras do servidor:
 * - só fontes oficiais (as do modelo, as da base usada e as da pesquisa);
 * - sem fonte oficial → confiança baixa e encaminhar ao contador;
 * - ações só com ferramentas recebidas em ferramentasDisponiveis;
 * - aviso de responsabilidade fixo.
 */
export function montarResposta(
  modelo: Record<string, unknown> | null,
  opcoes: { ferramentas?: Ferramenta[]; fontesExtras?: Fonte[]; sistema: PerguntaConsultor['sistema'] },
): RespostaConsultor {
  const aviso = AVISO_RESPONSABILIDADE;
  if (!modelo || typeof modelo.resposta !== 'string' || !modelo.resposta.trim()) {
    return {
      resposta: 'Não consegui montar uma resposta segura para essa pergunta agora. Encaminhe ao contador responsável.',
      area: areaPadrao(opcoes.sistema),
      fontes: [],
      confianca: 'baixa',
      encaminharContador: true,
      motivoEncaminhamento: 'O consultor não gerou uma resposta válida.',
      acoesSugeridas: [],
      avisoResponsabilidade: aviso,
    };
  }

  const area: Area = (AREAS as readonly string[]).includes(String(modelo.area)) ? (modelo.area as Area) : areaPadrao(opcoes.sistema);
  let confianca: Confianca = (CONFIANCAS as readonly string[]).includes(String(modelo.confianca)) ? (modelo.confianca as Confianca) : 'baixa';
  let encaminharContador = modelo.encaminharContador === true;
  let motivo = typeof modelo.motivoEncaminhamento === 'string' && modelo.motivoEncaminhamento.trim() ? modelo.motivoEncaminhamento.trim().slice(0, 500) : undefined;

  const fontesModelo = Array.isArray(modelo.fontes) ? modelo.fontes : [];
  const fontes = filtrarFontesOficiais([...fontesModelo, ...(opcoes.fontesExtras ?? [])]);
  if (fontes.length === 0) {
    confianca = 'baixa';
    encaminharContador = true;
    motivo = motivo ?? 'Não sobrou nenhuma fonte oficial que confirme a resposta.';
  }
  if (confianca === 'baixa' && !encaminharContador) {
    encaminharContador = true;
    motivo = motivo ?? 'Confiança baixa: o contador responsável deve conferir.';
  }

  const permitidas = new Map((opcoes.ferramentas ?? []).map((f) => [f.nome, f]));
  const acoesSugeridas: AcaoSugerida[] = [];
  if (Array.isArray(modelo.acoesSugeridas)) {
    for (const a of modelo.acoesSugeridas) {
      if (!a || typeof a !== 'object') continue;
      const nome = String((a as any).ferramenta ?? '').trim();
      if (!permitidas.has(nome)) continue; // nunca inventar ferramenta
      const acao: AcaoSugerida = { ferramenta: nome, descricao: String((a as any).descricao ?? permitidas.get(nome)!.descricao).slice(0, 400) };
      const args = (a as any).argumentos;
      if (args && typeof args === 'object' && !Array.isArray(args)) acao.argumentos = args as Record<string, unknown>;
      else if (typeof args === 'string' && args.trim()) {
        try {
          const p = JSON.parse(args);
          if (p && typeof p === 'object' && !Array.isArray(p)) acao.argumentos = p;
        } catch {
          /* argumentos inválidos são descartados */
        }
      }
      acoesSugeridas.push(acao);
      if (acoesSugeridas.length >= 5) break;
    }
  }

  const resposta: RespostaConsultor = {
    resposta: modelo.resposta.trim().slice(0, 12000),
    area,
    fontes,
    confianca,
    encaminharContador,
    acoesSugeridas,
    avisoResponsabilidade: aviso,
  };
  if (encaminharContador) resposta.motivoEncaminhamento = motivo ?? 'Recomendo a conferência do contador responsável.';
  return resposta;
}

function areaPadrao(sistema: PerguntaConsultor['sistema']): Area {
  return sistema === 'dp' ? 'dp' : sistema === 'contabil' ? 'contabil' : sistema === 'fiscal' ? 'fiscal' : 'outro';
}
