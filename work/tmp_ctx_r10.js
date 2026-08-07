const fs = require('fs');
const path = process.argv[2];
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const obj = Array.isArray(j) ? j[0] : j;

// dump full context around every occurrence of 对象已站队不豁免 in promptGroup[4] of task 1
const task1 = obj.plotTasks[1];
const msg = task1.promptGroup[4].content;
let idx = 0;
while ((idx = msg.indexOf('对象已站队不豁免', idx)) !== -1) {
  console.log('=== occurrence at', idx, '===');
  console.log(JSON.stringify(msg.slice(Math.max(0, idx - 300), idx + 220)));
  console.log();
  idx += 1;
}
// also list all bullets in that message that mention 不豁免
console.log('=== lines mentioning 不豁免 in promptGroup[4] ===');
const lines = msg.split('\n');
lines.forEach((l, i) => { if (l.includes('不豁免')) console.log(i, JSON.stringify(l.slice(0, 200))); });
