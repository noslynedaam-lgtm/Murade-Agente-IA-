import React, { useState } from 'react';
import { ShieldAlert, Scale, CheckCircle2, AlertTriangle, Copy, Check, FileText, Globe, ExternalLink } from 'lucide-react';
import { KNOWLEDGE_BASE_DOCS, OFFICIAL_SOURCES } from '../data/knowledgeDocs.ts';

interface LegalDisclaimerViewProps {
  onBackToChat: () => void;
}

export const LegalDisclaimerView: React.FC<LegalDisclaimerViewProps> = ({ onBackToChat }) => {
  const [copied, setCopied] = useState(false);
  const legalDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'aviso-legal') || KNOWLEDGE_BASE_DOCS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(legalDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
      {/* Primary Highlight Card */}
      <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-6 sm:p-8 mb-8 text-amber-950 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">
              Aviso Legal e Diretriz Deontológica
            </span>
            <h1 className="text-lg sm:text-xl font-black text-amber-950 leading-snug">
              ⚠️ "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-amber-900 leading-relaxed font-medium mb-4">
          O Murade Agente IA é um sistema de apoio e orientação consultiva fundamentado exclusivamente nas legislações e manuais da sua base de conhecimento. Suas respostas não configuram parecer contábil vinculante, auditoria formal ou aconselhamento jurídico privativo.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-amber-200">
          <span className="text-xs font-semibold text-amber-800">Órgãos Reguladores e Conformidade:</span>
          <span className="text-xs font-mono bg-white/80 px-2 py-0.5 rounded border border-amber-200 text-amber-900">
            CFC (Conselho Federal de Contabilidade)
          </span>
          <span className="text-xs font-mono bg-white/80 px-2 py-0.5 rounded border border-amber-200 text-amber-900">
            CRC (Conselhos Regionais de Contabilidade)
          </span>
          <span className="text-xs font-mono bg-white/80 px-2 py-0.5 rounded border border-amber-200 text-amber-900">
            OAB (Ordem dos Advogados do Brasil)
          </span>
        </div>
      </div>

      {/* Official Portals Reference Card */}
      <div className="bg-[#f8fafc] border border-blue-200 rounded-xl p-6 shadow-xs mb-8 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-700" />
            📌 Fontes Oficiais Homologadas para Consulta e Legislação
          </h2>
          <span className="text-xs font-mono text-slate-500">7 Portais Oficiais</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OFFICIAL_SOURCES.map((source, sIdx) => (
            <a
              key={sIdx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-lg transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-blue-900">
                  {source.name}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {source.desc}
              </p>
              <span className="text-[10px] font-mono text-blue-700 mt-2 pt-1 border-t border-slate-100 truncate">
                {source.url}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Guidelines Accordion / Checklist */}
      <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 shadow-xs mb-8 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-700" />
          Checklist de Validação Obrigatória Pré-Transmissão
        </h2>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Conferência com a CCT / ACT do Sindicato Específico:</strong>
              <p className="text-xs text-slate-500">
                Pisos salariais, regras de horas extras, adicionais noturnos e estabilidades variam por sindicato municipal e devem ser checados antes de emitir qualquer rescisão ou folha.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Auditoria das Alíquotas de ICMS e Legislações Estaduais:</strong>
              <p className="text-xs text-slate-500">
                O ICMS possui regras estaduais distintas em cada uma das 27 Unidades da Federação. Para DIFAL e Substituição Tributária (ST), verifique sempre o regulamento específico (RICMS) do Estado de destino.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Assinatura por Responsável Técnico (CRC Ativo):</strong>
              <p className="text-xs text-slate-500">
                Demonstrações contábeis (BP, DRE), livros obrigatórios (Diário, Razão) e obrigações do SPED (ECD e ECF) exigem assinatura digital com certificado e-CPF de Contador legalmente habilitado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Markdown Viewer */}
      <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-bold text-slate-900">murade-agente-ia/aviso-legal.md</span>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
          </button>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 whitespace-pre-line leading-relaxed">
          {legalDoc.content}
        </div>
      </div>
    </div>
  );
};
