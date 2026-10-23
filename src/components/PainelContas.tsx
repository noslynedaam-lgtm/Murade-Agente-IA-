import React, { useEffect, useState } from 'react';
import { PainelEquipe } from './PainelEquipe';
import { PainelEscritorios } from './PainelEscritorios';

// Equipe do escritório (responsável) e escritórios clientes (dono do sistema).
async function chamar(url: string, metodo = 'GET', corpo?: object) {
  const r = await fetch(url, { method: metodo, credentials: 'include', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: corpo ? JSON.stringify(corpo) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.sucesso !== true) throw new Error(d.motivo || 'Não foi possível concluir.');
  return d;
}
const Link: React.FC<{ url: string; titulo?: string }> = ({ url, titulo = 'Link (vale 24 horas):' }) => (
  <div className="mt-2 break-all rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-slate-900">
    <strong>{titulo}</strong> <a className="text-blue-800 underline" href={url}>{url}</a>
    <button type="button" className="ml-2 rounded bg-slate-800 px-2 py-0.5 text-white" onClick={() => void navigator.clipboard?.writeText(url)}>Copiar</button>
  </div>
);

type Membro = { login: string; disabled: boolean; created_at?: string };
type ConvitePendente = { login: string; expires_at: string };

export const PainelContas: React.FC<{ ehEscritorio: boolean; donoSistema: boolean; empresas?: Array<{ cnpj: string; nome: string }>; mostrarEmpresas?: boolean; onFechar: () => void }> = ({ ehEscritorio, donoSistema, empresas = [], mostrarEmpresas = false, onFechar }) => {
  const [cnpjConvite, setCnpjConvite] = useState(''); const [loginEmp, setLoginEmp] = useState(''); const [papel, setPapel] = useState('operator'); const [linkEmp, setLinkEmp] = useState('');
  const [equipe, setEquipe] = useState<Membro[]>([]); const [pendentes, setPendentes] = useState<ConvitePendente[]>([]); const [limite, setLimite] = useState<number | null>(null);
  const [escritorios, setEscritorios] = useState<any[]>([]);
  const [loginEq, setLoginEq] = useState(''); const [loginEsc, setLoginEsc] = useState('');
  const [linkEq, setLinkEq] = useState(''); const [linkEsc, setLinkEsc] = useState(''); const [msg, setMsg] = useState('');
  const [linksSenha, setLinksSenha] = useState<Record<string, string>>({});
  const erro = (c: unknown) => setMsg(c instanceof Error ? c.message : 'Falha.');
  const carregar = () => undefined;
  const campo = 'min-w-0 flex-1 rounded-lg border border-slate-300 p-2 text-slate-900';
  const gerarLinkSenha = async (login: string) => {
    setMsg('');
    try {
      const d = await chamar(`/api/auth/team/${encodeURIComponent(login)}/reset-link`, 'POST');
      setLinksSenha((atual) => ({ ...atual, [login]: d.link }));
    } catch (c) { erro(c); }
  };
  return (
    <div className="mx-auto my-4 max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg">
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-black">Usuários e empresas</h2><button onClick={onFechar} className="rounded bg-slate-200 px-3 py-1 text-sm">Fechar</button></div>
      {msg && <p role="alert" className="mb-2 text-sm text-red-700">{msg}</p>}
      {mostrarEmpresas && empresas.length > 0 && (
        <section className="mb-5 rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold">Convidar para uma empresa</h3>
          <p className="mb-2 text-xs text-slate-600">Gere o link, mande pelo WhatsApp e a pessoa cria a própria senha e entra só nas empresas que você liberar.</p>
          <form className="grid gap-2 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); setMsg(''); setLinkEmp(''); try { const d = await chamar('/api/auth/invites', 'POST', { login: loginEmp, cnpj: cnpjConvite || empresas[0].cnpj, papel }); setLinkEmp(d.conviteUrl); setLoginEmp(''); } catch (c) { erro(c); } }}>
            <select value={cnpjConvite || empresas[0].cnpj} onChange={(e) => setCnpjConvite(e.target.value)} className={campo}>{empresas.map((x) => <option key={x.cnpj} value={x.cnpj}>{x.nome}</option>)}</select>
            <select value={papel} onChange={(e) => setPapel(e.target.value)} className={campo}><option value="operator">Operador</option><option value="viewer">Somente consulta</option></select>
            <input required value={loginEmp} onChange={(e) => setLoginEmp(e.target.value)} placeholder="Usuário (e-mail) da pessoa" className={campo} />
            <button className="rounded-lg bg-slate-800 px-3 py-2 text-white">Gerar link de convite</button>
          </form>
          {linkEmp && <Link url={linkEmp} />}
        </section>
      )}
      {donoSistema && <PainelEscritorios />}
      {ehEscritorio && <PainelEquipe />}
    </div>
  );
};
