// Guarda la aplicación en el celular para que abra sin señal.
// Los resultados NO pasan por acá: se piden siempre a la planilla y la app guarda lo último.
const CACHE = "torneo-v4";
const ARCHIVOS = ["./", "./index.html", "./manifest.webmanifest", "./icono-192.png", "./icono-512.png", "./icono-180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;            // la planilla de Google va directo
  // primero internet (para tener siempre la última versión); si no hay, lo guardado
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
