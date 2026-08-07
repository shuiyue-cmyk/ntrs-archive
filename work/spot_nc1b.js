const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json', 'utf8');
const j = JSON.parse(raw);
const needle = '黄毛行动不依赖本轮是否刷新在场';
let found = false;
for (const t of j[0].plotTasks) {
  if (t.description && t.description.includes(needle)) { console.log('FOUND in description of ' + t.id); found = true; }
  if (Array.isArray(t.promptGroup)) {
    for (let i = 0; i < t.promptGroup.length; i++) {
      const c = t.promptGroup[i].content || '';
      if (c.includes(needle)) {
        found = true;
        const idx = c.indexOf(needle);
        console.log('FOUND in ' + t.id + ' promptGroup[' + i + '] len=' + c.length);
        console.log('--- region ---');
        console.log(c.slice(idx - 80, idx + 700));
      }
    }
  }
}
if (j[0].finalSystemDirective && j[0].finalSystemDirective.includes(needle)) console.log('FOUND in FSD');
if (!found) console.log('NOT FOUND anywhere');
