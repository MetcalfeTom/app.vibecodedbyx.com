// Local Supabase config (safe for this app)
import { createBrowserClient } from "https://cdn.jsdelivr.net/npm/@supabase/ssr@0.7.0/+esm";

const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

const getCookieDomain = () => {
  const h = typeof window !== 'undefined' ? window.location.hostname : '';
  const prod = h === 'sloppy.live' || h === 'sloppy.live';
  return prod ? '.sloppy.live' : '.youreabsolutelyright.xyz';
};

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, { cookieOptions: { name:'sb-auth-token', domain:getCookieDomain(), path:'/', sameSite:'lax' } });
export default supabase;

export async function supabaseSession(){
  const s = await supabase.auth.getSession(); if (s.error) throw new Error(`getSession failed: ${s.error.message}`); let session = s.data.session;
  if (!session){ const r = await supabase.auth.signInAnonymously(); if (r.error) throw new Error(`Anonymous sign-in failed: ${r.error.message}`); session = r.data.session; if (!session) throw new Error('Anonymous sign-in returned no session'); await supabase.from('users').upsert({ user_id: session.user.id, updated_at: new Date().toISOString() }); }
  const user = session.user; if (!user?.id) throw new Error('Session has no user'); return { client: supabase, session, user };
}

