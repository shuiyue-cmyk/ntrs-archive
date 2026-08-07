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

function dumpAround(label, whereContains, sub) {
  const t = texts.find(x => x.where.includes(whereContains));
  if (!t) { console.log(label, 'NOT FOUND in', whereContains); return; }
  let i = t.s.indexOf(sub);
  if (i < 0) { console.log(label, 'SUB NOT FOUND in', t.where); return; }
  const slice = t.s.slice(Math.max(0, i - 400), i + sub.length + 900);
  console.log('\n===== ' + label + ' @ ' + t.where + '@' + i + ' =====');
  console.log(JSON.stringify(slice));
}

// G1 region: 为唯一基准 sentence
dumpAround('G1 REGION', 'plotTaskThugTempo promptGroup[4]', '为唯一基准');
// G2 region
dumpAround('G2 REGION', 'plotTaskThugTempo promptGroup[4]', '刷新成功判定标准');
// G4 region
dumpAround('G4 REGION', 'plotTaskThugTempo promptGroup[4]', '本轮无黄毛在');
// G3 region in defaultPlotTask
dumpAround('G3 REGION', 'defaultPlotTask promptGroup[0]', 'spawn=');
