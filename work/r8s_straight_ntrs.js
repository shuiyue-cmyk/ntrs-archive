// R8 补充规格 G1..G4 — Cirno_BATTLE_Turn_straight_NTRS.json
// Usage: node r8s_straight_ntrs.js [--dry-run|--write]
const fs = require('fs');

const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';

const PAIRS = [
  {
    id: 'G1',
    old: `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
    new: `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`
  },
  {
    id: 'G2',
    old: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
    new: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`
  },
  {
    id: 'G3',
    old: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`,
    new: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`
  },
  {
    id: 'G4',
    old: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
    new: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`
  }
];

const RESIDUAL = [
  '为唯一基准——黄毛**本轮能否进入',        // G1 旧句式
  '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现', // G2 旧括号
  '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪', // G3 旧列举
  '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪'  // G4 旧列举
];

const DB_BLOCKS = ['{[db.黄毛表.get()]}', '{[db.重要角色表.get()]}', '{[db.NTRS备忘录.get()]}'];

const mode = process.argv[2] === '--write' ? 'write' : 'dry-run';

const raw = fs.readFileSync(PATH, 'utf8');
if (!raw.trimStart().startsWith('[')) throw new Error('FATAL: raw does not start with [');
const j = JSON.parse(raw);
if (!Array.isArray(j)) throw new Error('FATAL: top-level not array');
const p = j[0];

const targets = []; // {obj, key} references so write-mode mutations reach j
for (const t of p.plotTasks || []) {
  for (const m of t.promptGroup || []) targets.push({ obj: m, key: 'content' });
  if (t.description) targets.push({ obj: t, key: 'description' });
}
if (p.finalSystemDirective) targets.push({ obj: p, key: 'finalSystemDirective' });

console.log(`mode=${mode} targets=${targets.length} rawTop=[${raw.trimStart()[0]}]`);
for (const b of DB_BLOCKS) console.log(`dbBlock before ${b}: ${raw.split(b).length - 1}`);

for (const pair of PAIRS) {
  let total = 0;
  for (let i = 0; i < targets.length; i++) {
    const cur = targets[i].obj[targets[i].key];
    const c = cur.split(pair.old).length - 1;
    if (c > 0) {
      total += c;
      const idx = cur.indexOf(pair.old);
      const seg = cur.slice(idx, idx + Math.min(pair.old.length, 80));
      console.log(`${pair.id} target[${i}] hit=${c} firstChars=${JSON.stringify(seg)}`);
      if (mode === 'write') targets[i].obj[targets[i].key] = cur.split(pair.old).join(pair.new);
    }
  }
  console.log(`${pair.id}: total=${total}`);
  if (total === 0) console.log(`${pair.id}: 0 HITS (check: already applied? or text differs?)`);
}

if (mode === 'write') {
  const out = JSON.stringify(j, null, 2);
  fs.writeFileSync(PATH, out, 'utf8');
  console.log('WRITTEN');
}

// verification re-read
const raw2 = fs.readFileSync(PATH, 'utf8');
const j2 = JSON.parse(raw2);
console.log(`verify: JSON.parse OK, topLevelArray=${Array.isArray(j2)}, rawStarts[=${raw2.trimStart()[0]}]`);
const blob2 = JSON.stringify(j2);
for (const pair of PAIRS) {
  const oldCount = blob2.split(pair.old).length - 1;
  const newCount = blob2.split(pair.new).length - 1;
  console.log(`verify ${pair.id}: OLD residual=${oldCount} NEW present=${newCount}`);
}
for (const r of RESIDUAL) {
  console.log(`verify residual '${r.slice(0, 20)}...': ${blob2.split(r).length - 1}`);
}
console.log(`verify key phrase 公共空间宽松判定: ${blob2.split('公共空间宽松判定').length - 1}`);
console.log(`verify key phrase 私密空间严格判定: ${blob2.split('私密空间严格判定').length - 1}`);
for (const b of DB_BLOCKS) console.log(`dbBlock after ${b}: ${raw2.split(b).length - 1}`);
