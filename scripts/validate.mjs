import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "public/index.html",
  "public/styles.css",
  "public/app.js",
  "public/axis-logo.svg",
  "public/favicon.svg",
  "public/data/axis-stats.json",
  "public/CNAME",
];

await Promise.all(requiredFiles.map((file) => access(file)));

const [html, app, snapshotText, cname] = await Promise.all([
  readFile("public/index.html", "utf8"),
  readFile("public/app.js", "utf8"),
  readFile("public/data/axis-stats.json", "utf8"),
  readFile("public/CNAME", "utf8"),
]);

const snapshot = JSON.parse(snapshotText);
const assertions = [
  [html.includes("AXIS 空投计算器"), "missing calculator title"],
  [html.includes("https://axis.to/origin/meng"), "missing referral URL"],
  [html.includes("https://x.com/menglayer"), "missing MengLayer X URL"],
  [html.includes("20% Boost"), "missing boost copy"],
  [html.includes('id="languageToggle"'), "missing language toggle"],
  [html.includes('id="tgeInput"'), "missing TGE input"],
  [app.includes("fdv: 200"), "FDV default is not 200M"],
  [app.includes("airdrop: 5"), "airdrop default is not 5%"],
  [app.includes("growth: 2"), "growth default is not 2%"],
  [app.includes("Math.pow(1 + growth / 100, compoundingDays)"), "growth is not compounded daily to TGE"],
  [app.includes('tge: "2026-12-31"'), "TGE default is not 2026-12-31"],
  [app.includes("TRANSLATIONS"), "missing bilingual translations"],
  [Number(snapshot.totalPoints) > 0, "invalid totalPoints snapshot"],
  [Number.isInteger(snapshot.totalWallets), "invalid totalWallets snapshot"],
  [cname.trim() === "axis.menglayer.cc", "invalid CNAME"],
];

for (const [condition, message] of assertions) {
  if (!condition) throw new Error(message);
}

console.log("Static site validation passed.");
