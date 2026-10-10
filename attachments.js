/* ===== المرفقات: صور وملفات وملفات الحفظ (بتتخزن جوه الرسالة نفسها، من غير Firebase Storage) ===== */
const AT_IMG=230000,AT_RAW=330000,AT_EXT=/^(pdf|docx?|pptx?|xlsx?|txt|csv|rtf)$/i;
const AT_IMG_RE=/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/,AT_FILE_RE=/^data:[A-Za-z0-9.+\/-]{1,80};base64,[A-Za-z0-9+\/=]*$/;
let ATTP=null,ATTM=0,attBusy=0;
const AT_C=new Map(),AT_N=new Map();
const attLabel=a=>!a?'':a.t==='img'?'📷 صورة':a.t==='deck'?'🗂 '+(a.n||'ملف حفظ'):'📎 '+(a.n||'ملف');
const attKb=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
const attSz=a=>Math.round(((a&&a.d)||'').length*0.74);
function attReset(){ATTP=null;ATTM=0}
function attOkData(m){
 const k=m.id;if(k&&AT_C.has(k))return AT_C.get(k);
 const a=m.att;let ok=false;
 if(a&&typeof a.d==='string'){
  if(a.t==='img')ok=AT_IMG_RE.test(a.d);
  else if(a.t==='file')ok=AT_FILE_RE.test(a.d);
  else if(a.t==='deck'){ok=a.d.length<700000;if(ok){try{AT_N.set(k,(JSON.parse(a.d).cards||[]).length)}catch(e){ok=false}}}
 }
 if(k)AT_C.set(k,ok);return ok}
function attHtml(m){
 const a=m.att;if(!a)return '';
 if(!attOkData(m))return '<div class="att-bad">⚠️ مرفق غير صالح</div>';
 const id=esc(m.id||'');
 if(a.t==='img')return `<img class="att-img" src="${esc(a.d)}" alt="صورة" onclick="attZoom('${id}')">`;
 if(a.t==='deck')return `<div class="att-card"><b>🗂 ${esc(a.n||'ملف حفظ')}</b><small>${AT_N.get(m.id)||0} بطاقة</small>${VIEW?'':`<button class="pr" onclick="attImport('${id}')">📥 استيراد لملفاتي</button>`}</div>`;
 return `<a class="att-card" href="${esc(a.d)}" download="${esc(a.n||'file')}"><b>📎 ${esc(a.n||'ملف')}</b><small>${attKb(attSz(a))} • اضغط للتحميل</small></a>`}
function attFind(id){const a=[];if(typeof CHM!=='undefined')a.push(...CHM);if(typeof GRM!=='undefined')a.push(...GRM);if(typeof ADM!=='undefined'&&ADM.v&&ADM.v.ms)a.push(...ADM.v.ms);return a.find(x=>x.id===id)}
/* محتوى الرسالة: النص + المرفق (بيتعمله escape وفحص نوع) */
function messageContent(m){return (m.text?`<div>${esc(m.text)}</div>`:'')+attHtml(m)}
function attZoomSrc(src){const d=document.createElement('div');d.className='att-zoom';d.onclick=()=>d.remove();const i=document.createElement('img');i.src=src;d.appendChild(i);document.body.appendChild(d)}
function attZoom(id){const m=attFind(id);if(!m||!m.att||m.att.t!=='img'||!attOkData(m))return;attZoomSrc(m.att.d)}
function attImport(id){
 if(VIEW)return;
 const m=attFind(id);if(!m||!m.att||m.att.t!=='deck'||!attOkData(m))return;
 try{
  const o=JSON.parse(m.att.d),cards=(Array.isArray(o.cards)?o.cards:[]).slice(0,500).map(c=>({id:uid(),f:String((c&&c.f)||'').slice(0,500),b:String((c&&c.b)||'').slice(0,1000),st:0,nx:T})).filter(c=>c.f);
  if(!cards.length){toast('الملف فاضي');return}
  S.dk.push({id:uid(),n:String(o.n||m.att.n||'ملف مستورد').slice(0,60),cards});save();
  toast('اتضاف لملفات الحفظ ✓ ('+cards.length+' بطاقة)')
 }catch(e){toast('الملف تالف')}}
/* ضغط الصورة لحجم صغير (JPEG) عشان تتخزن جوه الرسالة */
function attCompress(f,max){
 return new Promise((ok,no)=>{
  if(!f||!/^image\//.test(f.type||'')){no(new Error('type'));return}
  const url=URL.createObjectURL(f),im=new Image();
  im.onload=()=>{
   try{
    let sc=Math.min(1,1280/Math.max(im.naturalWidth,im.naturalHeight)),q=.82,out='';
    for(let k=0;k<10;k++){
     const c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*sc));c.height=Math.max(1,Math.round(im.naturalHeight*sc));
     const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
     out=c.toDataURL('image/jpeg',q);if(out.length<=max)break;
     q=Math.max(.45,q-.08);sc*=.82}
    URL.revokeObjectURL(url);out.length<=max?ok(out):no(new Error('big'))
   }catch(e){URL.revokeObjectURL(url);no(e)}};
  im.onerror=()=>{URL.revokeObjectURL(url);no(new Error('load'))};im.src=url})}
function attPick(kind){
 ATTM=0;attPaint();
 const i=document.createElement('input');i.type='file';if(kind==='img')i.accept='image/*';
 i.onchange=()=>{const f=i.files&&i.files[0];if(f)attTake(kind,f)};i.click()}
async function attTake(kind,f){
 if(attBusy)return;attBusy=1;
 try{
  if(kind==='img'){
   const d=await attCompress(f,AT_IMG);ATTP={t:'img',n:String(f.name||'صورة').slice(0,80),m:'image/jpeg',d}
  }else{
   const ext=String(f.name||'').split('.').pop();
   if(!AT_EXT.test(ext)){toast('النوع ده مش مسموح (PDF أو Word أو PowerPoint أو Excel أو نص)');attBusy=0;return}
   if(f.size>AT_RAW){toast('الملف كبير. الحد '+attKb(AT_RAW));attBusy=0;return}
   const r=await new Promise((ok,no)=>{const x=new FileReader();x.onload=()=>ok(String(x.result));x.onerror=no;x.readAsDataURL(f)}),
    mime=/^[A-Za-z0-9.+\/-]{1,80}$/.test(f.type||'')?f.type:'application/octet-stream';
   ATTP={t:'file',n:String(f.name).slice(0,100),m:mime,d:'data:'+mime+';base64,'+(r.split(',')[1]||'')}
  }
 }catch(e){toast(kind==='img'?'مقدرتش أجهز الصورة':'مقدرتش أقرا الملف')}
 attBusy=0;attPaint()}
function attDeck(id){
 const d=S.dk.find(x=>x.id==id);if(!d)return;
 const s=JSON.stringify({n:d.n,cards:d.cards.slice(0,500).map(c=>({f:c.f,b:c.b}))});
 if(s.length>600000){toast('الملف كبير جداً');return}
 ATTP={t:'deck',n:String(d.n).slice(0,100),m:'deck',d:s};ATTM=0;attPaint()}
function attPaint(){
 const e=$('atp');if(!e)return;
 if(ATTP){e.innerHTML=`<div class="att-chip">${ATTP.t==='img'?`<img src="${esc(ATTP.d)}" alt="">`:`<span style="font-size:22px">${ATTP.t==='deck'?'🗂':'📎'}</span>`}<div style="flex:1;min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(ATTP.n)}</b><small>${attKb(attSz(ATTP))}</small></div><button class="x" onclick="attClear()">✕</button></div>`;return}
 if(ATTM===1){e.innerHTML='<div class="att-menu"><button onclick="attPick(\'img\')">🖼 صورة</button><button onclick="attPick(\'file\')">📄 ملف</button><button onclick="ATTM=2;attPaint()">🗂 ملف حفظ</button></div>';return}
 if(ATTM===2){e.innerHTML=`<div class="att-menu col">${S.dk.length?S.dk.map(d=>`<button onclick="attDeck(${+d.id})">🗂 ${esc(d.n)} <small>(${d.cards.length} بطاقة)</small></button>`).join(''):'<small>معندكش ملفات حفظ لسه.</small>'}<button class="x" onclick="ATTM=0;attPaint()">إلغاء</button></div>`;return}
 e.innerHTML=''}
function attToggle(){if(ATTP)return;ATTM=ATTM?0:1;attPaint()}
function attClear(){ATTP=null;ATTM=0;attPaint()}
/* شريط الكتابة المشترك بين المحادثات الفردية والجروبات */
const vCompose=k=>{const snd=k==='g'?'sendGroupMsg()':'sendMsg()';return `<div id="atp"></div><div class="chat-compose"><button class="x" onclick="attToggle()" aria-label="إرفاق">📎</button><textarea id="mi" maxlength="1000" placeholder="اكتب رسالة..." ${k==='g'?'':'oninput="typ()"'} onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();${snd}}"></textarea><button class="pr" onclick="${snd}">➤</button></div>`};
