// R8s fix — NTRS straight plain (Cirno_NTRS_turn_edit_straight_4.7.json)
// Apply G1,G2,G3,G4 per fix_spec_r8s.md. OLD must match current file byte-for-byte.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_4.7.json';

const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw); // keep ORIGINAL top-level j; do NOT unwrap

const pairs = [
  {
    id: 'G1',
    old: '以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。',
    new: '以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。',
  },
  {
    id: 'G2',
    old: '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**',
    new: '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**',
  },
  {
    id: 'G3',
    old: '**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**',
    new: '**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**',
  },
  {
    id: 'G4',
    old: '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：',
    new: '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：',
  },
];

// collect mutable references [obj, key] so edits land on the real j
const refs = [];
for (const tk of j[0].plotTasks) {
  refs.push({ obj: tk, key: 'description', id: tk.id + '.description' });
  tk.promptGroup.forEach((m, i) => refs.push({ obj: m, key: 'content', id: tk.id + '.promptGroup[' + i + ']' }));
}
refs.push({ obj: j[0], key: 'finalSystemDirective', id: 'finalSystemDirective' });

const results = [];
for (const pair of pairs) {
  let total = 0;
  const perField = [];
  for (const r of refs) {
    const s = r.obj[r.key] || '';
    const hits = s.split(pair.old).length - 1;
    if (hits > 0) {
      r.obj[r.key] = s.split(pair.old).join(pair.new);
      perField.push(r.id + ':' + hits);
    }
    total += hits;
  }
  results.push({ id: pair.id, total, perField });
}

// write back only if JSON.parse OK and raw starts with '['
if (!raw.trim().startsWith('[')) throw new Error('raw top-level is not array');
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // throws if invalid
fs.writeFileSync(path, out, 'utf8');

console.log('=== hit counts ===');
for (const r of results) console.log(r.id, 'total hits =', r.total, r.perField.length ? 'fields: ' + r.perField.join(', ') : '(no fields)');

// verification pass
const raw2 = fs.readFileSync(path, 'utf8');
const j2 = JSON.parse(raw2);
const b2 = JSON.stringify(j2);
console.log('=== verification ===');
console.log('JSON.parse ok:', true);
console.log('top-level array:', Array.isArray(j2));
const resid = {
  G1: '为唯一基准——黄毛**本轮能否进入',
  G2: '当前场景画面**（本轮当场出现',
  G3: '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪',
  G4: '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪',
};
for (const [k, v] of Object.entries(resid)) console.log('residual', k, ':', b2.includes(v) ? 'PRESENT (bad)' : 'gone');
for (const key of ['公共空间宽松判定', '私密空间严格判定']) console.log('NEW present', key, ':', b2.includes(key));
const re = /db\.[A-Za-z0-9_\.\[\]]+/g;
const m = b2.match(re);
console.log('db refs after:', m ? m.length : 0);
