// R14：对象动向追踪（18 原版 + 15 _2ALL = 33 文件；_2ALL 版含骚扰者联动）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));

const BATTLE_S2_OLD = '供本轮行动判定与后续轮次衔接。';
const BATTLE_S2_NEW = '供本轮行动判定与后续轮次衔接。**同时为场上每个已登场💔对象输出一行【对象动向追踪】**：位置=[在场·[位置] / 离场·[去向]]；状态=[独处/社交/外出/在家/工作等]，一行/对象——对象离场也须列出（避免离场后绝对静止），供黄毛尾随/赶赴判定与 S3 场景外/回归编排衔接。';
const BATTLE_S3_OLD = '你须照其编排对应线状态的戏——目标离场时黄毛仍可尾随/赶赴行动：';
const BATTLE_S3_NEW = '你须照其编排对应线状态的戏——目标离场时黄毛仍可尾随/赶赴行动：\n【对象动向追踪】每个已登场💔对象的动向（位置+状态，一行/对象）——对象离场不静止（场景外动向戏/回归契机），与黄毛动向联动编排：';
const NTRS_S2_OLD = '两种分支都输出 <thugSpawn> 与 <thugSpawnReason>。';
const NTRS_S2_NEW = '两种分支都输出 <thugSpawn> 与 <thugSpawnReason>。**thugSpawn 内同时输出【对象动向追踪】**：为场上每个已登场💔对象补一行——位置=[在场·[位置] / 离场·[去向]]；状态=[独处/社交/外出/在家/工作等]，一行/对象（对象离场也须列出——避免离场后绝对静止），供黄毛尾随判定与 S3 场景外/回归编排衔接。';
const HARASS = '**（_2ALL 版：对象为乐享型·人尽可夫时，离场动向中可自然刷新临时性骚扰者——对象动向行带出「遭遇性骚扰」，S3 照 _2ALL 设定编排骚扰互动）**';

let fail = 0;
for (const fn of files) {
  const isBATTLE = fn.startsWith('Cirno_BATTLE_Turn');
  const is2ALL = fn.endsWith('_2ALL.json');
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level ' + fn); fail++; continue; }
  let n = 0, misses = [];
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = apply(v); } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = apply(v); } else walk(v); }
  }
  function apply(s) {
    let t = s;
    if (isBATTLE) {
      if (t.includes(BATTLE_S2_OLD)) { t = t.split(BATTLE_S2_OLD).join(BATTLE_S2_NEW + (is2ALL ? HARASS : '')); n++; } else misses.push('B_S2');
      if (t.includes(BATTLE_S3_OLD)) { t = t.split(BATTLE_S3_OLD).join(BATTLE_S3_NEW); n++; } else misses.push('B_S3');
    } else {
      if (t.includes(NTRS_S2_OLD)) { t = t.split(NTRS_S2_OLD).join(NTRS_S2_NEW + (is2ALL ? HARASS : '')); n++; } else misses.push('N_S2');
    }
    return t;
  }
  walk(j);
  const out = JSON.stringify(j, null, 2);
  fs.writeFileSync(p, out, 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  let ok = true;
  try { JSON.parse(back); } catch (e) { ok = false; console.log('[FAIL] JSON ' + fn); }
  if (!back.trim().startsWith('[')) { ok = false; console.log('[FAIL] array ' + fn); }
  const hasObj = blob.includes('对象动向追踪');
  const hasHarass = is2ALL ? blob.includes('乐享型·人尽可夫时，离场动向中可自然刷新临时性骚扰者') : true;
  const missSet = [...new Set(misses)];
  console.log(fn + ' | 替换=' + n + ' 对象追踪=' + hasObj + ' 骚扰联动=' + hasHarass + (missSet.length ? ' [MISS: ' + missSet.join(',') + ']' : '') + ' ' + (ok && hasObj && hasHarass && missSet.length === 0 ? 'OK' : '[FAIL]'));
  if (!ok || !hasObj || !hasHarass || missSet.length) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
