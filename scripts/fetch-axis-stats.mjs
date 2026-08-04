import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright-core";

const API_URL = "https://api.axis.to/api/v1/points/leaderboard?limit=100";
const COORDINATES_URL = "https://app.axis.to/coordinates";
const OUTPUT_PATH = resolve("public/data/axis-stats.json");

async function fetchPayload() {
  const executablePath = process.env.AXIS_CHROME_PATH;

  if (!executablePath) {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
        Origin: "https://app.axis.to",
        Referer: "https://app.axis.to/coordinates",
      },
    });

    if (!response.ok) {
      throw new Error(`AXIS API returned HTTP ${response.status}`);
    }

    return response.json();
  }

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(COORDINATES_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    const result = await page.evaluate(async (url) => {
      const response = await fetch(url, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      return {
        body: await response.text(),
        status: response.status,
      };
    }, API_URL);

    if (result.status !== 200) {
      const excerpt = result.body.replaceAll(/\s+/g, " ").slice(0, 200);
      throw new Error(`AXIS API returned HTTP ${result.status}: ${excerpt}`);
    }

    return JSON.parse(result.body);
  } finally {
    await browser.close();
  }
}

const payload = await fetchPayload();
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
};

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(
  `Updated AXIS snapshot: ${snapshot.totalPoints} points across ${snapshot.totalWallets} wallets`,
);
