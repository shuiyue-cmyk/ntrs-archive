// R10 收尾修复：FT/DEI 八题→九题；三版 NTRS·雄竞「（见 B2）」规格引用清除
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const fixes = [
  { fn: 'Cirno_BATTLE_Turn_FT.json', from: '必须自问以下八题', to: '必须自问以下九题' },
  { fn: 'Cirno_BATTLE_Turn_DEI.json', from: '必须自问以下八题', to: '必须自问以下九题' },
  { fn: 'Cirno_BATTLE_Turn_straight_NTRS.json', from: '按 NTRS推进逻辑推进（见 B2）', to: '按 NTRS推进逻辑推进（起点见下方）' },
  { fn: 'Cirno_BATTLE_Turn_FT_NTRS.json', from: '按 NTRS推进逻辑推进（见 B2）', to: '按 NTRS推进逻辑推进（起点见下方）' },
  { fn: 'Cirno_BATTLE_Turn_DEI_NTRS.json', from: '按 NTRS推进逻辑推进（见 B2）', to: '按 NTRS推进逻辑推进（起点见下方）' },
];
let fail = 0;
for (const f of fixes) {
  const p = dir + f.fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level not array: ' + f.fn); fail++; continue; }
  let n = 0;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string' && v.includes(f.from)) { o[i] = v.split(f.from).join(f.to); n++; } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string' && v.includes(f.from)) { o[k] = v.split(f.from).join(f.to); n++; } else walk(v); }
  }
  walk(j);
  const out = JSON.stringify(j, null, 2);
  fs.writeFileSync(p, out, 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  let ok = true;
  try { JSON.parse(back); } catch (e) { ok = false; console.log('[FAIL] JSON invalid after write: ' + f.fn + ' ' + e.message); }
  if (!back.trim().startsWith('[')) { ok = false; console.log('[FAIL] top-level not array after write: ' + f.fn); }
  const remain = (back.match(new RegExp(f.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  const newCnt = (back.match(new RegExp(f.to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  console.log(f.fn + ' | replaced=' + n + ' | remain=' + remain + ' | new=' + newCnt + (ok ? ' OK' : ' [FAIL]'));
  if (!ok || remain !== 0 || newCnt === 0) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
