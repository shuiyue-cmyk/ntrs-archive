const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const parts = [];
for (const t of p.plotTasks || []) {
  if (typeof t.description === 'string') parts.push(t.description);
  for (const m of t.promptGroup || []) if (m && typeof m.content === 'string') parts.push(m.content);
}
if (typeof p.finalSystemDirective === 'string') parts.push(p.finalSystemDirective);
const blob = parts.join('\n');
const scans = [
  '黄毛败·友好',
  '线闭合，黄毛不再行动判定',
  '刷新成功 = 接下来的场景中有出现的可能',
  '该对象线已闭合，不再推进判定',
  '锁定目标列表',
  '潜在黄毛[未锁定·背景板]',
  '调度指令，仅供下游',
  '察觉型 41% 起的目标',
  '浅度出场（身份+在场姿态',
  '在场/出场是否合理',
  'After <thugActionReason>',
  '紧接在 <thugActionReason>',
  '为同义调度行，与「锁定状态」一致',
  '黄毛表 progress_percent 为准',
  '{user}',
];
for (const q of scans) console.log('count=' + (blob.split(q).length - 1), '\t', JSON.stringify(q));
