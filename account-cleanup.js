/* مسح بيانات الحساب عند الخروج: الصداقات + الـ username + ملف المستخدم (بيحرر الـ username) */
async function selfPurge(U,uid){
 msgStop();const{fs}=U.m;
 try{const fr=await fs.getDocs(fs.query(fs.collection(U.db,'friendships'),fs.where('m','array-contains',uid)));
  for(const d of fr.docs){try{await fs.deleteDoc(d.ref)}catch(e){}}}catch(e){}
 try{if(USER&&USER.username)await fs.deleteDoc(fs.doc(U.db,'usernames',USER.username))}catch(e){}
 try{await fs.deleteDoc(fs.doc(U.db,'states',uid))}catch(e){}
 try{await fs.deleteDoc(fs.doc(U.db,'users',uid))}catch(e){}}
