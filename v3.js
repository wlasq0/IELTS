/* v3: голос озвучки.
   Карточки и квиз: общий голос, выбирается на главной (ключ ielts_voice).
   Listening: свой отдельный голос, выбирается на экране задания (ключ ielts_voice_listening). */
let voiceCtx='c';
const voiceKey=()=>voiceCtx==='l'?'ielts_voice_listening':'ielts_voice';
function pickVoice(){const vs=enVoices();if(!vs.length)return null;
 let saved='';try{saved=localStorage.getItem(voiceKey())||''}catch(e){}
 return vs.find(v=>v.name===saved)||vs.slice().sort((a,b)=>voiceScore(b)-voiceScore(a))[0]}
function initVoice(){
 const sel=$('#vs');if(!sel)return;
 const fill=()=>{const vs=enVoices().sort((a,b)=>voiceScore(b)-voiceScore(a));
  if(!vs.length){sel.innerHTML='<option>Голоса не найдены</option>';return}
  const cur=pickVoice();
  sel.innerHTML=vs.map(v=>`<option value="${esc(v.name)}"${cur&&v.name===cur.name?' selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')};
 fill();if(window.speechSynthesis)speechSynthesis.onvoiceschanged=fill;
 sel.onchange=()=>{try{localStorage.setItem(voiceKey(),sel.value)}catch(e){}};
 $('#vt').onclick=()=>{speakAll("Hello! This is how the recording will sound. The deadline is the fourteenth of December.",null)};
}
function speak(t){speakAll(t,null)}
const baseListening=listening;
listening=function(k){voiceCtx='l';baseListening(k)};
const baseHome=home;
home=function(){
 voiceCtx='c';
 baseHome();
 const tp=$('#tp');
 if(tp){
  tp.insertAdjacentHTML('afterend','<h2>Голос озвучки</h2><select id="vs"></select><div class="row"><button id="vt" class="sec">Проверить голос</button></div><p class="tag">Голос для карточек и квиза. Лучший из доступных подбирается автоматически. У Listening выбор голоса отдельный, на экране задания.</p>');
  initVoice();
 }
};
home();
