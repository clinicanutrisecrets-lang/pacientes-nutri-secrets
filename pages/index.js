import Head from 'next/head';
import { useState, useRef } from 'react';

export default function Home() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [pdfB64, setPdfB64] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [pdfSize, setPdfSize] = useState('');
  const [drag, setDrag] = useState(false);

  // Form state
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [meta, setMeta] = useState('');
  const [sexo, setSexo] = useState('');
  const [atv, setAtv] = useState('');
  const [sintomasTxt, setSintomasTxt] = useState('');
  const [extras, setExtras] = useState('');
  const [sintChips, setSintChips] = useState([]);
  const [dietChips, setDietChips] = useState([]);
  const [mealChips, setMealChips] = useState([]);
  const [resultSubtitle, setResultSubtitle] = useState('');

  const fileInput = useRef();

  const toggleChip = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const processFile = (file) => {
    if (!file || file.type !== 'application/pdf') return;
    setPdfName(file.name);
    setPdfSize((file.size / 1024).toFixed(1) + ' KB');
    const reader = new FileReader();
    reader.onload = (e) => setPdfB64(e.target.result.split(',')[1]);
    reader.readAsDataURL(file);
  };

  const buildPrompt = () => {
    let bmi = '', tmb = '';
    if (peso && altura) {
      const h = parseFloat(altura) / 100;
      bmi = 'IMC: ' + (parseFloat(peso) / (h * h)).toFixed(1);
      tmb = sexo.includes('Fem')
        ? (655.1 + 9.563 * +peso + 1.85 * +altura - 4.676 * (+idade || 30)).toFixed(0)
        : (66.5 + 13.75 * +peso + 5.003 * +altura - 6.755 * (+idade || 30)).toFixed(0);
    }
    return `Você é nutricionista especialista em nutrição terapêutica, funcional e medicina integrativa. Crie um CARDÁPIO TERAPÊUTICO PERSONALIZADO completo em português brasileiro.

DADOS DO PACIENTE:
- Nome: ${nome || 'Paciente'} | Sexo: ${sexo || 'não informado'} | Idade: ${idade || '?'} anos
- Peso: ${peso || '?'} kg | Altura: ${altura || '?'} cm | ${bmi}
- Taxa Metabólica Basal (Harris-Benedict): ${tmb ? tmb + ' kcal/dia' : 'não calculado'}
- Atividade: ${atv || 'não informado'} | Meta de perda: ${meta ? meta + ' kg' : 'não definida'}
- Exame de sangue: ${pdfB64 ? 'PDF ANEXADO — analise todos os marcadores laboratoriais' : 'Não enviado'}

SINTOMAS/QUEIXAS: "${sintomasTxt || 'não informado'}"
Chips selecionados: ${sintChips.join(', ') || 'nenhum'}
RESTRIÇÕES ALIMENTARES: ${dietChips.join(', ') || 'nenhuma'}
REFEIÇÕES DESEJADAS: ${mealChips.join(', ') || 'não especificado'}
INFORMAÇÕES EXTRAS: ${extras || 'nenhuma'}

ESTRUTURE A RESPOSTA EXATAMENTE ASSIM:

## 🔍 Análise Terapêutica Personalizada
Analise os dados, sintomas${pdfB64 ? ', exame de sangue (cite valores alterados encontrados)' : ''} e correlacione com deficiências nutricionais. Use base científica.

## 📊 Perfil Nutricional Recomendado
- Meta calórica diária (déficit de 500kcal/dia para perda ou manutenção)
- Distribuição ideal de macros (% proteína, carboidrato, gordura)
- Micronutrientes prioritários para os sintomas relatados com justificativa científica

## 🌿 Cardápio Terapêutico Diário
Para CADA refeição solicitada (${mealChips.join(', ')}):
### [Nome da Refeição] — [horário sugerido]
Liste alimentos com quantidades e explique o poder medicinal de cada um. Correlacione diretamente com os sintomas:
- Insônia → fitomelatonina (cereja, kiwi, banana) no jantar/ceia
- Gastrite → repolho, gengibre (dose baixa), aloe vera, evitar ácidos
- Dor de cabeça → magnésio (sementes de abóbora), ômega-3, gengibre
- Fígado alterado → cardo mariano, alcachofra, cúrcuma
- Colesterol → aveia, linhaça, berinjela
- Glicemia → canela, fibras solúveis, índice glicêmico baixo
Respeite TODAS as restrições: ${dietChips.join(', ')}.

## 🍵 Chás e Suplementos Funcionais
4-5 chás/fitoterápicos com evidência científica: mecanismo, preparo, horário, precauções.

## 🏃 Hábitos de Vida Terapêuticos
Exercícios, meditação, higiene do sono, vitamina D, gestão de estresse, hidratação, redução de ultra-processados.

## 📝 Lista de Compras Terapêutica
Por categoria: Frutas, Vegetais, Proteínas, Grãos/Sementes, Gorduras Boas, Temperos Funcionais, Chás.

Escreva de forma acolhedora, clara e científica. Cite mecanismos bioquímicos quando relevante.`;
  };

  const generate = async () => {
    if (!sintomasTxt && sintChips.length === 0) {
      setError('Por favor, descreva seus sintomas ou selecione ao menos um.'); return;
    }
    if (mealChips.length === 0) {
      setError('Selecione ao menos uma refeição desejada.'); setTab(2); return;
    }
    setError('');
    setTab(3);
    setLoading(true);
    setResult('');

    try {
      const messages = [];
      if (pdfB64) {
        messages.push({ role: 'user', content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfB64 } },
          { type: 'text', text: buildPrompt() }
        ]});
      } else {
        messages.push({ role: 'user', content: buildPrompt() });
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4000, messages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Erro ' + res.status);

      const text = data.content.map(c => c.text || '').join('\n');
      setResult(text);
      setResultSubtitle(`Para ${nome || 'você'} · ${peso ? peso + 'kg' : ''} · ${dietChips.slice(0,2).join(', ') || 'Sem restrições'} · ${mealChips.join(', ')}`);
    } catch (e) {
      setTab(2);
      setError('Erro ao gerar cardápio: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (t) => t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^- (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g,'<ul>$&</ul>')
    .replace(/\n\n+/g,'</p><p>')
    .replace(/\n/g,'<br>')
    .replace(/^(?!<[huolp])(.+)/gm,'<p>$1</p>')
    .replace(/<p><\/p>/g,'');

  const sintList = ['🤕 Dor de cabeça','😴 Insônia','🔥 Gastrite / Refluxo','💨 Inchaço / Gases','😰 Ansiedade','😔 Depressão / Humor','🩸 Colesterol alto','🍬 Glicemia elevada','⚡ Cansaço / Fadiga','🫀 Pressão alta','🦴 Dores articulares','🧠 Névoa mental','🌸 TPM / Hormonal','⚖️ Emagrecer','💪 Ganhar massa','🦠 Intestino irregular','🔬 Fígado / Enzimas alt.','🦋 Tireoide'];
  const dietList = ['🌿 Vegano','🥚 Vegetariano','🌾 Sem glúten','🥛 Sem leite e derivados','🫙 Sem lactose','🥗 Low carb','💪 Alto em proteína','🥑 Cetogênico','🌊 Baixo em histamina','🫘 Low FODMAP','🐟 Pescetariano','🩺 Anti-inflamatório'];
  const mealList = ['☀️ Café da manhã','🍎 Lanche da manhã','🍲 Almoço','🫐 Lanche da tarde','🌙 Jantar','🌛 Ceia'];

  return (
    <>
      <Head>
        <title>Nutri Secrets</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        :root{--t:#0ABDC0;--tl:#E0F7F8;--td:#078b8e;--o:#F97316;--ol:#FFF0E6;--od:#d95f0a;--bg:#F4FAFA;--tx:#1a2e2e;--mu:#5a7272;--br:#d0e8e8;--r:16px;--rs:10px}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--tx);min-height:100vh;font-size:14px}
        header{background:linear-gradient(135deg,var(--t),var(--td));box-shadow:0 2px 20px rgba(10,189,192,0.2)}
        .hdr{max-width:1000px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;gap:14px}
        .hdr img{height:52px;width:auto;filter:brightness(0) invert(1)}
        .hdr p{color:rgba(255,255,255,0.85);font-size:0.78rem;font-weight:300;margin-top:2px}
        .tabs{background:white;border-bottom:2px solid var(--br);position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,0.05)}
        .tabs-inner{max-width:1000px;margin:0 auto;display:flex;padding:0 24px;overflow-x:auto}
        .tab{padding:14px 18px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:500;color:var(--mu);cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;transition:all 0.2s;white-space:nowrap;display:flex;align-items:center;gap:6px}
        .tab:hover{color:var(--t)}
        .tab.on{color:var(--t);border-bottom-color:var(--t);font-weight:600}
        .tn{width:20px;height:20px;border-radius:50%;background:var(--tl);color:var(--td);font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center}
        .tab.on .tn{background:var(--t);color:white}
        main{max-width:1000px;margin:0 auto;padding:28px 24px 60px}
        .card{background:white;border-radius:var(--r);padding:26px;box-shadow:0 4px 24px rgba(10,189,192,0.08);margin-bottom:20px;border:1px solid var(--br)}
        .ctitle{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:600;color:var(--tx);margin-bottom:4px}
        .csub{color:var(--mu);font-size:0.8rem;margin-bottom:18px;line-height:1.5}
        label{display:block;font-size:0.82rem;font-weight:600;color:var(--tx);margin-bottom:6px}
        input[type=text],input[type=number],textarea{width:100%;font-family:'DM Sans',sans-serif;font-size:0.88rem;border:1.5px solid var(--br);border-radius:var(--rs);padding:11px 14px;background:white;color:var(--tx);outline:none;resize:vertical;transition:border 0.2s}
        input:focus,textarea:focus{border-color:var(--t);box-shadow:0 0 0 3px rgba(10,189,192,0.12)}
        textarea{min-height:100px}
        .r2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
        @media(max-width:600px){.r2,.r3{grid-template-columns:1fr}}
        .fg{margin-bottom:18px}
        .chips{display:flex;flex-wrap:wrap;gap:8px}
        .chip{display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid var(--br);border-radius:100px;background:white;font-size:0.8rem;font-weight:500;color:var(--mu);cursor:pointer;transition:all 0.2s;user-select:none}
        .chip:hover{border-color:var(--t);color:var(--t);background:var(--tl)}
        .chip.on{border-color:var(--t);background:var(--t);color:white}
        .chip.meal:hover:not(.on){border-color:var(--o);color:var(--o);background:var(--ol)}
        .chip.meal.on{border-color:var(--o);background:var(--o);color:white}
        .upload{border:2.5px dashed var(--br);border-radius:var(--r);padding:32px 24px;text-align:center;cursor:pointer;transition:all 0.25s;background:var(--tl);position:relative}
        .upload:hover,.upload.drag{border-color:var(--t);background:#c8f0f1}
        .upload input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
        .fprev{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--tl);border-radius:var(--rs);border:1.5px solid var(--t);margin-top:14px}
        .nav{display:flex;justify-content:flex-end;gap:10px;margin-top:26px}
        .btn{padding:12px 24px;border-radius:var(--rs);font-family:'DM Sans',sans-serif;font-size:0.88rem;font-weight:600;cursor:pointer;border:none;transition:all 0.2s;display:inline-flex;align-items:center;gap:7px}
        .btn-p{background:linear-gradient(135deg,var(--t),var(--td));color:white;box-shadow:0 4px 14px rgba(10,189,192,0.3)}
        .btn-p:hover{transform:translateY(-1px)}
        .btn-s{background:white;color:var(--mu);border:1.5px solid var(--br)}
        .btn-s:hover{border-color:var(--t);color:var(--t)}
        .btn-o{background:linear-gradient(135deg,var(--o),var(--od));color:white;box-shadow:0 4px 14px rgba(249,115,22,0.3);font-size:0.95rem;padding:14px 32px}
        .btn-o:hover{transform:translateY(-2px)}
        .prog{display:flex;gap:6px;margin-bottom:24px;align-items:center}
        .pstep{display:flex;align-items:center;gap:6px}
        .pdot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;border:2px solid var(--br);color:var(--mu);transition:all 0.3s}
        .pdot.done{background:var(--t);border-color:var(--t);color:white}
        .pdot.act{background:white;border-color:var(--t);color:var(--t);box-shadow:0 0 0 3px rgba(10,189,192,0.18)}
        .plbl{font-size:0.72rem;color:var(--mu);font-weight:500}
        .pline{flex:1;height:2px;background:var(--br);max-width:50px;transition:all 0.3s}
        .pline.done{background:var(--t)}
        .gen{text-align:center;padding:32px 16px}
        .gen h2{font-family:'Playfair Display',serif;font-size:1.5rem;margin-bottom:8px}
        .gen p{color:var(--mu);margin-bottom:24px;font-size:0.87rem}
        .err{background:#fff5f5;border:1.5px solid #fca5a5;border-radius:var(--rs);padding:14px 18px;color:#b91c1c;font-size:0.84rem;margin-top:14px}
        .spin-wrap{display:flex;flex-direction:column;align-items:center;padding:60px 20px;text-align:center}
        .spin{width:48px;height:48px;border:4px solid var(--tl);border-top-color:var(--t);border-radius:50%;animation:sp 0.9s linear infinite;margin-bottom:18px}
        @keyframes sp{to{transform:rotate(360deg)}}
        .spin-wrap h3{font-family:'Playfair Display',serif;font-size:1.1rem;margin-bottom:6px}
        .spin-wrap p{color:var(--mu);font-size:0.82rem}
        .res-hdr{background:linear-gradient(135deg,var(--t),var(--td));border-radius:var(--r);padding:24px 28px;color:white;margin-bottom:20px;display:flex;align-items:center;gap:16px}
        .res-hdr h2{font-family:'Playfair Display',serif;font-size:1.35rem;margin-bottom:3px}
        .res-hdr p{opacity:0.85;font-size:0.82rem}
        .res-body{background:white;border-radius:var(--r);padding:30px;box-shadow:0 4px 24px rgba(10,189,192,0.08);border:1px solid var(--br);font-size:0.9rem;line-height:1.75;color:var(--tx)}
        .res-body h2{font-family:'Playfair Display',serif;font-size:1.2rem;color:var(--td);margin:22px 0 8px;padding-bottom:6px;border-bottom:2px solid var(--tl)}
        .res-body h2:first-child{margin-top:0}
        .res-body h3{font-size:0.95rem;font-weight:700;color:var(--od);margin:16px 0 5px}
        .res-body ul{padding-left:20px;margin:6px 0 12px}
        .res-body li{margin-bottom:4px}
        .res-body strong{color:var(--td)}
        .res-body p{margin-bottom:8px}
        .res-acts{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
        .pbtn{background:white;border:1.5px solid var(--br);color:var(--mu);font-size:0.8rem;padding:9px 16px;border-radius:var(--rs);cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;transition:all 0.2s;display:inline-flex;align-items:center;gap:5px}
        .pbtn:hover{border-color:var(--t);color:var(--t)}
        .disc{background:var(--ol);border-left:4px solid var(--o);border-radius:0 var(--rs) var(--rs) 0;padding:12px 16px;font-size:0.77rem;color:var(--od);margin-top:18px;line-height:1.5}
        @media print{.tabs,.nav,.res-acts,header{display:none!important}.res-body{box-shadow:none;border:none}}
      `}</style>

      <header>
        <div className="hdr">
          <img src="/logo.png" alt="Nutri Secrets" />
          <p>Nutrição terapêutica personalizada com base científica</p>
        </div>
      </header>

      <div className="tabs">
        <div className="tabs-inner">
          {['Dados Pessoais','Sintomas & Exame','Preferências','Meu Cardápio'].map((t,i) => (
            <button key={i} className={`tab${tab===i?' on':''}`} onClick={() => setTab(i)}>
              <span className="tn">{i===3?'✨':i+1}</span> {t}
            </button>
          ))}
        </div>
      </div>

      <main>
        {/* TAB 1 */}
        {tab === 0 && (
          <div>
            <div className="prog">
              <div className="pstep"><div className="pdot act">1</div><span className="plbl">Dados</span></div>
              <div className="pline"></div>
              <div className="pstep"><div className="pdot">2</div><span className="plbl">Sintomas</span></div>
              <div className="pline"></div>
              <div className="pstep"><div className="pdot">3</div><span className="plbl">Preferências</span></div>
              <div className="pline"></div>
              <div className="pstep"><div className="pdot">✨</div><span className="plbl">Cardápio</span></div>
            </div>
            <div className="card">
              <div className="ctitle">👤 Seus Dados Pessoais</div>
              <div className="csub">Usados para calcular suas necessidades calóricas e criar um plano individualizado.</div>
              <div className="r2 fg">
                <div><label>Nome</label><input type="text" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome completo" /></div>
                <div><label>Idade</label><input type="number" value={idade} onChange={e=>setIdade(e.target.value)} placeholder="Ex: 35" /></div>
              </div>
              <div className="r3 fg">
                <div><label>Peso atual (kg)</label><input type="number" value={peso} onChange={e=>setPeso(e.target.value)} placeholder="Ex: 75" /></div>
                <div><label>Altura (cm)</label><input type="number" value={altura} onChange={e=>setAltura(e.target.value)} placeholder="Ex: 170" /></div>
                <div><label>Objetivo de perda (kg)</label><input type="number" value={meta} onChange={e=>setMeta(e.target.value)} placeholder="Ex: 8 ou 0" /></div>
              </div>
              <div className="fg">
                <label>Sexo biológico</label>
                <div className="chips">
                  {['♀️ Feminino','♂️ Masculino'].map(s => (
                    <span key={s} className={`chip${sexo===s?' on':''}`} onClick={() => setSexo(s)}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="fg">
                <label>Nível de atividade física</label>
                <div className="chips">
                  {['😴 Sedentário','🚶 Leve (1-2x/sem)','🏃 Moderado (3-4x/sem)','💪 Intenso (5+/sem)'].map(a => (
                    <span key={a} className={`chip${atv===a?' on':''}`} onClick={() => setAtv(a)}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="nav"><button className="btn btn-p" onClick={() => setTab(1)}>Próximo: Sintomas & Exame →</button></div>
          </div>
        )}

        {/* TAB 2 */}
        {tab === 1 && (
          <div>
            <div className="prog">
              <div className="pstep"><div className="pdot done">✓</div><span className="plbl">Dados</span></div>
              <div className="pline done"></div>
              <div className="pstep"><div className="pdot act">2</div><span className="plbl">Sintomas</span></div>
              <div className="pline"></div>
              <div className="pstep"><div className="pdot">3</div><span className="plbl">Preferências</span></div>
              <div className="pline"></div>
              <div className="pstep"><div className="pdot">✨</div><span className="plbl">Cardápio</span></div>
            </div>
            <div className="card">
              <div className="ctitle">📋 Exame de Sangue (PDF)</div>
              <div className="csub">Opcional. Se enviar, analisaremos glicemia, colesterol, enzimas hepáticas, vitaminas e mais.</div>
              <div className={`upload${drag?' drag':''}`}
                onDragOver={e=>{e.preventDefault();setDrag(true)}}
                onDragLeave={()=>setDrag(false)}
                onDrop={e=>{e.preventDefault();setDrag(false);processFile(e.dataTransfer.files[0])}}>
                <input type="file" accept=".pdf" ref={fileInput} onChange={e=>processFile(e.target.files[0])} />
                <div style={{fontSize:'2rem'}}>📋</div>
                <h3 style={{fontSize:'0.95rem',fontWeight:600,color:'var(--td)',margin:'8px 0 4px'}}>Clique ou arraste seu exame aqui</h3>
                <p style={{fontSize:'0.78rem',color:'var(--mu)'}}>Formato: PDF • Máx 20MB</p>
              </div>
              {pdfB64 && (
                <div className="fprev">
                  <span style={{fontSize:'1.5rem'}}>📄</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:'0.84rem',color:'var(--td)'}}>{pdfName}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--mu)'}}>{pdfSize}</div>
                  </div>
                  <button onClick={()=>{setPdfB64(null);setPdfName('');setPdfSize('');}} style={{background:'none',border:'none',cursor:'pointer',color:'var(--mu)',fontSize:'1.1rem',marginLeft:'auto'}}>✕</button>
                </div>
              )}
            </div>
            <div className="card">
              <div className="ctitle">🩺 Sintomas e Objetivos</div>
              <div className="csub">Descreva o que sente e seus objetivos. Quanto mais detalhes, mais preciso o cardápio.</div>
              <div className="fg">
                <label>Descreva seus sintomas e objetivos *</label>
                <textarea value={sintomasTxt} onChange={e=>setSintomasTxt(e.target.value)} placeholder="Ex: Tenho dor de cabeça frequente, sofro de gastrite há 3 anos, insônia, quero emagrecer..." />
              </div>
              <div className="fg">
                <label>Sintomas comuns (selecione os que se aplicam)</label>
                <div className="chips">
                  {sintList.map(s => (
                    <span key={s} className={`chip${sintChips.includes(s)?' on':''}`} onClick={() => toggleChip(sintChips,setSintChips,s)}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="nav">
              <button className="btn btn-s" onClick={() => setTab(0)}>← Voltar</button>
              <button className="btn btn-p" onClick={() => setTab(2)}>Próximo: Preferências →</button>
            </div>
          </div>
        )}

        {/* TAB 3 */}
        {tab === 2 && (
          <div>
            <div className="prog">
              <div className="pstep"><div className="pdot done">✓</div><span className="plbl">Dados</span></div>
              <div className="pline done"></div>
              <div className="pstep"><div className="pdot done">✓</div><span className="plbl">Sintomas</span></div>
              <div className="pline done"></div>
              <div className="pstep"><div className="pdot act">3</div><span className="plbl">Preferências</span></div>
              <div className="pline"></div>
              <div className="pstep"><div className="pdot">✨</div><span className="plbl">Cardápio</span></div>
            </div>
            <div className="card">
              <div className="ctitle">🌱 Restrições Alimentares</div>
              <div className="csub">Selecione todas que se aplicam. Seu cardápio será 100% adaptado.</div>
              <div className="chips">
                {dietList.map(d => (
                  <span key={d} className={`chip${dietChips.includes(d)?' on':''}`} onClick={() => toggleChip(dietChips,setDietChips,d)}>{d}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ctitle">🍽️ Refeições do Dia</div>
              <div className="csub">Quais refeições deseja incluir no cardápio? Selecione uma ou mais.</div>
              <div className="chips">
                {mealList.map(m => (
                  <span key={m} className={`chip meal${mealChips.includes(m)?' on':''}`} onClick={() => toggleChip(mealChips,setMealChips,m)}>{m}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ctitle">✏️ Observações Adicionais</div>
              <div className="csub">Alimentos que não gosta, alergias, horários, contexto de vida...</div>
              <div className="fg">
                <label>Informações extras (opcional)</label>
                <textarea value={extras} onChange={e=>setExtras(e.target.value)} placeholder="Ex: Não gosto de beterraba. Almoço fora todos os dias. Alergia a frutos do mar..." />
              </div>
            </div>
            <div className="gen">
              <h2>Tudo pronto? ✨</h2>
              <p>Clique abaixo para gerar seu cardápio terapêutico personalizado com base científica.</p>
              <button className="btn btn-o" onClick={generate}>🌿 Gerar Meu Cardápio Terapêutico</button>
              {error && <div className="err">⚠️ {error}</div>}
            </div>
            <div className="nav" style={{justifyContent:'flex-start',marginTop:0}}>
              <button className="btn btn-s" onClick={() => setTab(1)}>← Voltar</button>
            </div>
          </div>
        )}

        {/* TAB 4 */}
        {tab === 3 && (
          <div>
            {loading ? (
              <div className="spin-wrap">
                <div className="spin"></div>
                <h3>Analisando seus dados…</h3>
                <p>Correlacionando exames, sintomas e preferências<br/>com nossa base científica de nutrição terapêutica.</p>
              </div>
            ) : result ? (
              <div>
                <div className="res-hdr">
                  <div style={{fontSize:'2.4rem'}}>🌿</div>
                  <div>
                    <h2>Seu Cardápio Terapêutico Personalizado</h2>
                    <p>{resultSubtitle}</p>
                  </div>
                </div>
                <div className="res-acts">
                  <button className="pbtn" onClick={() => window.print()}>🖨️ Imprimir / Salvar PDF</button>
                  <button className="pbtn" onClick={() => { setResult(''); setTab(0); }}>🔄 Novo cardápio</button>
                </div>
                <div className="res-body" dangerouslySetInnerHTML={{__html: fmt(result)}} />
                <div className="disc">⚠️ <strong>Aviso:</strong> Este cardápio é uma sugestão educativa. Não substitui consulta com médico ou nutricionista.</div>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </>
  );
}
