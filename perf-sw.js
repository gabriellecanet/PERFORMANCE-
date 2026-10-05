/* PERFORMANCE · hors ligne + mises à jour automatiques */
const C='perf-cache-v1',FILES=['./perf-app.html','./perf.webmanifest','./perf-icon-192.png','./perf-icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Réseau d'abord (toujours la dernière version), cache si hors ligne ou réseau trop lent */
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 e.respondWith((async()=>{const net=fetch(r,{cache:'no-store'}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}return res});
  try{return await Promise.race([net,new Promise((_,rej)=>setTimeout(()=>rej(new Error('slow')),3500))])}
  catch(err){const m=await caches.match(r,{ignoreSearch:true})||(r.mode==='navigate'?await caches.match('./perf-app.html'):null);if(m)return m;return net}})())});
