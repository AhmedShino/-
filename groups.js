/* ===== الجروبات بين الأصحاب =====
   - الجروب بيتعمل بصاحبه بس، وبعدين بيضيف أعضاء من أصحابه (القواعد بتتأكد إنهم أصحاب فعلاً).
   - رسايل الجروب: نص + مرفق اختياري (صورة / ملف / ملف حفظ) من attachments.js */
let GR=[],GR_ON=0,GR_SEL='',GR_VIEW='chat',GRM=[],grUnsub=null,grmUnsub=null,GR_BUSY=0,GR_ERR='',GR_NEW={},GR_F={n:'',d:''},grcf='',grFirst=true,grSendLock=0,grScr=0;
const gLR=g=>LR['g'+g.id]||0;
const grUnread=g=>!!g.lastBy&&g.lastBy!==ME&&tms(g.lastAt)>gLR(g);
const gLetter=g=>esc(String(g.name||'ج').trim().charAt(0).toUpperCase()||'ج');
const gMem=(g,u)=>(g.members||[]).find(x=>x.uid===u)||{};
const gMName=(g,u)=>{const m=gMem(g,u);return m.name||(m.username?'@'+m.username:'عضو')};
const gOpen=()=>!!GR_SEL&&GR_SEL!=='create';
function grmStop(){try{grmUnsub&&grmUnsub()}catch(e){}grmUnsub=null;GRM=[]}
function groupStop(){try{grUnsub&&grUnsub()}catch(e){}grUnsub=null;grmStop()}
async function groupInit(){
 if(GR_ON||!USER||!ME||VIEW)return;
 try{
  const{U,fs}=await fbx();grFirst=true;
  const q=fs.query(fs.collection(U.db,'groups'),fs.where('memberIds','array-contains',ME));
  grUnsub=fs.onSnapshot(q,sn=>{
   GR=sn.docs.map(d=>Object.assign({id:d.id},d.data({serverTimestamps:'estimate'})));
   if(!grFirst)sn.docChanges().forEach(c=>{
    if(c.doc.metadata.hasPendingWrites)return;
    const g=Object.assign({id:c.doc.id},c.doc.data());
    if(c.type==='added'&&g.ownerId!==ME)toast('👥 اتضفت لجروب: '+(g.name||''));
    else if(c.type==='modified'&&g.lastBy&&g.lastBy!==ME&&(GR_SEL!==g.id||document.hidden))toast('👥 '+(g.name||'جروب')+': رسالة جديدة')});
   grFirst=false;paintNav();
   if(gOpen()&&!GR.some(g=>g.id===GR_SEL)){grmStop();GR_SEL='';GR_VIEW='chat';if(tab==='chat')render();return}
   if(tab==='chat'){if(gOpen()&&GR_VIEW==='info')render();else paintFr()}
  },()=>{});
  GR_ON=1
 }catch(e){GR=[]}}
function vGroups(){
 if(GR_SEL==='create')return vGroupCreate();
 if(GR_SEL)return GR_VIEW==='info'?vGroupInfo():vGroupChat();
 return vGroupList()}
function vGroupList(){
 const list=GR.slice().sort((a,b)=>tms(b.lastAt||b.createdAt)-tms(a.lastAt||a.createdAt));
 return `<div class="c group-list"><div class="hd" style="justify-content:space-between"><h2>👥 الجروبات <small>${list.length}</small></h2>${!VIEW?'<button onclick="openGroupCreate()">＋ جروب</button>':''}</div>${list.map(g=>{const un=grUnread(g);return `<div class="group-row" onclick="openGroup('${esc(g.id)}')"><div class="group-avatar">${gLetter(g)}</div><div class="friend-main"><div class="friend-name"><b>${esc(g.name||'بدون اسم')}</b>${un?'<span class="unread-dot">جديد</span>':''}</div><small class="friend-preview">${(g.memberIds||[]).length} أعضاء • ${esc(g.lastText||'ابدأوا المذاكرة 👋')}</small></div><div class="friend-meta">${g.lastAt?hmt(tms(g.lastAt)):''}</div></div>`}).join('')||'<div class="empty-group">مفيش جروبات لسه. اعمل جروب وضيف أصحابك.</div>'}</div>`}
function openGroupCreate(){if(VIEW)return;GR_ERR='';GR_BUSY=0;GR_NEW={};GR_F={n:'',d:''};GR_SEL='create';render()}
function vGroupCreate(){
 const ac=FR.filter(f=>f.status==='accepted');
 return `<div class="c"><div class="hd" style="justify-content:space-between"><h2>➕ إنشاء جروب</h2><button class="x" onclick="GR_SEL='';render()">✕</button></div><input id="gnm" maxlength="40" placeholder="اسم الجروب (مثلاً: جروب الفيزياء)" value="${esc(GR_F.n)}"><textarea id="gdesc" maxlength="300" placeholder="وصف مختصر (اختياري)">${esc(GR_F.d)}</textarea><b>ضيف من أصحابك (لحد 19)</b>${ac.map(f=>{const p=peer(f);return `<label class="r" style="cursor:pointer"><div><b>${pname(f)}</b><small>@${esc(p.u)}</small></div><input type="checkbox" style="width:auto;margin:0" ${GR_NEW[p.uid]?'checked':''} onchange="GR_NEW['${esc(p.uid)}']=this.checked"></label>`}).join('')||'<p><small>مفيش أصحاب لسه. تقدر تعمل الجروب وتضيف بعدين.</small></p>'}${GR_ERR?`<p style="color:var(--bad)">${esc(GR_ERR)}</p>`:''}<button class="pr" onclick="createGroup()">إنشاء الجروب</button></div>`}
async function createGroup(){
 if(GR_BUSY||VIEW)return;
 const name=(($('gnm')&&$('gnm').value)||'').trim().slice(0,40),desc=(($('gdesc')&&$('gdesc').value)||'').trim().slice(0,300);
 GR_F={n:name,d:desc};
 if(name.length<2){GR_ERR='اكتب اسم الجروب (حرفين على الأقل).';render();return}
 GR_BUSY=1;GR_ERR='';
 try{
  const{U,fs}=await fbx(),now=fs.serverTimestamp(),ref=fs.doc(fs.collection(U.db,'groups')),
   me={uid:ME,name:USER.name||'',username:USER.username||'',role:'owner'};
  await fs.setDoc(ref,{name,description:desc,ownerId:ME,memberIds:[ME],members:[me],createdAt:now,updatedAt:now});
  let ids=[ME],ms=[me],fail=0;
  for(const u of Object.keys(GR_NEW).filter(k=>GR_NEW[k]).slice(0,19)){
   const f=FR.find(x=>x.status==='accepted'&&peer(x).uid===u);if(!f){fail++;continue}
   const pi=ids,pm=ms,p=peer(f);
   try{
    ids=ids.concat([u]);ms=ms.concat([{uid:u,name:p.n||'',username:p.u||'',role:'member'}]);
    await fs.updateDoc(ref,{memberIds:ids,members:ms,updatedAt:fs.serverTimestamp()})
   }catch(e){ids=pi;ms=pm;fail++}}
  GR_F={n:'',d:''};GR_NEW={};GR_BUSY=0;GR_SEL='';GR_VIEW='chat';render();
  toast(fail?'اتعمل الجروب، بس '+fail+' ما اتضافوش':'اتعمل الجروب ✓')
 }catch(e){GR_ERR='مقدرتش أعمل الجروب. اتأكد من النت ومن قواعد Firebase.';GR_BUSY=0;render()}}
async function openGroup(id){
 if(!GR.some(g=>g.id===id))return;
 grmStop();GR_SEL=id;GR_VIEW='chat';grScr=1;grcf='';GR_ERR='';attReset();
 const g0=GR.find(g=>g.id===id);LR['g'+id]=Math.max(Date.now(),tms(g0.lastAt));saveLR();paintNav();render();
 try{
  const{U,fs}=VIEW?await(async()=>{const A=await fbAdmin();return{U:A,fs:A.m.fs}})():await fbx(),
   q=fs.query(fs.collection(U.db,'groups',id,'messages'),fs.orderBy('createdAt','desc'),fs.limit(50));
  grmUnsub=fs.onSnapshot(q,sn=>{
   if(GR_SEL!==id)return;
   GRM=sn.docs.map(d=>Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))).reverse();
   const l=GRM[GRM.length-1];if(l){LR['g'+id]=Math.max(Date.now(),tms(l.createdAt));saveLR()}
   paintNav();if(GR_VIEW==='chat')paintGroupMsgs()
  },()=>toast('مقدرتش أحمّل رسائل الجروب'))
 }catch(e){toast('مقدرتش أفتح الجروب')}}
function closeGroup(){grmStop();GR_SEL='';GR_VIEW='chat';grcf='';attReset();render()}
function groupPost(){if(gOpen()&&GR_VIEW==='chat'){paintGroupMsgs();attPaint()}}
function vGroupChat(){
 const g=GR.find(x=>x.id===GR_SEL);if(!g)return '';
 return `<div class="c group-chat chat-shell"><div class="chat-top"><div class="hd"><button class="x" onclick="closeGroup()">→</button><div class="group-avatar">${gLetter(g)}</div><div class="xpwrap" onclick="GR_VIEW='info';render()" style="cursor:pointer"><b>${esc(g.name)}</b><small style="display:block">${(g.memberIds||[]).length} أعضاء • التفاصيل</small></div></div></div><div class="chat-messages" id="cm"></div>${VIEW?'<div class="view-only"><small>👁 وضع المشاهدة • للعرض فقط</small></div>':vCompose('g')}</div>${vReportPanel()}`}
function paintGroupMsgs(){
 const b=$('cm');if(!b)return;const near=b.scrollHeight-b.scrollTop-b.clientHeight<80,
  dd=x=>x?new Date(x).toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'}):'';
 b.innerHTML=GRM.length?GRM.map((m,i)=>{
  const me=m.from===ME,ms=tms(m.createdAt),prev=GRM[i-1],same=prev&&prev.from===m.from&&ms-tms(prev.createdAt)<300000,sep=!i||dd(ms)!==dd(tms(prev.createdAt));
  return `${sep?`<div class="chat-date">${dd(ms)||'اليوم'}</div>`:''}<div class="msg-line ${me?'mine':'theirs'} ${same?'same':''}"><div class="msg-bubble ${me?'msg-me':'msg-other'}">${!me&&!same?`<div class="gname">${esc(m.name||'عضو')}</div>`:''}${messageContent(m)}<div class="msg-actions">${!me&&!VIEW?`<button onclick="openReportMessage('${esc(GR_SEL)}','${esc(m.id||'')}','${esc(m.from)}','')">🚩 إبلاغ</button>`:''}</div><div class="msg-time">${hmt(ms)}</div></div></div>`}).join(''):'<div style="margin:auto;text-align:center"><div style="font-size:38px">💬</div><b>مفيش رسائل لسه</b><small style="display:block;margin-top:4px">ابدأوا المحادثة 👋</small></div>';
 if(near||grScr){b.scrollTop=b.scrollHeight;if(GRM.length)grScr=0}}
function sendGroupMsg(){
 if(VIEW)return;
 const el=$('mi');if(!el||!gOpen()||grSendLock)return;
 const text=el.value.trim(),att=ATTP;if(!text&&!att)return;
 if(text.length>1000){toast('الرسالة طويلة (الحد 1000 حرف)');return}
 grSendLock=1;el.value='';ATTP=null;ATTM=0;attPaint();setTimeout(()=>{grSendLock=0},600);
 const id=GR_SEL,nm=USER.name||'';
 fbx().then(({U,fs})=>{
  const b=fs.writeBatch(U.db),now=fs.serverTimestamp(),msg={from:ME,name:nm,text,createdAt:now};if(att)msg.att=att;
  b.set(fs.doc(fs.collection(U.db,'groups',id,'messages')),msg);
  b.update(fs.doc(U.db,'groups',id),{lastBy:ME,lastAt:now,lastText:(nm.split(' ')[0]+': '+(text||attLabel(att))).slice(0,100),updatedAt:now});
  return b.commit()
 }).catch(()=>{toast('الرسالة ما اتبعتتش');if(att&&!ATTP){ATTP=att;attPaint()}})}
/* ---- تفاصيل الجروب: الأعضاء، الإضافة، الإزالة، المغادرة، الحذف ---- */
function vGroupInfo(){
 const g=GR.find(x=>x.id===GR_SEL);if(!g)return '';
 const own=g.ownerId===ME&&!VIEW,cq=(k,a,b)=>grcf===k?b:a,ids=g.memberIds||[],
  ac=FR.filter(f=>f.status==='accepted'&&!ids.includes(peer(f).uid));
 return `<button style="margin-bottom:10px" onclick="GR_VIEW='chat';render()">← رجوع للمحادثة</button>
 <div class="c"><div class="group-avatar" style="margin:0 auto 8px">${gLetter(g)}</div><h2 style="text-align:center">${esc(g.name||'')}</h2>${g.description?`<p style="text-align:center"><small>${esc(g.description)}</small></p>`:''}${own?`<div class="row"><input id="grn" maxlength="40" value="${esc(g.name||'')}" style="flex:1;margin:0"><button onclick="renameGroup()">حفظ الاسم</button></div>`:''}</div>
 <div class="c"><b>الأعضاء (${ids.length})</b>${ids.map(u=>{const m=gMem(g,u);return `<div class="r"><div class="group-avatar" style="width:36px;height:36px">${esc(String(m.name||m.username||'?').trim().charAt(0).toUpperCase())}</div><div style="flex:1"><b>${esc(gMName(g,u))}</b>${u===g.ownerId?' <span class="bdg">مشرف</span>':''}${u===ME?' <small>(أنت)</small>':''}${m.username?`<small>@${esc(m.username)}</small>`:''}</div>${u!==ME&&!VIEW?`<button onclick="openReportUser('${esc(g.id)}','${esc(u)}','${esc(m.name||'')}','${esc(m.username||'')}')">🚩</button>`:''}${own&&u!==ME?`<button class="bad" onclick="removeFromGroup('${esc(u)}')">${cq('r'+u,'إزالة','متأكد؟')}</button>`:''}</div>`}).join('')}</div>
 ${own&&ac.length&&ids.length<20?`<div class="c"><b>➕ إضافة من أصحابك</b>${ac.map(f=>`<div class="r"><div><b>${pname(f)}</b><small>@${esc(peer(f).u)}</small></div><button class="ok" onclick="addToGroup('${esc(peer(f).uid)}')">إضافة</button></div>`).join('')}</div>`:''}
 ${VIEW?'':own?`<button class="bad" style="width:100%" onclick="deleteGroup()">${cq('del','🗑 احذف الجروب','متأكد؟ هيتمسح بكل رسايله')}</button>`:`<button class="bad" style="width:100%" onclick="leaveGroup()">${cq('lv','🚪 اترك الجروب','متأكد؟ اضغط تاني')}</button>`}${vReportPanel()}`}
function grArm(k){grcf=k;render();setTimeout(()=>{if(grcf===k){grcf='';if(tab==='chat'&&gOpen()&&GR_VIEW==='info')render()}},4000)}
async function grUpd(data,okMsg){
 try{const{U,fs}=await fbx();await fs.updateDoc(fs.doc(U.db,'groups',GR_SEL),Object.assign({updatedAt:fs.serverTimestamp()},data));if(okMsg)toast(okMsg);return true}
 catch(e){toast('فشلت العملية');return false}}
async function addToGroup(u){
 const g=GR.find(x=>x.id===GR_SEL),f=FR.find(x=>x.status==='accepted'&&peer(x).uid===u);
 if(!g||!f||g.ownerId!==ME||(g.memberIds||[]).length>=20||(g.memberIds||[]).includes(u))return;
 const p=peer(f);
 await grUpd({memberIds:(g.memberIds||[]).concat([u]),members:(g.members||[]).concat([{uid:u,name:p.n||'',username:p.u||'',role:'member'}])},'اتضاف ✓')}
async function removeFromGroup(u){
 if(grcf!=='r'+u){grArm('r'+u);return}grcf='';
 const g=GR.find(x=>x.id===GR_SEL);if(!g||g.ownerId!==ME||u===ME)return;
 await grUpd({memberIds:(g.memberIds||[]).filter(x=>x!==u),members:(g.members||[]).filter(x=>x.uid!==u)},'اتشال من الجروب')}
async function leaveGroup(){
 if(grcf!=='lv'){grArm('lv');return}grcf='';
 const g=GR.find(x=>x.id===GR_SEL);if(!g||g.ownerId===ME)return;
 if(await grUpd({memberIds:(g.memberIds||[]).filter(x=>x!==ME),members:(g.members||[]).filter(x=>x.uid!==ME)},'خرجت من الجروب')){grmStop();GR_SEL='';GR_VIEW='chat';render()}}
async function renameGroup(){
 const n=(($('grn')&&$('grn').value)||'').trim().slice(0,40);
 if(n.length<2){toast('الاسم قصير');return}
 await grUpd({name:n},'اتغير الاسم ✓')}
async function deleteGroup(){
 if(grcf!=='del'){grArm('del');return}grcf='';
 const id=GR_SEL;
 try{const{U,fs}=await fbx();await groupWipe(U,fs,id);toast('اتحذف الجروب')}catch(e){toast('فشل الحذف')}}
async function groupWipe(U,fs,id){
 for(let k=0;k<60;k++){
  const s=await fs.getDocs(fs.query(fs.collection(U.db,'groups',id,'messages'),fs.limit(300)));
  if(s.empty)break;
  const b=fs.writeBatch(U.db);s.docs.forEach(d=>b.delete(d.ref));await b.commit()}
 await fs.deleteDoc(fs.doc(U.db,'groups',id))}
/* لما حساب يخرج أو المطور يمسحه: يمسح الجروبات اللي هو صاحبها، ويطلع من الباقي */
async function groupCleanup(U,fs,uid){
 let s;try{s=await fs.getDocs(fs.query(fs.collection(U.db,'groups'),fs.where('memberIds','array-contains',uid)))}catch(e){return}
 for(const d of s.docs){
  const g=d.data();
  try{
   if(g.ownerId===uid)await groupWipe(U,fs,d.id);
   else await fs.updateDoc(d.ref,{memberIds:(g.memberIds||[]).filter(x=>x!==uid),members:(g.members||[]).filter(x=>x.uid!==uid),updatedAt:fs.serverTimestamp()})
  }catch(e){}}}
