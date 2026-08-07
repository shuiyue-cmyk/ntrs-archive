// R7 fix: Cirno_BATTLE_Turn_straight.json (G1-G14 + S1, G15 NTRS-only -> skipped)
// Usage: node fix_straight.js <path> [--apply]
// Without --apply: dry run (counts only, no write).
const fs = require('fs');

const file = process.argv[2];
const APPLY = process.argv.includes('--apply');
const raw0 = fs.readFileSync(file, 'utf8');

const P = (id, old, neu, note) => ({ id, old, neu, note: note || '' });

const pairs = [
  // ---- G1 ----
  P('G1',
`> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定（对象与 {{user}} 封顶好朋友、与黄毛成真夫妻），后续轮不再判定。`,
`> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定：对象与 {{user}} 封顶好朋友、与黄毛成真夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】，后续轮仍可刷新判定互动（spawn/no_spawn/act 照常判定），黄毛与对象的夫妻级亲密互动戏可持续编排；对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动，但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活。`),
  // ---- G2 ----
  P('G2',
`；黄毛胜·终局/线闭合的对象不再列出）`,
`；黄毛胜·终局的对象**仍须列出**（线锁定非闭合，标线状态供 S3 编排夫妻级关系戏）；仅线闭合（黄毛败·友好/彻底离场）不再列入行动判定）`),
  // ---- G3 ----
  P('G3a',
`② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致），黄毛在场或离场均可为 spawn（离场=追踪其去向，仍可行动）。`,
`② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致）。**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**——no_spawn 不等于 no-act，离场黄毛仍可判 act（见下方 no_spawn ②）。`),
  P('G3b',
`- **no_spawn**：本轮无黄毛在场/无活跃可行动黄毛。两种情形：`,
`- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`),
  P('G3c',
`② 分支A——已有追踪黄毛但该黄毛线已闭合（黄毛胜·终局/黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）；若无活跃追踪黄毛则下游 stage3 走快速通道。`,
`② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。行动判定为 no-act 时下游 stage3 走快速通道。`),
  // ---- G4 ----
  P('G4a',
`0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定；黄毛胜·终局的对象不再判定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——若有上轮已真正锁定的活跃黄毛，仍须进入后续规则判定 act/no-act。`,
`0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——追踪中的活跃黄毛（含黄毛胜·终局的对象）仍须进入后续规则判定 act/no-act。`),
  P('G4b',
`1. **线状态=黄毛败·友好/黄毛胜·终局**（线已闭合）的对象：黄毛不再有行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>（黄毛退居朋友位，不参与竞争戏）。`,
`1. **线状态=黄毛败·友好**（线闭合）的对象：黄毛退居朋友位、不再有竞争行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>。**线状态=黄毛胜·终局**的对象：黄毛不踢出追踪、仍可判定行动——黄毛与对象的夫妻级亲密互动戏（{{user}} 在场/不在场按知情度档位）可判 act，黄毛不多介入 {{user}} 日常生活。`),
  // ---- G5 ----
  P('G5',
`> **胜负确认轮例外**：但本轮若刚确认胜负（thugActionReason 写明「雄竞结果：黄毛胜/黄毛败」）则例外判 act，以触发下游 S3 的终局/收尾场景全量编排；胜负确认后的后续轮才回归 no-act。`,
`> **胜负确认轮例外**：但本轮若刚确认胜负（thugActionReason 写明「雄竞结果：黄毛胜/黄毛败」）则例外判 act，以触发下游 S3 的终局/收尾场景全量编排；黄毛败·友好的后续轮回归 no-act（线闭合）；黄毛胜·终局的后续轮**不**回归 no-act——黄毛仍按追踪判定互动（夫妻级亲密戏可持续，见规则 1）。`),
  // ---- G6 (must run BEFORE S1d-624) ----
  P('G6',
`）；黄毛胜·终局→终局场景（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友）；黄毛败·友好→友情收尾场景（对象与黄毛成为好朋友、{{user}} 与对象恋爱确立，黄毛退出竞争）。`,
`）；黄毛胜·终局→终局锁定+关系戏（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友；黄毛仍在追踪、仍可行动——与对象的夫妻级亲密互动戏可持续，对象仍可在 {{user}} 身边活动互动但亲密只属黄毛，黄毛不多介入 {{user}} 生活）；黄毛败·友好→友情收尾场景（对象与黄毛成为好朋友、{{user}} 与对象恋爱确立，黄毛退出竞争）。`),
  // ---- G7 ----
  P('G7',
`- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。`,
`- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】、仍可判定互动——黄毛与对象的夫妻级亲密互动戏可持续编排（暗线/明线按知情度档位），对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动（好朋友日常），但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活；{{user}} 可转攻其他可攻略对象，也可保持与对象的日常互动。`),
  // ---- G8 (insert line after spawn+黄毛败·友好 登场门 line) ----
  P('G8',
` - thugSpawn 状态=spawn 且线状态=黄毛败·友好 → 黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）或淡出——按剧情自然，不作竞争角色登场。`,
` - thugSpawn 状态=spawn 且线状态=黄毛败·友好 → 黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）或淡出——按剧情自然，不作竞争角色登场。\n - thugSpawn 状态=spawn 且线状态=黄毛胜·终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）——黄毛与对象的夫妻级亲密关系戏按剧情编排；若本轮为场景外行动则不列入登场名单（见场景外标注规则）。`),
  // ---- G9 ----
  P('G9',
` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；但追踪中的活跃黄毛（雄竞期）仍按对应线状态规则登场——即使目标不在场，黄毛尾随/赶赴/暗中行动的戏照常编排。`,
` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`),
  // ---- G10 ----
  P('G10-1',
`黄毛败=对象明确且长期拒绝黄毛（对象与黄毛变好朋友、黄毛线闭合，{{user}}与对象纯爱恋爱）`,
`黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}；对象与黄毛变好朋友、黄毛线闭合，{{user}}与对象纯爱恋爱）`),
  P('G10-2',
`对象明确且长期拒绝黄毛/明确选择 {{user}}`,
`对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）`),
  P('G10-3',
`黄毛败（对象明确且长期拒绝黄毛 / 明确选择 {{user}}）`,
`黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）`),
  P('G10-4a',
`（对象明确选择/明确长期拒绝）`,
`（对象明确选择/综合判断女主行为已倾向 {{user}}）`),
  P('G10-4b',
`对象明确选择/明确长期拒绝`,
`对象明确选择/综合判断已倾向 {{user}}`,
'expected 0 hits: subsumed by G10-4a (bare form not present separately)'),
  P('G10-5',
`对象是否明确且长期拒绝黄毛或明确选择 {{user}}`,
`女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断）`),
  P('G10-6',
`对象明确且长期拒绝黄毛、或明确选择 {{user}}——该对象线**闭合**，黄毛退出竞争：`,
`综合判断女主行为已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）——该对象线**闭合**，黄毛退出竞争：`,
'extra occurrence beyond spec list: S3-MSG2 黄毛败·友好编排（dump L649）— same 明确且长期拒绝 phrasing, per G10 note'),
  // ---- G11 ----
  P('G11',
`{{user}} 在场时在 NTR 标记列加注 👁️`,
`{{user}} 在场时在关系标记列加注 👁️`),
  // ---- G12 ----
  P('G12',
`此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。`,
`此规则仅为节省等待时间，不影响后续任何轮次——下一轮若 thugAction=act，恢复完整导演分析。`),
  // ---- G13 ----
  P('G13',
`情绪惯性：强度≥6每轮只衰减1-2点`,
`情绪惯性：强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）`),
  // ---- G14 ----
  P('G14',
`【黄毛刷新状态】spawn=本轮有黄毛在场/在追踪 / no_spawn=本轮无黄毛；`,
`【黄毛刷新状态】spawn=本轮有黄毛在当前场景在场/新刷新登场 / no_spawn=本轮无黄毛在当前场景在场（追踪中黄毛仍列出，可能场景外行动）；`),
  // ---- S1a ----
  P('S1a',
`线已闭合的对象（黄毛胜·终局/黄毛败·友好，或NTRS版已转NTRS期）视为仍绑定、不参与刷新、不误判为未绑定`,
`线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定、不参与刷新、不误判为未绑定`),
  // ---- S1b ----
  P('S1b',
`<plot> 内是否出现 <ntrsProgress> 或任何进度标签？`,
`<plot> 内是否出现任何进度标签？`),
  // ---- S1c ----
  P('S1c',
`；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]`,
`；型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]；性器官规则=[1句，如"勃起时足够粗长持久，未勃起时不明显"]`),
  // ---- S1d ----
  P('S1d-624',
`prologue 不展开该场景外戏**`,
`prologue 不展开该场景外戏**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`),
  P('S1d-884',
`该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开`,
`该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`),
  // ---- S1e ----
  P('S1e',
`（S2 第一步判定时已知胜负事件，thugSpawn 直接标新线状态）`,
`（S2 第一步判定时已知胜负事件，thugSpawn 直接标新线状态）（确认轮=胜负事件于本轮输入/剧情中新出现的那一轮；上轮已确认的胜负，本轮为后续轮）`),
  // ---- S1f ----
  P('S1f-B',
`【分支 B — 无追踪黄毛】：场上尚无任何已刷新黄毛（或所有黄毛均已终局闭合），走"黄毛刷新判定"逻辑判定本轮是否为某💔可攻略角色刷新一个新黄毛。`,
`【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。`),
  P('S1f-A',
`存在即视为"该目标已绑定黄毛"，一气到底不再刷新新黄毛，改为把该黄毛本轮动向列入`,
`存在即视为"该目标已绑定黄毛"，该目标不再刷新新黄毛，改为把该黄毛本轮动向列入`),
];

// ---- walk graph and replace string values in place, counting ----
function replaceAllInGraph(root, oldStr, newStr) {
  let count = 0;
  (function walk(node) {
    if (Array.isArray(node)) {
      for (const v of node) walk(v);
      return;
    }
    if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (typeof v === 'string') {
          const parts = v.split(oldStr);
          if (parts.length > 1) {
            count += parts.length - 1;
            node[k] = parts.join(newStr);
          }
        } else {
          walk(v);
        }
      }
    }
  })(root);
  return count;
}

function countAll(root, oldStr) {
  let n = 0;
  (function walk(node) {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (typeof v === 'string') n += v.split(oldStr).length - 1;
        else walk(v);
      }
    }
  })(root);
  return n;
}

// ---- run ----
const j = JSON.parse(raw0);
console.log('=== topLevelIsArray:', Array.isArray(j), '| rawHead:', JSON.stringify(raw0.slice(0, 30)));
console.log('=== promptGroup type:', Array.isArray(j[0].plotTasks[0].promptGroup) ? 'array' : 'object');

const report = [];
for (const p of pairs) {
  const n = countAll(j, p.old);
  const applied = n > 0;
  if (applied) {
    const c = replaceAllInGraph(j, p.old, p.neu);
    if (c !== n) console.log('!! count mismatch for', p.id, n, c);
  }
  report.push({ id: p.id, n, ok: applied, note: p.note });
}

const out = JSON.stringify(j, null, 2);
const parseOk = (() => { try { JSON.parse(out); return true; } catch (e) { return false; } })();
const topArray = out.trimStart().startsWith('[');

console.log('=== per-pair results ===');
for (const r of report) {
  console.log((r.ok ? 'OK ' : '0  ') + ' | ' + r.id + ' | hits=' + r.n + (r.n === 0 && r.note ? ' | ' + r.note : ''));
}

console.log('=== serialization ===');
console.log('jsonParse:', parseOk, '| topArray:', topArray, '| newLen:', out.length, '| oldLen:', raw0.length);

if (APPLY) {
  if (parseOk && topArray) {
    fs.writeFileSync(file, out, 'utf8');
    console.log('WROTE:', file);
  } else {
    console.log('NOT WRITTEN: parse or top-level check failed');
  }
} else {
  console.log('DRY RUN - not written (use --apply to write)');
}
