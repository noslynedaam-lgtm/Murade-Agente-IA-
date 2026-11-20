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

export type MensagemHistorico = { papel: 'usuario' | 'consultor'; texto: string };
export type Ferramenta = { nome: string; descricao: string };

export type PerguntaConsultor = {
  pergunta: string;
  sistema: Sistema;
  contextoEmpresa?: ContextoEmpresa;
  historico?: MensagemHistorico[];
  ferramentasDisponiveis?: Ferramenta[];
};

export type Fonte = { titulo: string; url: string };
export type AcaoSugerida = { ferramenta: string; descricao: string; argumentos?: Record<string, unknown> };

export type RespostaConsultor = {
  resposta: string;
  area: Area;
  fontes: Fonte[];
  confianca: Confianca;
  encaminharContador: boolean;
  motivoEncaminhamento?: string;
  acoesSugeridas: AcaoSugerida[];
  avisoResponsabilidade: string;
};

/** O que o modelo devolve antes da validação do servidor (pode vir incompleto ou errado). */
export type RespostaBruta = {
  texto: string; // JSON gerado pelo modelo
  fontesPesquisa: Fonte[]; // fontes da pesquisa Google (groundingChunks)
  modelo?: string;
};

/** Erro que indica que o Gemini está fora/indisponível (não é erro do consultor). */
export class GeminiIndisponivel extends Error {
  constructor(msg = 'Gemini indisponível') {
    super(msg);
    this.name = 'GeminiIndisponivel';
  }
}
