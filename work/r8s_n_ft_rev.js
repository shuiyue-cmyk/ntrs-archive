// R8S fix: NTRS FT revise — 空间性质分级 (G1/G2/G4, G3 absent in this variant)
// Target: Cirno_NTRS_turn_edit_FT_revise_4.7.json
// Keep original top-level array j (do NOT unwrap on write-back).

const fs = require('fs');
const TARGET = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_4.7.json';

const G1_OLD = '以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。';
const G1_NEW = '以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。';

const G2_OLD = '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**';
const G2_NEW = '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**';

// G3 spec OLD — verified ABSENT in this variant (② 分支A restructured, no spawn=…=no_spawn sentence).
const G3_OLD = '**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**';
const G3_NEW = '**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**';

const G4_OLD = '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：';
const G4_NEW = '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：';

const PAIRS = [
  ['G1', G1_OLD, G1_NEW],
  ['G2', G2_OLD, G2_NEW],
  ['G3', G3_OLD, G3_NEW],
  ['G4', G4_OLD, G4_NEW],
];

// Collect every string field we patch: all promptGroup contents + task descriptions + FSD.
function collect(j) {
  const out = [];
  const p = j[0];
  if (p.finalSystemDirective) out.push({ where: 'finalSystemDirective', ref: null, get: () => p.finalSystemDirective, set: v => { p.finalSystemDirective = v; } });
  (p.plotTasks || []).forEach((t, ti) => {
    if (typeof t.description === 'string') out.push({ where: `task${ti}.description`, ref: null, get: () => t.description, set: v => { t.description = v; } });
    (t.promptGroup || []).forEach((m, mi) => {
      if (typeof m.content === 'string') out.push({ where: `task${ti}.promptGroup[${mi}]`, ref: null, get: () => m.content, set: v => { m.content = v; } });
    });
  });
  return out;
}

const raw0 = fs.readFileSync(TARGET, 'utf8');
if (!raw0.trimStart().startsWith('[')) { console.error('ABORT: raw does not start with ['); process.exit(1); }
const j = JSON.parse(raw0);

const fields = collect(j);
const hits = {};           // pair id -> total hit count across fields
const fieldHits = {};      // pair id -> [{where, count}]
for (const [id] of PAIRS) { hits[id] = 0; fieldHits[id] = []; }

for (const f of fields) {
  let s = f.get();
  let changed = false;
  for (const [id, old, nw] of PAIRS) {
    const c = s.split(old).length - 1;
    if (c > 0) { hits[id] += c; fieldHits[id].push({ where: f.where, c }); s = s.split(old).join(nw); changed = true; }
  }
  if (changed) f.set(s);
}

console.log('=== hit report ===');
for (const [id] of PAIRS) {
  console.log(`${id}: total=${hits[id]}${hits[id] ? ' locations=' + JSON.stringify(fieldHits[id]) : ''}`);
}

// Write back only if parse OK && top-level array preserved && at least one hit (G1/G2/G4).
const hasAnyHit = PAIRS.some(([id]) => hits[id] > 0);
if (hasAnyHit) {
  const out = JSON.stringify(j, null, 2);
  if (!out.trimStart().startsWith('[')) { console.error('ABORT: serialized output does not start with ['); process.exit(1); }
  fs.writeFileSync(TARGET, out, 'utf8');
  console.log('WROTE', out.length, 'bytes');
} else {
  console.log('NO CHANGES (nothing to write)');
}

// ---- verification ----
const rawV = fs.readFileSync(TARGET, 'utf8');
let ok = true;
try { JSON.parse(rawV); console.log('VERIFY json parse: OK'); } catch (e) { ok = false; console.log('VERIFY json parse: FAIL', e.message); }
console.log('VERIFY top-level array:', rawV.trimStart().startsWith('['));
for (const [id, old, nw] of PAIRS) {
  const cOld = rawV.split(old).length - 1;
  const cNew = rawV.split(nw).length - 1;
  console.log(`VERIFY ${id}: residual OLD=${cOld} NEW=${cNew}`);
  if (cOld !== 0) ok = false;
  if (id !== 'G3' && cNew === 0) ok = false;
}
console.log('VERIFY 公共空间宽松判定:', rawV.indexOf('公共空间宽松判定'));
console.log('VERIFY 私密空间严格判定:', rawV.indexOf('私密空间严格判定'));
console.log('VERIFY 私密空间同楼其他房间/隔壁/门外走廊:', rawV.indexOf('私密空间同楼其他房间/隔壁/门外走廊'));
console.log(ok ? 'ALL VERIFY OK' : 'VERIFY PROBLEMS');
