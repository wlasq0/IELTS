/* ui: главная и общий стиль.
   Цвета берутся из темы Telegram, поверхности сплошные, разделы списками, как в настройках Telegram.
   Голос озвучки спрятан в настройки за шестерёнкой. Фон (wave.js) не трогаем. */
const ICON=(()=>{
 const s=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
 return {
  words:s('<rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7.5 14h9"/>'),
  quiz:s('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>'),
  reading:s('<path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z"/>'),
  listening:s('<path d="M3 15v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="14" width="4" height="7" rx="2"/><rect x="17" y="14" width="4" height="7" rx="2"/>'),
  writing:s('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  gear:s('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  speaker:s('<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'),
  chevron:s('<path d="m9 6 6 6-6 6"/>'),
  back:s('<path d="m15 6-6 6 6 6"/>'),
  check:s('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  cross:s('<path d="M7 7l10 10M17 7 7 17"/>'),
  sentence:s('<path d="M4 6h16M4 12h16M4 18h10"/>'),
  eye:s('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  eyeOff:s('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/>')
 };
})();

(function(){
 const st=document.createElement('style');
 st.textContent=`
 :root{--card:var(--sec);--line:color-mix(in srgb,var(--hint) 22%,transparent)}
 body{padding:12px 16px 40px;font:16px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
 h1{font-size:24px;font-weight:700;margin:4px 0 12px}
 h2{font-size:15px;font-weight:600;color:var(--hint);margin:20px 4px 8px}
 button{border-radius:12px;font-weight:600;-webkit-tap-highlight-color:transparent}
 button:active{opacity:.7}
 button.sec,body.wave button.sec,body.wave select,body.wave .stat div{background:var(--card);-webkit-backdrop-filter:none;backdrop-filter:none}
 .back{display:inline-flex;align-items:center;gap:2px;background:none;color:var(--btn);padding:6px 0;margin:0 0 8px;font-weight:500}
 .back::before{content:"";width:9px;height:9px;border-left:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);margin:0 6px 0 4px}
 .card{border-radius:16px;padding:28px 18px;background:var(--card)}
 .card .en{font-size:22px}
 .opt{border-radius:12px;padding:13px 16px;font-weight:500}
 select{border-radius:12px;padding:12px}
 .passage{border-radius:12px}
 .item .ic svg{width:14px;height:14px}

 .top{display:flex;align-items:center;justify-content:space-between;margin:2px 0 14px}
 .top h1{margin:0}.top .sub{font-size:14px;color:var(--hint)}
 .ibtn{width:40px;height:40px;padding:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--card);color:var(--hint)}
 .ibtn svg{width:20px;height:20px}

 .sum{background:var(--card);border-radius:16px;padding:16px}
 .sum .lbl{font-size:14px;color:var(--hint)}
 .sum .big{font-size:34px;font-weight:700;line-height:1.15;margin-top:2px}
 .sum .txt{font-size:15px}
 .bar{height:6px;border-radius:3px;background:var(--line);margin:14px 0 6px;overflow:hidden}
 .bar div{height:100%;background:var(--btn);border-radius:3px}
 .sum .cap{font-size:13px;color:var(--hint);margin-bottom:14px}
 .sum button{width:100%}

 .chips{display:flex;gap:6px;overflow-x:auto;margin:14px -16px 0;padding:0 16px 2px;scrollbar-width:none}
 .chips::-webkit-scrollbar{display:none}
 .chip{flex:none;padding:7px 13px;border-radius:999px;font-size:14px;font-weight:500;background:var(--card);color:var(--tx)}
 .chip.on{background:var(--btn);color:var(--btx)}

 .list{background:var(--card);border-radius:16px;overflow:hidden}
 .li{display:flex;align-items:center;gap:14px;width:100%;padding:12px 14px;border-radius:0;background:none;color:var(--tx);text-align:left;font-weight:400}
 .li+.li{border-top:1px solid var(--line)}
 .li .i{color:var(--btn);flex:none;display:flex}.li .i svg{width:22px;height:22px}
 .li .t{flex:1;min-width:0}.li b{display:block;font-weight:500}
 .li small{display:block;font-size:13px;color:var(--hint)}
 .li .v{font-size:14px;color:var(--hint);white-space:nowrap}
 .li .c{color:var(--hint);display:flex}.li .c svg{width:16px;height:16px}

 .sheet{position:fixed;inset:0;z-index:10;display:flex;align-items:flex-end;pointer-events:none}
 .sheet .bg{position:absolute;inset:0;background:rgba(0,0,0,.4);opacity:0;transition:opacity .2s}
 .sheet .body{position:relative;width:100%;background:var(--bg);border-radius:16px 16px 0 0;padding:8px 16px 24px;transform:translateY(100%);transition:transform .25s ease-out}
 .sheet.open{pointer-events:auto}.sheet.open .bg{opacity:1}.sheet.open .body{transform:none}
 .sheet .grab{width:36px;height:4px;border-radius:2px;background:var(--line);margin:0 auto 8px}

 .prog{height:4px;border-radius:2px;background:var(--line);overflow:hidden;margin:2px 0 14px}
 .prog div{height:100%;background:var(--btn);transition:width .3s}
 .wcard{min-height:160px;gap:4px}
 .wcard .en{font-size:28px;font-weight:700}
 .pos{align-self:center;font-size:14px;color:var(--hint)}
 .spk{align-self:center;margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;color:var(--btn);padding:4px 8px;font-weight:500}
 .spk svg{width:18px;height:18px}
 .winput{width:100%;font:inherit;font-size:17px;padding:14px;border-radius:12px;border:1.5px solid transparent;background:var(--card);color:var(--tx);outline:none}
 .winput:focus{border-color:var(--btn)}
 .winput:disabled{opacity:1}
 .shake{animation:shake .3s}
 @keyframes shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
 .fb{margin-top:10px;font-size:15px}
 .fb.ok,.fb.bad{padding:12px 14px;border-radius:12px;background:var(--card)}
 .fb.ok b{color:var(--ok)}.fb.bad b{color:var(--bad)}
 .res-card{text-align:center;padding:24px 16px;border-radius:16px;background:var(--card)}
 .res-num{font-size:44px;font-weight:700;line-height:1}.res-num span{font-size:22px;color:var(--hint)}
 .res-t{margin-top:6px;color:var(--hint)}
 .miss{background:var(--card);border-radius:16px;overflow:hidden}
 .miss div{display:flex;justify-content:space-between;gap:12px;padding:12px 14px}
 .miss div+div{border-top:1px solid var(--line)}
 .miss span{color:var(--hint);text-align:right}
 .sent div{flex-direction:column;gap:2px}.sent span{text-align:left;color:var(--tx)}
 .tr{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:6px;color:var(--hint)}
 .tx{transition:filter .2s}.tx.hid{filter:blur(6px);user-select:none;cursor:pointer}
 .eye{display:flex;background:none;color:var(--hint);padding:4px}.eye svg{width:20px;height:20px}
 .sinput{min-height:96px;resize:vertical;line-height:1.4}
 `;
 document.head.appendChild(st);
})();

const doneOf=list=>list.filter(x=>(prog[x.id]||{}).s==='g').length;

home=function(){
 voiceCtx='c';
 const t=today(),p=pool();
 const due=p.filter(w=>srs[w.id]&&srs[w.id].d<=t).length;
 const known=p.filter(w=>srs[w.id]&&srs[w.id].b>=3).length;
 const fresh=p.filter(w=>!srs[w.id]).length;
 const v=vstats();
 const row=(id,ic,title,sub,val)=>`<button class="li" id="${id}"><span class="i">${ICON[ic]}</span><span class="t"><b>${title}</b><small>${sub}</small></span><span class="v">${val}</span><span class="c">${ICON.chevron}</span></button>`;
 app.innerHTML=`
 <div class="top"><div><h1>IELTS C1</h1><div class="sub">Тренажёр фраз и слов</div></div><button class="ibtn" id="set" aria-label="Настройки">${ICON.gear}</button></div>
 <div class="sum">
  <div class="lbl">Карточки</div>
  ${due?`<div class="big">${due}</div><div class="txt">${plural(due,'фраза ждёт','фразы ждут','фраз ждут')} повтора</div>`:`<div class="big">0</div><div class="txt">Повторов на сегодня нет</div>`}
  <div class="bar"><div style="width:${p.length?known/p.length*100:0}%"></div></div>
  <div class="cap">Выучено ${known} из ${p.length}, новых ${fresh}</div>
  <button id="b1">${due?'Повторить':'Учить новые'}</button>
 </div>
 <div class="chips">${['all',...topics].map(x=>`<button class="chip${x===topic?' on':''}" data-t="${esc(x)}">${x==='all'?'Все темы':esc(x)}</button>`).join('')}</div>
 <h2>Лексика</h2>
 <div class="list">
  ${row('b6','words','Слова','Пишешь перевод слова',v.due?v.due+' на повтор':v.fresh+' новых')}
  ${row('b7','sentence','Предложения','Пишешь с выученными словами',v.learned?v.learned+' '+plural(v.learned,'слово','слова','слов'):'')}
  ${row('b2','quiz','Квиз','Четыре варианта ответа','10 вопросов')}
 </div>
 <h2>Экзамен</h2>
 <div class="list">
  ${row('b3','reading','Reading','True, False, Not Given',doneOf(READING)+' из '+READING.length)}
  ${row('b4','listening','Listening','Запись и вопросы к ней',doneOf(LISTENING)+' из '+LISTENING.length)}
  ${row('b5','writing','Writing','Эссе Task 2 за 40 минут',doneOf(WRITING)+' из '+WRITING.length)}
 </div>
 <div class="sheet" id="sh"><div class="bg"></div><div class="body"><div class="grab"></div>
  <h2>Голос озвучки</h2><select id="vs"></select>
  <div class="row"><button id="vt" class="sec">Проверить голос</button></div>
  <p class="tag">Этот голос читает карточки, квиз и слова. Лучший из доступных выбирается сам. Для Listening голос выбирается отдельно, на экране задания.</p>
  <p class="tag">Карточки возвращаются через 1, 2, 4, 8 и 16 дней. После ошибки карточка снова появится сегодня.</p>
  <div class="row"><button id="shc">Готово</button></div>
 </div></div>`;
 document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{topic=b.dataset.t;const x=document.querySelector('.chips').scrollLeft;home();document.querySelector('.chips').scrollLeft=x});
 $('#b1').onclick=cards;$('#b2').onclick=quiz;$('#b6').onclick=words;$('#b7').onclick=sentencesHome;
 $('#b3').onclick=readingList;$('#b4').onclick=listeningList;$('#b5').onclick=writingList;
 const sh=$('#sh');
 $('#set').onclick=()=>sh.classList.add('open');
 sh.querySelector('.bg').onclick=$('#shc').onclick=()=>sh.classList.remove('open');
 initVoice();
};
home();
