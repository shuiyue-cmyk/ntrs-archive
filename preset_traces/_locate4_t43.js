const fs = require('fs');
const d = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
for (const f of ['Cirno_NTRS_turn_edit_straight_revise_4.7.json', 'Cirno_NTRS_turn_edit_FT_revise_4.7.json', 'Cirno_NTRS_turn_edit_DEI_revise_4.7.json']) {
  const j = JSON.parse(fs.readFileSync(d + f, 'utf8'));
  console.log('===== ' + f);
  for (let ti = 0; ti < j[0].plotTasks.length; ti++) {
    const t = j[0].plotTasks[ti];
    (t.promptGroup || []).forEach((m, i) => {
      const c = m.content;
      let from = 0;
      while ((from = c.indexOf('本轮在场是否合理', from)) >= 0) {
        console.log('  task[' + ti + '] ' + t.name + ' pg[' + i + ']: ' + JSON.stringify(c.slice(from - 60, from + 80)));
        from += 7;
      }
    });
  }
}
