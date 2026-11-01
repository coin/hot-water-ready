# Hot Water Ready

- Spec, tickets and decisions live outside this repo, in the owner's vault:
  `C:\Users\TAS\SynologyDrive\Drive\Synapse\work\hot-water-component\` (`spec.md`,
  `build-tickets/`, `GLOSSARY.md`).
- Python checks need Linux: on Windows run `powershell -File scripts\wsl-check.ps1 [lint|types|test ARGS]`
  (WSL Ubuntu, venv `~/venvs/hwr`). Calling `wsl.exe ... bash -c '$VAR'` expands variables too early;
  put commands in a script instead.
- Card checks: `cd card; npm run check`. After changing `card/src`, `npm run build` and commit the bundle.
- Test HA: `dev/testha.sh` (Docker, http://localhost:8124); `python dev/ha_ws.py '<json>'` sends
  websocket commands; `cd card; node browser-check.mjs firefox` reloads the test dashboard.
- Review rules: `CODING_STANDARDS.md`.
