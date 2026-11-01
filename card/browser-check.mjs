// Load a test HA dashboard several times in a real browser and report what the card shows, then
// open each of its views (people, week, settings) at phone width and fail on anything that spills
// past the card's edge or has its text cut.
// Run from card/:  node browser-check.mjs [chromium|firefox|webkit] [dashboard path] [loads]
// Needs the test HA from dev/testha.sh and `npx playwright install <browser>` once.
import { readFileSync } from "node:fs";
import { chromium, firefox, webkit } from "playwright";

const [browserName = "firefox", path = "/hwr-test/0", loads = "5"] = process.argv.slice(2);
const credentials = readFileSync(new URL("../dev/testha/config/test-credentials.txt", import.meta.url), "utf8");
const field = (name) => credentials.match(new RegExp(`^${name}: (.+)$`, "m"))[1].trim();

const browser = await { chromium, firefox, webkit }[browserName].launch();
const page = await browser.newPage({ viewport: { width: 400, height: 1000 } }); // phone first
await page.goto(`http://localhost:8124${path}`);
await page.locator("input[name=username]").fill(field("username"));
await page.locator("input[type=password]").fill(field("password"));
await page.keyboard.press("Enter");
await page.waitForURL(`**${path}`);

const read = () =>
  page.evaluate(() => {
    const find = (root, selector) => {
      const found = root.querySelector(selector);
      if (found) return found;
      for (const node of root.querySelectorAll("*")) {
        const inner = node.shadowRoot && find(node.shadowRoot, selector);
        if (inner) return inner;
      }
      return null;
    };
    const card = find(document, "hot-water-ready-card");
    const text = card?.shadowRoot?.textContent.replace(/\s+/g, " ").trim();
    return { card: text || "NO CARD", errorCard: Boolean(find(document, "hui-error-card")) };
  });

let failures = 0;
for (let n = 1; n <= Number(loads); n++) {
  if (n > 1) await page.reload();
  await page.waitForTimeout(3000);
  const result = await read();
  if (result.card === "NO CARD" || result.errorCard) failures++;
  console.log(`${browserName} load ${n}: ${JSON.stringify(result)}`);
}
console.log(`${browserName}: ${Number(loads) - failures} of ${loads} loads showed the card`);

// Elements placed past the card's edge, or with their text cut, outside a scroller made to scroll.
const spills = () =>
  page.locator("hot-water-ready-card").first().evaluate((card) => {
    const edge = card.getBoundingClientRect();
    const scrolls = (node) => {
      for (let up = node.parentElement; up; up = up.parentElement) {
        if (["auto", "scroll"].includes(getComputedStyle(up).overflowX)) return true;
      }
      return false;
    };
    const out = [];
    for (const node of card.shadowRoot.querySelectorAll("*")) {
      const box = node.getBoundingClientRect();
      if (!box.width || scrolls(node)) continue;
      const style = getComputedStyle(node);
      // Text cut by its own box, unless an ellipsis says so on purpose.
      const cut = style.overflowX !== "visible" && style.textOverflow !== "ellipsis" && node.scrollWidth > node.clientWidth + 1;
      if (box.left < edge.left - 1 || box.right > edge.right + 1 || cut) {
        const why = cut ? `cut: ${node.scrollWidth}px of text in ${node.clientWidth}px` : `${Math.round(box.left)}..${Math.round(box.right)}`;
        out.push(`${node.tagName.toLowerCase()}.${[...node.classList].join(".")} ${why}`);
      }
    }
    return out;
  });

const card = page.locator("hot-water-ready-card").first();
const views = [["people", null], ["week", card.locator(".tab").nth(1)], ["settings", card.locator(".settings-button")]];
let spilled = 0;
for (const [name, open] of views) {
  if (open) {
    if (!(await open.count())) {
      console.log(`${browserName} ${name}: not shown to this user`);
      continue;
    }
    await open.click();
    await page.waitForTimeout(500);
  }
  const found = await spills();
  spilled += found.length;
  console.log(`${browserName} ${name}: ${found.length ? `spills past the card: ${found.join(", ")}` : "fits"}`);
}
await browser.close();
process.exit(failures || spilled ? 1 : 0);
