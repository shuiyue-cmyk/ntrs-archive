// Explore round 2: B4 上轮% source wording, B10 T2 gate exact bytes, B3b secondary
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];

const blobs = [];
function walk(o, label) {
  if (typeof o === 'string') blobs.push({ label, s: o });
  else if (Array.isArray(o)) o.forEach((v, i) => walk(v, label + '[' + i + ']'));
  else if (o && typeof o === 'object') Object.keys(o).forEach(k => walk(o[k], label + '.' + k));
}
p.plotTasks.forEach((t, i) => walk(t, 'plotTasks[' + i + ']'));
walk(p.finalSystemDirective, 'finalSystemDirective');
walk(p.promptGroup, 'topPromptGroup');

function show(tag, needle, w = 70) {
  let total = 0;
  const hits = [];
  for (const { label, s } of blobs) {
    let idx = -1, count = 0;
    const positions = [];
    while ((idx = s.indexOf(needle, idx + 1)) !== -1) { count++; positions.push(idx); }
    if (count) { total += count; hits.push({ label, count, positions: positions.slice(0, 6) }); }
  }
  console.log('=== ' + tag + ' | ' + JSON.stringify(needle) + ' | total=' + total);
  for (const h of hits) {
    const s = blobs.find(b => b.label === h.label).s;
    h.positions.forEach(pos => {
      console.log('  [' + h.label + '] x' + h.count + ' @' + pos);
      console.log('    BEFORE: ' + JSON.stringify(s.slice(Math.max(0, pos - w), pos)));
      console.log('    AFTER:  ' + JSON.stringify(s.slice(pos + needle.length, pos + needle.length + w)));
    });
  }
}

// B4: find all "上轮" occurrences to locate the % source statement
show('B4-all-上轮', '上轮');
// B4 alternative wordings
show('B4-x', '阶段名');
show('B4-y', '概览/前文');
show('B4-z', 'sparkNotes');
// B10: T2 gate second line ending
show('B10-line', '篇幅压缩为一行（身份+在场姿态）', 120);
// B3b secondary exact text
show('B3b-exact', '只放刷新状态+黄毛人设', 120);
// confirm 场景外 act line full (B2)
show('B2-full', '📹 事后知情或 🌙 完全不知的暗线戏', 100);
