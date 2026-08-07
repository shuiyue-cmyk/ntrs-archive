// Dump full object keys and nested structure
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(target, 'utf8'));
const p = Array.isArray(j) ? j[0] : j;
console.log('object keys:', Object.keys(p));
if (p.plotTasks) {
  console.log('plotTasks count:', p.plotTasks.length);
  p.plotTasks.forEach((t, i) => {
    console.log(`\n[task ${i}] id=${t.id} name=${JSON.stringify(t.name)} stage=${t.stage} order=${t.order}`);
    if (t.promptGroup) {
      t.promptGroup.forEach((m, mi) => {
        const c = m.content || '';
        console.log(`  [msg ${mi}] role=${m.role} len=${c.length} head=${JSON.stringify(c.slice(0, 80))}`);
      });
    }
  });
  console.log('\nfinalSystemDirective len:', (p.finalSystemDirective || '').length);
  console.log('FSD head:', JSON.stringify((p.finalSystemDirective || '').slice(0, 200)));
}
