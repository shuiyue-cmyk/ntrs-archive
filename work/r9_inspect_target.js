const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('=== raw head ===');
console.log(JSON.stringify(raw.slice(0, 120)));
console.log('starts with [ :', raw.trimStart().startsWith('['));
const j = JSON.parse(raw);
console.log('top-level is array:', Array.isArray(j));
const p = j[0];
console.log('name:', p.name);
console.log('keys:', Object.keys(p));
console.log('plotTasks count:', p.plotTasks ? p.plotTasks.length : 'none');
if (p.plotTasks) {
  for (const t of p.plotTasks) {
    console.log('--- task', t.id, '|', t.name, '| stage', t.stage, '| order', t.order, '| extractTags:', t.extractTags, '| dependsOn:', (t.agentControl && t.agentControl.dependsOnTaskIds) || 'none');
    if (t.description) console.log('   description:', JSON.stringify(t.description.slice(0, 200)));
  }
}
console.log('FSD length:', p.finalSystemDirective ? p.finalSystemDirective.length : 'none');
console.log('FSD head:', p.finalSystemDirective ? JSON.stringify(p.finalSystemDirective.slice(0, 300)) : '');

// grep patterns
const pats = {
  'B1_quicklane': '所有目标均 no-act',
  'B1_prologue_line': '跟随{{user}}输入的主线走，本轮黄毛不出手',
  'B2_darkline': '属 📹 事后知情或 🌙 完全不知的暗线戏',
  'B3_lockcmd': '锁定指令：锁定 [新增目标名]',
  'B3_spawn_tag_annot': '只放刷新状态+黄毛人设',
  'B4_pct_source': '上轮%',
  'B5_actionable': '判断该黄毛本轮是否可行动',
  'B7_nonempty': '锁定目标列表非空',
  'B7_empty': '锁定目标列表为空',
  'B9_userCalib': 'output ONE tag: <userCalib>',
  'B9_after_thugAction': '紧接在 <thugAction> 之后',
  'B10_lockstate': '锁定状态',
};
const blob = JSON.stringify(j);
for (const [k, v] of Object.entries(pats)) {
  const c = blob.split(v).length - 1;
  console.log('PAT', k, ':', c);
}
