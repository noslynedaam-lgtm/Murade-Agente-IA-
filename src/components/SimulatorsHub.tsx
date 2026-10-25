import React, { useState } from 'react';
import {
  Percent,
  UserCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  BarChart3,
  Layers,
  Info
} from 'lucide-react';
import { calcularFatorR, calcularRescisaoCLT, RescisaoInput } from '../utils/taxCalculators.ts';

interface SimulatorsHubProps {
  onAskAgent: (query: string) => void;
}

export const SimulatorsHub: React.FC<SimulatorsHubProps> = ({ onAskAgent }) => {
  const [activeTab, setActiveTab] = useState<'fator-r' | 'rescisao' | 'comparador'>('fator-r');

  // --- Fator R State ---
  const [rbt12, setRbt12] = useState<number>(360000);
  const [folha12, setFolha12] = useState<number>(108000);
  const [faturamentoMensal, setFaturamentoMensal] = useState<number>(30000);

  const fatorRResult = calcularFatorR(rbt12, folha12, faturamentoMensal);

  // --- Rescisão State ---
  const [rescisaoInput, setRescisaoInput] = useState<RescisaoInput>({
    salarioBase: 4500,
    dataAdmissao: '2023-03-01',
    dataDesligamento: new Date().toISOString().split('T')[0],
    motivo: 'sem_justa_causa',
    avisoPrevio: 'indenizado',
    temFeriasVencidas: false,
    saldoFgtsEstimado: 8900,
  });

  const rescisaoResult = calcularRescisaoCLT(rescisaoInput);

  // --- Comparador State ---
  const [compFaturamento, setCompFaturamento] = useState<number>(50000);
  const [compTipoAtividade, setCompTipoAtividade] = useState<'servicos' | 'comercio'>('servicos');
  const [compFolha, setCompFolha] = useState<number>(14000);

  // Estimated comparisons:
  const lpImpostosSobreFaturamento = compTipoAtividade === 'servicos' ? 0.1633 : 0.0593;
  const lpTotalMes = (compFaturamento * lpImpostosSobreFaturamento) + (compFolha * 0.28);
  const simplesAliquotaEstimada = compTipoAtividade === 'servicos' ? (compFolha / compFaturamento >= 0.28 ? 0.085 : 0.17) : 0.075;
  const simplesTotalMes = compFaturamento * simplesAliquotaEstimada;

  // Chart max value for comparison
  const maxTaxValue = Math.max(fatorRResult.simulacaoMensal.impostoAnexoV, fatorRResult.simulacaoMensal.impostoAnexoIII, 1);
  const barPercentIII = Math.min(100, (fatorRResult.simulacaoMensal.impostoAnexoIII / maxTaxValue) * 100);
  const barPercentV = Math.min(100, (fatorRResult.simulacaoMensal.impostoAnexoV / maxTaxValue) * 100);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
      {/* Title area with standardized corporate blue badge */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
              Módulo Fiscal & Trabalhista
            </span>
            <span className="text-xs text-slate-500 font-mono">Padrão Oficial 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Simuladores & Gráficos Fiscais
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cálculos auditados conforme a Lei Complementar nº 123/2006, CLT e RIR/2018.
          </p>
        </div>

        {/* Tab Controls: Signature Blue with Light Gray Interior */}
        <div className="flex items-center gap-1.5 p-1 max-w-full overflow-x-auto bg-slate-200/70 border border-slate-300 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('fator-r')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'fator-r'
                ? 'bg-[#102a4e] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Fator R (Simples)</span>
          </button>

          <button
            onClick={() => setActiveTab('rescisao')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'rescisao'
                ? 'bg-[#102a4e] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Rescisão CLT</span>
          </button>

          <button
            onClick={() => setActiveTab('comparador')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'comparador'
                ? 'bg-[#102a4e] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Simples vs Presumido</span>
          </button>
        </div>
      </div>

      {/* Tab 1: FATOR R COM GRÁFICO PADRONIZADO (AZUL COM INTERIOR CINZA CLARO) */}
      {activeTab === 'fator-r' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs Column: Light gray interior */}
          <div className="lg:col-span-5 bg-[#f8fafc] border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Parâmetros dos Últimos 12 Meses
              </span>
              <span className="text-xs font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                LC 123/06 Art. 18
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receita Bruta Acumulada 12 Meses (RBT12):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  value={rbt12}
                  onChange={(e) => setRbt12(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Soma de todas as notas fiscais emitidas nos últimos 12 meses.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Folha de Salários Acumulada 12 Meses:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  value={folha12}
                  onChange={(e) => setFolha12(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Inclui Pró-Labore dos sócios + Salários CLT + 13º + Encargos FGTS/INSS.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faturamento Estimado do Mês Corrente:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  value={faturamentoMensal}
                  onChange={(e) => setFaturamentoMensal(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() =>
                  onAskAgent(
                    `Minha empresa tem RBT12 de R$ ${rbt12.toLocaleString('pt-BR')} e folha acumulada de R$ ${folha12.toLocaleString('pt-BR')}. O Fator R deu ${fatorRResult.fatorRPercent}. Como devo planejar meu pró-labore para manter o enquadramento no Anexo III e otimizar meus impostos?`
                  )
                }
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 transition-colors cursor-pointer shadow-xs"
              >
                <span>Pedir Parecer do Agente Murade</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gráfico Column: O azulzinho com a parte de dentro cinza claro */}
          <div className="lg:col-span-7 space-y-4">
            {/* Card Principal do Gráfico */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Gráfico do Fator R: Posicionamento Normativo
                  </span>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                    fatorRResult.anexo === 'Anexo III'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {fatorRResult.anexo}
                </span>
              </div>

              {/* Indicador Central */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500 block">Razão Atual (Folha ÷ Receita)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-mono tabular-nums text-blue-900">
                      {fatorRResult.fatorRPercent}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      (Meta de Enquadramento: 28,00%)
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-right">
                  <span className="text-[11px] text-slate-500 block">Alíquota Efetiva Estimada</span>
                  <span className="text-lg font-bold font-mono text-blue-800 tabular-nums">
                    {fatorRResult.aliquotaEfetivaAprox.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* O GRÁFICO DE BARRA COM TRILHO CINZA CLARO E PREENCHIMENTO AZULZINHO */}
              <div className="mt-6 p-4 bg-slate-100 border border-slate-200 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span className="font-mono">0%</span>
                  <span className="text-blue-900 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Patamar Crítico: 28,00%
                  </span>
                  <span className="font-mono">50%</span>
                </div>

                {/* Trilho cinza claro com a barra azul */}
                <div className="w-full h-7 bg-slate-200 rounded-lg p-1 relative shadow-inner">
                  {/* Barra azul com gradiente sutil */}
                  <div
                    className={`h-full rounded-md transition-all duration-700 flex items-center justify-end pr-2 text-[11px] font-bold text-white shadow-xs ${
                      fatorRResult.fatorR >= 0.28
                        ? 'bg-blue-600'
                        : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(6, (fatorRResult.fatorR / 0.5) * 100))}%`,
                    }}
                  >
                    <span className="drop-shadow-xs font-mono">{fatorRResult.fatorRPercent}</span>
                  </div>

                  {/* Marcador vertical da linha de 28% */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10 pointer-events-none"
                    style={{ left: `${(0.28 / 0.5) * 100}%` }}
                    title="Linha dos 28%"
                  >
                    <div className="absolute -top-5 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      28%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-slate-200 border border-slate-300 rounded"></span>
                    Interior cinza claro (zona de medição)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded"></span>
                    Azulzinho (folha realizada)
                  </span>
                </div>
              </div>

              {/* Parecer contextualizado */}
              <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950 leading-relaxed">
                {fatorRResult.fatorR >= 0.28 ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Enquadramento Válido no Anexo III:</strong> Sua folha nos últimos 12 meses atingiu{' '}
                      <strong>{fatorRResult.fatorRPercent}</strong> da receita bruta. Suas notas fiscais deste mês recolherão o DAS pela alíquota reduzida (a partir de 6,0%), assegurando economia fiscal substancial.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Enquadramento no Anexo V:</strong> Seu Fator R está abaixo do corte de 28%. A empresa recolherá pela alíquota majorada (a partir de 15,5%). Para atingir o Anexo III no próximo ano com faturamento estável, ajuste a folha mensal para ao menos{' '}
                      <strong>R$ {fatorRResult.sugestaoProLaboreMinimo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* SEGUNDO GRÁFICO: BARRAS COMPARATIVAS ANEXO III vs ANEXO V */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-tight block mb-3">
                Gráfico Comparativo de Carga Tributária Mensal (R$ {faturamentoMensal.toLocaleString('pt-BR')})
              </span>

              {/* Barra Anexo III */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
                      Simulação no Anexo III (Reduzido)
                    </span>
                    <span className="font-mono text-blue-900 font-bold tabular-nums">
                      R$ {fatorRResult.simulacaoMensal.impostoAnexoIII.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {/* Trilho cinza com barra azul */}
                  <div className="w-full h-5 bg-slate-200 rounded-md overflow-hidden p-0.5">
                    <div
                      className="h-full bg-blue-600 rounded transition-all duration-500"
                      style={{ width: `${barPercentIII}%` }}
                    />
                  </div>
                </div>

                {/* Barra Anexo V */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span>
                      Simulação no Anexo V (Padrão)
                    </span>
                    <span className="font-mono text-slate-700 font-bold tabular-nums">
                      R$ {fatorRResult.simulacaoMensal.impostoAnexoV.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {/* Trilho cinza com barra slate */}
                  <div className="w-full h-5 bg-slate-200 rounded-md overflow-hidden p-0.5">
                    <div
                      className="h-full bg-slate-400 rounded transition-all duration-500"
                      style={{ width: `${barPercentV}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Indicador de Economia Anual */}
              <div className="mt-4 p-3 bg-white border border-blue-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Economia Anual Líquida no Anexo III:</span>
                  <span className="text-base font-extrabold font-mono text-blue-900 tabular-nums">
                    R$ {fatorRResult.simulacaoMensal.economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                  Otimização Fiscal
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RESCISÃO CLT */}
      {activeTab === 'rescisao' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs Column: Light gray interior */}
          <div className="lg:col-span-5 bg-[#f8fafc] border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <span className="text-sm font-bold text-slate-800 block pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Contrato & Parâmetros Rescisórios
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salário Base Mensal:</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  value={rescisaoInput.salarioBase}
                  onChange={(e) => setRescisaoInput({ ...rescisaoInput, salarioBase: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Admissão:</label>
                <input
                  type="date"
                  value={rescisaoInput.dataAdmissao}
                  onChange={(e) => setRescisaoInput({ ...rescisaoInput, dataAdmissao: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Desligamento:</label>
                <input
                  type="date"
                  value={rescisaoInput.dataDesligamento}
                  onChange={(e) => setRescisaoInput({ ...rescisaoInput, dataDesligamento: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo do Desligamento:</label>
              <select
                value={rescisaoInput.motivo}
                onChange={(e) => setRescisaoInput({ ...rescisaoInput, motivo: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
              >
                <option value="sem_justa_causa">Demissão Sem Justa Causa (Empregador)</option>
                <option value="pedido_demissao">Pedido de Demissão (Empregado)</option>
                <option value="acordo_484a">Acordo Mútuo (Art. 484-A da CLT)</option>
                <option value="justa_causa">Demissão Por Justa Causa (Falta Grave)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aviso Prévio:</label>
              <select
                value={rescisaoInput.avisoPrevio}
                onChange={(e) => setRescisaoInput({ ...rescisaoInput, avisoPrevio: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
              >
                <option value="indenizado">Indenizado pelo Empregador</option>
                <option value="trabalhado">Trabalhado</option>
                <option value="dispensado">Dispensado / Descontado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Saldo Atual da Conta FGTS:</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  value={rescisaoInput.saldoFgtsEstimado}
                  onChange={(e) => setRescisaoInput({ ...rescisaoInput, saldoFgtsEstimado: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="feriasVencidas"
                checked={rescisaoInput.temFeriasVencidas}
                onChange={(e) => setRescisaoInput({ ...rescisaoInput, temFeriasVencidas: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="feriasVencidas" className="text-xs text-slate-700 font-medium">
                Possui 1 período de férias já vencidas (não usufruídas)
              </label>
            </div>
          </div>

          {/* Results Summary & Gráfico de Composição */}
          <div className="lg:col-span-7 space-y-4">
            {/* Gráfico de Barras Segmentadas das Verbas Rescisórias */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Gráfico de Composição das Verbas Rescisórias
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {rescisaoResult.diasAvisoPrevioLei12506} dias aviso (Lei 12.506/11)
                </span>
              </div>

              {/* Stacked Breakdown Bar */}
              <div className="mt-4 p-3 bg-slate-100 border border-slate-200 rounded-lg">
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex justify-between">
                  <span>Distribuição Percentual dos Proventos</span>
                  <span className="font-mono text-blue-900 font-bold">Total Bruto: R$ {rescisaoResult.totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="w-full h-6 bg-slate-200 rounded-md overflow-hidden flex shadow-inner">
                  {rescisaoResult.totalBruto > 0 && (
                    <>
                      <div
                        style={{ width: `${(rescisaoResult.saldoSalario / rescisaoResult.totalBruto) * 100}%` }}
                        className="bg-blue-800 h-full"
                        title={`Saldo Salário: R$ ${rescisaoResult.saldoSalario.toFixed(2)}`}
                      />
                      <div
                        style={{ width: `${(rescisaoResult.avisoPrevioValor / rescisaoResult.totalBruto) * 100}%` }}
                        className="bg-blue-600 h-full"
                        title={`Aviso Prévio: R$ ${rescisaoResult.avisoPrevioValor.toFixed(2)}`}
                      />
                      <div
                        style={{ width: `${(rescisaoResult.decimoTerceiroProporcional / rescisaoResult.totalBruto) * 100}%` }}
                        className="bg-blue-500 h-full"
                        title={`13º Proporcional: R$ ${rescisaoResult.decimoTerceiroProporcional.toFixed(2)}`}
                      />
                      <div
                        style={{ width: `${((rescisaoResult.feriasProporcionais + rescisaoResult.tercoFeriasProporcionais) / rescisaoResult.totalBruto) * 100}%` }}
                        className="bg-blue-400 h-full"
                        title={`Férias Proporcionais + 1/3: R$ ${(rescisaoResult.feriasProporcionais + rescisaoResult.tercoFeriasProporcionais).toFixed(2)}`}
                      />
                      <div
                        style={{ width: `${(rescisaoResult.multaFgtsValor / rescisaoResult.totalBruto) * 100}%` }}
                        className="bg-blue-300 h-full"
                        title={`Multa FGTS: R$ ${rescisaoResult.multaFgtsValor.toFixed(2)}`}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-600 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-blue-800"></span> Saldo Salário
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-blue-600"></span> Aviso Prévio
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-blue-500"></span> 13º Salário
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-blue-400"></span> Férias + 1/3
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-blue-300"></span> Multa FGTS
                  </span>
                </div>
              </div>

              {/* Tabela de Verbas */}
              <div className="mt-4 divide-y divide-slate-200 text-xs sm:text-sm">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Saldo de Salário ({rescisaoResult.diasTrabalhadosMes} dias):</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    R$ {rescisaoResult.saldoSalario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {rescisaoResult.avisoPrevioValor > 0 && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-600">Aviso Prévio Indenizado ({rescisaoResult.diasAvisoPrevioLei12506} dias):</span>
                    <span className="font-mono font-medium text-slate-900 tabular-nums">
                      R$ {rescisaoResult.avisoPrevioValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">13º Salário Proporcional:</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    R$ {rescisaoResult.decimoTerceiroProporcional.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Férias Proporcionais + 1/3:</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    R$ {(rescisaoResult.feriasProporcionais + rescisaoResult.tercoFeriasProporcionais).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {rescisaoResult.multaFgtsValor > 0 && (
                  <div className="flex justify-between py-1.5 bg-blue-50/80 px-2 rounded">
                    <span className="text-blue-900 font-semibold">Multa Rescisória FGTS:</span>
                    <span className="font-mono font-bold text-blue-900 tabular-nums">
                      R$ {rescisaoResult.multaFgtsValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 text-rose-700">
                  <span>(-) Desconto INSS Provisório:</span>
                  <span className="font-mono tabular-nums">
                    - R$ {rescisaoResult.inssEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between py-2.5 border-t-2 border-slate-900 font-bold text-sm sm:text-base">
                  <span className="text-slate-900">Total Líquido Estimado a Pagar:</span>
                  <span className="font-mono text-blue-900 tabular-nums">
                    R$ {rescisaoResult.totalLiquidoAprox.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Callout do prazo legal com faixa azul */}
              <div className="mt-4 p-3 bg-[#0f2444] text-white rounded-lg flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-medium">{rescisaoResult.prazoPagamentoTexto}</span>
                </div>
                <span className="text-[11px] text-slate-300 hidden sm:inline font-mono">Multa art. 477 § 8º</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: COMPARADOR SIMPLES vs LUCRO PRESUMIDO */}
      {activeTab === 'comparador' && (
        <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Gráficos & Comparativo Tributário (Simples Nacional vs Lucro Presumido)
              </span>
              <p className="text-xs text-slate-500">
                Padrão corporativo GA Studio: azul com interior cinza claro para visualização rápida da carga tributária.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-200 rounded-lg">
              <button
                onClick={() => setCompTipoAtividade('servicos')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                  compTipoAtividade === 'servicos' ? 'bg-[#102a4e] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Serviços
              </button>
              <button
                onClick={() => setCompTipoAtividade('comercio')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                  compTipoAtividade === 'comercio' ? 'bg-[#102a4e] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Comércio
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faturamento Mensal Médio:</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  value={compFaturamento}
                  onChange={(e) => setCompFaturamento(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Folha de Pagamento Mensal (Salários + Pró-Labore):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  value={compFolha}
                  onChange={(e) => setCompFolha(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Comparativo de Barras */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
              Comparação Visual de Carga Anual
            </span>

            {/* Simples Nacional Bar */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="font-semibold text-blue-900">Simples Nacional (DAS Unificado)</span>
                <span className="font-mono font-bold text-blue-900 tabular-nums">
                  R$ {(simplesTotalMes * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ano
                </span>
              </div>
              <div className="w-full h-5 bg-slate-200 rounded-md overflow-hidden p-0.5">
                <div
                  className="h-full bg-blue-600 rounded transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((simplesTotalMes * 12) / Math.max(simplesTotalMes * 12, lpTotalMes * 12)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Lucro Presumido Bar */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="font-semibold text-slate-800">Lucro Presumido (Tributos + CPP Patronal)</span>
                <span className="font-mono font-bold text-slate-800 tabular-nums">
                  R$ {(lpTotalMes * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ano
                </span>
              </div>
              <div className="w-full h-5 bg-slate-200 rounded-md overflow-hidden p-0.5">
                <div
                  className="h-full bg-slate-500 rounded transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((lpTotalMes * 12) / Math.max(simplesTotalMes * 12, lpTotalMes * 12)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
