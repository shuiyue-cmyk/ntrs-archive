const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设';

// FT TRIGGER RULES numbering
const ftRaw = fs.readFileSync(dir + '/Cirno_BATTLE_Turn_FT.json', 'utf8');
const ftP = JSON.parse(ftRaw)[0];
const ftT1 = JSON.stringify(ftP.plotTasks[1]);
const ftStart = ftT1.indexOf('TRIGGER RULES');
const ftLines = ftT1.slice(ftStart).split('\\n');
console.log('=== FT TRIGGER RULES numbered lines ===');
for (let i = 0; i < ftLines.length; i++) {
  const m = ftLines[i].match(/^(\d+[a-z]?)\.\s/);
  if (m) console.log(m[1], '|', JSON.stringify(ftLines[i].slice(0, 70)));
  if (ftLines[i].includes('规则 1b') || ftLines[i].includes('1b.')) console.log('   (1b line):', JSON.stringify(ftLines[i].slice(0, 90)));
}

// DEI item7 full state machine bullet
const deiRaw = fs.readFileSync(dir + '/Cirno_BATTLE_Turn_DEI.json', 'utf8');
const deiP = JSON.parse(deiRaw)[0];
const deiT2 = JSON.stringify(deiP.plotTasks[2]);
const i7 = deiT2.indexOf('该对象线**闭合**');
console.log('\n=== DEI item7 bullet @' + i7 + ' ===');
console.log(deiT2.slice(i7 - 120, i7 + 130));

// check single-brace {user} occurrences around item7 in DEI T2 raw region
const seg = deiT2.slice(i7 - 200, i7 + 200);
console.log('\n{user} occurrences near item7:', (seg.match(/\{user\}/g) || []).length, ' {{user}}:', (seg.match(/\{\{user\}\}/g) || []).length);

// item5 exact context in DEI T2 (S3-MSG0)
const i5 = deiT2.indexOf('不复述用户输入原文');
console.log('\n=== DEI item5 @' + i5 + ' ===');
console.log(deiT2.slice(i5 - 150, i5 + 60));
// count occurrences
let cnt = 0, idx = 0;
while ((idx = deiT2.indexOf('不复述用户输入原文', idx)) !== -1) { cnt++; idx++; }
console.log('item5 occurrences in T2:', cnt);
