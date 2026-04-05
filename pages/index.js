import { useState } from 'react';
import Head from 'next/head';

const LOGO = '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';

const SINTS = ['🤕 Dor de cabeça','😴 Insônia','🔥 Gastrite / Refluxo','💨 Inchaço / Gases','😰 Ansiedade','😔 Depressão / Humor','🩸 Colesterol alto','🍬 Glicemia elevada','⚡ Cansaço / Fadiga','🫀 Pressão alta','🦴 Dores articulares','🧠 Névoa mental','🌸 TPM / Hormonal','⚖️ Emagrecer','💪 Ganhar massa','🦠 Intestino irregular','🔬 Fígado / Enzimas alt.','🦋 Tireoide'];
const DIETS = ['🌿 Vegano','🥚 Vegetariano','🌾 Sem glúten','🥛 Sem leite e derivados','🫙 Sem lactose','🥗 Low carb','💪 Alto em proteína','🥑 Cetogênico','🌊 Baixo em histamina','🫘 Low FODMAP','🐟 Pescetariano','🩺 Anti-inflamatório'];
const MEALS = ['☀️ Café da manhã','🍎 Lanche da manhã','🍲 Almoço','🫐 Lanche da tarde','🌙 Jantar','🌛 Ceia'];

export default function App() {
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

  const tog = (arr, set, v) => set(arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v]);

  const procPdf = f => {
    if (!f || f.type !== 'application/pdf') return;
    setPdfName(f.name);
    const r = new FileReader();
    r.onload = e => setPdf(e.target.result.split(',')[1]);
    r.readAsDataURL(f);
  };

  const buildPrompt = () => {
    let bmi = '', tmb = '';
    if (peso && altura) {
      const h = parseFloat(altura)/100;
      bmi = 'IMC: ' + (parseFloat(peso)/(h*h)).toFixed(1);
      tmb = sexo.includes('Fem')
        ? (655.1+9.563*+peso+1.85*+altura-4.676*(+idade||30)).toFixed(0)
        : (66.5+13.75*+peso+5.003*+altura-6.755*(+idade||30)).toFixed(0);
    }
    return `Você é nutricionista especialista em nutrição terapêutica funcional e medicina integrativa. Crie um CARDÁPIO TERAPÊUTICO PERSONALIZADO completo em português.

PACIENTE: ${nome||'Paciente'} | ${sexo||'?'} | ${idade||'?'} anos | ${peso||'?'}kg | ${altura||'?'}cm | ${bmi}
TMB: ${tmb ? tmb+' kcal/dia' : 'não calculado'} | Atividade: ${atv||'?'} | Meta perda: ${meta ? meta+'kg' : 'nenhuma'}
Exame: ${pdf ? 'PDF ANEXADO - analise os marcadores' : 'não enviado'}
Sintomas: "${sintTxt||'não informado'}" + chips: ${sintSel.join(', ')||'nenhum'}
Restrições: ${dietSel.join(', ')||'nenhuma'} | Refeições: ${mealSel.join(', ')}
Extras: ${extras||'nenhum'}

ESTRUTURE ASSIM:

## 🔍 Análise Terapêutica Personalizada
Analise sintomas${pdf?', exame de sangue':''} e correlacione com deficiências nutricionais com base científica.

## 📊 Perfil Nutricional Recomendado
Meta calórica, distribuição de macros, micronutrientes prioritários com justificativa.

## 🌿 Cardápio Terapêutico Diário
Para cada refeição (${mealSel.join(', ')}):
### [Refeição] — [horário]
Alimentos com quantidades e função terapêutica. Insônia→cereja/kiwi/banana no jantar. Gastrite→repolho,gengibre suave. Cabeça→magnésio,ômega3. Fígado→cúrcuma,alcachofra. Colesterol→aveia,linhaça. Glicemia→canela,fibras. Respeite: ${dietSel.join(', ')||'sem restrições'}.

## 🍵 Chás e Fitoterápicos
4-5 opções com evidência científica: mecanismo, preparo, horário, precauções.

## 🏃 Hábitos de Vida Terapêuticos
Exercícios ideais, meditação, sono, vitamina D, estresse, hidratação, ultra-processados.

## 📝 Lista de Compras
Por categoria: Frutas, Vegetais, Proteínas, Grãos/Sementes, Gorduras Boas, Temperos, Chás.

Seja científico, acolhedor e específico com quantidades e horários.`;
  };

  const generate = async () => {
    if (!sintTxt && sintSel.length === 0) { setErr('Descreva seus sintomas ou selecione ao menos um.'); return; }
    if (mealSel.length === 0) { setErr('Selecione ao menos uma refeição.'); setTab(2); return; }
    setErr(''); setTab(3); setLoading(true); setResult('');
    try {
      const msgs = pdf
        ? [{ role:'user', content:[{type:'document',source:{type:'base64',media_type:'application/pdf',data:pdf}},{type:'text',text:buildPrompt()}]}]
        : [{ role:'user', content: buildPrompt() }];
      const r = await fetch('/api/gerar', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:4000, messages:msgs })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || 'Erro '+r.status);
      setResult(d.content.map(c=>c.text||'').join('\n'));
      setSub(`${nome||'Paciente'} · ${peso?peso+'kg':''} · ${dietSel.slice(0,2).join(', ')||'sem restrições'} · ${mealSel.join(', ')}`);
    } catch(e) { setTab(2); setErr('Erro: '+e.message); }
    finally { setLoading(false); }
  };

  const fmt = t => t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^- (.+)$/gm,'<li>$1</li>').replace(/(<li>[\s\S]*?<\/li>\n?)+/g,'<ul>$&</ul>')
    .replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br>')
    .replace(/^(?!<[huolp])(.+)/gm,'<p>$1</p>').replace(/<p><\/p>/g,'');

  const Chip = ({v, sel, onTog, meal}) => (
    <span onClick={()=>onTog(v)}
      style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',
        borderRadius:100,border:`1.5px solid ${sel.includes(v)?(meal?'#F97316':'#0ABDC0'):'#d0e8e8'}`,
        background:sel.includes(v)?(meal?'#F97316':'#0ABDC0'):'white',
        color:sel.includes(v)?'white':'#5a7272',cursor:'pointer',fontSize:'0.8rem',
        fontWeight:500,userSelect:'none',transition:'all 0.2s',margin:'0 4px 8px 0'}}>
      {v}
    </span>
  );

  const SChip = ({v, cur, set}) => (
    <span onClick={()=>set(v)}
      style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',
        borderRadius:100,border:`1.5px solid ${cur===v?'#0ABDC0':'#d0e8e8'}`,
        background:cur===v?'#0ABDC0':'white',color:cur===v?'white':'#5a7272',
        cursor:'pointer',fontSize:'0.8rem',fontWeight:500,userSelect:'none',
        transition:'all 0.2s',margin:'0 4px 8px 0'}}>
      {v}
    </span>
  );

  const prog = (step) => (
    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:24}}>
      {[['1','Dados'],['2','Sintomas'],['3','Preferências'],['✨','Cardápio']].map(([n,l],i)=>(
        <><div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'0.75rem',fontWeight:700,border:`2px solid ${i<step?'#0ABDC0':i===step?'#0ABDC0':'#d0e8e8'}`,
            background:i<step?'#0ABDC0':i===step?'white':'white',
            color:i<step?'white':i===step?'#0ABDC0':'#5a7272',
            boxShadow:i===step?'0 0 0 3px rgba(10,189,192,0.18)':'none'}}>
            {i<step?'✓':n}
          </div>
          <span style={{fontSize:'0.72rem',color:i<=step?'#078b8e':'#5a7272',fontWeight:500}}>{l}</span>
        </div>
        {i<3&&<div style={{flex:1,height:2,background:i<step?'#0ABDC0':'#d0e8e8',maxWidth:50,transition:'all 0.3s'}}/>}</>
      ))}
    </div>
  );

  const Card = ({children}) => (
    <div style={{background:'white',borderRadius:16,padding:26,boxShadow:'0 4px 24px rgba(10,189,192,0.08)',marginBottom:20,border:'1px solid #d0e8e8'}}>
      {children}
    </div>
  );

  const inp = {width:'100%',fontFamily:"'DM Sans',sans-serif",fontSize:'0.88rem',border:'1.5px solid #d0e8e8',borderRadius:10,padding:'11px 14px',background:'white',color:'#1a2e2e',outline:'none',resize:'vertical'};
  const lbl = {display:'block',fontSize:'0.82rem',fontWeight:600,color:'#1a2e2e',marginBottom:6};

  return (
    <>
      <Head>
        <title>Nutri Secrets</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'DM Sans',sans-serif;background:#F4FAFA;color:#1a2e2e;min-height:100vh;font-size:14px}
          .res h2{font-family:'Playfair Display',serif;font-size:1.2rem;color:#078b8e;margin:22px 0 8px;padding-bottom:6px;border-bottom:2px solid #E0F7F8}
          .res h2:first-child{margin-top:0}
          .res h3{font-size:0.95rem;font-weight:700;color:#d95f0a;margin:16px 0 5px}
          .res ul{padding-left:20px;margin:6px 0 12px}
          .res li{margin-bottom:4px}
          .res strong{color:#078b8e}
          .res p{margin-bottom:8px;line-height:1.75}
          @keyframes sp{to{transform:rotate(360deg)}}
          @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
          @media print{nav,header,.tabs,.acts{display:none!important}}
          @media(max-width:600px){.r2,.r3{grid-template-columns:1fr!important}}
        `}</style>
      </Head>

      {/* HEADER */}
      <header style={{background:'linear-gradient(135deg,#0ABDC0,#078b8e)',boxShadow:'0 2px 20px rgba(10,189,192,0.2)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',padding:'16px 24px',display:'flex',alignItems:'center',gap:14}}>
          <img src={`data:image/png;base64,${LOGO}`} alt="Nutri Secrets" style={{height:52,width:'auto',filter:'brightness(0) invert(1)'}}/>
          <p style={{color:'rgba(255,255,255,0.85)',fontSize:'0.78rem',fontWeight:300}}>Nutrição terapêutica personalizada com base científica</p>
        </div>
      </header>

      {/* TABS */}
      <div className="tabs" style={{background:'white',borderBottom:'2px solid #d0e8e8',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'flex',padding:'0 24px',overflowX:'auto'}}>
          {[['1','Dados Pessoais'],['2','Sintomas & Exame'],['3','Preferências'],['✨','Meu Cardápio']].map(([n,l],i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{padding:'14px 18px',border:'none',background:'transparent',
              fontFamily:"'DM Sans',sans-serif",fontSize:'0.82rem',fontWeight:tab===i?600:500,
              color:tab===i?'#0ABDC0':'#5a7272',cursor:'pointer',
              borderBottom:`3px solid ${tab===i?'#0ABDC0':'transparent'}`,
              marginBottom:-2,transition:'all 0.2s',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:6}}>
              <span style={{width:20,height:20,borderRadius:'50%',background:tab===i?'#0ABDC0':'#E0F7F8',
                color:tab===i?'white':'#078b8e',fontSize:'0.7rem',fontWeight:700,
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{n}</span>
              {l}
            </button>
          ))}
        </div>
      </div>

      <main style={{maxWidth:1000,margin:'0 auto',padding:'28px 24px 60px',animation:'fi 0.3s ease'}}>

        {/* TAB 1 */}
        {tab===0 && <div>
          {prog(0)}
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>👤 Seus Dados Pessoais</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Usados para calcular suas necessidades calóricas e criar um plano individualizado.</p>
            <div className="r2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:18}}>
              <div><label style={lbl}>Nome</label><input style={inp} value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome completo"/></div>
              <div><label style={lbl}>Idade</label><input style={inp} type="number" value={idade} onChange={e=>setIdade(e.target.value)} placeholder="Ex: 35"/></div>
            </div>
            <div className="r3" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:18}}>
              <div><label style={lbl}>Peso (kg)</label><input style={inp} type="number" value={peso} onChange={e=>setPeso(e.target.value)} placeholder="Ex: 75"/></div>
              <div><label style={lbl}>Altura (cm)</label><input style={inp} type="number" value={altura} onChange={e=>setAltura(e.target.value)} placeholder="Ex: 170"/></div>
              <div><label style={lbl}>Meta de perda (kg)</label><input style={inp} type="number" value={meta} onChange={e=>setMeta(e.target.value)} placeholder="Ex: 8 ou 0"/></div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={lbl}>Sexo biológico</label>
              <div style={{display:'flex',flexWrap:'wrap'}}>
                {['♀️ Feminino','♂️ Masculino'].map(v=><SChip key={v} v={v} cur={sexo} set={setSexo}/>)}
              </div>
            </div>
            <div>
              <label style={lbl}>Nível de atividade física</label>
              <div style={{display:'flex',flexWrap:'wrap'}}>
                {['😴 Sedentário','🚶 Leve (1-2x/sem)','🏃 Moderado (3-4x/sem)','💪 Intenso (5+/sem)'].map(v=><SChip key={v} v={v} cur={atv} set={setAtv}/>)}
              </div>
            </div>
          </Card>
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:26}}>
            <button onClick={()=>setTab(1)} style={{padding:'12px 24px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.88rem',fontWeight:600,cursor:'pointer',border:'none',background:'linear-gradient(135deg,#0ABDC0,#078b8e)',color:'white',boxShadow:'0 4px 14px rgba(10,189,192,0.3)',display:'inline-flex',alignItems:'center',gap:7}}>
              Próximo: Sintomas &amp; Exame →
            </button>
          </div>
        </div>}

        {/* TAB 2 */}
        {tab===1 && <div>
          {prog(1)}
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>📋 Exame de Sangue (PDF)</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Opcional. Analisaremos glicemia, colesterol, enzimas hepáticas, vitaminas e mais.</p>
            <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);procPdf(e.dataTransfer.files[0])}}
              style={{border:`2.5px dashed ${drag?'#0ABDC0':'#d0e8e8'}`,borderRadius:16,padding:'32px 24px',textAlign:'center',cursor:'pointer',background:drag?'#c8f0f1':'#E0F7F8',position:'relative',transition:'all 0.25s'}}>
              <input type="file" accept=".pdf" onChange={e=>procPdf(e.target.files[0])}
                style={{position:'absolute',inset:0,opacity:0,cursor:'pointer',width:'100%',height:'100%'}}/>
              <div style={{fontSize:'2rem'}}>📋</div>
              <p style={{fontSize:'0.95rem',fontWeight:600,color:'#078b8e',margin:'8px 0 4px'}}>Clique ou arraste seu exame aqui</p>
              <p style={{fontSize:'0.78rem',color:'#5a7272'}}>Formato: PDF · Máx 20MB</p>
            </div>
            {pdf && <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'#E0F7F8',borderRadius:10,border:'1.5px solid #0ABDC0',marginTop:14}}>
              <span style={{fontSize:'1.5rem'}}>📄</span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:'0.84rem',color:'#078b8e'}}>{pdfName}</div></div>
              <button onClick={()=>{setPdf(null);setPdfName('');}} style={{background:'none',border:'none',cursor:'pointer',color:'#5a7272',fontSize:'1.1rem'}}>✕</button>
            </div>}
          </Card>
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>🩺 Sintomas e Objetivos</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Descreva o que sente e seus objetivos. Quanto mais detalhes, mais preciso o cardápio.</p>
            <div style={{marginBottom:18}}>
              <label style={lbl}>Descreva seus sintomas e objetivos *</label>
              <textarea style={{...inp,minHeight:100}} value={sintTxt} onChange={e=>setSintTxt(e.target.value)} placeholder="Ex: Tenho dor de cabeça frequente, sofro de gastrite há 3 anos, insônia, quero emagrecer..."/>
            </div>
            <div>
              <label style={lbl}>Sintomas comuns</label>
              <div style={{display:'flex',flexWrap:'wrap'}}>
                {SINTS.map(v=><Chip key={v} v={v} sel={sintSel} onTog={v=>tog(sintSel,setSintSel,v)}/>)}
              </div>
            </div>
          </Card>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:26}}>
            <button onClick={()=>setTab(0)} style={{padding:'12px 24px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.88rem',fontWeight:600,cursor:'pointer',background:'white',color:'#5a7272',border:'1.5px solid #d0e8e8'}}>← Voltar</button>
            <button onClick={()=>setTab(2)} style={{padding:'12px 24px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.88rem',fontWeight:600,cursor:'pointer',border:'none',background:'linear-gradient(135deg,#0ABDC0,#078b8e)',color:'white',boxShadow:'0 4px 14px rgba(10,189,192,0.3)'}}>Próximo: Preferências →</button>
          </div>
        </div>}

        {/* TAB 3 */}
        {tab===2 && <div>
          {prog(2)}
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>🌱 Restrições Alimentares</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Selecione todas que se aplicam.</p>
            <div style={{display:'flex',flexWrap:'wrap'}}>
              {DIETS.map(v=><Chip key={v} v={v} sel={dietSel} onTog={v=>tog(dietSel,setDietSel,v)}/>)}
            </div>
          </Card>
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>🍽️ Refeições do Dia</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Selecione uma ou mais refeições.</p>
            <div style={{display:'flex',flexWrap:'wrap'}}>
              {MEALS.map(v=><Chip key={v} v={v} sel={mealSel} onTog={v=>tog(mealSel,setMealSel,v)} meal/>)}
            </div>
          </Card>
          <Card>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:600,marginBottom:4}}>✏️ Observações Adicionais</p>
            <p style={{color:'#5a7272',fontSize:'0.8rem',marginBottom:18,lineHeight:1.5}}>Alimentos que não gosta, alergias, horários...</p>
            <textarea style={{...inp,minHeight:90}} value={extras} onChange={e=>setExtras(e.target.value)} placeholder="Ex: Não gosto de beterraba. Almoço fora todos os dias..."/>
          </Card>
          <div style={{textAlign:'center',padding:'32px 16px'}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:600,marginBottom:8}}>Tudo pronto? ✨</p>
            <p style={{color:'#5a7272',marginBottom:24,fontSize:'0.87rem'}}>Clique abaixo para gerar seu cardápio terapêutico personalizado com base científica.</p>
            <button onClick={generate} style={{padding:'14px 32px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.95rem',fontWeight:600,cursor:'pointer',border:'none',background:'linear-gradient(135deg,#F97316,#d95f0a)',color:'white',boxShadow:'0 4px 14px rgba(249,115,22,0.3)',display:'inline-flex',alignItems:'center',gap:7}}>
              🌿 Gerar Meu Cardápio Terapêutico
            </button>
            {err && <div style={{background:'#fff5f5',border:'1.5px solid #fca5a5',borderRadius:10,padding:'14px 18px',color:'#b91c1c',fontSize:'0.84rem',marginTop:14}}>⚠️ {err}</div>}
          </div>
          <div style={{marginTop:0}}><button onClick={()=>setTab(1)} style={{padding:'12px 24px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.88rem',fontWeight:600,cursor:'pointer',background:'white',color:'#5a7272',border:'1.5px solid #d0e8e8'}}>← Voltar</button></div>
        </div>}

        {/* TAB 4 */}
        {tab===3 && <div>
          {loading ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',textAlign:'center'}}>
              <div style={{width:48,height:48,border:'4px solid #E0F7F8',borderTopColor:'#0ABDC0',borderRadius:'50%',animation:'sp 0.9s linear infinite',marginBottom:18}}/>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:600,marginBottom:6}}>Analisando seus dados…</p>
              <p style={{color:'#5a7272',fontSize:'0.82rem'}}>Correlacionando sintomas e preferências<br/>com nossa base científica de nutrição terapêutica.</p>
            </div>
          ) : result ? (
            <div style={{animation:'fi 0.4s ease'}}>
              <div style={{background:'linear-gradient(135deg,#0ABDC0,#078b8e)',borderRadius:16,padding:'24px 28px',color:'white',marginBottom:20,display:'flex',alignItems:'center',gap:16}}>
                <div style={{fontSize:'2.4rem'}}>🌿</div>
                <div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.35rem',fontWeight:600,marginBottom:3}}>Seu Cardápio Terapêutico Personalizado</p>
                  <p style={{opacity:0.85,fontSize:'0.82rem'}}>{sub}</p>
                </div>
              </div>
              <div className="acts" style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
                <button onClick={()=>window.print()} style={{background:'white',border:'1.5px solid #d0e8e8',color:'#5a7272',fontSize:'0.8rem',padding:'9px 16px',borderRadius:10,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>🖨️ Imprimir / Salvar PDF</button>
                <button onClick={()=>{setResult('');setTab(0);}} style={{background:'white',border:'1.5px solid #d0e8e8',color:'#5a7272',fontSize:'0.8rem',padding:'9px 16px',borderRadius:10,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>🔄 Novo cardápio</button>
              </div>
              <div className="res" style={{background:'white',borderRadius:16,padding:30,boxShadow:'0 4px 24px rgba(10,189,192,0.08)',border:'1px solid #d0e8e8',fontSize:'0.9rem',lineHeight:1.75,color:'#1a2e2e'}} dangerouslySetInnerHTML={{__html:fmt(result)}}/>
              <div style={{background:'#FFF0E6',borderLeft:'4px solid #F97316',borderRadius:'0 10px 10px 0',padding:'12px 16px',fontSize:'0.77rem',color:'#d95f0a',marginTop:18,lineHeight:1.5}}>⚠️ <strong>Aviso:</strong> Este cardápio é uma sugestão educativa. Não substitui consulta com médico ou nutricionista.</div>
            </div>
          ) : null}
        </div>}

      </main>
    </>
  );
}
