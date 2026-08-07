// T41: 综合改造——黄毛败判定去数值化 / 黄毛未spawn可行动 / 快速通道废止 / stage3场景外标注
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const battle = ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json', 'Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
const ntrs12 = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
const all = [...battle, ...ntrs12];
const results = [];

// ===== 替换1【黄毛败判定去数值化，BATTLE六版】S2-MSG0 =====
const BATTLE_M0_LOSS = [
  [' - **黄毛败**：对象在剧情中**明确且长期拒绝黄毛**（明确拒绝黄毛 ≥2 次、或长期保持拒绝态度/划清界限、或明确选择 {{user}} 并确立关系）→ 判定「雄竞结果：黄毛败」，该对象线**闭合（黄毛败·友好）**',
   ' - **黄毛败**：**由你综合判断女主的行为是否选择了 {{user}}**——观察女主对两人的态度、行为方式和说过的话（如主动亲近/依赖/维护 {{user}}、对黄毛的接近保持距离/冷淡/婉拒、关键抉择时倾向 {{user}} 等）→ 判定「雄竞结果：黄毛败」，该对象线**闭合（黄毛败·友好）**'],
  [' - **黄毛败**：对象在剧情中**明确且长期拒绝黄毛**（明确拒绝黄毛 ≥2 次、或长期保持拒绝态度/划清界限、或明确选择 {{user}} 并确立关系）→ 判定「雄竞结果：黄毛败」，该对象线转入 **NTRS 期**',
   ' - **黄毛败**：**由你综合判断女主的行为是否选择了 {{user}}**——观察女主对两人的态度、行为方式和说过的话（如主动亲近/依赖/维护 {{user}}、对黄毛的接近保持距离/冷淡/婉拒、关键抉择时倾向 {{user}} 等）→ 判定「雄竞结果：黄毛败」，该对象线转入 **NTRS 期**'],
];

// ===== 替换2【黄毛败判定去数值化，BATTLE六版】S2-MSG4 =====
const BATTLE_M4_LOSS = [
  ['> - **黄毛败·友好**：本轮确认黄毛败（对象长期明确拒绝黄毛/明确选择 {{user}}）',
   '> - **黄毛败·友好**：本轮确认黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）'],
  ['> - **NTRS期**：本轮确认黄毛败（对象长期明确拒绝黄毛/明确选择 {{user}}）',
   '> - **NTRS期**：本轮确认黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）'],
  [' * 对象有没有明确且长期的拒绝黄毛（≥2次/长期态度/明确选择 {{user}}）→ 黄毛败，线闭合（对象与黄毛变好朋友）？',
   ' * 女主的行为有没有表现出已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}——主动亲近/依赖/维护、对黄毛保持距离/冷淡/婉拒、关键抉择倾向 {{user}}）→ 黄毛败，线闭合（对象与黄毛变好朋友）？'],
  [' * 对象有没有明确且长期的拒绝黄毛（≥2次/长期态度/明确选择 {{user}}）→ 黄毛败，转 NTRS期（淫妻线从察觉型 41% 起）？',
   ' * 女主的行为有没有表现出已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）→ 黄毛败，转 NTRS期（淫妻线从察觉型 41% 起）？'],
];

// ===== 替换3【黄毛未spawn可行动】BATTLE S2-MSG0 职责开头 =====
const BATTLE_M0_DUTY = [
  ['你的职责分两步：第一步，**黄毛追踪 + 在场判定**——不依赖任何表格：从<前文剧情>、事件概览、记忆召回锚点中梳理所有**已刷新黄毛**及其当前动向（在场/离场/尾随目标/暗中布局等），时刻追踪每个黄毛的动向；同时依据本轮登场角色、故事信息、用户输入、当前时空合理性、角色卡与世界书素材，判断本轮是否该为某个尚无黄毛的💔可攻略角色**刷新一个新黄毛**。输出 <thugSpawn>（含【黄毛动向追踪】区块 + 本轮刷新判定）与 <thugSpawnReason>。第二步，基于你自己的追踪结果与本轮剧情，判断本轮已真正锁定的黄毛是否对目标采取行动（act / no-act 二元判定），输出 <thugAction> 与 <thugActionReason>。',
   '你的职责分两步：第一步，**黄毛追踪 + 在场判定**——不依赖任何表格：从<前文剧情>、事件概览、记忆召回锚点中梳理所有**已刷新黄毛**及其当前动向（在场/离场/尾随目标/暗中布局等），时刻追踪每个黄毛的动向；同时依据本轮登场角色、故事信息、用户输入、当前时空合理性、角色卡与世界书素材，判断本轮是否该为某个尚无黄毛的💔可攻略角色**刷新一个新黄毛**。输出 <thugSpawn>（含【黄毛动向追踪】区块 + 本轮刷新判定）与 <thugSpawnReason>。第二步，基于你自己的追踪结果与本轮剧情，判断本轮已真正锁定的黄毛是否对目标采取行动（act / no-act 二元判定），输出 <thugAction> 与 <thugActionReason>。**黄毛行动不依赖本轮是否刷新在场**——只要追踪中有该黄毛、且其离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。'],
];

// ===== 替换4【快速通道废止】18文件 S3-MSG0 =====
const S3_FAST_OLD = `**【快速通道——no-act 时跳过导演分析】**
当上游 \`<thugAction>\` 为 no-act 时（即所有目标均黄毛不出手，无论 spawn 还是 no_spawn），跳过全部导演分析、合理性审核、cast/plot 批评、sparkNotes 思考，直接输出最简 \`<content>\`：
- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）
- stage / cast / plot：整块省略
- 花火观剧感言：省略
- <ntrsProgress> 标签随 plot 一并省略（淫妻线进度以上轮为准，本轮不推进）
- Log：仅一行「no-act，快速通道输出」
此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。`;
const S3_FAST_NEW = `**【no-act 编排——不跳过导演分析】**
当上游 \`<thugAction>\` 为 no-act 时（即所有目标均黄毛不出手），**不跳过导演分析**——照常产出完整 \`<content>\`（prologue/stage/cast/plot/sparkNotes 思考全量编排），但本轮黄毛不出手：prologue 主线按 {{user}} 输入自然推进，不编排黄毛行动戏（若有离场黄毛在 {{user}} 场景外攻略目标，其场景外进展在 stage 的场景外字段记录，prologue 不展开）。` ;

for (const fn of all) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  let changed = false;
  const r = [];

  // 快速通道废止（S3-MSG0，全部18文件）
  if (battle.includes(fn)) {
    const m0 = t3.promptGroup[0];
    const p = m0.content.split(S3_FAST_OLD);
    if (p.length === 2) { m0.content = p[0] + S3_FAST_NEW + p[1]; changed = true; r.push('快速通道废止'); }
    else r.push('快速通道SKIP');
  }

  // BATTLE 六版：黄毛败判定去数值化 + 未spawn可行动
  if (battle.includes(fn)) {
    const m0 = t2.promptGroup[0];
    const m4 = t2.promptGroup[4];
    for (const [old, nw] of BATTLE_M0_LOSS) {
      if (m0.content.includes(old)) { m0.content = m0.content.split(old).join(nw); changed = true; r.push('败判定MSG0'); }
    }
    for (const [old, nw] of BATTLE_M4_LOSS) {
      if (m4.content.includes(old)) { m4.content = m4.content.split(old).join(nw); changed = true; r.push('败判定MSG4'); }
    }
    for (const [old, nw] of BATTLE_M0_DUTY) {
      if (m0.content.includes(old)) { m0.content = m0.content.split(old).join(nw); changed = true; r.push('未spawn可行动'); }
    }
  }

  if (changed) { fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8'); }
  results.push(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, '') + ': ' + (r.length ? r.join('|') : '无改动'));
}
console.log(results.join('\n'));
