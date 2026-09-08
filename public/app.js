const DEFAULTS = {
  points: 1_000_000,
  fdv: 200,
  airdrop: 5,
  growth: 2,
  tge: "2026-12-31",
  boost: true,
  strategy: "origin-vault",
  strategyAmount: 10_000,
  strategyTge: "2026-12-03",
  strategyBoost: true,
};

const STRATEGY_LABELS = {
  zh: {
    "origin-vault": "Origin Vault",
    "hold-usdx": "持有 USDx",
    "stake-usdx": "质押 USDx",
    "curve-usdx-usdt": "Curve · USDx / USDT",
    "curve-susdx-usdx": "Curve · sUSDx / USDx",
    "pendle-susdx-yt": "Pendle · sUSDx YT",
    "pendle-susdx-lp": "Pendle · sUSDx LP",
    "pendle-usdx-yt": "Pendle · USDx YT",
    "pendle-usdx-lp": "Pendle · USDx LP",
  },
  en: {
    "origin-vault": "Origin Vault",
    "hold-usdx": "Hold USDx",
    "stake-usdx": "Stake USDx",
    "curve-usdx-usdt": "Curve · USDx / USDT",
    "curve-susdx-usdx": "Curve · sUSDx / USDx",
    "pendle-susdx-yt": "Pendle · sUSDx YT",
    "pendle-susdx-lp": "Pendle · sUSDx LP",
    "pendle-usdx-yt": "Pendle · USDx YT",
    "pendle-usdx-lp": "Pendle · USDx LP",
  },
};

const FALLBACK_STATS = {
  totalPoints: 56_863_778_618.03561,
  totalWallets: 2_033,
  timestamp: "2026-09-08T07:40:45.961Z",
  source: "AXIS official API snapshot",
  pointsPerUsdPerDay: 1,
  pointsRateSource: "https://api.axis.to/api/v1/points/campaigns",
  pointsCampaign: "Origin Season 1",
  earnUpdatedAt: "2026-09-08T07:40:25.365Z",
  earnSource: "https://app.axis.to/earn",
  strategyTge: "2026-12-03",
  earnOpportunities: [
    { id: "origin-vault", multiplier: 10, apy: { type: "rate", value: "7.31%" }, tge: "2026-12-03", url: "https://app.axis.to/origin" },
    { id: "hold-usdx", multiplier: 16, apy: { type: "coordinates-only" }, tge: "2026-12-03", url: "https://app.axis.to/stake#swap" },
    { id: "stake-usdx", multiplier: 4, apy: { type: "rate", value: "29.92%" }, tge: "2026-12-03", url: "https://app.axis.to/stake" },
    { id: "curve-usdx-usdt", multiplier: 20, apy: { type: "not-quoted" }, tge: "2026-12-03", url: "https://curve.finance/dex/ethereum/pools/factory-stable-ng-1051/deposit" },
    { id: "curve-susdx-usdx", multiplier: 10, apy: { type: "not-quoted" }, tge: "2026-12-03", url: "https://curve.finance/dex/ethereum/pools/factory-stable-ng-1052/deposit" },
    { id: "pendle-susdx-yt", multiplier: 6, apy: { type: "variable" }, tge: "2026-12-03", url: "https://app.pendle.finance/trade/markets/0x5e572498e9f83650f0ff24194999bddb4b390928/swap?view=yt&chain=ethereum" },
    { id: "pendle-susdx-lp", multiplier: 5, apy: { type: "not-quoted" }, tge: "2026-12-03", url: "https://app.pendle.finance/trade/markets/0x5e572498e9f83650f0ff24194999bddb4b390928/swap?view=pool&chain=ethereum" },
    { id: "pendle-usdx-yt", multiplier: 24, apy: { type: "variable" }, tge: "2026-12-03", url: "https://app.pendle.finance/trade/markets/0x0bef762d2094ac80821c657dea6783fc43435292/swap?view=yt&chain=ethereum" },
    { id: "pendle-usdx-lp", multiplier: 20, apy: { type: "not-quoted" }, tge: "2026-12-03", url: "https://app.pendle.finance/trade/markets/0x0bef762d2094ac80821c657dea6783fc43435292/swap?view=pool&chain=ethereum" },
  ],
};

const TRANSLATIONS = {
  zh: {
    documentTitle: "AXIS 空投计算器",
    metaDescription: "基于 AXIS Coordinates 官方数据与最新 Earn 倍率估算潜在空投价值。默认 FDV 2 亿美元、全网积分每日复利增幅 2%、空投比例 5%。",
    axisLogoAria: "打开 AXIS Coordinates",
    navAria: "主要导航",
    navCalculator: "计算器",
    navEarn: "Earn 倍率",
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
    growthToTge: "全网积分每日复利增幅",
    tgeDate: "TGE 时间",
    referralBoost: "邀请码加成",
    boostNote: "若输入的积分已经包含邀请加成，请关闭 20% Boost。",
    estimatedValue: "预估空投价值",
    effectivePoints: "有效积分",
    estimatedShare: "预计全网占比",
    poolValue: "空投池价值",
    millionPointValue: "每百万积分估值",
    formulaLabel: "计算公式",
    formula: "FDV × 空投比例 × 有效积分 ÷ [全网积分 × (1 + 日增幅)^天数]",
    marketTotal: "官方总 Coordinates",
    marketProjected: "复利至 TGE 总量",
    marketTge: "TGE 日期",
    marketWallets: "参与钱包",
    marketUpdated: "数据更新时间",
    earnTitle: "官方 Earn 倍率",
    earnCopy: "不同持仓方式获得不同 Coordinates 倍率；下列数据来自 AXIS Earn 页面。",
    earnCta: "查看实时 Earn",
    earnGroupAxis: "USDx 产品",
    earnGroupCurve: "Curve 池",
    earnGroupPendle: "Pendle 市场",
    earnOriginVault: "Origin Vault",
    earnHoldUsdx: "持有 USDx",
    earnStakeUsdx: "质押 USDx",
    earnUpdated: "倍率数据更新",
    earnBoostNote: "符合条件时，邀请码 +20% 会叠加在官方基础倍率之上；倍率不等于 APY。",
    apyCoordinatesOnly: "仅积分",
    apyVariable: "收益随市场变化",
    apyNotQuoted: "暂无 APY",
    strategyKicker: "STRATEGY ESTIMATOR",
    strategyTitle: "策略收益计算器",
    strategyLabel: "当前策略",
    strategyAmount: "投入金额",
    strategyApy: "预估 APY",
    strategyMultiplier: "Coordinates 倍率",
    strategyTge: "TGE 时间",
    ytExpiryHint: "YT 到期日",
    strategyBoost: "应用邀请码倍率加成",
    strategyResultTitle: "TGE 预计收益",
    strategyProfitCaption: "按 APY 日化复利估算",
    strategyPointsTitle: "TGE 预计积分收益",
    strategyPointsRateNote: "每 $1 每日 {rate} Coordinates，再乘策略倍率",
    strategyTotal: "TGE 预计总额",
    strategyDailyPoints: "预计每日积分",
    strategyDays: "计息天数",
    strategyEffectiveApy: "采用 APY",
    strategyEffectiveMultiplier: "含 Boost 倍率",
    strategyOpen: "打开所选策略",
    strategyOfficialApy: "已带入 AXIS 当前展示的 APY，可自行修改。",
    strategyVariableApy: "AXIS 未提供固定 APY；YT 收益取决于市场价格与到期前收益，请输入你的预期 APY。",
    strategyCoordinatesApy: "该策略仅展示 Coordinates 收益，APY 默认按 0% 处理，可自行修改。",
    strategyUnquotedApy: "AXIS 暂未展示该策略 APY，默认按 0% 处理，可自行修改。",
    howTitle: "计算方式",
    howCopy: "从今天到 TGE，将全网 Coordinates 按每日增幅复利计算，再用 FDV 与空投比例得到空投池价值，按你的有效积分占复利后总积分的比例分配。",
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
    metaDescription: "Estimate a potential AXIS airdrop using official Coordinates data and the latest Earn multipliers. Defaults: $200M FDV, 2% daily compound growth, and 5% allocation.",
    axisLogoAria: "Open AXIS Coordinates",
    navAria: "Primary navigation",
    navCalculator: "Calculator",
    navEarn: "Earn rates",
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
    growthToTge: "Daily compound points growth",
    tgeDate: "TGE date",
    referralBoost: "Referral bonus",
    boostNote: "Turn off the 20% Boost if your input already includes the referral bonus.",
    estimatedValue: "Estimated airdrop value",
    effectivePoints: "Effective points",
    estimatedShare: "Estimated network share",
    poolValue: "Airdrop pool value",
    millionPointValue: "Value per 1M points",
    formulaLabel: "Formula",
    formula: "FDV × allocation × effective points ÷ [network points × (1 + daily growth)^days]",
    marketTotal: "Official Coordinates",
    marketProjected: "Compounded at TGE",
    marketTge: "TGE date",
    marketWallets: "Participating wallets",
    marketUpdated: "Data updated",
    earnTitle: "Official Earn multipliers",
    earnCopy: "Coordinates rates vary by position. The figures below come from the AXIS Earn page.",
    earnCta: "View live Earn",
    earnGroupAxis: "USDx products",
    earnGroupCurve: "Curve pools",
    earnGroupPendle: "Pendle markets",
    earnOriginVault: "Origin Vault",
    earnHoldUsdx: "Hold USDx",
    earnStakeUsdx: "Stake USDx",
    earnUpdated: "Rates updated",
    earnBoostNote: "When eligible, the +20% referral boost stacks on the official base rate. Multipliers are not APY.",
    apyCoordinatesOnly: "Coordinates only",
    apyVariable: "Market-dependent return",
    apyNotQuoted: "APY not quoted",
    strategyKicker: "STRATEGY ESTIMATOR",
    strategyTitle: "Strategy yield calculator",
    strategyLabel: "Current strategy",
    strategyAmount: "Principal",
    strategyApy: "Estimated APY",
    strategyMultiplier: "Coordinates multiplier",
    strategyTge: "TGE date",
    ytExpiryHint: "YT expiry",
    strategyBoost: "Apply referral multiplier boost",
    strategyResultTitle: "Estimated yield at TGE",
    strategyProfitCaption: "Estimated using APY converted to a daily rate",
    strategyPointsTitle: "Estimated Coordinates at TGE",
    strategyPointsRateNote: "{rate} Coordinates per $1 per day, then multiplied by the strategy rate",
    strategyTotal: "Estimated value at TGE",
    strategyDailyPoints: "Estimated daily Coordinates",
    strategyDays: "Earning days",
    strategyEffectiveApy: "APY used",
    strategyEffectiveMultiplier: "Multiplier with Boost",
    strategyOpen: "Open selected strategy",
    strategyOfficialApy: "Using the APY currently shown by AXIS. You can edit it.",
    strategyVariableApy: "AXIS does not quote a fixed APY. YT return depends on market price and yield to expiry; enter your own APY assumption.",
    strategyCoordinatesApy: "This strategy shows Coordinates only. APY defaults to 0% and remains editable.",
    strategyUnquotedApy: "AXIS does not currently quote an APY for this strategy. It defaults to 0% and remains editable.",
    howTitle: "How it works",
    howCopy: "From today to TGE, network Coordinates compound at the daily growth rate. We then derive the airdrop pool from FDV and allocation and apply your effective share of the compounded total.",
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
  earnUpdatedAt: document.querySelector("#earnUpdatedAt"),
  earnRows: document.querySelectorAll("[data-earn-id]"),
  strategyForm: document.querySelector("#strategyForm"),
  strategySelect: document.querySelector("#strategySelect"),
  strategyAmount: document.querySelector("#strategyAmountInput"),
  strategyApy: document.querySelector("#strategyApyInput"),
  strategyMultiplier: document.querySelector("#strategyMultiplierInput"),
  strategyTge: document.querySelector("#strategyTgeInput"),
  strategyBoost: document.querySelector("#strategyBoostInput"),
  strategyReset: document.querySelector("#strategyResetButton"),
  strategyApyNote: document.querySelector("#strategyApyNote"),
  strategyProfit: document.querySelector("#strategyProfit"),
  strategyPoints: document.querySelector("#strategyPoints"),
  strategyDailyPoints: document.querySelector("#strategyDailyPoints"),
  strategyPointsRateNote: document.querySelector("#strategyPointsRateNote"),
  strategyTotal: document.querySelector("#strategyTotal"),
  strategyDays: document.querySelector("#strategyDays"),
  strategyApySummary: document.querySelector("#strategyApySummary"),
  strategyMultiplierSummary: document.querySelector("#strategyMultiplierSummary"),
  strategyLink: document.querySelector("#strategyLink"),
  dataStatus: document.querySelector("#dataStatus"),
  dataStatusText: document.querySelector("#dataStatusText"),
  metaDescription: document.querySelector('meta[name="description"]'),
};

let stats = FALLBACK_STATS;
let dataState = "loadingData";
let language = getStoredLanguage();
let strategyInputsDirty = false;

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

function formatEarnApy(apy) {
  const copy = TRANSLATIONS[language];
  if (apy?.type === "rate" && typeof apy.value === "string") {
    return `${apy.value} APY`;
  }
  if (apy?.type === "coordinates-only") return copy.apyCoordinatesOnly;
  if (apy?.type === "variable") return copy.apyVariable;
  return copy.apyNotQuoted;
}

function getEarnOpportunities() {
  return Array.isArray(stats.earnOpportunities)
    ? stats.earnOpportunities
    : FALLBACK_STATS.earnOpportunities;
}

function getStrategy() {
  const opportunities = getEarnOpportunities();
  return opportunities.find((item) => item.id === elements.strategySelect.value)
    ?? opportunities[0];
}

function getStrategyApyValue(opportunity) {
  if (opportunity?.apy?.type !== "rate") return 0;
  const value = Number.parseFloat(opportunity.apy.value);
  return Number.isFinite(value) ? value : 0;
}

function getStrategyApyNote(opportunity) {
  const copy = TRANSLATIONS[language];
  if (opportunity?.apy?.type === "rate") return copy.strategyOfficialApy;
  if (opportunity?.apy?.type === "variable") return copy.strategyVariableApy;
  if (opportunity?.apy?.type === "coordinates-only") return copy.strategyCoordinatesApy;
  return copy.strategyUnquotedApy;
}

function renderStrategyOptions() {
  const selectedId = elements.strategySelect.value || DEFAULTS.strategy;
  const labels = STRATEGY_LABELS[language];
  elements.strategySelect.replaceChildren(
    ...getEarnOpportunities().map((opportunity) => {
      const option = document.createElement("option");
      option.value = opportunity.id;
      option.textContent = `${labels[opportunity.id] ?? opportunity.id} · ${opportunity.multiplier}x`;
      return option;
    }),
  );
  elements.strategySelect.value = getEarnOpportunities().some((item) => item.id === selectedId)
    ? selectedId
    : DEFAULTS.strategy;
}

function applySelectedStrategyDefaults() {
  const opportunity = getStrategy();
  if (!opportunity) return;
  elements.strategyApy.value = getStrategyApyValue(opportunity);
  elements.strategyMultiplier.value = opportunity.multiplier;
  elements.strategyTge.value = opportunity.tge || stats.strategyTge || DEFAULTS.strategyTge;
  elements.strategyLink.href = opportunity.url || stats.earnSource || FALLBACK_STATS.earnSource;
  elements.strategyApyNote.textContent = getStrategyApyNote(opportunity);
  calculateStrategy();
}

function updateStrategyContext() {
  const opportunity = getStrategy();
  if (!opportunity) return;
  elements.strategyLink.href = opportunity.url || stats.earnSource || FALLBACK_STATS.earnSource;
  elements.strategyApyNote.textContent = getStrategyApyNote(opportunity);
}

function renderEarnData() {
  const opportunities = getEarnOpportunities();
  const byId = new Map(opportunities.map((opportunity) => [opportunity.id, opportunity]));

  elements.earnRows.forEach((row) => {
    const opportunity = byId.get(row.dataset.earnId);
    if (!opportunity) return;
    row.querySelector("[data-earn-multiplier]").textContent = `${opportunity.multiplier}x`;
    row.querySelector("[data-earn-apy]").textContent = formatEarnApy(opportunity.apy);
  });
  elements.earnUpdatedAt.textContent = formatDate(stats.earnUpdatedAt ?? stats.timestamp);
}

function getDateData(input, fallback) {
  const rawDate = input.value || fallback;
  const [year, month, day] = rawDate.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Number.isNaN(target.getTime())
    ? 0
    : Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
  const dateLabel = `${String(year).padStart(4, "0")}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  return { dateLabel, diffDays };
}

function getTgeData() {
  return getDateData(elements.tge, DEFAULTS.tge);
}

function getTgeSummary({ dateLabel, diffDays }) {
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
  const growth = Math.min(100, Math.max(0, numberValue(elements.growth)));
  const boostMultiplier = elements.boost.checked ? 1.2 : 1;
  const tgeData = getTgeData();
  const compoundingDays = Math.max(0, tgeData.diffDays);

  const effectivePoints = points * boostMultiplier;
  const growthFactor = Math.pow(1 + growth / 100, compoundingDays);
  const projectedTotalPoints = Math.max(1, stats.totalPoints * growthFactor);
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
  elements.tgeSummary.textContent = getTgeSummary(tgeData);
  elements.totalWallets.textContent = integerNumber(stats.totalWallets);
  elements.updatedAt.textContent = formatDate(stats.timestamp);
}

function calculateStrategy() {
  const amount = Math.max(0, numberValue(elements.strategyAmount));
  const apy = Math.max(0, numberValue(elements.strategyApy));
  const multiplier = Math.max(0, numberValue(elements.strategyMultiplier));
  const days = Math.max(0, getDateData(elements.strategyTge, DEFAULTS.strategyTge).diffDays);
  const dailyRate = Math.pow(1 + apy / 100, 1 / 365) - 1;
  const total = amount * Math.pow(1 + dailyRate, days);
  const profit = total - amount;
  const effectiveMultiplier = multiplier * (elements.strategyBoost.checked ? 1.2 : 1);
  const configuredBaseRate = Number(stats.pointsPerUsdPerDay);
  const pointsPerUsdPerDay = Number.isFinite(configuredBaseRate) && configuredBaseRate > 0
    ? configuredBaseRate
    : FALLBACK_STATS.pointsPerUsdPerDay;
  const dailyPoints = amount * pointsPerUsdPerDay * effectiveMultiplier;
  const totalPoints = dailyPoints * days;

  elements.strategyProfit.textContent = currency(profit);
  elements.strategyPoints.textContent = `${compactNumber(totalPoints)} PTS`;
  elements.strategyDailyPoints.textContent = `${compactNumber(dailyPoints)} PTS`;
  elements.strategyPointsRateNote.textContent = TRANSLATIONS[language].strategyPointsRateNote.replace(
    "{rate}",
    pointsPerUsdPerDay.toLocaleString("en-US", { maximumFractionDigits: 4 }),
  );
  elements.strategyTotal.textContent = currency(total);
  elements.strategyDays.textContent = integerNumber(days);
  elements.strategyApySummary.textContent = `${apy.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
  elements.strategyMultiplierSummary.textContent = `${effectiveMultiplier.toLocaleString("en-US", { maximumFractionDigits: 2 })}x`;
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
  renderEarnData();
  renderStrategyOptions();
  updateStrategyContext();
  calculateStrategy();
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

function resetStrategyDefaults() {
  strategyInputsDirty = false;
  elements.strategySelect.value = DEFAULTS.strategy;
  elements.strategyAmount.value = DEFAULTS.strategyAmount;
  elements.strategyBoost.checked = DEFAULTS.strategyBoost;
  applySelectedStrategyDefaults();
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
  renderEarnData();
  renderStrategyOptions();
  if (!strategyInputsDirty) applySelectedStrategyDefaults();
  else updateStrategyContext();
  calculateStrategy();
  calculate();
}

elements.form.addEventListener("input", calculate);
elements.reset.addEventListener("click", resetDefaults);
elements.strategyForm.addEventListener("input", (event) => {
  if (event.target !== elements.strategySelect) strategyInputsDirty = true;
  calculateStrategy();
});
elements.strategySelect.addEventListener("change", () => {
  strategyInputsDirty = true;
  applySelectedStrategyDefaults();
});
elements.strategyReset.addEventListener("click", resetStrategyDefaults);
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
resetStrategyDefaults();
loadStats();
