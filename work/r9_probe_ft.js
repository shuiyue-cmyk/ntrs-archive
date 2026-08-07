const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const raw = fs.readFileSync(path, 'utf8');

const candidates = {
  'B1': '- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
  'B2': '属 📹 事后知情或 🌙 完全不知的暗线戏',
  'B3': '- 锁定指令：锁定 / 维持背景板',
  'B3b_cond': '**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）**',
  'B4_cand1': '上轮阶段名+上轮% 从概览/前文/上轮 stage 读',
  'B4_cand2': '上轮% 从概览/前文/上轮 stage 读',
  'B4_probe': '从概览/前文',
  'B5': '判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）',
  'B8': 'locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"',
  'B10_a': '锁定状态=真正锁定',
  'B10_b': '锁定状态字段=真正锁定',
  'B10_probe': '真正锁定',
};

function countOcc(s, sub) {
  let n = 0, i = 0;
  while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; }
  return n;
}

for (const [k, cand] of Object.entries(candidates)) {
  const n = countOcc(raw, cand);
  console.log(`\n=== ${k} : ${n} hit(s) ===`);
  if (n > 0) {
    let i = raw.indexOf(cand);
    for (let h = 0; h < n && i !== -1; h++) {
      const start = Math.max(0, i - 40);
      const end = Math.min(raw.length, i + cand.length + 60);
      console.log(`--- hit#${h + 1} @${i} ---`);
      console.log(JSON.stringify(raw.slice(start, end)));
      i = raw.indexOf(cand, i + cand.length);
    }
  }
}
