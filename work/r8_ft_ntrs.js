// R8 fix for Cirno_BATTLE_Turn_FT_NTRS.json
// Applies R8-A (A1..A6), R8-B (B1..B3), R8-C (C1..C2) from fix_spec_r8.md MAIN section.
// Walk j[0].plotTasks: promptGroup msg .content, task .description, j[0].finalSystemDirective.
// Keep {[db.黄毛表.get()]} blocks untouched. Top-level array preserved.
const fs = require('fs');

const FILE = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
const raw = fs.readFileSync(FILE, 'utf8');
const j = JSON.parse(raw);

const pairs = [
  // ---- R8-A ----
  {
    id: 'A1',
    old: `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
 - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
 - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
 - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`,
    new: `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
  },
  {
    id: 'A2',
    old: `**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**`,
    new: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
  },
  {
    id: 'A3',
    old: `**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**`,
    new: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`,
  },
  {
    id: 'A4',
    old: `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`,
    new: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
  },
  {
    id: 'A5',
    old: `② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`,
    new: `② 分支A——已有追踪黄毛：黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景画面但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`,
  },
  {
    id: 'A6',
    old: `动向=[在场·[位置] / 离场·[去向/尾随目标/潜伏接近] / 暗中布局]`,
    new: `动向=[在场·[位置]（当前场景画面内） / 离场·[同楼其他房间/去向/尾随目标/潜伏接近] / 暗中布局]`,
  },
  // ---- R8-B ----
  {
    id: 'B1',
    old: `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**`,
    new: `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏），prologue 不把该戏作为 {{user}} 在场戏展开**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`,
  },
  {
    id: 'B2',
    old: `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开`,
    new: `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略（或制造对象离场契机后场景外接触）时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`,
  },
  {
    id: 'B3',
    old: ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`,
    new: ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。`,
  },
  // ---- R8-C ----
  {
    id: 'C1',
    old: `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。`,
    new: `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。**目标与 {{user}} 同处当前场景时黄毛仍可 act**：黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）后，在 {{user}} 场景外对目标展开行动——场景外行动照常判 act（见 no_spawn ②）。`,
  },
  {
    id: 'C2',
    old: ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处，只要剧情上途径与动机合理）`,
    new: ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处；**目标与 {{user}} 同处当前场景时**，黄毛有合理手段制造目标离场契机（约定/诱引/外部事件引走）后场景外接触，途径与动机合理即可，只要剧情不荒谬）`,
  },
];

// collect all target strings as real object holders so mutation sticks
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

// db block markers
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

// check JSON validity + top-level array before writing
let parseOk = true;
let topArray = false;
let check = null;
try {
  check = JSON.parse(JSON.stringify(j));
  parseOk = true;
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
  newParseOk = true;
  newTopArray = Array.isArray(v);
} catch (e) { newParseOk = false; console.log('RE-READ PARSE FAILED: ' + e.message); }

const residual = {};
const resFrags = ['接下来的场景中是否会有黄毛出现的可能', '后续剧情是否有黄毛实际出场的契机', 'prologue 不展开该场景外戏', '黄毛仅是"存在"', 'spawn=本轮黄毛在当前场景在场'];
for (const f of resFrags) residual[f] = newRaw.split(f).length - 1;

const newHas = {};
for (const pr of pairs) newHas[pr.id] = newRaw.includes(pr.new);

const dbAfter = {};
for (const b of DB_BLOCKS) dbAfter[b] = (newRaw.split(b).length - 1);

console.log('--- HIT COUNTS ---');
for (const r of results) console.log(r.id + ': ' + r.hits + ' hit(s) -> ' + (r.hits > 0 ? 'OK' : 'FAIL(0 hits)'));
console.log('total replacements: ' + replaced);
console.log('--- VERIFY ---');
console.log('JSON parse OK on re-read: ' + newParseOk);
console.log('top-level array: ' + newTopArray + ' (starts with ' + JSON.stringify(newRaw[0]) + ')');
console.log('residual counts: ' + JSON.stringify(residual));
console.log('NEW present: ' + JSON.stringify(newHas));
console.log('db blocks before/after: ' + JSON.stringify(dbBefore) + ' / ' + JSON.stringify(dbAfter));
