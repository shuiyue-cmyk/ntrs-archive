const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const contents = [];
for (const t of j[0].plotTasks || []) {
  if (typeof t.description === 'string') contents.push(t.description);
  for (const m of t.promptGroup || []) if (typeof m.content === 'string') contents.push(m.content);
}
if (typeof j[0].finalSystemDirective === 'string') contents.push(j[0].finalSystemDirective);
const blob = contents.join('\n');

const checks = [
  // full final strings (byte-accurate, real quotes in parsed strings)
  ['B1 final', `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`],
  ['B2 final', `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`],
  ['B3 final', `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`],
  ['B3b final', `（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`],
  ['B4 final', `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`],
  ['B5 final', `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn）`],
  ['B8 final', `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`],
  ['B10 final', `thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`],
  // OLD residuals that are NOT prefix-substrings of their NEW (must be 0)
  ['B4 OLD residual', `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读`],
  ['B5 OLD residual', `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）`],
  ['B8 OLD residual', `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`],
  ['B10 OLD residual', `thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`],
];
for (const [label, s] of checks) {
  const n = blob.split(s).length - 1;
  console.log(label + ': ' + n);
}

// B2/B3 OLD-as-prefix: verify no bare OLD without the NEW suffix remains
const b2bare = blob.split(`属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型`).length - 1;
const b3bare = blob.split(`- 锁定指令：锁定 / 维持背景板（调度指令`).length - 1;
console.log('B2 bare OLD without suffix: ' + (blob.split(`属 📹 事后知情或 🌙 完全不知的暗线戏`).length - 1 - 1)); // -1 for the one inside NEW
console.log('B3 bare OLD without suffix: ' + (blob.split(`- 锁定指令：锁定 / 维持背景板`).length - 1 - 1));
console.log('B2 new suffix count: ' + b2bare);
console.log('B3 new suffix count: ' + b3bare);

// residual scan: key phrases per spec verification requirements
const residuals = ['黄毛败·友好', '线闭合，黄毛不再行动判定', '锁定目标列表非空', '该对象线已闭合，不再推进判定'];
for (const r of residuals) console.log('residual [' + r + ']: ' + (blob.split(r).length - 1));
