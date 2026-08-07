// T41 补丁：S3 场景外标注（18文件）
// ①S3-MSG0 act 编排段加场景外说明
// ②S3-MSG7 stage 模板暗流加"场景外"字段
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(base).filter(f => /^Cirno_(NTRS_turn_edit|BATTLE_Turn).*\.json$/.test(f));
const results = [];

// ①S3-MSG0：在 act 编排的"目标离场时黄毛尾随/赶赴行动也照此编排"后补场景外说明（BATTLE版）
const BATTLE_ACT_OLD = '{{user}} 正常追求；目标离场时黄毛尾随/赶赴行动也照此编排）；';
const BATTLE_ACT_NEW = '{{user}} 正常追求；目标离场时黄毛尾随/赶赴行动也照此编排；**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**）；';
const NTRS_ACT_OLD = '保留 {{user}} 主动推波助澜层 + 淫妻线心理，淫妻线阶段按本轮触发事件分量 +0~5%/轮推进）；';
const NTRS_ACT_NEW = '保留 {{user}} 主动推波助澜层 + 淫妻线心理，淫妻线阶段按本轮触发事件分量 +0~5%/轮推进；**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**）；';

for (const fn of files) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  const m0 = t3.promptGroup[0];
  let changed = false;
  const r = [];
  const isBattle = fn.startsWith('Cirno_BATTLE_Turn');
  // act 编排段场景外说明
  const oldAct = isBattle ? BATTLE_ACT_OLD : NTRS_ACT_OLD;
  if (m0.content.includes(oldAct)) {
    m0.content = m0.content.split(oldAct).join(isBattle ? BATTLE_ACT_NEW : NTRS_ACT_NEW);
    changed = true; r.push('MSG0场景外');
  } else r.push('MSG0场景外SKIP');
  // stage 模板加场景外字段
  const m7 = t3.promptGroup[7];
  const anchor = '**发生位置:** 台前（👁️在场见证）/ 幕后·事后知情（📹）/ 幕后·完全不知（🌙）';
  if (m7.content.includes(anchor)) {
    const add = '\n- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开';
    if (!m7.content.includes('场景外标注')) {
      m7.content = m7.content.split(anchor).join(anchor + add);
      changed = true; r.push('stage场景外字段');
    } else r.push('stage字段已含');
  } else r.push('stage字段SKIP');
  if (changed) fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
  results.push(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, '') + ': ' + r.join('|'));
}
console.log(results.join('\n'));
