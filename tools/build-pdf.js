// Builds the hand-in PDF from the real slides: cover, slides 1-6, references, every answer open.
// Run from the repo root:  npm i && CHROME="/path/to/Google Chrome" npm run pdf -- "output.pdf"
const fs = require('fs'), path = require('path'), http = require('http'), vm = require('vm');
const puppeteer = require('puppeteer-core');
const { PDFDocument } = require('pdf-lib');

const OUT = process.argv[2] || 'acute-limb-ischemia-case4.pdf';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIMIT = 10 * 1024 * 1024; // course limit
const ROOT = process.cwd(), PORT = 8934;

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('slides.js', 'utf8'), ctx);
const ids = ctx.window.ALI.slides.filter(s => !s.bonus).map(s => s.id);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg' };
const srv = http.createServer((q, r) => {
  const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0].replace(/\/$/, '/index.html')));
  fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b); } });
});

(async () => {
  await new Promise(ok => srv.listen(PORT, '127.0.0.1', ok));
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-first-run', '--disable-extensions'] });
  const merged = await PDFDocument.create();
  merged.setTitle('Acute limb ischemia: CVS I Case 4');
  let cut = 0;
  for (const id of ids) {
    const p = await b.newPage();
    await p.setViewport({ width: 1280, height: 720 });
    await p.emulateMediaType('screen');
    await p.goto(`http://127.0.0.1:${PORT}/index.html?pdf=1#${id}`, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    /* The cover details come from the environment so a student ID never lands in this public repo. */
    await p.evaluate(who => {
      const blanks = document.querySelectorAll('.presenter b');
      who.forEach((v, i) => { if (v && blanks[i]) blanks[i].textContent = v; });
    }, [process.env.PRESENTER_NAME, process.env.PRESENTER_ID, process.env.PRESENTER_GROUP]);
    const over = await p.evaluate(() => { const s = document.getElementById('stage'); return s.scrollHeight - s.clientHeight; });
    if (over > 1) { console.log(`CUT OFF: ${id} overflows by ${over}px`); cut++; }
    const buf = await p.pdf({ width: '1280px', height: '720px', printBackground: true, pageRanges: '1' });
    const one = await PDFDocument.load(buf);
    (await merged.copyPages(one, [0])).forEach(pg => merged.addPage(pg));
    await p.close();
  }
  await b.close(); srv.close();
  fs.writeFileSync(OUT, await merged.save());
  const size = fs.statSync(OUT).size;
  console.log(`${OUT}: ${ids.length} pages, ${(size / 1024 / 1024).toFixed(2)} MB`);
  if (size > LIMIT || cut) { console.log('NOT READY: over 10 MB or a slide is cut off'); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
