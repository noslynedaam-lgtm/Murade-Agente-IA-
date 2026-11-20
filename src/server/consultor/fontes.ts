// Filtro de fontes: só domínios oficiais entram na resposta do Consultor.
import type { Fonte } from './tipos';

export const DOMINIOS_OFICIAIS = [
  'planalto.gov.br',
  'gov.br',
  'receita.fazenda.gov.br',
  'normas.receita.fazenda.gov.br',
  'www8.receita.fazenda.gov.br',
  'esocial.gov.br',
  'fgts.gov.br',
  'caixa.gov.br',
  'cfc.org.br',
  'economia.go.gov.br',
  'goias.gov.br',
  'goiania.go.gov.br',
  'senado.leg.br',
  'camara.leg.br',
  'stf.jus.br',
  'stj.jus.br',
  'tst.jus.br',
  'in.gov.br',
  'confaz.fazenda.gov.br',
  'nfse.gov.br',
  'sped.rfb.gov.br',
  'serpro.gov.br',
] as const;

/** Domínio oficial: igual a um domínio da lista ou subdomínio dele (ex.: www2.camara.leg.br). */
export function dominioOficial(host: string): boolean {
  const h = String(host || '').toLowerCase().replace(/\.$/, '').trim();
  if (!h || /[^a-z0-9.-]/.test(h)) return false;
  return DOMINIOS_OFICIAIS.some((d) => h === d || h.endsWith('.' + d));
}

/** URL oficial: http(s), sem usuário/senha embutidos, host na lista. */
export function urlOficial(url: string): boolean {
  try {
    const u = new URL(String(url || '').trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    if (u.username || u.password) return false;
    return dominioOficial(u.hostname);
  } catch {
    return false;
  }
}

/** Mantém só fontes oficiais, sem repetição, até `max`. Força https quando o site aceita (gov.br/leg.br). */
export function filtrarFontesOficiais(fontes: unknown, max = 8): Fonte[] {
  if (!Array.isArray(fontes)) return [];
  const vistas = new Set<string>();
  const saida: Fonte[] = [];
  for (const f of fontes) {
    if (!f || typeof f !== 'object') continue;
    const url = String((f as any).url ?? '').trim();
    if (!urlOficial(url)) continue;
    const chave = url.replace(/^http:/, 'https:').replace(/\/$/, '');
    if (vistas.has(chave)) continue;
    vistas.add(chave);
    const titulo = String((f as any).titulo ?? '').trim().slice(0, 200) || new URL(url).hostname;
    saida.push({ titulo, url: url.slice(0, 600) });
    if (saida.length >= max) break;
  }
  return saida;
}

/**
 * Fontes da pesquisa Google (groundingChunks). A URI costuma ser um redirecionamento do Google
 * (vertexaisearch.cloud.google.com) e o título traz o domínio do site. Só aproveitamos quando a
 * própria URI é oficial; o título oficial conta apenas como "pesquisa confirmou em site oficial".
 */
export function fontesDaPesquisa(chunks: unknown): { fontes: Fonte[]; dominiosOficiaisVistos: string[] } {
  const fontes: Fonte[] = [];
  const dominios = new Set<string>();
  if (!Array.isArray(chunks)) return { fontes, dominiosOficiaisVistos: [] };
  for (const c of chunks) {
    const uri = String((c as any)?.web?.uri ?? '');
    const titulo = String((c as any)?.web?.title ?? '');
    if (urlOficial(uri)) {
      fontes.push({ titulo: titulo || new URL(uri).hostname, url: uri });
      dominios.add(new URL(uri).hostname);
    } else if (dominioOficial(titulo)) {
      dominios.add(titulo.toLowerCase());
    }
  }
  return { fontes, dominiosOficiaisVistos: [...dominios] };
}
