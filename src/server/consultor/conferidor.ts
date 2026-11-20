// Robô conferidor do Consultor: 1x por dia faz perguntas-teste com resposta-chave conferida em fonte oficial
// e registra se o consultor ainda acerta (palavras-chave). Com o Gemini fora, registra "não testado".
import type { Armazem, ResultadoTeste, SaudeConsultor } from './registro';
import type { Consultor } from './servico';
import type { PerguntaConsultor } from './tipos';

export type PerguntaTeste = {
  id: string;
  pergunta: string;
  sistema: PerguntaConsultor['sistema'];
  contextoEmpresa?: PerguntaConsultor['contextoEmpresa'];
  /** Cada grupo precisa aparecer na resposta (basta uma das alternativas do grupo). */
  chaves: string[][];
  fonte: string; // onde a resposta-chave foi conferida
};

// Respostas-chave conferidas em 20/11/2026 nas fontes citadas (as mesmas dos blocos da base).
export const PERGUNTAS_TESTE: PerguntaTeste[] = [
  { id: 'pgdas-prazo', sistema: 'fiscal', pergunta: 'Até que dia do mês tenho que transmitir o PGDAS-D e pagar o DAS do Simples Nacional?', chaves: [['20', 'vinte']], fonte: 'gov.br Declarar apurações mensais do Simples; Perguntão SN 6.4/6.8' },
  { id: 'pgdas-maed', sistema: 'fiscal', pergunta: 'Qual a multa por entregar o PGDAS-D em atraso? Tem valor mínimo?', chaves: [['2%', '2 %', 'dois por cento'], ['50', 'cinquenta']], fonte: 'Perguntão SN 6.5; LC 123 art. 38-A' },
  { id: 'defis-prazo', sistema: 'fiscal', pergunta: 'Qual o prazo de entrega da DEFIS?', chaves: [['31 de marco', '31/03', 'marco']], fonte: 'Perguntão SN 6.10; gov.br DEFIS' },
  { id: 'fator-r', sistema: 'fiscal', pergunta: 'No Simples Nacional, qual percentual do Fator R faz a atividade sair do Anexo V e ir para o Anexo III?', chaves: [['28%', '28 %', '0,28', 'vinte e oito']], fonte: 'LC 123 art. 18 §5º-J/5º-M; Perguntão SN 5.11' },
  { id: 'limite-epp', sistema: 'fiscal', pergunta: 'Qual o limite de faturamento anual de uma empresa de pequeno porte (EPP) no Simples?', chaves: [['4,8 milh', '4.800.000', '4,8 mi']], fonte: 'LC 123 art. 3º, II' },
  { id: 'dasn-simei', sistema: 'fiscal', pergunta: 'Até quando o MEI tem que entregar a DASN-SIMEI?', chaves: [['maio']], fonte: 'Perguntão MEI 3.9; CGSN 140 art. 109' },
  { id: 'presuncao-servicos', sistema: 'fiscal', pergunta: 'No Lucro Presumido, qual o percentual de presunção do IRPJ para prestação de serviços em geral?', chaves: [['32%', '32 %', 'trinta e dois']], fonte: 'Lei 9.249 art. 15 §1º III' },
  { id: 'presuncao-comercio', sistema: 'fiscal', pergunta: 'No Lucro Presumido, qual o percentual de presunção do IRPJ para comércio?', chaves: [['8%', '8 %', 'oito por cento']], fonte: 'Lei 9.249 art. 15 caput' },
  { id: 'csrf', sistema: 'fiscal', pergunta: 'Qual o percentual total de retenção de PIS, Cofins e CSLL (CSRF) na nota de serviço de limpeza entre duas empresas do Lucro Presumido?', chaves: [['4,65']], fonte: 'Lei 10.833 art. 31' },
  { id: 'inss-cessao', sistema: 'fiscal', pergunta: 'Qual a retenção de INSS na nota fiscal de cessão de mão de obra?', chaves: [['11%', '11 %', 'onze por cento']], fonte: 'Lei 8.212 art. 31' },
  { id: 'fgts-aliquota', sistema: 'dp', pergunta: 'Qual a alíquota do FGTS mensal de um empregado comum (não aprendiz)?', chaves: [['8%', '8 %', 'oito por cento']], fonte: 'Lei 8.036 art. 15; Manual FGTS Digital 5.1.4' },
  { id: 'fgts-multa', sistema: 'dp', pergunta: 'Qual a multa do FGTS na demissão sem justa causa?', chaves: [['40%', '40 %', 'quarenta por cento']], fonte: 'Lei 8.036 art. 18 §1º' },
  { id: 'rescisao-prazo', sistema: 'dp', pergunta: 'Qual o prazo para pagar as verbas rescisórias depois do fim do contrato?', chaves: [['10 dias', 'dez dias', '10 (dez) dias'], ['477']], fonte: 'CLT art. 477 §6º' },
  { id: 'acordo-484a', sistema: 'dp', pergunta: 'Na demissão por acordo (art. 484-A da CLT), quanto o empregado pode sacar do FGTS?', chaves: [['80%', '80 %', 'oitenta por cento']], fonte: 'CLT art. 484-A §1º' },
  { id: 'aviso-maximo', sistema: 'dp', pergunta: 'Qual o máximo de dias de aviso prévio proporcional?', chaves: [['90', 'noventa']], fonte: 'Lei 12.506/2011 art. 1º parágrafo único' },
  { id: 'ferias-pagamento', sistema: 'dp', pergunta: 'Com quantos dias de antecedência tenho que pagar as férias do empregado?', chaves: [['2 dias', 'dois dias', '2 (dois) dias']], fonte: 'CLT art. 145' },
  { id: 'ferias-fracionamento', sistema: 'dp', pergunta: 'Posso dividir as férias em quantos períodos e qual o mínimo de dias do maior período?', chaves: [['3 periodos', 'tres periodos', 'ate 3', 'ate tres'], ['14', 'quatorze', 'catorze']], fonte: 'CLT art. 134 §1º' },
  { id: '13-segunda', sistema: 'dp', pergunta: 'Até quando tenho que pagar a segunda parcela do 13º salário?', chaves: [['20 de dezembro', '20/12']], fonte: 'Lei 4.749/1965 art. 1º' },
  { id: '13-primeira', sistema: 'dp', pergunta: 'Qual o prazo final para pagar a primeira parcela do 13º salário?', chaves: [['30 de novembro', '30/11']], fonte: 'Lei 4.749/1965 art. 2º; eSocial' },
  { id: 'hora-extra', sistema: 'dp', pergunta: 'Qual o adicional mínimo da hora extra pela CLT?', chaves: [['50%', '50 %', 'cinquenta por cento']], fonte: 'CLT art. 59 §1º' },
  { id: 'noturno', sistema: 'dp', pergunta: 'Qual o adicional noturno do trabalhador urbano e qual o horário noturno?', chaves: [['20%', '20 %', 'vinte por cento'], ['22']], fonte: 'CLT art. 73' },
  { id: 'periculosidade', sistema: 'dp', pergunta: 'Qual o percentual do adicional de periculosidade?', chaves: [['30%', '30 %', 'trinta por cento']], fonte: 'CLT art. 193 §1º' },
  { id: 'experiencia', sistema: 'dp', pergunta: 'Qual o prazo máximo do contrato de experiência?', chaves: [['90 dias', 'noventa dias']], fonte: 'CLT art. 445 parágrafo único' },
  { id: 'interjornada', sistema: 'dp', pergunta: 'Qual o intervalo mínimo de descanso entre duas jornadas de trabalho?', chaves: [['11 horas', 'onze horas']], fonte: 'CLT art. 66' },
  { id: 'esocial-folha', sistema: 'dp', pergunta: 'Até que dia tenho que enviar a folha (S-1200) e o fechamento (S-1299) no eSocial?', chaves: [['15', 'quinze']], fonte: 'MOS S-1.3' },
  { id: 'dctfweb-prazo', sistema: 'dp', pergunta: 'Qual o prazo de entrega da DCTFWeb mensal hoje?', chaves: [['ultimo dia util']], fonte: 'gov.br DCTFWeb; IN RFB 2.237/2024' },
  { id: 'icms-go', sistema: 'fiscal', pergunta: 'Qual a alíquota interna geral do ICMS em Goiás?', chaves: [['19%', '19 %', 'dezenove por cento']], fonte: 'Lei GO 22.460/2023; CTE-GO art. 27, I' },
  { id: 'esocial-s2299', sistema: 'dp', pergunta: 'Qual o prazo para enviar o desligamento (S-2299) no eSocial?', chaves: [['10 dias', 'dez dias']], fonte: 'MOS S-1.3, S-2299' },
  { id: 'esocial-s2200', sistema: 'dp', pergunta: 'Até quando tenho que enviar a admissão do empregado (S-2200) no eSocial?', chaves: [['dia anterior', 'dia imediatamente anterior', 'vespera']], fonte: 'MOS S-1.3, S-2200' },
  { id: 'parcsn', sistema: 'fiscal', pergunta: 'Em quantas parcelas posso parcelar débitos do Simples Nacional no parcelamento ordinário da Receita e qual a parcela mínima?', chaves: [['60', 'sessenta'], ['300']], fonte: 'gov.br Parcelar débitos do Simples Nacional; IN RFB 1.508/2014' },
  { id: 'dirbi-prazo', sistema: 'fiscal', pergunta: 'Qual o prazo de entrega da DIRBI?', chaves: [['20', 'vinte'], ['segundo mes', '2º mes', '2o mes']], fonte: 'Receita Federal, DIRBI' },
  { id: 'ecf-prazo', sistema: 'contabil', pergunta: 'Qual o prazo de entrega da ECF?', chaves: [['julho']], fonte: 'gov.br Entregar ECF; IN RFB 2.004/2021' },
  { id: 'ecd-prazo', sistema: 'contabil', pergunta: 'Qual o prazo de entrega da ECD?', chaves: [['junho']], fonte: 'gov.br Entregar ECD; IN RFB 2.003/2021' },
  { id: 'plr-pagamentos', sistema: 'dp', pergunta: 'Quantas vezes por ano posso pagar PLR aos empregados?', chaves: [['2', 'duas', 'dois']], fonte: 'Lei 10.101/2000, art. 3º, § 2º' },
  { id: 'mei-limite-2027', sistema: 'fiscal', pergunta: 'Qual será o limite de faturamento do MEI em 2027?', chaves: [['110']], fonte: 'LC 238/2026, art. 2º' },
  { id: 'cpp-patronal', sistema: 'dp', pergunta: 'Qual a contribuição patronal do INSS sobre a folha de empregados de empresa do Lucro Presumido (sem contar RAT e terceiros)?', chaves: [['20%', '20 %', 'vinte por cento']], fonte: 'Lei 8.212 art. 22, I' },
];

const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');

/** Confere a resposta: devolve os grupos de chave que faltaram (vazio = acertou). */
export function conferirResposta(resposta: string, chaves: string[][]): string[] {
  const r = normalizar(resposta);
  return chaves.filter((grupo) => !grupo.some((alt) => r.includes(normalizar(alt)))).map((g) => g.join(' | '));
}

export async function rodarConferidor(consultor: Consultor | null, perguntas: PerguntaTeste[] = PERGUNTAS_TESTE): Promise<SaudeConsultor> {
  const resultados: ResultadoTeste[] = [];
  let geminiFora = !consultor;
  for (const t of perguntas) {
    if (geminiFora) {
      resultados.push({ id: t.id, pergunta: t.pergunta, situacao: 'nao_testado', detalhe: 'Gemini indisponível' });
      continue;
    }
    try {
      const { resposta, indisponivel } = await consultor!.perguntar({ pergunta: t.pergunta, sistema: t.sistema, contextoEmpresa: t.contextoEmpresa }, { registrar: false });
      if (indisponivel) {
        geminiFora = true; // não insiste: os próximos também ficam "não testado"
        resultados.push({ id: t.id, pergunta: t.pergunta, situacao: 'nao_testado', detalhe: 'Gemini indisponível' });
        continue;
      }
      const faltou = conferirResposta(resposta.resposta, t.chaves);
      resultados.push(faltou.length ? { id: t.id, pergunta: t.pergunta, situacao: 'errou', faltou, detalhe: `Conferir em: ${t.fonte}` } : { id: t.id, pergunta: t.pergunta, situacao: 'acertou' });
    } catch (e) {
      resultados.push({ id: t.id, pergunta: t.pergunta, situacao: 'nao_testado', detalhe: `Falha técnica: ${(e as Error)?.message ?? e}` });
    }
  }
  const acertos = resultados.filter((r) => r.situacao === 'acertou').length;
  const erros = resultados.filter((r) => r.situacao === 'errou').length;
  const naoTestados = resultados.filter((r) => r.situacao === 'nao_testado').length;
  return {
    quando: new Date().toISOString(),
    situacao: naoTestados === resultados.length ? 'nao_testado' : erros > 0 ? 'com_falhas' : 'ok',
    total: resultados.length,
    acertos,
    erros,
    naoTestados,
    resultados,
  };
}

const UM_DIA = 24 * 60 * 60 * 1000;

/**
 * Agenda o conferidor 1x por dia. Para não gastar a chave a cada deploy/reinício, só roda se a última
 * conferência registrada tiver mais de 20 horas. Retorna função para parar (usada nos testes).
 */
export function agendarConferidor(consultor: Consultor | null, armazem: Armazem, opcoes: { primeiraEmMs?: number } = {}): () => void {
  let rodando = false;
  const tentar = async () => {
    if (rodando) return;
    rodando = true;
    try {
      const ultima = await armazem.ultimaSaude().catch(() => null);
      if (ultima && Date.now() - Date.parse(ultima.quando) < 20 * 60 * 60 * 1000 && ultima.situacao !== 'nao_testado') return;
      const saude = await rodarConferidor(consultor);
      await armazem.salvarSaude(saude);
      console.log(`[consultor] conferidor: ${saude.situacao} (${saude.acertos}/${saude.total} acertos, ${saude.erros} erros, ${saude.naoTestados} não testados)`);
    } catch (e) {
      console.error('[consultor] conferidor falhou:', (e as Error)?.message);
    } finally {
      rodando = false;
    }
  };
  const primeira = setTimeout(tentar, opcoes.primeiraEmMs ?? 10 * 60 * 1000);
  const diaria = setInterval(tentar, UM_DIA);
  primeira.unref?.();
  diaria.unref?.();
  return () => {
    clearTimeout(primeira);
    clearInterval(diaria);
  };
}
