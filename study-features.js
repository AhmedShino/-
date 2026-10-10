/* ===== الهدف اليومي ===== */
const fh=m=>{m=Math.max(0,Math.round(m));const h=Math.floor(m/60),r=m%60,hs=h==1?'ساعة':h==2?'ساعتين':h>=3&&h<=10?h+' ساعات':h+' ساعة';return h&&r?hs+' و'+r+' دقيقة':h?hs:r+' دقيقة'};
const gdone=()=>mins(T)+(S.sw?Math.floor(swEl()/6e4):0);
function sg(v){S.goal=Math.max(0,Math.round(+v||0));S.gq=1;ged=0;gcu=0;save();render()}
function sgc(){const m=Math.round((+$('gh').value||0)*60+(+$('gmn').value||0));sg(Math.min(m,960))}
function goalInner(){const g=S.goal||0,d=gdone();
 if(gcu)return `<h2>🎯 تخصيص الهدف</h2><div class="row"><input id="gh" type="number" min="0" max="16" placeholder="ساعات" value="${g?Math.floor(g/60):''}" style="width:90px;margin:0"><input id="gmn" type="number" min="0" max="59" placeholder="دقايق" value="${g%60||''}" style="width:90px;margin:0"></div><div class="row"><button class="pr" style="flex:1" onclick="sgc()">حفظ</button><button style="flex:1" onclick="gcu=0;render()">رجوع</button></div>`;
 if(ged||(!g&&!S.gq))return `<h2>🎯 ${g?'غيّر هدفك اليومي':'هل تريد تحديد هدف لليوم؟'}</h2><div class="row">${[2,4,6].map(h=>`<button class="ch ${g==h*60?'on':''}" onclick="sg(${h*60})">${h} س</button>`).join('')}<button class="ch" onclick="gcu=1;render()">تخصيص</button>${g?'<button class="bad" onclick="sg(0)">إلغاء الهدف</button>':'<button onclick="sg(0)">تخطي</button>'}</div>${ged?'<button style="width:100%" onclick="ged=0;render()">رجوع</button>':'<small>هيتحفظ ويتكرر كل يوم، وتقدر تغيّره في أي وقت.</small>'}`;
 if(!g)return `<div class="r" style="border:0;padding:0"><div>🎯 مفيش هدف يومي</div><button onclick="ged=1;render()">حدد هدف</button></div>`;
 const rm=Math.max(0,g-d),pc=Math.min(100,d/g*100);
 return `<div class="r" style="border:0;padding:0"><div><b>🎯 هدف اليوم: ${fh(g)}</b></div><button onclick="ged=1;render()">تغيير</button></div><div class="bar"><i style="width:${pc}%"></i></div><p>✅ أنجزت: <b>${fh(d)}</b></p><p>${rm?'⏳ المتبقي: <b>'+fh(rm)+'</b>':'🎉 حققت هدفك! كمّل لو عايز تزود.'}</p>`}
function vGoal(){return `<div class="c" id="gc">${goalInner()}</div>`}
function brk(sec){stopAlarm();stopTest();sec=sec||300;fmsg='';run={end:Date.now()+sec*1e3,tot:sec,brk:1};startAud(0,sec);iv=setInterval(tick,500);render()}
let sub='cards',fcs=0;
const ORD=[6,0,1,2,3,4,5],NM=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const bt=(w,h)=>{const[a,b]=w.split(':').map(Number);const m=((a*60+b-Math.round(h*60)-15)%1440+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
const t12=q=>{const[a,b]=q.split(':').map(Number);return (a%12||12)+':'+String(b).padStart(2,'0')+(a<12?' ص':' م')};
function vMem(){return `<div class="row">${[['cards','ملفات الحفظ'],['exam','امتحان']].map(([k,n])=>`<button class="ch ${sub==k?'on':''}" onclick="sub='${k}';render()">${n}</button>`).join('')}</div>`+({cards:vCards,exam:vExam})[sub]()}
let dk=0,Q=null,darm=0,led=0,ted=0;
const D=()=>S.dk.find(d=>d.id==dk),shf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function vCards(){
 if(Q)return vQuiz();
 const d=D();
 if(!d)return `<div class="c"><h2>ملفات الحفظ</h2>${S.dk.map(x=>`<div class="r"><div><b>${esc(x.n)}</b><small>${x.cards.length} بطاقة • ${x.cards.filter(c=>c.nx<=T).length} للمراجعة</small></div><button onclick="dk=${x.id};fcs=0;render()">افتح</button></div>`).join('')||'<p><small>لسه مفيش ملفات. اعمل أول ملف.</small></p>'}</div><div class="c"><b>➕ ملف جديد</b><input id="dn" placeholder="اسم الملف (مثلاً: قوانين الفيزياء)"><button class="pr" onclick="nd()">اعمل الملف</button></div>`;
 const due=d.cards.filter(c=>c.nx<=T),c=due[0];
 return `<button style="margin-bottom:10px" onclick="dk=0;render()">← كل الملفات</button><div class="c"><h2>${esc(d.n)}</h2><small>${d.cards.length} بطاقة • ${due.length} للمراجعة النهاردة</small>${c?`<div class="big2" style="text-align:center;font-size:22px">${esc(c.f)}</div>${fcs?`<div class="c" style="background:var(--bg)">${esc(c.b)}</div><div class="row"><button class="ok" onclick="rc(${c.id},1)">عرفتها ✓</button><button class="bad" onclick="rc(${c.id},0)">لسه ✗</button></div>`:'<button class="pr" onclick="fcs=1;render()">اكشف الإجابة</button>'}`:'<p><small>مفيش بطاقات للمراجعة النهاردة 👌</small></p>'}</div>
 <div class="c"><b>➕ بطاقة جديدة</b><textarea id="cf" placeholder="الوش: سؤال أو مصطلح أو قانون"></textarea><textarea id="cb" placeholder="الضهر: الإجابة"></textarea><button class="pr" onclick="ac()">احفظ البطاقة</button></div>
 ${d.cards.length?`<div class="c"><b>📝 اختبار على الملف</b><div class="row"><small>عدد الأسئلة:</small><input id="qn" type="number" min="1" max="${d.cards.length}" value="${Math.min(10,d.cards.length)}" style="width:80px;margin:0"><small>من ${d.cards.length}</small></div><div class="row"><button class="pr" style="flex:1" onclick="qs(0)">أقيّم نفسي</button>${d.cards.length>=4?'<button class="pr" style="flex:1" onclick="qs(1)">اختيارات</button>':''}</div></div><details class="c"><summary><b>كل البطاقات (${d.cards.length})</b></summary>${d.cards.map(x=>`<div class="r"><div>${esc(x.f)}<small>${esc(x.b)}</small></div><button class="x" onclick="dc(${x.id})">✕</button></div>`).join('')}</details>`:''}
 <button class="bad" style="width:100%" onclick="dd()">${darm?'متأكد؟ اضغط تاني':'🗑 احذف الملف'}</button>`}
function nd(){const n=$('dn').value.trim();if(!n)return;const d={id:uid(),n,cards:[]};S.dk.push(d);dk=d.id;save();render()}
function ac(){const f=$('cf').value.trim();if(!f)return;D().cards.push({id:uid(),f,b:$('cb').value.trim(),st:0,nx:T});save();render()}
function rc(id,ok){const c=D().cards.find(x=>x.id==id);c.st=ok?Math.min(c.st+1,4):0;c.nx=ok?add(T,[1,3,7,14,30][c.st]):add(T,1);fcs=0;save();render()}
function dc(id){const d=D();d.cards=d.cards.filter(x=>x.id!=id);save();render()}
function dd(){if(!darm){darm=1;render();setTimeout(()=>{if(darm){darm=0;render()}},4000);return}S.dk=S.dk.filter(x=>x.id!=dk);dk=0;darm=0;save();render()}
const nz=t=>String(t).replace(/[\u064B-\u065F\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim().toLowerCase();
const qc=()=>{const x=Q.it[Q.i],d=S.dk.find(y=>y.id==x.d);return[d,d.cards.find(c=>c.id==x.c),x]};
function qgo(it,pool){Q={it,pool,i:0,ok:0,bad:[],step:0};qo()}
function qs(mc){const d=D(),n=Math.max(1,Math.min(d.cards.length,+$('qn').value||1));qgo(shf(d.cards).slice(0,n).map(c=>({d:d.id,c:c.id,t:mc?'mc':'s'})),d.cards.map(c=>c.b).filter(Boolean))}
function qo(){const[d,c,x]=qc();if(x.t=='mc')Q.o=shf(shf([...new Set(Q.pool.filter(b=>b!=c.b))]).slice(0,3).concat([c.b]));render()}
function qrec(ok){const[d,c,x]=qc();if(ok){Q.ok++;c.st=Math.min(c.st+1,4);c.nx=add(T,[1,3,7,14,30][c.st])}else{Q.bad.push(x);c.st=0;c.nx=T}save()}
function qm(v){const[d,c]=qc();Q.pick=v;Q.fb=Q.o[v]===c.b;qrec(Q.fb);Q.step=2;render()}
function qrev(){Q.step=1;render()}
function qwd(){const[d,c]=qc();Q.ans=$('qw').value.trim();if(Q.ans&&nz(Q.ans)===nz(c.b)){Q.fb=1;qrec(1);Q.step=2}else Q.step=1;render()}
function qg(ok){qrec(ok);qx()}
function qx(){Q.i++;Q.step=0;if(Q.i>=Q.it.length){Q.done=1;render()}else qo()}
function qrv(){const u=[...new Set(Q.bad.map(x=>x.d))];dk=u.length==1?u[0]:0;sub='cards';Q=null;fcs=0;render()}
function vQuiz(){
 if(Q.done)return `<div class="c"><h2>نتيجتك</h2><div class="big">${Q.ok}/${Q.it.length}</div>${Q.bad.length?`<p>غلطت في ${Q.bad.length} سؤال، واتحطوا في المراجعة النهاردة:</p>${Q.bad.map(x=>{const d=S.dk.find(y=>y.id==x.d),c=d.cards.find(y=>y.id==x.c);return `<div class="r"><div>${esc(c.f)}<small>${esc(c.b)} • ${esc(d.n)}</small></div></div>`}).join('')}<button class="pr" onclick="qrv()">راجع الغلط دلوقتي</button>`:'<p>🎉 جاوبت كله صح!</p>'}<button style="width:100%;margin-top:8px" onclick="Q=null;render()">خلصت</button></div>`;
 const[d,c,x]=qc(),nx=`<button class="pr" onclick="qx()">${Q.i+1>=Q.it.length?'النتيجة':'التالي'}</button>`,bx=`<div class="c" style="background:var(--bg)">${esc(c.b)}</div>`;let b;
 if(x.t=='mc')b=Q.step==0?Q.o.map((o,k)=>`<button style="width:100%;margin-top:8px;text-align:right" onclick="qm(${k})">${esc(o)}</button>`).join(''):`<p>${Q.fb?'✅ صح':'❌ غلط. الإجابة الصح:'}</p>${Q.fb?'':bx}${nx}`;
 else if(x.t=='s')b=Q.step==0?'<button class="pr" onclick="qrev()">اعرض الإجابة</button>':`${bx}<div class="row"><button class="ok" onclick="qg(1)">جاوبت صح ✓</button><button class="bad" onclick="qg(0)">غلط ✗</button></div>`;
 else b=Q.step==0?'<textarea id="qw" placeholder="اكتب إجابتك"></textarea><button class="pr" onclick="qwd()">تأكيد</button>':Q.step==2?`<p>✅ إجابتك مطابقة</p>${nx}`:`<p><small>إجابتك:</small> ${esc(Q.ans||'—')}</p>${bx}<small>قارن بنفسك:</small><div class="row"><button class="ok" onclick="qg(1)">إجابتي صح ✓</button><button class="bad" onclick="qg(0)">غلط ✗</button></div>`;
 return `<div class="c"><small>${esc(d.n)} • سؤال ${Q.i+1} من ${Q.it.length} • ${x.t=='mc'?'اختيار':x.t=='w'?'كتابة':'قيّم نفسك'}</small><div class="big2" style="text-align:center;font-size:22px">${esc(c.f)}</div>${b}<button style="width:100%;margin-top:8px" onclick="Q=null;render()">إنهاء الاختبار</button></div>`}
let EX={};
function vExam(){
 if(Q)return vQuiz();
 if(!S.dk.length)return '<div class="c"><p><small>اعمل ملف بطاقات الأول من "ملفات الحفظ".</small></p></div>';
 return `<div class="c"><h2>📝 امتحان</h2><small>اختار الملفات اللي عايز الامتحان منها:</small>${S.dk.map(d=>`<label class="r"><input type="checkbox" id="xk${d.id}" ${EX[d.id]===0?'':'checked'} onchange="EX[${d.id}]=this.checked?1:0"><div>${esc(d.n)}<small>${d.cards.length} بطاقة</small></div></label>`).join('')}<div class="row"><div style="flex:1"><small>أسئلة اختيار</small><input id="xmc" type="number" min="0" value="5" style="margin:0"></div><div style="flex:1"><small>أسئلة كتابة</small><input id="xw" type="number" min="0" value="5" style="margin:0"></div></div><small>الأسئلة بتتوزع بالتساوي على الملفات اللي اخترتها، وبتتخلط.</small><button class="pr" style="margin-top:8px" onclick="xgo()">ابدأ الامتحان</button><p id="xm"></p></div>`}
function xgo(){
 const ds=S.dk.filter(d=>{const e=$('xk'+d.id);return e&&e.checked}),m=Math.max(0,+$('xmc').value||0),w=Math.max(0,+$('xw').value||0),n=m+w,tot=ds.reduce((a,d)=>a+d.cards.length,0);
 if(!ds.length||!n){$('xm').textContent='اختار ملف وحدد عدد الأسئلة.';return}
 if(n>tot){$('xm').textContent='الأسئلة ('+n+') أكتر من البطاقات المتاحة ('+tot+'). قلّل العدد.';return}
 const q=ds.map(d=>shf(d.cards).map(c=>({d:d.id,c:c.id}))),pk=[];
 for(let r=0;pk.length<n;r++)q.forEach(a=>{if(pk.length<n&&a[r])pk.push(a[r])});
 qgo(shf(shf(pk).map((x,i)=>Object.assign(x,{t:i<m?'mc':'w'}))),ds.flatMap(d=>d.cards.map(c=>c.b)).filter(Boolean))}
function les(id,i){const v=$('len').value.trim(),l=S.lec.find(x=>x.id==id);if(v)l.n=v;led=0;lop=i;save();render()}
function tes(id,i){const v=$('ten').value.trim(),t=S.tasks.find(x=>x.id==id);if(v)t.n=v;ted=0;lop=i;save();render()}
const hms=x=>[Math.floor(x/3600),Math.floor(x/60)%60,x%60];
const fd=x=>{const[h,m,z]=hms(Math.round(x));return[h?h+' س':'',m?m+' د':'',z?z+' ث':''].filter(Boolean).join(' ')||'0'};
function durUI(){const bm=S.bm||300,f=(k,v,p)=>`<input id="${k}" type="number" min="0" placeholder="${p}" value="${v||''}" style="width:72px;margin:0" onchange="sdt()">`,[dh,dm,dz]=hms(dur),[bh,bn,bz]=hms(bm);
 return `<small>مدة المذاكرة: ${fd(dur)}</small><div class="row" style="justify-content:center">${[15,25,45,60].map(m=>`<button class="ch ${m*60==dur?'on':''}" onclick="dur=${m*60};render()">${m} د</button>`).join('')}</div><div class="row" style="justify-content:center">${f('dh',dh,'ساعات')}${f('dmn',dm,'دقايق')}${f('dsc',dz,'ثواني')}</div><small>مدة الراحة: ${fd(bm)}</small><div class="row" style="justify-content:center">${[5,10,15].map(m=>`<button class="ch ${m*60==bm?'on':''}" onclick="S.bm=${m*60};save();render()">${m} د</button>`).join('')}</div><div class="row" style="justify-content:center">${f('bh',bh,'ساعات')}${f('bmn',bn,'دقايق')}${f('bsc',bz,'ثواني')}</div>`}
function sdt(){const g=k=>Math.max(0,+$(k).value||0),d=g('dh')*3600+g('dmn')*60+g('dsc'),b=g('bh')*3600+g('bmn')*60+g('bsc');if(d>0)dur=d;if(b>0)S.bm=b;save();render()}
function pz(){if(!run)return;if(run.p){run.end=Date.now()+run.left;run.p=0;iv=setInterval(tick,500);run.brk?startAud(0,run.left/1e3):startAud(run.left/1e3,0)}else{run.left=run.end-Date.now();run.p=1;clearInterval(iv);stopAud()}render()}
function dn2(){if(!run)return;const w=run.p?run.left:run.end-Date.now(),el=run.tot-w/1e3;clearInterval(iv);stopAud();
 if(run.brk){run=null;fmsg='☕ خلصت الراحة بدري. جاهز تبدأ جلسة تانية؟'+nxt();render();return}
 const sv=recS(el);run=null;
 fmsg=(sv?'✅ خلصت الجلسة.':'✅ خلصت. الجلسة قصيرة أوي ومتسجلتش في إحصائياتك، جرب مدة أطول.')+' جاهز للراحة؟ '+bkb();render()}
const NAT=!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
let LN=null;if(NAT){try{LN=Capacitor.Plugins.LocalNotifications||Capacitor.registerPlugin('LocalNotifications')}catch(e){}}
async function nInit(){if(!LN)return;try{await LN.requestPermissions();try{for(const id of ['ends2','starts2','ends3','starts3','ends3v','starts3v','ends3n','starts3n'])await LN.deleteChannel({id})}catch(e){}
 await LN.createChannel({id:'ends3v',name:'انتهاء المذاكرة - اهتزاز',importance:5,sound:'ring_end.wav',vibration:true,visibility:1});
 await LN.createChannel({id:'starts3v',name:'انتهاء الراحة - اهتزاز',importance:5,sound:'ring_start.wav',vibration:true,visibility:1});
 await LN.createChannel({id:'ends3n',name:'انتهاء المذاكرة - بدون اهتزاز',importance:5,sound:'ring_end.wav',vibration:false,visibility:1});
 await LN.createChannel({id:'starts3n',name:'انتهاء الراحة - بدون اهتزاز',importance:5,sound:'ring_start.wav',vibration:false,visibility:1});
 const x=await LN.checkExactNotificationSetting();if(x.exact_alarm!=='granted'&&!S.exq){S.exq=1;save();await LN.changeExactNotificationSetting()}}catch(e){}}
function nSched(sec,ch,title,body){if(!LN)return;try{const id=(ch==='ends3'?'ends3':ch==='starts3'?'starts3':ch),channelId=S.vib===false?(id==='ends3'?'ends3n':'starts3n'):(id==='ends3'?'ends3v':'starts3v');LN.schedule({notifications:[{id:7,title,body,channelId,schedule:{at:new Date(Date.now()+sec*1000+2000),allowWhileIdle:true}}]}).catch(()=>{})}catch(e){}}
function nCancel(){if(LN)try{LN.cancel({notifications:[{id:7}]}).catch(()=>{})}catch(e){}}
function wr(){
 const r=(a,b)=>S.sess.filter(x=>x.d>=add(T,a)&&x.d<=add(T,b)),w=r(-6,0),p=r(-13,-7),sm=a=>a.reduce((x,y)=>x+y.min,0),m=sm(w),pm=sm(p);
 const dy={};w.forEach(x=>dy[x.d]=(dy[x.d]||0)+x.min);
 const bd=Object.entries(dy).sort((a,b)=>b[1]-a[1])[0],tk=S.tasks.filter(t=>t.date>=add(T,-6)&&t.date<=T),dn=tk.filter(t=>t.done).length;
 return `<div class="c"><h2>📋 مراجعة أسبوعك</h2><p>ذاكرت <b>${m}</b> دقيقة ${p.length?`(${m>=pm?'+':''}${m-pm} عن الأسبوع اللي فات)`:''}</p><p>دروس خلّصتها: <b>${dn}</b> من ${tk.length}</p>${bd?`<p>أحسن يوم: ${bd[0]} (${bd[1]} د)</p>`:''}</div>`}

function vSleep(){
 const g=S.sl,tw=new Date().getDay(),b=bt(g.w[tw],g.h),lg=[...Array(7)].map((_,i)=>S.slog[add(T,-i)]),ad=lg.filter(v=>v===1).length,n=lg.filter(v=>v!==undefined).length;
 return `<div class="c"><h2>🌙 الليلة</h2><div class="big">${t12(b)}</div><p style="text-align:center">نام الساعة دي عشان تصحى ${t12(g.w[tw])} بكرة.<br><small>اقفل الموبايل قبلها بنص ساعة (${t12(bt(g.w[tw],g.h+.5))}).</small></p>
 <b>نمت في ميعادك امبارح؟</b><div class="row"><button class="ok ${S.slog[T]===1?'on':''}" onclick="sl2(1)">أيوه ✓</button><button class="bad" onclick="sl2(0)">لأ ✗</button></div><small>${n?`التزمت ${ad} من ${n} ليالي آخر أسبوع`:'سجّل أول ليلة وهتتابع التزامك هنا'}</small></div>
 <div class="c"><h2>جدول نومك الأسبوعي</h2><div class="row"><small>ساعات النوم:</small><input type="number" step=".5" min="4" max="12" value="${g.h}" style="width:80px;margin:0" onchange="sh(this.value)"></div><small>المراهقين محتاجين من 8 لـ 10 ساعات تقريباً. حدد ميعاد صحيانك لكل يوم، وأنا أحسبلك ميعاد النوم (بحسبة 15 دقيقة عشان تنام).</small>
 ${ORD.map(d=>`<div class="r"><div><b>${NM[d]}</b><small>الصحيان</small></div><input type="time" value="${g.w[d]}" style="width:120px;margin:0" onchange="sw(${d},this.value)"><div style="text-align:left"><small>تنام</small><b>${t12(bt(g.w[d],g.h))}</b></div></div>`).join('')}</div>`}
function sh(v){S.sl.h=+v||8;save();render()}
function sw(d,v){S.sl.w[d]=v||'06:30';save();render()}
function sl2(v){S.slog[T]=v;save();render()}
let PV=null,pre=0,bm='paste',IMP=null;
const bkl=()=>S.tasks.filter(t=>!t.done&&t.bk);
function snap(){ensureSb();autoLec();applyPlan();S.tasks.forEach(t=>{if(!t.done&&t.date<T)t.bk=1})}
function mp(){const U=S.tasks.filter(t=>!t.done&&t.date<T).sort((a,b)=>a.date.localeCompare(b.date)),n=Math.max(1,Math.min(30,+$('pn').value||1)),per=Math.ceil(U.length/n),m={};U.forEach((t,i)=>m[t.id]=Math.min(n-1,Math.floor(i/per)));PV={n,m};render()}
function cf(){S.tasks.forEach(t=>{if(PV.m[t.id]!==undefined)t.date=add(T,PV.m[t.id])});PV=null;save();render()}
function vImp(){
 let b;
 if(IMP)b=`<p><b>${esc(IMP.s||'بدون مادة')}</b> • ${IMP.it.length} درس</p><small>علّم اللي ذاكرته فعلاً، والباقي هيتضاف كتراكم:</small>${IMP.it.map((n,i)=>`<label class="r"><input type="checkbox" id="ik${i}"><div>${esc(n)}</div></label>`).join('')}<button class="pr" onclick="ia()">أضف الباقي كتراكم</button><button style="width:100%;margin-top:8px" onclick="IMP=null;render()">إلغاء</button>`;
 else if(bm=='paste')b='<input id="bs" placeholder="المادة"><textarea id="bl" style="min-height:120px" placeholder="الصق الدروس هنا، كل درس في سطر"></textarea><button class="pr" onclick="ip()">جهّز القايمة</button>';
 else b='<input id="bs" placeholder="المادة"><div class="row"><input id="bc" type="number" placeholder="عدد الدروس المتأخرة" style="flex:1;margin:0"><input id="bo" type="number" placeholder="ذاكرت منهم كام" style="flex:1;margin:0"></div><button class="pr" onclick="ic()">أضف كتراكم</button><small>هتتسمى "المادة - درس 1" وهكذا.</small>';
 return `<div class="c"><h2>➕ ضيف تراكماتك</h2>${IMP?'':`<div class="row">${[['paste','لصق قايمة'],['count','بالعدد']].map(([k,n])=>`<button class="ch ${bm==k?'on':''}" onclick="bm='${k}';render()">${n}</button>`).join('')}</div>`}${b}</div>`}
function ip(){const it=$('bl').value.split('\n').map(x=>x.replace(/^[\s\d\u0660-\u0669\-\.\)\(•*]+/,'').trim()).filter(Boolean).slice(0,150);if(!it.length)return;IMP={s:$('bs').value.trim(),it};render()}
function ia(){const t0=Date.now();IMP.it.forEach((n,i)=>{if(!$('ik'+i).checked)S.tasks.push({id:t0+i,n,s:IMP.s,min:0,date:add(T,-1),done:false,bk:1})});S.la=S.tasks.filter(t=>t.id>=t0).map(t=>t.id);IMP=null;save();render()}
function ic(){const c=Math.min(100,+$('bc').value||0),o=+$('bo').value||0,s=$('bs').value.trim()||'مادة',t0=Date.now();for(let i=o+1;i<=c;i++)S.tasks.push({id:t0+i,n:s+' - درس '+i,s,min:0,date:add(T,-1),done:false,bk:1});S.la=S.tasks.filter(t=>t.id>=t0).map(t=>t.id);save();render()}
function vHelp(){
 const sec=(t,b,o)=>`<details class="c" ${o?'open':''}><summary><b>${t}</b></summary>${b}</details>`;
 return `<div class="c"><h2>طريقة استخدام مذاكرتي</h2><p>التطبيق بيساعدك تنظم مذاكرتك وتخلّص التراكمات. ارجع للصفحة دي من زرار ؟ فوق.</p></div>`
 +sec('أول مرة','<p>التطبيق بيسألك 3 أسئلة: دروسك المتأخرة، وتخلّصهم في كام يوم، وبتصحى الساعة كام. وبعدها الخطة بتطلع جاهزة.</p>',1)
 +sec('كل يوم','<p>افتح <b>النهاردة</b> وشوف الدروس. اضغط <b>ابدأ</b> وهيبدأ عدّاد على أول درس. لما تخلّص علّم على الدرس ✓.</p><p>لو عايز تذاكر من غير مدة محددة اضغط <b>مذاكرة حرة</b>: عدّاد بيزيد لحد ما تضغط انتهيت، وبيتسجل في إحصائياتك (الجلسات الأقل من 60 ثانية مبتتسجلش).</p><p>فوق الدروس هتلاقي كارت <b>هدف اليوم</b>: اختار 2 أو 4 أو 6 ساعات أو حدد رقمك، وبيتحفظ ويتكرر كل يوم، وبيعدّ كل جلساتك.</p><p>في <b>الحفظ</b> ذاكر ملفات البطاقات واعمل امتحانات.</p>')
 +sec('لو فاتك يوم','<p>هيظهرلك كارت "متأخر" في النهاردة. افتح <b>موادي</b> واضغط "اعمل الخطة" تاني.</p>')
 +sec('موادي','<p>لكل مادة ملف: اختار المادة، واكتب اسم الأستاذ، وحدد مستواك فيها. زوّد بـ + اللي متراكم عندك، وخلّصت واحد اضغط −. اختار أيام ما الأستاذ بينزل محاضرات وهتتضاف لوحدها. وبعدها اكتب كام تخلّص في اليوم واضغط "اعمل الخطة" وهتفتحلك صفحة فيها كل محاضرة ودرس مترتبين، رتّبهم بالأسهم.</p>')
 +sec('كل أسبوع','<p>في <b>إحصائياتي</b> هتلاقي مراجعة أسبوعك، وجدول النوم في آخر الصفحة.</p>')

 +sec('حاجات لازم تعرفها','<p>• لو داخل بحسابك، بياناتك بتتزامن أوتوماتيك بين أجهزتك (موبايل وكمبيوتر مثلاً). لو مش متاحة المزامنة، بياناتك بتفضل على الجهاز ده بس — وفيه نسخة احتياطية يدوية في إحصائياتي.</p><p>• بيبعتلك صوت تنبيه لما الجلسة أو الراحة تخلص وإنت فاتح التطبيق. في نسخة الموبايل بيوصلك إشعار حتى لو التطبيق مقفول، بس المتابعة اليومية للتراكمات محتاجة إنك تفتح التطبيق بنفسك.</p>')
 +sec('الأصحاب والرسائل','<p>من تاب <b>الأصحاب</b> دوّر على صاحبك بالـ username وابعتله طلب صداقة. لما يوافق تقدروا تبعتوا رسائل لبعض، وتشوف علامة ✓ للإرسال و ✓✓ لما يقرأ، و"بيكتب..." أثناء الكتابة.</p><p>تقدر تحظر أي حد أو تمسح الصداقة في أي وقت. لو وصلتلك رسالة مسيئة، استخدم زر 🚩 بجانب المحادثة أو الرسالة للإبلاغ عنها للمطور.</p><p>من زرار 📎 تقدر تبعت <b>صورة</b> أو <b>ملف</b> (PDF أو Word أو PowerPoint أو Excel لحد 330 كيلوبايت) أو <b>ملف حفظ</b> من ملفاتك، واللي بيستلمه يقدر يستورد ملف الحفظ لملفاته.</p><p>من <b>الجروبات</b> اعمل جروب وضيف أصحابك بس (مفيش حد بيتضاف من غير ما يكون صاحبك). المشرف يقدر يضيف ويشيل ويحذف، واي عضو يقدر يخرج.</p><p>الإشعارات بتظهر جوه التطبيق وهو مفتوح بس.</p>')
 +vModerationHelp()
 +'<button class="pr" onclick="hs()">فهمت</button>'}
let AC=null,lf=0,lm='paste',lop=-1;
function ring(k){if(!(AUD&&!AUD.paused))try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume();const ck=k=='s'?'s':'e',p=presetOf(ck),arr=p[ck],rep=arr.length*p.gap+p.dur+.3;for(let rp=0;rp<3;rp++)arr.forEach((f,j)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=p.type;o.connect(g);g.connect(AC.destination);o.frequency.value=f;const a=AC.currentTime+rp*rep+j*p.gap;g.gain.setValueAtTime(.5,a);g.gain.exponentialRampToValueAtTime(.001,a+p.dur);o.start(a);o.stop(a+p.dur+.02)})}catch(e){}if(S.vib!==false)navigator.vibrate&&navigator.vibrate([500,200,500,200,500,200,500])}
let testOsc=[];
function stopTest(){testOsc.forEach(o=>{try{o.stop()}catch(e){}});testOsc=[];navigator.vibrate&&navigator.vibrate(0)}
function playTest(k){stopTest();try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume();const ck=k=='s'?'s':'e',p=presetOf(ck);p[ck].forEach((f,j)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=p.type;o.connect(g);g.connect(AC.destination);o.frequency.value=f;const a=AC.currentTime+j*p.gap;g.gain.setValueAtTime(.5,a);g.gain.exponentialRampToValueAtTime(.001,a+p.dur);o.start(a);o.stop(a+p.dur+.02);testOsc.push(o)})}catch(e){}if(S.vib!==false)navigator.vibrate&&navigator.vibrate([500,200,500])}
const nxt=()=>`<div class="row" style="justify-content:center"><button class="pr" onclick="sb()">ابدأ مذاكرة (${fd(dur)})</button></div>`;
const lfin=l=>l.a&&l.h&&l.q,lst=l=>!l.a?1:!l.h?2:!l.q?3:0;
const lecDue=()=>S.lec.filter(l=>!lfin(l)&&l.d&&l.d<=T);
const lrow=(l,i,sub)=>`<div class="r ${lfin(l)?'dn':''}" style="display:block"><div>${led===l.id?`<input id="len" value="${esc(l.n)}" style="margin:0"><button class="pr" style="width:auto" onclick="les(${l.id},${i})">حفظ</button>`:`<b>${esc(l.n)}</b>`} <small>${sub?esc(l.s||'')+' • ':''}${l.d&&!lfin(l)?(l.d<T?'متأخرة':l.d==T?'النهاردة':l.d):''}</small></div><div class="row">${[['a','👁 شفت'],['h','✍️ الواجب'],['q','📝 الكويز']].map(([k,n])=>`<button class="ch ${l[k]?'on':''}" onclick="ltg(${l.id},'${k}',${i})">${n}</button>`).join('')}${i>=0?`<button class="x" onclick="led=${l.id};lop=${i};render()">✏️</button><button class="x" onclick="ld2(${l.id},${i})">✕</button>`:''}</div></div>`;
const vLecToday=LT=>`<div class="c"><h2>🎬 محاضرات النهاردة</h2>${LT.map(l=>lrow(l,-1,1)).join('')}</div>`;
function vLec(){
 const A=S.lec,cnt=[0,0,0,0],g={};A.forEach(l=>cnt[lst(l)]++);
 A.filter(l=>lf==0||lst(l)==lf).forEach(l=>{const k=l.s||'بدون مادة';(g[k]=g[k]||[]).push(l)});
 const ks=Object.keys(g),un=A.length-cnt[0];
 return `<div class="c"><h2>🎬 محاضراتك</h2>${A.length?`<p>خلّصت ${cnt[0]} من ${A.length} محاضرة.</p><div class="row">${[[0,'الكل '+A.length],[1,'لسه متشافتش '+cnt[1]],[2,'واجبات لسه '+cnt[2]],[3,'كويزات لسه '+cnt[3]]].map(([k,n])=>`<button class="ch ${lf==k?'on':''}" onclick="lf=${k};render()">${n}</button>`).join('')}</div>`:'<p><small>لسه مفيش محاضرات. ضيفهم من الكارت اللي تحت.</small></p>'}${ks.map((k,i)=>`<details class="c" style="margin:8px 0 0" ${lf||lop===i?'open':''}><summary><b>${esc(k)}</b> <small>${esc(S.tch[k]||'')} • ${g[k].length} محاضرة</small></summary>${g[k].map(l=>lrow(l,i)).join('')}</details>`).join('')}</div>
 <div class="c"><h2>➕ ضيف محاضرات</h2><div class="row">${[['paste','لصق عناوين'],['count','بالعدد']].map(([k,n])=>`<button class="ch ${lm==k?'on':''}" onclick="lm='${k}';render()">${n}</button>`).join('')}</div><input id="lsub" placeholder="المادة"><input id="ltch" placeholder="اسم المدرس (اختياري)">${lm=='paste'?'<textarea id="llist" style="min-height:100px" placeholder="الصق عناوين المحاضرات، كل محاضرة في سطر"></textarea>':'<input id="lcnt" type="number" placeholder="عدد المحاضرات">'}<small>وصلت لفين؟ (سيبها فاضية لو لسه)</small><div class="row"><input id="lna" type="number" placeholder="شفت كام" style="flex:1;margin:0"><input id="lnh" type="number" placeholder="واجب كام" style="flex:1;margin:0"><input id="lnq" type="number" placeholder="كويز كام" style="flex:1;margin:0"></div><button class="pr" onclick="lA()">ضيف</button></div>
 ${un?`<div class="c"><h2>خطة المحاضرات</h2><small>تحب تخلّص المحاضرات دي في كام يوم؟</small><div class="row"><input id="lnd" type="number" min="1" max="30" value="7" style="width:90px;margin:0"><button onclick="lp()">وزّع على الأيام</button></div><small>كل محاضرة هتظهر في النهاردة في يومها. تقدر تعيد التوزيع في أي وقت.</small></div>`:''}`}
function ltg(id,k,i){lop=i;const l=S.lec.find(x=>x.id==id);l[k]=l[k]?0:1;save();render()}
function ld2(id,i){lop=i;S.lec=S.lec.filter(x=>x.id!=id);save();render()}
function lA(){const s=$('lsub').value.trim()||'مادة',tc=$('ltch').value.trim();let it;
 if(lm=='paste')it=$('llist').value.split('\n').map(x=>x.replace(/^[\s\d\u0660-\u0669\-\.\)\(•*]+/,'').trim()).filter(Boolean);
 else{const c=Math.min(100,+$('lcnt').value||0);it=[...Array(c)].map((_,i)=>s+' - محاضرة '+(i+1))}
 it=it.slice(0,150);if(!it.length)return;
 const a=+$('lna').value||0,h=+$('lnh').value||0,q=+$('lnq').value||0,t0=Date.now();
 it.forEach((n,i)=>S.lec.push({id:t0+i,s,n,a:i<a?1:0,h:i<h?1:0,q:i<q?1:0,d:''}));
 if(tc)S.tch[s]=tc;save();render()}
function lp(){const U=S.lec.filter(l=>!lfin(l));if(!U.length)return;const n=Math.max(1,Math.min(30,+$('lnd').value||1)),per=Math.ceil(U.length/n);U.forEach((l,i)=>l.d=add(T,Math.min(n-1,Math.floor(i/per))));save();render()}
let KS=[],sarm=-1,pm='',uc=0;
const MAT=['عربي','إنجليزي','لغة ثانية','فيزياء','كيمياء','أحياء','جيولوجيا','تفاضل','تكامل','جبر','هندسة فراغية','ديناميكا','استاتيكا','جغرافيا','تاريخ'];
const uid=()=>Date.now()*100+(uc++%100),sk=x=>x.s||'بدون مادة';
function ensureSb(){S.sb=S.sb||{};const ns=new Set();S.tasks.forEach(t=>{if(t.bk&&!t.done)ns.add(sk(t))});S.lec.forEach(l=>ns.add(sk(l)));ns.forEach(k=>{if(!S.sb[k])S.sb[k]={t:S.tch[k]||'',lv:2,days:[],pd:1,la:T}})}
function autoLec(){let ch=0;Object.keys(S.sb).forEach(k=>{const f=S.sb[k];let d=add(f.la||T,1),g=0;while(d<=T&&g++<30){if(f.days.includes(new Date(d+'T12:00').getDay())){for(let i=0;i<(f.pd||1);i++){S.lec.push({id:uid(),s:k,n:k+' - محاضرة '+(S.lec.filter(l=>sk(l)==k).length+1),a:0,h:0,q:0,d,pk:'v:'+k+':'+d+':'+i});ch=1}}d=add(d,1)}if(f.la!==T){f.la=T;ch=1}});if(ch)save()}
function rep(){const cp=capAvg();let B=0,r=0;Object.keys(S.sb).forEach(k=>{const f=S.sb[k];B+=S.tasks.filter(t=>t.bk&&!t.done&&sk(t)==k).length+S.lec.filter(l=>sk(l)==k&&!lfin(l)).length;r+=f.days.length*(f.pd||1)});
 if(!B&&!r)return 'مفيش متراكم ولا محاضرات جاية.';const rd=r/7;
 return `الأساتذة بينزلوا ${r} محاضرة في الأسبوع وإنت بتخلّص ${Math.round(cp*7)}. `+(cp<=rd?`التراكم هيزيد. محتاج تخلّص ${Math.ceil(rd)+1} في اليوم على الأقل.`:`المتراكم ${B}، وهتخلّصه في حوالي ${Math.ceil(B/(cp-rd))} يوم.`)}
function vMat(){
 KS=Object.keys(S.sb);
 const cnt=k=>{const lc=[0,0,0,0];S.lec.filter(l=>sk(l)==k).forEach(l=>lc[lst(l)]++);return[S.tasks.filter(t=>t.bk&&!t.done&&sk(t)==k).length,lc[1],lc[2],lc[3]]};
 const ctr=(i,lab,st,c)=>`<div class="r"><div>${lab}</div><button onclick="cn(${i},${st},-1)">−</button><b style="min-width:28px;text-align:center">${c}</b><button onclick="cn(${i},${st},1)">+</button></div>`;
 const files=KS.map((k,i)=>{const f=S.sb[k],c=cnt(k),ls=S.lec.filter(l=>sk(l)==k),ts=S.tasks.filter(t=>t.bk&&!t.done&&sk(t)==k),op=lop===i?'open':'';
  return `<details class="c" ${op}><summary><b>${esc(k)}</b> <small>${esc(f.t)} • ${c[0]} درس • ${c[1]+c[2]+c[3]} محاضرة</small></summary>
 <input value="${esc(f.t)}" placeholder="اسم الأستاذ (اختياري)" onchange="st2(${i},this.value)">
 <div class="row">${[[1,'ضعيف'],[2,'متوسط'],[3,'قوي']].map(([v,n])=>`<button class="ch ${(f.lv||2)==v?'on':''}" onclick="sl(${i},${v})">${n}</button>`).join('')}</div>
 <small>اللي متراكم عندك (+ زوّد، − خلّصت واحد):</small>${ctr(i,'دروس متأخرة',0,c[0])}${ctr(i,'محاضرات لسه متشافتش',1,c[1])}${ctr(i,'واجبات لسه',2,c[2])}${ctr(i,'كويزات لسه',3,c[3])}
 <small>الأستاذ بينزل محاضرات يوم:</small><div class="row">${ORD.map(d=>`<button class="ch ${f.days.includes(d)?'on':''}" onclick="sdy(${i},${d})">${NM[d]}</button>`).join('')}</div>
 <div class="r"><div>عدد المحاضرات في اليوم</div><button onclick="spd(${i},-1)">−</button><b style="min-width:28px;text-align:center">${f.pd||1}</b><button onclick="spd(${i},1)">+</button></div>
 ${ls.length?`<details ${op}><summary>محاضرات المادة (${ls.length})</summary>${ls.map(l=>lrow(l,i)).join('')}</details>`:''}
 ${ts.length?`<details ${op}><summary>دروس متراكمة (${ts.length})</summary>${ts.map(t=>`<div class="r"><input type="checkbox" onchange="lop=${i};tg(${t.id})"><div>${ted===t.id?`<input id="ten" value="${esc(t.n)}" style="margin:0"><button class="pr" style="width:auto" onclick="tes(${t.id},${i})">حفظ</button>`:esc(t.n)}</div><button class="x" onclick="ted=${t.id};lop=${i};render()">✏️</button><button class="x" onclick="lop=${i};dl(${t.id})">✕</button></div>`).join('')}</details>`:''}
 <button class="bad" style="width:100%;margin-top:8px" onclick="dsub(${i})">${sarm===i?'متأكد؟ اضغط تاني':'🗑 احذف المادة وكل بياناتها'}</button></details>`}).join('');
 return `<div class="c"><h2>🗓 خطتي</h2><small>أقدر أخلّص كام (درس أو محاضرة) في كل يوم؟ (0 = إجازة)</small><div class="row">${ORD.map(d=>`<div style="text-align:center"><small>${NM[d].slice(0,4)}</small><input type="number" min="0" value="${(S.cd||[])[d]??(S.cp||3)}" style="width:52px;margin:0" onchange="scd(${d},this.value)"></div>`).join('')}</div><button class="pr" onclick="mplan()">اعمل الخطة</button>${S.po?'<button style="width:100%;margin-top:8px" onclick="op2()">📋 افتح خطتي</button>':''}<p>${rep()}</p>${pm?`<p><b>${pm}</b></p>`:''}</div>${files}<div class="c"><b>➕ مادة جديدة</b><div class="row">${MAT.filter(n=>!S.sb[n]).map(n=>`<button class="ch" onclick="asub('${n}')">${n}</button>`).join('')}</div><div class="row"><input id="nsub" placeholder="مادة تانية" style="flex:1;margin:0"><button onclick="asub2()">ضيف</button></div></div>`}
function cn(i,st,d){lop=i;const k=KS[i];
 if(st==0){if(d>0)S.tasks.push({id:uid(),n:k+' - درس '+(S.tasks.filter(t=>sk(t)==k).length+1),s:k,min:0,date:add(T,-1),done:false,bk:1});else{const t=S.tasks.find(t=>t.bk&&!t.done&&sk(t)==k);if(t)t.done=true}}
 else if(d>0)S.lec.push({id:uid(),s:k,n:k+' - محاضرة '+(S.lec.filter(l=>sk(l)==k).length+1),a:st>1?1:0,h:st>2?1:0,q:0,d:''});
 else{const l=S.lec.find(l=>sk(l)==k&&lst(l)==st);if(l)l[['','a','h','q'][st]]=1}
 save();render()}
function sl(i,v){lop=i;S.sb[KS[i]].lv=v;save();render()}
function st2(i,v){S.sb[KS[i]].t=v.trim();save()}
function sdy(i,d){lop=i;const f=S.sb[KS[i]];f.days=f.days.includes(d)?f.days.filter(x=>x!=d):[...f.days,d];f.la=T;save();render()}
function spd(i,x){lop=i;const f=S.sb[KS[i]];f.pd=Math.max(1,(f.pd||1)+x);save();render()}
function asub(n){if(!S.sb[n])S.sb[n]={t:'',lv:2,days:[],pd:1,la:T};lop=Object.keys(S.sb).indexOf(n);save();render()}
function asub2(){const n=$('nsub').value.trim();if(n)asub(n)}
function dsub(i){if(sarm!==i){sarm=i;lop=i;render();setTimeout(()=>{if(sarm===i){sarm=-1;render()}},4000);return}const k=KS[i];delete S.sb[k];S.tasks=S.tasks.filter(t=>!(t.bk&&sk(t)==k));S.lec=S.lec.filter(l=>sk(l)!=k);sarm=-1;lop=-1;save();render()}
function virt(){const v={};Object.keys(S.sb).forEach(k=>{const f=S.sb[k];let c=S.lec.filter(l=>sk(l)==k).length;for(let i=1;i<=30;i++){const d=add(T,i);if(f.days.includes(new Date(d+'T12:00').getDay())){for(let j=0;j<(f.pd||1);j++){c++;const key='v:'+k+':'+d+':'+j;v[key]={key,n:k+' - محاضرة '+c,s:k,rel:i,v:1}}}}});return v}
function planItems(){
 const all=Object.assign({},virt());
 S.tasks.filter(t=>t.bk&&!t.done).forEach(t=>{all['t:'+t.id]={key:'t:'+t.id,n:t.n,s:sk(t),x:t,rel:0}});
 S.lec.filter(l=>!lfin(l)).forEach(l=>{const k=l.pk||'l:'+l.id;all[k]={key:k,n:l.n,s:sk(l),x:l,rel:0}});
 const out=[],seen={};(S.po||[]).forEach(k=>{if(all[k]&&!seen[k]){seen[k]=1;out.push(all[k])}});
 Object.values(all).filter(o=>!seen[o.key]).sort((a,b)=>(a.v?1:0)-(b.v?1:0)||a.rel-b.rel).forEach(o=>out.push(o));return out}
function mplan(){
 const it=[];
 Object.keys(S.sb).forEach(k=>{const w=[0,3,2,1][S.sb[k].lv||2];[...S.tasks.filter(t=>t.bk&&!t.done&&sk(t)==k).map(t=>'t:'+t.id),...S.lec.filter(l=>sk(l)==k&&!lfin(l)).map(l=>l.pk||'l:'+l.id)].forEach((key,i)=>it.push({key,k:i/w}))});
 it.sort((a,b)=>a.k-b.k);
 S.po=[...it.map(o=>o.key),...Object.values(virt()).sort((a,b)=>a.rel-b.rel).map(o=>o.key)];
 applyPlan();save();tab='plan';render()}
function op2(){tab='plan';render()}
function vPlan(){
 const L=applyPlan()||[];S.po=L.map(o=>o.key);
 const nd=L.length?L[L.length-1].day+1:0,nv=L.filter(o=>o.v).length,byd={};L.forEach((o,i)=>{(byd[o.day]=byd[o.day]||[]).push([o,i])});
 const dn=d=>d==0?'النهاردة':d==1?'بكرة':NM[new Date(add(T,d)+'T12:00').getDay()]+' '+add(T,d);
 const dc=d=>`<div class="c"><b>${dn(d)}</b> <small>${byd[d].length}</small>${byd[d].map(([o,i])=>`<div class="r"><div><b>${esc(o.n)}</b>${o.v?' <small>🆕 هتنزل</small>':''}<small>${esc(o.s)}</small></div><button class="x" onclick="pmv(${i},-99)">⏫</button><button class="x" onclick="pmv(${i},-1)">↑</button><button class="x" onclick="pmv(${i},1)">↓</button><button class="x" onclick="mvi=${i};render()">📅</button></div>${mvi===i?`<select onchange="pto(${i},+this.value)"><option value="">انقله ليوم...</option>${[...Array(30)].map((_,d)=>`<option value="${d}">${dn(d)}</option>`).join('')}</select>`:''}`).join('')}</div>`;
 const ds=Object.keys(byd).map(Number).sort((a,b)=>a-b);
 return `<button style="margin-bottom:10px" onclick="tab='mat';render()">← رجوع لموادي</button><div class="c"><h2>📋 خطتي</h2>${L.length?`<p>${L.length} عنصر (منهم ${nv} هينزلوا من الأساتذة) هتخلّصهم في ${nd} يوم حسب سعتك في كل يوم.</p><small>اللي فوق بيتعمل الأول. ⏫ يخليه الأول، و↑ ↓ ينقلوه خطوة. المحاضرات 🆕 بتظهر في يوم نزولها أو بعده.</small>`:'<p>مفيش حاجة في الخطة دلوقتي.</p>'}</div>${ds.slice(0,7).map(dc).join('')}${ds.length>7?`<details class="c"><summary><b>باقي الأيام (${ds.length-7})</b></summary>${ds.slice(7).map(dc).join('')}</details>`:''}`}
function pmv(i,x){const a=S.po.slice(),j=x==-99?0:Math.max(0,Math.min(a.length-1,i+x)),k=a.splice(i,1)[0];a.splice(j,0,k);S.po=a;applyPlan();save();render()}
let AUD=null,WL=null,mvi=-1,barm=0;
const RINGS={classic:{type:'square',dur:.15,gap:.22,e:[988,1319,988,1319],s:[659,880,659,880]},bell:{type:'sine',dur:1.1,gap:.62,e:[1568,1245,988],s:[988,1245,1568]},chime:{type:'triangle',dur:.4,gap:.3,e:[1319,1568,1976,2349],s:[1047,1319,1568,1976]},soft:{type:'sawtooth',dur:.18,gap:.24,e:[220,220,220,220],s:[196,196,196,196]}};
const presetOf=k=>{const n=(S.rt&&S.rt[k])||'classic';return RINGS[n]||RINGS.classic};
function wsamp(type,ph){ph=ph-Math.floor(ph);if(type=='square')return ph<.5?1:-1;if(type=='sawtooth')return 2*ph-1;if(type=='triangle')return ph<.5?4*ph-1:3-4*ph;return Math.sin(2*Math.PI*ph)}
function setRing(k,v){S.rt=S.rt||{e:'classic',s:'classic'};S.rt[k]=v;save();stopTest()}
let alarmIv=null;
function startAlarm(k){stopAlarm();ring(k);alarmIv=setInterval(()=>ring(k),4200)}
function stopAlarm(){if(alarmIv){clearInterval(alarmIv);alarmIv=null}}
const bkb=()=>`<button class="pr" onclick="brk(S.bm||300)">ابدأ الراحة ☕ (${fd(S.bm||300)})</button>`;
function wav(secs,chs,sr){const n=Math.round(secs*sr),b=new Uint8Array(44+n),dv=new DataView(b.buffer),w=(o,t)=>{for(let i=0;i<t.length;i++)b[o+i]=t.charCodeAt(i)};
 w(0,'RIFF');dv.setUint32(4,36+n,true);w(8,'WAVEfmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,sr,true);dv.setUint32(28,sr,true);dv.setUint16(32,1,true);dv.setUint16(34,8,true);w(36,'data');dv.setUint32(40,n,true);
 b.fill(128,44);for(let i=44;i<b.length;i+=2)b[i]=129;const k=sr>=2400?1:.6;
 chs.forEach(c=>{const p=presetOf(c.k),arr=p[c.k],rep=arr.length*p.gap+p.dur+.3;for(let rp=0;rp<3;rp++)arr.forEach((f0,j)=>{const f=f0*k,s0=Math.round((c.at+rp*rep+j*p.gap)*sr),len=Math.round(p.dur*sr);for(let i=0;i<len&&s0+i<n;i++){const t=i/sr,v=wsamp(p.type,f*t);b[44+s0+i]=128+Math.round(v*127*Math.min(1,i/60)*Math.min(1,(len-i)/150))}})});
 return new Blob([b],{type:'audio/wav'})}
function startAud(sess,b){stopAud();if(NAT){nSched(sess>0?sess:b,sess>0?'ends3':'starts3',sess>0?'⏰ خلصت المذاكرة':'⏰ الراحة خلصت',sess>0?'وقت الراحة. افتح التطبيق':'يلا نبدأ مذاكرة');return}try{const ch=[],sr=(sess+b)>3600?1600:2400;if(sess>0)ch.push({at:sess,k:'e'});if(b>0)ch.push({at:sess+b,k:'s'});
 AUD=new Audio(URL.createObjectURL(wav(sess+b+11,ch,sr)));AUD.volume=1;AUD.onended=()=>stopAud();AUD.play().catch(()=>{});
 if('mediaSession' in navigator)navigator.mediaSession.metadata=new MediaMetadata({title:sess>0?'جلسة تركيز':'راحة',artist:'مذاكرتي'});
 navigator.wakeLock&&navigator.wakeLock.request('screen').then(x=>WL=x).catch(()=>{})}catch(e){}}
function stopAud(keepN){if(!keepN)nCancel();try{if(AUD){AUD.pause();AUD=null}if(WL){WL.release();WL=null}}catch(e){}}
function scd(d,v){S.cd=S.cd||Array(7).fill(S.cp||3);S.cd[d]=Math.max(0,+v||0);save()}
function capOf(d){let c=S.cd||Array(7).fill(S.cp||3);if(!c.some(x=>x>0))c=Array(7).fill(3);return c[new Date(add(T,d)+'T12:00').getDay()]}
const capAvg=()=>(S.cd||Array(7).fill(S.cp||3)).reduce((a,b)=>a+b,0)/7;
function applyPlan(){if(!S.po)return;const L=planItems();let d=0,ld=0,ch=0;
 L.forEach(o=>{if(o.rel>d){d=o.rel;ld=0}while(ld>=capOf(d)){d++;ld=0}o.day=d;ld++;if(!o.v){const nd=add(T,d);if('date' in o.x){if(o.x.date!==nd){o.x.date=nd;ch=1}}else if(o.x.d!==nd){o.x.d=nd;ch=1}}});
 if(ch)save();return L}
function pto(i,d){if(isNaN(d))return;const L=applyPlan(),k=S.po[i],a=S.po.filter((_,x)=>x!=i),j=L.findIndex((o,x)=>x!=i&&o.day>=d);a.splice(j<0?a.length:(j>i?j-1:j),0,k);S.po=a;mvi=-1;applyPlan();save();render()}
function bkx(){const t=JSON.stringify(S),e=$('bkp');e.value=t;e.select();try{navigator.clipboard.writeText(t).then(()=>{$('bkm').textContent='اتنسخت ✓ الصقها في مكان آمن'},()=>{$('bkm').textContent='انسخ النص اللي في الخانة بإيدك'})}catch(x){$('bkm').textContent='انسخ النص اللي في الخانة بإيدك'}}
function bki(){if(!barm){barm=1;$('bkm').textContent='ده هيمسح بياناتك الحالية. اضغط تاني للتأكيد';setTimeout(()=>{barm=0},5000);return}
 try{const o=JSON.parse($('bkp').value);if(!o||typeof o!=='object'||!Array.isArray(o.tasks))throw 0;S=normState(o);barm=0;save();render()}catch(e){$('bkm').textContent='النص مش سليم'}}
let CDB=null,CUID=null,cloudOn=false,cloudPending=true,cloudTimer=null,stUnsub=null;
function cloudPush(){if(!cloudOn||!CDB||!CUID)return;clearTimeout(cloudTimer);cloudTimer=setTimeout(()=>{CDB.doc('data/users/'+CUID+'/state').set(S).catch(()=>{})},1200)}
async function cloudInit(){
 try{
  if(!window.claude||!claude.use){cloudPending=false;return}
  const user=await claude.use('user'),db=await claude.use('db');
  if(!user||!db){cloudPending=false;return}
  const uid=await user.id();
  if(!uid){cloudPending=false;return}
  CDB=db;CUID=uid;
  const ref=db.doc('data/users/'+uid+'/state'),snap=await ref.get();
  if(snap.exists){const r=snap.data();
   if(r&&(!S.updatedAt||(r.updatedAt&&r.updatedAt>S.updatedAt))){S=normState(r);try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
  }else ref.set(Object.assign({},S,{updatedAt:Date.now()})).catch(()=>{});
  cloudOn=true;
  stUnsub=ref.onSnapshot(sn=>{
   if(!sn.exists||sn.metadata.hasPendingWrites)return;const r=sn.data();
   if(r&&r.updatedAt&&r.updatedAt>(S.updatedAt||0)){S=normState(r);if(S.seen&&tab=='wiz')tab='today';try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}render()}
  },e=>{if(e.code=='revoked')cloudOn=false});
  cloudPending=false;if(S.seen&&tab=='wiz')tab='today';render()
 }catch(e){cloudPending=false;render()}
}
function vRing(){
 const names={classic:'منبه ⏰',bell:'جرس 🛎',chime:'إكسيلوفون 🎐',soft:'نبضة رقمية 🔊'};
 const opt=(sel)=>Object.keys(RINGS).map(k=>`<option value="${k}" ${sel==k?'selected':''}>${names[k]}</option>`).join('');
 const rt=S.rt||{e:'classic',s:'classic'};
 return `<small>اختار نغمة نهاية المذاكرة، ونغمة نهاية الراحة. تقدر تخليهم واحدة زي بعض لو حبيت.</small>
 <div class="r"><div>نغمة خلاص المذاكرة</div><select onchange="setRing('e',this.value)">${opt(rt.e)}</select></div>
 <div class="row"><button onclick="playTest('b')">🔊 جرب</button></div>
 <div class="r"><div>نغمة خلاص الراحة</div><select onchange="setRing('s',this.value)">${opt(rt.s)}</select></div>
 <div class="row"><button onclick="playTest('s')">🔊 جرب</button></div>
 <div class="r"><div>الاهتزاز مع التنبيه</div><button class="ch" id="vibbtn" onclick="toggleVib()">${S.vib!==false?'📳 شغال':'🔕 مقفول'}</button></div>
 <small>لما المذاكرة أو الراحة تخلص، الرنة هتفضل شغالة زي المنبه لحد ما تدوس على زرار "ابدأ" أو "إغلاق".</small>`}
function toggleVib(){S.vib=S.vib===false?true:false;save();const b=$('vibbtn');if(b)b.textContent=S.vib!==false?'📳 شغال':'🔕 مقفول'}
function vSync(){
 return `<small>انسخ بياناتك واحفظها يدويًا، أو سيبها تتزامن أوتوماتيك بين أجهزتك لما تكون داخل بنفس حسابك.</small>
 <div class="r"><div>حالة المزامنة</div><small>${cloudPending?'بيتفحص...':(cloudOn?'✅ متزامن مع حسابك':'غير متاحة دلوقتي — بياناتك محفوظة على الجهاز بس')}</small></div>
 <textarea id="bkp" style="min-height:90px"></textarea><div class="row"><button onclick="bkx()">انسخ بياناتي</button><button onclick="bki()">استرجع من النص</button></div><small id="bkm"></small>`}
