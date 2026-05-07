"""
neon-sort — standalone pygame port of the web app.

Mirrors the logic of /apps/neon-sort/index.html: bubble sort + quicksort +
insertion sort, all written as Python generators yielding step events
(`('compare', i, j)`, `('swap', i, j)`, `('sorted', i, None)`,
`('pivot', i, None)`, `('unpivot', i, None)`). The renderer drives N
events per frame at the user's chosen speed so the algorithm's runtime
is *visualised*, not faked.

Bars carry the same dance state as the web app: a per-bar sin-wobble
phase + jitter coefficient (random 0.8–1.2, baked once and preserved
across reshuffles), plus per-event pulse fields that decay each frame
adding height / glow / colored top caps.

Synth tones via pygame.mixer with a tone-cache keyed on (kind, rounded
freq) so we don't regenerate identical PCM buffers — triangle on
compare, sawtooth-with-chirp on swap, square on pivot, C-major arpeggio
on completion.

Controls:
  Space          play / pause
  S              step one event
  R              shuffle
  M              mute
  1 / 2 / 3      bubble / quick / insertion
  ↑ / ↓          speed up / slow down
  + / -          array size up / down
  Esc / Q        quit

Requires:  python -m pip install pygame
Run:       python neon_sort.py
"""

import array
import math
import random
import sys

try:
    import pygame
except ImportError:
    print("This script needs pygame. Install with:  python -m pip install pygame")
    sys.exit(1)


# --- config ---------------------------------------------------------------
WIDTH, HEIGHT = 1200, 720
FPS = 60
SAMPLE_RATE = 22050

# palette (matches the web app)
BG       = (7, 4, 26)
PANEL    = (10, 6, 38, 200)
PINK     = (255, 138, 214)
CYAN     = (122, 240, 255)
LIME     = (154, 255, 94)
VIOLET   = (180, 107, 255)
GOLD     = (255, 212, 94)
WHITE    = (230, 233, 255)
DIM      = (160, 170, 200)
HORIZON  = (255, 138, 214, 18)


# --- color helper ---------------------------------------------------------
def hsl_to_rgb(h, s, l):
    """h: 0–360, s/l: 0–1. Returns (r,g,b) bytes."""
    h = (h % 360) / 60.0
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs(h % 2 - 1))
    if   h < 1: r, g, b = c, x, 0
    elif h < 2: r, g, b = x, c, 0
    elif h < 3: r, g, b = 0, c, x
    elif h < 4: r, g, b = 0, x, c
    elif h < 5: r, g, b = x, 0, c
    else:        r, g, b = c, 0, x
    m = l - c / 2
    return (int((r + m) * 255), int((g + m) * 255), int((b + m) * 255))


# --- bar model ------------------------------------------------------------
class Bar:
    __slots__ = ("value", "phase", "jitter", "cmp_pulse", "swp_pulse", "sorted_", "pivot")

    def __init__(self, value):
        self.value = value
        # personality — sin phase + height jitter, baked at construction so
        # the bars retain their dance across reshuffles
        self.phase = random.uniform(0.0, math.tau)
        self.jitter = random.uniform(0.8, 1.2)
        self.cmp_pulse = 0.0
        self.swp_pulse = 0.0
        self.sorted_ = False
        self.pivot = False


def make_bars(n):
    bars = [Bar(i + 1) for i in range(n)]
    shuffle_bars(bars)
    return bars


def shuffle_bars(bars):
    vals = [b.value for b in bars]
    random.shuffle(vals)
    for i, b in enumerate(bars):
        b.value = vals[i]
        b.sorted_ = False
        b.pivot = False
        b.cmp_pulse = 0.0
        b.swp_pulse = 0.0


# --- algorithms (generators) ---------------------------------------------
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        did_swap = False
        for j in range(n - i - 1):
            yield ("compare", j, j + 1)
            if arr[j].value > arr[j + 1].value:
                yield ("swap", j, j + 1)
                arr[j].value, arr[j + 1].value = arr[j + 1].value, arr[j].value
                did_swap = True
        yield ("sorted", n - i - 1, None)
        if not did_swap:
            for k in range(n - i - 1):
                yield ("sorted", k, None)
            return
    yield ("sorted", 0, None)


def quick_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        yield ("pivot", hi, None)
        piv = arr[hi].value
        p = lo - 1
        for j in range(lo, hi):
            yield ("compare", j, hi)
            if arr[j].value <= piv:
                p += 1
                if p != j:
                    yield ("swap", p, j)
                    arr[p].value, arr[j].value = arr[j].value, arr[p].value
        yield ("swap", p + 1, hi)
        arr[p + 1].value, arr[hi].value = arr[hi].value, arr[p + 1].value
        yield ("sorted", p + 1, None)
        yield ("unpivot", hi, None)
        yield from quick_sort(arr, lo, p)
        yield from quick_sort(arr, p + 2, hi)
    elif lo == hi:
        yield ("sorted", lo, None)


def insertion_sort(arr):
    n = len(arr)
    yield ("sorted", 0, None)
    for i in range(1, n):
        j = i
        while j > 0:
            yield ("compare", j, j - 1)
            if arr[j].value < arr[j - 1].value:
                yield ("swap", j, j - 1)
                arr[j].value, arr[j - 1].value = arr[j - 1].value, arr[j].value
                j -= 1
            else:
                break
        yield ("sorted", i, None)


# --- audio ---------------------------------------------------------------
_tone_cache = {}


def make_tone(kind, freq, dur=0.16):
    """Generate a small PCM buffer for a single event tone. Cached on
    (kind, rounded-freq) so common pitches reuse buffers."""
    key = (kind, int(round(freq)))
    if key in _tone_cache:
        return _tone_cache[key]
    n = max(1, int(SAMPLE_RATE * dur))
    samples = array.array("h")
    amp = 0.18 * 32767
    for i in range(n):
        t = i / SAMPLE_RATE
        atk = min(1.0, t / 0.005)
        env = atk * math.exp(-t * (38 if kind == "compare" else 22))
        if kind == "compare":
            phase = (t * freq) % 1
            v = 4 * abs(phase - 0.5) - 1                       # triangle
        elif kind == "swap":
            f_now = freq * (1 + 0.4 * (t / dur))               # chirp up
            phase = (t * f_now) % 1
            v = 2 * phase - 1                                  # sawtooth
        elif kind == "pivot":
            phase = (t * freq) % 1
            v = 1 if phase < 0.5 else -1                       # square
        else:
            v = math.sin(2 * math.pi * freq * t)
        samples.append(int(v * amp * env))
    # pygame.mixer is initialised stereo — duplicate the mono buffer
    stereo = array.array("h")
    for s in samples:
        stereo.append(s)
        stereo.append(s)
    snd = pygame.mixer.Sound(buffer=stereo.tobytes())
    _tone_cache[key] = snd
    return snd


def make_win_chord():
    """Pre-bake a single C-major-arpeggio buffer for completion."""
    if "win" in _tone_cache:
        return _tone_cache["win"]
    dur = 0.9
    n = int(SAMPLE_RATE * dur)
    freqs = [261.63, 329.63, 392.00, 523.25]
    samples = array.array("h")
    amp = 0.20 * 32767
    for i in range(n):
        t = i / SAMPLE_RATE
        v = 0.0
        for k, f in enumerate(freqs):
            t0 = k * 0.06
            if t < t0:
                continue
            te = t - t0
            atk = min(1.0, te / 0.02)
            env = atk * math.exp(-te * 4.5)
            phase = (te * f) % 1
            v += (4 * abs(phase - 0.5) - 1) * env
        v *= 0.4
        samples.append(int(max(-1, min(1, v)) * amp))
    stereo = array.array("h")
    for s in samples:
        stereo.append(s)
        stereo.append(s)
    snd = pygame.mixer.Sound(buffer=stereo.tobytes())
    _tone_cache["win"] = snd
    return snd


def play_tone(state, value, kind):
    if state["muted"] or not state["audio_ok"]:
        return
    n = state["n"]
    freq = 220 + (value / max(1, n)) * 660
    try:
        make_tone(kind, freq).play()
    except pygame.error:
        pass


def play_win(state):
    if state["muted"] or not state["audio_ok"]:
        return
    try:
        make_win_chord().play()
    except pygame.error:
        pass


# --- rendering helpers ---------------------------------------------------
def round_rect(surf, color, rect, radius):
    """Tiny helper — pygame's draw.rect supports border_radius natively."""
    pygame.draw.rect(surf, color, rect, border_radius=int(radius))


def draw_glow(surf, color, rect, glow):
    """Stack three semi-transparent rects with BLEND_ADD to fake a halo.
    `glow` is the outer halo radius in pixels."""
    if glow <= 0:
        return
    g = max(2, int(glow))
    for k in range(3, 0, -1):
        a = max(8, 60 // k)
        pad = g * k
        s = pygame.Surface((rect.w + pad * 2, rect.h + pad * 2), pygame.SRCALPHA)
        pygame.draw.rect(
            s,
            (*color, a),
            (0, 0, rect.w + pad * 2, rect.h + pad * 2),
            border_radius=int(min(rect.w * 0.4, 6)),
        )
        surf.blit(s, (rect.x - pad, rect.y - pad), special_flags=pygame.BLEND_RGB_ADD)


# --- main ---------------------------------------------------------------
def run():
    # init audio first (pre_init has to fire before pygame.init)
    audio_ok = True
    try:
        pygame.mixer.pre_init(SAMPLE_RATE, -16, 2)
    except pygame.error:
        audio_ok = False
    pygame.init()
    if audio_ok:
        try:
            pygame.mixer.init()
        except pygame.error:
            audio_ok = False
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("neon-sort · dancing bars")
    clock = pygame.time.Clock()

    # font fallback chain — pick whatever monospace ships
    try:
        font_big = pygame.font.SysFont("ibmplexmono,jetbrainsmono,menlo,consolas,dejavusansmono,monospace", 22, bold=True)
        font_med = pygame.font.SysFont("ibmplexmono,jetbrainsmono,menlo,consolas,dejavusansmono,monospace", 16)
        font_sm  = pygame.font.SysFont("ibmplexmono,jetbrainsmono,menlo,consolas,dejavusansmono,monospace", 12)
    except Exception:
        font_big = pygame.font.Font(None, 22)
        font_med = pygame.font.Font(None, 16)
        font_sm  = pygame.font.Font(None, 12)

    state = {
        "algo": "bubble",
        "gen": None,
        "playing": False,
        "speed": 14,
        "cmp": 0,
        "swp": 0,
        "elapsed": 0.0,
        "done": False,
        "muted": False,
        "audio_ok": audio_ok,
        "beat_pulse": 0.0,
        "n": 40,
    }
    bars = make_bars(state["n"])

    def start_gen():
        if state["algo"] == "bubble":
            state["gen"] = bubble_sort(bars)
        elif state["algo"] == "quick":
            state["gen"] = quick_sort(bars)
        else:
            state["gen"] = insertion_sort(bars)

    def reset():
        shuffle_bars(bars)
        state["cmp"] = 0
        state["swp"] = 0
        state["elapsed"] = 0.0
        state["done"] = False
        start_gen()

    def apply_event(ev):
        kind, i, j = ev
        if kind == "compare":
            state["cmp"] += 1
            if 0 <= i < len(bars):
                bars[i].cmp_pulse = 1.0
            if j is not None and 0 <= j < len(bars):
                bars[j].cmp_pulse = 1.0
            play_tone(state, bars[i].value, "compare")
        elif kind == "swap":
            state["swp"] += 1
            if 0 <= i < len(bars):
                bars[i].swp_pulse = 1.0
            if j is not None and 0 <= j < len(bars):
                bars[j].swp_pulse = 1.0
            play_tone(state, bars[i].value, "swap")
        elif kind == "sorted":
            if 0 <= i < len(bars):
                bars[i].sorted_ = True
        elif kind == "pivot":
            if 0 <= i < len(bars):
                bars[i].pivot = True
            play_tone(state, bars[i].value, "pivot")
        elif kind == "unpivot":
            if 0 <= i < len(bars):
                bars[i].pivot = False

    def step():
        if state["gen"] is None:
            start_gen()
        try:
            ev = next(state["gen"])
            apply_event(ev)
            state["beat_pulse"] = min(1.0, state["beat_pulse"] + 0.04)
            return True
        except StopIteration:
            if not state["done"]:
                state["done"] = True
                for b in bars:
                    b.sorted_ = True
                    b.pivot = False
                play_win(state)
            state["playing"] = False
            return False

    def resize_array(new_n):
        nonlocal bars
        new_n = max(8, min(120, new_n))
        if new_n == state["n"]:
            return
        state["n"] = new_n
        bars = make_bars(new_n)
        reset()

    def change_algo(name):
        if name == state["algo"]:
            return
        state["algo"] = name
        reset()

    reset()

    # --- pre-render the static synthwave horizon to avoid per-frame cost ---
    bg = pygame.Surface((WIDTH, HEIGHT))
    bg.fill(BG)
    # three faint horizon lines
    for k in range(1, 5):
        y = int(HEIGHT * (0.2 * k))
        pygame.draw.line(bg, (40, 18, 70), (0, y), (WIDTH, y), 1)
    # pink+cyan radial-ish glows (just two large soft rects via gradient)
    halo = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
    for r in range(60, 0, -2):
        a = max(0, int(60 - r))
        pygame.draw.circle(halo, (255, 46, 156, a // 10), (220, 160), r * 6)
        pygame.draw.circle(halo, (48, 114, 200, a // 10), (WIDTH - 220, HEIGHT - 160), r * 6)
    bg.blit(halo, (0, 0), special_flags=pygame.BLEND_RGB_ADD)

    running = True
    while running:
        dt = clock.tick(FPS) / 1000.0
        # ── INPUT ─────────────────────────────────────────────────────────
        for ev in pygame.event.get():
            if ev.type == pygame.QUIT:
                running = False
            elif ev.type == pygame.KEYDOWN:
                k = ev.key
                if   k == pygame.K_ESCAPE or k == pygame.K_q: running = False
                elif k == pygame.K_SPACE:
                    if state["done"]:
                        reset()
                    state["playing"] = not state["playing"]
                elif k == pygame.K_s:
                    if state["done"]:
                        reset()
                    state["playing"] = False
                    step()
                elif k == pygame.K_r:
                    state["playing"] = False
                    reset()
                elif k == pygame.K_m:
                    state["muted"] = not state["muted"]
                elif k == pygame.K_1: change_algo("bubble")
                elif k == pygame.K_2: change_algo("quick")
                elif k == pygame.K_3: change_algo("insertion")
                elif k == pygame.K_UP:
                    state["speed"] = min(60, state["speed"] + 2)
                elif k == pygame.K_DOWN:
                    state["speed"] = max(1, state["speed"] - 2)
                elif k == pygame.K_PLUS or k == pygame.K_EQUALS:
                    resize_array(state["n"] + 8)
                elif k == pygame.K_MINUS:
                    resize_array(state["n"] - 8)

        # ── ADVANCE ALGORITHM ─────────────────────────────────────────────
        if state["playing"] and not state["done"]:
            state["elapsed"] += dt
            for _ in range(state["speed"]):
                if not step():
                    break

        # decay beat pulse
        state["beat_pulse"] = max(0.0, state["beat_pulse"] - 0.05)

        # ── RENDER ────────────────────────────────────────────────────────
        # trail fade — softens motion
        fade = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
        fade.fill((BG[0], BG[1], BG[2], 110))
        screen.blit(bg, (0, 0))
        screen.blit(fade, (0, 0))

        pad_x = 24
        pad_top = 96         # leave room for HUD across the top
        pad_bot = 70
        total_w = WIDTH - pad_x * 2
        total_h = HEIGHT - pad_bot - pad_top
        n = state["n"]
        bar_w = total_w / n
        gap = max(1.0, bar_w * 0.12)
        inner_w = bar_w - gap

        t_now = pygame.time.get_ticks() / 1000.0

        # baseline floor line
        pygame.draw.line(
            screen, PINK,
            (pad_x, HEIGHT - pad_bot),
            (WIDTH - pad_x, HEIGHT - pad_bot),
            1,
        )

        for i, b in enumerate(bars):
            idle_wobble = math.sin(t_now * 2.4 + b.phase) * 2 * b.jitter
            beat_boost  = (b.cmp_pulse + b.swp_pulse) * 6
            base_h      = (b.value / n) * total_h
            height      = base_h + idle_wobble + beat_boost + state["beat_pulse"] * 4
            x = pad_x + i * bar_w + gap * 0.5
            y = HEIGHT - pad_bot - height

            # hue from value — sorted array is a clean rainbow
            hue = (b.value / n) * 320 + 220
            sat = 0.95
            lum = 0.62 if b.sorted_ else 0.55
            body_color = hsl_to_rgb(hue, sat, lum)

            rect = pygame.Rect(int(x), int(y), max(1, int(inner_w)), max(1, int(height)))

            # glow halo — strongest on event, calmer when idle
            glow = 4 + (b.cmp_pulse + b.swp_pulse) * 12 + (12 if b.pivot else 0) + (3 if b.sorted_ else 0)
            glow_color = (
                VIOLET if b.pivot
                else GOLD if b.swp_pulse > 0.05
                else CYAN if b.cmp_pulse > 0.05
                else body_color
            )
            draw_glow(screen, glow_color, rect, glow)

            # body — two horizontal bands fake a vertical gradient
            top_color = hsl_to_rgb(hue, sat, min(0.85, lum + 0.18))
            bot_color = hsl_to_rgb(hue, sat, max(0.20, lum - 0.18))
            half_h = max(1, rect.h // 2)
            round_rect(screen, top_color, pygame.Rect(rect.x, rect.y, rect.w, half_h), 4)
            round_rect(screen, bot_color, pygame.Rect(rect.x, rect.y + half_h, rect.w, rect.h - half_h), 4)

            # top cap — bright sparkle
            cap_h = 2
            if b.sorted_:
                pygame.draw.rect(screen, LIME, (rect.x, rect.y, rect.w, cap_h))
            elif b.swp_pulse > 0.05:
                pygame.draw.rect(screen, GOLD, (rect.x, rect.y, rect.w, cap_h))
            elif b.cmp_pulse > 0.05:
                pygame.draw.rect(screen, CYAN, (rect.x, rect.y, rect.w, cap_h))
            elif b.pivot:
                pygame.draw.rect(screen, VIOLET, (rect.x, rect.y, rect.w, cap_h))

            # pivot frame
            if b.pivot:
                pygame.draw.rect(screen, VIOLET, rect.inflate(2, 2), 2, border_radius=4)

            # floor reflection — short alpha gradient strip
            ref_h = 16
            ref = pygame.Surface((rect.w, ref_h), pygame.SRCALPHA)
            for ry in range(ref_h):
                alpha = max(0, int(80 * (1 - ry / ref_h)))
                pygame.draw.line(ref, (*body_color, alpha), (0, ry), (rect.w, ry))
            screen.blit(ref, (rect.x, HEIGHT - pad_bot))

            # decay pulses
            b.cmp_pulse *= 0.86
            b.swp_pulse *= 0.88

        # ── HUD ───────────────────────────────────────────────────────────
        title = font_big.render("neon · sort  /  dancing bars", True, WHITE)
        screen.blit(title, (24, 16))
        algo_label = state["algo"].upper()
        algo_text  = font_med.render(f"[1] BUBBLE   [2] QUICK   [3] INSERTION    →  {algo_label}", True, PINK)
        screen.blit(algo_text, (24, 46))

        info_y = 70
        info = (
            f"compares: {state['cmp']:>5}     "
            f"swaps: {state['swp']:>5}     "
            f"size: {state['n']:>3}     "
            f"speed: {state['speed']:>2}     "
            f"time: {state['elapsed']:>4.1f}s"
        )
        info_text = font_med.render(info, True, DIM)
        screen.blit(info_text, (24, info_y))

        # right-aligned status pills
        right_x = WIDTH - 24
        if state["done"]:
            done = font_big.render("★ sorted ★", True, LIME)
            screen.blit(done, (right_x - done.get_width(), 16))
        playing_text = font_med.render(
            ("▶ playing" if state["playing"] else "❚❚ paused") +
            ("   ♪ off" if state["muted"] else "   ♪ on") +
            ("" if state["audio_ok"] else "   (audio unavailable)"),
            True,
            CYAN if state["playing"] else DIM,
        )
        screen.blit(playing_text, (right_x - playing_text.get_width(), 46))

        # legend along the bottom
        legend = font_sm.render(
            "space: play/pause   s: step   r: shuffle   m: mute   ↑/↓: speed   +/-: size   q/esc: quit",
            True, DIM,
        )
        screen.blit(legend, (24, HEIGHT - 22))

        pygame.display.flip()

    pygame.quit()


if __name__ == "__main__":
    run()
