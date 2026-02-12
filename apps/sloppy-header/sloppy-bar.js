/**
 * SloppyBar - Universal Identity Header for sloppy.live
 * Rebuilt for VibeLib Universal Layer
 */

(function() {
  'use strict';

  // Configuration
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const RECENT_APPS_KEY = 'sloppy_recent_apps';
  const MAX_RECENT_APPS = 8;

  // Get script options
  const script = document.currentScript;
  const options = {
    position: script?.getAttribute('data-position') || 'bottom',
    theme: script?.getAttribute('data-theme') || 'dark',
    minimized: script?.getAttribute('data-minimized') !== 'false',
    hideKarma: script?.getAttribute('data-hide-karma') === 'true',
    hideLinks: script?.getAttribute('data-hide-links') === 'true'
  };

  // State
  let userData = { karma: 0, rank: null, premium: false, username: 'Guest', avatar: null, trustScore: 0, verificationLevel: 0 };
  let isMinimized = options.minimized;
  let dropdownOpen = false;
  let onlineCount = 1;
  let currentUser = null;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  async function init() {
    // 1. Injection Logic (Crucial) - Must be first
    if (!window.VibeLib?.Economy) {
      console.log('SloppyBar: VibeLib missing, injecting bridge...');
      const script = document.createElement('script');
      script.src = '/vibelib-extended.js';
      document.head.appendChild(script);
      // Wait for load
      await new Promise(resolve => {
        script.onload = () => {
          console.log('SloppyBar: VibeLib injected successfully');
          resolve();
        };
        script.onerror = () => {
            console.error('SloppyBar: Failed to inject VibeLib');
            resolve();
        }
      });
    }

    // Now VibeLib and window.supabase should be available
    currentUser = await window.VibeLib.Auth.getUser();

    // Subscribe to presence
    initPresence();

    // Fetch initial data
    await fetchUserData();

    // Render
    render();

    // Track visit
    trackCurrentApp();

    // Listen for auth changes via VibeLib (which uses Supabase)
    window.supabase.auth.onAuthStateChange(async (event, session) => {
        currentUser = session?.user;
        await fetchUserData();
        render();
    });
  }

  function initPresence() {
      if (!window.supabase) return;
      const channel = window.supabase.channel('global_presence');
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          onlineCount = Object.keys(state).length || 1;
          render();
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
             const id = currentUser ? currentUser.id : ('anon-' + Math.random().toString(36).slice(2));
             await channel.track({ online_at: new Date().toISOString(), user_id: id });
          }
        });
  }

  async function fetchUserData() {
      if (!currentUser) {
          userData.username = 'Guest';
          userData.avatar = null;
          return;
      }

      // Fetch from Universal Profile
      try {
          const profile = await window.VibeLib.Identity.get(currentUser.id);
          if (profile) {
              userData.username = profile.username || 'Anon_' + currentUser.id.slice(0, 4);
              userData.avatar = profile.avatar_url || profile.avatar || '👤';
              // Check for theme colors if needed
          }
      } catch (e) {
          console.warn('SloppyBar: Failed to fetch profile', e);
      }

      // Fetch Karma/Stats using Universal Bridge
      try {
          const { balance } = await window.VibeLib.Economy.get(currentUser.id);
          userData.karma = balance;
      } catch (e) {
          console.warn('SloppyBar: Failed to fetch economy', e);
      }
  }

  function render() {
    let bar = document.getElementById('sloppy-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'sloppy-bar';
      document.body.appendChild(bar);
    }

    bar.className = 'sloppy-bar' + (isMinimized ? ' minimized' : '');

    // Styles
    if (!document.getElementById('sloppy-bar-style')) {
        const style = document.createElement('style');
        style.id = 'sloppy-bar-style';
        style.textContent = `
            .sloppy-bar {
                position: fixed;
                ${options.position}: 0;
                left: 0; right: 0;
                height: 40px;
                background: rgba(10, 10, 16, 0.95);
                backdrop-filter: blur(10px);
                border-${options.position === 'bottom' ? 'top' : 'bottom'}: 1px solid rgba(255,255,255,0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 15px;
                z-index: 99999;
                font-family: 'Segoe UI', sans-serif;
                color: #e0e0e0;
                box-sizing: border-box;
            }
            .sloppy-bar * { box-sizing: border-box; }
            .sloppy-bar-left, .sloppy-bar-center, .sloppy-bar-right {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .sloppy-bar-item {
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                font-size: 13px;
                text-decoration: none;
                color: inherit;
                transition: color 0.2s;
            }
            .sloppy-bar-item:hover { color: #fff; }
            .sloppy-avatar {
                width: 24px; height: 24px;
                border-radius: 50%;
                background: #333;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            .sloppy-avatar img { width: 100%; height: 100%; object-fit: cover; }
            .sloppy-badge {
                background: rgba(0, 255, 136, 0.1);
                color: #00ff88;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
            }
            .sloppy-login-btn {
                background: #00ff88;
                color: #000;
                border: none;
                padding: 4px 12px;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
            }
            .sloppy-login-btn:hover { background: #00dd77; }
        `;
        document.head.appendChild(style);
    }

    const avatarHtml = userData.avatar
        ? (userData.avatar.startsWith('http') ? `<img src="${userData.avatar}">` : userData.avatar)
        : '👤';

    bar.innerHTML = `
        <div class="sloppy-bar-left">
            <a href="/apps/sloppy-id/index.html" class="sloppy-bar-item">
                <div class="sloppy-avatar">${avatarHtml}</div>
                <span>${userData.username}</span>
            </a>
            ${userData.karma > 0 ? `<span class="sloppy-badge">⚡ ${userData.karma}</span>` : ''}
        </div>

        <div class="sloppy-bar-center">
             <span class="sloppy-bar-item" style="cursor:default">🟢 ${onlineCount} Live</span>
        </div>

        <div class="sloppy-bar-right">
            <a href="/apps/sloppy-desktop/index.html" class="sloppy-bar-item">🖥️ Desktop</a>
            <a href="/apps/sloppy-id/index.html" class="sloppy-bar-item">🪪 Profile</a>
            <a href="/apps/sloppy-karma/index.html" class="sloppy-bar-item">📊 Stats</a>
            ${!currentUser ?
                `<button class="sloppy-login-btn" onclick="VibeLib.Auth.login('google')">Login</button>` :
                `<button class="sloppy-bar-item" style="background:none;border:none;" onclick="VibeLib.Auth.logout()">🚪</button>`
            }
        </div>
    `;
  }

  // Helper for tracking visited apps
  function trackCurrentApp() {
    // Basic tracking impl
    try {
        const path = window.location.pathname;
        let visited = JSON.parse(localStorage.getItem(RECENT_APPS_KEY) || '[]');
        visited = visited.filter(p => p !== path);
        visited.unshift(path);
        localStorage.setItem(RECENT_APPS_KEY, JSON.stringify(visited.slice(0, MAX_RECENT_APPS)));
    } catch (e) {}
  }

})();
