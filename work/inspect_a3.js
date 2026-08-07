// Find actual A3 anchor text in DEI file
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const tasks = {};
for (const t of j[0].plotTasks) tasks[t.id] = t;

const s3msg2 = tasks['defaultPlotTask'].promptGroup[1].content;
// search partial variants
const partial = '雄竞期黄毛可以真正赢得对象的心';
let idx = s3msg2.indexOf(partial);
console.log('partial idx: ' + idx);
if (idx >= 0) {
  console.log('CONTEXT (idx-30..idx+150): ' + JSON.stringify(s3msg2.slice(idx - 30, idx + 150)));
}
// full dump of the 雄竞期编排 section
const sec = s3msg2.indexOf('【雄竞期编排');
console.log('SEC idx: ' + sec);
if (sec >= 0) {
  console.log('SEC FULL: ' + JSON.stringify(s3msg2.slice(sec, sec + 800)));
}
