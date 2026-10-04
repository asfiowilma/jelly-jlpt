// Registers sw.js (relative, so its scope is the folder the app is served from).
// Skipped on file:// and non-http(s); failures are swallowed. Seam for the install/update UI (ticket 42):
//   window event 'sw-update-ready'   a new worker finished installing and waits (only when an old one controls the page)
//   window.__swApplyUpdate()         activates the waiting worker and reloads once; call only when no quiz/mock is running
(function () {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  var waiting = null, reloading = false;
  function ready(w) { waiting = w; window.dispatchEvent(new Event('sw-update-ready')); }
  window.__swApplyUpdate = function () { if (waiting) waiting.postMessage('SKIP_WAITING'); };
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (reloading || !waiting) return; // first install claims clients too: only reload for an update
    reloading = true; location.reload();
  });
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) ready(reg.waiting);
      reg.addEventListener('updatefound', function () {
        var w = reg.installing;
        if (w) w.addEventListener('statechange', function () {
          if (w.state === 'installed' && navigator.serviceWorker.controller) ready(w);
        });
      });
    }).catch(function (err) { console.info('Service worker not registered (app still works online):', err && err.message); });
  });
}());
