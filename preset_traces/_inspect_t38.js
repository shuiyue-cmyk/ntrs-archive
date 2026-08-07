// Inspect Cirno_BATTLE_Turn_straight.json structure
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);

console.log('=== TOP LEVEL ===');
console.log('isArray:', Array.isArray(j), 'len:', j.length);
const p = Array.isArray(j) ? j[0] : j;
console.log('preset name:', p.name);
console.log('has plotTasks:', Array.isArray(p.plotTasks), 'count:', (p.plotTasks||[]).length);
console.log('top-level keys:', Object.keys(p).join(', '));

const tasks = p.plotTasks || [];
tasks.forEach((t, ti) => {
  console.log('\n=== TASK[' + ti + '] ===');
  console.log('  id:', t.id, 'name:', t.name);
  console.log('  stage:', t.stage, 'order:', t.order);
  console.log('  extractTags:', t.extractTags);
  console.log('  dependsOn:', t.agentControl && t.agentControl.dependsOnTaskIds);
  const pg = t.promptGroup || [];
  console.log('  promptGroup count:', pg.length);
  pg.forEach((m, mi) => {
    const c = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
    const head = c.slice(0, 100).replace(/\n/g, '\\n');
    console.log('    [' + mi + '] role=' + m.role + ' len=' + c.length + ' :: ' + head);
  });
});

// Scan whole-preset blob for the target strings
const blob = JSON.stringify(j);
console.log('\n=== TARGET STRING SCAN (whole-preset blob) ===');
const targets = ['NTR标记', 'NTR/绿帽', '底色仍存', '雄竞底色仍存', '关系标记', '竞争/信息差旁观', '快速通道'];
targets.forEach(t => {
  const idxs = [];
  let i = blob.indexOf(t);
  while (i !== -1) { idxs.push(i); i = blob.indexOf(t, i + 1); }
  console.log('  "' + t + '": count=' + idxs.length + ' idxs=' + idxs.slice(0, 5).join(','));
});
