/* remind: экран «Напоминания» — время напоминаний бота и часовой пояс телефона.
   Боту данные можно передать только через Telegram.WebApp.sendData, а он работает, когда Mini App открыт
   кнопкой «Напоминания» под полем ввода в чате с ботом (тогда initData пустой). После отправки Mini App закрывается.
   Бот кладёт текущее время в адрес кнопки: ?s=remind&t=14:00,21:00 */
const RKEY='ielts_remind_v1';
const RDEF=['14:00','21:00'];
function remindTimes(){
 const q=new URLSearchParams(location.search).get('t');
 if(q!==null)return q?q.split(',').filter(x=>/^\d\d:\d\d$/.test(x)):[];
 try{const v=JSON.parse(localStorage.getItem(RKEY));if(Array.isArray(v))return v}catch(e){}
 return RDEF.slice();
}
function tzInfo(){
 const off=-new Date().getTimezoneOffset(),h=Math.trunc(off/60),m=Math.abs(off%60);
 let name='';try{name=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
 return {off,name,label:'UTC'+(off>=0?'+':'-')+Math.abs(h)+(m?':'+String(m).padStart(2,'0'):'')};
}
// открыт кнопкой под полем ввода: только тогда sendData дойдёт до бота
const canSend=()=>{const tg=window.Telegram&&Telegram.WebApp;return !!(tg&&tg.platform&&tg.platform!=='unknown'&&!tg.initData)};

(function(){
 const st=document.createElement('style');
 st.textContent=`
 .rt{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;background:var(--glass);border:1px solid var(--line);margin-bottom:8px;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
 .rt input{flex:1;font:inherit;font-size:22px;font-weight:700;border:0;background:none;color:var(--tx);padding:4px 0;min-width:0}
 .rt button{width:36px;height:36px;padding:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--bad) 14%,transparent);color:var(--bad)}
 .rt button svg{width:18px;height:18px}
 .tz{display:flex;justify-content:space-between;gap:10px;font-size:14px;padding:12px 14px;border-radius:16px;background:var(--glass);border:1px solid var(--line)}
 .tz b{font-weight:600}
 .rnote{font-size:14px;padding:12px 14px;border-radius:14px;margin-top:10px;background:color-mix(in srgb,#ff5fa2 14%,transparent)}
 `;
 document.head.appendChild(st);
})();

function remind(){
 let times=remindTimes();
 const tz=tzInfo();
 const draw=()=>{
  app.innerHTML=backBtn()+`<h1>Напоминания</h1>
  <p class="tag">Бот пришлёт напоминание в выбранное время, если ты не писал ему последние 2 часа.</p>
  <h2>Время</h2>
  <div id="rl">${times.map((t,i)=>`<div class="rt"><input type="time" step="60" value="${t}" data-i="${i}"><button data-x="${i}" aria-label="Убрать">${ICON.cross}</button></div>`).join('')||'<p class="tag">Напоминаний нет. Бот не будет присылать их совсем.</p>'}</div>
  ${times.length<6?'<div class="row"><button class="sec" id="ra">Добавить время</button></div>':''}
  <h2>Часовой пояс</h2>
  <div class="tz"><span>Как на телефоне</span><b>${tz.label}${tz.name?' · '+esc(tz.name):''}</b></div>
  <div class="row"><button id="rs">Сохранить</button></div>
  <div id="rm"></div>`;
  bindBack();
  const sync=()=>document.querySelectorAll('.rt input').forEach(inp=>{if(inp.value)times[+inp.dataset.i]=inp.value});
  document.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{sync();times.splice(+b.dataset.x,1);draw()});
  if($('#ra'))$('#ra').onclick=()=>{sync();times.push('12:00');draw()};
  $('#rs').onclick=()=>{
   sync();
   times=[...new Set(times.filter(x=>/^\d\d:\d\d$/.test(x)))].sort();
   try{localStorage.setItem(RKEY,JSON.stringify(times))}catch(e){}
   if(canSend()){
    Telegram.WebApp.sendData(JSON.stringify({type:'remind',times,tz:tz.name,off:tz.off})); // Mini App закроется
   }else{
    $('#rm').innerHTML='<div class="rnote">Время запомнено здесь, но бот его пока не получил. Открой этот экран кнопкой «Напоминания» под полем ввода в чате с ботом и нажми «Сохранить». Если кнопки нет, отправь боту /start.</div>';
   }
  };
 };
 draw();
}

// бот открыл Mini App сразу на экране напоминаний
// откладываем, чтобы сначала загрузились ui.js (иконки) и главная
if(new URLSearchParams(location.search).get('s')==='remind')setTimeout(remind,0);
