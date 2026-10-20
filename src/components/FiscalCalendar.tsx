import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, ShieldAlert, ArrowRight, Filter } from 'lucide-react';

interface Obligation {
  id: string;
  name: string;
  category: 'dp' | 'fiscal' | 'contabil';
  dayDue: string;
  frequency: 'Mensal' | 'Anual' | 'Evento Não Periódico';
  description: string;
  targetAudience: string;
  officialPlatform: string;
  lawReference: string;
}

const OBLIGATIONS: Obligation[] = [
  {
    id: 'esocial-fechamento',
    name: 'eSocial - Fechamento de Folha (S-1299)',
    category: 'dp',
    dayDue: 'Dia 15',
    frequency: 'Mensal',
    description: 'Transmissão da remuneração de todos os trabalhadores (S-1200) e fechamento dos eventos periódicos.',
    targetAudience: 'Todos os empregadores com trabalhadores ativos',
    officialPlatform: 'Portal eSocial / WebService',
    lawReference: 'Manual de Orientação do eSocial (MOS)',
  },
  {
    id: 'das-simples',
    name: 'DAS - Documento de Arrecadação do Simples Nacional',
    category: 'fiscal',
    dayDue: 'Dia 20',
    frequency: 'Mensal',
    description: 'Recolhimento unificado dos tributos das empresas optantes pelo Simples Nacional (IRPJ, CSLL, PIS, COFINS, CPP, ICMS, ISS).',
    targetAudience: 'Microempresas e Empresas de Pequeno Porte (ME e EPP)',
    officialPlatform: 'Portal do Simples Nacional (PGDAS-D)',
    lawReference: 'LC 123/2006, art. 21, § 4º',
  },
  {
    id: 'dctfweb-darf',
    name: 'DCTFWeb - DARF Previdenciário Unificado',
    category: 'dp',
    dayDue: 'Dia 20',
    frequency: 'Mensal',
    description: 'Recolhimento das contribuições previdenciárias apuradas via eSocial e retenções fiscais da EFD-Reinf.',
    targetAudience: 'Pessoas jurídicas em geral e empregadores',
    officialPlatform: 'Portal e-CAC / DCTFWeb',
    lawReference: 'IN RFB nº 2.005/2021',
  },
  {
    id: 'fgts-digital',
    name: 'FGTS Digital (Guia Pix)',
    category: 'dp',
    dayDue: 'Dia 20',
    frequency: 'Mensal',
    description: 'Recolhimento compulsório do FGTS mensal gerado a partir do eSocial. Quitação exclusiva via Pix com QR Code.',
    targetAudience: 'Todos os empregadores CLT',
    officialPlatform: 'Portal FGTS Digital (MTE)',
    lawReference: 'Lei nº 14.438/2022 e Portaria MTE nº 240/2024',
  },
  {
    id: 'pis-cofins',
    name: 'PIS / COFINS (DARF Mensal)',
    category: 'fiscal',
    dayDue: 'Dia 25',
    frequency: 'Mensal',
    description: 'Recolhimento mensal das contribuições sobre a receita bruta (0,65% e 3% no Lucro Presumido). Antecipa-se se dia não útil.',
    targetAudience: 'Empresas no Lucro Presumido e Lucro Real',
    officialPlatform: 'SicalcWeb / e-CAC',
    lawReference: 'Lei nº 9.718/1998 e Lei nº 10.833/2003',
  },
  {
    id: 'cat-acidente',
    name: 'CAT - Comunicação de Acidente de Trabalho (S-2210)',
    category: 'dp',
    dayDue: '1º dia útil seguinte',
    frequency: 'Evento Não Periódico',
    description: 'Envio obrigatório no eSocial de qualquer acidente de trabalho ou de trajeto (ou imediatamente em caso de óbito).',
    targetAudience: 'Empregadores com colaboradores que sofreram acidente',
    officialPlatform: 'eSocial Evento S-2210',
    lawReference: 'Lei nº 8.213/1991, art. 22',
  },
  {
    id: 'admissao-s2200',
    name: 'Admissão de Empregado (S-2200 ou S-2190)',
    category: 'dp',
    dayDue: 'Dia anterior ao início',
    frequency: 'Evento Não Periódico',
    description: 'Registro preliminar ou completo do trabalhador antes do início efetivo das atividades laborais.',
    targetAudience: 'Novas contratações CLT',
    officialPlatform: 'eSocial Evento S-2200',
    lawReference: 'Portaria Conjunta MTE/RFB nº 82/2020',
  },
  {
    id: 'rescisao-s2299',
    name: 'Desligamento e Pagamento Rescisório (S-2299)',
    category: 'dp',
    dayDue: 'Até 10 dias corridos',
    frequency: 'Evento Não Periódico',
    description: 'Transmissão do encerramento do contrato de trabalho e quitação de todas as verbas rescisórias.',
    targetAudience: 'Desligamentos sem justa causa, pedidos, acordos ou justa causa',
    officialPlatform: 'eSocial Evento S-2299 e FGTS Digital',
    lawReference: 'Art. 477, § 6º da CLT',
  },
  {
    id: 'defis-anual',
    name: 'DEFIS - Declaração de Informações Socioeconômicas',
    category: 'fiscal',
    dayDue: '31 de Março',
    frequency: 'Anual',
    description: 'Declaração anual obrigatória para empresas do Simples Nacional reportando lucros distribuídos, despesas e sócios.',
    targetAudience: 'Optantes pelo Simples Nacional',
    officialPlatform: 'Portal do Simples Nacional',
    lawReference: 'Resolução CGSN nº 140/2018',
  },
  {
    id: 'ecd-sped',
    name: 'ECD - Escrituração Contábil Digital (SPED Contábil)',
    category: 'contabil',
    dayDue: 'Último dia útil de Maio',
    frequency: 'Anual',
    description: 'Transmissão digital do Livro Diário, Livro Razão e Demonstrações Financeiras assinadas com certificado digital pelo Contador (CRC).',
    targetAudience: 'Empresas no Lucro Real e Lucro Presumido com lucros isentos',
    officialPlatform: 'PVA SPED Contábil (RFB)',
    lawReference: 'IN RFB nº 2.003/2021',
  },
  {
    id: 'ecf-sped',
    name: 'ECF - Escrituração Contábil Fiscal',
    category: 'contabil',
    dayDue: 'Último dia útil de Julho',
    frequency: 'Anual',
    description: 'Interligação da escrituração contábil com a apuração definitiva de IRPJ e CSLL (e-LALUR e e-LACS).',
    targetAudience: 'Pessoas jurídicas em geral (exceto Simples Nacional)',
    officialPlatform: 'PVA SPED ECF (RFB)',
    lawReference: 'IN RFB nº 2.004/2021',
  },
];

interface FiscalCalendarProps {
  onAskAgent: (query: string) => void;
}

export const FiscalCalendar: React.FC<FiscalCalendarProps> = ({ onAskAgent }) => {
  const [filter, setFilter] = useState<'all' | 'dp' | 'fiscal' | 'contabil'>('all');

  const filtered = OBLIGATIONS.filter((o) => filter === 'all' || o.category === filter);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Calendário de Obrigações Fiscais, eSocial e Contábeis
          </h2>
          <p className="text-sm text-slate-500">
            Agenda oficial de vencimentos, prazos improrrogáveis e declarações perante a Receita Federal e MTE.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-[#102a4e] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Todas ({OBLIGATIONS.length})
          </button>
          <button
            onClick={() => setFilter('dp')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
              filter === 'dp' ? 'bg-[#102a4e] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            DP & eSocial
          </button>
          <button
            onClick={() => setFilter('fiscal')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
              filter === 'fiscal' ? 'bg-[#102a4e] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Fiscal & Tributos
          </button>
          <button
            onClick={() => setFilter('contabil')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
              filter === 'contabil' ? 'bg-[#102a4e] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Contábil & SPED
          </button>
        </div>
      </div>

      {/* Grid of Obligations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#102a4e] text-white tabular-nums shadow-xs">
                  {item.dayDue}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {item.frequency}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {item.description}
              </p>

              <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-200 pt-2.5 mb-3">
                <div className="flex items-start gap-1">
                  <span className="font-semibold text-slate-700 shrink-0">Público:</span>
                  <span className="text-slate-600">{item.targetAudience}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="font-semibold text-slate-700 shrink-0">Plataforma:</span>
                  <span className="text-slate-600">{item.officialPlatform}</span>
                </div>
                <div className="flex items-start gap-1 font-mono text-[11px]">
                  <span className="font-semibold text-slate-700 shrink-0">Base Legal:</span>
                  <span className="text-blue-900 font-semibold">{item.lawReference}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskAgent(`Quais são os procedimentos detalhados, multas por atraso e requisitos para cumprimento da obrigação "${item.name}"?`)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-xs font-semibold text-blue-900 transition-colors cursor-pointer shadow-xs"
            >
              <span>Consultar Orientações do Agente</span>
              <ArrowRight className="w-3 h-3 text-blue-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
