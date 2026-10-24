import { EsqueciSenha } from './EsqueciSenha';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PainelContas } from './PainelContas';

type Empresa = { cnpj: string; nome: string };
type Ctx = { usuario: string; empresas: Empresa[]; empresaAtiva: Empresa | null; escolherEmpresa: (cnpj: string) => void; sair: () => Promise<void> };
const AcessoContext = createContext<Ctx | null>(null);
export const useAcesso = (): Ctx => {
  const v = useContext(AcessoContext);
  if (!v) throw new Error('useAcesso fora do AcessoGate');
  return v;
};

const CHAVE_EMPRESA = 'agente_empresa_ativa';

export const AcessoGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carregando, setCarregando] = useState(true);
  const [sessao, setSessao] = useState<{ usuario: string; empresas: Empresa[] } | null>(null);
  const [cnpjAtivo, setCnpjAtivo] = useState<string | null>(null);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const convite = hash.get('convite') || '';
  const redefinirSenha = hash.get('redefinir') === '1';
  const [login, setLogin] = useState(hash.get('login') || '');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [flags, setFlags] = useState<{ ehEscritorio: boolean; donoSistema: boolean; contasProprias: boolean; podeGerenciar: boolean }>({ ehEscritorio: false, donoSistema: false, contasProprias: false, podeGerenciar: false });
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);
  const [chave, setChave] = useState('');
  const [painel, setPainel] = useState(false);

  const aplicar = (d: { usuario: string; empresas: Empresa[]; ehEscritorio?: boolean; donoSistema?: boolean; contasProprias?: boolean; podeGerenciar?: boolean }) => {
    setFlags({ ehEscritorio: d.ehEscritorio === true, donoSistema: d.donoSistema === true, contasProprias: d.contasProprias === true, podeGerenciar: d.podeGerenciar === true || d.ehEscritorio === true || d.donoSistema === true });
    setSessao({ usuario: d.usuario, empresas: d.empresas || [] });
    let salvo: string | null = null;
    try { salvo = localStorage.getItem(CHAVE_EMPRESA); } catch { /* sem storage */ }
    const lista = d.empresas || [];
    setCnpjAtivo(lista.find((e) => e.cnpj === salvo)?.cnpj || lista[0]?.cnpj || null);
  };

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include', cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (d.autenticado) aplicar(d); else setPrimeiroAcesso(d.primeiroAcesso === true); })
      .catch(() => undefined)
      .finally(() => setCarregando(false));
  }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (convite) {
      if (senha.length < 12) { setErro('A senha precisa ter pelo menos 12 caracteres.'); return; }
      if (senha !== confirmacao) { setErro('As senhas não coincidem.'); return; }
    }
    if (primeiroAcesso && !convite) {
      if (senha.length < 12) { setErro('A senha precisa ter pelo menos 12 caracteres.'); return; }
      if (senha !== confirmacao) { setErro('As senhas não coincidem.'); return; }
    }
    setEnviando(true);
    try {
      if (primeiroAcesso && !convite) {
        const c = await fetch('/api/auth/setup', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: chave, login, senha }) });
        const dc = await c.json().catch(() => ({}));
        if (!c.ok) { setErro(dc.motivo || 'Não foi possível configurar.'); return; }
        setPrimeiroAcesso(false); setChave(''); setConfirmacao('');
        const r0 = await fetch('/api/auth/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, senha }) });
        const d0 = await r0.json().catch(() => ({}));
        if (r0.ok) aplicar(d0); else setErro('Conta criada. Entre com a nova senha.');
        return;
      }
      const r = await fetch(convite ? '/api/auth/redeem' : '/api/auth/login', {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha, convite }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErro(d.motivo || 'Não foi possível entrar.'); return; }
      if (convite) history.replaceState(null, '', window.location.pathname);
      aplicar(d);
    } catch { setErro('Sem conexão com o servidor. Tente novamente.'); }
    finally { setEnviando(false); setSenha(''); setConfirmacao(''); }
  };

  const sair = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } finally { setSessao(null); }
  };
  const escolherEmpresa = (cnpj: string) => {
    setCnpjAtivo(cnpj);
    try { localStorage.setItem(CHAVE_EMPRESA, cnpj); } catch { /* sem storage */ }
  };

  if (carregando) return <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">Carregando…</div>;

  if (!sessao) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <form onSubmit={enviar} className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl p-7 space-y-4">
          <h1 className="text-xl font-black text-slate-900 text-center">Murade Agente IA</h1>
          <p className="text-sm text-slate-600 text-center">
            {redefinirSenha ? 'Defina uma nova senha para sua conta.' : convite ? 'Você foi convidado. Crie sua senha para entrar.' : primeiroAcesso ? 'Primeiro acesso: crie o usuário do dono do sistema.' : 'Entre com seu usuário e senha.'}
          </p>
          {erro && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-sm text-rose-800">{erro}</div>}
          <label className="block text-sm font-semibold text-slate-700">Usuário
            <input value={login} onChange={(e) => setLogin(e.target.value)} readOnly={Boolean(convite && hash.get('login'))} autoComplete="username" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
          </label>
          {primeiroAcesso && !convite && (
            <label className="block text-sm font-semibold text-slate-700">Chave de configuração
              <input type="password" value={chave} onChange={(e) => setChave(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
            </label>
          )}
          <label className="block text-sm font-semibold text-slate-700">{redefinirSenha ? 'Nova senha' : convite || primeiroAcesso ? 'Nova senha' : 'Senha'}
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete={convite ? 'new-password' : 'current-password'} required minLength={convite ? 12 : undefined} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" placeholder={convite ? 'Pelo menos 12 caracteres' : ''} />
          </label>
          {(convite || primeiroAcesso) && (
            <label className="block text-sm font-semibold text-slate-700">Confirme a senha
              <input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} autoComplete="new-password" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
            </label>
          )}
          <button type="submit" disabled={enviando} className="w-full rounded-lg bg-[#0f2444] hover:bg-[#1b3d6f] text-white font-bold py-2.5 disabled:opacity-60">
            {enviando ? 'Aguarde…' : convite ? 'Salvar senha e entrar' : primeiroAcesso ? 'Criar e entrar' : 'Entrar'}
          </button>
          {!convite && !primeiroAcesso && <div className="pt-1 text-center"><EsqueciSenha /></div>}
        </form>
      </main>
    );
  }

  const empresaAtiva = sessao.empresas.find((e) => e.cnpj === cnpjAtivo) || null;
  const urlDP = 'https://murade-dp.onrender.com/#acessos';
  return (
    <AcessoContext.Provider value={{ usuario: sessao.usuario, empresas: sessao.empresas, empresaAtiva, escolherEmpresa, sair }}>
      <div className="sticky top-0 z-[100] flex min-h-10 flex-wrap items-center justify-between gap-2 bg-slate-950 px-4 py-1.5 text-xs text-white">
        <span>Conta: <strong>{sessao.usuario}</strong></span>
        <div className="flex gap-2">
          {(flags.podeGerenciar || flags.ehEscritorio || flags.donoSistema) && <button type="button" onClick={() => setPainel((v) => !v)} className="rounded bg-white/15 px-3 py-1 hover:bg-white/25">Usuários e empresas</button>}
          <button type="button" onClick={() => void sair()} className="rounded bg-white/15 px-3 py-1 hover:bg-white/25">Sair</button>
        </div>
      </div>
      {painel && <PainelContas ehEscritorio={flags.ehEscritorio} donoSistema={flags.donoSistema} empresas={sessao.empresas} mostrarEmpresas={!flags.contasProprias} onFechar={() => setPainel(false)} />}
      {children}
    </AcessoContext.Provider>
  );
};
