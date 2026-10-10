
const K='mozakarty';
function normState(x){
  if(!x||typeof x!=='object') x={};
  ['tasks','mist','sess','cards','lec','dk'].forEach(k=>{if(!Array.isArray(x[k]))x[k]=[]});
  ['slog','tch','sb'].forEach(k=>{if(!x[k]||typeof x[k]!=='object'||Array.isArray(x[k]))x[k]={}});
  if(!x.sl||typeof x.sl!=='object')x.sl={h:8,w:Array(7).fill('06:30')};
  if(!Array.isArray(x.sl.w)||x.sl.w.length!==7)x.sl.w=Array(7).fill('06:30');
  x.sl.h=Math.max(1,Math.min(24,+x.sl.h||8));
  x.sess=x.sess.map(v=>({d:v&&v.d||'',min:Math.max(0,+((v&&v.min)||0)),s:v&&v.s||''}));
  if(x.sw&&typeof x.sw!=='object')delete x.sw;
  if(x.sw){x.sw.st=+x.sw.st||Date.now();x.sw.acc=Math.max(0,+x.sw.acc||0);x.sw.p=x.sw.p?1:0;x.sw.s=x.sw.s||'';x.sw.d=x.sw.d||''}
  x.goal=Math.max(0,+x.goal||0);
  delete x.xp;
  return x;
}
let S=null;
try{S=normState(JSON.parse(localStorage.getItem(K)))}catch(e){}
S=S||{tasks:[],mist:[],sess:[],cap:120};
if(!S.bu){if(S.bm)S.bm*=60;S.bu=1}S.cards=S.cards||[];S.dk=S.dk||[];if(S.cards.length){S.dk.push({id:Date.now(),n:'بطاقاتي القديمة',cards:S.cards});S.cards=[]}S.lec=S.lec||[];S.tch=S.tch||{};S.expl=S.expl||[];S.slog=S.slog||{};S.sl=S.sl||{h:8,w:Array(7).fill('06:30')};
const save=()=>{if(VIEW)return;S.updatedAt=Date.now();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}cloudPush();fsPush()};
const $=i=>document.getElementById(i);
const day=(d=new Date())=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const add=(s,n)=>{const d=new Date(s+'T12:00');d.setDate(d.getDate()+n);return day(d)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=s=>[Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(x=>String(x).padStart(2,'0')).join(':');
const T=day();let tab='today',dur=1500,run=null,iv=null;
const RC=2*Math.PI*90,MIN_REC=60;
const mins=d=>S.sess.filter(x=>x.d==d).reduce((a,x)=>a+x.min,0);
const curStreak=()=>{let st=0,d=mins(T)?T:add(T,-1);while(mins(d)){st++;d=add(d,-1)}return st};
const weekMin=()=>[...Array(7)].reduce((a,_,i)=>a+mins(add(T,-i)),0);
function paintHeader(){const tb=$('thb');if(tb)tb.textContent=S.theme==='dark'?'☀️':(S.theme==='light'?'🌙':'🌓')}
function applyTheme(){if(S.theme)document.documentElement.setAttribute('data-theme',S.theme);else document.documentElement.removeAttribute('data-theme')}
function toggleTheme(){const dk=matchMedia('(prefers-color-scheme: dark)').matches,cur=S.theme||(dk?'dark':'light');S.theme=cur==='dark'?'light':'dark';save();applyTheme();paintHeader()}
const bk='';

const row=t=>`<div class="r ${t.done?'dn':''}"><input type="checkbox" ${t.done?'checked':''} onchange="tg(${t.id})"><div><b>${t.df==3?'🔥 ':''}${esc(t.n)}</b><small>${esc(t.s||'')}${t.min?' • '+t.min+' د':''}${t.date!=T?' • '+t.date:''}</small></div><button class="x" onclick="dl(${t.id})">✕</button></div>`;

let stid='',fmsg='',wz=0;
const rw=t=>`<div class="r ${t.done?'dn':''}"><input type="checkbox" ${t.done?'checked':''} onchange="tg(${t.id})"><div><b>${esc(t.n)}</b><small>${esc(t.s||'')}${t.date!=T?' • '+t.date:''}</small></div>${!t.done&&!run&&!S.sw?`<button onclick="stid=${t.id};go()">▶</button>`:''}<button class="x" onclick="dl(${t.id})">✕</button></div>`;
function vToday(){
 const LT=lecDue(),td=S.tasks.filter(t=>t.date==T).sort((a,b)=>(a.done-b.done)),todo=td.filter(t=>!t.done),od=S.tasks.filter(t=>!t.done&&t.date<T).length,up=S.tasks.filter(t=>!t.done&&t.date>T).sort((a,b)=>a.date.localeCompare(b.date)),tw=new Date().getDay();
 const rC=RC,rLeft=run?Math.max(0,(run.p?run.left:run.end-Date.now())/1e3):0,rFrac=run?Math.min(1,Math.max(0,1-rLeft/run.tot)):0,rOff=rC*rFrac;
 const tm=run?`<div class="c" style="text-align:center"><div style="position:relative;width:200px;height:200px;margin:0 auto"><svg width="200" height="200" viewBox="0 0 200 200" style="transform:rotate(-90deg)"><circle cx="100" cy="100" r="90" fill="none" stroke="var(--bd)" stroke-width="12"/><circle id="pr" cx="100" cy="100" r="90" fill="none" stroke="var(--pr)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${RC}" stroke-dashoffset="${rOff}" style="transition:stroke-dashoffset .3s linear"/></svg><div class="big" id="tm" style="font-size:40px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${fmt(Math.max(0,Math.ceil(rLeft)))}</div></div><p id="fm" style="text-align:center"><small>${run.p?'متوقف مؤقتاً ⏸':run.brk?'استرح شوية ☕':'ركز في جلستك 📚'}</small></p>${run.brk&&fmsg?`<div style="text-align:center">${fmsg}</div>`:''}<div class="row"><button class="pr" style="flex:1" onclick="pz()">${run.p?'▶ إكمال':'⏸ إيقاف مؤقت'}</button><button class="pr" style="flex:1" onclick="dn2()">✅ انتهيت</button></div></div>`:fmsg?`<div class="c"><p id="fm" style="text-align:center">${fmsg}</p><button style="width:100%" onclick="cm()">إغلاق</button></div>`:'';
 return (S.sw?vSw():tm)+vGoal()+(run||S.sw?'':`<div class="c" style="text-align:center"><h2>مطلوب منك النهاردة</h2><div class="big">${todo.length}</div><small>درس${LT.length?' + '+LT.length+' محاضرة':''}</small>${todo.length||LT.length?'<button class="pr" style="margin-top:10px" onclick="sb()">ابدأ ▶</button>':'<p>🎉 خلّصت كل دروس النهاردة</p>'}${durUI()}${swStartUI()}</div>`)
 +(LT.length?vLecToday(LT):'')+(od?`<div class="c warn"><b>⚠️ عندك ${od} درس متأخر</b><div class="row"><button onclick="tab='mat';render()">افتح موادي</button></div></div>`:'')
 +`<div class="c"><h2>دروس النهاردة</h2>${td.map(rw).join('')||'<p><small>مفيش دروس النهاردة.</small></p>'}</div>`
 +(up.length?`<details class="c"><summary><b>الجاي (${up.length})</b></summary>${up.map(rw).join('')}</details>`:'')
 +`<details class="c"><summary><b>➕ ضيف درس</b></summary><input id="n" placeholder="اسم الدرس"><input id="s" placeholder="المادة"><input id="dt" type="date" value="${T}"><button class="pr" onclick="at()">ضيف</button></details>`
 +`<div class="c"><small>🌙 نام الليلة الساعة</small> <b>${t12(bt(S.sl.w[tw],S.sl.h))}</b></div>`}
function sb(){const t=S.tasks.filter(x=>x.date==T&&!x.done)[0];stid=t?t.id:'';go()}
function cm(){stopAlarm();fmsg='';render()}
function vWiz(){
 const n=bkl().length;let t,b;
 if(wz==0){t=vImp()+(n?`<p>اتضاف ${n} درس متأخر ✓</p>`:'')+`<button class="pr" onclick="wz=${n?1:2};render()">${n?'التالي':'معنديش تراكمات، كمّل'}</button>`}
 else if(wz==1)t=`<div class="c"><h2>عايز تخلّصهم في كام يوم؟</h2><p>عندك ${n} درس متأخر.</p><input id="pn" type="number" min="1" max="30" value="7"><button class="pr" onclick="w1()">التالي</button></div>`;
 else t='<div class="c"><h2>بتصحى الساعة كام؟</h2><input id="wk" type="time" value="06:30"><button class="pr" onclick="w2()">خلّصت، يلا نبدأ</button></div>';
 return `<div class="c"><h2>أهلاً بيك 👋</h2><small>خطوة ${wz+1} من 3</small></div>${t}<button style="width:100%" onclick="hs()">تخطّي</button>`}
function w1(){mp();cf();wz=2;render()}
function w2(){const v=$('wk').value||'06:30';S.sl.w=Array(7).fill(v);hs()}
function hs(){S.seen=1;save();tab='today';render()}
function vStats(){
 const wk=[...Array(7)].map((_,i)=>{const d=add(T,i-6);return[d,mins(d)]}),mx=Math.max(...wk.map(w=>w[1]),1);
 const st=curStreak(),by={};S.sess.forEach(x=>{const k=x.s||'مذاكرة حرة';by[k]=(by[k]||0)+x.min});
 return `${wr()}<div class="c g"><div><big>${mins(T)}</big><small>دقيقة النهاردة</small></div><div><big style="color:var(--am)">🔥${st}</big><small>أيام متواصلة</small></div></div>
 ${vUserProfile()}
 <div class="c"><b>آخر 7 أيام (بالدقايق)</b><div class="bars">${wk.map(w=>`<i style="height:${w[1]/mx*100}%"></i>`).join('')}</div><div class="bars2">${wk.map(w=>`<span>${w[1]}</span>`).join('')}</div></div>
 <div class="c"><b>حسب المادة</b>${Object.entries(by).map(([k,v])=>`<div class="r"><div>${esc(k)}</div><span>${v} د</span></div>`).join('')||'<p><small>ابدأ جلسة مذاكرة وهتظهر بياناتك هنا.</small></p>'}</div>`}

document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTest()});
function render(){if(gater())return;if(tab!=='chat'&&(CH||GR_SEL)){stopConv();CH=null;CHM=[];grmStop();GR_SEL='';GR_VIEW='chat';GR_ERR='';attReset()}snap();if(S.sw&&!swIv)swRun();
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==tab));
 $('v').innerHTML=({today:vToday,mat:vMat,plan:vPlan,mist:vMem,stats:()=>vStats()+'<details class="c"><summary><b>🌙 جدول النوم</b></summary>'+vSleep()+'</details><details class="c"><summary><b>🔔 نغمة التنبيه</b></summary>'+vRing()+'</details><details class="c"><summary><b>☁️ المزامنة والنسخ الاحتياطي</b></summary>'+vSync()+'</details>'+vKey(),help:vHelp,wiz:vWiz,chat:vChat})[tab]();if(tab==='chat'){chatPost();groupPost()}if(VIEW)$('v').insertAdjacentHTML('afterbegin',vwBanner());
 paintHeader();
}
document.querySelector('nav').onclick=e=>{const t=e.target.dataset.t;if(t){stopTest();tab=t;if(t==='chat')msgInit();render()}};

function at(){const n=$('n').value.trim();if(!n)return;const me=$('m'),de=$('df');S.tasks.push({id:Date.now(),n,s:$('s').value.trim(),min:me?+me.value||30:30,date:$('dt').value||T,df:de?+de.value:0,done:false});save();render()}
function tg(id){const t=S.tasks.find(x=>x.id==id);t.done=!t.done;save();render()}
function dl(id){S.tasks=S.tasks.filter(x=>x.id!=id);save();render()}
function go(){if(run||S.sw)return;stopAlarm();stopTest();fmsg='';try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume()}catch(e){}
 run={end:Date.now()+dur*1e3,tot:dur,tid:stid};startAud(dur,0);iv=setInterval(tick,500);render()}
function tick(){if(!run)return;const l=Math.ceil((run.end-Date.now())/1e3);if(l<=0){fin();return}const e=$('tm');if(e)e.textContent=fmt(l);const p=$('pr');if(p)p.style.strokeDashoffset=RC*Math.min(1,Math.max(0,1-Math.max(0,(run.end-Date.now())/1e3)/run.tot))}
function fin(){const bg=NAT&&document.hidden;clearInterval(iv);stopAud(bg);if(run.brk){run=null;fmsg='⏰ الراحة خلصت. جاهز تبدأ جلسة تانية؟'+nxt();render();if(!bg)startAlarm('s');return}
 const sv=recS(run.tot);run=null;
 fmsg=(sv?'⏰ خلصت الجلسة.':'⏰ خلصت. الجلسة قصيرة أوي ومتسجلتش في إحصائياتك، جرب مدة أطول.')+' جاهز للراحة؟ '+bkb();render();if(!bg)startAlarm('b')}
function recS(el){const t=S.tasks.find(x=>x.id==run.tid);if(el<MIN_REC)return 0;S.sess.push({d:T,min:Math.max(1,Math.round(el/60)),s:t?t.s:''});if(S.sess.length>500)S.sess=S.sess.slice(-500);return 1}

function se(v){S.exam=v;save();render()}
