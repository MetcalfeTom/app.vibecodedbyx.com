log:
- v1: Initial Mouse Mood Reader. Tracks pointer movement for 5s window, computes features (speed, variance, turns, straightness, idle, accel var), heuristic mood guess with confidence. Supabase feedback table added.

issues:
- Mobile touch works with Pointer Events; confidence may be lower due to shorter paths. Encourage scribbling for ~5s.
- Heuristics are subjective; tune thresholds if users report mismatches.

todos:
- Add calibration mode and per-user baseline.
- Add timeline graph and radar chart of features.
- Aggregate community feedback to refine weights.

notes:
- Table: mouse_mood_feedback (mood_guess text, mood_user text, features jsonb, user_id uuid, timestamps). RLS default (public read, own write).
- Always pass user_id on insert.

