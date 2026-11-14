# 15. A member's ready times and heat now can be private

Accepted 2026-11-11. Released in 0.1.13; the switch moved behind a ⚙ in 0.1.14.
Spec: [section 2](../spec.md#2-people-and-permissions), 3.3, 5, 6.

## Context

In a shared house, the card showed every member when the heater was on and for whom. A household
member asked that their own showers and heat-now requests not be visible to the others, while
everyone keeps seeing the real temperature and their own requests working as before. It was to
be a general feature, not a special case.

## Decision

- **Two levels**, public (the default) and private. A middle level (heating shown without a
  name, like a calendar's "busy") was considered and left out.
- **Heat now follows its member's visibility**, like their ready times.
- **Admins see everything.**
- **Visibility belongs to the member**, stored as a value (`public | private`), not a boolean,
  so a middle level or a per-item override can be added without migrating data.
- **Who sets it**: a linked member sets their own; an admin sets a virtual member's, never another
  person's. Hiding one's own activity is legitimate; hiding someone else's is the power imbalance
  that research on multi-user homes warns about.
- **Per-viewer projection on the server**: each non-admin viewer's card state is built only from
  the requests they may see, and only that is sent. The temperature is always real. From that:
  - with only private requests active, another member sees the heater as waiting or ready, as the
    water is;
  - when a viewer's request shares a window with a private one, they see heating only from when
    their own window would start on its own;
  - the element's state and power are left out for a viewer who has someone hidden;
  - *Switch off* is offered only while visible heating runs, and "who loses out" never names a
    private request;
  - the household line and the week leave private items out.
- **Entities**: the calendar and the next-ready-time sensors leave private times out for
  everyone. The status sensor stays truthful, because admins and automations depend on it.

## Consequences

- Home Assistant has no per-entity permissions for non-admin users, so the integration hides
  things only in its own card and websocket API. The relay switch, the power sensor, the Energy
  dashboard, History, Logbook, the relay's own app, and the temperature rising while none of the
  viewer's requests is active stay visible to anyone who looks. The README says so.
- A viewer who starts heat now while a private heating already runs sees the heating as theirs;
  nothing tells them the relay was already on.
- Decided while building: a private member's own messages still reach them; the diagnostic lead
  sensors still count private times; admins see no mark on private items.

## Open

- A per-item override (one ready time or one request private while the member is public).
