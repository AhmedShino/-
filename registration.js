/* ===== تسجيل بيانات المستخدم (Registration) ===== */

/* حالة المستخدم */
let USER=null;
let regBusy=0,regErr='';

try{const u=JSON.parse(localStorage.getItem('mzk_user')),a=JSON.parse(localStorage.getItem('mzk_act')||'null');if(u&&typeof u==='object'&&u.uid&&a&&(!u.code||u.code===a.c))USER=u;else localStorage.removeItem('mzk_user')}catch(e){}

/* بيانات المرحلة الثانوية */
const GRADES={'ثانوي':['أولى ثانوي','ثانية ثانوي','ثالثة ثانوي']};
const GENERAL_SECONDARY=['علمي','أدبي'];
const GENERAL_THIRD=['علمي علوم','علمي رياضة','أدبي'];
const BAC_TRACKS=['الطب وعلوم الحياة','الهندسة وعلوم الحاسب','الأعمال','الآداب والفنون'];

function needsEducationChoice(grade){
  return grade==='ثانية ثانوي'||grade==='ثالثة ثانوي';
}

function systemsForGrade(grade){
  if(grade==='ثانية ثانوي')return ['الثانوية العامة','البكالوريا المصرية'];
  if(grade==='ثالثة ثانوي')return ['الثانوية العامة'];
  return [];
}

function choicesForGrade(grade,system){
  if(grade==='ثانية ثانوي'&&system==='الثانوية العامة')return GENERAL_SECONDARY;
  if(grade==='ثانية ثانوي'&&system==='البكالوريا المصرية')return BAC_TRACKS;
  if(grade==='ثالثة ثانوي'&&system==='الثانوية العامة')return GENERAL_THIRD;
  return [];
}

function validateReg(name,age,stage,grade,system,branch,username){
  if(!name||name.trim().length<2)return 'اسمك لازم يكون فيه حرفين على الأقل';
  if(!age||age<8||age>80)return 'عمرك لازم يكون من 8 إلى 80 سنة';
  if(stage!=='ثانوي')return 'اختار المرحلة: ثانوي';
  if(!grade)return 'اختار صفك';
  if(needsEducationChoice(grade)&&!system)return 'اختار النظام';
  if(needsEducationChoice(grade)&&!branch)return grade==='ثالثة ثانوي'?'اختار الشعبة':'اختار الشعبة أو المسار';
  if(branch&&!choicesForGrade(grade,system).includes(branch))return 'الاختيار الدراسي غير صحيح';
  if(!username||username.trim().length<3)return 'Username لازم يكون فيه 3 أحرف على الأقل';
  if(!/^[a-zA-Z0-9_]+$/.test(username))return 'Username يقبل أحرف إنجليزي وأرقام و underscore بس';
  if(username.length>30)return 'Username طويل أوي';
  return null;
}

async function saveReg(){
  if(regBusy)return;

  const name=($('rn')&&$('rn').value||'').trim(),
        age=+($('ra')&&$('ra').value||0),
        stage='ثانوي',
        grade=$('rg')&&$('rg').value,
        system=$('rsy')&&$('rsy').value||'',
        branch=$('rb')&&$('rb').value||'',
        username=($('ru')&&$('ru').value||'').trim().toLowerCase();

  const err=validateReg(name,age,stage,grade,system,branch,username);
  if(err){regErr=err;render();return}

  if(!ACT){regErr='لم يتم تفعيل الكود';render();return}

  regBusy=1;regErr='';render();

  try{
    const U=await fbUser(),{au,fs}=U.m;
    let u=await authReady(U.m,U.auth);
    if(!u)u=(await au.signInAnonymously(U.auth)).user;

    /* تحقق إن اليوزرنيم متاح عبر collection منفصلة
       لأن قراءة users كلها ممنوعة في Firestore Rules. */
    const usernameRef=fs.doc(U.db,'usernames',username);
    const usernameSnap=await fs.getDoc(usernameRef);
    if(usernameSnap.exists()){
      regErr='اليوزرنيم ده مستخدم فعلاً، اختار واحد تاني';
      regBusy=0;render();return;
    }

    /* احفظ البيانات */
    const userData={
      uid:u.uid,
      name,
      age,
      stage,
      grade,
      system,
      branch,
      username,
      college:'',
      createdAt:fs.serverTimestamp(),
      updatedAt:fs.serverTimestamp(),
      code:ACT.c
    };

    /* احجز اليوزرنيم واحفظ البروفايل معًا */
    const batch=fs.writeBatch(U.db);
    batch.set(usernameRef,{uid:u.uid,username,createdAt:fs.serverTimestamp()});
    batch.set(fs.doc(U.db,'users',u.uid),userData);
    await batch.commit();

    USER={
      uid:u.uid,
      name,
      age,
      stage,
      grade,
      system,
      branch,
      username,
      college:'',
      code:ACT.c,
      createdAt:Date.now(),
      updatedAt:Date.now()
    };

    try{localStorage.setItem('mzk_user',JSON.stringify(USER))}catch(e){}
    regErr='';
    toast('أهلاً و سهلاً '+name+' 👋');
    msgInit();
    S.seen=1;
    save();
    render();
  }catch(e){
    console.error('saveReg error:',e);
    const code=String(e&&e.code||'');
    regErr=code==='permission-denied'?'التسجيل مرفوض من صلاحيات Firebase. راجع Firestore Rules.':code==='failed-precondition'?'Firebase محتاج إعداد/Index ناقص. راجع إعدادات Firestore.':'حصل خطأ أثناء حفظ البيانات. افتح Console لمعرفة السبب.';
    regBusy=0;render();
  }
}

function vReg(){
  const currentStage='ثانوي';
  const currentGrade=$('rg')&&$('rg').value||'';
  const currentSystem=$('rsy')&&$('rsy').value||'';
  const currentBranch=$('rb')&&$('rb').value||'';
  const currentName=$('rn')&&$('rn').value||'';
  const currentAge=$('ra')&&$('ra').value||'';
  const currentUsername=$('ru')&&$('ru').value||'';
  const systems=systemsForGrade(currentGrade);
  const choices=choicesForGrade(currentGrade,currentSystem);
  const showSystem=systems.length>0;
  const showBranch=choices.length>0;
  const branchLabel=currentGrade==='ثانية ثانوي'&&currentSystem==='البكالوريا المصرية'?'المسار':'الشعبة';
  return `<div class="c" style="margin-top:20px"><h2>أهلاً بيك 👋</h2><small>دخلت الدعوة بنجاح. قبل ما تبدأ، اكتب بياناتك الأساسية.</small>
  <input id="rn" value="${esc(currentName)}" placeholder="اسمك الكامل" maxlength="50">
  <input id="ra" type="number" value="${esc(currentAge)}" placeholder="عمرك" min="8" max="80">
  <select id="rs" disabled><option value="ثانوي" selected>ثانوي</option></select>
  <select id="rg" onchange="render()"><option value="">اختار صفك</option>${GRADES['ثانوي'].map(gr=>`<option value="${gr}" ${currentGrade===gr?'selected':''}>${gr}</option>`).join('')}</select>
  ${showSystem?`<select id="rsy" onchange="render()"><option value="">اختار النظام</option>${systems.map(x=>`<option value="${x}" ${currentSystem===x?'selected':''}>${x}</option>`).join('')}</select>`:''}
  ${showBranch?`<select id="rb"><option value="">اختار ${branchLabel}</option>${choices.map(b=>`<option value="${b}" ${currentBranch===b?'selected':''}>${b}</option>`).join('')}</select>`:''}
  <input id="ru" value="${esc(currentUsername)}" placeholder="@username (بدون مسافات)" maxlength="30" autocomplete="off">
  ${regErr?`<p style="color:var(--am)"><b>${esc(regErr)}</b></p>`:''}<button class="pr" onclick="saveReg()" ${regBusy?'disabled':''} style="${regBusy?'opacity:.5':''}">
  ${regBusy?'بيحفظ...':'التالي →'}</button></div>`;
}

async function checkRegDone(){
  if(!ACT||USER)return true;

  try{
    const U=await fbUser(),{fs}=U.m,u=await authReady(U.m,U.auth);
    if(!u)return false;

    const snap=await fs.getDoc(fs.doc(U.db,'users',u.uid));
    if(snap.exists()){
      const d=snap.data();
      if(d&&d.uid&&(!d.code||d.code===ACT.c)){
        USER={
          uid:d.uid,
          name:d.name||'',
          age:d.age||0,
          stage:d.stage||'',
          grade:d.grade||'',
          system:d.system||'',
          branch:d.branch||'',
          username:d.username||'',
          college:d.college||'',
          code:d.code||ACT.c,
          createdAt:d.createdAt&&d.createdAt.toMillis?d.createdAt.toMillis():Date.now(),
          updatedAt:d.updatedAt&&d.updatedAt.toMillis?d.updatedAt.toMillis():Date.now()
        };
        try{localStorage.setItem('mzk_user',JSON.stringify(USER))}catch(e){}
        render();
        return true;
      }
    }
    return false;
  }catch(e){
    return false;
  }
}

function vUserProfile(){
  if(!USER)return '';
  return `<details class="c"><summary><b>👤 ملفي الشخصي</b></summary>
  <div class="r"><div>الاسم</div><b>${esc(USER.name)}</b></div>
  <div class="r"><div>العمر</div><small>${USER.age} سنة</small></div>
  <div class="r"><div>المرحلة</div><small>${USER.stage} • ${USER.grade}</small></div>
  ${USER.system?`<div class="r"><div>النظام</div><small>${esc(USER.system)}</small></div>`:''}
  ${USER.branch?`<div class="r"><div>${USER.system==='البكالوريا المصرية'?'المسار':'الشعبة'}</div><small>${esc(USER.branch)}</small></div>`:''}
  <div class="r"><div>Username</div><span class="cx">@${USER.username}</span></div>
  </details>`;
}
