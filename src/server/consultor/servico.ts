// Fluxo de uma consulta: escolher blocos da base → perguntar ao modelo → validar → registrar.
import { escolherBlocos, type Gerador } from './cerebro';
import type { Armazem } from './registro';
import { lerJsonModelo, montarResposta } from './validar';
import { AVISO_RESPONSABILIDADE, GeminiIndisponivel, type PerguntaConsultor, type RespostaConsultor } from './tipos';

export type ResultadoConsulta = { resposta: RespostaConsultor; indisponivel: boolean };

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
  };
}

export function criarConsultor(deps: { gerar: Gerador; armazem: Armazem }) {
  async function perguntar(p: PerguntaConsultor, opcoes: { registrar?: boolean } = {}): Promise<ResultadoConsulta> {
    const registrar = opcoes.registrar !== false;
    const blocos = escolherBlocos(p.pergunta, p.sistema, p.contextoEmpresa);
    let resultado: ResultadoConsulta;
    let modelo: string | undefined;
    let situacao: 'respondida' | 'gemini_indisponivel' | 'erro' = 'respondida';
    try {
      const bruta = await deps.gerar(p, blocos);
      modelo = bruta.modelo;
      const resposta = montarResposta(lerJsonModelo(bruta.texto), {
        ferramentas: p.ferramentasDisponiveis,
        fontesExtras: bruta.fontesPesquisa,
        sistema: p.sistema,
      });
      resultado = { resposta, indisponivel: false };
    } catch (e) {
      if (e instanceof GeminiIndisponivel) {
        situacao = 'gemini_indisponivel';
        resultado = { resposta: respostaIndisponivel(p), indisponivel: true };
      } else {
        console.error('[consultor] falha ao gerar resposta:', (e as Error)?.message);
        situacao = 'erro';
        resultado = { resposta: montarResposta(null, { sistema: p.sistema }), indisponivel: false };
      }
    }
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
    return resultado;
  }
  return { perguntar };
}

export type Consultor = ReturnType<typeof criarConsultor>;
