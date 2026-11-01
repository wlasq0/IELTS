/* v2: статусы панелей (жёлтый / зелёный / красный), кружки на карточках, сортировка по уровню.
   Переопределяет функции из index.html и extra.js, затем перерисовывает главную. */
(function(){
 const st=document.createElement('style');
 st.textContent=`
 .item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;margin:6px 0;background:var(--sec);color:var(--tx)}
 .item .t{flex:1}
 .item.p{background:rgba(242,194,0,.28)}
 .item.g{background:rgba(46,157,79,.28)}
 .item.r{background:rgba(214,69,65,.28)}
 .lv{font-size:12px;padding:2px 8px;border-radius:10px;background:var(--btn);color:var(--btx)}
 .sc{font-size:12px;color:var(--hint)}
 .ic{width:22px;height:22px;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;font-size:14px;color:#fff;box-sizing:border-box}
 .ic.n{border:2px solid var(--hint)}
 .ic.g{background:var(--ok)}
 .ic.r{background:var(--bad)}
 .ic.p{border:3px solid #e0a800;border-top-color:transparent;animation:spin 1s linear infinite}
 @keyframes spin{to{transform:rotate(360deg)}}
 .back{margin-right:10px}
 .card{position:relative}
 .dot{position:absolute;left:12px;top:12px;width:12px;height:12px;border-radius:50%;border:2px solid var(--hint);box-sizing:border-box}
 .dot.g{background:#2ecc71;border-color:#2ecc71;box-shadow:0 0 8px 2px rgba(46,204,113,.75)}
 .dot.r{background:#ff4d4f;border-color:#ff4d4f;box-shadow:0 0 8px 2px rgba(255,77,79,.75)}
 `;
 document.head.appendChild(st);
})();

const PKEY='ielts_c1_prog_v1';
let prog={};
try{prog=JSON.parse(localStorage.getItem(PKEY)||'{}')}catch(e){prog={}}
function setProg(id,s,sc,tot){prog[id]={s:s,sc:sc,tot:tot};try{localStorage.setItem(PKEY,JSON.stringify(prog))}catch(e){}}
const LV={C2:6,C1:5,B2:4,B1:3,A2:2,A1:1};
function sortedIdx(arr){return arr.map((x,i)=>i).sort((a,b)=>(LV[arr[b].level]||0)-(LV[arr[a].level]||0)||a-b)}
function itemRow(it,k){
 const p=prog[it.id]||{},s=p.s||'';
 const icon=s==='g'?'✔':s==='r'?'✕':'';
 return `<button class="item ${s}" data-k="${k}"><span class="ic ${s||'n'}">${icon}</span><span class="t">${esc(it.title)}</span>${p.tot?`<span class="sc">${p.sc}/${p.tot}</span>`:''}${it.level?`<span class="lv">${it.level}</span>`:''}</button>`;
}
const lvBadge=it=>it.level?` <span class="lv">${it.level}</span>`:'';

/* ---------- КАРТОЧКИ: кружки статуса ---------- */
function rate(id,good){
 const e=srs[id]||{b:0,d:today()};
 e.b=good?Math.min(5,e.b+1):0;
 e.d=today()+INT[e.b];
 e.r=good?'g':'r';
 srs[id]=e;save();
}
function cards(){
 const t=today(),p=pool();
 const due=p.filter(w=>srs[w.id]&&srs[w.id].d<=t);
 const fresh=shuffle(p.filter(w=>!srs[w.id])).slice(0,10);
 let q=shuffle(due).concat(fresh),i=0;
 if(!q.length){app.innerHTML=backBtn()+`<h1>Готово</h1><p>На сегодня в этой теме карточек нет. Попробуй другую тему или квиз.</p>`;bindBack();return}
 const show=()=>{
  if(i>=q.length){app.innerHTML=backBtn()+`<h1>Сессия закончена</h1><p>Разобрано карточек: ${q.length}.</p><div class="row"><button id="again">Ещё раз</button></div>`;bindBack();$('#again').onclick=cards;return}
  const w=q[i],r=(srs[w.id]||{}).r||'';
  app.innerHTML=backBtn()+`<span class="tag">${i+1} / ${q.length} · ${esc(w.topic)}</span>
  <div class="card"><span class="dot ${r}"></span><div class="en">${esc(w.en)}</div><div class="ru" id="ru" style="visibility:hidden">${esc(w.ru)}</div></div>
  <p class="tag">Кружок: пустой, когда карточка новая; зелёный, если ты её знал; красный, если не знал.</p>
  <div class="row"><button class="sec" id="sp">🔊 Слушать</button><button id="rv">Показать перевод</button></div>
  <div class="row" id="ans" style="display:none"><button class="bad" id="no">Не помню</button><button class="ok" id="yes">Помню</button></div>`;
  bindBack();
  $('#sp').onclick=()=>speak(w.en);
  $('#rv').onclick=()=>{$('#ru').style.visibility='visible';$('#rv').style.display='none';$('#ans').style.display='flex'};
  $('#no').onclick=()=>{rate(w.id,false);i++;show()};
  $('#yes').onclick=()=>{rate(w.id,true);i++;show()};
 };
 show();
}

/* ---------- READING ---------- */
function readingList(){
 app.innerHTML=backBtn()+`<h1>Reading: T / F / NG</h1><p class="tag">Сверху самые сложные (C2), снизу простые. Уровень указан справа и он примерный. Жёлтый: в процессе, зелёный: всё верно, красный: есть ошибки.</p>`+
  sortedIdx(READING).map(k=>itemRow(READING[k],k)).join('');
 bindBack();
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>reading(+b.dataset.k));
}
function reading(k){
 const r=READING[k],ans=r.questions.map(()=>null);
 setProg(r.id,'p');
 const t0=Date.now();
 const tick=setInterval(()=>{const el=$('#timer');if(!el){clearInterval(tick);return}
  const s=Math.floor((Date.now()-t0)/1000);el.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},500);
 app.innerHTML=backBtn()+`<span id="timer">00:00</span><h2>${esc(r.title)}${lvBadge(r)}</h2>
 <div class="passage">${r.text.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
 <h2>True / False / Not Given</h2>`+
 r.questions.map((q,i)=>`<div class="q" id="q${i}"><div class="st">${i+1}. ${esc(q.s)}</div>
  <div class="seg" data-i="${i}"><button data-v="T">True</button><button data-v="F">False</button><button data-v="NG">Not Given</button></div>
  <div class="exp" id="e${i}"></div></div>`).join('')+
 `<div class="row"><button id="ck">Проверить</button></div><div id="res"></div>`;
 bindBack();
 $('#bk').onclick=readingList;
 document.querySelectorAll('.seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{
  const i=+sg.dataset.i;ans[i]=b.dataset.v;sg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
 }));
 $('#ck').onclick=()=>{
  clearInterval(tick);let s=0;
  r.questions.forEach((q,i)=>{
   const ok=ans[i]===q.a;if(ok)s++;
   $('#e'+i).innerHTML=`${ok?'✔':'✘'} Верно: <b>${q.a==='NG'?'Not Given':q.a==='T'?'True':'False'}</b>. ${esc(q.why)}`;
   $('#e'+i).style.color=ok?'var(--ok)':'var(--bad)';
  });
  setProg(r.id,s===r.questions.length?'g':'r',s,r.questions.length);
  const sec=Math.floor((Date.now()-t0)/1000);
  $('#res').innerHTML=`<h2>Результат: ${s} из ${r.questions.length} · ${Math.floor(sec/60)} мин ${sec%60} с</h2>
  <p class="tag">False: текст прямо противоречит. Not Given: текст о таком молчит.</p>`;
  $('#ck').style.display='none';window.scrollTo(0,document.body.scrollHeight);
 };
}

/* ---------- LISTENING ---------- */
function listeningList(){
 app.innerHTML=backBtn()+`<h1>Listening</h1><p class="tag">Сверху самые сложные (C2), снизу простые. Уровень справа примерный. Запись звучит один раз, нужен звук. Жёлтый: в процессе, зелёный: всё верно, красный: есть ошибки.</p>`+
  sortedIdx(LISTENING).map(k=>itemRow(LISTENING[k],k)).join('');
 bindBack();
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>listening(+b.dataset.k));
}
function listening(k){
 const L=LISTENING[k];
 setProg(L.id,'p');
 const qs=L.questions.map((q,i)=>{
  if(q.o){
   return `<div class="q"><div class="st">${i+1}. ${esc(q.s)}</div><div class="seg" data-i="${i}" style="flex-direction:column">${q.o.map((o,j)=>`<button data-v="${j}" style="text-align:left">${'ABC'[j]}. ${esc(o)}</button>`).join('')}</div><div class="exp" id="le${i}"></div></div>`;
  }
  const [a,b]=q.s.split('____');
  return `<div class="q"><div class="st">${i+1}. ${esc(a)}<input id="li${i}" autocomplete="off" style="width:110px;font:inherit;padding:4px;margin:0 4px">${esc(b||'')}</div><div class="exp" id="le${i}"></div></div>`;
 }).join('');
 app.innerHTML=backBtn()+`<h2>${esc(L.title)}${lvBadge(L)}</h2><p class="tag">Голос для Listening (подбирается автоматически, можно сменить):</p><select id="vs"></select><div class="row"><button id="vt" class="sec">Проверить голос</button></div><div class="row"><button id="pl">▶ Начать (один раз)</button></div><p class="tag" id="st"></p>${qs}<div class="row"><button id="ck">Проверить</button></div><div id="res"></div>`;
 bindBack();
 $('#bk').onclick=()=>{if(window.speechSynthesis)speechSynthesis.cancel();listeningList()};
 initVoice();
 const picks=L.questions.map(()=>null);
 document.querySelectorAll('.seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{
  const i=+sg.dataset.i;picks[i]=+b.dataset.v;sg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
 }));
 $('#pl').onclick=()=>{
  $('#pl').disabled=true;$('#st').textContent='Идёт запись...';
  speakAll(L.script,ok=>{$('#st').textContent=ok?'Запись закончена.':'Озвучка недоступна на этом устройстве. Открой тренажёр в браузере.'});
 };
 $('#ck').onclick=()=>{
  if(window.speechSynthesis)speechSynthesis.cancel();
  let s=0;
  L.questions.forEach((q,i)=>{
   let ok,right;
   if(q.o){ok=picks[i]===q.a;right='ABC'[q.a]+'. '+q.o[q.a]}
   else{const v=normA(($('#li'+i)||{}).value);ok=q.a.includes(v);right=q.a[0]}
   if(ok)s++;
   const e=$('#le'+i);e.textContent=(ok?'✔ ':'✘ ')+(ok?'Верно':'Верно: '+right);e.style.color=ok?'var(--ok)':'var(--bad)';
  });
  setProg(L.id,s===L.questions.length?'g':'r',s,L.questions.length);
  $('#res').innerHTML=`<h2>Результат: ${s} из ${L.questions.length}</h2><p class="tag">Текст записи:</p><div class="passage"><p>${esc(L.script)}</p></div>`;
  $('#ck').style.display='none';$('#pl').disabled=true;
 };
}

/* ---------- WRITING ---------- */
function writingList(){
 app.innerHTML=backBtn()+`<h1>Writing: Task 2</h1><p class="tag">Эссе от 250 слов, 40 минут. Жёлтый: пишешь, зелёный: готово (250+ слов), красный: не хватило слов. Готовый текст скопируй и вставь в чат с Claude, я разберу его по четырём критериям IELTS.</p>`+
  WRITING.map((w,k)=>itemRow({id:w.id,title:w.topic+': '+w.title},k)).join('');
 bindBack();
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>writing(+b.dataset.k));
}
function writing(k){
 const w=WRITING[k],key='ielts_c1_essay_'+k;
 const hints=shuffle(WORDS.filter(x=>x.topic===w.topic)).slice(0,6);
 let saved='';try{saved=localStorage.getItem(key)||''}catch(e){}
 setProg(w.id,'p');
 app.innerHTML=backBtn()+`<span id="timer">40:00</span><h2>${esc(w.title)}</h2>
 <div class="passage"><p>${esc(w.prompt)}</p><p class="tag">Write at least 250 words.</p></div>
 <h2>Фразы по теме (бери, если подходят)</h2>
 <div class="passage">${hints.map(h=>`<p><b>${esc(h.en)}</b><br><span class="tag">${esc(h.ru)}</span></p>`).join('')}</div>
 <h2>Твоё эссе</h2>
 <textarea id="essay" placeholder="Start writing here..." style="width:100%;min-height:280px;font:inherit;padding:10px;border-radius:12px;border:0;background:var(--sec);color:var(--tx)"></textarea>
 <p id="wc" class="tag">0 слов</p>
 <div class="row"><button id="cp" class="sec">Скопировать эссе</button><button id="fin" class="ok">Завершить</button></div>
 <p id="msg" class="tag"></p>
 <h2>Проверь перед отправкой</h2>
 <div class="passage">
  <p><label><input type="checkbox"> Ответил на все части вопроса</label></p>
  <p><label><input type="checkbox"> Есть вступление, 2 основных абзаца и вывод</label></p>
  <p><label><input type="checkbox"> Использовал 4–5 фраз из списка</label></p>
  <p><label><input type="checkbox"> Проверил времена, артикли и предлоги</label></p>
 </div>`;
 bindBack();
 $('#bk').onclick=writingList;
 const ta=$('#essay');ta.value=saved;
 const count=()=>{const n=ta.value.trim().split(/\s+/).filter(Boolean).length;$('#wc').textContent=n+' слов'+(n<250?' (до 250 ещё '+(250-n)+')':'');return n};
 count();
 ta.oninput=()=>{count();try{localStorage.setItem(key,ta.value)}catch(e){}};
 const finish=()=>{
  const n=count();
  if(n>=250){setProg(w.id,'g',n,250);$('#msg').textContent='Готово: '+n+' слов. Скопируй эссе и вставь в чат с Claude для разбора.'}
  else{setProg(w.id,'r',n,250);$('#msg').textContent='Не хватает слов: '+n+' из 250. Можно дописать и нажать «Завершить» ещё раз.'}
 };
 $('#fin').onclick=finish;
 const t0=Date.now();let done=false;
 const tick=setInterval(()=>{const el=$('#timer');if(!el){clearInterval(tick);return}
  const left=Math.max(0,40*60-Math.floor((Date.now()-t0)/1000));
  el.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
  if(left===0&&!done){done=true;finish()}},500);
 $('#cp').onclick=()=>{
  const text=ta.value;
  const ok=()=>{$('#msg').textContent='Скопировано. Вставь эссе в чат с Claude.'};
  const fallback=()=>{ta.select();try{document.execCommand('copy');ok()}catch(e){$('#msg').textContent='Выдели текст и скопируй вручную.'}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(ok,fallback);else fallback();
 };
}

home();
