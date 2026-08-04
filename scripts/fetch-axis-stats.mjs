import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const API_URL = "https://api.axis.to/api/v1/points/leaderboard?limit=100";
const OUTPUT_PATH = resolve("public/data/axis-stats.json");

const response = await fetch(API_URL, {
  headers: {
    Accept: "application/json",
    Origin: "https://app.axis.to",
    Referer: "https://app.axis.to/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138 Safari/537.36",
  },
});

if (!response.ok) {
  throw new Error(`AXIS API returned HTTP ${response.status}`);
}

const payload = await response.json();
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
