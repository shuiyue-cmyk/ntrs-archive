// Verify R9 fix result
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
let j;
try { j = JSON.parse(raw); console.log('JSON.parse: OK'); } catch (e) { console.log('JSON.parse: FAIL', e.message); process.exit(1); }
console.log('top-level array:', Array.isArray(j), '| raw starts [:', raw.trimStart().startsWith('['));

const p = j[0];
const searchables = [];
for (const t of p.plotTasks || []) {
  for (const m of (t.promptGroup || [])) searchables.push(m.content || '');
  if (t.description) searchables.push(t.description);
}
if (p.finalSystemDirective) searchables.push(p.finalSystemDirective);
const blob = searchables.join('\n---\n');

const olds = {
  B1: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
  B2: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
  B3: `- 锁定指令：锁定 / 维持背景板`,
  B3b: `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）；`,
  B4: `· 上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
  B5: `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
  B8: `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
  B10: `只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触目标。`,
};
const news = {
  B1: `行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`,
  B2: `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  B3: `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  B3b: `（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`,
  B4: `以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  B5: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`,
  B8: `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
  B10: `（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`,
};

console.log('\n--- residual OLD scan (should be 0) ---');
for (const [k, v] of Object.entries(olds)) {
  const c = blob.split(v).length - 1;
  console.log(`${k}: OLD residual=${c} ${c === 0 ? 'OK' : 'FAIL'}`);
}
console.log('\n--- NEW presence scan (should be >=1) ---');
for (const [k, v] of Object.entries(news)) {
  const c = blob.split(v).length - 1;
  console.log(`${k}: NEW count=${c} ${c >= 1 ? 'OK' : 'FAIL'}`);
}
// residual keywords per spec
console.log('\n--- spec residual keywords ---');
for (const kw of ['黄毛败·友好', '线已闭合，黄毛不再行动判定', '锁定目标列表非空', '刷新成功 = 接下来的场景中有出现的可能']) {
  console.log(`${kw}: ${raw.split(kw).length - 1}`);
}
// single-brace user check
console.log('\n{user} single-brace count:', raw.split('{user}').length - 1, '| {{user}} count:', raw.split('{{user}}').length - 1);
