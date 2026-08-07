// R8 补充规格 G1-G4 精确替换 — Cirno_NTRS_turn_edit_straight_ALLin_4.7.json
// 只改 plotTasks[].promptGroup[].content、task.description、finalSystemDirective；不改 {[db.*]} 块
const fs = require('fs');
const P = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_ALLin_4.7.json';

const raw0 = fs.readFileSync(P, 'utf8');

const G1_OLD = `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`;
const G1_NEW = `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`;

const G2_OLD = `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`;
const G2_NEW = `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`;

const G3_OLD = `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`;
const G3_NEW = `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`;

const G4_OLD = `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`;
const G4_NEW = `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`;

const pairs = [['G1', G1_OLD, G1_NEW], ['G2', G2_OLD, G2_NEW], ['G3', G3_OLD, G3_NEW], ['G4', G4_OLD, G4_NEW]];

// --- pass 1: 统计原始命中（整个文件 blob）---
console.log('== 原始命中（整文件字符串）==');
const rawHits = {};
for (const [id, old] of pairs) {
  const n = raw0.split(old).length - 1;
  rawHits[id] = n;
  console.log(`${id}: ${n}`);
}

// --- pass 2: JSON.parse，保留原始顶层 j ---
const j = JSON.parse(raw0);
if (!Array.isArray(j) || !j[0].plotTasks) throw new Error('顶层非数组或缺少 plotTasks');
console.log('顶层数组 OK, plotTasks 数 =', j[0].plotTasks.length);

// 遍历可编辑字符串位置并替换，逐对计数
const hits = { G1: 0, G2: 0, G3: 0, G4: 0 };
const apply = (s) => {
  for (const [id, old, nw] of pairs) {
    if (s.includes(old)) { hits[id]++; }
    s = s.split(old).join(nw);
  }
  return s;
};

for (const t of j[0].plotTasks) {
  if (Array.isArray(t.promptGroup)) {
    for (const m of t.promptGroup) {
      if (typeof m.content === 'string') m.content = apply(m.content);
    }
  }
  if (typeof t.description === 'string') t.description = apply(t.description);
}
if (typeof j[0].finalSystemDirective === 'string') j[0].finalSystemDirective = apply(j[0].finalSystemDirective);

console.log('== 替换命中（结构化遍历）==');
for (const id of ['G1', 'G2', 'G3', 'G4']) console.log(`${id}: ${hits[id]}`);

// --- pass 3: 校验后写回 ---
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // 必须成功
if (!out.trim().startsWith('[')) throw new Error('写回内容顶层不是数组，中止');
fs.writeFileSync(P, out, 'utf8');
console.log('已写回, 字节', out.length, '(原', Buffer.byteLength(raw0, 'utf8'), ')');

// --- pass 4: 验证 ---
const back = fs.readFileSync(P, 'utf8');
const v = JSON.parse(back);
console.log('== 验证 ==');
console.log('JSON 可解析:', true);
console.log('顶层数组:', Array.isArray(v));
for (const [id, old, nw] of pairs) {
  const o = back.split(old).length - 1;
  const n = back.split(nw).length - 1;
  console.log(`${id} 残OLD=${o} 新NEW=${n}`);
}
console.log('G1 关键短语 公共空间宽松判定:', back.includes('公共空间宽松判定') ? back.split('公共空间宽松判定').length - 1 : 0);
console.log('G1 关键短语 私密空间严格判定:', back.includes('私密空间严格判定') ? back.split('私密空间严格判定').length - 1 : 0);
console.log('{[db. 块保留:', (back.split('{[db.').length - 1), '个');
