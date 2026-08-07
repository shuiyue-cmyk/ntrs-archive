const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
const j = JSON.parse(raw);
const p0 = j[0];
const blob = [p0.finalSystemDirective].concat(p0.plotTasks.flatMap(t => [t.description].concat(t.promptGroup.map(m => m.content)))).join('\n');
const i = blob.indexOf('真正锁定"规则');
console.log('N-B3 around 真正锁定:', JSON.stringify(blob.slice(i - 10, i + 30)));
const i2 = blob.indexOf('上一轮已锁定的活跃黄毛');
console.log('N-B3 full OLD ctx:', JSON.stringify(blob.slice(i2 - 30, i2 + 90)));
const i3 = blob.indexOf('lock_status=已离场 等');
console.log('N-A4 lock_status ctx:', JSON.stringify(blob.slice(i3 - 20, i3 + 40)));
// count occurrences of the no_spawn 分支A old (N-A4) full line
const nA4old = '② 分支A——黄毛表已命中该目标黄毛但本轮在场不合理（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场 等），输出 no_spawn；若无历史锁定的活跃黄毛则下游 stage3 走快速通道。';
console.log('N-A4 old count:', blob.split(nA4old).length - 1);
// N-A6 old prefix
const nA6old = '② 分支A——黄毛表已命中该目标黄毛，本轮判定其在场合理，沿用已有黄毛';
console.log('N-A6 old count:', blob.split(nA6old).length - 1);
// N-B3 old with 5-space indent
const nB3old = '     - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。';
console.log('N-B3 old(5sp) count:', blob.split(nB3old).length - 1);
const nB3old1 = ' - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。';
console.log('N-B3 old(1sp) count:', blob.split(nB3old1).length - 1);
