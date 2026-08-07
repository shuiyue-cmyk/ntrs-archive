// R7 fixer for Cirno_BATTLE_Turn_straight_NTRS.json (G1..G15 + S4)
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_straight_NTRS.json';

let raw = fs.readFileSync(PATH, 'utf8');
let hadBom = raw.charCodeAt(0) === 0xFEFF;
if (hadBom) raw = raw.slice(1);
let j;
try { j = JSON.parse(raw); } catch (e) { console.log('INITIAL_PARSE_FAIL:', e.message); process.exit(1); }
console.log('topIsArray:', Array.isArray(j));
console.log('plotTasks:', j[0] && j[0].plotTasks ? j[0].plotTasks.length : 'n/a');
console.log('hasFinalSystemDirective:', typeof j[0].finalSystemDirective === 'string');
console.log('hasFinalDirectiveTemplate:', typeof j[0].finalDirectiveTemplate === 'string');

// [id, OLD, NEW]
const pairs = [
  // ===== G1 =====
  ['G1',
`> - **黄毛胜\u00b7终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定（对象与 {{user}} 封顶好朋友、与黄毛成真夫妻），后续轮不再判定。`,
`> - **黄毛胜\u00b7终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定：对象与 {{user}} 封顶好朋友、与黄毛成真夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】，后续轮仍可刷新判定互动（spawn/no_spawn/act 照常判定），黄毛与对象的夫妻级亲密互动戏可持续编排；对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动，但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活。`],
  // ===== G2 =====
  ['G2',
`；黄毛胜\u00b7终局/线闭合的对象不再列出）`,
`；黄毛胜\u00b7终局的对象**仍须列出**（线锁定非闭合，标线状态供 S3 编排夫妻级关系戏）；仅线闭合（黄毛败\u00b7友好/彻底离场）不再列入行动判定）`],
  // ===== G3a =====
  ['G3a',
`  ② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致），黄毛在场或离场均可为 spawn（离场=追踪其去向，仍可行动）。`,
`  ② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致）。**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**——no_spawn 不等于 no-act，离场黄毛仍可判 act（见下方 no_spawn ②）。`],
  // ===== G3b =====
  ['G3b',
`- **no_spawn**：本轮无黄毛在场/无活跃可行动黄毛。两种情形：`,
`- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`],
  // ===== G3c (NTRS 版精确 OLD：闭合枚举为「黄毛胜·终局」) =====
  ['G3c',
`  ② 分支A——已有追踪黄毛但该黄毛线已闭合（黄毛胜\u00b7终局）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）；若无活跃追踪黄毛则下游 stage3 走快速通道。`,
`  ② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败\u00b7友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`],
  // ===== G4a =====
  ['G4a',
`0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定；黄毛胜\u00b7终局的对象不再判定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——若有上轮已真正锁定的活跃黄毛，仍须进入后续规则判定 act/no-act。`,
`0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——追踪中的活跃黄毛（含黄毛胜\u00b7终局的对象）仍须进入后续规则判定 act/no-act。`],
  // ===== G4b (straight 版 TRIGGER 1；本版无此句，预期 0 命中) =====
  ['G4b',
`1. **线状态=黄毛败\u00b7友好/黄毛胜\u00b7终局**（线已闭合）的对象：黄毛不再有行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>（黄毛退居朋友位，不参与竞争戏）。`,
`1. **线状态=黄毛败\u00b7友好**（线闭合）的对象：黄毛退居朋友位、不再有竞争行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>。**线状态=黄毛胜\u00b7终局**的对象：黄毛不踢出追踪、仍可判定行动——黄毛与对象的夫妻级亲密互动戏（{{user}} 在场/不在场按知情度档位）可判 act，黄毛不多介入 {{user}} 日常生活。`],
  // ===== G5 (NTRS 版) =====
  ['G5',
`**但本轮若刚确认胜负（thugActionReason 写明雄竞结果：黄毛胜/黄毛败）则例外判 act，以触发下游 S3 的终局场景全量编排；胜负确认后的后续轮才回归 no-act。**`,
`**但本轮若刚确认胜负（thugActionReason 写明雄竞结果：黄毛胜/黄毛败）则例外判 act，以触发下游 S3 的终局/收尾场景全量编排；黄毛败（转 NTRS期）的后续轮按 NTRS 期判定逻辑正常判定（淫妻线推进），不回归 no-act；黄毛胜\u00b7终局的后续轮**不**回归 no-act——黄毛仍按追踪判定互动（夫妻级亲密戏可持续）。**`],
  // ===== G6 =====
  ['G6',
`黄毛胜\u00b7终局→终局场景（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友）`,
`黄毛胜\u00b7终局→终局锁定+关系戏（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友；黄毛仍在追踪、仍可行动——与对象的夫妻级亲密互动戏可持续，对象仍可在 {{user}} 身边活动互动但亲密只属黄毛，黄毛不多介入 {{user}} 生活）`],
  // ===== G7 =====
  ['G7',
`- **黄毛胜\u00b7终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。`,
`- **黄毛胜\u00b7终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】、仍可判定互动——黄毛与对象的夫妻级亲密互动戏可持续编排（暗线/明线按知情度档位），对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动（好朋友日常），但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活；{{user}} 可转攻其他可攻略对象，也可保持与对象的日常互动。`],
  // ===== G8 + G9 (终局登场门插入 + no_spawn 行改写) =====
  ['G8+G9',
` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；但追踪中的活跃黄毛（雄竞期/NTRS期）仍按对应线状态规则登场——即使目标不在场，黄毛尾随/赶赴/暗中行动的戏照常编排。`,
` - thugSpawn 状态=spawn 且线状态=黄毛胜\u00b7终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）——黄毛与对象的夫妻级亲密关系戏按剧情编排；若本轮为场景外行动则不列入登场名单（见场景外标注规则）。\n - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`],
  // ===== G10-1 (S2 description) =====
  ['G10-1',
`黄毛败=对象明确且长期拒绝黄毛/明确选择{{user}}（对象转入NTRS期`,
`黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）（对象转入NTRS期`],
  // ===== G10-2 (S2-MSG4 胜负判定段) =====
  ['G10-2',
`对象明确且长期拒绝黄毛/明确选择 {{user}}`,
`对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）`],
  // ===== G10-3 (S3-MSG2 线状态定义) =====
  ['G10-3',
`黄毛败（对象明确且长期拒绝黄毛 / 明确选择 {{user}}）`,
`黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）`],
  // ===== G10-4 (S3 剧情驱动推进段) =====
  ['G10-4',
`（对象明确选择/明确长期拒绝）`,
`（对象明确选择/综合判断女主行为已倾向 {{user}}）`],
  // ===== G10-5 (S3 sparkNotes；预期 0 命中——由 S4a 整行替换覆盖) =====
  ['G10-5',
`对象是否明确且长期拒绝黄毛或明确选择 {{user}}`,
`女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断）`],
  // ===== G11 =====
  ['G11',
`{{user}} 在场时在 NTR 标记列加注 👁️`,
`{{user}} 在场时在关系标记列加注 👁️`],
  // ===== G12 =====
  ['G12',
`此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。`,
`此规则仅为节省等待时间，不影响后续任何轮次——下一轮若 thugAction=act，恢复完整导演分析。`],
  // ===== G13 =====
  ['G13',
`- 情绪惯性：强度≥6每轮只衰减1-2点`,
`- 情绪惯性：强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）`],
  // ===== G14 =====
  ['G14',
`【黄毛刷新状态】spawn=本轮有黄毛在场/在追踪 / no_spawn=本轮无黄毛；`,
`【黄毛刷新状态】spawn=本轮有黄毛在当前场景在场/新刷新登场 / no_spawn=本轮无黄毛在当前场景在场（追踪中黄毛仍列出，可能场景外行动）；`],
  // ===== G15a (S2-MSG2 表格权威源段，4 行合一) =====
  ['G15a',
`本轮查询数据库表格获取权威数据，并配合黄毛追踪机制使用：
- **表格为权威源**：黄毛表（锁定对象/lock_status/进度条/型体设定/性别类型/五型）、重要角色表（登场角色设定）、NTRS备忘录（长期备忘）——查表判断已有黄毛与沿用设定；
- **黄毛动向追踪为跨轮状态补充**：每轮把场上每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）、线状态（雄竞期/NTRS期/黄毛胜\u00b7终局）写进 <thugSpawn> 的【黄毛动向追踪】区块。**目标离场不意味着黄毛停摆**：黄毛可尾随/赶赴/潜伏接近目标所在处继续行动。
本轮查询数据库表格获取权威数据（黄毛表为黄毛条目/型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：`,
`本轮查询数据库表格获取黄毛档案数据（黄毛表为型体设定/性器官规则/NTRS期进度；重要角色表为登场角色设定；NTRS备忘录为长期备忘），仅作设定/人设参考，不用于判断已有黄毛：
- **黄毛动向追踪为跨轮状态权威**：每轮把场上每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）、线状态（雄竞期/NTRS期/黄毛胜\u00b7终局）写进 <thugSpawn> 的【黄毛动向追踪】区块——**已有黄毛、锁定与线状态一律以追踪区块为准，不查表判断**。**目标离场不意味着黄毛停摆**：黄毛可尾随/赶赴/潜伏接近目标所在处继续行动。`],
  // ===== G15b (S3-MSG15 表格权威源段，两行合一) =====
  ['G15b',
`本轮查询数据库表格获取黄毛档案权威数据（黄毛表为型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘），配合 <thugSpawn> 追踪区块使用：
本轮查询数据库表格获取权威数据（黄毛表为黄毛条目/型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：`,
`本轮查询数据库表格获取黄毛档案数据（黄毛表为型体设定/性器官规则/NTRS期进度；重要角色表为登场角色设定；NTRS备忘录为长期备忘），仅作设定/人设参考，配合 <thugSpawn> 追踪区块使用——运行期线状态/锁定/型体概要/性器官规则以追踪区块与历史刷新记录为准，不从前文猜、不查表判断状态：`],
  // ===== S4a (sparkNotes 胜负核对) =====
  ['S4a',
`  * **雄竞期\u00b7胜负判定（纯剧情，无数值）**：对象是否明确选择黄毛（接受表白/确立关系/成婚）→ 黄毛胜，线状态=黄毛胜\u00b7终局？对象是否明确且长期拒绝黄毛或明确选择 {{user}} → 黄毛败，线状态=NTRS期？未分胜负则维持雄竞期。禁止用数值/进度条结算。`,
`  * **雄竞期\u00b7胜负核对（以 stage 2 thugSpawn 线状态为准，仅核对剧情事件是否一致）**：thugSpawn 线状态=黄毛胜\u00b7终局？=NTRS期/黄毛败\u00b7友好？未分胜负则雄竞期——禁止 S3 自主判定胜负。`],
  // ===== S4c (prologue 机缘节输出门补注) =====
  ['S4c',
`  - **prologue 机缘/暗流/互动感知节输出门**：thugAction=act → 该节必发（黄毛本轮出手触发的暗流/感知都要体现）；thugAction=no-act → 走快速通道，该节整块省略`,
`  - **prologue 机缘/暗流/互动感知节输出门**：thugAction=act → 该节必发（黄毛本轮出手触发的暗流/感知都要体现）；thugAction=no-act → 走快速通道，该节整块省略（场景外 act 且 {{user}} 完全不知🌙 → 该节不输出，仅 stage 记录）`],
  // ===== S4f (thugSpawn 只放句) =====
  ['S4f',
`<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）`,
`<thugSpawn> 标签内只放刷新状态+黄毛人设+【黄毛动向追踪】区块（会经 FSD 给花火·正文）`],
  // ===== S4g (门槛表表头标注) =====
  ['S4g',
`**淫妻线身体接受度门槛（判定黄毛对目标的身体接触能推进到哪一步，act 档必查）**：`,
`**淫妻线身体接受度门槛（判定黄毛对目标的身体接触能推进到哪一步，act 档必查；本版 41% 起步，忠诚/动摇型不出现）**：`],
  // ===== S4h-1 (L665 残句修复) =====
  ['S4h-1',
`——黄毛的互动积累，已察觉 {{user}} 的淫妻癖好、不再抗拒黄毛互动——`,
`——经与黄毛的互动积累，对象已察觉 {{user}} 的淫妻癖好、不再抗拒黄毛互动——`],
  // ===== S4h-2 (L554 标签紧接在表述) =====
  ['S4h-2',
`标签紧接在</sparkNotes>后（thugSpawn→thugSpawnReason→thugAction→thugActionReason）`,
`<thugSpawn> 标签紧接在 </sparkNotes> 后`],
];

function applyToStrings(node, fn) {
  if (typeof node === 'string') return fn(node);
  if (Array.isArray(node)) { for (let i = 0; i < node.length; i++) node[i] = applyToStrings(node[i], fn); return node; }
  if (node && typeof node === 'object') { for (const k of Object.keys(node)) node[k] = applyToStrings(node[k], fn); return node; }
  return node;
}

// find longest existing prefix of OLD for diagnostics
function longestPrefix(old) {
  for (let n = Math.min(old.length, 40); n >= 8; n--) {
    const p = old.slice(0, n);
    let found = false;
    applyToStrings(j, (s) => { if (s.includes(p)) found = true; return s; });
    if (found) return p;
  }
  return null;
}

const hits = {};
for (const [id, old, nw] of pairs) {
  let c = 0;
  applyToStrings(j, (s) => {
    const n = s.split(old).length - 1;
    c += n;
    return n > 0 ? s.split(old).join(nw) : s;
  });
  hits[id] = c;
  console.log(`${id}: hits=${c}`);
}
for (const [id, old, nw] of pairs) {
  if (hits[id] === 0) {
    const p = longestPrefix(old);
    console.log(`  ZERO_HIT ${id}: longestExistingPrefix=${p ? JSON.stringify(p) : 'NONE'}`);
  }
}
const totalHits = Object.values(hits).reduce((a, b) => a + b, 0);
console.log('totalHits:', totalHits);

// serialize + validate before write
let out;
try { out = JSON.stringify(j, null, 2); JSON.parse(out); } catch (e) { console.log('SERIALIZE_PARSE_FAIL:', e.message); process.exit(1); }
if (!out.trimStart().startsWith('[')) { console.log('NOT_WRITTEN: top-level not array'); process.exit(1); }
fs.writeFileSync(PATH, out, 'utf8');
console.log('WRITTEN');

// ===== verify pass =====
const raw2 = fs.readFileSync(PATH, 'utf8');
const j2 = JSON.parse(raw2);
const all = JSON.stringify(j2);
console.log('VERIFY parseOK topIsArray=', Array.isArray(j2), 'firstNonSpace=', JSON.stringify(raw2.trimStart()[0]));
let residualAny = false;
for (const [id, old, nw] of pairs) {
  const r = all.split(old).length - 1;
  if (r > 0) { console.log(`RESIDUAL ${id}: ${r}`); residualAny = true; }
}
console.log('RESIDUAL_ANY:', residualAny);
// sanity: db injection blocks preserved
for (const inj of ['{[db.黄毛表.get()]}', '{[db.重要角色表.get()]}', '{[db.NTRS备忘录.get()]}']) {
  console.log('injectionBlockPresent:', inj, all.includes(inj) ? 'yes' : 'NO');
}
console.log('hadBom:', hadBom);
