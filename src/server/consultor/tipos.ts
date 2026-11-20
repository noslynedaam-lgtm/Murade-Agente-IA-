// Contrato do Consultor Murade (ver docs/CONSULTOR.md).

export const SISTEMAS = ['fiscal', 'dp', 'contabil', 'fiscoia'] as const;
export type Sistema = (typeof SISTEMAS)[number];

export const AREAS = ['contabil', 'fiscal', 'dp', 'societario', 'outro'] as const;
export type Area = (typeof AREAS)[number];

export const CONFIANCAS = ['alta', 'media', 'baixa'] as const;
export type Confianca = (typeof CONFIANCAS)[number];

export const REGIMES = ['simples', 'presumido', 'real', 'mei'] as const;

export const AVISO_RESPONSABILIDADE =
  'Orientação do Consultor Murade com base na legislação citada. A decisão final é do contador responsável (CRC).';

export type ContextoEmpresa = {
  cnpj?: string;
  razaoSocial?: string;
  regime?: (typeof REGIMES)[number];
  anexoSimples?: string;
  cnaePrincipal?: string;
  uf?: string;
  municipio?: string;
  temFuncionarios?: boolean;
  qtdFuncionarios?: number;
  faturamento12m?: number;
  pendencias?: string[];
  outros?: Record<string, string | number | boolean>;
};

/** Tela do sistema chamador (mapa resumido): o consultor prefere mandar a pessoa para a tela do próprio sistema. */
export type TelaSistema = { id: string; nome: string; caminho: string; oQueFaz: string };

/** Onde a pessoa faz o procedimento: numa tela do sistema chamador ou num portal oficial. */
export type OndeFazer = { tipo: 'sistema' | 'externo'; tela?: string; url?: string; passos: string[] };

export type MensagemHistorico = { papel: 'usuario' | 'consultor'; texto: string };
export type Ferramenta = { nome: string; descricao: string };

export type PerguntaConsultor = {
  pergunta: string;
  sistema: Sistema;
  contextoEmpresa?: ContextoEmpresa;
  historico?: MensagemHistorico[];
  ferramentasDisponiveis?: Ferramenta[];
  /** Mapa resumido das telas do sistema chamador (para responder "no sistema: abra <caminho>"). */
  telasDoSistema?: TelaSistema[];
  /** Identificação (login/ID, não nome nem CPF) de quem pergunta e do escritório: usada no registro de decisões. */
  usuario?: string;
  escritorio?: string;
};

export type Fonte = { titulo: string; url: string };
export type AcaoSugerida = { ferramenta: string; descricao: string; argumentos?: Record<string, unknown> };

export const FRASE_ACEITE = 'Posso fazer do seu jeito. Fica registrado que a orientação foi outra e que a decisão é sua.';

/** Quando o contador questiona ou quer fazer diferente da orientação. */
export type Divergencia = { orientacao: string; fonte: Fonte; escolhaDoContador: string };

export type RespostaConsultor = {
  resposta: string;
  area: Area;
  fontes: Fonte[];
  confianca: Confianca;
  encaminharContador: boolean;
  motivoEncaminhamento?: string;
  acoesSugeridas: AcaoSugerida[];
  avisoResponsabilidade: string;
  divergencia?: Divergencia;
  /** true quando o pedido do contador é claramente ilegal/fraude: o consultor recusa e explica. */
  recusado?: boolean;
  /** De onde veio a resposta: 'pronta' (banco conferido), 'cache' (IA guardada), 'ia' (Gemini agora) ou 'bloqueado' (precisava de IA e o escritório não tem o adicional). */
  origem?: Origem;
  /** true quando a resposta gastou (ou pode ter gastado) crédito do Gemini. */
  custoIA?: boolean;
  /** Se o escritório tem o Consultor completo (adicional pago) liberado. */
  liberado?: boolean;
  /** Onde fazer (procedimentos "como faço…"): tela do sistema chamador ou portal oficial, com os passos. */
  ondeFazer?: OndeFazer;
  /** Resposta pronta: id e data em que foi conferida na fonte oficial. */
  respostaProntaId?: string;
  conferidoEm?: string;
};

export const ORIGENS = ['pronta', 'cache', 'ia', 'bloqueado'] as const;
export type Origem = (typeof ORIGENS)[number];
export type UsoTokens = { entrada: number; saida: number; total: number };

export type Decisao = {
  id?: string;
  criadoEm?: string;
  data: string; // ISO
  escritorio: string;
  usuario: string;
  sistema: Sistema;
  pergunta: string;
  orientacao: string;
  fonte: Fonte | null;
  escolhaDoContador: string;
  origem: 'consultor' | 'sistema';
};

/** O que o modelo devolve antes da validação do servidor (pode vir incompleto ou errado). */
export type RespostaBruta = {
  texto: string; // JSON gerado pelo modelo
  fontesPesquisa: Fonte[]; // fontes da pesquisa Google (groundingChunks)
  modelo?: string;
  /** Tokens informados pelo SDK (usageMetadata), quando vierem. */
  uso?: UsoTokens;
};

/** Erro que indica que o Gemini está fora/indisponível (não é erro do consultor). */
export class GeminiIndisponivel extends Error {
  constructor(msg = 'Gemini indisponível') {
    super(msg);
    this.name = 'GeminiIndisponivel';
  }
}
