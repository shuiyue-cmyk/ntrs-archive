const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('starts with [ :', raw.trim().startsWith('['));
let j;
try { j = JSON.parse(raw); console.log('JSON parse: OK'); }
catch (e) { console.log('JSON parse: FAIL', e.message); process.exit(1); }
console.log('top-level array:', Array.isArray(j), 'len=', j.length);
const p = j[0];
console.log('name:', p.name);

const blob = [];
if (typeof p.finalSystemDirective === 'string') blob.push(p.finalSystemDirective);
for (const t of p.plotTasks) {
  if (t.promptGroup) for (const m of t.promptGroup) if (typeof m.content === 'string') blob.push(m.content);
  if (typeof t.description === 'string') blob.push(t.description);
}
const all = blob.join('\n');

const olds = {
  B1: `（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）\n- stage / cast / plot`,
  B2: `属 📹 事后知情或 🌙 完全不知的暗线戏，`,
  B3: `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增\n`,
  B3b: `只给导演读，不进 FSD）；禁止标签外「理由：」行**\n`,
  B4: `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
  B5: `判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）`,
  B7a: `且锁定目标列表非空（至少一个目标已真正锁定）`,
  B7b: `且锁定目标列表为空（所有目标均仅背景板，即 {{user}}-所有目标均尚未亲密）`,
  B10: `不得主动追求/暧昧/单独接触任何目标。\n`,
};
console.log('\n=== OLD residual scan ===');
for (const [k, o] of Object.entries(olds)) {
  const c = all.split(o).length - 1;
  console.log(`${k}: ${c}`);
}
const news = {
  B1: `行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`,
  B2: `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  B3: `无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  B3b: `禁止标签外「理由：」行**（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`,
  B4: `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  B5: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`,
  B7a: `且锁定状态字段=真正锁定（至少一个目标已真正锁定）`,
  B7b: `且锁定状态字段=仅背景板（所有目标均未真正锁定）`,
  B10: `不得主动追求/暧昧/单独接触任何目标。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`,
};
console.log('\n=== NEW present scan ===');
for (const [k, n] of Object.entries(news)) {
  const c = all.split(n).length - 1;
  console.log(`${k}: ${c}`);
}
// {[db.*]} blocks untouched check
const db = (all.split('{[db.').length - 1);
console.log('\n{[db. blocks:', db);
