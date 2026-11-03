/* stats: журнал занятий по дням и экран «Статистика».
   Журнал пишется сам: функции rate, vrate и setProg обёрнуты, ответы квиза ловятся по нажатию.
   Цвет дня: серый, если занятий не было; жёлтый, если была только лексика и меньше дневной цели;
   зелёный, если сделан Reading, Listening или Writing, или лексики набралось на цель. */
const LKEY='ielts_log_v1';
const GOAL=30; // очков лексики в день: слово, карточка или вопрос квиза = 1, предложение = 2
let LOG={};
try{LOG=JSON.parse(localStorage.getItem(LKEY)||'{}')}catch(e){LOG={}}
const dkey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function logAct(k,n=1,extra){
 const d=LOG[dkey(new Date())]=LOG[dkey(new Date())]||{};
 if(Array.isArray(n)){d[k]=d[k]||[];if(!d[k].includes(n[0]))d[k].push(n[0])}
 else d[k]=(d[k]||0)+n;
 if(extra)d[extra]=(d[extra]||0)+1;
 try{localStorage.setItem(LKEY,JSON.stringify(LOG))}catch(e){}
}
// обёртки: вызовы идут через глобальные имена, поэтому подмена работает
(function(){
 const r0=rate;rate=function(id,good){if(document.getElementById('yes'))logAct('c');return r0(id,good)};
 const v0=vrate;vrate=function(id,good){logAct('v',1,good?'vok':null);return v0(id,good)};
 const p0=setProg;setProg=function(id,s,sc,tot){if(s==='g'||(s==='r'&&id[0]!=='w'))logAct(id[0],[id]); // Writing засчитывается от 250 слов
return p0(id,s,sc,tot)};
 // квиз: обработчик кнопки уже отработал, неверный ответ помечен классом wrong
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.opt');if(b)logAct('q',1,b.classList.contains('wrong')?null:'qok')});
})();

const vpts=d=>(d.c||0)+(d.q||0)+(d.v||0)+2*(d.s||0);
const exam=d=>(d.r||[]).length+(d.l||[]).length+(d.w||[]).length;
function dayLevel(d){
 if(!d)return 0;
 if(exam(d)||vpts(d)>=GOAL)return 2;
 return vpts(d)>0?1:0;
}
const MON=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
function dayText(dt,d){
 const parts=[];
 if(d){
  if(d.v)parts.push(d.v+' '+plural(d.v,'слово','слова','слов'));
  if(d.s)parts.push(d.s+' '+plural(d.s,'предложение','предложения','предложений'));
  if(d.c)parts.push(d.c+' '+plural(d.c,'карточка','карточки','карточек'));
  if(d.q)parts.push(d.q+' '+plural(d.q,'вопрос','вопроса','вопросов')+' квиза');
  [['r','Reading'],['l','Listening'],['w','Writing']].forEach(([k,n])=>{if((d[k]||[]).length)parts.push(n+' '+d[k].length)});
 }
 return dt.getDate()+' '+MON[dt.getMonth()]+': '+(parts.length?parts.join(', '):'занятий не было');
}
function streaks(){
 let cur=0,best=0,run=0;
 const t=new Date();
 for(let i=0;i<400;i++){ // сегодня ещё может быть пустым, тогда серия считается со вчера
  const dt=new Date(t.getFullYear(),t.getMonth(),t.getDate()-i);
  if(dayLevel(LOG[dkey(dt)])){cur++}else if(i>0)break;
 }
 const keys=Object.keys(LOG).filter(k=>dayLevel(LOG[k])).sort();
 let prev=null;
 keys.forEach(k=>{const dt=new Date(k+'T00:00');run=prev&&(dt-prev)<=86400000*1.5?run+1:1;best=Math.max(best,run);prev=dt});
 return {cur,best:Math.max(best,cur)};
}
function lastDays(n){
 const t=new Date(),out=[];
 for(let i=n-1;i>=0;i--){const dt=new Date(t.getFullYear(),t.getMonth(),t.getDate()-i);out.push(LOG[dkey(dt)])}
 return out;
}
function donut(parts){
 const total=parts.reduce((a,p)=>a+p.v,0),r=42,c=2*Math.PI*r;let off=0;
 const segs=total?parts.filter(p=>p.v).map(p=>{const len=p.v/total*c;const s=`<circle cx="60" cy="60" r="${r}" fill="none" stroke="${p.c}" stroke-width="16" stroke-dasharray="${Math.max(len-3,1)} ${c}" stroke-dashoffset="${-off}"/>`;off+=len;return s}).join(''):'';
 return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--line)" stroke-width="16"/><g transform="rotate(-90 60 60)">${segs}</g></svg>`;
}
const tabBar=on=>`<div class="tabs-sp"></div><nav class="tabs"><button class="${on==='home'?'on':''}" id="tb-home">${ICON.home}<span>Главная</span></button><button class="${on==='stats'?'on':''}" id="tb-stats">${ICON.chart}<span>Статистика</span></button></nav>`;
function bindTabs(){$('#tb-home').onclick=home;$('#tb-stats').onclick=stats}

function stats(){
 const days=lastDays(30),st=streaks();
 const active=days.filter(dayLevel).length;
 const ans=days.reduce((a,d)=>a+((d&&d.v)||0)+((d&&d.q)||0),0),ok=days.reduce((a,d)=>a+((d&&d.vok)||0)+((d&&d.qok)||0),0);
 const acc=ans?Math.round(ok/ans*100):null;

 // календарь: 6 недель, с понедельника, последняя неделя текущая
 const t=new Date(),dow=(t.getDay()+6)%7;
 const start=new Date(t.getFullYear(),t.getMonth(),t.getDate()-dow-35);
 let cells='';
 for(let i=0;i<42;i++){
  const dt=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i),k=dkey(dt);
  if(dt>t){cells+='<span class="cd fut"></span>';continue}
  cells+=`<button class="cd l${dayLevel(LOG[k])}${k===dkey(t)?' now':''}" data-k="${k}"><span>${dt.getDate()}</span></button>`;
 }
 const end=new Date(start.getFullYear(),start.getMonth(),start.getDate()+41);

 // баланс навыков: в сколько дней из 30 занимался каждым
 const bal=[
  {n:'Лексика',c:'#ff9f43',v:days.filter(d=>d&&vpts(d)).length},
  {n:'Reading',c:'#3fa9ff',v:days.filter(d=>d&&(d.r||[]).length).length},
  {n:'Listening',c:'#ff5fa2',v:days.filter(d=>d&&(d.l||[]).length).length},
  {n:'Writing',c:'#9b5cff',v:days.filter(d=>d&&(d.w||[]).length).length}];
 const weak=bal.slice().sort((a,b)=>a.v-b.v)[0];

 // прогресс по разделам
 const tday=today();
 const known=WORDS.filter(w=>srs[w.id]&&srs[w.id].b>=3).length;
 const vknown=VOCAB.filter(w=>vsrs[w.id]&&vsrs[w.id].b>=3).length;
 const bar=(n,c,a,b)=>`<div class="pr"><div class="pr-t"><span>${n}</span><b>${a} из ${b}</b></div><div class="pr-b"><div style="width:${b?a/b*100:0}%;background:${c}"></div></div></div>`;

 app.innerHTML=`
 <div class="top"><div><h1>Статистика</h1><div class="sub">За последние 30 дней</div></div></div>
 <div class="kpi">
  <div class="k hot"><b>${st.cur}</b><span>${plural(st.cur,'день','дня','дней')} подряд</span><small>Рекорд ${st.best}</small></div>
  <div class="k"><b>${active}</b><span>${plural(active,'день','дня','дней')} с занятиями</span><small>из 30</small></div>
  <div class="k"><b>${acc===null?'нет':acc+'%'}</b><span>верных ответов</span><small>Слова и квиз</small></div>
 </div>
 <h2>Календарь</h2>
 <div class="box">
  <div class="cal-h">С ${start.getDate()} ${MON[start.getMonth()]} по ${end.getDate()} ${MON[end.getMonth()]}</div>
  <div class="cal">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span class="wd">${x}</span>`).join('')}${cells}</div>
  <div class="cal-d" id="cdd">${dayText(t,LOG[dkey(t)])}</div>
  <div class="leg"><span><i class="l0"></i>Не занимался</span><span><i class="l1"></i>Немного лексики</span><span><i class="l2"></i>Цель дня</span></div>
  <p class="tag">Зелёный день: сделан Reading, Listening или Writing, либо ${GOAL} очков лексики. Слово, карточка и вопрос квиза дают 1 очко, предложение 2.</p>
 </div>
 <h2>Баланс навыков</h2>
 <div class="box bal">
  <div class="dn">${donut(bal)}<span>${active}<small>${plural(active,'день','дня','дней')}</small></span></div>
  <div class="bl">${bal.map(b=>`<div><i style="background:${b.c}"></i><span>${b.n}</span><b>${b.v} ${plural(b.v,'день','дня','дней')}</b></div>`).join('')}</div>
 </div>
 ${active?`<p class="tag hint">Реже всего ты занимался разделом ${weak.n}. Начни с него в следующий раз.</p>`:''}
 <h2>Прогресс</h2>
 <div class="box">
  ${bar('Фразы выучено','linear-gradient(90deg,#6d4dff,#ff5fa2)',known,WORDS.length)}
  ${bar('Слова выучено','#ff9f43',vknown,VOCAB.length)}
  ${bar('Reading без ошибок','#3fa9ff',doneOf(READING),READING.length)}
  ${bar('Listening без ошибок','#ff5fa2',doneOf(LISTENING),LISTENING.length)}
  ${bar('Writing готово','#9b5cff',doneOf(WRITING),WRITING.length)}
  <p class="tag">Фраза или слово считаются выученными после трёх верных ответов подряд.</p>
 </div>
 ${tabBar('stats')}`;
 document.querySelectorAll('.cd[data-k]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.cd.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');
  $('#cdd').textContent=dayText(new Date(b.dataset.k+'T00:00'),LOG[b.dataset.k]);
 });
 bindTabs();window.scrollTo(0,0);
}
