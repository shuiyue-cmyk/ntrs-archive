// dump NTRS12/NTRS·雄竞 S3 msg2 归属句（追踪 NTRtrack 描述）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
for (const fn of ['Cirno_NTRS_turn_edit_straight_4.7.json', 'Cirno_BATTLE_Turn_straight_NTRS.json']) {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const s3 = j[0].plotTasks.find(t => t.id === 'defaultPlotTask');
  let all = '';
  for (const m of s3.promptGroup) all += (m.content || '') + '\n';
  let i = all.indexOf('NTRtrack');
  while (i !== -1) {
    const seg = all.slice(Math.max(0, i - 60), i + 90);
    if (seg.includes('动向') || seg.includes('人设') || seg.includes('锁定状态')) {
      console.log('### ' + fn + ' @' + i);
      console.log(JSON.stringify(seg));
    }
    i = all.indexOf('NTRtrack', i + 8);
  }
}
