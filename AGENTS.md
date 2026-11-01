# Hot Water Ready

- Spec, tickets and decisions live outside this repo, in the owner's vault:
  `C:\Users\TAS\SynologyDrive\Drive\Synapse\work\hot-water-component\` (`spec.md`,
  `build-tickets/`, `GLOSSARY.md`).
- Python checks need Linux: on Windows run `powershell -File scripts\wsl-check.ps1 [lint|types|test ARGS]`
  (WSL Ubuntu, venv `~/venvs/hwr`). Calling `wsl.exe ... bash -c '$VAR'` expands variables too early;
  put commands in a script instead.
- Card checks: `cd card; npm run check`. After changing `card/src`, `npm run build` and commit the bundle.
- Test HA: `dev/testha.sh` (Docker, http://localhost:8124, a simulated cylinder heats while the
  fake relay is on); `python dev/ha_ws.py '<json>'` sends websocket commands;
  `cd card; node browser-check.mjs firefox` reloads the test dashboard, then opens each view at
  phone width and fails on anything past the card's edge or cut; run it after a layout change (a
  dashboard path such as `/hwr-test/0` passed from Git Bash is rewritten into a Windows path:
  run it from PowerShell). A new card build gets a new URL only when HA restarts. After a new card build,
  load the dashboard twice: on 2026.10 the first load can come from a cached `index.html`.
- Portuguese on-screen text: `python scripts/lint-pt-strings.py` runs the owner's PT-PT lint over
  `translations/pt.json` and the card's `pt` strings (the lint lives outside the repo, not in CI).
- Commits run `.githooks/pre-commit` (lint, card bundle): `git config core.hooksPath .githooks`
  once per clone. Never commit past it.
- Every check reformats with ruff, so text copied from earlier output goes stale: read a file
  again before editing it.
- Review rules: `CODING_STANDARDS.md`.
