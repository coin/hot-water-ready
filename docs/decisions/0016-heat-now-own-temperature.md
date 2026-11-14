# 16. Heat now to an admin's own temperature; each person keeps their own time

Accepted 2026-11-11. Released in 0.1.15 (range 35 to 45 °C); range widened to 30 to 45 °C in
0.1.16. Spec: [4.6](../spec.md#46-heat-now).

## Context

Heat now always heated to the heater's target. An admin wanted a request at a temperature of
their own, without changing the heater's target, while other people's requests keep working.
Before this, one heat-now request was shared by everyone who pressed, with one keep-hot time: the
longest one asked for held the whole request.

## Decision

1. **Only admins choose a temperature** (and automations, through the action). Members ask for the
   heater's target.
2. **It may be below the heater's target.**
3. **Each person is told when the water reaches their own temperature**: someone who asked for the
   target is told at it while an admin's higher request heats on.
4. **The temperature is chosen in the same sheet as the keep-hot time**, the one a long press on
   the button opens, **degree by degree, starting at the heater's target**.
5. **Visibility as in [decision 15](0015-member-visibility.md)**: a private admin's request stays
   hidden; a member whose own request is done sees "ready" while the water keeps rising towards
   the hidden higher temperature.
6. **Range 30 to 45 °C**, its own bounds, narrower than the heater's target (30 to 75 °C).
7. **Each requester keeps their own time**: once told, a requester holds the request at their
   temperature until their own keep time ends, then leaves; the request falls to the highest of
   those left and ends when nobody is left. Otherwise an admin's 45 °C would be held for a
   member's 2 h.
8. **The time limit is unchanged**: a request nobody has been told about is given up after
   255 min, the lead cap (240) plus the lead margin (15).

The request heats to the highest temperature among its requesters, and the band to the higher of
that and an open window's target. Below the target with nothing else asking, the band stops at
the chosen temperature plus the margin; if the water is already there, the requester is told at
once.

## Consequences

- The temperature itself cannot be hidden from anyone who looks at the sensor (decision 15).
- The card's ring shows the viewer's own temperature while their request runs.
- Requests saved before 0.1.15 (one time for everyone) load with that time for each requester.

## Open

- When the heater's target is outside 30 to 45 °C, the stepper starts at the nearest end of the
  range; this was proposed, not decided.
