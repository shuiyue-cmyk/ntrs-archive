// T41 补丁2：NTRS 12 版 act 编排段加场景外说明（实际锚点）
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const ntrs12 = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
const old = '保留 {{user}} 主动推波助澜层 + 淫妻线心理，淫妻线阶段按本轮触发事件分量 +0~5%/轮推进。';
const nw = '保留 {{user}} 主动推波助澜层 + 淫妻线心理，淫妻线阶段按本轮触发事件分量 +0~5%/轮推进。**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**。';
let ok = 0;
for (const fn of ntrs12) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const m0 = o.plotTasks.find(t => t.name === '导演台本').promptGroup[0];
  const parts = m0.content.split(old);
  if (parts.length === 2) {
    m0.content = parts[0] + nw + parts[1];
    fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
    ok++;
  } else {
    console.log(fn + ': FAIL count=' + (parts.length - 1));
  }
}
console.log('NTRS12 场景外 act段: ' + ok + '/' + ntrs12.length);
