/* ui: главная и общий стиль.
   Главная: блок «Карточки» с градиентом и прогрессом, темы чипами, плитки разделов.
   Голос озвучки спрятан в настройки (шестерёнка).
   Фон (wave.js) не трогаем: плитки полупрозрачные с размытием, чтобы волна просвечивала. */
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
  arrow:s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  check:s('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  cross:s('<path d="M7 7l10 10M17 7 7 17"/>'),
  eye:s('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  eyeOff:s('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/>'),
  home:s('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
  chart:s('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>')
 };
})();

(function(){
 const st=document.createElement('style');
 st.textContent=`
 :root{--glass:color-mix(in srgb,var(--sec) 62%,transparent);--line:color-mix(in srgb,var(--tx) 8%,transparent);--r:20px;--grad:linear-gradient(135deg,#6d4dff 0%,#9b5cff 45%,#ff5fa2 100%)}
 body{padding:16px 16px 40px;font:16px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
 h1{font-size:26px;font-weight:750;letter-spacing:-.02em;margin:6px 0 12px}
 h2{font-size:13px;font-weight:650;text-transform:uppercase;letter-spacing:.06em;color:var(--hint);margin:22px 0 10px}
 button{border-radius:14px;font-weight:600;transition:transform .12s,opacity .12s;-webkit-tap-highlight-color:transparent}
 button:active{transform:scale(.97)}
 button.sec{background:var(--glass);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
 .back{display:inline-flex;align-items:center;gap:4px;background:var(--glass);color:var(--tx);padding:8px 14px 8px 12px;border-radius:999px;margin:0 0 10px;font-size:15px}
 .back::before{content:"";width:8px;height:8px;border-left:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);margin:0 4px 0 4px}
 .card{border-radius:24px;padding:30px 18px;background:var(--glass);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid var(--line)}
 .card .en{font-size:24px;letter-spacing:-.01em}
 .opt{border-radius:16px;padding:14px 16px;font-weight:500;border:1px solid var(--line)}
 select{border-radius:14px;padding:12px;border:1px solid var(--line)}
 .passage{border-radius:16px}
 .tag{line-height:1.4}
 .item .ic svg{width:14px;height:14px}

 /* шапка */
 .top{display:flex;align-items:center;justify-content:space-between;margin:2px 0 14px}
 .top h1{margin:0}.top .sub{font-size:14px;color:var(--hint);margin-top:2px}
 .ibtn{width:42px;height:42px;padding:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--glass);color:var(--tx);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid var(--line)}
 .ibtn svg{width:21px;height:21px}

 /* главный блок */
 .hero{position:relative;overflow:hidden;border-radius:26px;padding:20px;color:#fff;background:var(--grad);box-shadow:0 12px 32px -12px rgba(109,77,255,.55)}
 .hero .cap{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:650;text-transform:uppercase;letter-spacing:.06em;opacity:.85;margin-bottom:10px}
 .hero .cap svg{width:16px;height:16px}
 .hero .row1{display:flex;align-items:center;gap:16px}
 .hero .big{font-size:44px;font-weight:800;line-height:1;letter-spacing:-.03em}
 .hero .lbl{font-size:14px;opacity:.85;margin-top:4px}
 .hero .ring{margin-left:auto;width:72px;height:72px;position:relative;flex:none}
 .hero .ring svg{width:72px;height:72px;transform:rotate(-90deg)}
 .hero .ring span{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:15px;font-weight:700;line-height:1.1}
 .hero .ring small{font-size:10px;font-weight:500;opacity:.8}
 .hero .meta{display:flex;gap:8px;margin:16px 0 14px;flex-wrap:wrap}
 .hero .meta span{font-size:13px;background:rgba(255,255,255,.18);padding:5px 10px;border-radius:999px}
 .hero .go{width:100%;background:#fff;color:#5b3df5;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px}
 .hero .go svg{width:18px;height:18px}

 /* темы */
 .chips{display:flex;gap:8px;overflow-x:auto;margin:16px -16px 0;padding:2px 16px 4px;scrollbar-width:none}
 .chips::-webkit-scrollbar{display:none}
 .chip{flex:none;padding:8px 14px;border-radius:999px;font-size:14px;font-weight:550;background:var(--glass);color:var(--tx);border:1px solid var(--line);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
 .chip.on{background:var(--tx);color:var(--bg);border-color:transparent}

 /* плитки */
 .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
 .grid.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
 .tile.wide{grid-column:span 2;flex-direction:row;align-items:center;min-height:0;gap:14px}
 .tile{display:flex;flex-direction:column;align-items:flex-start;gap:10px;text-align:left;padding:14px 12px;border-radius:var(--r);background:var(--glass);color:var(--tx);border:1px solid var(--line);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);min-height:108px}
 .tile .ico{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}
 .tile .ico svg{width:22px;height:22px}
 .tile b{font-size:15px;font-weight:650}
 .tile small{display:block;font-size:12.5px;color:var(--hint);font-weight:500;margin-top:2px}

 /* настройки */
 .sheet{position:fixed;inset:0;z-index:10;display:flex;align-items:flex-end;pointer-events:none}
 .sheet .bg{position:absolute;inset:0;background:rgba(0,0,0,.35);opacity:0;transition:opacity .25s}
 .sheet .body{position:relative;width:100%;background:var(--bg);border-radius:24px 24px 0 0;padding:10px 16px 28px;transform:translateY(100%);transition:transform .28s cubic-bezier(.2,.8,.2,1)}
 .sheet.open{pointer-events:auto}.sheet.open .bg{opacity:1}.sheet.open .body{transform:none}
 .sheet .grab{width:40px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 12px}
 .sheet h2{margin-top:6px}

 /* нижняя панель */
 .tabs-sp{height:calc(64px + env(safe-area-inset-bottom))}
 /* «жидкое стекло», как у панели Telegram: почти прозрачный фон, сильное размытие, светлая кромка */
 .tabs{position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:5;display:flex;gap:2px;padding:4px;border-radius:999px;
  background:color-mix(in srgb,var(--bg) 45%,transparent);-webkit-backdrop-filter:blur(24px) saturate(180%);backdrop-filter:blur(24px) saturate(180%);
  border:1px solid color-mix(in srgb,#fff 35%,transparent);box-shadow:inset 0 1px 0 color-mix(in srgb,#fff 40%,transparent),0 10px 30px -12px rgba(0,0,0,.35)}
 .tabs button{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:96px;padding:6px 16px 5px;border-radius:999px;background:none;color:var(--hint);font-size:11px;font-weight:600}
 .tabs button svg{width:24px;height:24px}
 .tabs button.on{color:#ff5fa2;background:color-mix(in srgb,var(--tx) 9%,transparent)}

 /* статистика */
 .kpi{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
 .k{display:flex;flex-direction:column;padding:14px 12px;border-radius:var(--r);background:var(--glass);border:1px solid var(--line);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
 .k b{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.1}
 .k span{font-size:13px;line-height:1.25;margin-top:2px}
 .k small{font-size:12px;color:var(--hint);margin-top:6px}
 .k.hot{background:var(--grad);color:#fff;border-color:transparent}.k.hot small{color:rgba(255,255,255,.8)}
 .box{padding:16px;border-radius:var(--r);background:var(--glass);border:1px solid var(--line);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
 .cal-h{font-size:14px;color:var(--hint);margin-bottom:10px}
 .cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
 .wd{font-size:11px;color:var(--hint);text-align:center}
 .cd{aspect-ratio:1;padding:0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--hint);background:color-mix(in srgb,var(--hint) 16%,transparent)}
 .cd.l1{background:#ffc93c;color:#5c4300}
 .cd.l2{background:#2ecc71;color:#fff}
 .cd.now{box-shadow:0 0 0 2px var(--bg),0 0 0 4px #ff5fa2}
 .cd.sel{outline:2px solid var(--tx);outline-offset:1px}
 .cd.fut{background:none}
 .cal-d{margin-top:12px;font-size:14px;min-height:20px}
 .leg{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px;font-size:12px;color:var(--hint)}
 .leg span{display:flex;align-items:center;gap:5px}
 .leg i{width:12px;height:12px;border-radius:4px;background:color-mix(in srgb,var(--hint) 16%,transparent)}
 .leg i.l1{background:#ffc93c}.leg i.l2{background:#2ecc71}
 .bal{display:flex;align-items:center;gap:16px}
 .dn{position:relative;width:118px;height:118px;flex:none}
 .dn svg{width:118px;height:118px}
 .dn span{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:24px;font-weight:800;line-height:1}
 .dn small{font-size:11px;font-weight:500;color:var(--hint);margin-top:2px}
 .bl{flex:1;display:flex;flex-direction:column;gap:8px;font-size:14px}
 .bl div{display:flex;align-items:center;gap:8px}.bl i{width:10px;height:10px;border-radius:50%;flex:none}
 .bl span{flex:1}.bl b{font-weight:600;color:var(--hint);font-size:13px}
 .hint{margin:8px 4px 0}
 .pr{margin-bottom:12px}
 .pr-t{display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px}.pr-t b{font-weight:600;color:var(--hint)}
 .pr-b{height:8px;border-radius:4px;background:color-mix(in srgb,var(--hint) 16%,transparent);overflow:hidden}
 .pr-b div{height:100%;border-radius:4px}

 /* слова и предложения */
 .prog{height:6px;border-radius:3px;background:var(--glass);overflow:hidden;margin:4px 0 14px}
 .prog div{height:100%;border-radius:3px;background:linear-gradient(90deg,#6d4dff,#ff5fa2);transition:width .3s}
 .wcard{min-height:170px;gap:6px}
 .wcard .en{font-size:30px;font-weight:700}
 .pos{align-self:center;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:color-mix(in srgb,#ff5fa2 16%,transparent);color:#ff5fa2}
 .spk{align-self:center;margin-top:8px;display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:999px;background:var(--grad);color:#fff}
 .spk svg{width:18px;height:18px}
 .winput{width:100%;font:inherit;font-size:18px;padding:15px 16px;border-radius:16px;border:1.5px solid var(--line);background:var(--glass);color:var(--tx);outline:none;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);transition:border-color .2s}
 .winput:focus{border-color:#ff5fa2}
 .winput:disabled{opacity:1}
 .sinput{min-height:100px;resize:vertical;font-size:17px;line-height:1.4}
 .shake{animation:shake .3s}
 @keyframes shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
 .fb{border-radius:14px;margin-top:10px;font-size:15px}
 .fb.ok,.fb.bad{padding:12px 14px}
 .fb.ok{background:color-mix(in srgb,var(--ok) 16%,transparent);color:var(--ok)}
 .fb.bad{background:color-mix(in srgb,var(--bad) 14%,transparent);color:var(--bad)}
 .tr{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:6px;color:var(--hint)}
 .tx{transition:filter .2s}.tx.hid{filter:blur(6px);user-select:none;cursor:pointer}
 .eye{display:flex;padding:6px;border-radius:50%;background:color-mix(in srgb,#ff5fa2 16%,transparent);color:#ff5fa2}.eye svg{width:18px;height:18px}
 .res-card{text-align:center;padding:30px 16px;border-radius:24px;color:#fff;background:var(--grad)}
 .res-num{font-size:56px;font-weight:800;letter-spacing:-.03em;line-height:1}.res-num span{font-size:26px;opacity:.75}
 .res-t{margin-top:8px;opacity:.9}
 .miss{border-radius:16px;background:var(--glass);border:1px solid var(--line);overflow:hidden;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
 .miss div{display:flex;justify-content:space-between;gap:12px;padding:12px 14px;border-top:1px solid var(--line)}
 .miss div:first-child{border-top:0}.miss span{color:var(--hint);text-align:right}
 .sent div{flex-direction:column;gap:2px}.sent span{text-align:left;color:var(--tx)}
 `;
 document.head.appendChild(st);
})();

function ring(part,total){
 const r=30,c=2*Math.PI*r,f=total?part/total:0;
 return `<svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="${r}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="7"/>
  <circle cx="36" cy="36" r="${r}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-f)}"/></svg>`;
}
const doneOf=list=>list.filter(x=>(prog[x.id]||{}).s==='g').length;

home=function(){
 voiceCtx='c';
 const t=today(),p=pool();
 const due=p.filter(w=>srs[w.id]&&srs[w.id].d<=t).length;
 const known=p.filter(w=>srs[w.id]&&srs[w.id].b>=3).length;
 const fresh=p.filter(w=>!srs[w.id]).length;
 const v=vstats();
 const tile=(id,ic,c,title,sub,cls='')=>`<button class="tile ${cls}" id="${id}" style="--c:${c}"><span class="ico">${ICON[ic]}</span><span><b>${title}</b><small>${sub}</small></span></button>`;
 app.innerHTML=`
 <div class="top"><div><h1>IELTS C1</h1><div class="sub">Тренажёр фраз и слов</div></div><button class="ibtn" id="set" aria-label="Настройки">${ICON.gear}</button></div>
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
  ${tile('b7','sentence','#ff5fa2','Предложения',v.learned?v.learned+' '+plural(v.learned,'слово','слова','слов'):'Нет слов')}
  ${tile('b2','quiz','#2ecc71','Квиз','10 вопросов, четыре варианта ответа','wide')}
 </div>
 <h2>Экзамен</h2>
 <div class="grid">
  ${tile('b3','reading','#3fa9ff','Reading',doneOf(READING)+' из '+READING.length)}
  ${tile('b4','listening','#ff5fa2','Listening',doneOf(LISTENING)+' из '+LISTENING.length)}
  ${tile('b5','writing','#9b5cff','Writing',doneOf(WRITING)+' из '+WRITING.length)}
 </div>
 <div class="sheet" id="sh"><div class="bg"></div><div class="body"><div class="grab"></div>
  <h2>Голос озвучки</h2><select id="vs"></select>
  <div class="row"><button id="vt" class="sec">Проверить голос</button></div>
  <p class="tag">Этот голос читает карточки, квиз и слова. Лучший из доступных выбирается сам. Для Listening голос выбирается отдельно, на экране задания.</p>
  <p class="tag">Карточки возвращаются через 1, 2, 4, 8 и 16 дней. После ошибки карточка снова появится сегодня.</p>
  <div class="row"><button id="shc">Готово</button></div>
 </div></div>
 ${tabBar('home')}`;
 bindTabs();
 document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{topic=b.dataset.t;const x=document.querySelector('.chips').scrollLeft;home();document.querySelector('.chips').scrollLeft=x});
 $('#b1').onclick=cards;$('#b2').onclick=quiz;$('#b6').onclick=words;$('#b7').onclick=sentencesHome;
 $('#b3').onclick=readingList;$('#b4').onclick=listeningList;$('#b5').onclick=writingList;
 const sh=$('#sh');
 $('#set').onclick=()=>sh.classList.add('open');
 sh.querySelector('.bg').onclick=$('#shc').onclick=()=>sh.classList.remove('open');
 initVoice();
};
home();
