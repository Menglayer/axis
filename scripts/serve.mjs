import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const root = resolve('public');
const run = promisify(execFile);
let refresh;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.writeHead(405).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/api/axis-stats') {
      // Coalesce simultaneous page opens; a later open always starts a new refresh.
      refresh ??= run(process.execPath, ['scripts/fetch-axis-stats.mjs'], { timeout: 85000 })
        .then(() => readFile(resolve(root, 'data/axis-stats.json')))
        .finally(() => { refresh = undefined; });
      const data = await refresh;
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(data);
      return;
    }
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(data);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' ? 404 : 503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Live data unavailable' }));
  }
}).listen(Number(process.env.PORT) || 3000, process.env.HOST || '127.0.0.1', () => console.log('AXIS server ready'));
