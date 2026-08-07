const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const searchables = [];
for (const t of p.plotTasks) {
  for (const m of (t.promptGroup || [])) searchables.push({ task: t.id || t.name, content: m.content || '' });
  if (t.description) searchables.push({ task: t.id || t.name, content: t.description });
}
if (p.finalSystemDirective) searchables.push({ task: 'FSD', content: p.finalSystemDirective });

function showAll(needle, ctx = 200) {
  console.log('\n===== ' + needle + ' =====');
  let n = 0;
  for (const s of searchables) {
    let i = 0;
    while ((i = s.content.indexOf(needle, i)) >= 0) {
      n++;
      const a = Math.max(0, i - 150), b = Math.min(s.content.length, i + needle.length + ctx);
      console.log(`\n[${s.task}] hit#${n}:`);
      console.log(JSON.stringify(s.content.slice(a, b)));
      i += needle.length;
    }
  }
  if (n === 0) console.log('  (0 hits)');
}

// B1: possible second 快速通道 occurrence
showAll('跟随{{user}}输入的主线走');
showAll('快速通道');
// B5 exact long segment
showAll('判断该已有黄毛');
// B10 anchor: T2 判据 lines
showAll('锁定状态=仅背景板登场');
showAll('锁定状态=真正锁定');
