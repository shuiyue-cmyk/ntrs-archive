// R8s fix: Cirno_NTRS_turn_edit_straight_revise_4.7.json (NTRS straight revise, 2-space JSON indent)
// G1..G4: spawn 判定按空间性质分级 (公共空间宽松 / 私密空间严格)
const fs = require('fs');

const FILE = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';

const G1_OLD = `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`;
const G1_NEW = `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`;

const G2_OLD = `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`;
const G2_NEW = `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`;

const G3_OLD = `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`;
const G3_NEW = `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`;

const G4_OLD = `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`;
const G4_NEW = `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`;

const PAIRS = [
  ['G1', G1_OLD, G1_NEW],
  ['G2', G2_OLD, G2_NEW],
  ['G3', G3_OLD, G3_NEW],
  ['G4', G4_OLD, G4_NEW],
];

const raw = fs.readFileSync(FILE, 'utf8');
if (!raw.trimStart().startsWith('[')) throw new Error('top level is NOT array, abort');
const j = JSON.parse(raw);

// Collect all target strings: promptGroup[].content + task.description for every plotTask + finalSystemDirective
const targets = [];
for (const task of j[0].plotTasks || []) {
  if (task.description) targets.push(task.description);
  for (const msg of task.promptGroup || []) if (typeof msg.content === 'string') targets.push(msg.content);
}
if (typeof j[0].finalSystemDirective === 'string') targets.push(j[0].finalSystemDirective);

const report = [];
for (const [name, old, next] of PAIRS) {
  let hits = 0;
  for (let i = 0; i < targets.length; i++) {
    const s = targets[i];
    if (!s.includes(old)) continue;
    const c = s.split(old).length - 1;
    hits += c;
    targets[i] = s.split(old).join(next);
  }
  report.push({ name, hits, ok: hits > 0 });
  console.log(`${name}: hits=${hits}`);
}

// Re-assemble targets back into j
let ti = 0;
for (const task of j[0].plotTasks || []) {
  if (task.description) task.description = targets[ti++];
  for (const msg of task.promptGroup || []) if (typeof msg.content === 'string') msg.content = targets[ti++];
}
if (typeof j[0].finalSystemDirective === 'string') j[0].finalSystemDirective = targets[ti++];

const out = JSON.stringify(j, null, 2);
fs.writeFileSync(FILE, out, 'utf8');
console.log('written. new length:', out.length);
console.log(JSON.stringify(report));
