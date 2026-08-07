// Precise byte compare for item30
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(target, 'utf8'));
const c17 = j[0].plotTasks[2].promptGroup[17].content;
const d7 = c17.indexOf('thugSpawn=spawn 时，黄毛是否已写入 prologue 登场角色名单');
const seg = c17.slice(d7, d7 + 130);
console.log('full segment:', JSON.stringify(seg));

// The exact needle from verify script
const needle = '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"）';
console.log('needle found in segment:', seg.includes(needle));
console.log('needle chars:', [...needle].map(c => c.codePointAt(0).toString(16)).join(' '));
console.log('seg chars 60-90:', [...seg.slice(52, 92)].map(c => c.codePointAt(0).toString(16)).join(' '));
