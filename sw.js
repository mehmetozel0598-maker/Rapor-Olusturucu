// Rapor Oluşturucu – çevrimdışı önbellek. Rapor içerikleri hiçbir zaman önbelleğe alınmaz veya gönderilmez.
// İnternet varken sayfa her açılışta sunucudan taze alınır; internet yoksa kayıtlı kopya açılır.
const CACHE='rapor-olusturucu-v1.0.3';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);if(u.origin!==location.origin)return;
  const isPage=req.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname)||/\.webmanifest$/.test(u.pathname);
  if(isPage){
    e.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res.ok){const a=res.clone(),b=res.clone();caches.open(CACHE).then(c=>{c.put(req,a);if(req.mode==='navigate')c.put('index.html',b);});}return res;})
      .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));return res;})));
});
