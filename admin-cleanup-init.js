/* مسح الأدمن لحساب بالكامل: الرسايل + الصداقات + الـ username + ملف المستخدم */
async function admPurge(U,uid){
 const{fs}=U.m,ud=await fs.getDoc(fs.doc(U.db,'users',uid)),
  fr=await fs.getDocs(fs.query(fs.collection(U.db,'friendships'),fs.where('m','array-contains',uid)));
 for(const f of fr.docs){
  for(const sub of ['messages','typing']){
   const ms=await fs.getDocs(fs.collection(U.db,'friendships',f.id,sub));
   for(let i=0;i<ms.docs.length;i+=400){const b=fs.writeBatch(U.db);ms.docs.slice(i,i+400).forEach(d=>b.delete(d.ref));await b.commit()}
  }
  await fs.deleteDoc(f.ref)
 }
 try{await groupCleanup(U,fs,uid)}catch(e){}
 const un=ud.exists()?ud.data().username:'';
 if(un)await fs.deleteDoc(fs.doc(U.db,'usernames',un));
 try{await fs.deleteDoc(fs.doc(U.db,'states',uid))}catch(e){}
 if(ud.exists())await fs.deleteDoc(ud.ref)}

applyTheme();if(!S.seen)tab='wiz';render();nInit();cloudInit();gtCheck();admRestore();checkRegDone().then(ok=>{if(ok){msgInit();fsPush()}}).catch(()=>{});
