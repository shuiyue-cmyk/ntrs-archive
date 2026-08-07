const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';

const G1 = [
  `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
  `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
];
const G2 = [
  `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
  `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
];
const G3 = [
  `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`,
  `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`,
];
const G4 = [
  `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
  `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
];
const pairs = { G1, G2, G3, G4 };

const raw = fs.readFileSync(path, 'utf8');
if (!raw.trimStart().startsWith('[')) { console.error('ABORT: raw not starting with ['); process.exit(1); }
const j = JSON.parse(raw);
if (!Array.isArray(j)) { console.error('ABORT: top-level not array'); process.exit(1); }

// Collect writable string fields (correct schema):
// plotTasks[i].promptGroup = ARRAY of {role, content, ...}
// plotTasks[i].description = string (directly on task)
// j[0].finalSystemDirective = string
const fields = [];
const root = j[0];
if (root && typeof root.finalSystemDirective === 'string')
  fields.push({ loc: 'j[0].finalSystemDirective', get: () => root.finalSystemDirective, set: v => (root.finalSystemDirective = v) });
if (Array.isArray(root.plotTasks)) {
  root.plotTasks.forEach((t, ti) => {
    if (t && Array.isArray(t.promptGroup)) {
      t.promptGroup.forEach((pg, gi) => {
        if (pg && typeof pg.content === 'string')
          fields.push({ loc: `plotTasks[${ti}].promptGroup[${gi}].content`, get: () => pg.content, set: v => (pg.content = v) });
      });
    }
    if (t && typeof t.description === 'string')
      fields.push({ loc: `plotTasks[${ti}].description`, get: () => t.description, set: v => (t.description = v) });
  });
}

console.log('fields collected:', fields.length);
// locate which fields hold each OLD
for (const [name, [oldS]] of Object.entries(pairs)) {
  const hits = fields.filter(f => f.get().includes(oldS)).map(f => f.loc);
  console.log(`OLD ${name} located in:`, hits.length ? hits.join(' | ') : '(none)');
}

// Apply
const pairHit = {};
for (const [name, [oldS, newS]] of Object.entries(pairs)) pairHit[name] = 0;
for (const f of fields) {
  let s = f.get();
  for (const [name, [oldS, newS]] of Object.entries(pairs)) {
    const n = s.split(oldS).length - 1;
    if (n > 0) pairHit[name] += n;
    s = s.split(oldS).join(newS);
  }
  f.set(s);
}
console.log('applied hit counts:', JSON.stringify(pairHit));

const serialized = JSON.stringify(j, null, 2);
fs.writeFileSync(path, serialized, 'utf8');
console.log('WROTE bytes:', serialized.length);

// Verify by re-reading
const raw2 = fs.readFileSync(path, 'utf8');
const j2 = JSON.parse(raw2);
const res = {};
for (const [name, [oldS]] of Object.entries(pairs)) res[name] = raw2.split(oldS).length - 1;
const newRes = {};
for (const [name, [, newS]] of Object.entries(pairs)) newRes[name] = raw2.split(newS).length - 1;
console.log('VERIFY array:', Array.isArray(j2), 'residual OLD:', JSON.stringify(res), 'NEW counts:', JSON.stringify(newRes));
console.log('VERIFY phrases 公共空间宽松判定/私密空间严格判定:',
  raw2.split('公共空间宽松判定').length - 1, '/', raw2.split('私密空间严格判定').length - 1);
console.log('VERIFY startsWith [:', raw2.trimStart().startsWith('['));
