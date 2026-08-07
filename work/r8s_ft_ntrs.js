// R8S fix for Cirno_BATTLE_Turn_FT_NTRS.json
// Applies G1..G4 from fix_spec_r8s.md (spawn 判定按空间性质分级：公共空间宽松 / 私密空间严格).
// Walk j[0].plotTasks: promptGroup msg .content, task .description, j[0].finalSystemDirective.
// Keep {[db.黄毛表.get()]} blocks untouched. Top-level array preserved.
const fs = require('fs');

const FILE = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
const raw = fs.readFileSync(FILE, 'utf8');
const j = JSON.parse(raw);

const pairs = [
  {
    id: 'G1',
    old: `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
    new: `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
  },
  {
    id: 'G2',
    old: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
    new: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
  },
  {
    id: 'G3',
    old: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`,
    new: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`,
  },
  {
    id: 'G4',
    old: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
    new: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
  },
];

function applyToStrings(j, fn) {
  const tasks = (j[0] && j[0].plotTasks) || [];
  for (const t of tasks) {
    if (typeof t.description === 'string') fn(t, 'description');
    const pg = t.promptGroup || [];
    for (const m of pg) {
      if (m && typeof m.content === 'string') fn(m, 'content');
    }
  }
  if (typeof j[0].finalSystemDirective === 'string') fn(j[0], 'finalSystemDirective');
}

const DB_BLOCKS = ['{[db.黄毛表.get()]}', '{[db.重要角色表.get()]}', '{[db.NTRS备忘录.get()]}'];
const before = JSON.stringify(j);
const dbBefore = {};
for (const b of DB_BLOCKS) dbBefore[b] = (before.split(b).length - 1);

const results = [];
let replaced = 0;

for (const pr of pairs) {
  let hits = 0;
  applyToStrings(j, (holder, key) => {
    if (holder[key].includes(pr.old)) {
      const n = holder[key].split(pr.old).length - 1;
      hits += n;
      holder[key] = holder[key].split(pr.old).join(pr.new);
    }
  });
  replaced += hits;
  results.push({ id: pr.id, hits, ok: hits > 0 });
}

// write back only if JSON parses AND top level starts with '['
let parseOk = true;
let topArray = false;
try {
  const check = JSON.parse(JSON.stringify(j));
  topArray = Array.isArray(check);
} catch (e) {
  parseOk = false;
  console.log('PARSE CHECK FAILED: ' + e.message);
}
if (!parseOk || !topArray) {
  console.log('ABORT: JSON invalid or top level not array, NOT writing.');
  process.exit(1);
}

fs.writeFileSync(FILE, JSON.stringify(j, null, 2), 'utf8');
console.log('WROTE: ' + FILE);

// ---- verification ----
const newRaw = fs.readFileSync(FILE, 'utf8');
let newParseOk = true;
let newTopArray = false;
try {
  const v = JSON.parse(newRaw);
  newTopArray = Array.isArray(v);
} catch (e) { newParseOk = false; console.log('RE-READ PARSE FAILED: ' + e.message); }

const oldResidual = {};
for (const pr of pairs) oldResidual[pr.id] = newRaw.split(pr.old).length - 1;

const resFrags = [
  '为唯一基准——黄毛**本轮能否进入',            // G1 old sentence
  '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现', // G2 old paren
  '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪', // G3 old enum
  '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪', // G4 old enum
];
const residual = {};
for (const f of resFrags) residual[f] = newRaw.split(f).length - 1;

const newHas = {};
for (const pr of pairs) newHas[pr.id] = newRaw.split(pr.new).length - 1;
const keyPhrase = { '公共空间宽松判定': newRaw.split('公共空间宽松判定').length - 1, '私密空间严格判定': newRaw.split('私密空间严格判定').length - 1 };

const dbAfter = {};
for (const b of DB_BLOCKS) dbAfter[b] = (newRaw.split(b).length - 1);

console.log('--- HIT COUNTS ---');
for (const r of results) console.log(r.id + ': ' + r.hits + ' hit(s) -> ' + (r.hits > 0 ? 'OK' : 'FAIL(0 hits)'));
console.log('total replacements: ' + replaced);
console.log('--- VERIFY ---');
console.log('JSON parse OK on re-read: ' + newParseOk);
console.log('top-level array: ' + newTopArray + ' (first char: ' + JSON.stringify(newRaw[0]) + ')');
console.log('OLD residual counts: ' + JSON.stringify(oldResidual));
console.log('spec residual frags: ' + JSON.stringify(residual));
console.log('NEW present counts: ' + JSON.stringify(newHas));
console.log('key phrases: ' + JSON.stringify(keyPhrase));
console.log('db blocks before/after: ' + JSON.stringify(dbBefore) + ' / ' + JSON.stringify(dbAfter));
