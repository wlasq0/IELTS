/* v3: общий голос озвучки. Карточки, квиз и Listening используют один и тот же голос
   (лучший подбирается автоматически, выбор запоминается). Выбор голоса на главной. */
function speak(t){speakAll(t,null)}
const baseHome=home;
home=function(){
 baseHome();
 const tp=$('#tp');
 if(tp){
  tp.insertAdjacentHTML('afterend','<h2>Голос озвучки</h2><select id="vs"></select><div class="row"><button id="vt" class="sec">Проверить голос</button></div><p class="tag">Один голос для карточек, квиза и Listening. Лучший из доступных подбирается автоматически.</p>');
  initVoice();
 }
};
home();
