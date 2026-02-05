/**
 * SloppyBar SharedWorker — Cross-tab sync coordinator
 *
 * One DB fetch serves all tabs. Provides:
 *  - Central context cache with 5-minute TTL
 *  - Leader election (lowest portId fetches from DB)
 *  - Event relay (broadcast from any tab to all others)
 *  - Heartbeat-based stale port cleanup
 *
 * The worker cannot access cookies/localStorage/DOM.
 * Supabase auth stays in tabs — the worker is purely cache + relay.
 */

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const HEARTBEAT_TIMEOUT = 45000;  // 45s without heartbeat = stale

let cachedContext = null;
let cacheTimestamp = 0;
let portCounter = 0;
const ports = new Map(); // portId -> { port, alive, tabId, app }
let leaderPortId = null;

function electLeader() {
  // Lowest living portId becomes leader
  let minId = Infinity;
  for (const [id, entry] of ports) {
    if (id < minId) minId = id;
  }
  const newLeader = minId < Infinity ? minId : null;
  const changed = newLeader !== leaderPortId;
  leaderPortId = newLeader;

  if (changed) {
    // Notify all tabs of new leader assignment
    for (const [id, entry] of ports) {
      try {
        entry.port.postMessage({ type: 'leader-assigned', isLeader: id === leaderPortId });
      } catch (e) { /* port may be dead */ }
    }
    // If cache is stale, ask new leader to fetch
    if (leaderPortId !== null && isCacheStale()) {
      const leader = ports.get(leaderPortId);
      if (leader) {
        try { leader.port.postMessage({ type: 'fetch-context' }); } catch (e) {}
      }
    }
  }
}

function isCacheStale() {
  return !cachedContext || (Date.now() - cacheTimestamp > CACHE_TTL);
}

function broadcastTabCount() {
  const count = ports.size;
  for (const [, entry] of ports) {
    try { entry.port.postMessage({ type: 'tab-count', count: count }); } catch (e) {}
  }
}

function removePort(portId) {
  ports.delete(portId);
  if (ports.size === 0) {
    leaderPortId = null;
    return;
  }
  if (portId === leaderPortId) {
    electLeader();
  }
  broadcastTabCount();
}

// Periodic cleanup of stale ports (no heartbeat)
setInterval(function() {
  const now = Date.now();
  for (const [id, entry] of ports) {
    if (now - entry.alive > HEARTBEAT_TIMEOUT) {
      removePort(id);
    }
  }
}, 15000);

self.onconnect = function(e) {
  const port = e.ports[0];
  const portId = ++portCounter;

  port.onmessage = function(ev) {
    const msg = ev.data;
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'register': {
        ports.set(portId, {
          port: port,
          alive: Date.now(),
          tabId: msg.tabId || null,
          app: msg.app || null
        });
        const wasEmpty = ports.size === 1;
        if (wasEmpty || leaderPortId === null) electLeader();

        port.postMessage({
          type: 'registered',
          portId: portId,
          isLeader: portId === leaderPortId,
          tabCount: ports.size,
          cachedContext: isCacheStale() ? null : cachedContext
        });
        broadcastTabCount();

        // If cache is stale and this is the leader, ask it to fetch
        if (portId === leaderPortId && isCacheStale()) {
          port.postMessage({ type: 'fetch-context' });
        }
        break;
      }

      case 'context-update': {
        // Leader sends fresh DB data
        if (msg.context) {
          cachedContext = msg.context;
          cacheTimestamp = Date.now();
          // Distribute to all tabs
          for (const [id, entry] of ports) {
            try {
              entry.port.postMessage({
                type: 'context-cached',
                context: cachedContext,
                fresh: true
              });
            } catch (e) {}
          }
        }
        break;
      }

      case 'request-context': {
        if (!isCacheStale() && cachedContext) {
          // Serve from cache
          port.postMessage({
            type: 'context-cached',
            context: cachedContext,
            fresh: false
          });
        } else if (leaderPortId !== null) {
          // Ask leader to fetch
          const leader = ports.get(leaderPortId);
          if (leader) {
            try { leader.port.postMessage({ type: 'fetch-context' }); } catch (e) {}
          }
        }
        break;
      }

      case 'event-broadcast': {
        // Relay event to all OTHER tabs
        for (const [id, entry] of ports) {
          if (id === portId) continue; // Don't echo back to sender
          try {
            entry.port.postMessage({
              type: 'event-relay',
              event: msg.event,
              data: msg.data || {},
              source: msg.source || null,
              timestamp: msg.timestamp || Date.now()
            });
          } catch (e) {}
        }
        break;
      }

      case 'heartbeat': {
        const entry = ports.get(portId);
        if (entry) entry.alive = Date.now();
        break;
      }

      case 'unregister': {
        removePort(portId);
        break;
      }
    }
  };

  // Handle port errors / disconnects
  port.onmessageerror = function() {
    removePort(portId);
  };
};
