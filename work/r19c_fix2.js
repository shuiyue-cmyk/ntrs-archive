// R19c 修正版：NTRS 系「（不发给正文）」括注删除（修复 n 计数）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const FROM = '进度百分比等调度信息只写在 stage 暗流字段（不发给正文），不要写进 plot 正文';
const TO = '进度百分比等调度信息只写在 stage 暗流字段，不要写进 plot 正文';
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  let n = 0;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { const r = apply(v); if (r !== v) { o[i] = r; } } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { const r = apply(v); if (r !== v) { o[k] = r; } } else walk(v); }
  }
  function apply(s) {
    if (s.includes(FROM)) { n++; return s.split(FROM).join(TO); }
    return s;
  }
  walk(j);
  if (n > 0) fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  const resid = blob.split('不发给正文').length - 1;
  const ok = resid === 0;
  console.log(fn + ' | 改=' + n + ' 不发给正文残留=' + resid + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
