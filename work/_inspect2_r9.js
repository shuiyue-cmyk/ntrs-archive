const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const texts = [];
for (const t of p.plotTasks || []) {
  texts.push({ where: `task[${t.id}].description`, s: t.description || '' });
  (t.promptGroup || []).forEach((m, i) => texts.push({ where: `task[${t.id}].promptGroup[${i}]`, s: m.content || '' }));
}
texts.push({ where: 'finalSystemDirective', s: p.finalSystemDirective || '' });

function showAll(tag, pat) {
  console.log(`\n===== ${tag}: ${JSON.stringify(pat)} =====`);
  let total = 0;
  for (const t of texts) {
    let idx = -1;
    while ((idx = t.s.indexOf(pat, idx + 1)) !== -1) {
      total++;
      console.log(`--- [${t.where}] hit#${total} at ${idx}`);
      console.log('    ' + JSON.stringify(t.s.slice(Math.max(0, idx - 150), idx + pat.length + 60)));
    }
  }
  console.log(`TOTAL ${total}`);
}

showAll('B1', '- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」');
showAll('B1_3sp', '   - prologue：仅一行');
showAll('B3', '- 锁定指令：锁定 / 维持背景板');
showAll('B3_3sp', '   - 锁定指令');
showAll('B3b_spec', '<thugSpawn> 标签内只放刷新状态+黄毛人设');
showAll('B3b_any', '标签内只放刷新状态');
showAll('B4_any', '上轮%');
showAll('B5', '判断该已有黄毛本轮是否可行动');
showAll('B8', 'locked_target 命中本轮登场名单里某💔敏感角色名');
showAll('B10_t2', '锁定状态');
showAll('B10_probe', '仅背景板');
