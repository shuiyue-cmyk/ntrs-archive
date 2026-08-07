// Probe: find exact OLD strings in Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('starts with [:', raw.trim().startsWith('['));
const j = JSON.parse(raw);
console.log('top-level array:', Array.isArray(j));
const p = Array.isArray(j) ? j[0] : j;
console.log('plotTasks count:', (p.plotTasks || []).length);
const fsd = p.finalSystemDirective || '';
console.log('fsd length:', fsd.length);

// Build a blob of all relevant strings: promptGroup content + task description + FSD
const parts = [];
for (const t of (p.plotTasks || [])) {
  if (t.description) parts.push(t.description);
  for (const m of (t.promptGroup || [])) {
    if (typeof m.content === 'string') parts.push(m.content);
  }
}
parts.push(fsd);
const blob = parts.join('\n===MSG-BOUNDARY===\n');

const patterns = [
  // B1
  'prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」',
  // B2
  '属 📹 事后知情或 🌙 完全不知的暗线戏',
  // B3
  '锁定指令：锁定 [新增目标名]',
  '标签内只放刷新状态+黄毛人设（会经 FSD',
  // B4
  '上轮阶段名+上轮%',
  '上轮% 从概览',
  // B5
  '判断该黄毛本轮是否可行动',
  '判断该已有黄毛本轮是否可行动',
  // B7
  '锁定目标列表非空',
  '锁定目标列表为空',
  // B9
  'After <thugAction>',
  '紧接在 <thugAction> 之后',
  // B10
  '锁定状态=真正锁定',
  '真正锁定/仅背景板',
];

function countAll(hay, needle) {
  let c = 0, idx = -1;
  while ((idx = hay.indexOf(needle, idx + 1)) !== -1) c++;
  return c;
}

for (const pat of patterns) {
  const c = countAll(blob, pat);
  let ctx = '(none)';
  if (c > 0) {
    const idx = blob.indexOf(pat);
    ctx = JSON.stringify(blob.slice(Math.max(0, idx - 60), idx + pat.length + 60));
  }
  console.log('\n[count=' + c + '] ' + pat);
  console.log('  ctx: ' + ctx);
}

// find lines around prologue quick-channel occurrences (need indent) - search in raw for the B1 line start variants
for (const probe of ['  - prologue：仅一行', '   - prologue：仅一行', '    - prologue：仅一行', '- prologue：仅一行']) {
  const c = countAll(raw, probe);
  console.log('\n[raw indent probe count=' + c + '] ' + JSON.stringify(probe));
}

// B3 line indent probes
for (const probe of ['  - 锁定指令：锁定', '   - 锁定指令：锁定', '    - 锁定指令：锁定', '- 锁定指令：锁定']) {
  const c = countAll(raw, probe);
  console.log('[raw B3 indent probe count=' + c + '] ' + JSON.stringify(probe));
}

// B9 full-line probe
for (const probe of ['After <thugAction>, output ONE tag: <userCalib>', 'After <thugAction>, 输出 ONE tag: <userCalib>']) {
  const c = countAll(blob, probe);
  console.log('[B9 probe count=' + c + '] ' + JSON.stringify(probe));
}
