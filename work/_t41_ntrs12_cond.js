// T41 修正：NTRS12 版快速通道改为条件废止（亲密前保留、亲密后废止）
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const ntrs12 = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();

// 当前（无条件废止）块 → 条件式
const OLD = `**【no-act 编排——不跳过导演分析】**
当上游 \`<thugAction>\` 为 no-act 时（即所有目标均黄毛不出手），**不跳过导演分析**——照常产出完整 \`<content>\`（prologue/stage/cast/plot/sparkNotes 思考全量编排），但本轮黄毛不出手：prologue 主线按 {{user}} 输入自然推进，不编排黄毛行动戏（若有离场黄毛在 {{user}} 场景外攻略目标，其场景外进展在 stage 的场景外字段记录，prologue 不展开）。`;
const NEW = `**【快速通道与 no-act 编排（按亲密关系分轨）】**
- **{{user}}-对象尚未达成亲密关系时**（黄毛仅背景板、行动判定基本为 no-act）：保留快速通道——当上游 \`<thugAction>\` 为 no-act 时，跳过全部导演分析、合理性审核、cast/plot 批评、sparkNotes 思考，直接输出最简 \`<content>\`：prologue 仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（行文不少于 15 字），stage/cast/plot 整块省略。此阶段快速通道节省等待时间，不影响后续轮次。
- **{{user}}-对象已达成亲密关系后**（黄毛真正锁定、淫妻线推进期）：**废止快速通道**——当 \`<thugAction>\` 为 no-act 时**不跳过导演分析**，照常产出完整 \`<content>\`（prologue/stage/cast/plot/sparkNotes 思考全量编排），但本轮黄毛不出手：prologue 主线按 {{user}} 输入自然推进，不编排黄毛行动戏（若有离场黄毛在 {{user}} 场景外攻略目标，其场景外进展在 stage 的场景外字段记录，prologue 不展开）。`;

let ok = 0;
for (const fn of ntrs12) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const m0 = o.plotTasks.find(t => t.name === '导演台本').promptGroup[0];
  const parts = m0.content.split(OLD);
  if (parts.length === 2) {
    m0.content = parts[0] + NEW + parts[1];
    fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
    ok++;
  } else {
    console.log(fn + ': FAIL count=' + (parts.length - 1));
  }
}
console.log('NTRS12 快速通道条件废止: ' + ok + '/' + ntrs12.length);
