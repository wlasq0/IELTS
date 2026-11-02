/* wave: живой фон главного экрана.
   Несколько полупрозрачных «капель» медленно меняют форму и вздрагивают в ритм.
   Музыки нет, поэтому ритм генерируется случайными толчками.
   Фон виден только на главной: при уходе с неё анимация останавливается. */
(function(){
 const cv=document.createElement('canvas');cv.id='wave';document.body.prepend(cv);
 const cx=cv.getContext('2d');
 const st=document.createElement('style');
 st.textContent='#wave{position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity .6s}#wave.on{opacity:1}'
  // на главной плашки полупрозрачные, чтобы волна просвечивала сквозь них
  +'body.wave .stat div,body.wave button.sec,body.wave select{background:color-mix(in srgb,var(--sec) 55%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}';
 document.head.appendChild(st);
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const COLORS=['#7b5cff','#ff4f9a','#ffb347','#3fa9ff'];
 const rnd=(a,b)=>a+Math.random()*(b-a);
 // у каждой капли свой набор гармоник: из них складывается «дрожащий» контур
 const blobs=COLORS.map((c,i)=>({c,r:.30-i*.045,dir:i%2?1:-1,h:[...Array(5)].map(()=>({f:2+Math.floor(rnd(0,5)),p:rnd(0,6.28),s:rnd(.3,1),a:rnd(.03,.08)}))}));
 let W=0,H=0,raf=0,last=0,energy=0,nextBeat=0;
 function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
 addEventListener('resize',size);size();
 const dark=()=>{const tg=window.Telegram&&Telegram.WebApp;return tg&&tg.colorScheme?tg.colorScheme==='dark':matchMedia('(prefers-color-scheme: dark)').matches};
 function beat(t,dt){
  if(t>=nextBeat){energy=Math.max(energy,rnd(.4,1));nextBeat=t+[.25,.45,.5,.5,.75][Math.floor(rnd(0,5))]}
  energy*=Math.exp(-dt*5);
 }
 function draw(t){
  cx.clearRect(0,0,W,H);
  const dk=dark();
  cx.globalCompositeOperation=dk?'lighter':'source-over';
  const x0=W/2,y0=H*.45,R=Math.min(W,H)*1.35;
  for(const b of blobs){
   const rot=t*.15*b.dir,r0=R*b.r*(1+energy*.08);
   cx.beginPath();
   for(let i=0;i<=96;i++){
    const a=i/96*Math.PI*2;
    let k=1;
    for(const g of b.h)k+=g.a*Math.sin(g.f*a+g.p+t*g.s);
    k+=energy*.06*Math.sin(7*a+t*9+b.r*20); // рывок на «ударе»
    const r=r0*k;
    cx.lineTo(x0+Math.cos(a+rot)*r,y0+Math.sin(a+rot)*r);
   }
   const gr=cx.createRadialGradient(x0,y0,0,x0,y0,r0*1.15);
   gr.addColorStop(0,b.c+(dk?'88':'77'));gr.addColorStop(1,b.c+'00');
   cx.fillStyle=gr;cx.fill();
  }
 }
 function frame(ms){
  const t=ms/1000,dt=Math.min(.05,t-last||0);last=t;
  beat(t,dt);draw(t);
  raf=requestAnimationFrame(frame);
 }
 const onHome=()=>!!document.getElementById('b1');
 function start(){
  cv.classList.add('on');document.body.classList.add('wave');
  if(still){draw(0);return}
  if(!raf)raf=requestAnimationFrame(frame);
 }
 function stop(){cv.classList.remove('on');document.body.classList.remove('wave');cancelAnimationFrame(raf);raf=0}
 new MutationObserver(()=>{onHome()?start():stop()}).observe(document.getElementById('app'),{childList:true});
 if(onHome())start();
})();
