const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(p, 'utf8');

const pairs = [
  // G1
  ['以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。',
   '以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。'],
  // G2
  ['**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**',
   '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**'],
  // G4
  ['- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：',
   '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：'],
];

const j = JSON.parse(raw);
if (!Array.isArray(j)) { console.error('FATAL: top-level not array'); process.exit(1); }
const t0 = j[0];

// collect live refs to mutate
const refs = [];
for (const t of (t0.plotTasks || [])) {
  if (typeof t.description === 'string') refs.push({ label: `task:${t.name}.description`, obj: t, key: 'description' });
  (t.promptGroup || []).forEach((m, i) => {
    if (typeof m.content === 'string') refs.push({ label: `task:${t.name}.promptGroup[${i}](${m.role})`, obj: m, key: 'content' });
  });
}
if (typeof t0.finalSystemDirective === 'string') refs.push({ label: 'finalSystemDirective', obj: t0, key: 'finalSystemDirective' });

console.log('=== hit counts per pair (field-level) ===');
const names = ['G1', 'G2', 'G3', 'G4'];
pairs.forEach(([old], pi) => {
  const hits = [];
  for (const r of refs) {
    const n = r.obj[r.key].split(old).length - 1;
    if (n > 0) hits.push(`${n}x ${r.label}`);
  }
  console.log(`${names[pi]}: total=${hits.length ? hits.map(h => +h.split('x')[0]).reduce((a, b) => a + b, 0) : 0}  ${hits.join(' ; ') || '(no hits)'}`);
});

// apply directly on live objects
for (const r of refs) {
  let s = r.obj[r.key];
  for (const [old, _new] of pairs) s = s.split(old).join(_new);
  r.obj[r.key] = s;
}

// write back only if parse OK and array top-level
const out = JSON.stringify(j, null, 2);
if (!out.trim().startsWith('[')) { console.error('FATAL: output not array'); process.exit(1); }
JSON.parse(out);
fs.writeFileSync(p, out, 'utf8');
console.log('WRITTEN. bytes:', Buffer.byteLength(out));

// verify re-read
const raw2 = fs.readFileSync(p, 'utf8');
const j2 = JSON.parse(raw2);
const blob2 = JSON.stringify(j2);
console.log('=== verification ===');
console.log('JSON.parse OK, top-level array:', Array.isArray(j2), '| startsWith [: ', raw2.trim().startsWith('['));
pairs.forEach(([old, _new], pi) => {
  console.log(`${names[pi]}: OLD residual=${blob2.split(old).length - 1}  NEW present=${blob2.split(_new).length - 1}`);
});
console.log('G3 OLD residual (expect 0):', blob2.split('**spawn=本轮黄毛在').length - 1);
console.log('关键短语 公共空间宽松判定:', blob2.split('公共空间宽松判定').length - 1, '| 私密空间严格判定:', blob2.split('私密空间严格判定').length - 1);
console.log('{[db.*]} block count:', (blob2.match(/\{\[db\.[^}]*\]\}/g) || []).length);
