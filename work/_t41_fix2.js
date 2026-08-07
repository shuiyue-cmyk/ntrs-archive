// T41 补修：快速通道废止（纯雄竞三版 + NTRS12 版）+ NTRS12 未spawn可行动
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const plain = ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json'];
const ntrs12 = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
const results = [];

// 快速通道废止：锚点截断——从"【快速通道"到"恢复完整导演分析。"整块替换
const FAST_START = '**【快速通道——no-act 时跳过导演分析】**';
const FAST_END = '此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。';
const FAST_NEW = `**【no-act 编排——不跳过导演分析】**
当上游 \`<thugAction>\` 为 no-act 时（即所有目标均黄毛不出手），**不跳过导演分析**——照常产出完整 \`<content>\`（prologue/stage/cast/plot/sparkNotes 思考全量编排），但本轮黄毛不出手：prologue 主线按 {{user}} 输入自然推进，不编排黄毛行动戏（若有离场黄毛在 {{user}} 场景外攻略目标，其场景外进展在 stage 的场景外字段记录，prologue 不展开）。`;

// 未spawn可行动（NTRS12 版 S2-MSG0 职责段）
const N12_DUTY_OLD = '你的职责分两步：第一步，先查阅下方<黄毛表当前条目>中 已有的黄毛条目——locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"，不再刷新新黄毛，改成判断该已有黄毛本轮在场是否合理（合理→spawn，不合理→no_spawn 走快速通道）；未命中则按原黄毛刷新判定逻辑（依据本轮登场角色、故事信息、用户输入、当前时空合理性、角色卡与世界书素材，判断本轮是否该为某个未锁定黄毛的💔敏感角色刷新一个新黄毛）。两种分支都输出 <thugSpawn> 与 <thugSpawnReason>。第二步，基于你自己的判定结果与本轮剧情，判断本轮已真正锁定的黄毛是否对目标采取行动（act / no-act 二元判定），输出 <thugAction> 与 <thugActionReason>。';
const N12_DUTY_NEW = '你的职责分两步：第一步，先查阅下方<黄毛表当前条目>中 已有的黄毛条目——locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"，不再刷新新黄毛，改成判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）；未命中则按原黄毛刷新判定逻辑（依据本轮登场角色、故事信息、用户输入、当前时空合理性、角色卡与世界书素材，判断本轮是否该为某个未锁定黄毛的💔敏感角色刷新一个新黄毛）。两种分支都输出 <thugSpawn> 与 <thugSpawnReason>。第二步，基于你自己的判定结果与本轮剧情，判断本轮已真正锁定的黄毛是否对目标采取行动（act / no-act 二元判定），输出 <thugAction> 与 <thugActionReason>。**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。';

for (const fn of [...plain, ...ntrs12]) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  let changed = false;
  const r = [];

  // 快速通道废止（S3-MSG0）
  const m0 = t3.promptGroup[0];
  const si = m0.content.indexOf(FAST_START);
  const ei = m0.content.indexOf(FAST_END, si);
  if (si >= 0 && ei > si) {
    const endPos = ei + FAST_END.length;
    m0.content = m0.content.slice(0, si) + FAST_NEW + m0.content.slice(endPos);
    changed = true;
    r.push('快速通道废止');
  } else r.push('快速通道SKIP');

  // NTRS12 未spawn可行动
  if (ntrs12.includes(fn)) {
    const m0t2 = t2.promptGroup[0];
    if (m0t2.content.includes(N12_DUTY_OLD)) {
      m0t2.content = m0t2.content.split(N12_DUTY_OLD).join(N12_DUTY_NEW);
      changed = true;
      r.push('未spawn可行动');
    } else r.push('未spawnSKIP');
  }

  if (changed) fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
  results.push(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, '') + ': ' + r.join('|'));
}
console.log(results.join('\n'));
