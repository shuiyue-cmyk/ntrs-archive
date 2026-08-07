const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('startsWith [ :', raw.trim().startsWith('['));
const j = JSON.parse(raw);
console.log('top type:', Array.isArray(j) ? 'array len ' + j.length : typeof j);
const p = j[0];
console.log('name:', p.name);
console.log('has plotTasks:', Array.isArray(p.plotTasks), 'len', p.plotTasks && p.plotTasks.length);
console.log('FSD type:', typeof p.finalSystemDirective, 'len', p.finalSystemDirective ? p.finalSystemDirective.length : 0);

// build blob of all text fields we will edit: promptGroup contents + descriptions + FSD
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
  '以 **{{user}} 本轮当前场景画面** 为唯一基准',
  '为唯一基准——',
  '刷新成功判定标准',
  'spawn=',
  'no_spawn**：本轮无黄毛在',
  '两种情形：',
  '公共空间',
  '私密空间',
];
for (const pr of probes) {
  const hits = [];
  texts.forEach(t => { const i = t.s.indexOf(pr); if (i >= 0) hits.push(t.where + '@' + i); });
  console.log('\nPROBE', JSON.stringify(pr), 'hits:', hits.length, hits.slice(0, 5).join(' | '));
}

// dump the S2 region fully to see exact formatting/indent
const t = texts.find(x => x.where.includes('promptGroup'));
console.log('\n--- full S2 region dump (from first 刷新状态两档 to 两种情形： x3) ---');
const start = t.s.indexOf('刷新状态两档');
const dump = t.s.slice(start - 200, start + 2600);
console.log(JSON.stringify(dump));
