const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json', 'utf8');
const j = JSON.parse(raw);
const t = j[0].plotTasks[0];
const c = t.promptGroup[0].content;
const idx = c.indexOf('黄毛行动不依赖本轮是否刷新在场');
console.log('idx=' + idx);
console.log('--- region ---');
console.log(c.slice(idx - 60, idx + 700));
