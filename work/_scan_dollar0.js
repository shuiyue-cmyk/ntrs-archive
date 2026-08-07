// 核查 $0 注入使用情况
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json', 'Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(base + fn, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t1 = o.plotTasks.find(t => t.name === '记忆召回');
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  console.log('====', fn);
  for (const [tag, task] of [['S1', t1], ['S2', t2], ['S3', t3]]) {
    task.promptGroup.forEach((m, mi) => {
      const c = m.content || '';
      if (c.includes('$0') || c.includes('当前表格数据') || c.includes('黄毛表')) {
        // 找 $0 和"当前表格数据"出现位置
        const lines = c.split('\n');
        lines.forEach((line, li) => {
          if (line.includes('$0') || line.includes('当前表格数据') || line.includes('黄毛表')) {
            console.log('  [' + tag + ' MSG' + mi + ' L' + li + '] ' + line.trim().slice(0, 120));
          }
        });
      }
    });
  }
  // FSD
  if (o.finalSystemDirective.includes('$0')) {
    console.log('  [FSD] 含 $0');
  }
}
