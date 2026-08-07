const fs = require('fs');
const bak = 'C:/Users/zouyu/Downloads/酒馆/数据库/备份/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.bak-pre-r8s.json';
const cur = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const bj = JSON.parse(fs.readFileSync(bak, 'utf8'));
const cj = JSON.parse(fs.readFileSync(cur, 'utf8'));
const bs = JSON.stringify(bj), cs = JSON.stringify(cj);
// segment diff: list changed spans
const diffs = [];
let i = 0;
while (i < bs.length && i < cs.length) {
  if (bs[i] !== cs[i]) {
    let j = i;
    // extend forward while different
    while (j < bs.length && j < cs.length && bs[j] !== cs[j]) j++;
    // but may differ by insertion; find common suffix boundary
    let k = 0;
    while (i + k < bs.length && j + k < cs.length && bs[i + k] === cs[j + k]) k++;
    diffs.push({ at: i, bakLen: j - i, curLen: j - i + k ? j - i : 0 });
    // simple: skip a window
    i = j;
  } else i++;
}
console.log('changed spans (rough):', diffs.length);
// authoritative: confirm every G-edited region and that stringify equality holds AFTER undoing the 3 edits
const edits = [
  ['G2', `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**`, `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**`],
  ['G4', `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`, `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`],
  ['G1', `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定`, `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**`],
];
// undo NEW -> OLD prefix patches in cs and check remaining equality
let t = cs;
t = t.split(`为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`).join(`为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`);
t = t.split(`**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`).join(`**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`);
t = t.split(`- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`).join(`- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`);
console.log('after undoing G1+G2+G4 edits, stringify equality:', t === bs);
if (t !== bs) {
  let d = 0;
  while (d < t.length && t[d] === bs[d]) d++;
  console.log('residual diff at', d);
  console.log('bak:', JSON.stringify(bs.slice(d - 60, d + 100)));
  console.log('cur:', JSON.stringify(t.slice(d - 60, d + 100)));
}
