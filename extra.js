/* Listening + Writing. Использует из index.html: app, $, esc, backBtn, bindBack, shuffle, WORDS, home */
const LISTENING=[
{
 title:"Lecture · The gig economy",
 script:"Good afternoon. Today I'd like to look at the gig economy, a term that describes short-term work arranged through digital platforms rather than traditional contracts. Supporters point to flexibility: a delivery rider can decide which evenings to work, and a student can fit tasks around lectures. However, flexibility has a price. Platform workers are usually classed as self-employed, which means they often have no paid holiday and no sick pay. A study I'll refer to later suggested that about one in five adults in the survey had done some form of platform work in the previous year, although the figure was much higher among people under thirty. Another concern is income stability. Earnings can fluctuate widely from week to week, and workers rarely know in advance how much they will make. Some governments have started to respond. In one country, a court ruled that drivers should be treated as employees, while elsewhere lawmakers are still debating the issue. For next week, please read chapter six, and prepare a short summary of no more than three hundred words. The deadline for the written assignment is the fourteenth of December.",
 questions:[
  {s:"The gig economy means short-term work arranged through digital ____.",a:["platforms","platform"]},
  {s:"A delivery rider can choose which ____ to work.",a:["evenings","evening"]},
  {s:"Platform workers often have no paid holiday and no ____ pay.",a:["sick"]},
  {s:"About one in ____ adults had done platform work in the previous year.",a:["five","5"]},
  {s:"The figure was much higher among people under ____.",a:["thirty","30"]},
  {s:"A court ruled that ____ should be treated as employees.",a:["drivers","driver"]},
  {s:"The summary should be no more than ____ words.",a:["300","three hundred"]},
  {s:"The deadline for the written assignment is ____ December.",a:["14","14th","fourteenth","fourteen"]}
 ]
},
{
 title:"Radio talk · Food waste",
 script:"Welcome back to Green Living. This week we're talking about food waste. Many households throw away perfectly edible food, and the main reason isn't carelessness but poor planning. Shoppers buy more than they need, often because supermarkets offer two items for the price of one. Interestingly, the date printed on packaging causes confusion. 'Best before' refers to quality, not safety, so many products are fine for days afterwards, whereas 'use by' dates should be taken seriously. Our guest, a food scientist, recommends three simple habits. First, write a weekly menu before going shopping. Second, store vegetables in the coolest part of the fridge, not in the warm door shelf. Third, freeze leftovers on the same day you cook them, rather than the next morning. She also warns against over-relying on apps that promise cheap surplus meals, because they can encourage people to buy more than they would otherwise. Finally, a reminder: our community fridge on Mill Street is open every weekday from nine until five, and anyone can leave or take food free of charge.",
 questions:[
  {s:"According to the speaker, what is the main cause of household food waste?",o:["Carelessness","Poor planning","High prices"],a:1},
  {s:"Why do shoppers often buy more than they need?",o:["Special offers on multiple items","Packaging is too large","They forget their shopping lists"],a:0},
  {s:"What does 'best before' refer to?",o:["Safety","Quality","Price"],a:1},
  {s:"Where should vegetables be stored?",o:["On the fridge door","In the coolest part of the fridge","In a cupboard"],a:1},
  {s:"When should leftovers be frozen?",o:["The next morning","On the day they are cooked","Within a week"],a:1},
  {s:"What worries the guest about surplus-meal apps?",o:["They are too expensive","They can encourage over-buying","The food is poor quality"],a:1},
  {s:"When is the community fridge open?",o:["Every day","Weekdays, 9 to 5","Weekends only"],a:1}
 ]
}
];

const WRITING=[
 {topic:"Technology",title:"Technology and stress",prompt:"Some people believe that technology has made our lives easier, while others think it has made life more stressful. Discuss both views and give your own opinion."},
 {topic:"Education",title:"Exams or coursework",prompt:"Some people argue that national exams should be replaced by continuous assessment throughout the year. To what extent do you agree or disagree?"},
 {topic:"Environment",title:"Who should act",prompt:"Individuals can do very little to protect the environment, so governments and large companies must take action. To what extent do you agree or disagree?"},
 {topic:"Work & Career",title:"Working from home",prompt:"More and more people now work from home. Do the advantages of this trend outweigh the disadvantages?"},
 {topic:"Media",title:"Social media and young people",prompt:"Social media does more harm than good to young people. To what extent do you agree or disagree?"},
 {topic:"Health",title:"Prevention or treatment",prompt:"Governments should spend more money on preventing illness than on treating it. To what extent do you agree or disagree?"}
];

function enVoices(){return (window.speechSynthesis?speechSynthesis.getVoices():[]).filter(v=>v.lang&&v.lang.toLowerCase().startsWith('en'))}
function voiceScore(v){let s=0;const n=v.name;
 if(/natural|neural|online/i.test(n))s+=100;
 if(/premium|enhanced|siri/i.test(n))s+=60;
 if(/google/i.test(n))s+=30;
 if(/en[-_]GB/i.test(v.lang))s+=10;
 if(/\b(david|zira|mark|hazel|george)\b/i.test(n)&&!/online|natural/i.test(n))s-=20;
 return s}
function pickVoice(){const vs=enVoices();if(!vs.length)return null;
 let saved='';try{saved=localStorage.getItem('ielts_voice')||''}catch(e){}
 return vs.find(v=>v.name===saved)||vs.slice().sort((a,b)=>voiceScore(b)-voiceScore(a))[0]}
function initVoice(){
 const sel=$('#vs');if(!sel)return;
 const fill=()=>{const vs=enVoices().sort((a,b)=>voiceScore(b)-voiceScore(a));
  if(!vs.length){sel.innerHTML='<option>Голоса не найдены</option>';return}
  const cur=pickVoice();
  sel.innerHTML=vs.map(v=>`<option value="${esc(v.name)}"${cur&&v.name===cur.name?' selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')};
 fill();if(window.speechSynthesis)speechSynthesis.onvoiceschanged=fill;
 sel.onchange=()=>{try{localStorage.setItem('ielts_voice',sel.value)}catch(e){}};
 $('#vt').onclick=()=>{speakAll("Hello! This is how the recording will sound. The deadline is the fourteenth of December.",null)};
}
function speakAll(text,onEnd){
 if(!window.speechSynthesis){onEnd&&onEnd(false);return}
 speechSynthesis.cancel();
 const parts=text.match(/[^.!?]+[.!?]+/g)||[text];
 const v=pickVoice();
 parts.forEach((p,i)=>{
  const u=new SpeechSynthesisUtterance(p.trim());u.lang=v?v.lang:'en-GB';u.rate=.95;if(v)u.voice=v;
  if(i===parts.length-1)u.onend=()=>onEnd&&onEnd(true);
  u.onerror=()=>{if(i===parts.length-1)onEnd&&onEnd(true)};
  speechSynthesis.speak(u);
 });
}
const normA=s=>String(s||'').trim().toLowerCase().replace(/[.\s]+$/,'');

/* ---------- LISTENING ---------- */
function listeningList(){
 app.innerHTML=backBtn()+`<h1>Listening</h1><p class="tag">Запись звучит один раз. Нужен включённый звук. Голос синтезированный, он ровнее и медленнее настоящего.</p>`+
  LISTENING.map((l,k)=>`<div class="row"><button class="sec" data-k="${k}">${esc(l.title)}</button></div>`).join('');
 bindBack();
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>listening(+b.dataset.k));
}
function listening(k){
 const L=LISTENING[k];
 const qs=L.questions.map((q,i)=>{
  if(q.o){
   return `<div class="q"><div class="st">${i+1}. ${esc(q.s)}</div><div class="seg" data-i="${i}" style="flex-direction:column">${q.o.map((o,j)=>`<button data-v="${j}" style="text-align:left">${'ABC'[j]}. ${esc(o)}</button>`).join('')}</div><div class="exp" id="le${i}"></div></div>`;
  }
  const [a,b]=q.s.split('____');
  return `<div class="q"><div class="st">${i+1}. ${esc(a)}<input id="li${i}" autocomplete="off" style="width:110px;font:inherit;padding:4px;margin:0 4px">${esc(b||'')}</div><div class="exp" id="le${i}"></div></div>`;
 }).join('');
 app.innerHTML=backBtn()+`<h2>${esc(L.title)}</h2><p class="tag">Голос (подбирается автоматически, можно сменить):</p><select id="vs"></select><div class="row"><button id="vt" class="sec">Проверить голос</button></div><div class="row"><button id="pl">▶ Начать (один раз)</button></div><p class="tag" id="st"></p>${qs}<div class="row"><button id="ck">Проверить</button></div><div id="res"></div>`;
 bindBack();
 $('#bk').onclick=()=>{if(window.speechSynthesis)speechSynthesis.cancel();home()};
 initVoice();const picks=L.questions.map(()=>null);
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
  $('#res').innerHTML=`<h2>Результат: ${s} из ${L.questions.length}</h2><p class="tag">Текст записи:</p><div class="passage"><p>${esc(L.script)}</p></div>`;
  $('#ck').style.display='none';$('#pl').disabled=true;
 };
}

/* ---------- WRITING ---------- */
function writingList(){
 app.innerHTML=backBtn()+`<h1>Writing: Task 2</h1><p class="tag">Эссе от 250 слов, 40 минут. Скопируй готовый текст и вставь его в чат с Claude: он разберёт эссе по четырём критериям IELTS.</p>`+
  WRITING.map((w,k)=>`<div class="row"><button class="sec" data-k="${k}">${esc(w.topic)}: ${esc(w.title)}</button></div>`).join('');
 bindBack();
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>writing(+b.dataset.k));
}
function writing(k){
 const w=WRITING[k],key='ielts_c1_essay_'+k;
 const hints=shuffle(WORDS.filter(x=>x.topic===w.topic)).slice(0,6);
 let saved='';try{saved=localStorage.getItem(key)||''}catch(e){}
 app.innerHTML=backBtn()+`<span id="timer">40:00</span><h2>${esc(w.title)}</h2>
 <div class="passage"><p>${esc(w.prompt)}</p><p class="tag">Write at least 250 words.</p></div>
 <h2>Фразы по теме (бери, если подходят)</h2>
 <div class="passage">${hints.map(h=>`<p><b>${esc(h.en)}</b><br><span class="tag">${esc(h.ru)}</span></p>`).join('')}</div>
 <h2>Твоё эссе</h2>
 <textarea id="essay" placeholder="Start writing here..." style="width:100%;min-height:280px;font:inherit;padding:10px;border-radius:12px;border:0;background:var(--sec);color:var(--tx)"></textarea>
 <p id="wc" class="tag">0 слов</p>
 <div class="row"><button id="cp">Скопировать эссе</button></div>
 <p id="msg" class="tag"></p>
 <h2>Проверь перед отправкой</h2>
 <div class="passage">
  <p><label><input type="checkbox"> Ответил на все части вопроса</label></p>
  <p><label><input type="checkbox"> Есть вступление, 2 основных абзаца и вывод</label></p>
  <p><label><input type="checkbox"> Использовал 4–5 фраз из списка</label></p>
  <p><label><input type="checkbox"> Проверил времена, артикли и предлоги</label></p>
 </div>`;
 bindBack();
 const ta=$('#essay');ta.value=saved;
 const count=()=>{const n=ta.value.trim().split(/\s+/).filter(Boolean).length;$('#wc').textContent=n+' слов'+(n<250?' (до 250 ещё '+(250-n)+')':'');return n};
 count();
 ta.oninput=()=>{count();try{localStorage.setItem(key,ta.value)}catch(e){}};
 const t0=Date.now();
 const tick=setInterval(()=>{const el=$('#timer');if(!el){clearInterval(tick);return}
  const left=Math.max(0,40*60-Math.floor((Date.now()-t0)/1000));
  el.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0')},500);
 $('#cp').onclick=()=>{
  const text=ta.value;
  const done=()=>{$('#msg').textContent='Скопировано. Вставь эссе в чат с Claude.'};
  const fallback=()=>{ta.select();try{document.execCommand('copy');done()}catch(e){$('#msg').textContent='Выдели текст и скопируй вручную.'}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,fallback);else fallback();
 };
}
