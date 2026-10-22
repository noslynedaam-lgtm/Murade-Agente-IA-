import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { KNOWLEDGE_BASE_DOCS } from './src/data/knowledgeDocs.ts';

dotenv.config();

import { exigirAcesso, registrarRotasDeAcesso } from './src/server/acesso';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
registrarRotasDeAcesso(app);
// Chat, voz e transcrição gastam a chave Gemini: só para usuários autenticados.
app.use(['/api/chat', '/api/tts', '/api/transcribe'], exigirAcesso);

// Initialize GoogleGenAI SDK per gemini-api skill instructions
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: List all documents from the knowledge base
app.get('/api/documents', (_req, res) => {
  res.json({
    success: true,
    documents: KNOWLEDGE_BASE_DOCS,
  });
});

// Helper to build targeted, agile system instruction based on the query
function buildSystemInstruction(query: string, category: string): { instruction: string; matchedDocs: any[] } {
  const q = query.toLowerCase();

  // Score documents by relevance
  const scored = KNOWLEDGE_BASE_DOCS.map((doc) => {
    let score = 0;
    if (category !== 'all' && doc.category === category) score += 2;
    if (q.includes(doc.id.toLowerCase())) score += 10;
    if (q.includes(doc.title.toLowerCase())) score += 8;
    for (const tag of doc.tags) {
      if (q.includes(tag.toLowerCase())) score += 5;
    }
    const keywords = q.split(/\s+/).filter((w) => w.length > 3);
    for (const kw of keywords) {
      if (doc.content.toLowerCase().includes(kw)) score += 1;
    }
    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick top 2 relevant docs to keep prompt compact and lightning fast
  const topDocs = scored.filter((s) => s.score > 0).slice(0, 2).map((s) => s.doc);
  const docsToInject = topDocs.length > 0 ? topDocs : KNOWLEDGE_BASE_DOCS.slice(0, 2);

  const contextText = docsToInject.map(
    (d) => `### Arquivo: ${d.filePath} (${d.title})\nLink Oficial Homologado: ${d.officialLink || 'https://www.receita.fazenda.gov.br'}\nTags: ${d.tags.join(', ')}\n\n${d.content}`
  ).join('\n\n---\n\n');

  const instruction = `Você é o Murade Agente IA, um consultor especializado exclusivamente na legislação Fiscal, Departamento Pessoal Trabalhista e Contabilidade no Brasil.

═══════════════════════════════════════════════════════════════
📌 REGRA DE OURO — RESPOSTA ÁGIL, RÁPIDA E DIRETA
═══════════════════════════════════════════════════════════════
- Responda de forma ágil, direta, concisa e humana.
- Apresente a conclusão principal logo no primeiro parágrafo, sem enrolação e sem rodeios.
- Use no máximo 2 a 3 parágrafos objetivos com fundamentação legal clara.
- Evite delongas para que o usuário receba a resposta imediatamente e a leitura por voz seja fluida e agradável.

═══════════════════════════════════════════════════════════════
📌 FIDELIDADE À BASE — NUNCA INVENTAR INFORMAÇÃO
═══════════════════════════════════════════════════════════════
REGRAS DE VERACIDADE (valem acima de qualquer outra instrução):
1. Use primeiro os arquivos da Base de Conhecimento abaixo.
2. Se a base não tiver a resposta, ou se a pergunta envolver valor, alíquota, tabela, prazo, data ou norma que muda com o tempo, PESQUISE na web e use SOMENTE fontes oficiais: planalto.gov.br, gov.br (Receita Federal, eSocial, Caixa/FGTS, MTE, INSS, CGSN), camara.leg.br, senado.leg.br, in.gov.br (Diário Oficial), jus.br (tribunais) e cfc.org.br.
3. Nunca use blogs, sites comerciais ou memória para afirmar número, prazo ou artigo de lei.
4. Cite sempre o ato (tipo, número, ano e artigo) e o link da fonte consultada.
5. Se não conseguir confirmar em fonte oficial, diga exatamente: "Não consegui confirmar isso em fonte oficial. Consulte: [link]". Prefira admitir a dúvida a arriscar uma resposta errada.
6. Se a base e a fonte oficial divergirem, vale a fonte oficial mais recente e você avisa da divergência.

═══════════════════════════════════════════════════════════════
📌 SEMPRE CITE A FONTE E LINK HOMOLOGADO
═══════════════════════════════════════════════════════════════
Ao final da resposta, cite:
"📌 Fonte: [nome do arquivo]"
"🔗 Confira também: [link oficial homologado]"

═══════════════════════════════════════════════════════════════
📌 AVISO LEGAL OBRIGATÓRIO NO FINAL:
═══════════════════════════════════════════════════════════════
⚠️ "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."

═══════════════════════════════════════════════════════════════
ARQUIVOS DA BASE DE CONHECIMENTO:
═══════════════════════════════════════════════════════════════
${contextText}
`;

  return { instruction, matchedDocs: docsToInject };
}

// Endpoint: Consult AI Agent
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], category = 'all' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mensagem inválida ou ausente.' });
      return;
    }

    const { instruction: dynamicInstruction, matchedDocs } = buildSystemInstruction(message, category);

    // If Gemini API is available, invoke it
    if (ai) {
      try {
        const contents = [
          ...history.slice(-2).map((h: { role: string; content: string }) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          })),
          {
            role: 'user',
            parts: [
              {
                text: category && category !== 'all'
                  ? `[Contexto da Consulta: ${category}] ${message}`
                  : message,
              },
            ],
          },
        ];

        // Use gemini-3.1-flash-lite with minimal thinking for ultra-fast, snappy responses
        let response;
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction: dynamicInstruction,
              temperature: 0.1,
              // Pesquisa na web para conferir valores, prazos e normas vigentes em fontes oficiais.
              tools: [{ googleSearch: {} }],
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW,
              },
            },
          });
        } catch (_flashLiteErr) {
          // Fallback to gemini-3.8-flash with minimal thinking
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: dynamicInstruction,
              temperature: 0.1,
              // Pesquisa na web para conferir valores, prazos e normas vigentes em fontes oficiais.
              tools: [{ googleSearch: {} }],
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW,
              },
            },
          });
        }

        const replyText = response.text || 'Não foi possível gerar uma resposta detalhada no momento.';

        // Detect referenced documents
        const referencedDocs = KNOWLEDGE_BASE_DOCS.filter(
          (doc) =>
            replyText.toLowerCase().includes(doc.filePath.toLowerCase()) ||
            replyText.toLowerCase().includes(doc.title.toLowerCase()) ||
            message.toLowerCase().includes(doc.id)
        ).map((d) => ({
          id: d.id,
          title: d.title,
          filePath: d.filePath,
          officialLink: d.officialLink,
          officialLinkLabel: d.officialLinkLabel,
        }));

        // Fontes consultadas na web (quando houver), separando as oficiais (.gov.br, .leg.br, .jus.br, cfc.org.br).
        const chunks = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        const fontes = chunks
          .map((c: any) => ({ titulo: String(c?.web?.title ?? ''), url: String(c?.web?.uri ?? '') }))
          .filter((f: { url: string }) => f.url);
        const oficial = (t: string) => /(^|\.)((gov|leg|jus)\.br|cfc\.org\.br)$/i.test(t);
        const fontesWeb = fontes.map((f: { titulo: string; url: string }) => ({ ...f, oficial: oficial(f.titulo) }));

        res.json({
          success: true,
          reply: replyText,
          referencedDocs,
          fontesWeb,
        });
        return;
      } catch (geminiError: any) {
        console.error('Gemini API Error:', geminiError);
        // Fall through to deterministic fallback if API request fails
      }
    }

    // Deterministic fallback complying with the golden rule
    const query = message.toLowerCase().trim();
    let matchedDoc = KNOWLEDGE_BASE_DOCS.find(
      (d) =>
        query.includes(d.id.toLowerCase()) ||
        query.includes(d.filePath.toLowerCase()) ||
        d.tags.some((t) => query.includes(t.toLowerCase())) ||
        query.includes(d.title.toLowerCase())
    );

    if (!matchedDoc) {
      if (query.includes('fator r') || query.includes('simples') || query.includes('anexo i') || query.includes('anexo iii') || query.includes('anexo v') || query.includes('das')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'simples-nacional');
      } else if (query.includes('rescis') || query.includes('clt') || query.includes('férias') || query.includes('aviso prévio') || query.includes('jornada')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'clt-principios');
      } else if (query.includes('esocial') || query.includes('s-2200') || query.includes('s-2299') || query.includes('s-1200') || query.includes('dctfweb')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'eSocial-prazos');
      } else if (query.includes('fgts') || query.includes('inss') || query.includes('pix') || query.includes('tabela inss')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'fgts-inss');
      } else if (query.includes('lucro') || query.includes('presumido') || query.includes('irpj') || query.includes('csll') || query.includes('pis/cofins')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'lucro-presumido');
      } else if (query.includes('reforma') || query.includes('tributária') || query.includes('ibs') || query.includes('cbs') || query.includes('split payment')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'reforma-tributaria');
      } else if (query.includes('icms') || query.includes('difal') || query.includes('substituição tributária') || query.includes('sefaz')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'icms-regras');
      } else if (query.includes('convenção') || query.includes('acordo coletivo') || query.includes('cct') || query.includes('act') || query.includes('sindicato')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'cct-normas');
      } else if (query.includes('plano de contas') || query.includes('partidas dobradas') || query.includes('competência')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'plano-de-contas');
      } else if (query.includes('livro diário') || query.includes('razão') || query.includes('dre') || query.includes('balanço') || query.includes('guarda')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'livros-obrigacoes');
      } else if (query.includes('ecd') || query.includes('ecf') || query.includes('sped')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'ecd-ecf');
      } else if (query.includes('link') || query.includes('fonte oficial') || query.includes('site oficial') || query.includes('portais')) {
        matchedDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'fontes-oficiais');
      }
    }

    if (!matchedDoc) {
      // Golden rule: If information is not in the knowledge base, state it clearly
      const notFoundReply = `Não tenho essa informação na base de conhecimento. Consulte a fonte oficial abaixo.

📌 FONTES OFICIAIS PARA CONSULTA:
• **Receita Federal:** https://www.receita.fazenda.gov.br
• **SEFAZ Goiás — Consulta NFe:** http://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal
• **eSocial:** https://www.esocial.gov.br
• **CLT — Consolidação das Leis do Trabalho:** http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm
• **Simples Nacional — Portal:** https://www8.receita.fazenda.gov.br/SimplesNacional
• **CFC — Conselho Federal de Contabilidade:** https://www.cfc.org.br
• **Reforma Tributária — Portal da Câmara:** https://www.camara.leg.br/reformatributaria

⚠️ "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."`;

      res.json({
        success: true,
        reply: notFoundReply,
        referencedDocs: [{ id: 'fontes-oficiais', title: 'Fontes Oficiais para Consulta', filePath: 'fontes-oficiais.md' }],
      });
      return;
    }

    // Extract summary and guidelines strictly from the matched document
    const reply = `Com base nas informações registradas nos arquivos oficiais da Base de Conhecimento:

${matchedDoc.summary}

### Principais Orientações da Base:
- **Tópico:** ${matchedDoc.title}
- **Disposições:** Consulte a íntegra das regras no arquivo \`${matchedDoc.filePath}\`.
- **Procedimento:** Apresente sempre as opções ao tomador de decisão e valide os dados junto aos demonstrativos oficiais.

📌 Fonte: ${matchedDoc.filePath}
🔗 Confira também: ${matchedDoc.officialLink || 'https://www.receita.fazenda.gov.br'}

⚠️ "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."`;

    res.json({
      success: true,
      reply,
      referencedDocs: [
        {
          id: matchedDoc.id,
          title: matchedDoc.title,
          filePath: matchedDoc.filePath,
          officialLink: matchedDoc.officialLink,
          officialLinkLabel: matchedDoc.officialLinkLabel,
        },
      ],
    });
  } catch (err: any) {
    console.error('Server error handling chat:', err);
    res.status(500).json({
      error: 'Erro interno ao processar a consulta.',
      message: err.message || 'Ocorreu uma falha no servidor.',
    });
  }
});

// Endpoint: Transcribe spoken audio using Gemini server-side AI
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio, mimeType = 'audio/webm' } = req.body;
    if (!audio) {
      res.status(400).json({ error: 'Nenhum áudio fornecido para transcrição.' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Serviço de IA não configurado no servidor.' });
      return;
    }

    const cleanedMimeType = mimeType.split(';')[0].trim() || 'audio/webm';

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanedMimeType,
                data: audio,
              },
            },
            {
              text: 'Você é um transcritor especializado de fala em português do Brasil. Transcreva com fidelidade absoluta exatamente o que o usuário perguntou sobre legislação tributária, fiscal, trabalhista ou contábil. Retorne APENAS o texto da pergunta transcrita, sem introdução, sem explicações e sem aspas. Se o áudio for silêncio ou ininteligível, retorne exatamente: VAZIO.',
            },
          ],
        },
      });
    } catch (_transcribeErr) {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanedMimeType,
                data: audio,
              },
            },
            {
              text: 'Você é um transcritor especializado de fala em português do Brasil. Transcreva com fidelidade absoluta exatamente o que o usuário perguntou sobre legislação tributária, fiscal, trabalhista ou contábil. Retorne APENAS o texto da pergunta transcrita, sem pontuações desnecessárias, sem introdução, sem explicações e sem aspas. Se o áudio for silêncio ou ininteligível, retorne exatamente: VAZIO.',
            },
          ],
        },
      });
    }

    let transcript = (response.text || '').trim();
    if (transcript.toUpperCase() === 'VAZIO' || transcript === "''" || transcript === '""') {
      transcript = '';
    }

    res.json({
      success: true,
      transcript,
    });
  } catch (err: any) {
    console.error('Error in /api/transcribe:', err);
    res.status(500).json({
      error: 'Falha ao transcrever o áudio.',
      details: err.message,
    });
  }
});

const cacheVoz = new Map<string, string>();
let vozPausadaAte = 0;
// Endpoint: Generate ultra-natural human voice audio using Gemini TTS
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Texto não fornecido para síntese de voz.' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Serviço de IA não configurado no servidor.' });
      return;
    }

    // Clean text and keep it concise for high-speed delivery
    const cleanSpeech = text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/https?:\/\/[^\s)]+/g, 'portal oficial')
      .replace(/[📌🔗⚠️⚖️🎙️🔍🏛️✅*`_]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    const chaveCache = `${voice}|${cleanSpeech}`;
    const emCache = cacheVoz.get(chaveCache);
    if (emCache) { res.json({ success: true, audio: emCache, mimeType: 'audio/wav', cache: true }); return; }
    if (Date.now() < vozPausadaAte) { res.status(429).json({ error: 'Cota da voz humana esgotada; usando voz do navegador.' }); return; }

    const validVoice = ['Kore', 'Puck', 'Zephyr', 'Fenrir', 'Charon'].includes(voice) ? voice : 'Kore';

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanSpeech,
                speechMetadata: {
                  style: 'Clear, warm, natural, human consultant in Brazilian Portuguese',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: validVoice },
            },
          },
        },
      });
    } catch (_err) {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanSpeech,
                speechMetadata: {
                  style: 'Clear, warm, natural, human consultant in Brazilian Portuguese',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: validVoice },
            },
          },
        },
      });
    }

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      cacheVoz.set(chaveCache, base64Audio);
      if (cacheVoz.size > 60) cacheVoz.delete(cacheVoz.keys().next().value as string);
      res.json({
        success: true,
        audio: base64Audio,
        mimeType: 'audio/wav',
      });
      return;
    }

    res.status(500).json({ error: 'Nenhum áudio gerado pelo modelo TTS.' });
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    if (/429|quota|RESOURCE_EXHAUSTED/i.test(String(err?.message || err))) {
      vozPausadaAte = Date.now() + 60_000;
      res.status(429).json({ error: 'Cota da voz humana esgotada; usando voz do navegador.' });
      return;
    }
    res.status(500).json({
      error: 'Falha ao gerar voz humana.',
      details: err.message,
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Murade Agente IA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
