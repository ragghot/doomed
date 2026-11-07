// Cache hors ligne de You're Døomed
// Change la version quand tu remplaces les fichiers, pour que l'iPhone prenne la mise à jour.
const CACHE = "youre-doomed-v7";
const FILES = ["./", "./index.html", "./macro.html", "./zxing.min.js", "./ciqual.js", "./foods.js", "./manifest.webmanifest", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;
  if (sameOrigin && url.pathname.startsWith("/api/")) return;   // synchro : toujours le réseau, jamais le cache

  // Pages de l'appli : réseau d'abord (pour les mises à jour), cache si hors ligne
  if (sameOrigin && (e.request.mode === "navigate" || url.pathname.endsWith(".html"))) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Le reste (icônes, polices) : cache d'abord
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }))
  );
});
