// R7 fix script — Cirno_BATTLE_Turn_FT_NTRS.json
// Applies G1..G15 (all NTRS-applicable) + S5 (FT_NTRS) string replacements.
// OLD texts copied byte-for-byte from review_dump/Cirno_BATTLE_Turn_FT_NTRS.txt.
const fs = require('fs');

const JSON_PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';

const pairs = [
  // ---------- G1..G15 ----------
  ['G1', `> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定（对象与 {{user}} 封顶好朋友、与黄毛成真夫妻），后续轮不再判定。`,
        `> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定：对象与 {{user}} 封顶好朋友、与黄毛成真夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】，后续轮仍可刷新判定互动（spawn/no_spawn/act 照常判定），黄毛与对象的夫妻级亲密互动戏可持续编排；对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动，但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活。`],

  ['G2', `；黄毛胜·终局/线闭合的对象不再列出）`,
        `；黄毛胜·终局的对象**仍须列出**（线锁定非闭合，标线状态供 S3 编排夫妻级关系戏）；仅线闭合（黄毛败·友好/彻底离场）不再列入行动判定）`],

  ['G3a', `② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致），黄毛在场或离场均可为 spawn（离场=追踪其去向，仍可行动）。`,
          `② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致）。**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**——no_spawn 不等于 no-act，离场黄毛仍可判 act（见下方 no_spawn ②）。`],

  ['G3b', `- **no_spawn**：本轮无黄毛在场/无活跃可行动黄毛。两种情形：`,
          `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`],

  ['G3c', `② 分支A——已有追踪黄毛但该黄毛线已闭合（黄毛胜·终局）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）；若无活跃追踪黄毛则下游 stage3 走快速通道。`,
          `② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`],

  ['G4a', `0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定；黄毛胜·终局的对象不再判定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——若有上轮已真正锁定的活跃黄毛，仍须进入后续规则判定 act/no-act。`,
          `0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——追踪中的活跃黄毛（含黄毛胜·终局的对象）仍须进入后续规则判定 act/no-act。`],

  ['G4b', `1. **线状态=黄毛败·友好/黄毛胜·终局**（线已闭合）的对象：黄毛不再有行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>（黄毛退居朋友位，不参与竞争戏）。`,
          `1. **线状态=黄毛败·友好**（线闭合）的对象：黄毛退居朋友位、不再有竞争行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>。**线状态=黄毛胜·终局**的对象：黄毛不踢出追踪、仍可判定行动——黄毛与对象的夫妻级亲密互动戏（{{user}} 在场/不在场按知情度档位）可判 act，黄毛不多介入 {{user}} 日常生活。`],

  ['G5', `**但本轮若刚确认胜负（thugActionReason 写明雄竞结果：黄毛胜/黄毛败）则例外判 act，以触发下游 S3 的终局场景全量编排；胜负确认后的后续轮才回归 no-act。**`,
          `**但本轮若刚确认胜负（thugActionReason 写明雄竞结果：黄毛胜/黄毛败）则例外判 act，以触发下游 S3 的终局/收尾场景全量编排；黄毛败（转 NTRS期）的后续轮按 NTRS 期判定逻辑正常判定（淫妻线推进），不回归 no-act；黄毛胜·终局的后续轮**不**回归 no-act——黄毛仍按追踪判定互动（夫妻级亲密戏可持续，见规则 1）。**`],

  ['S5e', `以触发下游 S3 的终局/收尾场景全量编排；黄毛败（转 NTRS期）的后续轮`,
          `以触发下游 S3 的终局/收尾场景全量编排（若逻辑无硬伤门严重不成立——黄毛与对象天各一方且无任何近身契机——则不例外，仍判 no-act 待更合理时机）；黄毛败（转 NTRS期）的后续轮`],

  ['G6', `黄毛胜·终局→终局场景（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友）`,
          `黄毛胜·终局→终局锁定+关系戏（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友；黄毛仍在追踪、仍可行动——与对象的夫妻级亲密互动戏可持续，对象仍可在 {{user}} 身边活动互动但亲密只属黄毛，黄毛不多介入 {{user}} 生活）`],

  ['G7', `- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。`,
          `- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】、仍可判定互动——黄毛与对象的夫妻级亲密互动戏可持续编排（暗线/明线按知情度档位），对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动（好朋友日常），但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活；{{user}} 可转攻其他可攻略对象，也可保持与对象的日常互动。`],

  ['G8', ` - thugSpawn 状态=no_spawn →`,
          ` - thugSpawn 状态=spawn 且线状态=黄毛胜·终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）——黄毛与对象的夫妻级亲密关系戏按剧情编排；若本轮为场景外行动则不列入登场名单（见场景外标注规则）。\n - thugSpawn 状态=no_spawn →`],

  ['G9', ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；但追踪中的活跃黄毛（雄竞期/NTRS期）仍按对应线状态规则登场——即使目标不在场，黄毛尾随/赶赴/暗中行动的戏照常编排。`,
          ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`],

  ['G10.1', `黄毛败=对象明确且长期拒绝黄毛/明确选择{{user}}`,
            `黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）`],

  ['G10.2', `对象明确且长期拒绝黄毛/明确选择 {{user}}`,
            `对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）`],

  ['G10.3', `黄毛败（对象明确且长期拒绝黄毛 / 明确选择 {{user}}）`,
            `黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）`],

  ['G10.4', `（对象明确选择/明确长期拒绝）`,
            `（对象明确选择/综合判断女主行为已倾向 {{user}}）`],

  ['G10.5', `对象是否明确且长期拒绝黄毛或明确选择 {{user}}`,
            `女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断）`],

  ['G11', `{{user}} 在场时在 NTR 标记列加注 👁️`,
          `{{user}} 在场时在关系标记列加注 👁️`],

  ['G12', `此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。`,
          `此规则仅为节省等待时间，不影响后续任何轮次——下一轮若 thugAction=act，恢复完整导演分析。`],

  ['G13', `情绪惯性：强度≥6每轮只衰减1-2点`,
          `情绪惯性：强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）`],

  ['G14', `【黄毛刷新状态】spawn=本轮有黄毛在场/在追踪 / no_spawn=本轮无黄毛；`,
          `【黄毛刷新状态】spawn=本轮有黄毛在当前场景在场/新刷新登场 / no_spawn=本轮无黄毛在当前场景在场（追踪中黄毛仍列出，可能场景外行动）；`],

  ['G15b', `本轮查询数据库表格获取黄毛档案权威数据（黄毛表为型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘），配合 <thugSpawn> 追踪区块使用：
本轮查询数据库表格获取权威数据（黄毛表为黄毛条目/型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：`,
           `本轮查询数据库表格获取黄毛档案数据（黄毛表为型体设定/性器官规则/NTRS期进度；重要角色表为登场角色设定；NTRS备忘录为长期备忘），仅作设定/人设参考，配合 <thugSpawn> 追踪区块使用——运行期线状态/锁定/型体概要/性器官规则以追踪区块与历史刷新记录为准，不从前文猜、不查表判断状态：`],

  ['G15a', `本轮查询数据库表格获取权威数据，并配合黄毛追踪机制使用：
- **表格为权威源**：黄毛表（锁定对象/lock_status/进度条/型体设定/性别类型/五型）、重要角色表（登场角色设定）、NTRS备忘录（长期备忘）——查表判断已有黄毛与沿用设定；
- **黄毛动向追踪为跨轮状态补充**：每轮把场上每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）、线状态（雄竞期/NTRS期/黄毛胜·终局）写进 <thugSpawn> 的【黄毛动向追踪】区块。**目标离场不意味着黄毛停摆**：黄毛可尾随/赶赴/潜伏接近目标所在处继续行动。
本轮查询数据库表格获取权威数据（黄毛表为黄毛条目/型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：`,
           `本轮查询数据库表格获取黄毛档案数据（黄毛表为型体设定/性器官规则/NTRS期进度；重要角色表为登场角色设定；NTRS备忘录为长期备忘），仅作设定/人设参考，不用于判断已有黄毛：
- **黄毛动向追踪为跨轮状态权威**：每轮把场上每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）、线状态（雄竞期/NTRS期/黄毛胜·终局）写进 <thugSpawn> 的【黄毛动向追踪】区块——**已有黄毛、锁定与线状态一律以追踪区块为准，不查表判断**。**目标离场不意味着黄毛停摆**：黄毛可尾随/赶赴/潜伏接近目标所在处继续行动。`],

  // ---------- S5 (FT_NTRS) ----------
  ['S5d', `① 分支B——无未绑定黄毛的💔目标（无💔角色 / 所有💔角色均已绑定黄毛）`,
          `① 分支B——无未绑定黄毛的💔目标（无💔角色）；所有💔角色均已绑定黄毛 → 归分支A 按追踪判定`],

  ['S5f', `标签紧接在</sparkNotes>后`,
          `<thugSpawn> 标签紧接在 </sparkNotes> 后`],

  ['S5g', `推波助澜从「半明示」层级起步（察觉型前后）`,
          `推波助澜从「半明示」层级起步`],

  ['S5h', `（假小子为女性身体，型体概要按女体描述）]`,
          `（假小子为女性身体，型体概要按女体描述）]（型体概要=表格中的型体设定）`],
];

function collectSlots(j) {
  const slots = [];
  for (const task of j[0].plotTasks) {
    if (typeof task.description === 'string') {
      slots.push({ name: task.id + '.description', get: () => task.description, set: (v) => { task.description = v; } });
    }
    const pg = task.promptGroup || {};
    for (const k of Object.keys(pg)) {
      const msg = pg[k];
      if (msg && typeof msg.content === 'string') {
        slots.push({ name: task.id + '.promptGroup[' + k + ']', get: () => msg.content, set: (v) => { msg.content = v; } });
      }
    }
  }
  if (typeof j[0].finalSystemDirective === 'string') {
    slots.push({ name: 'finalSystemDirective', get: () => j[0].finalSystemDirective, set: (v) => { j[0].finalSystemDirective = v; } });
  }
  return slots;
}

// ---------- PASS 1: apply ----------
let j = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const slots = collectSlots(j);
const report = [];
for (const [id, oldS, newS] of pairs) {
  let total = 0;
  for (const s of slots) {
    const v = s.get();
    const n = v.split(oldS).length - 1;
    if (n > 0) {
      total += n;
      s.set(v.split(oldS).join(newS));
    }
  }
  report.push({ id, hits: total });
}

// ---------- write-back guard ----------
let out = JSON.stringify(j, null, 2);
let parseOk = true;
try { JSON.parse(out); } catch (e) { parseOk = false; }
const startsWithArray = out.trimStart().startsWith('[');

if (parseOk && startsWithArray) {
  fs.writeFileSync(JSON_PATH, out, 'utf8');
  console.log('WROTE OK');
} else {
  console.log('WRITE BLOCKED parseOk=' + parseOk + ' startsWithArray=' + startsWithArray);
}

// ---------- PASS 2: verify from disk ----------
const reread = fs.readFileSync(JSON_PATH, 'utf8');
let vj = null;
let vParseOk = true;
try { vj = JSON.parse(reread); } catch (e) { vParseOk = false; }
const firstChar = reread.trimStart()[0];
console.log('VERIFY: parseOk=' + vParseOk + ' firstNonSpaceChar=' + JSON.stringify(firstChar) + ' topLevelArray=' + Array.isArray(vj));

// residual scan
const vSlots = vj ? collectSlots(vj) : [];
const joined = vSlots.map((s) => s.get()).join('\n');
console.log('--- per-pair hit report ---');
for (const r of report) {
  const residual = joined.includes(pairs.find((p) => p[0] === r.id)[1]) ? 'RESIDUAL!' : 'clean';
  console.log(r.id + ' hits=' + r.hits + ' ' + (r.hits > 0 ? residual : ''));
}

// extra sanity: NEW texts present
for (const [id, , newS] of pairs) {
  if (report.find((r) => r.id === id).hits > 0) {
    const present = joined.includes(newS);
    if (!present) console.log('MISSING NEW for ' + id);
  }
}
console.log('DONE');
