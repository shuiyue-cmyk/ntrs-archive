const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
const j = JSON.parse(raw);
const t = j[0].plotTasks.find(t => t.id === 'plotTaskThugTempo');
for (let k = 0; k < t.promptGroup.length; k++) {
  const c = t.promptGroup[k].content;
  if (c.includes('本轮无黄毛在 {{user}} 当前场景画面内') || c.includes('黄毛表已命中该目标黄毛但黄毛不在')) {
    console.log('found in msg[' + k + ']');
    const i2 = c.indexOf('本轮无黄毛在 {{user}} 当前场景画面内');
    if (i2 >= 0) console.log('N-A3:', JSON.stringify(c.slice(i2 - 6, i2 + 55)));
    const i3 = c.indexOf('黄毛表已命中该目标黄毛但黄毛不在');
    if (i3 >= 0) console.log('N-A4:', JSON.stringify(c.slice(i3 - 4, i3 + 160)));
  }
}
// check N-A6 line
const c4 = t.promptGroup[4].content;
const i6 = c4.indexOf('② 分支A——黄毛表已命中该目标黄毛，本轮判定其在');
console.log('N-A6:', JSON.stringify(c4.slice(i6, i6 + 55)));
// check {[db.*} untouched
const dbCheck = (raw.match(/\{\[db\./g) || []).length;
console.log('{[db.*} occurrences:', dbCheck);
