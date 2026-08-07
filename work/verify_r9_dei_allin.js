const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const ok = {
  json: true,
  topArray: Array.isArray(j),
  startsWithBracket: raw.trim().startsWith('['),
};

const blob = JSON.stringify(j);
const olds = [
  '- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
  '属 📹 事后知情或 🌙 完全不知的暗线戏）',
  '- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增\n',
  '判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn；',
  '锁定目标列表非空',
  '锁定目标列表为空',
  '上轮%：（从概览/前文/上轮 stage 读',
  '（会经 FSD 给花火·正文）；',
];
const news = [
  '若本轮 spawn 且该黄毛所有目标均未锁定（背景板）',
  '📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知',
  '（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）',
  '刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文',
  '以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型）',
  '判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn',
  '锁定状态字段=真正锁定',
  '锁定状态字段=仅背景板',
  'thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致',
];
console.log('json ok:', ok.json, '| top array:', ok.topArray, '| starts with [:', ok.startsWithBracket);
console.log('\n-- residual OLD scan (should all be 0) --');
for (const o of olds) console.log('  ', (blob.split(o).length - 1), JSON.stringify(o.slice(0, 30)));
console.log('\n-- NEW presence (should be >=1) --');
for (const n of news) console.log('  ', (blob.split(n).length - 1), JSON.stringify(n.slice(0, 30)));
