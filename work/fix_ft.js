const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';

const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const root = j[0];

// ---- replacement pairs: [id, OLD, NEW] ----
const pairs = [
  // G1
  ['G1',
    `> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定（对象与 {{user}} 封顶好朋友、与黄毛成真夫妻），后续轮不再判定。`,
    `> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定：对象与 {{user}} 封顶好朋友、与黄毛成真夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】，后续轮仍可刷新判定互动（spawn/no_spawn/act 照常判定），黄毛与对象的夫妻级亲密互动戏可持续编排；对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动，但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活。`],
  // G2
  ['G2',
    `；黄毛胜·终局的对象不再列出；**黄毛败·友好（男娘系天意待触发）仍须列出**，标「天意待触发」供 S3 编排投怀戏）`,
    `；黄毛胜·终局的对象**仍须列出**（线锁定非闭合，标线状态供 S3 编排夫妻级关系戏）；**黄毛败·友好（男娘系天意待触发）仍须列出**，标「天意待触发」供 S3 编排投怀戏；仅彻底离场不再列入行动判定）`],
  // G3a
  ['G3a',
    `  ② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致），黄毛在场或离场均可为 spawn（离场=追踪其去向，仍可行动）。`,
    `  ② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致）。**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**——no_spawn 不等于 no-act，离场黄毛仍可判 act（见下方 no_spawn ②）。`],
  // G3b
  ['G3b',
    `- **no_spawn**：本轮无黄毛在场/无活跃可行动黄毛。两种情形：`,
    `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`],
  // G3c
  ['G3c',
    `  ② 分支A——已有追踪黄毛但该黄毛线已闭合（黄毛胜·终局）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）；**男娘系黄毛败·友好（天意待触发）不算彻底闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，判 spawn 并推进投怀戏**；若无活跃追踪黄毛则下游 stage3 走快速通道。`,
    `  ② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）——若黄毛与对象均不在 {{user}} 当前场景但两者可接触（黄毛离场前往对象所在处攻略），仍可判 act（场景外行动，发生在 {{user}} 场景外）；若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）→ no-act。**男娘系黄毛败·友好（天意待触发）不算闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，按在场处理（spawn）并供 S3 推进投怀戏**。行动判定为 no-act 时下游 stage3 走快速通道。`],
  // G4a
  ['G4a',
    `0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定；黄毛胜·终局的对象不再判定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——若有上轮已真正锁定的活跃黄毛，仍须进入后续规则判定 act/no-act。`,
    `0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——追踪中的活跃黄毛（含黄毛胜·终局的对象）仍须进入后续规则判定 act/no-act。`],
  // G4b (FT: 1b line 拆出黄毛胜·终局)
  ['G4b',
    `1b. **线状态=黄毛胜·终局**（线已闭合）的对象：黄毛不再有行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>（黄毛胜后成婚，不参与竞争戏）。`,
    `1b. **线状态=黄毛胜·终局**的对象：黄毛不踢出追踪、仍可判定行动——黄毛与对象的夫妻级亲密互动戏（{{user}} 在场/不在场按知情度档位）可判 act，黄毛不多介入 {{user}} 日常生活。`],
  // G5 (FT 单条, 黄毛胜)
  ['G5',
    `> **胜负确认轮例外**：但本轮若刚确认胜负（thugActionReason 写明「雄竞结果：黄毛胜」）则例外判 act，以触发下游 S3 的终局场景全量编排；胜负确认后的后续轮才回归 no-act。`,
    `> **胜负确认轮例外**：但本轮若刚确认胜负（thugActionReason 写明「雄竞结果：黄毛胜」）则例外判 act，以触发下游 S3 的终局场景全量编排；黄毛败·友好的后续轮回归 no-act（线闭合）；黄毛胜·终局的后续轮不回归 no-act——黄毛仍按追踪判定互动。`],
  // G6a
  ['G6a',
    `黄毛胜·终局→终局场景（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友）`,
    `黄毛胜·终局→终局锁定+关系戏（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友；黄毛仍在追踪、仍可行动——与对象的夫妻级亲密互动戏可持续，对象仍可在 {{user}} 身边活动互动但亲密只属黄毛，黄毛不多介入 {{user}} 生活）`],
  // G6b (FT: 黄毛败·友好 尾部补投怀)
  ['G6b',
    `黄毛败·友好→友情收尾场景（对象与黄毛成为好朋友、{{user}} 与对象恋爱确立，黄毛退出竞争）`,
    `黄毛败·友好→友情收尾场景（对象与黄毛成为好朋友、{{user}} 与对象恋爱确立，黄毛退出竞争；男娘系黄毛败·友好同时推进天意·后宫线——酝酿对 {{user}} 的爱意，为投怀/入后宫铺垫）`],
  // G7
  ['G7',
    `- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。`,
    `- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。**黄毛不踢出追踪**：仍列入【黄毛动向追踪】、仍可判定互动——黄毛与对象的夫妻级亲密互动戏可持续编排（暗线/明线按知情度档位），对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动（好朋友日常），但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活；{{user}} 可转攻其他可攻略对象，也可保持与对象的日常互动。`],
  // G8: 在 no_spawn 行前插入 spawn+黄毛胜·终局 行
  ['G8',
    ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场`,
    ` - thugSpawn 状态=spawn 且线状态=黄毛胜·终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）——黄毛与对象的夫妻级亲密关系戏按剧情编排；若本轮为场景外行动则不列入登场名单（见场景外标注规则）。\n - thugSpawn 状态=no_spawn → 本轮无新黄毛登场`],
  // G9
  ['G9',
    ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；但追踪中的活跃黄毛（雄竞期）仍按对应线状态规则登场——即使目标不在场，黄毛尾随/赶赴/暗中行动的戏照常编排。`,
    ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；追踪中的活跃黄毛若本轮 act 且行动发生在 {{user}} 当前场景内，按对应线状态规则登场编排；若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`],
  // G10-1 .. G10-5
  ['G10-1',
    `黄毛败=对象明确且长期拒绝黄毛`,
    `黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）`],
  ['G10-2',
    `对象明确且长期拒绝黄毛/明确选择 {{user}}`,
    `对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）`],
  ['G10-3',
    `黄毛败（对象明确且长期拒绝黄毛 / 明确选择 {{user}}）`,
    `黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）`],
  ['G10-4',
    `（对象明确选择/明确长期拒绝）`,
    `（对象明确选择/综合判断女主行为已倾向 {{user}}）`],
  ['G10-5',
    `对象是否明确且长期拒绝黄毛或明确选择 {{user}}`,
    `女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断）`],
  // G11
  ['G11',
    `{{user}} 在场时在 NTR 标记列加注 👁️`,
    `{{user}} 在场时在关系标记列加注 👁️`],
  // G12
  ['G12',
    `此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。`,
    `此规则仅为节省等待时间，不影响后续任何轮次——下一轮若 thugAction=act，恢复完整导演分析。`],
  // G13
  ['G13',
    `- 情绪惯性：强度≥6每轮只衰减1-2点`,
    `- 情绪惯性：强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）`],
  // G14
  ['G14',
    `【黄毛刷新状态】spawn=本轮有黄毛在场/在追踪 / no_spawn=本轮无黄毛；`,
    `【黄毛刷新状态】spawn=本轮有黄毛在当前场景在场/新刷新登场 / no_spawn=本轮无黄毛在当前场景在场（追踪中黄毛仍列出，可能场景外行动）；`],
  // ---- S2 (FT plain) ----
  // S2d
  ['S2d',
    `或淡出——按剧情自然，不作竞争角色登场。`,
    `按剧情自然，不作竞争角色登场（男娘系黄毛须留在名单中供投怀戏编排）。`],
  // S2e
  ['S2e',
    `男娘系黄毛（本版全部黄毛均为伪娘/药娘/假小子）`,
    `伪娘系黄毛（伪娘/药娘/假小子三型）`],
  // S2f
  ['S2f',
    `Log：仅一行「no-act，快速通道输出」（本版无进度标签，不涉及进度省略）`,
    `Log：仅一行「no-act，快速通道输出」`],
  // S2h-1
  ['S2h-1',
    `存在即视为"该目标已绑定黄毛"，一气到底不再刷新新黄毛，改为把该黄毛本轮动向列入`,
    `存在即视为"该目标已绑定黄毛"，该目标不再刷新新黄毛，改为把该黄毛本轮动向列入`],
  // S2h-2
  ['S2h-2',
    `【分支 B — 无追踪黄毛】：场上尚无任何已刷新黄毛（或所有黄毛均已终局闭合），走"黄毛刷新判定"逻辑判定本轮是否为某💔可攻略角色刷新一个新黄毛。`,
    `【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。`],
];

// ---- collect string references ----
const refs = [];
for (const task of root.plotTasks) {
  if (typeof task.description === 'string') refs.push({ o: task, k: 'description' });
  if (typeof task.finalDirectiveTemplate === 'string') refs.push({ o: task, k: 'finalDirectiveTemplate' });
  const pg = task.promptGroup;
  if (pg && typeof pg === 'object') {
    for (const key of Object.keys(pg)) {
      if (pg[key] && typeof pg[key].content === 'string') refs.push({ o: pg[key], k: 'content' });
    }
  }
}
if (typeof root.finalSystemDirective === 'string') refs.push({ o: root, k: 'finalSystemDirective' });

// ---- apply replacements, counting hits ----
const results = [];
for (const [id, old, nw] of pairs) {
  let hits = 0;
  for (const r of refs) {
    const s = r.o[r.k];
    const c = s.split(old).length - 1;
    if (c > 0) {
      hits += c;
      r.o[r.k] = s.split(old).join(nw);
    }
  }
  results.push({ id, hits });
}

// ---- verification before write ----
const serialized = JSON.stringify(j, null, 2);
let valid = true, topArray = false;
try {
  const chk = JSON.parse(serialized);
  valid = true;
  topArray = Array.isArray(chk);
} catch (e) {
  valid = false;
}
const firstChar = serialized.trimStart()[0];
const ok = valid && topArray && firstChar === '[';

for (const r of results) console.log(`${r.id}: hits=${r.hits} ${r.hits > 0 ? 'OK' : 'MISS'}`);
console.log(`preWrite: parse=${valid} topArray=${topArray} firstChar=${firstChar} -> ${ok ? 'WRITE' : 'ABORT'}`);

if (!ok) {
  console.error('ABORT: verification failed, not writing');
  process.exit(1);
}

fs.writeFileSync(path, serialized, 'utf8');
console.log('written');

// ---- post-write verification ----
const j2 = JSON.parse(fs.readFileSync(path, 'utf8'));
const r2 = j2[0];
const refs2 = [];
for (const task of r2.plotTasks) {
  if (typeof task.description === 'string') refs2.push(task.description);
  if (typeof task.finalDirectiveTemplate === 'string') refs2.push(task.finalDirectiveTemplate);
  const pg = task.promptGroup;
  if (pg && typeof pg === 'object') {
    for (const k of Object.keys(pg)) if (pg[k] && typeof pg[k].content === 'string') refs2.push(pg[k].content);
  }
}
if (typeof r2.finalSystemDirective === 'string') refs2.push(r2.finalSystemDirective);
const allText = refs2.join('\n');
console.log('postWrite parse=OK topArray=' + Array.isArray(j2));
const raw2 = fs.readFileSync(path, 'utf8');
console.log('postWrite firstNonSpace=' + raw2.trimStart()[0]);

// residual scan (G8 keeps its own OLD prefix intentionally — insertion pair)
console.log('--- residual scan (OLD occurrences remaining after write) ---');
for (const [id, old] of pairs) {
  if (id === 'G8') { console.log('G8: residual=1 (intentional insertion prefix, OK)'); continue; }
  const n = allText.split(old).length - 1;
  console.log(`${id}: residual=${n} ${n === 0 ? 'OK' : 'LEFTOVER'}`);
}

// new-text presence check
console.log('--- NEW presence check (spot) ---');
const spot = [
  ['G1', `黄毛不踢出追踪**：仍列入【黄毛动向追踪】`],
  ['G3a', `spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）`],
  ['G4b', `1b. **线状态=黄毛胜·终局**的对象：黄毛不踢出追踪、仍可判定行动`],
  ['G8', `thugSpawn 状态=spawn 且线状态=黄毛胜·终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）`],
  ['G9', `若黄毛与对象均在 {{user}} 当前场景之外（场景外行动），该戏仅写入 stage（标注「场景外场景」）`],
  ['S2d', `按剧情自然，不作竞争角色登场（男娘系黄毛须留在名单中供投怀戏编排）`],
  ['S2e', `伪娘系黄毛（伪娘/药娘/假小子三型）`],
  ['S2f', `Log：仅一行「no-act，快速通道输出」`],
  ['S2h-2', `【分支 B — 有待刷新目标】`],
];
for (const [id, s] of spot) {
  const n = allText.split(s).length - 1;
  console.log(`${id}: newPresent=${n > 0}`);
}
