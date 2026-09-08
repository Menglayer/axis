# AXIS Airdrop Calculator

一个可直接部署到 GitHub Pages 的单页 AXIS 空投价值计算器。

- 默认 FDV：`$200M`
- 默认全网积分每日复利增幅：`2%`
- 默认空投比例：`5%`
- 默认 TGE：`2026-12-31`，支持日期调整与倒计时
- 可选邀请码 `20% Boost`
- 同步 AXIS Earn 的 9 个官方赚分机会、Coordinates 倍率与可用 APY
- 积分估值与 Earn 共用 FDV、空投比例、全网增长及 TGE；新增积分空投计入策略净收益
- 策略 TGE 默认采用 Pendle USDx / sUSDx YT 到期日 `2026-12-03`
- 自动计算从今天到 TGE 的 APY 日化复利收益与预计总额
- 支持中文 / English 一键切换
- 显眼的 MengLayer 作者入口直达 `https://x.com/menglayer`
- GitHub Actions 仅保留手动刷新入口，不再定时运行
- 自定义域名：`axis.menglayer.cc`

## 计算口径

```text
有效积分 = 输入积分 ×（开启 Boost 时为 1.2）
复利天数 = max(0, TGE 日期 - 今天)
预计 TGE 全网积分 = 官方总 Coordinates ×（1 + 每日增幅）^复利天数
空投池价值 = FDV × 空投比例
预估空投价值 = 空投池价值 × 有效积分 ÷ 预计全网积分
```

如果输入的是已经包含邀请加成的 Coordinates，应关闭 Boost，避免重复计算。

策略收益使用 APY 对应的日化复利口径：

```text
日收益率 = (1 + APY)^(1 / 365) - 1
TGE 预计总额 = 投入金额 × (1 + 日收益率)^计息天数
TGE 预计收益 = TGE 预计总额 - 投入金额
含 Boost 倍率 = Coordinates 倍率 × 1.2
预计每日积分 = 投入金额 × 官方每日基础积分 × 含 Boost 倍率
TGE 预计积分收益 = 预计每日积分 × 计息天数
```

当前官方 Campaign 配置的基础速率为每 `$1` 合格仓位每天 `1 Coordinates`。Pendle 数据读取同源 `public/data/pendle-markets.json`，显示快照时间。PT 使用 impliedApy，LP 使用未加成 aggregatedApy，sUSDx 质押使用 AXIS Earn 展示 APY。PT 积分资格未确认，默认 0x。未报价的 Curve 保留可编辑假设。积分按投入金额恒定估算，Coordinates 倍率不混入资金收益计算。

## 本地预览

```powershell
python -m http.server 4173 --directory public
```

打开 `http://127.0.0.1:4173/`。

## 校验

```powershell
npm run check
```

## 数据更新

AXIS 官方 API 只允许特定来源直接访问，浏览器从自定义域名请求会被 Cloudflare 拦截。因此页面读取仓库中的同源精简快照，包含总积分、钱包数、更新时间和 Earn 倍率，不存储 Top 100 排行。GitHub 定时任务保持关闭，按需手动同步。

手动刷新：

```powershell
npm run refresh:data
```

刷新脚本需要本机 Chrome 或 Edge，并会同时读取 `https://app.axis.to/earn` 与官方积分 API。

## Pendle 与综合收益

`npm run refresh:pendle` 从 Pendle 公开 API 更新两个市场；`npm run refresh:data` 同时更新 AXIS 和 Pendle。无自动定时任务。

YT 数量 = 投入 / 实际 YT 美元价格；积分名义本金 = YT 数量 × accountingAsset 美元价格。YT 收益估算 = 名义本金 × [(1 + 底层利息 APY)^(天数 / 365) − 1 + 奖励 APR × 天数 / 365] × 95%，扣除全部买入成本；提前结束不计卖出残值。无底层收益的 USDx YT 资金净收益为负投入。

策略收益截至策略结束、TGE、市场到期三者最早日期。新增积分使用统一 TGE 积分价格，已含策略 Boost，不重复叠加。综合净收益 = 资金净收益 + 新增积分空投估值。已有积分单独合并展示，不计作本次投资回报。APY 为当前快照延续假设，未计交易费、滑点与价格变动。

## 单一计算器与总 APY

原积分估值表单已并入策略表单，统一重置。总 APY = [(预计回收金额含新增积分空投 / 投入)^(365 / 距 TGE 天数) − 1] × 100%。策略早于 TGE 结束时，底息在策略结束停止，年化仍包含等候空投的时间。已有积分不计入投资回报；YT 已扣买入成本。金额或期限为零时显示 —。此为情景复利年化，不代表积分奖励可重复投资。

收益时间精确至秒，日期按 UTC 00:00 处理，与 Pendle 到期时间一致。YT 官方预计 APY 使用 ytFloatingApy，与 underlyingApy 区分。公式依据 https://docs.pendle.finance/pendle-v2/ProtocolMechanics/PendleMarketAPYCalculation 。
