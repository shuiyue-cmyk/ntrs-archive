const fs = require('fs');
const d = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
for (const f of ['Cirno_NTRS_turn_edit_straight_revise_4.7.json', 'Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json']) {
  const j = JSON.parse(fs.readFileSync(d + f, 'utf8'));
  const t = j[0].plotTasks.find(x => x.name === '黄毛判定·输入校准');
  console.log('===== ' + f);
  const c = t.promptGroup[4].content;
  const i = c.indexOf('分支A');
  console.log('  pg[4] 分支A 段:');
  console.log(JSON.stringify(c.slice(i, i + 320)));
  const i2 = c.indexOf('刷新状态两档');
  if (i2 >= 0) console.log('  pg[4] 刷新状态两档 引用: ' + JSON.stringify(c.slice(i2 - 100, i2 + 60)));
}
