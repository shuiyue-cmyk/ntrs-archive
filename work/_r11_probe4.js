// Dump S3-MSG2 状态机 block and 7d line, plus item1 exact sentence
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(target, 'utf8'));

const c2 = j[0].plotTasks[2].promptGroup[2].content;
const sm = c2.indexOf('**双期状态机');
console.log('=== S3-MSG2 状态机 block (first 2600 chars) ===');
console.log(c2.slice(sm, sm + 2600));

console.log('\n=== 状态机 NTRS期 bullet / 黄毛胜 bullet / 亲密开局 presence ===');
const ntrsIdx = c2.indexOf('**NTRS期**：');
console.log('NTRS期 bullet idx:', ntrsIdx, ntrsIdx > -1 ? JSON.stringify(c2.slice(ntrsIdx - 30, ntrsIdx + 260)) : '');
const finIdx = c2.indexOf('**黄毛胜·终局**');
console.log('黄毛胜·终局 bullet idx:', finIdx, finIdx > -1 ? JSON.stringify(c2.slice(finIdx - 30, finIdx + 120)) : '');

console.log('\n=== S3-MSG17 7d line exact ===');
const c17 = j[0].plotTasks[2].promptGroup[17].content;
const d7 = c17.indexOf('thugSpawn=spawn 时，黄毛是否已写入 prologue 登场角色名单');
console.log(JSON.stringify(c17.slice(d7 - 30, d7 + 220)));

console.log('\n=== item1 exact sentence in S2MSG4 ===');
const c4 = j[0].plotTasks[1].promptGroup[4].content;
const i1 = c4.indexOf('接下来的场景中该黄毛是否有出现的可能');
console.log(JSON.stringify(c4.slice(i1 - 30, i1 + 150)));
