// Probe: check each R8 OLD for Cirno_BATTLE_Turn_FT.json (plain FT BATTLE version)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = j[0];

// collect all content strings
const strings = [];
for (const t of p.plotTasks || []) {
  if (t.promptGroup) {
    for (const k of Object.keys(t.promptGroup)) {
      const m = t.promptGroup[k];
      if (m && typeof m.content === 'string') strings.push({ where: `${t.id}[${k}]`, s: m.content });
    }
  }
  if (typeof t.description === 'string') strings.push({ where: `${t.id}.description`, s: t.description });
}
if (typeof p.finalSystemDirective === 'string') strings.push({ where: 'finalSystemDirective', s: p.finalSystemDirective });
const blob = strings.map(x => x.s).join('\n=====\n');

const pairs = [
  ['A1', `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
 - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
 - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
 - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`],
  ['A2', `**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**`],
  ['A3', `**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**`],
  ['A4', `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`],
  ['A5', `② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`],
  ['A6', `- [黄毛名]（锁定目标 [对象名]）：动向=[在场·[位置] / 离场·[去向/尾随目标/潜伏接近] / 暗中布局]；线状态=[雄竞期/黄毛败·友好/黄毛胜·终局]；五型=[权力型/魅力型/隐秘型/强制型/诱惑型]；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`],
  ['B1', `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**`],
  ['B2', `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开`],
  ['B3', ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`],
  ['C1', `**目标离场时黄毛仍可 act**：黄毛可尾随、赶赴、潜伏接近目标所在处展开行动（只要逻辑无硬伤门全过）。`],
  ['C2', ` - 近身契机：黄毛本轮与目标在同一空间，或有合理理由在本轮内自然抵达（**目标离场不算禁行**——黄毛可尾随/赶赴/潜伏接近目标所在处，只要剧情上途径与动机合理）`],
];

let ok = 0, zero = 0;
for (const [id, old] of pairs) {
  const n = blob.split(old).length - 1;
  if (n > 0) ok++; else zero++;
  console.log(`${id}: ${n}`);
}
console.log(`\n${ok} hit, ${zero} zero`);

// anchors for locating actual text of zero-hit / verification purposes
const anchors = ['出场可能性判定', '刷新成功判定标准', 'spawn=本轮黄毛', 'no_spawn**：本轮', '分支A——已有追踪黄毛', '锁定目标 [对象名]', '黄毛与对象均在 {{user}} 当前场景之外', '场景外标注', 'thugSpawn 状态=no_spawn', '目标离场时黄毛仍可 act', '近身契机', '线状态='];
for (const a of anchors) {
  const idx = blob.indexOf(a);
  if (idx >= 0) {
    console.log(`\n### anchor: ${a}`);
    console.log(JSON.stringify(blob.slice(Math.max(0, idx - 60), idx + 320)));
  } else {
    console.log(`\n### anchor NOT FOUND: ${a}`);
  }
}
