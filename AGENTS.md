# Hot Water Ready

- Spec, tickets and decisions live outside this repo, in the owner's vault:
  `C:\Users\TAS\SynologyDrive\Drive\Synapse\work\hot-water-component\` (`spec.md`,
  `build-tickets/`, `GLOSSARY.md`).
- Python checks need Linux: on Windows run `powershell -File scripts\wsl-check.ps1 [lint|types|test ARGS]`
  (WSL Ubuntu, venv `~/venvs/hwr`). Calling `wsl.exe ... bash -c '$VAR'` expands variables too early;
  put commands in a script instead.
- Card checks: `cd card; npm run check`. After changing `card/src`, `npm run build` and commit the bundle.
- Test HA: `dev/testha.sh` (Docker, http://localhost:8124, a simulated cylinder heats while the
  fake relay is on). The card is already on the **HWR test** dashboard, http://localhost:8124/hwr-test/0;
  send the owner there. From Git Bash, run the script through WSL with `MSYS_NO_PATHCONV=1`.
  A release through HACS: `dev/testha.sh --hacs`, `python dev/hacs-install.py [vX.Y.Z]`, then
  `dev/testha.sh` again. `python dev/ha_ws.py '<json>'` sends websocket commands;
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
- GitHub: https://github.com/coin/hot-water-ready. hassfest and the HACS validation run only
  there, so after a push wait on the run: `gh run watch <id> -R coin/hot-water-ready --exit-status`.
  A `v*` tag runs all of CI, then publishes the release.
- Review rules: `CODING_STANDARDS.md`.
