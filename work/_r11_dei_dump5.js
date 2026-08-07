const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设';

for (const f of ['Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_straight.json']) {
  const raw = fs.readFileSync(dir + '/' + f, 'utf8');
  const p = JSON.parse(raw)[0];
  const T1 = JSON.stringify(p.plotTasks[1]);
  console.log(`\n### ${f}`);
  // sparkNotes spawn line
  let i = T1.indexOf('尚无黄毛的角色');
  if (i !== -1) {
    console.log('sparkNotes line:', JSON.stringify(T1.slice(i - 10, i + 120)));
  } else {
    i = T1.indexOf('本轮黄毛能否进入');
    console.log('no 尚无黄毛的角色; 本轮黄毛能否进入 at', i, i !== -1 ? JSON.stringify(T1.slice(i - 60, i + 60)) : '');
  }
  // item14 fast-track tail
  const T2 = JSON.stringify(p.plotTasks[2]);
  i = T2.indexOf('恢复完整导演分析');
  if (i !== -1) console.log('item14:', JSON.stringify(T2.slice(i - 30, i + 40)));
}
