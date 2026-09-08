import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import fs from 'node:fs';
import assert from 'node:assert/strict';
fs.mkdirSync('.tmp', { recursive: true });
const server=createServer((req,res)=>{const path='public'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html');try{res.setHeader('Content-Type',path.endsWith('.svg')?'image/svg+xml':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(path));}catch{res.statusCode=404;res.end();}}).listen(4186);
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:4186');await page.waitForFunction(()=>document.querySelector('#strategySelect').options.length===11);
assert.equal(await page.locator('form').count(), 1);
assert.equal(await page.locator('#strategyForm #fdvInput').count(), 1);
await page.selectOption('#strategySelect','origin-vault');
const yearLater = await page.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 365); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-'); });
await page.fill('#tgeInput', yearLater); await page.fill('#strategyTgeInput', yearLater);
await page.fill('#strategyApyInput','10'); await page.fill('#fdvInput','0');
assert.equal(await page.textContent('#totalApy'),'10%');
await page.fill('#fdvInput','200');
const combinedApy = await page.textContent('#totalApy'); assert.ok(parseFloat(combinedApy.replaceAll(',','')) > 10);
await page.fill('#pointsInput','999999999'); assert.equal(await page.textContent('#totalApy'),combinedApy);
await page.click('#strategyResetButton'); assert.equal(await page.inputValue('#pointsInput'),'1000000');
await page.selectOption('#strategySelect','pendle-usdx-yt'); await page.fill('#fdvInput','0'); assert.equal(await page.textContent('#totalApy'),'-100%');
await page.click('#strategyResetButton');
await page.selectOption('#strategySelect','pendle-susdx-yt');
assert.equal(await page.locator('#ytPriceInput').isVisible(),true);
assert.ok(Number(await page.inputValue('#ytPriceInput'))>0);
await page.fill('#fdvInput','0'); assert.equal(await page.textContent('#strategyAirdrop'),'$0.00');
await page.fill('#fdvInput','200');
for(const id of ['pendle-susdx-pt','pendle-susdx-lp','stake-usdx','pendle-usdx-yt']){await page.selectOption('#strategySelect',id);assert.ok(!(await page.textContent('#strategyProfit')).includes('NaN'));}
assert.match(await page.textContent('#strategyYield'),/-/);
await page.selectOption('#strategySelect','pendle-susdx-lp');assert.ok(Number(await page.inputValue('#strategyApyInput'))>25);
await page.evaluate(() => window.scrollTo(0,0));await page.screenshot({path:'.tmp/qa-desktop.png',fullPage:true});
await page.click('#languageToggle');await page.setViewportSize({width:390,height:844});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.screenshot({path:'.tmp/qa-mobile.png',fullPage:true});
await page.fill('#strategyAmountInput','0');assert.equal(await page.textContent('#strategyProfit'),'$0.00');assert.equal(await page.textContent('#totalApy'),'—');
await page.fill('#strategyAmountInput','10000');await page.fill('#tgeInput','2020-01-01');assert.equal(await page.textContent('#strategyPoints'),'0 PTS');assert.equal(await page.textContent('#totalApy'),'—');
assert.deepEqual(errors,[]);console.log('Browser checks passed: 11 strategies, YT prices/cost, shared valuation, LP APY, mobile overflow, bilingual render.');
}finally{await browser.close();server.close();}


