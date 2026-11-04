/* translate: перевод слова по нажатию и фразы по выделению в текстах с классом tr-on (Reading, текст записи Listening).
   Карточка сверху показывает слово, основной перевод и другие значения. Предложение целиком не переводим:
   контекст ученик понимает сам.
   Перевод берётся из бесплатного неофициального переводчика Google (translate.googleapis.com, без ключа). */
(function(){
 const st=document.createElement('style');
 st.textContent=`
 .tr-on{cursor:pointer;-webkit-user-select:text;user-select:text}
 .trc{position:fixed;left:12px;right:12px;top:calc(10px + env(safe-area-inset-top));z-index:20;max-width:520px;margin:0 auto;padding:14px 44px 14px 16px;border-radius:20px;
  background:color-mix(in srgb,var(--bg) 70%,transparent);-webkit-backdrop-filter:blur(24px) saturate(180%);backdrop-filter:blur(24px) saturate(180%);
  border:1px solid color-mix(in srgb,#fff 30%,transparent);box-shadow:0 12px 32px -10px rgba(0,0,0,.4);
  transform:translateY(calc(-100% - 20px));opacity:0;transition:transform .25s cubic-bezier(.2,.8,.2,1),opacity .2s;pointer-events:none}
 .trc.open{transform:none;opacity:1;pointer-events:auto}
 .trc-en{font-size:15px;font-weight:700;color:#ff5fa2}
 .trc-ru{font-size:20px;font-weight:700;margin-top:2px;line-height:1.25}
 .trc-alt{font-size:13px;color:var(--hint);margin-top:6px;line-height:1.4}
 .trc-alt b{font-weight:600;color:var(--tx);margin-right:2px}
 .trc-x{position:absolute;top:8px;right:8px;width:30px;height:30px;padding:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--tx) 8%,transparent);color:var(--hint)}
 .trc-x svg{width:16px;height:16px}
 `;
 document.head.appendChild(st);
 const card=document.createElement('div');card.className='trc';
 card.innerHTML='<div class="trc-en"></div><div class="trc-ru"></div><div class="trc-alt"></div><button class="trc-x" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg></button>';
 document.body.appendChild(card);
 const [cEn,cRu,cAlt]=card.children;
 const hide=()=>card.classList.remove('open');
 card.querySelector('.trc-x').onclick=e=>{e.stopPropagation();hide()};

 const POS_RU={'имя существительное':'сущ.','имя прилагательное':'прил.','глагол':'гл.','наречие':'нар.','предлог':'предл.','местоимение':'мест.','союз':'союз','междометие':'межд.'};
 const cache={};
 let last='';
 async function show(text){
  text=text.replace(/\s+/g,' ').trim().slice(0,200);
  if(!text||text===last&&card.classList.contains('open'))return;
  last=text;
  cEn.textContent=text;cRu.textContent='Перевожу';cAlt.textContent='';
  card.classList.add('open');
  try{
   const key=text.toLowerCase();
   const j=cache[key]||(cache[key]=await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&dt=bd&q='+encodeURIComponent(text)).then(r=>{if(!r.ok)throw 0;return r.json()}));
   if(last!==text)return; // пока ждали ответ, нажали другое слово
   const main=(j[0]||[]).map(x=>x[0]).join('');
   cRu.textContent=main||'Перевод не найден';
   // другие значения по частям речи: не больше двух частей речи и пяти слов в каждой
   cAlt.innerHTML=(j[1]||[]).slice(0,2).map(([pos,terms])=>{
    const t=terms.filter(x=>x.toLowerCase()!==main.toLowerCase()).slice(0,5);
    return t.length?`<div><b>${esc(POS_RU[pos]||pos)}</b> ${t.map(esc).join(', ')}</div>`:'';
   }).join('');
  }catch(e){
   delete cache[text.toLowerCase()];
   if(last===text)cRu.textContent='Не удалось перевести. Проверь интернет.';
  }
 }

 // слово под пальцем или курсором
 function wordAt(x,y){
  let node,off;
  if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(!r)return '';node=r.startContainer;off=r.startOffset}
  else if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(!p)return '';node=p.offsetNode;off=p.offset}
  if(!node||node.nodeType!==3)return '';
  const t=node.textContent,re=/[A-Za-z'’-]/;
  let s=off,e=off;
  while(s>0&&re.test(t[s-1]))s--;
  while(e<t.length&&re.test(t[e]))e++;
  const w=t.slice(s,e).replace(/^['’-]+|['’-]+$/g,'');
  return w.length>1?w:'';
 }
 const selText=()=>{
  const s=window.getSelection();
  if(!s||s.isCollapsed||!s.rangeCount)return '';
  const box=s.getRangeAt(0).commonAncestorContainer;
  const el=box.nodeType===1?box:box.parentElement;
  return el&&el.closest('.tr-on')?s.toString():'';
 };

 document.addEventListener('click',e=>{
  if(card.contains(e.target))return;
  if(selText())return; // выделение обработает selectionchange
  const zone=e.target.closest&&e.target.closest('.tr-on');
  const w=zone?wordAt(e.clientX,e.clientY):'';
  if(w)show(w);else hide();
 });
 let tm;
 document.addEventListener('selectionchange',()=>{
  clearTimeout(tm);
  tm=setTimeout(()=>{const t=selText();if(/[A-Za-z]/.test(t))show(t)},450);
 });
 // карточка закрывается при переходе на другой экран
 new MutationObserver(hide).observe(document.getElementById('app'),{childList:true});
})();
