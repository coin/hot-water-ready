# 17. A compact, read-only card for a shared dashboard

Accepted 2026-11-13. Released in 0.1.17. Spec: [6](../spec.md#6-the-card).

## Context

A household's landing dashboard wanted a small view of the hot water: is it hot, is it heating,
when is it ready. The full card is too much there, and a tile of the status sensor was not an
option: the status sensor stays truthful by design (decision 15), so it shows a private member's
heating to everyone.

## Decision

1. **Only the top block**: the ring with temperature, target and animation; the heater's name and
   status chip; the sentence; the lines under it ("For …", the element and its power, "Keeping
   hot until …"). No buttons, tabs, members, ready times, away, settings or heat now.
2. **Visibility is not negotiable**: the same per-viewer projection as the full card, from the
   same snapshot, never from the entities. Admins see everything.
3. **A mode of the existing card** (`compact: true`), so there is one source of truth for what a
   viewer may see.
4. **Tap**: Home Assistant's standard `tap_action`. The default is **nothing**: the card cannot
   know where the full card is, and *more-info* could only open the status sensor, which leaks.
   For the same reason the editor does not offer *more-info*.
5. **The visual editor** exposes the heater, the compact option and, for the compact card, the
   tap action.

## Consequences

- The fault, manual and cluster banners are left out; a fault still shows in the status chip and
  the sentence.
- Tests make the snapshots with the real heater for a plain member and an admin, with a private
  member heating (a ready time, heat now, and a window shared with the plain member's), and the
  card's tests render the compact view from them in every language.
- The visual editor is built on Home Assistant's `ha-form`, which spec section 6 does not allow
  ("no `ha-*` elements except `ha-card`"). This was not noticed when it was built.

## Open

- Whether the editor keeps `ha-form` (an exception in the spec: it runs only inside Home
  Assistant's dashboard editor, where `ha-form` is loaded) or is rebuilt without it.
- Whether the fault banner should show on the compact card.
