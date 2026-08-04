const DEFAULTS = {
  points: 1_000_000,
  fdv: 200,
  airdrop: 5,
  growth: 2,
  tge: "2026-12-31",
  boost: true,
};

const FALLBACK_STATS = {
  totalPoints: 7_234_583_674.252222,
  totalWallets: 1_738,
  timestamp: "2026-08-04T02:56:33.037Z",
  source: "AXIS official API snapshot",
};

const TRANSLATIONS = {
  zh: {
    documentTitle: "AXIS 空投计算器",
    metaDescription: "基于 AXIS Coordinates 官方数据快照估算潜在空投价值。默认 FDV 2 亿美元、预计至 TGE 积分增幅 2%、空投比例 5%。",
    axisLogoAria: "打开 AXIS Coordinates",
    navAria: "主要导航",
    navCalculator: "计算器",
    openAxis: "打开 AXIS",
    heroLine1: "空投价值，",
    heroLine2: "一眼算清。",
    heroCopy: "基于 AXIS 官方 Coordinates 总量快照，输入你的积分即可估算潜在空投价值。",
    creatorAria: "在 X 上关注 MengLayer",
    boostAria: "AXIS 邀请码活动",
    boostTitle: "使用邀请码，获得 20% Boost 加成",
    boostCopy: "进入 AXIS Origin Vault 开始赚取 Coordinates",
    boostCta: "立即参与",
    parameters: "估算参数",
    reset: "恢复默认",
    yourPoints: "你的 Coordinates",
    airdropRatio: "空投比例",
    growthToTge: "预计至 TGE 积分增幅",
    tgeDate: "TGE 时间",
    referralBoost: "邀请码加成",
    boostNote: "若输入的积分已经包含邀请加成，请关闭 20% Boost。",
    estimatedValue: "预估空投价值",
    effectivePoints: "有效积分",
    estimatedShare: "预计全网占比",
    poolValue: "空投池价值",
    millionPointValue: "每百万积分估值",
    formulaLabel: "计算公式",
    formula: "FDV × 空投比例 × 有效积分 ÷ 预计全网积分",
    marketTotal: "官方总 Coordinates",
    marketProjected: "预计 TGE 总量",
    marketTge: "TGE 日期",
    marketWallets: "参与钱包",
    marketUpdated: "数据更新时间",
    howTitle: "计算方式",
    howCopy: "先用 FDV 与空投比例得到潜在空投池价值，再按你的有效 Coordinates 占预计 TGE 全网积分的比例分配。TGE 日期用于倒计时，增幅用于模拟届时的积分稀释。",
    disclaimer: "本工具由 MengLayer 独立制作，仅供情景估算，不代表 AXIS 官方承诺或投资建议。FDV、TGE、空投比例、积分规则及 20% Boost 均可能变化，请以项目最终公告为准。",
    loadingData: "正在读取官方快照",
    officialSnapshot: "官方 API 数据快照",
    fallbackSnapshot: "使用内置官方快照",
    switchLanguage: "Switch to English",
    daysLeft: "{days} 天后",
    tgeToday: "今天",
    tgePassed: "已到达",
  },
  en: {
    documentTitle: "AXIS Airdrop Calculator",
    metaDescription: "Estimate a potential AXIS airdrop using the official Coordinates snapshot. Defaults: $200M FDV, 2% growth to TGE, and 5% airdrop allocation.",
    axisLogoAria: "Open AXIS Coordinates",
    navAria: "Primary navigation",
    navCalculator: "Calculator",
    openAxis: "Open AXIS",
    heroLine1: "Airdrop value,",
    heroLine2: "made clear.",
    heroCopy: "Enter your points to estimate a potential airdrop value using the official AXIS Coordinates snapshot.",
    creatorAria: "Follow MengLayer on X",
    boostAria: "AXIS referral campaign",
    boostTitle: "Use the invite link and get a 20% Boost",
    boostCopy: "Enter AXIS Origin Vault and start earning Coordinates",
    boostCta: "Join now",
    parameters: "Estimate settings",
    reset: "Reset defaults",
    yourPoints: "Your Coordinates",
    airdropRatio: "Airdrop allocation",
    growthToTge: "Points growth to TGE",
    tgeDate: "TGE date",
    referralBoost: "Referral bonus",
    boostNote: "Turn off the 20% Boost if your input already includes the referral bonus.",
    estimatedValue: "Estimated airdrop value",
    effectivePoints: "Effective points",
    estimatedShare: "Estimated network share",
    poolValue: "Airdrop pool value",
    millionPointValue: "Value per 1M points",
    formulaLabel: "Formula",
    formula: "FDV × allocation × effective points ÷ projected network points",
    marketTotal: "Official Coordinates",
    marketProjected: "Projected at TGE",
    marketTge: "TGE date",
    marketWallets: "Participating wallets",
    marketUpdated: "Data updated",
    howTitle: "How it works",
    howCopy: "We derive the potential airdrop pool from FDV and allocation, then apply your share of projected network Coordinates at TGE. The date powers the countdown, while growth models expected dilution by TGE.",
    disclaimer: "Built independently by MengLayer for scenario estimates only. This is not an official AXIS commitment or investment advice. FDV, TGE, allocation, points rules, and the 20% Boost may change; refer to the project's final announcement.",
    loadingData: "Loading official snapshot",
    officialSnapshot: "Official API snapshot",
    fallbackSnapshot: "Using built-in official snapshot",
    switchLanguage: "切换至中文",
    daysLeft: "{days} days left",
    tgeToday: "Today",
    tgePassed: "Reached",
  },
};

const elements = {
  form: document.querySelector("#calculatorForm"),
  points: document.querySelector("#pointsInput"),
  fdv: document.querySelector("#fdvInput"),
  airdrop: document.querySelector("#airdropInput"),
  growth: document.querySelector("#growthInput"),
  tge: document.querySelector("#tgeInput"),
  boost: document.querySelector("#boostInput"),
  reset: document.querySelector("#resetButton"),
  languageToggle: document.querySelector("#languageToggle"),
  estimatedValue: document.querySelector("#estimatedValue"),
  effectivePoints: document.querySelector("#effectivePoints"),
  estimatedShare: document.querySelector("#estimatedShare"),
  poolValue: document.querySelector("#poolValue"),
  millionPointValue: document.querySelector("#millionPointValue"),
  totalPoints: document.querySelector("#totalPoints"),
  projectedPoints: document.querySelector("#projectedPoints"),
  tgeSummary: document.querySelector("#tgeSummary"),
  totalWallets: document.querySelector("#totalWallets"),
  updatedAt: document.querySelector("#updatedAt"),
  dataStatus: document.querySelector("#dataStatus"),
  dataStatusText: document.querySelector("#dataStatusText"),
  metaDescription: document.querySelector('meta[name="description"]'),
};

let stats = FALLBACK_STATS;
let dataState = "loadingData";
let language = getStoredLanguage();

function getStoredLanguage() {
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  if (requestedLanguage === "en" || requestedLanguage === "zh") {
    return requestedLanguage;
  }
  try {
    return localStorage.getItem("axis-language") === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

function numberValue(input, fallback = 0) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function compactNumber(value, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", {
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
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getTgeSummary() {
  const rawDate = elements.tge.value || DEFAULTS.tge;
  const [year, month, day] = rawDate.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Number.isNaN(target.getTime())
    ? 0
    : Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
  const dateLabel = `${String(year).padStart(4, "0")}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  const copy = TRANSLATIONS[language];

  if (diffDays > 0) {
    return `${dateLabel} · ${copy.daysLeft.replace("{days}", integerNumber(diffDays))}`;
  }
  if (diffDays === 0) return `${dateLabel} · ${copy.tgeToday}`;
  return `${dateLabel} · ${copy.tgePassed}`;
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
  elements.tgeSummary.textContent = getTgeSummary();
  elements.totalWallets.textContent = integerNumber(stats.totalWallets);
  elements.updatedAt.textContent = formatDate(stats.timestamp);
}

function applyLanguage() {
  const copy = TRANSLATIONS[language];
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = copy.documentTitle;
  elements.metaDescription.setAttribute("content", copy.metaDescription);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (copy[key]) node.textContent = copy[key];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.dataset.i18nAria;
    if (copy[key]) node.setAttribute("aria-label", copy[key]);
  });

  elements.languageToggle.textContent = language === "zh" ? "EN" : "中文";
  elements.languageToggle.setAttribute("aria-label", copy.switchLanguage);
  elements.dataStatusText.textContent = copy[dataState];
  calculate();
}

function resetDefaults() {
  elements.points.value = DEFAULTS.points;
  elements.fdv.value = DEFAULTS.fdv;
  elements.airdrop.value = DEFAULTS.airdrop;
  elements.growth.value = DEFAULTS.growth;
  elements.tge.value = DEFAULTS.tge;
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
    dataState = "officialSnapshot";
    elements.dataStatus.classList.add("ready");
  } catch (error) {
    stats = FALLBACK_STATS;
    dataState = "fallbackSnapshot";
    elements.dataStatus.classList.add("stale");
    console.warn("AXIS stats snapshot unavailable; using fallback.", error);
  }
  elements.dataStatusText.textContent = TRANSLATIONS[language][dataState];
  calculate();
}

elements.form.addEventListener("input", calculate);
elements.reset.addEventListener("click", resetDefaults);
elements.languageToggle.addEventListener("click", () => {
  language = language === "zh" ? "en" : "zh";
  try {
    localStorage.setItem("axis-language", language);
  } catch {
    // Language switching still works when storage is unavailable.
  }
  applyLanguage();
});

applyLanguage();
loadStats();
