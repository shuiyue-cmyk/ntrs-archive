const fs = require('fs');
const d = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
for (const f of ['Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json']) {
  const j = JSON.parse(fs.readFileSync(d + f, 'utf8'));
  console.log('===== ' + f);
  const blob = JSON.stringify(j);
  let from = 0, hits = [];
  while ((from = blob.indexOf('≥2次', from)) >= 0) { hits.push(from); from += 3; }
  for (const h of hits) console.log('  blob@' + h + ': ' + JSON.stringify(blob.slice(h - 150, h + 120)));
  for (let ti = 0; ti < j[0].plotTasks.length; ti++) {
    const t = j[0].plotTasks[ti];
    (t.promptGroup || []).forEach((m, i) => {
      if (m.content.indexOf('≥2次') >= 0) console.log('  -> task[' + ti + '] ' + t.name + ' pg[' + i + '] role=' + m.role + ' 含≥2次');
    });
    if ((t.description || '').indexOf('≥2次') >= 0) console.log('  -> task[' + ti + '] ' + t.name + ' description 含≥2次');
  }
  if ((j[0].finalSystemDirective || '').indexOf('≥2次') >= 0) console.log('  -> finalSystemDirective 含≥2次');
}
