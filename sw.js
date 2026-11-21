// Clean-up worker: removes every saved copy, unregisters itself and reloads
// open windows, so the page loads straight from the server again.
// It has no fetch handler, so it never gets in the way of loading.
// (Saved days and balances live in localStorage and are not touched.)
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (err) { /* nothing to clear */ }
    try { await self.registration.unregister(); } catch (err) { /* already gone */ }
    try {
      const wins = await self.clients.matchAll({ type: "window" });
      wins.forEach((w) => { try { w.navigate(w.url); } catch (err) { /* ignore */ } });
    } catch (err) { /* ignore */ }
  })());
});
