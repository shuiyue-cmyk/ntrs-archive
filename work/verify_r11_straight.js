const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('starts with [:', raw.trimStart().startsWith('['));
let j; try { j = JSON.parse(raw); console.log('JSON.parse: OK'); } catch (e) { console.log('JSON.parse FAIL:', e.message); process.exit(1); }
console.log('top array:', Array.isArray(j), 'items:', j.length);

function walk(o, p) {
  if (typeof o === 'string') return [[p, o]];
  if (Array.isArray(o)) { const out = []; o.forEach((v, i) => out.push(...walk(v, p + '[' + i + ']'))); return out; }
  if (o && typeof o === 'object') { const out = []; for (const k of Object.keys(o)) out.push(...walk(o[k], p + '.' + k)); return out; }
  return [];
}
const strings = [];
j.forEach((obj, idx) => strings.push(...walk(obj, 'j[' + idx + ']')));
const blob = JSON.stringify(j);

const checks = [
  ['I1 NEW', '本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径', true],
  ['I1 OLD gone', '接下来的场景中该黄毛是否有出现的可能', false],
  ['I2 NEW', '线已定对象（黄毛胜·终局=线锁定非闭合、仅不再刷新新黄毛 / 黄毛败·友好=线闭合）视为仍绑定、不参与刷新、不误判为未绑定', true],
  ['I2 OLD gone', '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定', false],
  ['I4 NEW', '本节登场角色分析、九题自检、sparkNotes 一律跳过', true],
  ['I4 OLD gone', '八题自检、sparkNotes 一律跳过', false],
  ['I5 NEW', '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若场上存在已闭合（黄毛败·友好）对象，附一行该对象的朋友级日常互动**）', true],
  ['I6 NEW', '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？', true],
  ['I6 OLD gone', '雄竞期标注"竞争者·[五型]"，并标线状态？', false],
  ['I9 NEW', '👁️ **明面竞争（在场见证）**', true],
  ['I9 OLD gone', '👁️ **明面竞争**：', false],
  ['I10 NEW', '<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）——刷新状态/线状态/锁定状态为下游调度字段，正文 AI 忽略即可，人设字段才用于正文', true],
];
for (const [label, s, expectPresent] of checks) {
  const found = blob.includes(s);
  const ok = found === expectPresent;
  console.log((ok ? '[OK] ' : '[FAIL] ') + label + ' present=' + found + ' expect=' + expectPresent);
  if (!ok) process.exitCode = 1;
}
// I6 full sentence context check
const m17 = strings.find(([p]) => p === 'j[0].plotTasks[2].promptGroup[17].content');
const i = m17[1].indexOf('名单标注为导演台本内部调度');
console.log('\nI6 sentence: ' + JSON.stringify(m17[1].slice(i - 60, i + 110)));
// I10 full sentence context
const r4 = strings.find(([p]) => p === 'j[0].plotTasks[1].promptGroup[4].content');
const k = r4[1].indexOf('<thugSpawn> 标签内只放刷新状态+黄毛人设');
console.log('I10 sentence: ' + JSON.stringify(r4[1].slice(k - 12, k + 170)));
console.log('\nVERIFY DONE');
