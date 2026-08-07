const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const parts = [];
for (const t of p.plotTasks || []) {
  if (typeof t.description === 'string') parts.push(t.description);
  for (const m of t.promptGroup || []) if (m && typeof m.content === 'string') parts.push(m.content);
}
if (typeof p.finalSystemDirective === 'string') parts.push(p.finalSystemDirective);
const blob = parts.join('\n');

const checks = [
  ['B1  OLD残', '行文不少于 15 字）'],
  ['B1  NEW在', '浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）'],
  ['B2  OLD残', '暗线戏）'],
  ['B2  NEW在', '察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知'],
  ['B3-1 OLD残', '无新增\n</thugSpawn>'],
  ['B3-1 NEW在', '调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现'],
  ['B3-2 OLD残', '黄毛人设（会经 FSD 给花火·正文）；'],
  ['B3-2 NEW在', '下游调度字段，正文 AI 忽略即可，人设字段才用于正文'],
  ['B4  OLD残', '从概览/前文/上轮 stage 读'],
  ['B4  NEW在', '以 黄毛表 progress_percent 为准；无表行则首轮基线 0%/忠诚型，概览/前文仅作校验'],
  ['B5  OLD残', '判断该黄毛本轮是否可行动'],
  ['B5  NEW在', '判断该黄毛本轮在场/出场是否合理'],
  ['B7-1 OLD残', '锁定目标列表非空'],
  ['B7-1 NEW在(既有)', '锁定状态=真正锁定 → 黄毛作为本轮正式登场角色'],
  ['B7-2 OLD残', '锁定目标列表为空'],
  ['B7-2 NEW在(既有)', '锁定状态=仅背景板登场（{{user}}-目标尚未亲密）'],
  ['B9-1 OLD残', 'After <thugAction>, output ONE tag'],
  ['B9-1 NEW在', 'After <thugActionReason>, output ONE tag'],
  ['B9-2 OLD残', '紧接在 <thugAction> 之后'],
  ['B9-2 NEW在', '紧接在 <thugActionReason> 之后'],
  ['B10 OLD残', '标注"第三者·[五型]"）。\n'],
  ['B10 NEW在', '为同义调度行，与「锁定状态」一致'],
];
console.log('top-level array:', Array.isArray(j), '| starts-with-[ :', raw.trim().startsWith('['));
console.log('name:', p.name);
let bad = 0;
for (const [label, q] of checks) {
  const c = blob.split(q).length - 1;
  const ok = (label.endsWith('OLD残') && c === 0) || (label.endsWith('NEW在') && c >= 1) || (label.endsWith('(既有)') && c >= 1);
  if (!ok) bad++;
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + label + ' count=' + c);
}
console.log(bad === 0 ? 'ALL CHECKS PASS' : bad + ' CHECKS FAILED');
