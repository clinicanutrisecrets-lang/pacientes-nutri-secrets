import { useState, useEffect } from 'react';
import Head from 'next/head';

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'nutrisecrets@admin2025';

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [aba, setAba] = useState('usuarios');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [novaNotif, setNovaNotif] = useState({ titulo: '', mensagem: '', destinatario_id: '' });
  const [busca, setBusca] = useState('');

  const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ADMIN_SECRET}`
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  const loadData = async () => {
    setLoading(true);
    const r = await fetch('/api/admin', { headers });
    const d = await r.json();
    setUsuarios(d.usuarios || []);
    setNotifs(d.notificacoes || []);
    setLoading(false);
  };

  const toggleUser = async (id, ativo) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id, ativo: !ativo })
    });
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ativo: !ativo } : u));
    setMsg(`Usuário ${!ativo ? 'ativado' : 'desativado'} com sucesso!`);
    setTimeout(() => setMsg(''), 3000);
  };

  const enviarNotif = async () => {
    if (!novaNotif.titulo || !novaNotif.mensagem) { setMsg('Preencha título e mensagem.'); return; }
    const r = await fetch('/api/admin', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        titulo: novaNotif.titulo,
        mensagem: novaNotif.mensagem,
        destinatario_id: novaNotif.destinatario_id || null
      })
    });
    if (r.ok) {
      setMsg('Notificação enviada com sucesso! ✅');
      setNovaNotif({ titulo: '', mensagem: '', destinatario_id: '' });
      loadData();
    } else {
      setMsg('Erro ao enviar notificação.');
    }
    setTimeout(() => setMsg(''), 4000);
  };

  const deletarNotif = async (id) => {
    await fetch('/api/admin', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id })
    });
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    u.email?.toLowerCase().includes(busca.toLowerCase()) ||
    u.whatsapp?.includes(busca)
  );

  const s = {
    page: { minHeight: '100vh', background: '#F4FAFA', fontFamily: "'DM Sans', sans-serif" },
    header: { background: 'linear-gradient(135deg,#0ABDC0,#078b8e)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    h1: { color: 'white', fontSize: '1.2rem', fontWeight: 700, margin: 0 },
    badge: { background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem' },
    main: { maxWidth: 1100, margin: '0 auto', padding: '28px 24px' },
    tabs: { display: 'flex', gap: 8, marginBottom: 24 },
    tab: (on) => ({ padding: '10px 22px', borderRadius: 10, border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', background: on ? 'linear-gradient(135deg,#0ABDC0,#078b8e)' : 'white', color: on ? 'white' : '#5a7272', boxShadow: on ? '0 4px 14px rgba(10,189,192,0.3)' : '0 1px 4px rgba(0,0,0,0.08)' }),
    card: { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(10,189,192,0.08)', border: '1px solid #d0e8e8', marginBottom: 20 },
    inp: { width: '100%', fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem', border: '1.5px solid #d0e8e8', borderRadius: 10, padding: '10px 14px', outline: 'none', boxSizing: 'border-box', color: '#1a2e2e' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { background: '#F4FAFA', padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#5a7272', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: 0.5 },
    td: { padding: '12px 14px', borderBottom: '1px solid #f0f0f0', color: '#1a2e2e', verticalAlign: 'middle' },
    btnG: { padding: '8px 16px', borderRadius: 8, border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg,#0ABDC0,#078b8e)', color: 'white' },
    btnR: { padding: '8px 16px', borderRadius: 8, border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: '#fee2e2', color: '#b91c1c' },
    btnO: { padding: '8px 16px', borderRadius: 8, border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg,#F97316,#d95f0a)', color: 'white' },
    tag: (ok) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: '0.73rem', fontWeight: 600, background: ok ? '#d1fae5' : '#fee2e2', color: ok ? '#065f46' : '#b91c1c' }),
    msgBox: { background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '12px 18px', color: '#065f46', marginBottom: 16, fontSize: '0.87rem' },
  };

  // Login screen
  if (!authed) return (
    <>
      <Head><title>Admin · Nutri Secrets</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/></Head>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a2e2e,#078b8e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🌿</div>
            <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#1a2e2e', margin: 0 }}>Painel Admin</h1>
            <p style={{ color: '#5a7272', fontSize: '0.82rem', marginTop: 4 }}>Nutri Secrets</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a2e2e', marginBottom: 6 }}>Senha de administrador</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { if (pass === ADMIN_PASS) setAuthed(true); else setPassErr('Senha incorreta.'); }}}
              placeholder="Digite a senha"
              style={{ ...s.inp, fontSize: '16px' }} />
            {passErr && <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: 6 }}>{passErr}</p>}
          </div>
          <button onClick={() => { if (pass === ADMIN_PASS) { setAuthed(true); setPassErr(''); } else setPassErr('Senha incorreta.'); }}
            style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#0ABDC0,#078b8e)', color: 'white', fontFamily: "'DM Sans',sans-serif", fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
            Entrar
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head><title>Admin · Nutri Secrets</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/></Head>
      <div style={s.page}>
        <header style={s.header}>
          <h1 style={s.h1}>🌿 Painel Admin · Nutri Secrets</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={s.badge}>{usuarios.length} usuários</span>
            <button onClick={loadData} style={{ ...s.badge, cursor: 'pointer', border: 'none', background: 'rgba(255,255,255,0.15)' }}>🔄 Atualizar</button>
            <button onClick={() => setAuthed(false)} style={{ ...s.badge, cursor: 'pointer', border: 'none', background: 'rgba(255,0,0,0.2)' }}>Sair</button>
          </div>
        </header>

        <main style={s.main}>
          {msg && <div style={s.msgBox}>{msg}</div>}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
            {[
              ['👥', 'Total de usuários', usuarios.length, '#0ABDC0'],
              ['✅', 'Usuários ativos', usuarios.filter(u => u.ativo).length, '#10b981'],
              ['🚫', 'Desativados', usuarios.filter(u => !u.ativo).length, '#ef4444'],
              ['🔔', 'Notificações enviadas', notifs.length, '#F97316'],
            ].map(([icon, label, val, color]) => (
              <div key={label} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', border: '1px solid #d0e8e8', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '1.6rem', margin: '0 0 4px' }}>{icon}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color, margin: 0 }}>{val}</p>
                <p style={{ fontSize: '0.75rem', color: '#5a7272', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={s.tabs}>
            <button style={s.tab(aba === 'usuarios')} onClick={() => setAba('usuarios')}>👥 Usuários</button>
            <button style={s.tab(aba === 'notificacoes')} onClick={() => setAba('notificacoes')}>🔔 Notificações</button>
            <button style={s.tab(aba === 'enviar')} onClick={() => setAba('enviar')}>✉️ Enviar Notificação</button>
          </div>

          {/* USUARIOS */}
          {aba === 'usuarios' && (
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '1rem', fontWeight: 700, margin: 0, color: '#1a2e2e' }}>Lista de Usuários</h2>
                <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="🔍 Buscar por nome, email ou whatsapp..."
                  style={{ ...s.inp, width: 300, fontSize: '0.85rem', padding: '8px 14px' }} />
              </div>
              {loading ? <p style={{ color: '#5a7272', textAlign: 'center', padding: 20 }}>Carregando...</p> : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        {['Nome', 'E-mail', 'WhatsApp', 'Status', 'Cadastro', 'Ações'].map(h => (
                          <th key={h} style={s.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map(u => (
                        <tr key={u.id} style={{ background: u.ativo ? 'white' : '#fef2f2' }}>
                          <td style={s.td}><strong>{u.nome}</strong></td>
                          <td style={s.td}>{u.email}</td>
                          <td style={s.td}>{u.whatsapp}</td>
                          <td style={s.td}><span style={s.tag(u.ativo)}>{u.ativo ? 'Ativo' : 'Desativado'}</span></td>
                          <td style={s.td}>{new Date(u.criado_em).toLocaleDateString('pt-BR')}</td>
                          <td style={s.td}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => toggleUser(u.id, u.ativo)} style={u.ativo ? s.btnR : s.btnG}>
                                {u.ativo ? 'Desativar' : 'Ativar'}
                              </button>
                              <button onClick={() => { setNovaNotif(p => ({ ...p, destinatario_id: u.id })); setAba('enviar'); }}
                                style={s.btnO}>Notificar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {usuariosFiltrados.length === 0 && <p style={{ textAlign: 'center', color: '#5a7272', padding: 20 }}>Nenhum usuário encontrado.</p>}
                </div>
              )}
            </div>
          )}

          {/* NOTIFICACOES */}
          {aba === 'notificacoes' && (
            <div style={s.card}>
              <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', color: '#1a2e2e' }}>Histórico de Notificações</h2>
              {notifs.length === 0 ? <p style={{ color: '#5a7272', textAlign: 'center', padding: 20 }}>Nenhuma notificação enviada ainda.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {notifs.map(n => (
                    <div key={n.id} style={{ border: '1px solid #e0f0f0', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a2e2e' }}>{n.titulo}</span>
                          <span style={{ ...s.tag(!n.destinatario_id), fontSize: '0.7rem' }}>{n.destinatario_id ? 'Individual' : 'Para todos'}</span>
                        </div>
                        <p style={{ color: '#5a7272', fontSize: '0.83rem', margin: '0 0 4px' }}>{n.mensagem}</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>{new Date(n.criado_em).toLocaleString('pt-BR')}</p>
                      </div>
                      <button onClick={() => deletarNotif(n.id)} style={{ ...s.btnR, padding: '6px 12px', flexShrink: 0 }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ENVIAR NOTIFICACAO */}
          {aba === 'enviar' && (
            <div style={s.card}>
              <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '1rem', fontWeight: 700, margin: '0 0 20px', color: '#1a2e2e' }}>✉️ Enviar Nova Notificação</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a2e2e', marginBottom: 6 }}>Destinatário</label>
                  <select value={novaNotif.destinatario_id} onChange={e => setNovaNotif(p => ({ ...p, destinatario_id: e.target.value }))}
                    style={{ ...s.inp }}>
                    <option value="">📢 Todos os usuários ativos</option>
                    {usuarios.filter(u => u.ativo).map(u => (
                      <option key={u.id} value={u.id}>{u.nome} — {u.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a2e2e', marginBottom: 6 }}>Título *</label>
                  <input value={novaNotif.titulo} onChange={e => setNovaNotif(p => ({ ...p, titulo: e.target.value }))}
                    placeholder="Ex: Nova receita disponível!"
                    style={{ ...s.inp, fontSize: '16px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a2e2e', marginBottom: 6 }}>Mensagem *</label>
                  <textarea value={novaNotif.mensagem} onChange={e => setNovaNotif(p => ({ ...p, mensagem: e.target.value }))}
                    placeholder="Ex: Confira a nova receita de pão de linhaça terapêutico no seu app!"
                    style={{ ...s.inp, minHeight: 100, resize: 'vertical', fontSize: '16px' }} />
                </div>
                <div style={{ background: '#E0F7F8', borderRadius: 10, padding: '12px 16px', fontSize: '0.8rem', color: '#078b8e' }}>
                  🔔 A notificação aparecerá como popup no app quando o usuário abrir, e como push notification no celular (se habilitado).
                </div>
                <button onClick={enviarNotif} style={{ ...s.btnG, padding: '13px 24px', fontSize: '0.95rem', alignSelf: 'flex-start', borderRadius: 10 }}>
                  🚀 Enviar Notificação
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
