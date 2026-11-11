/* IELTS C1 Mini App: вся логика в одном файле.
   Данные: words.js (WORDS), reading.js (READING), data.js (LISTENING, WRITING, VT).
   Отдельно: wave.js (фон главной), translate.js (перевод по нажатию в .tr-on).
   Правила интерфейса: «Назад» всегда в шапке Telegram (в браузере кнопка слева сверху),
   главное действие всегда в нижней панели .bar. Ключи localStorage прежние, прогресс не теряется. */

/* ---------- основа ---------- */
const tg=window.Telegram&&window.Telegram.WebApp;
const inTG=!!(tg&&tg.platform&&tg.platform!=='unknown');
const ver=v=>!!(tg&&tg.isVersionAtLeast&&tg.isVersionAtLeast(v));
if(tg){
 tg.ready();tg.expand();
 try{if(ver('6.1')){tg.setHeaderColor('bg_color');tg.setBackgroundColor('bg_color')}}catch(e){}
 try{if(ver('7.7'))tg.disableVerticalSwipes()}catch(e){} // свайп вниз не закрывает приложение во время прокрутки
}
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const app=$('#app');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const plural=(n,a,b,c)=>{const m=n%100,k=n%10;return m>10&&m<20?c:k===1?a:k>=2&&k<=4?b:c};
const today=()=>Math.floor(Date.now()/86400000);
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const store=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const mmss=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
// вибро-отклик: 'success' | 'error' | 'light' | 'sel'
function hap(t){try{const h=tg&&ver('6.1')&&tg.HapticFeedback;if(!h)return;
 if(t==='light')h.impactOccurred('light');else if(t==='sel')h.selectionChanged();else h.notificationOccurred(t)}catch(e){}}
function copy(text,ok,fail){
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(ok,fail);else fail();
}

const ICON=(()=>{
 const s=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
 return {
  cards:s('<rect x="3" y="7" width="13" height="14" rx="3"/><path d="M8 3h10a3 3 0 0 1 3 3v11"/>'),
  quiz:s('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>'),
  words:s('<rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7.5 14h9"/>'),
  sentence:s('<path d="M4 6h16M4 12h16M4 18h10"/>'),
  reading:s('<path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z"/>'),
  listening:s('<path d="M3 15v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="14" width="4" height="7" rx="2"/><rect x="17" y="14" width="4" height="7" rx="2"/>'),
  writing:s('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  gear:s('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  speaker:s('<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'),
  play:s('<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>'),
  arrow:s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  check:s('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  cross:s('<path d="M7 7l10 10M17 7 7 17"/>'),
  eye:s('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  eyeOff:s('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/>'),
  home:s('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
  chart:s('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>')
 };
})();

/* ---------- навигация ---------- */
// screen(html, {back, bar, tab}): back — куда ведёт «Назад», bar — кнопки нижней панели, tab — вкладка снизу
let backFn=null;
function screen(html,o={}){
 stopAudio();
 backFn=o.back||null;
 app.innerHTML=(backFn&&!inTG?'<button class="back" id="bk">Назад</button>':'')+html+
  `<div class="bar" id="bar">${o.bar||''}</div>`+(o.tab?tabBar(o.tab):'');
 if(backFn&&!inTG)$('#bk').onclick=goBack;
 syncBack();
 if(o.tab)bindTabs();
 window.scrollTo(0,0);
 app.style.animation='none';void app.offsetWidth;app.style.animation='';
}
const setBar=html=>{$('#bar').innerHTML=html};
function syncBack(){
 if(!inTG||!ver('6.1'))return;
 (backFn||$('.sheet.open'))?tg.BackButton.show():tg.BackButton.hide();
}
function goBack(){
 const sh=$('.sheet.open');
 if(sh){sh.classList.remove('open');syncBack();return}
 if(backFn)backFn();
}
if(inTG&&ver('6.1'))tg.BackButton.onClick(goBack);
const tabBar=on=>`<div class="tabs-sp"></div><nav class="tabs"><button class="${on==='home'?'on':''}" id="tb-home">${ICON.home}<span>Главная</span></button><button class="${on==='stats'?'on':''}" id="tb-stats">${ICON.chart}<span>Статистика</span></button></nav>`;
function bindTabs(){$('#tb-home').onclick=()=>{hap('sel');home()};$('#tb-stats').onclick=()=>{hap('sel');stats()}}
const head=(title,right='')=>`<div class="head"><h1>${title}</h1>${right}</div>`;
const steps=(i,n,extra='')=>`<div class="step"><span>${i+1} из ${n}</span><span>${extra}</span></div><div class="prog"><div style="width:${i/n*100}%"></div></div>`;
const resultCard=(n,total,text)=>`<div class="res-card"><div class="res-num">${n}<span>/${total}</span></div><div class="res-t">${text}</div></div>`;

/* ---------- голос ---------- */
// ctx 'c': карточки, квиз, слова (ключ ielts_voice); 'l': Listening (ключ ielts_voice_listening)
const vkey=ctx=>ctx==='l'?'ielts_voice_listening':'ielts_voice';
function enVoices(){return (window.speechSynthesis?speechSynthesis.getVoices():[]).filter(v=>v.lang&&v.lang.toLowerCase().startsWith('en'))}
function voiceScore(v){let s=0;const n=v.name;
 if(/natural|neural|online/i.test(n))s+=100;
 if(/premium|enhanced|siri/i.test(n))s+=60;
 if(/google/i.test(n))s+=30;
 if(/en[-_]GB/i.test(v.lang))s+=10;
 if(/\b(david|zira|mark|hazel|george)\b/i.test(n)&&!/online|natural/i.test(n))s-=20;
 return s}
function pickVoice(ctx){const vs=enVoices();if(!vs.length)return null;
 let saved='';try{saved=localStorage.getItem(vkey(ctx))||''}catch(e){}
 return vs.find(v=>v.name===saved)||vs.slice().sort((a,b)=>voiceScore(b)-voiceScore(a))[0]}
function speakAll(text,onEnd,ctx='c'){
 if(!window.speechSynthesis){onEnd&&onEnd(false);return}
 speechSynthesis.cancel();
 const parts=text.match(/[^.!?]+[.!?]+/g)||[text];
 const v=pickVoice(ctx);
 parts.forEach((p,i)=>{
  const u=new SpeechSynthesisUtterance(p.trim());u.lang=v?v.lang:'en-GB';u.rate=.95;if(v)u.voice=v;
  if(i===parts.length-1){u.onend=()=>onEnd&&onEnd(true);u.onerror=()=>onEnd&&onEnd(true)}
  speechSynthesis.speak(u);
 });
}
const speak=t=>speakAll(t,null,'c');
function stopAudio(){if(window.speechSynthesis)speechSynthesis.cancel()}
function voiceSelect(sel,ctx){
 const fill=()=>{const vs=enVoices().sort((a,b)=>voiceScore(b)-voiceScore(a));
  if(!vs.length){sel.innerHTML='<option>Голоса не найдены</option>';return}
  const cur=pickVoice(ctx);
  sel.innerHTML=vs.map(v=>`<option value="${esc(v.name)}"${cur&&v.name===cur.name?' selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')};
 fill();
 if(window.speechSynthesis)speechSynthesis.addEventListener('voiceschanged',fill);
 sel.onchange=()=>{try{localStorage.setItem(vkey(ctx),sel.value)}catch(e){}};
}

/* ---------- прогресс ---------- */
const INT=[0,1,2,4,8,16]; // интервалы повторения в днях
let srs=load('ielts_c1_srs_v1',{});      // фразы
let vsrs=load('ielts_vocab_srs_v1',{});  // слова
let prog=load('ielts_c1_prog_v1',{});    // Reading, Listening, Writing: s = p (начато) | g (без ошибок) | r (есть ошибки)
let LOG=load('ielts_log_v1',{});         // журнал по дням для статистики
const topics=[...new Set(WORDS.map(w=>w.topic))];
let topic='all';
const pool=()=>WORDS.filter(w=>topic==='all'||w.topic===topic);

const VOCAB=[];VT.forEach(([t,a])=>a.forEach(([en,pos,ru])=>VOCAB.push({id:'v'+(VOCAB.length+1),topic:t,en,pos,ru:ru.split('|')})));
const vpool=()=>VOCAB.filter(w=>topic==='all'||w.topic===topic);
const POS={n:'noun',v:'verb',adj:'adjective',adv:'adverb'};

const dkey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
// k: c карточка, q вопрос квиза, v слово, s предложение (числа); r, l, w — id заданий (списки)
function logAct(k,n=1,extra){
 const key=dkey(new Date()),d=LOG[key]=LOG[key]||{};
 if(Array.isArray(n)){d[k]=d[k]||[];if(!d[k].includes(n[0]))d[k].push(n[0])}
 else d[k]=(d[k]||0)+n;
 if(extra)d[extra]=(d[extra]||0)+1;
 store('ielts_log_v1',LOG);
}
function rate(id,good,fromCards){
 const e=srs[id]||{b:0};
 e.b=good?Math.min(5,e.b+1):0;e.d=today()+INT[e.b];e.r=good?'g':'r';
 srs[id]=e;store('ielts_c1_srs_v1',srs);
 if(fromCards)logAct('c');
}
function vrate(id,good){
 const e=vsrs[id]||{b:0};
 e.b=good?Math.min(5,e.b+1):0;e.d=today()+INT[e.b];
 vsrs[id]=e;store('ielts_vocab_srs_v1',vsrs);
 logAct('v',1,good?'vok':null);
}
function setProg(id,s,sc,tot){
 if(s==='g'||(s==='r'&&id[0]!=='w'))logAct(id[0],[id]); // Writing засчитывается только от 250 слов
 prog[id]={s,sc,tot};store('ielts_c1_prog_v1',prog);
}
const doneOf=list=>list.filter(x=>(prog[x.id]||{}).s==='g').length;
function vstats(){
 const t=today(),p=vpool(),has=w=>vsrs[w.id];
 return {due:p.filter(w=>has(w)&&vsrs[w.id].d<=t).length,fresh:p.filter(w=>!has(w)).length,
  learned:p.filter(w=>has(w)&&vsrs[w.id].b>=1).length,total:p.length};
}

/* ---------- главная ---------- */
function ring(part,total){
 const r=30,c=2*Math.PI*r,f=total?part/total:0;
 return `<svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="${r}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="7"/>
  <circle cx="36" cy="36" r="${r}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-f)}"/></svg>`;
}
function home(){
 const t=today(),p=pool();
 const due=p.filter(w=>srs[w.id]&&srs[w.id].d<=t).length;
 const known=p.filter(w=>srs[w.id]&&srs[w.id].b>=3).length;
 const fresh=p.filter(w=>!srs[w.id]).length;
 const v=vstats();
 const tile=(id,ic,c,title,sub,cls='')=>`<button class="tile ${cls}" id="${id}" style="--c:${c}"><span class="ico">${ICON[ic]}</span><span><b>${title}</b><small>${sub}</small></span></button>`;
 const rt=remindTimes();
 screen(`
 <div class="head"><div style="flex:1"><h1>IELTS C1</h1><div class="sub">Тренажёр фраз и слов</div></div><button class="ibtn" id="set" aria-label="Настройки">${ICON.gear}</button></div>
 <div class="hero">
  <div class="cap">${ICON.cards}Карточки</div>
  <div class="row1"><div><div class="big">${due}</div><div class="lbl">${due?plural(due,'фраза ждёт','фразы ждут','фраз ждут')+' повтора':'Повторов на сегодня нет'}</div></div>
   <div class="ring">${ring(known,p.length)}<span>${known}<small>из ${p.length}</small></span></div></div>
  <div class="meta"><span>${fresh} новых</span><span>${known} выучено</span></div>
  <button class="go" id="b1">${due?'Повторить':'Учить новые'} ${ICON.arrow}</button>
 </div>
 <div class="chips">${['all',...topics].map(x=>`<button class="chip${x===topic?' on':''}" data-t="${esc(x)}">${x==='all'?'Все темы':esc(x)}</button>`).join('')}</div>
 <h2>Лексика</h2>
 <div class="grid g2">
  ${tile('b6','words','#ff9f43','Слова',v.due?v.due+' на повтор':v.fresh+' новых')}
  ${tile('b7','sentence','#ff5fa2','Предложения',v.learned?v.learned+' '+plural(v.learned,'слово','слова','слов'):'Сначала угадай слова')}
  ${tile('b2','quiz','#2ecc71','Квиз','10 вопросов, четыре варианта ответа','wide')}
 </div>
 <h2>Экзамен</h2>
 <div class="grid">
  ${tile('b3','reading','#3fa9ff','Reading',doneOf(READING)+' из '+READING.length)}
  ${tile('b4','listening','#ff5fa2','Listening',doneOf(LISTENING)+' из '+LISTENING.length)}
  ${tile('b5','writing','#9b5cff','Writing',doneOf(WRITING)+' из '+WRITING.length)}
 </div>
 <div class="sheet" id="sh"><div class="bg"></div><div class="body"><div class="grab"></div>
  <h2>Голос для слов и карточек</h2>
  <div class="field"><select id="vs"></select><button class="ibtn" id="vt" aria-label="Послушать">${ICON.speaker}</button></div>
  <h2>Голос для Listening</h2>
  <div class="field"><select id="vsl"></select><button class="ibtn" id="vtl" aria-label="Послушать">${ICON.speaker}</button></div>
  <h2>Напоминания</h2>
  <button class="sec rbtn" id="rmb"><span>${rt.length?rt.join(', '):'Выключены'}</span>${ICON.arrow}</button>
  <p class="tag" style="margin-top:14px">Карточки и слова возвращаются через 1, 2, 4, 8 и 16 дней. После ошибки снова появятся сегодня.</p>
  <div class="row"><button class="pri" id="shc">Готово</button></div>
 </div></div>`,{tab:'home'});
 $$('.chip').forEach(b=>b.onclick=()=>{hap('sel');topic=b.dataset.t;const x=$('.chips').scrollLeft;home();$('.chips').scrollLeft=x});
 $('#b1').onclick=cards;$('#b2').onclick=quiz;$('#b6').onclick=words;$('#b7').onclick=sentencesHome;
 $('#b3').onclick=readingList;$('#b4').onclick=listeningList;$('#b5').onclick=writingList;
 const sh=$('#sh'),close=()=>{sh.classList.remove('open');syncBack()};
 $('#set').onclick=()=>{hap('light');sh.classList.add('open');syncBack()};
 sh.querySelector('.bg').onclick=close;$('#shc').onclick=close;
 $('#rmb').onclick=()=>remind(home);
 voiceSelect($('#vs'),'c');voiceSelect($('#vsl'),'l');
 const sample="This is how the recording will sound. The deadline is the fourteenth of December.";
 $('#vt').onclick=()=>speakAll(sample,null,'c');$('#vtl').onclick=()=>speakAll(sample,null,'l');
}

/* ---------- карточки ---------- */
function cards(){
 const t=today(),p=pool();
 const q=shuffle(p.filter(w=>srs[w.id]&&srs[w.id].d<=t)).concat(shuffle(p.filter(w=>!srs[w.id])).slice(0,10));
 if(!q.length){
  screen(head('На сегодня всё')+`<p class="tag">В этой теме нет карточек на повтор. Выбери другую тему или пройди квиз.</p>`,
   {back:home,bar:'<button id="qz">Квиз</button>'});
  $('#qz').onclick=quiz;return;
 }
 let i=0,good=0;
 const show=()=>{
  if(i>=q.length){
   hap('success');
   screen(resultCard(good,q.length,good===q.length?'Всё помнишь':'Забытые фразы вернутся сегодня'),{back:home,bar:'<button id="again">Ещё раз</button>'});
   $('#again').onclick=cards;return;
  }
  const w=q[i],r=(srs[w.id]||{}).r||'';
  screen(steps(i,q.length,esc(w.topic))+
   `<div class="card tap" id="cd"><span class="dot ${r}" title="Прошлый ответ"></span><button class="spk" id="sp" aria-label="Слушать">${ICON.speaker}</button>
    <div class="en">${esc(w.en)}</div><div class="ru hid" id="ru">${esc(w.ru)}</div></div>
    <p class="tag center" id="hint">Нажми на карточку, чтобы увидеть перевод</p>`,
   {back:home,bar:'<button id="rv">Показать перевод</button>'});
  let open=false;
  const reveal=()=>{if(open)return;open=true;hap('light');$('#ru').classList.remove('hid');$('#hint').style.visibility='hidden';
   setBar('<button class="bad" id="no">Не помню</button><button class="ok" id="yes">Помню</button>');
   $('#no').onclick=()=>{rate(w.id,false,true);i++;show()};
   $('#yes').onclick=()=>{rate(w.id,true,true);good++;i++;show()};
  };
  $('#sp').onclick=e=>{e.stopPropagation();speak(w.en)};
  $('#cd').onclick=reveal;$('#rv').onclick=reveal;
 };
 show();
}

/* ---------- квиз ---------- */
function quiz(){
 const p=shuffle(pool()).slice(0,10);
 let i=0,score=0;
 const next=()=>{
  if(i>=p.length){
   hap('success');
   screen(resultCard(score,p.length,score===p.length?'Без ошибок':'Фразы с ошибками попадут в сегодняшние карточки'),{back:home,bar:'<button id="again">Ещё раунд</button>'});
   $('#again').onclick=quiz;return;
  }
  const w=p[i],dir=Math.random()<.5;
  const q=dir?w.en:w.ru,ans=dir?w.ru:w.en;
  const others=shuffle(WORDS.filter(x=>x.id!==w.id&&x.topic===w.topic)).slice(0,3).map(x=>dir?x.ru:x.en);
  const opts=shuffle([ans,...others]);
  screen(steps(i,p.length)+`<div class="card" style="min-height:130px"><div class="en">${esc(q)}</div></div>`+
   opts.map((o,k)=>`<button class="opt" data-k="${k}">${esc(o)}</button>`).join(''),{back:home});
  $$('.opt').forEach(b=>b.onclick=()=>{
   const ok=opts[+b.dataset.k]===ans;
   $$('.opt').forEach(x=>{x.disabled=true;if(opts[+x.dataset.k]===ans)x.classList.add('right')});
   if(ok){score++;hap('success')}else{b.classList.add('wrong');rate(w.id,false);hap('error')}
   logAct('q',1,ok?'qok':null);
   if(dir||!ok)speak(w.en);
   setBar(`<button id="nx">${i+1<p.length?'Дальше':'Итоги'}</button>`);$('#nx').onclick=()=>{i++;next()};
  });
 };
 next();
}

/* ---------- слова ---------- */
// Регистр, ё/е и знаки не важны. Несколько вариантов через запятую. В слове от 5 букв одна опечатка засчитывается.
const vnorm=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9-]+/g,' ').trim();
function lev(a,b){
 if(Math.abs(a.length-b.length)>1)return 2;
 let prev=[...Array(b.length+1).keys()];
 for(let i=1;i<=a.length;i++){const cur=[i];
  for(let j=1;j<=b.length;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur}
 return prev[b.length];
}
function vcheck(input,w){
 const parts=String(input||'').split(/[,;\/]/).map(vnorm).filter(Boolean),ans=w.ru.map(vnorm);
 if(parts.some(p=>ans.includes(p)))return 'ok';
 if(parts.some(p=>ans.some(a=>a.length>=5&&lev(p,a)===1)))return 'typo';
 return '';
}
function words(){
 const t=today(),p=vpool();
 let q=shuffle(p.filter(w=>vsrs[w.id]&&vsrs[w.id].d<=t)).concat(shuffle(p.filter(w=>!vsrs[w.id]))).slice(0,10);
 if(!q.length)q=shuffle(p).slice(0,10); // всё выучено: случайный повтор
 let i=0,score=0;const miss=[],got=[];
 const next=()=>{
  if(i>=q.length){
   hap('success');
   screen(resultCard(score,q.length,score===q.length?'Без ошибок':'Слова с ошибками будут в следующем раунде')+
    (miss.length?`<h2>Повтори</h2><div class="miss">${miss.map(w=>`<div><b>${esc(w.en)}</b><span>${esc(w.ru[0])}</span></div>`).join('')}</div>`:'')+
    (got.length?`<p class="tag" style="margin-top:14px">Составь предложения с угаданными словами, так они лучше запомнятся.</p>`:''),
    {back:home,bar:`<button class="sec" id="again">Ещё раунд</button>${got.length?'<button id="sen">Предложения</button>':''}`});
   $('#again').onclick=words;
   if(got.length)$('#sen').onclick=()=>sentences(shuffle(got),words);
   return;
  }
  const w=q[i];let done=false;
  screen(steps(i,q.length,esc(w.topic))+
   `<div class="card wcard"><button class="spk" id="sp" aria-label="Слушать">${ICON.speaker}</button><span class="pos">${POS[w.pos]||w.pos}</span><div class="en">${esc(w.en)}</div></div>
   <input id="wi" class="winput" placeholder="Перевод на русском" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">
   <div id="fb" class="fb"></div>`,
   {back:home,bar:'<button class="sec" id="dk">Не знаю</button><button id="ck">Проверить</button>'});
  const inp=$('#wi');inp.focus();
  $('#sp').onclick=()=>speak(w.en);
  const finish=res=>{
   done=true;inp.disabled=true;
   const others=w.ru.slice(1).join(', '),fb=$('#fb');
   if(res){
    score++;got.push(w);vrate(w.id,true);hap('success');fb.className='fb ok';
    fb.innerHTML=res==='typo'?`<b>Засчитано, но с опечаткой.</b> Правильно «${esc(w.ru[0])}».`:`<b>Верно.</b>${others?' Ещё варианты: '+esc(others)+'.':''}`;
   }else{
    vrate(w.id,false);miss.push(w);hap('error');fb.className='fb bad';
    fb.innerHTML=`<b>Правильно «${esc(w.ru[0])}».</b>${others?'<br>Ещё варианты: '+esc(others)+'.':''}`;
   }
   setBar(`<button id="ck">${i+1<q.length?'Дальше':'Итоги'}</button>`);$('#ck').onclick=go;
   speak(w.en);
  };
  const go=()=>{
   if(done){i++;next();return}
   if(!inp.value.trim()){inp.focus();inp.classList.remove('shake');void inp.offsetWidth;inp.classList.add('shake');hap('error');return}
   finish(vcheck(inp.value,w));
  };
  $('#ck').onclick=go;$('#dk').onclick=()=>{if(!done)finish('')};
  inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();go()}};
  document.onkeydown=e=>{if(done&&e.key==='Enter'&&$('#wi')){e.preventDefault();go()}};
 };
 next();
}

/* ---------- предложения ---------- */
// Приложение проверяет только слово (в любой форме) и длину. Грамматику проверяет Claude: предложения копируются одной кнопкой.
const MIN_WORDS=6;
function hasWord(text,en){
 const z=s=>s.toLowerCase().replace(/s/g,'z'),t=z(text);
 if(/[\s-]/.test(en))return t.replace(/-/g,' ').includes(z(en).replace(/-/g,' '));
 let stem=z(en);
 if(stem.length>4)stem=stem.replace(/z$/,'').replace(/[ey]$/,'');
 return (t.match(/[a-z']+/g)||[]).some(x=>x.startsWith(stem)&&x.length<=stem.length+5);
}
function sentences(q,more){
 let i=0;const out=[];
 const next=()=>{
  if(i>=q.length){
   screen(head('Твои предложения')+(out.length?
    `<div class="miss sent">${out.map(s=>`<div><b>${esc(s.w.en)}</b><span>${esc(s.text)}</span></div>`).join('')}</div>
     <p class="tag" style="margin-top:12px">Скопируй и вставь в чат с Claude. Он найдёт ошибки и предложит исправления.</p><div id="fb" class="fb"></div>`
    :`<p class="tag">Ты пропустил все слова.</p>`),
    {back:home,bar:`<button class="sec" id="mr">${more===words?'Ещё слова':'Ещё'}</button>${out.length?'<button id="cp">Скопировать для Claude</button>':''}`});
   $('#mr').onclick=more;
   if(out.length)$('#cp').onclick=()=>{
    const text='Проверь мои предложения на английском. Для каждого назови ошибки и дай исправленный вариант.\n\n'+out.map((s,k)=>`${k+1}. ${s.w.en}\n${s.text}`).join('\n\n');
    copy(text,()=>{hap('success');$('#fb').className='fb ok';$('#fb').textContent='Скопировано. Вставь в чат с Claude.'},
     ()=>{$('#fb').className='fb bad';$('#fb').textContent='Не получилось скопировать. Выдели текст вручную.'});
   };
   return;
  }
  const w=q[i];
  screen(steps(i,q.length)+
   `<div class="card wcard"><span class="pos">${POS[w.pos]||w.pos}</span><div class="en">${esc(w.en)}</div>
    <div class="tr"><span class="tx hid" id="tx">${esc(w.ru.join(', '))}</span><button class="eye" id="ey" aria-label="Показать перевод">${ICON.eye}</button></div></div>
   <textarea id="si" class="winput sinput" placeholder="Напиши предложение на английском" autocapitalize="sentences" spellcheck="true"></textarea>
   <div id="fb" class="fb"></div>`,
   {back:home,bar:`<button class="sec" id="sk">Пропустить</button><button id="ok">${i+1<q.length?'Дальше':'Готово'}</button>`});
  const tx=$('#tx'),ey=$('#ey'),inp=$('#si');
  const toggle=()=>{const hid=tx.classList.toggle('hid');ey.innerHTML=hid?ICON.eye:ICON.eyeOff;ey.setAttribute('aria-label',hid?'Показать перевод':'Скрыть перевод')};
  ey.onclick=toggle;tx.onclick=()=>{if(tx.classList.contains('hid'))toggle()};
  inp.focus();
  $('#sk').onclick=()=>{i++;next()};
  $('#ok').onclick=()=>{
   const text=inp.value.trim().replace(/\s+/g,' '),n=(text.match(/[A-Za-z']+/g)||[]).length,fb=$('#fb');
   fb.className='fb bad';
   if(!hasWord(text,w.en)){hap('error');fb.innerHTML=`<b>Нет слова «${esc(w.en)}».</b> Подойдёт любая его форма.`;return}
   if(n<MIN_WORDS){hap('error');fb.innerHTML=`<b>Нужно хотя бы ${MIN_WORDS} слов.</b> Сейчас ${n}.`;return}
   hap('success');out.push({w,text});logAct('s');i++;next();
  };
 };
 next();
}
function sentencesHome(){
 const l=vpool().filter(w=>vsrs[w.id]&&vsrs[w.id].b>=1); // последний ответ был верным
 if(!l.length){
  screen(head('Пока нет слов')+`<p class="tag">Угадай несколько слов в разделе «Слова», и они появятся здесь.</p>`,{back:home,bar:'<button id="tw">К словам</button>'});
  $('#tw').onclick=words;return;
 }
 sentences(shuffle(l).slice(0,5),sentencesHome);
}

/* ---------- списки заданий ---------- */
const LV={C2:6,C1:5,B2:4,B1:3,A2:2,A1:1};
const sortedIdx=arr=>arr.map((x,i)=>i).sort((a,b)=>(LV[arr[b].level]||0)-(LV[arr[a].level]||0)||a-b);
const lvBadge=it=>it.level?`<span class="lv">${it.level}</span>`:'';
function itemRow(it,k){
 const p=prog[it.id]||{},s=p.s||'';
 return `<button class="item" data-k="${k}"><span class="ic ${s}">${s==='g'?ICON.check:s==='r'?ICON.cross:''}</span><span class="t">${esc(it.title)}</span>${p.tot?`<span class="sc">${p.sc}/${p.tot}</span>`:''}${lvBadge(it)}</button>`;
}
function list(title,sub,items,open){
 screen(head(title)+`<p class="tag">${sub}</p>`+items.map(([it,k])=>itemRow(it,k)).join(''),{back:home});
 $$('.item').forEach(b=>b.onclick=()=>open(+b.dataset.k));
}
const ANS={T:'True',F:'False',NG:'Not Given'};
const TR_HINT='<p class="tag" style="margin-top:8px">Нажми на слово, чтобы увидеть перевод. Для фразы зажми первое слово и нажми последнее.</p>';

/* ---------- Reading ---------- */
function readingList(){list('Reading','True, False или Not Given. Сложные тексты сверху, около 10 минут на текст.',sortedIdx(READING).map(k=>[READING[k],k]),reading)}
function reading(k){
 const r=READING[k],ans=r.questions.map(()=>null),t0=Date.now();
 if(!prog[r.id]||!prog[r.id].s)setProg(r.id,'p');
 screen(head(esc(r.title),lvBadge(r)+'<span class="pill" id="timer">00:00</span>')+
  `<div class="passage tr-on">${r.text.map(p=>`<p>${esc(p)}</p>`).join('')}</div>${TR_HINT}`+
  r.questions.map((q,i)=>`<div class="q"><div class="st">${i+1}. ${esc(q.s)}</div>
   <div class="seg" data-i="${i}">${Object.keys(ANS).map(v=>`<button data-v="${v}">${ANS[v]}</button>`).join('')}</div>
   <div class="exp" id="e${i}"></div></div>`).join('')+'<div id="res"></div>',
  {back:readingList,bar:'<button id="ck">Проверить</button>'});
 const tick=setInterval(()=>{const el=$('#timer');if(!el){clearInterval(tick);return}el.textContent=mmss(Math.floor((Date.now()-t0)/1000))},500);
 $$('.seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{
  if(sg.dataset.lock)return;hap('sel');
  ans[+sg.dataset.i]=b.dataset.v;sg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
 }));
 $('#ck').onclick=()=>{
  const left=ans.filter(a=>!a).length;
  if(left&&!$('#ck').dataset.sure){$('#ck').dataset.sure=1;$('#ck').textContent=`Без ответа ${left}. Проверить?`;hap('error');return}
  clearInterval(tick);let s=0;
  r.questions.forEach((q,i)=>{
   const ok=ans[i]===q.a;if(ok)s++;
   const e=$('#e'+i);e.className='exp '+(ok?'ok':'bad');
   e.innerHTML=`${ok?`Верно, <b>${ANS[q.a]}</b>.`:`Неверно. Правильно <b>${ANS[q.a]}</b>.`} ${esc(q.why)}`;
  });
  $$('.seg').forEach(sg=>sg.dataset.lock=1);
  setProg(r.id,s===r.questions.length?'g':'r',s,r.questions.length);
  hap(s===r.questions.length?'success':'error');
  const sec=Math.floor((Date.now()-t0)/1000);
  $('#res').innerHTML=resultCard(s,r.questions.length,`Время ${Math.floor(sec/60)} мин ${sec%60} с`)+
   '<p class="tag" style="margin-top:10px">False: текст прямо противоречит. Not Given: в тексте об этом ничего нет.</p>';
  setBar('<button id="nx">К списку текстов</button>');$('#nx').onclick=readingList;
  $('#res').scrollIntoView({behavior:'smooth'});
 };
}

/* ---------- Listening ---------- */
const normA=s=>String(s||'').trim().toLowerCase().replace(/[.\s]+$/,'');
function listeningList(){list('Listening','Запись звучит один раз, включи звук. Голос меняется в настройках на главной.',sortedIdx(LISTENING).map(k=>[LISTENING[k],k]),listening)}
function listening(k){
 const L=LISTENING[k],picks=L.questions.map(()=>null);
 if(!prog[L.id]||!prog[L.id].s)setProg(L.id,'p');
 const qs=L.questions.map((q,i)=>{
  if(q.o)return `<div class="q"><div class="st">${i+1}. ${esc(q.s)}</div><div class="seg col" data-i="${i}">${q.o.map((o,j)=>`<button data-v="${j}">${'ABC'[j]}. ${esc(o)}</button>`).join('')}</div><div class="exp" id="le${i}"></div></div>`;
  const [a,b]=q.s.split('____');
  return `<div class="q"><div class="st">${i+1}. ${esc(a)}<input class="gap" id="li${i}" autocomplete="off" autocapitalize="off">${esc(b||'')}</div><div class="exp" id="le${i}"></div></div>`;
 }).join('');
 screen(head(esc(L.title),lvBadge(L))+
  `<div class="player"><button id="pl" aria-label="Включить запись">${ICON.play}</button><p class="tag" id="st">Нажми, чтобы включить запись. Она звучит один раз.</p></div>${qs}<div id="res"></div>`,
  {back:listeningList,bar:'<button id="ck">Проверить</button>'});
 $$('.seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{
  if(sg.dataset.lock)return;hap('sel');
  picks[+sg.dataset.i]=+b.dataset.v;sg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
 }));
 $('#pl').onclick=()=>{
  hap('light');$('#pl').disabled=true;$('#st').textContent='Идёт запись';
  speakAll(L.script,ok=>{const st=$('#st');if(st)st.textContent=ok?'Запись закончена.':'Озвучка недоступна на этом устройстве. Открой тренажёр в браузере.'},'l');
 };
 $('#ck').onclick=()=>{
  stopAudio();let s=0;
  L.questions.forEach((q,i)=>{
   let ok,right;
   if(q.o){ok=picks[i]===q.a;right='ABC'[q.a]+'. '+q.o[q.a]}
   else{const inp=$('#li'+i);ok=q.a.includes(normA(inp.value));right=q.a[0];inp.disabled=true}
   if(ok)s++;
   const e=$('#le'+i);e.className='exp '+(ok?'ok':'bad');e.textContent=ok?'Верно':'Неверно. Правильно: '+right;
  });
  $$('.seg').forEach(sg=>sg.dataset.lock=1);$('#pl').disabled=true;
  setProg(L.id,s===L.questions.length?'g':'r',s,L.questions.length);
  hap(s===L.questions.length?'success':'error');
  $('#res').innerHTML=resultCard(s,L.questions.length,s===L.questions.length?'Без ошибок':'Ниже текст записи')+
   `<h2>Текст записи</h2><div class="passage tr-on"><p>${esc(L.script)}</p></div>${TR_HINT}`;
  setBar('<button id="nx">К списку записей</button>');$('#nx').onclick=listeningList;
  $('#res').scrollIntoView({behavior:'smooth'});
 };
}

/* ---------- Writing ---------- */
function writingList(){list('Writing: Task 2','Эссе от 250 слов за 40 минут. Готовый текст скопируй в чат с Claude, он оценит его по критериям IELTS.',WRITING.map((w,k)=>[{id:w.id,title:w.topic+': '+w.title},k]),writing)}
function writing(k){
 const w=WRITING[k],key='ielts_c1_essay_'+k;
 const hints=shuffle(WORDS.filter(x=>x.topic===w.topic)).slice(0,6);
 let saved='';try{saved=localStorage.getItem(key)||''}catch(e){}
 if(!prog[w.id]||!prog[w.id].s)setProg(w.id,'p');
 screen(head(esc(w.title),'<span class="pill" id="timer">40:00</span>')+
  `<div class="passage"><p>${esc(w.prompt)}</p><p class="tag">Write at least 250 words.</p></div>
  <details><summary>Фразы по теме</summary><div class="hints" style="margin-top:10px">${hints.map(h=>`<p><b>${esc(h.en)}</b><br><span class="tag">${esc(h.ru)}</span></p>`).join('')}</div></details>
  <h2>Твоё эссе</h2>
  <textarea id="essay" class="winput essay" placeholder="Start writing here..."></textarea>
  <p id="wc" class="tag" style="margin-top:6px"></p><div id="fb" class="fb"></div>
  <details><summary>Проверь перед сдачей</summary>
   <label><input type="checkbox"> Ответил на все части вопроса</label>
   <label><input type="checkbox"> Вступление, 2 основных абзаца и вывод</label>
   <label><input type="checkbox"> 4 или 5 фраз из списка</label>
   <label><input type="checkbox"> Времена, артикли и предлоги</label></details>`,
  {back:writingList,bar:'<button class="sec" id="cp">Скопировать</button><button id="fin">Завершить</button>'});
 const ta=$('#essay'),fb=$('#fb');ta.value=saved;
 const count=()=>{const n=ta.value.trim().split(/\s+/).filter(Boolean).length;$('#wc').textContent=n+' '+plural(n,'слово','слова','слов')+(n<250?', до 250 осталось '+(250-n):'');return n};
 count();
 ta.oninput=()=>{count();try{localStorage.setItem(key,ta.value)}catch(e){}};
 const finish=()=>{
  const n=count();
  if(n>=250){setProg(w.id,'g',n,250);hap('success');fb.className='fb ok';fb.textContent='Готово, '+n+' '+plural(n,'слово','слова','слов')+'. Скопируй эссе в чат с Claude.'}
  else{setProg(w.id,'r',n,250);hap('error');fb.className='fb bad';fb.textContent='Пока '+n+' из 250 слов. Допиши и нажми «Завершить» ещё раз.'}
 };
 $('#fin').onclick=finish;
 const t0=Date.now();let done=false;
 const tick=setInterval(()=>{const el=$('#timer');if(!el){clearInterval(tick);return}
  const left=Math.max(0,2400-Math.floor((Date.now()-t0)/1000));el.textContent=mmss(left);
  if(left===0&&!done){done=true;finish()}},500);
 $('#cp').onclick=()=>copy(ta.value,()=>{hap('success');fb.className='fb ok';fb.textContent='Скопировано. Вставь эссе в чат с Claude.'},
  ()=>{ta.select();try{document.execCommand('copy');fb.className='fb ok';fb.textContent='Скопировано.'}catch(e){fb.className='fb bad';fb.textContent='Выдели текст и скопируй вручную.'}});
}

/* ---------- статистика ---------- */
const GOAL=30; // очков лексики в день: слово, карточка, вопрос = 1, предложение = 2
const vpts=d=>(d.c||0)+(d.q||0)+(d.v||0)+2*(d.s||0);
const exam=d=>(d.r||[]).length+(d.l||[]).length+(d.w||[]).length;
const dayLevel=d=>!d?0:exam(d)||vpts(d)>=GOAL?2:vpts(d)>0?1:0;
const MON=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
function dayText(dt,d){
 const parts=[];
 if(d){
  if(d.v)parts.push(d.v+' '+plural(d.v,'слово','слова','слов'));
  if(d.s)parts.push(d.s+' '+plural(d.s,'предложение','предложения','предложений'));
  if(d.c)parts.push(d.c+' '+plural(d.c,'карточка','карточки','карточек'));
  if(d.q)parts.push(d.q+' '+plural(d.q,'вопрос','вопроса','вопросов')+' квиза');
  const ex=[['r','Reading'],['l','Listening'],['w','Writing']].filter(([k])=>(d[k]||[]).length).map(([k,n])=>n);
  if(ex.length)parts.push(ex.join(', '));
 }
 return dt.getDate()+' '+MON[dt.getMonth()]+': '+(parts.length?parts.join(', '):'занятий не было');
}
function streaks(){
 let cur=0,best=0,run=0,prev=null;const t=new Date();
 for(let i=0;i<400;i++){ // сегодня может быть пустым, тогда серия считается со вчера
  const dt=new Date(t.getFullYear(),t.getMonth(),t.getDate()-i);
  if(dayLevel(LOG[dkey(dt)]))cur++;else if(i>0)break;
 }
 Object.keys(LOG).filter(k=>dayLevel(LOG[k])).sort().forEach(k=>{const dt=new Date(k+'T00:00');run=prev&&(dt-prev)<=86400000*1.5?run+1:1;best=Math.max(best,run);prev=dt});
 return {cur,best:Math.max(best,cur)};
}
function donut(parts){
 const total=parts.reduce((a,p)=>a+p.v,0),r=42,c=2*Math.PI*r;let off=0;
 const segs=total?parts.filter(p=>p.v).map(p=>{const len=p.v/total*c;const s=`<circle cx="60" cy="60" r="${r}" fill="none" stroke="${p.c}" stroke-width="16" stroke-dasharray="${Math.max(len-3,1)} ${c}" stroke-dashoffset="${-off}"/>`;off+=len;return s}).join(''):'';
 return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--line)" stroke-width="16"/><g transform="rotate(-90 60 60)">${segs}</g></svg>`;
}
function stats(){
 const t=new Date(),days=[];
 for(let i=29;i>=0;i--)days.push(LOG[dkey(new Date(t.getFullYear(),t.getMonth(),t.getDate()-i))]);
 const st=streaks(),active=days.filter(dayLevel).length;
 const ans=days.reduce((a,d)=>a+((d&&d.v)||0)+((d&&d.q)||0),0),ok=days.reduce((a,d)=>a+((d&&d.vok)||0)+((d&&d.qok)||0),0);
 const acc=ans?Math.round(ok/ans*100):null;
 const dow=(t.getDay()+6)%7,start=new Date(t.getFullYear(),t.getMonth(),t.getDate()-dow-35);
 let cells='';
 for(let i=0;i<42;i++){
  const dt=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i),k=dkey(dt);
  cells+=dt>t?'<span class="cd fut"></span>':`<button class="cd l${dayLevel(LOG[k])}${k===dkey(t)?' now':''}" data-k="${k}">${dt.getDate()}</button>`;
 }
 const bal=[
  {n:'Лексика',c:'#ff9f43',v:days.filter(d=>d&&vpts(d)).length},
  {n:'Reading',c:'#3fa9ff',v:days.filter(d=>d&&(d.r||[]).length).length},
  {n:'Listening',c:'#ff5fa2',v:days.filter(d=>d&&(d.l||[]).length).length},
  {n:'Writing',c:'#9b5cff',v:days.filter(d=>d&&(d.w||[]).length).length}];
 const weak=bal.slice().sort((a,b)=>a.v-b.v)[0];
 const known=WORDS.filter(w=>srs[w.id]&&srs[w.id].b>=3).length,vknown=VOCAB.filter(w=>vsrs[w.id]&&vsrs[w.id].b>=3).length;
 const bar=(n,c,a,b)=>`<div class="pr"><div class="pr-t"><span>${n}</span><b>${a} из ${b}</b></div><div class="pr-b"><div style="width:${b?a/b*100:0}%;background:${c}"></div></div></div>`;
 screen(`<div class="head"><div style="flex:1"><h1>Статистика</h1><div class="sub">За последние 30 дней</div></div></div>
 <div class="kpi">
  <div class="k hot"><b>${st.cur}</b><span>${plural(st.cur,'день','дня','дней')} подряд</span><small>Рекорд ${st.best}</small></div>
  <div class="k"><b>${active}</b><span>${plural(active,'день','дня','дней')} с занятиями</span><small>из 30</small></div>
  <div class="k"><b>${acc===null?'нет':acc+'%'}</b><span>верных ответов</span><small>Слова и квиз</small></div>
 </div>
 <h2>Календарь</h2>
 <div class="box">
  <div class="cal">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span class="wd">${x}</span>`).join('')}${cells}</div>
  <div class="cal-d" id="cdd">${dayText(t,LOG[dkey(t)])}</div>
  <div class="leg"><span><i></i>Пусто</span><span><i class="l1"></i>Немного лексики</span><span><i class="l2"></i>Цель дня</span></div>
  <p class="tag" style="margin:10px 0 0">Цель дня: Reading, Listening или Writing, либо ${GOAL} очков лексики (слово, карточка, вопрос по 1, предложение 2).</p>
 </div>
 <h2>Баланс навыков</h2>
 <div class="box bal">
  <div class="dn">${donut(bal)}<span>${active}<small>${plural(active,'день','дня','дней')}</small></span></div>
  <div class="bl">${bal.map(b=>`<div><i style="background:${b.c}"></i><span>${b.n}</span><b>${b.v}</b></div>`).join('')}</div>
 </div>
 ${active?`<p class="tag" style="margin:8px 4px 0">Реже всего: ${weak.n}. Начни с него в следующий раз.</p>`:''}
 <h2>Прогресс</h2>
 <div class="box">
  ${bar('Фразы','linear-gradient(90deg,#6d4dff,#ff5fa2)',known,WORDS.length)}
  ${bar('Слова','#ff9f43',vknown,VOCAB.length)}
  ${bar('Reading без ошибок','#3fa9ff',doneOf(READING),READING.length)}
  ${bar('Listening без ошибок','#ff5fa2',doneOf(LISTENING),LISTENING.length)}
  ${bar('Writing готово','#9b5cff',doneOf(WRITING),WRITING.length)}
  <p class="tag" style="margin:0">Выучено: три верных ответа подряд.</p>
 </div>`,{tab:'stats'});
 $$('.cd[data-k]').forEach(b=>b.onclick=()=>{
  hap('sel');$$('.cd.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');
  $('#cdd').textContent=dayText(new Date(b.dataset.k+'T00:00'),LOG[b.dataset.k]);
 });
}

/* ---------- напоминания ---------- */
// Боту время уходит через sendData, а он работает, только если Mini App открыт кнопкой под полем ввода
// (тогда initData пустой). Бот кладёт в адрес: s=remind, t=текущие времена, b=имя бота.
const URLQ=new URLSearchParams(location.search);
const BOT=URLQ.get('b')||load('ielts_bot','');
if(URLQ.get('b'))store('ielts_bot',URLQ.get('b'));
function remindTimes(){
 const q=URLQ.get('t'),v=load('ielts_remind_v1',null);
 if(load('ielts_remind_pending',false)&&Array.isArray(v))return v; // выбрано в приложении, но бот ещё не получил
 if(q!==null)return q?q.split(',').filter(x=>/^\d\d:\d\d$/.test(x)):[];
 return Array.isArray(v)?v:['14:00','21:00'];
}
function tzInfo(){
 const off=-new Date().getTimezoneOffset(),h=Math.trunc(off/60),m=Math.abs(off%60);
 let name='';try{name=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
 return {off,name,label:'UTC'+(off>=0?'+':'-')+Math.abs(h)+(m?':'+String(m).padStart(2,'0'):'')};
}
const canSend=()=>inTG&&!tg.initData;
function remind(back){
 let times=remindTimes();
 const tz=tzInfo(),send=canSend();
 const draw=()=>{
  screen(head('Напоминания')+
   `<p class="tag">Бот напишет в это время, если ты не писал ему последние 2 часа.</p>
   <h2>Время</h2>
   <div id="rl">${times.map((t,i)=>`<div class="rt"><input type="time" step="60" value="${t}" data-i="${i}"><button data-x="${i}" aria-label="Убрать">${ICON.cross}</button></div>`).join('')||'<p class="tag">Напоминания выключены.</p>'}</div>
   ${times.length<6?'<button class="sec" id="ra" style="width:100%">Добавить время</button>':''}
   <h2>Часовой пояс</h2>
   <div class="tz"><span>Как на телефоне</span><b>${tz.label}${tz.name?' · '+esc(tz.name):''}</b></div>
   <div id="fb" class="fb"></div>`,
   {back,bar:send||!inTG||!BOT?'<button id="rs">Сохранить</button>':'<button id="rs">Сохранить через чат</button>'});
  const sync=()=>$$('.rt input').forEach(inp=>{if(inp.value)times[+inp.dataset.i]=inp.value});
  $$('[data-x]').forEach(b=>b.onclick=()=>{sync();times.splice(+b.dataset.x,1);hap('light');draw()});
  if($('#ra'))$('#ra').onclick=()=>{sync();times.push('12:00');hap('light');draw()};
  $('#rs').onclick=()=>{
   sync();times=[...new Set(times.filter(x=>/^\d\d:\d\d$/.test(x)))].sort();
   store('ielts_remind_v1',times);
   store('ielts_remind_pending',!send);
   if(send){hap('success');tg.sendData(JSON.stringify({type:'remind',times,tz:tz.name,off:tz.off}));return} // Mini App закроется
   const fb=$('#fb');
   if(inTG&&BOT){tg.openTelegramLink('https://t.me/'+BOT+'?start=remind');return} // бот пришлёт кнопку, она откроет этот экран с правом отправки
   fb.className='fb info';fb.textContent='Время запомнено здесь. Чтобы бот его получил, отправь ему /remind и нажми кнопку под полем ввода.';
  };
 };
 draw();
}

/* ---------- старт ---------- */
if(URLQ.get('s')==='remind')remind(home);else home();
