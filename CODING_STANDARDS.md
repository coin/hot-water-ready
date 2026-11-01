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
  hidden in the card. That covers every write path: websocket commands, actions, and entity
  services such as `number.set_value` or `switch.turn_on` (read the user from the entity's
  context). `tests/ha/test_permissions.py` refuses a stranger on every websocket command it
  finds registered; entity services and actions still need their own refusal test.
- Current APIs only: `runtime_data`, `ConfigEntry*` exceptions, `step_id` on every flow step,
  `Store` validated on load, `DeviceInfo` with keyword arguments.
- "Validated on load" means every field read from storage, nested shapes included, goes through
  a parser that turns anything unexpected into a default with a warning, and a test feeds it
  corrupt shapes (wrong types, naive datetimes). Setup never crashes on a bad file.
- A step never runs inside another. A task that calls services from a step is created with
  `eager_start=False`: HA starts tasks eagerly, a switch can write its new state before the
  first `await` returns, and its state listener then runs the next step inside the half-done
  one (ticket 08 found the heater's own commands doing this).
- Anything the heater switched on, it switches off when the entry unloads. With automatic
  control off the household runs the heater, and unloading leaves the relay as it is.

## Scheduling core

- When version 1's behaviour and the spec differ, the spec wins. A test carried over from version
  1 names the spec section it checks; a test that pins version 1 against the spec is a finding.
- `core/` decides; the HA layer reads entities, calls services and stores state. A rule about
  when to heat or what to tell someone belongs in `core/` with a scenario test.
- A ready time is a wall-clock time in the house's time zone and stays at it across
  daylight-saving changes (`core/ready_times.local_datetime`). Arithmetic on moments (leads,
  graces, gaps) happens in UTC: Python adds a timedelta to a local datetime as wall-clock time,
  which is an hour out on a change day, and subtracts two datetimes sharing a `tzinfo` the same
  way.
- A new controller rule gets a scenario test, and `tests/core/test_invariants.py` must still
  pass: it runs hundreds of random households and checks no chatter, nobody told twice, no relay
  on without a window. When a rule adds something that must always hold, add it there, with its
  can-fail test. A new field on `Settings` is varied in the random households too (`broken_rules`
  draws margin, gap and tank): the tank, added there only at review, at once showed a rule that
  could not tell two windows apart.

## Card

- Logic that decides what to show lives in plain modules with vitest tests; the Lit element
  only renders and wires events.
- Theme variables only; no `ha-*` elements except `ha-card`.
- The card has one stylesheet, so a class name means one thing in it. A new view's classes are
  checked against the existing ones: the week's `today` met the "Casa hoje" line's `.today` and
  its margins squeezed a column to 8px.

## Tests

- An assertion must be able to fail: `assert x is not None` after `x = a or b`, or a check on
  something the test itself just set, proves nothing. When a test passes on the first run,
  break the code it guards once and watch it fail.
- A new invariant in `tests/core/test_invariants.py` comes with a test that breaks the controller
  on purpose and expects the random households to catch it.
- `async_mock_service(hass, "switch", ...)` registered before the entry is set up is replaced
  when setup loads the switch component; register it after setup.
- Tests of what the heater sends to its element use the fakes in `tests/ha/fakes.py`, whose
  services change the device's state as a real relay or thermostat does. A bare mock that
  changes nothing hides commands sent twice or again every step. They write their state
  synchronously, as the quickest real switches do, which is what exposes a step run inside a
  step.
- A test that moves the clock more than 30 minutes and then talks to HA over HTTP or the
  websocket needs a token issued after the move: `access_token(hass, user)` in
  `tests/ha/conftest.py`. The fixtures' own tokens expire and give 401.
