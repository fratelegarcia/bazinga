const CACHE='bazinga-202610241211';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  const keep=e.request.url.startsWith(self.location.origin)||e.request.url.includes('fonts.g');
  const net=fetch(e.request).then(res=>{
    if(res.ok&&keep){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
    return res});
  // a page load on a very weak connection falls back to the cached game after 4 s instead of waiting forever
  const timed=e.request.mode==='navigate'?Promise.race([net,new Promise((_,no)=>setTimeout(no,4000))]):net;
  e.respondWith(timed.catch(()=>caches.match(e.request).then(hit=>hit||caches.match('index.html')).then(hit=>hit||net)))});
