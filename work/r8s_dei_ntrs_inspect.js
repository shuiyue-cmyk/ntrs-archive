// Inspect: locate G1-G4 OLD candidates in Cirno_BATTLE_Turn_DEI_NTRS.json (parsed level)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('raw starts with [:', raw.trimStart().startsWith('['));
const j = JSON.parse(raw);
console.log('top-level isArray:', Array.isArray(j), 'len:', j.length);
console.log('j[0] keys:', Object.keys(j[0]).join(', '));

// anchors
const anchors = {
  G1: ['以 **{{user}} 本轮当前场景画面** 为唯一基准', '与 spawn 判定无关。'],
  G2: ['**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**', '→ 判 no_spawn，不空刷新**'],
  G3: ['**spawn=本轮黄毛在 {{user}} 当前场景画面内在场', '=no_spawn**'],
  G4: ['- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内', '两种情形：'],
};

function scanStr(label, s) {
  if (typeof s !== 'string') return;
  for (const [g, [aStart, aEnd]] of Object.entries(anchors)) {
    let from = 0;
    while (true) {
      const i = s.indexOf(aStart, from);
      if (i === -1) break;
      // extract from aStart to nearest aEnd after i
      const jEnd = s.indexOf(aEnd, i);
      if (jEnd !== -1) {
        const seg = s.slice(i, jEnd + aEnd.length);
        console.log(`\n=== ${label} | ${g} | idx=${i} len=${seg.length}`);
        console.log('--- SEG (JSON-escaped) ---');
        console.log(JSON.stringify(seg));
      } else {
        console.log(`\n=== ${label} | ${g} | idx=${i} (NO aEnd found) tail:`);
        console.log(JSON.stringify(s.slice(i, i + 120)));
      }
      from = i + 1;
    }
  }
}

const pt = j[0].plotTasks;
console.log('\nplotTasks len:', Array.isArray(pt) ? pt.length : typeof pt);
if (Array.isArray(pt)) {
  pt.forEach((t, ti) => {
    if (t && typeof t === 'object') {
      console.log(`\n### plotTasks[${ti}] keys: ${Object.keys(t).join(', ')}`);
      if (typeof t.description === 'string') scanStr(`plotTasks[${ti}].description`, t.description);
      const pg = t.promptGroup;
      if (Array.isArray(pg)) {
        pg.forEach((p, pi) => {
          if (p && typeof p === 'object') {
            const keys = Object.keys(p);
            console.log(`    promptGroup[${pi}] keys: ${keys.join(', ')}`);
            if (typeof p.content === 'string') scanStr(`plotTasks[${ti}].promptGroup[${pi}].content`, p.content);
          }
        });
      }
    }
  });
}
if (typeof j[0].finalSystemDirective === 'string') scanStr('finalSystemDirective', j[0].finalSystemDirective);
