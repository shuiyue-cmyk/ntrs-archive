const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const c = p.plotTasks[1].promptGroup[4].content;

// find the 分支A spawn definition line (spec G3: spawn=本轮黄毛在 ... =no_spawn)
let pos = 0;
while ((pos = c.indexOf('在场', pos)) >= 0) {
  console.log('--- 在场 @', pos);
  console.log(JSON.stringify(c.slice(pos - 200, pos + 120)));
  pos += 2;
}
