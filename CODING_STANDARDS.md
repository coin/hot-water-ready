# Coding standards

Read by the reviewer. Mechanical rules live in the checks (`scripts/check`, `card/npm run check`,
`tests/test_repository.py`); this file holds the judgement calls.

## Language

- Code, identifiers, comments, commit messages and docs are in English.
- On-screen and notification text lives in the translation files (`translations/*.json`,
  `card/src/i18n.ts`): English, and European Portuguese (`pt`) with the spelling from before the
  1990 orthographic agreement (`actual`, `acção`, `objecto`). Brazilian vocabulary is a defect
  (`tela`, `usuário`, `arquivo`). Every key exists in both languages.

## Home Assistant layer

- Anything that outlives one setup of an entry (a websocket subscription, a dispatcher signal, a
  stored record) is keyed by the entry id, never held on the runtime object, which a reload
  replaces.
- Permissions are checked on the server against the calling user (spec section 2), never only
  hidden in the card.
- Current APIs only: `runtime_data`, `ConfigEntry*` exceptions, `step_id` on every flow step,
  `Store` validated on load, `DeviceInfo` with keyword arguments.

## Scheduling core

- `core/` decides; the HA layer reads entities, calls services and stores state. A rule about
  when to heat or what to tell someone belongs in `core/` with a scenario test.
- Times are timezone-aware local datetimes; a ready time stays at its wall-clock time across
  daylight-saving changes.

## Card

- Logic that decides what to show lives in plain modules with vitest tests; the Lit element
  only renders and wires events.
- Theme variables only; no `ha-*` elements except `ha-card`.
