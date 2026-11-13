// The project page: site/ plus the built card, put together in dist/site for GitHub Pages.
//   node dev/site.mjs        (the card bundle is committed, so no build is needed first)
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";

const repo = new URL("..", import.meta.url);
const out = new URL("dist/site/", repo);
mkdirSync(out, { recursive: true });
// Empty it rather than remove it, so a server running in it keeps working.
for (const name of readdirSync(out)) rmSync(new URL(name, out), { recursive: true, force: true });
cpSync(new URL("site/", repo), out, { recursive: true });
cpSync(new URL("custom_components/hot_water_ready/frontend/hot-water-ready-card.js", repo), new URL("hot-water-ready-card.js", out));
console.log("written to", decodeURIComponent(out.pathname));
