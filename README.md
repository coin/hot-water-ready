# Hot Water Ready

A Home Assistant integration that makes stored hot water ready when the people in a household
want it. Each member sets the times they want hot water; the integration works out when to start
the heater, keeps it in a temperature band, and tells them when the water is ready. It brings its
own dashboard card.

Status: in development. Requires Home Assistant 2026.10 or later.

## Install

Through HACS: add this repository as a custom repository of type *Integration*, install
*Hot Water Ready*, restart Home Assistant, then add the integration from
*Settings → Devices & services*.

## Development

- `custom_components/hot_water_ready/core/` is the scheduling core, plain Python with no Home
  Assistant imports. The rest of the package is the Home Assistant layer.
- `card/` is the dashboard card (TypeScript, Lit). `npm run build` writes the bundle the
  integration serves, `custom_components/hot_water_ready/frontend/hot-water-ready-card.js`,
  which is committed; CI fails when it is out of date.
- `scripts/check` runs every Python check CI runs (`lint`, `types`, `test ARGS`, or all).
  Home Assistant does not run on Windows; there, use `scripts\wsl-check.ps1`.
- `cd card && npm run check` runs the card's lint, types, tests and bundle check.
