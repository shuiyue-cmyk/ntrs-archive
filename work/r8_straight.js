// R8 fix: Cirno_BATTLE_Turn_straight.json — apply 改动组 R8-A (A1..A6) + R8-B (B1..B3) + R8-C (C1..C2)
const fs = require('fs');

const FILE = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';

// [id, OLD, NEW]
const pairs = [
  // ---- R8-A ----
  ['A1', `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
 - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
 - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
 - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`, `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`],
  ['A2', `**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**`, `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`],
  ['A3', `**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**`, `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`],
  ['A4', `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`, `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`],
  ['A5', `② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`, `② 分支A——已有追踪黄毛：黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景画面但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`],
  ['A6', `- [黄毛名]（锁定目标 [对象名]）：动向=[在场·[位置] / 离场·[去向/尾随目标/潜伏接近] / 暗中布局]；线状态=[雄竞期/黄毛败·友好/黄毛胜·终局]；五型=[权力型/魅力型/隐秘型/强制型/诱惑型]；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`, `- [黄毛名]（锁定目标 [对象名]）：动向=[在场·[位置]（当前场景画面内） / 离场·[同楼其他房间/去向/尾随目标/潜伏接近] / 暗中布局]；线状态=[雄竞期/黄毛败·友好/黄毛胜·终局]；五型=[权力型/魅力型/隐秘型/强制型/诱惑型]；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`],
  // ---- R8-B ----
  ['B1', `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`, `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏），prologue 不把该戏作为 {{user}} 在场戏展开**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`],
  ['B2', `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`, `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略（或制造对象离场契机后场景外接触）时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`],
  ['B3', ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`, ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。`],
  // ---- R8-C ----
  ['C1', `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。`, `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。**目标与 {{user}} 同处当前场景时黄毛仍可 act**：黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）后，在 {{user}} 场景外对目标展开行动——场景外行动照常判 act（见 no_spawn ②）。`],
  ['C2', ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处，只要剧情上途径与动机合理）`, ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处；**目标与 {{user}} 同处当前场景时**，黄毛有合理手段制造目标离场契机（约定/诱引/外部事件引走）后场景外接触，途径与动机合理即可，只要剧情不荒谬）`],
];

const raw = fs.readFileSync(FILE, 'utf8');
let j = JSON.parse(raw);

// collect references to editable strings (in-place replacement)
const refs = [];
for (const task of j[0].plotTasks) {
  if (typeof task.description === 'string') refs.push(() => task.description);
  for (const key of Object.keys(task.promptGroup)) {
    const msg = task.promptGroup[key];
    if (msg && typeof msg.content === 'string') {
      const k = key;
      const m = msg;
      refs.push(() => m.content);
    }
  }
}
if (typeof j[0].finalSystemDirective === 'string') {
  const obj = j[0];
  refs.push(() => obj.finalSystemDirective);
}

const results = [];
let modified = false;

// 1st pass: count hits on current content
for (const [id, old] of pairs) {
  let hits = 0;
  for (const get of refs) hits += get().split(old).length - 1;
  results.push({ id, hits });
}

// 2nd pass: apply (recompute per string, replace all occurrences)
for (const [id, old, next] of pairs) {
  for (const get of refs) {
    const s = get();
    if (s.includes(old)) {
      const objTarget = get(); // no-op; direct object mutation needed instead
      // direct mutation via assignment on the owning object is required;
      // refs return values, so instead re-walk to find owners:
    }
  }
}
// Simplest robust approach: walk owners directly and replace in place.
const owners = [];
for (const task of j[0].plotTasks) {
  if (typeof task.description === 'string') owners.push({ obj: task, key: 'description' });
  for (const key of Object.keys(task.promptGroup)) {
    const msg = task.promptGroup[key];
    if (msg && typeof msg.content === 'string') owners.push({ obj: msg, key: 'content' });
  }
}
if (typeof j[0].finalSystemDirective === 'string') owners.push({ obj: j[0], key: 'finalSystemDirective' });

let modified2 = false;
for (const [id, old, next] of pairs) {
  for (const o of owners) {
    const s = o.obj[o.key];
    if (s.includes(old)) {
      o.obj[o.key] = s.split(old).join(next);
      modified2 = true;
    }
  }
}

// write back (only if parse of modified obj succeeds AND raw starts with '[')
let out = null;
let writeErr = null;
if (modified2) {
  try {
    const reSerialized = JSON.stringify(j, null, 2);
    JSON.parse(reSerialized); // throws if invalid
    if (!reSerialized.trim().startsWith('[')) throw new Error('top-level not array');
    out = reSerialized;
  } catch (e) {
    writeErr = 'validate-failed: ' + e.message;
  }
}

console.log('=== HIT COUNTS ===');
for (const r of results) console.log(r.id + ': ' + r.hits);
console.log('=== TOTAL ===');
console.log(JSON.stringify(results.reduce((a, r) => a + r.hits, 0)));
console.log('=== WRITE ===');
console.log('modified=' + modified2 + ' writeErr=' + writeErr);
if (out !== null) {
  fs.writeFileSync(FILE, out, 'utf8');
  console.log('written=true');
} else {
  console.log('written=false');
}

// ---- verify ----
if (out !== null) {
  const r2 = fs.readFileSync(FILE, 'utf8');
  const j2 = JSON.parse(r2);
  const okArray = r2.trim().startsWith('[');
  const blob = JSON.stringify(j2);
  const residual = [];
  const oldFrags = [
    '接下来的场景中是否会有黄毛出现的可能',
    '后续剧情是否有黄毛实际出场的契机',
    'prologue 不展开该场景外戏',
    '黄毛仅是"存在"',
    'spawn=本轮黄毛在当前场景在场',
    '本轮无黄毛在当前场景在场',
    '黄毛不在当前场景（离场追踪/场景外行动）',
    '该戏仅写入 stage',
    '如"外表温和清秀，性器官勃起时足够粗长持久"',
  ];
  for (const f of oldFrags) if (blob.includes(f)) residual.push(f);
  const newFrags = [
    '本轮黄毛能否进入 {{user}} 当前场景画面',
    '本轮黄毛在 {{user}} 当前场景画面内在场',
    '同楼其他房间/隔壁/离场追踪/场景外行动',
    '正文 content 完整编排该场景外戏',
    'stage 记录 + 正文 content 完整编排该场景外戏',
    '该戏写入 stage（标注「场景外场景」）+ 正文 content 编排',
    '目标与 {{user}} 同处当前场景时黄毛仍可 act',
    '黄毛有合理手段制造目标离场契机',
  ];
  const missingNew = [];
  for (const f of newFrags) if (!blob.includes(f)) missingNew.push(f);
  console.log('=== VERIFY ===');
  console.log('jsonValid=' + (j2 !== null && j2 !== undefined));
  console.log('topArray=' + okArray);
  console.log('residualOld=' + JSON.stringify(residual));
  console.log('missingNew=' + JSON.stringify(missingNew));
}
