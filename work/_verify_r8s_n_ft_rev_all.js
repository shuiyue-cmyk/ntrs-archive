const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');

let ok = true;
let j;
try { j = JSON.parse(raw); console.log('JSON.parse: OK'); } catch (e) { ok = false; console.log('JSON.parse: FAIL', e.message); }
console.log('top-level array:', Array.isArray(j), 'startsWith [:', raw.trimStart().startsWith('['));
if (!Array.isArray(j)) { console.log('ABORT'); process.exit(1); }

const p = j[0];
const parts = [];
p.plotTasks.forEach((t, i) => {
  t.promptGroup.forEach((m, k) => parts.push(m.content));
  parts.push(t.description || '');
});
parts.push(p.finalSystemDirective);
const blob = parts.join('\n');

const oldFrags = {
  'G1-old 为唯一基准——黄毛**本轮能否进入': '为唯一基准——黄毛**本轮能否进入',
  'G2-old 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现': '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现',
  'G3-old 黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪': '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪',
  'G4-old 本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪': '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪',
  'G1-old 全句尾 与 spawn 判定无关。旧句式': '黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。',
};
const newFrags = {
  'NEW 公共空间宽松判定': '公共空间宽松判定',
  'NEW 私密空间严格判定': '私密空间严格判定',
  'NEW G1 空间性质分级句式': '并按**空间性质**分级判定',
  'NEW G2 宽松/严格补注': '（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）',
  'NEW G4 私密/公共列举': '（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动',
};

console.log('--- residual scan (must be GONE) ---');
let allGone = true;
for (const [name, f] of Object.entries(oldFrags)) {
  const n = blob.split(f).length - 1;
  if (n > 0) allGone = false;
  console.log(name, '=>', n, n === 0 ? 'GONE' : 'RESIDUAL!');
}
console.log('--- new phrase scan (must be present) ---');
for (const [name, f] of Object.entries(newFrags)) {
  const n = blob.split(f).length - 1;
  console.log(name, '=>', n, n > 0 ? 'PRESENT' : 'MISSING');
  if (n === 0) allGone = false;
}

// also confirm {[db.*]} blocks untouched: count occurrences in whole raw
const dbHits = (raw.match(/\{\[db\./g) || []).length;
console.log('{[db.*]} block count (unchanged check):', dbHits);
console.log('VERDICT:', ok && allGone && raw.trimStart().startsWith('[') ? 'PASS' : 'FAIL');
