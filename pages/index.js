import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { LOGO, METHODOLOGY, RECIPES } from '../lib/knowledge';

const SINTS = ['🤕 Dor de cabeça','😴 Insônia','🔥 Gastrite / Refluxo','💨 Inchaço / Gases','😰 Ansiedade','😔 Depressão / Humor baixo','🩸 Colesterol alto','🍬 Glicemia elevada','⚡ Cansaço / Fadiga','🫀 Pressão alta','🦴 Dores articulares','🧠 Névoa mental','🌸 TPM / Hormonal','⚖️ Emagrecer','💪 Ganhar massa','🦠 Intestino irregular','🔬 Fígado / Enzimas alt.','🦋 Tireoide','🛡️ Autoimune','🩺 Detox / Fígado'];
const DIETS = ['🌿 Vegano','🥚 Vegetariano','🌾 Sem glúten','🥛 Sem leite e derivados','🫙 Sem lactose','🥗 Low carb','💪 Alto em proteína','🥑 Cetogênico','🌊 Baixo em histamina','🫘 Low FODMAP','🐟 Pescetariano','🩺 Anti-inflamatório'];
const MEALS = ['☀️ Café da manhã','🍎 Lanche da manhã','🍲 Almoço','🫐 Lanche da tarde','🌙 Jantar','🌛 Ceia'];

const VIDEOS = [
  {id:'642061654',titulo:'Como fazer chá da maneira correta',categoria:'🍵 Chás',thumb:'https://vumbnail.com/642061654.jpg'},
  {id:'663330802',titulo:'Sobremesa saudável: Sopa de frutas do bosque e banana crocante com calda de chocolate',categoria:'🍓 Sobremesas',thumb:'https://vumbnail.com/663330802.jpg'},
  {id:'663330185',titulo:'Sobremesa saudável: Parfait de Manga com coco',categoria:'🍓 Sobremesas',thumb:'https://vumbnail.com/663330185.jpg'},
  {id:'663328344',titulo:'Jantar saudável: Grelhados e panqueca colorida',categoria:'🌙 Jantar',thumb:'https://vumbnail.com/663328344.jpg'},
  {id:'663319847',titulo:'Café da manhã saudável: leite de coco, toast de cogumelo com pasta de castanha de caju',categoria:'☀️ Café da manhã',thumb:'https://vumbnail.com/663319847.jpg'},
  {id:'663324111',titulo:'Almoço saudável: cogumelo e palmito no creme de castanha de caju',categoria:'🍲 Almoço',thumb:'https://vumbnail.com/663324111.jpg'},
  {id:'663217518',titulo:'Lanches saudáveis: Pizza de frigideira e homus de beterraba com pão pita',categoria:'🍎 Lanches',thumb:'https://vumbnail.com/663217518.jpg'},
  {id:'663310176',titulo:'Jantar saudável: Quibe de berinjela e creme de couve-flor',categoria:'🌙 Jantar',thumb:'https://vumbnail.com/663310176.jpg'},
  {id:'663216039',titulo:'Lanches saudáveis: Muffin de legumes e Bolo de Maçã e Nozes',categoria:'🍎 Lanches',thumb:'https://vumbnail.com/663216039.jpg'}
];

const SYSTEM_PROMPT = () => `Você é a ANA (Assistente de Nutrição Avançada), especialista em nutrição terapêutica funcional criada pela equipe da Nutri Secrets / Dra. Aline Quissak.

METODOLOGIA:
${METHODOLOGY}

BANCO DE RECEITAS TERAPÊUTICAS (use quando relevante para os sintomas):
${RECIPES}

REGRAS:
- Responda SEMPRE em português brasileiro
- Seja acolhedora, científica e prática
- Use as receitas do banco acima quando fizer sentido para os sintomas
- Traduza os nomes das receitas para português quando mencionar
- No chat: respostas concisas (máx 3 parágrafos)
- Nunca faça diagnósticos médicos
- Ao interpretar exames de sangue, use SEMPRE os valores ideais de saúde e longevidade (não apenas os valores de referência laboratorial que são baseados em médias populacionais). Por exemplo: glicemia ideal ≤85 mg/dL (não apenas <100), vitamina D ideal 60-80 ng/mL (não apenas >30), ferritina ideal 50-150 ng/mL, TSH ideal 1-2 mUI/L, etc. Foque em prevenção e medicina de precisão.
- NUNCA mencione "alcalinizar o sangue" ou conceitos de "sangue ácido/alcalino" pois o pH sanguíneo é rigorosamente regulado pelo organismo e não é alterado pela dieta`;

export default function App() {
  // Auth
  const [authScreen, setAuthScreen] = useState('login'); // login | register | app
  const [token, setToken] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authErr, setAuthErr] = useState('');
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [regData, setRegData] = useState({ nome: '', email: '', whatsapp: '', senha: '', confirmar: '' });

  // Notifications
  const [notificacoes, setNotificacoes] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifVistas, setNotifVistas] = useState(false);

  const [videoAtivo, setVideoAtivo] = useState(null);
  const [videoCat, setVideoCat] = useState('Todos');
  const [screen, setScreen] = useState('welcome');
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [err, setErr] = useState('');
  const [pdf, setPdf] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [drag, setDrag] = useState(false);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [meta, setMeta] = useState('');
  const [sexo, setSexo] = useState('');
  const [atv, setAtv] = useState('');
  const [sintTxt, setSintTxt] = useState('');
  const [extras, setExtras] = useState('');
  const [sintSel, setSintSel] = useState([]);
  const [dietSel, setDietSel] = useState([]);
  const [mealSel, setMealSel] = useState([]);
  const [sub, setSub] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([{role:'assistant',text:'Olá! 👋 Sou a ANA, sua assistente de nutrição terapêutica da Nutri Secrets. Posso tirar dúvidas sobre saúde e estilo de vida, sugerir alimentos e receitas terapêuticas. Como posso ajudar?'}]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { if (chatOpen) chatEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [chatMsgs, chatOpen]);

  useEffect(() => {
    // Check saved token
    const saved = localStorage.getItem('ns_token');
    const savedUser = localStorage.getItem('ns_user');
    if (saved && savedUser) {
      setToken(saved);
      setUsuario(JSON.parse(savedUser));
      setAuthScreen('app');
      loadNotificacoes(saved);
    }
  }, []);

  const loadNotificacoes = async (tk) => {
    try {
      const r = await fetch('/api/notificacoes', {
        headers: { 'Authorization': `Bearer ${tk}` }
      });
      const d = await r.json();
      const naoLidas = (d.notificacoes || []).filter(n => !n.lida);
      if (naoLidas.length > 0) {
        setNotificacoes(naoLidas);
        setNotifOpen(true);
      }
    } catch {}
  };

  const marcarLida = async (id) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
    try {
      await fetch('/api/notificacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ notificacao_id: id })
      });
    } catch {}
    if (notificacoes.length <= 1) setNotifOpen(false);
  };

  const doLogin = async () => {
    setAuthErr(''); setAuthLoading(true);
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const d = await r.json();
      if (!r.ok) { setAuthErr(d.error); return; }
      localStorage.setItem('ns_token', d.token);
      localStorage.setItem('ns_user', JSON.stringify(d.usuario));
      setToken(d.token);
      setUsuario(d.usuario);
      setAuthScreen('app');
      loadNotificacoes(d.token);
    } catch { setAuthErr('Erro de conexão. Tente novamente.'); }
    finally { setAuthLoading(false); }
  };

  const doRegister = async () => {
    setAuthErr(''); 
    if (!regData.nome || !regData.email || !regData.whatsapp || !regData.senha) {
      setAuthErr('Preencha todos os campos.'); return;
    }
    if (regData.senha !== regData.confirmar) {
      setAuthErr('As senhas não coincidem.'); return;
    }
    if (regData.senha.length < 6) {
      setAuthErr('A senha deve ter no mínimo 6 caracteres.'); return;
    }
    setAuthLoading(true);
    try {
      const r = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: regData.nome, email: regData.email, whatsapp: regData.whatsapp, senha: regData.senha })
      });
      const d = await r.json();
      if (!r.ok) { setAuthErr(d.error); return; }
      setAuthScreen('login');
      setAuthErr('');
      setLoginData({ email: regData.email, senha: '' });
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
    } catch { setAuthErr('Erro ao cadastrar. Tente novamente.'); }
    finally { setAuthLoading(false); }
  };

  const doLogout = () => {
    localStorage.removeItem('ns_token');
    localStorage.removeItem('ns_user');
    setToken(''); setUsuario(null);
    setAuthScreen('login');
    setScreen('welcome');
  };

  const tog = (arr, set, v) => set(arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v]);

  const procPdf = f => {
    if (!f || f.type !== 'application/pdf') return;
    setPdfName(f.name);
    const r = new FileReader();
    r.onload = e => setPdf(e.target.result.split(',')[1]);
    r.readAsDataURL(f);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMsgs(p => [...p, {role:'user', text:msg}]);
    setChatLoading(true);
    try {
      const history = chatMsgs.map(m => ({role: m.role==='assistant'?'assistant':'user', content: m.text}));
      history.push({role:'user', content: msg});
      const r = await fetch('/api/gerar', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:700, system: SYSTEM_PROMPT(), messages: history})
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message||'Erro');
      setChatMsgs(p => [...p, {role:'assistant', text: d.content.map(c=>c.text||'').join('')}]);
    } catch(e) {
      setChatMsgs(p => [...p, {role:'assistant', text:'Desculpe, tive um problema. Tente novamente! 🙏'}]);
    }
    setChatLoading(false);
  };

  const buildPrompt = () => {
    let bmi='', tmb='';
    if (peso && altura) {
      const h = parseFloat(altura)/100;
      bmi = 'IMC: '+(parseFloat(peso)/(h*h)).toFixed(1);
      tmb = sexo.includes('Fem')
        ? (655.1+9.563*+peso+1.85*+altura-4.676*(+idade||30)).toFixed(0)
        : (66.5+13.75*+peso+5.003*+altura-6.755*(+idade||30)).toFixed(0);
    }
    return `${SYSTEM_PROMPT()}

PACIENTE: ${nome||'Paciente'} | ${sexo||'?'} | ${idade||'?'} anos | ${peso||'?'}kg | ${altura||'?'}cm | ${bmi}
TMB: ${tmb?tmb+' kcal/dia':'não calculado'} | Atividade: ${atv||'?'} | Meta: ${meta?meta+'kg':'nenhuma'}
Exame: ${pdf?'PDF ANEXADO — analise todos os marcadores':'não enviado'}
Sintomas: "${sintTxt||'não informado'}" | chips: ${sintSel.join(', ')||'nenhum'}
Restrições: ${dietSel.join(', ')||'nenhuma'} | Refeições: ${mealSel.join(', ')}
Extras: ${extras||'nenhum'}

GERE O CARDÁPIO em português seguindo EXATAMENTE esta estrutura:

## 🔍 Análise Terapêutica Personalizada
Analise sintomas${pdf?', exame de sangue':''} e correlacione com deficiências nutricionais. Base científica.

## 📊 Perfil Nutricional Recomendado
- Meta calórica e método
- Distribuição de macros (%)
- Micronutrientes prioritários

---

## 🌿 Cardápio Terapêutico Diário
Use as receitas do banco quando possível. Para cada refeição (${mealSel.join(', ')}):

### [Refeição] — [horário]
**Sugestão:** [preparação completa com quantidades]
**Receita terapêutica completa:** [se sugerir uma preparação específica (ex: barquinha de repolho, chimichurri, pão de linhaça), inclua SEMPRE a receita COMPLETA com todos os ingredientes com quantidades E modo de preparo passo a passo em português. Não mencione uma preparação sem dar a receita completa.]
**Por que é terapêutico:** [mecanismo para os sintomas]

---

## 🍵 Chás e Fitoterápicos
4-5 opções com evidência científica: benefício, preparo, horário, precauções.

---

## 🏃 Hábitos de Vida Terapêuticos
Exercícios ideais, meditação, sono, vitamina D, estresse, hidratação.

---

## 📝 Lista de Compras Terapêutica
Por categoria com os itens necessários para as receitas.`;
  };

  const generate = async () => {
    if (!sintTxt && sintSel.length===0) {setErr('Descreva seus sintomas ou selecione ao menos um.'); return;}
    if (mealSel.length===0) {setErr('Selecione ao menos uma refeição.'); setTab(2); return;}
    setErr(''); setTab(3); setLoading(true); setResult('');
    try {
      const msgs = pdf
        ? [{role:'user',content:[{type:'document',source:{type:'base64',media_type:'application/pdf',data:pdf}},{type:'text',text:buildPrompt()}]}]
        : [{role:'user',content:buildPrompt()}];
      const r = await fetch('/api/gerar', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:6000, messages:msgs})
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message||'Erro '+r.status);
      setResult(d.content.map(c=>c.text||'').join('\n'));
      setSub(`${nome||'Paciente'} · ${peso?peso+'kg':''} · ${dietSel.slice(0,2).join(', ')||'sem restrições'} · ${mealSel.join(', ')}`);
    } catch(e) {setTab(2); setErr('Erro: '+e.message);}
    finally {setLoading(false);}
  };

  const fmt = t => t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^---$/gm,'<hr style="border:none;border-top:1.5px solid #E0F7F8;margin:22px 0">')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^- (.+)$/gm,'<li>$1</li>').replace(/(<li>[\s\S]*?<\/li>\n?)+/g,'<ul>$&</ul>')
    .replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br>')
    .replace(/^(?!<[huolp\/hr])(.+)/gm,'<p>$1</p>').replace(/<p><\/p>/g,'');

  const Chip = ({v,sel,onTog,meal}) => {
    const on = sel.includes(v);
    return <span onClick={()=>onTog(v)} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:100,border:`1.5px solid ${on?(meal?'#F97316':'#0ABDC0'):'#d0e8e8'}`,background:on?(meal?'#F97316':'#0ABDC0'):'white',color:on?'white':'#5a7272',cursor:'pointer',fontSize:'0.8rem',fontWeight:500,userSelect:'none',transition:'all 0.2s',margin:'0 4px 8px 0'}}>{v}</span>;
  };
  const SChip = ({v,cur,set}) => {
    const on = cur===v;
    return <span onClick={()=>set(v)} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:100,border:`1.5px solid ${on?'#0ABDC0':'#d0e8e8'}`,background:on?'#0ABDC0':'white',color:on?'white':'#5a7272',cursor:'pointer',fontSize:'0.8rem',fontWeight:500,userSelect:'none',transition:'all 0.2s',margin:'0 4px 8px 0'}}>{v}</span>;
  };
  const prog = (step) => (
    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:24}}>
      {[['1','Dados'],['2','Sintomas'],['3','Preferências'],['✨','Cardápio']].map(([n,l],i)=>(
        <span key={i} style={{display:'contents'}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:700,border:`2px solid ${i<step?'#0ABDC0':i===step?'#0ABDC0':'#d0e8e8'}`,background:i<step?'#0ABDC0':i===step?'white':'white',color:i<step?'white':i===step?'#0ABDC0':'#5a7272',boxShadow:i===step?'0 0 0 3px rgba(10,189,192,0.18)':'none'}}>{i<step?'✓':n}</div>
            <span style={{fontSize:'0.72rem',color:i<=step?'#078b8e':'#5a7272',fontWeight:500}}>{l}</span>
          </div>
          {i<3&&<div style={{flex:1,height:2,background:i<step?'#0ABDC0':'#d0e8e8',maxWidth:50}}/>}
        </span>
      ))}
    </div>
  );
  const cardStyle = {background:'white',borderRadius:16,padding:26,boxShadow:'0 4px 24px rgba(10,189,192,0.08)',marginBottom:20,border:'1px solid #d0e8e8'};
  const Card = ({children}) => <div style={cardStyle}>{children}</div>;
  const inp = {width:'100%',fontFamily:"'DM Sans',sans-serif",fontSize:'16px',border:'1.5px solid #d0e8e8',borderRadius:10,padding:'11px 14px',background:'white',color:'#1a2e2e',outline:'none',resize:'vertical',boxSizing:'border-box'};
  const lbl = {display:'block',fontSize:'0.82rem',fontWeight:600,color:'#1a2e2e',marginBottom:6};
  const btnP = {padding:'12px 24px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.88rem',fontWeight:600,cursor:'pointer',border:'none',background:'linear-gradient(135deg,#0ABDC0,#078b8e)',color:'white',boxShadow:'0 4px 14px rgba(10,189,192,0.3)',display:'inline-flex',alignItems:'center',gap:7};
  const btnS = {padding:'12px 24px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.88rem',fontWeight:600,cursor:'pointer',background:'white',color:'#5a7272',border:'1.5px solid #d0e8e8'};

  const Header = () => (
    <header style={{background:'linear-gradient(135deg,#0ABDC0,#078b8e)',boxShadow:'0 2px 20px rgba(10,189,192,0.2)'}}>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',gap:14}}>
        <img src={`data:image/png;base64,${LOGO}`} alt="Nutri Secrets" style={{height:48,width:'auto',filter:'brightness(0) invert(1)'}}/>
        <div style={{flex:1}}>
          <p style={{color:'white',fontSize:'0.85rem',fontWeight:600,margin:0}}>ANA App · Nutri Secrets</p>
          <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.72rem',margin:0}}>Olá, {usuario?.nome?.split(' ')[0] || 'bem-vindo'}! 👋</p>
        </div>
        <button onClick={()=>setNotifOpen(true)} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'white',borderRadius:10,padding:'8px 12px',cursor:'pointer',fontSize:'1rem',position:'relative'}}>
          🔔{notificacoes.length>0&&<span style={{position:'absolute',top:-4,right:-4,width:16,height:16,background:'#F97316',borderRadius:'50%',fontSize:'0.6rem',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{notificacoes.length}</span>}
        </button>
        <button onClick={doLogout} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'white',borderRadius:10,padding:'8px 14px',cursor:'pointer',fontSize:'0.78rem',fontWeight:600}}>Sair</button>
      </div>
    </header>
  );

  const Chatbot = () => (
    <>
      <button onClick={()=>setChatOpen(o=>!o)} style={{position:'fixed',bottom:24,right:24,width:58,height:58,borderRadius:'50%',background:'linear-gradient(135deg,#F97316,#d95f0a)',border:'none',cursor:'pointer',boxShadow:'0 4px 20px rgba(249,115,22,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,transition:'all 0.3s',fontSize:'1.5rem'}}>
        {chatOpen?'✕':'💬'}
      </button>
      {chatOpen && (
        <div style={{position:'fixed',bottom:96,right:24,width:360,maxWidth:'calc(100vw - 32px)',background:'white',borderRadius:20,boxShadow:'0 8px 40px rgba(0,0,0,0.18)',zIndex:999,display:'flex',flexDirection:'column',overflow:'hidden',maxHeight:'72vh'}}>
          <div style={{background:'linear-gradient(135deg,#0ABDC0,#078b8e)',padding:'14px 18px',display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>🌿</div>
            <div>
              <p style={{color:'white',fontWeight:600,fontSize:'0.9rem',margin:0}}>ANA — Assistente Nutricional</p>
              <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.7rem',margin:0}}>Nutrição terapêutica · Nutri Secrets</p>
            </div>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'14px',display:'flex',flexDirection:'column',gap:10}}>
            {chatMsgs.map((m,i)=>(
              <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                <div style={{maxWidth:'86%',padding:'10px 13px',borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px',background:m.role==='user'?'linear-gradient(135deg,#0ABDC0,#078b8e)':'#f4fafa',color:m.role==='user'?'white':'#1a2e2e',fontSize:'0.83rem',lineHeight:1.55,border:m.role==='user'?'none':'1px solid #e0f0f0',whiteSpace:'pre-wrap'}}>{m.text}</div>
              </div>
            ))}
            {chatLoading && <div style={{display:'flex',justifyContent:'flex-start'}}><div style={{padding:'10px 14px',borderRadius:'16px 16px 16px 4px',background:'#f4fafa',border:'1px solid #e0f0f0',fontSize:'0.83rem',color:'#5a7272'}}>✦ Pensando...</div></div>}
            <div ref={chatEndRef}/>
          </div>

          <div style={{padding:'10px 14px',borderTop:'1px solid #e0f0f0',display:'flex',gap:8,background:'white'}}>
            <input 
              value={chatInput} 
              onChange={e=>setChatInput(e.target.value)} 
              onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendChat()}
              placeholder="Pergunte sobre nutrição e receitas..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck="false"
              style={{flex:1,padding:'9px 13px',borderRadius:10,border:'1.5px solid #d0e8e8',fontFamily:"'DM Sans',sans-serif",fontSize:'16px',outline:'none',color:'#1a2e2e',WebkitUserSelect:'text',userSelect:'text'}}/>
            <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()}
              style={{width:38,height:38,borderRadius:10,background:chatInput.trim()?'linear-gradient(135deg,#0ABDC0,#078b8e)':'#e5e5e5',border:'none',cursor:chatInput.trim()?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'1rem',color:'white'}}>➤</button>
          </div>
        </div>
      )}
    </>
  );

  // AUTH STYLES
  const authInp = {width:'100%',fontFamily:"'DM Sans',sans-serif",fontSize:'16px',border:'1.5px solid #d0e8e8',borderRadius:10,padding:'11px 14px',background:'white',color:'#1a2e2e',outline:'none',boxSizing:'border-box',marginBottom:2};
  const authLbl = {display:'block',fontSize:'0.82rem',fontWeight:600,color:'#1a2e2e',marginBottom:6,marginTop:14};

  // LOGIN SCREEN
  if (authScreen === 'login') return (
    <>
      <Head>
        <title>ANA App · Nutri Secrets</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;background:#F4FAFA}`}</style>
      </Head>
      <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0a2e2e,#0d3535,#0a2922)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <div style={{background:'white',borderRadius:24,padding:'36px 32px',width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.25)'}}>
          <div style={{textAlign:'center',marginBottom:28}}>
            <img src={`data:image/png;base64,${LOGO}`} alt="Nutri Secrets" style={{height:56,width:'auto',marginBottom:16}}/>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:700,color:'#1a2e2e',margin:0}}>Bem-vindo ao ANA App</h1>
            <p style={{color:'#5a7272',fontSize:'0.82rem',marginTop:4}}>Faça login para continuar</p>
          </div>
          {authErr && <div style={{background:'#fff5f5',border:'1px solid #fca5a5',borderRadius:10,padding:'10px 14px',color:'#b91c1c',fontSize:'0.83rem',marginBottom:14}}>{authErr}</div>}
          <div>
            <label style={authLbl}>E-mail</label>
            <input style={authInp} type="email" value={loginData.email} onChange={e=>setLoginData(p=>({...p,email:e.target.value}))} placeholder="seu@email.com" autoComplete="email"/>
            <label style={authLbl}>Senha</label>
            <input style={authInp} type="password" value={loginData.senha} onChange={e=>setLoginData(p=>({...p,senha:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="Sua senha" autoComplete="current-password"/>
          </div>
          <button onClick={doLogin} disabled={authLoading} style={{width:'100%',padding:'13px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#0ABDC0,#078b8e)',color:'white',fontFamily:"'DM Sans',sans-serif",fontSize:'0.95rem',fontWeight:600,cursor:'pointer',marginTop:20,opacity:authLoading?0.7:1}}>
            {authLoading ? 'Entrando...' : 'Entrar'}
          </button>
          <p style={{textAlign:'center',marginTop:16,fontSize:'0.83rem',color:'#5a7272'}}>
            Não tem conta?{' '}
            <span onClick={()=>{setAuthScreen('register');setAuthErr('');}} style={{color:'#0ABDC0',fontWeight:600,cursor:'pointer'}}>Cadastre-se</span>
          </p>
        </div>
      </div>
    </>
  );

  // REGISTER SCREEN
  if (authScreen === 'register') return (
    <>
      <Head>
        <title>Cadastro · ANA App</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;background:#F4FAFA}`}</style>
      </Head>
      <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0a2e2e,#0d3535,#0a2922)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <div style={{background:'white',borderRadius:24,padding:'36px 32px',width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.25)'}}>
          <div style={{textAlign:'center',marginBottom:24}}>
            <img src={`data:image/png;base64,${LOGO}`} alt="Nutri Secrets" style={{height:48,width:'auto',marginBottom:12}}/>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:700,color:'#1a2e2e',margin:0}}>Criar conta</h1>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginTop:3}}>Preencha seus dados para se cadastrar</p>
          </div>
          {authErr && <div style={{background:'#fff5f5',border:'1px solid #fca5a5',borderRadius:10,padding:'10px 14px',color:'#b91c1c',fontSize:'0.83rem',marginBottom:14}}>{authErr}</div>}
          <label style={authLbl}>Nome completo *</label>
          <input style={authInp} value={regData.nome} onChange={e=>setRegData(p=>({...p,nome:e.target.value}))} placeholder="Seu nome completo" autoComplete="name"/>
          <label style={authLbl}>E-mail *</label>
          <input style={authInp} type="email" value={regData.email} onChange={e=>setRegData(p=>({...p,email:e.target.value}))} placeholder="seu@email.com" autoComplete="email"/>
          <label style={authLbl}>WhatsApp (com DDD) *</label>
          <input style={authInp} type="tel" value={regData.whatsapp} onChange={e=>setRegData(p=>({...p,whatsapp:e.target.value}))} placeholder="(11) 99999-9999" autoComplete="tel"/>
          <label style={authLbl}>Senha *</label>
          <input style={authInp} type="password" value={regData.senha} onChange={e=>setRegData(p=>({...p,senha:e.target.value}))} placeholder="Mínimo 6 caracteres" autoComplete="new-password"/>
          <label style={authLbl}>Confirmar senha *</label>
          <input style={authInp} type="password" value={regData.confirmar} onChange={e=>setRegData(p=>({...p,confirmar:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&doRegister()} placeholder="Repita a senha" autoComplete="new-password"/>
          <button onClick={doRegister} disabled={authLoading} style={{width:'100%',padding:'13px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#0ABDC0,#078b8e)',color:'white',fontFamily:"'DM Sans',sans-serif",fontSize:'0.95rem',fontWeight:600,cursor:'pointer',marginTop:20,opacity:authLoading?0.7:1}}>
            {authLoading ? 'Cadastrando...' : 'Criar conta'}
          </button>
          <p style={{textAlign:'center',marginTop:14,fontSize:'0.83rem',color:'#5a7272'}}>
            Já tem conta?{' '}
            <span onClick={()=>{setAuthScreen('login');setAuthErr('');}} style={{color:'#0ABDC0',fontWeight:600,cursor:'pointer'}}>Fazer login</span>
          </p>
        </div>
      </div>
    </>
  );

  // NOTIFICATION POPUP COMPONENT
  const NotifPopup = () => notifOpen && notificacoes.length > 0 ? (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{background:'white',borderRadius:20,padding:28,width:'100%',maxWidth:400,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
          <span style={{fontSize:'1.5rem'}}>🔔</span>
          <div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:600,margin:0,color:'#1a2e2e'}}>Você tem {notificacoes.length} notificação{notificacoes.length>1?'s':''}</h3>
            <p style={{color:'#5a7272',fontSize:'0.78rem',margin:0}}>da equipe Nutri Secrets</p>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10,maxHeight:300,overflowY:'auto'}}>
          {notificacoes.map(n=>(
            <div key={n.id} style={{background:'#F4FAFA',borderRadius:12,padding:'14px 16px',border:'1px solid #E0F7F8'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:'0.9rem',color:'#1a2e2e',margin:'0 0 4px'}}>{n.titulo}</p>
                  <p style={{color:'#5a7272',fontSize:'0.82rem',margin:'0 0 6px',lineHeight:1.5}}>{n.mensagem}</p>
                  <p style={{color:'#9ca3af',fontSize:'0.72rem',margin:0}}>{new Date(n.criado_em).toLocaleDateString('pt-BR')}</p>
                </div>
                <button onClick={()=>marcarLida(n.id)} style={{background:'#0ABDC0',border:'none',color:'white',borderRadius:8,padding:'5px 10px',fontSize:'0.75rem',fontWeight:600,cursor:'pointer',flexShrink:0,whiteSpace:'nowrap'}}>✓ Lida</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>setNotifOpen(false)} style={{width:'100%',marginTop:16,padding:'11px',borderRadius:10,border:'1.5px solid #d0e8e8',background:'white',color:'#5a7272',fontFamily:"'DM Sans',sans-serif",fontSize:'0.88rem',fontWeight:600,cursor:'pointer'}}>Fechar</button>
      </div>
    </div>
  ) : null;

  if (screen==='welcome') return (
    <>
      <Head>
        <title>ANA App · Nutri Secrets</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;background:#F4FAFA}@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </Head>
      <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0a2e2e 0%,#0d3535 45%,#0a2922 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 24px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-120,right:-120,width:450,height:450,borderRadius:'50%',background:'radial-gradient(circle,rgba(10,189,192,0.13) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-80,left:-80,width:320,height:320,borderRadius:'50%',background:'radial-gradient(circle,rgba(249,115,22,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:480,width:'100%',textAlign:'center',animation:'fadeUp 0.8s ease'}}>
          <img src={`data:image/png;base64,${LOGO}`} alt="Nutri Secrets" style={{height:72,width:'auto',filter:'brightness(0) invert(1)',marginBottom:28}}/>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(10,189,192,0.15)',border:'1px solid rgba(10,189,192,0.3)',borderRadius:100,padding:'6px 16px',marginBottom:28}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'#0ABDC0',display:'inline-block',animation:'pulse 2s infinite'}}/>
            <span style={{color:'#0ABDC0',fontSize:'0.74rem',fontWeight:600,letterSpacing:1,textTransform:'uppercase'}}>ANA App · Em parceria com Nutri Secrets</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(1.9rem,5vw,2.7rem)',fontWeight:700,color:'white',lineHeight:1.2,marginBottom:18}}>
            Seja bem-vindo ao<br/><span style={{color:'#0ABDC0'}}>ANA App</span>
          </h1>
          <p style={{color:'rgba(255,255,255,0.72)',fontSize:'0.97rem',lineHeight:1.7,marginBottom:10,maxWidth:380,margin:'0 auto 10px'}}>
            Aqui você tem orientações nutricionais baseadas em evidência com a metodologia focada em
          </p>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.84rem',lineHeight:1.7,marginBottom:36,maxWidth:380,margin:'0 auto 36px'}}>
            <span style={{color:'#0ABDC0',fontWeight:600}}>sinergia nutricional</span> e <span style={{color:'#0ABDC0',fontWeight:600}}>nutrição terapêutica</span> — conectando alimentos, sintomas e saúde de forma integrada e personalizada.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:36}}>
            {[['🧬','Baseado em evidências científicas'],['🌿','278+ receitas terapêuticas'],['💬','Chat com IA especializada']].map(([icon,text])=>(
              <div key={text} style={{background:'rgba(255,255,255,0.06)',borderRadius:12,padding:'14px 8px',border:'1px solid rgba(255,255,255,0.09)'}}>
                <div style={{fontSize:'1.5rem',marginBottom:6}}>{icon}</div>
                <p style={{color:'rgba(255,255,255,0.6)',fontSize:'0.7rem',lineHeight:1.4}}>{text}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>setScreen('app')} style={{padding:'16px 48px',borderRadius:14,fontFamily:"'DM Sans',sans-serif",fontSize:'1.05rem',fontWeight:700,cursor:'pointer',border:'none',background:'linear-gradient(135deg,#0ABDC0,#078b8e)',color:'white',boxShadow:'0 6px 30px rgba(10,189,192,0.4)',width:'100%',maxWidth:300}}>
            Continuar →
          </button>
          <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.72rem',marginTop:14}}>Gere seu cardápio terapêutico personalizado gratuitamente</p>
        </div>
      </div>
      <NotifPopup/>
      <Chatbot/>
    </>
  );

  return (
    <>
      <Head>
        <title>ANA App · Nutri Secrets</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'DM Sans',sans-serif;background:#F4FAFA;color:#1a2e2e;min-height:100vh;font-size:14px}
          input,textarea{-webkit-user-select:text!important;user-select:text!important;touch-action:manipulation}
          .res h2{font-family:'Playfair Display',serif;font-size:1.15rem;color:#078b8e;margin:24px 0 8px;padding-bottom:6px;border-bottom:2px solid #E0F7F8;page-break-after:avoid}
          .res h2:first-child{margin-top:0}
          .res h3{font-size:0.95rem;font-weight:700;color:#d95f0a;margin:18px 0 5px}
          .res ul{padding-left:20px;margin:6px 0 12px}
          .res li{margin-bottom:5px;line-height:1.6}
          .res strong{color:#078b8e}
          .res p{margin-bottom:8px;line-height:1.75}
          @keyframes sp{to{transform:rotate(360deg)}}
          @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
          @media print{header,.tabs,.acts,.no-print{display:none!important}.res{padding:0!important;box-shadow:none!important;border:none!important}body{font-size:11px}}
          @media(max-width:600px){.r2,.r3{grid-template-columns:1fr!important}}
        `}</style>
      </Head>
      <Header/>
      <div className="tabs" style={{background:'white',borderBottom:'2px solid #d0e8e8',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'flex',padding:'0 24px',overflowX:'auto'}}>
          {[['1','Dados Pessoais'],['2','Sintomas & Exame'],['3','Preferências'],['✨','Meu Cardápio'],['🎥','Vídeos & Receitas']].map(([n,l],i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{padding:'14px 18px',border:'none',background:'transparent',fontFamily:"'DM Sans',sans-serif",fontSize:'0.82rem',fontWeight:tab===i?600:500,color:tab===i?'#0ABDC0':'#5a7272',cursor:'pointer',borderBottom:`3px solid ${tab===i?'#0ABDC0':'transparent'}`,marginBottom:-2,transition:'all 0.2s',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:6}}>
              <span style={{width:20,height:20,borderRadius:'50%',background:tab===i?'#0ABDC0':'#E0F7F8',color:tab===i?'white':'#078b8e',fontSize:'0.7rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{n}</span>{l}
            </button>
          ))}
        </div>
      </div>
      <main style={{maxWidth:1000,margin:'0 auto',padding:'28px 24px 100px',animation:'fi 0.3s ease'}}>
        {tab===0&&<div>
          {prog(0)}
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>👤 Seus Dados Pessoais</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Usados para calcular suas necessidades calóricas e criar um plano individualizado.</p>
            <div className="r2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:18}}>
              <div><label style={lbl}>Nome</label><input style={inp} value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome completo" autoComplete="off"/></div>
              <div><label style={lbl}>Idade</label><input style={inp} type="number" inputMode="numeric" value={idade} onChange={e=>setIdade(e.target.value)} placeholder="Ex: 35"/></div>
            </div>
            <div className="r3" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:18}}>
              <div><label style={lbl}>Peso (kg)</label><input style={inp} type="number" inputMode="decimal" value={peso} onChange={e=>setPeso(e.target.value)} placeholder="Ex: 75"/></div>
              <div><label style={lbl}>Altura (cm)</label><input style={inp} type="number" inputMode="numeric" value={altura} onChange={e=>setAltura(e.target.value)} placeholder="Ex: 170"/></div>
              <div><label style={lbl}>Meta de perda (kg)</label><input style={inp} type="number" inputMode="decimal" value={meta} onChange={e=>setMeta(e.target.value)} placeholder="Ex: 8 ou 0"/></div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={lbl}>Sexo biológico</label>
              <div style={{display:'flex',flexWrap:'wrap'}}>{['♀️ Feminino','♂️ Masculino'].map(v=><SChip key={v} v={v} cur={sexo} set={setSexo}/>)}</div>
            </div>
            <div>
              <label style={lbl}>Nível de atividade física</label>
              <div style={{display:'flex',flexWrap:'wrap'}}>{['😴 Sedentário','🚶 Leve (1-2x/sem)','🏃 Moderado (3-4x/sem)','💪 Intenso (5+/sem)'].map(v=><SChip key={v} v={v} cur={atv} set={setAtv}/>)}</div>
            </div>
          </Card>
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:26}}><button onClick={()=>setTab(1)} style={btnP}>Próximo: Sintomas &amp; Exame →</button></div>
        </div>}
        {tab===1&&<div>
          {prog(1)}
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>📋 Exame de Sangue (PDF)</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Opcional. Analisaremos glicemia, colesterol, enzimas hepáticas, vitaminas e mais.</p>
            <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);procPdf(e.dataTransfer.files[0])}} style={{border:`2.5px dashed ${drag?'#0ABDC0':'#d0e8e8'}`,borderRadius:16,padding:'32px 24px',textAlign:'center',cursor:'pointer',background:drag?'#c8f0f1':'#E0F7F8',position:'relative',transition:'all 0.25s'}}>
              <input type="file" accept=".pdf" onChange={e=>procPdf(e.target.files[0])} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer',width:'100%',height:'100%'}}/>
              <div style={{fontSize:'2rem'}}>📋</div>
              <p style={{fontSize:'0.95rem',fontWeight:600,color:'#078b8e',margin:'8px 0 4px'}}>Clique ou arraste seu exame aqui</p>
              <p style={{fontSize:'0.78rem',color:'#5a7272'}}>Formato: PDF · Máx 20MB</p>
            </div>
            {pdf&&<div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'#E0F7F8',borderRadius:10,border:'1.5px solid #0ABDC0',marginTop:14}}>
              <span style={{fontSize:'1.5rem'}}>📄</span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:'0.84rem',color:'#078b8e'}}>{pdfName}</div></div>
              <button onClick={()=>{setPdf(null);setPdfName('');}} style={{background:'none',border:'none',cursor:'pointer',color:'#5a7272',fontSize:'1.1rem'}}>✕</button>
            </div>}
          </Card>
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>🩺 Sintomas e Objetivos</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Descreva o que sente. Quanto mais detalhes, mais preciso o cardápio.</p>
            <div style={{marginBottom:18}}>
              <label style={lbl}>Descreva seus sintomas e objetivos *</label>
              <textarea style={{...inp,minHeight:100}} value={sintTxt} onChange={e=>setSintTxt(e.target.value)} placeholder="Ex: Tenho ansiedade, insônia, intestino irregular e quero emagrecer..."/>
            </div>
            <div>
              <label style={lbl}>Selecione seus sintomas principais</label>
              <div style={{display:'flex',flexWrap:'wrap'}}>{SINTS.map(v=><Chip key={v} v={v} sel={sintSel} onTog={v=>tog(sintSel,setSintSel,v)}/>)}</div>
            </div>
          </Card>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:26}}>
            <button onClick={()=>setTab(0)} style={btnS}>← Voltar</button>
            <button onClick={()=>setTab(2)} style={btnP}>Próximo: Preferências →</button>
          </div>
        </div>}
        {tab===2&&<div>
          {prog(2)}
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>🌱 Restrições Alimentares</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Selecione todas que se aplicam. Seu cardápio será 100% adaptado.</p>
            <div style={{display:'flex',flexWrap:'wrap'}}>{DIETS.map(v=><Chip key={v} v={v} sel={dietSel} onTog={v=>tog(dietSel,setDietSel,v)}/>)}</div>
          </Card>
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>🍽️ Refeições do Dia</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Selecione as refeições que deseja incluir no cardápio.</p>
            <div style={{display:'flex',flexWrap:'wrap'}}>{MEALS.map(v=><Chip key={v} v={v} sel={mealSel} onTog={v=>tog(mealSel,setMealSel,v)} meal/>)}</div>
          </Card>
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>✏️ Observações Adicionais</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Alimentos que não gosta, alergias, horários, contexto de vida...</p>
            <textarea style={{...inp,minHeight:90}} value={extras} onChange={e=>setExtras(e.target.value)} placeholder="Ex: Não gosto de couve. Almoço fora de casa. Alergia a frutos do mar..."/>
          </Card>
          <div style={{textAlign:'center',padding:'32px 16px'}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:600,marginBottom:8}}>Tudo pronto? ✨</p>
            <p style={{color:'#5a7272',marginBottom:24,fontSize:'0.87rem'}}>Gere agora seu cardápio com receitas reais da Nutri Secrets.</p>
            <button onClick={generate} style={{padding:'15px 36px',borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:'0.98rem',fontWeight:600,cursor:'pointer',border:'none',background:'linear-gradient(135deg,#F97316,#d95f0a)',color:'white',boxShadow:'0 4px 18px rgba(249,115,22,0.35)',display:'inline-flex',alignItems:'center',gap:8}}>
              🌿 Gerar Meu Cardápio Terapêutico
            </button>
            {err&&<div style={{background:'#fff5f5',border:'1.5px solid #fca5a5',borderRadius:10,padding:'14px 18px',color:'#b91c1c',fontSize:'0.84rem',marginTop:14}}>⚠️ {err}</div>}
          </div>
          <div><button onClick={()=>setTab(1)} style={btnS}>← Voltar</button></div>
        </div>}
        {tab===3&&<div>
          {loading?(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',textAlign:'center'}}>
              <div style={{width:48,height:48,border:'4px solid #E0F7F8',borderTopColor:'#0ABDC0',borderRadius:'50%',animation:'sp 0.9s linear infinite',marginBottom:20}}/>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:8}}>Criando seu cardápio terapêutico…</p>
              <p style={{color:'#5a7272',fontSize:'0.84rem',lineHeight:1.6}}>Selecionando receitas terapêuticas personalizadas<br/>e correlacionando com seus sintomas e exames.</p>
            </div>
          ):result?(
            <div style={{animation:'fi 0.4s ease'}}>
              <div className="no-print" style={{background:'linear-gradient(135deg,#0ABDC0,#078b8e)',borderRadius:16,padding:'22px 26px',color:'white',marginBottom:18,display:'flex',alignItems:'center',gap:16}}>
                <div style={{fontSize:'2.2rem'}}>🌿</div>
                <div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:600,marginBottom:3}}>Seu Cardápio Terapêutico Personalizado</p>
                  <p style={{opacity:0.82,fontSize:'0.8rem'}}>{sub}</p>
                </div>
              </div>
              <div className="acts no-print" style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
                <button onClick={()=>window.print()} style={{background:'white',border:'1.5px solid #d0e8e8',color:'#5a7272',fontSize:'0.8rem',padding:'9px 16px',borderRadius:10,cursor:'pointer'}}>🖨️ Imprimir / Salvar PDF</button>
                <button onClick={()=>{setResult('');setTab(0);}} style={{background:'white',border:'1.5px solid #d0e8e8',color:'#5a7272',fontSize:'0.8rem',padding:'9px 16px',borderRadius:10,cursor:'pointer'}}>🔄 Novo cardápio</button>
              </div>
              <div className="res" style={{background:'white',borderRadius:16,padding:28,boxShadow:'0 4px 24px rgba(10,189,192,0.08)',border:'1px solid #d0e8e8',fontSize:'0.9rem',lineHeight:1.75,color:'#1a2e2e'}} dangerouslySetInnerHTML={{__html:fmt(result)}}/>
              <div style={{background:'white',borderRadius:16,overflow:'hidden',marginTop:20,border:'1px solid #d0e8e8'}}>
                <div style={{background:'linear-gradient(135deg,#0ABDC0,#078b8e)',padding:'18px 22px',display:'flex',alignItems:'center',gap:14}}>
                  <div style={{fontSize:'1.8rem'}}>🥗</div>
                  <div>
                    <p style={{color:'white',fontFamily:"'Playfair Display',serif",fontSize:'1rem',fontWeight:600,marginBottom:3}}>Quer acompanhamento personalizado?</p>
                    <p style={{color:'rgba(255,255,255,0.85)',fontSize:'0.8rem',lineHeight:1.5}}>Conheça nossos nutris especializados em nutrição de precisão integrativa.</p>
                  </div>
                </div>
                <div style={{padding:'14px 22px',background:'white',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
                  <p style={{color:'#5a7272',fontSize:'0.8rem'}}>Acompanhamento com nutricionistas especializados</p>
                  <a href="https://dralinequissak.com/" target="_blank" rel="noopener noreferrer" style={{padding:'10px 20px',background:'linear-gradient(135deg,#0ABDC0,#078b8e)',color:'white',borderRadius:10,fontSize:'0.82rem',fontWeight:600,textDecoration:'none',whiteSpace:'nowrap'}}>
                    Conheça nossos nutris →
                  </a>
                </div>
              </div>
              <div style={{marginTop:16,borderRadius:16,overflow:'hidden',background:'linear-gradient(135deg,#1a0a2e 0%,#0d1a2e 60%,#0a2e1a 100%)',position:'relative'}}>
                <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(ellipse at 25% 50%, rgba(10,189,192,0.15) 0%, transparent 60%)',pointerEvents:'none'}}/>
                <div style={{padding:'24px 22px',display:'flex',alignItems:'center',gap:18,position:'relative'}}>
                  <div style={{fontSize:'2.2rem',flexShrink:0}}>🧬</div>
                  <div style={{flex:1}}>
                    <p style={{color:'rgba(255,255,255,0.55)',fontSize:'0.7rem',fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:5}}>Nutrigenética</p>
                    <p style={{color:'white',fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',fontWeight:600,lineHeight:1.4,marginBottom:7}}>Quer mais precisão no diagnóstico?</p>
                    <p style={{color:'rgba(255,255,255,0.7)',fontSize:'0.8rem',lineHeight:1.6,marginBottom:14}}>Faça seu teste genético e desvende seu metabolismo para cuidar dos seus sintomas e prevenir doenças com o poder da nutrigenética.</p>
                    <a href="https://funil.scannerdasaude.digital/scanner" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:7,padding:'11px 20px',background:'linear-gradient(135deg,#F97316,#d95f0a)',color:'white',borderRadius:10,fontSize:'0.82rem',fontWeight:600,textDecoration:'none',boxShadow:'0 4px 18px rgba(249,115,22,0.4)'}}>
                      🧬 Desvende seu metabolismo →
                    </a>
                  </div>
                </div>
              </div>
              <div style={{background:'#FFF0E6',borderLeft:'4px solid #F97316',borderRadius:'0 10px 10px 0',padding:'11px 15px',fontSize:'0.76rem',color:'#d95f0a',marginTop:14,lineHeight:1.5}}>⚠️ <strong>Aviso:</strong> Este cardápio é uma sugestão educativa. Não substitui consulta com médico ou nutricionista.</div>
            </div>
          ):null}
        </div>}
      </main>

        {tab===4&&<div style={{animation:'fi 0.3s ease'}}>
          {/* Video modal */}
          {videoAtivo && (
            <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:2000,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setVideoAtivo(null)}>
              <div style={{width:'100%',maxWidth:800,position:'relative'}} onClick={e=>e.stopPropagation()}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,padding:'0 4px'}}>
                  <p style={{color:'white',fontSize:'0.88rem',fontWeight:600,lineHeight:1.4,flex:1,paddingRight:12}}>{videoAtivo.titulo}</p>
                  <button onClick={()=>setVideoAtivo(null)} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'white',width:36,height:36,borderRadius:'50%',cursor:'pointer',fontSize:'1rem',flexShrink:0}}>✕</button>
                </div>
                <div style={{position:'relative',paddingBottom:'56.25%',height:0,borderRadius:14,overflow:'hidden'}}>
                  <iframe
                    src={`https://player.vimeo.com/video/${videoAtivo.id}?autoplay=1&color=0ABDC0&title=0&byline=0&portrait=0`}
                    style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div style={{marginBottom:24}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:700,color:'#1a2e2e',marginBottom:6}}>🎥 Vídeos & Receitas Saudáveis</h2>
            <p style={{color:'#5a7272',fontSize:'0.82rem'}}>Receitas terapêuticas exclusivas para você assistir e preparar</p>
          </div>

          {/* Category filter */}
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:22}}>
            {['Todos',...new Set(VIDEOS.map(v=>v.categoria))].map(cat=>(
              <span key={cat} onClick={()=>setVideoCat(cat)}
                style={{padding:'7px 14px',borderRadius:100,border:`1.5px solid ${videoCat===cat?'#0ABDC0':'#d0e8e8'}`,background:videoCat===cat?'#0ABDC0':'white',color:videoCat===cat?'white':'#5a7272',cursor:'pointer',fontSize:'0.78rem',fontWeight:600,transition:'all 0.2s'}}>
                {cat}
              </span>
            ))}
          </div>

          {/* Video grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
            {VIDEOS.filter(v=>videoCat==='Todos'||v.categoria===videoCat).map(v=>(
              <div key={v.id} onClick={()=>setVideoAtivo(v)}
                style={{background:'white',borderRadius:14,overflow:'hidden',boxShadow:'0 4px 20px rgba(10,189,192,0.1)',border:'1px solid #d0e8e8',cursor:'pointer',transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(10,189,192,0.2)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(10,189,192,0.1)'}}>
                {/* Thumbnail */}
                <div style={{position:'relative',paddingBottom:'56.25%',background:'#0a2e2e'}}>
                  <img src={v.thumb} alt={v.titulo}
                    style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}}
                    onError={e=>{e.target.style.display='none';}}
                  />
                  {/* Play button overlay */}
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.25)',transition:'all 0.2s'}}>
                    <div style={{width:52,height:52,borderRadius:'50%',background:'rgba(10,189,192,0.9)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(0,0,0,0.3)'}}>
                      <span style={{fontSize:'1.3rem',marginLeft:4}}>▶</span>
                    </div>
                  </div>
                  {/* Category badge */}
                  <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.65)',borderRadius:20,padding:'3px 10px'}}>
                    <span style={{color:'white',fontSize:'0.72rem',fontWeight:600}}>{v.categoria}</span>
                  </div>
                </div>
                {/* Title */}
                <div style={{padding:'12px 14px'}}>
                  <p style={{fontSize:'0.85rem',fontWeight:600,color:'#1a2e2e',lineHeight:1.4,margin:0}}>{v.titulo}</p>
                  <p style={{fontSize:'0.75rem',color:'#0ABDC0',marginTop:6,fontWeight:500}}>▶ Assistir agora</p>
                </div>
              </div>
            ))}
          </div>
        </div>}

      <NotifPopup/>
      <Chatbot/>
    </>
  );
}
