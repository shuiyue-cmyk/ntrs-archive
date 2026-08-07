const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const texts = [];
for (const t of p.plotTasks || []) {
  texts.push({ where: `task[${t.id}].description`, s: t.description || '' });
  (t.promptGroup || []).forEach((m, i) => texts.push({ where: `task[${t.id}].promptGroup[${i}]`, s: m.content || '' }));
}
texts.push({ where: 'finalSystemDirective', s: p.finalSystemDirective || '' });
for (const t of texts) {
  let idx = -1;
  while ((idx = t.s.indexOf('快速通道', idx + 1)) !== -1) {
    console.log(`--- [${t.where}] @${idx}: ` + JSON.stringify(t.s.slice(Math.max(0, idx - 40), idx + 90)));
  }
}
console.log('\n== B3b exact sentence ==');
for (const t of texts) {
  const i = t.s.indexOf('会经 FSD 给花火');
  if (i !== -1) console.log(`[${t.where}] ` + JSON.stringify(t.s.slice(i - 60, i + 160)));
}
