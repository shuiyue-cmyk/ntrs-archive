// R19b：删除输出格式模板中误导性「- 不发给花火·正文」表述（33 文件）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const FIXES = [
  ['[章节舞台内容 - 不发给花火·正文]', '[章节舞台内容]'],
  ['[演员错误理解 - 不发给花火·正文]', '[演员错误理解]'],
  ['**cast模板（演员错误理解 - 不发给花火·正文）**:', '**cast模板（演员错误理解）**:'],
  ['调度信息只写在 stage 暗流字段（不发给正文），不要写进 plot 正文。', '调度信息只写在 stage 暗流字段，不要写进 plot 正文。'],
];
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level ' + fn); fail++; continue; }
  let n = 0;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = apply(v); } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = apply(v); } else walk(v); }
  }
  function apply(s) {
    let t = s;
    for (const [from, to] of FIXES) {
      if (t.includes(from)) { t = t.split(from).join(to); n++; }
    }
    return t;
  }
  walk(j);
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  const resid = blob.split('不发给花火·正文').length - 1;
  const ok = resid === 0 && blob.includes('[章节舞台内容]') && blob.includes('**cast模板（演员错误理解）**:');
  console.log(fn + ' | 替换=' + n + ' 残留不发给花火=' + resid + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
