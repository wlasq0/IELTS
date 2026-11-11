/* Данные: Listening, Writing, уровни и доп. задания, слова C1 (VT). Логика в app.js. */
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

/* Уровни (примерные) и дополнительные задания для Reading и Listening */
READING[0].id="r1";READING[0].level="C1";
READING[1].id="r2";READING[1].level="C1";
LISTENING[0].id="l1";LISTENING[0].level="C1";
LISTENING[1].id="l2";LISTENING[1].level="B2";
WRITING.forEach((w,i)=>{w.id="w"+i});

READING.push(
{
 id:"r3",level:"C2",title:"Text 3 · The trouble with choice",
 text:[
  "Few notions have proved as seductive, or as resistant to scrutiny, as the conviction that more choice invariably yields greater satisfaction. Proponents of market liberalisation have long taken it as axiomatic that consumers flourish when confronted with an abundance of options. Yet a growing body of commentary suggests that the relationship is considerably more equivocal. Faced with dozens of near-identical alternatives, people may defer a decision indefinitely, or settle on one with lingering misgivings about the paths foregone. The anxiety is rarely proportionate to the stakes: a shopper selecting a kettle can feel as burdened as one choosing a pension.",
  "Critics of this line of argument counter that the evidence is thinner than its popularisers imply, noting that several attempts to reproduce the headline findings have produced inconsistent results. They also observe that individuals differ markedly in their appetite for deliberation; those who habitually seek the optimal outcome appear more susceptible to regret than those content with an adequate one. What emerges, then, is less a refutation of choice than a plea for its judicious curation. Retailers who trim their ranges, and institutions that offer sensible defaults, may well serve their clients better than those who equate liberty with sheer variety, although the commercial incentives to do so remain, at best, mixed."
 ],
 questions:[
  {s:"The author claims that the benefits of greater choice have been conclusively disproved.",a:"F",why:"Связь названа «equivocal», а вывод: это не опровержение выбора («less a refutation of choice»)."},
  {s:"Faced with many similar options, some people may put off making a decision.",a:"T",why:"«May defer a decision indefinitely»."},
  {s:"According to the text, anxiety over a decision is usually in proportion to what is at stake.",a:"F",why:"Тревога «rarely proportionate to the stakes», то есть редко соразмерна."},
  {s:"Every attempt to repeat the original findings has confirmed them.",a:"F",why:"Повторы дали противоречивые результаты («inconsistent results»)."},
  {s:"People who always look for the best possible option seem more prone to regret.",a:"T",why:"«Appear more susceptible to regret»."},
  {s:"Supermarkets have reduced the number of products they stock in recent years.",a:"NG",why:"Про сокращение ассортимента в супермаркетах текст не говорит."},
  {s:"The author is certain that retailers have strong financial reasons to limit choice.",a:"F",why:"Коммерческие стимулы «at best, mixed», то есть неоднозначные. Уверенности нет."},
  {s:"Pension providers now offer more options than they did a decade ago.",a:"NG",why:"Пенсия упомянута только как пример. О росте числа вариантов текст молчит."}
 ]
},
{
 id:"r4",level:"C1",title:"Text 4 · The city that never goes quiet",
 text:[
  "Urban noise is rarely discussed with the urgency afforded to air pollution, yet researchers who study city life argue that it deserves far more attention. Traffic, construction and late-night entertainment combine to produce a constant background hum, and residents of the busiest districts often cease to notice it consciously. This habituation, however, does not necessarily mean that the body has adjusted. Some studies of sleep patterns suggest that people living near major roads wake more often during the night, even when they have no memory of being disturbed.",
  "Several city councils have responded with practical measures. One approach is to reduce speed limits in residential areas, which lowers engine and tyre noise. Another is to require developers to install double glazing in new buildings close to railways. Opponents point out that such rules raise construction costs and may therefore push up rents. A third idea, still at an early stage, involves creating 'quiet zones' in parks and squares where amplified music is banned. Early feedback from residents has been mostly positive, although a handful of local businesses have complained that the restrictions discourage visitors in the evening."
 ],
 questions:[
  {s:"Noise receives as much public attention as air pollution.",a:"F",why:"Шум обсуждают без той срочности, что у загрязнения воздуха («rarely discussed with the urgency»)."},
  {s:"People in the busiest districts often stop consciously noticing the noise.",a:"T",why:"«Cease to notice it consciously»."},
  {s:"Some research indicates that people near major roads wake up more often at night.",a:"T",why:"«Wake more often during the night»."},
  {s:"Double glazing is already compulsory in all new buildings in the city.",a:"F",why:"Речь о требовании к зданиям рядом с железной дорогой и о мерах «several councils», не обо всех зданиях."},
  {s:"Critics say that noise rules could lead to higher rents.",a:"T",why:"«May therefore push up rents»."},
  {s:"Quiet zones are more popular with older residents than with younger ones.",a:"NG",why:"Сравнения по возрасту жителей в тексте нет."},
  {s:"All local businesses have welcomed the restrictions.",a:"F",why:"Несколько предприятий пожаловались («a handful… have complained»)."}
 ]
},
{
 id:"r5",level:"C1",title:"Text 5 · Learning a language as an adult",
 text:[
  "It is often assumed that children learn languages effortlessly while adults struggle, but the picture is more nuanced. Young children do tend to acquire a natural-sounding accent more easily, and they are less inhibited about making mistakes. Adults, on the other hand, bring advantages of their own: they can understand grammatical rules explicitly, they have more developed strategies for memorising vocabulary, and they are usually motivated by a concrete goal, such as a job or a university place. In classroom studies, older learners frequently progress faster than children during the first months, although children tend to overtake them in the long run if they are fully immersed.",
  "Teachers stress that consistency matters more than intensity. Twenty minutes of practice every day appears to be more effective than a single three-hour session at the weekend, because regular contact helps vocabulary move from short-term to long-term memory. Technology has made it easier to practise, yet it has also created a temptation to collect apps rather than to use them. Many learners, an experienced teacher observed, spend more time choosing a programme than studying with it."
 ],
 questions:[
  {s:"Children are generally less afraid of making mistakes than adults.",a:"T",why:"Дети «less inhibited about making mistakes»."},
  {s:"Adults are unable to understand grammar rules explicitly.",a:"F",why:"Наоборот: взрослые «can understand grammatical rules explicitly»."},
  {s:"Older learners often make faster progress than children at the beginning.",a:"T",why:"«Frequently progress faster than children during the first months»."},
  {s:"Children always overtake adults, whatever the learning conditions.",a:"F",why:"Только «if they are fully immersed», то есть при полном погружении."},
  {s:"Daily practice is only effective if it lasts at least an hour.",a:"F",why:"Достаточно 20 минут в день: это эффективнее одного 3-часового занятия."},
  {s:"Language apps are more effective than classroom teaching.",a:"NG",why:"Сравнения приложений и занятий в классе в тексте нет."},
  {s:"The teacher quoted believes many learners waste time choosing a programme.",a:"T",why:"«Spend more time choosing a programme than studying with it»."}
 ]
},
{
 id:"r6",level:"B2",title:"Text 6 · Working from home",
 text:[
  "More companies now allow employees to work from home for part of the week. Supporters say that this arrangement saves time and money because there is no daily commute, and many workers report that they can concentrate better in a quiet environment. Managers, however, sometimes worry that teams become less creative when people rarely meet in person.",
  "One firm in the survey described here decided on a compromise: staff come to the office on Tuesdays and Thursdays and work from home on the other days. After six months, the company found that employees were slightly happier, although the number of projects completed on time did not change. Some workers admitted that the lines between work and free time had become blurred, and they found it hard to switch off in the evening. The firm has therefore introduced a rule that emails sent after seven o'clock do not need an answer until the next morning."
 ],
 questions:[
  {s:"Working from home saves both time and money on travelling.",a:"T",why:"«No daily commute» экономит время и деньги."},
  {s:"All managers believe that remote work reduces creativity.",a:"F",why:"Менеджеры только «sometimes worry», не все и не всегда."},
  {s:"Staff in the firm come to the office on Mondays and Fridays.",a:"F",why:"Они приходят по вторникам и четвергам."},
  {s:"The number of projects finished on time went up after six months.",a:"F",why:"Число проектов в срок «did not change»."},
  {s:"Some employees found it hard to relax after work.",a:"T",why:"«Found it hard to switch off in the evening»."},
  {s:"The firm told employees not to check emails at weekends.",a:"NG",why:"Правило касается писем после 19:00. Про выходные ничего не сказано."},
  {s:"Employees must reply at once to emails sent after seven o'clock.",a:"F",why:"Отвечать нужно только на следующее утро."}
 ]
},
{
 id:"r7",level:"B2",title:"Text 7 · The price of a plastic bag",
 text:[
  "Ten years ago the city introduced a small charge for plastic shopping bags. At first, many residents complained, saying that it was just another way of collecting money. However, the number of bags given out by supermarkets fell sharply within a year, and the council says that fewer bags are now found in rivers and parks. The money raised is used to pay for tree planting in public spaces.",
  "Some environmental groups welcome the scheme but argue that it does not go far enough, because many products are still wrapped in unnecessary plastic. A local shopkeeper told reporters that most customers now bring their own bags, although a few still forget and pay the charge. The council is now considering a similar charge for disposable coffee cups, but it has not yet decided when to start."
 ],
 questions:[
  {s:"All residents supported the charge from the beginning.",a:"F",why:"Сначала многие жители жаловались."},
  {s:"Supermarkets give out far fewer bags since the charge was introduced.",a:"T",why:"Число пакетов «fell sharply within a year»."},
  {s:"The money raised is spent on cleaning rivers.",a:"F",why:"Деньги идут на посадку деревьев."},
  {s:"Environmental groups think the scheme goes too far.",a:"F",why:"Они считают, что схема «does not go far enough», то есть недостаточна."},
  {s:"According to a shopkeeper, most customers now bring their own bags.",a:"T",why:"Прямое совпадение со словами владельца магазина."},
  {s:"The charge on coffee cups will start next year.",a:"NG",why:"Совет ещё не решил, когда начинать («has not yet decided when»)."},
  {s:"Plastic bag use has also fallen in other cities.",a:"NG",why:"Про другие города текст не говорит."}
 ]
},
{
 id:"r8",level:"B1",title:"Text 8 · Maria's new city",
 text:[
  "Maria moved to a new city to study at university. At first she felt lonely because she did not know anyone. She lived in a small flat with two other students, Tom and Anna. Tom studies medicine and is often at the hospital until late. Anna is an artist and spends most of her time in her room.",
  "On Saturdays, Maria goes to a language club where she meets people from different countries. Last week she made her first friend there, a boy called Ahmed, and they went to the cinema together. Maria says she misses her family, but she phones her mother every Sunday and she is slowly starting to feel at home."
 ],
 questions:[
  {s:"Maria moved to the city to study at university.",a:"T",why:"Первое предложение текста."},
  {s:"She felt lonely at the beginning.",a:"T",why:"«At first she felt lonely»."},
  {s:"Maria lives alone in her flat.",a:"F",why:"Она живёт с Томом и Анной."},
  {s:"Tom studies art.",a:"F",why:"Том изучает медицину, а художница Анна."},
  {s:"Maria goes to a language club on Saturdays.",a:"T",why:"«On Saturdays, Maria goes to a language club»."},
  {s:"Ahmed studies at Maria's university.",a:"NG",why:"Где учится Ахмед, не сказано."},
  {s:"Maria phones her mother every day.",a:"F",why:"Она звонит маме каждое воскресенье."}
 ]
},
{
 id:"r9",level:"A2",title:"Text 9 · My weekend",
 text:[
  "My name is Peter and I live in a small town near the sea. On Saturday I usually get up late and have breakfast with my brother. Then we play football in the park. In the afternoon I help my mother in the garden. On Sunday we visit my grandparents. They live in a big house and my grandmother always makes a cake. I like weekends because I do not have to go to school."
 ],
 questions:[
  {s:"Peter lives in a big city.",a:"F",why:"Он живёт в маленьком городке у моря."},
  {s:"He has breakfast with his brother on Saturday.",a:"T",why:"«Have breakfast with my brother»."},
  {s:"Peter and his brother play tennis in the park.",a:"F",why:"Они играют в футбол."},
  {s:"Peter helps his mother in the kitchen.",a:"F",why:"Он помогает маме в саду."},
  {s:"Peter's grandmother makes a cake when they visit.",a:"T",why:"«My grandmother always makes a cake»."},
  {s:"Peter has a sister.",a:"NG",why:"Про сестру ничего не сказано, упомянут только брат."}
 ]
}
);

LISTENING.push(
{
 id:"l3",level:"C2",title:"Seminar · Language and thought",
 script:"Right, let's turn to a question that has divided linguists for the better part of a century: does the language we speak shape the way we think? The strong version of the claim, that speakers of different languages inhabit incommensurable mental worlds, has been largely abandoned. Few scholars would now defend it. What survives is a more modest proposition, namely that habitual patterns of expression can nudge attention in subtle ways. Take colour terms. In some languages, light and dark blue are distinct basic words, and experiments have shown that speakers of those languages are marginally quicker at telling the two shades apart. The effect is small, it vanishes when participants are asked to memorise a string of digits at the same time, and it tells us nothing about whether those speakers perceive the world differently in any profound sense. For your seminar next Thursday, I'd like you to read the two papers on reserve in the library and come prepared to argue against the position you personally find most convincing. Please note that the seminar has moved to room four-oh-nine.",
 questions:[
  {s:"What does the lecturer say about the strong version of the claim?",o:["It is still widely defended","It has largely been abandoned","It has been proved correct"],a:1},
  {s:"What survives of the original idea?",o:["Speakers live in different mental worlds","Habitual expression can subtly influence attention","Colour perception is identical for everyone"],a:1},
  {s:"Speakers of some languages are quicker at telling apart light and dark ____.",a:["blue"]},
  {s:"The effect disappears when participants must memorise a string of ____.",a:["digits","numbers"]},
  {s:"Students should argue against the position they find most ____.",a:["convincing","persuasive"]},
  {s:"The seminar has moved to room ____.",a:["409","four-oh-nine","four oh nine"]}
 ]
},
{
 id:"l4",level:"C1",title:"Talk · University orientation",
 script:"Good morning, and welcome to the international students' orientation. My name is Dr Patel, and I coordinate the academic skills programme. Let me begin with some practicalities. Registration closes on the twenty-third of January, so please make sure that your documents are submitted before then. Your student cards will be issued at the front desk on the ground floor; you will need your passport and one passport-sized photograph. Classes begin on the following Monday at half past eight, and attendance is compulsory: anyone who misses more than twenty per cent of sessions in a course may be barred from the final examination. The library offers free workshops on academic writing every Wednesday afternoon, and I would strongly recommend that first-year students attend at least the first three. Finally, if you are struggling with the language, the English support centre, which is located in building C, is open until six o'clock on weekdays. There's no need to book an appointment.",
 questions:[
  {s:"Registration closes on ____ January.",a:["23","23rd","twenty-third","twenty third"]},
  {s:"Students need their passport and one passport-sized ____.",a:["photograph","photo"]},
  {s:"Classes begin on Monday at ____.",a:["8:30","8.30","08:30","half past eight","eight thirty","8:30 am"]},
  {s:"Students who miss more than ____ per cent of sessions may be barred from the exam.",a:["20","twenty"]},
  {s:"Writing workshops take place every ____ afternoon.",a:["wednesday"]},
  {s:"First-year students should attend at least the first ____ workshops.",a:["3","three"]},
  {s:"The English support centre is in building ____.",a:["c"]},
  {s:"The centre is open until ____ on weekdays.",a:["6","six","six o'clock","6 pm","18:00"]}
 ]
},
{
 id:"l5",level:"C1",title:"News · A tourist fee",
 script:"Now to travel news. Officials in a popular coastal town have announced that, from next summer, visitors staying for fewer than two nights will pay an additional tourist fee of five euros per person. The mayor said that day-trippers put pressure on public services without contributing significantly to the local economy. Local hotel owners are divided: some welcome the plan, whereas others fear that it will discourage younger travellers, who are often on a tight budget. The money raised will be used to repair the old harbour wall and to employ extra staff to clean the beaches. Meanwhile, residents have been asked to take part in an online survey, which remains open until the end of the month. Anyone who wishes to share their views can do so on the town council's website.",
 questions:[
  {s:"Who will pay the new fee?",o:["All residents of the town","Visitors staying fewer than two nights","Hotel guests only"],a:1},
  {s:"The fee will be ____ euros per person.",a:["5","five"]},
  {s:"Why does the mayor support the fee?",o:["Day-trippers use services but contribute little","Hotels are losing money","The beaches are too crowded"],a:0},
  {s:"What is the attitude of hotel owners?",o:["All are in favour","They are divided","All are against"],a:1},
  {s:"Some owners fear the fee will discourage ____ travellers.",a:["younger","young"]},
  {s:"The money will help repair the old ____ wall.",a:["harbour","harbor"]},
  {s:"The online survey is open until the end of the ____.",a:["month"]}
 ]
},
{
 id:"l6",level:"B2",title:"Recording · Sports centre",
 script:"Thank you for calling Riverside Sports Centre. Our opening hours have changed this month. The swimming pool is now open from half past six in the morning until nine in the evening on weekdays, and from eight until five at weekends. The gym will be closed for repairs from the ninth to the thirteenth of November, but all classes will continue as normal in the main hall. If you would like to join the beginners' yoga course, which starts on the sixteenth, please book at reception or online, as places are limited to fifteen people. New members receive a free guest pass, valid for thirty days. For other enquiries, press one to leave a message, or visit our website.",
 questions:[
  {s:"On weekdays the pool opens at ____.",a:["6:30","6.30","06:30","half past six","six thirty"]},
  {s:"At weekends the pool closes at ____.",a:["5","five","5 pm","5:00","17:00"]},
  {s:"The gym is closed from the ninth to the ____ of November.",a:["13","13th","thirteenth"]},
  {s:"The beginners' yoga course starts on the ____.",a:["16","16th","sixteenth"]},
  {s:"Places on the yoga course are limited to ____ people.",a:["15","fifteen"]},
  {s:"The free guest pass is valid for ____ days.",a:["30","thirty"]}
 ]
},
{
 id:"l7",level:"B1",title:"Forecast · Weather tomorrow",
 script:"Good evening. Here is the weather for tomorrow. In the north it will be cold and cloudy in the morning, with some rain after lunch. Temperatures will reach only nine degrees. In the south it will be sunny and warmer, around sixteen degrees, but there will be a strong wind on the coast. In the east, expect fog early in the morning, which should clear by ten o'clock. At the weekend the weather will improve everywhere, so it is a good time to go for a walk.",
 questions:[
  {s:"What will the weather be like in the north in the morning?",o:["Cold and cloudy","Sunny","Windy"],a:0},
  {s:"The highest temperature in the north will be ____ degrees.",a:["9","nine"]},
  {s:"In the south it will be around ____ degrees.",a:["16","sixteen"]},
  {s:"Where will there be a strong wind?",o:["In the north","On the south coast","In the east"],a:1},
  {s:"The fog in the east should clear by ____ o'clock.",a:["10","ten"]},
  {s:"What will the weather be like at the weekend?",o:["Worse","Better","The same"],a:1}
 ]
},
{
 id:"l8",level:"A2",title:"Message · At the supermarket",
 script:"Hello, this is Anna. I'm at the supermarket. I need to buy some things for dinner tonight. We need two kilos of potatoes, a litre of milk and some bread. Do we also need eggs? I think we have six eggs at home. I will also buy apples because they are cheap today, only two pounds a kilo. I will be home at six o'clock. Please don't forget to feed the cat.",
 questions:[
  {s:"Anna needs ____ kilos of potatoes.",a:["2","two"]},
  {s:"She needs ____ litre of milk.",a:["1","one"]},
  {s:"There are ____ eggs at home.",a:["6","six"]},
  {s:"Apples cost ____ pounds a kilo today.",a:["2","two"]},
  {s:"Anna will be home at ____ o'clock.",a:["6","six"]},
  {s:"What must the listener do?",o:["Buy the bread","Feed the cat","Cook dinner"],a:1}
 ]
}
);

/* Слова C1: [слово, часть речи, "перевод|ещё вариант"], первый вариант главный */
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
