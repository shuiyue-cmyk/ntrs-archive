const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const T1 = JSON.stringify(p.plotTasks[1]);
const T2 = JSON.stringify(p.plotTasks[2]);
const WHOLE = raw; // raw whole file for 1b scan

function dump(label, blob, idx, len) {
  console.log(`\n===== ${label} @${idx} (len ${len}) =====`);
  console.log(blob.slice(idx, idx + len));
}

dump('ITEM1 full sentence', T1, 20860, 150);
dump('ITEM2 exact', T1, 9268, 50);
// find d) self-check start in T2
let dIdx = T2.indexOf('d) **');
console.log('\nd) ** idx in T2:', dIdx);
if (dIdx !== -1) dump('ITEM6 d) full', T2, dIdx, 160);
dump('ITEM8 context', T2, 21610, 90);
dump('ITEM9 context', T2, 3398, 40);
// TRIGGER RULES full from 18000 to 19200
dump('TRIGGER RULES 18000-18120', T1, 18000, 120);
// find 见规则 and 1b occurrences across whole raw
let i = WHOLE.indexOf('1b');
console.log('\nraw "1b" occurrences:');
while (i !== -1) {
  console.log(' @', i, ':', JSON.stringify(WHOLE.slice(i - 25, i + 10)));
  i = WHOLE.indexOf('1b', i + 1);
}
// 见规则 occurrences
i = WHOLE.indexOf('见规则');
console.log('\nraw "见规则" occurrences:');
while (i !== -1) {
  console.log(' @', i, ':', JSON.stringify(WHOLE.slice(i - 15, i + 15)));
  i = WHOLE.indexOf('见规则', i + 1);
}
// find rule 2/3/4 markers in T1 after 18000
for (const s of ['2. **', '3. **', '4. **']) {
  let idx2 = T1.indexOf(s, 18000);
  console.log('\nT1 after 18000 first "' + s + '":', idx2);
  if (idx2 !== -1) dump('marker', T1, idx2, 80);
}
