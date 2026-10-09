
/* ===== بوابة الدعوة + لوحة المطور (Firebase) ===== */
const GATE=true; /* غيّرها لـ false عشان تقفل البوابة خالص */
const FBC={apiKey:"AIzaSyDzJrYztpeegyPy7c9F2T5ZnIsSYCATThY",authDomain:"eren-af986.firebaseapp.com",projectId:"eren-af986",storageBucket:"eren-af986.firebasestorage.app",messagingSenderId:"903287938956",appId:"1:903287938956:web:cda6d94f5f664d19c300a9"};
const ADM_UID='6NEqI6v1M4NLYULR9IK9e3bwTWM2',FBV='10.12.2',CODE_RE=/^MZK-[A-Z0-9]{4}-[A-Z0-9]{4}$/,ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
let ACT=null,ADMF=false,admLogin=false,admOn=false,GMSG='',glv=0,gtBusy=0,gtFail=0,gtLock=0,atp=0,atT=null,lastChk=Date.now();
try{const a=JSON.parse(localStorage.getItem('mzk_act'));if(a&&typeof a.c==='string'&&typeof a.u==='string')ACT=a}catch(e){}
try{ADMF=localStorage.getItem('mzk_adm')==='1'}catch(e){}
const ADM={codes:[],flt:'all',busy:0,err:'',nw:[],ed:'',del:''};
const gtOK=()=>!GATE||!!ACT||ADMF;
let FBMp=null,FBUp=null,FBAp=null;
function fbMods(){return FBMp||(FBMp=(async()=>{const b='https://www.gstatic.com/firebasejs/'+FBV+'/',[a,au,fs]=await Promise.all([import(b+'firebase-app.js'),import(b+'firebase-auth.js'),import(b+'firebase-firestore.js')]);return{a,au,fs}})().catch(e=>{FBMp=null;throw e}))}
async function mkApp(name){const m=await fbMods(),app=name?m.a.initializeApp(FBC,name):m.a.initializeApp(FBC);return{m,auth:m.au.getAuth(app),db:m.fs.initializeFirestore(app,{experimentalAutoDetectLongPolling:true})}}
function fbUser(){return FBUp||(FBUp=mkApp('').catch(e=>{FBUp=null;throw e}))}
function fbAdmin(){return FBAp||(FBAp=mkApp('admin').catch(e=>{FBAp=null;throw e}))}
const authReady=(m,auth)=>new Promise(r=>{let u=null;u=m.au.onAuthStateChanged(auth,x=>{try{u&&u()}catch(e){}r(x)})});
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2000)}
function ccopy(t,m){const ok=()=>toast(m||'اتنسخ ✓'),fb=()=>{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){}a.remove()};try{navigator.clipboard.writeText(t).then(ok,fb)}catch(e){fb()}}
const normCode=raw=>{let s=String(raw||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(s.startsWith('MZK'))s=s.slice(3);return s.length===8?'MZK-'+s.slice(0,4)+'-'+s.slice(4):''};
function genCode(){const a=new Uint8Array(8);crypto.getRandomValues(a);let s='';a.forEach(v=>s+=ALPH[v%32]);return 'MZK-'+s.slice(0,4)+'-'+s.slice(4)}

/* ---- العرض: البوابة / دخول المطور / لوحة المطور ---- */
function gater(){
 const nv=document.querySelector('nav');
 if(tab==='adm'&&!admOn)tab='today';
 const show=h=>{nv.style.display='none';$('v').innerHTML=h;paintHeader();return true};
 if(admLogin)return show(vAdmLogin());
 if(tab==='adm'&&admOn)return show(vAdm());
 if(DIS&&ACT)return show(vDis());
 if(!gtOK())return show(vGate());
 if(ACT&&(!USER||USER.code!==ACT.c))return show(vReg());
 nv.style.display='';return false}
const vGate=()=>`<div class="c" style="text-align:center;margin-top:30px"><div style="font-size:42px">🔑</div><h2>التطبيق بالدعوة</h2><p><small>اكتب كود الدعوة اللي وصلك عشان تبدأ.</small></p>${GMSG?`<p style="color:var(--am)"><b>${esc(GMSG)}</b></p>`:''}<input id="gcode" placeholder="MZK-XXXX-XXXX" autocapitalize="characters" autocomplete="off" spellcheck="false" style="text-align:center;font-family:monospace;letter-spacing:2px;direction:ltr" onkeydown="if(event.key==='Enter')gtGo()"><button class="pr" onclick="gtGo()">تفعيل</button><p id="gtm" style="min-height:22px"><small></small></p></div>`;
const vAdmLogin=()=>`<div class="c" style="margin-top:20px"><h2>🛠 دخول المطور</h2><input id="ae" type="email" placeholder="الإيميل" autocomplete="username" style="direction:ltr"><input id="ap" type="password" placeholder="الباسورد" autocomplete="current-password" style="direction:ltr" onkeydown="if(event.key==='Enter')admLoginGo()"><button class="pr" onclick="admLoginGo()">دخول</button><p id="am" style="min-height:22px;color:var(--bad)"></p><button style="width:100%" onclick="admLogin=false;render()">رجوع</button></div>`;
const vKey=()=>ACT?`<details class="c" ${glv?'open':''}><summary><b>🔑 كود الدعوة</b></summary><div class="r"><div>كودك</div><span class="cx">${esc(ACT.c)}</span></div><small>لو خرجت، التطبيق هيتقفل على الجهاز ده، والكود مش هيرجع متاح غير لما اللي إداك الكود يحرره. بياناتك هتفضل على الجهاز.</small><button class="bad" style="width:100%;margin-top:8px" onclick="gtLeave()">${glv?'متأكد؟ اضغط تاني':'🚪 خروج'}</button></details>`:'';

/* ---- تفعيل / خروج / فحص ---- */
async function claim(code){
 const U=await fbUser(),{au,fs}=U.m;
 let u=await authReady(U.m,U.auth);if(!u)u=(await au.signInAnonymously(U.auth)).user;
 const ref=fs.doc(U.db,'codes',code);
 const res=await fs.runTransaction(U.db,async tx=>{
  const s=await tx.get(ref);if(!s.exists())return 'no';
  const d=s.data();
  if(d.status==='used'&&d.uid===u.uid)return 'ok';
  if(d.status!=='free')return 'na';
  tx.update(ref,{status:'used',uid:u.uid,usedAt:fs.serverTimestamp(),lastSeen:fs.serverTimestamp()});
  return 'ok'});
 return{res,uid:u.uid}}
async function gtGo(){
 if(gtBusy)return;
 const say=t=>{const m=$('gtm');if(m)m.textContent=t},c=normCode($('gcode')&&$('gcode').value);
 if(!c){say('اكتب الكود زي ما وصلك (MZK-XXXX-XXXX).');return}
 if(Date.now()<gtLock){say('استنى شوية وحاول تاني.');return}
 if(navigator.onLine===false){say('محتاج نت عشان تفعّل الكود.');return}
 gtBusy=1;say('بيتحقق...');
 try{const r=await claim(c);
  if(r.res==='ok'){ACT={c,u:r.uid};try{localStorage.setItem('mzk_act',JSON.stringify(ACT));localStorage.setItem('mzk_hb',String(Date.now()))}catch(e){}GMSG='';gtFail=0;render();toast('اتفعّل ✓')}
  else{gtFail++;if(gtFail>=5){gtLock=Date.now()+6e4;gtFail=0}say(r.res==='no'?'الكود غلط.':'الكود ده مش متاح (مستخدم أو متوقف). كلّم اللي بعتهولك.')}
 }catch(e){say(e&&e.code==='permission-denied'?'الكود ده مش متاح.':'مقدرتش أوصل للسيرفر. اتأكد من النت وحاول تاني.')}
 gtBusy=0}
function gtClear(msg){msgStop();try{localStorage.removeItem('mzk_act');localStorage.removeItem('mzk_user');localStorage.removeItem('mzk_hb')}catch(e){}ACT=null;USER=null;GMSG=msg||'';
 fbUser().then(U=>U.m.au.signOut(U.auth)).catch(()=>{});render()}
async function gtLeave(){
 if(!glv){glv=1;render();setTimeout(()=>{if(glv){glv=0;render()}},4000);return}
 glv=0;
 if(navigator.onLine===false){toast('محتاج نت عشان تخرج');render();return}
 try{const U=await fbUser(),{au,fs}=U.m,u=await authReady(U.m,U.auth);
  if(u&&ACT&&u.uid===ACT.u)await fs.updateDoc(fs.doc(U.db,'codes',ACT.c),{status:'left',leftAt:fs.serverTimestamp()});
  if(u&&ACT&&u.uid===ACT.u)await selfPurge(U,u.uid);
  try{await au.signOut(U.auth)}catch(e){}
  gtClear('تم الخروج.')
 }catch(e){toast('مقدرتش أخرج. اتأكد من النت');render()}}
async function gtCheck(){
 if(!ACT||navigator.onLine===false)return;
 try{const U=await fbUser(),{fs}=U.m,u=await authReady(U.m,U.auth);if(!u||!ACT)return;
  const s=await fs.getDoc(fs.doc(U.db,'codes',ACT.c));if(!ACT)return;
  if(s.exists()&&s.data().status==='disabled'&&s.data().uid===ACT.u){if(!DIS){DIS=1;render()}return}
  if(DIS){DIS=0;render()}
  if(!s.exists()||s.data().status!=='used'||s.data().uid!==ACT.u){gtClear('الكود ده اتوقف أو اتحرر. لو محتاج تكمل كلّم اللي إداك الكود.');return}
  if(u.uid===ACT.u){let hb=0;try{hb=+localStorage.getItem('mzk_hb')||0}catch(e){}
   if(Date.now()-hb>72e6){await fs.updateDoc(fs.doc(U.db,'codes',ACT.c),{lastSeen:fs.serverTimestamp()});try{localStorage.setItem('mzk_hb',String(Date.now()))}catch(e){}}}
 }catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&(DIS||Date.now()-lastChk>36e5)){lastChk=Date.now();gtCheck()}});

/* ---- المطور: الحركة المخفية والدخول ---- */
function admTap(){atp++;clearTimeout(atT);atT=setTimeout(()=>{atp=0},2500);if(atp>=7){atp=0;admOpen()}}
async function admRestore(){
 if(!ADMF)return;
 try{const U=await fbAdmin(),u=await authReady(U.m,U.auth);
  if(u&&u.uid===ADM_UID){admOn=true;return}
  admOn=false;ADMF=false;try{localStorage.removeItem('mzk_adm')}catch(e){}render()
 }catch(e){}}
async function admOpen(){
 if(VIEW)return;
 if(!admOn&&ADMF){try{await admRestore()}catch(e){}}
 if(admOn){tab='adm';render();admLoad();return}
 admLogin=true;render()}
async function admLoginGo(){
 const e=($('ae').value||'').trim(),p=$('ap').value||'',say=t=>{const m=$('am');if(m)m.textContent=t};
 if(!e||!p)return;say('بيتحقق...');
 try{const U=await fbAdmin(),cr=await U.m.au.signInWithEmailAndPassword(U.auth,e,p);
  if(cr.user.uid!==ADM_UID){try{await U.m.au.signOut(U.auth)}catch(x){}throw{code:'x'}}
  ADMF=true;try{localStorage.setItem('mzk_adm','1')}catch(x){}
  admOn=true;admLogin=false;tab='adm';render();admLoad()
 }catch(x){say(x&&/network/.test(x.code||'')?'محتاج نت.':'بيانات غير صحيحة.')}}
async function admOut(){
 try{const U=await fbAdmin();await U.m.au.signOut(U.auth)}catch(e){}
 ADMF=false;admOn=false;try{localStorage.removeItem('mzk_adm')}catch(e){}
 tab='today';render()}

/* ---- لوحة المطور ---- */
const ST={free:['⚪','لسه مستخدمش','mu'],used:['🟢','مستخدم','ok'],left:['🚪','خرج','am'],disabled:['⛔','معطّل','bad']};
const zfdt=ms=>ms?new Date(ms).toLocaleString('ar-EG',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'—';
const zago=ms=>{if(!ms)return 'لسه';const m=Math.floor((Date.now()-ms)/6e4);if(m<2)return 'دلوقتي';if(m<60)return 'من '+m+' د';const h=Math.floor(m/60);return h<24?'من '+h+' س':'من '+Math.floor(h/24)+' يوم'};
async function admLoad(){
 ADM.busy=1;ADM.err='';
 try{const U=await fbAdmin(),{fs}=U.m,s=await fs.getDocs(fs.collection(U.db,'codes')),t=x=>x&&x.toMillis?x.toMillis():0;
  ADM.us={};try{const us=await fs.getDocs(fs.collection(U.db,'users'));us.docs.forEach(d=>{ADM.us[d.id]=d.data()})}catch(e){}
  ADM.codes=s.docs.filter(d=>CODE_RE.test(d.id)).map(d=>{const v=d.data();return{id:d.id,status:v.status||'free',uid:v.uid||'',label:v.label||'',createdAt:t(v.createdAt),usedAt:t(v.usedAt),lastSeen:t(v.lastSeen),leftAt:t(v.leftAt)}}).sort((a,b)=>b.createdAt-a.createdAt||a.id.localeCompare(b.id))
 }catch(e){ADM.err='مقدرتش أحمّل الأكواد. اتأكد من النت ومن قواعد Firestore.'}
 ADM.busy=0;if(tab==='adm'&&admOn)render()}
async function admGen(){
 const n=Math.max(1,Math.min(100,Math.floor(+$('agn').value||0))),lb=($('agl').value||'').trim().slice(0,60);
 try{const U=await fbAdmin(),{fs}=U.m,b=fs.writeBatch(U.db),have=new Set(ADM.codes.map(c=>c.id)),nw=[];
  while(nw.length<n){const c=genCode();if(have.has(c)||nw.includes(c))continue;nw.push(c);b.set(fs.doc(U.db,'codes',c),{status:'free',uid:'',label:lb,createdAt:fs.serverTimestamp()})}
  await b.commit();ADM.nw=nw;toast('اتعملوا '+n+' كود ✓');await admLoad()
 }catch(e){ADM.err='فشل عمل الأكواد. اتأكد من النت.';render()}}
async function admAct(id,a){
 if(!CODE_RE.test(id))return;
 {const c1=ADM.codes.find(x=>x.id===id)||{};if(a==='rel'&&c1.uid){if(ADM.rl!==id){ADM.rl=id;render();setTimeout(()=>{if(ADM.rl===id){ADM.rl='';render()}},4000);return}ADM.rl=''}}
 if(a==='del'){if(ADM.del!==id){ADM.del=id;render();setTimeout(()=>{if(ADM.del===id){ADM.del='';render()}},4000);return}ADM.del=''}
 try{const U=await fbAdmin(),{fs}=U.m,ref=fs.doc(U.db,'codes',id);
  const c0=ADM.codes.find(x=>x.id===id)||{};
  if((a==='rel'||a==='del')&&c0.uid)await admPurge(U,c0.uid);
  if(a==='del')await fs.deleteDoc(ref);
  else if(a==='dis')await fs.updateDoc(ref,{status:'disabled'});
  else if(a==='ena')await fs.updateDoc(ref,{status:'used'});
  else if(a==='rel')await fs.updateDoc(ref,{status:'free',uid:'',usedAt:null,lastSeen:null,leftAt:null});
  await admLoad()
 }catch(e){ADM.err='فشلت العملية. اتأكد من النت.';render()}}
async function admEs(id){
 if(!CODE_RE.test(id))return;const v=($('ael').value||'').trim().slice(0,60);
 try{const U=await fbAdmin();await U.m.fs.updateDoc(U.m.fs.doc(U.db,'codes',id),{label:v});ADM.ed='';await admLoad()}catch(e){ADM.err='فشل الحفظ.';render()}}
function admSh(id){const t='كود دعوة تطبيق مذاكرتي: '+id;if(navigator.share)navigator.share({text:t}).catch(()=>{});else ccopy(t,'اتنسخ، الصقه في واتساب')}
function admCopyFree(){const f=ADM.codes.filter(c=>c.status==='free').map(c=>c.id);if(f.length)ccopy(f.join('\n'),'اتنسخ '+f.length+' كود ✓')}
function vAdm(){
 const A=ADM.codes,cn=s=>A.filter(c=>c.status===s).length,now=Date.now(),
  act=A.filter(c=>c.status==='used'&&c.lastSeen&&now-c.lastSeen<6048e5).length,
  fl=ADM.flt==='all'?A:A.filter(c=>c.status===ADM.flt),
  tile=(v,l,col)=>`<div><b ${col?`style="color:var(--${col})"`:''}>${v}</b><small>${l}</small></div>`,
  chips=[['all','الكل '+A.length],['free','لسه '+cn('free')],['used','مستخدم '+cn('used')],['left','خرج '+cn('left')],['disabled','معطّل '+cn('disabled')]];
 const row=c=>{const s=ST[c.status]||ST.free,
   info=c.status==='free'?'اتعمل '+zfdt(c.createdAt):c.status==='left'?'اتفعّل '+zfdt(c.usedAt)+' • خرج '+zfdt(c.leftAt):'اتفعّل '+zfdt(c.usedAt)+' • آخر ظهور '+zago(c.lastSeen),
   b=(t,a,cls)=>`<button ${cls?`class="${cls}"`:''} onclick="admAct('${c.id}','${a}')">${t}</button>`,
   acts=[(c.status==='free'||c.status==='used')?b('⛔ تعطيل','dis'):'',c.status==='disabled'?b('✅ تفعيل','ena'):'',c.status!=='free'?b(ADM.rl===c.id?'متأكد؟ هيمسح حساب صاحبه':'♻️ تحرير','rel'):'',b(ADM.del===c.id?'متأكد؟ اضغط تاني':'🗑 حذف','del','bad')].join('');
  const pu=(ADM.us||{})[c.uid];
  return `<div class="r" style="display:block"><div onclick="admSel('${c.id}')" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;cursor:pointer"><span class="cx">${c.id}</span>${pu?`<b>${esc(pu.name||'')}</b>`:''}<span class="bdg" style="color:var(--${s[2]})">${s[0]} ${s[1]}</span><small>${ADM.sel===c.id?'▲':'▼'}</small></div>${ADM.sel===c.id?vDet(c):''}${ADM.ed===c.id?`<div class="row"><input id="ael" value="${esc(c.label)}" placeholder="ملاحظة" style="flex:1;margin:0"><button class="pr" style="width:auto" onclick="admEs('${c.id}')">حفظ</button></div>`:(c.label?`<div><b>${esc(c.label)}</b></div>`:'')}<small>${info}</small><div class="rowb"><button onclick="ccopy('${c.id}')">📋 نسخ</button><button onclick="admSh('${c.id}')">📤 مشاركة</button><button onclick="ADM.ed=ADM.ed==='${c.id}'?'':'${c.id}';render()">✏️</button>${acts}</div></div>`};
 return `<button style="margin-bottom:10px" onclick="tab='today';render()">← رجوع للتطبيق</button>
 <div class="c"><h2>🛠 لوحة المطور</h2><div class="g3">${tile(A.length,'إجمالي الأكواد')}${tile(cn('used'),'مستخدم','ok')}${tile(cn('free'),'لسه مستخدمش')}${tile(cn('left'),'خرج','am')}${tile(cn('disabled'),'معطّل','bad')}${tile(act,'نشط آخر 7 أيام','pr')}</div>${ADM.err?`<p style="color:var(--bad)">${esc(ADM.err)}</p>`:''}<div class="row"><button style="flex:1" onclick="admLoad()">🔄 تحديث</button></div></div>
 <div class="c"><b>➕ اعمل أكواد جديدة</b><div class="row"><input id="agn" type="number" min="1" max="100" value="5" style="width:90px;margin:0"><input id="agl" placeholder="ملاحظة (اختياري)" style="flex:1;margin:0"></div><button class="pr" onclick="admGen()">اعمل الأكواد</button>${ADM.nw.length?`<textarea readonly style="margin-top:8px;direction:ltr;font-family:monospace">${ADM.nw.join('\n')}</textarea><button style="width:100%" onclick="ccopy(ADM.nw.join('\\n'))">📋 نسخ الأكواد الجديدة</button>`:''}</div>
 <div class="c"><b>🔑 الأكواد</b><div class="row">${chips.map(([k,n])=>`<button class="ch ${ADM.flt==k?'on':''}" onclick="ADM.flt='${k}';render()">${n}</button>`).join('')}</div>${cn('free')?`<button style="width:100%;margin-bottom:6px" onclick="admCopyFree()">📋 نسخ كل الأكواد المتاحة (${cn('free')})</button>`:''}${ADM.busy?'<p><small>بيحمّل...</small></p>':''}${fl.map(row).join('')||'<p><small>مفيش أكواد هنا.</small></p>'}</div>
 ${vOrph()}
 <button class="bad" style="width:100%" onclick="admOut()">🚪 تسجيل خروج المطور</button>`}
/* ---- أسماء محجوزة ومفيش حد فيها ---- */
async function admOrphScan(){
 if(ADM.busy||!ADM.codes.length){ADM.orphm='دوس تحديث الأول عشان الأكواد تتحمّل.';render();return}
 try{
  const U=await fbAdmin(),{fs}=U.m,s=await fs.getDocs(fs.collection(U.db,'usernames')),
   keep=new Set(ADM.codes.filter(c=>(c.status==='used'||c.status==='disabled')&&c.uid).map(c=>c.uid));
  ADM.orph=s.docs.map(d=>d.data()).filter(x=>x&&x.uid&&!keep.has(x.uid)).map(x=>({u:x.username,uid:x.uid}));ADM.orphm=''
 }catch(e){ADM.orphm='فشل الفحص. اتأكد من النت.'}
 render()}
async function admOrphFree(){
 if(!ADM.orph||!ADM.orph.length)return;
 try{
  const U=await fbAdmin(),{fs}=U.m;
  for(const o of ADM.orph){await admPurge(U,o.uid);try{await fs.deleteDoc(fs.doc(U.db,'usernames',o.u))}catch(e){}}
  toast('اتحرر '+ADM.orph.length+' اسم ✓');ADM.orph=null;ADM.orphm=''
 }catch(e){ADM.orphm='فشل التحرير. اتأكد من النت.'}
 render()}
function vOrph(){
 const o=ADM.orph;
 return `<div class="c"><b>🧹 أسماء محجوزة ومفيش حد فيها</b><p><small>أي username صاحبه كوده اتحرر أو اتمسح. التعطيل مش بيتحسب.</small></p>${ADM.orphm?`<p style="color:var(--bad)">${esc(ADM.orphm)}</p>`:''}<button style="width:100%" onclick="admOrphScan()">🔍 افحص</button>${o?(o.length?`<p>لقيت <b>${o.length}</b>:</p><p class="cx" style="white-space:normal">${o.map(x=>'@'+esc(x.u)).join(' ')}</p><button class="pr" onclick="admOrphFree()">حرّر الكل (${o.length})</button>`:'<p>✅ مفيش أسماء يتيمة.</p>'):''}</div>`}
/* ---- مراقبة مستخدم (قراءة فقط) ---- */
async function admSel(id){
 if(ADM.sel===id){ADM.sel='';ADM.v=null;render();return}
 ADM.sel=id;ADM.v=null;ADM.vm='';
 const c=ADM.codes.find(x=>x.id===id);
 if(!c||!c.uid){render();return}
 render();
 try{
  const U=await fbAdmin(),{fs}=U.m,fr=await fs.getDocs(fs.query(fs.collection(U.db,'friendships'),fs.where('m','array-contains',c.uid)));
  ADM.v={uid:c.uid,frs:fr.docs.map(d=>Object.assign({id:d.id},d.data())),cv:null,ms:[]}
 }catch(e){ADM.vm='مقدرتش أحمّل الأصحاب.'}
 if(ADM.sel===id)render()}
async function admConv(id){
 try{
  const U=await fbAdmin(),{fs}=U.m,s=await fs.getDocs(fs.query(fs.collection(U.db,'friendships',id,'messages'),fs.orderBy('createdAt','desc'),fs.limit(200)));
  ADM.v.cv=id;ADM.v.ms=s.docs.map(d=>d.data()).reverse()
 }catch(e){ADM.vm='مقدرتش أفتح المحادثة'}
 render()}
function vDet(c){
 if(!c.uid)return '<div class="c" style="background:var(--bg);margin-top:8px"><small>الكود لسه محدش استخدمه.</small></div>';
 const p=(ADM.us||{})[c.uid],v=ADM.v&&ADM.v.uid===c.uid?ADM.v:null,stl={pending:'⏳ طلب معلّق',accepted:'✅ أصحاب',blocked:'🚫 محظور'};
 let h='<div class="c" style="background:var(--bg);margin-top:8px">';
 h+=p?`<div class="r"><div>الاسم</div><b>${esc(p.name||'')}</b></div><div class="r"><div>العمر</div><span>${esc(p.age||'')} سنة</span></div><div class="r"><div>المرحلة</div><span>${esc(p.stage||'')} • ${esc(p.grade||'')}</span></div>${p.system?`<div class="r"><div>النظام</div><span>${esc(p.system)}</span></div>`:''}${p.branch?`<div class="r"><div>الشعبة / المسار</div><span>${esc(p.branch)}</span></div>`:''}<div class="r"><div>Username</div><span class="cx">@${esc(p.username||'')}</span></div>`:'<p><small>الشخص ده لسه ما سجّلش بياناته.</small></p>';
 h+=`<button class="pr" style="margin-top:8px" onclick="admEnter('${esc(c.uid)}','${esc(p&&p.username||'')}')">👁 ادخل الحساب (مشاهدة فقط)</button>${ADM.vm?`<p style="color:var(--bad)"><small>${esc(ADM.vm)}</small></p>`:''}`;
 if(v){
  h+=`<p><b>الأصحاب والمحادثات (${v.frs.length})</b></p>`;
  h+=v.frs.map(f=>{const mine=f.from===v.uid,ou=mine?f.ut:f.uf,on=mine?f.nt:f.nf;
   return `<div class="r" style="display:block"><div><b>${esc(on||'')} @${esc(ou||'')}</b> <span class="bdg">${stl[f.status]||esc(f.status)}</span></div><div class="rowb"><button onclick="admConv('${esc(f.id)}')">📖 افتح الرسايل</button></div>${v.cv===f.id?`<div class="c" style="margin-top:8px;max-height:340px;overflow-y:auto">${v.ms.length?v.ms.map(m=>`<p style="white-space:pre-wrap;word-break:break-word"><b>${m.from===v.uid?'هو':'@'+esc(ou||'')}</b> <small>${zfdt(tms(m.createdAt))}${m.read?' ✓✓':' ✓'}</small><br>${esc(m.text)}</p>`).join(''):'<small>مفيش رسايل.</small>'}</div>`:''}</div>`}).join('')||'<p><small>مفيش أصحاب.</small></p>'
 }
 return h+'</div>'}
/* ---- وضع المشاهدة: بيفتح التطبيق ببيانات الطالب، ومفيش حاجة بتتحفظ ولا بتتعدّل ---- */
var VIEW=0,VBK=null,VU='';
let fsT=null;
function fsPush(){
 if(VIEW||!USER||!ACT)return;
 clearTimeout(fsT);
 fsT=setTimeout(async()=>{
  try{
   const U=await fbUser(),{fs}=U.m,u=await authReady(U.m,U.auth);
   if(!u||!USER||u.uid!==USER.uid)return;
   const data=JSON.stringify(S);if(data.length>900000)return;
   await fs.setDoc(fs.doc(U.db,'states',u.uid),{data,updatedAt:fs.serverTimestamp()})
  }catch(e){}
 },3000)}
async function admEnter(uid,un){
 try{
  const U=await fbAdmin(),{fs}=U.m,s=await fs.getDoc(fs.doc(U.db,'states',uid));
  if(!s.exists()){toast('الطالب لسه ما رفعش بياناته. لازم يفتح التطبيق مرة.');return}
  const st=normState(JSON.parse(s.data().data));
  const frs=await fs.getDocs(fs.query(fs.collection(U.db,'friendships'),fs.where('m','array-contains',uid)));
  FR=frs.docs.map(d=>Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))); ME=uid; MSG_ON=true;
  CH=null;CHM=[];stopConv();
  stopTest();clearInterval(iv);iv=null;clearInterval(swIv);swIv=null;
  VBK={S,run,ME,FR,MSG_ON};VIEW=1;VU=un;S=st;run=null;Q=null;dk=0;ME=uid;FR=[];MSG_ON=true;try{const fq=fs.query(fs.collection(U.db,'friendships'),fs.where('m','array-contains',uid)),fsn=await fs.getDocs(fq);FR=fsn.docs.map(d=>Object.assign({id:d.id},d.data()))}catch(e){}tab='today';applyTheme();render()
 }catch(e){toast('مقدرتش أفتح الحساب')}}
function admExit(){
 if(!VIEW)return;
 VIEW=0;clearInterval(swIv);swIv=null;clearInterval(iv);iv=null;
 if(VBK){S=VBK.S;run=VBK.run;ME=VBK.ME;FR=VBK.FR||[];MSG_ON=VBK.MSG_ON||false}
 VBK=null;Q=null;dk=0;applyTheme();tab='adm';render();admLoad()}
const vwBanner=()=>`<div id="vwb" class="c warn" style="position:sticky;top:52px;z-index:6;padding:8px 12px;display:flex;align-items:center;gap:8px"><div style="flex:1"><b>👁 وضع المشاهدة</b> <small>@${esc(VU)} • مفيش حاجة بتتحفظ</small></div><button class="bad" onclick="admExit()">خروج ✕</button></div>`;
['click','change','input'].forEach(ev=>document.addEventListener(ev,e=>{
 if(!VIEW)return;
 const t=e.target;if(!t||!t.closest||t.closest('nav,header,#vwb,summary'))return;
 const el=t.closest('button,input,select,textarea,label');if(!el)return;
 if(el.tagName==='BUTTON'&&/^(sub=|tab=|dk=|lf=|stopTest\(\);tab=|closeChat\(\))/ .test(el.getAttribute('onclick')||''))return;
 e.stopPropagation();e.preventDefault()},true));
