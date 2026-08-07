const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
const j = JSON.parse(raw);
const p0 = j[0];

const blob = (() => {
  const parts = [p0.finalSystemDirective];
  for (const t of p0.plotTasks) {
    parts.push(t.description);
    for (const m of t.promptGroup) parts.push(m.content);
  }
  return parts.join('\n');
})();

const anchors = [
  ['N-A1', '刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能'],
  ['N-A2-head', '3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：'],
  ['N-A2-line1', '必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证'],
  ['N-A3', '**no_spawn**：本轮无黄毛在场。两种情形：'],
  ['N-A4', '② 分支A——黄毛表已命中该目标黄毛但本轮在场不合理'],
  ['N-A6', '② 分支A——黄毛表已命中该目标黄毛，本轮判定其在场合理，沿用已有黄毛'],
  ['N-B1', '**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略）'],
  ['N-B2', '- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」'],
  ['N-B3', 'thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛'],
  ['N-C1', '**黄毛行动不依赖本轮是否刷新在场**'],
  ['N-C2', '- **no-act**：本轮黄毛不出手。可能是：未真正锁定'],
];

for (const [id, anchor] of anchors) {
  const idx = blob.indexOf(anchor);
  if (idx === -1) {
    console.log(id, 'NOT FOUND', JSON.stringify(anchor.slice(0, 30)));
    continue;
  }
  const ctx = blob.slice(Math.max(0, idx - 80), idx + 200);
  console.log('=== ' + id + ' found at ' + idx + ' ===');
  console.log('PRECEDING BYTES: ' + JSON.stringify(blob.slice(Math.max(0, idx - 30), idx)));
  console.log('CONTEXT: ' + JSON.stringify(ctx.slice(0, 130)));
  console.log('');
}
