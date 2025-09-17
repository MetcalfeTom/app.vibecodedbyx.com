// This file should NEVER be edited by the AI

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = 'https://djnuhcpdvxonibujeorp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbnVoY3BkdnhvbmlidWplb3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzkzOTksImV4cCI6MjA3MzM1NTM5OX0.vzfNHL6b46vfuIct7K8OXTG_JT0lXoSVUU43xswnfbc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  }

  const user = session.user;
  if (!user?.id) throw new Error("Session has no user");

  return { client: supabase, session, user };
}