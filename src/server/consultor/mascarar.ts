// Mascaramento de dados pessoais antes de guardar perguntas e respostas.
// CPF (pessoa física) é mascarado; CNPJ de empresa é mantido (é dado da empresa, não da pessoa).
// O CNPJ de MEI é de pessoa jurídica, mas a razão social do MEI costuma trazer o CPF: o CPF é mascarado.

const CPF_FORMATADO = /(?<!\d)\d{3}\.\d{3}\.\d{3}-\d{2}(?!\d)/g;
const CPF_CRU = /(?<![\d./-])\d{11}(?![\d/-])/g;
const CPF_ROTULADO = /\b(cpf|c\.p\.f\.?)\s*(?:n[ºo°.]?\s*)?[:\-]?\s*[\d.\-\s]{11,16}/gi;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const TELEFONE = /(?<!\d)(?:\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}(?!\d)/g;
const PIS_NIT = /\b(pis|pasep|nit)\s*(?:n[ºo°.]?\s*)?[:\-]?\s*\d{3}\.?\d{5}\.?\d{2}-?\d/gi;

export function mascararTexto(texto: string): string {
  return String(texto ?? '')
    .replace(CPF_ROTULADO, (_m, r) => `${r} ***.***.***-**`)
    .replace(PIS_NIT, (_m, r) => `${r} ***.*****.**-*`)
    .replace(CPF_FORMATADO, '***.***.***-**')
    .replace(CPF_CRU, '***********')
    .replace(EMAIL, '[e-mail]')
    .replace(TELEFONE, '[telefone]');
}

/** Mascara recursivamente strings dentro de objetos/listas (para o contexto da empresa). */
export function mascararObjeto<T>(valor: T): T {
  if (typeof valor === 'string') return mascararTexto(valor) as unknown as T;
  if (Array.isArray(valor)) return valor.map((v) => mascararObjeto(v)) as unknown as T;
  if (valor && typeof valor === 'object') {
    const saida: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(valor as Record<string, unknown>)) {
      // CNPJ com 11 dígitos não existe: se vier um CPF no campo cnpj, mascara.
      if (k === 'cnpj' && typeof v === 'string' && v.replace(/\D/g, '').length === 11) saida[k] = '***********';
      else saida[k] = mascararObjeto(v);
    }
    return saida as T;
  }
  return valor;
}
