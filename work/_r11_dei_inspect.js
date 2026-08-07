const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const pt = p.plotTasks;
console.log('plotTasks count:', pt.length);
pt.forEach((t, ti) => {
  console.log(`\n===== TASK ${ti}: id=${t.id} name=${t.name} enabled=${t.enabled} stage=${t.stage} order=${t.order} extractTags=${t.extractTags} extractInjectTags=${t.extractInjectTags} minLength=${t.minLength}`);
  if (t.agentControl) console.log('  agentControl.dependsOnTaskIds:', JSON.stringify(t.agentControl.dependsOnTaskIds));
  const pg = t.promptGroup || [];
  pg.forEach((m, i) => {
    const c = m.content || '';
    console.log(`  [${i}] role=${m.role} len=${c.length} head=${JSON.stringify(c.slice(0, 30))}`);
  });
});
