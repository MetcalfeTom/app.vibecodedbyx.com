/* ── SLOPPY-CTX BRIDGE (chrome-integration M2, wrapper side) ─────────────────
   FOR FELA: paste this whole block as its own <script> element in
   _bar/index.html, immediately before </body>. It is error-isolated (outer
   try/catch, every handler guarded) — a failure inside it cannot touch
   voting/search. REVERT = delete this one <script> block; additionally the
   kill switch below disables it live without any deploy.

   What it does: apps loaded in the wrapper's iframe can ask for the SloppyID
   context by posting {type:'sloppy-ctx-request'}; the wrapper answers with
   {type:'sloppy-ctx', v:1, ctx} and pushes updates when identity changes
   arrive on the site's existing BroadcastChannel('sloppy-sync') fabric.
   Strictly same-origin in both directions. Until a signed-in tab broadcasts,
   the answer is the honest anonymous context (username Guest, ready:false).

   Kill switch (rollback without deploy): localStorage sloppy-chrome-flags
   containing "noctx", or ?chrome=legacy on the wrapper URL → the bridge
   never installs, apps get silence, exactly the pre-M2 world.             */
(function () {
  try {
    var FLAGS = '';
    try { FLAGS = String(localStorage.getItem('sloppy-chrome-flags') || ''); } catch (e) {}
    if (FLAGS.indexOf('noctx') >= 0 || /[?&]chrome=legacy\b/.test(String(location.search || ''))) return;

    /* v1 contract — field names match sloppy-bar.js userContext, so the bar's
       own snapshot can flow through unchanged. Consumers ignore unknown keys. */
    var ctx = {
      isAuthenticated: false, userId: null, username: 'Guest', avatar: null, avatarUrl: null,
      karma: 0, trustScore: 0, verificationLevel: 0, unreadCount: 0, anonMode: true, ready: false
    };
    function merge(p) {
      try {
        for (var k in ctx) { if (Object.prototype.hasOwnProperty.call(p, k)) ctx[k] = p[k]; }
        ctx.ready = true;
      } catch (e) {}
    }
    function appFrame() {
      return document.getElementById('appframe') || document.querySelector('iframe');
    }
    function push() {
      try {
        var f = appFrame();
        if (f && f.contentWindow) f.contentWindow.postMessage({ type: 'sloppy-ctx', v: 1, ctx: ctx }, location.origin);
      } catch (e) {}
    }
    /* join the existing cross-tab fabric — the bar broadcasts identity here */
    try {
      var ch = new BroadcastChannel('sloppy-sync');
      ch.onmessage = function (ev) {
        try {
          var d = ev.data || {};
          if ((d.type === 'identity-changed' || d.type === 'context-snapshot') && d.payload) { merge(d.payload); push(); }
        } catch (e) {}
      };
    } catch (e) { /* no BroadcastChannel: request/response still works with the anon ctx */ }
    window.addEventListener('message', function (ev) {
      try {
        if (ev.origin !== location.origin) return;   /* strict same-origin, both directions */
        var d = ev.data || {};
        if (d && d.type === 'sloppy-ctx-request') push();
      } catch (e) {}
    });
  } catch (e) {}
})();
