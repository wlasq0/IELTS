/* vocab: режим «Слова». Показывается английское слово, нужно написать перевод.
   Регистр, «ё/е» и знаки препинания не важны. Можно написать несколько вариантов через запятую.
   В слове от 5 букв одна опечатка засчитывается, но правильное написание показывается.
   Формат: [слово, часть речи, "перевод|ещё вариант|..."], первый вариант главный. */
const VT=[["Technology",[["obsolete","adj","устаревший|устарелый|вышедший из употребления"],["innovative","adj","инновационный|новаторский"],["cutting-edge","adj","передовой|новейший|ультрасовременный"],["automation","n","автоматизация"],["surveillance","n","слежка|наблюдение|надзор"],["breakthrough","n","прорыв"],["device","n","устройство|прибор|девайс"],["reliance","n","зависимость|опора"],["artificial","adj","искусственный"],["encrypt","v","шифровать|зашифровать"],["vulnerable","adj","уязвимый"],["gadget","n","гаджет|устройство|приспособление"],["obsession","n","одержимость|навязчивая идея"],["upgrade","v","обновлять|обновить|модернизировать|улучшать|улучшить"],["widespread","adj","широко распространённый|распространённый|повсеместный"],["efficiency","n","эффективность|продуктивность"],["drawback","n","недостаток|минус|изъян"],["harness","v","использовать|обуздать|задействовать"],["disrupt","v","нарушать|нарушить|подрывать|подорвать|срывать|сорвать"],["privacy","n","конфиденциальность|частная жизнь|неприкосновенность частной жизни|приватность"]]],
["Media",[["bias","n","предвзятость|пристрастность|предубеждение"],["coverage","n","освещение|охват"],["censorship","n","цензура"],["headline","n","заголовок"],["misleading","adj","вводящий в заблуждение|обманчивый"],["sensational","adj","сенсационный"],["credible","adj","достоверный|заслуживающий доверия|правдоподобный"],["broadcast","v","транслировать|вещать|передавать"],["audience","n","аудитория|зрители|публика"],["influential","adj","влиятельный"],["propaganda","n","пропаганда"],["journalist","n","журналист"],["advertisement","n","реклама|объявление|рекламное объявление"],["manipulate","v","манипулировать|управлять"],["viral","adj","вирусный"],["outlet","n","издание|сми|средство массовой информации|выход"],["scrutiny","n","пристальное внимание|тщательная проверка|проверка|контроль"],["tabloid","n","таблоид|бульварная газета"],["publicity","n","огласка|публичность|реклама"],["anonymous","adj","анонимный"]]],
["Crime & Law",[["offender","n","правонарушитель|преступник|нарушитель"],["deterrent","n","сдерживающий фактор|средство устрашения|сдерживающее средство"],["sentence","n","приговор|предложение"],["imprisonment","n","тюремное заключение|заключение|лишение свободы"],["rehabilitation","n","реабилитация|исправление"],["juvenile","adj","несовершеннолетний|юношеский"],["legislation","n","законодательство|закон"],["enforce","v","обеспечивать соблюдение|обеспечить соблюдение|применять|исполнять"],["verdict","n","вердикт|приговор|решение"],["witness","n","свидетель|очевидец"],["evidence","n","доказательство|доказательства|улики|улика"],["fraud","n","мошенничество|обман"],["theft","n","кража|воровство"],["punishment","n","наказание"],["lawsuit","n","иск|судебный иск|судебный процесс"],["convict","v","осуждать|осудить|признать виновным"],["innocent","adj","невиновный|невинный"],["penalty","n","наказание|штраф|взыскание"],["corruption","n","коррупция"],["bribery","n","взяточничество|подкуп"]]],
["Work & Career",[["promotion","n","повышение|повышение по службе|продвижение"],["employee","n","сотрудник|работник"],["employer","n","работодатель"],["salary","n","зарплата|заработная плата|оклад"],["resign","v","уволиться|увольняться|уйти в отставку|подать в отставку"],["redundancy","n","сокращение|сокращение штатов|увольнение по сокращению"],["workload","n","нагрузка|рабочая нагрузка|объём работы"],["deadline","n","крайний срок|дедлайн|срок"],["colleague","n","коллега"],["qualification","n","квалификация"],["apprenticeship","n","ученичество|стажировка|практика"],["entrepreneur","n","предприниматель"],["burnout","n","выгорание|эмоциональное выгорание"],["flexible","adj","гибкий"],["negotiate","v","вести переговоры|договариваться|договориться"],["productivity","n","продуктивность|производительность"],["recruit","v","нанимать|нанять|набирать|набрать|вербовать"],["unemployment","n","безработица"],["incentive","n","стимул|мотивация|поощрение"],["ambitious","adj","амбициозный|честолюбивый"]]],
["Travel",[["destination","n","пункт назначения|место назначения|направление"],["itinerary","n","маршрут|план поездки"],["accommodation","n","жильё|размещение|проживание"],["sightseeing","n","осмотр достопримечательностей|экскурсии"],["landmark","n","достопримечательность|ориентир"],["journey","n","путешествие|поездка|путь"],["abroad","adv","за границей|за границу|за рубежом"],["luggage","n","багаж"],["remote","adj","отдалённый|удалённый"],["crowded","adj","переполненный|людный|многолюдный"],["souvenir","n","сувенир"],["explore","v","исследовать|изучать|осматривать"],["departure","n","отправление|отъезд|вылет"],["arrival","n","прибытие|приезд|прилёт"],["customs","n","таможня|обычаи"],["hospitality","n","гостеприимство"],["picturesque","adj","живописный"],["backpacker","n","бэкпекер|турист с рюкзаком|путешественник"],["overseas","adj","зарубежный|заморский|иностранный|за границей|за рубежом"],["commute","v","ездить на работу|добираться до работы|ездить"]]],
["Environment",[["pollution","n","загрязнение"],["emission","n","выброс|выбросы|излучение"],["sustainable","adj","устойчивый|экологичный|рациональный"],["renewable","adj","возобновляемый"],["deforestation","n","вырубка лесов|обезлесение"],["endangered","adj","исчезающий|вымирающий|находящийся под угрозой исчезновения"],["habitat","n","среда обитания|место обитания|ареал"],["drought","n","засуха"],["conservation","n","сохранение|охрана|охрана природы"],["biodiversity","n","биоразнообразие|биологическое разнообразие"],["waste","n","отходы|мусор|трата|потеря"],["recycle","v","перерабатывать|переработать"],["scarce","adj","дефицитный|скудный|редкий"],["contaminate","v","загрязнять|загрязнить|заражать"],["extinction","n","вымирание|исчезновение"],["fertile","adj","плодородный"],["flood","n","наводнение|потоп"],["climate","n","климат"],["ecosystem","n","экосистема"],["depletion","n","истощение|исчерпание"]]],
["Food & Diet",[["nutritious","adj","питательный"],["obesity","n","ожирение"],["ingredient","n","ингредиент|составляющая"],["processed","adj","переработанный|обработанный"],["portion","n","порция|часть"],["appetite","n","аппетит"],["vegetarian","n","вегетарианец|вегетарианский"],["consumption","n","потребление"],["balanced","adj","сбалансированный|уравновешенный"],["calorie","n","калория"],["deficiency","n","дефицит|недостаток|нехватка"],["organic","adj","органический|натуральный|экологически чистый"],["cuisine","n","кухня"],["starvation","n","голод|голодание"],["beverage","n","напиток"],["craving","n","тяга|сильное желание|страстное желание"],["additive","n","добавка|пищевая добавка"],["digest","v","переваривать|переварить|усваивать"],["moderation","n","умеренность"],["wholesome","adj","полезный|здоровый|полезный для здоровья"]]],
["Culture & Traditions",[["heritage","n","наследие|наследство"],["custom","n","обычай|традиция"],["ritual","n","ритуал|обряд"],["ancestor","n","предок"],["festival","n","фестиваль|праздник"],["identity","n","идентичность|самобытность|личность"],["diverse","adj","разнообразный|многообразный"],["indigenous","adj","коренной|местный|исконный"],["ceremony","n","церемония|обряд"],["generation","n","поколение"],["preserve","v","сохранять|сохранить|беречь"],["belief","n","вера|убеждение|верование"],["heirloom","n","семейная реликвия|реликвия"],["folklore","n","фольклор"],["assimilate","v","ассимилировать|ассимилироваться|усваивать|приспосабливаться"],["globalisation","n","глобализация"],["craftsmanship","n","мастерство|ремесло|искусность"],["values","n","ценности"],["tolerance","n","толерантность|терпимость"],["ancient","adj","древний|старинный"]]],
["Education",[["curriculum","n","учебная программа|программа|учебный план"],["tuition","n","обучение|плата за обучение"],["literacy","n","грамотность"],["graduate","n","выпускник|выпускница"],["assessment","n","оценка|оценивание|аттестация"],["discipline","n","дисциплина"],["compulsory","adj","обязательный"],["scholarship","n","стипендия|грант"],["lecture","n","лекция"],["degree","n","степень|учёная степень|диплом"],["knowledge","n","знание|знания"],["plagiarism","n","плагиат"],["enrol","v","зачислять|зачислить|записаться|записываться|поступить"],["academic","adj","академический|учебный|научный"],["vocational","adj","профессиональный|профессионально-технический"],["tutor","n","репетитор|наставник|преподаватель"],["pupil","n","ученик|ученица|зрачок"],["dropout","n","отчисленный|бросивший учёбу|недоучка"],["extracurricular","adj","внеклассный|внеучебный|внешкольный"],["memorise","v","запоминать|запомнить|заучивать|заучить"]]],
["Health",[["sedentary","adj","сидячий|малоподвижный"],["disease","n","болезнь|заболевание"],["symptom","n","симптом|признак"],["treatment","n","лечение|обращение"],["prevention","n","профилактика|предотвращение"],["immune","adj","иммунный|невосприимчивый"],["recovery","n","выздоровление|восстановление"],["epidemic","n","эпидемия"],["chronic","adj","хронический"],["vaccine","n","вакцина|прививка"],["wellbeing","n","благополучие|самочувствие"],["stress","n","стресс|напряжение"],["diagnosis","n","диагноз|диагностика"],["surgery","n","хирургия|операция"],["addiction","n","зависимость|пристрастие"],["fatigue","n","усталость|утомление"],["therapy","n","терапия|лечение"],["injury","n","травма|повреждение|ранение"],["longevity","n","долголетие|продолжительность жизни"],["insomnia","n","бессонница"]]]];
const VOCAB=[];VT.forEach(([t,a])=>a.forEach(([en,pos,ru])=>VOCAB.push({id:'v'+(VOCAB.length+1),topic:t,en:en,pos:pos,ru:ru.split('|')})));

const VKEY='ielts_vocab_srs_v1';
let vsrs={};
try{vsrs=JSON.parse(localStorage.getItem(VKEY)||'{}')}catch(e){vsrs={}}
function vrate(id,good){
 const e=vsrs[id]||{b:0};
 e.b=good?Math.min(5,e.b+1):0;
 e.d=today()+INT[e.b];
 vsrs[id]=e;try{localStorage.setItem(VKEY,JSON.stringify(vsrs))}catch(err){}
}
const vpool=()=>VOCAB.filter(w=>topic==='all'||w.topic===topic);
function vstats(){
 const t=today(),p=vpool();
 return {due:p.filter(w=>vsrs[w.id]&&vsrs[w.id].d<=t).length,fresh:p.filter(w=>!vsrs[w.id]).length,known:p.filter(w=>vsrs[w.id]&&vsrs[w.id].b>=3).length,total:p.length};
}
const POS={n:'noun',v:'verb',adj:'adjective',adv:'adverb'};

/* Проверка ответа */
const vnorm=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9-]+/g,' ').trim();
function lev(a,b){
 if(Math.abs(a.length-b.length)>1)return 2;
 let prev=[...Array(b.length+1).keys()];
 for(let i=1;i<=a.length;i++){
  const cur=[i];
  for(let j=1;j<=b.length;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
  prev=cur;
 }
 return prev[b.length];
}
// 'ok' если точно, 'typo' если одна опечатка, '' если неверно
function vcheck(input,w){
 const parts=String(input||'').split(/[,;\/]/).map(vnorm).filter(Boolean);
 const ans=w.ru.map(vnorm);
 if(parts.some(p=>ans.includes(p)))return 'ok';
 if(parts.some(p=>ans.some(a=>a.length>=5&&lev(p,a)===1)))return 'typo';
 return '';
}

/* Экран тренировки */
function words(){
 const t=today(),p=vpool();
 const due=shuffle(p.filter(w=>vsrs[w.id]&&vsrs[w.id].d<=t));
 const fresh=shuffle(p.filter(w=>!vsrs[w.id]));
 let q=due.concat(fresh).slice(0,10);
 if(!q.length)q=shuffle(p).slice(0,10); // всё выучено: просто случайный повтор
 let i=0,score=0;const miss=[];
 const next=()=>{
  if(i>=q.length){
   app.innerHTML=backBtn()+`<div class="res-card"><div class="res-num">${score}<span>/${q.length}</span></div><div class="res-t">${score===q.length?'Без ошибок':'Слова с ошибками будут в следующем раунде'}</div></div>`+
    (miss.length?`<h2>Повтори</h2><div class="miss">${miss.map(w=>`<div><b>${esc(w.en)}</b><span>${esc(w.ru[0])}</span></div>`).join('')}</div>`:'')+
    `<div class="row"><button id="again">Ещё раунд</button></div>`;
   bindBack();$('#again').onclick=words;return;
  }
  const w=q[i];let done=false;
  app.innerHTML=backBtn()+`<div class="prog"><div style="width:${i/q.length*100}%"></div></div>
   <div class="card wcard"><span class="pos">${POS[w.pos]||w.pos}</span><div class="en">${esc(w.en)}</div>
   <button class="spk" id="sp">${ICON.speaker}Слушать</button></div>
   <input id="wi" class="winput" placeholder="Перевод на русском" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">
   <div id="fb" class="fb"></div>
   <div class="row"><button class="sec" id="dk">Не знаю</button><button id="ck">Проверить</button></div>
   <p class="tag" style="text-align:center">${i+1} из ${q.length} · ${esc(w.topic)}</p>`;
  bindBack();
  const inp=$('#wi');inp.focus();
  $('#sp').onclick=()=>speak(w.en);
  const finish=res=>{
   done=true;inp.disabled=true;
   const others=w.ru.slice(1).join(', ');
   const fb=$('#fb');
   if(res){
    score++;vrate(w.id,true);
    fb.className='fb ok';
    fb.innerHTML=res==='typo'?`<b>Засчитано, но с опечаткой.</b> Правильно пишется «${esc(w.ru[0])}».`:`<b>Верно.</b>${others?' Другие варианты: '+esc(others)+'.':''}`;
   }else{
    vrate(w.id,false);miss.push(w);
    fb.className='fb bad';
    fb.innerHTML=`<b>Правильный ответ «${esc(w.ru[0])}».</b>${others?'<br>Другие варианты: '+esc(others)+'.':''}`;
   }
   $('#dk').style.display='none';
   $('#ck').textContent=i+1<q.length?'Дальше':'Итоги';
   speak(w.en);
  };
  const go=()=>{if(done){i++;next();return}
   if(!inp.value.trim()){inp.focus();inp.classList.remove('shake');void inp.offsetWidth;inp.classList.add('shake');return}
   finish(vcheck(inp.value,w))};
  $('#ck').onclick=go;
  $('#dk').onclick=()=>{if(!done)finish('')};
  inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();go()}};
  document.onkeydown=e=>{if(done&&e.key==='Enter'&&document.getElementById('wi')){e.preventDefault();go()}};
 };
 next();
}
