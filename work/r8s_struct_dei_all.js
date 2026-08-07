// Inspect structure of target: top-level keys, plotTasks fields, finalSystemDirective
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
console.log('top-level array:', Array.isArray(j), 'len:', j.length);
console.log('j[0] keys:', Object.keys(j[0]).join(', '));
console.log('has plotTasks:', Array.isArray(j[0].plotTasks), 'len:', j[0].plotTasks ? j[0].plotTasks.length : 0);
for (const t of (j[0].plotTasks || [])) {
  console.log('task:', t.id, '| name:', t.name, '| promptGroup msgs:', (t.promptGroup || []).length, '| description:', JSON.stringify(t.description || '').slice(0, 120));
}
const fsd = j[0].finalSystemDirective || '';
console.log('finalSystemDirective len:', fsd.length, 'head:', JSON.stringify(fsd.slice(0, 80)));
