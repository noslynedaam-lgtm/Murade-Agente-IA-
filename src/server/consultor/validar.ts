// Validação do corpo da pergunta e da resposta do modelo.
import { filtrarFontesOficiais, urlOficial } from './fontes';
import { cnpjValido, normalizarCnpj } from './liberacao';
import { mascararTexto } from './mascarar';
import {
  AREAS,
  AVISO_RESPONSABILIDADE,
  CONFIANCAS,
  REGIMES,
  SISTEMAS,
  FRASE_ACEITE,
  type AcaoSugerida,
  type Area,
  type Decisao,
  type Divergencia,
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

  const usuario = texto(c.usuario, 80);
  // escritorio = CNPJ do escritório (14 caracteres; aceita pontuação e o CNPJ alfanumérico). Sem ele, o escritório não tem o Consultor completo.
  let escritorio: string | undefined;
  if (c.escritorio !== undefined && c.escritorio !== null && String(c.escritorio).trim() !== '') {
    escritorio = normalizarCnpj(c.escritorio);
    if (!cnpjValido(escritorio)) return { ok: false, erro: 'Campo "escritorio" deve ser o CNPJ do escritório (14 caracteres, com dígitos verificadores válidos).' };
  }

  return {
    ok: true,
    valor: { pergunta: c.pergunta.trim(), sistema: c.sistema as PerguntaConsultor['sistema'], contextoEmpresa, historico, ferramentasDisponiveis, usuario, escritorio },
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

  const recusado = modelo.recusado === true;
  let textoResposta = modelo.resposta.trim().slice(0, 12000);
  let divergencia: Divergencia | undefined;
  const d = modelo.divergencia as Record<string, unknown> | undefined;
  if (!recusado && d && typeof d === 'object' && typeof d.orientacao === 'string' && d.orientacao.trim() && typeof d.escolhaDoContador === 'string' && d.escolhaDoContador.trim()) {
    // A fonte da divergência também precisa ser oficial; senão usa a primeira fonte oficial da resposta.
    const fd = (d.fonte ?? { titulo: d.fonteTitulo, url: d.fonteUrl }) as Record<string, unknown>;
    const fonteDiv = filtrarFontesOficiais([fd])[0] ?? fontes[0];
    divergencia = {
      orientacao: d.orientacao.trim().slice(0, 2000),
      fonte: fonteDiv ?? { titulo: 'Fonte oficial não confirmada: conferir com o contador responsável', url: '' },
      escolhaDoContador: d.escolhaDoContador.trim().slice(0, 2000),
    };
    // Regra do dono: aceita do jeito do contador, deixando claro que a decisão é dele.
    if (!textoResposta.includes(FRASE_ACEITE)) textoResposta = `${textoResposta}\n\n${FRASE_ACEITE}`;
  }
  if (recusado) {
    encaminharContador = true;
    motivo = motivo ?? 'Pedido recusado: contraria a lei (ilegal ou fraude).';
  }

  const resposta: RespostaConsultor = {
    resposta: textoResposta,
    area,
    fontes,
    confianca,
    encaminharContador,
    acoesSugeridas,
    avisoResponsabilidade: aviso,
  };
  if (encaminharContador) resposta.motivoEncaminhamento = motivo ?? 'Recomendo a conferência do contador responsável.';
  if (divergencia) resposta.divergencia = divergencia;
  if (recusado) {
    resposta.recusado = true;
    resposta.acoesSugeridas = []; // nada a executar num pedido recusado
  }
  return resposta;
}

/** Corpo de POST /api/consultor/registrar-decisao. Dados pessoais são mascarados. */
export function validarDecisao(corpo: unknown): Ok<Decisao> | Erro {
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return { ok: false, erro: 'Corpo da requisição deve ser um objeto JSON.' };
  const c = corpo as Record<string, unknown>;
  const escritorio = texto(c.escritorio, 80);
  const usuario = texto(c.usuario, 80);
  const orientacao = texto(c.orientacao, 4000);
  const escolhaDoContador = texto(c.escolhaDoContador, 4000);
  const pergunta = texto(c.pergunta, 30000);
  if (!escritorio) return { ok: false, erro: 'Campo "escritorio" é obrigatório.' };
  if (!usuario) return { ok: false, erro: 'Campo "usuario" é obrigatório (login ou ID, não nome nem CPF).' };
  if (!pergunta) return { ok: false, erro: 'Campo "pergunta" é obrigatório.' };
  if (!orientacao) return { ok: false, erro: 'Campo "orientacao" é obrigatório.' };
  if (!escolhaDoContador) return { ok: false, erro: 'Campo "escolhaDoContador" é obrigatório.' };
  if (typeof c.sistema !== 'string' || !(SISTEMAS as readonly string[]).includes(c.sistema)) return { ok: false, erro: `Campo "sistema" deve ser um destes: ${SISTEMAS.join(', ')}.` };
  let fonte: Fonte | null = null;
  if (c.fonte !== undefined && c.fonte !== null) {
    const f = c.fonte as Record<string, unknown>;
    if (typeof f !== 'object' || typeof f.url !== 'string') return { ok: false, erro: 'Campo "fonte" deve ser { titulo, url }.' };
    if (f.url && !urlOficial(f.url)) return { ok: false, erro: 'A fonte da orientação deve ser de site oficial.' };
    fonte = f.url ? { titulo: String(f.titulo ?? '').slice(0, 200), url: f.url.slice(0, 600) } : null;
  }
  let data = new Date().toISOString();
  if (typeof c.data === 'string' && c.data.trim()) {
    const t = Date.parse(c.data);
    if (Number.isNaN(t)) return { ok: false, erro: 'Campo "data" inválido (use ISO 8601).' };
    data = new Date(t).toISOString();
  }
  return {
    ok: true,
    valor: {
      data,
      escritorio: mascararTexto(escritorio),
      usuario: mascararTexto(usuario),
      sistema: c.sistema as Decisao['sistema'],
      pergunta: mascararTexto(pergunta),
      orientacao: mascararTexto(orientacao),
      fonte,
      escolhaDoContador: mascararTexto(escolhaDoContador),
      origem: 'sistema',
    },
  };
}

function areaPadrao(sistema: PerguntaConsultor['sistema']): Area {
  return sistema === 'dp' ? 'dp' : sistema === 'contabil' ? 'contabil' : sistema === 'fiscal' ? 'fiscal' : 'outro';
}
