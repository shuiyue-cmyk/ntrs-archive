const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_DEI_NTRS.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
const c = j[0].plotTasks[2].promptGroup[2].content;
const key = 'thugSpawn \u72b6\u6001=no_spawn';
const idx = c.indexOf(key);
console.log('no_spawn line found at:', idx);
if (idx >= 0) {
  console.log(JSON.stringify(c.slice(Math.max(0, idx - 700), idx + 300)));
}
