// R10 验证脚本：6 版 JSON 有效性 + 顶层数组 + NEW 文本存在 + 残扫
// 用法: node r10_verify.js
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';

const pure = ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json'];
const hybrid = ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
const all = [...pure, ...hybrid];

// 关键 NEW key-phrase（子串级检查）
const pureChecks = [
  ['A1', '已站队对象胜负判定'],
  ['A2', '雄竞期内既有倾向不计黄毛败'],
  ['A3', '已站队对象（亲密开局）编排'],
  ['A4', '守成方'],
  ['A5', '亲密开局核验'],
];
const hybridChecks = [
  ['B1', '亲密开局分流'],
  ['B1b', '低接受度完整五阶段'],
  ['B2', '亲密开局分流'],
  ['B3', '亲密开局分流'],
  ['B4', 'NTRS期·亲密开局'],
  ['B5', '亲密开局路径'],
  ['B6', '含亲密开局'],
];

let fail = 0;
for (const fn of all) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const isPure = pure.includes(fn);
  const checks = isPure ? pureChecks : hybridChecks;
  console.log('==== ' + fn + ' (' + (isPure ? '纯雄竞' : 'NTRS·雄竞') + ') ====');
  // 1. JSON 有效 + 顶层数组
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.log('  [FAIL] JSON.parse: ' + e.message); fail++; continue; }
  console.log('  JSON.parse: OK');
  if (!raw.trim().startsWith('[')) { console.log('  [FAIL] 顶层非数组'); fail++; } else { console.log('  顶层数组: OK (' + (Array.isArray(j) ? 'len=' + j.length : '?') + ')'); }
  // 2. NEW 文本
  for (const [tag, kp] of checks) {
    const cnt = (raw.match(new RegExp(escapeRe(kp), 'g')) || []).length;
    console.log('  ' + tag + ' 「' + kp + '」: ' + cnt + (cnt > 0 ? ' OK' : ' [FAIL] MISSING'));
    if (cnt === 0) fail++;
  }
  // 3. 残扫
  if (isPure) {
    const keep = (raw.match(/对象已站队不豁免/g) || []).length;
    console.log('  纯雄竞「对象已站队不豁免」保留(>0 期望): ' + keep + (keep > 0 ? ' OK' : ' [FAIL]'));
    if (keep === 0) fail++;
  } else {
    const gone = (raw.match(/对象已站队不豁免/g) || []).length;
    const replaced = (raw.match(/对象已站队→亲密开局分流/g) || []).length;
    console.log('  NTRS·雄竞「对象已站队不豁免」应移除(=0): ' + gone + (gone === 0 ? ' OK' : ' [FAIL]'));
    console.log('  NTRS·雄竞「对象已站队→亲密开局分流」应存在(>0): ' + replaced + (replaced > 0 ? ' OK' : ' [FAIL]'));
    if (gone !== 0 || replaced === 0) fail++;
  }
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
console.log('\n==== 总结: ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
