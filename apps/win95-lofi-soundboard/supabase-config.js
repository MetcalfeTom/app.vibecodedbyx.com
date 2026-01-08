// Local Supabase config for Win95 Lo‑Fi app (safe DOM checks)
import { createBrowserClient } from "https://cdn.jsdelivr.net/npm/@supabase/ssr@0.7.0/+esm";

const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

const getCookieDomain = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isProduction = hostname === 'sloppy.live' || hostname === 'sloppy.live';
  return isProduction ? '.sloppy.live' : '.youreabsolutelyright.xyz';
};

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookieOptions: { name: 'sb-auth-token', domain: getCookieDomain(), path: '/', sameSite: 'lax' },
});

export default supabase;

export async function supabaseSession() {
  const sessRes = await supabase.auth.getSession();
  if (sessRes.error) throw new Error(`getSession failed: ${sessRes.error.message}`);
  let session = sessRes.data.session;
  if (!session) {
    const signRes = await supabase.auth.signInAnonymously();
    if (signRes.error) throw new Error(`Anonymous sign-in failed: ${signRes.error.message}`);
    session = signRes.data.session;
    if (!session) throw new Error('Anonymous sign-in returned no session');
    const { error: upsertError } = await supabase.from('users').upsert({ user_id: session.user.id, updated_at: new Date().toISOString() });
    if (upsertError) console.error('Create user record failed:', upsertError.message);
  }
  const user = session.user; if (!user?.id) throw new Error('Session has no user');
  return { client: supabase, session, user };
}

