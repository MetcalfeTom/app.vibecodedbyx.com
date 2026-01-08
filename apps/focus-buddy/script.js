import { supabaseSession, isUserPremium } from "../../supabase-config.js";

const state = {
  client: null,
  user: null,
  isPremium: false,
  mode: "focus",
  durations: {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  sessionsBeforeLong: 4,
  completedFocusSessions: 0,
  remainingSeconds: 25 * 60,
  timerId: null,
  startedAt: null,
  activeTaskId: null,
};

const els = {
  modeLabel: document.getElementById("mode-label"),
  sessionCount: document.getElementById("session-count"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  toggle: document.getElementById("toggle-btn"),
  skip: document.getElementById("skip-btn"),
  reset: document.getElementById("reset-btn"),
  progressFill: document.getElementById("progress-fill"),
  nextUp: document.getElementById("next-up"),
  taskForm: document.getElementById("task-form"),
  taskTitle: document.getElementById("task-title"),
  taskNotes: document.getElementById("task-notes"),
  taskList: document.getElementById("task-list"),
  taskEmpty: document.getElementById("task-empty"),
  taskTemplate: document.getElementById("task-template"),
  refreshBtn: document.getElementById("refresh-btn"),
  statToday: document.getElementById("stat-today"),
  statStreak: document.getElementById("stat-streak"),
  statTasks: document.getElementById("stat-tasks"),
  premiumForm: document.getElementById("premium-form"),
  focusInput: document.getElementById("duration-focus"),
  shortInput: document.getElementById("duration-short"),
  longInput: document.getElementById("duration-long"),
  sessionsInput: document.getElementById("sessions-before-long"),
  sessionTemplate: document.getElementById("session-template"),
  sessionLog: document.getElementById("session-log"),
  clearLogBtn: document.getElementById("clear-log-btn"),
  soundboard: document.getElementById("soundboard"),
  ambientToggle: document.getElementById("ambient-toggle"),
  ambientAudio: document.getElementById("ambient-audio"),
};

const settingsStorageKey = (userId) => `focus-buddy-settings:${userId}`;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return [minutes, seconds];
}

function updateTimerDisplay() {
  const [minutes, seconds] = formatTime(state.remainingSeconds);
  els.minutes.textContent = String(minutes).padStart(2, "0");
  els.seconds.textContent = String(seconds).padStart(2, "0");

  const totalSeconds = state.durations[state.mode] * 60;
  const progress = 1 - state.remainingSeconds / totalSeconds;
  els.progressFill.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;

  const nextMode = getNextMode(state.mode);
  const nextMinutes = state.durations[nextMode];
  els.nextUp.textContent = `Next: ${modeLabel(nextMode)} (${nextMinutes}m)`;

  els.modeLabel.textContent = modeLabel(state.mode);
  els.toggle.textContent = state.timerId ? "Pause" : `Start ${modeLabel(state.mode)}`;
  const cycleCount = state.completedFocusSessions % state.sessionsBeforeLong;
  els.sessionCount.textContent = `${cycleCount}/${state.sessionsBeforeLong}`;
}

function getNextMode(current) {
  if (current === "focus") {
    const countAfter = state.completedFocusSessions + 1;
    return countAfter % state.sessionsBeforeLong === 0 ? "longBreak" : "shortBreak";
  }
  return "focus";
}

function modeLabel(mode) {
  switch (mode) {
    case "focus":
      return "Focus";
    case "shortBreak":
      return "Short Break";
    case "longBreak":
      return "Long Break";
    default:
      return "Focus";
  }
}

function setMode(mode) {
  state.mode = mode;
  state.remainingSeconds = state.durations[mode] * 60;
  state.startedAt = null;
  els.progressFill.style.width = "0%";
  updateTimerDisplay();
}

function startTimer() {
  if (state.timerId) return;
  const totalSeconds = state.durations[state.mode] * 60;
  state.startedAt = new Date(Date.now() - (totalSeconds - state.remainingSeconds) * 1000);
  state.timerId = window.setInterval(tick, 1000);
  updateTimerDisplay();
}

function pauseTimer() {
  if (!state.timerId) return;
  window.clearInterval(state.timerId);
  state.timerId = null;
  // Snap remaining seconds to current elapsed time for precision
  if (state.startedAt) {
    const totalSeconds = state.durations[state.mode] * 60;
    const elapsed = Math.floor((Date.now() - state.startedAt.getTime()) / 1000);
    state.remainingSeconds = Math.max(0, totalSeconds - elapsed);
  }
  updateTimerDisplay();
}

function resetTimer() {
  pauseTimer();
  state.completedFocusSessions = 0;
  state.remainingSeconds = state.durations[state.mode] * 60;
  state.startedAt = null;
  updateTimerDisplay();
}

async function tick() {
  if (state.startedAt) {
    const totalSeconds = state.durations[state.mode] * 60;
    const elapsed = Math.floor((Date.now() - state.startedAt.getTime()) / 1000);
    state.remainingSeconds = Math.max(0, totalSeconds - elapsed);
  }
  updateTimerDisplay();

  if (state.remainingSeconds > 0) return;

  window.clearInterval(state.timerId);
  state.timerId = null;
  await handlePhaseComplete();
  setMode(getNextMode(state.mode));
}

async function handlePhaseComplete() {
  try {
    const endedAt = new Date();
    const durationMinutes = state.durations[state.mode];
    if (state.mode === "focus") {
      state.completedFocusSessions += 1;
    }
    if (state.mode === "longBreak") {
      state.completedFocusSessions = 0;
    }
    await logSession({
      durationMinutes,
      startedAt: state.startedAt,
      endedAt,
      phase: modeLabel(state.mode),
    });
    state.startedAt = null;
    await Promise.all([refreshStats(), loadSessionLog()]);
  } catch (error) {
    console.error("Failed to store session", error);
  }
}

async function logSession({ durationMinutes, startedAt, endedAt, phase }) {
  if (!state.client || !state.user) return;
  const payload = {
    user_id: state.user.id,
    duration_minutes: durationMinutes,
    started_at: startedAt ? startedAt.toISOString() : new Date(endedAt.getTime() - durationMinutes * 60 * 1000).toISOString(),
    ended_at: endedAt.toISOString(),
    phase,
  };
  if (state.activeTaskId) {
    payload.task_id = state.activeTaskId;
  }
  const { error } = await state.client.from("focus_sessions").insert(payload);
  if (error) {
    console.error("Error inserting session", error.message);
  }
}

async function loadTasks() {
  if (!state.client || !state.user) return;
  els.taskList.innerHTML = "";
  const { data, error } = await state.client
    .from("focus_tasks")
    .select("id, title, notes, is_complete, target_minutes")
    .eq("user_id", state.user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load tasks", error.message);
    els.taskEmpty.textContent = "Could not load tasks — check your network.";
    els.taskEmpty.style.display = "block";
    return;
  }

  if (!data || data.length === 0) {
    els.taskEmpty.style.display = "block";
    return;
  }

  els.taskEmpty.style.display = "none";

  data.forEach((task) => {
    const node = els.taskTemplate.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector("input[type='checkbox']");
    const title = node.querySelector(".title");
    const notesEl = node.querySelector(".notes");
    const startBtn = node.querySelector("[data-action='start']");
    const deleteBtn = node.querySelector("[data-action='delete']");

    node.dataset.id = task.id;
    title.textContent = task.title;
    notesEl.textContent = task.notes || "";
    notesEl.style.display = task.notes ? "block" : "none";

    if (task.is_complete) {
      checkbox.checked = true;
      title.classList.add("done");
    }

    if (state.activeTaskId === task.id) {
      node.classList.add("active-task");
    }

    checkbox.addEventListener("change", () => toggleTask(task.id, checkbox.checked));
    startBtn.addEventListener("click", () => focusTask(task.id, task.title, task.target_minutes));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    els.taskList.appendChild(node);
  });

  await refreshStats();
}

async function addTask(title, notes) {
  const payload = {
    user_id: state.user.id,
    title,
    notes: notes || null,
    is_complete: false,
    target_minutes: state.durations.focus,
    priority: null,
  };
  const { error } = await state.client.from("focus_tasks").insert(payload);
  if (error) {
    throw new Error(error.message);
  }
}

async function toggleTask(id, isComplete) {
  const { error } = await state.client
    .from("focus_tasks")
    .update({ is_complete: isComplete, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", state.user.id);
  if (error) {
    console.error("Failed to toggle task", error.message);
  } else {
    await refreshStats();
  }
}

async function deleteTask(id) {
  const { error } = await state.client
    .from("focus_tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", state.user.id);
  if (error) {
    console.error("Failed to delete task", error.message);
    return;
  }
  if (state.activeTaskId === id) {
    state.activeTaskId = null;
  }
  await loadTasks();
}

function focusTask(id, title, targetMinutes) {
  state.activeTaskId = id;
  if (targetMinutes && typeof targetMinutes === "number") {
    state.durations.focus = targetMinutes;
  }
  setMode("focus");
  updateActiveTaskHighlight();
  els.toggle.focus();
  els.toggle.textContent = "Start Focus";
}

function updateActiveTaskHighlight() {
  for (const item of els.taskList.children) {
    if (Number(item.dataset.id) === state.activeTaskId) {
      item.classList.add("active-task");
    } else {
      item.classList.remove("active-task");
    }
  }
}

async function refreshStats() {
  if (!state.client || !state.user) return;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: sessions, error: sessionsError } = await state.client
    .from("focus_sessions")
    .select("duration_minutes, created_at, phase")
    .eq("user_id", state.user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  if (sessionsError) {
    console.error("Failed to load sessions", sessionsError.message);
  } else if (sessions) {
    const todayMinutes = sessions
      .filter((s) => new Date(s.created_at) >= todayStart && s.phase === "Focus")
      .reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
    els.statToday.textContent = `${todayMinutes}m`;

    const streak = calculateStreak(sessions.filter((s) => s.phase === "Focus"));
    els.statStreak.textContent = String(streak);
  }

  const { data: taskData, error: taskError, count } = await state.client
    .from("focus_tasks")
    .select("id", { count: "exact" })
    .eq("user_id", state.user.id)
    .eq("is_complete", true);

  if (!taskError) {
    const total = typeof count === "number" ? count : taskData?.length || 0;
    els.statTasks.textContent = String(total);
  }
}

function calculateStreak(sessions) {
  if (!sessions.length) return 0;
  const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const daySet = new Set(
    sessions.map((session) => {
      const date = new Date(session.created_at);
      date.setHours(0, 0, 0, 0);
      return dayKey(date);
    })
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const working = new Date(cursor);

  while (true) {
    const key = dayKey(working);
    if (daySet.has(key)) {
      streak += 1;
      working.setDate(working.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

async function loadSessionLog() {
  if (!state.client || !state.user) return;
  els.sessionLog.innerHTML = "";
  const { data, error } = await state.client
    .from("focus_sessions")
    .select("id, phase, duration_minutes, created_at")
    .eq("user_id", state.user.id)
    .order("created_at", { ascending: false })
    .limit(15);

  if (error) {
    console.error("Failed to load session log", error.message);
    return;
  }

  if (!data || data.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No sessions logged yet. Press start and let's build momentum!";
    empty.style.color = "var(--text-muted)";
    els.sessionLog.appendChild(empty);
    return;
  }

  data.forEach((session) => {
    const node = els.sessionTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".phase").textContent = session.phase;
    const timestamp = new Date(session.created_at);
    const meta = `${session.duration_minutes || 0}m • ${timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    node.querySelector(".meta").textContent = meta;
    els.sessionLog.appendChild(node);
  });
}

async function clearSessionLog() {
  if (!state.client || !state.user) return;
  const confirmation = window.confirm("Clear your focus history? This cannot be undone.");
  if (!confirmation) return;
  const { error } = await state.client
    .from("focus_sessions")
    .delete()
    .eq("user_id", state.user.id);
  if (error) {
    console.error("Failed to clear log", error.message);
    return;
  }
  await loadSessionLog();
  await refreshStats();
}

function loadSavedSettings() {
  if (!state.user) return;
  try {
    const raw = localStorage.getItem(settingsStorageKey(state.user.id));
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (typeof saved.focus === "number") state.durations.focus = saved.focus;
    if (typeof saved.shortBreak === "number") state.durations.shortBreak = saved.shortBreak;
    if (typeof saved.longBreak === "number") state.durations.longBreak = saved.longBreak;
    if (typeof saved.sessionsBeforeLong === "number") state.sessionsBeforeLong = saved.sessionsBeforeLong;
    setMode("focus");
  } catch (error) {
    console.warn("Could not load saved settings", error);
  }
}

function persistSettings() {
  if (!state.user) return;
  const payload = {
    focus: state.durations.focus,
    shortBreak: state.durations.shortBreak,
    longBreak: state.durations.longBreak,
    sessionsBeforeLong: state.sessionsBeforeLong,
  };
  localStorage.setItem(settingsStorageKey(state.user.id), JSON.stringify(payload));
}

function populatePremiumInputs() {
  if (!state.isPremium || !els.premiumForm) return;
  els.focusInput.value = state.durations.focus;
  els.shortInput.value = state.durations.shortBreak;
  els.longInput.value = state.durations.longBreak;
  els.sessionsInput.value = state.sessionsBeforeLong;
}

function attachEventListeners() {
  els.toggle.addEventListener("click", () => {
    if (state.timerId) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  els.skip.addEventListener("click", async () => {
    const currentMode = state.mode;
    if (currentMode === "focus") {
      state.completedFocusSessions += 1;
    }
    if (currentMode === "longBreak") {
      state.completedFocusSessions = 0;
    }
    pauseTimer();
    state.startedAt = null;
    setMode(getNextMode(currentMode));
  });

  els.reset.addEventListener("click", () => {
    pauseTimer();
    setMode(state.mode);
  });

  els.taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.user) return;
    const title = els.taskTitle.value.trim();
    const notes = els.taskNotes.value.trim();
    if (!title) return;
    els.toggle.disabled = true;
    try {
      await addTask(title, notes);
      els.taskTitle.value = "";
      els.taskNotes.value = "";
      await loadTasks();
    } catch (error) {
      console.error("Failed to add task", error.message);
    } finally {
      els.toggle.disabled = false;
    }
  });

  els.refreshBtn.addEventListener("click", () => {
    loadTasks();
  });

  els.clearLogBtn.addEventListener("click", clearSessionLog);

  if (els.premiumForm) {
    els.premiumForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!state.isPremium) return;
      const focusVal = parseInt(els.focusInput.value, 10);
      const shortVal = parseInt(els.shortInput.value, 10);
      const longVal = parseInt(els.longInput.value, 10);
      const sessionsVal = parseInt(els.sessionsInput.value, 10);
      if (
        Number.isFinite(focusVal) &&
        Number.isFinite(shortVal) &&
        Number.isFinite(longVal) &&
        Number.isFinite(sessionsVal)
      ) {
        state.durations.focus = Math.max(5, focusVal);
        state.durations.shortBreak = Math.max(2, shortVal);
        state.durations.longBreak = Math.max(5, longVal);
        state.sessionsBeforeLong = Math.max(2, Math.min(8, sessionsVal));
        persistSettings();
        setMode("focus");
        populatePremiumInputs();
      }
    });
  }

  if (els.ambientToggle && els.ambientAudio) {
    els.ambientToggle.addEventListener("click", () => {
      if (els.ambientAudio.paused) {
        els.ambientAudio
          .play()
          .then(() => {
            els.ambientToggle.textContent = "Pause FocusFM 🔇";
          })
          .catch((error) => console.warn("Audio playback blocked", error));
      } else {
        els.ambientAudio.pause();
        els.ambientToggle.textContent = "Play FocusFM 🔊";
      }
    });
  }
}

async function hydrateSession() {
  try {
    const { client, user } = await supabaseSession();
    state.client = client;
    state.user = user;
    state.isPremium = await isUserPremium();
    loadSavedSettings();
    populatePremiumInputs();
    if (state.isPremium && els.soundboard) {
      els.soundboard.hidden = false;
    }
    await Promise.all([loadTasks(), loadSessionLog(), refreshStats()]);
  } catch (error) {
    console.error("Could not initiate session", error);
  }
}

function init() {
  attachEventListeners();
  setMode("focus");
  hydrateSession();
  updateTimerDisplay();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.timerId && state.startedAt) {
    const elapsed = Math.floor((Date.now() - state.startedAt.getTime()) / 1000);
    state.remainingSeconds = Math.max(0, state.durations[state.mode] * 60 - elapsed);
  }
});

init();
