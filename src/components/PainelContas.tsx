import React, { useEffect, useState } from 'react';

// Equipe do escritório (responsável) e escritórios clientes (dono do sistema). Mesmo modelo do Fiscal/DP.
async function chamar(url: string, metodo = 'GET', corpo?: object) {
  const r = await fetch(url, { method: metodo, credentials: 'include', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: corpo ? JSON.stringify(corpo) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.sucesso !== true) throw new Error(d.motivo || 'Não foi possível concluir.');
  return d;
}
const Link: React.FC<{ url: string }> = ({ url }) => (
  <div className="mt-2 break-all rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-slate-900">
    <strong>Link (vale 24 horas):</strong> <a className="text-blue-800 underline" href={url}>{url}</a>
    <button type="button" className="ml-2 rounded bg-slate-800 px-2 py-0.5 text-white" onClick={() => void navigator.clipboard?.writeText(url)}>Copiar</button>
  </div>
);

export const PainelContas: React.FC<{ ehEscritorio: boolean; donoSistema: boolean; empresas?: Array<{ cnpj: string; nome: string }>; mostrarEmpresas?: boolean; onFechar: () => void }> = ({ ehEscritorio, donoSistema, empresas = [], mostrarEmpresas = false, onFechar }) => {
  const [cnpjConvite, setCnpjConvite] = useState(''); const [loginEmp, setLoginEmp] = useState(''); const [papel, setPapel] = useState('operator'); const [linkEmp, setLinkEmp] = useState('');
  const [equipe, setEquipe] = useState<string[]>([]); const [limite, setLimite] = useState<number | null>(null);
  const [escritorios, setEscritorios] = useState<any[]>([]);
  const [loginEq, setLoginEq] = useState(''); const [loginEsc, setLoginEsc] = useState('');
  const [linkEq, setLinkEq] = useState(''); const [linkEsc, setLinkEsc] = useState(''); const [msg, setMsg] = useState('');
  const erro = (c: unknown) => setMsg(c instanceof Error ? c.message : 'Falha.');
  const carregar = () => {
    if (ehEscritorio) chamar('/api/auth/team').then((d) => { setEquipe(d.equipe || []); setLimite(d.limite ?? null); }).catch(erro);
    if (donoSistema) chamar('/api/auth/tenants').then((d) => setEscritorios(d.escritorios || [])).catch(erro);
  };
  useEffect(carregar, []);
  const campo = 'min-w-0 flex-1 rounded-lg border border-slate-300 p-2 text-slate-900';
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
      {ehEscritorio && (
        <section className="mb-5 rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold">Equipe do escritório</h3>
          <p className="mb-2 text-xs text-slate-600">Cada pessoa da equipe entra de qualquer computador com o próprio usuário e senha.{limite != null ? ` Limite do plano: ${limite} usuário(s), dono incluso.` : ''}</p>
          <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); setMsg(''); setLinkEq(''); try { const d = await chamar('/api/auth/team/invite', 'POST', { login: loginEq }); setLinkEq(d.conviteUrl); setLoginEq(''); carregar(); } catch (c) { erro(c); } }}>
            <input required value={loginEq} onChange={(e) => setLoginEq(e.target.value)} placeholder="Usuário (e-mail) da pessoa" className={campo} />
            <button className="rounded-lg bg-slate-800 px-3 text-white">Gerar convite</button>
          </form>
          {linkEq && <Link url={linkEq} />}
          {equipe.map((u) => <div key={u} className="flex justify-between border-t py-2 text-sm"><span>{u}</span><button className="text-red-700 hover:underline" onClick={async () => { if (!window.confirm(`Tirar ${u} da equipe? Ele perde o acesso.`)) return; try { await chamar(`/api/auth/team/${encodeURIComponent(u)}`, 'DELETE'); carregar(); } catch (c) { erro(c); } }}>Tirar da equipe</button></div>)}
        </section>
      )}
      {donoSistema && (
        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold">Escritórios clientes</h3>
          <p className="mb-2 text-xs text-slate-600">Você contrata, define o limite de usuários e bloqueia. Você não vê dados dos escritórios.</p>
          <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); setMsg(''); setLinkEsc(''); try { const d = await chamar('/api/auth/tenants/invite', 'POST', { login: loginEsc }); setLinkEsc(d.conviteUrl); setLoginEsc(''); carregar(); } catch (c) { erro(c); } }}>
            <input required value={loginEsc} onChange={(e) => setLoginEsc(e.target.value)} placeholder="Usuário (e-mail) do escritório" className={campo} />
            <button className="rounded-lg bg-slate-800 px-3 text-white">Convidar escritório</button>
          </form>
          {linkEsc && <Link url={linkEsc} />}
          {escritorios.map((o) => (
            <div key={o.login} className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-sm">
              <span>{o.login} · {o.usuarios} usuário(s){o.disabled ? ' · BLOQUEADO' : ''}</span>
              <span className="flex items-center gap-2">
                <button className="rounded border px-2 py-0.5" onClick={async () => { const v = window.prompt('Limite de usuários (vazio = sem limite):', o.max_usuarios ?? ''); if (v === null) return; try { await chamar(`/api/auth/tenants/${encodeURIComponent(o.login)}/limit`, 'POST', { limite: v.trim() === '' ? null : Number(v) }); carregar(); } catch (c) { erro(c); } }}>Limite{o.max_usuarios != null ? `: ${o.max_usuarios}` : ''}</button>
                <button className="rounded border px-2 py-0.5" onClick={async () => { try { await chamar(`/api/auth/tenants/${encodeURIComponent(o.login)}/block`, 'POST', { bloqueado: !o.disabled }); carregar(); } catch (c) { erro(c); } }}>{o.disabled ? 'Desbloquear' : 'Bloquear'}</button>
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
