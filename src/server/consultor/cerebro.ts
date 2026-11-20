// Cérebro do Consultor Murade: instrução de contador, escolha de blocos da base e chamada ao Gemini.
import { Type, ThinkingLevel, type GoogleGenAI } from '@google/genai';
import { KNOWLEDGE_BASE_DOCS, type KnowledgeDoc } from '../../data/knowledgeDocs';
import { DOMINIOS_OFICIAIS, fontesDaPesquisa } from './fontes';
import { mascararObjeto, mascararTexto } from './mascarar';
import { FRASE_ACEITE, GeminiIndisponivel, type ContextoEmpresa, type PerguntaConsultor, type RespostaBruta } from './tipos';

// Mesmos modelos já usados no server.ts (/api/chat), na mesma ordem de fallback.
export const MODELOS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'] as const;
const LIMITE_BASE_CARACTERES = 45000; // cabe com folga no contexto do modelo

const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const AREA_DO_SISTEMA: Record<string, KnowledgeDoc['category'] | null> = { fiscal: 'fiscal', dp: 'dp-trabalhista', contabil: 'contabil', fiscoia: null };

/** Escolhe os blocos mais relevantes da base (por área, tags, título e palavras), dentro do limite de caracteres. */
export function escolherBlocos(pergunta: string, sistema: string, contexto?: ContextoEmpresa, docs: KnowledgeDoc[] = KNOWLEDGE_BASE_DOCS): KnowledgeDoc[] {
  const q = normalizar(`${pergunta} ${contexto?.regime ?? ''} ${contexto?.regime === 'simples' ? 'simples nacional' : ''}`);
  const palavras = [...new Set(q.split(/[^a-z0-9]+/).filter((w) => w.length > 3))];
  const areaSistema = AREA_DO_SISTEMA[sistema];
  const pontuados = docs
    .filter((d) => d.category !== 'aviso-legal')
    .map((d) => {
      let pontos = 0;
      const titulo = normalizar(d.title);
      const conteudo = normalizar(d.content);
      if (areaSistema && d.category === areaSistema) pontos += 1;
      for (const tag of d.tags) if (q.includes(normalizar(tag))) pontos += 6;
      for (const w of palavras) {
        if (titulo.includes(w)) pontos += 3;
        if (conteudo.includes(w)) pontos += 1;
      }
      if (d.lastUpdated >= '2026-10-01') pontos += 1; // prefere blocos conferidos recentemente
      return { d, pontos };
    })
    .filter((x) => x.pontos > 1)
    .sort((a, b) => b.pontos - a.pontos);

  const escolhidos: KnowledgeDoc[] = [];
  let total = 0;
  for (const { d } of pontuados) {
    if (escolhidos.length >= 6) break;
    if (total + d.content.length > LIMITE_BASE_CARACTERES && escolhidos.length > 0) continue;
    escolhidos.push(d);
    total += d.content.length;
  }
  return escolhidos;
}

function descreverEmpresa(c?: ContextoEmpresa): string {
  if (!c) return 'Não informado. Se a resposta depender do regime, da atividade ou do porte, diga isso e explique os casos.';
  const regimes: Record<string, string> = { simples: 'Simples Nacional', presumido: 'Lucro Presumido', real: 'Lucro Real', mei: 'MEI (SIMEI)' };
  const linhas = [
    c.razaoSocial && `Empresa: ${c.razaoSocial}`,
    c.cnpj && `CNPJ: ${c.cnpj}`,
    c.regime && `Regime: ${regimes[c.regime]}`,
    c.anexoSimples && `Anexo do Simples: ${c.anexoSimples}`,
    c.cnaePrincipal && `CNAE principal: ${c.cnaePrincipal}`,
    (c.municipio || c.uf) && `Local: ${[c.municipio, c.uf].filter(Boolean).join('/')}`,
    c.temFuncionarios !== undefined && `Tem funcionários: ${c.temFuncionarios ? 'sim' : 'não'}${c.qtdFuncionarios !== undefined ? ` (${c.qtdFuncionarios})` : ''}`,
    c.faturamento12m !== undefined && `Faturamento dos últimos 12 meses: R$ ${c.faturamento12m.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    c.pendencias?.length && `Pendências no sistema: ${c.pendencias.join('; ')}`,
    c.outros && Object.keys(c.outros).length && `Outros dados: ${Object.entries(c.outros).map(([k, v]) => `${k}=${v}`).join('; ')}`,
  ].filter(Boolean);
  return linhas.length ? linhas.join('\n') : 'Não informado.';
}

export function montarInstrucao(p: PerguntaConsultor, blocos: KnowledgeDoc[]): string {
  const ferramentas = p.ferramentasDisponiveis?.length
    ? p.ferramentasDisponiveis.map((f) => `- ${f.nome}: ${f.descricao}`).join('\n')
    : '(nenhuma: deixe "acoesSugeridas" vazio)';
  const base = blocos.length
    ? blocos.map((d) => `### ${d.title}\nLink oficial: ${d.officialLink ?? '-'}\nConferido em: ${d.lastUpdated}\n\n${d.content}`).join('\n\n---\n\n')
    : '(nenhum bloco da base corresponde; pesquise em fonte oficial ou encaminhe ao contador)';

  return `Você é o CONSULTOR MURADE: um contador brasileiro experiente (CRC ativo), que atende pequenas empresas em Goiânia/GO. Domina contabilidade (NBC/CFC), fiscal e tributário (Simples Nacional, MEI, Lucro Presumido, Lucro Real, ICMS-GO, ISS de Goiânia, PIS/Cofins, retenções, SPED, Reforma Tributária IBS/CBS), departamento pessoal (CLT, eSocial, FGTS Digital, DCTFWeb, EFD-Reinf, INSS, IRRF) e societário básico.
Você está dentro do sistema Murade "${p.sistema}". Se a pergunta for de outra área, responda mesmo assim como especialista daquela área.

COMO VOCÊ PENSA (nesta ordem):
1. Identifique a situação: regime tributário, atividade, porte, se tem funcionários, data/competência.
2. Ache a regra que se aplica.
3. Ache a base legal: lei/norma, artigo e link OFICIAL.
4. Diga o que fazer, passo a passo, em português simples, como contador falando com o cliente.
5. Diga riscos, multas e prazos.
6. Se houver uma ferramenta disponível que resolva, ofereça: "Quer que eu faça isso para você?" e coloque a ação em "acoesSugeridas".

REGRAS DE VERDADE (acima de tudo):
- Use primeiro os BLOCOS DA BASE abaixo. Cada bloco diz o que foi conferido e o que NÃO foi; o que estiver marcado "preciso confirmar" você NÃO afirma como certo.
- Se precisar pesquisar, use SOMENTE sites oficiais: ${DOMINIOS_OFICIAIS.join(', ')}. Nunca use blogs, portais comerciais ou memória para afirmar número, alíquota, prazo ou artigo.
- Toda afirmação legal precisa de fonte oficial em "fontes" (título e URL completa do site oficial). Sem fonte oficial → confianca "baixa" e encaminharContador true.
- Nunca invente lei, artigo, valor, prazo ou ferramenta. Se não tiver certeza, diga "não tenho certeza" e encaminhe ao contador responsável, explicando o motivo em "motivoEncaminhamento".
- Se a base e a fonte oficial mais recente divergirem, vale a fonte oficial mais recente; avise da divergência.
- Personalize com os DADOS DA EMPRESA ("na sua empresa, que é do Simples, Anexo III..."). Se faltar um dado que muda a resposta, diga qual.
- Não repita CPF, e-mail ou telefone de pessoas.
- "confianca": "alta" só quando a regra está na base conferida ou em fonte oficial lida agora e se aplica sem dúvida ao caso; "media" quando depende de algum dado não informado; "baixa" quando não conseguiu confirmar.
- "acoesSugeridas": SOMENTE ferramentas da lista FERRAMENTAS DISPONÍVEIS, com o nome exatamente igual. Os "argumentos" vão como texto JSON (ex.: "{\\"competencia\\":\\"2026-10\\"}").
- "resposta": direta, primeiro a conclusão ("O certo é ..., porque a lei diz ..."), depois o que fazer e os riscos. Sem markdown pesado; pode usar listas curtas.
QUANDO O CONTADOR QUESTIONAR OU QUISER FAZER DIFERENTE da sua orientação (olhe o histórico da conversa):
1. Explique de novo, curto e firme: "Pela lei X, art. Y, o certo é assim" + link oficial.
2. Aceite fazer do jeito dele e diga exatamente: "${FRASE_ACEITE}"
3. Preencha "divergencia": "orientacao" (o que a lei manda, em uma frase), "fonteTitulo" e "fonteUrl" (fonte oficial da orientação) e "escolhaDoContador" (o que ele decidiu fazer).
4. Nunca recuse a decisão do contador. A ÚNICA exceção é pedido claramente ilegal ou fraude (ex.: sonegar, esconder receita, emitir nota fria, registrar empregado com data falsa para fraudar benefício): aí "recusado": true, explique por que é ilegal com a base legal, não preencha "divergencia" e não sugira ação.
Divergência de interpretação, escolha entre opções legais ou prazo/forma diferente NÃO é fraude: aceite e registre.

- Responda APENAS com o JSON no formato pedido.

DADOS DA EMPRESA:
${descreverEmpresa(p.contextoEmpresa)}

FERRAMENTAS DISPONÍVEIS NO SISTEMA:
${ferramentas}

BLOCOS DA BASE DE CONHECIMENTO MURADE:
${base}`;
}

export const ESQUEMA_RESPOSTA = {
  type: Type.OBJECT,
  properties: {
    resposta: { type: Type.STRING, description: 'Resposta em português simples, como contador falando com o cliente.' },
    area: { type: Type.STRING, enum: ['contabil', 'fiscal', 'dp', 'societario', 'outro'] },
    fontes: {
      type: Type.ARRAY,
      items: { type: Type.OBJECT, properties: { titulo: { type: Type.STRING }, url: { type: Type.STRING } }, required: ['titulo', 'url'] },
    },
    confianca: { type: Type.STRING, enum: ['alta', 'media', 'baixa'] },
    encaminharContador: { type: Type.BOOLEAN },
    motivoEncaminhamento: { type: Type.STRING },
    divergencia: {
      type: Type.OBJECT,
      description: 'Só quando o contador questiona ou quer fazer diferente da orientação.',
      properties: {
        orientacao: { type: Type.STRING },
        fonteTitulo: { type: Type.STRING },
        fonteUrl: { type: Type.STRING },
        escolhaDoContador: { type: Type.STRING },
      },
      required: ['orientacao', 'escolhaDoContador'],
    },
    recusado: { type: Type.BOOLEAN, description: 'true só para pedido claramente ilegal ou fraude.' },
    acoesSugeridas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { ferramenta: { type: Type.STRING }, descricao: { type: Type.STRING }, argumentos: { type: Type.STRING, description: 'Objeto JSON em texto.' } },
        required: ['ferramenta', 'descricao'],
      },
    },
  },
  required: ['resposta', 'area', 'fontes', 'confianca', 'encaminharContador', 'acoesSugeridas'],
};

/** Erros que significam "Gemini fora" (chave, cota, rede, serviço). */
export function ehIndisponibilidade(e: unknown): boolean {
  const m = String((e as any)?.message ?? e ?? '');
  return /429|quota|RESOURCE_EXHAUSTED|UNAVAILABLE|503|500|502|504|ECONNRESET|ENOTFOUND|ETIMEDOUT|fetch failed|network|API key|PERMISSION_DENIED|deadline/i.test(m);
}

/**
 * Chama o Gemini. Ordem: modelo 1 com pesquisa + JSON, modelo 2 com pesquisa + JSON,
 * modelo 1 só JSON (sem pesquisa, caso o modelo não aceite ferramenta junto com esquema).
 */
export function criarGerador(ai: GoogleGenAI | null) {
  return async function gerar(p: PerguntaConsultor, blocos: KnowledgeDoc[]): Promise<RespostaBruta> {
    if (!ai) throw new GeminiIndisponivel('GEMINI_API_KEY não configurada.');
    const instrucao = montarInstrucao({ ...p, contextoEmpresa: p.contextoEmpresa ? mascararObjeto(p.contextoEmpresa) : undefined }, blocos);
    const contents = [
      ...(p.historico ?? []).map((h) => ({ role: h.papel === 'consultor' ? 'model' : 'user', parts: [{ text: mascararTexto(h.texto) }] })),
      { role: 'user', parts: [{ text: mascararTexto(p.pergunta) }] },
    ];
    const tentativas: { modelo: string; pesquisa: boolean }[] = [
      { modelo: MODELOS[0], pesquisa: true },
      { modelo: MODELOS[1], pesquisa: true },
      { modelo: MODELOS[0], pesquisa: false },
    ];
    let ultimoErro: unknown;
    for (const t of tentativas) {
      try {
        const r = await ai.models.generateContent({
          model: t.modelo,
          contents,
          config: {
            systemInstruction: instrucao,
            temperature: 0.1,
            responseMimeType: 'application/json',
            responseSchema: ESQUEMA_RESPOSTA,
            ...(t.pesquisa ? { tools: [{ googleSearch: {} }] } : {}),
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });
        const texto = r.text ?? '';
        if (!texto.trim()) throw new Error('Resposta vazia do modelo.');
        const chunks = (r as any).candidates?.[0]?.groundingMetadata?.groundingChunks;
        return { texto, fontesPesquisa: fontesDaPesquisa(chunks).fontes, modelo: t.modelo };
      } catch (e) {
        ultimoErro = e;
      }
    }
    if (ehIndisponibilidade(ultimoErro)) throw new GeminiIndisponivel(String((ultimoErro as any)?.message ?? ultimoErro));
    throw ultimoErro instanceof Error ? ultimoErro : new Error(String(ultimoErro));
  };
}

export type Gerador = ReturnType<typeof criarGerador>;
