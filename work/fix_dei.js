// R7 fix script — Cirno_BATTLE_Turn_DEI.json (DEI plain)
// Applies G1..G14 (skip G15) + S3 (DEI plain) per fix_spec_r7.md
const fs = require('fs');

const PATH = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_DEI.json';

const raw = fs.readFileSync(PATH, 'utf8');
let j = JSON.parse(raw); // keep ORIGINAL top-level j (array) — never unwrap for writing
const root = Array.isArray(j) ? j[0] : j;

// ---- collect target string fields (content/description/FSD/finalDirectiveTemplate) ----
const fields = [];
for (const t of root.plotTasks || []) {
  if (typeof t.description === 'string') fields.push(t.description);
  for (const m of t.promptGroup || []) {
    if (m && typeof m.content === 'string') fields.push(m.content);
  }
  if (typeof t.finalDirectiveTemplate === 'string') fields.push(t.finalDirectiveTemplate);
}
if (typeof root.finalSystemDirective === 'string') fields.push(root.finalSystemDirective);
if (typeof root.finalDirectiveTemplate === 'string') fields.push(root.finalDirectiveTemplate);

const blob = () => fields.join('\n');

// ---- replacement pairs: [id, old, new] ----
const pairs = [
  ['G1', `> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定（对象与 {{user}} 封顶好朋友、与黄毛成真夫妻），后续轮不再判定。`,
         `> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定：对象与 {{user}} 封顶好朋友、与黄毛成真夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】，后续轮仍可刷新判定互动（spawn/no_spawn/act 照常判定），黄毛与对象的夫妻级亲密互动戏可持续编排；对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动，但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活。`],
  ['G2', `；黄毛胜·终局的对象不再列出；**黄毛败·友好：男娘系（天意待触发）仍须列出**、标「天意待触发」供 S3 编排投怀戏，**正常男性则线闭合不再列出**）`,
         `；黄毛胜·终局的对象**仍须列出**（线锁定非闭合，标线状态供 S3 编排夫妻级关系戏）；**黄毛败·友好：男娘系（天意待触发）仍须列出**、标「天意待触发」供 S3 编排投怀戏，**正常男性则线闭合不再列出**；仅彻底离场不再列入行动判定）`],
  ['G3a', `② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致），黄毛在场或离场均可为 spawn（离场=追踪其去向，仍可行动）。`,
          `② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致）。**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**——no_spawn 不等于 no-act，离场黄毛仍可判 act（见下方 no_spawn ②）。`],
  ['G3b', `- **no_spawn**：本轮无黄毛在场/无活跃可行动黄毛。两种情形：`,
          `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`],
  ['G3c+S3d', `② 分支A——已有追踪黄毛但该黄毛线已闭合（黄毛胜·终局）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）；**男娘系黄毛败·友好（天意待触发）不算彻底闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，判 spawn 并推进投怀戏**；若无活跃追踪黄毛则下游 stage3 走快速通道。`,
              `② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）（若为暂时无途径则 no-act 但持续追踪，线不死寂）→ no-act。**男娘系黄毛败·友好（天意待触发）不算闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，按在场处理（spawn）并供 S3 推进投怀戏**。行动判定为 no-act 时下游 stage3 走快速通道。`],
  ['G4a', `0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定；黄毛胜·终局的对象不再判定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——若有上轮已真正锁定的活跃黄毛，仍须进入后续规则判定 act/no-act。`,
          `0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——追踪中的活跃黄毛（含黄毛胜·终局的对象）仍须进入后续规则判定 act/no-act。`],
  ['G4b', `1b. **线状态=黄毛胜·终局**（线已闭合）的对象：黄毛不再有行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>（黄毛胜后成婚，不参与竞争戏）。`,
          `1b. **线状态=黄毛胜·终局**的对象：黄毛不踢出追踪、仍可判定行动——黄毛与对象的夫妻级亲密互动戏（{{user}} 在场/不在场按知情度档位）可判 act，黄毛不多介入 {{user}} 日常生活。`],
  ['G5a', `以触发下游 S3 的友情收尾场景全量编排；胜负确认后的后续轮才回归 no-act。`,
          `以触发下游 S3 的友情收尾场景全量编排；黄毛败·友好的后续轮回归 no-act（线闭合）。`],
  ['G5b', `以触发下游 S3 的终局场景全量编排；胜负确认后的后续轮才回归 no-act。`,
          `以触发下游 S3 的终局场景全量编排；黄毛胜·终局的后续轮**不**回归 no-act——黄毛仍按追踪判定互动（夫妻级亲密戏可持续，见规则 1b）。`],
  ['G6a', `黄毛胜·终局→终局场景（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友）`,
          `黄毛胜·终局→终局锁定+关系戏（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友；黄毛仍在追踪、仍可行动——与对象的夫妻级亲密互动戏可持续，对象仍可在 {{user}} 身边活动互动但亲密只属黄毛，黄毛不多介入 {{user}} 生活）`],
  ['G6b', `黄毛败·友好→友情收尾场景（对象与黄毛成为好朋友、{{user}} 与对象恋爱确立，黄毛退出竞争）`,
          `黄毛败·友好→友情收尾场景（对象与黄毛成为好朋友、{{user}} 与对象恋爱确立，黄毛退出竞争；男娘系黄毛败·友好同时推进天意·后宫线——酝酿对 {{user}} 的爱意，为投怀/入后宫铺垫）`],
  ['G7', `- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。`,
          `- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】、仍可判定互动——黄毛与对象的夫妻级亲密互动戏可持续编排（暗线/明线按知情度档位），对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动（好朋友日常），但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活；{{user}} 可转攻其他可攻略对象，也可保持与对象的日常互动。`],
  ['G8+G9', ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；但追踪中的活跃黄毛（雄竞期）仍按对应线状态规则登场——即使目标不在场，黄毛尾随/赶赴/暗中行动的戏照常编排。`,
            ` - thugSpawn 状态=spawn 且线状态=黄毛胜·终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）——黄毛与对象的夫妻级亲密关系戏按剧情编排；若本轮为场景外行动则不列入登场名单（见场景外标注规则）。\n - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`],
  ['G10.1', `黄毛败=对象明确且长期拒绝黄毛`,
            `黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）`],
  ['G10.2', `对象明确且长期拒绝黄毛/明确选择 {{user}} → 黄毛败`,
            `对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）→ 黄毛败`],
  ['G10.3', `黄毛败（对象明确且长期拒绝黄毛 / 明确选择 {{user}}）`,
            `黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）`],
  ['G10.4', `（对象明确选择/明确长期拒绝）`,
            `（对象明确选择/综合判断女主行为已倾向 {{user}}）`],
  ['G10.5', `对象是否明确且长期拒绝黄毛或明确选择 {{user}} → 黄毛败`,
            `女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断）→ 黄毛败`],
  ['G10x(L681 extra)', `对象明确且长期拒绝黄毛、或明确选择 {{user}}——该对象线**闭合**，黄毛退出竞争：`,
            `综合判断女主行为已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）——该对象线**闭合**，黄毛退出竞争：`],
  ['G11', `{{user}} 在场时在 NTR 标记列加注 👁️`,
          `{{user}} 在场时在关系标记列加注 👁️`],
  ['G12', `此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。`,
          `此规则仅为节省等待时间，不影响后续任何轮次——下一轮若 thugAction=act，恢复完整导演分析。`],
  ['G13', `情绪惯性：强度≥6每轮只衰减1-2点`,
          `情绪惯性：强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）`],
  ['G14', `【黄毛刷新状态】spawn=本轮有黄毛在场/在追踪 / no_spawn=本轮无黄毛；`,
          `【黄毛刷新状态】spawn=本轮有黄毛在当前场景在场/新刷新登场 / no_spawn=本轮无黄毛在当前场景在场（追踪中黄毛仍列出，可能场景外行动）；`],
  ['S3a', `② 其余已真正锁定/活跃黄毛按 story_context / 概览 / 前文中的出场或锁定先后`,
          `② 其余已真正锁定/活跃黄毛（含胜负确认轮刚确认终局/败·友好的黄毛——见胜负确认轮例外）按 story_context / 概览 / 前文中的出场或锁定先后`],
  ['S3f', `NTR/绿帽/竞争/信息差旁观`,
          `NTR/竞争/信息差旁观`],
  ['S3g1', `○/◐/●/✗`,
           `达成/进行中/未开始`],
  ['S3g2', `任意两个目标达成 或 失败/无法完成`,
           `任意两个目标的章节目标达成交付`],
  ['S3h', `已刷新黄毛的体态/伟哥/手术状态规则`,
          `已刷新黄毛的型体概要/伟哥/手术状态规则`],
  ['S3i-A', `存在即视为"该目标已绑定黄毛"，一气到底不再刷新新黄毛，改为把该黄毛本轮动向列入`,
            `存在即视为"该目标已绑定黄毛"，该目标不再刷新新黄毛，改为把该黄毛本轮动向列入`],
  ['S3i-B', `【分支 B — 无追踪黄毛】：场上尚无任何已刷新黄毛（或所有黄毛均已终局闭合），走"黄毛刷新判定"逻辑判定本轮是否为某💔可攻略角色刷新一个新黄毛。`,
            `【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。`],
];

// ---- apply ----
const before = blob();
const report = [];
let totalHit = 0;
for (const [id, old, nw] of pairs) {
  const cnt = before.split(old).length - 1;
  report.push([id, cnt, old, nw]);
  if (cnt > 0) totalHit += cnt;
}

// apply only to string fields, preserving structure
function replaceIn(s, old, nw) {
  return s.includes(old) ? s.split(old).join(nw) : s;
}
fields.forEach((_, i) => {
  let s = fields[i];
  for (const [id, old, nw] of pairs) {
    if (s.includes(old)) s = s.split(old).join(nw);
  }
  fields[i] = s;
});

// map fields back into j
let fi = 0;
for (const t of root.plotTasks || []) {
  if (typeof t.description === 'string') t.description = fields[fi++];
  for (const m of t.promptGroup || []) {
    if (m && typeof m.content === 'string') m.content = fields[fi++];
  }
  if (typeof t.finalDirectiveTemplate === 'string') t.finalDirectiveTemplate = fields[fi++];
}
if (typeof root.finalSystemDirective === 'string') root.finalSystemDirective = fields[fi++];
if (typeof root.finalDirectiveTemplate === 'string') root.finalDirectiveTemplate = fields[fi++];

// ---- write back only if parse ok && top-level stays array ----
const out = JSON.stringify(j, null, 2);
let parseOk = true;
try { JSON.parse(out); } catch (e) { parseOk = false; }
const topArray = out.trimStart().startsWith('[');
if (parseOk && topArray) {
  fs.writeFileSync(PATH, out, 'utf8');
  console.log('WRITTEN: parseOk=' + parseOk + ' topArray=' + topArray + ' totalHits=' + totalHit);
} else {
  console.log('NOT WRITTEN: parseOk=' + parseOk + ' topArray=' + topArray);
}

// ---- per-pair report ----
for (const [id, cnt] of report) {
  console.log(id + '|' + cnt);
}
