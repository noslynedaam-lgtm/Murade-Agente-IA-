/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from './components/Header.tsx';
import { DisclaimerBanner } from './components/DisclaimerBanner.tsx';
import { ChatConsultant } from './components/ChatConsultant.tsx';
import { KnowledgeBaseExplorer } from './components/KnowledgeBaseExplorer.tsx';
import { SimulatorsHub } from './components/SimulatorsHub.tsx';
import { FiscalCalendar } from './components/FiscalCalendar.tsx';
import { LegalDisclaimerView } from './components/LegalDisclaimerView.tsx';
import { OfficialLegislationPortal } from './components/OfficialLegislationPortal.tsx';

type TabType = 'legislacao' | 'chat' | 'knowledge' | 'simulators' | 'calendar' | 'legal';

const TABS: TabType[] = ['legislacao', 'chat', 'knowledge', 'simulators', 'calendar', 'legal'];

const TAB_LABELS: Record<TabType, string> = {
  legislacao: 'Legislação Oficial',
  chat: 'Consultor IA',
  knowledge: 'Base de Conhecimento',
  simulators: 'Simuladores Fiscais & CLT',
  calendar: 'Calendário & Prazos eSocial',
  legal: 'Termo de Aviso Legal',
};

interface HistoryItem {
  tab: TabType;
  docId?: string;
  query?: string;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('legislacao');
  const [selectedDocId, setSelectedDocId] = useState<string>('simples-nacional');
  const [pendingQuery, setPendingQuery] = useState<string>('');

  // History stack
  const [history, setHistory] = useState<HistoryItem[]>([
    { tab: 'legislacao', query: '' },
  ]);
  const [pointer, setPointer] = useState<number>(0);

  // Navigate to a new target
  const navigateTo = useCallback((tab: TabType, docId?: string, query?: string) => {
    setCurrentTab(tab);
    if (docId) setSelectedDocId(docId);
    if (query !== undefined) setPendingQuery(query);

    setHistory((prev) => {
      const next = prev.slice(0, pointer + 1);
      next.push({ tab, docId, query });
      return next;
    });
    setPointer((prev) => prev + 1);
  }, [pointer]);

  // Back action: always works!
  const handleBack = useCallback(() => {
    if (pointer > 0) {
      const target = history[pointer - 1];
      setPointer((prev) => prev - 1);
      setCurrentTab(target.tab);
      if (target.docId) setSelectedDocId(target.docId);
      if (target.query !== undefined) setPendingQuery(target.query);
    } else {
      // If at start of history, cycle to previous tab
      const currentIdx = TABS.indexOf(currentTab);
      const prevIdx = (currentIdx - 1 + TABS.length) % TABS.length;
      const prevTab = TABS[prevIdx];
      setCurrentTab(prevTab);
    }
  }, [pointer, history, currentTab]);

  // Forward action: always works!
  const handleForward = useCallback(() => {
    if (pointer < history.length - 1) {
      const target = history[pointer + 1];
      setPointer((prev) => prev + 1);
      setCurrentTab(target.tab);
      if (target.docId) setSelectedDocId(target.docId);
      if (target.query !== undefined) setPendingQuery(target.query);
    } else {
      // Advance to next tab
      const currentIdx = TABS.indexOf(currentTab);
      const nextIdx = (currentIdx + 1) % TABS.length;
      const nextTab = TABS[nextIdx];
      setCurrentTab(nextTab);
    }
  }, [pointer, history, currentTab]);

  // Keyboard shortcut listener: Alt + ArrowLeft / Alt + ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      } else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleForward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack, handleForward]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Regulatory Disclaimer Banner */}
      <DisclaimerBanner onOpenLegal={() => navigateTo('legal')} />

      {/* Top Bar (Clean without arrows) */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => navigateTo(tab, selectedDocId)}
        onNewConsultation={() => navigateTo('chat', undefined, '')}
      />


      {/* SUB-BARRA DE NAVEGAÇÃO PADRONIZADA (AZUL COM INTERIOR CINZA CLARO, NUNCA BRANCA) */}
      <div className="bg-[#eef2f6] border-b border-blue-200/90 px-4 sm:px-6 py-1.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          {/* Lado Esquerdo: Setazinha preta/azul escura quadradinha para voltar */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all font-semibold text-[11px] shadow-xs cursor-pointer border border-slate-700"
            title="Voltar um pouquinho"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
            <span>Voltar</span>
          </button>

          {/* Centro: Indicador de onde você está com moldura padronizada */}
          <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate bg-white/80 px-3 py-0.5 rounded-full border border-blue-100 shadow-2xs">
            <span className="text-slate-400 text-[11px]">Você está em:</span>
            <span className="text-blue-950 font-bold truncate">
              {TAB_LABELS[currentTab]}
            </span>
            {currentTab === 'knowledge' && (
              <>
                <span className="text-slate-300">/</span>
                <span className="font-mono text-blue-900 text-[11px] truncate font-semibold">{selectedDocId}.md</span>
              </>
            )}
          </div>

          {/* Lado Direito: Setazinha preta/azul escura para avançar */}
          <button
            onClick={handleForward}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all font-semibold text-[11px] shadow-xs cursor-pointer"
            title="Avançar para o próximo item"
          >
            <span>Avançar</span>
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col relative px-2 sm:px-0">
        {currentTab === 'legislacao' && (
          <OfficialLegislationPortal
            onOpenDoc={(docId) => navigateTo('knowledge', docId)}
            onAskAgent={(query) => navigateTo('chat', undefined, query)}
            onOpenChat={() => navigateTo('chat')}
            onOpenSimulators={() => navigateTo('simulators')}
            onOpenCalendar={() => navigateTo('calendar')}
          />
        )}

        {currentTab === 'chat' && (
          <ChatConsultant
            onOpenDoc={(docId) => navigateTo('knowledge', docId)}
            onOpenSimulators={() => navigateTo('simulators')}
            initialQuery={pendingQuery}
          />
        )}

        {currentTab === 'knowledge' && (
          <KnowledgeBaseExplorer
            selectedDocId={selectedDocId}
            onSelectDoc={(id) => navigateTo('knowledge', id)}
            onAskAboutDoc={(query) => navigateTo('chat', undefined, query)}
          />
        )}

        {currentTab === 'simulators' && (
          <SimulatorsHub onAskAgent={(query) => navigateTo('chat', undefined, query)} />
        )}

        {currentTab === 'calendar' && (
          <FiscalCalendar onAskAgent={(query) => navigateTo('chat', undefined, query)} />
        )}

        {currentTab === 'legal' && (
          <LegalDisclaimerView onBackToChat={handleBack} />
        )}
      </main>

      {/* Standard Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Murade Agente IA</span>
            <span aria-hidden="true">·</span>
            <span>Inteligência Consultiva Fiscal, DP & Contábil</span>
            <span aria-hidden="true">·</span>
            <span>Brasil</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="italic text-slate-700">
              "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."
            </span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigateTo('legal')}
              className="text-blue-700 hover:text-blue-900 underline underline-offset-2 cursor-pointer font-medium"
            >
              Termos & CRC
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
