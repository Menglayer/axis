# AXIS Airdrop Calculator

一个可直接部署到 GitHub Pages 的单页 AXIS 空投价值计算器。

- 默认 FDV：`$200M`
- 默认全网积分每日复利增幅：`2%`
- 默认空投比例：`5%`
- 默认 TGE：`2026-12-31`，支持日期调整与倒计时
- 可选邀请码 `20% Boost`
- 同步 AXIS Earn 的 9 个官方赚分机会、Coordinates 倍率与可用 APY
- 可选择当前策略并修改投入金额、APY、Coordinates 倍率与 TGE 日期
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

当前官方 Campaign 配置的基础速率为每 `$1` 合格仓位每天 `1 Coordinates`。AXIS 未公布固定 APY 的 Coordinates-only、Curve 与 Pendle YT/LP 策略默认按 `0%`，由用户自行输入预期 APY。积分按投入金额恒定估算，Coordinates 倍率不混入资金收益计算。

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
