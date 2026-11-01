// Bundle the card into the file the integration serves.
// `node build.mjs --check` fails when the committed bundle differs from a fresh build.
import { build } from "esbuild";
import { readFileSync } from "node:fs";

const outfile = "../custom_components/hot_water_ready/frontend/hot-water-ready-card.js";
const check = process.argv.includes("--check");

const result = await build({
  entryPoints: ["src/hot-water-ready-card.ts"],
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  legalComments: "none",
  write: !check,
  outfile,
});

if (check) {
  const fresh = new TextDecoder().decode(result.outputFiles[0].contents);
  if (fresh !== readFileSync(outfile, "utf8")) {
    console.error(`${outfile} is out of date: run npm run build and commit it.`);
    process.exit(1);
  }
  console.log("Committed card bundle matches the source.");
}
