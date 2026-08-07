const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = j[0];
const texts = [];
if (Array.isArray(p.plotTasks)) {
  for (const t of p.plotTasks) {
    if (t && typeof t === 'object') {
      if (t.description) texts.push({ where: t.id + ' description', s: t.description });
      if (Array.isArray(t.promptGroup)) {
        t.promptGroup.forEach((m, i) => {
          if (m && typeof m.content === 'string') texts.push({ where: t.id + ' promptGroup[' + i + ']', s: m.content });
        });
      }
    }
  }
}
if (typeof p.finalSystemDirective === 'string') texts.push({ where: 'FSD', s: p.finalSystemDirective });

const probes = [
  '内在场',
  '=no_spawn',
  '或本轮新刷新进入画面',
  '黄毛不在 {{user}} 当前场景画面内（含',
  '当前场景画面内在场',
  'spawn=本轮',
  '本轮黄毛在 {{user}}',
  '刷新状态',
  '出场可能性判定',
  'no_spawn 快速通道',
  '判定其在 {{user}} 当前场景画面内合理',
];
for (const pr of probes) {
  const hits = [];
  texts.forEach(t => {
    let i = t.s.indexOf(pr);
    while (i >= 0) { hits.push(t.where + '@' + i); i = t.s.indexOf(pr, i + 1); }
  });
  console.log('\nPROBE', JSON.stringify(pr), 'hits:', hits.length);
  hits.forEach(h => console.log('   ', h));
}
