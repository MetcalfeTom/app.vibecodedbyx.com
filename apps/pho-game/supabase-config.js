// Updated to use @supabase/ssr for consistent cookie handling

import { createBrowserClient } from "https://cdn.jsdelivr.net/npm/@supabase/ssr@0.7.0/+esm";

const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

const getCookieDomain = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isProduction = hostname === 'sloppy.live' || hostname === 'sloppy.live';
  
  // For cross-subdomain cookie sharing, we need to set the domain to the root domain
  if (isProduction) {
    return '.sloppy.live';
  } else {
    return '.youreabsolutelyright.xyz'; // Enable cross-subdomain sharing for staging
  }
};

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookieOptions: {
    name: 'sb-auth-token',
    domain: getCookieDomain(),
    path: '/',
    sameSite: 'lax',
  },
});

export default supabase;

/** Returns { client, session, user } or throws on any failure. */
export async function supabaseSession() {
  const sessRes = await supabase.auth.getSession();
  if (sessRes.error) throw new Error(`getSession failed: ${sessRes.error.message}`);
  let session = sessRes.data.session;

  if (!session) {
    const signRes = await supabase.auth.signInAnonymously();
    if (signRes.error) throw new Error(`Anonymous sign-in failed: ${signRes.error.message}`);
    session = signRes.data.session;
    if (!session) throw new Error("Anonymous sign-in returned no session");

    // When a new anonymous user is created, add them to our public users table.
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({ user_id: session.user.id, updated_at: new Date().toISOString() });
    
    if (upsertError) {
      console.error('Error creating user record for new anonymous user:', upsertError.message);
    }
  }

  const user = session.user;
  if (!user?.id) throw new Error("Session has no user");

  return { client: supabase, session, user };
}

/**
 * Checks if the current user has premium status.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the user is premium, otherwise false.
 */
export async function isUserPremium() {
  try {
    const { user } = await supabaseSession();

    const { data, error } = await supabase
      .from("users")
      .select("purchased_at")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("Error fetching premium status:", error.message);
      }
      return false;
    }

    return !!data?.purchased_at;

  } catch (error) {
    console.error("Failed to check premium status:", error.message);
    return false;
  }
}

// --- Example Usage ---
// You can use this function to conditionally show or hide features.

async function displayContentBasedOnPremiumStatus() {
  const isPremium = await isUserPremium();

  if (isPremium) {
    document.getElementById("premium-content").style.display = "block";
    document.getElementById("upgrade-button").style.display = "none";
  } else {
    document.getElementById("premium-content").style.display = "none";
    document.getElementById("upgrade-button").style.display = "block";
  }
}

// Call the function when your app loads
displayContentBasedOnPremiumStatus();
