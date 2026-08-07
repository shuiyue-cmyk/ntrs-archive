const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const T1 = JSON.stringify(p.plotTasks[1]);

// find TRIGGER RULES section start and end (next \n=====)
const start = T1.indexOf('TRIGGER RULES');
const end = T1.indexOf('====', start + 100);
console.log('section span:', start, '-', end);
console.log(T1.slice(start - 20, end + 40));

// enumerate numbered markers in T1: lines starting with digit or digit+b.
const lines = T1.split('\\n');
console.log('\n--- numbered markers in T1 ---');
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^(\d+[a-z]?)\.\s/);
  if (m) console.log(i, JSON.stringify(lines[i].slice(0, 60)));
}
