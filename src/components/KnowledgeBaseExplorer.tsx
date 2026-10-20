import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  Search,
  Copy,
  Check,
  Download,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  Scale,
  Calendar,
  ExternalLink,
  Globe
} from 'lucide-react';
import { KNOWLEDGE_BASE_DOCS, KnowledgeDoc } from '../data/knowledgeDocs.ts';

interface KnowledgeBaseExplorerProps {
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
  onAskAboutDoc: (promptText: string) => void;
}

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({
  selectedDocId,
  onSelectDoc,
  onAskAboutDoc,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Folder open/closed states
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    fiscal: true,
    'dp-trabalhista': true,
    'dp-trabalhista/convenções-coletivas': true,
    contabil: true,
  });

  const toggleFolder = (folderKey: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  // Filter docs
  const filteredDocs = useMemo(() => {
    return KNOWLEDGE_BASE_DOCS.filter((doc) => {
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.filePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const activeDoc = useMemo(() => {
    return KNOWLEDGE_BASE_DOCS.find((d) => d.id === selectedDocId) || KNOWLEDGE_BASE_DOCS[0];
  }, [selectedDocId]);

  const handleCopyMarkdown = () => {
    if (activeDoc) {
      navigator.clipboard.writeText(activeDoc.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    if (activeDoc) {
      const blob = new Blob([activeDoc.content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeDoc.filePath.split('/').pop() || 'documento.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Base de Conhecimento Murade IA
          </h2>
          <p className="text-sm text-slate-500">
            Repositório oficial com manuais práticos e diretrizes das rotinas Fiscais, Trabalhistas e Contábeis brasileiras.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por termo, lei, anexo ou tag..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-[#102a4e] text-white shadow-xs'
              : 'bg-[#f8fafc] text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Todos os Documentos ({KNOWLEDGE_BASE_DOCS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('fiscal')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            selectedCategory === 'fiscal'
              ? 'bg-[#102a4e] text-white shadow-xs'
              : 'bg-[#f8fafc] text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Fiscal & Tributário (4)
        </button>
        <button
          onClick={() => setSelectedCategory('dp-trabalhista')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            selectedCategory === 'dp-trabalhista'
              ? 'bg-[#102a4e] text-white shadow-xs'
              : 'bg-[#f8fafc] text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          DP & Trabalhista (4)
        </button>
        <button
          onClick={() => setSelectedCategory('contabil')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            selectedCategory === 'contabil'
              ? 'bg-[#102a4e] text-white shadow-xs'
              : 'bg-[#f8fafc] text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Contábil & SPED (3)
        </button>
        <button
          onClick={() => setSelectedCategory('fontes-oficiais')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            selectedCategory === 'fontes-oficiais'
              ? 'bg-[#102a4e] text-white shadow-xs'
              : 'bg-[#f8fafc] text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Fontes Oficiais (1)
        </button>
        <button
          onClick={() => setSelectedCategory('aviso-legal')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            selectedCategory === 'aviso-legal'
              ? 'bg-[#102a4e] text-white shadow-xs'
              : 'bg-[#f8fafc] text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Aviso Legal (1)
        </button>
      </div>

      {/* Main Grid: Tree View on Left, Content on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: murade-agente-ia/ Directory Tree */}
        <div className="lg:col-span-4 bg-[#f8fafc] border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
            <span className="text-xs font-bold tracking-tight text-slate-800 uppercase flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-blue-700" />
              murade-agente-ia/
            </span>
            <span className="text-[11px] text-slate-400 font-mono">12 arquivos .md</span>
          </div>

          <div className="space-y-1 text-sm font-sans">
            {/* Fiscal Folder */}
            <div>
              <button
                onClick={() => toggleFolder('fiscal')}
                className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-slate-200/60 rounded text-slate-800 text-xs font-semibold cursor-pointer text-left"
              >
                {openFolders['fiscal'] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
                <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>fiscal/</span>
              </button>

              {openFolders['fiscal'] && (
                <div className="pl-6 space-y-0.5 border-l border-slate-200 ml-3 my-0.5">
                  {KNOWLEDGE_BASE_DOCS.filter((d) => d.category === 'fiscal').map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onSelectDoc(doc.id)}
                      className={`w-full flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors cursor-pointer text-left ${
                        activeDoc.id === doc.id
                          ? 'bg-[#102a4e] text-white font-medium shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{doc.filePath.replace('fiscal/', '')}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DP & Trabalhista Folder */}
            <div>
              <button
                onClick={() => toggleFolder('dp-trabalhista')}
                className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-slate-50 rounded text-slate-800 text-xs font-semibold cursor-pointer text-left"
              >
                {openFolders['dp-trabalhista'] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
                <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>dp-trabalhista/</span>
              </button>

              {openFolders['dp-trabalhista'] && (
                <div className="pl-6 space-y-0.5 border-l border-slate-100 ml-3 my-0.5">
                  {KNOWLEDGE_BASE_DOCS.filter(
                    (d) => d.category === 'dp-trabalhista' && !d.filePath.includes('convenções-coletivas')
                  ).map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onSelectDoc(doc.id)}
                      className={`w-full flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors cursor-pointer text-left ${
                        activeDoc.id === doc.id
                          ? 'bg-[#102a4e] text-white font-medium shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{doc.filePath.replace('dp-trabalhista/', '')}</span>
                      </span>
                    </button>
                  ))}

                  {/* Subfolder: convenções-coletivas/ */}
                  <div className="pt-0.5">
                    <button
                      onClick={() => toggleFolder('dp-trabalhista/convenções-coletivas')}
                      className="w-full flex items-center gap-2 py-1 px-2 hover:bg-slate-200/60 rounded text-slate-700 text-xs font-medium cursor-pointer text-left"
                    >
                      {openFolders['dp-trabalhista/convenções-coletivas'] ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      )}
                      <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>convenções-coletivas/</span>
                    </button>

                    {openFolders['dp-trabalhista/convenções-coletivas'] && (
                      <div className="pl-4 space-y-0.5 border-l border-slate-200 ml-2 my-0.5">
                        {KNOWLEDGE_BASE_DOCS.filter((d) =>
                          d.filePath.includes('convenções-coletivas')
                        ).map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc.id)}
                            className={`w-full flex items-center justify-between py-1 px-2 rounded text-xs transition-colors cursor-pointer text-left ${
                              activeDoc.id === doc.id
                                ? 'bg-[#102a4e] text-white font-medium shadow-xs'
                                : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                              <span className="truncate">cct-act-normas.md</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contábil Folder */}
            <div>
              <button
                onClick={() => toggleFolder('contabil')}
                className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-slate-200/60 rounded text-slate-800 text-xs font-semibold cursor-pointer text-left"
              >
                {openFolders['contabil'] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
                <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>contabil/</span>
              </button>

              {openFolders['contabil'] && (
                <div className="pl-6 space-y-0.5 border-l border-slate-200 ml-3 my-0.5">
                  {KNOWLEDGE_BASE_DOCS.filter((d) => d.category === 'contabil').map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onSelectDoc(doc.id)}
                      className={`w-full flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors cursor-pointer text-left ${
                        activeDoc.id === doc.id
                          ? 'bg-[#102a4e] text-white font-medium shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{doc.filePath.replace('contabil/', '')}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Root: fontes-oficiais.md & aviso-legal.md */}
            <div className="pt-1.5 space-y-0.5 border-t border-slate-200 mt-2">
              {KNOWLEDGE_BASE_DOCS.filter((d) => d.category === 'fontes-oficiais' || d.category === 'aviso-legal').map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors cursor-pointer text-left ${
                    activeDoc.id === doc.id
                      ? 'bg-[#102a4e] text-white font-medium shadow-xs'
                      : doc.category === 'fontes-oficiais'
                      ? 'text-blue-900 hover:bg-blue-50 font-medium'
                      : 'text-amber-800 hover:bg-amber-50 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {doc.category === 'fontes-oficiais' ? (
                      <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    <span className="truncate">{doc.filePath}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Full Document Reader */}
        <div className="lg:col-span-8 bg-[#f8fafc] border border-slate-200 rounded-xl p-6 shadow-xs">
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-blue-900 font-semibold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {activeDoc.filePath}
                </span>
                {activeDoc.officialLink && (
                  <a
                    href={activeDoc.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-white hover:bg-blue-50 border border-blue-200 px-2 py-1 rounded-md transition-colors shadow-2xs"
                    title={`Acessar portal oficial em ${activeDoc.officialLink}`}
                  >
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                    <span>🔗 {activeDoc.officialLinkLabel || 'Portal Oficial'}</span>
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                  title="Copiar markdown"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                  title="Baixar arquivo markdown"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .md</span>
                </button>
                <button
                  onClick={() => onAskAboutDoc(`Poderia detalhar e explicar os conceitos práticos de "${activeDoc.title}" com exemplos de aplicação em empresas brasileiras?`)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Consultar Agente</span>
                </button>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              {activeDoc.title}
            </h1>
            <p className="text-sm text-slate-600 mb-3">{activeDoc.summary}</p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{activeDoc.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>Revisão Oficial Outubro 2026</span>
              <span aria-hidden="true">·</span>
              <div className="flex flex-wrap gap-1">
                {activeDoc.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formatted Markdown Content */}
          <div className="prose prose-slate max-w-none space-y-4 text-sm sm:text-base leading-relaxed">
            {activeDoc.content.split('\n\n').map((block, bIdx) => {
              if (block.startsWith('# ')) {
                return null; // Skip main title already in header
              }
              if (block.startsWith('## ')) {
                return (
                  <h3 key={bIdx} className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1 mt-6">
                    {block.replace('## ', '')}
                  </h3>
                );
              }
              if (block.startsWith('### ')) {
                return (
                  <h4 key={bIdx} className="text-base font-semibold text-slate-800 mt-4">
                    {block.replace('### ', '')}
                  </h4>
                );
              }
              if (block.startsWith('> ')) {
                return (
                  <blockquote
                    key={bIdx}
                    className="p-3 bg-slate-50 border-l-2 border-slate-400 text-slate-700 italic rounded-r text-sm my-3"
                  >
                    {block.replace(/^>\s*/gm, '')}
                  </blockquote>
                );
              }
              if (block.startsWith('|')) {
                // Render table
                const rows = block.split('\n').filter((r) => !r.includes(':---') && !r.includes('---'));
                if (rows.length === 0) return null;
                const headerCols = rows[0].split('|').filter(Boolean);
                const bodyRows = rows.slice(1);

                return (
                  <div key={bIdx} className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          {headerCols.map((col, cIdx) => (
                            <th
                              key={cIdx}
                              className="px-3 py-2 text-left font-semibold text-slate-800 tracking-wider whitespace-nowrap"
                            >
                              {col.trim()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100">
                        {bodyRows.map((row, rIdx) => {
                          const cells = row.split('|').filter(Boolean);
                          return (
                            <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                              {cells.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 text-slate-700 whitespace-pre-wrap">
                                  {cell.trim()}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (block.startsWith('- ') || block.startsWith('* ')) {
                const listItems = block.split('\n');
                return (
                  <ul key={bIdx} className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                    {listItems.map((li, liIdx) => (
                      <li key={liIdx}>{li.replace(/^[-*]\s*/, '')}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={bIdx} className="text-slate-700 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Legal Notice Footer attached to every document */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 bg-amber-50/80 p-3.5 rounded-lg border border-amber-300/80">
            <div className="flex items-start sm:items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
              <span className="font-medium leading-relaxed">
                ⚠️ "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."
              </span>
            </div>
            <button
              onClick={() => onSelectDoc('aviso-legal')}
              className="text-amber-800 font-semibold underline hover:no-underline whitespace-nowrap cursor-pointer shrink-0 self-end sm:self-auto"
            >
              Ver Aviso Legal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
