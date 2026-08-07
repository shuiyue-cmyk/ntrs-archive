// R8 N-extension fix: Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json
// Variant: revise_ALLin (3-space indent, ALLin wording 该黄毛/该目标, branch A/B ALLin wording)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
if (raw.trim()[0] !== '[') throw new Error('top-level is not an array: first char = ' + raw.trim()[0]);
const j = JSON.parse(raw);

// ---- replacement pairs (template literals) ----
const pairs = [
  {
    id: 'N-A1',
    old: `**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**`,
    neu: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
  },
  {
    id: 'N-A2',
    old: `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
   - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
   - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
   - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`,
    neu: `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
  },
  {
    id: 'N-A3',
    old: `- **no_spawn**：本轮无黄毛在场。两种情形：`,
    neu: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
  },
  {
    id: 'N-A5',
    old: `② 分支A——黄毛表已有黄毛但本轮在场不合理（如黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场 等），输出 no_spawn；若无历史锁定的活跃黄毛则下游 stage3 走快速通道。`,
    neu: `② 分支A——黄毛表已有黄毛但黄毛不在 {{user}} 当前场景画面内（如黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场、同楼其他房间等），输出 no_spawn——但若该黄毛已真正锁定且离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，仍可判 act（场景外行动，发生在 {{user}} 场景外）；行动判定为 no-act 时下游 stage3 走快速通道。`,
  },
  {
    id: 'N-A6',
    old: `② 分支A（复用已有黄毛）——黄毛表已有黄毛条目，本轮判定其在场合理，沿用已有黄毛`,
    neu: `② 分支A（复用已有黄毛）——黄毛表已有黄毛条目，本轮判定其在 {{user}} 当前场景画面内合理，沿用已有黄毛`,
  },
  {
    id: 'N-B1',
    old: `**若黄毛与该目标均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往该目标所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**`,
    neu: `**若黄毛与该目标均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往该目标所在处攻略，或黄毛制造该目标离场契机后场景外接触），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，正文 content 完整编排该场景外戏（读者可见黄毛与该目标的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏），prologue 不把该戏作为 {{user}} 在场戏展开**`,
  },
  {
    id: 'N-B2',
    old: `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开`,
    neu: `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略（或制造对象离场契机后场景外接触）时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**`,
  },
  {
    id: 'N-B3',
    old: `thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。`,
    neu: `thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已真正锁定的活跃黄毛，且其本轮 act 行动发生在 {{user}} 当前场景内，则按"真正锁定"规则登场编排；若该黄毛本轮 act 为场景外行动（黄毛与对象均在 {{user}} 当前场景之外），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。`,
  },
  {
    id: 'N-C1',
    old: `即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act，该行动发生在 {{user}} 场景外）`,
    neu: `即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）；**目标与 {{user}} 同处当前场景时（该黄毛已真正锁定）**：该黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）后，在 {{user}} 场景外对目标展开行动——场景外行动照常判 act；**未锁定（背景板）黄毛仍一律 no-act，不适用本条**）`,
  },
  {
    id: 'N-C2',
    old: `- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
    neu: `- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act，锁定前可 spawn 但不得 act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手（含目标与 {{user}} 同场且黄毛无合理制造离场契机的手段）。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
  },
];

// collect all content strings (promptGroup .content, task.description, finalSystemDirective)
const strings = [];
for (const t of j[0].plotTasks) {
  if (typeof t.description === 'string') strings.push(t.description);
  if (Array.isArray(t.promptGroup)) {
    for (const g of t.promptGroup) {
      if (typeof g.content === 'string') strings.push(g.content);
      else strings.push(JSON.stringify(g)); // safety, should not trigger
    }
  }
}
strings.push(j[0].finalSystemDirective);

let globalOk = true;
for (const p of pairs) {
  let total = 0;
  for (let i = 0; i < strings.length; i++) {
    const s = strings[i];
    const hits = s.split(p.old).length - 1;
    if (hits > 0) {
      strings[i] = s.split(p.old).join(p.neu);
      total += hits;
    }
  }
  console.log(`[${p.id}] hits=${total} ${total > 0 ? 'OK' : 'FAIL-0HIT'}`);
  if (total === 0) globalOk = false;
}

// write back into the original structure
let k = 0;
for (const t of j[0].plotTasks) {
  if (typeof t.description === 'string') t.description = strings[k++];
  if (Array.isArray(t.promptGroup)) {
    for (const g of t.promptGroup) {
      if (typeof g.content === 'string') g.content = strings[k++];
      else k++; // was JSON.stringify safety placeholder; leave untouched
    }
  }
}
j[0].finalSystemDirective = strings[k++];

const out = JSON.stringify(j, null, 2);
JSON.parse(out); // must parse
if (out.trim()[0] !== '[') throw new Error('write-back not array');
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN OK, bytes=' + out.length + ', globalOk=' + globalOk);
