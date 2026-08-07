const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const ok = (() => { try { JSON.parse(raw); return true; } catch (e) { console.log('PARSE ERROR:', e.message); return false; } })();
console.log('JSON parse OK:', ok);
console.log('top-level array (starts [):', raw.trimStart().startsWith('['));
const j = JSON.parse(raw);
console.log('plotTasks:', j[0].plotTasks.length, '| name:', j[0].name);
const blob = JSON.stringify(j);

const OLD = {
  B1: `跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
  B2: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
  B3a: `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增`,
  B3b: `标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）`,
  B4: `（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
  B5: `判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
  B7a: `锁定目标列表非空`,
  B7b: `锁定目标列表为空`,
  B9a: `After <thugAction>, output ONE tag`,
  B9b: `紧接在 <thugAction> 之后`,
  B10: `违反 = 输出失败）：`,
};
console.log('\n--- residual OLD (should all be 0) ---');
let residual = 0;
for (const [k, v] of Object.entries(OLD)) {
  const c = blob.split(v).length - 1;
  if (c > 0) residual++;
  console.log(`${k}: ${c}`);
}

const NEW = {
  B1: `若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场`,
  B2: `📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知`,
  B3a: `（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  B3b: `刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文`,
  B4: `以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  B5: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`,
  B7a: `锁定状态字段=真正锁定`,
  B7b: `锁定状态字段=仅背景板（所有目标均未真正锁定）`,
  B9a: `After <thugActionReason>, output ONE tag`,
  B9b: `紧接在 <thugActionReason> 之后`,
  B10: `thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致`,
};
console.log('\n--- NEW present (should be >=1) ---');
let missing = 0;
for (const [k, v] of Object.entries(NEW)) {
  const c = blob.split(v).length - 1;
  if (c < 1) missing++;
  console.log(`${k}: ${c}`);
}
console.log(`\nresidual>0: ${residual}, missing NEW: ${missing}`);
// spec residual scan
const specResid = {
  '锁定目标列表非空': blob.split('锁定目标列表非空').length - 1,
  '锁定目标列表为空': blob.split('锁定目标列表为空').length - 1,
  '锁定指令：锁定 [新增目标名] / 锁定 [目标A': blob.split('锁定指令：锁定 [新增目标名] / 锁定 [目标A').length - 1,
};
console.log('spec residual:', JSON.stringify(specResid));
