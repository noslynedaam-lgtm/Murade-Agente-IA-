// Liberação paga por escritório e por produto (adicionais vendidos separados):
// - 'consultor': Consultor Murade completo (com IA) + serviço completo nos sistemas;
// - 'escola': Escola Murade (cursos para iniciantes dentro dos sistemas).
// Quem decide é o dono do sistema (tela do dono). MURADE_CONSULTOR_LIBERADOS_PADRAO libera de saída
// os escritórios da lista (CNPJs separados por vírgula) nos dois produtos; um registro na tabela prevalece.
import type { Armazem, Liberacao } from './registro';

export const PRODUTOS = ['consultor', 'escola'] as const;
export type Produto = (typeof PRODUTOS)[number];

export const MENSAGEM_NAO_LIBERADO = 'O Consultor Murade completo é um adicional. Fale com o seu fornecedor para liberar.';
export const MENSAGEM_ESCOLA_NAO_LIBERADA = 'A Escola Murade é um adicional. Fale com o seu fornecedor para liberar.';

/** CNPJ só com letras/números, maiúsculo (aceita o CNPJ alfanumérico). */
export function normalizarCnpj(v: unknown): string {
  return String(v ?? '').replace(/[^0-9A-Za-z]/g, '').toUpperCase();
}

/** 14 caracteres (12 alfanuméricos + 2 dígitos) com dígitos verificadores corretos (módulo 11; letra = código ASCII − 48). */
export function cnpjValido(v: unknown): boolean {
  const c = normalizarCnpj(v);
  if (!/^[0-9A-Z]{12}\d{2}$/.test(c) || /^(\d)\1{13}$/.test(c)) return false;
  const valor = (ch: string) => ch.charCodeAt(0) - 48;
  const dv = (base: string) => {
    let soma = 0;
    let peso = 2;
    for (let i = base.length - 1; i >= 0; i--) {
      soma += valor(base[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = dv(c.slice(0, 12));
  const d2 = dv(c.slice(0, 12) + d1);
  return c.endsWith(`${d1}${d2}`);
}

export function produtoValido(v: unknown): v is Produto {
  return typeof v === 'string' && (PRODUTOS as readonly string[]).includes(v);
}

/** Lista da variável MURADE_CONSULTOR_LIBERADOS_PADRAO (só CNPJs válidos). */
export function lerLiberadosPadrao(valor: string | undefined = process.env.MURADE_CONSULTOR_LIBERADOS_PADRAO): string[] {
  return [...new Set(String(valor ?? '').split(/[,;\s]+/).map(normalizarCnpj).filter(cnpjValido))];
}

export type SituacaoLiberacao = { escritorio: string; produto: Produto; liberado: boolean; origem: 'tabela' | 'padrao' | 'nenhuma'; registro?: Liberacao };

export function criarLiberacoes(armazem: Armazem, opcoes: { padrao?: () => string[]; cacheMs?: number } = {}) {
  const padrao = opcoes.padrao ?? (() => lerLiberadosPadrao());
  const cacheMs = opcoes.cacheMs ?? 30_000;
  const cache = new Map<string, { ate: number; v: SituacaoLiberacao }>();

  async function situacao(escritorio: string | undefined, produto: Produto = 'consultor'): Promise<SituacaoLiberacao> {
    const cnpj = normalizarCnpj(escritorio);
    if (!cnpjValido(cnpj)) return { escritorio: cnpj, produto, liberado: false, origem: 'nenhuma' };
    const k = `${cnpj}|${produto}`;
    const c = cache.get(k);
    if (c && c.ate > Date.now()) return c.v;
    let registro: Liberacao | null = null;
    try {
      registro = await armazem.liberacao(cnpj, produto);
    } catch (e) {
      console.error('[consultor] não li a liberação:', (e as Error)?.message);
    }
    const v: SituacaoLiberacao = registro
      ? { escritorio: cnpj, produto, liberado: registro.liberado, origem: 'tabela', registro }
      : padrao().includes(cnpj)
        ? { escritorio: cnpj, produto, liberado: true, origem: 'padrao' }
        : { escritorio: cnpj, produto, liberado: false, origem: 'nenhuma' };
    cache.set(k, { ate: Date.now() + cacheMs, v });
    if (cache.size > 5000) cache.clear();
    return v;
  }

  async function definir(l: Omit<Liberacao, 'quando'>): Promise<Liberacao> {
    const salvo = await armazem.salvarLiberacao({ ...l, escritorio: normalizarCnpj(l.escritorio), quando: new Date().toISOString() });
    cache.clear();
    return salvo;
  }

  return { situacao, definir, padrao };
}

export type Liberacoes = ReturnType<typeof criarLiberacoes>;
