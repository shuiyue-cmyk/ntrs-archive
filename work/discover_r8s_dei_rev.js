const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
const j = JSON.parse(raw);
console.log('TOP_LEVEL_ARRAY:', Array.isArray(j), '| startsWith [: ', raw.trim().startsWith('['));

// gather all target string fields
const fields = [];
const t0 = j[0];
for (const t of (t0.plotTasks || [])) {
  fields.push({ label: 'task:' + t.name, s: t.description || '', kind: 'description' });
  for (const m of (t.promptGroup || [])) {
    fields.push({ label: 'task:' + t.name + '.promptGroup[' + (m.role||'') + ']', s: m.content || '', kind: 'content' });
  }
}
fields.push({ label: 'finalSystemDirective', s: t0.finalSystemDirective || '', kind: 'fsd' });

function findWhere(sub, label) {
  const hits = [];
  fields.forEach((f, i) => { if (f.s.includes(sub)) hits.push(f.label); });
  return hits;
}

const anchors = [
  ['G1', '以 **{{user}} 本轮当前场景画面** 为唯一基准'],
  ['G2', '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**'],
  ['G3', '**spawn=本轮黄毛在 {{user}} 当前场景画面内在场'],
  ['G4', '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内'],
];

for (const [g, a] of anchors) {
  const locs = findWhere(a, g);
  console.log('\n== ' + g + ' anchor: ' + JSON.stringify(a));
  console.log('   locations: ' + (locs.length ? locs.join(' ; ') : 'NONE'));
  for (const loc of locs) {
    const f = fields.find(x => x.label === loc);
    const idx = f.s.indexOf(a);
    const seg = f.s.slice(Math.max(0, idx - 30), idx + 420);
    console.log('   RAW[' + loc + '] @' + idx + ':');
    console.log(JSON.stringify(seg));
  }
}
