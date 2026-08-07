const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const searchables = [];
for (const t of p.plotTasks) {
  for (const m of (t.promptGroup || [])) searchables.push({ task: t.id || t.name, idx: m.index ?? '?', content: m.content || '' });
  if (t.description) searchables.push({ task: t.id || t.name, idx: 'desc', content: t.description });
}
if (p.finalSystemDirective) searchables.push({ task: 'FSD', idx: '-', content: p.finalSystemDirective });

function show(needle, ctx = 60) {
  console.log('\n===== ' + needle + ' =====');
  let n = 0;
  for (const s of searchables) {
    let i = 0;
    while ((i = s.content.indexOf(needle, i)) >= 0) {
      n++;
      const a = Math.max(0, i - ctx), b = Math.min(s.content.length, i + needle.length + ctx);
      console.log(`[${s.task} #${s.idx}] hit#${n}:`);
      console.log('  ...' + JSON.stringify(s.content.slice(a, b)) + '...');
      i += needle.length;
    }
  }
  if (n === 0) console.log('  (0 hits)');
}

show('上轮%');
show('是否可行动');
show('锁定状态');
show('登场名单');
