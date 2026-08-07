// R8 fix: Cirno_BATTLE_Turn_straight_NTRS.json
// Apply R8-A (A1..A6) + R8-B (B1..B3) + R8-C (C1..C2) from MAIN spec only.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';

const raw = fs.readFileSync(path, 'utf8');
if (raw.trimStart()[0] !== '[') {
  console.error('ABORT: raw file does not start with [');
  process.exit(1);
}
let j;
try {
  j = JSON.parse(raw);
} catch (e) {
  console.error('ABORT: JSON.parse failed:', e.message);
  process.exit(1);
}
if (!Array.isArray(j)) {
  console.error('ABORT: top-level is not an array');
  process.exit(1);
}

// ---- replacement pairs: [id, OLD, NEW] ----
const pairs = [
  // A1: HARD RULES 3 出场可能性判定 整段
  ['A1',
    `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
 - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
 - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
 - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`,
    `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`],

  // A2: 分支B spawn ① 刷新成功判定标准
  ['A2',
    `**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**`,
    `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`],

  // A3: 分支A spawn ② spawn= 定义句
  ['A3',
    `**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**`,
    `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`],

  // A4: no_spawn 头注
  ['A4',
    `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`,
    `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`],

  // A5: no_spawn ② 分支A 行 (NTRS 闭合枚举「黄毛败·友好」per dump)
  ['A5',
    `② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`,
    `② 分支A——已有追踪黄毛：黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景画面但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`],

  // A6: 分支A 追踪格式示例行 (NTRS 版线状态枚举 [雄竞期/NTRS期/黄毛胜·终局])
  ['A6',
    `- [黄毛名]（锁定目标 [对象名]）：动向=[在场·[位置] / 离场·[去向/尾随目标/潜伏接近] / 暗中布局]；线状态=[雄竞期/NTRS期/黄毛胜·终局]；五型=[权力型/魅力型/隐秘型/强制型/诱惑型]；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`,
    `- [黄毛名]（锁定目标 [对象名]）：动向=[在场·[位置]（当前场景画面内） / 离场·[同楼其他房间/去向/尾随目标/潜伏接近] / 暗中布局]；线状态=[雄竞期/NTRS期/黄毛胜·终局]；五型=[权力型/魅力型/隐秘型/强制型/诱惑型]；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`],

  // B1: S3-MSG0 act 编排「场景外」句 (NTRS 无 R7 补注)
  ['B1',
    `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**`,
    `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏），prologue 不把该戏作为 {{user}} 在场戏展开**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`],

  // B2: S3 stage 模板「场景外标注」字段 (NTRS 无 R7 补注)
  ['B2',
    `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开`,
    `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略（或制造对象离场契机后场景外接触）时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`],

  // B3: S3-MSG2 登场门 no_spawn 行 (R7 已改写版)
  ['B3',
    ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`,
    ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。`],

  // C1: S2 行动判定 act 段「目标离场时黄毛仍可 act」句
  ['C1',
    `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。`,
    `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。**目标与 {{user}} 同处当前场景时黄毛仍可 act**：黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）后，在 {{user}} 场景外对目标展开行动——场景外行动照常判 act（见 no_spawn ②）。`],

  // C2: 硬约束「逻辑无硬伤门」近身契机行
  ['C2',
    ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处，只要剧情上途径与动机合理）`,
    ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处；**目标与 {{user}} 同处当前场景时**，黄毛有合理手段制造目标离场契机（约定/诱引/外部事件引走）后场景外接触，途径与动机合理即可，只要剧情不荒谬）`],
];

// ---- walk & count ----
const stats = {};
function walk(o) {
  if (typeof o === 'string') {
    let s = o;
    for (const [id, oldS, newS] of pairs) {
      const c = s.split(oldS).length - 1;
      if (c > 0) {
        stats[id] = (stats[id] || 0) + c;
        s = s.split(oldS).join(newS);
      }
    }
    return s;
  }
  if (Array.isArray(o)) return o.map(walk);
  if (o && typeof o === 'object') {
    for (const k of Object.keys(o)) o[k] = walk(o[k]);
    return o;
  }
  return o;
}

const j2 = walk(j);

for (const [id] of pairs) console.log(`${id}: ${stats[id] || 0} hit(s)`);

// ---- write back ----
const out = JSON.stringify(j2, null, 2);
if (out[0] !== '[') {
  console.error('ABORT: serialized output does not start with [');
  process.exit(1);
}
try {
  JSON.parse(out);
} catch (e) {
  console.error('ABORT: serialized output is not valid JSON:', e.message);
  process.exit(1);
}
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN OK. bytes:', Buffer.byteLength(out, 'utf8'));
