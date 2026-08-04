const DEFAULTS = {
  points: 1_000_000,
  fdv: 200,
  airdrop: 5,
  growth: 2,
  boost: true,
};

const FALLBACK_STATS = {
  totalPoints: 7_234_583_674.252222,
  totalWallets: 1_738,
  timestamp: "2026-08-04T02:56:33.037Z",
  source: "AXIS official API snapshot",
};

const elements = {
  form: document.querySelector("#calculatorForm"),
  points: document.querySelector("#pointsInput"),
  fdv: document.querySelector("#fdvInput"),
  airdrop: document.querySelector("#airdropInput"),
  growth: document.querySelector("#growthInput"),
  boost: document.querySelector("#boostInput"),
  reset: document.querySelector("#resetButton"),
  estimatedValue: document.querySelector("#estimatedValue"),
  effectivePoints: document.querySelector("#effectivePoints"),
  estimatedShare: document.querySelector("#estimatedShare"),
  poolValue: document.querySelector("#poolValue"),
  millionPointValue: document.querySelector("#millionPointValue"),
  totalPoints: document.querySelector("#totalPoints"),
  projectedPoints: document.querySelector("#projectedPoints"),
  totalWallets: document.querySelector("#totalWallets"),
  updatedAt: document.querySelector("#updatedAt"),
  dataStatus: document.querySelector("#dataStatus"),
};

let stats = FALLBACK_STATS;

function numberValue(input, fallback = 0) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function compactNumber(value, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("zh-CN", {
    notation: "compact",
    maximumFractionDigits,
  }).format(value);
}

function integerNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function currency(value) {
  if (!Number.isFinite(value)) return "$0";
  const digits = value < 10 ? 2 : value < 1_000 ? 1 : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(value);
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function calculate() {
  const points = Math.max(0, numberValue(elements.points));
  const fdv = Math.max(0, numberValue(elements.fdv));
  const airdrop = Math.min(100, Math.max(0, numberValue(elements.airdrop)));
  const growth = Math.max(-99, numberValue(elements.growth));
  const boostMultiplier = elements.boost.checked ? 1.2 : 1;

  const effectivePoints = points * boostMultiplier;
  const projectedTotalPoints = Math.max(1, stats.totalPoints * (1 + growth / 100));
  const share = Math.min(1, effectivePoints / projectedTotalPoints);
  const pool = fdv * 1_000_000 * (airdrop / 100);
  const estimatedValue = pool * share;
  const perMillion = pool * (1_000_000 / projectedTotalPoints);

  elements.estimatedValue.innerHTML = `<span>$</span>${integerNumber(estimatedValue).replace(/^\$/, "")}`;
  elements.effectivePoints.textContent = compactNumber(effectivePoints);
  elements.estimatedShare.textContent = `${(share * 100).toLocaleString("en-US", {
    maximumFractionDigits: share < 0.0001 ? 6 : 4,
  })}%`;
  elements.poolValue.textContent = currency(pool);
  elements.millionPointValue.textContent = currency(perMillion);
  elements.totalPoints.textContent = compactNumber(stats.totalPoints);
  elements.projectedPoints.textContent = compactNumber(projectedTotalPoints);
  elements.totalWallets.textContent = integerNumber(stats.totalWallets);
  elements.updatedAt.textContent = formatDate(stats.timestamp);
}

function resetDefaults() {
  elements.points.value = DEFAULTS.points;
  elements.fdv.value = DEFAULTS.fdv;
  elements.airdrop.value = DEFAULTS.airdrop;
  elements.growth.value = DEFAULTS.growth;
  elements.boost.checked = DEFAULTS.boost;
  calculate();
}

async function loadStats() {
  try {
    const response = await fetch(`./data/axis-stats.json?v=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const totalPoints = Number.parseFloat(payload.totalPoints);
    const totalWallets = Number.parseInt(payload.totalWallets, 10);
    if (!Number.isFinite(totalPoints) || !Number.isFinite(totalWallets)) {
      throw new Error("Invalid AXIS snapshot");
    }
    stats = { ...payload, totalPoints, totalWallets };
    elements.dataStatus.classList.add("ready");
    elements.dataStatus.querySelector("span:last-child").textContent = "官方 API 数据快照";
  } catch (error) {
    stats = FALLBACK_STATS;
    elements.dataStatus.classList.add("stale");
    elements.dataStatus.querySelector("span:last-child").textContent = "使用内置官方快照";
    console.warn("AXIS stats snapshot unavailable; using fallback.", error);
  }
  calculate();
}

elements.form.addEventListener("input", calculate);
elements.reset.addEventListener("click", resetDefaults);

calculate();
loadStats();
