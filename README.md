# AXIS Airdrop Calculator

一个可直接部署到 GitHub Pages 的单页 AXIS 空投价值计算器。

- 默认 FDV：`$200M`
- 默认全网积分每日复利增幅：`2%`
- 默认空投比例：`5%`
- 默认 TGE：`2026-12-31`，支持日期调整与倒计时
- 可选邀请码 `20% Boost`
- 支持中文 / English 一键切换
- 显眼的 MengLayer 作者入口直达 `https://x.com/menglayer`
- 官方 Coordinates 总量由 GitHub Actions 每小时通过 Chromium 刷新，失败会明确告警
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

AXIS 官方 API 只允许特定来源直接访问，浏览器从自定义域名请求会被 Cloudflare 拦截。因此页面读取仓库中的同源精简快照，定时工作流从官方接口更新总积分、钱包数和时间戳，不存储 Top 100 排行。

手动刷新：

```powershell
npm run refresh:data
```
