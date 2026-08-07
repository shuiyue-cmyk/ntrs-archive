const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';

// ---- G pairs per fix_spec_r8s.md, OLD copied byte-for-byte from CURRENT file ----
const pairs = [
  // G1: S2 出场可能性判定 full sentence (HARD RULES #3)
  [
    `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
    `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`
  ],
  // G2: 刷新状态两档 ① 分支B 刷新成功判定标准 sentence
  [
    `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
    `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`
  ],
  // G3: spawn= 定义句 — spec OLD; probes show 0 hits in this variant (checked separately)
  [
    `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`,
    `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`
  ],
  // G4: no_spawn 头注 line
  [
    `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
    `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`
  ]
];

const names = ['G1', 'G2', 'G3', 'G4'];

const raw0 = fs.readFileSync(path, 'utf8');
console.log('raw startsWith [ :', raw0.trim().startsWith('['));
const j = JSON.parse(raw0);
const p = j[0];

// collect all editable text fields
function collectTexts() {
  const out = [];
  if (Array.isArray(p.plotTasks)) {
    for (const t of p.plotTasks) {
      if (!t || typeof t !== 'object') continue;
      if (typeof t.description === 'string') out.push(t.description);
      if (Array.isArray(t.promptGroup)) {
        for (const m of t.promptGroup) {
          if (m && typeof m.content === 'string') out.push(m.content);
        }
      }
    }
  }
  if (typeof p.finalSystemDirective === 'string') out.push(p.finalSystemDirective);
  return out;
}

// pre-scan hit counts
let texts = collectTexts();
const preHits = pairs.map(([old]) => texts.reduce((n, s) => n + s.split(old).length - 1, 0));

// apply
texts = collectTexts();
pairs.forEach(([old, nw], idx) => {
  let hits = 0;
  texts.forEach((s, i) => {
    if (s.includes(old)) { hits += s.split(old).length - 1; texts[i] = s.split(old).join(nw); }
  });
  console.log(names[idx] + ' hits:', hits);
});

// write back into j
let ti = 0;
if (Array.isArray(p.plotTasks)) {
  for (const t of p.plotTasks) {
    if (!t || typeof t !== 'object') continue;
    if (typeof t.description === 'string') { t.description = texts[ti++]; }
    if (Array.isArray(t.promptGroup)) {
      for (const m of t.promptGroup) {
        if (m && typeof m.content === 'string') m.content = texts[ti++];
      }
    }
  }
}
if (typeof p.finalSystemDirective === 'string') p.finalSystemDirective = texts[ti++];
console.log('texts consumed:', ti, '/', texts.length);

const outRaw = JSON.stringify(j, null, 2);
// guard: write only if parse OK AND top-level array
if (outRaw.trim().startsWith('[')) {
  JSON.parse(outRaw); // throws if invalid
  fs.writeFileSync(path, outRaw, 'utf8');
  console.log('WROTE. len', outRaw.length);
} else {
  console.log('REFUSED WRITE: top-level not array');
}

// ---- verify ----
const raw2 = fs.readFileSync(path, 'utf8');
const j2 = JSON.parse(raw2);
console.log('verify parse OK, top array:', Array.isArray(j2), 'len', j2.length, 'startsWith [:', raw2.trim().startsWith('['));
const blob = JSON.stringify(j2);
const residOld = pairs.map(([old], idx) => blob.split(old).length - 1);
const newPhrases = ['公共空间宽松判定', '私密空间严格判定', '公共空间宽松：', '私密空间严格：'];
console.log('residual OLD:', names.map((n, i) => n + '=' + residOld[i]).join(' '));
for (const np of newPhrases) console.log('NEW present', JSON.stringify(np), ':', blob.split(np).length - 1, 'hit(s)');
console.log('pre-hits (before apply):', names.map((n, i) => n + '=' + preHits[i]).join(' '));
