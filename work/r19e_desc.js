// R19e：删除 BATTLE 系 9 文件 S2 desc 的「不依赖任何表格：」机制表述（desc 定位=世界书选择依据）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno_BATTLE_Turn') && !f.includes('bak'));
const FROM = '不依赖任何表格：从剧情中梳理';
const TO = '从剧情中梳理';
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = (root.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  if (!s2 || !s2.description) { console.log('[FAIL] no s2 desc ' + fn); fail++; continue; }
  let d = s2.description;
  let n = 0;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string' && v.includes(FROM)) { o[i] = v.split(FROM).join(TO); n++; } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string' && v.includes(FROM)) { o[k] = v.split(FROM).join(TO); n++; } else walk(v); }
  }
  walk(j);
  if (n > 0) fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root2 = Array.isArray(back) ? back[0] : back;
  const s22 = (root2.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  const resid = (s22.description || '').includes('不依赖任何表格');
  const ok = n > 0 && !resid;
  console.log(fn + ' | 删=' + n + ' 残留=' + resid + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
