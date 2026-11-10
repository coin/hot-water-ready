// The README's card images: the built card with a sample household, rendered at phone width.
//   cd card && node ../dev/screenshots.mjs        (needs `npm run build` first; writes docs/images/)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const repo = new URL("..", import.meta.url);
const require = createRequire(new URL("card/package.json", repo));
const { firefox } = require("playwright");
const bundle = readFileSync(new URL("custom_components/hot_water_ready/frontend/hot-water-ready-card.js", repo), "utf8");
const out = new URL("docs/images/", repo);

// Tuesday 10 November 2026, 06:20 in Lisbon (UTC+0): heating for Ana's 06:45.
const NOW = "2026-11-10T06:20:00Z";
const weekdays = [0, 1, 2, 3, 4];
const member = (id, name, colour, times, extra = {}) => ({
  id, name, colour, can_edit: true, virtual: false, away: { on: false, until: null },
  next_ready: null, ready_times: times, ...extra,
});
const members = [
  member("ana", "Ana", "blue", [
    { id: "a1", time: "06:45", weekdays, enabled: true },
    { id: "a2", time: "21:30", weekdays: [0, 1, 2, 3, 4, 5, 6], enabled: true },
  ], { next_ready: "2026-11-10T06:45:00+00:00" }),
  member("rui", "Rui", "green", [
    { id: "r1", time: "07:30", weekdays, enabled: true },
    { id: "r2", time: "09:00", weekdays: [5, 6], enabled: false },
  ], { next_ready: "2026-11-10T07:30:00+00:00" }),
  member("guests", "Guests", "orange", [{ id: "g1", time: "20:00", weekdays: [4, 5], enabled: true }], {
    virtual: true, away: { on: true, until: null },
  }),
];
const runs = [
  ["2026-11-04T19:55:00+00:00", 5.03], ["2026-11-05T21:16:00+00:00", 5.85],
  ["2026-11-06T20:42:00+00:00", 5.5], ["2026-11-08T08:15:00+00:00", 5.07], ["2026-11-09T18:43:00+00:00", 5.11],
].map(([at, rate]) => ({ at, rate }));
const window = (day, start, end) => ({ start: `2026-11-${day}T${start}:00+00:00`, end: `2026-11-${day}T${end}:00+00:00` });
const admin = {
  entry_id: "abc", name: "Cylinder", temperature: 37.4, target: 42, margin: 1, status: "heating",
  ready_in_minutes: 25, next_heat_start: null, solar_aware: false,
  next_ready: { at: "2026-11-10T06:45:00+00:00", members: ["ana"] },
  is_admin: true, me: "ana", can_ask_heat_now: true, faults: [], heat_now_blocked: false,
  not_rising_checked: true, element_on: true, power_w: 2850, keep_hot_minutes: 5, automatic: true,
  heat_now: null, viewer: "ana", can_switch_off: true,
  heating_for: [{ member: "ana", at: "2026-11-10T06:45:00+00:00" }],
  settings: {
    switch_off_people: ["person.rui"], solar_aware: false,
    rate: { used: 5.5, source: "learned", manual: null, learned: 5.5, default: 7, physics: 7.61, physics_fast: 3.81,
      tank_litres: 300, runs, window_days: 7, min_runs: 3, lead_margin_minutes: 15, lead_cap_minutes: 240 },
    solar: { windows: 12, on_time: 11, minutes_saved: 34, kwh: 1.6, solar_windows: 0, solar_on_time: 0 },
  },
  week: {
    monday: "2026-11-09", today: "2026-11-10",
    windows: [
      window("09", "05:55", "07:45"), window("09", "20:50", "21:45"), window("10", "05:50", "07:45"),
      window("10", "20:55", "21:45"), window("11", "06:00", "07:45"), window("11", "20:50", "21:45"),
      window("12", "05:55", "07:45"), window("12", "19:20", "21:45"), window("13", "06:00", "07:45"),
      window("13", "19:25", "21:45"), window("14", "19:30", "21:45"), window("15", "20:50", "21:45"),
    ],
  },
  cluster_warning: null,
  today: [
    { member: "ana", at: "2026-11-10T06:45:00+00:00" }, { member: "rui", at: "2026-11-10T07:30:00+00:00" },
    { member: "ana", at: "2026-11-10T21:30:00+00:00" },
  ],
  members,
};
// 04:40, before anything heats: the water at 31 °C, heating planned for 05:50.
const waiting = {
  ...admin, temperature: 31.2, status: "waiting", ready_in_minutes: null, element_on: false, power_w: 0,
  next_heat_start: "2026-11-10T05:50:00+00:00", heating_for: [],
};
const memberView = {
  ...admin, is_admin: false, me: "rui", viewer: "rui", can_switch_off: false, settings: null, week: null,
  members: members.map((m) => ({ ...m, can_edit: m.id === "rui" })),
};

const browser = await firefox.launch();
async function shoot(name, snapshot, act, { height = 900, clip = "card", now = NOW } = {}) {
  const page = await browser.newPage({ viewport: { width: 412, height }, deviceScaleFactor: 2 });
  await page.clock.setFixedTime(new Date(now));
  page.on("pageerror", (e) => console.log(name, "pageerror:", e.message));
  await page.setContent(`<body style='margin:0;padding:12px;background:#111111;color:#e1e1e1;
    --primary-color:#03a9f4;--text-primary-color:#fff;--card-background-color:#1c1c1c;--ha-card-background:#1c1c1c;
    --primary-text-color:#e1e1e1;--secondary-text-color:#9e9e9e;--secondary-background-color:#2c2c2c;
    --divider-color:#3a3a3a;--warning-color:#ffa600;--error-color:#ef5350;font-family:Roboto,Arial,sans-serif'>
    <style>ha-card{display:block;background:#1c1c1c;border-radius:12px;border:1px solid #2c2c2c}</style></body>`);
  await page.addScriptTag({ content: bundle, type: "module" });
  await page.evaluate((snap) => {
    const card = document.createElement("hot-water-ready-card");
    card.setConfig({ type: "custom:hot-water-ready-card", entry_id: "abc" });
    card.hass = {
      language: "en", locale: { language: "en", time_format: "24" }, config: { time_zone: "Europe/Lisbon" },
      states: { "person.rui": { attributes: { friendly_name: "Rui" } }, "person.ana": { attributes: { friendly_name: "Ana" } } },
      callWS: async () => null,
      connection: { subscribeMessage: async (cb) => { cb(snap); return () => {}; } },
    };
    card.style.display = "block";
    document.body.appendChild(card);
  }, snapshot);
  await page.waitForTimeout(400);
  const card = page.locator("hot-water-ready-card");
  if (act) await act(card, page);
  await page.waitForTimeout(300);
  const target = clip === "card" ? card : card.locator(clip);
  await target.screenshot({ path: new URL(`${name}.png`, out).pathname.slice(1) });
  await page.close();
}

await shoot("card", waiting, undefined, { now: "2026-11-10T04:40:00Z" });
// Rui, an administrator, while the heater heats for Ana: he can join in or switch it off.
await shoot("heating", { ...admin, me: "rui", viewer: "rui" });
await shoot("week", admin, (card) => card.locator(".tab").nth(1).click());
await shoot("clock", admin, (card) => card.locator("button.add").click(), { clip: ".clock-dialog" });
const early = { now: "2026-11-10T04:40:00Z" };
// Editing Ana's 06:45: the sheet, then the clock popup over it.
const edit = (card) => card.locator(".row-text").first().click();
await shoot("edit", waiting, edit, early);
await shoot("picker", waiting, async (card) => {
  await edit(card);
  await card.locator(".sheet-time").click();
}, early);
await shoot("settings", admin, (card) => card.locator("button.settings-button").click(), { height: 1800, clip: ".sheet.settings" });
await shoot("member", memberView);
await browser.close();
console.log("written to", out.pathname);
