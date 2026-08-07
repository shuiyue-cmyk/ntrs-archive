const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const T1 = JSON.stringify(p.plotTasks[1]);
const T2 = JSON.stringify(p.plotTasks[2]);

function dump(label, blob, idx, len) {
  console.log(`\n===== ${label} @${idx} =====`);
  console.log(blob.slice(idx, idx + len));
}

// item 6: self-check d) full context
dump('ITEM6 selfcheck d', T2, 21380, 110);
// item 6 partial-already-applied check
dump('ITEM6 already-applied?', T2, 8820, 130);
// item 10: thugSpawn sentence
dump('ITEM10 thugSpawn', T1, 12800, 260);
// item 14: fast-track tail
dump('ITEM14 fast-track tail', T2, 500, 110);
// TRIGGER RULES section locate
let idx = T1.indexOf('TRIGGER');
console.log('\nTRIGGER first idx in T1:', idx);
if (idx !== -1) {
  dump('TRIGGER RULES', T1, idx - 100, 900);
}
// also search for 规则 1 / 规则 2 numbering
for (const s of ['**规则 1', '**规则1', '规则 2', '规则2']) {
  console.log(s, '->', T1.indexOf(s));
}
