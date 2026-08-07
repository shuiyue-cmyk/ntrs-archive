// T41 ALLin 六版专用：快速通道废止 + 未spawn可行动
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const allin = ['Cirno_NTRS_turn_edit_straight_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_FT_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json'];
const results = [];

// 快速通道废止（ALLin 版标题不同）
const FAST_START = '**【快速通道——所有目标均 no-act 时跳过导演分析】**';
const FAST_END = '此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析。';
const FAST_NEW = `**【no-act 编排——不跳过导演分析】**
当上游 \`<thugAction>\` 对所有目标均为 no-act 时（同一黄毛可对不同目标各判 act/no-act；任一目标 act 即按该目标编排黄毛行动戏），**不跳过导演分析**——照常产出完整 \`<content>\`（prologue/stage/cast/plot/sparkNotes 思考全量编排），但本轮黄毛不出手：prologue 主线按 {{user}} 输入自然推进，不编排黄毛行动戏（若有离场黄毛在 {{user}} 场景外攻略目标，其场景外进展在 stage 的场景外字段记录，prologue 不展开）。`;

// 未spawn可行动（ALLin 版职责段）
const DUTY_OLD = '判断该黄毛本轮在场是否合理（合理→spawn，不合理→no_spawn 走快速通道）';
const DUTY_NEW = '判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn；**黄毛行动不依赖本轮是否刷新在场**——只要该黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act，该行动发生在 {{user}} 场景外）';

for (const fn of allin) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  let changed = false;
  const r = [];
  // 快速通道
  const m0 = t3.promptGroup[0];
  const si = m0.content.indexOf(FAST_START);
  const ei = m0.content.indexOf(FAST_END, si);
  if (si >= 0 && ei > si) {
    const endPos = ei + FAST_END.length;
    m0.content = m0.content.slice(0, si) + FAST_NEW + m0.content.slice(endPos);
    changed = true; r.push('快速通道废止');
  } else r.push('快速通道SKIP');
  // 未spawn
  const m0t2 = t2.promptGroup[0];
  if (m0t2.content.includes(DUTY_OLD)) {
    m0t2.content = m0t2.content.split(DUTY_OLD).join(DUTY_NEW);
    changed = true; r.push('未spawn可行动');
  } else r.push('未spawnSKIP');
  if (changed) fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
  results.push(fn.replace(/^Cirno_NTRS_turn_edit_|_4\.7\.json$/g, '') + ': ' + r.join('|'));
}
console.log(results.join('\n'));
