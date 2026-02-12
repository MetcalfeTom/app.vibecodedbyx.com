(async function() {
  'use strict';

  // 1. The Super Client (Override Dead Config)
  const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

  let client;

  try {
    const { createBrowserClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/ssr@0.1.0/+esm');
    const cookieDomain = window.location.hostname.includes('sloppy.live') ? '.sloppy.live' : undefined;

    client = createBrowserClient(SUPABASE_URL, SUPABASE_KEY, {
      cookieOptions: {
        domain: cookieDomain,
        name: 'sb-auth-token',
        path: '/',
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
      }
    });
  } catch (e) {
    console.warn('VibeLib: @supabase/ssr failed to load, falling back to supabase-js', e);
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // Global Expose
  window.supabase = client;
  console.log('VibeLib: Supabase client initialized and exposed as window.supabase');

  // 2. The Namespace Extension
  window.VibeLib = window.VibeLib || {};

  // VibeLib.Identity
  window.VibeLib.Identity = {
    async get(id) {
      if (!id) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return null;
        id = user.id;
      }
      const { data, error } = await client
        .from('universal_profiles')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('VibeLib.Identity.get error:', error);
        // Fallback to empty profile if not found, to avoid breaking callers
        return { user_id: id };
      }
      return data || { user_id: id };
    },

    async update(data) {
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await client
        .from('universal_profiles')
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('VibeLib.Identity.update error:', error);
        throw error;
      }
    }
  };

  // VibeLib.Economy
  window.VibeLib.Economy = {
    async track(domain, amount, reason = null) {
      const { data: { user } } = await client.auth.getUser();
      if (!user) return; // Can't track for anon/logged out efficiently without user_id

      const { error } = await client
        .from('economy_ledger')
        .insert({
          user_id: user.id,
          domain,
          amount,
          reason: reason || 'app_action'
        });

      if (error) {
        console.error('VibeLib.Economy.track error:', error);
        // Non-blocking, don't throw
      }
    }
  };

  // VibeLib.Desktop
  window.VibeLib.Desktop = {
    openWindow(appUrl, title) {
      console.log('VibeLib.Desktop.openWindow:', title, appUrl);
      window.parent.postMessage({ type: 'OPEN_WINDOW', url: appUrl, title: title }, '*');
    }
  };

  // VibeLib.Auth
  window.VibeLib.Auth = {
    async login(provider = 'google') {
        const { error } = await client.auth.signInWithOAuth({
            provider: provider,
            options: {
              redirectTo: window.location.origin + window.location.pathname
            }
        });
        if (error) throw error;
    },
    async logout() {
        const { error } = await client.auth.signOut();
        if (error) throw error;
        window.location.reload();
    },
    async getUser() {
        const { data: { user } } = await client.auth.getUser();
        return user;
    }
  };

  console.log('VibeLib: Extensions loaded (Identity, Economy, Desktop, Auth)');

})();
