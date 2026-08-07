// R14 修正：对象追踪仅离场时进行（33 文件：BATTLE 9 两处 + NTRS12 24 一处）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));

const B_S2_OLD = '**同时为场上每个已登场💔对象输出一行【对象动向追踪】**：位置=[在场·[位置] / 离场·[去向]]；状态=[独处/社交/外出/在家/工作等]，一行/对象——对象离场也须列出（避免离场后绝对静止），供黄毛尾随/赶赴判定与 S3 场景外/回归编排衔接。';
const B_S2_NEW = '**为场上离场的💔对象输出【对象动向追踪】**：位置=[离场·[去向]]；状态=[独处/社交/外出/在家/工作等]，一行/对象——**仅对象离场时追踪**（在场对象 {{user}} 直接可见，不追踪）；离场对象必须列出（避免离场后绝对静止），供黄毛尾随/赶赴判定与 S3 场景外/回归编排衔接。';
const B_S3_OLD = '【对象动向追踪】每个已登场💔对象的动向（位置+状态，一行/对象）——对象离场不静止（场景外动向戏/回归契机），与黄毛动向联动编排：';
const B_S3_NEW = '【对象动向追踪】每个离场的已登场💔对象动向（位置+状态，一行/对象）——仅对象离场时追踪（在场对象不追踪）；离场对象不静止（场景外动向戏/回归契机），与黄毛动向联动编排：';
const N_S2_OLD = '**thugSpawn 内同时输出【对象动向追踪】**：为场上每个已登场💔对象补一行——位置=[在场·[位置] / 离场·[去向]]；状态=[独处/社交/外出/在家/工作等]，一行/对象（对象离场也须列出——避免离场后绝对静止），供黄毛尾随判定与 S3 场景外/回归编排衔接。';
const N_S2_NEW = '**thugSpawn 内输出【对象动向追踪】（仅离场对象）**：为场上离场的已登场💔对象补一行——位置=[离场·[去向]]；状态=[独处/社交/外出/在家/工作等]，一行/对象（**仅对象离场时追踪**——在场对象 {{user}} 直接可见不追踪；离场对象必须列出，避免离场后绝对静止），供黄毛尾随判定与 S3 场景外/回归编排衔接。';

let fail = 0;
for (const fn of files) {
  const isB = fn.startsWith('Cirno_BATTLE_Turn');
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level ' + fn); fail++; continue; }
  let n = 0, fileHadOld = false;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = apply(v); } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = apply(v); } else walk(v); }
  }
  function apply(s) {
    let t = s;
    if (isB) {
      if (t.includes(B_S2_OLD)) { t = t.split(B_S2_OLD).join(B_S2_NEW); n++; fileHadOld = true; }
      if (t.includes(B_S3_OLD)) { t = t.split(B_S3_OLD).join(B_S3_NEW); n++; fileHadOld = true; }
    } else {
      if (t.includes(N_S2_OLD)) { t = t.split(N_S2_OLD).join(N_S2_NEW); n++; fileHadOld = true; }
    }
    return t;
  }
  walk(j);
  const out = JSON.stringify(j, null, 2);
  fs.writeFileSync(p, out, 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  let ok = true;
  try { JSON.parse(back); } catch (e) { ok = false; }
  if (!back.trim().startsWith('[')) ok = false;
  const onlyLeave = blob.includes('仅对象离场时追踪') || blob.includes('仅对象离场时追踪');
  const newOk = isB ? (blob.includes('为场上离场的💔对象输出【对象动向追踪】') && blob.includes('每个离场的已登场💔对象动向')) : blob.includes('thugSpawn 内输出【对象动向追踪】（仅离场对象）');
  const oldGone = isB ? (!blob.includes('同时为场上每个已登场💔对象输出一行') && !blob.includes('每个已登场💔对象的动向（位置+状态，一行/对象）——对象离场不静止')) : !blob.includes('thugSpawn 内同时输出【对象动向追踪】');
  console.log(fn + ' | 替换=' + n + ' 旧文残留=' + (!oldGone) + ' ' + (ok && newOk && oldGone && n > 0 ? 'OK' : '[FAIL]'));
  if (!ok || !newOk || !oldGone || n === 0) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
