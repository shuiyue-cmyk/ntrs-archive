// NTRS 12 版 $0 的 8 处精确用法
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const j = JSON.parse(fs.readFileSync(base + 'Cirno_NTRS_turn_edit_straight_4.7.json', 'utf8'));
const o = Array.isArray(j) ? j[0] : j;
for (const [tag, task] of [['S1', o.plotTasks.find(t => t.name === '记忆召回')], ['S2', o.plotTasks.find(t => t.name === '黄毛判定')], ['S3', o.plotTasks.find(t => t.name === '导演台本')]]) {
  task.promptGroup.forEach((m, mi) => {
    const c = m.content || '';
    if (c.includes('$0')) {
      const lines = c.split('\n');
      lines.forEach((line, li) => {
        if (line.includes('$0') || line.includes('当前表格数据')) {
          console.log('[' + tag + ' MSG' + mi + ' L' + li + '] ' + line.trim().slice(0, 150));
        }
      });
    }
  });
}
console.log('==== FSD ====');
console.log(JSON.stringify(o.finalSystemDirective).slice(0, 600));
