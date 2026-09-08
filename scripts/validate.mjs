import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "public/index.html",
  "public/styles.css",
  "public/app.js",
  "public/axis-logo.svg",
  "public/favicon.svg",
  "public/data/axis-stats.json",
  "public/CNAME",
  ".github/workflows/refresh-axis-data.yml",
];

await Promise.all(requiredFiles.map((file) => access(file)));

const [html, app, snapshotText, cname, refreshWorkflow] = await Promise.all([
  readFile("public/index.html", "utf8"),
  readFile("public/app.js", "utf8"),
  readFile("public/data/axis-stats.json", "utf8"),
  readFile("public/CNAME", "utf8"),
  readFile(".github/workflows/refresh-axis-data.yml", "utf8"),
]);

const snapshot = JSON.parse(snapshotText);
const assertions = [
  [html.includes("AXIS 空投计算器"), "missing calculator title"],
  [html.includes("https://axis.to/origin/meng"), "missing referral URL"],
  [html.includes('class="official-link" href="https://app.axis.to/origin/meng"'), "header AXIS button does not use the Meng invite URL"],
  [html.includes("https://x.com/menglayer"), "missing MengLayer X URL"],
  [html.includes("20% Boost"), "missing boost copy"],
  [html.includes('id="languageToggle"'), "missing language toggle"],
  [html.includes('id="tgeInput"'), "missing TGE input"],
  [html.includes('styles.css?v=apy-audit-20260908'), "missing CSS cache-busting version"],
  [html.includes('app.js?v=apy-audit-20260908'), "missing app cache-busting version"],
  [html.includes('id="earn"'), "missing AXIS Earn section"],
  [html.includes('https://app.axis.to/earn'), "missing official AXIS Earn URL"],
  [html.includes('id="strategySelect"'), "missing Earn strategy selector"],
  [html.includes('id="strategyAmountInput"'), "missing strategy principal input"],
  [html.includes('id="strategyApyInput"'), "missing editable strategy APY input"],
  [html.includes('id="strategyMultiplierInput"'), "missing editable strategy multiplier input"],
  [html.includes('id="strategyTgeInput"'), "missing editable strategy TGE input"],
  [html.includes('id="strategyPoints"'), "missing strategy Coordinates result"],
  [html.includes('id="strategyDailyPoints"'), "missing daily Coordinates result"],
  [app.includes("fdv: 200"), "FDV default is not 200M"],
  [app.includes("airdrop: 5"), "airdrop default is not 5%"],
  [app.includes("growth: 2"), "growth default is not 2%"],
  [app.includes("Math.pow(1 + growth / 100, compoundingDays)"), "growth is not compounded daily to TGE"],
  [app.includes('tge: "2026-12-31"'), "TGE default is not 2026-12-31"],
  [app.includes('strategyTge: "2026-12-03"'), "strategy TGE does not default to the YT expiry"],
  [app.includes("Math.pow(1 + apy / 100, 1 / 365) - 1"), "strategy APY is not converted to a daily compound rate"],
  [app.includes("exposure * pointsPerUsdPerDay * effectiveMultiplier"), "strategy Coordinates formula is missing"],
  [app.includes("TRANSLATIONS"), "missing bilingual translations"],
  [Number(snapshot.totalPoints) > 0, "invalid totalPoints snapshot"],
  [Number.isInteger(snapshot.totalWallets), "invalid totalWallets snapshot"],
  [Number(snapshot.pointsPerUsdPerDay) > 0, "invalid Coordinates base rate"],
  [snapshot.pointsRateSource === "https://api.axis.to/api/v1/points/campaigns", "invalid Coordinates rate source"],
  [snapshot.earnSource === "https://app.axis.to/earn", "invalid AXIS Earn source"],
  [snapshot.strategyTge === "2026-12-03", "invalid Pendle YT expiry default"],
  [Array.isArray(snapshot.earnOpportunities) && snapshot.earnOpportunities.length === 9, "invalid AXIS Earn snapshot"],
  [snapshot.earnOpportunities?.some((item) => item.id === "pendle-usdx-yt" && item.multiplier === 24), "missing AXIS 24x Earn rate"],
  [snapshot.earnOpportunities?.every((item) => item.tge === "2026-12-03" && item.url), "strategy defaults are incomplete"],
  [cname.trim() === "axis.menglayer.cc", "invalid CNAME"],
  [!refreshWorkflow.includes("schedule:"), "AXIS snapshot refresh is still scheduled"],
  [refreshWorkflow.includes("workflow_dispatch:"), "AXIS snapshot cannot be refreshed manually"],
  [refreshWorkflow.includes("browser-actions/setup-chrome@v2"), "AXIS refresh does not use Chrome"],
  [refreshWorkflow.includes("runs-on: macos-latest"), "AXIS refresh uses the blocked Linux runner network"],
  [!refreshWorkflow.includes("continue-on-error"), "AXIS refresh hides fetch failures"],
  [refreshWorkflow.includes("gh workflow run deploy-pages.yml"), "AXIS refresh does not redeploy Pages"],
];

for (const [condition, message] of assertions) {
  if (!condition) throw new Error(message);
}

console.log("Static site validation passed.");
