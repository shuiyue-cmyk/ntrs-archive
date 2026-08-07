// BATTLE NTRS 三版：S2 MSG2 / S3 MSG15 当前文本
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
for (const fn of ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json']) {
  const j = JSON.parse(fs.readFileSync(base + fn, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  console.log('====', fn);
  console.log('--- S2 MSG2 (含黄毛追踪说明段) ---');
  const m2 = t2.promptGroup[2].content;
  const i = m2.indexOf('黄毛追踪说明');
  console.log(m2.slice(i - 50, i + 300));
  console.log('--- S3 MSG15 (含表格说明段) ---');
  const m15 = t3.promptGroup[15].content;
  const k = m15.indexOf('黄毛档案');
  console.log(m15.slice(k - 20, k + 400));
}
