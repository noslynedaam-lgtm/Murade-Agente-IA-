import React, { useEffect, useState } from 'react';

// SÓ o dono do sistema vê este painel (o servidor também confere): adicionais pagos por escritório
// — Consultor Murade completo e Escola Murade — e o consumo do mês para cobrança.
type Produto = 'consultor' | 'escola';
type Consumo = { perguntas: number; ia: number; prontas: number; cache: number; bloqueadas: number; usos: number; tokensEntrada: number; tokensSaida: number; tokensTotal: number };
type Linha = {
  escritorio: string;
  nome?: string;
  plano?: string;
  observacao?: string;
  produtos: Record<Produto, { liberado: boolean; origem: 'tabela' | 'padrao' | 'nenhuma'; liberadoPor?: string; quando?: string }>;
  consumo: Record<Produto, Consumo>;
};

const NOMES: Record<Produto, string> = { consultor: 'Consultor completo', escola: 'Escola Murade' };
const fmtCnpj = (c: string) => (/^[0-9A-Z]{14}$/.test(c) ? `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}` : c === 'sem-escritorio' ? 'Sem CNPJ informado' : c);
const mesHoje = () => new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).slice(0, 7);
const n = (v: number) => v.toLocaleString('pt-BR');

export function PainelConsultor() {
  const [mes, setMes] = useState(mesHoje());
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [novo, setNovo] = useState({ cnpj: '', nome: '', plano: '', consultor: true, escola: false });

  const carregar = async () => {
    setCarregando(true);
    try {
      const r = await fetch(`/api/consultor/dono/escritorios?mes=${encodeURIComponent(mes)}`, { credentials: 'include', cache: 'no-store' });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.sucesso !== true) throw new Error(d.motivo || 'Não consegui carregar.');
      setLinhas(d.escritorios);
      setMsg('');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Falha.');
    } finally {
      setCarregando(false);
    }
  };
  useEffect(() => { void carregar(); }, [mes]);

  const salvar = async (corpo: Record<string, unknown>) => {
    const r = await fetch('/api/consultor/dono/liberacao', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || d.sucesso !== true) throw new Error(d.motivo || 'Não foi possível salvar.');
  };

  const alternar = async (l: Linha, produto: Produto) => {
    setMsg(''); setOk('');
    const ligar = !l.produtos[produto].liberado;
    const nome = `${l.nome ? `${l.nome} — ` : ''}${fmtCnpj(l.escritorio)}`;
    if (ligar) {
      if (!window.confirm(`Liberar "${NOMES[produto]}" para ${nome}?`)) return;
    } else {
      if (!window.confirm(`DESLIGAR "${NOMES[produto]}" de ${nome}? O escritório perde o adicional na hora.`)) return;
      const fim = l.escritorio.slice(-4);
      if (window.prompt(`Segunda confirmação: digite os 4 últimos caracteres do CNPJ (${fim}) para desligar.`)?.trim().toUpperCase() !== fim) { setMsg('Desligamento cancelado: a confirmação não confere.'); return; }
    }
    try {
      await salvar({ escritorio: l.escritorio, produto, liberado: ligar, confirmar: !ligar ? true : undefined });
      setOk(`${NOMES[produto]} ${ligar ? 'liberado' : 'desligado'} para ${nome}.`);
      await carregar();
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Falha.'); }
  };

  const liberarNovo = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setOk('');
    const produtos = (['consultor', 'escola'] as Produto[]).filter((p) => novo[p]);
    if (!produtos.length) { setMsg('Marque pelo menos um adicional.'); return; }
    try {
      for (const produto of produtos) await salvar({ escritorio: novo.cnpj, produto, liberado: true, nome: novo.nome, plano: novo.plano });
      setOk(`Liberado: ${produtos.map((p) => NOMES[p]).join(' e ')}.`);
      setNovo({ cnpj: '', nome: '', plano: '', consultor: true, escola: false });
      await carregar();
    } catch (c) { setMsg(c instanceof Error ? c.message : 'Falha.'); }
  };

  const total = (campo: keyof Consumo, produto: Produto) => linhas.reduce((s, l) => s + (l.consumo[produto]?.[campo] ?? 0), 0);
  const campo = 'min-w-0 rounded-lg border border-slate-300 p-2 text-sm text-slate-900';

  return (
    <div className="mb-5 rounded-xl border-2 border-blue-300 bg-blue-50 p-3 sm:p-4">
      <h3 className="mb-1 font-semibold">Adicionais pagos: Consultor e Escola Murade</h3>
      <p className="mb-2 text-xs text-slate-700">Só você vê esta tela. Libere ou desligue cada adicional por escritório (CNPJ) e veja o consumo do mês para cobrar. Escritório sem o Consultor completo recebe só as respostas prontas (sem custo).</p>

      <form onSubmit={liberarNovo} className="mb-3 grid gap-2 sm:grid-cols-2">
        <input required value={novo.cnpj} onChange={(e) => setNovo({ ...novo, cnpj: e.target.value })} placeholder="CNPJ do escritório" inputMode="text" className={campo} />
        <input value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Nome do escritório (opcional)" className={campo} />
        <input value={novo.plano} onChange={(e) => setNovo({ ...novo, plano: e.target.value })} placeholder="Plano / observação (opcional)" className={campo} />
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-1"><input type="checkbox" checked={novo.consultor} onChange={(e) => setNovo({ ...novo, consultor: e.target.checked })} /> Consultor</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={novo.escola} onChange={(e) => setNovo({ ...novo, escola: e.target.checked })} /> Escola</label>
          <button className="rounded-lg bg-slate-800 px-3 py-2 text-white">Liberar</button>
        </div>
      </form>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <label className="flex items-center gap-1">Mês: <input type="month" value={mes} onChange={(e) => e.target.value && setMes(e.target.value)} className={campo} /></label>
        <a href={`/api/consultor/dono/consumo.csv?mes=${encodeURIComponent(mes)}`} className="rounded-lg bg-green-800 px-3 py-2 text-white">Exportar CSV</a>
        {carregando && <span className="text-slate-500">Carregando…</span>}
      </div>
      {msg && <p role="alert" className="mb-2 text-sm text-red-700">{msg}</p>}
      {ok && <p className="mb-2 text-sm text-green-800">{ok}</p>}

      <div className="mb-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div className="rounded bg-white p-2"><div className="text-slate-500">Perguntas</div><strong>{n(total('perguntas', 'consultor'))}</strong></div>
        <div className="rounded bg-white p-2"><div className="text-slate-500">Com IA (custo)</div><strong>{n(total('ia', 'consultor'))}</strong></div>
        <div className="rounded bg-white p-2"><div className="text-slate-500">Sem custo (prontas + cache)</div><strong>{n(total('prontas', 'consultor') + total('cache', 'consultor'))}</strong></div>
        <div className="rounded bg-white p-2"><div className="text-slate-500">Usos da Escola</div><strong>{n(total('usos', 'escola'))}</strong></div>
      </div>

      {linhas.length === 0 && !carregando && <p className="text-sm text-slate-600">Nenhum escritório liberado ou com consumo neste mês.</p>}
      {linhas.map((l) => (
        <div key={l.escritorio} className="border-t border-blue-200 py-2 text-sm">
          <div className="font-semibold">{l.nome || 'Escritório'} <span className="font-normal text-slate-600">· {fmtCnpj(l.escritorio)}</span>{l.plano && <span className="font-normal text-slate-500"> · {l.plano}</span>}</div>
          {l.escritorio !== 'sem-escritorio' && (
            <div className="mt-1 flex flex-wrap gap-2">
              {(['consultor', 'escola'] as Produto[]).map((p) => (
                <button key={p} type="button" onClick={() => void alternar(l, p)} className={`rounded-full px-3 py-1 text-xs font-semibold ${l.produtos[p].liberado ? 'bg-green-700 text-white' : 'bg-slate-200 text-slate-700'}`} title={l.produtos[p].origem === 'padrao' ? 'Liberado pela lista padrão do servidor' : l.produtos[p].liberadoPor ? `Por ${l.produtos[p].liberadoPor}` : ''}>
                  {NOMES[p]}: {l.produtos[p].liberado ? 'LIBERADO' : 'desligado'}{l.produtos[p].origem === 'padrao' ? ' (padrão)' : ''}
                </button>
              ))}
            </div>
          )}
          <div className="mt-1 text-xs text-slate-600">
            Consultor: {n(l.consumo.consultor.perguntas)} pergunta(s) · {n(l.consumo.consultor.ia)} com IA · {n(l.consumo.consultor.prontas)} prontas · {n(l.consumo.consultor.cache)} cache · {n(l.consumo.consultor.bloqueadas)} sem liberação{l.consumo.consultor.tokensTotal ? ` · ${n(l.consumo.consultor.tokensTotal)} tokens` : ''}
            {' '}| Escola: {n(l.consumo.escola.usos)} uso(s)
          </div>
        </div>
      ))}
    </div>
  );
}
