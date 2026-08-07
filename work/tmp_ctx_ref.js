const fs = require('fs');
const path = process.argv[2];
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const obj = Array.isArray(j) ? j[0] : j;
const task1 = obj.plotTasks[1];
for (let i = 0; i < task1.promptGroup.length; i++) {
  const c = task1.promptGroup[i].content || '';
  if (c.includes('对象已站队不豁免')) {
    const idx = c.indexOf('对象已站队不豁免');
    console.log('promptGroup[' + i + '] role=' + task1.promptGroup[i].role + ' idx=' + idx);
    console.log(JSON.stringify(c.slice(Math.max(0, idx - 200), idx + 250)));
    console.log('---');
  }
  if (c.includes('见上方')) {
    const idx = c.indexOf('见上方');
    console.log('见上方 in promptGroup[' + i + ']:', JSON.stringify(c.slice(Math.max(0, idx - 260), idx + 80)));
    console.log('---');
  }
}
