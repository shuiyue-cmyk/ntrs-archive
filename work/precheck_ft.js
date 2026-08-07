const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const root = j[0];

const targets = [];
for (const task of root.plotTasks) {
  if (typeof task.description === 'string') targets.push(task.description);
  if (typeof task.finalDirectiveTemplate === 'string') targets.push(task.finalDirectiveTemplate);
  const pg = task.promptGroup;
  if (pg && typeof pg === 'object') {
    for (const k of Object.keys(pg)) {
      if (pg[k] && typeof pg[k].content === 'string') targets.push(pg[k].content);
    }
  }
}
if (typeof root.finalSystemDirective === 'string') targets.push(root.finalSystemDirective);

const raw = fs.readFileSync(path, 'utf8');

const olds = {
  G1: `> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线终局锁定（对象与 {{user}} 封顶好朋友、与黄毛成真夫妻），后续轮不再判定。`,
  G2: `；黄毛胜·终局的对象不再列出；**黄毛败·友好（男娘系天意待触发）仍须列出**，标「天意待触发」供 S3 编排投怀戏）`,
  G3a: `  ② 分支A——已有追踪黄毛（该目标已绑定黄毛），本轮把该黄毛动向列入【黄毛动向追踪】（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致），黄毛在场或离场均可为 spawn（离场=追踪其去向，仍可行动）。`,
  G3b: `- **no_spawn**：本轮无黄毛在场/无活跃可行动黄毛。两种情形：`,
  G3c: `  ② 分支A——已有追踪黄毛但该黄毛线已闭合（黄毛胜·终局）或黄毛彻底离场再无行动可能（如黄毛远走他乡且无尾随目标途径）；**男娘系黄毛败·友好（天意待触发）不算彻底闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，判 spawn 并推进投怀戏**；若无活跃追踪黄毛则下游 stage3 走快速通道。`,
  G4a: `0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定；黄毛胜·终局的对象不再判定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——若有上轮已真正锁定的活跃黄毛，仍须进入后续规则判定 act/no-act。`,
  G4b: `1b. **线状态=黄毛胜·终局**（线已闭合）的对象：黄毛不再有行动判定——此类对象本轮一律 <thugAction>no-act</thugAction>（黄毛胜后成婚，不参与竞争戏）。`,
  G5: `> **胜负确认轮例外**：但本轮若刚确认胜负（thugActionReason 写明「雄竞结果：黄毛胜」）则例外判 act，以触发下游 S3 的终局场景全量编排；胜负确认后的后续轮才回归 no-act。`,
  G6a: `黄毛胜·终局→终局场景（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友）`,
  G6b: `黄毛败·友好→友情收尾场景（对象与黄毛成为好朋友、{{user}} 与对象恋爱确立，黄毛退出竞争）`,
  G7: `- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。`,
  G8: ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场`,
  G9: ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；但追踪中的活跃黄毛（雄竞期）仍按对应线状态规则登场——即使目标不在场，黄毛尾随/赶赴/暗中行动的戏照常编排。`,
  G10_1: `黄毛败=对象明确且长期拒绝黄毛`,
  G10_2: `对象明确且长期拒绝黄毛/明确选择 {{user}}`,
  G10_3: `黄毛败（对象明确且长期拒绝黄毛 / 明确选择 {{user}}）`,
  G10_4: `（对象明确选择/明确长期拒绝）`,
  G10_5: `对象是否明确且长期拒绝黄毛或明确选择 {{user}}`,
  G11: `{{user}} 在场时在 NTR 标记列加注 👁️`,
  G12: `此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。`,
  G13: `- 情绪惯性：强度≥6每轮只衰减1-2点`,
  G14: `【黄毛刷新状态】spawn=本轮有黄毛在场/在追踪 / no_spawn=本轮无黄毛；`,
  S2d: `或淡出——按剧情自然，不作竞争角色登场。`,
  S2e: `男娘系黄毛（本版全部黄毛均为伪娘/药娘/假小子）`,
  S2f: `Log：仅一行「no-act，快速通道输出」（本版无进度标签，不涉及进度省略）`,
  S2h1: `存在即视为"该目标已绑定黄毛"，一气到底不再刷新新黄毛，改为把该黄毛本轮动向列入`,
  S2h2: `【分支 B — 无追踪黄毛】：场上尚无任何已刷新黄毛（或所有黄毛均已终局闭合），走"黄毛刷新判定"逻辑判定本轮是否为某💔可攻略角色刷新一个新黄毛。`,
};

for (const [id, old] of Object.entries(olds)) {
  const inTargets = targets.reduce((n, s) => n + (s.split(old).length - 1), 0);
  const inRaw = raw.split(old).length - 1;
  console.log(`${id}: targets=${inTargets} rawFile=${inRaw}`);
}
