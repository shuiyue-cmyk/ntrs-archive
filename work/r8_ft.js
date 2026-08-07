// R8 apply for Cirno_BATTLE_Turn_FT.json (plain FT BATTLE, trap-type thugs)
// Groups: R8-A (A1..A6) + R8-B (B1..B3) + R8-C (C1..C2). NTRS extension skipped.
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';

const pairs = [
  // ---- R8-A ----
  ['A1', `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
 - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
 - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
 - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`,
   `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`],
  ['A2', `**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**`,
   `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`],
  ['A3', `**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**`,
   `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`],
  ['A4', `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`,
   `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`],
  ['A5', `② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；`,
   `② 分支A——已有追踪黄毛：黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景画面但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），仍可判 act（场景外行动，发生在 {{user}} 场景外）；`],
  ['A6', `- [黄毛名]（锁定目标 [对象名]）：动向=[在场·[位置] / 离场·[去向/尾随目标/潜伏接近] / 暗中布局]；线状态=[雄竞期/黄毛败·友好/黄毛胜·终局/后宫线]；五型=[权力型/魅力型/隐秘型/强制型/诱惑型]；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`,
   `- [黄毛名]（锁定目标 [对象名]）：动向=[在场·[位置]（当前场景画面内） / 离场·[同楼其他房间/去向/尾随目标/潜伏接近] / 暗中布局]；线状态=[雄竞期/黄毛败·友好/黄毛胜·终局/后宫线]；五型=[权力型/魅力型/隐秘型/强制型/诱惑型]；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`],
  // ---- R8-B ----
  ['B1', `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**`,
   `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏），prologue 不把该戏作为 {{user}} 在场戏展开**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`],
  ['B2', `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开`,
   `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略（或制造对象离场契机后场景外接触）时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`],
  ['B3', ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`,
   ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。`],
  // ---- R8-C ----
  ['C1', `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。`,
   `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。**目标与 {{user}} 同处当前场景时黄毛仍可 act**：黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）后，在 {{user}} 场景外对目标展开行动——场景外行动照常判 act（见 no_spawn ②）。`],
  ['C2', ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处，只要剧情上途径与动机合理）`,
   ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处；**目标与 {{user}} 同处当前场景时**，黄毛有合理手段制造目标离场契机（约定/诱引/外部事件引走）后场景外接触，途径与动机合理即可，只要剧情不荒谬）`],
];

// NEW presence check substrings per pair
const newCheck = {
  A1: `以 **{{user}} 本轮当前场景画面** 为唯一基准`,
  A2: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**`,
  A3: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场`,
  A4: `本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动`,
  A5: `黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景画面但两者可接触`,
  A6: `动向=[在场·[位置]（当前场景画面内） / 离场·[同楼其他房间/去向/尾随目标/潜伏接近] / 暗中布局]`,
  B1: `正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌`,
  B2: `**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**`,
  B3: `该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情）`,
  C1: `**目标与 {{user}} 同处当前场景时黄毛仍可 act**`,
  C2: `**目标与 {{user}} 同处当前场景时**，黄毛有合理手段制造目标离场契机`,
};

function allStrings(p) {
  const out = [];
  for (const t of p.plotTasks || []) {
    if (t.promptGroup) {
      for (const k of Object.keys(t.promptGroup)) {
        const m = t.promptGroup[k];
        if (m && typeof m.content === 'string') out.push(m.content);
      }
    }
    if (typeof t.description === 'string') out.push(t.description);
  }
  if (typeof p.finalSystemDirective === 'string') out.push(p.finalSystemDirective);
  return out;
}

const raw = fs.readFileSync(PATH, 'utf8');
const j = JSON.parse(raw);            // keep ORIGINAL top-level j
const p = j[0];
const strings = allStrings(p);
const blob = strings.join('\n=====\n');

// 1) count occurrences per OLD
const counts = pairs.map(([id, old]) => [id, blob.split(old).length - 1]);
console.log('== pre counts ==');
for (const [id, c] of counts) console.log(`${id}: ${c}`);

// 2) apply replacements (only on strings that contain the old text)
for (const [id, old, nw] of pairs) {
  for (let i = 0; i < strings.length; i++) {
    if (strings[i].includes(old)) strings[i] = strings[i].split(old).join(nw);
  }
}

// re-walk back into j
{
  let si = 0;
  for (const t of p.plotTasks || []) {
    if (t.promptGroup) {
      for (const k of Object.keys(t.promptGroup)) {
        const m = t.promptGroup[k];
        if (m && typeof m.content === 'string') m.content = strings[si++];
      }
    }
    if (typeof t.description === 'string') t.description = strings[si++];
  }
  if (typeof p.finalSystemDirective === 'string') p.finalSystemDirective = strings[si++];
}

// 3) serialize + guard + write
const out = JSON.stringify(j, null, 2);
if (!out.startsWith('[')) throw new Error('serialized raw does not start with [ — abort write');
JSON.parse(out); // parse sanity
fs.writeFileSync(PATH, out, 'utf8');
console.log('WROTE OK, bytes:', Buffer.byteLength(out, 'utf8'));
