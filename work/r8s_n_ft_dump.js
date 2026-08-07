const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const t = j[0].plotTasks.find(x => x.id === 'plotTaskThugTempo');
const c = t.promptGroup[4].content;

// find G1 span: from 为唯一基准 to 与 spawn 判定无关。
const g1Start = c.indexOf('为唯一基准');
console.log('=== G1 region ===');
console.log(JSON.stringify(c.slice(g1Start - 60, g1Start + 800)));
console.log('=== end of G1 sentence ===');
const g1End = c.indexOf('与 spawn 判定无关');
console.log(JSON.stringify(c.slice(g1End - 120, g1End + 40)));

// G2 span
const g2Start = c.indexOf('刷新成功判定标准');
console.log('=== G2 region ===');
console.log(JSON.stringify(c.slice(g2Start - 40, g2Start + 330)));

// G4 span
const g4Start = c.indexOf('- **no_spawn**');
console.log('=== G4 region ===');
console.log(JSON.stringify(c.slice(g4Start, g4Start + 220)));

// any 'spawn=' occurrences in msg4?
const idxs = [];
let i = -1;
while ((i = c.indexOf('spawn=', i + 1)) !== -1) idxs.push(i);
console.log('=== spawn= idxs in msg4:', idxs, '===');
for (const ix of idxs) console.log(JSON.stringify(c.slice(ix - 50, ix + 80)));

// second G4-like hit: defaultPlotTask msg0
const t2 = j[0].plotTasks.find(x => x.id === 'defaultPlotTask');
const c0 = t2.promptGroup[0].content;
console.log('=== defaultPlotTask msg0 本轮无黄毛在 ctx ===');
const ix0 = c0.indexOf('本轮无黄毛在');
console.log(JSON.stringify(c0.slice(ix0 - 60, ix0 + 60)));
