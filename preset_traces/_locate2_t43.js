const fs = require('fs');
const d = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
for (const f of ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json']) {
  const j = JSON.parse(fs.readFileSync(d + f, 'utf8'));
  console.log('===== ' + f);
  const t = j[0].plotTasks.find(x => x.name === '导演台本');
  t.promptGroup.forEach((m, i) => {
    if (m.content.indexOf('胜负判定（纯剧情，无数值）') >= 0) {
      const at = m.content.indexOf('胜负判定');
      console.log('  pg[' + i + '] role=' + m.role);
      console.log('  ' + JSON.stringify(m.content.slice(at - 20, at + 330)));
    }
  });
  // 全预设 ≥2次 / 41% 计数
  const blob = JSON.stringify(j);
  console.log('  全预设 ≥2次=' + (blob.split('≥2次').length - 1) + ' 41%=' + (blob.split('41%').length - 1));
}
