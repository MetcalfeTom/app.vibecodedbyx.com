// Vibe Writer — simple writing app with autosave and optional Supabase sync
// Self-contained, no build. Imports supabase-config.js from project root.

import { supabaseSession } from "../../supabase-config.js";

const el = (id) => document.getElementById(id);
const docListEl = el("docList");
const titleEl = el("title");
const contentEl = el("content");
const statusEl = el("status");
const errorBox = el("errors");
const errorLog = el("errorLog");
const searchEl = el("search");

const state = {
  user: null,
  client: null,
  supportsSupabase: true,
  current: { id: null, title: "", content: "" },
  list: [],
  saving: false,
  saveTimer: null,
};

const TABLE = "writer_documents"; // Columns: id (uuid), user_id (uuid), title (text), content (text), updated_at (timestamptz)

function setStatus(msg) {
  statusEl.textContent = msg;
}
function logError(err) {
  console.error(err);
  errorBox.hidden = false;
  const text = typeof err === "string" ? err : (err?.message || JSON.stringify(err));
  errorLog.textContent += `\n${new Date().toLocaleTimeString()} — ${text}`;
}

function localKey(id) { return `writer:doc:${id || "new"}`; }
function saveLocal(doc) {
  try { localStorage.setItem(localKey(doc.id), JSON.stringify({ title: doc.title, content: doc.content, updated_at: Date.now() })); }
  catch (e) { /* ignore */ }
}
function loadLocal(id) {
  try {
    const raw = localStorage.getItem(localKey(id));
    if (!raw) return null;
    const o = JSON.parse(raw);
    return { id: id || null, title: o.title || "", content: o.content || "", updated_at: o.updated_at || Date.now() };
  } catch { return null; }
}

function renderList(items) {
  const q = (searchEl.value || "").toLowerCase();
  docListEl.innerHTML = "";
  items
    .filter((d) => !q || (d.title || "").toLowerCase().includes(q) || (d.content || "").toLowerCase().includes(q))
    .sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0))
    .forEach((d) => {
      const li = document.createElement("li");
      li.innerHTML = `<div>${d.title || "Untitled"}</div><div class="meta">${new Date(d.updated_at || Date.now()).toLocaleString()}</div>`;
      li.addEventListener("click", () => openDoc(d));
      docListEl.appendChild(li);
    });
}

function applyDoc(doc) {
  state.current = { id: doc?.id || null, title: doc?.title || "", content: doc?.content || "" };
  titleEl.value = state.current.title;
  contentEl.value = state.current.content;
  setStatus(state.supportsSupabase ? "Ready (cloud)" : "Ready (local)");
  // update URL
  const url = new URL(location.href);
  if (state.current.id) url.searchParams.set("id", state.current.id); else url.searchParams.delete("id");
  history.replaceState(null, "", url.toString());
}

function newDoc() {
  applyDoc({ id: null, title: "", content: "" });
  titleEl.focus();
}

async function loadList() {
  // Start with local stub list if available
  const locals = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("writer:doc:")) {
        const id = k.split(":")[2];
        const d = loadLocal(id);
        if (d) locals.push(d);
      }
    }
  } catch {}
  renderList(locals);

  if (!state.supportsSupabase) return;
  try {
    const { data, error } = await state.client
      .from(TABLE)
      .select("id, title, content, updated_at, user_id")
      .eq("user_id", state.user.id)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    const rows = (data || []).map((r) => ({ ...r, updated_at: new Date(r.updated_at).getTime() }));
    state.list = rows;
    renderList(rows);
  } catch (e) {
    // table probably doesn't exist yet — continue in local-only mode
    state.supportsSupabase = false;
    setStatus("Cloud unavailable — local only");
    logError(e);
  }
}

async function openDoc(doc) {
  // Prefer supabase fetch if id exists and cloud is available
  if (doc?.id && state.supportsSupabase) {
    try {
      const { data, error } = await state.client.from(TABLE).select("id, title, content, updated_at, user_id").eq("id", doc.id).single();
      if (error) throw error;
      applyDoc({ ...data, updated_at: new Date(data.updated_at).getTime() });
      return;
    } catch (e) {
      logError(e);
    }
  }
  // fallback to local
  const local = loadLocal(doc?.id || null) || { id: doc?.id || null, title: doc?.title || "", content: doc?.content || "" };
  applyDoc(local);
}

async function saveDoc(manual = false) {
  const doc = {
    id: state.current.id,
    title: titleEl.value.trim(),
    content: contentEl.value,
  };
  saveLocal({ ...doc, id: doc.id || "draft" });

  if (!state.supportsSupabase) {
    if (manual) setStatus("Saved locally");
    return;
  }

  if (state.saving) return; // debounce
  state.saving = true;
  setStatus("Saving…");
  try {
    if (!doc.id) {
      // insert new; must pass user_id
      const { data, error } = await state.client
        .from(TABLE)
        .insert([{ title: doc.title || "Untitled", content: doc.content || "", user_id: state.user.id }])
        .select()
        .single();
      if (error) throw error;
      state.current.id = data.id;
      applyDoc({ id: data.id, title: data.title, content: data.content });
    } else {
      const { error } = await state.client
        .from(TABLE)
        .update({ title: doc.title || "Untitled", content: doc.content || "" })
        .eq("id", doc.id)
        .eq("user_id", state.user.id);
      if (error) throw error;
    }
    setStatus("Saved");
    await loadList();
  } catch (e) {
    setStatus("Save failed (local ok)");
    state.supportsSupabase = false; // fall back if permission/schema error
    logError(e);
  } finally {
    state.saving = false;
  }
}

async function deleteDoc() {
  if (!state.current.id) {
    applyDoc({ id: null, title: "", content: "" });
    setStatus("Cleared draft");
    return;
  }
  if (!confirm("Delete this document? This cannot be undone.")) return;
  // local cleanup
  try { localStorage.removeItem(localKey(state.current.id)); } catch {}
  if (!state.supportsSupabase) { newDoc(); await loadList(); return; }
  try {
    const { error } = await state.client.from(TABLE).delete().eq("id", state.current.id).eq("user_id", state.user.id);
    if (error) throw error;
    newDoc();
    await loadList();
    setStatus("Deleted");
  } catch (e) {
    logError(e);
    setStatus("Delete failed");
  }
}

function shareLink() {
  const url = new URL(location.href);
  if (!state.current.id) {
    setStatus("Save first to get a link");
    return;
  }
  url.searchParams.set("id", state.current.id);
  navigator.clipboard?.writeText(url.toString()).then(() => setStatus("Link copied"))
    .catch(() => { setStatus("Copy failed — select URL"); alert(url.toString()); });
}

function scheduleAutosave() {
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(() => saveDoc(false), 800);
}

// Wire up events
el("newBtn").addEventListener("click", newDoc);
el("saveBtn").addEventListener("click", () => saveDoc(true));
el("deleteBtn").addEventListener("click", deleteDoc);
el("shareBtn").addEventListener("click", shareLink);
titleEl.addEventListener("input", scheduleAutosave);
contentEl.addEventListener("input", scheduleAutosave);
searchEl.addEventListener("input", () => renderList(state.list));

// Bootstrap
(async function init() {
  setStatus("Starting…");
  try {
    const { client, user } = await supabaseSession();
    state.client = client;
    state.user = user;
  } catch (e) {
    // If auth fails we still offer local-only mode
    state.supportsSupabase = false;
    logError(e);
  }

  await loadList();

  // If URL has ?id, try open; else load local draft
  const id = new URL(location.href).searchParams.get("id");
  if (id) {
    await openDoc({ id });
  } else {
    const draft = loadLocal("draft");
    if (draft) applyDoc(draft); else newDoc();
  }

  setStatus(state.supportsSupabase ? "Ready (cloud)" : "Ready (local)");
})();

