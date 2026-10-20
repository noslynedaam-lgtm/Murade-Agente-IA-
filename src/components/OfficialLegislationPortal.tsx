import React, { useState, useMemo, useEffect } from 'react';
import {
  ExternalLink,
  Search,
  Scale,
  FileText,
  Calculator,
  Building2,
  Users,
  Globe,
  Bot,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Landmark,
  FileCheck2,
  BookmarkCheck,
  Compass,
  CheckCircle2,
  X,
  Maximize2,
  Copy,
  Check
} from 'lucide-react';
import { KNOWLEDGE_BASE_DOCS, KnowledgeDoc } from '../data/knowledgeDocs.ts';

export interface LegislationLink {
  id: string;
  category: 'trabalhista' | 'simples' | 'esocial' | 'contabil' | 'reforma' | 'tributos' | 'societario' | 'institucional';
  categoryLabel: string;
  title: string;
  officialEntity: string;
  url: string;
  shortUrl: string;
  description: string;
  lawRef: string;
  docId: string;
  agentPrompt: string;
  isPriority?: boolean;
}

export const OFFICIAL_LINKS: LegislationLink[] = [
  // 1. CLT e Legislação Trabalhista
  {
    id: 'clt-planalto',
    category: 'trabalhista',
    categoryLabel: 'CLT & Trabalhista',
    title: 'CLT — Consolidação das Leis do Trabalho',
    officialEntity: 'Presidência da República / Casa Civil',
    url: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    shortUrl: 'www.planalto.gov.br/legislacao (Códigos → CLT)',
    description: 'Texto integral compilado e atualizado do Decreto-Lei nº 5.452/1943 com a Reforma Trabalhista (Lei 13.467/17), rescisões (Art. 477), férias, jornada e FGTS.',
    lawRef: 'Decreto-Lei nº 5.452/1943',
    docId: 'clt-legislacao-integral',
    agentPrompt: 'Quais são as regras e prazos do Art. 477 da CLT para pagamento das verbas rescisórias e multas?',
    isPriority: true,
  },

  // 2. Simples Nacional
  {
    id: 'simples-nacional',
    category: 'simples',
    categoryLabel: 'Simples Nacional',
    title: 'Simples Nacional — Portal Oficial',
    officialEntity: 'Secretaria-Executiva do CGSN / RFB',
    url: 'https://www8.receita.fazenda.gov.br/SimplesNacional',
    shortUrl: 'www8.receita.fazenda.gov.br/SimplesNacional',
    description: 'Acesso direto ao PGDAS-D, DEFIS, cálculo de alíquotas nominais e efetivas, Anexos I a V, Fator R (28%) e sublimites de R$ 3,6M.',
    lawRef: 'Lei Complementar nº 123/2006',
    docId: 'simples-nacional-completo',
    agentPrompt: 'Como apurar o Fator R no Simples Nacional para enquadramento no Anexo III ou V?',
    isPriority: true,
  },

  // 3. eSocial & FGTS Digital
  {
    id: 'esocial-gov',
    category: 'esocial',
    categoryLabel: 'eSocial & FGTS Digital',
    title: 'eSocial — Sistema de Escrituração Digital',
    officialEntity: 'Governo Federal / Ministério do Trabalho / RFB',
    url: 'https://www.esocial.gov.br',
    shortUrl: 'www.esocial.gov.br',
    description: 'Ambiente oficial para transmissão de eventos S-1200, S-2200 (admissão), S-2299 (desligamento em 10 dias), DCTFWeb e Manual MOS S-1.3.',
    lawRef: 'Decreto nº 8.373/2014',
    docId: 'esocial-fgts-digital',
    agentPrompt: 'Qual é o cronograma de fechamento mensal do eSocial (evento S-1299) e prazos de demissão?',
    isPriority: true,
  },
  {
    id: 'fgts-digital',
    category: 'esocial',
    categoryLabel: 'eSocial & FGTS Digital',
    title: 'FGTS Digital & Pix Obrigatório',
    officialEntity: 'Ministério do Trabalho e Emprego / Caixa',
    url: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital',
    shortUrl: 'gov.br/fgtsdigital',
    description: 'Plataforma oficial de apuração do FGTS mensal e rescisório com recolhimento obrigatório via Pix e vencimento unificado no dia 20.',
    lawRef: 'Lei nº 14.438/2022',
    docId: 'esocial-fgts-digital',
    agentPrompt: 'Como funciona o recolhimento do FGTS Digital via Pix e quais os prazos na rescisão?',
    isPriority: true,
  },

  // 4. Normas Contábeis (CFC & NBCs)
  {
    id: 'cfc-normas',
    category: 'contabil',
    categoryLabel: 'Normas Contábeis (CFC)',
    title: 'CFC — Conselho Federal de Contabilidade',
    officialEntity: 'Conselho Federal de Contabilidade',
    url: 'https://www.cfc.org.br',
    shortUrl: 'www.cfc.org.br',
    description: 'Repositório de Normas Brasileiras de Contabilidade (NBC TG 1000 PME, CPC 00 R2), Código Civil arts. 1.179 a 1.195 e Lei das S.A. 6.404/76.',
    lawRef: 'Decreto-Lei nº 9.295/1946 e NBCs',
    docId: 'normas-contabeis-cfc',
    agentPrompt: 'Como estruturar o Plano de Contas padrão de acordo com as NBCs e a Lei 6.404/76?',
    isPriority: true,
  },
  {
    id: 'sped-rfb',
    category: 'contabil',
    categoryLabel: 'Normas Contábeis (CFC)',
    title: 'SPED — Escrituração Contábil Digital (ECD & ECF)',
    officialEntity: 'Receita Federal do Brasil',
    url: 'http://sped.rfb.gov.br',
    shortUrl: 'sped.rfb.gov.br',
    description: 'Manuais oficiais do SPED Contábil (ECD) e SPED ECF com validação do Livro Diário, Razão, Balanço Patrimonial e DRE.',
    lawRef: 'IN RFB nº 2.003/2021',
    docId: 'normas-contabeis-cfc',
    agentPrompt: 'Quais empresas do Lucro Presumido e Real estão obrigadas à entrega da ECD e da ECF?',
  },

  // 5. Reforma Tributária
  {
    id: 'reforma-camara',
    category: 'reforma',
    categoryLabel: 'Reforma Tributária',
    title: 'Reforma Tributária — Portal da Câmara dos Deputados',
    officialEntity: 'Câmara dos Deputados',
    url: 'https://www.camara.leg.br/reformatributaria',
    shortUrl: 'www.camara.leg.br / www.senado.gov.br',
    description: 'Acompanhamento oficial da transição da Emenda Constitucional nº 132/2023, leis complementares do IBS, CBS, Split Payment e Imposto Seletivo.',
    lawRef: 'Emenda Constitucional nº 132/2023',
    docId: 'reforma-tributaria-ec132',
    agentPrompt: 'Explique o cronograma de transição do IBS e da CBS a partir de 2026 e o Split Payment.',
    isPriority: true,
  },
  {
    id: 'senado-federal',
    category: 'reforma',
    categoryLabel: 'Reforma Tributária',
    title: 'Senado Federal — Legislação e Atividade Legislativa',
    officialEntity: 'Senado Federal',
    url: 'https://www.senado.leg.br',
    shortUrl: 'www.senado.leg.br',
    description: 'Projetos de Lei Complementar PLP 68/2024 e PLP 108/2024 da Reforma Tributária, pareceres e votações sobre IBS, CBS e Comitê Gestor.',
    lawRef: 'PLP 68/2024 e PLP 108/2024',
    docId: 'reforma-tributaria-ec132',
    agentPrompt: 'Qual o papel do Comitê Gestor do IBS previsto na Reforma Tributária?',
  },

  // 6. ICMS, IPI, ISS & Tributos Federais e Estaduais
  {
    id: 'receita-federal',
    category: 'tributos',
    categoryLabel: 'ICMS, IPI, ISS & Tributos',
    title: 'Receita Federal do Brasil — Legislação e e-CAC',
    officialEntity: 'Ministério da Fazenda',
    url: 'https://www.receita.fazenda.gov.br',
    shortUrl: 'www.receitafederal.gov.br',
    description: 'Portal de normas tributárias federais, IRPJ e CSLL no Lucro Presumido, PIS/COFINS, IPI, DCTFWeb e consultas de regularidade CNPJ.',
    lawRef: 'RIR/2018 e Lei nº 9.718/98',
    docId: 'tributos-icms-ipi-iss',
    agentPrompt: 'Quais as alíquotas de presunção do IRPJ e CSLL para prestadores de serviços e comércio?',
    isPriority: true,
  },
  {
    id: 'sefaz-goias',
    category: 'tributos',
    categoryLabel: 'ICMS, IPI, ISS & Tributos',
    title: 'SEFAZ Goiás — Consulta NFe e Legislação ICMS',
    officialEntity: 'Secretaria de Estado da Economia de Goiás',
    url: 'http://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal',
    shortUrl: 'www.sefaz.go.gov.br',
    description: 'Consulta pública de NF-e, DIFAL, Substituição Tributária (ICMS-ST) e Regulamento do Código Tributário Estadual (RCTE-GO).',
    lawRef: 'Lei Estadual nº 11.651/1991',
    docId: 'tributos-icms-ipi-iss',
    agentPrompt: 'Como funciona o cálculo do DIFAL no ICMS para Goiás após a LC 190/2022?',
    isPriority: true,
  },

  // 7. Legislação Societária e Jurídica na Contabilidade
  {
    id: 'direito-societario',
    category: 'societario',
    categoryLabel: 'Direito Societário & DREI',
    title: 'Legislação Societária e Jurídica Empresarial',
    officialEntity: 'Presidência da República / DREI',
    url: 'https://www.planalto.gov.br/legislacao',
    shortUrl: 'www.planalto.gov.br/legislacao (Código Civil)',
    description: 'Direito de Empresa no Código Civil (arts. 966 a 1.141), Sociedade Limitada (Ltda), Sociedade Limitada Unipessoal (SLU), Instruções DREI e crimes fiscais.',
    lawRef: 'Código Civil & Lei 13.874/2019',
    docId: 'direito-societario-juridico',
    agentPrompt: 'Quais as diferenças entre Sociedade Limitada (Ltda) e Sociedade Limitada Unipessoal (SLU)?',
  },

  // 8. Portal da Presidência da República & DOU
  {
    id: 'planalto-geral',
    category: 'institucional',
    categoryLabel: 'Presidência da República & DOU',
    title: 'Portal da Legislação da Presidência da República',
    officialEntity: 'Secretaria-Geral da Presidência',
    url: 'https://www.planalto.gov.br/legislacao',
    shortUrl: 'www.planalto.gov.br/legislacao',
    description: 'Pesquisa avançada em todos os Códigos, Leis Complementares, Decretos e Medidas Provisórias da União.',
    lawRef: 'Constituição Federal de 1988',
    docId: 'fontes-oficiais',
    agentPrompt: 'Qual a hierarquia normativa entre Lei Complementar, Lei Ordinária e Decreto no Brasil?',
  },
  {
    id: 'diario-oficial',
    category: 'institucional',
    categoryLabel: 'Presidência da República & DOU',
    title: 'Diário Oficial da União (DOU) — Imprensa Nacional',
    officialEntity: 'Imprensa Nacional',
    url: 'https://www.in.gov.br',
    shortUrl: 'www.in.gov.br',
    description: 'Publicações diárias dos atos normativos, portarias ministeriais, instruções normativas e resoluções federais.',
    lawRef: 'Decreto nº 9.215/2017',
    docId: 'fontes-oficiais',
    agentPrompt: 'Como conferir a vigência de uma nova Instrução Normativa da Receita Federal publicada no DOU?',
  },
];

interface OfficialLegislationPortalProps {
  onOpenDoc: (docId: string) => void;
  onAskAgent: (promptText: string) => void;
  onOpenChat: () => void;
  onOpenSimulators: () => void;
  onOpenCalendar: () => void;
}

export const OfficialLegislationPortal: React.FC<OfficialLegislationPortalProps> = ({
  onOpenDoc,
  onAskAgent,
  onOpenChat,
  onOpenSimulators,
  onOpenCalendar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingDocId, setReadingDocId] = useState<string | null>(null);
  const [copiedReader, setCopiedReader] = useState(false);

  const readingDoc = useMemo(() => {
    if (!readingDocId) return null;
    return KNOWLEDGE_BASE_DOCS.find((d) => d.id === readingDocId) || null;
  }, [readingDocId]);

  const handleCopyReader = () => {
    if (readingDoc) {
      navigator.clipboard.writeText(readingDoc.content);
      setCopiedReader(true);
      setTimeout(() => setCopiedReader(false), 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && readingDocId) {
        setReadingDocId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readingDocId]);

  // Filter links
  const filteredLinks = useMemo(() => {
    return OFFICIAL_LINKS.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.officialEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lawRef.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 space-y-5">
      {/* 1. TOP BREADCRUMB & REGULATORY BANNER (Identical to Planalto styling) */}
      <div className="bg-[#eef2f6] border border-blue-200/90 rounded-lg px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px] truncate">
          <span className="text-slate-400 font-sans font-bold">VOCÊ ESTÁ AQUI:</span>
          <span className="hover:text-blue-900 cursor-pointer">PÁGINA INICIAL</span>
          <span className="text-slate-300">›</span>
          <span className="text-blue-950 font-bold">LEGISLAÇÃO OFICIAL</span>
          <span className="text-slate-300">›</span>
          <span className="text-slate-700">PORTAL DE ACESSO DIRETO</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Leis 100% Integradas no Sistema
          </span>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR + CENTER PORTAL CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT SIDEBAR: MENU — LEGISLAÇÃO OFICIAL */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Quick Menu Card with exact items requested */}
          <div className="bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-[#0f2444] text-white px-4 py-3 flex items-center gap-2 border-b border-[#1b3d6f]">
              <Landmark className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider">
                📑 MENU — LEGISLAÇÃO OFICIAL
              </h3>
            </div>
            <nav className="p-2 space-y-1 text-xs">
              {/* Todos */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  🏛️ Todos os Portais e Leis
                </span>
                <span className="font-mono text-[10px] opacity-75">{OFFICIAL_LINKS.length}</span>
              </button>

              {/* 1. CLT e Legislação Trabalhista */}
              <button
                onClick={() => setSelectedCategory('trabalhista')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'trabalhista'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">⚖️ CLT & Trabalhista</span>
                </span>
                <span className="font-mono text-[10px] opacity-75">Planalto</span>
              </button>

              {/* 2. Simples Nacional */}
              <button
                onClick={() => setSelectedCategory('simples')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'simples'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Calculator className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">🧾 Simples Nacional</span>
                </span>
                <span className="font-mono text-[10px] opacity-75">CGSN</span>
              </button>

              {/* 3. eSocial & FGTS Digital */}
              <button
                onClick={() => setSelectedCategory('esocial')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'esocial'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">📋 eSocial & FGTS</span>
                </span>
                <span className="font-mono text-[10px] opacity-75">Gov.br</span>
              </button>

              {/* 4. Normas Contábeis (CFC) */}
              <button
                onClick={() => setSelectedCategory('contabil')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'contabil'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <BookOpen className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span className="truncate">📊 Normas Contábeis</span>
                </span>
                <span className="font-mono text-[10px] opacity-75">CFC</span>
              </button>

              {/* 5. Reforma Tributária */}
              <button
                onClick={() => setSelectedCategory('reforma')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'reforma'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">⚖️ Reforma Tributária</span>
                </span>
                <span className="font-mono text-[10px] opacity-75">Congresso</span>
              </button>

              {/* 6. ICMS, IPI, ISS & Tributos */}
              <button
                onClick={() => setSelectedCategory('tributos')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'tributos'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Building2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">💰 ICMS, IPI, ISS</span>
                </span>
                <span className="font-mono text-[10px] opacity-75">RFB/SEFAZ</span>
              </button>

              {/* 7. Legislação Societária & Jurídica */}
              <button
                onClick={() => setSelectedCategory('societario')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'societario'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Scale className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span className="truncate">📜 Direito Societário & DREI</span>
                </span>
                <span className="font-mono text-[10px] opacity-75">CC</span>
              </button>

              {/* 8. Presidência & DOU */}
              <button
                onClick={() => setSelectedCategory('institucional')}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'institucional'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Landmark className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                  <span className="truncate">🏛️ Presidência & DOU</span>
                </span>
                <span className="font-mono text-[10px] opacity-75">União</span>
              </button>
            </nav>
          </div>

          {/* Direct Integration with Murade Agente IA */}
          <div className="bg-[#f0f4f9] border border-blue-200/90 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-blue-950 font-bold text-xs">
              <Bot className="w-4 h-4 text-blue-700" />
              <span>Consultor Especialista IA</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Tem dúvidas na interpretação de um artigo ou prazo? O Murade Agente IA responde estritamente com base nos arquivos oficiais sem inventar dados.
            </p>
            <button
              onClick={onOpenChat}
              className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Abrir Consultor Técnico</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Simulators & Calendar Shortcuts */}
          <div className="bg-white border border-slate-300 rounded-xl p-3.5 space-y-2 shadow-2xs text-xs">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-700" />
              Ferramentas de Apoio
            </h4>
            <div className="space-y-1.5 pt-1">
              <button
                onClick={onOpenSimulators}
                className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 transition-colors flex items-center justify-between text-[11px] font-semibold text-slate-700 hover:text-blue-950 cursor-pointer"
              >
                <span>🧮 Simulador Fator R & Rescisão</span>
                <span className="text-blue-600">→</span>
              </button>
              <button
                onClick={onOpenCalendar}
                className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 transition-colors flex items-center justify-between text-[11px] font-semibold text-slate-700 hover:text-blue-950 cursor-pointer"
              >
                <span>📅 Calendário Fiscal & eSocial</span>
                <span className="text-blue-600">→</span>
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER MAIN SECTION: IMPOSING HERO BANNER + SEARCH + LEGISLATION CARDS */}
        <main className="lg:col-span-9 space-y-5">
          {/* 1. IMPOSING ARCHITECTURAL HERO BANNER (Palácio do Planalto & Congresso Nacional) */}
          <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-300 group">
            {/* Architectural Photo of Planalto */}
            <div className="h-48 sm:h-60 w-full relative">
              <img
                src="/src/assets/images/planalto_banner_1792361999160.jpg"
                alt="Palácio do Planalto e Congresso Nacional - Legislação Oficial"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0f2444]/75 to-transparent"></div>
            </div>

            {/* Imposing Overlay Content */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-blue-500/80 text-white tracking-widest border border-blue-300/40">
                  Repositório Federal Unificado
                </span>
                <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                  Presidência da República · Receita Federal · Tribunais
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Portal da Legislação Oficial
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed drop-shadow-2xs">
                Acesso direto aos portais e bases normativas da República Federativa do Brasil: CLT Trabalhista, Simples Nacional, eSocial, CFC, ICMS e Reforma Tributária.
              </p>
            </div>
          </div>

          {/* 2. FAST SEARCH & STATS BAR */}
          <div className="bg-[#f8fafc] border border-blue-200/90 rounded-xl p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar norma (ex: CLT, Simples, eSocial, DIFAL, Reforma, CFC, SEFAZ)..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2444] transition-all shadow-2xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                Exibindo <strong>{filteredLinks.length}</strong> fontes oficiais
              </span>
            </div>
          </div>

          {/* 3. LEGISLATION PORTAL CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white border border-slate-300 hover:border-blue-500 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent top stripe */}
                <div className={`h-1 w-full absolute top-0 inset-x-0 ${
                  link.category === 'trabalhista'
                    ? 'bg-amber-500'
                    : link.category === 'fiscal'
                    ? 'bg-blue-600'
                    : link.category === 'reforma'
                    ? 'bg-purple-600'
                    : link.category === 'contabil'
                    ? 'bg-emerald-600'
                    : 'bg-slate-700'
                }`} />

                <div>
                  {/* Card Header: Entity & Law Ref */}
                  <div className="flex items-start justify-between gap-2 mb-2 pt-1">
                    <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 tracking-wider">
                      {link.officialEntity}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {link.lawRef}
                    </span>
                  </div>

                  {/* Title & Short URL */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-950 transition-colors leading-snug mb-1">
                    {link.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {link.description}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {/* Direct Official Link */}
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 group-hover:underline truncate cursor-pointer"
                      title={`Abrir portal oficial: ${link.url}`}
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{link.shortUrl}</span>
                      <ExternalLink className="w-3 h-3 text-blue-600 shrink-0" />
                    </a>

                    {link.docId && (
                      <button
                        onClick={() => onOpenDoc(link.docId!)}
                        className="text-[11px] font-semibold text-slate-600 hover:text-blue-950 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                        title="Ver manual explicativo na Base de Conhecimento"
                      >
                        Ver na Base
                      </button>
                    )}
                  </div>

                  {/* Direct AI Agent Consultation Button */}
                  <button
                    onClick={() => onAskAgent(link.agentPrompt)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[#f0f4f9] hover:bg-blue-100/80 border border-blue-200/80 text-[11px] font-semibold text-blue-950 flex items-center justify-between transition-colors cursor-pointer group/btn"
                    title="Consultar parecer técnico com o Murade Agente IA"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Bot className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span className="truncate">{link.agentPrompt}</span>
                    </span>
                    <span className="text-blue-700 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                      →
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. INSTITUTIONAL FOOTER (Simulated after Planalto portal) */}
          <div className="bg-[#0f2444] text-white rounded-xl p-5 space-y-4 shadow-sm border border-[#1b3d6f]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3d6f]">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-300" />
                <span className="font-bold text-sm tracking-tight">
                  Portais Oficiais dos Poderes da União & Órgãos Fiscais
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-mono">
                República Federativa do Brasil
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="font-bold text-blue-200 uppercase tracking-wider text-[10px] mb-1.5">
                  Poder Executivo
                </p>
                <ul className="space-y-1 text-slate-300">
                  <li><a href="https://www.planalto.gov.br" target="_blank" rel="noreferrer" className="hover:text-white">Palácio do Planalto</a></li>
                  <li><a href="https://www.receita.fazenda.gov.br" target="_blank" rel="noreferrer" className="hover:text-white">Receita Federal</a></li>
                  <li><a href="https://www.gov.br/trabalho-e-emprego" target="_blank" rel="noreferrer" className="hover:text-white">Ministério do Trabalho</a></li>
                  <li><a href="https://www.in.gov.br" target="_blank" rel="noreferrer" className="hover:text-white">Imprensa Nacional (DOU)</a></li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-blue-200 uppercase tracking-wider text-[10px] mb-1.5">
                  Poder Legislativo
                </p>
                <ul className="space-y-1 text-slate-300">
                  <li><a href="https://www.camara.leg.br" target="_blank" rel="noreferrer" className="hover:text-white">Câmara dos Deputados</a></li>
                  <li><a href="https://www.senado.leg.br" target="_blank" rel="noreferrer" className="hover:text-white">Senado Federal</a></li>
                  <li><a href="https://www.camara.leg.br/reformatributaria" target="_blank" rel="noreferrer" className="hover:text-white">Reforma Tributária</a></li>
                  <li><a href="https://www.tcu.gov.br" target="_blank" rel="noreferrer" className="hover:text-white">Tribunal de Contas (TCU)</a></li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-blue-200 uppercase tracking-wider text-[10px] mb-1.5">
                  Poder Judiciário
                </p>
                <ul className="space-y-1 text-slate-300">
                  <li><a href="https://portal.stf.jus.br" target="_blank" rel="noreferrer" className="hover:text-white">Supremo Tribunal Federal</a></li>
                  <li><a href="https://www.stj.jus.br" target="_blank" rel="noreferrer" className="hover:text-white">Superior Tribunal de Justiça</a></li>
                  <li><a href="https://www.tst.jus.br" target="_blank" rel="noreferrer" className="hover:text-white">Tribunal Superior do Trabalho</a></li>
                  <li><a href="http://carf.fazenda.gov.br" target="_blank" rel="noreferrer" className="hover:text-white">Conselho CARF</a></li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-blue-200 uppercase tracking-wider text-[10px] mb-1.5">
                  Normas & Classes
                </p>
                <ul className="space-y-1 text-slate-300">
                  <li><a href="https://www.cfc.org.br" target="_blank" rel="noreferrer" className="hover:text-white">Conselho Federal (CFC)</a></li>
                  <li><a href="http://www.cpc.org.br" target="_blank" rel="noreferrer" className="hover:text-white">Pronunciamentos (CPC)</a></li>
                  <li><a href="https://www.esocial.gov.br" target="_blank" rel="noreferrer" className="hover:text-white">eSocial / DCTFWeb</a></li>
                  <li><a href="http://nfe.sefaz.go.gov.br" target="_blank" rel="noreferrer" className="hover:text-white">SEFAZ Goiás (NFe)</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1b3d6f] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Informações de caráter público e governamental. As consultas com a inteligência artificial não substituem parecer de contador ou advogado habilitado.
              </span>
              <span className="font-mono text-slate-400 shrink-0">
                Murade Agente IA · Sistema Fiscal & Contábil
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
