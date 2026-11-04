/* translate: перевод слова по нажатию и фразы по выделению в текстах с классом tr-on (Reading, текст записи Listening).
   Карточка сверху показывает слово, основной перевод и другие значения. Предложение целиком не переводим:
   контекст ученик понимает сам.
   Перевод берётся из бесплатного неофициального переводчика Google (translate.googleapis.com, без ключа). */
(function(){
 const st=document.createElement('style');
 st.textContent=`
 .tr-on{cursor:pointer;-webkit-user-select:text;user-select:text;-webkit-touch-callout:none}
 ::highlight(trsel){background-color:rgba(255,95,162,.3)}
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
 const hide=()=>{card.classList.remove('open');mark(null);start=null};
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

 // слово под пальцем или курсором: Range с этим словом или null
 function wordAt(x,y){
  let node,off;
  if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(!r)return null;node=r.startContainer;off=r.startOffset}
  else if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(!p)return null;node=p.offsetNode;off=p.offset}
  if(!node||node.nodeType!==3||!node.parentElement.closest('.tr-on'))return null;
  const t=node.textContent,re=/[A-Za-z'’-]/;
  let s=off,e=off;
  while(s>0&&re.test(t[s-1]))s--;
  while(e<t.length&&re.test(t[e]))e++;
  while(s<e&&/['’-]/.test(t[s]))s++;
  while(e>s&&/['’-]/.test(t[e-1]))e--;
  if(e-s<2)return null;
  const r=document.createRange();r.setStart(node,s);r.setEnd(node,e);return r;
 }
 // подсветка розовым через CSS Highlight API (где его нет, просто без подсветки)
 function mark(r){
  if(!(window.CSS&&CSS.highlights&&window.Highlight))return;
  if(r)CSS.highlights.set('trsel',new Highlight(r));else CSS.highlights.delete('trsel');
 }
 const selText=()=>{
  const s=window.getSelection();
  if(!s||s.isCollapsed||!s.rangeCount)return '';
  const box=s.getRangeAt(0).commonAncestorContainer;
  const el=box.nodeType===1?box:box.parentElement;
  return el&&el.closest('.tr-on')?s.toString():'';
 };

 // Фраза без системного выделения (в Telegram на iPhone его нет):
 // зажал первое слово, потом нажал последнее, и переводится всё между ними.
 let start=null,lpTimer=0,lpFired=false,tx=0,ty=0;
 document.addEventListener('touchstart',e=>{
  lpFired=false;
  const t=e.touches[0];if(e.touches.length>1||!t)return;
  tx=t.clientX;ty=t.clientY;
  const r=wordAt(tx,ty);if(!r)return;
  lpTimer=setTimeout(()=>{
   lpFired=true;start=r;mark(r);
   last='';cEn.textContent=r.toString();cRu.textContent='Нажми на последнее слово фразы';cAlt.textContent='';
   card.classList.add('open');
   const hf=window.Telegram&&Telegram.WebApp&&Telegram.WebApp.HapticFeedback;if(hf)hf.selectionChanged();
  },450);
 },{passive:true});
 document.addEventListener('touchmove',e=>{
  const t=e.touches[0];if(t&&Math.hypot(t.clientX-tx,t.clientY-ty)>10)clearTimeout(lpTimer);
 },{passive:true});
 document.addEventListener('touchend',e=>{clearTimeout(lpTimer);if(lpFired&&e.cancelable)e.preventDefault()});
 document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.tr-on')&&('ontouchstart' in window))e.preventDefault()});

 document.addEventListener('click',e=>{
  if(card.contains(e.target))return;
  if(lpFired){lpFired=false;return} // это был отпущенный палец после зажатия
  if(selText())return; // системное выделение обработает selectionchange
  const r=wordAt(e.clientX,e.clientY);
  if(!r){start=null;hide();return}
  if(start){ // второе нажатие: фраза от первого слова до этого
   const ph=document.createRange();
   const a=start.compareBoundaryPoints(Range.START_TO_START,r)<=0;
   ph.setStart(a?start.startContainer:r.startContainer,a?start.startOffset:r.startOffset);
   ph.setEnd(a?r.endContainer:start.endContainer,a?r.endOffset:start.endOffset);
   start=null;mark(ph);show(ph.toString());return;
  }
  mark(r);show(r.toString());
 });
 let tm;
 document.addEventListener('selectionchange',()=>{
  clearTimeout(tm);
  tm=setTimeout(()=>{const t=selText();if(/[A-Za-z]/.test(t)){mark(null);show(t)}},450);
 });
 // карточка закрывается при переходе на другой экран
 new MutationObserver(hide).observe(document.getElementById('app'),{childList:true});
})();
