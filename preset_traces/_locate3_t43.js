const fs = require('fs');
const d = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const sub = '不合理→no_spawn 走快速通道';
for (const f of ['Cirno_NTRS_turn_edit_straight_revise_4.7.json']) {
  const j = JSON.parse(fs.readFileSync(d + f, 'utf8'));
  console.log('===== ' + f);
  const blob = JSON.stringify(j);
  let from = 0;
  while ((from = blob.indexOf(sub, from)) >= 0) {
    console.log('  blob@' + from + ': ' + JSON.stringify(blob.slice(from - 90, from + 90)));
    from += sub.length;
  }
  for (let ti = 0; ti < j[0].plotTasks.length; ti++) {
    const t = j[0].plotTasks[ti];
    (t.promptGroup || []).forEach((m, i) => {
      if (m.content.indexOf(sub) >= 0) console.log('  -> task[' + ti + '] ' + t.name + ' pg[' + i + '] role=' + m.role);
    });
    if ((t.description || '').indexOf(sub) >= 0) console.log('  -> task[' + ti + '] ' + t.name + ' description');
  }
  if ((j[0].finalSystemDirective || '').indexOf(sub) >= 0) console.log('  -> finalSystemDirective');
}
