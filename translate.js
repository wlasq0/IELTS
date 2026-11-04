/* translate: перевод слова по нажатию и фразы в текстах с классом tr-on (Reading, текст записи Listening).
   Каждое слово текста оборачивается в <span class="w">, так нажатие сразу знает слово на любом устройстве.
   Фраза: зажать первое слово, нажать последнее. На компе можно ещё выделить мышкой.
   Карточка сверху показывает слово, основной перевод и другие значения. Предложение целиком не переводим:
   контекст ученик понимает сам.
   Переводчики по очереди, каждому 5 секунд: Google (translate.googleapis.com), запасной адрес Google
   (clients5.google.com), MyMemory. Все бесплатные и без ключа. */
(function(){
 const touch='ontouchstart' in window;
 if(touch)document.documentElement.classList.add('touch');
 const st=document.createElement('style');
 st.textContent=`
 .tr-on{cursor:pointer;-webkit-touch-callout:none}
 .touch .tr-on{-webkit-user-select:none;user-select:none}
 .tr-on .w.hl{background:rgba(255,95,162,.3);border-radius:4px;box-shadow:0 0 0 2px rgba(255,95,162,.3)}
 .trc{position:fixed;left:12px;right:12px;top:calc(10px + env(safe-area-inset-top));z-index:20;max-width:520px;margin:0 auto;padding:14px 44px 14px 16px;border-radius:20px;
  background:var(--bg);background:color-mix(in srgb,var(--bg) 70%,transparent);-webkit-backdrop-filter:blur(24px) saturate(180%);backdrop-filter:blur(24px) saturate(180%);
  border:1px solid rgba(255,255,255,.3);box-shadow:0 12px 32px -10px rgba(0,0,0,.4);
  transform:translateY(-130%);opacity:0;transition:transform .25s cubic-bezier(.2,.8,.2,1),opacity .2s;pointer-events:none}
 .trc.open{transform:none;opacity:1;pointer-events:auto}
 .trc-en{font-size:15px;font-weight:700;color:#ff5fa2}
 .trc-ru{font-size:20px;font-weight:700;margin-top:2px;line-height:1.25}
 .trc-alt{font-size:13px;color:var(--hint);margin-top:6px;line-height:1.4}
 .trc-alt b{font-weight:600;color:var(--tx);margin-right:2px}
 .trc-x{position:absolute;top:8px;right:8px;width:30px;height:30px;padding:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(127,127,127,.15);color:var(--hint)}
 .trc-x svg{width:16px;height:16px}
 `;
 document.head.appendChild(st);
 const card=document.createElement('div');card.className='trc';
 card.innerHTML='<div class="trc-en"></div><div class="trc-ru"></div><div class="trc-alt"></div><button class="trc-x" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg></button>';
 document.body.appendChild(card);
 const [cEn,cRu,cAlt]=card.children;
 let start=null,last='',curBox=null; // curBox: текст, из которого сейчас перевод
 const clearHl=()=>document.querySelectorAll('.tr-on .w.hl').forEach(x=>x.classList.remove('hl'));
 const hide=()=>{card.classList.remove('open');clearHl();start=null;last='';curBox=null};
 card.querySelector('.trc-x').onclick=e=>{e.stopPropagation();hide()};

 // слова в span
 function wrap(box){
  const nodes=[],tw=document.createTreeWalker(box,NodeFilter.SHOW_TEXT);
  while(tw.nextNode())nodes.push(tw.currentNode);
  nodes.forEach(n=>{
   const parts=n.textContent.split(/([A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z])/);
   if(parts.length<2)return;
   const f=document.createDocumentFragment();
   parts.forEach((p,i)=>{
    if(!p)return;
    if(i%2){const s=document.createElement('span');s.className='w';s.textContent=p;f.appendChild(s)}
    else f.appendChild(document.createTextNode(p));
   });
   n.parentNode.replaceChild(f,n);
  });
  box.dataset.w='1';
 }
 const wrapAll=()=>document.querySelectorAll('.tr-on:not([data-w])').forEach(wrap);
 // новые тексты оборачиваем; карточку закрываем, когда её текст исчез с экрана (таймер Reading тоже меняет DOM, его не считаем)
 new MutationObserver(()=>{wrapAll();if(curBox&&!curBox.isConnected)hide()}).observe(document.getElementById('app'),{childList:true,subtree:true});

 // перевод
 const POS_RU={'имя существительное':'сущ.','имя прилагательное':'прил.','глагол':'гл.','наречие':'нар.','предлог':'предл.','местоимение':'мест.','союз':'союз','междометие':'межд.'};
 const get=u=>{const c=new AbortController();const t=setTimeout(()=>c.abort(),5000);
  return fetch(u,{signal:c.signal}).then(r=>{clearTimeout(t);if(!r.ok)throw 0;return r.json()})};
 async function translate(q){
  const e=encodeURIComponent(q);
  try{const j=await get('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&dt=bd&q='+e);
   return {main:(j[0]||[]).map(x=>x[0]).join(''),alt:j[1]||[]}}catch(_){}
  try{const j=await get('https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=ru&q='+e);
   const m=Array.isArray(j[0])?j[0][0]:j[0];if(m)return {main:String(m),alt:[]}}catch(_){}
  const j=await get('https://api.mymemory.translated.net/get?langpair=en|ru&q='+e);
  return {main:j.responseData.translatedText,alt:[]};
 }
 const cache={};
 async function show(text){
  text=text.replace(/\s+/g,' ').trim().slice(0,200);
  if(!text||text===last&&card.classList.contains('open'))return;
  last=text;
  cEn.textContent=text;cRu.textContent='Перевожу';cAlt.textContent='';
  card.classList.add('open');
  const key=text.toLowerCase();
  try{
   const r=cache[key]||(cache[key]=await translate(text));
   if(last!==text)return; // пока ждали ответ, нажали другое слово
   cRu.textContent=r.main||'Перевод не найден';
   // другие значения по частям речи: не больше двух частей речи и пяти слов в каждой
   cAlt.innerHTML=r.alt.slice(0,2).map(([pos,terms])=>{
    const t=terms.filter(x=>x.toLowerCase()!==r.main.toLowerCase()).slice(0,5);
    return t.length?`<div><b>${esc(POS_RU[pos]||pos)}</b> ${t.map(esc).join(', ')}</div>`:'';
   }).join('');
  }catch(e){
   delete cache[key];
   if(last===text)cRu.textContent='Не удалось перевести. Проверь интернет и нажми ещё раз.';
  }
 }

 // фраза от слова a до слова b (в любом порядке)
 function phrase(a,b){
  const ws=[...a.closest('.tr-on').querySelectorAll('.w')];
  let i=ws.indexOf(a),j=ws.indexOf(b);
  if(j<0)return;
  if(i>j)[i,j]=[j,i];
  clearHl();ws.slice(i,j+1).forEach(x=>x.classList.add('hl'));curBox=a.closest('.tr-on');
  const r=document.createRange();r.setStartBefore(ws[i]);r.setEndAfter(ws[j]);
  show(r.toString());
 }

 // зажатие: начало фразы
 let lpTimer=0,lpFired=false,tx=0,ty=0;
 document.addEventListener('touchstart',e=>{
  lpFired=false;clearTimeout(lpTimer);
  const t=e.touches[0];if(e.touches.length>1||!t)return;
  const w=e.target.closest&&e.target.closest('.tr-on .w');if(!w)return;
  tx=t.clientX;ty=t.clientY;
  lpTimer=setTimeout(()=>{
   lpFired=true;start=w;curBox=w.closest('.tr-on');clearHl();w.classList.add('hl');
   last='';cEn.textContent=w.textContent;cRu.textContent='Теперь нажми на последнее слово фразы';cAlt.textContent='';
   card.classList.add('open');
   const hf=window.Telegram&&Telegram.WebApp&&Telegram.WebApp.HapticFeedback;if(hf)hf.selectionChanged();
  },450);
 },{passive:true});
 document.addEventListener('touchmove',e=>{
  const t=e.touches[0];if(t&&Math.hypot(t.clientX-tx,t.clientY-ty)>10)clearTimeout(lpTimer);
 },{passive:true});
 document.addEventListener('touchend',e=>{clearTimeout(lpTimer);if(lpFired&&e.cancelable)e.preventDefault()});
 document.addEventListener('contextmenu',e=>{if(touch&&e.target.closest&&e.target.closest('.tr-on'))e.preventDefault()});

 // нажатие: слово или конец фразы
 document.addEventListener('click',e=>{
  if(card.contains(e.target))return;
  if(lpFired){lpFired=false;return} // отпущенный палец после зажатия
  const w=e.target.closest&&e.target.closest('.tr-on .w');
  if(w&&start&&start.isConnected&&start!==w){const s=start;start=null;phrase(s,w);return}
  if(!touch){const s=getSelection();if(s&&!s.isCollapsed)return} // на компе выделение мышкой обработает selectionchange
  if(!w){hide();return}
  start=null;curBox=w.closest('.tr-on');clearHl();w.classList.add('hl');show(w.textContent);
 });

 // выделение мышкой на компе
 let tm;
 if(!touch)document.addEventListener('selectionchange',()=>{
  clearTimeout(tm);
  tm=setTimeout(()=>{
   const s=getSelection();if(!s||s.isCollapsed||!s.rangeCount)return;
   const box=s.getRangeAt(0).commonAncestorContainer,el=box.nodeType===1?box:box.parentElement;
   const t=s.toString();
   if(el&&el.closest('.tr-on')&&/[A-Za-z]/.test(t)){curBox=el.closest('.tr-on');clearHl();show(t)}
  },450);
 });
})();
