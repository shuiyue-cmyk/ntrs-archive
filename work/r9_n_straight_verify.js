const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('starts with [: ' + raw.trimStart().startsWith('['));
const j = JSON.parse(raw);
console.log('JSON parse: OK, top-level is array: ' + Array.isArray(j));
const blob = JSON.stringify(j);

const olds = {
  'B1': `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
  'B2': `属 📹 事后知情或 🌙 完全不知的暗线戏`,
  'B3': `- 锁定指令：锁定 / 维持背景板`,
  'B4': `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
  'B5': `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）`,
  'B8': `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
  'B10': `thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
};
const news = {
  'B1': `；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**`,
  'B2': `（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  'B3': `（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  'B3b': `（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`,
  'B4': `以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  'B5': `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn）`,
  'B8': `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
  'B10': `（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`,
};

console.log('\n--- OLD residual scan ---');
for (const [k, o] of Object.entries(olds)) {
  const n = blob.split(o).length - 1;
  console.log(k + ' OLD residual: ' + n);
}
console.log('B3b OLD residual (会经 FSD 给花火·正文） alone): ' + (blob.split('（会经 FSD 给花火·正文）').length - 1));
console.log('\n--- NEW presence scan ---');
for (const [k, n] of Object.entries(news)) {
  const cnt = blob.split(n).length - 1;
  console.log(k + ' NEW present: ' + cnt);
}
