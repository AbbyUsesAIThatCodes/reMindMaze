const CACHE='remindmaze-lanternlight-v1';
const FILES=['./','./index.html','./style.css','./favicon.svg','./src/app.js','./src/engine.js','./src/questions.js','./src/renderer.js','./src/inhabitants.js','./src/wiki.js','./src/audio.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('remindmaze-')&&k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith(fetch(event.request).catch(async()=>{
    const saved=await caches.match(event.request);if(saved)return saved;
    return new Response('This file is not available offline.',{status:503,headers:{'Content-Type':'text/plain'}});
  }));
});
