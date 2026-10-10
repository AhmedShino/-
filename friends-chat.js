
/* ===== الأصحاب والرسائل ===== */
let ME='',MSG_ON=false,FR=[],frUnsub=null,frFirst=true,CH=null,CHM=[],chUnsub=null,tyUnsub=null,tyShow=0,tyTimer=null,lastTy=0,msgBusy=0,MS=null,fcf='',sendLock=0,scr=0;
let LR={};try{LR=JSON.parse(localStorage.getItem('mzk_lr')||'{}')||{}}catch(e){}
const saveLR=()=>{try{localStorage.setItem('mzk_lr',JSON.stringify(LR))}catch(e){}};
const tms=v=>v&&v.toMillis?v.toMillis():(+v||0);
const pairId=(a,b)=>a<b?a+'_'+b:b+'_'+a;
const peer=f=>f.from===ME?{uid:f.to,u:f.ut,n:f.nt}:{uid:f.from,u:f.uf,n:f.nf};
const pname=f=>{const p=peer(f);return p.n?esc(p.n):'@'+esc(p.u)};
const lastMs=f=>tms(f.lastAt);
const unr=f=>f.status==='accepted'&&f.lastBy&&f.lastBy!==ME&&lastMs(f)>(LR[f.id]||0);
const hmt=ms=>ms?new Date(ms).toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'}):'';
async function fbx(){const U=await fbUser();return{U,fs:U.m.fs}}
function paintNav(){const n=FR.filter(unr).length+FR.filter(f=>f.status==='pending'&&f.to===ME).length+(typeof GR!=='undefined'?GR.filter(grUnread).length:0),b=document.querySelector('nav button[data-t=chat]');if(b)b.textContent=n?'الأصحاب ('+n+')':'الأصحاب'}
async function msgInit(){
 if(MSG_ON||!USER||!ACT)return;
 try{
  const U=await fbUser(),{fs}=U.m,u=await authReady(U.m,U.auth);
  if(!u||!USER||u.uid!==USER.uid||MSG_ON)return;
  ME=u.uid;frFirst=true;
  const q=fs.query(fs.collection(U.db,'friendships'),fs.where('m','array-contains',ME));
  frUnsub=fs.onSnapshot(q,sn=>{
   FR=sn.docs.map(d=>Object.assign({id:d.id},d.data({serverTimestamps:'estimate'})));
   if(!frFirst)sn.docChanges().forEach(c=>{
    if(c.doc.metadata.hasPendingWrites)return;
    const f=Object.assign({id:c.doc.id},c.doc.data());
    if(c.type==='added'&&f.status==='pending'&&f.to===ME)toast('👋 طلب صداقة جديد من @'+f.uf);
    else if(c.type==='modified'&&f.status==='accepted'&&f.lastBy&&f.lastBy!==ME&&(CH!==f.id||document.hidden))toast('💬 رسالة جديدة من @'+peer(f).u)});
   frFirst=false;paintNav();
   if(CH&&!FR.some(f=>f.id===CH&&f.status==='accepted')){closeChat();return}
   if(tab==='chat'&&!CH)paintFr()
  },e=>{});
  MSG_ON=true;groupInit();if(tab==='chat')render()
 }catch(e){}}
function msgStop(){try{frUnsub&&frUnsub();stopConv();groupStop()}catch(e){}frUnsub=null;MSG_ON=false;GR_ON=0;GR=[];FR=[];CH=null;GR_SEL='';CHM=[];ME='';MS=null;paintNav()}
function vChat(){
 if(!USER&&!VIEW)return '<div class="c"><p><small>لازم تفعّل الكود وتسجّل بياناتك الأول.</small></p></div>';
 if(!MSG_ON&&!VIEW)return '<div class="c"><p><small>بيتصل بالسيرفر... لو فضل كده اتأكد من النت.</small></p></div>';
 if(GR_SEL)return vGroups();
 if(CH)return vConv();
 return `<div class="friends-page"><div class="friends-toolbar"><div class="friends-title"><h2>الأصحاب</h2><small>محادثاتك وأصحابك في مكان واحد</small></div><button class="friends-add" onclick="toggleFriendTools()" aria-label="إضافة صديق أو إنشاء جروب">＋</button></div><div id="friend-tools" class="c friend-tools" style="display:${FR_TOOLS?'block':'none'}"><div class="row" style="margin:0;flex-wrap:nowrap"><input id="msq" placeholder="ابحث باسم المستخدم" autocapitalize="none" autocomplete="off" spellcheck="false" style="direction:ltr;margin:0" onkeydown="if(event.key==='Enter')msearch()"><button class="pr" style="width:auto;min-width:68px" onclick="msearch()">بحث</button></div><div id="msr"></div><button class="secondary" style="width:100%;margin-top:8px" onclick="openGroupCreate()">＋ إنشاء جروب</button></div><div id="frl">${vFriendRequests()}</div><div id="conv-list">${vUnifiedConversations()}</div></div>`}
let FR_TOOLS=0;
function toggleFriendTools(){FR_TOOLS=FR_TOOLS?0:1;const e=$('friend-tools');if(e)e.style.display=FR_TOOLS?'block':'none';if(FR_TOOLS){const q=$('msq');if(q)q.focus()}}
function vFriendRequests(){const inc=FR.filter(f=>f.status==='pending'&&f.to===ME),out=FR.filter(f=>f.status==='pending'&&f.from===ME),bl=FR.filter(f=>f.status==='blocked'&&f.blockedBy===ME);let h='';if(inc.length)h+=`<div class="c warn friend-requests"><h2>📨 طلبات الصداقة <span class="unread-dot">${inc.length}</span></h2>${inc.map(f=>`<div class="r"><div class="avatar" style="width:38px;height:38px">${avLetter(f)}</div><div style="flex:1;min-width:0"><b>${pname(f)}</b><small style="display:block">@${esc(peer(f).u)}</small></div><button class="ok" onclick="frAcc('${esc(f.id)}')">قبول</button><button class="bad" onclick="frDel('${esc(f.id)}')">رفض</button></div>`).join('')}</div>`;if(out.length)h+=`<details class="c"><summary><b>طلبات مرسلة (${out.length})</b></summary>${out.map(f=>`<div class="r"><div style="flex:1"><b>@${esc(peer(f).u)}</b></div><button class="x" onclick="frDel('${esc(f.id)}')">إلغاء</button></div>`).join('')}</details>`;if(bl.length)h+=`<details class="c"><summary><b>المحظورون (${bl.length})</b></summary>${bl.map(f=>`<div class="r"><div style="flex:1"><b>${pname(f)}</b></div><button onclick="frUnb('${esc(f.id)}')">فك الحظر</button></div>`).join('')}</details>`;return h}
function vUnifiedConversations(){const activeFriends=FR.filter(f=>f.status==='accepted').map(f=>({kind:'dm',id:f.id,at:lastMs(f),data:f}));const activeGroups=(GR||[]).map(g=>({kind:'group',id:g.id,at:tms(g.lastAt||g.createdAt),data:g}));const archived=[];const seen=new Set();(GA||[]).slice().sort((a,b)=>tms(b.archivedAt)-tms(a.archivedAt)).forEach(a=>{const k=a.groupId||a.id;if(!seen.has(k)){seen.add(k);if(!(typeof HIDDEN_GROUP_ARCHIVES!=='undefined'&&HIDDEN_GROUP_ARCHIVES.includes(a.id)))archived.push({kind:'archive',id:a.id,at:tms(a.archivedAt),data:a})}});const all=activeFriends.concat(activeGroups,archived).sort((a,b)=>b.at-a.at);return `<div class="c friends-card unified-list"><div class="friends-head"><b>المحادثات</b><small>${all.length} محادثة</small></div>${all.map(x=>{if(x.kind==='dm'){const f=x.data,p=peer(f),un=unr(f),preview=f.lastText||(f.lastBy?(f.lastBy===ME?'أنت أرسلت رسالة':'رسالة جديدة'):'ابدأوا المحادثة 👋');return `<div class="friend-row" onclick="openChat('${esc(f.id)}')"><div class="avatar">${avLetter(f)}</div><div class="friend-main"><div class="friend-name"><b>${pname(f)}</b>${un?'<span class="unread-dot">جديد</span>':''}</div><small class="friend-preview">${esc(preview)}</small></div><div class="friend-meta">${fTime(f)}</div></div>`}if(x.kind==='group'){const g=x.data;return `<div class="friend-row" onclick="openGroup('${esc(g.id)}')"><div class="group-avatar">${gLetter(g)}</div><div class="friend-main"><div class="friend-name"><b>${esc(g.name||'جروب بدون اسم')}</b>${gUnread(g)?'<span class="unread-dot">جديد</span>':''}</div><small class="friend-preview">${esc(g.lastText||'جروب • ابدأوا المذاكرة 👋')}</small></div><div class="friend-meta">${g.lastAt?hmt(tms(g.lastAt)):''}</div></div>`}const a=x.data;return `<div class="friend-row archived-row" onclick="openArchive('${esc(a.id)}')"><div class="group-avatar archived-avatar">👥</div><div class="friend-main"><div class="friend-name"><b>${esc(a.groupName||'جروب قديم')}</b><span class="left-badge">${a.reason==='removed'?'تمت إزالتك':'غادرت'}</span></div><small class="friend-preview">${a.reason==='removed'?'تمت إزالتك من هذه المجموعة.':'أنت غادرت هذه المجموعة.'}</small></div><div class="friend-meta">${a.archivedAt?hmt(tms(a.archivedAt)):''}</div></div>`}).join('')||'<div class="empty-group">لسه مفيش محادثات. ابحث عن صديق أو أنشئ جروب جديد.</div>'}<button class="secondary" style="width:100%;margin-top:8px" onclick="openArchives()">📦 عرض أرشيف الجروبات (${GA.length})</button></div>`}
function paintFr(){const e=$('frl');if(e)e.innerHTML=vFriendRequests();const c=$('conv-list');if(c&&!CH&&!GR_SEL)c.innerHTML=vUnifiedConversations()}
const rfr=()=>CH?render():paintFr();
const avLetter=f=>{const p=peer(f);return String(p.n||p.u||'?').trim().charAt(0).toUpperCase()||'?'};
const fTime=f=>{const ms=lastMs(f);if(!ms)return '';const d=new Date(ms),now=new Date();return d.toDateString()===now.toDateString()?hmt(ms):d.toLocaleDateString('ar-EG',{day:'numeric',month:'short'})};
function vFr(){
 const inc=FR.filter(f=>f.status==='pending'&&f.to===ME),out=FR.filter(f=>f.status==='pending'&&f.from===ME),ac=FR.filter(f=>f.status==='accepted').sort((a,b)=>lastMs(b)-lastMs(a)),bl=FR.filter(f=>f.status==='blocked'&&f.blockedBy===ME),cq=(k,t,t2)=>fcf===k?t2:t;
 let h='';
 if(inc.length)h+=`<div class="c warn"><h2>📨 طلبات صداقة (${inc.length})</h2>${inc.map(f=>`<div class="r"><div class="avatar" style="width:38px;height:38px">${avLetter(f)}</div><div><b>${pname(f)}</b><small>@${esc(peer(f).u)}</small></div><button class="ok" onclick="frAcc('${esc(f.id)}')">قبول</button><button class="bad" onclick="frDel('${esc(f.id)}')">${cq('d'+f.id,'رفض','متأكد؟')}</button></div>`).join('')}</div>`;
 h+=`<div class="c friends-card"><div class="friends-head"><h2 style="margin:0">💬 الأصحاب <small style="font-weight:400">${ac.length}</small></h2></div>${ac.map(f=>{const p=peer(f),un=unr(f),preview=f.lastText||(f.lastBy?(f.lastBy===ME?'أنت أرسلت رسالة':'رسالة جديدة'):'ابدأوا المحادثة 👋');return `<div class="friend-row" onclick="openChat('${esc(f.id)}')"><div class="avatar">${avLetter(f)}</div><div class="friend-main"><div class="friend-name"><b>${pname(f)}</b>${un?'<span class="unread-dot">جديد</span>':''}</div><small class="friend-preview">${esc(preview)}</small></div><div class="friend-meta">${fTime(f)}<br>${un?'●':''}</div></div>`}).join('')||'<div style="padding:18px;text-align:center"><div style="font-size:34px">👥</div><b>لسه مفيش أصحاب</b><small style="display:block;margin-top:4px">دوّر بالـ username وابعت طلب صداقة.</small></div>'}</div>`;
 if(out.length)h+=`<details class="c"><summary><b>طلبات مستنية رد (${out.length})</b></summary>${out.map(f=>`<div class="r"><div><b>@${esc(peer(f).u)}</b></div><button class="x" onclick="frDel('${esc(f.id)}')">${cq('d'+f.id,'إلغاء','متأكد؟')}</button></div>`).join('')}</details>`;
 if(bl.length)h+=`<details class="c"><summary><b>المحظورين (${bl.length})</b></summary>${bl.map(f=>`<div class="r"><div><b>${pname(f)}</b></div><button onclick="frUnb('${esc(f.id)}')">فك الحظر</button></div>`).join('')}</details>`;
 return h}
async function msearch(){
 const r=$('msr');if(!r)return;
 const u=($('msq').value||'').trim().replace(/^@/,'').toLowerCase();
 if(!/^[a-z0-9_]{3,30}$/.test(u)){r.innerHTML='<p><small>اكتب username صح (حروف إنجليزي وأرقام و _).</small></p>';return}
 if(u===USER.username){r.innerHTML='<p><small>ده أنت 😄</small></p>';return}
 r.innerHTML='<p><small>بيدوّر...</small></p>';
 try{
  const{U,fs}=await fbx(),s=await fs.getDoc(fs.doc(U.db,'usernames',u));
  if(!s.exists()){r.innerHTML='<p><small>مفيش مستخدم بالاسم ده.</small></p>';return}
  const uid=s.data().uid,ex=FR.find(f=>f.m.includes(uid));
  if(ex&&ex.status==='blocked'){r.innerHTML='<p><small>مش متاح.</small></p>';return}
  if(ex){r.innerHTML=`<p><small>${ex.status==='accepted'?'انتوا أصحاب بالفعل.':'فيه طلب صداقة معلّق بينكم.'}</small></p>`;return}
  MS={u,uid};
  r.innerHTML=`<div class="r"><div><b>@${esc(u)}</b></div><button class="pr" style="width:auto" onclick="frSend()">ابعت طلب صداقة</button></div>`
 }catch(e){r.innerHTML='<p><small>حصل خطأ. اتأكد من النت.</small></p>'}}
async function frSend(){
 if(!MS||msgBusy)return;msgBusy=1;
 try{
  const{U,fs}=await fbx(),now=fs.serverTimestamp();
  await fs.setDoc(fs.doc(U.db,'friendships',pairId(ME,MS.uid)),{m:[ME,MS.uid],from:ME,to:MS.uid,status:'pending',uf:USER.username,nf:USER.name,ut:MS.u,nt:'',createdAt:now,updatedAt:now});
  toast('اتبعت الطلب ✓');MS=null;const r=$('msr');if(r)r.innerHTML='';const q=$('msq');if(q)q.value=''
 }catch(e){toast('مقدرتش أبعت الطلب. ممكن الحساب يكون اتقفل.')}
 msgBusy=0}
async function frUp(id,data,okMsg){
 try{const{U,fs}=await fbx();await fs.updateDoc(fs.doc(U.db,'friendships',id),Object.assign({updatedAt:fs.serverTimestamp()},data));if(okMsg)toast(okMsg)}
 catch(e){toast('فشلت العملية. حاول تاني')}}
const frAcc=id=>frUp(id,{status:'accepted',nt:USER.name},'بقيتوا أصحاب ✓');
function frUnb(id){const f=FR.find(x=>x.id===id);frUp(id,{status:f&&f.nt?'accepted':'pending',blockedBy:''},'اتفك الحظر')}
function frArm(k){fcf=k;rfr();setTimeout(()=>{if(fcf===k){fcf='';rfr()}},4000)}
function frBlk(id){if(fcf!=='b'+id){frArm('b'+id);return}fcf='';frUp(id,{status:'blocked',blockedBy:ME},'اتحظر ✓')}
async function frDel(id){
 if(fcf!=='d'+id){frArm('d'+id);return}
 fcf='';
 try{const{U,fs}=await fbx();await fs.deleteDoc(fs.doc(U.db,'friendships',id));toast('تم')}catch(e){toast('فشلت العملية')}}
 function vConv(){
 const f=FR.find(x=>x.id===CH);if(!f)return '';const p=peer(f);
 return `<div class="c chat-shell"><div class="chat-top"><div class="hd"><button class="x" onclick="closeChat()">→</button><div class="avatar">${avLetter(f)}</div><div class="xpwrap"><b>${pname(f)}</b><small style="display:block" id="cty">@${esc(p.u)}</small></div>${!VIEW?`<button class="x" onclick="openReportUser('${esc(f.id)}','${esc(p.uid)}','${esc(p.n||'')}','${esc(p.u||'')}')">🚩</button><button class="x" onclick="frBlk('${esc(f.id)}')">${fcf==='b'+f.id?'متأكد؟ حظر':'🚫'}</button><button class="x" onclick="frDel('${esc(f.id)}')">${fcf==='d'+f.id?'متأكد؟':'🗑'}</button>`:''}</div></div><div class="chat-messages" id="cm"></div>${VIEW?'<div style="padding:9px;text-align:center;background:var(--cd);border-top:1px solid var(--bd)"><small>👁 وضع المشاهدة • الرسائل للعرض فقط</small></div>':vCompose('dm')}</div>${vReportPanel()}`}
function chatPost(){if(!CH)return;paintMsgs();paintTy();attPaint()}
function paintTy(){const e=$('cty'),f=FR.find(x=>x.id===CH);if(e&&f)e.textContent=tyShow?'بيكتب...':'@'+peer(f).u}
function paintMsgs(){
 const b=$('cm');if(!b)return;const near=b.scrollHeight-b.scrollTop-b.clientHeight<80;
 b.innerHTML=CHM.length?CHM.map((m,i)=>{const me=m.from===ME,ms=tms(m.createdAt),d=ms?new Date(ms).toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'}):'',prev=CHM[i-1],same=prev&&prev.from===m.from&&ms-tms(prev.createdAt)<300000,sep=!i||d!==(tms(prev&&prev.createdAt)?new Date(tms(prev.createdAt)).toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'}):'');return `${sep?`<div class="chat-date">${d||'اليوم'}</div>`:''}<div class="msg-line ${me?'mine':'theirs'} ${same?'same':''}"><div class="msg-bubble ${me?'msg-me':'msg-other'}">${messageContent(m)}<div class="msg-actions">${!me&&!VIEW?`<button onclick="openReportMessage('${esc(CH)}','${esc(m.id||'')}','${esc(m.from)}','')">🚩 إبلاغ</button>`:''}</div><div class="msg-time">${hmt(ms)}${me?(m.read?' ✓✓':' ✓'):''}</div></div></div>`}).join(''):'<div style="margin:auto;text-align:center"><div style="font-size:38px">💬</div><b>مفيش رسائل لسه</b><small style="display:block;margin-top:4px">ابدأوا المحادثة 👋</small></div>';
 if(near||scr){b.scrollTop=b.scrollHeight;if(CHM.length)scr=0}}
function stopConv(){try{chUnsub&&chUnsub();tyUnsub&&tyUnsub()}catch(e){}chUnsub=tyUnsub=null;clearTimeout(tyTimer);tyShow=0}
function closeChat(){stopConv();CH=null;CHM=[];fcf='';attReset();render()}
async function openChat(id){
 const f=FR.find(x=>x.id===id);if(!f||f.status!=='accepted')return;
 stopConv();CH=id;CHM=[];scr=1;fcf='';attReset();LR[id]=Math.max(Date.now(),lastMs(f));saveLR();paintNav();render();
 try{
  const{U,fs}=VIEW?await(async()=>{const A=await fbAdmin();return{U:A,fs:A.m.fs}})():await fbx(),p=peer(f);
  const q=fs.query(fs.collection(U.db,'friendships',id,'messages'),fs.orderBy('createdAt','desc'),fs.limit(50));
  chUnsub=fs.onSnapshot(q,sn=>{
   if(CH!==id)return;
   CHM=sn.docs.map(d=>Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))).reverse();
   const l=CHM[CHM.length-1];
   if(l){LR[id]=Math.max(Date.now(),tms(l.createdAt));saveLR();if(l.from!==ME)tyShow=0}
   paintNav();paintMsgs();paintTy();markRead(id)
  },e=>toast('مقدرتش أحمّل الرسائل'));
  let first=true;
  tyUnsub=fs.onSnapshot(fs.doc(U.db,'friendships',id,'typing',p.uid),sn=>{
   if(sn.metadata.fromCache)return;
   if(first){first=false;return}
   if(CH!==id||!sn.exists()||sn.metadata.hasPendingWrites)return;
   tyShow=1;paintTy();clearTimeout(tyTimer);tyTimer=setTimeout(()=>{tyShow=0;paintTy()},5000)
  },e=>{})
 }catch(e){if(VIEW)toast('مقدرتش أحمّل الرسائل')}}
async function markRead(id){
 if(VIEW||document.hidden||CH!==id)return;
 const un=CHM.filter(m=>m.from!==ME&&!m.read).slice(0,100);if(!un.length)return;
 try{const{U,fs}=await fbx(),b=fs.writeBatch(U.db);un.forEach(m=>b.update(fs.doc(U.db,'friendships',id,'messages',m.id),{read:true}));await b.commit()}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&CH)markRead(CH)});
function sendMsg(){
 if(VIEW)return;
 const el=$('mi');if(!el||!CH||sendLock)return;
 const text=el.value.trim(),att=ATTP;if(!text&&!att)return;
 if(text.length>1000){toast('الرسالة طويلة (الحد 1000 حرف)');return}
 sendLock=1;el.value='';ATTP=null;ATTM=0;attPaint();setTimeout(()=>{sendLock=0},600);
 const id=CH;
 fbx().then(({U,fs})=>{
  const b=fs.writeBatch(U.db),now=fs.serverTimestamp(),msg={from:ME,text,createdAt:now,read:false};if(att)msg.att=att;
  b.set(fs.doc(fs.collection(U.db,'friendships',id,'messages')),msg);
  b.update(fs.doc(U.db,'friendships',id),{lastBy:ME,lastAt:now,lastText:(text||attLabel(att)).slice(0,80),updatedAt:now});
  return b.commit()
 }).catch(()=>{toast('الرسالة ما اتبعتتش');if(att&&!ATTP){ATTP=att;attPaint()}})}
function typ(){
 if(!CH||Date.now()-lastTy<2500)return;lastTy=Date.now();const id=CH;
 fbx().then(({U,fs})=>fs.setDoc(fs.doc(U.db,'friendships',id,'typing',ME),{at:fs.serverTimestamp()})).catch(()=>{})}

let DIS=0;
const vDis=()=>`<div class="c" style="text-align:center;margin-top:30px"><div style="font-size:42px">⏸</div><h2>حسابك متوقف مؤقتاً</h2><p><small>بياناتك محفوظة. كلّم اللي إداك الكود عشان يرجّعه، وبعدها دوس جرّب تاني.</small></p><button class="pr" onclick="gtCheck()">جرّب تاني</button></div>`;
