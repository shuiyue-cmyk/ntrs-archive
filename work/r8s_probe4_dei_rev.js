const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = j[0];
const texts = [];
for (const t of p.plotTasks) {
  if (t.description) texts.push({ where: t.id + ' description', s: t.description });
  if (Array.isArray(t.promptGroup)) {
    t.promptGroup.forEach((m, i) => {
      if (m && typeof m.content === 'string') texts.push({ where: t.id + ' promptGroup[' + i + ']', s: m.content });
    });
  }
}
if (typeof p.finalSystemDirective === 'string') texts.push({ where: 'FSD', s: p.finalSystemDirective });

function dump(whereContains, sub, before, after) {
  const t = texts.find(x => x.where.includes(whereContains));
  if (!t) { console.log(whereContains, 'NOT FOUND'); return; }
  let i = t.s.indexOf(sub);
  if (i < 0) { console.log('SUB NOT FOUND in', t.where); return; }
  console.log('\n===== ' + whereContains + ' sub@' + i + ' =====');
  console.log(JSON.stringify(t.s.slice(Math.max(0, i - before), i + sub.length + after)));
}

dump('defaultPlotTask promptGroup[2]', '=no_spawn', 1200, 400);
dump('plotTaskThugTempo promptGroup[4]', '刷新成功判定标准', 100, 1500);
