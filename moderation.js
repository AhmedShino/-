/* ===== البلاغات: رسائل/مستخدمين + مشاكل التطبيق ===== */
const MOD={open:0,kind:'message',friendId:'',messageId:'',targetUid:'',targetName:'',targetUsername:'',reason:'',desc:'',busy:0,err:'',chatKind:'dm',messageText:'',context:''};
const ISSUE={busy:0,err:''};
const REPORT_REASONS=[['harassment','تحرش أو إساءة'],['spam','سبام أو إزعاج'],['unsafe','محتوى غير مناسب'],['impersonation','انتحال شخصية'],['other','سبب آخر']];
const reportReset=()=>Object.assign(MOD,{open:0,kind:'message',friendId:'',messageId:'',targetUid:'',targetName:'',targetUsername:'',reason:'',desc:'',busy:0,err:'',chatKind:'dm',messageText:'',context:''});
/* دليل البلاغ: نص الرسالة المبلَّغ عنها + آخر 10 رسايل في المحادثة (لقطة وقت البلاغ) */
function repCtx(mid){
 const g=gOpen(),arr=g?GRM:CHM,f=g?null:FR.find(x=>x.id===CH);
 const nm=m=>m.from===ME?(USER.name||'أنا'):(g?(m.name||'عضو'):(f?(peer(f).n||('@'+peer(f).u)):'هو'));
 const line=m=>'['+hmt(tms(m.createdAt))+'] '+nm(m)+': '+(m.text||attLabel(m.att)||'');
 const msg=mid?arr.find(x=>x.id===mid):null;
 return{chatKind:g?'group':'dm',messageText:msg?String(msg.text||attLabel(msg.att)||'').slice(0,500):'',context:arr.slice(-10).map(line).join('\n').slice(0,4000)}}
function openReportMessage(fid,mid,uid,un){Object.assign(MOD,{open:1,kind:'message',friendId:fid,messageId:mid,targetUid:uid,targetUsername:un||'',reason:'',desc:'',err:''},repCtx(mid));render()}
function openReportUser(fid,uid,n,u){Object.assign(MOD,{open:1,kind:'user',friendId:fid,messageId:'',targetUid:uid,targetName:n||'',targetUsername:u||'',reason:'',desc:'',err:''},repCtx(''));render()}
function closeReport(){reportReset();render()}
function reportLabel(){return MOD.kind==='message'?'الرسالة':'المستخدم'}
function vReportPanel(){
 if(!MOD.open)return '';
 const title=MOD.kind==='message'?'🚩 الإبلاغ عن رسالة':'🚩 الإبلاغ عن مستخدم';
 return `<div class="report-sheet"><div class="c report-card"><div class="hd" style="justify-content:space-between"><h2>${title}</h2><button class="x" onclick="closeReport()">✕</button></div><p><small>البلاغ هيوصل للوحة المطور للمراجعة. استخدمه للمحتوى المسيء أو المخالف.</small></p><select id="rpr"><option value="">اختار السبب</option>${REPORT_REASONS.map(([k,n])=>`<option value="${k}" ${MOD.reason===k?'selected':''}>${n}</option>`).join('')}</select><textarea id="rpd" maxlength="1000" placeholder="اكتب تفاصيل إضافية (اختياري)">${esc(MOD.desc)}</textarea>${MOD.err?`<p style="color:var(--bad)"><b>${esc(MOD.err)}</b></p>`:''}<button class="pr" onclick="submitReport()" ${MOD.busy?'disabled':''}>${MOD.busy?'بيبعت...':'إرسال البلاغ'}</button></div></div>`}
async function submitReport(){
 if(MOD.busy)return;
 const reason=($('rpr')&&$('rpr').value)||'',desc=(($('rpd')&&$('rpd').value)||'').trim().slice(0,1000);
 if(!reason){MOD.err='اختار سبب البلاغ الأول.';render();return}
 if(!USER||!ME||!ACT){MOD.err='لازم تكون مسجّل دخول عشان تبعت بلاغ.';render();return}
 MOD.busy=1;MOD.err='';render();
 try{const{U,fs}=await fbx(),now=fs.serverTimestamp();await fs.addDoc(fs.collection(U.db,'reports'),{type:'user_report',kind:MOD.kind,reporterUid:ME,reporterUsername:USER.username||'',targetUid:MOD.targetUid,targetUsername:MOD.targetUsername||'',friendshipId:MOD.friendId||'',messageId:MOD.messageId||'',chatKind:MOD.chatKind||'dm',messageText:MOD.messageText||'',context:MOD.context||'',targetName:MOD.targetName||'',reason,description:desc,status:'new',createdAt:now,updatedAt:now});reportReset();toast('اتبعث البلاغ ✓');render()}
 catch(e){MOD.busy=0;MOD.err=e&&e.code==='permission-denied'?'البلاغات لسه مش مفعّلة في قواعد Firebase.':'مقدرتش أبعت البلاغ. حاول تاني.';render()}}
function vIssueForm(){
 return `<details class="c"><summary><b>🛠 الإبلاغ عن مشكلة في التطبيق</b></summary><p><small>لو فيه عطل أو حاجة مش شغالة، ابعتها للمطور مع وصف واضح.</small></p><select id="isub"><option value="bug">عطل أو خطأ</option><option value="ui">مشكلة في الواجهة</option><option value="login">التسجيل أو كود الدعوة</option><option value="study">المذاكرة أو المؤقت</option><option value="memory">الحفظ والاختبارات</option><option value="chat">الأصحاب والدردشة</option><option value="suggestion">اقتراح تحسين</option></select><textarea id="idesc" maxlength="1500" placeholder="إيه اللي حصل؟ وإزاي نقدر نعيد المشكلة؟"></textarea>${ISSUE.err?`<p style="color:var(--bad)"><b>${esc(ISSUE.err)}</b></p>`:''}<button class="pr" onclick="submitIssue()" ${ISSUE.busy?'disabled':''}>${ISSUE.busy?'بيبعت...':'إرسال المشكلة'}</button></details>`}
async function submitIssue(){
 if(ISSUE.busy)return;const type=($('isub')&&$('isub').value)||'bug',description=(($('idesc')&&$('idesc').value)||'').trim().slice(0,1500);
 if(description.length<10){ISSUE.err='اكتب وصفًا أوضح للمشكلة (10 حروف على الأقل).';render();return}
 if(!USER||!ME||!ACT){ISSUE.err='فعّل الكود وسجّل بياناتك الأول.';render();return}
 ISSUE.busy=1;ISSUE.err='';render();
 try{const{U,fs}=await fbx(),now=fs.serverTimestamp();await fs.addDoc(fs.collection(U.db,'reports'),{type:'app_issue',issueType:type,reporterUid:ME,reporterUsername:USER.username||'',description,status:'new',screen:tab,appVersion:typeof FBV==='string'?FBV:'',createdAt:now,updatedAt:now});ISSUE.busy=0;ISSUE.err='';toast('وصلت المشكلة للمطور ✓');render()}
 catch(e){ISSUE.busy=0;ISSUE.err=e&&e.code==='permission-denied'?'الإبلاغ عن المشاكل لسه مش مفعّل في قواعد Firebase.':'مقدرتش أبعت المشكلة. حاول تاني.';render()}}
function vModerationHelp(){return vIssueForm()}
