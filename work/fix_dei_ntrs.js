// Fix script for Cirno_BATTLE_Turn_DEI_NTRS.json — applies spec fix_spec_r7.md
// Items: G1..G15 (all) + S6 (DEI_NTRS). Only string content changes.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_DEI_NTRS.json';

// normalize line endings so template literals match regardless of script-file EOL
const n = (s) => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

const P = (id, old, neu) => [id, n(old), n(neu)];

const pairs = [
  // ---- G1: S2-MSG4 线状态判定规则「黄毛胜·终局」行 ----
  P('G1',
`> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定（对象与 {{user}} 封顶好朋友、与黄毛成真夫妻），后续轮不再判定。`,
`> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定：对象与 {{user}} 封顶好朋友、与黄毛成真夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】，后续轮仍可刷新判定互动（spawn/no_spawn/act 照常判定），黄毛与对象的夫妻级亲密互动戏可持续编排；对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动，但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活。`),

  // ---- G2: S2-MSG4 追踪区块「不再列出」句 ----
  P('G2',
`；黄毛胜·终局/线闭合的对象不再列出）`,
`；黄毛胜·终局的对象**仍须列出**（线锁定非闭合，标线状态供 S3 编排夫妻级关系戏）；仅线闭合（黄毛败·友好/彻底离场）不再列入行动判定）`),

  // ---- G3a: spawn ② 行 ----
  P('G3a',
`② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致），黄毛在场或离场均可为 spawn（离场=追踪其去向，仍可行动）。`,
`② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致）。**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**——no_spawn 不等于 no-act，离场黄毛仍可判 act（见下方 no_spawn ②）。`),

  // ---- G3b: no_spawn 头注 ----
  P('G3b',
`- **no_spawn**：本轮无黄毛在场/无活跃可行动黄毛。两种情形：`,
`- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`),

  // ---- G3c: no_spawn ② 行 (NTRS 版 OLD 按 dump) ----
  P('G3c',
`② 分支A——已有追踪黄毛但该黄毛线已闭合（黄毛胜·终局）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）；若无活跃追踪黄毛则下游 stage3 走快速通道。`,
`② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`),

  // ---- G4a: TRIGGER 0 ----
  P('G4a',
`0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定；黄毛胜·终局的对象不再判定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——若有上轮已真正锁定的活跃黄毛，仍须进入后续规则判定 act/no-act。`,
`0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——追踪中的活跃黄毛（含黄毛胜·终局的对象）仍须进入后续规则判定 act/no-act。`),

  // ---- G5: 胜负确认轮例外（NTRS 版：黄毛败转 NTRS期不回归 no-act）----
  P('G5',
`**但本轮若刚确认胜负（thugActionReason 写明雄竞结果：黄毛胜/黄毛败）则例外判 act，以触发下游 S3 的终局场景全量编排；胜负确认后的后续轮才回归 no-act。**`,
`**但本轮若刚确认胜负（thugActionReason 写明雄竞结果：黄毛胜/黄毛败）则例外判 act，以触发下游 S3 的终局/收尾场景全量编排；黄毛败（转 NTRS期）的后续轮按 NTRS 期判定逻辑正常判定（淫妻线推进），不回归 no-act；黄毛胜·终局的后续轮不回归 no-act——黄毛仍按追踪判定互动（夫妻级亲密戏可持续，见规则 1）。**`),

  // ---- G6: S3-MSG0 act 编排「黄毛胜·终局→」句（NTRS 语义同 straight）----
  P('G6',
`黄毛胜·终局→终局场景（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友）`,
`黄毛胜·终局→终局锁定+关系戏（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友；黄毛仍在追踪、仍可行动——与对象的夫妻级亲密互动戏可持续，对象仍可在 {{user}} 身边活动互动但亲密只属黄毛，黄毛不多介入 {{user}} 生活）`),

  // ---- G7: S3-MSG2 状态机「黄毛胜·终局」定义段 ----
  P('G7',
`- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。`,
`- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】、仍可判定互动——黄毛与对象的夫妻级亲密互动戏可持续编排（暗线/明线按知情度档位），对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动（好朋友日常），但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活；{{user}} 可转攻其他可攻略对象，也可保持与对象的日常互动。`),

  // ---- G8+G9: S3-MSG2 登场门（插 spawn+终局 行 + 重写 no_spawn 行，NTRS 保留（雄竞期/NTRS期））----
  P('G8+G9',
` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；但追踪中的活跃黄毛（雄竞期/NTRS期）仍按对应线状态规则登场——即使目标不在场，黄毛尾随/赶赴/暗中行动的戏照常编排。`,
` - thugSpawn 状态=spawn 且线状态=黄毛胜·终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）——黄毛与对象的夫妻级亲密关系戏按剧情编排；若本轮为场景外行动则不列入登场名单（见场景外标注规则）。
 - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`),

  // ---- G10.1: S2 description（NTRS 版保留（对象转入NTRS期…）后缀）----
  P('G10.1',
`黄毛败=对象明确且长期拒绝黄毛/明确选择{{user}}`,
`黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）`),

  // ---- G10.2: S2-MSG4 胜负判定段 ----
  P('G10.2',
`对象明确且长期拒绝黄毛/明确选择 {{user}}`,
`对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）`),

  // ---- G10.3: S3-MSG2 线状态定义 ----
  P('G10.3',
`黄毛败（对象明确且长期拒绝黄毛 / 明确选择 {{user}}）`,
`黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）`),

  // ---- G10.4: S3 剧情驱动推进段 ----
  P('G10.4',
`（对象明确选择/明确长期拒绝）`,
`（对象明确选择/综合判断女主行为已倾向 {{user}}）`),

  // ---- G10.5: S3 sparkNotes 胜负判定 ----
  P('G10.5',
`对象是否明确且长期拒绝黄毛或明确选择 {{user}}`,
`女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断）`),

  // ---- G11: S3-MSG7 stage 模板「NTR 标记列」→「关系标记列」----
  P('G11',
`{{user}} 在场时在 NTR 标记列加注 👁️`,
`{{user}} 在场时在关系标记列加注 👁️`),

  // ---- G12: S3-MSG0 快速通道恢复条件 ----
  P('G12',
`此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。`,
`此规则仅为节省等待时间，不影响后续任何轮次——下一轮若 thugAction=act，恢复完整导演分析。`),

  // ---- G13: S3-MSG11 活人感数值→定性 ----
  P('G13',
`- 情绪惯性：强度≥6每轮只衰减1-2点`,
`- 情绪惯性：强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）`),

  // ---- G14: S3-MSG0「【黄毛刷新状态】」行 ----
  P('G14',
`【黄毛刷新状态】spawn=本轮有黄毛在场/在追踪 / no_spawn=本轮无黄毛；`,
`【黄毛刷新状态】spawn=本轮有黄毛在当前场景在场/新刷新登场 / no_spawn=本轮无黄毛在当前场景在场（追踪中黄毛仍列出，可能场景外行动）；`),

  // ---- G15a: S2-MSG2 表格权威源段（三句合一，保留后续注入块）----
  P('G15a',
`本轮查询数据库表格获取权威数据，并配合黄毛追踪机制使用：
- **表格为权威源**：黄毛表（锁定对象/lock_status/进度条/型体设定/性别类型/五型）、重要角色表（登场角色设定）、NTRS备忘录（长期备忘）——查表判断已有黄毛与沿用设定；
- **黄毛动向追踪为跨轮状态补充**：每轮把场上每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）、线状态（雄竞期/NTRS期/黄毛胜·终局）写进 <thugSpawn> 的【黄毛动向追踪】区块。**目标离场不意味着黄毛停摆**：黄毛可尾随/赶赴/潜伏接近目标所在处继续行动。
本轮查询数据库表格获取权威数据（黄毛表为黄毛条目/型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：`,
`本轮查询数据库表格获取黄毛档案数据（黄毛表为型体设定/性器官规则/NTRS期进度；重要角色表为登场角色设定；NTRS备忘录为长期备忘），仅作设定/人设参考，不用于判断已有黄毛：
- **黄毛动向追踪为跨轮状态权威**：每轮把场上每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）、线状态（雄竞期/NTRS期/黄毛胜·终局）写进 <thugSpawn> 的【黄毛动向追踪】区块——**已有黄毛、锁定与线状态一律以追踪区块为准，不查表判断**。**目标离场不意味着黄毛停摆**：黄毛可尾随/赶赴/潜伏接近目标所在处继续行动。`),

  // ---- G15b: S3-MSG15 表格权威源段（两行合一）----
  P('G15b',
`本轮查询数据库表格获取黄毛档案权威数据（黄毛表为型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘），配合 <thugSpawn> 追踪区块使用：
本轮查询数据库表格获取权威数据（黄毛表为黄毛条目/型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：`,
`本轮查询数据库表格获取黄毛档案数据（黄毛表为型体设定/性器官规则/NTRS期进度；重要角色表为登场角色设定；NTRS备忘录为长期备忘），仅作设定/人设参考，配合 <thugSpawn> 追踪区块使用——运行期线状态/锁定/型体概要/性器官规则以追踪区块与历史刷新记录为准，不从前文猜、不查表判断状态：`),

  // ---- S6g: 型体设定/型体概要混用就近补注（追踪格式行）----
  P('S6g',
`；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`,
`；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]（型体概要=表格中的型体设定，同义）`),
];

// ---------- collect references ----------
function collectRefs(j) {
  const refs = [];
  const root = j[0];
  for (const t of root.plotTasks) {
    if (typeof t.description === 'string') refs.push({ obj: t, key: 'description' });
    if (typeof t.finalDirectiveTemplate === 'string') refs.push({ obj: t, key: 'finalDirectiveTemplate' });
    const pg = t.promptGroup;
    const msgs = Array.isArray(pg) ? pg : Object.values(pg || {});
    for (const m of msgs) {
      if (m && typeof m.content === 'string') refs.push({ obj: m, key: 'content' });
    }
  }
  if (typeof root.finalSystemDirective === 'string') refs.push({ obj: root, key: 'finalSystemDirective' });
  return refs;
}

// ---------- run ----------
if (require.main !== module) { module.exports = { pairs }; }
else {
const raw0 = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw0);
const refs = collectRefs(j);
console.log('string fields walked:', refs.length);

const results = [];
for (const [id, old, neu] of pairs) {
  let hits = 0;
  for (const r of refs) {
    hits += r.obj[r.key].split(old).length - 1;
  }
  if (hits > 0) {
    for (const r of refs) {
      if (r.obj[r.key].includes(old)) r.obj[r.key] = r.obj[r.key].split(old).join(neu);
    }
  }
  results.push({ id, hits });
  console.log(`${id}: hits=${hits} ${hits > 0 ? 'OK' : 'MISS'}`);
}

// ---------- write back ----------
const indent = raw0.includes('\n  ') ? 2 : 0;
const out = JSON.stringify(j, indent ? null : undefined, indent);
// guard: parse must succeed and top level must stay an array
let ok = false;
try { const chk = JSON.parse(out); ok = Array.isArray(chk) && out.trim().startsWith('['); } catch (e) { ok = false; }
if (ok) {
  fs.writeFileSync(path, out, 'utf8');
  console.log('WRITTEN. indent=' + (indent ? 2 : 0) + ' topIsArray=true bytes=' + Buffer.byteLength(out));
} else {
  console.log('NOT WRITTEN — guard failed');
}

// ---------- verify pass ----------
console.log('\n===== VERIFY =====');
const raw2 = fs.readFileSync(path, 'utf8');
let vparsed = null;
try { vparsed = JSON.parse(raw2); } catch (e) { console.log('JSON.parse FAILED:', e.message); }
console.log('JSON valid:', !!vparsed, '| top array:', Array.isArray(vparsed), '| first char:', JSON.stringify(raw2.trim()[0]));
let allGone = true;
for (const [id, old, neu] of pairs) {
  const res = results.find(r => r.id === id);
  if (res.hits === 0) continue; // never replaced
  const cntOld = raw2.split(old).length - 1;
  const cntNew = raw2.split(neu).length - 1;
  if (cntOld !== 0) { allGone = false; console.log(`RESIDUAL ${id}: old still present x${cntOld}`); }
  if (cntNew < 1) { allGone = false; console.log(`MISSING-NEW ${id}: new not found`); }
}
console.log('residual scan:', allGone ? 'CLEAN (all replaced OLD gone, all NEW present)' : 'HAS ISSUES (see above)');
}
