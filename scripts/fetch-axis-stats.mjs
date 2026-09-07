import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright-core";

const API_URL = "https://api.axis.to/api/v1/points/leaderboard?limit=100";
const COORDINATES_URL = "https://app.axis.to/coordinates";
const EARN_URL = "https://app.axis.to/earn";
const OUTPUT_PATH = resolve("public/data/axis-stats.json");

const EARN_DEFINITIONS = [
  ["origin-vault", "Origin Vault"],
  ["hold-usdx", "Hold USDx"],
  ["stake-usdx", "Stake USDx"],
  ["curve-usdx-usdt", "USDx / USDT pool"],
  ["curve-susdx-usdx", "sUSDx / USDx pool"],
  ["pendle-susdx-yt", "sUSDx Yield Token (YT)"],
  ["pendle-susdx-lp", "sUSDx Liquidity Pool"],
  ["pendle-usdx-yt", "USDx Yield Token (YT)"],
  ["pendle-usdx-lp", "USDx Liquidity Pool"],
];

function getChromePath() {
  const candidates = [
    process.env.AXIS_CHROME_PATH,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);

  return candidates.find((candidate) => existsSync(candidate));
}

function normalizeApy(value) {
  if (/^\d+(?:\.\d+)?%$/.test(value)) {
    return { type: "rate", value };
  }
  if (value === "Coordinates only") return { type: "coordinates-only" };
  if (value.startsWith("Return depends")) return { type: "variable" };
  return { type: "not-quoted" };
}

async function fetchEarnOpportunities(page) {
  const response = await page.goto(EARN_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.getByText("Origin Vault", { exact: true }).first().waitFor({
    state: "visible",
    timeout: 30_000,
  });
  await page
    .waitForFunction(
      () =>
        Array.from(document.querySelectorAll("table tr")).some((row) => {
          const cells = row.querySelectorAll("td");
          return row.innerText.includes("Origin Vault") && /\d+(?:\.\d+)?%/.test(cells[1]?.innerText ?? "");
        }),
      null,
      { timeout: 15_000 },
    )
    .catch(() => {
      console.warn("AXIS Earn APY quotes did not load; keeping the official unquoted state");
    });

  const rows = await page.locator("table tr").evaluateAll((tableRows) =>
    tableRows.map((row) =>
      Array.from(row.querySelectorAll("th,td")).map((cell) => cell.innerText.trim()),
    ),
  );

  const opportunities = EARN_DEFINITIONS.map(([id, title]) => {
    const row = rows.find((cells) => cells[0]?.split("\n")[0] === title);
    const multiplier = Number.parseFloat(row?.[2]);
    if (!row || !Number.isFinite(multiplier)) {
      throw new Error(`AXIS Earn row is missing or invalid: ${title}`);
    }
    return {
      id,
      multiplier,
      apy: normalizeApy(row[1]),
    };
  });

  console.log(
    `Loaded AXIS Earn page: HTTP ${response?.status() ?? "unknown"}, ${opportunities.length} opportunities`,
  );
  return opportunities;
}

async function fetchAxisData() {
  const executablePath = getChromePath();

  if (!executablePath) {
    throw new Error("Chrome or Edge is required to refresh AXIS data");
  }

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    const earnOpportunities = await fetchEarnOpportunities(page);
    const coordinatesResponse = await page.goto(COORDINATES_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    console.log(
      `Loaded AXIS Coordinates page: HTTP ${coordinatesResponse?.status() ?? "unknown"}`,
    );

    await page.setExtraHTTPHeaders({
      Accept: "application/json",
      Origin: "https://app.axis.to",
      Referer: COORDINATES_URL,
    });
    const apiResponse = await page.goto(API_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    const result = {
      body: (await apiResponse?.text()) ?? "",
      status: apiResponse?.status() ?? 0,
    };

    if (result.status !== 200) {
      const excerpt = result.body.replaceAll(/\s+/g, " ").slice(0, 200);
      throw new Error(`AXIS API returned HTTP ${result.status}: ${excerpt}`);
    }

    return {
      earnOpportunities,
      payload: JSON.parse(result.body),
    };
  } finally {
    await browser.close();
  }
}

const { earnOpportunities, payload } = await fetchAxisData();
const data = payload?.data;

if (
  payload?.success !== true ||
  !data ||
  !Number.isFinite(Number.parseFloat(data.totalPoints)) ||
  !Number.isInteger(data.totalWallets)
) {
  throw new Error("AXIS API returned an unexpected payload");
}

const snapshot = {
  totalPoints: data.totalPoints,
  totalWallets: data.totalWallets,
  timestamp: payload.timestamp ?? new Date().toISOString(),
  source: API_URL,
  earnUpdatedAt: new Date().toISOString(),
  earnSource: EARN_URL,
  earnOpportunities,
};

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(
  `Updated AXIS snapshot: ${snapshot.totalPoints} points across ${snapshot.totalWallets} wallets; ${earnOpportunities.length} Earn opportunities`,
);
