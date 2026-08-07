// r8s fix G1..G4 on Cirno_BATTLE_Turn_DEI_NTRS.json
// OLD strings copied byte-for-byte from current file (verified via parsed scan).
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';

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

// ---- read & parse (keep original top-level j) ----
const raw = fs.readFileSync(path, 'utf8');
if (!raw.trimStart().startsWith('[')) throw new Error('raw does not start with [');
const j = JSON.parse(raw);
if (!Array.isArray(j)) throw new Error('top-level not array');

// collect target strings
const targets = [];
if (Array.isArray(j[0].plotTasks)) {
  for (const t of j[0].plotTasks) {
    if (!t || typeof t !== 'object') continue;
    if (typeof t.description === 'string') targets.push(t.description);
    if (Array.isArray(t.promptGroup)) {
      for (const p of t.promptGroup) {
        if (p && typeof p.content === 'string') targets.push(p.content);
      }
    }
  }
}
if (typeof j[0].finalSystemDirective === 'string') targets.push(j[0].finalSystemDirective);

// pre-count db blocks
const dbBlock = '{[db.黄毛表.get()]}';
const dbBefore = raw.split(dbBlock).length - 1;

let total = 0;
for (const [g, old, neu] of PAIRS) {
  let hits = 0;
  for (let i = 0; i < targets.length; i++) {
    const cnt = targets[i].split(old).length - 1;
    if (cnt > 0) {
      hits += cnt;
      targets[i] = targets[i].split(old).join(neu);
    }
  }
  total += hits;
  console.log(`${g}: hits=${hits} ${hits >= 1 ? 'OK' : 'MISSING'}`);
}

// write targets back (same field order as collected)
let ti = 0;
for (const t of j[0].plotTasks) {
  if (!t || typeof t !== 'object') continue;
  if (typeof t.description === 'string') t.description = targets[ti++];
  if (Array.isArray(t.promptGroup)) {
    for (const p of t.promptGroup) {
      if (p && typeof p.content === 'string') p.content = targets[ti++];
    }
  }
}
if (typeof j[0].finalSystemDirective === 'string') j[0].finalSystemDirective = targets[ti++];

// ---- write back ----
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // must parse
fs.writeFileSync(path, out, 'utf8');
console.log(`total replacements: ${total}`);

// ---- verify by re-reading ----
const raw2 = fs.readFileSync(path, 'utf8');
const j2 = JSON.parse(raw2);
console.log('verify: JSON.parse OK, top-level array:', Array.isArray(j2));
console.log('verify: raw2 starts with [: ', raw2.trimStart().startsWith('['));
for (const [g, old] of PAIRS) {
  console.log(`verify: ${g} OLD residual = ${raw2.split(old).length - 1}`);
}
for (const [g, , neu] of PAIRS) {
  console.log(`verify: ${g} NEW present = ${raw2.split(neu).length - 1}`);
}
console.log('verify: 公共空间宽松判定 count =', raw2.split('公共空间宽松判定').length - 1);
console.log('verify: 私密空间严格判定 count =', raw2.split('私密空间严格判定').length - 1);
const dbAfter = raw2.split(dbBlock).length - 1;
console.log(`verify: db.黄毛表 blocks before=${dbBefore} after=${dbAfter} intact=${dbBefore === dbAfter && dbAfter >= 1}`);
