// 确认 thugSpawn 模板字段 + plot 模板 ntrsProgress 实际输出
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
for (const fn of ['Cirno_NTRS_turn_edit_straight_4.7.json', 'Cirno_BATTLE_Turn_straight_NTRS.json']) {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  console.log('\n================ ' + fn + ' ================');
  // S2 thugSpawn 模板
  const s2 = root.plotTasks.find(t => t.id === 'plotTaskThugTempo');
  let s2all = '';
  for (const m of s2.promptGroup) s2all += (m.content || '') + '\n';
  let i = s2all.indexOf('<thugSpawn>');
  while (i !== -1) {
    const j2 = s2all.indexOf('</thugSpawn>', i);
    if (j2 === -1) break;
    console.log('\n-- S2 thugSpawn 模板（截断 400） --\n' + s2all.slice(i, i + 400));
    i = s2all.indexOf('<thugSpawn>', j2);
  }
  // S3 plot 模板 ntrsProgress
  const s3 = root.plotTasks.find(t => t.id === 'defaultPlotTask');
  let s3all = '';
  for (const m of s3.promptGroup) s3all += (m.content || '') + '\n';
  console.log('\nS3 含 ntrsProgress 上下文：');
  let k = s3all.indexOf('ntrsProgress');
  let shown = 0;
  while (k !== -1 && shown < 3) {
    console.log('...' + s3all.slice(Math.max(0, k - 150), k + 150).replace(/\n/g, ' '));
    k = s3all.indexOf('ntrsProgress', k + 1);
    shown++;
  }
  // S3 plot 模板结构（找 <plot> 附近）
  const pk = s3all.indexOf('<plot>');
  if (pk !== -1) console.log('\n-- S3 plot 模板前 500 --\n' + s3all.slice(pk, pk + 500));
}
