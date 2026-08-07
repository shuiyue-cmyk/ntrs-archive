const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const blob = JSON.stringify(JSON.parse(raw));
const keys = [
  '会经 FSD',
  '只放刷新状态+黄毛人设',
  '刷新状态：spawn',
  '锁定指令：锁定 / 维持背景板',
  '锁定状态=真正锁定',
  '第三者·[五型]',
  '上轮阶段名 + 上轮%',
  '从概览/前文/上轮 stage 读',
  '仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」',
  '属 📹 事后知情或 🌙 完全不知的暗线戏',
  '判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）',
  'locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"',
  'thugSpawn 状态=spawn 且锁定状态=真正锁定',
];
for (const k of keys) {
  let i = 0, idx;
  const hits = [];
  while ((idx = blob.indexOf(k, i)) !== -1) { hits.push(idx); i = idx + 1; }
  console.log('=== ' + k + ' === -> ' + hits.length + ' hit(s)');
  for (const h of hits.slice(0, 4)) {
    console.log('  @' + h + ': ' + JSON.stringify(blob.slice(Math.max(0, h - 50), h + 200)));
  }
  console.log();
}
