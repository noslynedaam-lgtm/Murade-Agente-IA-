import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface HeaderProps {
  currentTab: 'legislacao' | 'chat' | 'knowledge' | 'simulators' | 'calendar' | 'legal';
  onSelectTab: (tab: 'legislacao' | 'chat' | 'knowledge' | 'simulators' | 'calendar' | 'legal') => void;
  onNewConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onNewConsultation,
}) => {
  return (
    <header className="bg-[#0f2444] border-b border-[#1b3d6f] sticky top-0 z-40 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16">
          {/* Zone 1: Single text element wordmark with brand emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('legislacao')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title="Ir para o Portal de Legislação Oficial"
            >
              <img
                src="/src/assets/images/murade_emblem_logo_1792252472842.jpg"
                alt="Murade Emblema"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-400/40 shadow-xs"
              />
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors whitespace-nowrap">
                Murade Agente IA
              </span>
            </button>
          </div>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-sm font-medium text-slate-300">
            <button
              onClick={() => onSelectTab('legislacao')}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'legislacao'
                  ? 'text-white font-semibold border-b-2 border-blue-400'
                  : 'hover:text-white'
              }`}
            >
              <span className="text-amber-400 text-xs">🏛️</span>
              <span>Legislação Oficial</span>
            </button>
            <button
              onClick={() => onSelectTab('chat')}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'chat'
                  ? 'text-white font-semibold border-b-2 border-blue-400'
                  : 'hover:text-white'
              }`}
            >
              Consultor IA
            </button>
            <button
              onClick={() => onSelectTab('knowledge')}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'knowledge'
                  ? 'text-white font-semibold border-b-2 border-blue-400'
                  : 'hover:text-white'
              }`}
            >
              Base de Conhecimento
            </button>
            <button
              onClick={() => onSelectTab('simulators')}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'simulators'
                  ? 'text-white font-semibold border-b-2 border-blue-400'
                  : 'hover:text-white'
              }`}
            >
              Simuladores Fiscais
            </button>
            <button
              onClick={() => onSelectTab('calendar')}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'calendar'
                  ? 'text-white font-semibold border-b-2 border-blue-400'
                  : 'hover:text-white'
              }`}
            >
              Prazos & eSocial
            </button>
            <button
              onClick={() => onSelectTab('legal')}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'legal'
                  ? 'text-white font-semibold border-b-2 border-blue-400'
                  : 'hover:text-white'
              }`}
            >
              Aviso Legal
            </button>
          </nav>

          {/* Zone 3: Exactly 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNewConsultation}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-98 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Nova Consulta</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="md:hidden flex items-center gap-4 py-2 border-t border-[#1b3d6f] overflow-x-auto text-xs font-medium text-slate-300 no-scrollbar">
          <button
            onClick={() => onSelectTab('legislacao')}
            className={`whitespace-nowrap pb-1 ${currentTab === 'legislacao' ? 'text-white font-bold border-b-2 border-blue-400' : ''}`}
          >
            🏛️ Legislação
          </button>
          <button
            onClick={() => onSelectTab('chat')}
            className={`whitespace-nowrap pb-1 ${currentTab === 'chat' ? 'text-white font-bold border-b-2 border-blue-400' : ''}`}
          >
            Consultor
          </button>
          <button
            onClick={() => onSelectTab('knowledge')}
            className={`whitespace-nowrap pb-1 ${currentTab === 'knowledge' ? 'text-white font-bold border-b-2 border-blue-400' : ''}`}
          >
            Base Conhecimento
          </button>
          <button
            onClick={() => onSelectTab('simulators')}
            className={`whitespace-nowrap pb-1 ${currentTab === 'simulators' ? 'text-white font-bold border-b-2 border-blue-400' : ''}`}
          >
            Simuladores
          </button>
          <button
            onClick={() => onSelectTab('calendar')}
            className={`whitespace-nowrap pb-1 ${currentTab === 'calendar' ? 'text-white font-bold border-b-2 border-blue-400' : ''}`}
          >
            Prazos
          </button>
          <button
            onClick={() => onSelectTab('legal')}
            className={`whitespace-nowrap pb-1 ${currentTab === 'legal' ? 'text-white font-bold border-b-2 border-blue-400' : ''}`}
          >
            Aviso Legal
          </button>
        </div>
      </div>
    </header>
  );
};
