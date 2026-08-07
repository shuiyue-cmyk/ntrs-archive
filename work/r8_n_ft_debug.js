// Debug N-B3 NEW presence in memory after replacement
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));

const oldB3 = ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。`;
const newB3 = ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已真正锁定的活跃黄毛，且其本轮 act 行动发生在 {{user}} 当前场景内，则按"真正锁定"规则登场编排；若该黄毛本轮 act 为场景外行动（黄毛与对象均在 {{user}} 当前场景之外），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。`;

const dp = j[0].plotTasks.find(t => t.id === 'defaultPlotTask');
dp.promptGroup.forEach((m, mi) => {
  const s = m.content;
  if (s.includes('thugSpawn 状态=no_spawn')) {
    console.log('--- pg' + mi, 'len', s.length);
    console.log('has OLD:', s.includes(oldB3));
    const n = s.split(oldB3).join(newB3);
    console.log('has NEW after replace:', n.includes(newB3));
    console.log('content:');
    console.log(n.slice(0, 700));
  }
});
// char codes of quotes in newB3
const q = newB3.match(/真正锁定/);
const i = newB3.indexOf('真正锁定');
console.log('quote chars in newB3:', newB3.charCodeAt(i - 1), newB3.charCodeAt(i + 4));
console.log('quote chars in oldB3:', oldB3.charCodeAt(oldB3.indexOf('真正锁定') - 1), oldB3.charCodeAt(oldB3.indexOf('真正锁定') + 4));
