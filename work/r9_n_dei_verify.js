const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_4.7.json';
const raw = fs.readFileSync(PATH, 'utf8');
console.log('startsWith [:', raw.trim().startsWith('['));
try {
  const j = JSON.parse(raw);
  console.log('JSON.parse: OK, top array len:', j.length, 'plotTasks:', j[0].plotTasks.length);
} catch (e) {
  console.log('JSON.parse FAIL:', e.message);
}
const OLDS = [
  ['B1', '- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）'],
  ['B2', '属 📹 事后知情或 🌙 完全不知的暗线戏'],
  ['B3', '- 锁定指令：锁定 / 维持背景板'],
  ['B4', '· 上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读'],
  ['B5', '判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）'],
  ['B8', 'locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"'],
];
console.log('--- OLD residual (expect 0) ---');
for (const [t, o] of OLDS) console.log(t + ':', raw.split(o).length - 1);
const NEWS = [
  ['B1', '若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场'],
  ['B2', '📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知'],
  ['B3', '调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现'],
  ['B4', '以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型）'],
  ['B5', '判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn）'],
  ['B8', 'locked_target（即「锁定目标/锁定对象」列）命中'],
  ['B10', '（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）'],
];
console.log('--- NEW present (expect >=1) ---');
for (const [t, n] of NEWS) console.log(t + ':', raw.split(n).length - 1);
