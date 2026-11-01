// Load a test HA dashboard several times in a real browser and report what the card shows.
// Run from card/:  node browser-check.mjs [chromium|firefox|webkit] [dashboard path] [loads]
// Needs the test HA from dev/testha.sh and `npx playwright install <browser>` once.
import { readFileSync } from "node:fs";
import { chromium, firefox, webkit } from "playwright";

const [browserName = "firefox", path = "/hwr-test/0", loads = "5"] = process.argv.slice(2);
const credentials = readFileSync(new URL("../dev/testha/config/test-credentials.txt", import.meta.url), "utf8");
const field = (name) => credentials.match(new RegExp(`^${name}: (.+)$`, "m"))[1].trim();

const browser = await { chromium, firefox, webkit }[browserName].launch();
const page = await browser.newPage();
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
await browser.close();
console.log(`${browserName}: ${Number(loads) - failures} of ${loads} loads showed the card`);
process.exit(failures ? 1 : 0);
