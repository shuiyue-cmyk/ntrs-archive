// Probe 2: find B4 wording, B1 second occurrence, exact B3/B9 lines
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = Array.isArray(j) ? j[0] : j;
const parts = [];
for (const t of (p.plotTasks || [])) {
  if (t.description) parts.push(t.description);
  for (const m of (t.promptGroup || [])) {
    if (typeof m.content === 'string') parts.push(m.content);
  }
}
parts.push(p.finalSystemDirective || '');
const blob = parts.join('\n===MSG-BOUNDARY===\n');

function countAll(hay, needle) { let c = 0, idx = -1; while ((idx = hay.indexOf(needle, idx + 1)) !== -1) c++; return c; }
function show(hay, needle, w = 120) {
  const c = countAll(hay, needle);
  let ctx = '(none)';
  if (c > 0) {
    const idx = hay.indexOf(needle);
    ctx = JSON.stringify(hay.slice(Math.max(0, idx - w), idx + needle.length + w));
  }
  console.log('\n[count=' + c + '] ' + needle);
  console.log('  ctx: ' + ctx);
}

// B4 candidates
show(blob, '上轮');
show(blob, 'progress_percent');
show(blob, '首轮基线');
show(blob, '忠诚型');

// B1 second occurrence?
show(blob, '本轮黄毛不出手');
show(blob, '快速通道');
show(blob, '仅一行');

// B3 exact full line
show(blob, '维持背景板 [目标名] / 无新增');

// B9 full lines
show(blob, 'output ONE tag: <userCalib>', 100);
show(blob, 'OUTPUT FORMAT (单标签', 60);
show(blob, '<userCalib>\n[不违', 200);

// where does 上轮% live? search for '上轮%' separately
show(blob, '上轮%');
show(blob, '上轮阶段');
