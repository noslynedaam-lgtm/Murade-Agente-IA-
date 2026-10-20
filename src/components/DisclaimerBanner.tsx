import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface DisclaimerBannerProps {
  onOpenLegal: () => void;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ onOpenLegal }) => {
  return (
    <div className="bg-[#0b192e] border-b border-[#19355e] text-slate-200 px-4 py-2 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold tracking-wider uppercase text-[10px] text-amber-300">
            Aviso Legal:
          </span>
          <span className="text-slate-200 font-medium text-xs">
            "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."
          </span>
        </div>
        <button
          onClick={onOpenLegal}
          className="inline-flex items-center gap-1 text-blue-300 hover:text-white font-medium underline underline-offset-2 hover:no-underline cursor-pointer whitespace-nowrap transition-colors text-[11px]"
        >
          Consultar Termo Técnico CRC/OAB
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
