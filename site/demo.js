// The live demo: the real card, fed by a small simulated house instead of Home Assistant.
//
// The card only ever talks to Home Assistant through `hass.callWS` and
// `hass.connection.subscribeMessage`, so a fake `hass` is all it needs. The house below is a
// simplification of the integration's controller (spec 4): one tank, ready times grouped into
// heating windows, a start worked out from the water temperature and the heating rate, a band
// around the target, heat now with each person's own time and temperature, showers that draw
// the water down. It is good enough to show what the card does, not a copy of the controller.

const BASE = Date.UTC(2026, 10, 9); // Monday 9 November 2026, 00:00 in the house's zone (UTC)
const DAY = 1440;
const ENTRY = "demo";
const AMBIENT = 18;
const LOSS = 0.0012; // per minute, of the gap to the room
const SHOWER_MINUTES = 8;
const SHOWER_DROP = 0.9; // °C a minute at the top probe while someone showers
const GAP = 40; // ready times this close share one window
const LEAD_MARGIN = 15;
const LEAD_CAP = 240;
const WEEKDAYS = [0, 1, 2, 3, 4];
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

// ---------------------------------------------------------------- the clock the card reads

const RealDate = Date;
let simMs = BASE;
class SimDate extends RealDate {
  constructor(...args) {
    if (args.length === 0) super(simMs);
    else super(...args);
  }
  static now() {
    return simMs;
  }
}
globalThis.Date = SimDate;

const iso = (minute) => new RealDate(BASE + Math.round(minute) * 60000).toISOString().replace(".000Z", "+00:00");
const dayOf = (minute) => Math.floor(minute / DAY);
const weekdayOf = (day) => ((day % 7) + 7) % 7; // BASE is a Monday
const dateOf = (day) => new RealDate(BASE + day * DAY * 60000).toISOString().slice(0, 10);
const hhmm = (minute) => {
  const m = ((Math.round(minute) % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
const parseTime = (text) => {
  const [h, m] = text.split(":").map(Number);
  return h * 60 + m;
};

// ---------------------------------------------------------------- the house

function freshHouse() {
  let next = 1;
  const rt = (time, weekdays, enabled = true) => ({ id: `rt${next++}`, time, weekdays, enabled });
  return {
    t: 0,
    temp: 37,
    target: 42,
    margin: 1,
    rate: 5.5,
    keepDefault: 5,
    automatic: true,
    element: false,
    sensorFault: false,
    heatNow: null, // { people: { id: { target, keep, told, until } } }
    started: new Set(), // windows begun: once started a window carries on
    switchedOff: new Set(), // windows switched off for everyone
    toldWindows: new Set(),
    draws: [], // { start, end }
    showered: new Set(),
    history: [], // { t, temp, on }
    nextId: 100,
    members: [
      { id: "ana", name: "Ana", colour: "blue", person: "person.ana", admin: true, virtual: false,
        away: { on: false, until: null }, visibility: "public",
        ready_times: [rt("06:45", WEEKDAYS), rt("21:30", EVERY_DAY)] },
      { id: "rui", name: "Rui", colour: "green", person: "person.rui", admin: false, virtual: false,
        away: { on: false, until: null }, visibility: "public",
        ready_times: [rt("07:30", WEEKDAYS), rt("09:00", [5, 6], false)] },
      { id: "mia", name: "Mia", colour: "purple", person: "person.mia", admin: false, virtual: false,
        away: { on: false, until: null }, visibility: "private",
        ready_times: [rt("07:10", WEEKDAYS), rt("19:30", EVERY_DAY)] },
      { id: "guests", name: "Guests", colour: "orange", person: null, admin: false, virtual: true,
        away: { on: true, until: null }, visibility: "public",
        ready_times: [rt("20:00", [4, 5])] },
    ],
  };
}

let house = freshHouse();
let viewer = "ana";
let quiet = false; // no phone messages while fast-forwarding to a scene

const member = (id) => house.members.find((m) => m.id === id);
const isAway = (m, day) => m.away.on && (m.away.until === null || dateOf(day) <= m.away.until);

/** The ready times on a day, as absolute minutes, earliest first. */
function readyTimesOn(day, { includeAway = false } = {}) {
  const out = [];
  for (const m of house.members) {
    if (!includeAway && isAway(m, day)) continue;
    for (const r of m.ready_times) {
      if (!r.enabled || !r.weekdays.includes(weekdayOf(day))) continue;
      out.push({ member: m.id, at: day * DAY + parseTime(r.time) });
    }
  }
  return out.sort((a, b) => a.at - b.at || a.member.localeCompare(b.member));
}

/** Ready times close together share one heating window. */
function windowsOn(day) {
  const windows = [];
  for (const item of readyTimesOn(day)) {
    const last = windows[windows.length - 1];
    if (last && item.at - last.last <= GAP) {
      last.items.push(item);
      last.last = item.at;
    } else {
      windows.push({ key: `${day}@${item.at}`, first: item.at, last: item.at, items: [item] });
    }
  }
  for (const w of windows) w.end = w.last + SHOWER_MINUTES + 2;
  return windows;
}

const leadFor = (temp) => Math.min(Math.max(0, (house.target - temp) * house.rate) + LEAD_MARGIN, LEAD_CAP);
const windowsAround = (t) => [...windowsOn(dayOf(t) - 1), ...windowsOn(dayOf(t)), ...windowsOn(dayOf(t) + 1)];

/** The window heating now, if any. */
function activeWindow() {
  if (!house.automatic || house.sensorFault) return null;
  for (const w of windowsAround(house.t)) {
    if (house.switchedOff.has(w.key) || house.t >= w.end) continue;
    if (house.started.has(w.key)) return w;
    if (house.t >= w.first - leadFor(house.temp)) {
      house.started.add(w.key);
      return w;
    }
  }
  return null;
}

/** The next window not yet begun, with when it would start from the water now. */
function nextWindow() {
  for (const w of windowsAround(house.t)) {
    if (house.started.has(w.key) || house.switchedOff.has(w.key) || w.end <= house.t) continue;
    return { ...w, start: Math.max(house.t, w.first - leadFor(house.temp)), lead: leadFor(house.temp) };
  }
  return null;
}

const heatNowPeople = () => (house.heatNow ? Object.entries(house.heatNow.people) : []);
const ownTarget = (entry) => entry.target ?? house.target;

/** The temperature the heater is heading for now, or null when nothing asks for heat. */
function goal(window) {
  const asks = heatNowPeople().map(([, e]) => ownTarget(e));
  if (window) asks.push(house.target);
  return asks.length ? Math.max(...asks) : null;
}

// ---------------------------------------------------------------- one simulated minute

function step(dt) {
  const window = activeWindow();
  const T = goal(window);
  const blocked = house.sensorFault || !house.automatic;
  if (blocked || T === null) house.element = false;
  else if (house.temp <= T - house.margin) house.element = true;
  else if (house.temp >= T + house.margin) house.element = false;
  else if (!house.element && house.temp < T) house.element = true; // the first heat of a request

  // Showers start at each ready time, for whoever is home.
  for (const item of readyTimesOn(dayOf(house.t))) {
    const key = `${item.member}@${item.at}`;
    if (item.at <= house.t && house.t < item.at + 1 && !house.showered.has(key)) {
      house.showered.add(key);
      house.draws.push({ start: item.at, end: item.at + SHOWER_MINUTES, who: item.member });
    }
  }
  const drawing = house.draws.some((d) => d.start <= house.t && house.t < d.end);
  house.draws = house.draws.filter((d) => d.end > house.t - 1);

  let delta = -LOSS * (house.temp - AMBIENT) * dt;
  if (house.element) delta += dt / house.rate;
  if (drawing) delta -= SHOWER_DROP * dt;
  house.temp = Math.max(12, house.temp + delta);
  house.t += dt;

  // Ready: tell the people of the window once the water reaches the target.
  if (window && !house.toldWindows.has(window.key) && house.temp >= house.target - 0.05) {
    house.toldWindows.add(window.key);
    const names = [...new Set(window.items.map((i) => i.member))];
    for (const id of names) notify(id, "ready", `Hot water is ready (${house.target} °C) for ${hhmm(firstOf(window, id))}.`);
  }
  // Heat now: each person is told at their own temperature, then kept hot for their own time.
  for (const [id, e] of heatNowPeople()) {
    if (!e.told && house.temp >= ownTarget(e) - 0.05) {
      e.told = true;
      e.until = house.t + e.keep;
      notify(id, "ready", `Hot water is ready (${round1(house.temp)} °C). Kept hot until ${hhmm(e.until)}.`);
    } else if (e.told && house.t >= e.until) {
      delete house.heatNow.people[id];
    }
  }
  if (house.heatNow && heatNowPeople().length === 0) house.heatNow = null;

  const last = house.history[house.history.length - 1];
  if (!last || house.t - last.t >= 1) house.history.push({ t: house.t, temp: house.temp, on: house.element });
  if (house.history.length > 4 * DAY) house.history.splice(0, house.history.length - 4 * DAY);
}

const firstOf = (window, id) => window.items.find((i) => i.member === id).at;
const round1 = (x) => Math.round(x * 10) / 10;

// ---------------------------------------------------------------- what the card is sent

function visibleTo(id) {
  if (member(viewer).admin) return true;
  const m = member(id);
  return !m || id === viewer || m.visibility !== "private";
}

function snapshot() {
  const me = member(viewer);
  const admin = me.admin;
  const window = activeWindow();
  const T = goal(window);
  const day = dayOf(house.t);
  const faults = house.sensorFault ? ["sensor_unavailable"] : [];
  const status = faults.length ? "fault" : !house.automatic ? "manual" : house.element ? null : window || house.heatNow ? "ready" : "waiting";
  const upcoming = [...readyTimesOn(day), ...readyTimesOn(day + 1)].filter((i) => i.at >= house.t && visibleTo(i.member));
  const nextAt = upcoming[0]?.at;
  const next = nextWindow();
  const own = house.heatNow?.people[viewer];
  const people = heatNowPeople().filter(([id]) => visibleTo(id));
  const toldTimes = people.filter(([, e]) => e.told).map(([, e]) => e.until);
  // As the integration does: a viewer who may not see someone is not told whether the element is
  // on or what it draws, and heating only for people they may not see shows as the water would be.
  const hidesSomeone = house.members.some((m) => !visibleTo(m.id));
  const heatingShown = house.element && ((window && window.items.some((i) => visibleTo(i.member))) || people.length > 0);
  const heatingStatus = heatingShown ? "heating" : !house.sensorFault && house.temp >= house.target ? "ready" : "waiting";

  return {
    entry_id: ENTRY,
    name: "Cylinder",
    temperature: house.sensorFault ? null : round1(house.temp),
    target: house.target,
    margin: house.margin,
    status: status ?? heatingStatus,
    ready_in_minutes: heatingShown && T !== null && T > house.temp ? Math.ceil((T - house.temp) * house.rate) : null,
    next_heat_start: !window && next && next.start - house.t < 2 * DAY ? iso(next.start) : null,
    solar_aware: false,
    next_ready: nextAt === undefined ? null : { at: iso(nextAt), members: upcoming.filter((i) => i.at === nextAt).map((i) => i.member) },
    is_admin: admin,
    me: viewer,
    faults,
    not_rising_checked: true,
    heat_now_blocked: faults.length > 0,
    element_on: hidesSomeone ? null : house.element,
    power_w: hidesSomeone ? null : house.element ? 2850 : 0,
    automatic: house.automatic,
    keep_hot_minutes: house.keepDefault,
    can_ask_heat_now: true,
    can_choose_heat_now_target: admin,
    heat_now: house.heatNow && (people.length || admin)
      ? {
          requesters: people.map(([id]) => id),
          asked: Boolean(own),
          unnamed: false,
          keep_until: own ? (own.told ? iso(own.until) : null) : toldTimes.length ? iso(Math.max(...toldTimes)) : null,
          target: own ? ownTarget(own) : null,
        }
      : null,
    viewer,
    can_switch_off: admin,
    heating_for: window ? window.items.filter((i) => i.at >= house.t - SHOWER_MINUTES && visibleTo(i.member)).map((i) => ({ member: i.member, at: iso(i.at) })) : [],
    settings: admin ? settings() : null,
    week: admin ? week(day) : null,
    cluster_warning: null,
    today: readyTimesOn(day).filter((i) => visibleTo(i.member)).map((i) => ({ member: i.member, at: iso(i.at) })),
    members: house.members.filter((m) => visibleTo(m.id)).map((m) => {
      const mine = m.id === viewer;
      const nextOwn = [...readyTimesOn(day), ...readyTimesOn(day + 1)].find((i) => i.member === m.id && i.at >= house.t);
      return {
        id: m.id, name: m.name, colour: m.colour, virtual: m.virtual,
        can_edit: admin || mine,
        away: { ...m.away },
        next_ready: nextOwn ? iso(nextOwn.at) : null,
        ready_times: m.ready_times.map((r) => ({ ...r, weekdays: [...r.weekdays] })),
        visibility: admin || mine ? m.visibility : null,
        can_set_visibility: mine || (admin && m.virtual),
      };
    }),
  };
}

function settings() {
  const runs = [[-6, "19:55", 5.03], [-5, "21:16", 5.85], [-4, "20:42", 5.5], [-2, "08:15", 5.07], [-1, "18:43", 5.11]]
    .map(([d, time, rate]) => ({ at: iso((dayOf(house.t) + d) * DAY + parseTime(time)), rate }));
  return {
    switch_off_people: [],
    solar_aware: false,
    rate: { used: house.rate, source: "learned", manual: null, learned: 5.5, default: 7, physics: 7.61, physics_fast: 3.81,
      tank_litres: 300, runs, window_days: 7, min_runs: 3, lead_margin_minutes: LEAD_MARGIN, lead_cap_minutes: LEAD_CAP },
    solar: { windows: 41, on_time: 40, minutes_saved: 0, kwh: null, solar_windows: 0, solar_on_time: 0 },
  };
}

function week(day) {
  const monday = day - weekdayOf(day);
  const windows = [];
  for (let d = monday; d < monday + 7; d++) {
    for (const w of windowsOn(d)) windows.push({ start: iso(w.first - 60), end: iso(w.end) });
  }
  return { monday: dateOf(monday), today: dateOf(day), windows };
}

// ---------------------------------------------------------------- what the card may ask

class DemoError extends Error {}

const handlers = {
  "hot_water_ready/heaters": () => [{ entry_id: ENTRY, name: "Cylinder" }],
  "hot_water_ready/heat_now/start": (msg) => {
    if (house.sensorFault) throw new DemoError("The temperature sensor is not answering, so heat now is refused.");
    if (!house.automatic) throw new DemoError("Automatic control is off.");
    house.heatNow ??= { people: {} };
    const before = house.heatNow.people[viewer];
    const target = msg.target ?? null;
    house.heatNow.people[viewer] = {
      target,
      keep: msg.keep_minutes ?? before?.keep ?? house.keepDefault,
      told: before ? before.told && before.target === target : false,
      until: before?.until ?? null,
    };
    if (!before) notify(viewer, "heating", `Heating now${target ? ` to ${target} °C` : ""}. You'll be told when it's hot.`);
  },
  "hot_water_ready/heat_now/cancel": () => {
    if (house.heatNow) delete house.heatNow.people[viewer];
    if (house.heatNow && heatNowPeople().length === 0) house.heatNow = null;
  },
  "hot_water_ready/switch_off": () => {
    const window = activeWindow();
    const losers = new Set([...(window?.items.map((i) => i.member) ?? []), ...heatNowPeople().map(([id]) => id)]);
    if (window) house.switchedOff.add(window.key);
    house.heatNow = null;
    house.element = false;
    for (const id of losers) if (id !== viewer) notify(id, "off", `${member(viewer).name} switched off the hot water.`);
  },
  "hot_water_ready/ready_time/add": (msg) => {
    member(msg.member_id).ready_times.push({ id: `rt${house.nextId++}`, time: msg.time, weekdays: msg.weekdays ?? EVERY_DAY, enabled: true });
  },
  "hot_water_ready/ready_time/update": (msg) => {
    for (const m of house.members) {
      const r = m.ready_times.find((x) => x.id === msg.ready_time_id);
      if (!r) continue;
      for (const key of ["time", "weekdays", "enabled"]) if (key in msg) r[key] = msg[key];
    }
  },
  "hot_water_ready/ready_time/remove": (msg) => {
    for (const m of house.members) m.ready_times = m.ready_times.filter((x) => x.id !== msg.ready_time_id);
  },
  "hot_water_ready/away/set": (msg) => {
    member(msg.member_id).away = { on: Boolean(msg.away), until: msg.away ? msg.until ?? null : null };
  },
  "hot_water_ready/visibility/set": (msg) => {
    member(msg.member_id).visibility = msg.visibility;
  },
  "hot_water_ready/settings/set": (msg) => {
    if ("target" in msg) house.target = msg.target;
    if ("margin" in msg) house.margin = msg.margin;
    if ("automatic" in msg) house.automatic = msg.automatic;
    if ("rate" in msg) house.rate = msg.rate ?? 5.5;
  },
  "hot_water_ready/rate/recalculate": () => ({ runs: 5, learned: 5.5 }),
};

const subscribers = new Set();
function push() {
  if (subscribers.size === 0) return;
  const snap = snapshot();
  for (const cb of subscribers) cb(snap);
}

function makeHass(language) {
  const states = {};
  for (const m of house.members) if (m.person) states[m.person] = { attributes: { friendly_name: m.name } };
  return {
    language,
    locale: { language, time_format: "24" },
    config: { time_zone: "UTC" },
    states,
    callWS: async (msg) => {
      const handler = handlers[msg.type];
      if (!handler) throw new DemoError(`The demo does not do ${msg.type}.`);
      await new Promise((r) => setTimeout(r, 120));
      const result = handler(msg);
      push();
      onChange();
      return result ?? null;
    },
    connection: {
      subscribeMessage: async (cb) => {
        subscribers.add(cb);
        cb(snapshot());
        return async () => subscribers.delete(cb);
      },
    },
  };
}

// ---------------------------------------------------------------- phone messages

const feed = [];
function notify(id, kind, text) {
  if (quiet) return;
  const m = member(id);
  if (!m || m.virtual) return;
  feed.unshift({ who: m.name, colour: m.colour, kind, text, at: hhmm(house.t) });
  feed.length = Math.min(feed.length, 6);
  renderFeed();
}

// ---------------------------------------------------------------- scenes and the clock

const SCENES = {
  dawn: { at: 4 * 60 + 40, label: "04:40" },
  morning: { at: 6 * 60 + 20, label: "06:20" },
  late: { at: 7 * 60 + 36, label: "07:36" },
  evening: { at: 19 * 60 + 5, label: "19:05" },
};

/** Run Tuesday from midnight, quietly, up to a scene. */
function goTo(sceneMinute, keep = {}) {
  const old = house;
  house = freshHouse();
  if (keep.from) {
    house.members = old.members;
    house.target = old.target;
    house.margin = old.margin;
    house.automatic = old.automatic;
  }
  house.t = DAY; // Tuesday
  quiet = true;
  while (house.t < DAY + sceneMinute) step(0.5);
  quiet = false;
  feed.length = 0;
  simMs = BASE + house.t * 60000;
  renderFeed();
  push();
  onChange();
}

let speed = 2; // simulated minutes per real second
let playing = true;
let lastFrame = performance.now();
let carry = 0;
let lastPush = 0;

function frame(now) {
  const elapsed = Math.min((now - lastFrame) / 1000, 0.25);
  lastFrame = now;
  if (playing) {
    carry += elapsed * speed;
    while (carry >= 0.25) {
      step(0.25);
      carry -= 0.25;
    }
    simMs = BASE + house.t * 60000;
    if (now - lastPush > 200) {
      lastPush = now;
      push();
      onChange();
    }
  }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- the page around the card

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

class HaCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `<style>:host{display:block;background:var(--ha-card-background,var(--card-background-color));
      color:var(--primary-text-color);border-radius:var(--ha-card-border-radius,14px);border:1px solid var(--divider-color);overflow:hidden}</style><slot></slot>`;
  }
}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);

let card;
let language = "en";
let mode = "full";

// The compact card's tap goes to the full card, as on a real dashboard with
// tap_action navigate; here the demo catches the hass-action and swaps the card.
const COMPACT = {
  compact: true,
  tap_action: { action: "navigate", navigation_path: "#full-card" },
};

function mountCard() {
  card = document.createElement("hot-water-ready-card");
  card.setConfig({ type: "custom:hot-water-ready-card", entry_id: ENTRY, ...(mode === "compact" ? COMPACT : {}) });
  card.hass = makeHass(language);
  $("#card-slot").replaceChildren(card);
  $$("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
}

function setMode(next) {
  if (next === mode) return;
  mode = next;
  mountCard();
}

function renderFeed() {
  const list = $("#feed");
  if (!list) return;
  if (feed.length === 0) {
    list.innerHTML = `<li class="feed-empty">Messages to each person's phone show up here.</li>`;
    return;
  }
  list.innerHTML = feed
    .map((n) => `<li class="note note-${n.kind}"><span class="note-dot" style="background:var(--${n.colour}-color)"></span>
      <div><div class="note-head"><b>${n.who}'s phone</b><time>${n.at}</time></div><p>${n.text}</p></div></li>`)
    .join("");
}

function onChange() {
  const day = dayOf(house.t);
  const names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  $("#clock").textContent = hhmm(house.t);
  $("#clock-day").textContent = names[weekdayOf(day)];
  $("#water").textContent = house.sensorFault ? "no reading" : `${round1(house.temp).toFixed(1)} °C`;
  $("#element").textContent = house.element ? "on, 2,850 W" : "off";
  $("#element").classList.toggle("hot", house.element);
  renderPlan();
  renderChart();
  $$("[data-viewer]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.viewer === viewer)));
  $("#fault").setAttribute("aria-pressed", String(house.sensorFault));
}

function renderPlan() {
  const out = $("#plan");
  const window = activeWindow();
  const next = nextWindow();
  const names = (w) => [...new Set(w.items.map((i) => member(i.member).name))].join(", ");
  const times = (w) => w.items.map((i) => hhmm(i.at)).join(", ");
  if (house.sensorFault) {
    out.innerHTML = `<p class="plan-line">The sensor is silent: heating stops and heat now is refused until it reads again.</p>`;
    return;
  }
  if (window) {
    out.innerHTML = `<p class="plan-line"><span class="tag tag-hot">Heating</span> for ${names(window)} (${times(window)}). It keeps the water between
      <b>${house.target - house.margin}</b> and <b>${house.target + house.margin} °C</b> until ${hhmm(window.end)}.</p>`;
    return;
  }
  if (!next) {
    out.innerHTML = `<p class="plan-line">Nothing planned in the next two days.</p>`;
    return;
  }
  const deficit = Math.max(0, house.target - house.temp);
  out.innerHTML = `<p class="plan-line"><span class="tag">Next</span> ${names(next)} at ${hhmm(next.first)}${next.items.length > 1 ? ` (with ${times(next)})` : ""}.</p>
    <div class="formula" aria-label="How the start is worked out">
      <span><b>${deficit.toFixed(1)}</b><small>°C to go</small></span><i>×</i>
      <span><b>${house.rate}</b><small>min per °C, learned</small></span><i>+</i>
      <span><b>${LEAD_MARGIN}</b><small>min margin</small></span><i>=</i>
      <span class="result"><b>${Math.round(next.lead)} min</b><small>starts ${hhmm(next.start)}</small></span>
    </div>`;
}

function renderChart() {
  const svg = $("#chart");
  if (!svg) return;
  const W = 420, H = 190, top = 16, bottom = 160;
  const day = dayOf(house.t);
  const from = day * DAY + 4 * 60, to = (day + 1) * DAY; // 04:00 to midnight
  const x = (t) => ((t - from) / (to - from)) * W;
  const y = (temp) => bottom - ((Math.min(Math.max(temp, 26), 48) - 26) / (48 - 26)) * (bottom - top);
  const points = house.history.filter((p) => p.t >= from && p.t <= to);
  let heat = "";
  let runStart = null;
  for (const p of points) {
    if (p.on && runStart === null) runStart = p.t;
    if (!p.on && runStart !== null) {
      heat += `<rect x="${x(runStart)}" y="${top}" width="${Math.max(1, x(p.t) - x(runStart))}" height="${bottom - top}" class="c-heat"/>`;
      runStart = null;
    }
  }
  if (runStart !== null) heat += `<rect x="${x(runStart)}" y="${top}" width="${Math.max(1, x(house.t) - x(runStart))}" height="${bottom - top}" class="c-heat"/>`;
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.temp).toFixed(1)}`).join("");
  const marks = readyTimesOn(day)
    .map((i) => `<g><line x1="${x(i.at)}" x2="${x(i.at)}" y1="${top}" y2="${bottom}" class="c-mark"/>
      <circle cx="${x(i.at)}" cy="${top - 6}" r="5" style="fill:var(--${member(i.member).colour}-color)"><title>${member(i.member).name} ${hhmm(i.at)}</title></circle></g>`)
    .join("");
  const hours = [6, 9, 12, 15, 18, 21].map((h) => `<text x="${x(day * DAY + h * 60)}" y="${H - 8}" class="c-axis">${String(h).padStart(2, "0")}h</text>`).join("");
  const band = `<rect x="0" y="${y(house.target + house.margin)}" width="${W}" height="${y(house.target - house.margin) - y(house.target + house.margin)}" class="c-band"/>
    <line x1="0" x2="${W}" y1="${y(house.target)}" y2="${y(house.target)}" class="c-target"/>
    <text x="${W - 4}" y="${y(house.target) - 5}" class="c-label" text-anchor="end">target ${house.target} °C</text>`;
  const nowX = x(Math.min(house.t, to));
  svg.innerHTML = `${heat}${band}${hours}${marks}
    <path d="${line}" class="c-line"/>
    <line x1="${nowX}" x2="${nowX}" y1="${top - 12}" y2="${bottom}" class="c-now"/>
    ${points.length ? `<circle cx="${nowX}" cy="${y(house.temp)}" r="4.5" class="c-dot"/>` : ""}`;
}

function wire() {
  $$("[data-scene]").forEach((b) => b.addEventListener("click", () => goTo(SCENES[b.dataset.scene].at, { from: true })));
  $$("[data-speed]").forEach((b) =>
    b.addEventListener("click", () => {
      speed = Number(b.dataset.speed);
      $$("[data-speed]").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    }),
  );
  $("#play").addEventListener("click", () => {
    playing = !playing;
    $("#play").setAttribute("aria-pressed", String(!playing));
    $("#play").querySelector("span").textContent = playing ? "Pause" : "Play";
  });
  $$("[data-viewer]").forEach((b) =>
    b.addEventListener("click", () => {
      viewer = b.dataset.viewer;
      mountCard();
      onChange();
    }),
  );
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $("#card-slot").addEventListener("hass-action", (e) => {
    if (mode === "compact" && e.detail?.config?.tap_action?.action === "navigate") setMode("full");
  });
  $("#language").addEventListener("change", (e) => {
    language = e.target.value;
    card.hass = makeHass(language);
  });
  $("#shower").addEventListener("click", () => {
    house.draws.push({ start: house.t, end: house.t + SHOWER_MINUTES, who: viewer });
    push();
    onChange();
  });
  $("#fault").addEventListener("click", () => {
    house.sensorFault = !house.sensorFault;
    if (house.sensorFault) notify("ana", "fault", "Cylinder: the temperature sensor has gone silent. Heating is stopped.");
    push();
    onChange();
  });
  $("#reset").addEventListener("click", () => {
    viewer = "ana";
    mode = "full";
    goTo(SCENES.morning.at);
    mountCard();
  });
}

export function start() {
  wire();
  goTo(SCENES.morning.at);
  mountCard();
  requestAnimationFrame(frame);
}
