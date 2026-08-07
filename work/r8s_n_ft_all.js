// R8s fix for NTRS FT ALLin (1:N model variant) — G1..G4, apply to promptGroup content + task.description + finalSystemDirective
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json';

const pairs = [
  // G1: S2 出场可能性判定段 — 空间性质分级
  [
    `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
    `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`
  ],
  // G2: S2 分支B spawn ① 刷新成功判定标准句
  [
    `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
    `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`
  ],
  // G3: S2 分支A spawn ② spawn= 定义句 (probe — likely absent in this variant)
  [
    `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`,
    `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`
  ],
  // G4: S2 no_spawn 头注
  [
    `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
    `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`
  ]
];

const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw); // keep ORIGINAL top-level j
if (!Array.isArray(j) || !j[0] || !Array.isArray(j[0].plotTasks)) throw new Error('unexpected top-level shape');

// collect write-back targets as {obj, key} references (mutate the JSON tree in place)
const targets = [];
if (typeof j[0].finalSystemDirective === 'string') targets.push({ obj: j[0], key: 'finalSystemDirective' });
for (const t of j[0].plotTasks) {
  if (typeof t.description === 'string') targets.push({ obj: t, key: 'description' });
  if (Array.isArray(t.promptGroup)) {
    for (const m of t.promptGroup) if (m && typeof m.content === 'string') targets.push({ obj: m, key: 'content' });
  }
}

const names = ['G1', 'G2', 'G3', 'G4'];
pairs.forEach(([old], idx) => {
  let total = 0;
  for (const { obj, key } of targets) total += obj[key].split(old).length - 1;
  console.log(`${names[idx]} OLD hits = ${total}`);
});

// apply
let totalApplied = 0;
pairs.forEach(([old, _new], idx) => {
  for (const { obj, key } of targets) {
    const hits = obj[key].split(old).length - 1;
    if (hits > 0) {
      obj[key] = obj[key].split(old).join(_new);
      totalApplied += hits;
    }
  }
});
console.log(`total replacements applied = ${totalApplied}`);

// write back only if raw starts with '[' and parse OK
if (!raw.trimStart().startsWith('[')) throw new Error('raw does not start with [');
fs.writeFileSync(path, JSON.stringify(j, null, 2), 'utf8');
console.log('written OK');

// ---- verify (re-read) ----
const b2 = fs.readFileSync(path, 'utf8');
const j2 = JSON.parse(b2);
console.log('verify: parseOK', true, 'topIsArray', Array.isArray(j2));
const blob = JSON.stringify(j2);
const residualChecks = [
  ['G1', '为唯一基准——黄毛**本轮能否进入'],
  ['G2', '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现'],
  ['G3', '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪'],
  ['G4', '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪']
];
for (const [n, frag] of residualChecks) console.log(`residual ${n}:`, blob.split(frag).length - 1);
console.log('NEW 公共空间宽松判定:', blob.split('公共空间宽松判定').length - 1);
console.log('NEW 私密空间严格判定:', blob.split('私密空间严格判定').length - 1);
