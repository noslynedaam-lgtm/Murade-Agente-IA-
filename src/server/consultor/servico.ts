// Fluxo de uma consulta (economia de crédito do Gemini):
// 1) resposta pronta conferida (sem custo) → 2) cache de resposta da IA (sem custo) →
// 3) escritório sem o adicional "consultor" liberado: para aqui (liberado:false) →
// 4) IA: escolher blocos da base → perguntar ao modelo → validar → guardar no cache (se genérica) → registrar e contar consumo.
import { escolherBlocos, type Gerador } from './cerebro';
import { chaveCache, decidirPronta, perguntaGenerica, podeGravarCache, respostaParaCache, VALIDADE_CACHE_DIAS, VERSAO_BASE } from './economia';
import { cnpjValido, criarLiberacoes, MENSAGEM_NAO_LIBERADO, normalizarCnpj, type Liberacoes } from './liberacao';
import type { Armazem, IncrementoConsumo } from './registro';
import type { RespostaPronta } from './respostasProntas';
import { lerJsonModelo, montarResposta } from './validar';
import { AVISO_RESPONSABILIDADE, GeminiIndisponivel, type PerguntaConsultor, type RespostaConsultor, type UsoTokens } from './tipos';

export type ResultadoConsulta = { resposta: RespostaConsultor; indisponivel: boolean; precisaIA?: boolean; uso?: UsoTokens };

/** Mês de referência do consumo (AAAA-MM) no horário de Brasília. */
export function mesAtual(agora = new Date()): string {
  return agora.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).slice(0, 7);
}

export function respostaNaoLiberada(p: PerguntaConsultor): RespostaConsultor {
  return {
    resposta: MENSAGEM_NAO_LIBERADO,
    area: p.sistema === 'dp' ? 'dp' : p.sistema === 'contabil' ? 'contabil' : p.sistema === 'fiscal' ? 'fiscal' : 'outro',
    fontes: [],
    confianca: 'baixa',
    encaminharContador: true,
    motivoEncaminhamento: 'O Consultor Murade completo não está liberado para este escritório.',
    acoesSugeridas: [],
    avisoResponsabilidade: AVISO_RESPONSABILIDADE,
    origem: 'bloqueado',
    custoIA: false,
    liberado: false,
  };
}

export function respostaIndisponivel(p: PerguntaConsultor): RespostaConsultor {
  return {
    resposta: 'O Consultor Murade está temporariamente indisponível (serviço de IA fora do ar). Tente de novo em alguns minutos ou fale com o contador responsável.',
    area: p.sistema === 'dp' ? 'dp' : p.sistema === 'contabil' ? 'contabil' : p.sistema === 'fiscal' ? 'fiscal' : 'outro',
    fontes: [],
    confianca: 'baixa',
    encaminharContador: true,
    motivoEncaminhamento: 'Serviço de IA indisponível no momento.',
    acoesSugeridas: [],
    avisoResponsabilidade: AVISO_RESPONSABILIDADE,
    origem: 'ia',
    custoIA: false,
  };
}

export type OpcoesPergunta = {
  /** false: não grava no registro nem conta consumo (robô conferidor). */
  registrar?: boolean;
  /** true: uso interno (robô do dono) — não depende de liberação. */
  interno?: boolean;
  /** false: nunca chama a IA (devolve precisaIA:true). */
  permitirIA?: boolean;
};

export function criarConsultor(deps: { gerar: Gerador; armazem: Armazem; liberacoes?: Liberacoes; prontas?: RespostaPronta[] }) {
  const liberacoes = deps.liberacoes ?? criarLiberacoes(deps.armazem);

  async function contar(p: PerguntaConsultor, inc: Omit<IncrementoConsumo, 'escritorio' | 'produto' | 'mes'>) {
    const cnpj = normalizarCnpj(p.escritorio);
    await deps.armazem
      .somarConsumo({ escritorio: cnpjValido(cnpj) ? cnpj : 'sem-escritorio', produto: 'consultor', mes: mesAtual(), perguntas: 1, ...inc })
      .catch((e) => console.error('[consultor] não contou o consumo:', (e as Error)?.message));
  }

  async function registrarSemIA(p: PerguntaConsultor, r: RespostaConsultor, modelo: string, situacao: 'respondida' | 'nao_liberado') {
    await deps.armazem
      .salvar({
        sistema: p.sistema,
        pergunta: p.pergunta,
        resposta: r.resposta,
        area: r.area,
        confianca: r.confianca,
        encaminharContador: r.encaminharContador,
        motivoEncaminhamento: r.motivoEncaminhamento,
        fontes: r.fontes,
        regime: p.contextoEmpresa?.regime,
        modelo,
        situacao,
      })
      .catch((e) => console.error('[consultor] não registrou a consulta:', (e as Error)?.message));
  }

  async function perguntar(p: PerguntaConsultor, opcoes: OpcoesPergunta = {}): Promise<ResultadoConsulta> {
    const registrar = opcoes.registrar !== false;
    const contabilizar = registrar && !opcoes.interno;
    const liberado = opcoes.interno ? true : (await liberacoes.situacao(p.escritorio, 'consultor')).liberado;

    // 1) Resposta pronta (conferida, sem custo).
    const pronta = decidirPronta(p, deps.prontas);
    if (pronta.tipo === 'pronta') {
      const resposta = { ...pronta.resposta, liberado };
      if (contabilizar) await contar(p, { prontas: 1 });
      if (registrar) await registrarSemIA(p, resposta, `pronta:${pronta.pronta.id}`, 'respondida');
      return { resposta, indisponivel: false };
    }

    // 2) Cache de resposta da IA (sem custo).
    if (perguntaGenerica(p)) {
      const e = await deps.armazem.lerCache(chaveCache(p)).catch(() => null);
      if (e && e.versaoBase === VERSAO_BASE) {
        const resposta: RespostaConsultor = { ...e.resposta, acoesSugeridas: [], origem: 'cache', custoIA: false, liberado };
        if (contabilizar) await contar(p, { cache: 1 });
        if (registrar) await registrarSemIA(p, resposta, 'cache', 'respondida');
        return { resposta, indisponivel: false };
      }
    }

    // 3) Sem o adicional: regra geral pronta (quando houver) ou aviso de não liberado — nunca chama a IA.
    if (!liberado || opcoes.permitirIA === false) {
      const resposta = pronta.tipo === 'geral' ? { ...pronta.resposta, liberado } : { ...respostaNaoLiberada(p), liberado };
      if (pronta.tipo === 'geral') {
        if (contabilizar) await contar(p, { prontas: 1 });
        if (registrar) await registrarSemIA(p, resposta, `pronta:${pronta.pronta.id}`, 'respondida');
      } else if (!liberado) {
        if (contabilizar) await contar(p, { bloqueadas: 1 });
        if (registrar) await registrarSemIA(p, resposta, 'nao-liberado', 'nao_liberado');
      }
      return { resposta, indisponivel: false, precisaIA: pronta.tipo !== 'geral' };
    }

    // 4) IA.
    const blocos = escolherBlocos(p.pergunta, p.sistema, p.contextoEmpresa);
    let resultado: ResultadoConsulta;
    let modelo: string | undefined;
    let situacao: 'respondida' | 'gemini_indisponivel' | 'erro' = 'respondida';
    let uso: UsoTokens | undefined;
    let custoIA = false;
    try {
      const bruta = await deps.gerar(p, blocos);
      custoIA = true;
      modelo = bruta.modelo;
      uso = bruta.uso;
      const resposta = montarResposta(lerJsonModelo(bruta.texto), {
        ferramentas: p.ferramentasDisponiveis,
        fontesExtras: bruta.fontesPesquisa,
        sistema: p.sistema,
        telas: p.telasDoSistema,
      });
      resultado = { resposta, indisponivel: false };
    } catch (e) {
      if (e instanceof GeminiIndisponivel) {
        situacao = 'gemini_indisponivel';
        resultado = { resposta: respostaIndisponivel(p), indisponivel: true };
      } else {
        console.error('[consultor] falha ao gerar resposta:', (e as Error)?.message);
        custoIA = true; // pode ter gastado antes de falhar
        situacao = 'erro';
        resultado = { resposta: montarResposta(null, { sistema: p.sistema }), indisponivel: false };
      }
    }
    resultado.resposta = { ...resultado.resposta, origem: 'ia', custoIA, liberado: true };
    if (!resultado.indisponivel && podeGravarCache(p, resultado.resposta)) {
      const agora = Date.now();
      await deps.armazem
        .salvarCache({
          chave: chaveCache(p),
          area: resultado.resposta.area,
          pergunta: p.pergunta.slice(0, 400),
          resposta: respostaParaCache(resultado.resposta),
          versaoBase: VERSAO_BASE,
          criadoEm: new Date(agora).toISOString(),
          expiraEm: new Date(agora + VALIDADE_CACHE_DIAS * 86_400_000).toISOString(),
        })
        .catch((e) => console.error('[consultor] não guardou no cache:', (e as Error)?.message));
    }
    if (contabilizar) await contar(p, { ia: custoIA ? 1 : 0, tokensEntrada: uso?.entrada, tokensSaida: uso?.saida, tokensTotal: uso?.total });
    if (registrar && resultado.resposta.divergencia) {
      // Regra do dono: registra a decisão do contador (sem dados pessoais) quando ele escolhe fazer diferente.
      const d = resultado.resposta.divergencia;
      await deps.armazem
        .salvarDecisao({
          data: new Date().toISOString(),
          escritorio: p.escritorio ?? 'nao-informado',
          usuario: p.usuario ?? 'nao-informado',
          sistema: p.sistema,
          pergunta: p.pergunta,
          orientacao: d.orientacao,
          fonte: d.fonte.url ? d.fonte : null,
          escolhaDoContador: d.escolhaDoContador,
          origem: 'consultor',
        })
        .catch((e) => console.error('[consultor] não registrou a decisão:', (e as Error)?.message));
    }
    if (registrar) {
      const r = resultado.resposta;
      await deps.armazem
        .salvar({
          sistema: p.sistema,
          pergunta: p.pergunta,
          resposta: r.resposta,
          area: r.area,
          confianca: r.confianca,
          encaminharContador: r.encaminharContador,
          motivoEncaminhamento: r.motivoEncaminhamento,
          fontes: r.fontes,
          regime: p.contextoEmpresa?.regime,
          modelo,
          situacao,
        })
        .catch((e) => console.error('[consultor] não registrou a consulta:', (e as Error)?.message));
    }
    return { ...resultado, uso };
  }
  return { perguntar, liberacoes };
}

export type Consultor = ReturnType<typeof criarConsultor>;
