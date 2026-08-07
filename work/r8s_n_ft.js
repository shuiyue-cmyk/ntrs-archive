const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
if (!raw.trimStart().startsWith('[')) { console.log('ABORT: raw does not start with ['); process.exit(1); }
const j = JSON.parse(raw);
if (!Array.isArray(j)) { console.log('ABORT: top-level not array'); process.exit(1); }

const G1_OLD = `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`;
const G1_NEW = `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`;

const G2_OLD = `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`;
const G2_NEW = `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`;

const G3_OLD = `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`;
const G3_NEW = `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`;

const G4_OLD = `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`;
const G4_NEW = `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`;

const pairs = [['G1', G1_OLD, G1_NEW], ['G2', G2_OLD, G2_NEW], ['G3', G3_OLD, G3_NEW], ['G4', G4_OLD, G4_NEW]];

// walk the REAL object graph; apply split/join on actual fields
let totalChanged = 0;
function applyToField(obj, key) {
  const v = obj[key];
  if (typeof v !== 'string') return;
  let s = v;
  for (const [id, old, newt] of pairs) {
    const c = s.split(old).length - 1;
    if (c > 0) { s = s.split(old).join(newt); console.log(`  ${id}: ${c} hit(s) in ${key}`); }
  }
  if (s !== v) { obj[key] = s; totalChanged++; }
}

const tasks = j[0].plotTasks || [];
for (const t of tasks) {
  for (const m of (t.promptGroup || [])) applyToField(m, 'content');
  applyToField(t, 'description');
}
applyToField(j[0], 'finalSystemDirective');
for (const m of (j[0].promptGroup || [])) applyToField(m, 'content');
applyToField(j[0], 'mainPrompt');
applyToField(j[0], 'systemPrompt');
applyToField(j[0], 'name');

console.log('fields changed:', totalChanged);

const out = JSON.stringify(j, null, 2);
try { JSON.parse(out); } catch (e) { console.log('ABORT: write-back JSON invalid:', e.message); process.exit(1); }
if (!out.trimStart().startsWith('[')) { console.log('ABORT: write-back not array'); process.exit(1); }
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN.');
