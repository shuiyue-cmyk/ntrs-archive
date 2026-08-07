// r8s diagnostic: locate G1-G4 OLD anchors in the parsed content fields
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('raw startsWith [:', raw.trim().startsWith('['));
const j = JSON.parse(raw);
console.log('top-level array:', Array.isArray(j));
const p = j[0];
console.log('name:', p.name);

const chunks = [];
for (const t of p.plotTasks || []) {
  for (let i = 0; i < (t.promptGroup || []).length; i++) {
    chunks.push({ where: `${t.id}.promptGroup[${i}]`, s: t.promptGroup[i].content || '' });
  }
  chunks.push({ where: `${t.id}.description`, s: t.description || '' });
}
chunks.push({ where: 'finalSystemDirective', s: p.finalSystemDirective || '' });

// helper: show occurrences of a needle with surrounding context
function scan(label, needle, ctx = 40) {
  let total = 0;
  for (const c of chunks) {
    let idx = c.s.indexOf(needle);
    if (idx === -1) continue;
    total++;
    console.log(`\n### ${label} HIT in ${c.where} (len ${c.s.length}) at ${idx}`);
    console.log('...' + JSON.stringify(c.s.slice(Math.max(0, idx - ctx), idx + needle.length + 60)) + '...');
  }
  if (total === 0) console.log(`\n### ${label}: NO HIT`);
  else console.log(`### ${label}: ${total} chunk(s) hit`);
}

scan('G1-anchor', '以 **{{user}} 本轮当前场景画面** 为唯一基准');
scan('G1-tail', '与 spawn 判定无关。');
scan('G2-anchor', '**刷新成功判定标准 = 本轮黄毛能否进入');
scan('G2-tail', '不空刷新**');
scan('G3-anchor', 'spawn=本轮黄毛在');
scan('G3-ish', '**spawn=');
scan('G4-anchor', '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪');
scan('G4-tail', '）。两种情形：');
