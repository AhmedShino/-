/* ===== الستوب ووتش (عدّاد تصاعدي) ===== */
let swsv='',swIv=null,gcu=0,ged=0,lgm=-1;
const swEl=()=>S.sw?(S.sw.acc+(S.sw.p?0:Date.now()-S.sw.st)):0;
function swRun(){clearInterval(swIv);swIv=setInterval(swTick,500)}
function swRel(){try{if(WL){WL.release();WL=null}}catch(e){}}
function swGo(){if(run||S.sw)return;stopAlarm();stopTest();fmsg='';
 S.sw={st:Date.now(),acc:0,p:0,s:swsv,d:day()};lgm=-1;save();swRun();
 try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(x=>WL=x).catch(()=>{})}catch(e){}
 render()}
function swPz(){const w=S.sw;if(!w)return;if(w.p){w.st=Date.now();w.p=0}else{w.acc+=Date.now()-w.st;w.p=1}save();render()}
function swEnd(){const w=S.sw;if(!w)return;const el=swEl()/1e3;clearInterval(swIv);swIv=null;S.sw=null;lgm=-1;swRel();
 let sv=0;if(el>=MIN_REC){S.sess.push({d:w.d||day(),min:Math.max(1,Math.round(el/60)),s:w.s||''});if(S.sess.length>500)S.sess=S.sess.slice(-500);sv=1}
 fmsg=(sv?`✅ خلصت. ذاكرت ${fd(el)} واتسجلت في إحصائياتك.`:`✅ خلصت. الجلسة قصيرة أوي (أقل من ${MIN_REC} ثانية) ومتسجلتش في إحصائياتك.`)+' جاهز للراحة؟ '+bkb();
 save();render()}
function swTick(){if(!S.sw){clearInterval(swIv);swIv=null;return}
 const el=swEl()/1e3,e=$('tm');if(e)e.textContent=fmt(Math.floor(el));
 const p=$('pr');if(p)p.style.strokeDashoffset=RC*(1-(el%3600)/3600);
 const gm=Math.floor(el/60);if(gm!==lgm){lgm=gm;const g=$('gc');if(g&&!ged&&!gcu)g.innerHTML=goalInner()}}
function vSw(){const w=S.sw,el=swEl()/1e3,fr=(el%3600)/3600;
 return `<div class="c" style="text-align:center"><div style="position:relative;width:200px;height:200px;margin:0 auto"><svg width="200" height="200" viewBox="0 0 200 200" style="transform:rotate(-90deg)"><circle cx="100" cy="100" r="90" fill="none" stroke="var(--bd)" stroke-width="12"/><circle id="pr" cx="100" cy="100" r="90" fill="none" stroke="var(--pr)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${RC}" stroke-dashoffset="${RC*(1-fr)}" style="transition:stroke-dashoffset .3s linear"/></svg><div class="big" id="tm" style="font-size:36px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${fmt(Math.floor(el))}</div></div><p style="text-align:center"><small>${w.p?'متوقف مؤقتاً ⏸':'⏱ عدّاد مفتوح • '+(w.s?esc(w.s):'مذاكرة حرة')}</small></p><div class="row"><button class="pr" style="flex:1" onclick="swPz()">${w.p?'▶ إكمال':'⏸ إيقاف مؤقت'}</button><button class="pr" style="flex:1" onclick="swEnd()">✅ انتهيت</button></div></div>`}
function swStartUI(){const ks=Object.keys(S.sb||{});if(swsv&&!ks.includes(swsv))swsv='';
 return `<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--bd)"><small>أو ذاكر من غير مدة محددة:</small>${ks.length?`<select onchange="swsv=this.value" style="margin-top:6px"><option value="">مذاكرة حرة</option>${ks.map(k=>`<option value="${esc(k)}" ${swsv==k?'selected':''}>${esc(k)}</option>`).join('')}</select>`:''}<button class="sec" style="margin-top:6px" onclick="swGo()">⏱ مذاكرة حرة (عدّاد تصاعدي)</button></div>`}
