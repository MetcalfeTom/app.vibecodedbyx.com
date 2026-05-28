/**
 * Fixed wrapper for supabase-config.js
 *
 * Patches two issues in the read-only root config:
 * 1. Cookie domain: localhost/unknown hosts got '.youreabsolutelyright.xyz' which
 *    browsers silently reject. Now returns undefined (browser uses current hostname).
 * 2. DOM errors: displayContentBasedOnPremiumStatus() ran unconditionally on import,
 *    crashing on apps without premium-content/upgrade-button elements.
 *    Now exported as opt-in function, no auto-execution.
 *
 * Apps can import from this file instead of supabase-config.js:
 *   import supabase, { supabaseSession, isUserPremium } from '/supabase-config-fixed.js';
 */

import { createBrowserClient } from "https://cdn.jsdelivr.net/npm/@supabase/ssr@0.7.0/+esm";

const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

const getCookieDomain = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname.includes('sloppy.live')) return '.sloppy.live';
  if (hostname.includes('vibecodedbyx.com')) return '.vibecodedbyx.com';
  if (hostname.includes('youreabsolutelyright.xyz')) return '.youreabsolutelyright.xyz';
  return undefined;
};

const cookieDomain = getCookieDomain();
const cookieOpts = { name: 'sb-auth-token', path: '/', sameSite: 'lax' };
if (cookieDomain) cookieOpts.domain = cookieDomain;

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookieOptions: cookieOpts,
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
    if (!session) throw new Error("Anonymous sign-in returned no session");

    const { error: upsertError } = await supabase
      .from('users')
      .upsert({ user_id: session.user.id, updated_at: new Date().toISOString() });
    if (upsertError) {
      console.error('Error creating user record:', upsertError.message);
    }
  }

  const user = session.user;
  if (!user?.id) throw new Error("Session has no user");
  return { client: supabase, session, user };
}

export async function isUserPremium() {
  try {
    const { user } = await supabaseSession();
    const { data, error } = await supabase
      .from("users")
      .select("purchased_at")
      .eq("user_id", user.id)
      .single();
    if (error) {
      if (error.code !== "PGRST116") console.error("Premium check error:", error.message);
      return false;
    }
    return !!data?.purchased_at;
  } catch (error) {
    console.error("Failed to check premium status:", error.message);
    return false;
  }
}

export async function displayContentBasedOnPremiumStatus() {
  const premiumEl = document.getElementById("premium-content");
  const upgradeEl = document.getElementById("upgrade-button");
  if (!premiumEl && !upgradeEl) return;
  const isPremium = await isUserPremium();
  if (premiumEl) premiumEl.style.display = isPremium ? "block" : "none";
  if (upgradeEl) upgradeEl.style.display = isPremium ? "none" : "block";
}
