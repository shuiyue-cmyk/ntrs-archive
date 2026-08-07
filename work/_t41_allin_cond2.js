// T41 ALLin 六版：快速通道条件废止（END 锚点修正）
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const allin = ['Cirno_NTRS_turn_edit_straight_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_FT_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json'];

const START = '**【快速通道——所有目标均 no-act 时跳过导演分析】**';
const END = '此规则仅为节省等待时间，不影响后续任何轮次——下一轮若任一目标 act，恢复完整导演分析。';
const NEW = `**【快速通道与 no-act 编排（按亲密关系分轨）】**
- **{{user}}-对象尚未达成亲密关系时**（黄毛仅背景板、行动判定基本为 no-act）：保留快速通道——当上游 \`<thugAction>\` 对所有目标均为 no-act 时（同一黄毛可对不同目标各判 act/no-act；仅当所有目标均 no-act 时才触发快速通道，任一目标 act 即按完整流程编排），跳过全部导演分析、合理性审核、cast/plot 批评、sparkNotes 思考，直接输出最简 \`<content>\`：prologue 仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（行文不少于 15 字），stage/cast/plot 整块省略。此阶段快速通道节省等待时间，不影响后续轮次。
- **{{user}}-对象已达成亲密关系后**（黄毛真正锁定、淫妻线推进期）：**废止快速通道**——当 \`<thugAction>\` 对所有目标均为 no-act 时**不跳过导演分析**，照常产出完整 \`<content>\`（prologue/stage/cast/plot/sparkNotes 思考全量编排），但本轮黄毛不出手：prologue 主线按 {{user}} 输入自然推进，不编排黄毛行动戏（若有离场黄毛在 {{user}} 场景外攻略目标，其场景外进展在 stage 的场景外字段记录，prologue 不展开）。`;

let ok = 0;
for (const fn of allin) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const m0 = o.plotTasks.find(t => t.name === '导演台本').promptGroup[0];
  const si = m0.content.indexOf(START);
  const ei = m0.content.indexOf(END, si);
  if (si >= 0 && ei > si) {
    const endPos = ei + END.length;
    m0.content = m0.content.slice(0, si) + NEW + m0.content.slice(endPos);
    fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
    ok++;
  } else {
    console.log(fn + ': FAIL si=' + si + ' ei=' + ei);
  }
}
console.log('ALLin 快速通道条件废止: ' + ok + '/' + allin.length);
