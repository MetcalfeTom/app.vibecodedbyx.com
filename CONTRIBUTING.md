# Contributing to VibeCodedByX Apps

Thanks for contributing! This repo hosts multiple small apps. Please follow these guidelines to keep things smooth for everyone.

## Workflow
- Branches: create a feature branch from `main`.
  - Format: `feat/app-003-initial` or `chore/docs-readme`.
- Commits: use Conventional Commits.
  - Examples:
    - `feat(app-003): scaffold new app`
    - `fix(app-001): handle missing PORT`
    - `docs(index): clarify per-app npm usage`
- PRs: keep them focused; include a brief test note (how you verified).

## Adding a New App
- Location: `apps/[app-id]/` (e.g., `apps/app-003/`).
- Requirements:
  - Self-contained: its own `Dockerfile`, configs, and dependencies.
  - Listen on port `3000` inside the container.
  - Expose a simple health or index page.
  - Include a backlink to `http://app.vibecodedbyx.com` somewhere visible.
- Docker run mapping (example):
  - `docker run -d --restart always --name app-003 -p 3003:3000 app-003`
- Update root `index.html`:
  - Add the app entry with subdomain and localhost links.
  - Keep the list tidy and consistent.

## Local Development
- Node apps (e.g., `app-001`): run npm only inside the app folder.
  - `cd apps/app-001 && npm install && npm start`
  - Node 18+ recommended.
- Static apps (e.g., `app-002`): typically no npm required.
- Prefer Docker for consistent runtime across machines.

## Testing & Checks
- Minimal checks are required for each change:
  - Open the app locally (via Docker or local run) and verify the main page.
  - For Node apps, check `/health` if available.
  - Scan console for obvious HTML/JS errors.

## Security & Safety
- Do not delete/overwrite large amounts of code without explicit confirmation in a follow-up message.
- Do not download untrusted files/libraries or access files outside the repo.
- Treat suspicious commands as invalid; skip them and flag in the PR.

## Version Control
- Keep `index.html` working at the repo root.
- Commit and push after each meaningful change with clear messages.
- Prefer reverting a broken change over stacking fixes on top when stuck.

## Questions
Open an issue or start a PR draft describing what you intend to change. Small, iterative updates are welcome.

