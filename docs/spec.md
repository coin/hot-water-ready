# Hot Water Ready: specification

What the integration and its card must do, and why where it is not obvious. The code cites this
file by section ("spec 4.2"); keep the numbering when editing. Decisions taken after the first
version are in [decisions/](decisions/README.md) and cited as "decision 15". The
[README](../README.md) is the user's guide; this file is the contract behind it.

A change in behaviour updates this file in the same commit, or adds a decision record.

## 1. What it is

A Home Assistant custom integration, **Hot Water Ready** (domain `hot_water_ready`), that makes
stored hot water ready when the members of a household want it, one stored-water heater per
integration entry. It brings its own dashboard card. Showers are the default wording; nothing
ties it to showers, to a particular heater or to one country. It is shared through the Home
Assistant Marketplace (HACS) as a custom repository.

## 2. People and permissions

- **Member**: someone the heater makes water ready for. **Linked** members are tied to a Home
  Assistant person; **virtual** members (such as "Global" or "Guests") have no person.
- **Admin** (a Home Assistant administrator): sees and edits every member, adds and removes
  members, changes the heater settings, cancels anyone's heat-now request.
- **Linked member**: edits only their own ready times and away; sees the rest of the household
  read-only.
- **Who may switch off the heating for everyone**: admins, and a list of people chosen in the
  options. Whoever asked for heat now may always cancel their own request.
- All of this is **enforced on the server** (websocket commands and actions check the calling
  user), not only hidden in the card. Home Assistant's permission policies cover only entities,
  so the integration checks `user.is_admin` and the person whose `user_id` matches the caller.
  Automations and Home Assistant itself may do anything.
- **Visibility** ([decision 15](decisions/0015-member-visibility.md)): a member is public (the
  default) or private. A private member's ready times and heat-now requests are left out of what
  other non-admin members see, and heating shows to them only for their own times or requests,
  from when their own window would start; the element's state and power are left out for them
  whenever they have someone hidden. The calendar and the next-ready-time sensors leave private
  times out for everyone; the status sensor stays true. A linked member sets their own; an admin
  sets a virtual member's, never another person's.

## 3. Configuration

### 3.1 The heater (config entry)

Chosen in the setup flow; the heater setup changes with *Reconfigure*, the rest in the options:

- **Heater setup**: (a) a `switch` plus a temperature sensor, the integration running the on/off
  band itself; or (b) an existing `climate` entity with the modes `heat` and `off`, the
  integration setting its target and mode. A temperature sensor in the water is required in both.
- Optional: a power sensor; tank volume and element power (enable heating higher for clusters,
  4.5, and kWh estimates without a power sensor).
- Optional: a second temperature probe lower in the tank, the heights of both probes, the tank's
  position (standing or lying) and where the element sits (4.2, 4.8).
- Highest temperature for heating higher (default 50 °C, the scald limit without a mixing valve;
  up to 60 °C only with one).
- Keep-heating-through gap (default 40 min); time heat now keeps the water hot after its message
  (default 5 min); heating rate fixed by hand (default empty: learned).
- Solar-aware rule (default off).
- Who may switch off the heating for everyone; whether "ready" replaces "heating" on phones.
- Fault recipients (default every admin).
- Advanced, collapsed: fault thresholds (defaults in 4.8).

On Home Assistant 2026.10 the flows use a menu or a second step where 2026.11 could hide fields
with `visible` (see 8).

### 3.2 Members (config subentries)

One subentry per member, under its heater. Fields: name, colour (the card's avatar), type
(linked or virtual), the person (linked), notification targets (empty means "find my phones
automatically"; otherwise an explicit list of notify entities), recipients for a virtual member
(possibly none). Members belong to one heater; a household with two heaters sets people up per
heater.

### 3.3 Ready times, away and visibility (component storage)

Kept in the integration's own storage, one store per heater, edited from the card and through
actions, so frequent edits never reload the integration.

- **Ready time**: a time of day, the weekdays it applies to, on or off. A member's list starts
  empty and has any number of entries, including several on the same day. Each has a stable id.
- **Away**: pauses all of a member's ready times without losing them, with an optional last day
  after which it ends by itself.
- **Visibility**: `public` or `private`, stored as a value rather than a boolean so another level
  can be added without migrating data.

Stored data is validated on load, not only on write; anything unknown falls back to the default.

## 4. Behaviour

### 4.1 Windows

Every enabled ready time of a member who is not away becomes a **window**: from the start the
lead gives (4.2) to a short grace after the ready time (15 min). Windows are merged when they
overlap or when the gap between them is shorter than the keep-heating-through gap; the heater
then keeps heating through the whole cluster rather than letting the water cool between showers.

All times are real local dates and times: a 07:00 ready time stays at 07:00 across the clocks
changing, and windows crossing midnight work in both directions.

### 4.2 Lead (when to start)

- Lead = (target minus the water temperature now) times the heating rate in minutes per degree,
  plus a margin (15 min), capped (240 min).
- The **heating rate is learned** from the heater's own clean runs: started with the sun down,
  over 15 min, a rise of more than 3 °C, no water drawn (no fall over 1 °C). The median of the
  last week once there are three; 7 min per degree until then. A rate fixed by hand overrides it.
  The settings sheet can relearn it from the last week of Home Assistant's history.
- With **two probes**, the water temperature the lead uses is a weighted mean: each probe counts
  for the heated water nearest it, the water above the element split halfway between the probes,
  as volumes (a straight cut in a standing tank, circle segments in a lying one). Without both
  heights, half each. A suspect second probe (4.8) is left out until it reads properly again.
- With volume and element power, the tank's position and the element's height give the range of
  heating rates physics allows, from only the water above the element to the whole tank; the
  settings sheet warns when the learned rate is far outside it.
- Warm water (from solar or otherwise) shortens the lead to nothing, so the heater stays off when
  the water is already warm enough.
- **Once the heater has started for a window, it carries on until the water is ready**; the
  window does not re-decide every minute.

### 4.3 Solar-aware lead (observe first)

The integration always measures the solar rise (the water temperature trend over the last 15 to
30 minutes while the heater is off) and always computes the solar-aware decision: heater off if
the sun alone arrives in time; otherwise start by the combined rate (heater plus sun); the heater
rate alone when the trend is flat or falling. A switch, off by default, decides whether that
decision is applied; off, the rule of 4.2 is applied and the solar-aware result is recorded
beside it for the comparison (7).

### 4.4 Temperature band

Ready means the water is at or above the **target** (default 42 °C, 30 to 75 °C). Heating stops
at target plus the **margin** (default 1 °C, up to 5) and, while heating is still wanted, starts
again at target minus the margin. A request (window or heat now) that starts below the target
heats straight to target plus margin, even from inside the band.

### 4.5 Heating higher for clusters

Only when tank volume and element power are configured: for a cluster of n ready times spanning
S, the energy needed from the store is n times the energy per shower minus element power times S.
If the store at the normal target cannot carry it, the target is raised for that cluster, capped
at the highest temperature (3.1), and the card warns when even the cap is not enough.

### 4.6 Heat now

Any member asks for hot water now (card button, button entity, or action). Several people can
ask; each is told when it is ready (*Tell me when it's hot* joins an existing request). Cancelling
takes out only one's own place; the request ends when the last person leaves. Switching off for
everyone follows section 2. Refused, with the reason, during a fault or while automatic control
is off. From an automation or voice: the named member is told, else the person behind the
calling user, else nobody (the card still shows it).

After the "ready" message the band keeps the water hot for the keep time, then the heater stops,
mid-band if need be, with no message. Each person's time starts at their own message, and they
leave the request when it is up ([decision 16](decisions/0016-heat-now-own-temperature.md)).
Holding the card's button for half a second (or its ⋯ button) offers 5, 15 or 30 min, 1 or 2 h
for that request only, never above 2 h. A request nobody has been told about is given up after
255 min (the lead cap plus the lead margin).

An admin (or an automation) may ask for a temperature of their own, 30 to 45 °C, above or below
the heater's target, picked degree by degree in the same sheet, starting at the heater's target;
the target itself does not change. The request heats to the highest temperature among those in
it (and the band to the higher of that and an open window's), and each person is told when the
water reaches their own ([decision 16](decisions/0016-heat-now-own-temperature.md)).

### 4.7 Automatic switch

One switch per heater. Off: the integration plans nothing and leaves the heater alone, which can
be run by hand. On: it takes over again.

### 4.8 Fault guard

| Check | Rule (defaults) | What happens |
|---|---|---|
| Sensor unavailable | no reading for 5 min | heating stops; clears by itself after 1 min back |
| Not rising | heater on 30 min, water up less than 1 °C, below target; the count restarts from any drop (a shower during heating) | heating stops; cleared by *Resolved* in Repairs or a later heating that rises normally |
| No consumption (power sensor only) | heater on, under 100 W for 5 min | heating stops |
| Relay stuck (power sensor only) | heater off, 100 W or more for 5 min | reported only |
| Probe coming loose (second probe only) | on two long heats in a row from a mixed tank, a probe rises much slower than it normally does or than physics allows, or falls well behind the other | warning only; a suspect second probe is left out of the lead |
| Probes disagree (second probe only) | the top colder than the middle for 30 min | warning only |

With a climate setup, "not rising" and "no consumption" use the thermostat's own heating
indication, or are skipped (with a note in the settings) when it reports none. Every fault shows
the card's red banner, opens a Repairs entry and notifies the fault recipients. Thresholds are
editable in the advanced options.

### 4.9 Notifications

- Messages: "heating, ready in N min" when a window starts heating; "ready" when the water is
  ready; heat-now results; switching off for everyone, to those who lose out; faults to the fault
  recipients.
- A linked member's phones are found through the person: the person's device trackers, their
  devices, and the notify entities on those devices. An explicit target list overrides that.
- Plain message and title through `notify.send_message`, sent per target with errors caught per
  target. Rich options (a tag that replaces the earlier message) only for mobile_app targets,
  behind a setting.
- No target found: a persistent notification and one warning in the log. Virtual members notify
  only their chosen recipients. No silent fallback to another person.
- A private member's own messages still reach them.
- Messages already sent are remembered, so a restart never repeats "ready".

### 4.10 Restarts

Requests, messages sent and open windows are saved in the integration's storage and resumed
after a restart; a request past its time limit is dropped with a message to the person.

## 5. What Home Assistant shows

| Where | Entities |
|---|---|
| Heater device | status sensor (waiting, heating, ready, fault, manual); next ready time (timestamp, with whom); problem binary sensor; automatic switch; heat-now button; target and margin number entities; read-only calendar of heating windows and whose showers they serve |
| Heater device, diagnostic, hidden by default | learned heating rate; lead; solar-aware lead |
| Each member's device | away switch; next ready time |

No entity per ready time. Actions: `hot_water_ready.heat_now` (optional member, `target`,
`keep_minutes`), `switch_off`, `add_ready_time`, `remove_ready_time`, `set_away`, all with the
permission rules of section 2. Entities use `has_entity_name` with translated names; the water
temperature is the user's own sensor and is not duplicated.

The status sensor is deliberately truthful, private members included: admins and automations
depend on it. Home Assistant has no per-entity permissions, so the relay, the power sensor and
History stay visible to anyone who looks (decision 15, limits).

## 6. The card

Phone first. Everything it shows comes from one per-viewer snapshot the server builds (section
2); the card never reads the raw entities to decide what a viewer may see.

- **Top**: the water temperature in a ring with the target, a plain sentence ("Ready at 07:00",
  "Heating: ready in about 15 min"), the lines under it (for whom it heats, the element and its
  power, until when heat now keeps it hot), and the heat-now button (*Heat now*, *Cancel*, or
  *Tell me when it's hot* when someone else asked).
- **Admin**: tabs **People** and **Week**.
  - People: member avatars (virtual members starred, away members faded) and *+ Member*; the
    selected member's alarm-style list (big time, weekday letters, on or off), *+* opening a
    clock face, and the away switch.
  - Week: people by day, members as rows and weekdays as columns, each person's times as coloured
    tags; totals (showers, heating windows); a heating bar per day; tapping a person highlights
    their times.
  - Settings sheet: target, margin (shown as where heating stops and starts again), automatic
    control, who may switch off for everyone, the heating rate (4.2) and the solar comparison (7).
- **Member**: a greeting, their own ready times with *+* and away, a read-only line with the rest
  of the house today. The visibility switch is behind a ⚙ next to the title of one's own ready
  times.
- **Compact** (`compact: true`, [decision 17](decisions/0017-compact-card.md)): the top block
  alone, read-only, for a dashboard the whole house sees, from the same snapshot. A tap does
  nothing unless `tap_action` sets one of Home Assistant's standard actions; *more-info* is not
  offered, because the only entity it could open is the status sensor.
- Red banners for faults; an orange one when a cluster needs more than the highest temperature.
- On-screen text from the translation files, in 17 languages, following Home Assistant's
  language. Built with Lit, bundling its own controls; no `ha-*` elements except `ha-card`;
  theme variables only. **Open**: the card's visual editor (decision 17) uses Home Assistant's
  `ha-form`, which this rule does not allow; either the rule gains an exception for the editor,
  which only runs inside Home Assistant's dashboard editor, or the editor is rebuilt without it.

## 7. Solar comparison

The admin settings show, for the last 30 days: "With the solar-aware rule on, the water would
have been ready on time in N of M windows, and the heater would have run X minutes less, about Y
kWh." For each window the integration replays the solar-aware decision against what happened and
counts it on time only when the replay reaches the target by the ready time. kWh come from the
power sensor, else minutes times the element power, else only minutes are shown. The per-window
record is kept one year and is in the integration's diagnostics download, with names and people
left out; recording continues after the rule is switched on, marking which rule each window used.

## 8. Home Assistant compatibility and packaging

- **Minimum Home Assistant 2026.10**, with the compatibility code that needs: the card loaded
  both as a Lovelace resource created in code (storage resource mode) and through
  `add_extra_js_url`, with a guarded element definition, because of a 2026.10 frontend race fixed
  in 2026.11; flows in steps instead of `visible`; repair issues removed in `async_remove_entry`;
  `DeviceInfo` built with keyword arguments only. Dropped when the minimum moves up.
- The card file is served by the integration with a versioned URL (`?v=<version>`).
- One public GitHub repository: `custom_components/hot_water_ready/`, `hacs.json`, a manifest with
  `version`, `issue_tracker`, `codeowners`, `documentation` and a category; `brand/` with the
  icon; translations written out in full (references do not work in custom integrations); GitHub
  releases with the zip.
- Current APIs only: `runtime_data`, `ConfigEntry*` exceptions, `step_id` on every flow step, one
  reload strategy per entry (members' subentry reconfigure with no update listener), the device
  registry's current calls, `RestoreEntity`, `Store` with validation on load.

## 9. Testing and quality

- A pure-Python scheduling core with no Home Assistant imports (`core/`), and a thin Home
  Assistant layer.
- Core scenario tests: the band, restarts mid-request, a relay reconnecting and a late probe,
  back-to-back showers, several showers a day, away with a last day, both daylight-saving days.
- Home Assistant layer tests with pytest-homeassistant-custom-component: flows, entities,
  actions, permissions, visibility per viewer, Repairs, restart with restored state. Card tests
  of its logic, including what each viewer is shown from snapshots the real heater makes.
- All Bronze quality rules plus diagnostics, Repairs, entity translations and reconfigure; strict
  typing; a linter; at least 90% coverage of the core.
- CI on every push (hassfest, the HACS action, linter, types, tests, card build); a weekly run
  against the next Home Assistant beta; releases from a tag.
- The project page (`site/`, GitHub Pages) runs the real card against a simulated house; it is
  published after each release and its simulation hides what the integration hides.

## 10. Out of scope

Solar-aware heating as an applied default (it is observed and switchable, 4.3), electricity
tariffs and cheapest hours, holiday calendars, several heaters feeding each other, and a
Legionella cycle (a notification or automation may be considered later).

## 11. Assumptions

Stated so they can be corrected; they were not decided explicitly.

- The grace after a ready time is 15 min and is not a setting.
- The calendar shows the coming week.
- When the heater's target is outside 30 to 45 °C, the own-temperature stepper starts at the
  nearest end of that range.
