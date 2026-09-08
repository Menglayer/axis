import { writeFile } from 'node:fs/promises';

const addresses = ['0x5e572498e9f83650f0ff24194999bddb4b390928', '0x0bef762d2094ac80821c657dea6783fc43435292'];
const markets = await Promise.all(addresses.map(async (address) => {
  const source = `https://api-v2.pendle.finance/core/v1/1/markets/${address}`;
  const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Pendle HTTP ${response.status}`);
  const data = await response.json();
  for (const value of [data.yt?.price?.usd, data.accountingAsset?.price?.usd, data.impliedApy, data.aggregatedApy, data.underlyingApy, data.underlyingInterestApy, data.underlyingRewardApy]) {
    if (!Number.isFinite(value) || value < 0) throw new Error('Invalid Pendle market');
  }
  if (!Number.isFinite(data.ytFloatingApy) || data.ytFloatingApy < -1) throw new Error('Invalid YT APY');
  return { address, source, expiry: data.expiry, updatedAt: data.dataUpdatedAt, priceUpdatedAt: data.yt.priceUpdatedAt, ytPrice: data.yt.price.usd, accountingPrice: data.accountingAsset.price.usd, ptApy: data.impliedApy, lpApy: data.aggregatedApy, underlyingApy: data.underlyingApy, underlyingInterestApy: data.underlyingInterestApy, underlyingRewardApr: data.underlyingRewardApy, ytApy: data.ytFloatingApy, ytRoi: data.ytRoi, ptRoi: data.ptRoi };
}));
await writeFile('public/data/pendle-markets.json', JSON.stringify({ fetchedAt: new Date().toISOString(), markets }, null, 2) + '\n');
console.log(JSON.stringify(markets, null, 2));

