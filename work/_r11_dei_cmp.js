const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设';
const files = fs.readdirSync(dir).filter(f => f.includes('BATTLE') && f.endsWith('.json'));
console.log('BATTLE files:', files.join('\n'));

// compare item10 sentence in all BATTLE variants
for (const f of files) {
  try {
    const raw = fs.readFileSync(dir + '/' + f, 'utf8');
    const j = JSON.parse(raw);
    const p = j[0];
    const tasks = (p.plotTasks || []).map(t => JSON.stringify(t));
    let found = null;
    for (const blob of tasks) {
      const idx = blob.indexOf('标签内只放刷新状态');
      if (idx !== -1) { found = blob.slice(idx - 5, idx + 150); break; }
    }
    console.log(`\n--- ${f}`);
    console.log(found ? found : '(not found)');
  } catch (e) {
    console.log(`\n--- ${f}: ERROR ${e.message}`);
  }
}
