// Verify R8s fix on Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const raw = fs.readFileSync(p, 'utf8');

let parseOK = true;
try { JSON.parse(raw); } catch (e) { parseOK = false; console.log('PARSE FAIL:', e.message); }
console.log('JSON valid:', parseOK);
console.log('top-level array (starts with [):', raw.trimStart().startsWith('['));

const residual = [
  ['G1 旧句式', '为唯一基准——黄毛**本轮能否进入'],
  ['G2 旧括号', '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现'],
  ['G3 旧列举', '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪'],
  ['G4 旧列举', '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪'],
];
for (const [name, pat] of residual) {
  console.log('residual', name, ':', raw.split(pat).length - 1);
}
const present = [
  ['公共空间宽松判定', '公共空间宽松判定'],
  ['私密空间严格判定', '私密空间严格判定'],
  ['公共空间宽松', '公共空间宽松'],
  ['私密空间严格', '私密空间严格'],
];
for (const [name, pat] of present) {
  console.log('NEW', name, 'count:', raw.split(pat).length - 1);
}
// structural re-check
const j = JSON.parse(raw);
console.log('plotTasks:', j[0].plotTasks.length, '| name:', j[0].name);
