const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json', 'utf8');
const i = raw.indexOf('thugSpawn 状态=spawn 且锁定状态=真正锁定');
console.log('idx', i);
console.log(JSON.stringify(raw.slice(i - 260, i + 620)));
