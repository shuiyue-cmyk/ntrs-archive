const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('=== raw head 40 ===');
console.log(JSON.stringify(raw.slice(0, 40)));
console.log('=== starts with [ ?', raw.trimStart().startsWith('['));
const j = JSON.parse(raw);
console.log('top-level isArray:', Array.isArray(j), 'len:', j.length);
const p = j[0];
console.log('p keys:', Object.keys(p));
console.log('p.name:', p.name);
console.log('finalSystemDirective len:', (p.finalSystemDirective || '').length);
console.log('plotTasks count:', (p.plotTasks || []).length);
for (const t of (p.plotTasks || [])) {
  console.log('--- task', t.id, '|', t.name, '| promptGroup msgs:', (t.promptGroup || []).length, '| desc len:', (t.description || '').length);
  for (let i = 0; i < (t.promptGroup || []).length; i++) {
    const c = t.promptGroup[i].content || '';
    const hit = [];
    if (c.includes('为唯一基准')) hit.push('G1start');
    if (c.includes('与 spawn 判定无关')) hit.push('G1end');
    if (c.includes('刷新成功判定标准')) hit.push('G2');
    if (c.includes('本轮无黄毛在')) hit.push('G4');
    if (c.includes('spawn=')) hit.push('spawn=...');
    if (hit.length) console.log('   msg', i, 'role:', t.promptGroup[i].role, 'len:', c.length, '->', hit.join(','));
  }
}
const fsd = p.finalSystemDirective || '';
for (const probe of ['为唯一基准', '与 spawn 判定无关', '刷新成功判定标准', '本轮无黄毛在', 'spawn=']) {
  console.log('FSD contains', probe, ':', fsd.includes(probe));
}
const descProbe = (p.plotTasks || []).map(t => t.description || '').join('\n');
for (const probe of ['为唯一基准', '与 spawn 判定无关', '刷新成功判定标准', '本轮无黄毛在', 'spawn=']) {
  console.log('DESC contains', probe, ':', descProbe.includes(probe));
}
