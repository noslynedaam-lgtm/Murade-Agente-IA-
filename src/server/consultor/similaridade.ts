// Comparação de perguntas sem IA: normaliza o texto, junta sinônimos de contador e mede a semelhança
// (coeficiente de Dice sobre as palavras de conteúdo). Usado pelas respostas prontas e pelo cache.

/** Minúsculas, sem acento, sem pontuação estranha, espaços simples. */
export function normalizarTexto(s: string): string {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[º°ª]/g, 'o')
    .replace(/[“”"'`´]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Expressões de várias palavras viram um termo só (ordem importa: as mais longas primeiro).
const EXPRESSOES: [RegExp, string][] = [
  [/\bsem justa causa\b/g, ' semjustacausa '],
  [/\bpor justa causa\b|\bjusta causa\b/g, ' justacausa '],
  [/\bdecimo[ -]?terceiro( salario)?\b|\b13o( salario)?\b|\b13 salario\b|\bgratificacao natalina\b/g, ' decimoterceiro '],
  [/\bpgdas[ -]?d\b|\bpgdas\b/g, ' pgdas '],
  [/\bdasn[ -]?simei\b|\bdasn\b|\bdeclaracao anual do mei\b/g, ' dasnsimei '],
  [/\bdas[ -]?mei\b|\bboleto do mei\b|\bguia do mei\b/g, ' dasmei '],
  [/\bmicroempreendedor individual\b|\bmicro empreendedor individual\b/g, ' mei '],
  [/\bsimples nacional\b/g, ' simples '],
  [/\blucro presumido\b/g, ' presumido '],
  [/\blucro real\b/g, ' lucroreal '],
  [/\bimposto de renda (da )?pessoa juridica\b/g, ' irpj '],
  [/\bir (sobre|na folha|do salario|da folha|mensal|de 20\d\d)\b/g, ' irrf $1 '],
  [/\bimposto de renda retido( na fonte)?\b|\bir na fonte\b|\bir retido\b|\bimposto de renda\b/g, ' irrf '],
  [/\bempresa de pequeno porte\b/g, ' epp '],
  [/\bfator r\b/g, ' fatorr '],
  [/\blivro caixa\b/g, ' livrocaixa '],
  [/\blivro diario\b/g, ' livrodiario '],
  [/\bregistro de inventario\b|\blivro de inventario\b/g, ' livroinventario '],
  [/\bcessao de mao[ -]de[ -]obra\b|\bcessao de mao[ -]?obra\b|\blocacao de mao[ -]de[ -]obra\b/g, ' cessaomaoobra '],
  [/\bbanco de horas\b/g, ' bancohoras '],
  [/\bhoras? extras?\b|\bsobrejornada\b/g, ' horaextra '],
  [/\badicional noturno\b|\btrabalho noturno\b|\bhora noturna\b|\bhorario noturno\b/g, ' noturno '],
  [/\baviso[ -]previo\b/g, ' avisoprevio '],
  [/\baviso (trabalhado|indenizado)\b/g, ' avisoprevio $1 '],
  [/\bcontrato de experiencia\b|\bperiodo de experiencia\b/g, ' experiencia '],
  [/\blicenca[ -]maternidade\b|\bsalario[ -]maternidade\b/g, ' maternidade '],
  [/\blicenca[ -]paternidade\b|\bsalario[ -]paternidade\b/g, ' paternidade '],
  [/\bsalario[ -]familia\b/g, ' salariofamilia '],
  [/\bsalario minimo\b/g, ' salariominimo '],
  [/\bseguro[ -]desemprego\b/g, ' segurodesemprego '],
  [/\bpro[ -]?labore\b/g, ' prolabore '],
  [/\bparticipacao nos lucros( e resultados)?\b/g, ' plr '],
  [/\babono pecuniario\b|\bvender (as )?ferias\b|\bvender (10|dez) dias\b|\bvender um terco\b/g, ' abonopecuniario '],
  [/\bnotas? fisca(l|is) de servicos?\b|\bnotas? de servicos?\b|\bnfs[ -]?e\b/g, ' nfse '],
  [/\bdiferencial de aliquotas?\b/g, ' difal '],
  [/\bsubstituicao tributaria\b|\bicms[ -]st\b/g, ' icmsst '],
  [/\bsem movimento\b|\bzerada\b|\bsem faturamento\b/g, ' semmovimento '],
  [/\bcertidao negativa( de debitos)?\b|\bcnd\b/g, ' cnd '],
  [/\bcontribuicao previdenciaria\b|\bprevidencia social\b/g, ' inss '],
  [/\bcontribuicao patronal\b|\bparte patronal\b|\binss patronal\b|\bcpp\b/g, ' patronal '],
  [/\bverbas rescisorias\b|\bacerto (de contas|rescisorio)\b/g, ' rescisao '],
  [/\bmandar embora\b/g, ' demissao '],
  [/\bfora do prazo\b|\bem atraso\b|\batrasad[oa]s?\b/g, ' atraso '],
  [/\bdata limite\b|\bate quando\b|\bate que dia\b|\bqual (o )?dia\b|\bque dia\b|\bqual a data\b/g, ' prazo '],
  [/\bdia util\b|\bdias uteis\b/g, ' diautil '],
  [/\bfim de semana\b|\bfinal de semana\b|\bferiado\b|\bsabado\b|\bdomingo\b/g, ' feriado '],
  [/\bjunta comercial\b/g, ' juceg '],
  [/\babrir (uma )?empresa\b|\babertura de empresa\b|\babrir (uma )?ltda\b|\babrir cnpj\b/g, ' aberturaempresa '],
  [/\bmulta do fgts\b|\bmulta rescisoria\b/g, ' fgts multa '],
];

// Palavras isoladas que significam a mesma coisa para o contador.
const SINONIMOS: Record<string, string> = {
  vencimento: 'prazo', vence: 'prazo', vencem: 'prazo', vencer: 'prazo', prazos: 'prazo',
  entregar: 'entregar', transmitir: 'entregar', enviar: 'entregar', mandar: 'entregar', entrega: 'entregar', transmissao: 'entregar', envio: 'entregar', declarar: 'entregar',
  pagar: 'pagar', recolher: 'pagar', quitar: 'pagar', pagamento: 'pagar', recolhimento: 'pagar', pago: 'pagar', paga: 'pagar', pagos: 'pagar',
  aliquota: 'aliquota', percentual: 'aliquota', porcentagem: 'aliquota', taxa: 'aliquota', '%': 'aliquota',
  penalidade: 'multa', multas: 'multa',
  funcionario: 'empregado', funcionaria: 'empregado', trabalhador: 'empregado', trabalhadora: 'empregado', colaborador: 'empregado', empregada: 'empregado',
  demissao: 'demissao', dispensa: 'demissao', desligamento: 'demissao', despedida: 'demissao', demitir: 'demissao', dispensar: 'demissao', desligar: 'demissao', demitido: 'demissao',
  rescisao: 'rescisao', rescisoria: 'rescisao', rescisorio: 'rescisao', rescindir: 'rescisao',
  faturamento: 'receita', receita: 'receita', faturar: 'receita', receitas: 'receita',
  limite: 'limite', teto: 'limite', maximo: 'limite',
  previdencia: 'inss',
  goias: 'goias', go: 'goias', goiano: 'goias',
  parcelar: 'parcelamento', parcelado: 'parcelamento', parcelamento: 'parcelamento',
  dividir: 'fracionar', fracionar: 'fracionar', fracionamento: 'fracionar', fracionadas: 'fracionar',
  contratar: 'contratar', contratacao: 'contratar', registrar: 'contratar', admitir: 'admissao', admissao: 'admissao',
  empregados: 'empregado',
  ultrapassou: 'excesso', ultrapassar: 'excesso', ultrapassa: 'excesso', estourou: 'excesso', estourar: 'excesso', excedeu: 'excesso', exceder: 'excesso', passou: 'excesso',
  autenticado: 'autenticacao', autenticar: 'autenticacao', autenticada: 'autenticacao', autentica: 'autenticacao',
  dinheiro: 'abonopecuniario', converter: 'abonopecuniario', convertido: 'abonopecuniario',
  engravidou: 'gestante', gravida: 'gestante', gravidez: 'gestante',
  atestado: 'afastamento', afastado: 'afastamento',
  parada: 'semmovimento', inativa: 'semmovimento', paralisada: 'semmovimento',
};

const PALAVRAS_VAZIAS = new Set(
  ('a o as os um uma uns umas de da do das dos e em no na nos nas num numa para pra pro por pelo pela pelos pelas com sem que qual quais quanto quanta quantos quantas ' +
    'quando como onde se ao aos ate eu me mim meu minha meus minhas seu sua seus suas nosso nossa voce voces ele ela eles elas isso isto essa esse esta este ' +
    'tem ter tenho temos tera preciso precisa precisamos devo deve devemos posso pode podemos ser sao sera foi era e ou mais muito muita ja ainda tambem so sobre ' +
    'vai vou fazer faz feito fica ficar fico existe existem algum alguma hoje agora favor gostaria saber queria quero dizer diz explica explique me la ai nao sim ' +
    'certo certa correto correta regra regras').split(/\s+/),
);

/** Uma palavra simples de radical: tira o "s" do plural das palavras maiores. */
function radical(w: string): string {
  if (/^\d/.test(w)) return w;
  if (w.length > 4 && w.endsWith('oes')) return w.slice(0, -3) + 'ao';
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

/** Palavras de conteúdo da pergunta, já com sinônimos e radical. */
export function termos(texto: string): string[] {
  // "DAS" (a guia do Simples) x "das" (preposição): maiúsculo ou junto de palavras de guia é a guia.
  let t = ` ${String(texto ?? '').replace(/\bDAS\b/g, ' guiadas ')} `;
  t = ` ${normalizarTexto(t)} `
    .replace(/\b(o|do|no|ao|um|pagar|pago|paguei|gerar|guia|boleto|vencimento)\s+das\b/g, '$1 guiadas')
    .replace(/\bdas\s+(do simples|da empresa|atrasad|vence|vencid|mensal)/g, 'guiadas $1');
  t = t.replace(/(\d)\s*%/g, '$1 %').replace(/(\d)[.,](\d)/g, '$1_$2');
  for (const [re, troca] of EXPRESSOES) t = t.replace(re, troca);
  const saida: string[] = [];
  for (const cru of t.split(/[^a-z0-9_%]+/)) {
    if (!cru) continue;
    const w = cru.replace(/_/g, ',');
    if (PALAVRAS_VAZIAS.has(w)) continue;
    const s = SINONIMOS[w] ?? SINONIMOS[radical(w)] ?? radical(w);
    if (s.length < 2 && !/^\d$/.test(s)) continue;
    saida.push(s);
  }
  return saida;
}

/** Números citados (anos, dias, valores) — usados para não responder "dia 20" quando perguntaram "dia 25". */
export function numeros(lista: string[]): string[] {
  return lista.filter((w) => /^\d/.test(w));
}

/** Coeficiente de Dice entre os conjuntos de termos (0 a 1). */
export function semelhanca(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size || !B.size) return 0;
  let comum = 0;
  for (const x of A) if (B.has(x)) comum++;
  return (2 * comum) / (A.size + B.size);
}

/** Pergunta normalizada para servir de chave do cache (mesmas palavras, mesma ordem, sem palavras vazias). */
export function perguntaNormalizada(texto: string): string {
  return termos(texto).join(' ');
}

// Sinais de que a pergunta é sobre um caso concreto (empresa, empregado, valor) e não sobre a regra geral.
const SINAIS_CASO = [
  /\bminha empresa\b/, /\bnossa empresa\b/, /\bdessa empresa\b/, /\bdesta empresa\b/, /\bessa empresa\b/, /\besta empresa\b/,
  /\bmeu cliente\b/, /\bminha cliente\b/, /\bmeus clientes\b/, /\bno meu caso\b/, /\bneste caso\b/, /\bnesse caso\b/, /\bno caso dela\b/, /\bno caso dele\b/,
  /\bmeu funcionario\b/, /\bminha funcionaria\b/, /\bmeu empregado\b/, /\bminha empregada\b/, /\bnosso funcionario\b/, /\bpara mim\b/, /\bpra mim\b/,
  /\bda empresa [a-z]/, /\bmeu mei\b/, /\bminha ltda\b/, /\bna empresa\b/, /\bdo cliente\b/, /\bdo meu\b/, /\bda minha\b/,
];
const SINAIS_CALCULO = [/\bcalcul/, /\bsimul/, /\bquanto (fica|vou|vai|devo|tenho|preciso|sai|custa)\b/, /\br\$\s*\d/, /\d+[.,]\d{2}\b/, /\b\d{4,}\b(?!\s*(\/|de)\s*20\d\d)/];
const SINAIS_DIVERGENCIA = [
  /\bdiscordo\b/, /\bnao concordo\b/, /\bdo meu jeito\b/, /\bvou fazer diferente\b/, /\bprefiro\b/, /\bmesmo assim\b/, /\btem certeza\b/, /\besta errad/, /\bvoce errou\b/,
  /\bmas a lei\b/, /\bquero fazer\b/, /\bvou pagar\b.*\b(depois|dia|em)\b/, /\bnao vou\b/,
];
const SINAIS_SEGUIMENTO = [/^e se\b/, /^e (para|pra|no|na|quando|o|a)\b/, /^mas\b/, /^e\b/, /\bcaso contrario\b/, /\bdisso\b/, /\bdaquilo\b/, /\bisso ai\b/];

export function pareceCasoConcreto(pergunta: string): boolean {
  const t = normalizarTexto(pergunta);
  return SINAIS_CASO.some((r) => r.test(t));
}
export function pedeCalculo(pergunta: string): boolean {
  const t = normalizarTexto(pergunta);
  // Anos (2026, 2027...) e artigos de lei não contam como valor.
  const semAnos = t.replace(/\b20\d\d\b/g, ' ').replace(/\bs-?\d{4}\b/g, ' ').replace(/\b(art|artigo|lei|lc|in|decreto|resolucao|portaria)\.?\s*n?o?\s*\d[\d.]*/g, ' ');
  return SINAIS_CALCULO.some((r) => r.test(semAnos));
}
export function pareceDivergencia(pergunta: string): boolean {
  const t = normalizarTexto(pergunta);
  return SINAIS_DIVERGENCIA.some((r) => r.test(t));
}
export function pareceSeguimento(pergunta: string): boolean {
  const t = normalizarTexto(pergunta);
  return SINAIS_SEGUIMENTO.some((r) => r.test(t)) || termos(pergunta).length < 3;
}
