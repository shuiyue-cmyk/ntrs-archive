const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
const j = JSON.parse(raw);
const t0 = j[0];

const fields = [];
for (const t of (t0.plotTasks || [])) {
  const tname = t.name || '?';
  if (t.description) fields.push({ label: `task:${tname}.description`, s: t.description });
  (t.promptGroup || []).forEach((m, i) => {
    fields.push({ label: `task:${tname}.promptGroup[${i}](${m.role})`, s: m.content || '' });
  });
}
if (t0.finalSystemDirective) fields.push({ label: 'finalSystemDirective', s: t0.finalSystemDirective });

function findWhere(sub) {
  return fields.filter(f => f.s.includes(sub)).map(f => f.label);
}
function dump(sub, before, after) {
  const out = [];
  for (const f of fields) {
    const idx = f.s.indexOf(sub);
    if (idx >= 0) {
      out.push(`--- ${f.label} @${idx} ---\n` + JSON.stringify(f.s.slice(Math.max(0, idx - before), idx + sub.length + after)));
    }
  }
  return out;
}

const anchors = [
  ['G1', '以 **{{user}} 本轮当前场景画面** 为唯一基准'],
  ['G2', '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**'],
  ['G3', '**spawn=本轮黄毛在'],
  ['G4', '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内'],
];
for (const [g, a] of anchors) {
  console.log(`\n== ${g} anchor ${JSON.stringify(a)}`);
  console.log('   locations: ' + (findWhere(a).join(' ; ') || 'NONE'));
}

console.log('\n===== G3 region (spawn=) =====');
for (const d of dump('**spawn=', 40, 500)) console.log(d);
console.log('\n===== G1 region =====');
for (const d of dump('以 **{{user}} 本轮当前场景画面** 为唯一基准', 10, 700)) console.log(d);
