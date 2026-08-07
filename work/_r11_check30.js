// Check item30 7d actual bytes after edit
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(target, 'utf8'));
const c17 = j[0].plotTasks[2].promptGroup[17].content;
const d7 = c17.indexOf('thugSpawn=spawn 时，黄毛是否已写入 prologue 登场角色名单');
console.log('char codes around:', JSON.stringify(c17.slice(d7, d7 + 60).split('').map(ch => ch.codePointAt(0).toString(16))));
console.log('actual text:', JSON.stringify(c17.slice(d7, d7 + 130)));
